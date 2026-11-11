/**
 * Model B - "Optimal trade entry" (SPEC section 7).
 *
 * ICT's Charter Model 11 day trade, the plan he wrote as a hand-placed
 * limit order: with a daily bias, wait in a killzone for the day's move in
 * that direction to pull back, and rest a limit order at the 62%
 * retracement of the move "plus five pips"; 20-pip stop, 30-pip target,
 * stop to break-even at +20.
 *
 * What he left to judgement, and how it is fixed here (all tagged OURS):
 * the "move" is the leg from the day's low since midnight New York to the
 * highest high made after it (mirror for shorts), it must be at least 30
 * pips, and the order goes in as soon as one candle has failed to make a
 * new high.
 */
import { type Order } from "../sim.ts";
import { type ModelDef, type PairData } from "../model.ts";
import { pipSize, roundPrice } from "../pairs.ts";
import { P, prep, prevDay, biasAt, WINDOWS, isBlackout, idxAt, nyTimeOnDay, ceilPip, floorPip, type BiasKind, type Prep, type Win } from "./common.ts";
import { isFomcDay, isNfpDay } from "./calendar.ts";
import { dayOfWeek } from "./sweepFvg.ts";

export interface OteCfg { bias: BiasKind; exits: "ict20-30" | "structure" }

/** Model B parameters (tags in SPEC 7.8). */
export const B = {
  /** retracement level - ICT-VERBATIM (Charter Models 1 and 11) */
  retrace: 0.62,
  /** entry is this many pips nearer to price than the 62% level - ICT-VERBATIM ("plus five pips") */
  entryOffsetPips: 5,
  /** smallest leg worth trading (pips) - OURS, echoing his "expansion of over 30 pips" */
  minLegPips: 30,
  /** "ict20-30": fixed stop, target and break-even trigger - ICT-VERBATIM (Charter Model 11) */
  stopPips: 20, targetPips: 30, breakEvenAtPips: 20,
  /** "structure": stop this far beyond the leg's start - ICT-VERBATIM distance (Charter Model 1), applied to our leg */
  structStopPips: 5,
  /** structure exits: reward as a multiple of risk - OURS (keeps Model 11's 30:20) */
  structR: 1.5,
  /** structure exits: stop distance allowed (pips) - OURS */
  minStopPips: 10, maxStopPips: 35,
};

