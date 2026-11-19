export const meta = {
  name: 'fxdesk-code-review',
  description: 'Three independent adversarial reviews of the trading rules, simulator and test plan before any out-of-sample data is opened',
  phases: [{ title: 'Review', detail: '3 reviewers, each with a different lens, hunting for bugs that would make the backtest lie' }],
}

const COMMON = `You are an adversarial code reviewer on a private trading-research project in the git repo at /home/user/cafe-practice (your current directory). Today is 11 November 2026.

CONTEXT. A non-technical owner wants an iPhone web app that gives forex BUY / SELL / NO TRADE calls using the ICT (Inner Circle Trader) method, copied by hand into MetaTrader 5 on a demo account. Before the app is allowed to describe its rules as anything but "unproven", the rules must pass an honest backtest. The rulebook and test plan are in fxdesk/SPEC.md (read it first, in full). The code:
- fxdesk/core/time.ts, bars.ts, ict.ts, pairs.ts, costs.ts, metrics.ts, model.ts - shared building blocks
- fxdesk/core/sim.ts - the fill simulator and account rules (its tests: fxdesk/core/test/sim.test.ts)
- fxdesk/core/models/common.ts, calendar.ts, sweepFvg.ts (Plan A), ote.ts (Plan B) - the trading rules
- fxdesk/backtest/harness.ts, run.ts - the runner; fxdesk/backtest/data.py and fxdesk/scripts/build_history.py - the price history
One-minute BID history for EURUSD, GBPUSD, AUDUSD, USDJPY (2015 to Nov 2026) is in data/histdata/bin/.

ALREADY CHECKED, do not spend time re-proving: (1) "node fxdesk/backtest/run.ts selftest" shows every configuration emits identical orders from a rolling 60-day window of candles as from full history (0 mismatches over 1,278 orders); (2) "node --test 'fxdesk/core/test/*.test.ts'" passes 34 tests including the clock arithmetic against the platform zone database.

HARD RULES FOR YOU:
- Do NOT run "run.ts run validation", "run.ts run verdict", "run.ts noise validation ..." or "run.ts noise verdict ...", and do not write any script that simulates trades on data dated 1 January 2021 or later. Those years are sealed until this review is done. You MAY run the selftest, the unit tests, and anything on dates before 2021.
- Do NOT edit any file in the repository. Put any scratch scripts in /tmp/claude-0/-home-user-cafe-practice/606e4021-0eab-5b80-a5b1-c5b909d6f569/scratchpad/review/ (create it). Node runs TypeScript directly: "node file.ts", imports need the .ts extension and absolute paths work.
- Do NOT use web search or any GitHub or MCP tools. This is a code review.
- Be economical: read the files that matter for your lens, write at most a few small scripts, stop when you have checked your list.

WHAT COUNTS AS A FINDING: something that would make the backtest report a result that live hand-trading from this app could not reproduce, or that makes the code disagree with fxdesk/SPEC.md, or a crash/edge case that silently drops or duplicates trades. For each finding give the file and line, a concrete scenario (inputs or market situation) in which it goes wrong, how you confirmed it (a script you ran, or exact reasoning), and the exact fix. Do not report style points. Do not pad: if your lens turns up nothing serious, say so. Default to verifying a suspicion with a small script before reporting it as confirmed; mark anything you could not confirm as "suspected".`

const SCHEMA = {
  type: 'object',
  required: ['verdict', 'findings', 'checked'],
  properties: {
    verdict: { type: 'string', enum: ['sound', 'fixable', 'broken'] },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['severity', 'status', 'file', 'summary', 'scenario', 'fix'],
        properties: {
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          status: { type: 'string', enum: ['confirmed', 'suspected'] },
          file: { type: 'string', description: 'path:line' },
          summary: { type: 'string' },
          scenario: { type: 'string', description: 'Concrete situation in which it goes wrong and how you confirmed it' },
          fix: { type: 'string', description: 'The exact change to make' },
          direction: { type: 'string', description: 'Does this make results look better than reality, worse, or unclear?' },
        },
      },
    },
    checked: { type: 'array', items: { type: 'string' }, description: 'What you examined and found correct, one line each' },
  },
}

