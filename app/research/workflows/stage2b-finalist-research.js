export const meta = {
  name: 'finalist-competitor-research',
  description: 'Deep competitor and validation research on the three finalist product concepts',
  phases: [
    { title: 'Research', detail: '5 parallel competitor/validation agents' },
  ],
}

const SCHEMA = {
  type: 'object',
  required: ['report', 'key_claims', 'verdict'],
  properties: {
    report: { type: 'string', description: 'Detailed findings in markdown, sources cited inline with URLs' },
    key_claims: {
      type: 'array',
      items: { type: 'object', required: ['claim', 'source'], properties: { claim: { type: 'string' }, source: { type: 'string' } } },
    },
    verdict: { type: 'string', description: 'GO / CAUTION / KILL for this concept from this dimension alone, with the single decisive reason' },
    gaps: { type: 'string' },
  },
}

const COMMON = `You are a competitor-research agent with web access. FIRST call ToolSearch with query "select:WebSearch,WebFetch" to load web tools. Today is 17 August 2026. Budget ~14 WebSearch calls; try WebFetch on vendor pricing pages (many domains are proxy-blocked — note failures and fall back to search extracts). Use GBP.
CONTEXT: a UK non-technical solo founder (Claude builds everything) needs a B2B product reaching ~£2,335/month (24 customers at £99 or 48 at £49). Verified constraints from prior research: buyers must be businesses without procurement (no SOC 2), the product must be async (no real-time support), the duty it serves must RECUR, prospects must be enumerable, and there must be no free government tool or platform-subsidised incumbent covering the same job. Your job is to find every reason this concept FAILS. Be a pessimist with receipts.`

