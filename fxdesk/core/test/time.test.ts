import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DAY, HOUR, daysFromCivil, civilFromDays, nyOffset, ukOffset, nyClock, ukClock,
  nyWallToUtc, tradingDay, tradingDayOpen, marketOpen, ukLabel, inNyWindow,
} from "../time.ts";

const utc = (iso: string): number => Date.parse(iso + "Z") / 1000;

test("civil date round trip across 2000-2040", () => {
  for (let days = daysFromCivil(2000, 1, 1); days < daysFromCivil(2040, 1, 1); days += 1) {
    const { y, m, d } = civilFromDays(days);
    assert.equal(daysFromCivil(y, m, d), days);
  }
});

test("New York and UK offsets agree with the platform's own zone database, every hour 2015-2027", () => {
  const fmt = (tz: string) => new Intl.DateTimeFormat("en-GB", {
    timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  });
  const ny = fmt("America/New_York"), uk = fmt("Europe/London");
  const read = (f: Intl.DateTimeFormat, s: number) => {
    const p: Record<string, string> = {};
    for (const part of f.formatToParts(new Date(s * 1000))) p[part.type] = part.value;
    return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
  };
  const show = (c: { y: number; m: number; d: number; hh: number; mm: number }) =>
    `${c.y}-${String(c.m).padStart(2, "0")}-${String(c.d).padStart(2, "0")} ${String(c.hh).padStart(2, "0")}:${String(c.mm).padStart(2, "0")}`;
  let checked = 0;
  for (let s = utc("2015-01-01T00:00:00"); s < utc("2028-01-01T00:00:00"); s += HOUR) {
    assert.equal(show(nyClock(s)), read(ny, s), `New York at ${new Date(s * 1000).toISOString()}`);
    assert.equal(show(ukClock(s)), read(uk, s), `UK at ${new Date(s * 1000).toISOString()}`);
    checked += 1;
  }
  assert.ok(checked > 113000);
});

test("the three weeks a year when New York is four hours behind London, not five", () => {
  // 20 March 2026: US already on summer time, UK not yet.
  const s = utc("2026-03-20T12:00:00");
  assert.equal(nyOffset(s), -4 * HOUR);
  assert.equal(ukOffset(s), 0);
  // 28 October 2026: UK back on winter time, US not yet.
  const t = utc("2026-10-28T12:00:00");
  assert.equal(nyOffset(t), -4 * HOUR);
  assert.equal(ukOffset(t), 0);
});

test("New York wall time converts back to the right instant in both seasons", () => {
  assert.equal(nyWallToUtc(2026, 1, 15, 8, 30), utc("2026-01-15T13:30:00"));
  assert.equal(nyWallToUtc(2026, 7, 15, 8, 30), utc("2026-07-15T12:30:00"));
  for (let s = utc("2025-01-01T05:00:00"); s < utc("2027-01-01T00:00:00"); s += 6 * HOUR + 60) {
    const c = nyClock(s);
    if (c.dow === 0 && c.hh < 4) continue; // the skipped/repeated hours, market shut
    assert.equal(nyWallToUtc(c.y, c.m, c.d, c.hh, c.mm), s - (s % 60));
  }
});

test("a trading day runs 17:00 to 17:00 New York and is named for the day it ends", () => {
  assert.equal(tradingDay(utc("2025-07-13T21:30:00")), 20250714); // Sunday 17:30 NY -> Monday
  assert.equal(tradingDay(utc("2025-07-14T20:59:00")), 20250714); // Monday 16:59 NY
  assert.equal(tradingDay(utc("2025-07-14T21:00:00")), 20250715); // Monday 17:00 NY -> Tuesday
  assert.equal(tradingDay(utc("2025-01-13T21:59:00")), 20250113); // winter: 16:59 NY
  assert.equal(tradingDay(utc("2025-01-13T22:00:00")), 20250114);
  assert.equal(tradingDayOpen(20250714), utc("2025-07-13T21:00:00"));
  assert.equal(tradingDayOpen(20250114), utc("2025-01-13T22:00:00"));
});

test("market hours: Sunday 17:00 to Friday 17:00 New York", () => {
  assert.equal(marketOpen(utc("2025-07-13T20:59:00")), false);
  assert.equal(marketOpen(utc("2025-07-13T21:00:00")), true);
  assert.equal(marketOpen(utc("2025-07-18T20:59:00")), true);
  assert.equal(marketOpen(utc("2025-07-18T21:00:00")), false);
  assert.equal(marketOpen(utc("2025-07-19T12:00:00")), false);
});

test("window test and UK label", () => {
  const s = utc("2026-11-10T14:45:00"); // 09:45 New York, 14:45 UK (both winter)
  assert.equal(inNyWindow(s, 7 * 60, 10 * 60), true);
  assert.equal(inNyWindow(s, 10 * 60, 11 * 60), false);
  assert.equal(ukLabel(s), "Tue 10 Nov 14:45");
  assert.equal(ukLabel(utc("2026-07-10T14:45:00")), "Fri 10 Jul 15:45");
  assert.equal(DAY, 86400);
});
