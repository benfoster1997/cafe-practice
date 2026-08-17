export const meta = {
  name: 'strategy-fork',
  description: 'After 8 concept kills: adversarially analyse the strategic paths forward, including abandoning the SaaS goal',
  phases: [
    { title: 'Paths', detail: '5 agents: one per strategic path, each argued and stress-tested' },
    { title: 'Critic', detail: 'completeness critic — what path or fact is missing' },
  ],
}

const SCHEMA = {
  type: 'object',
  required: ['report', 'key_claims', 'verdict', 'odds'],
  properties: {
    report: { type: 'string', description: 'Detailed findings in markdown, sources cited inline' },
    key_claims: { type: 'array', items: { type: 'object', required: ['claim', 'source'], properties: { claim: { type: 'string' }, source: { type: 'string' } } } },
    verdict: { type: 'string', description: 'VIABLE / CONDITIONAL / DEAD for this path, with the single decisive reason' },
    odds: { type: 'string', description: 'Honest probability this path reaches £2,335/month within 24 months for THIS founder, with reasoning. Numbers, not adjectives.' },
    first_90_days: { type: 'string', description: 'If viable/conditional: exactly what the owner does in the first 90 days, concretely' },
    gaps: { type: 'string' },
  },
}

const COMMON = `You are a strategy-research agent with web access. FIRST call ToolSearch with query "select:WebSearch,WebFetch". Today is 17 August 2026. Prices in GBP. Budget ~12 WebSearch calls.

THE SITUATION (facts, not opinions):
A UK non-technical solo founder wants a software business at £2,335/month recurring (24-30 customers at £79-99). Claude writes all code, so build capacity is effectively free and unlimited. The founder has: no coding ability, no industry network ("I can't walk into any industry" — confirmed today), no existing audience, no email list, no customers, limited capital, and roughly evenings/weekends of time. Honest base rate accepted by the founder: single-digit to ~10% chance of success, 12-24 months to target.

WHAT HAS ALREADY BEEN TESTED AND FAILED — 8 concepts, 8 adversarial kills, all with receipts:
1. Landlord compliance register — 15+ AI-built clones live; NRLA free tool; government PRS Database does part of the job. Market-clearing price £0-15/mo.
2. MTD client-status board for accountants — Xero HQ free to partner firms does it.
3. AI revenue-recovery/follow-up automation — GoHighLevel + tens of thousands of white-label resellers; platforms ship it natively.
4. Party wall / surveying document workflow — SurveyorSuite £35/mo already ships it including RICS-AI compliance artefacts; 4 more tools for a ~1,000-person profession.
5. Small funeral director software — incumbent publishes £11/funeral (premise of "quote-only £400+" was false); sector regulation being rewritten; trust hostile post-scandal.
6. Martyn's Law enhanced tier — buyers are procurement organisations; exact £29/mo clone live; Home Office tells buyers to buy nothing.
7. DWTS waste-carrier capture — 10+ dedicated entrants 14 months before the mandate, one an exact clone at £39/user/mo; DEFRA ships a free portal + free spreadsheet route + an official approved-vendor list.
8. Letting-agent compliance repack — Kamma occupies the Propertymark channel and PAYS agents referral fees; CRMs absorbing it natively; free government portal on the flagship wedge.

THE STRUCTURAL DIAGNOSIS (four repeating mechanisms):
(a) SWARM — cheap AI building means any category discoverable by keyword search is cloned within months, often before the regulation bites. The search method itself was the problem: "what UK regulation is coming" is exactly the query every AI-clone builder also runs.
(b) THE STATE PRICES AT ZERO — in UK compliance, government ships free portals; associations ship free member tools.
(c) LIABILITY INVERSION — where documents carry statutory/personal liability, buyers become MORE vendor-conservative and buy incumbents, consultants, or nothing. "Liability-grade moat" is a moat for the trusted, a wall for the unknown.
(d) DISTRIBUTION IS THE BINDING CONSTRAINT — not build quality, not ideas. Cold email ≈ 0.5-2% positive reply; PECR bars cold-emailing sole traders/partnerships (~63% of UK businesses) without consent; SEO year one is dead (AI Overviews, ~69% zero-click); paid ads CAC $200-600; Product Hunt and app marketplaces are power-law losers.

YOUR JOB: analyse ONE strategic path (below). Argue it honestly — find real evidence for AND against, then give a verdict and a NUMERIC probability that THIS founder reaches £2,335/month within 24 months on this path. Do not be encouraging. Do not be defeatist either — where a path genuinely works, say why with evidence. Cite sources. Distinguish verified facts from inference. The founder has explicitly accepted brutal honesty and has been corrected on optimistic expectations before.`

