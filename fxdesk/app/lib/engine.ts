/**
 * engine.ts - one scan of the market, start to finish. No storage, no
 * secrets, no platform APIs in here: it takes candles and the saved
 * signals, and returns the new state plus the messages to send. That keeps
 * it testable on a laptop and identical wherever it is hosted.
 *
 * The trading rules are NOT in this file. They are imported from the same
 * core the backtest ran (fxdesk/core), so what was tested is what alerts.
 */
import { type Bars, makeBars, emptyBars } from "../../core/bars.ts";
import { frames, type Universe, type PairData } from "../../core/model.ts";
import { generateSweep, SWEEP_FVG } from "../../core/models/sweepFvg.ts";
import { prep, prevDay, candleBiasDetail, sessionHL, P } from "../../core/models/common.ts";
import { simulate, DEFAULT_RAILS, type Order } from "../../core/sim.ts";
import { STANDARD } from "../../core/costs.ts";
import { pipSize, pipValuePerLot, lotsForRisk, roundPrice } from "../../core/pairs.ts";
import { ukLabel, ukHM, nyClock, marketOpen, tradingDay } from "../../core/time.ts";

export const PAIRS = ["EURUSD", "GBPUSD", "AUDUSD", "USDJPY"] as const;
/** The configuration shown live, and the stricter one used to grade a setup (fxdesk/research/RESULTS.md). */
export const LIVE_CONFIG = "A2", GRADE_CONFIG = "A4";
const WINDOW_DAYS = 12, FRESH_SEC = 25 * 60, KEEP = 400;
/** The live feed quotes a mid price; the rules were calibrated on bid. Half a typical spread, in pips. */
const MID_TO_BID_PIPS = 0.3;

export type Status = "pending" | "open" | "won" | "lost" | "flat" | "expired" | "withdrawn" | "blocked";
export interface SignalRec {
  id: string; pair: string; dir: 1 | -1; entry: number; stop: number; tp: number;
  signalTime: number; expireAt: number; flatAt: number; riskPips: number; rewardPips: number;
  grade: "A" | "B"; reasons: string[]; order: Order;
  lots: number; riskMoney: number;
  status: Status; statusNote: string; fillTime?: number; exitTime?: number; exitPrice?: number; r?: number;
  /** which notifications have gone out for this ticket: the ticket itself, "entry traded", the close-by reminder, the ending */
  alerted: { fresh?: boolean; fill?: boolean; flat?: boolean; done?: boolean };
  /** found when the app first started, never alerted: history only */
  backfilled?: boolean;
  /** the owner's own record of what he did */
  mine?: { took: boolean; note?: string; at: number };
}
export interface WatchRow {
  pair: string; price: number; time: number; bias: number; biasWhy: string;
  levels: Array<{ name: string; price: number; pips: number; taken: boolean }>;
  note: string;
}
/**
 * One thing to tell the owner. `text` is the Telegram version (HTML); `title`
 * and `body` are the plain-text notification. `kind` says which event of the
 * ticket this is (each event is its own notification on the phone, none
 * replaces another); `until` is the moment after which it is no longer worth
 * delivering.
 */
export type MsgKind = "new" | "late" | "fill" | "close" | "done";
export interface Msg { text: string; id?: string; title: string; body: string; kind: MsgKind; until: number }
export interface ScanResult { signals: SignalRec[]; watch: WatchRow[]; messages: Msg[]; lastBar: number; session: string }

/** Twelve Data time_series -> closed M15 bid candles, oldest first. */
export async function fetchM15(pair: string, apiKey: string, now: number, outputsize = 3500, timeoutMs = 7000): Promise<Bars> {
  const sym = `${pair.slice(0, 3)}/${pair.slice(3)}`;
  const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(sym)}&interval=15min&outputsize=${outputsize}&timezone=UTC&apikey=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) }); // a feed that never answers must become a recorded fault, not a scan that is cut off
  const j: any = await res.json();
  if (j.status !== "ok" || !Array.isArray(j.values)) throw new Error(`${pair}: ${j.message ?? "no data from the price feed"}`);
  const off = MID_TO_BID_PIPS * pipSize(pair);
  const rows = j.values.map((v: any) => ({ t: Date.parse(v.datetime.replace(" ", "T") + "Z") / 1000, o: +v.open - off, h: +v.high - off, l: +v.low - off, c: +v.close - off }))
    .filter((r: any) => Number.isFinite(r.t) && r.h >= r.l && r.l > 0 && r.t + 900 <= now)
    .sort((a: any, b: any) => a.t - b.t);
  return makeBars(15, rows.map((r: any) => r.t), rows.map((r: any) => r.o), rows.map((r: any) => r.h), rows.map((r: any) => r.l), rows.map((r: any) => r.c));
}

