export const meta = {
  name: 'ict-model-selection',
  description: 'Research ICT models for intraday M15-H1 forex, fact-check, write and attack an implementable rule spec, plus build-feasibility facts',
  phases: [
    { title: 'Research', detail: '7 agents: ICT models, bias, independent evidence, data feeds, iPhone/MT5 stack' },
    { title: 'Verify', detail: 'adversarial fact-check of each ICT research report' },
    { title: 'Spec', detail: 'choose up to 3 models and write the mechanical spec' },
    { title: 'Attack', detail: '3 lenses try to break the spec' },
    { title: 'Finalise', detail: 'revise the spec against the attacks' },
  ],
}

const DIR = 'fxdesk/research/reports'

const COMMON = `You are a research agent on a private project. Today is 10 November 2026. You are working in the git repo at /home/user/cafe-practice (your current directory).
TOOLS: FIRST call ToolSearch with query "select:WebSearch" to load web search. Also try ToolSearch "select:WebFetch"; if a fetch tool exists, use it to read pages in full, otherwise rely on search results. Do NOT use any GitHub MCP tools. Do NOT run git commands that change anything. Do NOT edit any file other than the single output file you are told to write.

THE PROJECT. The owner (UK, non-technical; he has explicitly asked never to be sugar-coated) wants a private web app for his iPhone that watches live forex prices and tells him BUY / SELL / NO TRADE using the methodology of ICT (Inner Circle Trader, Michael J. Huddleston). He copies each trade by hand into the MetaTrader 5 iPhone app, on a DEMO account first; live money only after the demo record earns it.
Decisions the owner has already made:
- Intraday style: context on Daily / H4 / H1, entries on the M15 chart, trades held for hours. Trades are placed by hand, so a pending limit order with stop-loss and take-profit attached is the ideal entry type.
- Alerts arrive by Telegram, at any UK hour on weekdays.
- Later live stake about GBP 500. Risk rails: 1% of the account per trade, at most 2 trades a day, stop for the day after -2%, a stop-loss and take-profit attached to every order, no martingale, grid or averaging down.
- Forex pairs (the majors); the app suggests which pair currently has a setup.

WHAT IS ALREADY KNOWN - read these files first and do not redo their work:
- docs/ICT_STRATEGY_DIGEST.md - our August 2026 digest of ICT's 2016-2024 teaching: mechanical definitions, ambiguities, contradictions, and the evidence picture.
- docs/PHASE2_RESULTS.md and docs/FINAL_VERDICT.md - our honest backtests. The 1-minute Silver Bullet on EURUSD FAILED out of sample (-0.32R per trade, profit factor 0.44). Diagnosed causes: stops of about 4 pips were too tight against about 1.4 pips of round-trip cost, and targets were too far for the time window. Daily Turtle Soup and Donchian trend following also failed.
The lesson shaping this round: a 1-minute model died on cost geometry. An M15-entry model has stops several times wider, which removes that particular killer - but nothing yet shows any ICT model is profitable. Supply facts, not encouragement. Separate what ICT actually said from community reconstruction, and separate verified facts from inference.`

const RESEARCH_SCHEMA = {
  type: 'object',
  required: ['report_path', 'summary', 'key_claims', 'gaps'],
  properties: {
    report_path: { type: 'string', description: 'Path of the markdown report file you wrote' },
    summary: { type: 'string', description: 'The findings that matter most, 250-400 words, plain prose' },
    key_claims: {
      type: 'array',
      items: {
        type: 'object',
        required: ['claim', 'source', 'confidence'],
        properties: {
          claim: { type: 'string' },
          source: { type: 'string', description: 'URL or video/tweet reference' },
          confidence: { type: 'string', enum: ['primary-verified', 'secondary', 'snippet-only', 'inference'] },
        },
      },
    },
    gaps: { type: 'string', description: 'What you could not establish' },
    report: { type: 'string', description: 'ONLY if you were unable to write the file: the full report here. Otherwise omit.' },
  },
}

