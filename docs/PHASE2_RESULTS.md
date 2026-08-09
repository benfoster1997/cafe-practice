# Phase 2 results — first honest backtest of the Silver Bullet on EURUSD

**Date:** 2026-08-09 · **Verdict: no edge found at these translations.**
Written for the owner. Numbers are from in-sample years 2019–2020 only;
2021–2022 data remains untouched (see "Discipline" below).

## What was tested

The digest §5 playbook, mechanically: NY AM window (10–11am ET), two-factor
daily bias, liquidity sweep → market structure shift → first qualifying FVG,
limit entry at the gap edge, stop beyond the swept extreme, target at the
daily draw, 50%-at-1R partial + break-even, 11:30 flatten. Costs measured
from real tick data (0.3-pip spread) plus 0.2-pip slippage and $3.50/lot/side
commission. Pessimistic fills throughout (verified by adversarial review).

Three calibration rounds, 96–240 configurations total, including both sides
of every documented ambiguity (MSS close vs wick, FVG window readings, gap
minimums, distance floors, sweep confirmations), plus fidelity improvements
(15-minute swing pools, pool-role split between raid fuel and daily-objective
draws).

## The result

**Every configuration loses money.** Best expectancy −0.56R per trade, worst
−1.11R; win rates a respectable 42–46%, profit factors 0.26–0.32. Zero
configurations met the pre-registered eligibility rule (≥30 trades, positive
expectancy, PF ≥ 1.2, 2-of-3 profitable years).

## Why — the diagnosed mechanism (best 24-trade config)

| Exit type | Count | Average R |
|---|---|---|
| Stop | 12 | **−1.76R** |
| Break-even scraps | 9 | +0.15R |
| Time flatten 11:30 | 3 | +1.69R |
| Full target | **0** | — |

Two structural problems, both geometric, neither a coding artifact:

1. **Stops are too tight for the costs.** The swept extreme sits ~4 pips
   from the FVG edge on 1-minute EURUSD. Round-trip costs (~1.4 pips) are a
   third of that stop distance, and gap-through/slippage push the true cost
   of a nominal −1R loss to −1.76R.
2. **Targets are too far for the clock.** The daily-objective draw is tens
   of pips away; not one trade reached it before the 11:30 flatten. The
   only good exits were truncated winners.

This matches the digest's independent-evidence section (§8): published
attempts to mechanize FVG entries die to spread and commissions, and no
methodologically sound backtest of the Silver Bullet shows an edge. Our
result is now the most rigorous test of it we're aware of, and it agrees.

## Discipline notes

- The eligibility rule was pre-registered before any sweep ran and never
  edited. With zero eligible configs, the out-of-sample years were NOT run —
  they stay virgin for any future revision.
- Structural changes between rounds were digest-documented alternatives or
  documented-simplification removals, each recorded in git history — not
  free parameter torture.
- Known optimism remaining in the backtest (CPI/FOMC days not excluded)
  would make live results WORSE than these numbers, not better.

## Options from here (owner's decision)

A. **Accept the finding.** The mechanical NY-AM Silver Bullet on EURUSD has
   no edge at realistic costs. Cost of discovery: £0.
B. **One targeted research round attacking the diagnosed geometry** (still
   digest-faithful): a minimum stop-distance floor (cuts the cost share per
   R), nearer/fixed 2R targets instead of the daily draw (the digest's own
   small-account blended rule), dropping the 11:30 flatten (digest allows
   running past 11:00 — the flatten was our addition), and/or the London
   3–4am window where EURUSD is most active. Verdict on 2021–2022 only if
   in-sample turns positive.
C. **Change instrument** toward ICT's demonstrated markets (index CFDs) —
   needs new data sourcing and fresh cost analysis first.