export function buildUniverse(bars: Record<string, Bars>): Universe {
  const u: Universe = {};
  for (const [pair, b] of Object.entries(bars)) u[pair] = frames(pair, emptyBars(1, 0), b);
  return u;
}

const fmt = (pair: string, x: number) => x.toFixed(pair.endsWith("JPY") ? 3 : 5);
const pips = (pair: string, d: number) => Math.round(d / pipSize(pair) * 10) / 10;
const WHY: Record<string, string> = {
  "closed-above": "Yesterday closed above the previous day's high.", "closed-below": "Yesterday closed below the previous day's low.",
  "failed-high": "Yesterday took the previous day's high and closed back under it.", "failed-low": "Yesterday took the previous day's low and closed back over it.",
  "none": "Yesterday gave no direction, so there is no trade today.", "no-data": "Not enough history yet.",
};
const biasWords = (pd: PairData): { bias: number; why: string } => {
  const p = prep(pd), d = candleBiasDetail(p, p.days.length - 1);
  return { bias: d.bias, why: WHY[d.why] };
};

/**
 * MT5 takes an order's expiry in the BROKER'S server clock, not UK time.
 * Most MT5 brokers run New York time plus seven hours (so their daily
 * candles start at the 17:00 New York roll).
 */
export type ServerClock = "ny7" | "utc" | "uk";
const two = (n: number) => (n < 10 ? "0" : "") + n;
export function mt5HM(t: number, clock: ServerClock): string {
  if (clock === "uk") return ukHM(t);
  if (clock === "utc") { const m = Math.floor((((t % 86400) + 86400) % 86400) / 60); return `${two(Math.floor(m / 60))}:${two(m % 60)}`; }
  const c = nyClock(t + 7 * 3600);
  return `${two(c.hh)}:${two(c.mm)}`;
}

function reasons(o: Order, biasWhy: string): string[] {
  const i = o.info ?? {}, buy = o.dir > 0, pair = o.pair;
  return [
    `Bias ${buy ? "up" : "down"}: ${biasWhy}`,
    `Swept the ${i.pool} ${buy ? "low" : "high"} at ${fmt(pair, +i.poolLevel)} (extreme ${fmt(pair, +i.sweepExtreme)}) in the ${i.window === "LON" ? "London" : "New York"} killzone.`,
    `Structure shifted ${buy ? "up" : "down"}, leaving a fair value gap ${fmt(pair, +i.gapBottom)} to ${fmt(pair, +i.gapTop)}. Entry is the near edge of that gap.`,
    `Stop is beyond the sweep ${buy ? "low" : "high"}. Target is the ${i.target} ${buy ? "high" : "low"}.`,
  ];
}

function watchRow(pd: PairData, now: number): WatchRow {
  const b = pd.m15, p = prep(pd), di = p.days.length - 1, day = p.days[di], pair = pd.pair, pip = pipSize(pair);
  const price = b.c[b.n - 1], { bias, why } = biasWords(pd);
  const levels: WatchRow["levels"] = [];
  const add = (name: string, lv: number, side: 1 | -1) => {
    if (!Number.isFinite(lv)) return;
    const taken = side > 0 ? day.hi > lv + P.sweepMarginPips * pip : day.lo < lv - P.sweepMarginPips * pip;
    levels.push({ name, price: roundPrice(pair, lv), pips: pips(pair, lv - price), taken });
  };
  const y = prevDay(p, di);
  if (y >= 0) { add("Yesterday's high", p.days[y].hi, 1); add("Yesterday's low", p.days[y].lo, -1); }
  const asia = sessionHL(pd, p, day, 19 * 60, 0);
  if (asia.n >= 8) { add("Asian range high", asia.hi, 1); add("Asian range low", asia.lo, -1); }
  const mod = nyClock(now).minuteOfDay, inLon = mod >= 120 && mod < 300, inNy = mod >= 420 && mod < 600;
  let note: string;
  if (!bias) note = "Standing aside.";
  else if (inLon || inNy) note = `${inLon ? "London" : "New York"} killzone is open. Watching for a sweep ${bias > 0 ? "below a low" : "above a high"}, then a shift ${bias > 0 ? "up" : "down"}.`;
  else note = `Looking to ${bias > 0 ? "buy" : "sell"}, but only inside a killzone.`;
  return { pair, price: roundPrice(pair, price), time: b.end[b.n - 1], bias, biasWhy: why, levels, note };
}

