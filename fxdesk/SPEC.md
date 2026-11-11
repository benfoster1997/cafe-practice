# FX Desk rulebook and test plan (pre-registered)

Written 11 November 2026 and committed **before any profit or loss figure
for these rules was looked at**. From here on the rules may only change to
fix a mistake in the code (logged in section 11), never to improve a result.

Plain-English summary: two trading plans from ICT's teaching, written as
exact rules a computer can follow, plus the test each must pass before the
app is allowed to describe it as anything other than "unproven".

Nothing in this document says either plan makes money. Last summer four
strategy families failed this same kind of test (`docs/FINAL_VERDICT.md`).
The honest prior is that these fail too.

## 1. What the app trades

- **Pairs:** EURUSD, GBPUSD, AUDUSD, USDJPY, the four ICT names for his
  forex day trades ("euro dollar, cable, Aussie dollar, dollar yen").
- **Charts:** 15-minute candles for entries; 4-hour and daily candles for
  direction. All candles are built by us from one price feed, with the day
  running 17:00 to 17:00 New York time (five daily candles a week).
- **Clock:** every time rule is in New York time, daylight saving handled.
  The owner sees UK time.
- **Order type:** always a pending LIMIT order with stop-loss and
  take-profit attached, placed by hand in MT5.

## 2. Terms

- **Pip:** 0.0001 on EURUSD, GBPUSD, AUDUSD; 0.01 on USDJPY.
- **R:** the amount risked on a trade. "+2R" is a win of twice the risk.
- **Liquidity pool:** a price where stop orders are likely resting: just
  beyond an obvious earlier high or low.
- **Sweep:** price trading beyond a pool.
- **Swing high / low:** a candle whose high is above the highs of the
  candles either side of it (mirror for a low). It is only known once the
  candle after it has closed.
- **Fair value gap (FVG):** three candles where the first candle's high is
  below the third candle's low (bullish), leaving a price band only one
  candle traded through. Mirror for bearish.
- **Killzone:** ICT's session windows. London 02:00 to 05:00 and New York
  07:00 to 10:00, New York time.
- **Usable candle:** any 15-minute candle except those opening 16:45 to
  18:00 New York. Around the daily rollover spreads widen and two data
  vendors were measured up to 20 pips apart
  (`research/reports/measured-feed-differences.md`), so those candles never
  define a level.

## 3. Rules common to both plans

| Rule | Value | Whose |
|---|---|---|
| A level counts as taken only if price trades beyond it by | 2 pips | OURS (two feeds differ by more than 1 pip on about one candle in eight) |
| A close counts as beyond a level only by | 1 pip | OURS |
| Stop sits beyond its structure by | 2 pips, plus 2 more on sells (sell stops trigger on the ask price) | OURS |
| Entry, stop and target are rounded to whole pips | entry rounded toward price, so fills are not flattered | OURS |
| A day with fewer than 60 usable candles is ignored (holidays) | 60 | OURS |
| No signals on the first Friday of the month (US jobs report) | whole day | ICT (do not trade NFP), date rule OURS |
| No signal from candles opening 08:15 or 08:30 New York | daily | OURS, covers every 08:30 US release |
| Any open trade is closed at 16:00 New York; 13:45 on scheduled Federal Reserve decision days | daily | OURS (intraday only, no overnight financing) |
| Unfilled orders expire one hour after the killzone ends (06:00 / 11:00 New York) | | OURS |
| One order per pair per killzone per day for Plan A; Plan B may replace its order as the leg extends | | OURS |

## 4. Direction for the day (the bias)

ICT leaves this to judgement. Two mechanical stand-ins are tested, both
ours, both built only from candles that have closed.

**4.1 Daily candle bias.** Compare yesterday (Y) with the day before (P):
- Y closed above P's high: **bullish**.
- Y closed below P's low: **bearish**.
- Y traded above P's high but closed back below it, without taking P's
  low: **bearish** (a failed break).
- Y traded below P's low but closed back above it, without taking P's
  high: **bullish**.
- Anything else: **no bias, no trade**.

Measured on 2015-2019 before any rule was written: after a close above the
prior high, the next day made a higher high about 71% of the time against a
48% base rate. That is partly mechanical and is not evidence of profit.