phase('Research')
const results = await parallel([
  () => agent(`${COMMON}
CONCEPT A (front-runner): a compliance register for UK portfolio landlords (4–50 properties) and micro letting agents — tracks every property's certificates (gas CP12, EICR, EPC, smoke/CO), tenancy events, deposit protection, and the new Renters' Rights Act PRS Database registration status; sends reminders before expiry/deadline; produces an audit pack; AI reads uploaded certificate PDFs to extract dates automatically. Price target £49–99/month.
RESEARCH THE COMPETITIVE LANDSCAPE EXHAUSTIVELY:
1. Every UK landlord software product and its CURRENT pricing: Landlord Vision, Landlord Studio, Hammock, Lendlord, Alphaletz, Arthur, COHO, Property Hawk, Rentila, PaTMa, Total Landlord/own-brand tools, plus letting-agent systems (Alto, Jupix, Goodlord, Fixflo, Street.co.uk, Agent OS/Reapit). For each: price, whether it covers compliance/certificate tracking, whether it has announced PRS Database features, target user (landlord vs agent), free tier?
2. Are there NEW entrants specifically built for Renters' Rights Act / PRS Database compliance (search "PRS database software", "Renters Rights Act compliance software/tool/app", "landlord compliance tracker")? This is the critical check — if 5 funded startups launched this in 2026, the gap is closed.
3. Does the government (MHCLG) plan FREE landlord-facing tooling with the PRS Database — bulk upload, reminders, agent portals? What has been published about how landlords will interact with the database (API? portal only?)? What are the confirmed fees, go-live timing, and transition periods as of August 2026?
4. What do NRLA/Propertymark/landlord associations offer members for compliance tracking (free member tools would undercut us)?
5. Landlord community sentiment: what are landlords on forums (Property118, LandlordZone, PropertyTribes, r/uklandlords via search extracts) saying about RRA compliance burden and tooling in 2026?
6. Reachability check: are portfolio landlords findable/reachable at scale (associations, meetups, Facebook groups, the agents who serve them)? Note landlords are mostly PECR individual subscribers (no cold email) — what channels remain?
Deliver a GO/CAUTION/KILL verdict with the decisive reason.`, { label: 'competitors:landlord-compliance', phase: 'Research', schema: SCHEMA }),

  () => agent(`${COMMON}
CONCEPT B (runner-up): an MTD client-status board for small UK accountancy practices (sole practitioner to ~8 staff, 50–400 MTD-affected clients) — tracks per-client MTD sign-up status, quarterly submission status across whatever software each client uses, deadline countdowns, automated client chasing, evidence of the documented "confirmation gap" (no standard HMRC acknowledgement). Needs NO HMRC recognition (tracks workflow, doesn't file). Price £49–99/month per practice.
RESEARCH EXHAUSTIVELY:
1. Existing practice-management/MTD-tracking products and CURRENT pricing: checkmymtd.co.uk (who is behind it, what does it cost, how mature?), Glide, Senta, Karbon, BrightManager, AccountancyManager, TaxCalc practice tools, IRIS Elements, Coconut's accountant portal, FreeAgent practice dashboard. Which already show cross-client MTD quarterly status?
2. Has HMRC shipped or announced an agent-facing MTD status dashboard (Agent Services Account improvements)? This single fact can kill the concept.
3. What are accountants actually saying in 2026 about tracking client MTD status (AccountingWEB threads via search extracts, ICAEW/AAT commentary)? Is "we track it in Excel" documented?
4. Reachability: how would a no-name vendor reach 24–48 small practices (ICAEW/ACCA/AAT directories, AccountingWEB advertising costs, Accountex, local practice networks)? Are small practices limited companies (cold-emailable)?
5. Willingness to pay: what do small practices pay for adjacent tools per month? Evidence of price sensitivity.
Deliver GO/CAUTION/KILL with the decisive reason.`, { label: 'competitors:mtd-tracker', phase: 'Research', schema: SCHEMA }),

  () => agent(`${COMMON}
CONCEPT C (the owner's original hypothesis — test it fairly): AI revenue-recovery / follow-up automation for small businesses — captures enquiries, auto-responds, chases quotes, recovers no-shows, reactivates dormant customers; "an AI employee that stops you losing money through missed follow-ups". Target: UK service SMBs (e.g. trades, clinics, agencies). Price £49–149/month.
RESEARCH EXHAUSTIVELY AND FAIRLY:
1. The competitive field: who already sells follow-up/lead-recovery automation to SMBs and at what price — GoHighLevel (and its whitelabel army), Podium, NiceJob, Textmagic UK, ServiceM8/Tradify built-in follow-ups, Jobber's automations, ReviewsOnMyWebsite, UK missed-call-text-back vendors, Meta/WhatsApp Business native tools, HubSpot free tier automations. How crowded is this in the UK in 2026?
2. The platform-absorption question: are booking/job-management incumbents (Fresha, Tradify, ServiceM8, Jobber) shipping AI follow-up natively? Is missed-call-text-back already a commodity feature?
3. Churn/retention evidence for this category: do SMBs keep paying for follow-up automation, or does it churn when the novelty fades? Any GoHighLevel-agency churn data?
4. Legal constraints on AUTOMATED outbound to the SMB's customers: UK PECR rules on the SMS/email the tool itself sends (the end-customers are consumers — consent requirements for marketing vs service messages; where does "quote follow-up" sit?). SMS costs per message UK.
5. Distribution: how would an unknown UK founder reach these buyers, given "small businesses" is not an enumerable list and the research shows generic horizontal SMB sales is the hardest motion?
6. The ChatGPT-alone test and defensibility: what stops a competent SMB using ChatGPT + their existing CRM's automations?
Deliver GO/CAUTION/KILL with the decisive reason. Do not soften it because it was the owner's idea.`, { label: 'competitors:revenue-recovery', phase: 'Research', schema: SCHEMA }),

  () => agent(`${COMMON}
VALIDATION DIMENSION (applies mainly to Concept A, the landlord compliance register): the REGULATORY GROUND TRUTH as of 17 August 2026 for the Renters' Rights Act 2025 implementation. This decides build timing and marketing claims, so precision matters more than breadth.
1. Confirmed commencement dates: which RRA provisions are in force NOW, what happened on/around 1 May 2026, and what is the CURRENT official timeline for the PRS Database going live (region pilots? phased rollout? confirmed date or still "late 2026"?).
2. The PRS Database specifics: what must landlords record/update, within what timeframes, what are the confirmed fees, is there an API or bulk-upload route for agents/software, what does government guidance say the database portal itself will do (reminders? certificate storage?). If the portal itself stores certificates and sends reminders, our product shrinks.
3. Penalties: confirm the civil penalty ladder (up to £7,000 initial / up to £40,000 or criminal for serious/repeat breaches) and the Section 8/possession consequences of non-registration — from the Act or official guidance, not blogs.
4. Adjacent recurring duties our register would track: current legal requirements + 2026-27 changes for gas safety certificates, EICR 5-year cycle, EPC minimum standards (any confirmed MEES changes for 2027-2030?), smoke/CO alarm rules, deposit protection deadlines, Awaab's-Law-extension-to-private-sector timing under RRA.
5. Landlord population and portfolio-size distribution: best official figures (English Housing Survey / EPC data) for how many landlords have 4+ properties — our actual addressable market.
6. Timing risk assessment: if the database slips to mid-2027, does the product still sell in early 2027 on certificate-tracking alone?
Deliver GO/CAUTION/KILL on TIMING grounds with the decisive reason.`, { label: 'validate:rra-ground-truth', phase: 'Research', schema: SCHEMA }),

  () => agent(`${COMMON}
PRICING & PACKAGING DIMENSION (applies to whichever concept wins; use Concept A as the primary case): what should a UK landlord/agent compliance product charge, and how?
1. Verify CURRENT prices by fetching or search-extracting vendor pricing pages: Landlord Vision, Landlord Studio, Hammock, Lendlord, Alphaletz, Arthur, COHO — per-property vs flat pricing, annual discounts, free tiers. Build the real price ladder for landlord software in 2026.
2. What do portfolio landlords (4-50 properties) actually pay per month across their stack today (software + any compliance services)? Any survey/forum evidence of software budgets?
3. Letting agents: what do micro agents (1-5 staff, 20-200 managed properties) pay for their core system, and is a £49-99 add-on plausible next to it? Evidence from agent forums/pricing pages.
4. Per-property vs flat pricing: which do landlord tools use, what are the psychological breakpoints (e.g. £1-2/property/month norms), and what would 24-48 customers at our target revenue imply per pricing model? Model: flat £49, flat £99, £2/property with £29 minimum — which maximises revenue at realistic portfolio sizes?
5. Annual-billing norms in this market; card-upfront trial norms; whether landlords expect free trials.
6. The £0 competitor check: exactly what do the free tiers (Lendlord free, Landlord Studio ≤2 properties, Hammock 1 property, NRLA member tools) include for COMPLIANCE specifically — is certificate tracking already free for small portfolios?
Deliver a recommended price + packaging with the reasoning, and note the evidence quality.`, { label: 'pricing:landlord-market', phase: 'Research', schema: SCHEMA }),
])

const done = results.filter(Boolean)
log(`${done.length}/5 finalist research agents completed`)
return { results: done }