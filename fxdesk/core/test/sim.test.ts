import { test } from "node:test";
import assert from "node:assert/strict";
import { makeBars, type Bars } from "../bars.ts";
import { simulate, DEFAULT_RAILS, type Order, type Rails } from "../sim.ts";
import { type CostModel, lotsForRisk, pipValuePerLot } from "../pairs.ts";

const utc = (iso: string): number => Date.parse(iso + "Z") / 1000;
const T0 = utc("2025-07-15T12:00:00"); // Tuesday 08:00 New York: liquid hours, spread multiplier 1

/** Costs chosen to make the arithmetic easy to check by hand. */
const COST: CostModel = {
  name: "test", spreadPips: { EURUSD: 1, GBPUSD: 1, USDJPY: 1, AUDUSD: 1 }, rolloverMult: 8, asiaMult: 1.5,
  commissionPipsRT: { EURUSD: 0.5, GBPUSD: 0.5, USDJPY: 0.5, AUDUSD: 0.5 }, slipPips: 0.2, limitThroughPips: 0.1, swapPipsPerNight: 0.5,
};
const RAILS: Rails = { ...DEFAULT_RAILS, startBalance: 10_000, manualDelaySec: 180, manageDelaySec: 300 };

type Row = [number, number, number, number]; // open, high, low, close (bid)
/** One-minute bars starting at T0. A number n in place of a row repeats the previous close flat for n minutes. */
function bars(rows: Array<Row | number>, start = T0, flatAt = 1.1): Bars {
  const t: number[] = [], o: number[] = [], h: number[] = [], l: number[] = [], c: number[] = [];
  let last = flatAt;
  for (const r of rows) {
    const add = (row: Row) => { t.push(start + t.length * 60); o.push(row[0]); h.push(row[1]); l.push(row[2]); c.push(row[3]); last = row[3]; };
    if (typeof r === "number") for (let k = 0; k < r; k++) add([last, last, last, last]); else add(r);
  }
  return makeBars(1, t, o, h, l, c);
}
/** GBPUSD flat at 1.25 for currency conversion, long enough to cover any test. */
const GBP = (n = 6000, start = T0) => bars([n], start, 1.25);

const buyLimit = (over: Partial<Order> = {}): Order => ({
  id: "o1", pair: "EURUSD", dir: 1, kind: "limit", entry: 1.1, stop: 1.098, tp: 1.104,
  signalTime: T0, expireAt: T0 + 4 * 3600, tag: "t", ...over,
});
const sellLimit = (over: Partial<Order> = {}): Order => ({
  id: "o2", pair: "EURUSD", dir: -1, kind: "limit", entry: 1.1, stop: 1.102, tp: 1.096,
  signalTime: T0, expireAt: T0 + 4 * 3600, tag: "t", ...over,
});
const run = (orders: Order[], eur: Bars, rails: Rails = RAILS, extra: Record<string, Bars> = {}) =>
  simulate(orders, { EURUSD: eur, GBPUSD: GBP(), ...extra }, COST, rails);

test("a buy limit fills on the ASK: the bid must trade a spread plus the through-margin below it", () => {
  // Spread is 1 pip, through is 0.1 pip: the bid must print 1.09989 or lower.
  const touchOnly = run([buyLimit()], bars([5, [1.1005, 1.1005, 1.0999, 1.1002], 30], T0, 1.1005));
  assert.equal(touchOnly.trades.length, 0, "bid 1.0999 means ask 1.1000: a touch, not a fill");
  const through = run([buyLimit()], bars([5, [1.1005, 1.1005, 1.09989, 1.1002], [1.1002, 1.1045, 1.1002, 1.1045], 5], T0, 1.1005));
  assert.equal(through.trades.length, 1);
  assert.equal(through.trades[0].entry, 1.1);
});