/**
 * The daily check-in goes out on the first scan from the quarter hour before
 * the London killzone opens (01:45 New York), Monday to Friday. That is
 * 06:45 UK for most of the year and 05:45 UK in the few weeks when US and UK
 * clocks are out of step. The window stays open for an hour (four scans), so
 * that one scan that fails to run does not cost the day's check-in; the
 * once-a-day rule is kept in store.ts.
 */
export const CHECKIN_FROM = 105, CHECKIN_TO = 165;
export function isCheckInTime(now: number): boolean {
  const c = nyClock(now);
  return c.dow >= 1 && c.dow <= 5 && c.minuteOfDay >= CHECKIN_FROM && c.minuteOfDay < CHECKIN_TO;
}

export function sessionLabel(now: number): string {
  if (!marketOpen(now)) return "Market closed";
  const mod = nyClock(now).minuteOfDay;
  if (mod >= 120 && mod < 300) return "London killzone";
  if (mod >= 420 && mod < 600) return "New York killzone";
  return "Outside the killzones";
}

/**
 * What to tell the owner about these tickets now. Each ticket's `alerted`
 * flags are set as its messages are produced, so nothing is said twice.
 *
 *  new    a ticket to place
 *  late   a setup found only after its entry had traded (a scan was missed): one note saying skip it
 *  fill   the entry has traded
 *  close  fifteen minutes before the end-of-day cut-off, if the trade is still open
 *  done   the ending: target, stop, cut-off, expiry, withdrawal, or blocked by the account rules
 */
