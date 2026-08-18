export const meta = {
  name: 'b2b-app-opportunity-study',
  description: 'Find what software UK businesses actually buy, and what a solo non-technical founder can realistically sell',
  phases: [
    { title: 'Research', detail: '6 parallel agents with web access' },
    { title: 'Verify', detail: 'adversarial fact-check of each dimension' },
  ],
}

const RESEARCH_SCHEMA = {
  type: 'object',
  required: ['report', 'key_claims'],
  properties: {
    report: { type: 'string', description: 'Detailed findings in markdown, sources cited inline with URLs and dates' },
    key_claims: {
      type: 'array',
      items: {
        type: 'object',
        required: ['claim', 'source'],
        properties: { claim: { type: 'string' }, source: { type: 'string' } },
      },
    },
    opportunities: { type: 'string', description: 'Concrete product opportunities this dimension surfaces: who buys, what pain, what they pay today, why now' },
    gaps: { type: 'string', description: 'What you could not verify and your confidence level' },
  },
}

const VERIFY_SCHEMA = {
  type: 'object',
  required: ['verdicts', 'summary'],
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['claim', 'verdict', 'note'],
        properties: {
          claim: { type: 'string' },
          verdict: { type: 'string', enum: ['confirmed', 'corrected', 'unverifiable'] },
          note: { type: 'string' },
        },
      },
    },
    summary: { type: 'string' },
  },
}

const COMMON = `You are a research agent with web access. FIRST call ToolSearch with query "select:WebSearch,WebFetch" to load web tools, then use them extensively. Budget ~15 WebSearch calls; prefer WebFetch on promising URLs (note: many gov/vendor domains are proxy-blocked — fall back to search extracts and say so).
Today is 16 August 2026. Prioritise 2025-2026 information; flag anything older that may be stale.

CONTEXT — be ruthlessly practical about this specific situation:
A UK-based person with ZERO coding experience wants to build and sell a software product to businesses. Claude (an AI coding agent) does 100% of the building; the owner does customer discovery, sales, support, and business admin. Budget for running costs is minimal (roughly £0-60/month to start). The income goal is roughly £2,335/month pre-tax (about 48 customers at £49/month, or 24 at £99/month) — this is a small-numbers game, NOT a venture-scale ambition. Timeline sensitivity: they want something that could realistically reach first paying customers within months, not years.
Your job is EVIDENCE, not encouragement. Prefer primary sources (official regulator pages, vendor pricing pages, app marketplace listings, public revenue disclosures, real founder post-mortems with numbers) over listicles and "top 10 SaaS ideas" content-marketing slop, which is abundant and worthless here. Where evidence is anecdotal, say so and weight it accordingly. Use GBP.
Return: a thorough markdown report, your most load-bearing claims with source URLs, concrete opportunities, and honest gaps.`