**4.2 Four-hour structure bias.** Over the last 120 four-hour candles: the
direction of the most recent close beyond the latest known 4-hour swing
high (bullish) or swing low (bearish). Read at the moment of the signal.

## 5. When signals may fire

A signal fires only at the close of a usable 15-minute candle that opened
inside a killzone: London 02:00-04:45, New York 07:00-09:45 (New York time),
excluding the 08:15 and 08:30 candles.

## 6. Plan A: sweep, shift, gap

ICT's 2022 sequence. He teaches it on index futures on 1 to 5 minute
charts; running it on 15-minute forex candles is OUR adaptation.

Written for a buy; a sell is the exact mirror.

1. **Bias** is bullish (section 4).
2. **Pools below price** that are still standing when the sweep window
   opens: yesterday's low; the Asian range low (19:00-00:00); and, for the
   New York killzone only, the London session low (00:00-07:00).
   The sweep window opens at 00:00 for London and 07:00 for New York.
3. **Sweep:** a usable candle trades at least 2 pips below the pool. The
   lowest low from then on is the sweep low; a lower low restarts step 4.
4. **Shift:** a later candle closes at least 1 pip above the most recent
   swing high that formed before the sweep low (searched up to 20 candles
   back). ICT accepts a trade-through; requiring a close is the community's
   stricter reading.
