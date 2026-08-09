# Silver Bullet Bot

An automated trading system implementing ICT's (Inner Circle Trader) Silver Bullet
setup, built for supervised automated trading on MetaTrader 5.

**Owner:** Ben Foster · **Status:** Phase 1 — strategy research

## What this is

A bot that trades the ICT Silver Bullet setup during the New York AM killzone
(3–4pm UK time) on EURUSD, running as an MT5 Expert Advisor with the owner
supervising during the trading window. Every rule the bot follows is written
down, tested against historical data, and proven on a demo account before any
real money is at risk.

## What this is not

- Not a 99% (or 80%) win-rate machine — no honest system is. The bot optimizes
  **expectancy** (how much it makes per trade on average), not win rate.
- Not a get-rich-quick device. The starting stake is £100; the £100 phase
  proves the system works. Growth comes from feeding a proven system, not
  from leverage or luck.
- Not a black box. Every trade it takes maps to a numbered rule in
  `docs/PLAN.md` and the strategy digest.

## Roadmap

| Phase | Deliverable | Status |
|---|---|---|
| 1. Research | ICT strategy digest (2022/2023/2024 mentorships) for owner review | done — awaiting owner review |
| 2. Backtest | Python backtest harness with honest cost modelling; strategy calibration | harness built; calibration pending |
| 3. Build | MQL5 Expert Advisor + Telegram alerts | pending |
| 4. Demo gate | 40+ tracked demo trades meeting the gate criteria (see PLAN) | pending |
| 5. Live | £100 at Pepperstone UK, deposit-as-it-proves | pending |

## Repository layout

- `docs/PLAN.md` — the full build plan and every locked decision, with reasoning
- `docs/ICT_STRATEGY_DIGEST.md` — the researched strategy spec (Phase 1 deliverable)
- `backtest/` — Python backtesting harness (Phase 2)
- `ea/` — MQL5 Expert Advisor source (Phase 3)
