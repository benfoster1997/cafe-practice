/**
 * harness.ts - runs a model over history and scores it. Node only.
 *
 * A MODEL is a pure function from closed candles to proposed orders. It
 * knows nothing about fills, costs or the account; those belong to
 * core/sim.ts. The same model function is what the live scanner calls, so
 * what is tested here is what trades.
 */
import { loadM1 } from "../core/load.ts";
import { type Bars, toClock, toNyAnchored, makeBars } from "../core/bars.ts";
import { clockIndex } from "../core/ict.ts";
import { pipSize, type CostModel } from "../core/pairs.ts";
import { simulate, DEFAULT_RAILS, type Order, type Rails, type SimResult } from "../core/sim.ts";
import { summarize, byYear, byPair, byExit, rollingWindows, type Stats } from "../core/metrics.ts";

export interface PairData {
  pair: string;
  /** one-minute bars: used ONLY by the simulator for fills, never by a model */
  m1: Bars;
  m15: Bars; h1: Bars; h4: Bars; d1: Bars;
  /** New York minute-of-day, trading day and weekday for every M15 bar */
  ci: { mod: Int16Array; day: Int32Array; dow: Int8Array };
}

export type Universe = Record<string, PairData>;

export interface ModelDef<C> {
  id: string;
  name: string;
  /** pairs the model trades */
  pairs: string[];
  /** every pre-registered configuration, by name */
  configs: Record<string, C>;
  /** trading days of history a signal can depend on (the live scanner keeps at least this much) */
  lookbackDays: number;
  /**
   * Propose orders for one pair from candles that have closed, for signal
   * times in [fromSec, toSec). `all` gives read access to other pairs'
   * closed candles (for correlation rules); the same no-lookahead duty applies.
   */
  generate(pd: PairData, cfg: C, fromSec: number, toSec: number, all: Universe): Order[];
}

export function frames(pair: string, m1: Bars, m15?: Bars): PairData {
  const f15 = m15 ?? toClock(m1, 15);
  return { pair, m1, m15: f15, h1: toClock(f15, 60), h4: toNyAnchored(f15, 4), d1: toNyAnchored(f15, 24), ci: clockIndex(f15) };
}

export function loadUniverse(pairs: string[]): Universe {
  const u: Universe = {};
  for (const p of pairs) u[p] = frames(p, loadM1(p));
  return u;
}

/* ------------------------------------------------------------ feed noise */

function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/**
 * A copy of the universe whose M15 candles (and everything built from
 * them) are seen through a different data vendor: each candle's high and
 * low moved by noise shaped like the measured difference between two real
 * feeds (fxdesk/research/reports/measured-feed-differences.md): usually a
 * few tenths of a pip, about one candle in eight more than a pip, a few
 * percent 2-4 pips, plus a constant offset. The one-minute bars used for
 * FILLS are untouched: the scanner sees one feed, the broker fills on
 * another, exactly as it will be live.
 */
export function noisyUniverse(u: Universe, seed: number, offsetPips = 0.3): Universe {
  const out: Universe = {};
  let s = seed;
  for (const [pair, pd] of Object.entries(u)) {
    const r = rng(s++ * 7919 + 13);
    const pip = pipSize(pair), b = pd.m15;
    const gauss = () => { let x = 0; for (let k = 0; k < 6; k++) x += r(); return (x - 3) / Math.sqrt(0.5); }; // approx N(0,1)
    const noise = () => {
      const u1 = r();
      if (u1 < 0.85) return gauss() * 0.45;
      if (u1 < 0.97) return (r() < 0.5 ? -1 : 1) * (1 + r());
      return (r() < 0.5 ? -1 : 1) * (2 + 2 * r());
    };
    const o = new Float64Array(b.n), h = new Float64Array(b.n), l = new Float64Array(b.n), c = new Float64Array(b.n);
    for (let i = 0; i < b.n; i++) {
      const off = offsetPips * pip;
      o[i] = b.o[i] + off + gauss() * 0.3 * pip;
      c[i] = b.c[i] + off + gauss() * 0.3 * pip;
      h[i] = Math.max(b.h[i] + off + noise() * pip, o[i], c[i]);
      l[i] = Math.min(b.l[i] + off + noise() * pip, o[i], c[i]);
    }
    out[pair] = frames(pair, pd.m1, makeBars(15, b.t, o, h, l, c));
  }
  return out;
}

/* --------------------------------------------------------------- running */

export interface RunReport {
  model: string; config: string; cost: string; from: string; to: string;
  orders: number;
  stats: Stats;
  byYear: ReturnType<typeof byYear>;
  byPair: ReturnType<typeof byPair>;
  byExit: ReturnType<typeof byExit>;
  rolling: { negative: number; total: number };
  skipped: Record<string, number>;
  endBalance: number;
}

const iso = (t: number) => new Date(t * 1000).toISOString().slice(0, 10);

export function generateAll<C>(model: ModelDef<C>, cfg: C, signalUniverse: Universe, fromSec: number, toSec: number): Order[] {
  const orders: Order[] = [];
  for (const p of model.pairs) if (signalUniverse[p]) orders.push(...model.generate(signalUniverse[p], cfg, fromSec, toSec, signalUniverse));
  return orders.sort((a, b) => a.signalTime - b.signalTime || a.pair.localeCompare(b.pair));
}

export function run<C>(model: ModelDef<C>, configName: string, fillUniverse: Universe, fromSec: number, toSec: number, cost: CostModel, rails: Rails = DEFAULT_RAILS, signalUniverse: Universe = fillUniverse): { report: RunReport; sim: SimResult; orders: Order[] } {
  const cfg = model.configs[configName];
  if (cfg === undefined) throw new Error(`unknown config ${configName} for ${model.id}`);
  const orders = generateAll(model, cfg, signalUniverse, fromSec, toSec);
  const m1: Record<string, Bars> = {};
  for (const [p, d] of Object.entries(fillUniverse)) m1[p] = d.m1;
  const sim = simulate(orders, m1, cost, rails);
  const skipped: Record<string, number> = {};
  for (const s of sim.skipped) skipped[s.reason] = (skipped[s.reason] ?? 0) + 1;
  const roll = rollingWindows(sim.trades, 12, 3);
  const report: RunReport = {
    model: model.id, config: configName, cost: cost.name, from: iso(fromSec), to: iso(toSec), orders: orders.length,
    stats: summarize(sim.trades, rails.startBalance), byYear: byYear(sim.trades), byPair: byPair(sim.trades), byExit: byExit(sim.trades),
    rolling: { negative: roll.negative, total: roll.total }, skipped, endBalance: Math.round(sim.endBalance * 100) / 100,
  };
  return { report, sim, orders };
}

export const utcDate = (s: string): number => Date.parse(s + "T00:00:00Z") / 1000;