5. **Gap:** by the shift candle or the one after it, the move up from the
   sweep low has left a bullish fair value gap of at least 2 pips that price
   has not traded back into. If there are several, the highest is used.
   Variant "discount": the top of the gap must be at or below the midpoint
   of the move. No gap, no trade (ICT's own test of displacement).
6. **Entry:** buy limit at the top of the gap.
7. **Stop:** 2 pips below the sweep low. If that is closer than 8 pips to
   the entry it is widened to 8 pips; if wider than 35 pips, no trade.
8. **Target,** two variants: (a) twice the risk; (b) the nearest pool above
   (yesterday's high, the Asian range high, the London session high, or
   today's high before the sweep), less 2 pips, if it lies between 1.5 and
   4 times the risk away; otherwise no trade.
9. The order is withdrawn if price reaches the target before filling.

| Parameter | Value | Whose |
|---|---|---|
| Sequence sweep, shift, gap, limit entry at the gap edge | | ICT |
| Pools: previous day, Asian range, London session | | ICT (pool list), window times per section 5 |
| Shift needs a close, not just a trade-through | | COMMUNITY |
| Swing search 20 candles; gap at least 2 pips; gap by the candle after the shift | | OURS |
| Stop 8 to 35 pips | | OURS (cost geometry; a GBP 500 account cannot size wider) |
| Targets 2R, or liquidity at 1.5R to 4R | | 2R OURS; liquidity target ICT |

Configurations (8): bias {daily candle, 4-hour} x gap {any, discount} x
target {2R, liquidity} = A1 to A8 as listed in
`core/models/sweepFvg.ts`.

## 7. Plan B: optimal trade entry

ICT's Charter Model 11, the plan he wrote down as a hand-placed limit
order. Written for a buy; a sell is the mirror.

1. **Bias** is bullish.
2. **The leg:** from today's lowest low since 00:00 New York to the highest
   high made after it. It must be at least 30 pips. (He leaves the choice
   of swing to judgement; this definition is ours.)
3. **Trigger:** inside a killzone, the first candle that fails to make a
   new high, provided price has not already pulled back to the entry.
4. **Entry:** buy limit at the 62% retracement of the leg, plus 5 pips
   (his words: "the 62% retracement level ... plus five pips").
5. **Exits,** two variants:
   - "ICT 20/30": stop 20 pips, target 30 pips, stop moved to the entry
     price once the trade is 20 pips in profit (his figures; his extra
     5-pip stop reduction at +15 is left out because it cannot be done
     reliably by hand from an alert).
   - "structure": stop 5 pips below the start of the leg (10 to 35 pips,
     else no trade), target 1.5 times the risk, no stop moves.
6. If price makes a new high before the order fills, the order is
   withdrawn and a fresh one is issued when that new high stalls.

Configurations (4): bias {daily candle, 4-hour} x exits {ICT 20/30,
structure} = B1 to B4.

## 8. Account rules (not negotiable, enforced by the simulator and the app)

1% of the balance risked per trade, sized in real 0.01 lots and never
rounded up (a trade too small to size is skipped); at most two filled
trades per trading day; no new trade after a 2% loss on the day; one
position per pair; no second position that repeats a currency exposure
(two USD shorts count as one bet); every order carries its stop and
target; no averaging down, no martingale. Test balance GBP 500.

## 9. The test

**Fills are told pessimistically** (`core/sim.ts`, 27 tests): buys fill on
the ask and exit on the bid; a touch is not a fill (price must trade 0.1
pip through); if one candle holds both stop and target the stop is taken;
stops slip and gap; the order only becomes live 3 minutes after the signal
candle closes and a move through the entry before then is a MISSED trade;
a hand-moved stop takes effect 5 minutes later.

**Costs:** two account types, both on the pessimistic side
(`core/costs.ts`): raw (tight spread plus commission) and standard (wider
spread, no commission). A result must hold under both.

**Data, split three ways and each later part opened once:**

| Part | Dates | Use |
|---|---|---|
| Calibration | 5 Jan 2015 to 31 Dec 2020 | choose among the 12 configurations |
| Validation | 1 Jan 2021 to 30 Jun 2023 | one run per configuration carried forward |
| Verdict | 1 Jul 2023 to 31 Oct 2026 | one run, after independent review of the code |

2015-2019 was examined beforehand for descriptive base rates only. The
verdict years have not been used for anything except one week of feed
comparison.

**Calibration: a configuration is eligible if, under BOTH cost models:**
at least 150 trades; average result above 0R; profit factor at least 1.15;
at least 4 of the 6 calendar years positive; no more than 35% of rolling
12-month windows negative; worst fall in the balance no more than 15%.
At most ONE eligible configuration per plan goes forward: the one with the
highest t-statistic under standard costs.

**Validation passes if, under both cost models:** at least 50 trades;
average result above 0R; profit factor at least 1.10.

**Verdict passes if, under both cost models:** at least 60 trades; average
result above 0R; profit factor at least 1.15; worst fall in the balance no
more than 12%; AND the average result is not negative under stress costs
(everything half as bad again); AND with signals generated from a noisy
second-vendor view of the candles (5 seeds) the average result stays
positive in at least 4 of 5 and keeps at least half its size.

**What a pass would and would not mean.** Twelve configurations are being
compared on the calibration years, so one looking good by luck is likely;
that is what the two later parts are for. Even so, a strategy with no edge
at all would pass the verdict rule perhaps one time in six. A pass means
"worth a demo test", not "proven". A fail means the app must say so on
every signal.

**The demo gate for real money is unchanged** (`docs/PLAN.md` section 6):
40 tracked demo trades, net profitable after costs, profit factor at least
1.5, drawdown at most 10%, no rule broken.

## 10. What every alert must carry

Pair; Buy or Sell; "limit order"; entry, stop and target prices; lot size
for the balance in Settings; expiry in UK time; the reasons, one line each
(bias, what was swept or which leg, where the entry comes from); the plan
and configuration; and that plan's tested record, pass or fail.

## 11. Decision log

- 11 Nov 2026, before any result: the first draft of Plan A produced about
  15 orders a year, too few to judge. Counts of setups surviving each rule
  (not outcomes) showed two rules inherited from last summer's one-minute
  design doing the damage: "three closes beyond the level is a run" (kills
  60% of sweeps on 15-minute candles) and "the gap must be in the discount
  half". The first was removed, with the reclaim-and-timeout rules that
  went with it; the second became a tested variant. Plan A then produced
  about 85 orders a year.
- Rejected before testing: the London "Judas" trade as a blind limit order
  beyond the Asian range (measured: the first sweep of the Asian range is
  followed by a close on the SAME side 55-65% of the time, so an
  unconfirmed fade starts from behind; Plan A's London window tests the
  confirmed version); the 5-minute and 20-pip scalp models (wrong
  timeframe for hand execution); everything ICT has taught since 2024
  (index futures on charts of seconds).
