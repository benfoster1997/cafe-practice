/**
 * sim.ts - what would have happened to a hand-placed order, told pessimistically.
 *
 * A strategy proposes ORDERS (from closed M15 candles). This file decides,
 * minute by minute on one-minute BID candles, whether each order would have
 * filled, where it would have exited, what it cost, and whether the account
 * rules allowed it at all. The strategy has no say in any of that.
 *
 * THE HONEST-BACKTEST RULES (each one is enforced below and has a test):
 *
 *  1. ORDER PRICES ARE MT5 ORDER PRICES, AND BID/ASK IS RESPECTED.
 *     A buy fills on the ASK and exits on the BID; a sell fills on the BID
 *     and exits on the ASK. On a bid chart that means:
 *       buy limit at P    fills when  bid <= P - spread
 *       sell limit at P   fills when  bid >= P
 *       long stop-loss S  triggers when bid <= S
 *       long take-profit  triggers when bid >= T
 *       short stop-loss S triggers when bid >= S - spread   (the ask got there)
 *       short take-profit triggers when bid <= T - spread
 *     The spread is therefore paid on every round trip without any
 *     separate "cost" line that could be forgotten.
 *  2. A TOUCH IS NOT A FILL. Limit entries and take-profits need price to
 *     trade THROUGH the level by `limitThroughPips`.
 *  3. STOP FIRST. Inside one candle the order of prices is unknowable, so
 *     if a candle contains both the stop and a target, the stop is taken.
 *     The candle that fills an entry can stop it out but can never pay it.
 *  4. STOPS SLIP AND GAP. A stop exit pays `slipPips`, and if the candle
 *     opens beyond the stop it fills at that worse open.
 *  5. THE HUMAN IS SLOW. An order only starts working `manualDelaySec`
 *     after the signal candle closes. If price already traded through the
 *     entry before then, the trade is recorded as MISSED and never counted.
 *     Stop moves after a partial likewise take effect only after a delay.
 *  6. THE ACCOUNT RULES OUTRANK THE STRATEGY. 1% risk per trade sized in
 *     real lots (a trade too small for the minimum lot is skipped, never
 *     rounded up), at most N fills per trading day, no new trades after the
 *     daily loss limit, one position per pair, optional one-position-per-
 *     currency. These live here so no strategy change can remove them.
 *  7. EVERYTHING IS LOGGED. Missed, expired, cancelled and rule-blocked
 *     orders are returned alongside the trades, with the reason.
 */
import { type Bars, lowerBound } from "./bars.ts";
import { HOUR, nyClock, tradingDay } from "./time.ts";
import { type CostModel, baseOf, quoteOf, pipSize, pipValuePerLot, lotsForRisk, roundPrice } from "./pairs.ts";

export interface Order {
  id: string;
  pair: string;
  /** +1 buy, -1 sell */
  dir: 1 | -1;
  kind: "limit" | "stop" | "market";
  /** MT5 order price for limit/stop orders (ignored for market) */
  entry: number;
  /** stop-loss price */
  stop: number;
  /** final take-profit price */
  tp: number;
  /** optional first target: close `tp1Frac` of the position there */
  tp1?: number;
  tp1Frac?: number;
  /** after tp1 fills, move the stop to the entry price */
  beAfterTp1?: boolean;
  /** close time of the signal candle, UTC seconds */
  signalTime: number;
  /** unfilled order is withdrawn at this instant */
  expireAt: number;
  /** unfilled order is withdrawn if the bid trades to this level first (target reached without us, or setup invalidated) */
  cancelIfBid?: { above?: number; below?: number };
  /** optional time exit for an open position (UTC seconds) */
  flatAt?: number;
  tag: string;
  /** which model and why - shown on the ticket; ignored by the simulator */
  model?: string;
  info?: Record<string, string | number>;
}

