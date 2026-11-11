/**
 * run.ts - the only way results are produced. Node only.
 *
 *   node fxdesk/backtest/run.ts selftest
 *       Checks on real data that every model gives the SAME orders when it
 *       can only see the last 60 days of candles up to "now" as when it has
 *       all of history. That is at once the no-lookahead test and the proof
 *       that the live scanner (which holds a rolling window) matches the
 *       backtest.
 *   node fxdesk/backtest/run.ts run <phase>
 *       Runs every pre-registered configuration under the raw and standard
 *       cost models over one phase of the data split in SPEC section 9.
 *   node fxdesk/backtest/run.ts noise <phase> <config> [seeds]
 *       Re-runs one configuration with signals generated from a noisy
 *       second-vendor view of the candles (fills stay on the real feed).
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { loadUniverse, run, noisyUniverse, utcDate, generateAll, frames, type Universe, type ModelDef } from "./harness.ts";
import { makeBars, emptyBars, lowerBound } from "../core/bars.ts";
import { COSTS } from "../core/costs.ts";
import { DEFAULT_RAILS } from "../core/sim.ts";
import { SWEEP_FVG } from "../core/models/sweepFvg.ts";
import { OTE } from "../core/models/ote.ts";

export const MODELS: Array<ModelDef<any>> = [SWEEP_FVG, OTE];
export const PHASES: Record<string, [string, string]> = {
  calibration: ["2015-01-05", "2021-01-01"],
  validation: ["2021-01-01", "2023-07-01"],
  verdict: ["2023-07-01", "2026-11-01"],
};
const PAIRS = ["EURUSD", "GBPUSD", "AUDUSD", "USDJPY"];
const OUT = "fxdesk/research/results";

function findConfig(name: string): [ModelDef<any>, string] {
  for (const m of MODELS) if (m.configs[name]) return [m, name];
  throw new Error(`unknown config ${name}`);
}

function windowUniverse(u: Universe, T: number, days = 60): Universe {
  const out: Universe = {};
  for (const [pair, pd] of Object.entries(u)) {
    const b = pd.m15;
    const lo = lowerBound(b, T - days * 86400);
    let hi = lowerBound(b, T); // bars opening before T ...
    while (hi > lo && b.end[hi - 1] > T) hi--; // ... and closed by T
    const s = (a: Float64Array) => a.subarray(lo, hi);
    out[pair] = frames(pair, emptyBars(1, 0), makeBars(15, s(b.t), s(b.o), s(b.h), s(b.l), s(b.c)));
  }
  return out;
}

const key = (o: any) => JSON.stringify([o.id, o.entry, o.stop, o.tp, o.tp1 ?? null, o.expireAt, o.flatAt, o.cancelIfBid, o.tag]);

function selftest(samples = 160) {
  const u = loadUniverse(PAIRS);
  const [a, b] = PHASES.calibration.map(utcDate);
  let seed = 12345;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  let bad = 0, compared = 0;
  const full: Record<string, any[]> = {};
  for (const m of MODELS) for (const c of Object.keys(m.configs)) full[c] = generateAll(m, m.configs[c], u, a, b);
  for (let s = 0; s < samples; s++) {
    const T = Math.floor((a + 90 * 86400 + rnd() * (b - a - 100 * 86400)) / 900) * 900;
    const w = windowUniverse(u, T);
    for (const m of MODELS) for (const c of Object.keys(m.configs)) {
      const from = T - 2 * 86400;
      const want = full[c].filter((o) => o.signalTime >= from && o.signalTime <= T).map(key).sort();
      const got = generateAll(m, m.configs[c], w, from, T + 1).map(key).sort();
      compared += want.length;
      if (JSON.stringify(want) !== JSON.stringify(got)) {
        bad++;
        if (bad <= 5) console.log(`MISMATCH ${c} at ${new Date(T * 1000).toISOString()}\n  full:   ${want.join("\n          ")}\n  window: ${got.join("\n          ")}`);
      }
    }
  }
  console.log(`selftest: ${samples} cut times x ${Object.keys(full).length} configs, ${compared} orders compared, ${bad} mismatches`);
  console.log("orders per config over calibration:", Object.fromEntries(Object.entries(full).map(([k, v]) => [k, v.length])));
  if (bad) process.exit(1);
}

function runPhase(phase: string) {
  const [a, b] = PHASES[phase].map(utcDate);
  const u = loadUniverse(PAIRS);
  const rows: any[] = [];
  for (const m of MODELS) for (const c of Object.keys(m.configs)) for (const cost of ["raw", "standard"]) {
    const { report } = run(m, c, u, a, b, COSTS[cost], DEFAULT_RAILS);
    rows.push(report);
    const s = report.stats;
    const yrs = Object.values(report.byYear);
    console.log(`${c} ${cost.padEnd(8)} n=${String(s.n).padStart(4)} win=${String(s.winRatePct).padStart(5)}% exp=${s.expectancyR.toFixed(3).padStart(7)}R PF=${String(s.profitFactor).padStart(5)} totR=${String(s.totalR).padStart(8)} DD=${String(s.maxDrawdownR).padStart(6)}R/${String(s.maxDrawdownPct).padStart(5)}% t=${String(s.tStat).padStart(6)} ci=[${s.ci95[0]},${s.ci95[1]}] yrs+=${yrs.filter((y) => y.totalR > 0).length}/${yrs.length} roll-=${report.rolling.negative}/${report.rolling.total} /mo=${s.tradesPerMonth} hold=${s.avgHoldHours}h`);
  }
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/${phase}.json`, JSON.stringify(rows, null, 1));
}

function noise(phase: string, config: string, seeds = 5) {
  const [a, b] = PHASES[phase].map(utcDate);
  const u = loadUniverse(PAIRS);
  const [m, c] = findConfig(config);
  const rows: any[] = [];
  for (const cost of ["raw", "standard"]) {
    const base = run(m, c, u, a, b, COSTS[cost]).report.stats;
    console.log(`${c} ${cost} clean : n=${base.n} exp=${base.expectancyR}R PF=${base.profitFactor}`);
    for (let s = 1; s <= seeds; s++) {
      const st = run(m, c, u, a, b, COSTS[cost], DEFAULT_RAILS, noisyUniverse(u, s)).report.stats;
      rows.push({ config: c, cost, seed: s, n: st.n, expectancyR: st.expectancyR, profitFactor: st.profitFactor });
      console.log(`${c} ${cost} noise${s}: n=${st.n} exp=${st.expectancyR}R PF=${st.profitFactor}`);
    }
    rows.push({ config: c, cost, seed: 0, n: base.n, expectancyR: base.expectancyR, profitFactor: base.profitFactor });
  }
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/noise-${phase}-${config}.json`, JSON.stringify(rows, null, 1));
}

const [cmd, x, y, z] = process.argv.slice(2);
if (cmd === "selftest") selftest(x ? Number(x) : 160);
else if (cmd === "run" && PHASES[x]) runPhase(x);
else if (cmd === "noise" && PHASES[x] && y) noise(x, y, z ? Number(z) : 5);
else { console.log("usage: run.ts selftest | run <calibration|validation|verdict> | noise <phase> <config> [seeds]"); process.exit(2); }
