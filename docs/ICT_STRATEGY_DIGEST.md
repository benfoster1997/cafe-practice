# ICT Strategy Research Digest — the spec behind the bot

**Purpose of this document.** Before we build a trading bot from the teachings of "ICT" (Inner Circle Trader, the online handle of Michael J. Huddleston), we need to agree on what he actually teaches, where he is vague, where his own material contradicts itself, and what the outside evidence says. This digest is written for a trader, not a programmer. Every technical term is defined the first time it appears. Every rule that is **our engineering decision** rather than something ICT taught is marked **[our resolution]**. Where our research material is silent, we say so plainly rather than fill the gap from memory.

---

## 1. What ICT teaches — the big picture

ICT's core claim is that price in major markets is not moved by simple supply and demand, but is *delivered* by an algorithm — he calls the idea the **Interbank Price Delivery Algorithm (IPDA)**. In this worldview, price is deliberately steered toward two kinds of magnets:

- **Liquidity** — clusters of resting stop orders. A **stop order** is an order that triggers automatically when price reaches a level: traders who are short (betting on a fall) leave "buy stops" *above* old highs to limit their losses, and traders who are long leave "sell stops" *below* old lows. ICT says the market runs into these pools on purpose, "harvesting" the orders there before reversing.
- **Imbalances** — stretches of price the market skipped over quickly, which he says price later returns to "rebalance" (the Fair Value Gap, defined in Section 4).

Layered on top is a strict belief that **time matters as much as price**: the algorithm does specific things at specific New York clock times (8:30 AM, 9:30 AM, 10:00 AM, and so on), and identical-looking patterns outside those times don't count.

**Honest framing, up front:** this is *his model of the world, not established fact*. No one has demonstrated that an "IPDA" exists. What the academic literature does support (Section 8) is weaker and adjacent: stop orders really do cluster at obvious levels and can trigger cascades, and volatility really does concentrate at certain hours. That supports the *ingredients* of ICT's framework, not his specific claim that an algorithm delivers price to retail-visible levels every day, and not any specific entry pattern he teaches. ICT himself says the model is imperfect, that daily bias is partly discretionary, and that journaling and backtesting are the real "secret." His own public track record is unverified, and his public trading attempts have failed (Section 8). We are building the bot to *test* this methodology mechanically, not because it is proven.

---

## 2. The core sequence — the 2022 model, step by step

The free 2022 YouTube Mentorship (41 episodes, Jan–Aug 2022, taught mostly on the NQ and ES stock-index futures) teaches one deliberately stripped-down intraday model. The engine, in order:

1. **Weekly bias.** Before the week starts, ask one question of the weekly chart: is price more likely to *expand* toward an imbalance above, or a liquidity pool below? You are forecasting the direction of the week's range expansion, not where the week closes.
2. **Daily draw on liquidity.** On the daily chart, name the specific level price is likely reaching for next (an old high/low, equal highs/lows, or an unfilled gap). If you cannot name it, ICT says you are gambling — no trade.
3. **Time-of-day gate.** Set the chart to New York time, no exceptions. Mark 8:30 AM ET (when the government news embargo lifts). On the 15-minute chart, look *left* of 8:30 for the first significant swing high and swing low — those are the pools the day's raid will use. Trading happens inside the index "killzone" 8:30–11:00 AM ET.
4. **Liquidity purge against the bias (the "Judas swing").** If your bias is bearish, expect price to first run *up* through a recent high (taking the buy stops) before the real move down — and the mirror when bullish. This fake move is the "manipulation" phase of what ICT calls **Power of Three**: every day's candle is accumulation (consolidation around the open), manipulation (the false move), then distribution (the real move).
5. **Market Structure Shift (MSS) with displacement.** After the purge, price must break the nearest opposing short-term swing point. The break only counts because liquidity was taken first — "no liquidity taken, no shift." The breaking move must be **displacement**: energetic, animated ("an elephant in a paddling pool"), not a lethargic drift.
6. **Fair Value Gap (FVG) left in the leg.** ICT's only operational test of displacement is binary: the energetic leg must leave a three-candle gap (defined in Section 4) inside its range. "No gap, no trade."
7. **Entry.** Place a limit order (an order that fills only at your price or better) on the retracement back into that FVG.
8. **Stop.** Beyond the gap's outer candle or the raided extreme — the level whose violation kills the whole story.
9. **Target.** The opposing liquidity: partial profits at *internal range liquidity* (an opposing gap or minor swing inside the current range), the rest at *external range liquidity* (stops beyond old highs/lows). Take the "low-hanging fruit" — the nearest pool — never the far extreme of the chart.

The timeframe workflow is top-down: daily → hourly → 15-minute ("bellwether") → then strip down 5, 4, 3, 2, 1-minute and take the *first* gap found. The popular "15-minute context, 1-minute entry" pairing is community shorthand, not his rule.

