# ICT's forex-native intraday models in mechanical detail

Research date: 10 November 2026. Scope: the London Open / Judas swing trade, the New York forex killzone trade, the London Close trade, Power of Three and the weekly profiles, the pip figures ICT actually states for forex, and the pairs he names. Written for a rule specification, not for encouragement.

## 0. Bottom line

1. **ICT did teach forex-native intraday models with real numbers.** The clearest are in his April 2017 paid "ICT Day Trading Model" month and in the later "Charter Price Action Model" trade plans. They state clock windows, range filters, stop sizes of 10 to 40 pips and targets of 15 to 50 pips. This is very different geometry from the 4-pip stops that killed the 1-minute Silver Bullet in `docs/PHASE2_RESULTS.md`.
2. **Two of his plans are written as hand-placed pending orders.** Charter Model 11 is "limit order at the 62% retracement plus or minus 5 pips, 20-pip stop, 30-pip target". Charter Model 5 is "limit order at a level, stop 15 pips beyond the high of the entry zone, targets 40 and 50 pips". ICT himself calls Model 11 a "bread and butter" model with a "lower R multiple".
3. **Direction is never mechanical.** Every model starts with "you already have a bias from the daily chart". The bias procedure is a mixture of daily and 4-hour structure, a 20-day range, the weekly open and judgment. A programmer has to invent it, exactly as in the Silver Bullet round.
4. **The clock times are not one canonical set.** The free public lessons and the paid lessons give different windows for the same thing, in the same year. All must be versioned parameters.
5. **Nothing here is evidence of profit.** No verified record exists for any of these models. Wider stops remove the cost-geometry killer, and that is all they do. ICT's own figures imply reward-to-risk near 1:1 to 1.5:1 on the simple models, which need win rates of roughly 43% to 54% after costs just to break even (section 12, my arithmetic).

## 1. Sources and how to read the labels

Labels follow the brief:

- **PRIMARY**: ICT's own words read at source, or an official record. In this report only YouTube's own metadata (video title and channel) qualifies.
- **SECONDARY-T**: a machine transcript of ICT's own video, held in a third-party archive ([fluoroamphetamine/transcript](https://github.com/fluoroamphetamine/transcript)). I downloaded and read the quoted passages myself. I did not watch the videos. Captions contain errors ("Judas" appears as "Judah", "IPDA" as "ifta").
- **SECONDARY**: a third-party write-up I fetched and read.
- **SNIPPET**: seen only in a search-result extract.
- **INFERENCE**: my own reasoning or arithmetic.

Provenance check. For the Charter videos, YouTube's oEmbed endpoint returned the title and the channel "The Inner Circle Trader" for each video ID, and each title matches the transcript's opening words (PRIMARY for existence and title only). For the 2017 core-content and free-primer IDs the same lookup failed (HTTP 401 on the one response I inspected), so I could not confirm the channel for them. One other file in the archive's primer folder, xGFCIUFxsbw, did resolve to "Essentials To ICT Market Structure" on The Inner Circle Trader channel (PRIMARY for that title only). For the rest, provenance rests on the archive and on internal consistency.