const LENSES = [
  {
    key: 'rules',
    brief: `YOUR LENS: THE TRADING RULES (fxdesk/core/models/*.ts against fxdesk/SPEC.md sections 3 to 7).
Check, by reading and by constructing small synthetic candle sequences that you feed through generateSweep / generateOte:
1. Does each numbered step in SPEC 6 and 7 match the code exactly? List every place they differ, however small (comparisons that should be strict or not, off-by-one candle, a window boundary that includes or excludes the wrong candle, a level that should exclude rollover candles and does not).
2. The mirroring trick (a short is a long on negated prices): is every level, rounding direction, buffer and cancel level correct for SELLS? Build one clean long scenario and its exact mirror and confirm the two orders are mirror images apart from the documented 2-pip ask allowance.
3. Subtle lookahead the rolling-window selftest would NOT catch: anything inside a single trading day that reads a candle later than the signal candle (for example a session high/low taken before the session has finished, a "day so far" value that includes later candles, a swing treated as known before the candle after it has closed, the previous-day lookup on a Monday or after a holiday).
4. Time: killzone boundaries, the 08:15/08:30 blackout, order expiry and the 16:00 / 13:45 exit, across US and UK daylight-saving changes and on days when the market opens late. Is the first-Friday rule applied to the right trading day? Are scheduled Fed days matched to the right day key?
5. Plan B's leg logic in ote.ts: the running low/high bookkeeping, the dedupe set, what happens when a new low and a new high arrive on the same candle, whether an order can be emitted for a leg whose retracement already happened, and whether cancelIfBid really withdraws the stale order when the leg extends.
6. Plan A's state machine in sweepFvg.ts: pools already taken before the window, a lower low arriving after the shift, the fair-value-gap search bounds, the "untouched" test, the discount-half test, stop widening and the 35-pip cap, the liquidity-target selection.`,
  },
  {
    key: 'simulator',
    brief: `YOUR LENS: THE SIMULATOR, COSTS AND HARNESS (fxdesk/core/sim.ts, pairs.ts, costs.ts, metrics.ts, fxdesk/backtest/harness.ts and run.ts).
Check, by reading and by small scripts using synthetic one-minute bars (see how fxdesk/core/test/sim.test.ts builds them):
1. Bid/ask: every fill and trigger for buys and sells, limit and stop orders, stop-loss and take-profit, against how MetaTrader 5 actually behaves on a bid chart. Is cancelIfBid evaluated on the right side for sells? Is the time-varying spread applied consistently?
2. Pessimism: stop-first inside one candle; no profit on the filling candle; gap-through fills; the 3-minute manual delay and what happens to an order whose entry trades during it; the 5-minute delay on the break-even move (ote.ts uses tp1 with tp1Frac 0 purely to trigger a move of the stop to entry at +20 pips: confirm nothing is closed, the stop really moves, and the final target is still reachable afterwards).
3. The main loop: it advances minute by minute only while something is alive and jumps ahead otherwise. Can it skip a minute it should process, process a bar twice, mishandle two pairs whose one-minute bars do not line up, lose an order whose signal time is not on a minute boundary, or mis-set the per-pair bar pointer after a jump? Does an order placed late on Friday behave sanely over the weekend?
4. Account rules: 1% sizing in GBP with correct pip values for USD-quoted pairs and for USDJPY, floor to 0.01 lots, skip below minimum; two fills per trading day (17:00 New York roll); the 2% daily loss stop; one position per pair; the one-per-currency exposure rule (is the exposure test right for every combination of the four pairs and both directions?).
5. R-multiples and money: is R computed net of commission and financing, is the balance path right, are drawdown and the bootstrap interval computed correctly in metrics.ts?
6. Cost presets in costs.ts: are the raw and standard assumptions plausibly pessimistic for a UK retail MT5 account in 2026, or are any too kind? (Use your own knowledge; no web.)
7. harness.ts noisyUniverse and run.ts: does the noise test really leave fills on the clean feed while perturbing only the signal candles? Is anything in runPhase mislabelled?`,
  },
  {
    key: 'plan',
    brief: `YOUR LENS: THE TEST PLAN, ITS STATISTICS, AND FIDELITY TO ICT (fxdesk/SPEC.md against docs/ICT_STRATEGY_DIGEST.md, fxdesk/research/reports/forex-native-models.md, ict-own-ranking.md, measured-base-rates.md and measured-feed-differences.md).
1. Tags: for every rule and parameter in SPEC sections 3 to 7, is the "whose" tag right? Flag anything attributed to ICT that the digest or the research reports show is community or ours, and any quotation that does not appear in those sources.
2. Would a serious ICT student recognise Plan A and Plan B as his? Name anything essential that mechanisation removed and say whether the SPEC admits it.
3. The eligibility rules in SPEC section 9. Estimate, with a small Monte Carlo script on SYNTHETIC trade sequences (not on price data), the chance that a strategy with zero true edge passes: (a) calibration eligibility for at least one of 12 correlated configurations, (b) validation, (c) the verdict rule; and the chance that a strategy with a real but small edge of +0.10R per trade passes all three. State your assumptions (trade counts, the distribution of R). Is the SPEC's claim "a strategy with no edge would pass the verdict rule perhaps one time in six" about right, too kind or too harsh? Propose exact replacement wording or thresholds if the plan is unsound, remembering the thresholds are pre-registered and should change only if clearly wrong.
4. Data-split honesty: anything already done in this project (see the reports and the git log, "git log --stat -8") that touched validation or verdict years in a way that could bias the result.
5. Internal contradictions or ambiguities in SPEC.md that a programmer or the owner would trip over, and any statement that oversells.
6. Practical realism for a person executing by hand from Telegram alerts at any UK hour: London killzone signals arrive 07:00 to 10:00 UK time and New York ones 12:00 to 15:00 UK time; orders expire an hour later; trades are closed at 21:00 UK. Is anything in the plans not doable by hand, and does the simulator's 3-minute delay cover it?`,
  },
]

phase('Review')
const reviews = await parallel(LENSES.map((l) => () => agent(`${COMMON}

${l.brief}

Return your structured result: an overall verdict for your lens, the findings ordered most severe first, and a short list of what you checked and found correct.`, { label: `review:${l.key}`, phase: 'Review', schema: SCHEMA }).then((r) => (r ? { lens: l.key, ...r } : null))))

const ok = reviews.filter(Boolean)
const missing = LENSES.filter((l, i) => !reviews[i]).map((l) => l.key)
if (missing.length) log(`Reviewers that returned nothing: ${missing.join(', ')}`)
log(`${ok.length}/3 reviews; ${ok.reduce((n, r) => n + r.findings.filter((f) => f.severity === 'high').length, 0)} high-severity findings`)
return { reviews: ok, missing }
