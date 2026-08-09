# Build Plan & Decision Log

Every decision made for this project, with the reasoning. Written for a
non-coder: if a term isn't explained here, it's explained in the strategy
digest. This document is the contract between owner and bot — the bot does
nothing that isn't written down here or in the digest.

## 1. Goal and honest expectations

- **Goal:** grow toward £50,000 using the *deposit-as-it-proves* route: start
  at £100, and once the system proves itself, feed it with regular deposits.
  £100 alone compounding to £50k would take a decade-plus even at elite
  returns — the £100 phase is the **proof phase**, not the wealth phase.
- **Win-rate policy:** the bot optimizes expectancy (average profit per trade),
  not win rate. Target zone after filters and partials: **~55–65% win rate**
  if the data supports it. Any configuration showing implausibly high win
  rates (80%+) is treated as a bug or hidden risk, not a success.

## 2. Venue and instrument

| Decision | Choice | Why |
|---|---|---|
| Market | Spot forex (CFD) | £100 rules out futures — smallest gold future needs ~$1,700 margin/contract. Futures (MES) reconsidered later if capital grows or a funded account is used. |
| Instrument | **EURUSD** (GBPUSD in backtests for comparison) | Only major where £1/trade risk maths closes at 0.01 lots. Deepest liquidity, tightest spreads, ICT's native instrument family. Gold at 0.01 lots risks ~11% of a £100 account per trade — excluded. |
| Broker | **Pepperstone UK** (MT5, Razor account) | FCA-regulated: segregated client funds, negative balance protection, FSCS cover — structural payout protection. No minimum deposit, no platform fees. Withdrawal record: majority smooth, no pattern of refusal. |
| Platform | MT5 (broker's free live feed) | Feed comes with the account, demo and live. The bot analyses the exact feed it executes on. No data fees exist in this stack. |

## 3. Strategy

- **Setup:** ICT Silver Bullet, New York AM killzone — 10:00–11:00am New York
  time (**3–4pm UK** almost all year; the bot works in NY time so UK/US clock
  changes handle themselves).
- **Scope discipline:** Silver Bullet only until it passes or fails the demo
  gate. The wider 2022/2023/2024 model concepts inform its filters but no
  second setup is added before then.
- **Source of truth:** `docs/ICT_STRATEGY_DIGEST.md` (Phase 1 deliverable),
  researched from ICT's 2022, 2023 and 2024 mentorship material and
  independently published backtests, then reviewed by the owner before any
  strategy code is written. Where ICT is ambiguous, the digest states OUR
  mechanical resolution explicitly marked as such.

## 4. Trade management (locked 2026-08-09)

Owner selected all three mechanisms:

1. **Stricter filters** — the bot trades only the cleanest setups. Filter set
   (exact thresholds calibrated in Phase 2 backtesting, not chosen by feel):
   - Inside the killzone window only; no entries outside it.
   - A qualifying liquidity sweep must precede the setup (session high/low or
     previous-day high/low taken).
   - Market structure shift with real displacement (minimum candle-body /
     ATR threshold from backtest calibration).
   - Entry FVG must be on the correct side of equilibrium: longs in discount,
     shorts in premium.
   - Higher-timeframe bias must align (definition per digest).
   - News filter: no new entries within a buffer around high-impact USD/EUR
     releases; buffer size set in Phase 2.
2. **Partial profits** — close 50% of the position at +1R (one unit of risk),
   remainder runs to the full target (opposing liquidity / minimum 2R;
   finalized in Phase 2).
3. **Break-even management** — after the +1R partial fills, stop moves to
   entry (plus a small spread buffer), converting the remainder into a
   risk-free runner.

**Accepted trade-off:** stricter filters mean fewer trades. The 40-trade demo
gate may take ~3–4 months instead of ~2–3. Quality over frequency is the
deliberate choice.

## 5. Hard risk rails (non-negotiable, enforced in code)

- Risk per trade: **1%** of account (£1 at £100).
- Maximum **2 trades per day**; bot stands down after the second regardless
  of outcome.
- **Daily loss cutoff:** after −2% on the day, bot flat and off until tomorrow.
- Every order carries an attached stop-loss and take-profit from the moment
  it's placed. No naked positions, ever.
- No martingale, no grid, no averaging down, no recovery sizing. A losing
  trade is closed and forgotten, never doubled.
- Kill switch: one tap disables all trading; Telegram alert on every action
  the bot takes.

## 6. Demo gate (owner accepted 2026-08-09)

Live £100 is funded only after ALL of the following on demo:

- ≥ **40 tracked trades**
- **Net profitable** after modelled costs (spread + commission)
- **Profit factor ≥ 1.5** (gross wins ≥ 1.5× gross losses)
- **Max drawdown ≤ 10%** of demo balance
- **Zero rule violations** — a winning trade that broke the written rules
  counts as a failure of the gate, not a success of the trade

There is deliberately **no win-rate criterion**: win rate can be gamed by
bad reward-to-risk; profit factor can't. Losing trades don't fail the gate —
deviating from the system does.

## 7. Architecture

- **Execution:** MQL5 Expert Advisor in MT5 on the owner's MacBook
  (MetaQuotes' Wine-based Mac build). Full-auto entries/management during the
  window with the owner supervising — mode (b), chosen by owner.
- **Alerts:** Telegram bot pushes every signal, fill, partial, stop move and
  daily summary to the owner's phone in real time.
- **Backtesting:** Python (owner's Mac or this repo's CI) — honest cost model
  (spread, commission, slippage), strict train/test split, walk-forward
  validation. TradingView is optional for eyeballing charts only; nothing
  executes there.
- **Zero-coding owner:** all setup steps ship as click-by-click instructions
  with screenshots; owner never edits code.

## 8. Known constraints & future options

- MacBook must be awake with MT5 open 3–4pm UK on trading days (the
  supervision hour anyway). If this proves unreliable, a small Windows VPS
  (~£10–15/mo) is the upgrade path — decision deferred until demo phase.
- Futures/funded-account route (Topstep/Apex-style) stays open for later:
  supervised automation is permitted there under current 2026 policies, but
  only worth fees once the strategy is proven on demo. Their rules
  (SL/TP attached to every order, active monitoring, no unattended VPS bots)
  are already satisfied by this design.

## 9. Decision history

- 99% / 80% win-rate targets declined — replaced by expectancy optimization
  (owner accepted).
- "30 consecutive demo wins" gate replaced by the criteria in §6 (owner
  accepted).
- Futures at £100 ruled out by margin arithmetic; MES revisit-later.
- Gold (XAUUSD) excluded at current account size by risk arithmetic.
- iPhone-only MT5 bot ruled out (iOS app cannot run Expert Advisors);
  iPhone's role is Telegram alerts + MT5 mobile monitoring.
- Owner selected: full-auto with supervision · Silver Bullet first ·
  demo-first · stricter filters + partials + break-even management.
