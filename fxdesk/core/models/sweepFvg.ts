/**
 * Model A - "Sweep, shift, gap" (SPEC section 6).
 *
 * ICT's 2022 sequence, run on M15 candles inside the forex killzones:
 *   1. a daily bias exists;
 *   2. price SWEEPS resting liquidity against that bias (trades below a
 *      prior low when bullish);
 *   3. price then SHIFTS structure: an M15 close above the last swing high
 *      that stood before the sweep low;
 *   4. the move up left a FAIR VALUE GAP (in one variant it must sit in the
 *      lower, "discount", half of the leg);
 *   5. buy limit at the top of the gap, stop under the sweep low, target at
 *      a fixed multiple of risk or at the liquidity above.
 * Shorts are the exact mirror. Running ICT's index-futures sequence on M15
 * forex candles is OUR adaptation; his own basis for it is "everything is
 * fractal".
 *
 * The code handles shorts by mirroring prices (a short on prices p is a long
 * on prices -p), so there is one copy of every rule and the two directions
 * cannot drift apart.
 */
import { type Order } from "../sim.ts";
import { type ModelDef, type PairData } from "../model.ts";
import { pipSize, roundPrice } from "../pairs.ts";
import { daysFromCivil, dowFromDays } from "../time.ts";
import { P, prep, prevDay, biasAt, WINDOWS, isBlackout, idxAt, sessionHL, nyTimeOnDay, ceilPip, floorPip, type BiasKind, type Prep, type DayInfo, type Win } from "./common.ts";
import { isFomcDay, isNfpDay } from "./calendar.ts";

export interface SweepCfg { bias: BiasKind; gap: "any" | "discount"; target: "2R" | "liquidity" }

/** Model A parameters (tags in SPEC 6.9). */
export const A = {
  /** how far back the pre-sweep swing high may be (M15 candles) - OURS */
  swingLookback: 20,
  /** smallest fair value gap worth an order (pips) - OURS (feed noise) */
  minGapPips: 2,
  /** stops tighter than this are widened to it; wider than max, no trade (pips) - OURS (cost geometry / account size) */
  minStopPips: 8, maxStopPips: 35,
  /** target schemes */
  fixedR: 2, minLiqR: 1.5, maxLiqR: 4,
};

export const dayOfWeek = (dayKey: number): number => dowFromDays(daysFromCivil(Math.floor(dayKey / 10000), Math.floor(dayKey / 100) % 100, dayKey % 100));

interface Found { i: number; order: Order }