export function messagesFor(recent: SignalRec[], now: number, clock: ServerClock = "ny7"): Msg[] {
  const messages: Msg[] = [];
  const LATER = 12 * 3600;
  for (const s of recent) {
    if (s.backfilled) continue;
    const side = s.dir > 0 ? "buy" : "sell", head = `${s.dir > 0 ? "BUY" : "SELL"} LIMIT ${s.pair}`;
    const say = (kind: MsgKind, until: number, title: string, body: string, text = `<b>${title}</b>\n${body}`) => messages.push({ id: s.id, kind, until, title, body, text });
    const ended = ["won", "lost", "flat", "expired", "withdrawn"].includes(s.status);
    if (!s.alerted.fresh) {
      s.alerted.fresh = true;
      if (s.status === "pending") {
        say("new", s.expireAt, `${head} (demo)`,
          s.lots ? `Entry ${fmt(s.pair, s.entry)}, stop ${fmt(s.pair, s.stop)}, target ${fmt(s.pair, s.tp)}, ${s.lots.toFixed(2)} lots. Issued ${ukHM(s.signalTime)} UK, expires ${ukHM(s.expireAt)} UK (${mt5HM(s.expireAt, clock)} on the MT5 clock).` : "Stop too wide to size at 1%. Skip this one.",
          [
            `<b>${head}</b>  (DEMO)`,
            `Entry <code>${fmt(s.pair, s.entry)}</code>`, `Stop loss <code>${fmt(s.pair, s.stop)}</code>  (${s.riskPips} pips)`, `Take profit <code>${fmt(s.pair, s.tp)}</code>  (${s.rewardPips} pips)`,
            s.lots ? `Volume <code>${s.lots.toFixed(2)}</code> lots  (risk about £${s.riskMoney.toFixed(2)})` : "Volume: stop too wide to size at 1%. Skip this one.",
            `Set Expiration in MT5 to <b>${mt5HM(s.expireAt, clock)}</b> (MT5 clock; ${ukHM(s.expireAt)} UK). If MT5 will not take an expiry, delete the order yourself at that time.`,
            `Close anything still open at ${ukHM(s.flatAt)} UK.`,
            "If price has already traded through the entry, do not chase it.",
            "<i>This rule set did not pass its historical test. Demo account only.</i>",
          ].join("\n"));
      } else if (s.status === "open") {
        // First seen with the entry already traded. A ticket followed at once by "entry traded" would invite him to chase it.
        s.alerted.fill = true; s.alerted.flat = true; s.alerted.done = true; // he is told to skip it, so nothing more is sent about it
        say("late", s.flatAt, `${s.pair} ${side}: found too late, skip`, `A ${side} setup at ${fmt(s.pair, s.entry)} was spotted after price had already reached the entry. Do not chase it. The app still tracks the result.`);
      } else if (s.status === "blocked") {
        s.alerted.done = true;
        say("done", now + LATER, `${s.pair}: setup skipped`, `Skipped by the account rules: ${s.statusNote}`);
      } else if (ended) { s.alerted.fill = true; s.alerted.done = true; } // over before he could have heard of it: nothing to act on, so nothing is sent
      continue;
    }
    if (s.status === "blocked" && !s.alerted.done) {
      // The account rules are applied when the entry trades, so a ticket already sent can be ruled out later. His MT5 order knows nothing of that.
      s.alerted.done = true;
      say("done", now + LATER, `${s.pair}: delete this order`, `The account rules now rule this trade out: ${s.statusNote} If your ${s.pair} order is still waiting, delete it. If it has filled, close it.`);
    }
    if (s.status === "open" && !s.alerted.fill) {
      s.alerted.fill = true;
      say("fill", s.flatAt, `${s.pair}: entry traded`, `The entry at ${fmt(s.pair, s.entry)} has traded. If you placed the order it should be filled.`);
    }
    if (s.status === "open" && !s.alerted.flat && now >= s.flatAt - 900 && now <= s.flatAt + 600) {
      // Nothing closes his real trade at the cut-off but him: remind him while there is still time.
      s.alerted.flat = true;
      const past = now >= s.flatAt;
      say("close", s.flatAt + 3600, past ? `${s.pair}: close it now` : `${s.pair}: close at ${ukHM(s.flatAt)} UK`, `End-of-day cut-off${past ? ` was ${ukHM(s.flatAt)} UK` : ""}. If your ${s.pair} ${side} is still open${past ? "" : ` at ${ukHM(s.flatAt)} UK (${mt5HM(s.flatAt, clock)} on the MT5 clock)`}, close it by hand${past ? " now" : ""}.`);
    }
    if (ended && !s.alerted.done) {
      s.alerted.done = true;
      const r = s.r !== undefined ? ` Result by the rules: ${s.r > 0 ? "+" : ""}${s.r}R.` : "";
      // the title says what HE has to do in MetaTrader, because the app cannot touch it
      const title = s.status === "expired" || s.status === "withdrawn" ? `${s.pair}: delete the order` : s.status === "flat" ? `${s.pair}: cut-off reached, close it` : `${s.pair} ${side} finished`;
      say("done", now + LATER, title, `${s.statusNote}${r}`);
    }
  }
  return messages;
}