Equal weight goes to **not** trading: no clear draw = no trade; never enter during New York lunch (12:00–1:00 PM ET); NFP and FOMC days (defined in Section 9) are case studies, not trading days; sloppy, consolidating price = close the charts; and a day with *no* medium/high-impact news event doesn't get normal risk.

---

## 3. What the 2023 and 2024 mentorships added or changed

Neither later year replaces the 2022 engine — ICT repeatedly tells newcomers to start with the 41 videos. Roughly 70% of 2023/2024 is re-teaching applied live. The genuinely new items:

**Added around/after 2022, formalized 2023:**
- **Silver Bullet** (introduced Aug–Sep 2022, given a dedicated 2023 lecture): a time-boxed FVG trade inside three fixed one-hour windows — 3:00–4:00 AM, 10:00–11:00 AM, 2:00–3:00 PM ET. This is the model our bot will trade (Section 5).
- **NWOG / NDOG** (first two 2023 lessons): the **New Week Opening Gap** (Friday close → Sunday 6:00 PM ET open; keep at least the 5 most recent on the chart) and **New Day Opening Gap** (5:00 PM futures close → 6:00 PM reopen; ~5-day shelf life). Both act as magnets/fair-value references.
- **Opening Range Gap (ORG):** previous day's 4:15 PM ET regular-hours close → today's 9:30 AM open. ICT's stated statistic: ~70% of the time, half the gap fills within the first 30 minutes. Graded in quadrants (25/50/75%).
- **Time macros:** fixed ~20-minute windows when the algorithm "spools" for liquidity — 9:50–10:10, 10:50–11:10, 11:50–12:10, and a last-hour window (3:15–3:45 named as the "sweet spot"). Widely circulated *London* macros (2:33–3:00, 4:03–4:30 AM) were found in **no** transcript checked — treat as unverified community invention.
- **Inversion FVG (IFVG):** a violated FVG that flips roles (Section 4).
- **Immediate Rebalance, TGIF** (Friday retraces 20–30% of the weekly range after the weekly objective is met), and the **Unicorn** (a breaker block overlapping an FVG).

**2024 mentorship (21 live lectures, Aug 5–30, 2024, teaching his son Caleb):**
- **Compressed timeframes:** only 15-minute (bias/levels), 5-minute (structure), 1-minute (entry) — "you don't need a daily chart… you don't need anything else." This directly contradicts the 2022 top-down workflow; the two must be versioned, not blended.
- **Hourly pre-market/opening-range paradigm:** each hour splits into two 30-minute halves; "the opening range is the first 30 minutes… there is no 15-minute opening range."
- **First Presented Fair Value Gap (FPFVG):** the first FVG after the 9:30 open; no entry before 9:31, and only after displacement.
- **Order block redefinition:** the order block is a *series* of consecutive same-direction-close candles, keyed to the **opening price** of the extreme candle, confirmed by a "Change In the State of Delivery" (a body close back through that opening price). ICT: "first time I taught this." He never retires the older definitions, so all vintages coexist (Section 7).
- Micro 15–45-second charts legitimized for entries; killzone jargon de-emphasized in favor of macros.

---

## 4. The building blocks — precise mechanical definitions

**Fair Value Gap (FVG).** A three-candle pattern marking a price stretch traversed so fast that only one side traded. Mechanically, for consecutive candles c1, c2, c3:
- *Bullish FVG* ("BISI"): exists if and only if c1's **high** is below c3's **low**; the gap zone is [c1.high, c3.low].
- *Bearish FVG* ("SIBI"): exists if and only if c1's **low** is above c3's **high**; the zone is [c3.high, c1.low].
Boundaries use wick extremes (the thin lines beyond the candle body). The gap's exact 50% midpoint is **Consequent Encroachment (CE)** — ICT treats a touch of CE as sufficient "rebalance." An **Inversion FVG** is a gap that a candle *body* closes entirely through: a broken bullish gap becomes resistance, a reclaimed bearish gap becomes support. A wick through is *not* an inversion — wick-through = sweep, body-close-through = inversion.

**Displacement.** An energetic, one-directional move (large bodies, small wicks) showing "institutional sponsorship." ICT gives **no numeric size threshold** — ever. His only operational test: the move breaks the reference swing *and* leaves an FVG in the breaking leg. Any numeric filter is invention (see Section 6).

**Swing point.** A three-candle pattern: a swing high is a candle with a lower high on each side; a swing low has a higher low on each side. Explicitly *not* the five-candle Williams fractal ("if you're waiting for five candles you missed the boat").

**Market Structure Shift (MSS).** After a liquidity purge, price breaks the nearest opposing short-term swing with displacement. ICT's 2022 wording says the swing needs only to be *traded through*, though displacement "preferably closes" beyond it; the hard body-close requirement is community hardening (Section 7). "BOS" and "CHoCH" are community vocabulary, not ICT's — his phrase is "break in market structure."