test("a sell limit touched but not traded through does not fill", () => {
  const r = run([sellLimit()], bars([5, [1.0995, 1.1, 1.0995, 1.0996], 30], T0, 1.0995));
  assert.equal(r.trades.length, 0);
  const r2 = run([sellLimit()], bars([5, [1.0995, 1.10001, 1.0995, 1.0996], 30], T0, 1.0995));
  assert.equal(r2.trades.length, 1);
});

test("stop first: a candle holding both the stop and the target is a loss", () => {
  const eur = bars([5, [1.1005, 1.1005, 1.0998, 1.1001], [1.1001, 1.1050, 1.0975, 1.1040], 5], T0, 1.1005);
  const r = run([buyLimit()], eur);
  assert.equal(r.trades.length, 1);
  assert.equal(r.trades[0].exits[0].reason, "stop");
  // stop 1.0980 minus 0.2 pip slip = 1.09798; 20.2 pips lost + 0.5 commission on a 20 pip risk
  assert.equal(r.trades[0].exits[0].price, 1.09798);
  assert.ok(Math.abs(r.trades[0].r - (-20.7 / 20)) < 1e-9);
});

test("the candle that fills an order can stop it out but can never pay it", () => {
  const paysSameBar = bars([5, [1.1005, 1.1060, 1.0998, 1.1050], 3, [1.1050, 1.1050, 1.1010, 1.1010], 20], T0, 1.1005);
  const r = run([buyLimit()], paysSameBar);
  assert.equal(r.trades.length, 1);
  assert.notEqual(r.trades[0].fillTime, r.trades[0].exits[0].time, "no exit on the filling candle");
  const stopsSameBar = bars([5, [1.1005, 1.1005, 1.0970, 1.0990], 20], T0, 1.1005);
  const r2 = run([buyLimit()], stopsSameBar);
  assert.equal(r2.trades[0].exits[0].reason, "stop");
  assert.equal(r2.trades[0].fillTime, r2.trades[0].exits[0].time);
});

test("a stop gapped over fills at the worse open price", () => {
  const eur = bars([5, [1.1005, 1.1005, 1.0998, 1.1001], [1.0960, 1.0965, 1.0955, 1.0960], 5], T0, 1.1005);
  const r = run([buyLimit()], eur);
  assert.equal(r.trades[0].exits[0].price, 1.09598); // open 1.0960 minus slip, not the 1.0980 stop
  assert.ok(r.trades[0].r < -2);
});

test("the human is slow: price trading through the entry in the first three minutes is a missed trade", () => {
  const eur = bars([1, [1.1005, 1.1005, 1.0995, 1.1001], [1.1001, 1.1045, 1.1001, 1.1045], 20], T0, 1.1005);
  const r = run([buyLimit()], eur);
  assert.equal(r.trades.length, 0);
  assert.equal(r.skipped[0].reason, "missed_before_live");
});

test("orders expire, and cancel when the invalidation level trades first", () => {
  const quiet = bars([400], T0, 1.1005);
  assert.equal(run([buyLimit({ expireAt: T0 + 3600 })], quiet).skipped[0].reason, "expired");
  const ranAway = bars([5, [1.1005, 1.1042, 1.1005, 1.1040], [1.1040, 1.1040, 1.0995, 1.1000], 20], T0, 1.1005);
  const r = run([buyLimit({ cancelIfBid: { above: 1.104 } })], ranAway);
  assert.equal(r.trades.length, 0);
  assert.equal(r.skipped[0].reason, "cancelled_level");
});

