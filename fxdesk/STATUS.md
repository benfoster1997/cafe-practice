# FX Desk status - read this first in any new session

Last updated: 11 Nov 2026. Branch `claude/youtube-ai-monetization-study-4ipk3c`.
(CLAUDE.md says trading work goes on `claude/mt5-xauusd-iphone-bot-ndfkda`; this
session was restricted to the branch above, so the FX desk lives here in
`fxdesk/`. The old `backtest/` Python engine is untouched.)

## What the owner asked for (10 Nov 2026)

A web app for his iPhone that analyses live forex data and says BUY / SELL /
NO TRADE with a suggested pair, easy to copy by hand into MT5 on iOS; demo
account first, live later. Started from scratch (he said to forget Scalp
Desk). His answers:
- Method: ICT (Inner Circle Trader), "research his best strategy".
- Style: intraday, M15 to H1. Placing: copy by hand. Alerts: Telegram, any UK hour.
- Broker: he will send a screenshot of his MT5 demo account (NOT YET RECEIVED).
- Later live stake: about GBP 500.

## Where things stand

1. DONE - price history: HistData M1, 7 majors, 2015 to Nov 2026, vendor
   clock corrected (it is NOT fixed EST; see `backtest/data.py`). Data is in
   `data/histdata/` which is git-ignored: rebuild with
   `python3 fxdesk/scripts/download_histdata.py data/histdata/zips 2015 2026 EURUSD GBPUSD USDJPY AUDUSD USDCAD USDCHF NZDUSD`
   then `python3 fxdesk/scripts/build_history.py <pairs>` (about 15 minutes).
2. DONE - shared TypeScript core (`fxdesk/core/`), used by backtest AND app:
   clock, candles, simulator with account rules, metrics. 34 tests:
   `node --test 'fxdesk/core/test/*.test.ts'`.
3. DONE - rulebook `fxdesk/SPEC.md`, pre-registered before any result.
   Two ICT plans, 12 configurations. `node fxdesk/backtest/run.ts selftest`
   proves no lookahead and live/backtest equivalence.
4. DONE - calibration 2015-2020: **nothing passed** (`research/RESULTS.md`).
   Plan B loses clearly; Plan A is about break-even on too few trades.
   Validation (2021 to mid-2023) and verdict (mid-2023 to Oct 2026) data are
   SEALED and must stay sealed: no configuration earned the right to open them.
5. IN PROGRESS - independent code review (3 reviewers); the app.

## Honest position to keep telling the owner

No ICT rule set tested here or last summer has shown an edge after costs.
The app is a disciplined demo tool with an honest scoreboard, not a money
machine. Live trading stays locked behind the demo gate in `docs/PLAN.md` s.6.

## Research notes

Usage limits cut the first research round short: only two of seven web
research reports exist (`research/reports/forex-native-models.md`,
`ict-own-ranking.md`), not fact-checked. Our own measurements
(`measured-base-rates.md`, `measured-feed-differences.md`) are solid.
Workflow scripts are in `research/workflows/`. Keep agent fan-out small:
the owner's 5-hour usage limit was hit once by seven web-heavy agents.