export interface Rails {
  startBalance: number;
  accountCcy: string;
  riskPct: number;
  maxFillsPerDay: number;
  dailyLossLimitPct: number;
  /** block a new position that would repeat an existing currency exposure (e.g. two USD shorts) */
  onePerCurrency: boolean;
  lotStep: number;
  minLot: number;
  /** seconds between the signal candle's close and the order being live */
  manualDelaySec: number;
  /** seconds between a first target filling and the hand-moved stop being live */
  manageDelaySec: number;
}

export const DEFAULT_RAILS: Rails = {
  startBalance: 500, accountCcy: "GBP", riskPct: 1, maxFillsPerDay: 2, dailyLossLimitPct: 2,
  onePerCurrency: true, lotStep: 0.01, minLot: 0.01, manualDelaySec: 180, manageDelaySec: 300,
};

export interface Exit { time: number; price: number; frac: number; reason: "stop" | "breakeven" | "tp1" | "tp" | "time" | "data_end" }

export interface Trade {
  order: Order;
  fillTime: number;
  entry: number;
  stop: number;
  riskPips: number;
  lots: number;
  exits: Exit[];
  /** net result in pips per unit of original position, after commission and swap */
  pnlPips: number;
  /** net result as a multiple of the initial risk */
  r: number;
  pnlMoney: number;
  balanceAfter: number;
  /** worst and best excursion while open, in R */
  maeR: number;
  mfeR: number;
  nightsHeld: number;
  day: number;
}

export type Skip = { order: Order; time: number; reason:
  "missed_before_live" | "expired" | "cancelled_level" | "daily_cap" | "daily_loss_limit" |
  "pair_busy" | "currency_exposure" | "below_min_lot" | "bad_order" | "no_data" };

export interface SimResult { trades: Trade[]; skipped: Skip[]; endBalance: number }

/**
 * Prices are decimal fractions held in binary floats, so "1.1 + 0.00001" is
 * not exactly 1.10001. Every level comparison goes through these two, which
 * allow a billionth of a price unit (a hundred-thousandth of a pip) of
 * residue. Without them a fill or a stop is decided by rounding noise.
 */
const EPS = 1e-9;
const gte = (a: number, b: number): boolean => a >= b - EPS;
const lte = (a: number, b: number): boolean => a <= b + EPS;

/** Spread in PRICE units at an instant. */
export function spreadAt(cost: CostModel, pair: string, utcSec: number): number {
  const base = cost.spreadPips[pair] ?? 1;
  const mod = nyClock(utcSec).minuteOfDay;
  let mult = 1;
  if (mod >= 16 * 60 + 55 && mod < 18 * 60 + 5) mult = cost.rolloverMult;
  else if (mod >= 18 * 60 + 5 || mod < 2 * 60) mult = cost.asiaMult;
  return base * mult * pipSize(pair);
}

interface Live {
  o: Order; state: "waiting" | "working" | "open";
  liveFrom: number;
  // open-position state
  trade?: Trade; stop: number; remaining: number; tp1Done: boolean; beLiveAt: number; lastNight: number;
}

/**
 * Run a set of orders through history.
 * `m1` maps pair -> one-minute BID bars (also used for currency conversion,
 * so include GBPUSD and the USD-base pairs for a GBP account).
 */
