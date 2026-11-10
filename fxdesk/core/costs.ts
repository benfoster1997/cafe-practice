/**
 * costs.ts - the cost assumptions every backtest result is quoted under.
 *
 * Two account types, both set on the pessimistic side of what a UK retail
 * trader is typically quoted in liquid hours. A result must survive BOTH.
 * These are assumptions until the owner's own broker specification is in
 * hand; the figures are then replaced by his, never by better ones.
 *
 * RAW: tight spread plus commission (about 7 USD per lot round trip,
 *   expressed here in pips of each pair).
 * STANDARD: no commission, the broker's mark-up is inside a wider spread.
 * STRESS: the standard account with everything half as bad again - the
 *   "what if my broker is worse than I think" test.
 */
import { type CostModel } from "./pairs.ts";

export const RAW: CostModel = {
  name: "raw",
  spreadPips: { EURUSD: 0.3, USDJPY: 0.4, GBPUSD: 0.6, AUDUSD: 0.5, USDCAD: 0.7, USDCHF: 0.7, NZDUSD: 0.8 },
  commissionPipsRT: { EURUSD: 0.7, USDJPY: 1.0, GBPUSD: 0.7, AUDUSD: 0.7, USDCAD: 1.0, USDCHF: 0.6, NZDUSD: 0.7 },
  rolloverMult: 8, asiaMult: 1.5, slipPips: 0.3, limitThroughPips: 0.1, swapPipsPerNight: 0.6,
};

export const STANDARD: CostModel = {
  name: "standard",
  spreadPips: { EURUSD: 1.1, USDJPY: 1.3, GBPUSD: 1.5, AUDUSD: 1.3, USDCAD: 1.7, USDCHF: 1.6, NZDUSD: 1.8 },
  commissionPipsRT: { EURUSD: 0, USDJPY: 0, GBPUSD: 0, AUDUSD: 0, USDCAD: 0, USDCHF: 0, NZDUSD: 0 },
  rolloverMult: 5, asiaMult: 1.4, slipPips: 0.3, limitThroughPips: 0.1, swapPipsPerNight: 0.6,
};

export const STRESS: CostModel = {
  name: "stress",
  spreadPips: Object.fromEntries(Object.entries(STANDARD.spreadPips).map(([k, v]) => [k, Math.round(v * 15) / 10])),
  commissionPipsRT: STANDARD.commissionPipsRT,
  rolloverMult: 6, asiaMult: 1.6, slipPips: 0.6, limitThroughPips: 0.2, swapPipsPerNight: 1.0,
};

export const COSTS: Record<string, CostModel> = { raw: RAW, standard: STANDARD, stress: STRESS };