const VERIFY_SCHEMA = {
  type: 'object',
  required: ['factcheck_path', 'verdicts', 'overall'],
  properties: {
    factcheck_path: { type: 'string' },
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['claim', 'status', 'note'],
        properties: {
          claim: { type: 'string' },
          status: { type: 'string', enum: ['confirmed', 'corrected', 'unverified', 'refuted'] },
          note: { type: 'string', description: 'Evidence, and the corrected statement if status is corrected or refuted' },
        },
      },
    },
    overall: { type: 'string', description: 'How far the report can be trusted, in 2-4 sentences' },
  },
}

function researchPrompt(t) {
  return `${COMMON}

YOUR TOPIC: ${t.title}
WebSearch budget: at most ${t.searches} calls. Plan them before you start.

${t.brief}

OUTPUT. Write a full markdown report to ${DIR}/${t.key}.md (create it; the folder exists). Cite a source URL beside every factual claim, and mark each as PRIMARY (ICT's own words or an official document), SECONDARY (a transcript archive or reputable write-up quoting it), SNIPPET (seen only in a search extract) or INFERENCE (yours). End the report with a "What I could not establish" section. Then return the structured result: the report path, a 250-400 word summary of what matters most, the 8-15 claims a rule specification or build would lean on hardest, and the gaps.`
}

function verifyPrompt(t) {
  return `${COMMON}

YOU ARE AN ADVERSARIAL FACT-CHECKER. Another agent wrote the report at ${DIR}/${t.key}.md on the topic: ${t.title}. Read it in full.
WebSearch budget: at most 8 calls.
1. Pick the 8-10 claims a trading-rule specification would lean on hardest: rules attributed to ICT, clock times, pip or percentage figures, statistics, and claims about evidence.
2. For each, try to confirm or refute it from an independent source, preferring ICT's own words or an official document. Check especially for (a) community inventions attributed to ICT, (b) numbers quoted without a source, (c) era mix-ups between his 2016, 2022, 2023 and 2024+ teaching, (d) evidence claims that came from vendors.
3. Default to "unverified" whenever you cannot confirm. Do not be generous.
Write your findings to ${DIR}/${t.key}-factcheck.md (one section per claim: the claim, status, evidence, corrected wording if needed). Return the structured verdicts and an overall trust statement.`
}

