export const meta = {
  name: 'ict-spec',
  description: 'Two independent spec authors, three adversarial reviews, one final editor: the pre-registered ICT rulebook',
  phases: [
    { title: 'Draft', detail: 'two authors with different priors write competing specifications' },
    { title: 'Attack', detail: '3 lenses try to break both drafts' },
    { title: 'Finalise', detail: 'editor selects, merges and fixes into SPEC_FINAL.md' },
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
- fxdesk/research/reports/measured-base-rates.md - OUR OWN MEASUREMENTS on 2015-2019 prices of ICT's session claims (how often London sets the day's high or low, what happens after an Asian-range sweep, whether New York continues London, previous-day high/low logic). Where a quoted statistic conflicts with these, ours win.
The lesson shaping this round: a 1-minute model died on cost geometry. An M15-entry model has stops several times wider, which removes that particular killer - but nothing yet shows any ICT model is profitable. Supply facts, not encouragement. Separate what ICT actually said from community reconstruction, and separate verified facts from inference.`

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


const SPEC_RULES = `REQUIREMENTS FOR THE SPECIFICATION (every one is mandatory):
A. At most TWO candidate models (a third only if you can show it is clearly distinct and well supported). Selection criteria: ICT presents it as a core model and it applies to forex; it is natural with D1/H4/H1 context and M15 entries; the entry can be placed by hand as a pending order with at least 10 minutes of tolerance; the stop is normally at least 10 times the round-trip cost on a major pair; the universe should yield roughly 100+ trades over 3 years so that a verdict is statistically possible; our own measured base rates (${DIR}/measured-base-rates.md) and any independent evidence count for or against it. List the models you rejected and why.
B. Inputs available: M15 bars per pair built from one-minute BID data for EURUSD, GBPUSD, USDJPY, AUDUSD, USDCAD, USDCHF, NZDUSD, 1 Jan 2015 to 6 Nov 2026. H1 bars are built on the clock; H4 and D1 bars are anchored to 17:00 New York (five daily bars a week). No volume, no order flow, no dollar-index series (a proxy may be defined from the pairs if you need one). Every clock rule is in America/New_York with daylight saving handled.
C. Every rule must be computable from CLOSED bars only, at the moment the bar closes. No rule may use information from a later bar. Swing points must state exactly how many bars after the swing they become known. Write each model as numbered steps a programmer can implement without asking a question, including tie-breaks.
D. Cover, for each model: universe and pip sizes; the daily-bias procedure; which liquidity pools qualify; the sweep definition; the structure-shift and displacement definition (if used); the entry zone definition and minimum size; order type, entry price and expiry; stop; target; trade management simple enough to do by hand; cancellation rules; news filter; session windows in New York time; daily trade cap and correlated-pair exposure rule.
E. Tag every parameter ICT-VERBATIM, COMMUNITY or OURS, with its default value. A parameter may list at most two alternative values, the pre-registered configurations per model must not exceed 8, and the total across all models must not exceed 16. The Silver Bullet failure was partly selection noise from about 290 configurations - do not repeat it.
F. Manual-execution realism: the alert fires at bar close and the owner needs time to copy it. The backtest assumes the order is live only from 3 minutes after the signal bar closes; if price has already traded through the entry before then, the trade is recorded as MISSED and not counted.
G. Backtest protocol: cost model per pair; pessimistic intrabar resolution; the data split (2021 to mid-2022 was already used as out-of-sample for the Silver Bullet family, so the final verdict set must be data never touched - propose mid-2023 onward; 2015-2019 has been looked at descriptively for base rates only); an eligibility rule fixed in advance (minimum trades, positive expectancy after costs under BOTH the raw and standard cost models, profit-factor floor, rolling-window stability, maximum drawdown); and how multiple testing is accounted for.
H. Risk rails as fixed constants: 1% risk per trade, at most 2 filled trades per trading day, stop for the day at -2%, stop-loss and take-profit attached to every order, one position per pair, no two positions that double the same currency exposure, no martingale or averaging.
I. The alert contract: the exact fields a Telegram alert and the on-screen ticket must carry (pair, direction, order type, entry price, stop price, take-profit price, lot size for a given balance, expiry in UK time, the reasons in one line each, and the model's tested record).
J. Plain language. Define each term on first use. Mark anything that is our engineering decision rather than ICT's teaching.
K. FEED ROBUSTNESS (read ${DIR}/measured-feed-differences.md - these are measured facts). No rule may turn on a sub-pip or one-tick event: every sweep, break or gap must clear its level by a stated margin in whole pips (a parameter tagged OURS). No level, swing, gap, sweep or stop reference may be taken from a candle between 16:55 and 18:05 New York. Prices in an alert are rounded to whole pips. The protocol must include a feed-noise test (re-run with each candle's high and low jittered by realistic noise) and say how much degradation disqualifies a model.
L. BOUNDED LOOKBACK. The live scanner holds only a rolling window of recent candles. State, per model, the maximum history any rule needs (in trading days), and make sure no rule's output depends on anything older, so the live scanner and the backtest produce identical signals.
M. WHAT THE SIMULATOR SUPPORTS (specify nothing it cannot do): limit, stop and market orders at MT5 order prices with bid/ask handled; one take-profit, or one partial (a first target closing a stated fraction) followed by an optional move of the stop to the entry price that takes effect 5 minutes after the partial; an expiry time; cancel-if-price-reaches levels; an optional time exit. The account is GBP 500 with 0.01 minimum lot: 1% is about GBP 5, so on EURUSD a stop wider than about 60 pips cannot be sized at all (the trade is skipped), and a position can only be split in two when the stop is under about 32 pips. Prefer a single exit.
N. NEWS FILTER must be backtestable: define it from a rule-based schedule plus a fixed list of dates the programmer can obtain (say exactly which releases, and where the historical dates come from per ${DIR}/data-feeds.md), and separately how the live app gets the same events.
O. HONESTY. Nothing in the document may imply the model is profitable. State plainly what the backtest could conclude and what it could not.`

const AUTHORS = [
  { key: 'A', label: 'fidelity-first', prior: `YOUR PRIOR: FIDELITY FIRST. The owner asked for ICT's method. Start from the models ICT himself wrote down for FOREX with stated stops, targets and order types (see ${DIR}/forex-native-models.md and ${DIR}/ict-own-ranking.md) and mechanise them as faithfully as the evidence allows. Depart from his wording only where a rule cannot be computed or where requirement K or C forces it, and say so each time.` },
  { key: 'B', label: 'evidence-first', prior: `YOUR PRIOR: EVIDENCE FIRST. Start from what our own measurements (${DIR}/measured-base-rates.md, ${DIR}/measured-feed-differences.md) and the independent evidence (${DIR}/independent-evidence.md) actually support, and from the cost geometry. Choose the ICT models and components with the best honest chance of surviving costs, drop ICT elements the measurements contradict (and say so), but keep each model recognisably ICT: liquidity, time of day and his entry logic must remain the spine. A model that an ICT student would not recognise is out of scope.` },
]

phase('Draft')
const drafts = (await parallel(AUTHORS.map((a) => () => agent(`${COMMON}

YOU ARE A SPECIFICATION AUTHOR (author ${a.key}). Another author is writing a competing specification from a different prior; an editor will take the best of both. Read in full: docs/ICT_STRATEGY_DIGEST.md, docs/PHASE2_RESULTS.md, docs/FINAL_VERDICT.md, and EVERY file in ${DIR}/ (research reports, their -factcheck.md companions, and the two measured-*.md files; where a fact-check corrects a report, the fact-check wins; where a quoted statistic conflicts with our measurements, ours win). You may make up to 3 WebSearch calls to settle a specific point.

${a.prior}

TASK: choose the ICT models to put through an honest backtest and write an implementable, pre-registration-grade specification to fxdesk/research/SPEC_DRAFT_${a.key}.md.

${SPEC_RULES}

Return the structured summary: the spec path, the chosen models, the rejected models with reasons, and open questions for the owner (only ones that genuinely need a human decision).`, { label: `spec:draft-${a.label}`, phase: 'Draft', schema: SPEC_SCHEMA })))).map((d, i) => (d ? { ...d, author: AUTHORS[i].key } : null)).filter(Boolean)

if (!drafts.length) return { drafts: [], attacks: [], final: null, error: 'no draft was produced' }
const draftList = drafts.map((d) => `fxdesk/research/SPEC_DRAFT_${d.author}.md`).join(' and ')

phase('Attack')
const attacks = (await parallel(LENSES.map((l) => () => agent(`${COMMON}

YOU ARE AN ADVERSARIAL REVIEWER of the draft specifications at ${draftList}. Read each in full, plus the files they rely on (docs/ICT_STRATEGY_DIGEST.md and everything in ${DIR}/). Your job is to find what is wrong, not to praise. Review EVERY draft; in each finding say which draft and which model it concerns. Also say, for your lens, which draft's version of each model is the sounder starting point.

${l.brief}

For context, these were the mandatory requirements given to the authors:
${SPEC_RULES}

Write your full review to ${DIR}/attack-${l.key}.md and return the structured findings. For every finding give the exact replacement wording or rule, not a general suggestion.`, { label: `attack:${l.key}`, phase: 'Attack', schema: ATTACK_SCHEMA })))).filter(Boolean)

log(`${attacks.length}/3 attack reviews returned; ${attacks.reduce((n, a) => n + a.findings.filter((f) => f.severity === 'high').length, 0)} high-severity findings`)

phase('Finalise')
const final = await agent(`${COMMON}

YOU ARE THE FINAL SPECIFICATION EDITOR. Read the competing drafts at ${draftList} and the adversarial reviews at ${DIR}/attack-lookahead.md, ${DIR}/attack-fidelity.md and ${DIR}/attack-costs-stats.md (some may be missing if a reviewer failed). Read the measured-*.md files in ${DIR}/ too.

Write the final specification to fxdesk/research/SPEC_FINAL.md. For each model keep the sounder draft's version and graft in what the other got right. Resolve every high and medium finding: either apply the fix, or state in a "Findings not applied" appendix exactly why not. If the reviews show a model cannot be made sound, drop it and say so - one well-specified model is better than two shaky ones. At most two models (a third only if clearly distinct and well supported), at most 8 pre-registered configurations per model and 16 in total. The final document must stand alone: a programmer who has read nothing else must be able to implement each model and the backtest protocol from it, and every numbered step must be unambiguous.

The mandatory requirements still apply:
${SPEC_RULES}

Return the structured summary, including a "changes" list of the main decisions you made between the drafts and why.`, { label: 'spec:final', phase: 'Finalise', schema: SPEC_SCHEMA })

return {
  drafts,
  attacks: attacks.map((a) => ({ report_path: a.report_path, verdict: a.verdict, high: a.findings.filter((f) => f.severity === 'high'), medium_count: a.findings.filter((f) => f.severity === 'medium').length })),
  final,
}
