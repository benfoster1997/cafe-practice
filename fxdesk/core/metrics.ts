/**
 * metrics.ts - scoring a list of trades without flattering it.
 *
 * Everything is measured in R (multiples of the amount risked), net of all
 * costs, because R is what survives a change of account size. There is no
 * win-rate target anywhere: a win rate can be manufactured with a bad
 * reward-to-risk; expectancy and profit factor cannot.
 */
import { type Trade } from "./sim.ts";
import { civilFromDays, DAY } from "./time.ts";

export interface Stats {
  n: number;
  wins: number;
  winRatePct: number;
  /** average R per trade */
  expectancyR: number;
  totalR: number;
  /** gross winning R / gross losing R */
  profitFactor: number;
  avgWinR: number;
  avgLossR: number;
  /** worst peak-to-trough fall of cumulative R */
  maxDrawdownR: number;
  /** worst peak-to-trough fall of the account balance, percent */
  maxDrawdownPct: number;
  longestLosingStreak: number;
  /** mean R divided by its standard error; roughly, |t| below 2 is indistinguishable from luck */
  tStat: number;
  /** 95% bootstrap interval for the expectancy */
  ci95: [number, number];
  tradesPerMonth: number;
  avgHoldHours: number;
}

/** Small deterministic random generator so a report is reproducible. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (x: number, d = 3): number => (Number.isFinite(x) ? Math.round(x * 10 ** d) / 10 ** d : x);

export function summarize(trades: Trade[], startBalance: number, seed = 7): Stats {
  const n = trades.length;
  const empty: Stats = { n: 0, wins: 0, winRatePct: 0, expectancyR: 0, totalR: 0, profitFactor: 0, avgWinR: 0, avgLossR: 0, maxDrawdownR: 0, maxDrawdownPct: 0, longestLosingStreak: 0, tStat: 0, ci95: [0, 0], tradesPerMonth: 0, avgHoldHours: 0 };
  if (!n) return empty;
  const rs = trades.map((t) => t.r);
  const wins = rs.filter((r) => r > 0), losses = rs.filter((r) => r < 0);
  const total = rs.reduce((a, b) => a + b, 0);
  const mean = total / n;
  const sd = n > 1 ? Math.sqrt(rs.reduce((a, r) => a + (r - mean) ** 2, 0) / (n - 1)) : 0;
  const grossWin = wins.reduce((a, b) => a + b, 0), grossLoss = -losses.reduce((a, b) => a + b, 0);
  let cum = 0, peak = 0, ddR = 0, streak = 0, longest = 0;
  let bal = startBalance, balPeak = startBalance, ddPct = 0;
  for (const t of trades) {
    cum += t.r; peak = Math.max(peak, cum); ddR = Math.max(ddR, peak - cum);
    bal = t.balanceAfter; balPeak = Math.max(balPeak, bal); ddPct = Math.max(ddPct, (balPeak - bal) / balPeak * 100);
    if (t.r < 0) { streak++; longest = Math.max(longest, streak); } else streak = 0;
  }
  // bootstrap the mean
  const rnd = mulberry32(seed), means: number[] = [];
  const B = n < 2 ? 0 : 2000;
  for (let b = 0; b < B; b++) {
    let s = 0;
    for (let k = 0; k < n; k++) s += rs[Math.floor(rnd() * n)];
    means.push(s / n);
  }
  means.sort((a, b) => a - b);
  const span = (trades[n - 1].fillTime - trades[0].fillTime) / (30.4375 * DAY);
  const hold = trades.reduce((a, t) => a + (t.exits[t.exits.length - 1].time - t.fillTime), 0) / n / 3600;
  return {
    n, wins: wins.length, winRatePct: round(wins.length / n * 100, 1), expectancyR: round(mean), totalR: round(total, 2),
    profitFactor: grossLoss > 0 ? round(grossWin / grossLoss, 2) : Infinity,
    avgWinR: wins.length ? round(grossWin / wins.length) : 0, avgLossR: losses.length ? round(-grossLoss / losses.length) : 0,
    maxDrawdownR: round(ddR, 2), maxDrawdownPct: round(ddPct, 1), longestLosingStreak: longest,
    tStat: sd > 0 ? round(mean / (sd / Math.sqrt(n)), 2) : 0,
    ci95: B ? [round(means[Math.floor(0.025 * B)]), round(means[Math.floor(0.975 * B)])] : [round(mean), round(mean)],
    tradesPerMonth: span > 0 ? round(n / span, 1) : n, avgHoldHours: round(hold, 1),
  };
}

const yearOf = (t: number): number => civilFromDays(Math.floor(t / DAY)).y;

/** Trades grouped by a key, each group summarised (R statistics only; balance drawdown is not meaningful per group). */
export function breakdown(trades: Trade[], keyOf: (t: Trade) => string | number): Record<string, { n: number; totalR: number; expectancyR: number; winRatePct: number; profitFactor: number }> {
  const groups: Record<string, Trade[]> = {};
  for (const t of trades) (groups[String(keyOf(t))] ??= []).push(t);
  const out: Record<string, { n: number; totalR: number; expectancyR: number; winRatePct: number; profitFactor: number }> = {};
  for (const [k, g] of Object.entries(groups)) {
    const rs = g.map((t) => t.r), tot = rs.reduce((a, b) => a + b, 0);
    const gw = rs.filter((r) => r > 0).reduce((a, b) => a + b, 0), gl = -rs.filter((r) => r < 0).reduce((a, b) => a + b, 0);
    out[k] = { n: g.length, totalR: round(tot, 2), expectancyR: round(tot / g.length), winRatePct: round(rs.filter((r) => r > 0).length / g.length * 100, 1), profitFactor: gl > 0 ? round(gw / gl, 2) : Infinity };
  }
  return out;
}

export const byYear = (trades: Trade[]) => breakdown(trades, (t) => yearOf(t.fillTime));
export const byPair = (trades: Trade[]) => breakdown(trades, (t) => t.order.pair);
export const byTag = (trades: Trade[]) => breakdown(trades, (t) => t.order.tag);
export const byExit = (trades: Trade[]) => breakdown(trades, (t) => t.exits[t.exits.length - 1].reason);

/**
 * Rolling-window stability: total R in each window of `months` months,
 * stepping `step` months. A strategy whose profit comes from one lucky
 * stretch shows up here as many negative windows.
 */
export function rollingWindows(trades: Trade[], months = 12, step = 3): { windows: Array<{ from: string; totalR: number; n: number }>; negative: number; total: number } {
  if (!trades.length) return { windows: [], negative: 0, total: 0 };
  const monthIdx = (t: number) => { const c = civilFromDays(Math.floor(t / DAY)); return c.y * 12 + (c.m - 1); };
  const first = monthIdx(trades[0].fillTime), last = monthIdx(trades[trades.length - 1].fillTime);
  const windows: Array<{ from: string; totalR: number; n: number }> = [];
  for (let a = first; a + months - 1 <= last; a += step) {
    const g = trades.filter((t) => { const m = monthIdx(t.fillTime); return m >= a && m < a + months; });
    windows.push({ from: `${Math.floor(a / 12)}-${String((a % 12) + 1).padStart(2, "0")}`, totalR: round(g.reduce((s, t) => s + t.r, 0), 2), n: g.length });
  }
  return { windows, negative: windows.filter((w) => w.totalR < 0).length, total: windows.length };
}
