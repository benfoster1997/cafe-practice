/**
 * ict.ts - ICT's building blocks as plain functions over CLOSED bars.
 *
 * Every function here answers "what was knowable when bar i closed?".
 * None looks at bar i+1. Where a pattern needs later bars to exist at all
 * (a swing high needs a lower high after it), the function reports the
 * bar at which it BECAME knowable, and callers must not use it earlier.
 *
 * Definitions follow docs/ICT_STRATEGY_DIGEST.md section 4. Anything ICT
 * left without a number is a parameter here, never a hidden constant.
 */
import { type Bars } from "./bars.ts";
import { nyClock, tradingDay } from "./time.ts";

/* ------------------------------------------------------------------ swings */

export interface Swing {
  /** index of the bar that holds the extreme */
  i: number;
  /** index of the bar at whose CLOSE the swing became knowable (i + right) */
  knownAt: number;
  price: number;
  kind: "high" | "low";
}

/**
 * Swing points. ICT's swing is the three-candle pattern (left = right = 1):
 * a swing high is a candle with a LOWER high on each side. Strict
 * inequality: a tie is not a swing.
 * Returned in order of the extreme bar.
 */
export function swings(b: Bars, left = 1, right = 1, from = 0, to = b.n): Swing[] {
  const out: Swing[] = [];
  for (let i = Math.max(from, left); i + right < to; i++) {
    let hi = true, lo = true;
    for (let k = 1; k <= left && (hi || lo); k++) {
      if (!(b.h[i - k] < b.h[i])) hi = false;
      if (!(b.l[i - k] > b.l[i])) lo = false;
    }
    for (let k = 1; k <= right && (hi || lo); k++) {
      if (!(b.h[i + k] < b.h[i])) hi = false;
      if (!(b.l[i + k] > b.l[i])) lo = false;
    }
    if (hi) out.push({ i, knownAt: i + right, price: b.h[i], kind: "high" });
    if (lo) out.push({ i, knownAt: i + right, price: b.l[i], kind: "low" });
  }
  return out;
}

/* -------------------------------------------------------- fair value gaps */

export interface Fvg {
  /** index of the THIRD candle; the gap is knowable when this bar closes */
  i: number;
  dir: 1 | -1;
  /** lower and upper edge of the gap */
  low: number;
  high: number;
  /** consequent encroachment: the gap's midpoint */
  mid: number;
}

/**
 * Fair value gap completed by bar i (candles i-2, i-1, i).
 * Bullish: candle 1's HIGH is below candle 3's LOW; the gap is [c1.high, c3.low].
 * Bearish: candle 1's LOW is above candle 3's HIGH; the gap is [c3.high, c1.low].
 * Wick extremes, exactly as ICT defines it. Returns null if there is no gap
 * or it is smaller than `minSize` (price units).
 */
export function fvgAt(b: Bars, i: number, minSize = 0): Fvg | null {
  if (i < 2) return null;
  if (b.h[i - 2] < b.l[i]) {
    const low = b.h[i - 2], high = b.l[i];
    return high - low >= minSize ? { i, dir: 1, low, high, mid: (low + high) / 2 } : null;
  }
  if (b.l[i - 2] > b.h[i]) {
    const low = b.h[i], high = b.l[i - 2];
    return high - low >= minSize ? { i, dir: -1, low, high, mid: (low + high) / 2 } : null;
  }
  return null;
}

/* ------------------------------------------------------- ranges and levels */

/** Highest high and lowest low over bars [from, to). Returns null if empty. */
export function rangeOf(b: Bars, from: number, to: number): { high: number; low: number; iHigh: number; iLow: number } | null {
  if (to <= from) return null;
  let high = -Infinity, low = Infinity, iHigh = from, iLow = from;
  for (let i = from; i < to; i++) {
    if (b.h[i] > high) { high = b.h[i]; iHigh = i; }
    if (b.l[i] < low) { low = b.l[i]; iLow = i; }
  }
  return { high, low, iHigh, iLow };
}

