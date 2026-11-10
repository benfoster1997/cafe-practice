import { test } from "node:test";
import assert from "node:assert/strict";
import { makeBars } from "../bars.ts";
import { swings, fvgAt, retrace, positionInRange, clockIndex, sessionRange, rangeOf } from "../ict.ts";

const utc = (iso: string): number => Date.parse(iso + "Z") / 1000;
type Row = [number, number, number, number];
const mk = (rows: Row[], start = utc("2025-07-14T12:00:00"), minutes = 15) =>
  makeBars(minutes, rows.map((_, i) => start + i * minutes * 60), rows.map((r) => r[0]), rows.map((r) => r[1]), rows.map((r) => r[2]), rows.map((r) => r[3]));

test("a swing high is a candle with a lower high either side, known one bar later", () => {
  const b = mk([[1, 1.2, 0.9, 1.1], [1.1, 1.5, 1.0, 1.4], [1.4, 1.45, 1.2, 1.3], [1.3, 1.35, 1.1, 1.2]]);
  const s = swings(b).filter((x) => x.kind === "high");
  assert.equal(s.length, 1);
  assert.equal(s[0].i, 1);
  assert.equal(s[0].knownAt, 2);
  assert.equal(s[0].price, 1.5);
});

test("equal highs are not a swing (strict inequality)", () => {
  const b = mk([[1, 1.2, 0.9, 1.1], [1.1, 1.5, 1.0, 1.4], [1.4, 1.5, 1.2, 1.3], [1.3, 1.35, 1.1, 1.2]]);
  assert.equal(swings(b).filter((x) => x.kind === "high").length, 0);
});

test("fair value gap: candle 1's high below candle 3's low, edges on the wicks", () => {
  const b = mk([[1.0, 1.01, 0.99, 1.005], [1.005, 1.05, 1.004, 1.045], [1.045, 1.06, 1.03, 1.055]]);
  const g = fvgAt(b, 2)!;
  assert.equal(g.dir, 1);
  assert.equal(g.low, 1.01);
  assert.equal(g.high, 1.03);
  assert.ok(Math.abs(g.mid - 1.02) < 1e-12);
  assert.equal(fvgAt(b, 2, 0.05), null, "smaller than the minimum size");
  const none = mk([[1.0, 1.01, 0.99, 1.005], [1.005, 1.02, 1.0, 1.015], [1.015, 1.03, 1.005, 1.02]]);
  assert.equal(fvgAt(none, 2), null);
  const bear = mk([[1.05, 1.06, 1.04, 1.045], [1.045, 1.046, 1.0, 1.005], [1.005, 1.02, 0.99, 1.0]]);
  const gb = fvgAt(bear, 2)!;
  assert.equal(gb.dir, -1);
  assert.equal(gb.low, 1.02);
  assert.equal(gb.high, 1.04);
});

test("retracement and premium/discount arithmetic", () => {
  assert.ok(Math.abs(retrace(1.1, 1.2, 0.62) - 1.138) < 1e-12); // 62% back from 1.2 toward 1.1
  assert.ok(Math.abs(retrace(1.2, 1.1, 0.62) - 1.162) < 1e-12); // down-leg: 62% back up
  assert.ok(Math.abs(positionInRange(1.15, 1.1, 1.2) - 0.5) < 1e-9, "equilibrium");
  assert.ok(positionInRange(1.18, 1.1, 1.2) > 0.5, "premium");
  assert.ok(positionInRange(1.12, 1.1, 1.2) < 0.5, "discount");
});

test("a session range cannot be read until the session is over", () => {
  // M15 bars from 19:00 New York Sunday (23:00 UTC in July) to 02:00 New York
  const start = utc("2025-07-13T23:00:00");
  const rows: Row[] = [];
  for (let i = 0; i < 28; i++) rows.push([1.1, 1.1 + 0.0001 * (i + 1), 1.1 - 0.0001 * (i + 1), 1.1]);
  const b = mk(rows, start);
  const ci = clockIndex(b);
  const asiaStart = 19 * 60, asiaEnd = 0;
  // bar 18 opens 23:30 New York: the 19:00-00:00 session still has the 23:45 bar to come
  assert.equal(sessionRange(b, ci, 18, asiaStart, asiaEnd), null);
  // bar 19 opens 23:45 and closes at 00:00: the session is over at its close
  const r = sessionRange(b, ci, 19, asiaStart, asiaEnd)!;
  assert.equal(r.first, 0);
  assert.equal(r.last, 19);
  assert.ok(Math.abs(r.high - (1.1 + 0.0001 * 20)) < 1e-12);
  // read later in the same trading day: unchanged, later bars are not in the window
  const later = sessionRange(b, ci, 27, asiaStart, asiaEnd)!;
  assert.equal(later.last, 19);
  assert.equal(later.high, r.high);
  assert.deepEqual(rangeOf(b, 0, 20)!.high, r.high);
});