**Order block.** Three ICT vintages exist. *2016:* the lowest down-close candle with the largest open-to-close range near support (mirror for bearish); validated when its high is later traded through; trade the **body** — entry at the open, "mean threshold" = 50% of the body, stop beyond the body low. *2022:* a "change in the state of delivery" — the consecutive opposing-close candles running into liquidity, keyed to the opening price of the first candle, valid only if an FVG follows. *2024:* the whole consecutive-close series is one block, keyed to the opening price of the extreme candle, confirmed by a body close back through it. These select different candles on real data (Section 7).

**Liquidity.** *Buyside liquidity* = buy stops resting above old highs; *sellside liquidity* = sell stops below old lows. "Relatively equal" highs/lows (double/triple tops and bottoms) are engineered pools — ICT gives **no numeric tolerance** for "relatively equal." Candidate pools: previous day/week high and low, session highs/lows, equal highs/lows, old FVGs, NWOG/NDOG. A **sweep** is a shallow run beyond a level that then reverses back; a **run** goes straight through with no look back. ICT never quantifies minimum sweep depth or a close-back-inside rule.

**Killzones (exact ET times).** London: 2:00–5:00 AM (the paid "charter" content says 1:00–5:00 — era variant). New York forex: 7:00–10:00 AM. New York index futures (2022 model): 8:30–11:00 AM. London Close: 10:00 AM–12:00 PM (with a narrower 2022-era rule to take ~80% of a directional position off between 10:00 and 11:00). Asia: ICT's tweeted list says 8:00 PM–midnight; the 2022 index content marked 7:00–9:00 PM; other eras give 20:00–22:00 and 19:00–24:00 — no canonical value. NY lunch, 12:00–1:00 PM: no entries. Earliest afternoon entry 1:30 PM; market-on-close window 3:00–4:00 PM. Silver Bullet windows: 3:00–4:00 AM, 10:00–11:00 AM, 2:00–3:00 PM.

**Premium / discount.** Draw a range from a meaningful swing low to swing high (the "dealing range"). Its 50% level is **equilibrium** ("fair market value"). Above 50% = *premium* (where smart money sells); below = *discount* (where smart money buys). Hard-line 2016 rule: never sell in a discount, never buy in a premium. The 2022 model softens this for entry gaps to "ideally" on the right side of the *displacement leg's* 50%. Which swing anchors the range has four era-dependent definitions (Section 7).

**Optimal Trade Entry (OTE).** The highest-probability retracement band: **62%–79%** of the impulse swing (Fibonacci levels 0.62, 0.705, 0.79), beyond equilibrium, with **70.5%** called the sweet spot. The 2018 Model 1 variant enters at 62% only; the 2022 "gold standard" cites 62–70%.

**SMT divergence (Smart Money Technique).** A "crack in correlation" between instruments that normally move together (ES vs NQ vs YM; EURUSD vs GBPUSD; either vs the dollar index inversely): one makes a new high/low, the other refuses. The instrument that made the new extreme was sweeping liquidity; the refuser is "telling the truth." **Confirmation only** — "by itself it means nothing" — and only at killzone times (2:00, 8:30, 9:30, 10:00 AM, 1:30 PM ET, and news). No numeric thresholds exist.

---

## 5. The Silver Bullet playbook — the exact algorithm the bot will trade

The Silver Bullet is ICT's time-based model: know where price is heading, wait inside a fixed one-hour window for a liquidity sweep and a displacement leg that leaves an FVG, enter the retrace into the gap, target the opposing pool. Below is the mechanical version. **Bot scope v1: NY AM window only, 10:00–11:00 AM ET, on EURUSD spot CFD, 1-minute chart, all clocks in America/New_York.** ICT demonstrates this model mostly on NQ/ES index futures; his 2023 lecture applies it to forex pairs as well (his 15-pip minimum framework below is the forex figure). Trading it on EURUSD is a **project decision** driven by account size (see docs/PLAN.md §2), and all index-point figures below carry their forex equivalents. [instrument scope is our adaptation — ICT never restricts windows per instrument]

### Pre-flight (before 10:00 AM)