const TOPICS = [
  {
    key: 'ict-own-ranking', verify: true, searches: 12,
    title: "Which model does ICT himself present as his best, and what has he taught since 2024?",
    brief: `1. Collect ICT's own statements (video, tweet, date) that rank or recommend models: the 2022 Mentorship model, the Silver Bullet, "One Trading Setup For Life", the Unicorn, the London-open Judas swing, Optimal Trade Entry, the Market Maker Buy/Sell Models, Power of Three, and any numbered Charter models. Which does he call the one to learn first, the most reliable, or the one he would keep if he could keep only one?
2. What is NEW in 2025 and 2026 - new mentorship series, lectures on his YouTube channel, posts from @I_Am_The_ICT on X, changes of emphasis, new daily-bias teaching, new named models? Our digest stops at August 2024.
3. For each named model: the market and timeframe he demonstrates it on, whether he says it applies to forex, its session or time window, and how much discretion it needs.
4. Rank the models for FIT with this project (forex majors, D1/H4/H1 context, M15 entry, held for hours, placed by hand as a pending order). Keep that ranking separate from how ICT ranks them.
5. His own verified or unverified performance record since our digest (2024 Robbins Cup onwards), in two or three sentences.`,
  },
  {
    key: 'forex-native-models', verify: true, searches: 12,
    title: "ICT's forex-native intraday models in mechanical detail",
    brief: `Document, step by step: (a) the London Open killzone trade / Judas swing off the Asian range - including his Asian range, CBDR (central bank dealers range) and Flout definitions, standard-deviation projections, and exact New York clock times by era; (b) the New York session forex killzone (7:00-10:00 ET) with Optimal Trade Entry (62-79% retracement); (c) the London Close trade; (d) Power of Three (accumulation, manipulation, distribution) and his weekly profiles, as they frame intraday forex trades; (e) the stop and target sizes in pips he actually states for forex (find and source the real figures - minimum range, typical stop, "aim for N pips"); (f) which pairs he says to trade and his remarks on EURUSD, GBPUSD, the dollar index and correlated pairs.
For each model: the rules in order, which parts are ICT's own words versus community reconstruction, what is left to discretion, how the daily bias is decided, and every ambiguity a programmer would have to resolve. Finish with a table comparing the models on: trades per week per pair, typical stop in pips, typical reward-to-risk, and how well the entry suits a hand-placed pending order from an M15 chart.`,
  },
  {
    key: 'model2022-m15', verify: true, searches: 12,
    title: "The 2022 model and its descendants on M15-H1 forex, and how they are mechanised",
    brief: `(a) The 2022 Mentorship sequence run on higher intraday timeframes: H4/H1 draw on liquidity, M15 liquidity sweep, M15 market-structure shift with displacement, M15 fair-value-gap limit entry, stop beyond the swept extreme, target at opposing liquidity. Did ICT himself show it on M15/H1 or on forex? (b) "One Trading Setup For Life" (2023): its exact rules - which session highs and lows count as liquidity, which windows, what triggers entry. (c) The Unicorn (breaker block overlapping a fair value gap): exact definition. (d) Inversion fair-value-gap entries. (e) How open-source code mechanises these: the Python library joshyattridge/smart-money-concepts, widely used TradingView scripts (LuxAlgo Smart Money Concepts, ICT killzone and pivot scripts), MQL5 Expert Advisors. Record their concrete numeric defaults (swing length, minimum gap size, sweep rules) and their known repaint or lookahead traps (swing points confirmed N bars late, pivots that use future bars). (f) What stop distance, target distance and trades per week practitioners actually report for M15 forex.
End with a table of EVERY decision a programmer must make to implement (a), listing the options seen in the wild for each and which is closest to ICT's own wording.`,
  },
  {
    key: 'independent-evidence', verify: true, searches: 14,
    title: "Independent evidence (2023-2026) on ICT / Smart Money Concepts components in intraday forex",
    brief: `Find methodologically described evidence on whether these have predictive value on intraday FOREX at M15-H1: fair-value-gap fills and FVG entries; order blocks; liquidity-sweep reversals at previous-day and session highs and lows; fading versus following an Asian-range break in London; London and New York open effects; time-of-day return patterns. Include academic work (SSRN, arXiv, journals), quant blogs that publish code and cost assumptions, GitHub backtests, broker or exchange research, and NEGATIVE results. For each: instrument, timeframe, sample period, costs modelled, in-sample versus out-of-sample discipline, result.
Then answer: (1) which components have ANY credible support; (2) what expectancy and profit-factor range an honest person should expect; (3) typical all-in retail costs on the majors in 2026 - spread plus commission, in pips, on a raw-spread account and on a standard account - and the minimum stop distance that keeps round-trip cost under about 10% of the risk; (4) the standard ways such backtests fool people: repainting pivots, bar-close assumptions, spreads at news and at the 5pm New York rollover, multiple testing, cherry-picked pairs or years.`,
  },
  {
    key: 'daily-bias', verify: true, searches: 12,
    title: "Mechanical daily-bias rules in ICT's teaching",
    brief: `The daily bias decides whether we look for buys or sells and is the most discretionary part of his method. Research every mechanical or near-mechanical bias rule ICT has taught: previous-day high/low logic (a close beyond it implies continuation; a sweep that closes back inside implies a move toward the opposite side); candle-range and three-candle daily logic; premium and discount of a dealing range; the midnight (00:00 New York) and 8:30 opening-price rules; weekly profiles and day-of-week tendencies; choosing the draw on liquidity; SMT divergence between correlated pairs; dollar-index confirmation; seasonal and quarterly tendencies; and anything he taught on bias in 2024-2026.
For each: the rule in if/then form, the source, and any independent statistics (for example, how often a daily close above the previous day's high is followed by a higher high on FX majors; previous-day high/low sweep statistics).
End with THREE candidate bias procedures that are fully computable from closed D1 / H4 / H1 bars, ordered by fidelity to ICT, each with an honest note on what it loses compared with his discretionary practice, and each written precisely enough to code.`,
  },
  {
    key: 'data-feeds', verify: false, searches: 14,
    title: "Build facts: live forex data, economic calendar, and historical data",
    brief: `Verify from official documentation and pricing pages as they stand in November 2026, not from memory.
1. Real-time or near-real-time FOREX candle APIs a server can poll every 5-15 minutes for 8-10 pairs on M15/H1/H4/D1: Twelve Data, Finnhub, Alpha Vantage, TraderMade, FCS API, Polygon (Massive), Tiingo, OANDA v20 REST with a practice account, Financial Modeling Prep, and any better option you find. For each: free-tier limits (calls or credits per minute and per day), whether intraday forex is real-time or delayed on the free tier, whether one call can return several symbols, bid/ask versus mid prices, history depth per call, licence terms for personal non-display use, and the cheapest paid tier in GBP. Work out explicitly whether each free tier supports 8 pairs of M15 candles polled every 5 minutes, 24 hours a day, 5 days a week. Recommend a primary and a fallback.
2. Free economic-calendar feeds with impact ratings and currency codes: the ForexFactory weekly JSON at nfs.faireconomy.media/ff_calendar_thisweek.json (its terms and rate limits), Finnhub, Financial Modeling Prep, Trading Economics, others.
3. Free HISTORICAL M1 or M15 forex data from 2015 to late 2026 for the seven majors, for backtesting: HistData.com (file format, timezone, bid or mid, how downloads work, whether 2025-2026 months are available), Dukascopy, the FX-Data GitHub archives (which pairs and years exist), Twelve Data history limits. State each source's timezone and daylight-saving convention and its known quality problems.`,
  },
  {
    key: 'iphone-mt5-stack', verify: false, searches: 14,
    title: "Build facts: MT5 on iPhone, iOS web apps, Telegram, Supabase and Netlify",
    brief: `Verify as of November 2026, from official documentation where possible.
1. MetaTrader 5 for iPhone: does it expose ANY URL scheme, deep link or universal link that a web page can use to open the app, open a given symbol or chart, or pre-fill a new order (search MetaQuotes documentation and forums for metatrader5://, mt5://, URL scheme, x-callback-url)? What exactly are the taps and fields to place a pending Buy Limit or Sell Limit with stop-loss, take-profit and expiry in the current iOS app - field names, whether stop-loss and take-profit are typed as prices, whether pasting from the clipboard works? Current limits of MT5 on iOS (Expert Advisors, custom indicators, price alerts).
2. iOS Safari and Home Screen web apps on iOS 26 and iOS 27: writing to the clipboard on tap, web push notifications, background limits, anything that changed.
3. Telegram Bot API: creating a bot with BotFather, finding the chat id, sending a message with a button that opens a web page, rate limits.
4. Supabase free plan today: number of free projects, pausing after inactivity, Edge Function invocation and runtime limits, scheduling an Edge Function every 1-5 minutes with Cron (pg_cron and pg_net), database size, how secrets are stored.
5. Netlify free plan today: scheduled functions, limits, the credits model.
6. Briefly: any UK regulatory issue with a person building a private signal tool for their own account (not selling signals to others)?
Recommend the simplest reliable architecture for: a scan every 5 minutes, setup detection, storage, a Telegram alert, and a phone web page showing the trade ticket with tap-to-copy values.`,
  },
]

