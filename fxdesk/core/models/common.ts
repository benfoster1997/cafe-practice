/**
 * common.ts - the parts shared by every ICT model: which candles may define
 * a level, what "yesterday" was, the daily bias, the session windows and the
 * news blackout. Rule numbers refer to fxdesk/SPEC.md.
 */
import { type Bars, makeBars, toNyAnchored, closedCount } from "../bars.ts";
import { type PairData } from "../model.ts";
import { pipSize } from "../pairs.ts";
import { nyWallToUtc, MIN } from "../time.ts";

/* ---- parameters shared by the models (tags: see SPEC.md section 3) ---- */
export const P = {
  /** a level counts as taken only when price trades this far beyond it (pips) - feed-noise margin, OURS */
  sweepMarginPips: 2,
  /** a close counts as beyond a level only by this much (pips) - OURS */
  closeMarginPips: 1,
  /** stop sits this far beyond the structure it protects (pips) - OURS */
  stopBufferPips: 2,
  /** extra room on short stops and buy-stop levels because they trigger on the ASK (pips) - OURS */
  askAllowancePips: 2,
  /** targets stop this far short of the liquidity they aim at (pips) - OURS, after ICT's "inside the level" */
  targetCushionPips: 2,
  /** a trading day needs this many usable M15 candles to count as a day (holidays are skipped) - OURS */
  minBarsPerDay: 60,
  /** H4 candles the structure bias may look back over - OURS (bounded so live and backtest agree) */
  h4Lookback: 120,
};

/** Rollover candles (M15 opens 16:45-18:00 New York) never define a level: spreads are wide and data vendors disagree by up to 20 pips there. */
export const isRollover = (minuteOfDay: number): boolean => minuteOfDay >= 16 * 60 + 45 && minuteOfDay <= 18 * 60;

export interface DayInfo {
  /** trading day, yyyymmdd (the New York date it ends on) */
  key: number;
  first: number; last: number;
  /** usable (non-rollover) candle count, and the day's levels from usable candles only */
  n: number; hi: number; lo: number; close: number;
}

export interface Prep {
  /** one pip, in price units */
  pip: number;
  roll: Uint8Array;
  days: DayInfo[];
  /** index into `days` for every M15 bar */
  dayOf: Int32Array;
  /** H4 candles built without the rollover candles */
  h4: Bars;
  /** structure bias after each H4 candle closes: +1 bullish, -1 bearish, 0 none */
  h4State: Int8Array;
}

const cache = new WeakMap<PairData, Prep>();

export function prep(pd: PairData): Prep {
  const hit = cache.get(pd);
  if (hit) return hit;
  const b = pd.m15, n = b.n;
  const roll = new Uint8Array(n), dayOf = new Int32Array(n);
  const days: DayInfo[] = [];
  let cur: DayInfo | null = null;
  for (let i = 0; i < n; i++) {
    roll[i] = isRollover(pd.ci.mod[i]) ? 1 : 0;
    if (!cur || cur.key !== pd.ci.day[i]) { cur = { key: pd.ci.day[i], first: i, last: i, n: 0, hi: -Infinity, lo: Infinity, close: NaN }; days.push(cur); }
    cur.last = i; dayOf[i] = days.length - 1;
    if (!roll[i]) { cur.n++; if (b.h[i] > cur.hi) cur.hi = b.h[i]; if (b.l[i] < cur.lo) cur.lo = b.l[i]; cur.close = b.c[i]; }
  }
  // H4 candles from the usable M15 candles only
  const keep: number[] = [];
  for (let i = 0; i < n; i++) if (!roll[i]) keep.push(i);
  const pick = (a: Float64Array) => keep.map((i) => a[i]);
  const h4 = toNyAnchored(makeBars(15, pick(b.t), pick(b.o), pick(b.h), pick(b.l), pick(b.c)), 4);
  const out: Prep = { pip: pipSize(pd.pair), roll, days, dayOf, h4, h4State: h4Structure(h4, P.closeMarginPips * pipSize(pd.pair)) };
  cache.set(pd, out);
  return out;
}

/**
 * Bias B2 (SPEC 4.2): direction of the most recent H4 break of structure,
 * judged over the last `h4Lookback` candles only. A swing high is a candle
 * with a lower high either side; it is known when the candle after it
 * closes. An H4 CLOSE beyond the latest known swing high turns the state
 * bullish; beyond the latest swing low, bearish.
 */
function h4Structure(h4: Bars, margin: number): Int8Array {
  const out = new Int8Array(h4.n);
  for (let k = 0; k < h4.n; k++) {
    const start = Math.max(0, k - P.h4Lookback + 1);
    let state = 0, sh = NaN, sl = NaN;
    for (let j = start + 2; j <= k; j++) {
      if (h4.h[j - 1] > h4.h[j - 2] && h4.h[j - 1] > h4.h[j]) sh = h4.h[j - 1];
      if (h4.l[j - 1] < h4.l[j - 2] && h4.l[j - 1] < h4.l[j]) sl = h4.l[j - 1];
      if (h4.c[j] > sh + margin) { state = 1; sh = NaN; }
      else if (h4.c[j] < sl - margin) { state = -1; sl = NaN; }
    }
    out[k] = state;
  }
  return out;
}

