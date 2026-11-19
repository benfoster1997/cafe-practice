import { test } from "node:test";
import assert from "node:assert/strict";
import { summarize, byYear, rollingWindows } from "../metrics.ts";
import { type Trade } from "../sim.ts";

const utc = (iso: string): number => Date.parse(iso + "Z") / 1000;
function trade(r: number, when: string, balanceAfter: number): Trade {
  const t = utc(when);
  return {
    order: { id: "x", pair: "EURUSD", dir: 1, kind: "limit", entry: 1.1, stop: 1.098, tp: 1.104, signalTime: t, expireAt: t + 3600, tag: "m" },
    fillTime: t, entry: 1.1, stop: 1.098, riskPips: 20, lots: 0.03, exits: [{ time: t + 7200, price: 1.1, frac: 1, reason: r > 0 ? "tp" : "stop" }],
    pnlPips: r * 20, r, pnlMoney: 0, balanceAfter, maeR: 0, mfeR: 0, nightsHeld: 0, day: 0,
  };
}

test("expectancy, profit factor, drawdown and losing streak", () => {
  const ts = [trade(2, "2025-01-10T10:00:00", 510), trade(-1, "2025-02-10T10:00:00", 505), trade(-1, "2025-03-10T10:00:00", 500),
    trade(-1, "2025-04-10T10:00:00", 495), trade(2, "2025-05-10T10:00:00", 505), trade(-1, "2025-06-10T10:00:00", 500)];
  const s = summarize(ts, 500);
  assert.equal(s.n, 6);
  assert.equal(s.wins, 2);
  assert.equal(s.totalR, 0);
  assert.equal(s.expectancyR, 0);
  assert.equal(s.profitFactor, 1);
  assert.equal(s.maxDrawdownR, 3);
  assert.equal(s.longestLosingStreak, 3);
  assert.ok(Math.abs(s.maxDrawdownPct - (510 - 495) / 510 * 100) < 0.06);
  assert.equal(s.avgHoldHours, 2);
  assert.ok(s.ci95[0] <= 0 && s.ci95[1] >= 0, "a zero-expectancy sample must not exclude zero");
  assert.equal(byYear(ts)["2025"].n, 6);
});

test("rolling windows expose a result carried by one stretch", () => {
  const ts: Trade[] = [];
  for (let m = 0; m < 36; m++) {
    const y = 2022 + Math.floor(m / 12), mo = String((m % 12) + 1).padStart(2, "0");
    ts.push(trade(m < 6 ? 3 : -0.2, `${y}-${mo}-15T10:00:00`, 500)); // six great months, thirty slightly losing ones
  }
  const total = ts.reduce((a, t) => a + t.r, 0);
  assert.ok(total > 0, "the headline total is positive");
  const r = rollingWindows(ts, 12, 3);
  assert.ok(r.negative >= r.total - 2, "but almost every 12-month window is negative");
});