function scan(pd: PairData, p: Prep, di: number, win: Win, dir: 1 | -1, cfg: SweepCfg): Found | null {
  const b = pd.m15, pip = pipSize(pd.pair), day = p.days[di];
  const Y = p.days[prevDay(p, di)];
  // long-normalised prices: for a short every price is negated and highs/lows swap
  const H = (i: number) => (dir > 0 ? b.h[i] : -b.l[i]);
  const L = (i: number) => (dir > 0 ? b.l[i] : -b.h[i]);
  const C = (i: number) => dir * b.c[i];
  const lowOf = (s: { hi: number; lo: number }) => (dir > 0 ? s.lo : -s.hi);
  const highOf = (s: { hi: number; lo: number }) => (dir > 0 ? s.hi : -s.lo);
  const margin = P.sweepMarginPips * pip, closeMargin = P.closeMarginPips * pip;

  const i0 = idxAt(pd, day, win.sweepFrom), iEnd = idxAt(pd, day, win.sigTo);
  if (i0 > day.last) return null;
  const asia = sessionHL(pd, p, day, 19 * 60, 0);
  const iMid = idxAt(pd, day, 0);
  const lon = win.id === "NY" ? sessionHL(pd, p, day, 0, 7 * 60) : null;

  // --- liquidity pools on the side we expect to be raided (SPEC 6.2)
  const pools: Array<{ name: string; level: number }> = [];
  const untouched = (level: number, from: number, to: number) => { for (let k = from; k < to; k++) if (!p.roll[k] && L(k) < level - margin) return false; return true; };
  if (untouched(lowOf(Y), day.first, i0)) pools.push({ name: "previous day", level: lowOf(Y) });
  if (asia.n >= 8 && (win.id === "LON" || untouched(lowOf(asia), iMid, i0))) pools.push({ name: "Asian range", level: lowOf(asia) });
  if (lon && lon.n >= 12) pools.push({ name: "London session", level: lowOf(lon) });

  let best: Found | null = null;
  for (const pool of pools) {
    const level = pool.level;
    let sStart = -1, E = Infinity, eIdx = -1, m = -1;
    for (let i = i0; i < iEnd; i++) {
      if (p.roll[i]) continue;
      const lo = L(i), cl = C(i);
      // --- the sweep: price trades beyond the pool by the margin (SPEC 6.3)
      if (sStart < 0) { if (lo < level - margin) { sStart = i; E = lo; eIdx = i; } continue; }
      // a lower low moves the sweep extreme and restarts the hunt for a shift
      if (lo < E) { E = lo; eIdx = i; m = -1; continue; }
      // --- structure shift: close above the last swing high that stood before the sweep low (SPEC 6.4)
      if (m < 0) {
        let r = -1;
        for (let j = eIdx - 1; j >= Math.max(1, eIdx - A.swingLookback); j--) {
          if (p.roll[j - 1] || p.roll[j] || p.roll[j + 1]) continue;
          if (H(j) > H(j - 1) && H(j) > H(j + 1)) { r = j; break; }
        }
        if (r >= 0 && cl > H(r) + closeMargin) m = i;
      }
      if (m < 0) continue;
      if (i > m + 1) break;
      // --- fair value gap left by the leg, not yet traded into (SPEC 6.5)
      let legHigh = -Infinity;
      for (let k = eIdx; k <= i; k++) legHigh = Math.max(legHigh, H(k));
      const eq = (E + legHigh) / 2;
      let top = NaN, bottom = NaN;
      for (let j = eIdx + 2; j <= i; j++) {
        const gLow = H(j - 2), gHigh = L(j);
        if (gHigh - gLow < A.minGapPips * pip - 1e-9) continue;
        if (cfg.gap === "discount" && gHigh > eq + 1e-9) continue;
        let touched = false;
        for (let k = j + 1; k <= i; k++) if (L(k) <= gHigh) { touched = true; break; }
        if (touched) continue;
        if (Number.isNaN(top) || gHigh > top) { top = gHigh; bottom = gLow; }
      }
      const entryT = ceilPip(top, pip);
      if (Number.isNaN(top) || cl <= entryT + closeMargin) { if (i === m + 1) break; continue; }
      // --- time gate (SPEC 5): the completed sequence must land inside the killzone, outside the news blackout
      const mod = pd.ci.mod[i];
      if (mod < win.sigFrom || isBlackout(mod)) break;
      // --- order (SPEC 6.6-6.8)
      let stopT = floorPip(E - (P.stopBufferPips + (dir < 0 ? P.askAllowancePips : 0)) * pip, pip);
      if (entryT - stopT < A.minStopPips * pip - 1e-9) stopT = entryT - A.minStopPips * pip;
      const risk = entryT - stopT;
      if (risk > A.maxStopPips * pip + 1e-9) break;
      let tpT = NaN, tpWhy = `${A.fixedR}R`;
      if (cfg.target === "2R") tpT = floorPip(entryT + A.fixedR * risk, pip);
      else {
        let hiSoFar = -Infinity;
        for (let k = day.first; k < sStart; k++) if (!p.roll[k]) hiSoFar = Math.max(hiSoFar, H(k));
        const cands: Array<[number, string]> = [[highOf(Y), "previous day"], [asia.n >= 8 ? highOf(asia) : NaN, "Asian range"], [lon && lon.n >= 12 ? highOf(lon) : NaN, "London session"], [hiSoFar, "today so far"]];
        for (const [lv, why] of cands) {
          const t = floorPip(lv - P.targetCushionPips * pip, pip);
          if (!(t >= entryT + A.minLiqR * risk - 1e-9) || t > entryT + A.maxLiqR * risk + 1e-9) continue;
          if (Number.isNaN(tpT) || t < tpT) { tpT = t; tpWhy = why; }
        }
        if (Number.isNaN(tpT)) break; // no nameable draw at a sensible distance: no trade
      }
      const px = (t: number) => roundPrice(pd.pair, dir * t);
      const tp = px(tpT), signalTime = b.end[i];
      const order: Order = {
        id: `SWP-${pd.pair}-${signalTime}-${dir > 0 ? "B" : "S"}`, pair: pd.pair, dir, kind: "limit",
        entry: px(entryT), stop: px(stopT), tp, signalTime,
        expireAt: nyTimeOnDay(day.key, win.expire),
        cancelIfBid: dir > 0 ? { above: tp } : { below: tp },
        flatAt: nyTimeOnDay(day.key, isFomcDay(day.key) ? 13 * 60 + 45 : 16 * 60),
        tag: `${win.id}:${pool.name}`, model: "A",
        info: {
          window: win.id, pool: pool.name, poolLevel: px(level), sweepExtreme: px(E), sweepTime: b.t[eIdx],
          gapTop: px(dir > 0 ? top : bottom), gapBottom: px(dir > 0 ? bottom : top), riskPips: Math.round(risk / pip * 10) / 10, target: tpWhy,
        },
      };
      if (!best || i < best.i) best = { i, order };
      break;
    }
  }
  return best;
}