/** One scan. `saved` is what was stored last time; nothing in it is mutated. */
export function scan(u: Universe, saved: SignalRec[], now: number, balance: number, ccy = "GBP", clock: ServerClock = "ny7"): ScanResult {
  const from = now - WINDOW_DAYS * 86400;
  const byId = new Map<string, SignalRec>(saved.map((s) => [s.id, { ...s, alerted: { ...s.alerted } }]));
  const firstRun = saved.length === 0;
  const rates: Record<string, number> = {};
  let lastBar = 0;
  for (const [pair, pd] of Object.entries(u)) if (pd.m15.n) { rates[pair] = pd.m15.c[pd.m15.n - 1]; lastBar = Math.max(lastBar, pd.m15.end[pd.m15.n - 1]); }

  // 1. new setups from the rules the backtest ran
  for (const pair of PAIRS) {
    const pd = u[pair];
    if (!pd || pd.m15.n < 1500) continue;
    const graded = new Set(generateSweep(pd, SWEEP_FVG.configs[GRADE_CONFIG], from, now + 1).map((o) => `${o.id}|${o.entry}`));
    const why = biasWords(pd).why;
    for (const o of generateSweep(pd, SWEEP_FVG.configs[LIVE_CONFIG], from, now + 1)) {
      if (byId.has(o.id)) continue; // a ticket, once issued, is frozen
      const pip = pipSize(pair), fresh = now - o.signalTime <= FRESH_SEC && !firstRun;
      const isToday = tradingDay(o.signalTime) === tradingDay(now);
      byId.set(o.id, {
        id: o.id, pair, dir: o.dir, entry: o.entry, stop: o.stop, tp: o.tp, signalTime: o.signalTime, expireAt: o.expireAt, flatAt: o.flatAt ?? o.expireAt,
        riskPips: pips(pair, Math.abs(o.entry - o.stop)), rewardPips: pips(pair, Math.abs(o.tp - o.entry)),
        grade: graded.has(`${o.id}|${o.entry}`) ? "A" : "B", reasons: reasons(o, isToday ? why : "Daily candle rule (section 4.1 of the rulebook)."), order: o,
        lots: 0, riskMoney: 0, status: "pending", statusNote: "", alerted: {}, backfilled: !fresh,
      });
      void pip;
    }
  }

  // 2. what became of every recent ticket, under the same pessimistic fill rules as the backtest
  const recent = [...byId.values()].filter((s) => s.signalTime >= from).sort((a, b) => a.signalTime - b.signalTime);
  const fills: Record<string, Bars> = {};
  for (const [pair, pd] of Object.entries(u)) fills[pair] = pd.m15;
  const sim = simulate(recent.map((s) => s.order), fills, STANDARD, { ...DEFAULT_RAILS, startBalance: balance, accountCcy: ccy, manualDelaySec: 0 });
  const BLOCK: Record<string, string> = {
    daily_cap: "Two trades already taken that day.", daily_loss_limit: "Daily loss limit reached.", pair_busy: "A trade on this pair was already open.",
    currency_exposure: "Another open trade already carried the same currency bet.", below_min_lot: "Stop too wide to size at 1% on this balance.", bad_order: "Invalid levels.", no_data: "No price data.",
  };
  for (const t of sim.trades) {
    const s = byId.get(t.order.id); if (!s) continue;
    const last = t.exits[t.exits.length - 1];
    s.fillTime = t.fillTime; s.lots = t.lots;
    if (last.reason === "data_end") { s.status = "open"; s.statusNote = `Filled ${ukLabel(t.fillTime)}. Running.`; }
    else {
      s.exitTime = last.time; s.exitPrice = last.price; s.r = Math.round(t.r * 100) / 100;
      s.status = last.reason === "tp" ? "won" : last.reason === "stop" ? "lost" : "flat";
      s.statusNote = last.reason === "tp" ? `Target hit ${ukLabel(last.time)}.` : last.reason === "stop" ? `Stopped out ${ukLabel(last.time)}.` : `End-of-day cut-off ${ukLabel(last.time)}: the rules close the trade here. If yours is still open, close it now.`;
    }
  }
  for (const k of sim.skipped) {
    const s = byId.get(k.order.id); if (!s) continue;
    if (k.reason === "expired") {
      if (s.expireAt > lastBar) { s.status = "pending"; s.statusNote = `Waiting to fill. Expires ${ukLabel(s.expireAt)}.`; }
      else { s.status = "expired"; s.statusNote = "Never filled. Delete the order in MT5 if you placed it."; }
    } else if (k.reason === "cancelled_level") { s.status = "withdrawn"; s.statusNote = "Price reached the target without filling. Delete the order in MT5 if you placed it."; }
    else { s.status = "blocked"; s.statusNote = BLOCK[k.reason] ?? k.reason; }
  }

  // 3. sizing for tickets not yet filled
  for (const s of recent) {
    const pv = pipValuePerLot(s.pair, ccy, rates);
    if (!s.lots) s.lots = lotsForRisk(balance / 100, s.riskPips, pv);
    s.riskMoney = Math.round(s.lots * s.riskPips * pv * 100) / 100;
  }

  // 4. messages
  const messages = messagesFor(recent, now, clock);

  const all = [...byId.values()].sort((a, b) => b.signalTime - a.signalTime).slice(0, KEEP);
  const watch = PAIRS.filter((p) => u[p] && u[p].m15.n >= 1500).map((p) => watchRow(u[p], now));
  return { signals: all, watch, messages, lastBar, session: sessionLabel(now) };
}