test("a winning long and a winning short are both charged the spread and commission", () => {
  // Long: buy 1.1000 (ask), take profit when the BID trades through 1.1040 -> +40 pips - 0.5 commission on 20 risk.
  const up = bars([5, [1.1005, 1.1005, 1.0998, 1.1001], [1.1001, 1.10411, 1.1001, 1.1040], 5], T0, 1.1005);
  const long = run([buyLimit()], up).trades[0];
  assert.equal(long.exits[0].reason, "tp");
  assert.ok(Math.abs(long.r - 39.5 / 20) < 1e-9);
  // Short: sell 1.1000 (bid); the target 1.0960 is bought back on the ASK (bid + 1 pip),
  // so the BID must trade through 1.0959 by the 0.1 pip margin.
  const notYet = bars([5, [1.0995, 1.10001, 1.0995, 1.0996], [1.0996, 1.0996, 1.0959, 1.0960], 5], T0, 1.0995);
  assert.equal(run([sellLimit()], notYet).trades[0].exits[0].reason, "data_end", "bid 1.0959 = ask 1.0960: touched, not through");
  const down = bars([5, [1.0995, 1.10001, 1.0995, 1.0996], [1.0996, 1.0996, 1.09589, 1.0959], 5], T0, 1.0995);
  const short = run([sellLimit()], down).trades[0];
  assert.equal(short.exits[0].reason, "tp");
  assert.ok(Math.abs(short.r - 39.5 / 20) < 1e-9);
});

test("a short is stopped when the ASK reaches the stop, a spread before the bid does", () => {
  const eur = bars([5, [1.0995, 1.10001, 1.0995, 1.0996], [1.0996, 1.1019, 1.0996, 1.1015], 5], T0, 1.0995);
  const r = run([sellLimit()], eur).trades[0];
  assert.equal(r.exits[0].reason, "stop");
  assert.equal(r.exits[0].price, 1.10202); // stop 1.1020 plus slip
});

test("lots are sized to 1% in real lot steps, and a trade too small for the minimum lot is skipped", () => {
  // 10,000 GBP, 1% = 100 GBP, 20 pip stop, EURUSD pip = 10 USD = 8 GBP per lot at GBPUSD 1.25 -> 0.625 -> 0.62 lots
  const pv = pipValuePerLot("EURUSD", "GBP", { GBPUSD: 1.25 });
  assert.equal(pv, 8);
  assert.equal(lotsForRisk(100, 20, pv), 0.62);
  const win = bars([5, [1.1005, 1.1005, 1.0998, 1.1001], [1.1001, 1.10411, 1.1001, 1.1040], 5], T0, 1.1005);
  const t = run([buyLimit()], win).trades[0];
  assert.equal(t.lots, 0.62);
  assert.ok(Math.abs(t.pnlMoney - 39.5 * 0.62 * 8) < 1e-6);
  // 500 GBP account: 1% = 5 GBP over a 100 pip stop needs 0.006 lots -> below the 0.01 minimum -> skipped
  const small = run([buyLimit({ stop: 1.09, tp: 1.12 })], win, { ...RAILS, startBalance: 500 });
  assert.equal(small.trades.length, 0);
  assert.equal(small.skipped[0].reason, "below_min_lot");
});

test("no more than two fills a day, whatever the strategy asks for", () => {
  const leg: Array<Row | number> = [5, [1.1005, 1.1005, 1.0998, 1.1001], [1.1001, 1.10411, 1.1001, 1.1040], [1.1040, 1.1040, 1.1005, 1.1005], 20];
  const eur = bars([...leg, ...leg, ...leg], T0, 1.1005);
  const step = 28 * 60;
  const orders = [0, 1, 2].map((k) => buyLimit({ id: "o" + k, signalTime: T0 + k * step, expireAt: T0 + k * step + 20 * 60 }));
  const r = run(orders, eur);
  assert.equal(r.trades.length, 2);
  assert.equal(r.skipped.filter((s) => s.reason === "daily_cap").length, 1);
});

test("after the daily loss limit no new trade is opened", () => {
  const lose: Array<Row | number> = [5, [1.1005, 1.1005, 1.0998, 1.1001], [1.1001, 1.1001, 1.0975, 1.1005], 20];
  const eur = bars([...lose, ...lose, ...lose], T0, 1.1005);
  const step = 27 * 60;
  const orders = [0, 1, 2].map((k) => buyLimit({ id: "o" + k, signalTime: T0 + k * step, expireAt: T0 + k * step + 20 * 60 }));
  const r = run(orders, eur, { ...RAILS, maxFillsPerDay: 5 });
  assert.equal(r.trades.length, 2, "two full losses of about 1% each reach the 2% limit");
  assert.equal(r.skipped.filter((s) => s.reason === "daily_loss_limit").length, 1);
});

