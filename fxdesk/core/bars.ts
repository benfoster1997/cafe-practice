/**
 * bars.ts - candles, and the one way higher timeframes are built from them.
 *
 * CONVENTIONS (identical in the backtest and in the live scanner):
 *   - a bar is stamped with its OPEN time, in UTC seconds;
 *   - `end` is the instant its last moment has passed; a bar may be used by
 *     a rule only when end <= now. `closedCount()` is the single gate, so a
 *     rule cannot read a candle that is still forming;
 *   - M15 and H1 bars sit on clock boundaries;
 *   - H4 and D1 bars are anchored to 17:00 New York (the forex day), so a
 *     week has five daily candles and the charts match an MT5 broker whose
 *     server clock is New York + 7 hours.
 *   - prices are BID.
 * Everything above M15 is AGGREGATED HERE from M15 bars, never taken from a
 * data vendor's own H1/H4/D1 candles: vendors disagree on day boundaries,
 * and a daily candle that starts at the wrong hour silently changes every
 * "previous day's high" in the strategy.
 */
import { HOUR, MIN, nyOffset } from "./time.ts";

export interface Bars {
  /** bar length in minutes */
  minutes: number;
  /** number of bars */
  n: number;
  /** open time, UTC seconds */
  t: Float64Array;
  /** end time, UTC seconds (exclusive) */
  end: Float64Array;
  o: Float64Array; h: Float64Array; l: Float64Array; c: Float64Array;
  /** how many source bars each bar was built from (diagnostic) */
  src: Float64Array;
}

export function emptyBars(minutes: number, capacity: number): Bars {
  const f = () => new Float64Array(capacity);
  return { minutes, n: 0, t: f(), end: f(), o: f(), h: f(), l: f(), c: f(), src: f() };
}

function trim(b: Bars): Bars {
  const s = (a: Float64Array) => a.subarray(0, b.n);
  return { minutes: b.minutes, n: b.n, t: s(b.t), end: s(b.end), o: s(b.o), h: s(b.h), l: s(b.l), c: s(b.c), src: s(b.src) };
}

/** Build Bars from parallel arrays of open time / open / high / low / close. Input must be sorted by time. */
export function makeBars(minutes: number, t: ArrayLike<number>, o: ArrayLike<number>, h: ArrayLike<number>, l: ArrayLike<number>, c: ArrayLike<number>): Bars {
  const n = t.length;
  const b = emptyBars(minutes, n);
  for (let i = 0; i < n; i++) {
    b.t[i] = t[i]; b.end[i] = t[i] + minutes * MIN;
    b.o[i] = o[i]; b.h[i] = h[i]; b.l[i] = l[i]; b.c[i] = c[i]; b.src[i] = 1;
  }
  b.n = n;
  return b;
}

/**
 * Generic aggregation. `keyOf(t)` returns the OPEN time (UTC seconds) of the
 * bigger bar that the smaller bar starting at t belongs to; `spanSec` is the
 * bigger bar's length. Source bars must be sorted and are never reordered.
 */
function aggregate(src: Bars, minutes: number, keyOf: (t: number) => number, spanSec: number): Bars {
  const out = emptyBars(minutes, src.n);
  let k = -1;
  let cur = NaN;
  for (let i = 0; i < src.n; i++) {
    const key = keyOf(src.t[i]);
    if (key !== cur) {
      k += 1; cur = key;
      out.t[k] = key; out.end[k] = key + spanSec;
      out.o[k] = src.o[i]; out.h[k] = src.h[i]; out.l[k] = src.l[i]; out.c[k] = src.c[i]; out.src[k] = src.src[i];
    } else {
      if (src.h[i] > out.h[k]) out.h[k] = src.h[i];
      if (src.l[i] < out.l[k]) out.l[k] = src.l[i];
      out.c[k] = src.c[i]; out.src[k] += src.src[i];
    }
  }
  out.n = k + 1;
  return trim(out);
}

/** M1 -> M5/M15, or M15 -> H1: bars on clock boundaries. */
export function toClock(src: Bars, minutes: number): Bars {
  const span = minutes * MIN;
  return aggregate(src, minutes, (t) => Math.floor(t / span) * span, span);
}

/**
 * H4 (hours = 4) or D1 (hours = 24) bars anchored to 17:00 New York.
 * The clocks change at 02:00 on a Sunday, when the market is shut, so no
 * block that contains trading ever straddles a change and one offset per
 * block is exact.
 */
export function toNyAnchored(src: Bars, hours: 4 | 24): Bars {
  const span = hours * HOUR;
  const key = (t: number): number => {
    const off = nyOffset(t);
    const shifted = t + off - 17 * HOUR; // 17:00 New York becomes midnight
    return Math.floor(shifted / span) * span + 17 * HOUR - off;
  };
  return aggregate(src, hours * 60, key, span);
}

/**
 * How many bars of `b` are fully closed at instant `now` (UTC seconds):
 * the count of bars with end <= now. Bars [0, count) are safe to read.
 * Binary search; bars are sorted by time.
 */
export function closedCount(b: Bars, now: number): number {
  let lo = 0, hi = b.n;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (b.end[mid] <= now) lo = mid + 1; else hi = mid;
  }
  return lo;
}

/** Index of the first bar whose open time is >= t (b.n if none). */
export function lowerBound(b: Bars, t: number): number {
  let lo = 0, hi = b.n;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (b.t[mid] < t) lo = mid + 1; else hi = mid;
  }
  return lo;
}

/** Read the binary M1 file written by fxdesk/scripts/build_history.py. */
export function barsFromBin(buf: ArrayBufferLike, byteOffset = 0): Bars {
  const view = new DataView(buf, byteOffset);
  const n = Number(view.getBigUint64(0, true));
  const col = (k: number) => new Float64Array(buf.slice(byteOffset + 8 + k * n * 8, byteOffset + 8 + (k + 1) * n * 8));
  return makeBars(1, col(0), col(1), col(2), col(3), col(4));
}