phase('Research')
const research = await pipeline(
  TOPICS,
  (t) => agent(researchPrompt(t), { label: `research:${t.key}`, phase: 'Research', schema: RESEARCH_SCHEMA }),
  (r, t) => {
    if (!r) return null
    if (!t.verify) return { key: t.key, research: r, verify: null }
    return agent(verifyPrompt(t), { label: `verify:${t.key}`, phase: 'Verify', schema: VERIFY_SCHEMA })
      .then((v) => ({ key: t.key, research: r, verify: v }))
  },
)

const done = research.filter(Boolean)
const missing = TOPICS.filter((t, i) => !research[i]).map((t) => t.key)
if (missing.length) log(`Research topics that returned nothing: ${missing.join(', ')}`)
log(`${done.length}/${TOPICS.length} research topics complete`)

const digest = done.map((d) => `### ${d.key}\nSUMMARY: ${d.research.summary}\nGAPS: ${d.research.gaps}\nFACT-CHECK: ${d.verify ? d.verify.overall + ' | corrections: ' + d.verify.verdicts.filter((v) => v.status !== 'confirmed').map((v) => `[${v.status}] ${v.claim} -> ${v.note}`).join(' ; ') : 'not fact-checked (build facts)'}`).join('\n\n')

const SPEC_SCHEMA = {
  type: 'object',
  required: ['spec_path', 'models', 'rejected', 'open_questions'],
  properties: {
    spec_path: { type: 'string' },
    models: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'name', 'why_chosen', 'summary', 'expected_trades_per_month', 'typical_stop_pips', 'configs'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          why_chosen: { type: 'string' },
          summary: { type: 'string', description: 'The whole algorithm in 5-8 sentences' },
          expected_trades_per_month: { type: 'string' },
          typical_stop_pips: { type: 'string' },
          configs: { type: 'integer', description: 'Number of pre-registered configurations for this model' },
        },
      },
    },
    rejected: { type: 'array', items: { type: 'object', required: ['name', 'reason'], properties: { name: { type: 'string' }, reason: { type: 'string' } } } },
    open_questions: { type: 'array', items: { type: 'string' } },
    changes: { type: 'array', items: { type: 'string' }, description: 'Final revision only: what changed from the draft and why' },
  },
}

