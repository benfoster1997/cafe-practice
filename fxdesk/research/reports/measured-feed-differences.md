# Measured: how much two price feeds disagree (and why the rules must tolerate it)

**What was measured (10 Nov 2026).** EURUSD M15 candles for the week of 2-6 November 2026 from two independent sources: Twelve Data's `time_series` API (the kind of live feed the app's scanner would poll) and our HistData one-minute history aggregated to M15 (the feed the backtest runs on). 469 candles compared, timestamps aligned in UTC. The owner's MT5 broker is a third feed and will differ from both in the same way.

## Results

| Measure (pips) | Candle high | Candle low |
|---|---|---|
| Typical offset (Twelve Data minus HistData) | +0.3 | +0.4 |
| Median absolute difference, liquid hours | 0.4 | 0.5 |
| 95th percentile, liquid hours | 1.9 | 1.5 |
| 99th percentile, liquid hours | 4.1 | 2.3 |
| Largest, liquid hours | 6.3 | 4.2 |
| Share of candles differing by more than 1 pip (after removing the offset) | 15% | 9.5% |
| Share differing by more than 2 pips (after removing the offset) | 3.6% | 1.9% |
| Largest in the 17:00-19:00 New York rollover window | **20.8** | 4.6 |

"Liquid hours" excludes 16:00-19:00 New York. The constant offset is consistent with Twelve Data quoting a mid price and HistData a bid.

Where the big differences were: news minutes (2 Nov 13:30-13:45 UTC, 3 Nov 13:15 UTC: 4-6 pips) and, by far the worst, the daily rollover (4 Nov 22:00-22:15 UTC, i.e. 17:00-17:15 New York: 14 and 21 pips on the candle HIGH). At the rollover spreads blow out and each vendor's candle is built from a different handful of wide quotes.

## What this forces on the specification

1. **No rule may turn on a sub-pip or one-tick event.** "Price traded one tick beyond the level" is true on one feed and false on another about one candle in eight. A sweep, a break of structure or a gap must clear its level by a stated margin of whole pips, and that margin is a parameter tagged OURS.
2. **Candles from 16:55 to 18:05 New York must not define levels.** No swing point, session extreme, fair value gap, sweep or stop reference may be taken from a candle in that window. Daily highs and lows that were set only inside that window should be treated as unreliable.
3. **The alert's prices are approximate on the owner's chart.** Entry, stop and target should be rounded to whole pips, the stop must sit a buffer beyond the structure it protects, and the ticket should tell the owner that his chart can differ by a pip or two.
4. **The backtest needs a feed-noise test.** A result that is positive on HistData but disappears when every candle's high and low are jittered by a realistic amount (say, independent noise with a 0.5 pip median and occasional 2-4 pip errors) is an artefact of one vendor's ticks, not an edge. Any model put forward should be re-run under such noise and the degradation reported.
5. **The live scanner should convert the vendor's mid to a bid** (subtract half the typical spread) before applying rules calibrated on bid data, and should refuse to act on a candle that disagrees wildly with its neighbours (a bad tick).

One week of one pair is a small sample; the direction of every point above is safe, the exact percentages are not. The comparison script lives in the session notes and can be re-run on any week.