const DIMENSIONS = [
  {
    key: 'regulation-forced',
    prompt: `${COMMON}
DIMENSION: Regulation-forced software demand in the UK/EU, 2026-2028. This is the highest-signal category because compliance deadlines create non-discretionary, deadline-driven buying by businesses that have no choice.
Research exhaustively:
1. Making Tax Digital for Income Tax Self Assessment: confirmed thresholds and dates (over £50k from April 2026, over £30k from April 2027, over £20k from April 2028). How many UK sole traders/landlords are captured in each wave? What software must they buy, what does HMRC-recognised software cost today, and what are the gaps/complaints about existing MTD software? Is there room for a simple, cheap tool for the smallest taxpayers (£20k-30k income) in the 2027-2028 waves?
2. UK/EU e-invoicing mandates: status of UK e-invoicing consultation/policy, EU ViDA (VAT in the Digital Age) timelines, member-state mandates (Germany, France, Belgium, Poland, Spain Verifactu) hitting 2026-2028. Do UK businesses trading with the EU need anything?
3. Employment-law changes: the UK Employment Rights Act/Bill implementation timetable 2026-2027 (day-one rights, zero-hours provisions, fair-work agency, statutory sick pay changes). What new record-keeping/compliance obligations do small employers face, and what software gaps result?
4. Other forced-purchase triggers: Extended Producer Responsibility (packaging data reporting), EPR/DRS deposit return schemes, EU Accessibility Act (June 2025, ongoing enforcement), UK data protection changes, EU AI Act phases, food hygiene/allergen rules (Natasha's Law follow-ups), fire safety/Martyn's Law (Terrorism Protection of Premises Act — implementation timeline and what venues must now do).
5. For each: WHO must comply, BY WHEN, what they must actually produce/record, what software exists, what it costs, and where a simple tool could win.
Deliverable: a ranked list of regulatory deadlines that force UK businesses to buy software in the next 24 months, with the size of each affected population and the state of existing solutions.`,
  },
  {
    key: 'proven-demand',
    prompt: `${COMMON}
DIMENSION: What small businesses actually pay for — evidence of real revenue in micro-SaaS and vertical software.
Research exhaustively:
1. Public revenue evidence: bootstrapped/indie software businesses with disclosed MRR (Indie Hackers, MicroConf, Starter Story, public "open startup" dashboards, Acquire/Flippa listings with verified revenue). Which categories repeatedly appear at £2k-20k MRR with a solo or tiny founder? Give named examples with figures and dates.
2. Vertical/niche SaaS that sells to specific trades: field service, salons, gyms, dental/veterinary practices, letting agents, tradespeople, restaurants, childcare, driving instructors, cleaning companies, funeral directors. What do incumbents charge per month in the UK? Where are the underserved verticals?
3. Price points: what do UK small businesses actually pay per month for software they consider essential vs nice-to-have? What is the psychological ceiling for an unknown vendor (evidence, not guesswork)?
4. The "boring software" thesis: evidence about unsexy niches (compliance logs, scheduling, quoting, invoicing, inspection reports, certificates) outperforming trendy consumer-ish tools for solo founders.
5. Acquisition marketplaces: browse what small SaaS businesses actually sell for and in what categories (Acquire.com, Flippa, MicroAcquire data) — this reveals which categories generate real cash.
6. Anti-evidence: which categories are graveyards (saturated, commoditised, or dominated by free tools) — CRM, project management, generic AI wrappers, invoicing apps competing with QuickBooks/Xero free tiers.
Deliverable: an evidence-backed picture of where small-scale software revenue genuinely exists in 2026, with named examples and price points.`,
  },
  {
    key: 'pain-mining',
    prompt: `${COMMON}
DIMENSION: Direct evidence of unmet business pain — mine complaints, not opinions.
Research exhaustively:
1. App marketplace gap analysis: search the Xero App Store, QuickBooks Apps, Shopify App Store, HubSpot Marketplace, Microsoft AppSource for categories with high demand signals but poor/aging/expensive incumbents. Look specifically at UK-relevant apps with few listings, bad reviews, or obvious gaps. Note review counts and ratings as demand proxies.
2. Review-site complaint mining: G2, Capterra, Trustpilot reviews of popular small-business software — what do 1-3 star reviews consistently complain about? ("too expensive for what it does", "too complex", "doesn't do X"). Focus on UK-relevant products.
3. Community pain: Reddit (r/smallbusiness, r/UKBusiness, r/AskUK trade subs, r/restaurateur, r/electricians, r/Construction, r/accounting), UK trade forums, Facebook groups for specific trades — recurring "does anyone know software that does X" and "I still do this in a spreadsheet" posts. Spreadsheet/paper workflows are the strongest buy signal there is.
4. The "still on paper/WhatsApp/spreadsheet" inventory: which specific business processes in UK SMEs are still run on paper, WhatsApp, or Excel in 2026? Rota-ing, stock counts, temperature logs, job sheets, timesheets, compliance records, deliveries, quotes, tips distribution, allergen matrices, van stock, site diaries.
5. Where possible, quantify: how many UK businesses are in each affected trade (ONS/Companies House/trade body figures)?
Deliverable: a list of specific, evidenced pains with the exact user, the current workaround, and why existing software hasn't solved it.`,
  },
  {
    key: 'distribution',
    prompt: `${COMMON}
DIMENSION: Distribution — how a non-technical solo founder with no audience actually gets the first 10, then 50, paying business customers. This dimension decides whether the whole plan is viable, so be brutally realistic.
Research exhaustively:
1. UK legal constraints on outreach: PECR and UK GDPR rules on cold email/cold calling to businesses — what is actually legal (corporate subscribers vs sole traders/partnerships), what the ICO says, CTPS for phone. This is a hard constraint that most "growth hacking" advice ignores; get it right with primary sources.
2. What actually works for tiny B2B software: evidence from founder post-mortems and MicroConf/Indie Hackers case studies on first-customer channels — in-person/local sales, trade associations, industry Facebook groups, partnerships with accountants/consultants, app marketplace listings, SEO for long-tail "software for X" queries, cold outreach, communities. Which produce the first 10 customers fastest for an unknown vendor?
3. Marketplace distribution as a shortcut: what does it take to list in the Xero App Store, QuickBooks App Store, Shopify App Store (requirements, review process, revenue share, realistic install volumes for a new app)? Does marketplace presence generate meaningful inbound for small apps, with evidence?
4. Trade-body and industry-channel routes in the UK: do trade associations, franchise groups, buying groups, or accountancy practices actually resell/recommend software to members? Evidence of this working.
5. Realistic conversion data: for tiny B2B SaaS, what are typical demo-to-paid rates, free-trial conversion rates, cold-email reply rates in 2026, and how many conversations does it take to get 10 paying customers?
6. Time-to-first-revenue: evidence on how long from launch to first paying customer, and to £1k MRR, for solo B2B founders.
Deliverable: an honest ranked playbook of distribution channels available to someone with no audience, no dev skills, and no marketing budget — with the legal constraints stated precisely.`,
  },
  {
    key: 'ai-enabled',
    prompt: `${COMMON}
DIMENSION: What is newly buildable and sellable in 2026 because of AI — and where AI is a trap.
Research exhaustively:
1. AI capabilities that are genuinely production-ready in 2026 for business software: document extraction/OCR of messy real-world paperwork, voice-to-structured-data, image understanding (photos of equipment/sites/damage), long-context document analysis, agentic workflow automation. What now works reliably enough to sell?
2. Real businesses selling AI-powered vertical tools with revenue evidence — especially "AI does the annoying data entry" products: invoice/receipt processing, insurance claims, construction site reports, medical/veterinary notes, inspection reports, compliance paperwork, quote generation from photos/voice.
3. The commoditisation trap: which AI product categories are being eaten by OpenAI/Anthropic/Google shipping the feature natively, or by incumbents (Xero/QuickBooks/Shopify) adding it free? What differentiates a defensible AI product from a doomed wrapper — evidence, not theory.
4. Unit economics: realistic per-customer LLM API costs in 2026 for document-heavy workflows (give worked examples with current pricing), and how that constrains a £29-99/month price point. What margins survive?
5. Risk factors: hallucination liability in regulated/financial contexts, UK/EU AI Act obligations for a small vendor, data protection when processing customer documents (UK GDPR, data processor obligations, ICO registration).
6. Where AI is NOT the answer: cases where a simple, reliable, boring CRUD app beats an AI feature for the customer's actual job-to-be-done.
Deliverable: a clear-eyed view of which AI-enabled product shapes are sellable and defensible for a tiny vendor in 2026, with costs and risks quantified.`,
  },
  {
    key: 'economics-legal-ops',
    prompt: `${COMMON}
DIMENSION: The real cost, legal setup, and base rates of running a one-person UK software business.
Research exhaustively:
1. Monthly running costs at small scale (be specific with current 2026 pricing): hosting/PaaS options with meaningful free tiers (Cloudflare, Vercel, Netlify, Fly.io, Railway, Supabase, Neon, Hetzner), managed database, email sending (transactional and support), domain, error monitoring, backups. What does a real 20-50 customer SaaS actually cost per month to run in 2026?
2. Payments: Stripe UK fees, Stripe Billing/subscription costs, Merchant of Record alternatives (Paddle, Lemon Squeezy) and their fee structures — and crucially whether an MoR removes the VAT-registration/complexity burden for a UK micro-business selling to EU/international customers.
3. UK legal/admin for selling software to businesses: sole trader vs limited company at this scale (and when incorporating starts to matter), ICO registration fee and whether it is required for a data processor/controller, VAT registration threshold and whether/when it bites, professional indemnity insurance (typical UK cost for a small software vendor), and what contracts are needed (terms of service, data processing agreement, SLA expectations from business customers).
4. Data protection obligations in practice: UK GDPR controller vs processor status when a business's data sits in your app, what a DPA must contain, breach notification duties, and what small SaaS vendors actually do about this.
5. Support burden reality: evidence on how much support time N business customers generate; what happens to a solo founder at 50 customers; churn rates for small B2B SaaS (monthly churn benchmarks by price point).
6. Base rates and honest failure data: what fraction of launched micro-SaaS products ever reach £1k MRR? Time-to-£1k and time-to-£2k MRR evidence from founder surveys (MicroConf State of Independent SaaS, Indie Hackers data). Be blunt and give the distribution, not the winners' anecdotes.
Deliverable: an exact monthly cost model, a UK compliance checklist, and honest base rates for reaching £2,335/month.`,
  },
]