test("one position per pair, and no doubling up on the same currency", () => {
  const fill: Array<Row | number> = [5, [1.1005, 1.1005, 1.0998, 1.1001], 60];
  const eur = bars(fill, T0, 1.1005);
  const second = buyLimit({ id: "b", signalTime: T0 + 600, entry: 1.1001, stop: 1.0985, tp: 1.105, kind: "limit" });
  const r = run([buyLimit({ id: "a" }), second], bars([5, [1.1005, 1.1005, 1.0998, 1.1001], 10, [1.1001, 1.1001, 1.0995, 1.1001], 60], T0, 1.1005));
  assert.equal(r.skipped.filter((s) => s.reason === "pair_busy").length, 1);
  // AUDUSD long while EURUSD long is open = short USD twice -> blocked
  const aud = bars([20, [0.6505, 0.6505, 0.6498, 0.6501], 60], T0, 0.6505);
  const audOrder: Order = { id: "c", pair: "AUDUSD", dir: 1, kind: "limit", entry: 0.65, stop: 0.648, tp: 0.654, signalTime: T0 + 600, expireAt: T0 + 7200, tag: "t" };
  const r2 = run([buyLimit({ id: "a" }), audOrder], eur, RAILS, { AUDUSD: aud });
  assert.equal(r2.skipped.filter((s) => s.reason === "currency_exposure").length, 1);
  const r3 = run([buyLimit({ id: "a" }), audOrder], eur, { ...RAILS, onePerCurrency: false }, { AUDUSD: aud });
  assert.equal(r3.skipped.filter((s) => s.reason === "currency_exposure").length, 0);
});

test("first target closes half; the hand-moved break-even stop only works after the delay", () => {
  const o = buyLimit({ tp1: 1.102, tp1Frac: 0.5, beAfterTp1: true });
  // fill, hit tp1, then dip to the entry one minute later (before the 5-minute delay) and recover to the final target
  const early = bars([5, [1.1005, 1.1005, 1.0998, 1.1001], [1.1001, 1.10211, 1.1001, 1.1020], [1.1020, 1.1020, 1.0999, 1.1010], 8, [1.1010, 1.10411, 1.1010, 1.1040], 5], T0, 1.1005);
  const a = run([o], early).trades[0];
  assert.deepEqual(a.exits.map((e) => e.reason), ["tp1", "tp"], "the stop had not been moved yet, so the dip did not close it");
  // same, but the dip comes after the delay: the remainder is closed at break-even
  const late = bars([5, [1.1005, 1.1005, 1.0998, 1.1001], [1.1001, 1.10211, 1.1001, 1.1020], 8, [1.1020, 1.1020, 1.0999, 1.1010], 5], T0, 1.1005);
  const b = run([o], late).trades[0];
  assert.deepEqual(b.exits.map((e) => e.reason), ["tp1", "breakeven"]);
  // half at +20 pips, half at -0.2 pips (slip), minus 0.5 commission, on a 20 pip risk
  assert.ok(Math.abs(b.r - (0.5 * 20 + 0.5 * -0.2 - 0.5) / 20) < 1e-6);
});

test("a position held across the New York close pays a night's financing", () => {
  const start = utc("2025-07-15T20:30:00"); // Tuesday 16:30 New York
  const eur = bars([5, [1.1005, 1.1005, 1.0998, 1.1001], 60, [1.1001, 1.10411, 1.1001, 1.1040], 5], start, 1.1005);
  const o = buyLimit({ signalTime: start, expireAt: start + 7200 });
  const r = simulate([o], { EURUSD: eur, GBPUSD: GBP(6000, start) }, COST, RAILS).trades[0];
  assert.equal(r.nightsHeld, 1);
  assert.ok(Math.abs(r.pnlPips - (40 - 0.5 - 0.5)) < 1e-9);
});