const SPEC_RULES = `REQUIREMENTS FOR THE SPECIFICATION (every one is mandatory):
A. At most THREE candidate models. Selection criteria: ICT presents it as a core model and it applies to forex; it is natural with D1/H4/H1 context and M15 entries; the entry can be placed by hand as a pending order with at least 10 minutes of tolerance; the stop is normally at least 10 times the round-trip cost on a major pair; the universe should yield roughly 100+ trades over 3 years so that a verdict is statistically possible; any independent support counts in its favour. List the models you rejected and why.
B. Inputs: M15 bars per pair (bid open/high/low/close plus mean spread per bar), from which H1, H4 and D1 bars are built. State the day boundary (17:00 New York is the forex convention) and that every clock rule is in America/New_York with daylight saving handled.
C. Every rule must be computable from CLOSED bars only, at the moment the bar closes. No rule may use information from a later bar. Swing points must state exactly how many bars after the swing they become known. Write each model as numbered steps a programmer can implement without asking a question, including tie-breaks.
D. Cover, for each model: universe and pip sizes; the daily-bias procedure; which liquidity pools qualify; the sweep definition; the market-structure-shift and displacement definition; the fair-value-gap (or other entry zone) definition and minimum size; order type, entry price and expiry; stop; target; trade management simple enough to do by hand (at most one partial and one stop move, each announced by an alert); cancellation rules; news filter; session windows in New York time; daily trade cap and correlated-pair exposure rule.
E. Tag every parameter ICT-VERBATIM, COMMUNITY or OURS, with its default value. A parameter may list at most two alternative values, and the total number of pre-registered configurations per model must not exceed 12. The Silver Bullet failure was partly selection noise from about 290 configurations - do not repeat it.
F. Manual-execution realism: the alert fires at bar close and the owner needs time to copy it. The backtest must assume the order is live only from 3 minutes after the signal bar closes; if price has already traded through the entry before then, the trade is recorded as MISSED and not counted as a fill.
G. Backtest protocol proposal: cost model per pair (spread from data plus slippage plus commission); pessimistic intrabar resolution (if one bar touches both stop and target, the stop is assumed hit first; limit fills require price to trade through the level by at least the spread); the data split (the years 2021 to mid-2022 were already used as out-of-sample for the Silver Bullet family, so the final verdict set must be data never touched before - propose mid-2023 onward); an eligibility rule fixed in advance (minimum trades, positive expectancy after costs, profit factor floor, a rolling-window stability test, maximum drawdown); and how multiple testing is accounted for.
H. Risk rails as fixed constants: 1% risk per trade, at most 2 trades per day, stop for the day at -2%, stop-loss and take-profit attached to every order, no martingale or averaging.
I. The alert contract: the exact fields a Telegram alert and the on-screen ticket must carry (pair, direction, order type, entry price, stop price, take-profit price, lot size for a given balance, expiry time in UK time, the reasons in one line each, and the model's tested record).
J. Plain language. Define each term on first use. Mark anything that is our engineering decision rather than ICT's teaching.`