phase('Paths')
const paths = await parallel([
  () => agent(`${COMMON}

YOUR PATH — P1: CHANGE THE SEARCH SPACE (non-regulatory, non-keyword pain mining).
Thesis: every dead concept came from regulation-first research, which is the most-fished pond by construction. Instead, hunt pains that are NOT publicly announced or dated — boring operational pain discoverable only by mining where practitioners complain.
INVESTIGATE:
1. Where does un-swarmed B2B pain actually surface in 2026? Evidence on mining: niche trade forums, Facebook groups, subreddit communities, industry-specific Slack/Discords, G2/Capterra 1-3 star reviews of incumbent vertical software, job adverts describing manual processes ("must be proficient in Excel to reconcile X"), franchise operations manuals, trade magazine problem pages.
2. Does this method actually produce products? Find documented cases (IndieHackers/MicroConf/Starter Story style) of UK or US micro-SaaS founders who found a winner by mining reviews/forums rather than trend/regulation news — and how long it took them. Be skeptical of survivorship-biased success stories; note failure evidence too.
3. The counter-argument: AI-clone builders in 2026 also mine reviews and forums at scale — is this space ALSO swarmed? Search for tools/services that automate opportunity discovery from Reddit/G2 (e.g. GummySearch-style tools) and assess how crowded the "find unmet SaaS need" tooling market is.
4. The killer constraint: even if a good non-regulatory pain is found, DISTRIBUTION is unchanged — the founder still has no access. Does non-regulatory pain come with better distribution (communities the founder can join and contribute to for months) or worse (invisible buyers, no register, no keyword to rank for)?
5. Concretely: name 3-5 candidate hunting grounds where a no-access founder could credibly become a known helpful presence within 90 days, and what evidence says community-led selling converts for B2B micro-SaaS.
Give VIABLE/CONDITIONAL/DEAD, numeric odds, and a concrete first-90-days.`, { label: 'path:new-search-space', phase: 'Paths', schema: SCHEMA }),

  () => agent(`${COMMON}

YOUR PATH — P2: PARTNER/CHANNEL-LED (sell through one intermediary, not to end-buyers).
Thesis: prior research found "one accountant or association with 80 clients ≈ the whole customer target". Instead of cold-selling 24-30 businesses, win 1-3 partners who already hold the trust and the client list — accountants, bookkeepers, trade associations, franchisors, consultants, industry-specific brokers — and sell through them (white-label, referral, or bundled).
INVESTIGATE:
1. Evidence base: do micro-SaaS/solo founders actually succeed via partner-led distribution? Find documented UK examples, revenue-share norms (20-30%?), and typical time-to-first-partner-revenue. Look for failure evidence too — partner channels notoriously stall ("partner signed, no leads delivered").
2. The accountant channel specifically: UK accountants' appetite for reselling/bundling software to clients in 2026; what practice-management/advisory bundling looks like; do small practices actually push tools to clients or just recommend Xero? Any evidence of white-label arrangements at micro scale?
3. Trade associations: how do UK trade bodies (small ones — not RICS/Propertymark scale) select and endorse supplier partners? Fees, exclusivity, timelines. Is an unknown solo vendor with no track record ever selected? What did it take for existing "association-endorsed" vendors to get there?
4. Franchisors as a channel: UK franchise systems (small ones, 20-200 franchisees) mandating/recommending software to franchisees — is this a real, reachable channel? How are software decisions made? Evidence of franchise-wide software rollouts sourced from unknown vendors.
5. The trust problem recursion: a partner staking their client relationships on an unknown solo vendor's software is a HIGHER trust bar than an end-buyer buying for themselves. Does anything mitigate this (revenue share, white-label so the partner's brand fronts it, pilot with a subset)?
6. Concretely: what is the realistic sequence and timeline from zero to one productive partner, and how many partner conversations does that take?
Give VIABLE/CONDITIONAL/DEAD, numeric odds, and a concrete first-90-days.`, { label: 'path:partner-led', phase: 'Paths', schema: SCHEMA }),

  () => agent(`${COMMON}

YOUR PATH — P3: SERVICE-FIRST / PRODUCTISED SERVICE (sell the outcome by hand, productise later).
Thesis: convert the distribution constraint into paid customer discovery. Sell a done-for-you service at £200-800/month where the founder + Claude do the work manually behind the curtain; learn the real workflow from paying customers; automate progressively; the software becomes the margin engine later. Note: a DWTS-specific version of this was already killed (data-entry job, PECR-blocked buyers, EWC-misclassification liability) — assess the GENERAL shape on its own merits, and be specific about which service categories work.
INVESTIGATE:
1. Evidence: documented cases of productised services becoming software businesses (or sustainable businesses in their own right) run by non-technical solo operators. What service categories actually productise? What are realistic prices and delivery hours in 2026?
2. The AI-service market in 2026: is "AI-powered done-for-you service" itself swarmed (AI automation agencies, GoHighLevel resellers, Upwork/Fiverr AI service sellers)? What is the market-clearing price and how commoditised is it?
3. Honest economics for THIS founder: at £300-600/month per client and evenings/weekends capacity, how many clients can one person actually serve? What is the realistic monthly income ceiling before automation, and does the £2,335 target arrive faster this way than via SaaS? Model it explicitly.
4. The trap to test: does a service business actually convert to software, or does it consume all the founder's time so the software never gets built? Find evidence both ways (agency-to-SaaS transitions that worked and that didn't).
5. Which service niches suit a founder with NO domain expertise and no network — where the expertise can be supplied by Claude and the barrier is only willingness to do unglamorous work? Be concrete and skeptical: name candidates and immediately attack them.
6. Client acquisition for services vs software: is selling a service to a small business actually easier for an unknown (outcome-based, no trust in a platform required, cancel anytime)? Evidence on cold outreach conversion for services vs software.
Give VIABLE/CONDITIONAL/DEAD, numeric odds, and a concrete first-90-days.`, { label: 'path:service-first', phase: 'Paths', schema: SCHEMA }),

  () => agent(`${COMMON}

YOUR PATH — P4: AUDIENCE-FIRST (build distribution before product).
Thesis: the constraint is distribution, so build distribution as the asset. Note a live fact: this founder has a PARKED YouTube project in the same repo — "Cooked Books", finance/business storytelling (frauds, collapses, fortunes), 9-12 min narrated documentaries, fully AI-produced except the founder's script sign-off and CapCut assembly (~3-4h/video); Video 1 is one script-review away from upload; honest expectation recorded there was £0 for months and £2k/month as a top-few-percent 18-36 month outcome. It was parked by the founder to pursue the app business.
INVESTIGATE:
1. Does a general-interest content audience (finance storytelling) actually convert into B2B SaaS customers? Be brutal: an audience of people who enjoy fraud documentaries is NOT a set of business buyers with a purchase need. Assess whether the parked channel is genuinely a distribution asset for a B2B product, or an unrelated business.
2. Audience-first done properly for B2B micro-SaaS: what actually works in 2026 — building in public on X/LinkedIn, a niche newsletter for a specific trade, YouTube for a specific profession (e.g. "software for X" content), community participation? Find evidence on realistic timelines from zero to an audience that produces 24-30 paying B2B customers.
3. The 2026 reality of each channel: LinkedIn organic reach for unknown accounts; X/Twitter build-in-public saturation; newsletter growth without an existing audience; YouTube for niche trades (search volume, competition, monetisation-independent value). What does it cost in months of consistent output?
4. Comparative: is it faster to build a trade-specific audience (e.g. a newsletter for UK skip-hire operators) than to cold-sell them? What evidence exists either way?
5. The compounding argument vs the time argument: audience-first is slower to first revenue but survives the swarm (an audience cannot be cloned). Quantify the trade-off honestly for a 24-month horizon.
6. Honest assessment of the parked YouTube project ON ITS OWN TERMS as a route to £2,335/month — given the study already in the repo says £2k/month is a top-few-percent 18-36 month outcome, is resuming it a better or worse bet than the app business, for this founder?
Give VIABLE/CONDITIONAL/DEAD, numeric odds, and a concrete first-90-days.`, { label: 'path:audience-first', phase: 'Paths', schema: SCHEMA }),

  () => agent(`${COMMON}

YOUR PATH — P5: THE NULL HYPOTHESIS (argue that this goal, on this profile, should be abandoned or radically reframed).
Your job is to make the strongest honest case AGAINST continuing, so the founder can weigh it. Do not strawman it; if the case is weak, say so.
INVESTIGATE:
1. Base rates, hard: what does credible 2025-26 evidence say about solo, non-technical, no-audience, no-network founders reaching ~$3,000 MRR? Micro-SaaS failure rates, median revenue of launched products, time-to-first-dollar. Distinguish real data from survivorship-biased blog claims. What fraction never reach $1k MRR?
2. The 2026-specific deterioration: has AI-assisted building made micro-SaaS HARDER (supply of products exploded, distribution unchanged/worse, SEO collapsed via AI Overviews, app stores saturated)? Find evidence on the number of new SaaS products launched 2024-2026 vs demand, and on falling conversion/rising CAC.
3. The 8-kill evidence itself: is the correct read "we haven't found the right niche yet" or "this category is structurally closed to this profile"? Argue the latter properly.
4. Opportunity cost: for a UK person with evenings/weekends and no capital, what alternative uses of the same 12-24 months produce £2,335/month more reliably? Be concrete and evidence-based — e.g. contracting/freelance skill acquisition (what pays in the UK in 2026 and what is the ramp?), high-skill AI-adjacent freelancing, buying a small existing profitable business (UK micro-acquisition market: prices, multiples, financing), a local service business, employment plus side income. Give real numbers and realistic ramps.
5. The reframe option: is there a version of the software goal that is honest at a smaller scale — e.g. target £500/month from 8-10 customers as a first milestone, or one bespoke product for ONE customer paying £500-1,000/month (consultancy-shaped), rather than 24-30 customers?
6. What would have to be TRUE for continuing to be rational? State the falsifiable conditions.
Give VIABLE/CONDITIONAL/DEAD as a verdict on CONTINUING THE CURRENT GOAL, numeric odds, and — if you conclude continuing is irrational — what the founder should do instead, concretely.`, { label: 'path:null-hypothesis', phase: 'Paths', schema: SCHEMA }),
])