1. **Calendar gate.** IF today is an NFP or CPI release day, THEN no trading today. IF today is an FOMC day, THEN only the AM window is eligible. IF today has *no* medium (orange) or high (red) impact US calendar event, THEN no live trading (practice log only). *(Event split between "required fuel" and "forbidden top-tier" is ICT's two-sided teaching; the exact exclusion list is [our resolution].)*
2. **Compute bias, freeze it at 10:00.** [our resolution — ICT's bias is discretionary; this two-factor proxy uses his own 2018 lookback]
   a. Dealing range = highest high and lowest low of the last **20 trading days** (Sundays excluded). Equilibrium = the 50% level.
   b. IF price is below equilibrium, THEN bias-candidate = bullish; above = bearish.
   c. Confirm against the **00:00 ET midnight open**: bullish only if price at 10:00 is *below* the midnight open; bearish only if *above* (ICT's buy-below-open / sell-above-open rule).
   d. IF (b) and (c) disagree, THEN today's window is **no-trade**.
3. **Name the draw on liquidity** — the nearest untapped pool *in the bias direction* from: previous day's high/low, the London session high/low (2:00–5:00 AM ET), the Asian range high/low, and any 15-minute swing high/low formed since 8:30 AM. IF no pool can be named, THEN no trade. [pool list is our resolution; for index futures the 9:30–10:00 opening range replaces the London pool]

### Inside the window (10:00–11:00 AM ET)

4. **Wait for a sweep of a pool opposite the bias.** A valid sweep = price trades at least **1 tick** beyond the pool level, THEN a 1-minute candle **closes back** on the original side within **5 bars** of the penetration. IF instead **3 consecutive** 1-minute bodies close beyond the level, THEN classify as a run and disqualify. The sweep may occur any time from **9:30** onward (the opening-range stop run counts), but everything from step 5 on must happen at/after 10:00. [all numbers are our resolution — ICT never quantifies sweep depth, confirmation, or the pre-window question]
5. **Require a Market Structure Shift.** A 1-minute candle **body closes** beyond the most recent opposing 3-candle swing (formed before or during the sweep). [body-close is our resolution; ICT's literal wording allows trade-through. A hard MSS gate for Silver Bullet specifically is community codification, adopted by us.]
6. **Find the entry FVG.** The **first** qualifying FVG formed in the MSS leg at/after 10:00, on the 1-minute chart, that: (a) passes the strict 3-candle test of Section 4 on *completed* bars only; (b) is at least **4 ticks** tall and at least 2× spread-plus-commission in ticks [our resolution — ICT sets no minimum]; (c) points toward the named draw; (d) sits in the correct half of the displacement leg — at/above its 50% for shorts, at/below for longs (we hardened ICT's "ideally" into a rule [our resolution]). IF no such gap forms by 11:00, THEN no trade — that is a normal day.
7. **Distance check ("minimum trade framework").** Distance from planned entry to the draw must be at least **15 pips on EURUSD** (ICT's forex figure; 10 points ES / 20 points NQ for index futures). ALSO require distance ≥ **1.5× the stop distance** [our resolution — ICT explicitly denies a fixed reward-to-risk is essential; this floor is disableable].
8. **Place the entry.** Resting limit order **exactly at the gap's near edge** — candle 3's high for shorts, candle 3's low for longs — zero offset, placed only after the FVG's third bar closes. (Per ICT's verbatim Model 13 rule "to make sure you get a fill"; the one-tick-offset variant is a parameter, default 0.)
9. **Cancel the unfilled order** IF any of: (a) 11:00 arrives; (b) a 1-minute body closes through the *entire* gap against the trade (inversion — premise dead); (c) price reaches the draw before filling; (d) a red-impact news release occurs within the next 5 minutes (no new entries from 5 minutes before to 5 minutes after any red release, and the sweep→MSS→FVG sequence must have *started* after the release). [cancel list and 5-minute buffers are our resolution]

### Once filled

10. **Stop-loss:** the swept extreme (raid high for shorts, raid low for longs) **plus 1 tick** buffer. [ICT sanctions several stop variants; the swept extreme is his widest learner option; the 1-tick buffer is ours. Tighter mode: exact extreme of FVG candle 1, zero offset, per Model 13.]
11. **Position size:** risk **1% of account equity** per trade (Section 9 hard rail). Lots = the largest multiple of 0.01 such that (stop distance in pips × pip value × lots) ≤ 1% of equity. IF that rounds below 0.01 lots, skip the trade. [formula is our resolution]
12. **Partial profit:** close **50%** of the position at the first opposing internal-range liquidity (nearest opposing 1m/5m swing or opposing FVG between entry and draw), OR at **+10 pips** if no internal pool exists — whichever comes first. [percentages/fallbacks are our resolution; ICT's partials are liquidity-based with no fixed percentage]
    **[Project default per owner decision (docs/PLAN.md §4): 50% partial at +1R with the stop to break-even after it fills. The liquidity-based variant above is the ICT-faithful alternative; Phase 2 calibration backtests both and the owner's scheme stays default unless the data clearly favors the other.]**
13. **Break-even:** when price has traveled **75%** of the entry-to-target distance, move the stop to entry **+1 tick**. (The unambiguous half of ICT's Ep 41 rule; the "trim stop 25% at 50%" step is undefined and dropped in v1 [our resolution].) Do not move the stop earlier — ICT warns against early break-even.
14. **Target:** limit order **4 ticks (1 point) inside** the named draw level (our translation of his 3–5-pip forex "fluff"; never target the exact level). IF two opposing pools sit within one stop-distance of each other, target the **nearer** one.
15. **Time exit:** the position may run past 11:00, but is force-flattened at market at **11:30 AM ET** (aligning with ICT's 11:30 order-pull rule and pre-lunch discipline) [our resolution].
16. **Attempts:** exactly **one entry per window**; no re-entry after a stop-out even if a fresh sequence forms; maximum **2 trades per day** across all windows (Section 9); if a morning trade hits full target, any afternoon window is paper-log only. [assembled from adjacent ICT-era rules; the one-attempt rule is community codification, adopted by us]

---

## 6. Where ICT is ambiguous — and the mechanical resolutions we chose

Each item below is a gap ICT never closes; every resolution is **[our resolution]** and ships as a named, auditable config parameter.

| Gap (ICT is silent or vague) | Our resolution |
|---|---|
| Which instruments trade which window | v1: NY AM 10:00–11:00 only, EURUSD spot CFD (account-size decision, PLAN §2) |
| Time zone / data session / contract roll | America/New_York with DST; Globex (all-hours) data for levels; front-month, rolled when next month's volume exceeds it |
| Daily bias procedure (four coexisting methods, "partly discretionary") | Two-factor proxy: 20-day-range equilibrium + midnight-open position; both must agree or no-trade |
| Which pools qualify for the sweep | The four-pool list in step 3 |
| "Relatively equal" highs/lows tolerance | Two extremes within 0.05% of price, ≥3 bars apart; outer extreme is the sweep line (outer-extreme choice is ICT's; 0.05% is ours) |
| Sweep depth / confirmation | ≥1 tick beyond, 1m close back inside within 5 bars; 3 bodies beyond = run |
| Sweep inside vs before the window | AM window accepts sweeps from 9:30; MSS + FVG + entry must be at/after 10:00 |
| MSS: required? which swing? close or wick? | Required; most recent opposing 3-candle swing; 1-minute body close |
| Swing ties / inside candles | Strict inequality; on exact ties extend one candle further out; inside-candle swings inherit the outer candle's extreme |
| Displacement magnitude | No size gate — FVG presence is the whole test (matches ICT's binary rule); a 1.5×-average-body flag is logged for diagnostics only, never gated on |
| FVG timeframe & minimum size | Single 1-minute chart; minimum 4 ticks and 2× round-trip costs |
| Premium/discount gate hierarchy | Gate on the displacement leg's 50% only; no higher-timeframe premium/discount gate in v1 |
| Multiple qualifying FVGs | First gap after the MSS wins; nested gaps: use the farther (deeper) one, stop behind the swept extreme |
| Entry price (edge vs 1-tick vs midpoint) | Exact near edge, zero offset (Model 13 verbatim); CE-midpoint mode kept for backtest |
| Pending-order invalidation | Cancel on window close, full-gap inversion, or draw reached first |
| Stop variant (five sanctioned) | Swept extreme + 1 tick |
| Sizing formula | 1% risk, micro contracts, floor-to-zero skip |
| Minimum distance to target | ES 10 pts / NQ 20 pts / FX 15 pips, plus disableable 1.5× stop floor |
| Target cushion in ticks | 4 ticks inside the level (translated from 3–5 pips) |
| Partials / break-even | 50% at first internal pool or +5 ES / +10 NQ; BE at 75% of the run |
| Exit past window close | Allowed; hard flatten 11:30 ET |
| News buffers | 5 min before/after red releases; sequence must start post-release; NFP/CPI days skipped, FOMC PM skipped |
| Attempts / re-entry / daily caps | 1 per window, no re-entry, max 2/day, PM disabled after AM full-target win |
| Both sides swept / counter-bias sweep | Bias frozen at window open is authoritative; counter-bias setups never traded; both sides swept before fill = cancel (range-day signature) |
| Validation posture | Every invented number tagged OURS vs ICT-VERBATIM vs COMMUNITY; ≥100-trade walk-forward, bar-close-confirmed, no-repaint backtest per instrument before live; no assumed win rate |

---

## 7. Contradictions in the source material — and which reading we adopted

1. **FVG entry price.** Secondary 2022 notes say "one tick above candle 3's high"; ICT's own verbatim Model 13 restatement says the exact gap edge, no offset ("to make sure you get a fill"). *Adopted: exact edge, offset exposed as a parameter defaulting to 0* (primary transcript outweighs note reconstructions).
2. **Stop placement.** At least five sanctioned variants, plus an internal ICT conflict in Model 13 (slide says inner gap boundary; his voice says candle 1's extreme, "not one tick above it"). *Adopted: swept extreme + 1 tick as default; Model 13 spoken rule as the tight mode.*
3. **Silver Bullet minimum target.** 10 points/40 ticks (2023 lecture) vs "minimum five handles" vs "must offer 10 handles" vs community 20-point NQ scaling. *Adopted reconciliation (never stated by ICT): ~10 handles of available range qualifies the setup; ES 10 / NQ 20 as our per-instrument minimums.*
4. **Silver Bullet MSS requirement.** ICT's own lecture arguably requires only draw + sweep + FVG; the hard MSS gate is community. *Adopted: hard MSS gate, flagged as community codification.*
5. **Sweep inside vs before the window.** Sources conflict. *Adopted: 9:30-onward sweeps accepted for the AM window (matching his AM demonstrations); parameterized.*
6. **Lunch / afternoon boundaries.** ICT's own 2022 wording: no entries 12:00–1:00, nothing new before 1:30 — making 12:00–1:30 the effective no-trade span; the 12:00–2:00 version is derivative-site drift. *Adopted: 12:00–1:30 effective.*
7. **London killzone.** 2:00–5:00 AM (free 2022 era) vs 1:00–5:00 (paid charter era). *Adopted: 2:00–5:00.*
8. **London Close.** Killzone 10:00–12:00 vs 2022's "London close hour" 10:00–11:00. *Adopted: 10:00–12:00 as the zone; 10–11 as the profit-taking rule inside it.*
9. **Asia session times.** Four era/instrument variants, no canonical value. *Adopted: parameterized per asset class; unused in v1.*
10. **OTE trigger.** Zone 62–79 with 70.5 sweet spot (2016) vs 62-only entry (2018) vs 62–70 (2022). *Adopted: 62–79 as the zone; single-level 70.5 treated as community simplification.* (OTE is not a gate in the v1 bot.)
11. **Dealing-range anchoring.** Four incompatible era definitions (discretionary parent swing / 20-day / 20-week / both-sides-purged). *Adopted: the mechanical 20-trading-day version for our bias proxy — versioned, not "the" ICT rule.*
12. **Reward-to-risk screen.** 2016 core content: minimum 3:1, prefer 5:1; 2022: ICT explicitly denies fixed R:R is essential. *Adopted: no ICT-attributed R:R rule; our 1.5× floor is ours and disableable.*
13. **Risk per trade.** ICT personal 3–4.5% (explicitly not a recommendation) vs taught ≤2% cap / 1% optimal / 0.25–0.5% learning. *Adopted: the taught band; our rail is 1% (Section 9).*
14. **Trade frequency.** "One setup per day" vs "2 AM + 2 PM ceiling" vs one per week. *Adopted: 2/day ceiling with strong bias to one — the 2022-era spoken guidance.*
15. **News days.** Required fuel (Six Keys: trade only red/orange days) *and* forbidden (CPI/FOMC/NFP = "gambling"). Both are genuine ICT. *Adopted: the two-sided synthesis in Section 5, step 1.*
16. **MSS wick vs body.** ICT: traded-through suffices, "preferably closes"; community: body-close mandatory. *Adopted: body-close (community hardening, flagged).*
17. **Order block vintages.** 2016 vs 2022 vs 2024 definitions select different candles; mitigation-block reference candle also conflicts. *Adopted: implemented as tagged variants (v2016/v2022/v2024); none used as a gate in the v1 Silver Bullet.*
18. **Small numeric conflicts in ICT's own 2023/24 statements** (ORG/NDOG lifespan 5 vs 3 days; NWOG count 5 vs 4; last-hour macro count 3 vs "4, technically 5"; MOC 3:00–4:00 vs 3:15–3:45). *All exposed as parameters; unresolvable from primary sources.*
19. **Timeframe workflow.** 2022 top-down cascade vs 2024's 15/5/1-only. *Adopted: versioned; v1 uses a single 1-minute execution chart.*
20. **Daily anchor.** Midnight 00:00 ET open (2022) vs 6:00 PM reopen/NDOG emphasis (2024); one indicator doc's "18:00 true day open" is a third-party conflation. *Adopted: midnight open for the bias proxy.*
21. **Judas swing window.** 00:00–05:00 vs 02:00–05:00 vs a separate NY Judas. *Not encoded as a gate in v1.*
22. **"Price returns to fill FVGs" vs measured data.** Teaching says gaps are magnets; measured data says ~30% of 30-minute FVGs fill the same day. *Adopted: no assumed fill tendency; per-instrument fill rates must be measured in backtest.*
23. **Flagged third-party inventions we must never attribute to ICT:** numeric displacement thresholds; equal-highs tolerances; sweep-depth rules; BOS/CHoCH taxonomy; the FVG-intersection Balanced Price Range arithmetic; STH/ITH/LTH formalization; 50%-at-1R-then-break-even schemes; hard daily loss limits; all Silver Bullet win-rate figures (47–83%); the one-attempt rule; open-source library defaults; any holiday filter.

---

## 8. The honest evidence picture

**What independent evidence exists for ICT's models: essentially none.** As of the research date, no peer-reviewed or institutionally published backtest of any named ICT concept (Silver Bullet, FVG entries, order blocks, ICT-defined liquidity sweeps) was found. Every published win-rate claim — 70–80%, 55–65% at 1:3, one 83% claim — comes from vendors, blogs, or social posts with weak or absent methodology. The few documented tests are sobering:

- A year-long EURUSD order-block test found **no edge from the mechanical rules alone**; the same playbook with discretionary judgment reportedly went net-positive at a 40.4% win rate — which either means the discretion *is* the edge (and can't be coded), or the claim is unfalsifiable.
- The only described Silver Bullet backtests are tiny (45 days / 15 trades; 10 days) and show **extreme month-to-month regime dependence** — July 2023 "beautiful," other months "abysmal."
- Measured data contradicts the FVG-fill premise: on 30-minute charts roughly **70% of FVGs do not fill the same day**, and over 60% stay unfilled overall, varying by instrument and timeframe.
- Micro-FVG strategies die to spread and commissions; many indicator backtests repaint (recalculate signals on later bars), inflating results.

**What genuinely is supported — for adjacent mechanisms, not ICT's entries:** stop orders demonstrably cluster at round numbers and trigger self-reinforcing price cascades (Osler, using a real bank order book); published support/resistance levels have intraday predictive power lasting ~5 days (Osler/FRBNY); FX volatility concentrates in the London/NY hours (Andersen & Bollerslev); statistically significant time-of-day return patterns exist in FX (Ranaldo; Breedon & Ranaldo); and the WM/Reuters 4 PM fix scandal (~$4.3B in fines) proved engineered price behavior around fixed times *can* exist — though it was prosecuted and reformed. Time edges also decay: the equity "overnight drift" (2–3 AM ET, ~3.7% annualized) has averaged roughly zero since 2021. ICT's liquidity-raid reversal also has respectable prior art: it is functionally Connors & Raschke's 1995 "Turtle Soup" false-breakout fade, which has reproducible independent backtests.

**ICT's own record:** no independently verified track record. A public $10k-to-$1M challenge (dated 2016 or 2017 by different sources) was not completed; a 2017 Robbins World Cup entry with promised verification has no documented finish; his 2024 Robbins Cup entry ended in an admitted blown account with no appearance in the official standings. Written critiques converge on an unfalsifiability problem: wins validate the model, losses are blamed on the practitioner. A mechanical bot is the honest test precisely because it removes that escape hatch — and we should *expect* mechanical results to underperform the discretionary claims.

**Bottom line for the spec:** liquidity-pool and time-of-day components are tagged *mechanism-supported*; every specific ICT entry model is tagged *community-tested only*; nothing here is evidence that the strategy is profitable; every probability must be re-measured per instrument on recent data before the bot trades live.

---

## 9. Risk & trade management rules the bot will enforce

ICT's teachings, merged with our hard rails. Our rails always win where they are tighter.

**ICT's taught framework (for context):**
- ≤2% of equity per trade as a hard cap; 1% called optimal; 0.25–0.5% while learning. (His personal 3–4.5% is explicitly not a recommendation.)
- After a loss, halve risk; at half risk, +2R neutralizes the loss, +3R goes net positive; restore risk only after recovering 50% of the loss.
- Partials at logical liquidity objectives; hold the initial stop rather than rushing to break-even; "partials pay you."
- Don't trade CPI, FOMC, NFP — "gambling"; but ordinary 8:30 AM medium/high-impact drivers are the required fuel.
- Quality over quantity: one good setup can be the week; stop when the week is made.
- 6–12 months of demo before live money; ~50% accuracy at 3:1–5:1 as the stated expectancy frame.

**Our enforced rails [all our resolution unless noted]:**
1. **Risk per trade: 1% of account equity, fixed.** (Inside ICT's taught ≤2% cap and at his "optimal" level.)
2. **Drawdown ladder:** after each losing trade, halve the risk fraction (1% → 0.5% → 0.25% floor); restore one step only after recovering 50% of the last loss. (Adapted directly from ICT's Ep 41 / Model 13 ladder.)
3. **Maximum 2 trades per day**, one entry per window, no re-entry after a stop-out in the same window. If the AM trade hits full target, the PM window is paper-only. (Assembled from ICT's 2022-era ceilings; the hard cap as coded is ours.)
4. **Daily loss cutoff:** trading stops for the day after two losing trades or a −2% equity day, whichever comes first. (No "two losses and done" rule could be sourced to ICT — this rail is entirely ours.)
5. **News filter:** no live trading on NFP or CPI days; FOMC days AM-only; a day with no medium/high-impact US event is paper-only; no new entries within 5 minutes either side of a red release, and the setup sequence must begin after the release. (The event split is ICT's two-sided teaching; the lists and minute-buffers are ours — ICT gives no buffer anywhere.)
6. **No entries 12:00–1:30 PM ET; AM positions force-flat at 11:30 AM ET; unfilled orders cancelled at window close.** (11:30 pull rule is ICT's; force-flat is ours.)
7. **Break-even only at 75% of the entry-to-target run; single 50% partial at the first internal pool.** (Ep 41's unambiguous half plus our partial scheme.)
8. **0.01-lot sizing steps; skip any trade the sizing formula rounds below the minimum lot.** Below the equity that supports 0.02 lots, a single blended ~1.5R target replaces partials (see PLAN §4 small-account constraint).
9. **Go-live gate:** ≥100 walk-forward, bar-close-confirmed, no-repaint backtest trades per instrument, with month-by-month regime reporting, before any live enablement; every parameter carries an audit tag (ICT-VERBATIM / COMMUNITY / OURS). (Build requirement, ours — echoing ICT's own "journaling and backtesting are the real secret.")

*Terms:* **NFP** = Non-Farm Payrolls, the US jobs report, first Friday of the month, 8:30 AM ET. **CPI** = Consumer Price Index, the inflation report, 8:30 AM ET. **FOMC** = Federal Open Market Committee, the Fed's interest-rate announcement, 2:00 PM ET. **R** = one unit of the amount risked on the trade.

---

## 10. Sources

All material in this digest comes from the research notes compiled for this project. Primary and secondary sources cited there:

**ICT primary video material (YouTube):**
- 2022 Mentorship episodes (41 videos), incl. Ep 2 (tmeCWULSTHc), Ep 3 (nQfHZ2DEJ8c), Ep 5 (N29ZJ-o31xs), Ep 6 (Bkt8B3kLATQ), Ep 10 (S9ORTYmXwdE), Ep 18 (eai0nHhAC8w), Ep 19 (IEa1N0rTtbc), Ep 39 (yFpHbBnsK_c), Ep 40 (koN1ge8bewI), Ep 41 (2XhDi5GoNUI)
- 2023 Silver Bullet lecture (tRq1hyGGtl4); PM Silver Bullet (V5iQOKY1J74); One Trading Setup For Life (vuBRMFhFZAY); Immediate Rebalance (ZtLMTXv-Dr0); 2024 Mentorship Lectures #1 (GKeLVR3dPuI) and #21 (eYYyonGwTRs); 2023 and 2024 mentorship playlists
- 2016/17 Core Content & Charter models: FVG (FgacYSN9QEo), Order Blocks (PIYh0CxoY9c), Swing Points (xRjKtUEKkSE), Equilibrium lessons (qC0LogyIk2I, YuefjnUKQdM), Models 1/2/9/13 (vCvRrINpknI, KQdsa7S1LoQ, YIxurbDNrWM, kNlySn81dmo), Dealing Ranges (s-iqN0h2Fgg)
- ICT tweets: x.com/I_Am_The_ICT/status/1609555290839748609, /1719791853996831078; killzone list relay x.com/trader_theory/status/1548247537634537473

**Transcript archives (secondary, quoting ICT):** github.com/Yousef-Diab/the-algorithm; github.com/fluoroamphetamine/transcript; github.com/Klout9/ict-strat; TanjaTrades 2022 notes (badwally/TheKnowledge); christian-mack/quant-research-lab mechanization spec

**Community documentation (tertiary):** innercircletrader.net (Silver Bullet, macros, fibs, OSOK, 2024 lectures); forum.ictsharks.com; tradingfinder.com; ictkillzone.com; luxalgo.com; fxopen.com; forexbee.co; backtrex.com; liquidityscan.io; howtotrade.com; michaeljhuddleston.org; crypoptionhub.com; grandalgo.com; fluxcharts.com; arongroups.co; chartwhisperer.ca; smartmoneyict.com; ebc.com; litefinance.org; studocu/Scribd note packs (GatieTrades, episode notes, CBDR/FLOUT/London Close docs); assorted others as listed in the research notes

**Independent evidence and critique:** Osler, *Stop-Loss Orders and Price Cascades* (FRBNY SR150; JIMF 2005) and *Support for Resistance* (FRBNY EPR 2000); Andersen & Bollerslev (J. Finance 1998); Ranaldo (JBF 2009); Breedon & Ranaldo (JMCB 2013); NY Fed Liberty Street Economics, *The Overnight Drift* (2021) and *The Disappearing Overnight Drift* (2026); CFTC press release 7056-14 and FCA WM/Reuters fix penalties; Evans, WM/R 4pm fix study; edgeful.com FVG reports; tradelybox.com order-block test; tradingstats.net gap-fill data; Zarattini & Aziz (2023) opening-range breakout; Turtle Soup backtests (oxfordstrat, tradingliteracy, MQL5); github.com/joshyattridge/smart-money-concepts; Sentient Trading Society, StoicEdge, AlgoStorm critiques; forums.babypips.com thread 1230675 (2024 Robbins Cup); myfxbook.com Robbins 2017 thread; worldcupchampionships.com standings; phidiaspropfirm.com and writofinance.com reviews

**Source-fidelity caveat (carried from the research notes):** many transcript and guide sites were reachable only via search-snippet extraction; several rules rest on secondary reconstructions rather than verbatim transcript reads. Any rule treated as load-bearing in the bot should be re-verified against the original videos — especially the 2023 Silver Bullet lecture — before the spec is frozen.