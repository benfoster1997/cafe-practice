# FX Desk backtest results

## Stage 1: calibration, 5 Jan 2015 to 31 Dec 2020 (run 11 Nov 2026)

Rules, costs and pass marks were fixed in `fxdesk/SPEC.md` and committed (commit 2f05560) before this was run. Four pairs (EURUSD, GBPUSD, AUDUSD, USDJPY), GBP 500 test account, 1% risk per trade, hand-execution delays and pessimistic fills as specified.

**Outcome: none of the 12 configurations is eligible. Nothing goes forward to validation. The 2021-2026 data remains unopened.**

| Config | Costs | Trades | Wins | Avg per trade | Profit factor | Total | Worst fall | Years up | 12-month windows down | Trades a month |
|---|---|---|---|---|---|---|---|---|---|---|
| A1 | raw | 260 | 36.5% | -0.142R | 0.78 | -36.9R | 32.3% | 2/6 | 16/21 | 3.6 |
| A1 | standard | 257 | 37% | -0.105R | 0.83 | -27.0R | 27.8% | 3/6 | 13/21 | 3.6 |
| A2 | raw | 129 | 39.5% | -0.010R | 0.98 | -1.3R | 11.2% | 3/6 | 12/21 | 1.8 |
| A2 | standard | 129 | 41.1% | +0.052R | 1.09 | +6.7R | 6.2% | 4/6 | 8/21 | 1.8 |
| A3 | raw | 74 | 43.2% | +0.048R | 1.08 | +3.6R | 12.1% | 3/6 | 10/21 | 1.1 |
| A3 | standard | 74 | 43.2% | +0.086R | 1.15 | +6.4R | 9.5% | 4/6 | 9/21 | 1.1 |
| A4 | raw | 42 | 40.5% | +0.135R | 1.21 | +5.7R | 7.2% | 3/6 | 10/20 | 0.6 |
| A4 | standard | 43 | 41.9% | +0.224R | 1.37 | +9.6R | 5.3% | 3/6 | 10/20 | 0.6 |
| A5 | raw | 272 | 37.1% | -0.146R | 0.77 | -39.7R | 38.1% | 2/6 | 17/21 | 3.8 |
| A5 | standard | 268 | 36.6% | -0.149R | 0.76 | -39.8R | 35.8% | 3/6 | 16/21 | 3.8 |
| A6 | raw | 125 | 33.6% | -0.188R | 0.72 | -23.5R | 25.9% | 2/6 | 18/21 | 1.8 |
| A6 | standard | 126 | 33.3% | -0.185R | 0.72 | -23.4R | 22.3% | 1/6 | 19/21 | 1.8 |
| A7 | raw | 75 | 42.7% | -0.007R | 0.99 | -0.5R | 13.9% | 3/6 | 11/20 | 1.1 |
| A7 | standard | 74 | 40.5% | -0.037R | 0.94 | -2.8R | 14.3% | 4/6 | 11/20 | 1.1 |
| A8 | raw | 40 | 45% | +0.104R | 1.17 | +4.1R | 4.7% | 3/6 | 10/20 | 0.6 |
| A8 | standard | 40 | 42.5% | +0.070R | 1.11 | +2.8R | 5.2% | 2/6 | 12/20 | 0.6 |
| B1 | raw | 1210 | 34.5% | -0.096R | 0.82 | -116.3R | 62.6% | 1/6 | 18/21 | 16.8 |
| B1 | standard | 1200 | 33.2% | -0.099R | 0.81 | -119.3R | 61.6% | 1/6 | 19/21 | 16.7 |
| B2 | raw | 946 | 41.4% | -0.085R | 0.83 | -80.3R | 52% | 1/6 | 19/21 | 13.2 |
| B2 | standard | 927 | 40.5% | -0.090R | 0.82 | -83.3R | 52.3% | 1/6 | 19/21 | 12.9 |
| B3 | raw | 1265 | 33.8% | -0.120R | 0.78 | -151.7R | 73.5% | 0/6 | 18/21 | 17.6 |
| B3 | standard | 1476 | 34.1% | -0.094R | 0.82 | -138.1R | 70.4% | 1/6 | 17/21 | 20.5 |
| B4 | raw | 955 | 40.4% | -0.116R | 0.78 | -111.1R | 63.2% | 1/6 | 19/21 | 13.3 |
| B4 | standard | 930 | 39.9% | -0.120R | 0.77 | -111.3R | 63.4% | 1/6 | 19/21 | 12.9 |

Config key: A1-A4 use the daily-candle bias, A5-A8 the four-hour bias; within each, gap any / any / discount / discount and target 2R / liquidity / 2R / liquidity. B1-B2 daily-candle bias, B3-B4 four-hour bias; exits ICT 20/30 then structure.

### Reading it

- **Plan B (ICT's Charter Model 11, the 62% retracement limit order) loses, and the sample is large enough to say so.** About 950 to 1,470 trades per variant, every variant between -0.09R and -0.12R a trade, at most one winning year in six, t-statistics from -2.6 to -4.0. This is not noise. With his own 20-pip stop and 30-pip target it won 33-35% of the time and needed about 43%.
- **Plan A (sweep, shift, gap) is not distinguishable from zero.** The frequent variants (A1, A5: any gap, 2R target) lose 0.10-0.15R a trade. The stricter variants hover between -0.04R and +0.22R on 40 to 129 trades in six years, which is far too few: the 95% interval on the best-looking one (A4) runs from about -0.3R to +0.7R. Every variant fails at least three of the six pass marks, and all the stricter ones fail the minimum of 150 trades.
- **What that means in plain terms:** mechanised faithfully and charged realistic costs, ICT's two most hand-executable forex plans did not show an edge over six years. That matches last summer's result for the Silver Bullet and the independent evidence collected then. It does not prove a skilled discretionary trader cannot do better with the same ideas; it does mean an app that says BUY or SELL from these rules has no demonstrated right to be trusted with money.

### What the app does with this

The app shows Plan A setups (variant A2: daily-candle bias, any gap, liquidity target, the variant closest to break-even with the most trades) on demo, marks the stricter "gap in the discount half" setups as higher grade, and states on every ticket that the rule set did not pass its historical test. Plan B is not offered: showing a rule that loses reliably would be training a bad habit. Going live stays locked behind the demo gate in `docs/PLAN.md` section 6. The demo period is now the real test.