/** The most recent real trading day before `di` (skipping holidays), or -1. Looks back at most 6 days. */
export function prevDay(p: Prep, di: number): number {
  for (let k = di - 1; k >= 0 && k >= di - 6; k--) if (p.days[k].n >= P.minBarsPerDay) return k;
  return -1;
}

export type BiasKind = "candle" | "h4";
export type CandleWhy = "closed-above" | "closed-below" | "failed-high" | "failed-low" | "none" | "no-data";

/** Comparisons allow a billionth of a price unit of floating-point residue, so "at least 2 pips" means it. */
export const EPS = 1e-9;

/**
 * Bias B1 (SPEC 4.1): yesterday's daily candle against the day before.
 *   closed at least 1 pip above the prior high        -> bullish (the draw is higher)
 *   closed at least 1 pip below the prior low         -> bearish
 *   took the prior high (by 2 pips), not the low      -> bearish (failed break)
 *   took the prior low (by 2 pips), not the high      -> bullish
 *   anything else (inside or outside day)             -> none, no trade
 * The margins are the common ones in SPEC 3, so a sub-pip difference
 * between two price feeds cannot flip the day's direction.
 */
export function candleBiasDetail(p: Prep, di: number): { bias: number; why: CandleWhy } {
  const y = prevDay(p, di); if (y < 0) return { bias: 0, why: "no-data" };
  const q = prevDay(p, y); if (q < 0) return { bias: 0, why: "no-data" };
  const Y = p.days[y], Q = p.days[q], cm = P.closeMarginPips * p.pip, sm = P.sweepMarginPips * p.pip;
  if (Y.close >= Q.hi + cm - EPS) return { bias: 1, why: "closed-above" };
  if (Y.close <= Q.lo - cm + EPS) return { bias: -1, why: "closed-below" };
  const tookHi = Y.hi >= Q.hi + sm - EPS, tookLo = Y.lo <= Q.lo - sm + EPS;
  if (tookHi && !tookLo) return { bias: -1, why: "failed-high" };
  if (tookLo && !tookHi) return { bias: 1, why: "failed-low" };
  return { bias: 0, why: "none" };
}
export const candleBias = (p: Prep, di: number): number => candleBiasDetail(p, di).bias;

/** Bias at a signal instant under the chosen procedure. */
export function biasAt(p: Prep, di: number, kind: BiasKind, signalTime: number): number {
  if (kind === "candle") return candleBias(p, di);
  const k = closedCount(p.h4, signalTime) - 1;
  return k >= 0 ? p.h4State[k] : 0;
}

/* ------------------------------------------------------------ sessions */

export interface Win { id: "LON" | "NY"; sweepFrom: number; sigFrom: number; sigTo: number; expire: number }
/** Killzones in New York minutes-of-day (SPEC 5). Signals fire on candles OPENING in [sigFrom, sigTo). */
export const WINDOWS: Win[] = [
  { id: "LON", sweepFrom: 0, sigFrom: 2 * 60, sigTo: 5 * 60, expire: 6 * 60 },
  { id: "NY", sweepFrom: 7 * 60, sigFrom: 7 * 60, sigTo: 10 * 60, expire: 11 * 60 },
];

/** Candles opening 08:15 and 08:30 New York never produce a signal (the 08:30 US releases). */
export const isBlackout = (minuteOfDay: number): boolean => minuteOfDay === 8 * 60 + 15 || minuteOfDay === 8 * 60 + 30;

/** First bar index of the day whose New York clock is at or after `minute` (0-1019 = after midnight). Returns day.last + 1 if none. */
export function idxAt(pd: PairData, day: DayInfo, minute: number): number {
  for (let i = day.first; i <= day.last; i++) { const m = pd.ci.mod[i]; if (m < 17 * 60 && m >= minute) return i; }
  return day.last + 1;
}

/** High and low of the day's usable candles whose clock is in [fromMin, toMin); evening minutes (>= 1020) come before midnight ones. */
export function sessionHL(pd: PairData, p: Prep, day: DayInfo, fromMin: number, toMin: number, upTo = day.last): { hi: number; lo: number; n: number } {
  let hi = -Infinity, lo = Infinity, n = 0;
  const inWin = (m: number) => (fromMin < toMin ? m >= fromMin && m < toMin : m >= fromMin || m < toMin);
  for (let i = day.first; i <= Math.min(day.last, upTo); i++) {
    if (p.roll[i] || !inWin(pd.ci.mod[i])) continue;
    n++; if (pd.m15.h[i] > hi) hi = pd.m15.h[i]; if (pd.m15.l[i] < lo) lo = pd.m15.l[i];
  }
  return { hi, lo, n };
}

/** UTC instant of a New York clock time on the calendar date a trading day ends on. */
export function nyTimeOnDay(dayKey: number, minuteOfDay: number): number {
  const y = Math.floor(dayKey / 10000), m = Math.floor(dayKey / 100) % 100, d = dayKey % 100;
  return nyWallToUtc(y, m, d, 0, 0) + minuteOfDay * MIN;
}

/* ---------------------------------------------------------------- rounding */

/** Whole-pip rounding helpers working in a "long-normalised" price space (see flip() in each model). */
export const ceilPip = (x: number, pip: number): number => Math.ceil(x / pip - 1e-6) * pip;
export const floorPip = (x: number, pip: number): number => Math.floor(x / pip + 1e-6) * pip;
