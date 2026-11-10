/**
 * time.ts - every clock rule in the project, in one place.
 *
 * ICT's method is defined in NEW YORK clock time, the owner reads UK time,
 * and price data arrives in UTC. All instants in this codebase are plain
 * numbers: SECONDS since 1970-01-01 UTC. Nothing here touches the machine's
 * own timezone or the Intl API, so the same code gives the same answer in the
 * backtest (Node), in the scheduled scanner (Deno) and on the phone (Safari).
 * The test file checks these rules against Intl for every hour of 2015-2027.
 *
 * Daylight-saving rules encoded here:
 *   United States (since 2007): starts 02:00 local on the 2nd Sunday of
 *     March (07:00 UTC), ends 02:00 local on the 1st Sunday of November
 *     (06:00 UTC). New York is UTC-5 in winter, UTC-4 in summer.
 *   United Kingdom: starts 01:00 UTC on the last Sunday of March, ends
 *     01:00 UTC on the last Sunday of October. UTC+0 winter, UTC+1 summer.
 * For about three weeks a year the two are out of step, which is exactly
 * when a hardcoded "New York is five hours behind London" is wrong.
 */

export const MIN = 60;
export const HOUR = 3600;
export const DAY = 86400;

/** Days since 1970-01-01 for a civil date (proleptic Gregorian). */
export function daysFromCivil(y: number, m: number, d: number): number {
  y -= m <= 2 ? 1 : 0;
  const era = Math.floor(y / 400);
  const yoe = y - era * 400;
  const doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

/** Civil date for a day count since 1970-01-01. */
export function civilFromDays(z: number): { y: number; m: number; d: number } {
  z += 719468;
  const era = Math.floor(z / 146097);
  const doe = z - era * 146097;
  const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
  const y = yoe + era * 400;
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const m = mp + (mp < 10 ? 3 : -9);
  return { y: y + (m <= 2 ? 1 : 0), m, d };
}

/** Day of week for a day count: 0 = Sunday ... 6 = Saturday. */
export function dowFromDays(days: number): number {
  return (((days + 4) % 7) + 7) % 7; // 1970-01-01 was a Thursday
}

/** Day count of the n-th (1-based) Sunday of a month. */
function nthSunday(y: number, m: number, n: number): number {
  const first = daysFromCivil(y, m, 1);
  return first + ((7 - dowFromDays(first)) % 7) + (n - 1) * 7;
}

/** Day count of the last Sunday of a month. */
function lastSunday(y: number, m: number): number {
  const next = m === 12 ? daysFromCivil(y + 1, 1, 1) : daysFromCivil(y, m + 1, 1);
  const last = next - 1;
  return last - dowFromDays(last);
}

const yearOf = (utcSec: number): number => civilFromDays(Math.floor(utcSec / DAY)).y;

/** New York's offset from UTC in seconds at this instant: -18000 or -14400. */
export function nyOffset(utcSec: number): number {
  const y = yearOf(utcSec);
  const start = nthSunday(y, 3, 2) * DAY + 7 * HOUR; // 02:00 EST = 07:00 UTC
  const end = nthSunday(y, 11, 1) * DAY + 6 * HOUR; // 02:00 EDT = 06:00 UTC
  return utcSec >= start && utcSec < end ? -4 * HOUR : -5 * HOUR;
}

/** The UK's offset from UTC in seconds at this instant: 0 or 3600. */
export function ukOffset(utcSec: number): number {
  const y = yearOf(utcSec);
  const start = lastSunday(y, 3) * DAY + HOUR;
  const end = lastSunday(y, 10) * DAY + HOUR;
  return utcSec >= start && utcSec < end ? HOUR : 0;
}

export interface Clock {
  y: number; m: number; d: number;
  /** 0 = Sunday ... 6 = Saturday */
  dow: number;
  hh: number; mm: number;
  /** minutes since local midnight */
  minuteOfDay: number;
  /** local calendar date as the integer yyyymmdd */
  dateKey: number;
}

function clockAt(localSec: number): Clock {
  const days = Math.floor(localSec / DAY);
  const { y, m, d } = civilFromDays(days);
  const sod = localSec - days * DAY;
  const hh = Math.floor(sod / HOUR);
  const mm = Math.floor((sod - hh * HOUR) / MIN);
  return { y, m, d, dow: dowFromDays(days), hh, mm, minuteOfDay: hh * 60 + mm, dateKey: y * 10000 + m * 100 + d };
}

/** Wall-clock reading in New York at a UTC instant. */
export const nyClock = (utcSec: number): Clock => clockAt(utcSec + nyOffset(utcSec));
/** Wall-clock reading in the UK at a UTC instant. */
export const ukClock = (utcSec: number): Clock => clockAt(utcSec + ukOffset(utcSec));

/**
 * The UTC instant at which a New York wall clock reads the given time.
 * Used to turn "02:00 New York on this date" into an absolute instant.
 * The two hours a year that are skipped or repeated (02:00-03:00 on the
 * changeover Sundays) fall while the forex market is shut, so no trading
 * rule ever asks for them; they resolve to a usable instant regardless.
 */
export function nyWallToUtc(y: number, m: number, d: number, hh = 0, mm = 0): number {
  const naive = daysFromCivil(y, m, d) * DAY + hh * HOUR + mm * MIN;
  let utc = naive - nyOffset(naive);
  utc = naive - nyOffset(utc);
  return utc;
}

/**
 * The forex TRADING DAY an instant belongs to, as yyyymmdd.
 * A trading day runs 17:00 -> 17:00 New York and is named after the date it
 * ENDS on, so Sunday 17:00 - Monday 17:00 is "Monday". This is the day an
 * MT5 daily candle covers on a broker whose server clock is New York + 7h.
 */
export function tradingDay(utcSec: number): number {
  return clockAt(utcSec + nyOffset(utcSec) + 7 * HOUR).dateKey;
}

/** UTC instant at which a trading day (yyyymmdd) OPENS: 17:00 New York on the previous calendar day. */
export function tradingDayOpen(dayKey: number): number {
  const y = Math.floor(dayKey / 10000), m = Math.floor(dayKey / 100) % 100, d = dayKey % 100;
  const prev = civilFromDays(daysFromCivil(y, m, d) - 1);
  return nyWallToUtc(prev.y, prev.m, prev.d, 17, 0);
}

/** Is the forex market open? Sunday 17:00 to Friday 17:00, New York time. */
export function marketOpen(utcSec: number): boolean {
  const c = nyClock(utcSec);
  if (c.dow === 6) return false;
  if (c.dow === 0) return c.minuteOfDay >= 17 * 60;
  if (c.dow === 5) return c.minuteOfDay < 17 * 60;
  return true;
}

/** True when the New York clock reads inside [startMin, endMin) minutes of day. Windows may not wrap midnight. */
export function inNyWindow(utcSec: number, startMin: number, endMin: number): boolean {
  const mod = nyClock(utcSec).minuteOfDay;
  return mod >= startMin && mod < endMin;
}

const pad = (n: number): string => (n < 10 ? "0" : "") + n;
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Tue 10 Nov 14:45" in UK time - how every time is shown to the owner. */
export function ukLabel(utcSec: number): string {
  const c = ukClock(utcSec);
  return `${DOW[c.dow]} ${c.d} ${MON[c.m - 1]} ${pad(c.hh)}:${pad(c.mm)}`;
}

/** "14:45" in UK time. */
export function ukHM(utcSec: number): string {
  const c = ukClock(utcSec);
  return `${pad(c.hh)}:${pad(c.mm)}`;
}

/** "09:45" in New York time. */
export function nyHM(utcSec: number): string {
  const c = nyClock(utcSec);
  return `${pad(c.hh)}:${pad(c.mm)}`;
}