const good = paths.filter(Boolean)
log(`${good.length}/5 path analyses complete — running completeness critic`)

phase('Critic')
const summary = good.map((p, i) => `PATH ${i + 1} — verdict: ${p.verdict}\nodds: ${p.odds}\nfirst 90 days: ${p.first_90_days || 'n/a'}\nreport digest: ${p.report.slice(0, 3000)}`).join('\n\n=====\n\n')

const critique = await agent(`You are a completeness critic with web access. FIRST call ToolSearch with query "select:WebSearch,WebFetch". Today is 17 August 2026. Budget ~10 searches.

CONTEXT: ${COMMON.slice(COMMON.indexOf('THE SITUATION'))}

Five strategic paths were analysed. Digests:

${summary}

YOUR JOB — find what is MISSING or WRONG, not what is present:
1. What strategic path was NOT considered at all? Think hard: e.g. buying an existing tiny SaaS/newsletter/business rather than building; building FOR a single anchor customer who pays for development; open-source-then-monetise; selling to a buyer type nobody considered (charities, schools, clubs, churches, parish councils, sports leagues, trade unions); non-UK/English-speaking markets; B2C micro-tools; internal-tools-for-hire; marketplaces; arbitrage plays. Evaluate the 2-3 most promising omissions with real evidence and give each a numeric probability for this founder.
2. Which claim in the five analyses is most likely WRONG or overstated? Attack the weakest reasoning with evidence.
3. Are the numeric odds internally consistent and calibrated against known base rates, or are agents anchoring on each other's optimism/pessimism?
4. What single piece of evidence, if the founder gathered it in the next 2 weeks, would most change the decision? Be specific about how to gather it with no network and no budget.
Return your analysis in the same schema; 'verdict' = which path (or omitted path) you would back and why; 'odds' = your own calibrated numbers for the top options.`, { label: 'critic:completeness', phase: 'Critic', schema: SCHEMA })

return { paths: good, critique }
