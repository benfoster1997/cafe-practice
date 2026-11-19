# FX Desk backtest results

## Stage 1: calibration, 5 Jan 2015 to 31 Dec 2020

Rules, costs and pass marks were fixed in `fxdesk/SPEC.md` and committed (commit 2f05560) before the first run. Four pairs (EURUSD, GBPUSD, AUDUSD, USDJPY), GBP 500 test account, 1% risk per trade, hand-execution delays and pessimistic fills as specified.

**This is the second run.** The first (11 Nov 2026, commit d511651) also had nothing eligible. Three independent reviewers then found places where the code did not do what the rulebook said (`REVIEW.md`). Those were corrected to match the rulebook's wording, without looking at how the alternative performed, and everything was run again. The figures below are from the corrected code.

**Outcome: none of the 12 configurations is eligible. Nothing goes forward. The 2021-2026 prices remain unopened, and the runner now refuses to open them without a named, eligible configuration.**

| Config | Costs | Trades | Wins | Avg per trade | 95% range | Profit factor | Total | Worst fall | Years up | 12-month windows down | Trades a month |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A1 | raw | 271 | 37.6% | -0.115R | -0.26 to +0.03 | 0.81 | -31.1R | 29.9% | 2/6 | 15/21 | 3.8 |
| A1 | standard | 268 | 38.1% | -0.083R | -0.23 to +0.07 | 0.86 | -22.4R | 26.5% | 2/6 | 13/21 | 3.7 |
| A2 | raw | 89 | 37.1% | -0.072R | -0.34 to +0.23 | 0.89 | -6.4R | 8.9% | 2/6 | 13/21 | 1.2 |
| A2 | standard | 89 | 40.4% | +0.036R | -0.25 to +0.33 | 1.06 | +3.2R | 6.8% | 3/6 | 11/21 | 1.2 |
| A3 | raw | 77 | 42.9% | +0.015R | -0.29 to +0.33 | 1.02 | +1.1R | 11.8% | 3/6 | 9/21 | 1.1 |
| A3 | standard | 76 | 42.1% | +0.026R | -0.27 to +0.34 | 1.04 | +2.0R | 9.1% | 2/6 | 11/21 | 1.1 |
| A4 | raw | 34 | 44.1% | +0.264R | -0.26 to +0.84 | 1.43 | +9.0R | 6% | 5/6 | 7/20 | 0.5 |
| A4 | standard | 34 | 44.1% | +0.313R | -0.22 to +0.90 | 1.53 | +10.7R | 5% | 5/6 | 7/20 | 0.5 |
| A5 | raw | 283 | 37.8% | -0.127R | -0.26 to +0.02 | 0.8 | -36.1R | 35.9% | 3/6 | 16/21 | 3.9 |
| A5 | standard | 279 | 37.3% | -0.128R | -0.27 to +0.01 | 0.79 | -35.8R | 36.3% | 3/6 | 15/21 | 3.9 |
| A6 | raw | 84 | 35.7% | -0.077R | -0.35 to +0.20 | 0.88 | -6.5R | 10.6% | 2/6 | 13/21 | 1.2 |
| A6 | standard | 84 | 36.9% | -0.052R | -0.32 to +0.21 | 0.91 | -4.4R | 7.8% | 1/6 | 14/21 | 1.2 |
| A7 | raw | 78 | 43.6% | +0.009R | -0.27 to +0.32 | 1.01 | +0.7R | 15% | 3/6 | 10/20 | 1.1 |
| A7 | standard | 77 | 41.6% | -0.020R | -0.31 to +0.27 | 0.97 | -1.5R | 13.9% | 4/6 | 11/20 | 1.1 |
| A8 | raw | 30 | 50% | +0.290R | -0.26 to +0.82 | 1.5 | +8.7R | 4.2% | 4/6 | 7/18 | 0.5 |
| A8 | standard | 30 | 46.7% | +0.228R | -0.30 to +0.78 | 1.39 | +6.8R | 4.1% | 3/6 | 5/18 | 0.5 |
| B1 | raw | 1182 | 35.1% | -0.090R | -0.15 to -0.03 | 0.83 | -105.9R | 60.5% | 1/6 | 18/21 | 16.5 |
| B1 | standard | 1172 | 33.8% | -0.092R | -0.15 to -0.03 | 0.83 | -107.5R | 59.6% | 1/6 | 18/21 | 16.3 |
| B2 | raw | 920 | 42.2% | -0.069R | -0.13 to -0.00 | 0.86 | -63.4R | 45.6% | 1/6 | 17/21 | 12.8 |
| B2 | standard | 904 | 41.2% | -0.075R | -0.14 to -0.01 | 0.85 | -67.9R | 47.3% | 1/6 | 17/21 | 12.6 |
| B3 | raw | 1239 | 33.6% | -0.123R | -0.18 to -0.06 | 0.77 | -152.7R | 72.8% | 0/6 | 18/21 | 17.3 |
| B3 | standard | 1127 | 32.1% | -0.135R | -0.20 to -0.07 | 0.75 | -151.9R | 72.2% | 0/6 | 20/20 | 16.6 |
| B4 | raw | 996 | 40.9% | -0.109R | -0.17 to -0.05 | 0.79 | -108.9R | 60.9% | 0/6 | 19/21 | 13.9 |
| B4 | standard | 931 | 39.7% | -0.123R | -0.19 to -0.06 | 0.76 | -114.3R | 63.3% | 0/6 | 21/21 | 13 |

