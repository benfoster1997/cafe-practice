# Measured base rates behind ICT's session claims (our own data)

**What this is.** Plain counts from our verified one-minute price history (HistData bid, clock corrected to UTC, aggregated to M15 and to 17:00-New-York daily bars), for the seven majors, **1 January 2015 to 31 December 2019 only**. Nothing after 2019 was looked at, so the validation and verdict years stay untouched. No entries, no costs, no strategy: these are descriptions of what price did, to replace quoted folklore with numbers before any rule is written. Script: `fxdesk/research/scripts/base_rates.ts`. Raw output: `measured-base-rates.json`.

**How to read it.** A figure near 50% means the claim it tests carries no directional information on its own. Windows are New York time. 'Asian range' is 19:00-00:00 (one of ICT's several definitions). A 'sweep' is price trading at least one pip beyond the Asian high or low between 00:00 and 05:00.

## 1. Size of the day and of the Asian range (pips)

| Pair | Days | Daily range median (25th-75th) | Asian range median | Asian range <=20 | <=30 | <=40 |
|---|---|---|---|---|---|---|
| EURUSD | 1293 | 77.4 (56.6-103.1) | 20 | 49.3% | 79.2% | 90% |
| GBPUSD | 1293 | 102.2 (77.8-138.2) | 23.7 | 35% | 71.4% | 86.8% |
| USDJPY | 1294 | 77.1 (55-104.1) | 32.2 | 17.6% | 44.7% | 66.5% |
| AUDUSD | 1293 | 62.5 (45.7-84.3) | 28.9 | 21.8% | 52.4% | 74.6% |
| USDCAD | 1293 | 87.8 (64.2-118.8) | 22.9 | 39% | 71.6% | 89.2% |
| USDCHF | 1293 | 64.9 (48.5-89.8) | 16.5 | 65.4% | 86.7% | 94.8% |
| NZDUSD | 1293 | 63.1 (46.8-84.9) | 26.9 | 27% | 59.9% | 80% |

## 2. "London makes the high or low of the day"

Share of days on which the day's high OR low was set inside each killzone. The London killzone is three hours of a 24-hour day (12.5% of the clock), so each extreme would land there about 12.5% of the time by chance and either-extreme about 23%.

| Pair | London KZ 02:00-05:00 made the high or low | New York KZ 07:00-10:00 made the high or low | High set in London KZ | Low set in London KZ |
|---|---|---|---|---|
| EURUSD | 31.3% | 32% | 18.2% | 13.4% |
| GBPUSD | 37.3% | 28.9% | 19.3% | 18.7% |
| USDJPY | 18.7% | 25.5% | 8.8% | 10.1% |
| AUDUSD | 20.8% | 22.8% | 11.5% | 9.5% |
| USDCAD | 19.4% | 37% | 9.3% | 10.1% |
| USDCHF | 30.8% | 30.6% | 15.9% | 15.4% |
| NZDUSD | 18.5% | 23.1% | 10.8% | 7.7% |

Reading: for EURUSD, GBPUSD and USDCHF the London killzone sets an extreme on roughly a third of days, above the ~23% chance level but far from 'most days'. For USDJPY, AUDUSD, NZDUSD and USDCAD it is at or below chance. Any London-open model should expect to be a EUR/GBP/CHF model.

Full time-of-day table for EURUSD (share of days the high / the low was set in each window):

| Window (New York) | High of day | Low of day |
|---|---|---|
| 17:00-00:00 Asia | 20% | 21.7% |
| 00:00-02:00 | 3.3% | 2.9% |
| 02:00-05:00 London KZ | 18.2% | 13.4% |
| 05:00-07:00 | 6.7% | 6.5% |
| 07:00-10:00 NY KZ | 15.8% | 17.6% |
| 10:00-12:00 | 14.6% | 15% |
| 12:00-17:00 | 21.4% | 23% |

## 3. The Asian-range sweep and the 'Judas swing'

| Pair | Swept high only | Low only | Both sides | Neither | After the FIRST sweep: opposite Asian extreme reached same day | ...before 12:00 NY | Day closed on the OPPOSITE side of the midnight open | How far price ran beyond the swept extreme before noon: median / 75th / 90th pct (pips) |
|---|---|---|---|---|---|---|---|---|
| EURUSD | 35.5% | 32.9% | 27.7% | 3.9% | 63.4% | 59.6% | 43.5% | 27.8 / 51 / 76.2 |
| GBPUSD | 28.8% | 31.2% | 37.7% | 2.3% | 65.3% | 62.2% | 43.8% | 40.4 / 70.5 / 104.1 |
| USDJPY | 37.9% | 35% | 4.9% | 22.1% | 38.9% | 32.6% | 38.7% | 25.2 / 46 / 70.1 |
| AUDUSD | 39.1% | 34.5% | 6.7% | 19.8% | 35.4% | 29.7% | 37% | 20.9 / 35.8 / 54.5 |
| USDCAD | 38.9% | 36.3% | 16.9% | 7.8% | 65.4% | 59.7% | 45.2% | 30.6 / 57.1 / 84.7 |
| USDCHF | 36% | 30.5% | 28.5% | 4.9% | 64.3% | 60.3% | 43.2% | 23.9 / 44.2 / 66 |
| NZDUSD | 38.7% | 35% | 7% | 19.2% | 35% | 29.4% | 35.5% | 22 / 38 / 56.1 |

Reading, and this matters for any Judas-swing rule:

- London takes out one side of the Asian range on almost every day for EUR/GBP/CHF/CAD. A sweep by itself is therefore not a signal; it is the normal state of the world.
- **Unconditionally, the first sweep is NOT a reversal signal.** In every pair the day closed on the opposite side of the midnight open on only 35-45% of days, i.e. on 55-65% of days it closed on the SAME side as the first sweep. The first break of the Asian range leans toward continuation. A Judas-swing fade can only work if the daily-bias filter is doing real work, because the raw tendency runs against it.
- The 'opposite extreme reached' column looks encouraging (about 60-65% for EUR/GBP/CHF/CAD) but the Asian range is only about 20 pips wide, so 'reached the other side' is a small move, and the extension column shows what it costs to wait for it: the median run beyond the swept extreme before noon is 21-40 pips and one day in four runs 36-70 pips. ICT's stated 30-40 pip stops for this trade sit right inside that distribution.
- Tight Asian ranges (<=30 pips), EURUSD: opposite extreme reached same day 67%, closed opposite side of midnight 44.6% (n=1010) - no better than all days.

## 4. "New York is a continuation of London"

Share of days where the 07:00-12:00 New York move had the same sign as the 02:00-07:00 London move:

| EURUSD | GBPUSD | USDJPY | AUDUSD | USDCAD | USDCHF | NZDUSD |
|---|---|---|---|---|---|---|
| 50% | 50.2% | 49.5% | 50.8% | 50% | 49% | 50.1% |

Reading: a coin flip in every pair. As a stand-alone directional rule, 'New York continues London' has no content. If the New York continuation model has an edge it must come from the daily bias or the entry structure, not from London's direction.

## 5. Previous-day high/low logic (the simplest daily-bias rule)

| Pair | Base rate: next day makes a higher high | After a daily CLOSE above the previous day's high (n) -> next day higher high | ...next day lower low | After sweeping the previous high but closing back below it (n) -> next day lower low | ...next day higher high |
|---|---|---|---|---|---|
| EURUSD | 47.5% | 72.4% (n=297) | 17.5% | 59.1% (n=318) | 36.2% |
| GBPUSD | 47.1% | 71.3% (n=296) | 17.9% | 57.5% (n=313) | 39% |
| USDJPY | 48.9% | 72.2% (n=313) | 19.8% | 57.9% (n=321) | 38.9% |
| AUDUSD | 46.9% | 69.2% (n=292) | 20.2% | 61.3% (n=315) | 38.1% |
| USDCAD | 49.9% | 70.3% (n=317) | 19.9% | 55.9% (n=331) | 39.9% |
| USDCHF | 50.5% | 72.4% (n=301) | 15.9% | 60.5% (n=354) | 41.5% |
| NZDUSD | 48.5% | 71.9% (n=285) | 15.8% | 57.8% (n=341) | 38.7% |

Reading, with the trap spelled out:

- After a close above the previous day's high, the next day makes a higher high about 70-72% of the time against a ~48% base rate. After a failed sweep (took the high, closed back under it) the next day makes a lower low about 56-61% of the time.
- **This is partly mechanical and is NOT evidence of a tradeable edge.** A day that closes above yesterday's high usually closes near its own high, so tomorrow needs to move only a few pips to print a 'higher high'. The statistic says where the next extreme is likely to be poked, not that there is profit in between after a stop and costs. It supports using the rule to choose WHICH side's liquidity is the draw; it does not tell us a trade toward it pays.

## 6. What these numbers do and do not license

- They are in-sample descriptions from 2015-2019. Conditions change; they must not be quoted as forecasts.
- They justify three design constraints: (1) restrict any London-open model to pairs where London actually sets extremes (EUR, GBP, CHF; CAD for sweeps); (2) never treat an Asian-range sweep, or London's direction, as a signal without the bias filter; (3) size stops against the measured extension distribution, not against a quoted round number.
- They do not show that any ICT model is profitable. Only the pre-registered backtest can speak to that.
