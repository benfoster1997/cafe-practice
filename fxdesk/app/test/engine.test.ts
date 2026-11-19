import { test } from "node:test";
import assert from "node:assert/strict";
import { isCheckInTime, mt5HM } from "../lib/engine.ts";

const utc = (iso: string): number => Date.parse(iso + "Z") / 1000;

test("the daily check-in window opens a quarter hour before London and stays open an hour, on weekdays only", () => {
  // Winter: 01:45 New York = 06:45 UTC = 06:45 UK
  assert.equal(isCheckInTime(utc("2026-11-16T06:45:09")), true); // Monday
  assert.equal(isCheckInTime(utc("2026-11-16T06:30:09")), false);
  assert.equal(isCheckInTime(utc("2026-11-16T07:30:09")), true); // still open if the earlier scans did not run
  assert.equal(isCheckInTime(utc("2026-11-16T07:45:09")), false);
  // Summer: 01:45 New York = 05:45 UTC = 06:45 UK
  assert.equal(isCheckInTime(utc("2026-07-15T05:45:09")), true);
  assert.equal(isCheckInTime(utc("2026-07-15T06:45:09")), false);
  // Weekend: never
  assert.equal(isCheckInTime(utc("2026-11-14T06:45:09")), false); // Saturday
  assert.equal(isCheckInTime(utc("2026-11-15T06:45:09")), false); // Sunday
  // four of the day's 96 quarter-hour scans fall in the window (store.ts sends on the first only)
  let n = 0;
  for (let t = utc("2026-11-17T00:00:09"); t < utc("2026-11-18T00:00:00"); t += 900) if (isCheckInTime(t)) n++;
  assert.equal(n, 4);
});

test("the MT5 clock is New York plus seven hours: two hours ahead of UK, three in the March mismatch weeks", () => {
  assert.equal(mt5HM(utc("2026-11-16T10:00:00"), "ny7"), "12:00"); // UK 10:00
  assert.equal(mt5HM(utc("2026-07-15T09:00:00"), "ny7"), "12:00"); // UK 10:00 (BST)
  assert.equal(mt5HM(utc("2026-03-18T10:00:00"), "ny7"), "13:00"); // UK 10:00, US already on summer time
  assert.equal(mt5HM(utc("2026-11-16T10:00:00"), "utc"), "10:00");
  assert.equal(mt5HM(utc("2026-07-15T09:00:00"), "uk"), "10:00");
});