Config key. Plan A: A1-A4 use the daily-candle bias, A5-A8 the four-hour bias; within each four, gap any / any / discount / discount and target 2R / liquidity / 2R / liquidity. Plan B: B1-B2 daily-candle bias, B3-B4 four-hour bias; exits ICT 20/30 then structure.

Pass marks failed, per configuration:

- **A1**: average above 0R; profit factor at least 1.15; at least 4 of 6 years positive; no more than 35% of rolling 12-month windows negative; worst fall no more than 15%
- **A2**: at least 150 trades; average above 0R; profit factor at least 1.15; at least 4 of 6 years positive; no more than 35% of rolling 12-month windows negative
- **A3**: at least 150 trades; profit factor at least 1.15; at least 4 of 6 years positive; no more than 35% of rolling 12-month windows negative
- **A4**: at least 150 trades
- **A5**: average above 0R; profit factor at least 1.15; at least 4 of 6 years positive; no more than 35% of rolling 12-month windows negative; worst fall no more than 15%
- **A6**: at least 150 trades; average above 0R; profit factor at least 1.15; at least 4 of 6 years positive; no more than 35% of rolling 12-month windows negative
- **A7**: at least 150 trades; average above 0R; profit factor at least 1.15; at least 4 of 6 years positive; no more than 35% of rolling 12-month windows negative
- **A8**: at least 150 trades; at least 4 of 6 years positive; no more than 35% of rolling 12-month windows negative
- **B1**: average above 0R; profit factor at least 1.15; at least 4 of 6 years positive; no more than 35% of rolling 12-month windows negative; worst fall no more than 15%
- **B2**: average above 0R; profit factor at least 1.15; at least 4 of 6 years positive; no more than 35% of rolling 12-month windows negative; worst fall no more than 15%
- **B3**: average above 0R; profit factor at least 1.15; at least 4 of 6 years positive; no more than 35% of rolling 12-month windows negative; worst fall no more than 15%
- **B4**: average above 0R; profit factor at least 1.15; at least 4 of 6 years positive; no more than 35% of rolling 12-month windows negative; worst fall no more than 15%

### The same rules read through a second price feed

