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
import { prep, prevDay, candleBias, sessionHL, P } from "../../core/models/common.ts";
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
  alerted: { fresh?: boolean; fill?: boolean; done?: boolean };
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
export interface ScanResult { signals: SignalRec[]; watch: WatchRow[]; messages: Array<{ text: string; id?: string }>; lastBar: number; session: string }

/** Twelve Data time_series -> closed M15 bid candles, oldest first. */
export async function fetchM15(pair: string, apiKey: string, now: number, outputsize = 3500): Promise<Bars> {
  const sym = `${pair.slice(0, 3)}/${pair.slice(3)}`;
  const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(sym)}&interval=15min&outputsize=${outputsize}&timezone=UTC&apikey=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
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
const biasWords = (pd: PairData): { bias: number; why: string } => {
  const p = prep(pd), di = p.days.length - 1, bias = candleBias(p, di);
  const y = prevDay(p, di), q = y >= 0 ? prevDay(p, y) : -1;
  if (y < 0 || q < 0) return { bias: 0, why: "Not enough history yet." };
  const Y = p.days[y], Q = p.days[q];
  if (Y.close > Q.hi) return { bias, why: "Yesterday closed above the previous day's high." };
  if (Y.close < Q.lo) return { bias, why: "Yesterday closed below the previous day's low." };
  if (bias < 0) return { bias, why: "Yesterday took the previous day's high and closed back under it." };
  if (bias > 0) return { bias, why: "Yesterday took the previous day's low and closed back over it." };
  return { bias: 0, why: "Yesterday gave no direction, so there is no trade today." };
};

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

export function sessionLabel(now: number): string {
  if (!marketOpen(now)) return "Market closed";
  const mod = nyClock(now).minuteOfDay;
  if (mod >= 120 && mod < 300) return "London killzone";
  if (mod >= 420 && mod < 600) return "New York killzone";
  return "Outside the killzones";
}

/** One scan. `saved` is what was stored last time; nothing in it is mutated. */
export function scan(u: Universe, saved: SignalRec[], now: number, balance: number, ccy = "GBP"): ScanResult {
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
      s.statusNote = last.reason === "tp" ? `Target hit ${ukLabel(last.time)}.` : last.reason === "stop" ? `Stopped out ${ukLabel(last.time)}.` : `Closed at the end-of-day cut-off ${ukLabel(last.time)}.`;
    }
  }
  for (const k of sim.skipped) {
    const s = byId.get(k.order.id); if (!s) continue;
    if (k.reason === "expired") {
      if (s.expireAt > lastBar) { s.status = "pending"; s.statusNote = `Waiting to fill. Expires ${ukLabel(s.expireAt)}.`; }
      else { s.status = "expired"; s.statusNote = "Never filled. Cancel the order if you placed it."; }
    } else if (k.reason === "cancelled_level") { s.status = "withdrawn"; s.statusNote = "Price reached the target without filling. Cancel the order if you placed it."; }
    else { s.status = "blocked"; s.statusNote = BLOCK[k.reason] ?? k.reason; }
  }

  // 3. sizing for tickets not yet filled
  for (const s of recent) {
    const pv = pipValuePerLot(s.pair, ccy, rates);
    if (!s.lots) s.lots = lotsForRisk(balance / 100, s.riskPips, pv);
    s.riskMoney = Math.round(s.lots * s.riskPips * pv * 100) / 100;
  }

  // 4. messages
  const messages: ScanResult["messages"] = [];
  for (const s of recent) {
    if (s.backfilled) continue;
    const head = `${s.dir > 0 ? "BUY" : "SELL"} LIMIT ${s.pair}`;
    if (!s.alerted.fresh && (s.status === "pending" || s.status === "open")) {
      s.alerted.fresh = true;
      messages.push({ id: s.id, text: [
        `<b>${head}</b>  (grade ${s.grade}, DEMO)`,
        `Entry <code>${fmt(s.pair, s.entry)}</code>`, `Stop loss <code>${fmt(s.pair, s.stop)}</code>  (${s.riskPips} pips)`, `Take profit <code>${fmt(s.pair, s.tp)}</code>  (${s.rewardPips} pips)`,
        s.lots ? `Volume <code>${s.lots.toFixed(2)}</code> lots  (risk about £${s.riskMoney.toFixed(2)})` : "Volume: stop too wide to size at 1%. Skip this one.",
        `Order expires ${ukHM(s.expireAt)} UK. Close anything still open at ${ukHM(s.flatAt)} UK.`,
        "If price has already traded through the entry, do not chase it.",
        "<i>This rule set did not pass its historical test. Demo account only.</i>",
      ].join("\n") });
    } else if (!s.alerted.fresh && s.status === "blocked") { s.alerted.fresh = true; s.alerted.done = true; messages.push({ id: s.id, text: `Setup on ${s.pair} skipped by the account rules: ${s.statusNote}` }); }
    if (s.status === "open" && !s.alerted.fill) { s.alerted.fill = true; messages.push({ id: s.id, text: `${s.pair}: the entry at ${fmt(s.pair, s.entry)} has traded. If you placed the order it should be filled.` }); }
    if (["won", "lost", "flat", "expired", "withdrawn"].includes(s.status) && !s.alerted.done) {
      s.alerted.done = true;
      const r = s.r !== undefined ? ` Result by the rules: ${s.r > 0 ? "+" : ""}${s.r}R.` : "";
      messages.push({ id: s.id, text: `${s.pair} ${s.dir > 0 ? "buy" : "sell"}: ${s.statusNote}${r}` });
    }
  }

  const all = [...byId.values()].sort((a, b) => b.signalTime - a.signalTime).slice(0, KEEP);
  const watch = PAIRS.filter((p) => u[p] && u[p].m15.n >= 1500).map((p) => watchRow(u[p], now));
  return { signals: all, watch, messages, lastBar, session: sessionLabel(now) };
}