function scan(pd: PairData, p: Prep, di: number, win: Win, dir: 1 | -1, cfg: OteCfg, seen: Set<number>, out: Order[]): void {
  const b = pd.m15, pip = pipSize(pd.pair), day = p.days[di];
  const H = (i: number) => (dir > 0 ? b.h[i] : -b.l[i]);
  const L = (i: number) => (dir > 0 ? b.l[i] : -b.h[i]);
  const C = (i: number) => dir * b.c[i];
  const iMid = idxAt(pd, day, 0), i0 = idxAt(pd, day, win.sigFrom), iEnd = idxAt(pd, day, win.sigTo);
  if (iMid > day.last) return;
  // running low since midnight, and the highest high made after it
  let a = -1, lowV = Infinity, hi = -1, highV = -Infinity;
  for (let i = iMid; i < iEnd; i++) {
    if (p.roll[i]) continue;
    // state BEFORE this candle is what the retracement test uses; then fold the candle in
    const isRetrace = hi >= 0 && H(i) < highV;
    if (i >= i0 && isRetrace && L(i) >= lowV && !seen.has(hi) && !isBlackout(pd.ci.mod[i])) {
      const leg = highV - lowV;
      if (leg >= B.minLegPips * pip - 1e-9) {
        const entryT = ceilPip(highV - B.retrace * leg + B.entryOffsetPips * pip, pip);
        // already traded there since the high: the retracement has come and gone
        let reached = false;
        for (let k = hi + 1; k <= i; k++) if (!p.roll[k] && L(k) <= entryT + P.closeMarginPips * pip) { reached = true; break; }
        seen.add(hi);
        if (!reached && C(i) > entryT + P.closeMarginPips * pip) {
          let stopT: number, tpT: number, tp1T = NaN;
          if (cfg.exits === "ict20-30") {
            stopT = entryT - B.stopPips * pip; tpT = entryT + B.targetPips * pip; tp1T = entryT + B.breakEvenAtPips * pip;
          } else {
            stopT = floorPip(lowV - (B.structStopPips + (dir < 0 ? P.askAllowancePips : 0)) * pip, pip);
            if (entryT - stopT < B.minStopPips * pip - 1e-9) stopT = entryT - B.minStopPips * pip;
            tpT = floorPip(entryT + B.structR * (entryT - stopT), pip);
          }
          const risk = entryT - stopT;
          if (cfg.exits === "ict20-30" || risk <= B.maxStopPips * pip + 1e-9) {
            const px = (t: number) => roundPrice(pd.pair, dir * t);
            const signalTime = b.end[i], legEnd = px(highV + P.closeMarginPips * pip);
            const o: Order = {
              id: `OTE-${pd.pair}-${signalTime}-${dir > 0 ? "B" : "S"}`, pair: pd.pair, dir, kind: "limit",
              entry: px(entryT), stop: px(stopT), tp: px(tpT), signalTime,
              expireAt: nyTimeOnDay(day.key, win.expire),
              // a new extreme means the leg has moved on: this order is withdrawn and a fresh one follows
              cancelIfBid: dir > 0 ? { above: legEnd } : { below: legEnd },
              flatAt: nyTimeOnDay(day.key, isFomcDay(day.key) ? 13 * 60 + 45 : 16 * 60),
              tag: win.id, model: "B",
              info: { window: win.id, legFrom: px(lowV), legTo: px(highV), legPips: Math.round(leg / pip * 10) / 10, legFromTime: b.t[a], legToTime: b.t[hi], riskPips: Math.round(risk / pip * 10) / 10, bias: cfg.bias },
            };
            if (!Number.isNaN(tp1T)) { o.tp1 = px(tp1T); o.tp1Frac = 0; o.beAfterTp1 = true; }
            out.push(o);
          }
        }
      }
    }
    if (L(i) < lowV) { lowV = L(i); a = i; hi = -1; highV = -Infinity; }
    else if (H(i) > highV) { highV = H(i); hi = i; }
  }
}

export function generateOte(pd: PairData, cfg: OteCfg, from: number, to: number): Order[] {
  const p = prep(pd), b = pd.m15, out: Order[] = [];
  for (let di = 0; di < p.days.length; di++) {
    const day = p.days[di];
    if (b.end[day.last] <= from) continue;
    if (b.t[day.first] >= to) break;
    if (prevDay(p, di) < 0 || isNfpDay(day.key, dayOfWeek(day.key))) continue;
    const found: Order[] = [];
    for (const dir of [1, -1] as const) {
      if (cfg.bias === "candle" && biasAt(p, di, "candle", 0) !== dir) continue;
      const seen = new Set<number>();
      for (const win of WINDOWS) scan(pd, p, di, win, dir, cfg, seen, found);
    }
    for (const o of found) {
      if (cfg.bias === "h4" && biasAt(p, di, "h4", o.signalTime) !== o.dir) continue;
      if (o.signalTime >= from && o.signalTime < to) out.push(o);
    }
  }
  return out.sort((x, y) => x.signalTime - y.signalTime);
}

export const OTE: ModelDef<OteCfg> = {
  id: "B", name: "Optimal trade entry (ICT Charter Model 11)",
  pairs: ["EURUSD", "GBPUSD", "AUDUSD", "USDJPY"],
  configs: {
    B1: { bias: "candle", exits: "ict20-30" },
    B2: { bias: "candle", exits: "structure" },
    B3: { bias: "h4", exits: "ict20-30" },
    B4: { bias: "h4", exits: "structure" },
  },
  lookbackDays: 30,
  generate: (pd, cfg, from, to) => generateOte(pd, cfg, from, to),
};
