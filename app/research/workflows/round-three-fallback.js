export const meta = {
  name: 'round-three-fallback',
  description: 'Validate the fallback shortlist after six kills and owner confirming no real-world access',
  phases: [
    { title: 'Research', detail: '5 validation agents: 4 on DWTS waste-carrier capture, 1 closing out the letting-agent repack' },
  ],
}

const SCHEMA = {
  type: 'object',
  required: ['report', 'key_claims', 'verdict'],
  properties: {
    report: { type: 'string', description: 'Detailed findings in markdown, sources cited inline' },
    key_claims: { type: 'array', items: { type: 'object', required: ['claim', 'source'], properties: { claim: { type: 'string' }, source: { type: 'string' } } } },
    verdict: { type: 'string', description: 'GO / CAUTION / KILL with the single decisive reason (for dimension agents: verdict on YOUR dimension only)' },
    gaps: { type: 'string', description: 'What could not be verified and should be checked in a browser' },
  },
}

const COMMON = `You are a validation-research agent with web access. FIRST call ToolSearch with query "select:WebSearch,WebFetch". Today is 17 August 2026. Prices in GBP.
CONTEXT: UK non-technical solo founder, Claude builds everything, target £2,335/month (24-30 customers at £79-99). Six concepts have been adversarially validated and ALL SIX KILLED. Lessons that now bind your analysis:
(1) SWARM: cheap AI building means any statute with a name journalists use is swarmed within months — clones reached a ~1,000-person niche (party wall, 5 tools) and a pre-enforcement regime (Martyn's Law, exact £29/mo clone 8 months early).
(2) LIABILITY INVERSION: "liability-grade document" moats INVERT for an unknown solo vendor — personally-liable buyers get MORE vendor-conservative and buy incumbents/consultants/nothing.
(3) FALSE PREMISES: a concept died on a carried-over pricing premise one search disproved — re-verify every inherited premise before building on it.
(4) NO ACCESS: the owner has just confirmed they have NO real-world industry access — no work history, family, or friends in any target trade. Distribution must therefore work via cold outreach to an enumerable public register (PECR: limited companies may be cold-emailed; sole traders may NOT without consent; cold calls require TPS/CTPS screening) or via partners/associations. Weigh every verdict against a cold-start, no-audience, no-trust founder.
Standing filters: buyer without procurement function; async product; recurring duty; enumerable prospects; no free government/association tool doing the same job; no platform-subsidised incumbent; moat un-clonable by a weekend AI build. Find every reason the concept FAILS. Pessimist with receipts. Budget ~12 WebSearch calls unless told otherwise.`