phase('Spec')
const draft = await agent(`${COMMON}

YOU ARE THE SPECIFICATION AUTHOR. Read in full: docs/ICT_STRATEGY_DIGEST.md, docs/PHASE2_RESULTS.md, docs/FINAL_VERDICT.md, and every file in ${DIR}/ (the research reports and their -factcheck.md companions; where a fact-check corrects a report, the fact-check wins). You may make up to 3 WebSearch calls to settle a specific point.

Condensed view of the research (the files are the authority):
${digest}

TASK: choose the ICT models to put through an honest backtest and write an implementable, pre-registration-grade specification to fxdesk/research/SPEC_DRAFT.md.

${SPEC_RULES}

Return the structured summary: the spec path, the chosen models, the rejected models with reasons, and open questions for the owner (only ones that genuinely need a human decision).`, { label: 'spec:draft', phase: 'Spec', schema: SPEC_SCHEMA })

if (!draft) {
  return { research: done, draft: null, attacks: [], final: null, error: 'spec author returned nothing' }
}

const ATTACK_SCHEMA = {
  type: 'object',
  required: ['report_path', 'verdict', 'findings'],
  properties: {
    report_path: { type: 'string' },
    verdict: { type: 'string', enum: ['sound', 'fixable', 'broken'] },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['severity', 'where', 'problem', 'fix'],
        properties: {
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          where: { type: 'string', description: 'Model id and section or step number' },
          problem: { type: 'string' },
          fix: { type: 'string', description: 'The exact replacement wording or rule' },
        },
      },
    },
  },
}