| Key | What it is (transcript's own opening words) | Archive URL | Video |
|---|---|---|---|
| M8-L1 | April 2017 mentorship, Day Trading Model, lesson 1, "Essentials to ICT day trading" | [raw][M8-L1] | youtube.com/watch?v=-cXnnHjy9s0 |
| M8-L2 | lesson 2, "Defining the daily range" | [raw][M8-L2] | youtube.com/watch?v=_2nUKLAD9ig |
| M8-L3 | lesson 3, "Central Bank Dealers Range" | [raw][M8-L3] | youtube.com/watch?v=nI1AMOC1pro |
| M8-L4 | lesson 4, "Projecting daily highs and lows" | [raw][M8-L4] | youtube.com/watch?v=JKzEhfwV1dY |
| M8-L5 | lesson 5, "Intraday market profiles" | [raw][M8-L5] | youtube.com/watch?v=eU8WcUftUtY |
| M8-L6 | lesson 6, "When to avoid the London session" | [raw][M8-L6] | youtube.com/watch?v=stK2gNqhLaM |
| M8-L7 | lesson 7, "High probability day trade setups" | [raw][M8-L7] | youtube.com/watch?v=5Z_3NbclMSY |
| M8-L8 | lesson 8, "Integrating day trades with higher time frame trade entries" | [raw][M8-L8] | youtube.com/watch?v=1MnfiqKx5Uo |
| M9-L3 | May 2017, "Targeting 20 pips per day" | [raw][M9-L3] | youtube.com/watch?v=km0haQkTalc |
| M9-L5 | May 2017, "Trading market reversals" | [raw][M9-L5] | youtube.com/watch?v=KrGTimL3YRQ |
| M7-L3 | March 2017 short-term trading, "Market maker manipulation templates" | [raw][M7-L3] | youtube.com/watch?v=hbE8S5FSdtQ |
| M7-L8 | March 2017, "One shot one kill trading model" | [raw][M7-L8] | youtube.com/watch?v=LBlK6JB0QS0 |
| M6-L7 | Swing trading model, lesson 7 | [raw][M6-L7] | youtube.com/watch?v=Hoo_wTMgdcY |
| AUG17-A | August 2017, "ICT short-term top-down analysis, four hours to five minutes" | [raw][AUG17-A] | youtube.com/watch?v=Oec_0NM_OeY |
| AUG17-B | August 2017, lesson 3 | [raw][AUG17-B] | youtube.com/watch?v=3B7Reg2Yiqs |
| F-LON | Free primer, "The ICT London open kill zone" | [raw][F-LON] | youtube.com/watch?v=G8OEsUAoIWE |
| F-NY | Free primer, "The ICT New York kill zone" | [raw][F-NY] | youtube.com/watch?v=plNN9n7nrxc |
| F-LC | Free primer, "The ICT London close kill zone" | [raw][F-LC] | youtube.com/watch?v=3OEUIkkcmLE |
| F-JUDAS | Free primer, "Understanding the ICT Judas swing" | [raw][F-JUDAS] | youtube.com/watch?v=xJMbva8SjzE |
| F-AR | Free primer, "Implementing the Asian range" | [raw][F-AR] | youtube.com/watch?v=JA0mLNJeytY |
| F-AKZ | Free primer, "The ICT Asian kill zone" | [raw][F-AKZ] | youtube.com/watch?v=ley5HZs4bUM |
| F-AMD | Free primer, "Accumulation, manipulation and distribution" | [raw][F-AMD] | youtube.com/watch?v=dIT4HTFYGGo |
| F-BIAS | Free primer, "Essentials to trading the daily bias" | [raw][F-BIAS] | youtube.com/watch?v=vJvcZGGeTZU |
| F-SMT | Free primer, "ICT SMT divergence" | [raw][F-SMT] | youtube.com/watch?v=isXicdayBwA |
| C1-PLAN | "ICT Charter Price Action Model 1 \ Trade Plan & Algorithmic Theory" (title PRIMARY) | [raw][C1-PLAN] | youtube.com/watch?v=4f1vjQMlV50 |
| C2-PLAN | "ICT Charter Price Action Model 2 \ Trade Plan & Algorithmic Theory" (title PRIMARY) | [raw][C2-PLAN] | youtube.com/watch?v=KQdsa7S1LoQ |
| C5 | "ICT Charter Price Action Model 5 \ Day Trading - Intraday Volatility Expansions" (title PRIMARY) | [raw][C5] | youtube.com/watch?v=JN_uaDDZ0rc |
| C5-PLAN | "ICT Charter Price Action Model 5 \ Trade Plan" (title PRIMARY) | [raw][C5-PLAN] | youtube.com/watch?v=NB7Bku099tU |
| C5-ALGO | "ICT Price Action Model 5 \ Algorithmic Theory" (title PRIMARY) | [raw][C5-ALGO] | youtube.com/watch?v=2fgXDt3T3XE |
| C5-SUPP | "ICT Charter Price Action Model 5 \ Supplementary Lesson" (title PRIMARY) | [raw][C5-SUPP] | youtube.com/watch?v=bcp19tiJZA0 |
| C8-PLAN | "ICT Charter Price Action Model 8 - Trade Plan & Algorithmic Theory" (title PRIMARY) | [raw][C8-PLAN] | youtube.com/watch?v=F-8hPvSyIB4 |
| C9-PLAN | "ICT Charter Price Action Model 9 - One Shot One Kill Trade Plan & Algorithmic Theory" (title PRIMARY) | [raw][C9-PLAN] | youtube.com/watch?v=YIxurbDNrWM |
| C11-PLAN | "ICT Charter Price Action Model 11 - Trade Plan & Algorithmic Theory" (title PRIMARY) | [raw][C11-PLAN] | youtube.com/watch?v=pblXxWhnRz4 |
| C12 | "ICT Charter Price Action Model 12 - Scalping Intraday Model" (title PRIMARY) | [raw][C12] | youtube.com/watch?v=3xgtrXok-xs |
| C12-PLAN | "ICT Charter Price Action Model 12 - Trade Plan & Algorithmic Theory" (title PRIMARY) | [raw][C12-PLAN] | youtube.com/watch?v=xi0N9BG1Qvs |
| LUX | LuxAlgo library, "ICT Session Ranges" | [page][LUX] | |
| WRIT | Writofinance, "ICT Central Bank Dealers Range" | [page][WRIT] | |
| NNT | No Nonsense Trader, "Inner Circle Trader Notes" (a sceptical student's notes on the free videos) | [page][NNT] | |
| MQL5 | MQL5 Code Base, "Asian Range Sweep Indicator with a Built-In Win Rate Scorecard" | [page][MQL5] | |

Dating notes. M8-L2 uses a chart of "Monday April 3rd 2017" ([M8-L2], SECONDARY-T). The free primer was recorded later the same year: F-AKZ says "at the time of this recording in December 2017" ([F-AKZ], SECONDARY-T). Charter Model 5 names "Wednesday June 20th" with cable near 1.32 ([C5], SECONDARY-T); 20 June fell on a Wednesday in 2018, so I date it to 2018 (INFERENCE). Charter Model 11's plan was recorded on "Wednesday June 1st 2022" ([C11-PLAN], SECONDARY-T).

## 2. Clock times by source (all New York local time)

| Window | Free primer (recorded late 2017) | Paid core content (April 2017) | Charter models (2018 to 2022) |
|---|---|---|---|
| Asian range | 7:00 PM to midnight ([F-AR]) | 8:00 PM to midnight ([M8-L5]; [M8-L3] says the Asian range starts when the CBDR closes at 8 PM) | 8:00 PM to midnight ([C5]) |
| Central Bank Dealers Range | free tutorial not obtained | 2:00 PM to 8:00 PM ([M8-L3], [M8-L4]) | caption reads "4:00 p.m. ... and 8:00 p.m." ([C5]); see ambiguity A2 |
| Flout | not covered | CBDR and Asian range combined, so 2:00 PM to midnight ([AUG17-A]) | caption reads "4 p.m. New York time to midnight" ([C5]) |
| Judas swing hunt | midnight to 5:00 AM ([F-JUDAS]) | midnight to 2:00 AM "normal", 2:00 to 3:00 AM "delayed" ([M8-L5]) | "drops down at midnight creates a Judas swing" ([C11-PLAN]) |
| London Open killzone | 2:00 to 5:00 AM ([F-LON]) | 1:00 to 5:00 AM; "hot spot" 2:00 to 4:00 AM ([M8-L2], [M8-L1]) | "London open so 2:00 to 5 o'clock in the morning" ([C11-PLAN], 2022) |
| London lunch (no entries) | 5:00 to 7:00 AM ([F-LON]) | 5:00 to 7:00 AM ([M8-L1]) | "typical 5:00 to 7:00 in the morning consolidation" ([C11-PLAN]) |
| New York killzone | 7:00 to 9:00 AM "classic" ([F-NY]) | 7:00 to 10:00 AM ([M8-L2]); CME open 8:20 AM is the usual setup time ([M8-L1], [M8-L2]) | 7:00 to 10:00 AM, "sometimes it can extend to 11:00" ([C1-PLAN]) |
| London Close killzone | 10:00 AM to noon ([F-LC]) | 10:00 AM to noon ([M8-L2]) | not restated in the plans read |
| "True day" | midnight open is the "New York opening price" ([F-JUDAS]) | midnight to 3:00 PM ([M8-L2]) | |

All cells are SECONDARY-T. Points a builder must not miss:

- In the paid lesson ICT calls his list "the definitive teaching ... if you've seen anything different in the past this is the real one", and says users of his free tutorials "are waiting for two o'clock ... this is the actual Killzone I use so the time window begins at 1am" ([M8-L2], SECONDARY-T). Eight months later the free lesson still teaches "the ideal ICT London kill zone for your learning is going to be 2 a.m. to 5 a.m." ([F-LON], SECONDARY-T). The two sets are public versus paid, not old versus new (INFERENCE).
- He says the 1:00 to 5:00 window exists to absorb daylight-saving drift: "the way I overcome that is I look at my London open Kill Zone beginning at 1am New York time and ending at 5 a.m." ([M8-L1], SECONDARY-T). He also says the times are New York local "whether it's daylight savings time or regular time" ([M8-L2], SECONDARY-T).
- The start of the Asian range in M8-L2 is lost in the caption (it reads "foreign PM Eastern Standard Time"). The 8:00 PM figure comes from M8-L5, M8-L3 and C5 ([M8-L2], [M8-L5], SECONDARY-T).
- Community pages add more variants: LuxAlgo gives the Flout as "commonly 15:00 to 00:00 ET" and says "its exact boundaries vary between write-ups" ([LUX], SECONDARY); a TradingView script lists the Flout as 14:00 to 00:00 ([TradingView CBDR scripts](https://in.tradingview.com/scripts/cbdr/), SNIPPET); one site lists the New York killzone as 8:00 to 11:00 AM ([michaeljhuddleston.org](https://michaeljhuddleston.org/notes/ict-kill-zones-times-explained-trade-asia-london-new-york-like-a-pro/), SNIPPET, not an official ICT site as far as I can tell).
- A student's notes on an October 2017 free video record "For London the killzone occurs typically between 2-4 AM NY time" ([NNT], SECONDARY), which matches the paid "hot spot".

UK clock conversion (INFERENCE, arithmetic): New York is normally 5 hours behind London. Midnight NY is 05:00 UK. London killzone 2:00 to 5:00 AM NY is 07:00 to 10:00 UK. New York killzone 7:00 to 10:00 AM NY is 12:00 to 15:00 UK. London Close 10:00 AM to noon NY is 15:00 to 17:00 UK. CBDR 2:00 to 8:00 PM NY is 19:00 to 01:00 UK. For roughly three weeks in March and one week around the end of October the gap is 4 hours, and every UK time above moves one hour earlier.

## 3. The building blocks

### 3.1 Asian range

- Free definition: "the range begins at 7:00 p.m. New York time and it ends at midnight New York time ... exactly at midnight" ([F-AR], SECONDARY-T).
- Paid definition: "the Asian session range between 8:00 and midnight New York time we call that the Asian range", with a "classic range of 20 to 30 pips" ([M8-L5], SECONDARY-T).
- Tighter filter in the setup lesson: "demand that the Asian range is in a 20 pip range or less ahead of Frankfurt opening" ([M8-L7], SECONDARY-T).
- Opposite filter in Charter Model 5, where the range is used as a projection base instead of a quietness test: "ideal range of pips is 20 plus pips to be considered ... we don't like to use it when it's more than 40 pips ... if the range is less than 20 pips do not use the Asian range for expansion objectives elect to use the flout" ([C5], SECONDARY-T).
- Purpose in ICT's words: a narrow range means "orders build above and below"; if price trends from 8 PM, "the move has most likely occurred" and London will be "sloppy" ([M8-L6], SECONDARY-T).
- Entry bias around it: "if I'm bullish the best scenario is to go long below the Asian range low but as long as I'm below the Asian range high I'll still take what I consider high probability longs" ([AUG17-A], SECONDARY-T).

### 3.2 Central Bank Dealers Range (CBDR)

- "The time period that frames the Central Bank dealers range is 2 P.M to 8 PM New York time the ideal range is less than 40 pips preferably ... no more than 20 to 30 pips" ([M8-L3], SECONDARY-T).
- Measurement: he measures both wick-to-wick and body-to-body and leads with bodies: "I like to use the bodies predominantly because the wicks are always going to show erroneous price because of your dealing spread through your broker" ([M8-L3], [M8-L4], SECONDARY-T). Charter Model 5 says to calibrate on both and "look for confluences" ([C5-SUPP], SECONDARY-T).
- Chart timeframe for measuring: "I want to stay in the 15-minute time frame ... it's kind of like a bellwether" ([C5], SECONDARY-T).
- Too wide: a 58-pip CBDR is "too large ... we can't use this criteria" ([M8-L3], SECONDARY-T); "we move to the sidelines ... when the range is greater than 40 pips" ([M8-L4], SECONDARY-T); a CBDR above 50 pips makes him "possibly ... pass on a London session" ([M8-L6], SECONDARY-T).
- Too narrow, Charter Model 5 only: "if the range is less than 15 pips do not use the Central Bank dealers range for expansion objectives" ([C5], SECONDARY-T).
- Why 20 to 30 pips: "if the average daily range ... is typically around 100 pips ... one third of that is around 33 pips" ([M8-L3], SECONDARY-T). This rule of thumb is tied to a 100-pip day (see ambiguity A9).

### 3.3 "Standard deviation" projections

- They are plain range multiples. "One standard deviation above and below would be the same range added to the high of the Central Bank dealers range ... and subtract that range from the ... low", repeated for 2, 3 and 4 ([M8-L3], SECONDARY-T). LuxAlgo says the same thing bluntly: "plain range multiples, not statistical deviations" ([LUX], SECONDARY).
- Where the day's turning point should sit: "most sell days will create the high of the day from the Central Bank dealers range up to three standard deviations ... ideally ... no more than two ... many times just one"; mirror for buy days; four deviations means "very high impact news" or a "New York session market reversal profile" ([M8-L3], SECONDARY-T).
- The Judas swing size: "the protractionary stage or Judas swing will be one to two standard deviations of the Central Bank dealers range" ([M8-L5], SECONDARY-T). In pips: "we look for an average about 33 pips for a protractionary state in London it doesn't have to do that it can be just six pips" ([M8-L4], SECONDARY-T).
- The target projection: take the whole distance the Judas swing used (the CBDR plus the deviations it travelled), then stack that block from the opposite side of the CBDR until the time of day runs out, which is London Close (10:00 AM to noon) or at the latest 2:00 PM ([M8-L4], SECONDARY-T).
- ICT's own limits on it: "it does not mean it's going to call it to the pip" ([M8-L3]); "the precision really is on the entry side"; "it's the PD arrays that call the shot ... not the magic of these projections" ([M8-L4], SECONDARY-T). Stated tolerance in Model 5: "within 3 to five pips ... is what I think is normal" ([C5], SECONDARY-T).
- Entry cap in the Charter plans: enter only where price meets a 15-minute premium or discount array "that converges with a standard deviation of no more than three standard deviations" ([C5-PLAN], [C2-PLAN], SECONDARY-T).

### 3.4 Flout

- ICT's definition: "the flout is the Central Bank dealers range and the Asian range combined ... the highest high and the lowest low ... divided in half and this makes one standard deviation ... say that is 40 pips half of that range is 20 ... I go from the center point go up one" ([AUG17-A], SECONDARY-T).
- "Flout can be many standard deviations there isn't a rule-based idea like there is for Central Bank dealers range or Asian range" ([AUG17-A], SECONDARY-T).
- Selection order in Charter Model 5: use the CBDR if it is above 15 pips and not trending; otherwise the Asian range if it is 20 pips or more; otherwise the Flout ([C5], [C5-ALGO], SECONDARY-T).
- Community reconstruction differs: LuxAlgo projects the Flout's full height "exactly the way the CBDR's is", with no halving ([LUX], SECONDARY). That contradicts ICT's wording above.

### 3.5 The midnight open and Power of Three

- "Whatever the opening price is exactly at midnight New York time" is his "New York opening price" ([F-JUDAS], SECONDARY-T).
- Power of Three is the daily candle read as accumulation near the open, manipulation against the day's direction, and distribution (the range expansion): "the four reference points that make up power three the open the high the low and the close and what ... take place inside ... which is the accumulation manipulation and distribution" ([F-LC], SECONDARY-T); on a bullish day the manipulation is "the drop down below the opening price" that knocks out early longs ([F-AMD], SECONDARY-T).
- Practical rule: "we're looking at the opening price and we're waiting for the opposite to occur ... when we're bullish we're going to be buying near the low of the day or near the opening" ([M8-L8], SECONDARY-T).
- Size of the manipulation on a bullish day: "the opening price and then the market to trade down 20 to 30 pips ideally no more than 33 ... we don't want to see it trade more than 40" ([M8-L3], SECONDARY-T).
- It is fractal in his teaching: the London session (2:00 to 7:00 AM) and the New York session (to 2:00 PM) each show their own open, false move, expansion and close ([F-LON], [F-NY], SECONDARY-T).

### 3.6 Average daily range (ADR)

- Expected daily range is "the last five days average daily range"; the day trader's goal is "at least 65 to 70 percent of the daily range" ([M8-L1], SECONDARY-T).
- It is used as a stop fallback, a profit rule and a session filter (sections 4 to 6).

## 4. Model A: London Open killzone and the Judas swing off the Asian range

### 4.1 Free-series version (public)

Rules in ICT's order ([F-JUDAS], [F-LON], SECONDARY-T throughout):

1. Have a daily bias first: "the premise is we would have to already arrive at an analysis that lends well to bullish prices".
2. Mark the Asian range and the midnight New York opening price. The Asian range should be "in a tight consolidation".
3. Bullish day: expect a first pop above the Asian range high, then "a drop below the opening price at midnight and then below the Asian range low when that occurs that's the actual Judas swing". Bearish day: the mirror.
4. Depth: "anticipate some measure of a sweep 10 20 pips or so"; on the bearish example the run goes "10 20 pips" above the Asian high.
5. Entry: "if you were to trade just below that Asian range low as an entry and use a respectable amount of pips in terms of a stop it might get you into a pretty good trade". No stop figure is given in this lesson.
6. Time: hunt from midnight to 5:00 AM; the London killzone 2:00 to 5:00 AM "generally has the highest probability of creating the high or the low of the day"; no entries from 5:00 to 7:00 AM.
7. Confirmation after the fact: price "starts to move aggressively away from that high".
8. Standing aside: "if you don't see this phenomenon take place it's probably better for you to stay out".

Stated size of the prize: the London open "frequently sets up an optimal trade entry pattern that can offer 25 to 50 pips for a scalp" ([F-LON], SECONDARY-T). Stated frequency: "it will not give you a trade every single day ... it will give you a set up a few times a week if you look at the majors ... euro dollar, cable, Aussie dollar, dollar yen" ([F-JUDAS], SECONDARY-T).

A definitional point the community usually drops: ICT says a small dip under the midnight open is not a Judas swing. The price must first run the wrong side, then cross the midnight open and take the far side of the Asian range ([F-JUDAS], SECONDARY-T). Community indicators are built around the midnight open on the 15-minute chart; one is titled "Judas Swing ICT 01 [TradingFinder] New York Midnight Opening M15" ([TradingView listing](https://it.tradingview.com/scripts/judas), SNIPPET). I did not read their rules, so I cannot say how many keep ICT's three-step condition.

### 4.2 Paid version: the April 2017 Day Trading Model

Pre-conditions ([M8-L1], [M8-L5], [M8-L6], [M8-L7], SECONDARY-T):

1. Direction from the daily and/or 4-hour chart: "the highest importance is placed on the higher time frame daily and or four hour direction"; price has reacted at a daily premium or discount array and has "a clear unobscured path" to an opposing one ([M8-L7]).
2. Day of week: "the ideal days of the week ... are Monday Tuesday and Wednesday" ([M8-L7]). Detailed day notes are in section 7.
3. Range filters: CBDR under 40 pips "ideally"; Asian range 20 pips or less "ahead of Frankfurt opening" ([M8-L7]); or Asian range 20 to 30 pips ([M8-L5]).
4. Skip London entirely when any of these hold ([M8-L6]): the previous day's range exceeded twice the 5-day ADR; three consecutive daily closes in the trade direction; the day after an FOMC whipsaw; non-farm payrolls Friday; the session before a holiday or long weekend; several medium or high-impact releases for that currency in the London session; CBDR above 50 pips; CBDR or Asian range visibly trending rather than consolidating; price trending from 8:00 PM. His instruction for those days: "sleep in trade New York".
5. Preferred calendar: "generally one high impact or medium impact news event" in the session; no news at all is "a wild card day" ([M8-L6]).

The two intraday profiles ([M8-L5], SECONDARY-T):

- **London normal protraction.** Sell day: price must "rally up after 12 a.m. New York time to 2 a.m.". "If it does not start trading up into 2 o'clock ... that is not this profile." The rally is "one to two standard deviations of the Central Bank dealers range". Entry "can occur as early as 1:30 a.m."; the high of day is typically set "between 2:00 and 4 o'clock in the morning". Buy day is the mirror.
- **London delayed protraction.** No false move after midnight. Then "draw a vertical line at 2 a.m. wait for a retracement" into a 15-minute premium or discount array; "between 2:00 and 3:00 a.m. that Judas swing should occur".
- If neither appears: "there's going to be times where it won't provide you an entry ... that's a trade that you missed."

Entry list for longs, shorts mirrored ([M8-L7], SECONDARY-T). Execution timeframe: "15 and or a five minute chart"; time: "buying between 2 am and 4 a.m New York time".

| # | Entry ICT lists | Stop he states |
|---|---|---|
| 1 | One to two CBDR and/or Asian-range deviations below, overlapping a discount array | "if you're trading in Central Bank dealers range overlap with a PD array the stop has to be 30 pips under your entry" |
| 2 | "Buying under the Asian range plus five pips for the spread" | "anything below an Asian range low your stop needs to be 40 pips below your entry" |
| 3 | Raid of a short-term low from the previous day's New York session, or of the previous day's low | "30 pips under the low" |
| 4 | Price rallied straight from midnight with no dip: buy "the first retracement into a 15 and or five minute bullish order block" in the 2:00 to 4:00 window | "10 pips under the lowest low of the day" |
| 5 | A low taken out twice with no prior up-move, bought "as a turtle soup" | 30 pips below that low |
| 6 | Anything else | "50 [percent] of the average daily range of the last five days subtracted from the Asian range low" |

Stop handling: "leave your stop at initial until you get to at least 40 to 50 [percent] of the daily range ... then bring it to break even" ([M8-L7], SECONDARY-T).

Profit taking ([M8-L7], SECONDARY-T): "always ... take something off ... at 20 to 30 pips"; then "every two standard deviations of the Asian range or Central Bank dealers range"; at the previous day's high "plus 5 to 15 pips"; at the 50% level of the 60-minute range; "take or have had taken 60 to 80 percent off at five day average daily range projections"; and by clock at or just after 5:00 AM, before the 7:00 AM New York open, and between 10:00 and 11:00 AM.

ICT's own caveat on the list: "not every single one of these are going to be usable ... yes it requires you to think" ([M8-L7], SECONDARY-T). His frequency claim: "these types of trades form several times a week" ([M8-L7], SECONDARY-T).

### 4.3 What is ICT and what is community

- ICT's own words: everything quoted in 4.1 and 4.2, including every pip figure.
- Community reconstruction: "Judas swing = any Asian-range sweep in 2:00 to 5:00 AM followed by a market structure shift and fair value gap entry". The paid lessons do not require a structure shift or a fair value gap for the London trade. They list level-based entries (table above). The MSS-plus-FVG sequence is the 2022 index-futures model back-fitted onto forex (INFERENCE, comparing with `docs/ICT_STRATEGY_DIGEST.md` section 2).
- Community reconstruction: fixed projection counts such as "low of day at minus 3 deviations" ([WRIT], SECONDARY). ICT's rule is that the target block equals whatever the Judas swing used, capped by time of day ([M8-L4]).

### 4.4 Left to discretion

The bias; which array counts as "overlap"; whether the midnight-to-2:00 move is "sustained"; whether the CBDR is "consolidating"; which of six entries applies; how many partials and what size.

## 5. Model B: the New York session forex trade (7:00 to 10:00 AM)

### 5.1 The continuation trade with Optimal Trade Entry

Rules in order:

1. Daily bias from the daily chart ([F-NY], SECONDARY-T).
2. London must have confirmed it: bullish means "we should be seeing a low form in London" ([F-NY], SECONDARY-T).
3. Skip New York if London already delivered 80% of the 5-day ADR ([M8-L1], SECONDARY-T).
4. Continuation or reversal test: "unless the New York session opens up at a premium array on a higher time frame or discount array ... New York will always be expected to be a continuation of what was seen in London" ([M9-L5], SECONDARY-T).
5. In the killzone, wait for a retracement against the London move: "at seven o'clock in the morning we're gonna be looking for some measure of a retracement lower then ... an optimal trade entry to go long" ([F-NY], SECONDARY-T).
6. The swing to measure, paid version: "retracement into the range that was created from London's low to the high formed prior to 8:20 8:30 a.m ... the CME opening which is 8:20 a.m New York time when that occurs generally that's going to be the setup in New York" ([M8-L1], SECONDARY-T).
7. Entry level: the Optimal Trade Entry zone is the 62% to 79% retracement with 70.5% as the midpoint ([NNT], SECONDARY, quoting his free OTE video; `docs/ICT_STRATEGY_DIGEST.md` section 4). The Charter plans turn it into one price: "we will use the 62% retracement level on the fib plus ... five pips ... as our entry price when using the buy limit order" ([C1-PLAN], [C11-PLAN], SECONDARY-T).
8. Target, free version: "20 to 30 pips as a scalp" ([F-NY], SECONDARY-T). Paid version: expansion toward the 5-day ADR, scaling out between 10:00 and 11:00 AM ([M8-L7], SECONDARY-T).
9. Stop: the free lesson gives none. Charter Model 1 gives "the 7:00 a.m. ... to 10:00 a.m. time window ... lowest low ... minus five pips" ([C1-PLAN], SECONDARY-T). Charter Model 11 gives a flat 20 pips ([C11-PLAN], SECONDARY-T).

ICT's opinion of it: "New York primarily is really really good", "the easiest one to work with" ([M8-L1], SECONDARY-T); "the continuation of the London move I believe is the easiest" ([F-NY], SECONDARY-T). He says he will not teach reversals in the free material because they need "a lot more things" ([F-NY], SECONDARY-T).

### 5.2 Charter Model 11: the 30-pip day trade (the cleanest pending-order plan)

Plan as stated ([C11-PLAN], SECONDARY-T; title and channel PRIMARY):

1. Note medium and high-impact events for the week.
2. Dealing range: highest high and lowest low of "the last 20 trading days ... we do not count Sundays".
3. Name the draw on liquidity (an old high or low). "We target external range liquidity for this model."
4. On the 60-minute chart, find room for "an expansion that would cover over 30 pips".
5. In the London Open and/or New York Open killzone, wait for a 60-minute retracement against the bias, then find "a 15 or 5 minute ... optimal trade entry".
6. Entry: buy limit at "the 62% retracement level on the fib plus five pips"; sell limit at 62% minus five pips.
7. Target: "a ... limit order to take 30 pips ... on a single position".
8. Stop: "stop-loss opens with a 20 pip risk". At plus 15 pips, reduce the stop by 5 pips. At plus 20 pips, move it to break-even.
9. Size: "position size equals account equity times r% divided by stop-loss in pips", 1% in his example, "always rounding down".
10. After a full loss, halve the risk until half the loss is recovered. After five wins in a row, halve the risk.

ICT's framing: Models 11 and 12 are "bread and butter", "tend to be lower in their return relative to the initial risk", and "should not be your go-to initially" ([C11-PLAN], SECONDARY-T). He claims "every single trading day there's something" across markets ([C11-PLAN], SECONDARY-T). In the same June 2022 recording he says "I have not been trading Forex for a while" ([C11-PLAN], SECONDARY-T).

### 5.3 Charter Model 1 and the 20-pip New York scalps (5-minute charts)

- Model 1: New York killzone 7:00 to 10:00 AM; "a five minute chart optimal trade entry"; limit at 62% plus or minus 5 pips; two targets at 15 and 20 pips; stop 5 pips beyond the killzone extreme; "we will not re-enter if the trade stops out ... one and done" ([C1-PLAN], SECONDARY-T).
- "Targeting 20 pips per day", New York expansion: up to 10:00 AM, London has already posted the day's low, the 5-day ADR is "still pending", price dips under a 5-minute short-term low, buy below it; "fixed with a stop loss at 20 pips", target 20 pips ([M9-L3], SECONDARY-T). He adds "I don't want you [to] think you can go in every single day day trading and trying to get 20 pips".
- Model 12: 5-minute fair value gap scalp, 20-pip stop, 20-pip target, stop halved at plus 10, break-even at plus 15 ([C12-PLAN], SECONDARY-T).

These are 5-minute models with 1:1 nominal payoff. They sit outside the owner's M15 decision and are listed for completeness.

## 6. Model C: the London Close trade (10:00 AM to noon)

Free-series rules ([F-LC], SECONDARY-T):

1. Window: "10 a.m. to noon New York time".
2. Expectation: London Close "usually ends the opposite end of the daily range". On an up day the high tends to form in this window.
3. Trade: a retracement off that extreme, entered with "a five-minute optimal trade entry setup". "You have to be looking at it from a 5-minute anything higher than that you're not going to get [the] detail you need."
4. Target: "10 15 maybe even 20 pips if you get anything more than 20 pips it's going to be a rarity".
5. Pairs: "the major pairs ... coupled with a dollar".
6. No stop figure is given.

Paid-content qualifications:

- "I've taught London close day trading strategy in the past I used to do it I lost interest in it because it just doesn't give me enough of a payment" ([M8-L1], SECONDARY-T).
- He takes the reversal scalp "only ... when the average daily range of the last five days has been exceeded"; such days "tend to retrace about 20 percent of [the] total daily range at 10 o'clock in the morning to noon" ([M9-L5], SECONDARY-T).
- Its main job is exits: "London close is the time of day where we look to really bank our positions" ([M8-L1], SECONDARY-T); "generally by noon ... you're done" ([M8-L1], SECONDARY-T).

Community pages in my search results give "10 to 20" or "15 to 20" pips for this trade (SNIPPET; the results listed [innercircletrader.net](https://innercircletrader.net/tutorials/master-ict-kill-zones/) and [howtotrade.com](https://howtotrade.com/blog/ict-kill-zones/) among others, and the extract did not say which page carried which figure). ICT's own free figure is 10 to 20.

Verdict for this project (INFERENCE): a 5-minute entry, a 10 to 20 pip target and no stated stop make this the weakest fit for an M15 hand-placed model. Its real use is as a time-based exit rule for trades opened earlier.

## 7. Model D: Power of Three and the weekly profiles as the frame

### 7.1 The weekly range framework ([M8-L1], SECONDARY-T)

1. Before the week, forecast the weekly candle's direction from daily premium and discount arrays over "the last 20 40 and 60 trading days".
2. Mark Sunday's opening price (or Monday's if the broker has no Sunday candle) and extend it on the hourly chart to Thursday.
3. Bearish week: expect price to trade above that open early in the week ("a little bit of a Judas swing"). Then "as long as we are trading below the Sunday's opening price we're looking to sell short every single day in London and continuation in New York".
4. This holds "only until we trade to a higher time frame discount PD array".
5. If price crosses back through the weekly open on Thursday, treat it as an intra-week reversal.

### 7.2 Day-of-week notes ([M8-L1], SECONDARY-T)

- Monday: usually a small range. A large Monday into a daily array "can many times be the high [or low] of the week".
- Tuesday: "on bullish weeks Tuesday has a 77 [percent] likelihood of creating the low of the week in London"; the caption then says "70" for the bearish mirror. No data is shown for either figure.
- Wednesday: "ideal day trading is seen on Wednesday".
- Thursday: can reverse; "the weekly range is ... capped by Thursday's New York session".
- Friday: typically small unless the weekly objective is still unmet.
- FOMC and payroll days: "basically a no setup day".

An outside check on a similar ICT claim ("the weekly high or low usually forms between Sunday's open and Tuesday's London open 80% of the time") found about 58% for Monday to Wednesday on the author's samples, and called the 80% "an exaggeration" ([NNT], SECONDARY). I did not re-test either figure.

### 7.3 Named weekly templates

The March 2017 lesson walks through: classic Tuesday low of the week, classic Tuesday high of the week, Wednesday low of the week, Wednesday high of the week, consolidation midweek rally, and Wednesday weekly reversal ([M7-L3], SECONDARY-T). Each is described on a 60-minute chart as a run into a higher-timeframe array early in the week, then expansion until Thursday's New York session. ICT's own default: "I internalize ... Tuesday creating the high of the week and Thursday's New York open creating the low of the week ... there's no cookie cutter one fits all approach" ([AUG17-B], SECONDARY-T). The lesson that first lists all the profiles (lesson 2 of that month) was not in the files I could list, so "seek and destroy" and "consolidation Thursday reversal" are named here only from community usage (INFERENCE).

### 7.4 How the Charter plans use the week

- Model 5 plan: trades only "Tuesday Wednesday and or Thursday"; longs must be "at or below" Tuesday's European opening price and inside a 15-minute discount fair value gap; skip Thursday after two large favourable days ([C5-PLAN], SECONDARY-T). The Model 5 lecture says he prefers "Monday Tuesday or Wednesday" ([C5], SECONDARY-T). The two statements conflict.
- Model 2 plan: "we will short above the European opening price and buy below the European opening price"; target 50 to 100 pips by "Thursday or sooner" ([C2-PLAN], SECONDARY-T).

### 7.5 Charter Model 5 as a full plan ([C5-PLAN], SECONDARY-T; title PRIMARY)

1. 20-trading-day dealing range; name a draw at least 40 pips away (previous day's or an intra-week high or low).
2. Wait for "manipulation ... opposite to our trade bias at a time the economic calendar suggests a volatility injection".
3. Short: price rises into "a 15 minute premium fair value gap PD array that converges with a standard deviation of no more than three standard deviations during London open or New York open".
4. Entry: "sell limit order ... the standard deviations and PD array convergence minus 5 pips".
5. Targets: one order at 40 pips, a second at 50 pips; an optional third closes 80% at 50 pips and leaves a runner.
6. Stop: "we will note the premium array and standard deviation convergence we aim to enter at we will place our stop loss above this high plus 15 pips". "This high" is not defined further. The long-side caption reads "below this low minus5 pips", which is probably a mis-captioned 15.
7. "We will re-enter if the trade stops out ... day trades may require multiple attempts."
8. Stop management: at 25% of the objective reduce the stop by 25%; at 50% reduce by 50%; at 75% move to break-even.

## 8. The stop and target figures ICT actually states for forex

| Context | Stop | Target or expectation | Source |
|---|---|---|---|
| London entry at CBDR deviation overlapping an array | 30 pips from entry | first scale at 20 to 30 pips; 60 to 80% off at the 5-day ADR projection | [M8-L7] |
| London entry under or over the Asian range | 40 pips from entry | same | [M8-L7] |
| London stop-raid entry | 30 pips beyond the raided level | same | [M8-L7] |
| London first retracement into a 15 or 5-minute order block | 10 pips beyond the day's extreme | same | [M8-L7] |
| London, any other setup | half the 5-day ADR beyond the Asian range edge | same | [M8-L7] |
| London Open, free lesson | not stated | 25 to 50 pips | [F-LON] |
| Judas sweep depth beyond the Asian range | | 10 to 20 pips | [F-JUDAS] |
| Judas depth from the midnight open | | 20 to 30 pips ideal, 33 typical cap, 40 maximum, "can be just six" | [M8-L3], [M8-L4] |
| New York Open, free lesson | not stated | 20 to 30 pips | [F-NY] |
| Charter Model 1 (New York, 5-minute) | killzone extreme plus 5 pips | 15 and 20 pips | [C1-PLAN] |
| Charter Model 5 (London or New York) | 15 pips beyond the high or low of the entry zone | 40 and 50 pips | [C5-PLAN] |
| Charter Model 2 (short-term, weekly range) | 25 pips beyond the high or low of the entry zone; no re-entry | 50 to 100 pips | [C2-PLAN] |
| Charter Model 8 (5-minute) | 15 pips | 25 pips per week | [C8-PLAN] |
| Charter Model 9 example | 20 pips | 50 to 75 pips per week | [C9-PLAN] |
| Charter Model 11 | 20 pips | 30 pips | [C11-PLAN] |
| Charter Model 12 and the 20-pip scalps | 20 pips | 20 pips | [C12-PLAN], [M9-L3] |
| London Close, free lesson | not stated | 10 to 20 pips | [F-LC] |
| Asian session, free lesson | not stated | 15 to 20 pips | [F-AKZ] |
| Range filters | | CBDR under 40 (ideal 20 to 30); Asian range 20 to 30, or 20 or less | [M8-L3], [M8-L5], [M8-L7] |

All rows SECONDARY-T. Other stated figures:

- His floor on stops: "personally my lowest is about 15 pips but as a mentor I'm trying to keep you around that 20 pip threshold ... don't ever subscribe to anyone telling you they use a five pip stop loss or a two pip stop loss" ([C12-PLAN], SECONDARY-T).
- His weekly aim: "I look for my personal trading ... 50 to 75 pips a week" ([F-NY], SECONDARY-T).
- Setups per day: "generally there are two setups per trading day on average" ([M8-L1], SECONDARY-T).
- Reward-to-risk talk: "setups that pay out five to one or three to one ideally" appears for day-trade entries attached to higher-timeframe ideas ([M8-L1], SECONDARY-T). The fixed plans above pay 1:1 to roughly 2:1.
- A student's note from an older free series records "30 pip stop loss ... 1/4 of one percent risk" ([NNT], SECONDARY).
- The 15-pip "minimum trade framework" for forex comes from the 2023 Silver Bullet lecture and is already in `docs/ICT_STRATEGY_DIGEST.md` section 5. I did not re-verify it.

## 9. Pairs

- London: "the euro dollar and the British Pound pairs are ideal for this time of day and that's why I've elected to trade those two pairs" ([F-LON], SECONDARY-T).
- "The two pairs that I like which is Euro and cable" ([M7-L8], SECONDARY-T).
- New York: "the majors that are coupled with the dollar index ... that to me is the ideal pair for this time of day"; "every pair doesn't have a set up every New York open but every New York open has a set up in one or more of the majors" ([F-NY], SECONDARY-T).
- Judas watch-list: "euro dollar, cable, Aussie dollar, dollar yen" ([F-JUDAS], SECONDARY-T).
- "All of the pairs I trade are the majors and ... commodity dollars" ([M6-L7], SECONDARY-T).
- Exclusions: "I don't look at the Yen I don't look at Swissy ... I look at the ones that's going to be germane to the markets I'm trading relative to the dollar" ([C1-PLAN], SECONDARY-T). On pound-Swiss and similar: "to me that's an exotic I don't trade them" ([F-AKZ], SECONDARY-T). These conflict with dollar-yen being on the Judas watch-list.
- Asian session: yen, Aussie and kiwi pairs can set their daily high or low in the Asian open instead of London ([M8-L1], SECONDARY-T). For those pairs the London model's premise is weaker (INFERENCE).
- Dollar index: SMT divergence compares "the dollar index itself versus foreign currency pairs"; a pair refusing to make a lower low while the index makes a higher high is read as accumulation ([F-SMT], SECONDARY-T). In Model 5 he times a cable low to the dollar index reaching "a monthly bearish order block" ([C5], SECONDARY-T). EURUSD against GBPUSD divergence is covered in `docs/ICT_STRATEGY_DIGEST.md` section 4. It is confirmation only.
- Daily bias is "a mirror image" between the dollar index and EURUSD ([F-BIAS], SECONDARY-T).
- A student's note: "He's watching EURUSD, GBPUSD, USDCAD and USDX" ([NNT], SECONDARY).

For the app (INFERENCE): ICT's stated London pairs are EURUSD and GBPUSD. AUDUSD, NZDUSD, USDCAD and USDJPY appear in his New York and Judas examples. USDCHF is explicitly not watched. All pip figures above were stated in 2017 to 2022 for roughly 100-pip days and must be rescaled per pair.

## 10. How the daily bias is decided, across all models

1. Previous-day rule (free): bullish means "the previous day's high [is] the target and the previous day's low [should] be supported"; "very rarely do you see both sides of the previous day's candle ... traded through" ([F-BIAS], SECONDARY-T).
2. Daily OTE (free): a daily candle that rejects inside the optimal-trade-entry zone of a daily swing (his example reaches the 70.5 level and fails before the 79) makes him study the next day for a down-close ([F-LON], SECONDARY-T).
3. Daily and/or 4-hour direction plus a reaction at a daily array with a clear path to the opposite one ([M8-L7], SECONDARY-T).
4. Weekly open filter (section 7.1).
5. 20-day dealing range and "next draw on liquidity" ([C1-PLAN], [C5-PLAN], [C11-PLAN], SECONDARY-T). In the same plan he concedes the weakness: students "don't know bias"; "I have a pretty high accuracy ... I'm not 100%" ([C1-PLAN], SECONDARY-T).
6. Confirmation: London must agree before New York is traded ([F-NY]); dollar index SMT ([F-SMT]).

None of these is a complete algorithm. Items 1 and 4 are the only ones stated tightly enough to code without invention (INFERENCE).

## 11. Ambiguities a programmer must resolve

| # | Ambiguity | What the sources say | Note |
|---|---|---|---|
| A1 | Asian range start | 7:00 PM ([F-AR]) or 8:00 PM ([M8-L5], [C5]) | parameter |
| A2 | CBDR start | 2:00 PM ([M8-L3]); caption "4:00 p.m." twice in [C5] | may be a caption error; unresolved |
| A3 | Flout window and maths | CBDR plus Asian, halved ([AUG17-A]); "4 p.m. to midnight ... 50% increments" ([C5]); community 3:00 PM, full height ([LUX]) | three variants |
| A4 | Bodies or wicks | both, bodies first ([M8-L3]); "look for confluences" ([C5-SUPP]) | doubles every level |
| A5 | Timeframe for measuring ranges | 15-minute ([C5]) | body ranges change with timeframe |
| A6 | London killzone | 1:00 to 5:00, 2:00 to 5:00, hot spot 2:00 to 4:00 | parameter |
| A7 | Daylight-saving weeks | always New York clock ([M8-L2]); the 1:00 start exists to absorb drift ([M8-L1]) | London's real open shifts an hour for about four weeks a year |
| A8 | Asian range limit | 20 or less ([M8-L7]); 20 to 30 ([M8-L5]); over 40 switch to delayed profile ([M8-L6]); at least 20 to use for projections ([C5]) | the two uses pull in opposite directions |
| A9 | Pip figures versus today's ranges | all tied to "about 100 pips" ADR ([M8-L3]) | scale by ADR or keep fixed pips: our decision |
| A10 | "Rally from midnight into 2:00 AM" | "sustained", may dip modestly first ([M8-L5]) | needs a numeric test |
| A11 | "Overlap" or "convergence" with an array | tolerance "3 to five pips" ([C5]) | which arrays, which timeframe |
| A12 | Which of six London entries | "depends on what the market's providing" ([M8-L7]) | priority order is ours |
| A13 | "Plus five pips for the spread" | entry under the Asian low ([M8-L7]); 62% plus or minus 5 ([C11-PLAN]) | the offset fills earlier than the level |
| A14 | OTE swing anchors | previous day's low to high, previous New York session, London extreme to pre-8:20 swing ([M8-L7], [M8-L1]); 60-minute swing ([C11-PLAN]) | swing detection is ours |
| A15 | Stop anchored to entry or to a level | both appear in the same list ([M8-L7]) | follow each row literally |
| A16 | Partial exits | up to nine scale-out rules ([M8-L7]); two or three orders ([C5-PLAN]) | see sizing note in section 12 |
| A17 | Trading days | Mon to Wed ([M8-L7], [C5]); Tue to Thu ([C5-PLAN]) | conflict inside Model 5 |
| A18 | News | one medium or high event wanted; several events, none, FOMC, payrolls and holidays are skips ([M8-L6], [M8-L1]) | calendar feed and impact grading needed |
| A19 | Re-entry | allowed in Model 5; forbidden in Model 1 | must respect the 2-trades-a-day rail |
| A20 | Daily bias | section 10 | the largest invention in any build |
| A21 | New York continuation or reversal | reversal only if New York opens at a higher-timeframe array ([M9-L5]) | array detection is discretionary |
| A22 | Order expiry | not stated anywhere I read | ours; the killzone end is the natural choice |
| A23 | Friday and Sunday | Sunday merged into Monday ([M8-L1]) | broker candle convention matters |
| A24 | "Short-term high or low" | no bar count in these lessons | reuse the 3-candle swing from the digest |
| A25 | Model 5 and Model 2 stop anchor | "above this high plus 15 pips" ([C5-PLAN]); "plus 25 pips" ([C2-PLAN]) | "this high" is undefined: array high, swing high or entry level |

## 12. Comparison of the models

Frequency figures are my estimates from ICT's qualitative statements. Nobody has published a measured count, and they must be replaced with counts from our own data.

| Model | Trades per week per pair | Typical stop (pips) | Typical reward-to-risk as stated | Fit for a hand-placed pending order from M15 |
|---|---|---|---|---|
| A. London Open, Judas off the Asian range (April 2017 paid rules) | ICT: "several times a week", across his pairs. My estimate after all filters: 0.5 to 1.5 | 30 or 40; 10 for the order-block variant | first scale at 20 to 30 pips is under 1R; main exit near the 5-day ADR gives roughly 1.5 to 2.3R on a 100-pip day, less on quieter pairs | Good. Levels are known by midnight or 2:00 AM New York; "5 pips under the Asian low, 40-pip stop" is a plain buy limit. Needs the app awake 05:00 to 09:00 UK. Many discretionary gates |
| A-free. London Open, free lesson | ICT: "a few times a week" across four majors. My estimate: about 0.5 to 1 | not stated | 25 to 50 pips claimed, no stop given | Poor as written: no stop, no entry price |
| B. New York continuation with OTE (free plus April 2017) | ICT: a setup "in one or more of the majors" daily, not every pair. My estimate: 1 to 2 | not stated in the lessons; killzone extreme plus 5 in Model 1 | 20 to 30 pips against an unstated stop | Fair. A limit at 62% of the London-to-pre-8:20 swing is placeable; the stop needs our rule |
| B11. Charter Model 11 (60-minute OTE, London or New York) | ICT: "every single trading day there's something", across markets. My estimate: 1 to 3 | 20 | 1.5 (30 against 20) | Best. Literally a limit order with fixed stop and target. Swing choice and bias are discretionary |
| D5. Charter Model 5 (deviation convergence) | plan allows Tue to Thu only. My estimate: 0.5 to 1.5 | 15 beyond the entry zone's extreme; my estimate 20 to 30 from entry | roughly 1.5 to 2.5 (40 and 50 against my 20 to 30 estimate) | Good order mechanics. The level calculation is the hardest part of anything here to code |
| B1. Charter Model 1 and the 20-pip scalps (5-minute) | up to daily | 15 to 25 | 0.6 to 1.3; 1.0 for the 20-and-20 versions | Wrong timeframe for this project; thin after costs |
| C. London Close | only after the ADR is exceeded. My estimate: under 1 | not stated | 10 to 20 pips, about 1 at best | Poor. 5-minute entry, small target, ICT says he lost interest |

Cost geometry (INFERENCE, using the 1.4-pip EURUSD round trip measured in `docs/PHASE2_RESULTS.md`):

- Cost as a share of the stop: 35% at a 4-pip stop (the failed model), 7% at 20 pips, 4.7% at 30 pips, 3.5% at 40 pips.
- Break-even win rate after that cost: 20 stop and 20 target, 53.5%. 20 stop and 30 target, 42.8%. 20 stop and 15 target, 61.1%. 30 stop and 65 target, 33.1%. 40 stop and 65 target, 39.4%.
- GBPUSD and the commodity dollars cost more per round trip, so their break-even rates are higher.

Sizing at about GBP 500 and 1% risk (INFERENCE, assuming roughly GBP 0.077 per pip per 0.01 lot on EURUSD): a 20-pip stop allows 0.03 lots, a 30-pip stop 0.02 lots, a 40-pip stop only 0.01 lots (about 0.6% risk). ICT's two-order and three-order partial schemes cannot be reproduced at these sizes. Any model chosen must be specified with a single exit, or with one crude split at most.

## 13. Evidence note

- I found no independent, methodologically sound test of any model in this report. The closest item is an MQL5 indicator scorecard for an "Asian range sweep then reversal" rule on M15: over 400 days to 18 September 2026, EURUSD 53 signals, 41.5% wins, profit factor 1.30, +9.0R; GBPUSD 63 signals, 36.5% wins, profit factor 1.01, +0.3R; spread deducted, no commission or slippage, 2R targets ([MQL5], SECONDARY). Its range window (01:00 to 09:00 server time) and rules are not ICT's, and 53 trades cannot separate edge from noise.
- A hobbyist London-breakout backtest reports GBPUSD near break-even and EURUSD flat ([github.com/MHZardary/london-strategy-backtest](https://github.com/MHZardary/london-strategy-backtest), SNIPPET). A vendor reports profit factor 1.68 over 1,247 kill-zone sweep trades mixing EURUSD and gold ([backtrex.com](https://backtrex.com/en/blog/liquidity-sweep-strategy-backtest-results), SNIPPET; the vendor sells the testing tool).
- ICT's statistics (Tuesday 70 to 77%, "20 to 30 pips every day") come with no data. The one outside check of a similar claim found it overstated ([NNT], SECONDARY).
- A search extract mentions a failed "2026 public challenge" by ICT (SNIPPET). The extract did not say which of the listed review pages made the claim; candidates are [tradingwriters.com](https://tradingwriters.com/ict-review-michael-huddleston-inner-circle-trader/) and [backtrex.com](https://backtrex.com/en/blog/michael-j-huddleston-biography-ict-trader). I did not verify it.

## 14. What I could not establish

1. **The videos themselves.** Every ICT quotation is from machine captions in a third-party archive. I did not watch any video. For the 2017 core-content and free-primer IDs I could not confirm the channel (YouTube oEmbed returned 401).
2. **Asian range start in the "definitive" lesson.** The caption drops the hour. Whether the slide says 7:00 or 8:00 PM is open.
3. **Charter Model 5's CBDR and Flout start.** The caption says 4:00 PM. This may be a mis-captioned 2:00 PM or a real change. The Flout has three candidate definitions.
4. **ICT's free CBDR tutorial.** He says the paid lesson differs from it. I did not obtain it.
5. **Lessons not read.** The weekly profiles lesson (March 2017 lesson 2), the May 2017 "bread and butter" lessons and "daily day trade routine", and the full Model 5 supplementary lecture. The archive listing was cut at 100 files, so other relevant lessons may exist.
6. **Stops for the free London, New York and London Close trades.** Not stated in the lessons read.
7. **Any measured frequency.** All trades-per-week figures are my estimates.
8. **Any performance record.** No verified results for any model, from ICT or anyone else.
9. **Current ranges.** I did not measure the 5-day ADR, the CBDR or the Asian range for any pair in 2023 to 2026. Whether "CBDR under 40, Asian range under 20 to 30" is a real filter or passes almost every day on today's EURUSD is unknown.
10. **Spreads by hour.** I did not research retail spreads at midnight to 2:00 AM New York against 2:00 to 5:00 AM.
11. **Anything ICT has said about these forex models since 2022.** One search found nothing new. In June 2022 he said he had not traded forex "for a while".
12. **The 62 to 79% OTE levels at source.** Taken from a student's notes and our own digest. The Charter plans confirm only the 62% entry.
13. **The stop anchor in Charter Models 5 and 2.** "This high" is not defined in the plans. My 20 to 30 pip estimate of the resulting stop distance is a guess.

[M8-L1]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/corecontent/-cXnnHjy9s0.txt
[M8-L2]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/corecontent/_2nUKLAD9ig.txt
[M8-L3]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/corecontent/nI1AMOC1pro.txt
[M8-L4]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/corecontent/JKzEhfwV1dY.txt
[M8-L5]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/corecontent/eU8WcUftUtY.txt
[M8-L6]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/corecontent/stK2gNqhLaM.txt
[M8-L7]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/corecontent/5Z_3NbclMSY.txt
[M8-L8]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/corecontent/1MnfiqKx5Uo.txt
[M9-L3]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/corecontent/km0haQkTalc.txt
[M9-L5]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/corecontent/KrGTimL3YRQ.txt
[M7-L3]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/corecontent/hbE8S5FSdtQ.txt
[M7-L8]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/corecontent/LBlK6JB0QS0.txt
[M6-L7]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/corecontent/Hoo_wTMgdcY.txt
[AUG17-A]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/corecontent/Oec_0NM_OeY.txt
[AUG17-B]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/corecontent/3B7Reg2Yiqs.txt
[F-LON]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/marketmakerprimer/G8OEsUAoIWE.txt
[F-NY]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/marketmakerprimer/plNN9n7nrxc.txt
[F-LC]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/marketmakerprimer/3OEUIkkcmLE.txt
[F-JUDAS]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/marketmakerprimer/xJMbva8SjzE.txt
[F-AR]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/marketmakerprimer/JA0mLNJeytY.txt
[F-AKZ]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/marketmakerprimer/ley5HZs4bUM.txt
[F-AMD]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/marketmakerprimer/dIT4HTFYGGo.txt
[F-BIAS]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/marketmakerprimer/vJvcZGGeTZU.txt
[F-SMT]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/marketmakerprimer/isXicdayBwA.txt
[C1-PLAN]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/charter-content/4f1vjQMlV50.txt
[C2-PLAN]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/charter-content/KQdsa7S1LoQ.txt
[C5]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/charter-content/JN_uaDDZ0rc.txt
[C5-PLAN]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/charter-content/NB7Bku099tU.txt
[C5-ALGO]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/charter-content/2fgXDt3T3XE.txt
[C5-SUPP]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/charter-content/bcp19tiJZA0.txt
[C8-PLAN]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/charter-content/F-8hPvSyIB4.txt
[C9-PLAN]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/charter-content/YIxurbDNrWM.txt
[C11-PLAN]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/charter-content/pblXxWhnRz4.txt
[C12]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/charter-content/3xgtrXok-xs.txt
[C12-PLAN]: https://raw.githubusercontent.com/fluoroamphetamine/transcript/main/ict/charter-content/xi0N9BG1Qvs.txt
[LUX]: https://www.luxalgo.com/library/concept/ict-session-ranges/
[WRIT]: https://www.writofinance.com/central-bank-dealers-range-cbdr-ict/
[NNT]: https://nononsensetrader.com/inner-circle-trader-notes/
[MQL5]: https://www.mql5.com/en/code/77641