The app reads its candles from a different vendor than the test, and the owner's broker is a third. Two real feeds were measured to differ by more than a pip on about one candle in eight (`reports/measured-feed-differences.md`). So each configuration that looked better than zero was re-run ten times with its SIGNALS generated from a noisy second-vendor view of the candles, while fills stayed on the real feed.

| Config | Costs | Test feed | Ten second-feed runs: lowest | highest | average | runs above zero |
|---|---|---|---|---|---|---|
| A2 | raw | -0.072R (89 trades) | -0.252R | +0.187R | -0.036R | 4/10 |
| A2 | standard | +0.036R (89 trades) | -0.199R | +0.280R | -0.000R | 5/10 |
| A4 | raw | +0.264R (34 trades) | -0.212R | +0.615R | +0.114R | 7/10 |
| A4 | standard | +0.313R (34 trades) | -0.208R | +0.645R | +0.125R | 7/10 |

### Reading it

- **Plan B loses, and the sample is large enough to say so.** Plan B is our mechanical stand-in for ICT's Charter Model 11: it keeps his order ticket (limit at the 62% retracement plus 5 pips, 20-pip stop, 30-pip target) but replaces his discretionary setup with a swing rule of our own that fires several times a day. About 900 to 1,240 trades per variant, every variant between -0.07R and -0.14R a trade, at most one winning year in six. This says our stand-in loses; it does not test his full discretionary plan.
- **Plan A (sweep, shift, gap) is not distinguishable from zero.** The frequent variants (A1, A5) lose about 0.1R a trade. The live variant (A2) made 89 trades in six years and averaged between -0.07R and +0.04R depending on the cost model; through a second price feed the same rules ranged from -0.25R to +0.28R and averaged about zero. The strictest variants (A4, A8) look positive on 30 to 34 trades, which is far too few: A4's 95% range runs from about -0.2R to +0.9R, and it falls to an average of about +0.1R on a second feed.
- **Which variant fails which mark:** every configuration fails; A4 fails only the minimum number of trades (34 against 150), which is exactly the case that mark exists for.
- **In plain terms:** written as exact rules and charged realistic costs, neither plan showed an edge over six years. That matches last summer's result for the Silver Bullet. It does not prove a skilled discretionary trader cannot do better with the same ideas; it does mean an app that says BUY or SELL from these rules has no demonstrated right to be trusted with money. The test is strict: by simulation, a real but small edge of +0.10R a trade would itself pass all three stages only about one time in ten, so "did not pass" means "not shown", and whether a plan actually lost is read from its own row above.

### Known ways these figures still flatter the rules

Found by the reviewers, not corrected because they would change pre-registered parameters or cannot be modelled; all point the same way.

- The simulator cancels an expired or superseded order at the exact minute. A person may not. With unfilled orders left resting to the end of the day, the first run's A2 went from +0.05R to -0.05R; the late fills averaged -0.4R. Hence the expiry instructions on every ticket.
- The account rules (two trades a day, one per currency) are applied the instant an order would fill. A resting order in MT5 fills regardless unless it has been deleted.
- The "standard" cost model is mid-market, not worst-case, and a flat 0.3-pip slip on stops is kind. Worth roughly 0.01 to 0.03R a trade.
- The 3-minute hand delay assumes every alert is acted on within three minutes at any UK hour.
- On a GBP 500 balance, rounding down to 0.01 lots puts real risk at 0.5% to 1% a trade, so the "worst fall" figures are softer than they read. The table's last sensitivity run (no lot-size limits, in `results/calibration.json`) shows the falls about a fifth deeper for the frequent variants.

### What the app does with this

It shows Plan A setups in the A2 variant on demo. A2 was chosen for fidelity, not for its result: the daily-candle bias, any fair value gap (ICT's own test is only "no gap, no trade"), and his liquidity target. Every ticket says the rules did not pass. There is no quality grade: the stricter "discount" variant did not hold up on a second feed. Plan B is not offered. Real money stays locked; see SPEC section 9.