export function simulate(orders: Order[], m1: Record<string, Bars>, cost: CostModel, rails: Rails = DEFAULT_RAILS): SimResult {
  const trades: Trade[] = [];
  const skipped: Skip[] = [];
  let balance = rails.startBalance;
  let day = -1, dayStartBalance = balance, fillsToday = 0;

  const queue = [...orders].sort((a, b) => a.signalTime - b.signalTime);
  let qi = 0;
  const live: Live[] = [];
  const ptr: Record<string, number> = {};

  /** Latest price known at instant t: this minute's open if it exists, else the previous close. Never a later price. */
  const rateAt = (pair: string, t: number): number => {
    const b = m1[pair];
    if (!b || !b.n) return NaN;
    const i = lowerBound(b, t);
    if (i < b.n && b.t[i] === t) return b.o[i];
    return i > 0 ? b.c[i - 1] : NaN;
  };
  const ratesAt = (t: number): Record<string, number> => {
    const out: Record<string, number> = {};
    for (const p of Object.keys(m1)) out[p] = rateAt(p, t);
    return out;
  };
  const rollDay = (t: number) => {
    const d = tradingDay(t);
    if (d !== day) { day = d; dayStartBalance = balance; fillsToday = 0; }
  };
  const dailyLossHit = () => (dayStartBalance - balance) / dayStartBalance * 100 >= rails.dailyLossLimitPct - 1e-9;

  const closeLeg = (L: Live, t: number, price: number, frac: number, reason: Exit["reason"]) => {
    const tr = L.trade!;
    tr.exits.push({ time: t, price, frac, reason });
    L.remaining -= frac;
    if (L.remaining <= 1e-9) finish(L, t);
  };
  const finish = (L: Live, t: number) => {
    const tr = L.trade!;
    const pip = pipSize(tr.order.pair);
    let gross = 0;
    for (const e of tr.exits) gross += e.frac * tr.order.dir * (e.price - tr.entry) / pip;
    const fees = (cost.commissionPipsRT[tr.order.pair] ?? 0) + tr.nightsHeld * cost.swapPipsPerNight;
    tr.pnlPips = gross - fees;
    tr.r = tr.pnlPips / tr.riskPips;
    const pv = pipValuePerLot(tr.order.pair, rails.accountCcy, ratesAt(t));
    tr.pnlMoney = tr.pnlPips * tr.lots * pv;
    balance += tr.pnlMoney;
    tr.balanceAfter = balance;
    trades.push(tr);
    live.splice(live.indexOf(L), 1);
  };

  const exposure = (o: Order): string[] => [baseOf(o.pair) + (o.dir > 0 ? "+" : "-"), quoteOf(o.pair) + (o.dir > 0 ? "-" : "+")];

  const tryFill = (L: Live, t: number, price: number, bar: { o: number; h: number; l: number }, sp: number): boolean => {
    const o = L.o;
    const drop = (reason: Skip["reason"]) => { skipped.push({ order: o, time: t, reason }); live.splice(live.indexOf(L), 1); return false; };
    if (fillsToday >= rails.maxFillsPerDay) return drop("daily_cap");
    if (dailyLossHit()) return drop("daily_loss_limit");
    if (live.some((x) => x.state === "open" && x.o.pair === o.pair)) return drop("pair_busy");
    if (rails.onePerCurrency) {
      const mine = exposure(o);
      if (live.some((x) => x.state === "open" && exposure(x.o).some((e) => mine.includes(e)))) return drop("currency_exposure");
    }
    const pip = pipSize(o.pair);
    const riskPips = o.dir * (price - o.stop) / pip;
    if (!(riskPips > 0) || !(o.dir * (o.tp - price) > 0)) return drop("bad_order");
    const pv = pipValuePerLot(o.pair, rails.accountCcy, ratesAt(t));
    const lots = lotsForRisk(balance * rails.riskPct / 100, riskPips, pv, rails.lotStep, rails.minLot);
    if (!(lots > 0)) return drop("below_min_lot");
    L.state = "open"; L.stop = o.stop; L.remaining = 1; L.tp1Done = false; L.beLiveAt = Infinity; L.lastNight = tradingDay(t);
    L.trade = { order: o, fillTime: t, entry: price, stop: o.stop, riskPips, lots, exits: [], pnlPips: 0, r: 0, pnlMoney: 0, balanceAfter: balance, maeR: 0, mfeR: 0, nightsHeld: 0, day };
    fillsToday += 1;
    // Rule 3: the filling candle may stop us out, and can never pay us.
    manageStopOnly(L, t, bar, sp);
    return true;
  };

  /** Stop check for one candle. Returns true if the position was closed. */
  const manageStopOnly = (L: Live, t: number, bar: { o: number; h: number; l: number }, sp: number): boolean => {
    const o = L.o, pip = pipSize(o.pair), slip = cost.slipPips * pip;
    if (o.dir > 0) {
      if (lte(bar.l, L.stop)) {
        const ref = Math.min(L.stop, bar.o); // gapped below the stop: fill at the open
        closeLeg(L, t, roundPrice(o.pair, ref - slip), L.remaining, L.stop >= L.trade!.entry ? "breakeven" : "stop");
        return true;
      }
    } else if (gte(bar.h + sp, L.stop)) {
      const ref = Math.max(L.stop, bar.o + sp); // ask opened above the stop
      closeLeg(L, t, roundPrice(o.pair, ref + slip), L.remaining, L.stop <= L.trade!.entry ? "breakeven" : "stop");
      return true;
    }
    return false;
  };

  const manageOpen = (L: Live, t: number, bar: { o: number; h: number; l: number }, sp: number, fillBar: boolean) => {
    const o = L.o, tr = L.trade!, pip = pipSize(o.pair), through = cost.limitThroughPips * pip;
    // nights held: count each trading-day roll (17:00 New York) the position crosses
    const td = tradingDay(t);
    if (td !== L.lastNight) {
      const wed = nyClock(t - HOUR).dow === 3; // the roll that just happened was Wednesday's
      tr.nightsHeld += wed ? 3 : 1;
      L.lastNight = td;
    }
    // excursions
    const worst = o.dir > 0 ? (bar.l - tr.entry) : (tr.entry - (bar.h + sp));
    const best = o.dir > 0 ? (bar.h - tr.entry) : (tr.entry - (bar.l + sp));
    tr.maeR = Math.min(tr.maeR, worst / pip / tr.riskPips);
    tr.mfeR = Math.max(tr.mfeR, best / pip / tr.riskPips);
    if (fillBar) return; // stop already checked by tryFill; no profit on the filling candle
    // time exit, at the candle's open, before anything else in this candle
    if (o.flatAt !== undefined && t >= o.flatAt) {
      const px = o.dir > 0 ? bar.o - cost.slipPips * pip : bar.o + sp + cost.slipPips * pip;
      closeLeg(L, t, roundPrice(o.pair, px), L.remaining, "time");
      return;
    }
    // a hand-moved break-even stop becomes live only after the delay
    if (L.tp1Done && o.beAfterTp1 && t >= L.beLiveAt && o.dir * (tr.entry - L.stop) > 0) L.stop = tr.entry;
    if (manageStopOnly(L, t, bar, sp)) return;
    // first target
    let tp1ThisBar = false;
    if (o.tp1 !== undefined && !L.tp1Done) {
      const hit = o.dir > 0 ? gte(bar.h, o.tp1 + through) : lte(bar.l + sp, o.tp1 - through);
      if (hit) {
        const frac = Math.min(Math.max(o.tp1Frac ?? 0.5, 0), 1);
        // Too small to split into two real lot sizes: nothing is closed, but the stop move still happens.
        const closeLots = Math.floor(tr.lots * frac / rails.lotStep + 1e-9) * rails.lotStep;
        const canSplit = closeLots >= rails.minLot - 1e-9 && tr.lots - closeLots >= rails.minLot - 1e-9;
        L.tp1Done = true; tp1ThisBar = true;
        L.beLiveAt = t + rails.manageDelaySec;
        if (canSplit) closeLeg(L, t, o.tp1, closeLots / tr.lots, "tp1");
        if (L.state !== "open" || !live.includes(L)) return;
      }
    }
    // final target - never on the same candle as the first target
    if (!tp1ThisBar) {
      const hit = o.dir > 0 ? gte(bar.h, o.tp + through) : lte(bar.l + sp, o.tp - through);
      if (hit) closeLeg(L, t, o.tp, L.remaining, "tp");
    }
  };

  const manageWorking = (L: Live, t: number, bar: { o: number; h: number; l: number }, sp: number) => {
    const o = L.o, pip = pipSize(o.pair), through = cost.limitThroughPips * pip, slip = cost.slipPips * pip;
    const drop = (reason: Skip["reason"]) => { skipped.push({ order: o, time: t, reason }); live.splice(live.indexOf(L), 1); };
    let wouldFill = false, fillPrice = o.entry;
    if (o.kind === "limit") {
      wouldFill = o.dir > 0 ? lte(bar.l + sp, o.entry - through) : gte(bar.h, o.entry + through);
    } else if (o.kind === "stop") {
      wouldFill = o.dir > 0 ? gte(bar.h + sp, o.entry) : lte(bar.l, o.entry);
      // stop entries are market fills: slipped, and gapped to the open if it is worse
      fillPrice = o.dir > 0 ? Math.max(o.entry, bar.o + sp) + slip : Math.min(o.entry, bar.o) - slip;
    } else {
      wouldFill = true;
      fillPrice = o.dir > 0 ? bar.o + sp + slip : bar.o - slip;
    }
    const cancelHit = o.cancelIfBid !== undefined && (
      (o.cancelIfBid.above !== undefined && gte(bar.h, o.cancelIfBid.above)) ||
      (o.cancelIfBid.below !== undefined && lte(bar.l, o.cancelIfBid.below)));
    if (L.state === "waiting") {
      // Rule 5: not live yet. Anything that happens now happens without us.
      if (t >= L.liveFrom) L.state = "working";
      else {
        if (o.kind !== "market" && wouldFill) return drop("missed_before_live");
        if (cancelHit) return drop("cancelled_level");
        return;
      }
    }
    if (t >= o.expireAt) return drop("expired");
    if (cancelHit) return drop("cancelled_level"); // if the same candle also filled, assume the cancel level came first
    if (wouldFill) tryFill(L, t, roundPrice(o.pair, fillPrice), bar, sp);
  };

  // ---- main loop: one-minute steps, only over minutes where something is alive
  let t = queue.length ? Math.ceil(queue[0].signalTime / 60) * 60 : 0;
  const lastT = Math.max(...Object.values(m1).map((b) => (b.n ? b.t[b.n - 1] : 0)));
  while ((qi < queue.length || live.length) && t <= lastT) {
    while (qi < queue.length && queue[qi].signalTime <= t) {
      const o = queue[qi++];
      if (!m1[o.pair]) { skipped.push({ order: o, time: t, reason: "no_data" }); continue; }
      live.push({ o, state: "waiting", liveFrom: o.signalTime + rails.manualDelaySec, stop: o.stop, remaining: 1, tp1Done: false, beLiveAt: Infinity, lastNight: 0 });
    }
    if (!live.length) { // jump straight to the next signal
      if (qi < queue.length) { t = Math.ceil(queue[qi].signalTime / 60) * 60; continue; }
      break;
    }
    rollDay(t);
    for (const L of [...live]) {
      if (!live.includes(L)) continue;
      const b = m1[L.o.pair];
      let i = ptr[L.o.pair] ?? lowerBound(b, t);
      while (i < b.n && b.t[i] < t) i++;
      ptr[L.o.pair] = i;
      if (i >= b.n || b.t[i] !== t) continue; // no candle this minute (quiet minute or market shut)
      const bar = { o: b.o[i], h: b.h[i], l: b.l[i] };
      const sp = spreadAt(cost, L.o.pair, t);
      if (L.state === "open") manageOpen(L, t, bar, sp, false);
      else {
        manageWorking(L, t, bar, sp);
        if (live.includes(L) && L.state === "open") manageOpen(L, t, bar, sp, true);
      }
    }
    t += 60;
  }
  // close whatever is still open at the end of the data so statistics are complete
  for (const L of [...live]) {
    if (L.state === "open") {
      const b = m1[L.o.pair];
      const px = L.o.dir > 0 ? b.c[b.n - 1] : b.c[b.n - 1] + spreadAt(cost, L.o.pair, b.t[b.n - 1]);
      closeLeg(L, b.t[b.n - 1], px, L.remaining, "data_end");
    } else skipped.push({ order: L.o, time: lastT, reason: "expired" });
  }
  return { trades, skipped, endBalance: balance };
}
