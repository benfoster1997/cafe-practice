# Project instructions for Claude

## Where the owner is now (20 Nov 2026)

No project is active. On 19 Nov the owner closed FX Desk and asked for the
best way to earn money with Claude ("passive, easy, quick; choose for me").
He was told plainly that those three do not exist together, and given one
choice from the August research: a quote-writing service for small trade
contractors, starting with a 14-day conversation test. On 20 Nov he asked
again; that answer was checked by nine agents and one part changed: the
quote-writing service is no longer a settled choice (cheap apps now do it),
while the conversation test stands with a corrected, lawful script. He has
not yet said go. **Read the top section of `app/STATUS.md` before answering
anything about income. Do not launch another idea search:**
`app/research/STRATEGIC_POSITION.md` explains why (eight ideas tested, eight
killed; the bottleneck is selling, not ideas).

## Four projects live in this repo

- **FX Desk (CLOSED 19 Nov 2026 at the owner's request: switched off, code
  kept)** (branch `claude/youtube-ai-monetization-study-4ipk3c`, folder
  `fxdesk/`): an iPhone web app that gave ICT-method forex tickets to copy
  into MT5 on a demo account. The live site https://fx-desk-ict.netlify.app
  now serves a single "closed" page; no scanner runs and no notifications
  are sent. The rules did NOT pass their backtest; never describe them
  otherwise. Do not resume or redeploy unless the owner asks; the top of
  `fxdesk/STATUS.md` says how to bring it back.
- **App business (paused 10 Nov 2026, when the owner switched to FX
  Desk; income question reopened 19 Nov, see above)** (same branch): building a B2B SaaS to £2,000+/month MRR. Read
  `app/STATUS.md` FIRST, then `docs/APP_MISSION_BRIEF.md` (the contract).
  Do not resume unless the owner asks.
- **YouTube channel "Cooked Books" (PARKED 17 Aug 2026)** (same branch):
  read `channel/STATUS.md` before touching. Do not resume unless the owner
  asks.
- **Silver Bullet trading bot** (branch `claude/mt5-xauusd-iphone-bot-ndfkda`):
  everything below.

## What this project is

Silver Bullet trading bot for a supervised MT5 setup. Read `docs/PLAN.md`
first — it is the decision log and contract with the owner; do not revisit
decisions recorded there without the owner asking. The strategy spec lives in
`docs/ICT_STRATEGY_DIGEST.md` once Phase 1 completes.

## Owner context

- Owner has zero coding experience. All user-facing docs must be plain
  English, click-by-click. The owner never edits code.
- Communication style: direct and honest. The owner has explicitly accepted
  realistic-expectation corrections (win rate, capital growth) — do not
  re-sugar-coat, and do not re-litigate settled expectations.

## Model preference (owner request, 2026-08-09)

- Preferred model: Fable 5 with ultracode for substantive build/research
  phases. If Fable 5 usage limits force a fallback, continue on Opus 5 with
  ultracode rather than pausing work.
- When Fable 5 becomes available again: use judgment — return to Fable 5 for
  the hard phases (strategy implementation, calibration, adversarial review);
  Opus 5 is acceptable for routine continuation and mechanical work.
- Note: the in-session model is controlled by the owner's /model command or
  app fallback, not by Claude. This preference applies to subagent/workflow
  model choices and to session setup guidance.

## Engineering rules

- Honest backtesting is the core value: pessimistic intrabar resolution,
  full cost modelling, no lookahead. Never weaken these to improve results.
- Risk rails (1%/trade, 2 trades/day, daily cutoff, always-attached stops)
  are enforced in engine/EA code, never only in strategy logic.
- Run `python3 -m pytest tests/ -q` before every commit touching `backtest/`.
- Push to branch `claude/mt5-xauusd-iphone-bot-ndfkda`.
