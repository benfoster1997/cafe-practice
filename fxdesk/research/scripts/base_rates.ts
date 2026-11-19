/**
 * base_rates.ts - measured base rates behind ICT's session claims.
 *
 * DESCRIPTIVE ONLY. No entries, no costs, no strategy. Uses 2015-2019 only,
 * so nothing here touches the years reserved for validation or the verdict.
 * Purpose: replace "ICT says London makes the high or low of the day" with
 * a number, before anyone writes a rule that depends on it.
 *
 * Run: node fxdesk/research/scripts/base_rates.ts > fxdesk/research/reports/measured-base-rates.json
 */
import { loadM1 } from "../../core/load.ts";
import { toClock, toNyAnchored, type Bars } from "../../core/bars.ts";
import { nyClock, tradingDay } from "../../core/time.ts";
import { PAIRS, pipSize } from "../../core/pairs.ts";

const FROM = Date.UTC(2015, 0, 1) / 1000, TO = Date.UTC(2020, 0, 1) / 1000;
const pct = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 10 : NaN);
const q = (xs: number[], p: number) => { if (!xs.length) return NaN; const s = [...xs].sort((a, b) => a - b); return Math.round(s[Math.min(s.length - 1, Math.floor(p * s.length))] * 10) / 10; };

interface Day { key: number; bars: number[]; }

