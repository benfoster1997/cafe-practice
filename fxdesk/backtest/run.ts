/**
 * run.ts - the only way results are produced. Node only.
 *
 *   node fxdesk/backtest/run.ts selftest
 *       Checks on real data that every model gives the SAME orders when it
 *       can only see the last 60 days of candles up to "now" as when it has
 *       all of history. That is at once the no-lookahead test and the proof
 *       that the live scanner (which holds a rolling window) matches the
 *       backtest.
 *   node fxdesk/backtest/run.ts run calibration
 *       Runs every pre-registered configuration under the raw and standard
 *       cost models and applies the SPEC section 9 pass marks.
 *   node fxdesk/backtest/run.ts run <validation|verdict> <config...>
 *       Sealed data: runs only the named configuration(s) that calibration
 *       made eligible. Refuses to run without a name.
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

/** SPEC 9, calibration: the pass marks, applied to one configuration's two cost runs. */
export function eligibility(raw: any, std: any): { eligible: boolean; fails: string[] } {
  const marks: Array<[string, (r: any) => boolean]> = [
    ["at least 150 trades", (r) => r.stats.n >= 150],
    ["average above 0R", (r) => r.stats.expectancyR > 0],
    ["profit factor at least 1.15", (r) => r.stats.profitFactor >= 1.15],
    ["at least 4 of 6 years positive", (r) => Object.values(r.byYear).filter((y: any) => y.totalR > 0).length >= 4],
    ["no more than 35% of rolling 12-month windows negative", (r) => r.rolling.total > 0 && r.rolling.negative / r.rolling.total <= 0.35],
    ["worst fall no more than 15%", (r) => r.stats.maxDrawdownPct <= 15],
  ];
  const fails = marks.filter(([, ok]) => !(ok(raw) && ok(std))).map(([name]) => name);
  return { eligible: fails.length === 0, fails };
}

const line = (c: string, cost: string, report: any) => {
  const s = report.stats, yrs: any[] = Object.values(report.byYear);
  console.log(`${c} ${cost.padEnd(8)} n=${String(s.n).padStart(4)} win=${String(s.winRatePct).padStart(5)}% exp=${s.expectancyR.toFixed(3).padStart(7)}R PF=${String(s.profitFactor).padStart(5)} totR=${String(s.totalR).padStart(8)} DD=${String(s.maxDrawdownR).padStart(6)}R/${String(s.maxDrawdownPct).padStart(5)}% t=${String(s.tStat).padStart(6)} ci=[${s.ci95[0]},${s.ci95[1]}] yrs+=${yrs.filter((y) => y.totalR > 0).length}/${yrs.length} roll-=${report.rolling.negative}/${report.rolling.total} /mo=${s.tradesPerMonth}`);
};

/**
 * Calibration runs every configuration. The two later parts are SEALED:
 * they run only for configurations named on the command line, which must be
 * the (at most one per plan) configurations that calibration made eligible.
 * The verdict adds the stress-cost run SPEC 9 requires.
 */
function runPhase(phase: string, only: string[]) {
  if (phase !== "calibration" && !only.length) {
    console.log(`"${phase}" is sealed. Name the configuration(s) that passed calibration, e.g. run ${phase} A1. As of the last calibration none did, so this should not be run.`);
    process.exit(2);
  }
  const [a, b] = PHASES[phase].map(utcDate);
  const u = loadUniverse(PAIRS);
  const costs = phase === "verdict" ? ["raw", "standard", "stress"] : ["raw", "standard"];
  const rows: any[] = [], verdicts: any[] = [];
  for (const m of MODELS) for (const c of Object.keys(m.configs)) {
    if (only.length && !only.includes(c)) continue;
    const by: Record<string, any> = {};
    for (const cost of costs) { by[cost] = run(m, c, u, a, b, COSTS[cost], DEFAULT_RAILS).report; rows.push(by[cost]); line(c, cost, by[cost]); }
    if (phase === "calibration") {
      const e = eligibility(by.raw, by.standard);
      verdicts.push({ config: c, ...e });
      // sensitivity only, never used for a decision: the same run with a balance large enough that lot rounding never bites
      const big = run(m, c, u, a, b, COSTS.standard, { ...DEFAULT_RAILS, startBalance: 1_000_000 }).report;
      big.cost = "standard, no lot-size limits"; rows.push(big);
      console.log(`   ${e.eligible ? "ELIGIBLE" : "not eligible: " + e.fails.join("; ")}  | without lot-size limits: n=${big.stats.n} exp=${big.stats.expectancyR}R PF=${big.stats.profitFactor} worst fall ${big.stats.maxDrawdownPct}%`);
    }
  }
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/${phase}.json`, JSON.stringify({ phase, from: PHASES[phase][0], to: PHASES[phase][1], rows, verdicts }, null, 1));
  if (phase === "calibration") console.log(`eligible: ${verdicts.filter((v) => v.eligible).map((v) => v.config).join(", ") || "none"}`);
}

function noise(phase: string, config: string, seeds = 5) {
  if (phase !== "calibration") console.log(`note: "${phase}" is sealed data; a noise run on it is only legitimate for a configuration that reached that stage.`);
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
else if (cmd === "run" && PHASES[x]) runPhase(x, process.argv.slice(4));
else if (cmd === "noise" && PHASES[x] && y) noise(x, y, z ? Number(z) : 5);
else { console.log("usage: run.ts selftest | run <calibration|validation|verdict> | noise <phase> <config> [seeds]"); process.exit(2); }