/** Retracement level: `frac` of the way back from `to` toward `from` (0.62 = ICT's 62% level). */
export const retrace = (from: number, to: number, frac: number): number => to - (to - from) * frac;

/** Position of a price inside a range: 0 at the low, 1 at the high, 0.5 = equilibrium. Above 0.5 is premium, below is discount. */
export const positionInRange = (price: number, low: number, high: number): number => (high > low ? (price - low) / (high - low) : 0.5);

/**
 * Average daily range over the last `n` COMPLETED daily bars before index
 * `uptoExclusive`, in price units. Daily stubs (holidays) are skipped.
 */
export function adr(d1: Bars, uptoExclusive: number, n = 5, minSrc = 40): number {
  let sum = 0, k = 0;
  for (let i = uptoExclusive - 1; i >= 0 && k < n; i--) {
    if (d1.src[i] < minSrc) continue;
    sum += d1.h[i] - d1.l[i]; k++;
  }
  return k ? sum / k : NaN;
}

/**
 * Average true range (Wilder) of the last `n` bars ending at index `i`
 * inclusive, simple mean of true ranges. Used only for size filters we
 * declare as OURS; ICT gives no volatility formula.
 */
export function atr(b: Bars, i: number, n = 14): number {
  if (i < n) return NaN;
  let sum = 0;
  for (let k = i - n + 1; k <= i; k++) {
    const pc = b.c[k - 1];
    sum += Math.max(b.h[k] - b.l[k], Math.abs(b.h[k] - pc), Math.abs(b.l[k] - pc));
  }
  return sum / n;
}

/* --------------------------------------------------------------- sessions */

/**
 * For every bar, the minute-of-day on the New York clock and the trading-day
 * key (17:00 New York roll). Computed once per series; rules index into it.
 */
export function clockIndex(b: Bars): { mod: Int16Array; day: Int32Array; dow: Int8Array } {
  const mod = new Int16Array(b.n), day = new Int32Array(b.n), dow = new Int8Array(b.n);
  for (let i = 0; i < b.n; i++) {
    const c = nyClock(b.t[i]);
    mod[i] = c.minuteOfDay; dow[i] = c.dow; day[i] = tradingDay(b.t[i]);
  }
  return { mod, day, dow };
}

/**
 * High/low of a New York clock window inside ONE trading day.
 * `startMin`/`endMin` are minutes of the New York day; a window that
 * starts in the evening (e.g. 19:00) and ends at or after midnight is
 * written with startMin > endMin (19:00-00:00 is 1140 -> 0).
 * Scans backward from bar `i` (inclusive) while the trading day matches.
 * Only bars that have fully closed by bar i's close are used, and the
 * window must itself be over (its last bar closed) or the result is null,
 * so a session range can never be read while it is still being made.
 */
export function sessionRange(b: Bars, ci: { mod: Int16Array; day: Int32Array }, i: number, startMin: number, endMin: number): { high: number; low: number; first: number; last: number } | null {
  const day = ci.day[i];
  const inWin = (m: number) => (startMin < endMin ? m >= startMin && m < endMin : m >= startMin || m < endMin);
  // order of a minute-of-day within a trading day that starts at 17:00
  const ord = (m: number) => (m >= 17 * 60 ? m - 17 * 60 : m + 7 * 60);
  const endOrd = ord(endMin === 0 ? 0 : endMin);
  // the window is over once the bar AFTER bar i starts at or beyond its end
  const nextStartOrd = ord(ci.mod[i]) + b.minutes;
  if (nextStartOrd < endOrd) return null;
  let high = -Infinity, low = Infinity, first = -1, last = -1;
  for (let k = i; k >= 0 && ci.day[k] === day; k--) {
    if (!inWin(ci.mod[k])) continue;
    if (last < 0) last = k;
    first = k;
    if (b.h[k] > high) high = b.h[k];
    if (b.l[k] < low) low = b.l[k];
  }
  return first < 0 ? null : { high, low, first, last };
}