const LENSES = [
  {
    key: 'lookahead',
    brief: `LENS: LOOKAHEAD, REPAINTING AND IMPLEMENTABILITY. Walk every numbered step of every model as if you were coding it bar by bar. For each, ask: at the instant this decision is made, has every input bar closed? Is any swing point, session extreme, daily bar or gap used before it is knowable? Are the H1/H4/D1 bars used only once complete? Could two programmers implement this step differently - if so, name the ambiguity and write the unambiguous version. Check tie-breaks, simultaneous signals on several pairs, orders spanning the 17:00 New York rollover and the weekend, daylight-saving changes, and the 3-minute manual-placement delay. Check the backtest protocol for leakage between the calibration, validation and verdict sets.`,
  },
  {
    key: 'fidelity',
    brief: `LENS: FIDELITY TO ICT. For every rule and parameter, check the tag against docs/ICT_STRATEGY_DIGEST.md and the research reports and fact-checks in ${DIR}/. Is anything tagged ICT-VERBATIM that is really community reconstruction or our invention? Is any era of his teaching blended with another without saying so? Would a serious ICT student recognise each model as his, or has mechanisation removed something he treats as essential (draw on liquidity, time of day, displacement, premium and discount)? Are the session windows the right ones for FOREX rather than index futures? Where the spec departs from ICT, is the departure declared and justified? You may make up to 4 WebSearch calls.`,
  },
  {
    key: 'costs-stats',
    brief: `LENS: COST GEOMETRY, STATISTICS AND MANUAL EXECUTION. (1) For each model and pair, estimate the typical stop distance in pips and the round-trip cost as a share of risk, using realistic 2026 retail costs; flag any pair or model where cost exceeds about 10% of risk, and any rule likely to recreate the Silver Bullet failure (stops too tight, targets unreachable in the holding time). (2) Estimate trades per year; is the verdict sample large enough to distinguish an edge from luck - show the arithmetic for the sample needed at a plausible win rate and reward-to-risk. (3) Count the pre-registered configurations across all models and say what false-positive rate the eligibility rule implies; propose a tighter rule if needed. (4) Is the data split honest? (5) Can a person really execute this by hand from Telegram alerts at any UK hour - pending-order expiry, stop moves, alerts at 3am, two trades a day, correlated pairs? (6) Is the pessimistic fill model pessimistic enough for hand-placed limit orders? You may make up to 4 WebSearch calls.`,
  },
]

phase('Attack')
const attacks = (await parallel(LENSES.map((l) => () => agent(`${COMMON}

YOU ARE AN ADVERSARIAL REVIEWER of the draft specification at fxdesk/research/SPEC_DRAFT.md. Read it in full, plus the files it relies on. Your job is to find what is wrong with it, not to praise it.

${l.brief}

For context, these were the mandatory requirements given to the author:
${SPEC_RULES}

Write your full review to ${DIR}/attack-${l.key}.md and return the structured findings. For every finding give the exact replacement wording or rule, not a general suggestion.`, { label: `attack:${l.key}`, phase: 'Attack', schema: ATTACK_SCHEMA })))).filter(Boolean)

log(`${attacks.length}/3 attack reviews returned; ${attacks.reduce((n, a) => n + a.findings.filter((f) => f.severity === 'high').length, 0)} high-severity findings`)

phase('Finalise')
const final = await agent(`${COMMON}

YOU ARE THE FINAL SPECIFICATION EDITOR. Read fxdesk/research/SPEC_DRAFT.md and the three adversarial reviews at ${DIR}/attack-lookahead.md, ${DIR}/attack-fidelity.md and ${DIR}/attack-costs-stats.md (some may be missing if a reviewer failed).

Write the final specification to fxdesk/research/SPEC_FINAL.md. Resolve every high and medium finding: either apply the fix, or state in a "Findings not applied" appendix exactly why not. If the reviews show a model cannot be made sound, drop it and say so - one well-specified model is better than three shaky ones. Keep the total pre-registered configurations at or below 12 per model. The final document must stand alone: a programmer who has read nothing else must be able to implement each model and the backtest protocol from it.

The mandatory requirements still apply:
${SPEC_RULES}

Return the structured summary, including a "changes" list of what changed from the draft and why.`, { label: 'spec:final', phase: 'Finalise', schema: SPEC_SCHEMA })

return {
  research: done.map((d) => ({
    key: d.key,
    report_path: d.research.report_path,
    summary: d.research.summary,
    gaps: d.research.gaps,
    wrote_file: !d.research.report,
    report_fallback: d.research.report || null,
    factcheck: d.verify ? { overall: d.verify.overall, not_confirmed: d.verify.verdicts.filter((v) => v.status !== 'confirmed') } : null,
  })),
  missing,
  draft,
  attacks: attacks.map((a) => ({ report_path: a.report_path, verdict: a.verdict, high: a.findings.filter((f) => f.severity === 'high'), medium_count: a.findings.filter((f) => f.severity === 'medium').length })),
  final,
}