export function generateSweep(pd: PairData, cfg: SweepCfg, from: number, to: number): Order[] {
  const p = prep(pd), b = pd.m15, out: Order[] = [];
  for (let di = 0; di < p.days.length; di++) {
    const day = p.days[di];
    if (b.end[day.last] <= from) continue;
    if (b.t[day.first] >= to) break;
    if (prevDay(p, di) < 0 || isNfpDay(day.key, dayOfWeek(day.key))) continue;
    for (const win of WINDOWS) {
      let pick: Found | null = null;
      for (const dir of [1, -1] as const) {
        if (cfg.bias === "candle" && biasAt(p, di, "candle", 0) !== dir) continue;
        const f = scan(pd, p, di, win, dir, cfg);
        if (!f) continue;
        if (cfg.bias === "h4" && biasAt(p, di, "h4", f.order.signalTime) !== dir) continue;
        if (!pick || f.i < pick.i) pick = f;
      }
      if (pick && pick.order.signalTime >= from && pick.order.signalTime < to) { pick.order.info!.bias = cfg.bias; out.push(pick.order); }
    }
  }
  return out;
}

export const SWEEP_FVG: ModelDef<SweepCfg> = {
  id: "A", name: "Sweep, shift, gap (ICT 2022 sequence on M15)",
  pairs: ["EURUSD", "GBPUSD", "AUDUSD", "USDJPY"],
  configs: {
    A1: { bias: "candle", gap: "any", target: "2R" },
    A2: { bias: "candle", gap: "any", target: "liquidity" },
    A3: { bias: "candle", gap: "discount", target: "2R" },
    A4: { bias: "candle", gap: "discount", target: "liquidity" },
    A5: { bias: "h4", gap: "any", target: "2R" },
    A6: { bias: "h4", gap: "any", target: "liquidity" },
    A7: { bias: "h4", gap: "discount", target: "2R" },
    A8: { bias: "h4", gap: "discount", target: "liquidity" },
  },
  lookbackDays: 30,
  generate: (pd, cfg, from, to) => generateSweep(pd, cfg, from, to),
};