phase('Research')
const results = await parallel([
  () => agent(`${COMMON}
CONCEPT F1 (lead fallback): "DWTS waste-carrier capture" — phone-first digital waste tracking for small waste carriers/brokers/dealers (1-15 vehicle skip hire, grab hire, muckaway, house clearance). Driver taps three things at the tip, the statutory Digital Waste Tracking record is created and submitted; office sees all records; £49-99/month per firm. Timed for the October 2027 carrier/broker mandate (public beta expected spring 2027).
YOUR DIMENSION: SWARM AND INCUMBENT TEARDOWN.
1. Existing waste-management software serving carriers: AMCS, Isis/ISYS, Weighsoft, VWS, PurGo, Whitespace, AL Software, Clearabee's tech, anything else — which serve SMALL carriers (1-15 vehicles), at what price? Which have announced DWTS readiness/integration?
2. Job-management tools small carriers already run: BigChange, Podfather, Re-flow, Joblogic, ServiceM8, generic skip-hire software ("skip hire software UK") — prices, and are they adding DWTS features?
3. Early swarm signals: search "digital waste tracking software", "DWTS software UK", "waste tracking app 2026/2027", "DWTS compliance tool" — how many dedicated new entrants/domains exist ALREADY? Template/consultancy sellers? SEO content farms circling?
4. Skip-hire/waste marketplaces and brokers (AnyJunk, Skip Hire Network, LoveJunk) — will they absorb DWTS for their carrier networks as a platform feature?
5. Accounting/ERP angle: will Xero/Sage app-store waste add-ons or weighbridge vendors move down-market once the mandate lands?
Verdict GO/CAUTION/KILL for the swarm dimension: is there genuinely still room, or is this party-wall again?`, { label: 'dwts:swarm', phase: 'Research', schema: SCHEMA }),

  () => agent(`${COMMON}
CONCEPT F1 (lead fallback): "DWTS waste-carrier capture" — phone-first digital waste tracking for small waste carriers/brokers/dealers. Driver-side capture creates the statutory DWTS record; £49-99/month. Timed for the Oct 2027 carrier mandate.
YOUR DIMENSION: REGULATION GROUND TRUTH AND THE FREE-PORTAL THREAT. Re-verify every inherited premise — they came from one research pass in Aug 2026 and one false premise already killed a concept.
1. Confirm current DWTS status as of Aug 2026: does the 1 Oct 2026 receiving-sites date still hold (England/Wales/NI; Scotland Jan 2027)? Carriers/brokers/dealers Oct 2027 — confirmed or slipping? Any consultation responses, DEFRA blog posts, industry press (letsrecycle.com, CIWM, MRW) reporting delays? Government digital programmes slip constantly — find the latest signal.
2. The free government portal: what exactly does DEFRA provide free — portal, CSV upload, API? The £26/year per record-creating organisation fee — confirm. How burdensome is manual portal entry for a carrier doing 10-15 loads/day? Any beta-user feedback yet?
3. API access: is the DWTS API spec published? Can third-party software submit records on a carrier's behalf? Is there a software-recognition scheme (like MTD) or open API? This decides whether our product is even buildable now.
4. What actually changes for a small carrier: today's paper waste transfer notes / season tickets vs DWTS records — what fields, per-load vs annual, hazardous vs non-hazardous split (consignment notes already digital via EA?). Is the real burden big enough to pay £79/month to remove, or is it 2 minutes in a free portal?
5. Enforcement reality: what are the penalties, who inspects (EA), and what did enforcement look like for past waste digitisation (edoc's failure — the voluntary electronic duty-of-care system that flopped — what does that precedent say about compliance urgency)?
6. Trade associations: CIWM, ESA, United Resource Operators Confederation (UROC) — are any building/commissioning free member tools for DWTS?
Verdict GO/CAUTION/KILL for the regulation/free-portal dimension.`, { label: 'dwts:regulation', phase: 'Research', schema: SCHEMA }),

  () => agent(`${COMMON}
CONCEPT F1 (lead fallback): "DWTS waste-carrier capture" — phone-first digital waste tracking for small waste carriers/brokers/dealers; £49-99/month; Oct 2027 carrier mandate.
YOUR DIMENSION: BUYER, POPULATION AND COLD-START DISTRIBUTION.
1. The register: the EA public register of waste carriers, brokers and dealers — confirm it is publicly downloadable, what fields it holds (company name, address, registration tier, expiry — phone? email?), and how many UPPER-TIER carriers exist in England (plus Wales/Scotland/NI equivalents: NRW, SEPA, NIEA registers). How many are genuinely small trading businesses vs one-man-with-a-van lower-tier or dormant registrations?
2. Segment the buyer: how many skip-hire/grab-hire/muckaway/house-clearance firms operate in the UK (company counts, trade association memberships)? Are they typically limited companies (cold-emailable under PECR) or sole traders (not)?
3. What do they run today: evidence (forums, Facebook groups, trade press, job ads) of small carriers using paper/WhatsApp/Excel vs BigChange/Podfather-class software; what do they pay for job management, weighbridge tickets, tacho/vehicle compliance (£/vehicle/month norms)?
4. Willingness to pay and sales culture: is this a phone-first trade? Evidence of how software gets sold to them (trade shows — Letsrecycle Live? RWM/ESS Expo?), typical deal sizes. Would a no-name founder cold-calling from the register get meetings?
5. DWTS awareness: any evidence small carriers know/care about Oct 2027 yet (forum threads, association bulletins, LinkedIn)? Late-panic compliance buying is a pattern (MTD) — when did MTD software actually get bought relative to its deadlines?
6. Churn/retention shape: is DWTS usage per-load (recurring by construction)? Would the tool become system-of-record (sticky) or a thin submission layer (churny once the portal improves)?
Verdict GO/CAUTION/KILL for the buyer/distribution dimension, explicitly weighing the no-access cold-start founder.`, { label: 'dwts:buyer', phase: 'Research', schema: SCHEMA }),

  () => agent(`${COMMON}
CONCEPT F1 (lead fallback): "DWTS waste-carrier capture" — phone-first digital waste tracking for small carriers; £49-99/month; Oct 2027 mandate.
YOUR DIMENSION: THE WEDGE AND THE SERVICE-FIRST BRIDGE.
1. The wedge premise: our product only survives if driver-phone-side capture is dramatically faster than DEFRA's free portal. Stress-test: what does the free portal's data-entry flow require per load (fields, EWC codes, SIC codes)? Could a competent office admin batch 15 loads in 20 minutes via CSV? If yes, the wedge is dead — say so.
2. Adjacent wedge check: is the REAL pain not the submission but the capture — signatures, photos, weights, EWC code selection at the roadside? What do drivers do today at the point of transfer? Does any existing app (ePOD apps, Podfather) already capture this?
3. LIABILITY INVERSION check for this niche: DWTS records are duty-of-care compliance records inspected by the EA. Does the round-two lesson bite here — will carriers distrust an unknown vendor with statutory records — or is this niche different (operational records, low personal liability, price-driven trade)? Be honest about which way it cuts.
4. The service-first bridge, concretely: could the founder sell "we do your DWTS for you" — a done-for-you records service at £99-199/month where Claude+founder process photos/WhatsApps of tickets into compliant records — BEFORE building software? Does anything like this exist (waste compliance consultancies offering DWTS-as-a-service, bookkeeper-style)? Would it satisfy the duty-of-care rules (can a third party keep/submit records on a carrier's behalf)?
5. Timing economics of the bridge: receiving SITES go live 1 Oct 2026 (six weeks away) — is there a nearer-term service opportunity with small permitted sites (small transfer stations) before carriers in 2027? Or are sites all served by weighbridge software?
6. What would a weekend AI clone of the wedge look like in 2027, and what (dataset? EWC-code intelligence? integrations? fulfilment?) would it NOT be able to copy?
Verdict GO/CAUTION/KILL for the wedge/service-bridge dimension.`, { label: 'dwts:wedge', phase: 'Research', schema: SCHEMA }),

  () => agent(`${COMMON}
CONCEPT F2 (fallback close-out — budget ~8 searches): "Agent-first compliance repack" — landlord-compliance tooling repackaged for LETTING AGENTS (~£79/month per office). Stage 2b rated this a weak survival case: Kamma anchors agent compliance at ~£0.50/property/month, Goodlord owns compliance-as-a-service, and the concept only made sense with an access edge the owner has now confirmed they do NOT have.
YOUR JOB: close this out properly so the ledger entry is evidence, not vibes.
1. Verify the anchors: Kamma's actual agent pricing and coverage (licensing determination, compliance tracking); Goodlord's compliance offering and price; Reapit/Alto/Street/Apex27 native compliance features.
2. The Renters' Rights Act agent-tooling wave: how many agent-facing RRA compliance tools shipped 2025-26 (from the 15+ landlord-facing wave, which pivoted to agents)? Is the agent side as swarmed as the landlord side?
3. The buyer: UK letting-agent branch count; are independent agents (1-3 branch) buying new compliance tools now, and through what channel (Propertymark? trade press?)? What does an unknown vendor's cold outreach to letting agents look like against Propertymark-endorsed incumbents?
4. Is there ANY un-served wedge left (e.g. PRS Database bulk registration for agents when late-2026 rollout hits, Awaab's Law for private rentals Oct 2027)? Or is every wedge already a feature roadmap item for Kamma/Goodlord/CRMs?
Verdict GO/CAUTION/KILL — and be willing to kill it cleanly.`, { label: 'agent-repack:closeout', phase: 'Research', schema: SCHEMA }),
])

const done = results.filter(Boolean)
log(`${done.length}/5 round-three validation agents completed`)
return { results: done }
