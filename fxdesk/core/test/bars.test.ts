import { test } from "node:test";
import assert from "node:assert/strict";
import { makeBars, toClock, toNyAnchored, closedCount, lowerBound } from "../bars.ts";
import { nyClock, HOUR } from "../time.ts";

const utc = (iso: string): number => Date.parse(iso + "Z") / 1000;

/** n consecutive M15 bars from `start`, price walking up 1 pip a bar. */
function m15(start: number, n: number) {
  const t: number[] = [], o: number[] = [], h: number[] = [], l: number[] = [], c: number[] = [];
  for (let i = 0; i < n; i++) {
    const p = 1.1 + i * 0.0001;
    t.push(start + i * 900); o.push(p); h.push(p + 0.0003); l.push(p - 0.0002); c.push(p + 0.0001);
  }
  return makeBars(15, t, o, h, l, c);
}

test("H1 from M15: open of first, close of last, extremes of all four", () => {
  const b = m15(utc("2025-07-14T12:00:00"), 8);
  const h1 = toClock(b, 60);
  assert.equal(h1.n, 2);
  assert.equal(h1.t[0], utc("2025-07-14T12:00:00"));
  assert.equal(h1.end[0], utc("2025-07-14T13:00:00"));
  assert.equal(h1.o[0], b.o[0]);
  assert.equal(h1.c[0], b.c[3]);
  assert.equal(h1.h[0], Math.max(b.h[0], b.h[1], b.h[2], b.h[3]));
  assert.equal(h1.l[0], Math.min(b.l[0], b.l[1], b.l[2], b.l[3]));
  assert.equal(h1.src[0], 4);
});

test("daily bars open at 17:00 New York in summer and in winter", () => {
  const summer = toNyAnchored(m15(utc("2025-07-13T21:00:00"), 96 * 3), 24);
  assert.equal(summer.n, 3);
  for (let i = 0; i < summer.n; i++) assert.equal(nyClock(summer.t[i]).hh, 17);
  assert.equal(summer.t[0], utc("2025-07-13T21:00:00"));
  assert.equal(summer.end[0], utc("2025-07-14T21:00:00"));
  const winter = toNyAnchored(m15(utc("2025-01-12T22:00:00"), 96 * 3), 24);
  assert.equal(winter.n, 3);
  assert.equal(winter.t[0], utc("2025-01-12T22:00:00"));
  for (let i = 0; i < winter.n; i++) assert.equal(nyClock(winter.t[i]).hh, 17);
});

test("H4 bars open at 17, 21, 01, 05, 09, 13 New York", () => {
  const h4 = toNyAnchored(m15(utc("2025-07-13T21:00:00"), 96), 4);
  assert.deepEqual(Array.from({ length: h4.n }, (_, i) => nyClock(h4.t[i]).hh), [17, 21, 1, 5, 9, 13]);
  assert.equal(h4.end[0] - h4.t[0], 4 * HOUR);
});

test("a week that contains a US clock change still has clean 17:00 daily bars either side", () => {
  // Friday 6 March 2026 (winter) and Monday 9 March 2026 (summer time began Sunday 8 March).
  const fri = m15(utc("2026-03-05T22:00:00"), 92); // Thu 17:00 NY EST onward
  const mon = m15(utc("2026-03-08T21:00:00"), 96); // Sun 17:00 NY EDT onward
  const all = makeBars(15, [...fri.t, ...mon.t], [...fri.o, ...mon.o], [...fri.h, ...mon.h], [...fri.l, ...mon.l], [...fri.c, ...mon.c]);
  const d1 = toNyAnchored(all, 24);
  assert.equal(d1.n, 2);
  assert.equal(d1.t[0], utc("2026-03-05T22:00:00"));
  assert.equal(d1.t[1], utc("2026-03-08T21:00:00"));
});

test("closedCount never admits a bar that is still forming", () => {
  const b = m15(utc("2025-07-14T12:00:00"), 4);
  assert.equal(closedCount(b, utc("2025-07-14T12:14:59")), 0);
  assert.equal(closedCount(b, utc("2025-07-14T12:15:00")), 1);
  assert.equal(closedCount(b, utc("2025-07-14T12:44:00")), 2);
  assert.equal(closedCount(b, utc("2025-07-14T13:00:00")), 4);
  const h1 = toClock(b, 60);
  assert.equal(closedCount(h1, utc("2025-07-14T12:59:59")), 0); // the hour is not over
  assert.equal(closedCount(h1, utc("2025-07-14T13:00:00")), 1);
  assert.equal(lowerBound(b, utc("2025-07-14T12:20:00")), 2);
});