phase('Research')
const results = await pipeline(
  DIMENSIONS,
  d => agent(d.prompt, { label: `research:${d.key}`, phase: 'Research', schema: RESEARCH_SCHEMA }),
  (res, d) => {
    if (!res) return null
    const claims = res.key_claims.map((c, i) => `${i + 1}. CLAIM: ${c.claim}\n   SOURCE GIVEN: ${c.source}`).join('\n')
    return agent(`You are an adversarial fact-checker with web access. FIRST call ToolSearch with query "select:WebSearch,WebFetch". Today is 16 August 2026. Budget ~10 searches.
A researcher investigated the dimension "${d.key}" for a study on whether a UK non-technical solo founder can build and sell business software reaching ~£2,335/month. Try to REFUTE or correct its key claims using INDEPENDENT sources — do not simply re-read what it cited. Check especially: are regulatory dates and thresholds current and correctly stated? Are pricing/cost figures current for 2026? Are revenue claims from credible disclosures rather than marketing? Are population/market-size numbers real?
Mark each claim confirmed (with your independent source), corrected (with the right fact and source), or unverifiable. Then assess the dimension's overall reliability and any systemic bias (e.g. relying on content-marketing listicles or survivor anecdotes).

CLAIMS:
${claims}

ADMITTED GAPS: ${res.gaps || 'none stated'}`, { label: `verify:${d.key}`, phase: 'Verify', schema: VERIFY_SCHEMA })
      .then(v => ({ dimension: d.key, research: res, verification: v }))
  }
)

const complete = results.filter(Boolean)
log(`Completed ${complete.length}/${DIMENSIONS.length} dimensions`)
return { dimensions: complete }