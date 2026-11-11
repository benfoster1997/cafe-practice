/**
 * model.ts - what a trading model IS in this codebase.
 *
 * A model is a pure function from CLOSED candles to proposed orders. It
 * knows nothing about fills, costs or the account (core/sim.ts owns those)
 * and nothing about files or networks, so the very same function runs in
 * the backtest and in the live scanner. What is tested is what trades.
 */
import { type Bars, toClock, toNyAnchored } from "./bars.ts";
import { clockIndex } from "./ict.ts";
import { type Order } from "./sim.ts";

export interface PairData {
  pair: string;
  /** one-minute bars: used ONLY by the simulator for fills, never by a model (empty in the live scanner) */
  m1: Bars;
  m15: Bars; h1: Bars; h4: Bars; d1: Bars;
  /** New York minute-of-day, trading day and weekday for every M15 bar */
  ci: { mod: Int16Array; day: Int32Array; dow: Int8Array };
}

export type Universe = Record<string, PairData>;

export interface ModelDef<C> {
  id: string;
  name: string;
  pairs: string[];
  /** every pre-registered configuration, by name */
  configs: Record<string, C>;
  /** trading days of history a signal can depend on (the live scanner keeps more than this) */
  lookbackDays: number;
  /**
   * Orders whose signal time falls in [fromSec, toSec), from candles closed
   * by each signal time. Reading any later candle is a bug; the prefix test
   * in backtest/run.ts checks for it on real data.
   */
  generate(pd: PairData, cfg: C, fromSec: number, toSec: number, all: Universe): Order[];
}

export function frames(pair: string, m1: Bars, m15?: Bars): PairData {
  const f15 = m15 ?? toClock(m1, 15);
  return { pair, m1, m15: f15, h1: toClock(f15, 60), h4: toNyAnchored(f15, 4), d1: toNyAnchored(f15, 24), ci: clockIndex(f15) };
}
