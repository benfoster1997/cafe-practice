/**
 * pairs.ts - the instruments, their arithmetic, and what trading them costs.
 */

export type Pair = "EURUSD" | "GBPUSD" | "USDJPY" | "AUDUSD" | "USDCAD" | "USDCHF" | "NZDUSD";

export const PAIRS: Pair[] = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "USDCHF", "NZDUSD"];

/** One pip in price terms. */
export const pipSize = (pair: string): number => (pair.endsWith("JPY") ? 0.01 : 0.0001);
/** Decimal places the broker quotes (fractional-pip pricing). */
export const digits = (pair: string): number => (pair.endsWith("JPY") ? 3 : 5);
export const roundPrice = (pair: string, price: number): number => {
  const f = pair.endsWith("JPY") ? 1e3 : 1e5;
  return Math.round(price * f) / f;
};
export const baseOf = (pair: string): string => pair.slice(0, 3);
export const quoteOf = (pair: string): string => pair.slice(3, 6);

/** Units of base currency in one standard lot. */
export const CONTRACT = 100_000;

/**
 * Value of ONE PIP on ONE LOT, in the account currency.
 * `rates` holds current mid prices for whatever conversions are needed;
 * for a GBP account that is GBPUSD plus the USD-base pairs.
 * Returns NaN if a needed rate is missing, so a caller can refuse to size
 * a trade rather than size it wrongly.
 */
export function pipValuePerLot(pair: string, accountCcy: string, rates: Record<string, number>): number {
  const quote = quoteOf(pair);
  const pipInQuote = pipSize(pair) * CONTRACT; // e.g. 10 USD, or 1000 JPY
  // quote currency -> USD
  let usd: number;
  if (quote === "USD") usd = pipInQuote;
  else {
    const r = rates["USD" + quote]; // USDJPY, USDCAD, USDCHF
    if (!(r > 0)) return NaN;
    usd = pipInQuote / r;
  }
  if (accountCcy === "USD") return usd;
  // USD -> account currency
  const direct = rates[accountCcy + "USD"]; // GBPUSD, EURUSD
  if (direct > 0) return usd / direct;
  const inverse = rates["USD" + accountCcy];
  if (inverse > 0) return usd * inverse;
  return NaN;
}

/**
 * Lot size that risks `riskMoney` over `stopPips`, floored to the broker's
 * lot step. Returns 0 when even the minimum lot would risk more than asked:
 * the trade is then SKIPPED, never rounded up (rounding up is how small
 * accounts quietly take 3% risks).
 */
export function lotsForRisk(riskMoney: number, stopPips: number, pipValueLot: number, lotStep = 0.01, minLot = 0.01): number {
  if (!(stopPips > 0) || !(pipValueLot > 0) || !(riskMoney > 0)) return 0;
  const raw = riskMoney / (stopPips * pipValueLot);
  const steps = Math.floor(raw / lotStep + 1e-9);
  const lots = Math.round(steps * lotStep * 100) / 100;
  return lots >= minLot ? lots : 0;
}

/**
 * Trading costs, deliberately on the pessimistic side of a retail account.
 *
 *  - spreadPips: the usual spread in liquid hours.
 *  - Around the 17:00 New York rollover spreads blow out for an hour or so,
 *    and they are wider through the Asian session; both are multipliers.
 *  - commissionPipsRT: round-trip commission expressed in pips (a raw-spread
 *    account). A "standard" account has zero commission and a wider spread;
 *    the total is similar, and the backtest is run under both.
 *  - slipPips: paid on every stop-loss exit and every market or stop entry.
 *  - limitThroughPips: a limit order or take-profit counts as filled only if
 *    price trades THROUGH it by this much. A touch is not a fill.
 *  - swapPipsPerNight: charged for each 17:00 New York the position is open
 *    across (three times on a Wednesday, as brokers do).
 */
export interface CostModel {
  name: string;
  spreadPips: Record<string, number>;
  rolloverMult: number;
  asiaMult: number;
  commissionPipsRT: Record<string, number>;
  slipPips: number;
  limitThroughPips: number;
  swapPipsPerNight: number;
}