function analyse(pair: string) {
  const m15: Bars = toClock(loadM1(pair), 15);
  const pip = pipSize(pair);
  const d1 = toNyAnchored(m15, 24);
  // group M15 bar indices by trading day
  const days: Day[] = [];
  let cur: Day | null = null;
  const mod = new Int16Array(m15.n);
  for (let i = 0; i < m15.n; i++) {
    if (m15.t[i] < FROM || m15.t[i] >= TO) continue;
    mod[i] = nyClock(m15.t[i]).minuteOfDay;
    const k = tradingDay(m15.t[i]);
    if (!cur || cur.key !== k) { cur = { key: k, bars: [] }; days.push(cur); }
    cur.bars.push(i);
  }
  const full = days.filter((d) => d.bars.length >= 80); // drop holiday stubs
  const win = (d: Day, a: number, b: number) => d.bars.filter((i) => (a <= b ? mod[i] >= a && mod[i] < b : mod[i] >= a || mod[i] < b));
  const hi = (ix: number[]) => ix.reduce((m, i) => Math.max(m, m15.h[i]), -Infinity);
  const lo = (ix: number[]) => ix.reduce((m, i) => Math.min(m, m15.l[i]), Infinity);

  const dayRange: number[] = [], asiaRange: number[] = [];
  const buckets: Array<[string, number, number]> = [
    ["17:00-00:00 Asia", 17 * 60, 0], ["00:00-02:00", 0, 120], ["02:00-05:00 London KZ", 120, 300], ["05:00-07:00", 300, 420],
    ["07:00-10:00 NY KZ", 420, 600], ["10:00-12:00", 600, 720], ["12:00-17:00", 720, 1020]];
  const hodAt: Record<string, number> = {}, lodAt: Record<string, number> = {};
  let londonMakesExtreme = 0, nyMakesExtreme = 0;
  let sweepHiOnly = 0, sweepLoOnly = 0, sweepBoth = 0, sweepNone = 0;
  let firstSweeps = 0, closeOpposite = 0, reachOpposite = 0, reachOppBeforeNoon = 0;
  const extension: number[] = [];
  let nyCont = 0, nyN = 0;
  // tight-Asia subset (range <= 30 pips), same outcome measures
  let tightN = 0, tightReach = 0, tightClose = 0;

  for (const d of full) {
    const all = d.bars, H = hi(all), L = lo(all);
    dayRange.push((H - L) / pip);
    const iH = all.find((i) => m15.h[i] === H)!, iL = all.find((i) => m15.l[i] === L)!;
    const bucketOf = (i: number) => buckets.find(([, a, b]) => (a <= b ? mod[i] >= a && mod[i] < b : mod[i] >= a || mod[i] < b))?.[0] ?? "other";
    const bh = bucketOf(iH), bl = bucketOf(iL);
    hodAt[bh] = (hodAt[bh] ?? 0) + 1; lodAt[bl] = (lodAt[bl] ?? 0) + 1;
    if (bh.includes("London") || bl.includes("London")) londonMakesExtreme++;
    if (bh.includes("NY KZ") || bl.includes("NY KZ")) nyMakesExtreme++;

    const asia = win(d, 19 * 60, 0);
    const lon = win(d, 0, 300); // midnight to 05:00
    if (asia.length < 12 || lon.length < 12) continue;
    const aH = hi(asia), aL = lo(asia);
    asiaRange.push((aH - aL) / pip);
    const midnight = m15.o[lon[0]];
    let firstSide = 0, tFirst = -1, tookHi = false, tookLo = false;
    for (const i of lon) {
      if (m15.h[i] > aH + pip) { tookHi = true; if (!firstSide) { firstSide = 1; tFirst = i; } }
      if (m15.l[i] < aL - pip) { tookLo = true; if (!firstSide) { firstSide = -1; tFirst = i; } }
    }
    if (tookHi && tookLo) sweepBoth++; else if (tookHi) sweepHiOnly++; else if (tookLo) sweepLoOnly++; else sweepNone++;
    if (firstSide) {
      firstSweeps++;
      const after = all.filter((i) => i >= tFirst);
      const close = m15.c[all[all.length - 1]];
      const opp = firstSide > 0 ? aL : aH;
      const reached = after.some((i) => (firstSide > 0 ? m15.l[i] <= opp : m15.h[i] >= opp));
      const beforeNoon = after.filter((i) => mod[i] < 720 || mod[i] >= 17 * 60);
      const reachedNoon = beforeNoon.some((i) => (firstSide > 0 ? m15.l[i] <= opp : m15.h[i] >= opp));
      const closedOpp = firstSide > 0 ? close < midnight : close > midnight;
      if (closedOpp) closeOpposite++;
      if (reached) reachOpposite++;
      if (reachedNoon) reachOppBeforeNoon++;
      // how far beyond the swept Asian extreme did price go before 12:00 New York?
      const ext = firstSide > 0 ? (hi(beforeNoon) - aH) / pip : (aL - lo(beforeNoon)) / pip;
      extension.push(ext);
      if ((aH - aL) / pip <= 30) { tightN++; if (reached) tightReach++; if (closedOpp) tightClose++; }
    }
    // New York continuation of the London move
    const lonS = win(d, 120, 420), nyS = win(d, 420, 720);
    if (lonS.length >= 12 && nyS.length >= 12) {
      const lm = m15.c[lonS[lonS.length - 1]] - m15.o[lonS[0]], nm = m15.c[nyS[nyS.length - 1]] - m15.o[nyS[0]];
      if (lm !== 0 && nm !== 0) { nyN++; if (Math.sign(lm) === Math.sign(nm)) nyCont++; }
    }
  }

  // previous-day logic on daily bars
  let n = 0, upBase = 0, closeAbove = 0, contAfterCloseAbove = 0, lowAfterCloseAbove = 0;
  let sweepFail = 0, sfNextLow = 0, sfNextHigh = 0, closeBelow = 0, contAfterCloseBelow = 0;
  const idx: number[] = [];
  for (let i = 0; i < d1.n; i++) if (d1.t[i] >= FROM && d1.t[i] < TO && d1.src[i] >= 80) idx.push(i);
  for (let k = 1; k + 1 < idx.length; k++) {
    const y = idx[k - 1], t = idx[k], x = idx[k + 1];
    n++;
    if (d1.h[x] > d1.h[t]) upBase++;
    if (d1.c[t] > d1.h[y]) { closeAbove++; if (d1.h[x] > d1.h[t]) contAfterCloseAbove++; if (d1.l[x] < d1.l[t]) lowAfterCloseAbove++; }
    if (d1.c[t] < d1.l[y]) { closeBelow++; if (d1.l[x] < d1.l[t]) contAfterCloseBelow++; }
    if (d1.h[t] > d1.h[y] && d1.c[t] < d1.h[y]) { sweepFail++; if (d1.l[x] < d1.l[t]) sfNextLow++; if (d1.h[x] > d1.h[t]) sfNextHigh++; }
  }
  const N = full.length;
  return {
    pair, days: N,
    daily_range_pips: { median: q(dayRange, 0.5), p25: q(dayRange, 0.25), p75: q(dayRange, 0.75) },
    asian_range_1900_0000_pips: { median: q(asiaRange, 0.5), p75: q(asiaRange, 0.75), share_le_20: pct(asiaRange.filter((x) => x <= 20).length, asiaRange.length), share_le_30: pct(asiaRange.filter((x) => x <= 30).length, asiaRange.length), share_le_40: pct(asiaRange.filter((x) => x <= 40).length, asiaRange.length) },
    high_of_day_formed_in_pct: Object.fromEntries(buckets.map(([b]) => [b, pct(hodAt[b] ?? 0, N)])),
    low_of_day_formed_in_pct: Object.fromEntries(buckets.map(([b]) => [b, pct(lodAt[b] ?? 0, N)])),
    days_where_london_kz_made_high_or_low_pct: pct(londonMakesExtreme, N),
    days_where_ny_kz_made_high_or_low_pct: pct(nyMakesExtreme, N),
    asian_range_swept_0000_0500_pct: { high_only: pct(sweepHiOnly, asiaRange.length), low_only: pct(sweepLoOnly, asiaRange.length), both: pct(sweepBoth, asiaRange.length), neither: pct(sweepNone, asiaRange.length) },
    after_first_sweep: {
      n: firstSweeps,
      opposite_asian_extreme_reached_same_day_pct: pct(reachOpposite, firstSweeps),
      opposite_asian_extreme_reached_before_noon_ny_pct: pct(reachOppBeforeNoon, firstSweeps),
      day_closed_on_opposite_side_of_midnight_open_pct: pct(closeOpposite, firstSweeps),
      extension_beyond_swept_extreme_before_noon_pips: { median: q(extension, 0.5), p75: q(extension, 0.75), p90: q(extension, 0.9) },
      tight_asia_le_30_pips: { n: tightN, opposite_reached_same_day_pct: pct(tightReach, tightN), closed_opposite_side_of_midnight_pct: pct(tightClose, tightN) },
    },
    ny_0700_1200_continues_london_0200_0700_direction_pct: pct(nyCont, nyN),
    previous_day_logic: {
      days: n,
      base_rate_next_day_higher_high_pct: pct(upBase, n),
      close_above_prev_high: { n: closeAbove, next_day_higher_high_pct: pct(contAfterCloseAbove, closeAbove), next_day_lower_low_pct: pct(lowAfterCloseAbove, closeAbove) },
      close_below_prev_low: { n: closeBelow, next_day_lower_low_pct: pct(contAfterCloseBelow, closeBelow) },
      swept_prev_high_but_closed_back_below: { n: sweepFail, next_day_lower_low_pct: pct(sfNextLow, sweepFail), next_day_higher_high_pct: pct(sfNextHigh, sweepFail) },
    },
  };
}

const out = PAIRS.map(analyse);
console.log(JSON.stringify(out, null, 1));
