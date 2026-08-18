export const meta = {
  name: 'round-two-validation',
  description: 'Validate the three clone-resistant surviving concepts after all round-one finalists were killed',
  phases: [
    { title: 'Research', detail: '3 parallel validation agents' },
  ],
}

const SCHEMA = {
  type: 'object',
  required: ['report', 'key_claims', 'verdict'],
  properties: {
    report: { type: 'string', description: 'Detailed findings in markdown, sources cited inline' },
    key_claims: { type: 'array', items: { type: 'object', required: ['claim', 'source'], properties: { claim: { type: 'string' }, source: { type: 'string' } } } },
    verdict: { type: 'string', description: 'GO / CAUTION / KILL with the single decisive reason' },
    gaps: { type: 'string' },
  },
}

const COMMON = `You are a validation-research agent with web access. FIRST call ToolSearch with query "select:WebSearch,WebFetch". Today is 17 August 2026. Budget ~14 WebSearch calls. GBP.
CONTEXT: UK non-technical solo founder, Claude builds everything, target £2,335/month (24-30 customers at £79-99). LESSON FROM THREE KILLED CONCEPTS: any product whose core job is "track dates / send reminders / follow up automatically" is already swarmed by 2025-26 AI-built micro-clones, free association tools, and platform features — cheap AI building means obvious regulation-triggered keyword categories commoditise within months. The surviving criterion: the moat must be something a weekend clone CANNOT copy — deep domain-specific document workflows with liability-grade audit trails, a maintained dataset, a fulfilment component, or a niche too small and unglamorous to attract the swarm — while still passing: buyer has no procurement function, async product, recurring duty, enumerable prospects, no free government/association tool doing the same job. Find every reason the concept FAILS. Pessimist with receipts.`

phase('Research')
const results = await parallel([
  () => agent(`${COMMON}
CONCEPT R1: Report-production and RICS-AI-compliance workflow for a NARROW surveying niche — party wall surveyors first (also assess dilapidations and damp/timber as alternates). The product drafts the statutory documents (party wall notices, schedules of condition, awards) from templates + photos + dictation, with the RICS 2026 AI-standard compliance artefacts built in (client disclosure, AI-suitability assessment, audit trail, named sign-off). Price £49-99/month per practice.
INVESTIGATE:
1. Saturation check FIRST: search "party wall software", "party wall surveyor software", "schedule of condition app", "dilapidations software UK", "surveyor report writing software UK 2026". What exists — GoReport, Kykloud, Imfuna, SurveyorSuite (is it expanding to party wall?), niche tools? Prices?
2. Population & enumerability: how many party wall surveyors practise in England/Wales (Faculty of Party Wall Surveyors membership, Pyramus & Thisbe Club membership, RICS specialism counts)? Are 24-30 customers a realistic share? Are practices limited companies?
3. Economics of the buyer: typical party wall surveyor fees per award/notice job in 2026, jobs per month for a sole practitioner, time spent producing awards/schedules. Does £79/month vs hours of Word formatting per job make an obvious financial argument?
4. Current workflow evidence: do they use Word templates? Any forum/community evidence (FPWS, P&T Club resources, LinkedIn groups) of tooling complaints?
5. The RICS AI standard (9 March 2026): confirm what it requires for a small practice using AI, and whether any vendor besides SurveyorSuite sells compliance-artefact tooling for it.
6. Legal sensitivity: party wall awards are quasi-judicial statutory documents (Party Wall etc. Act 1996) — what liability does a software vendor carry, and does professional culture accept software-drafted awards?
7. Demand-side: is party wall work growing or shrinking (construction activity, disputes)? Seasonality?
Verdict GO/CAUTION/KILL.`, { label: 'validate:party-wall', phase: 'Research', schema: SCHEMA }),

  () => agent(`${COMMON}
CONCEPT R2: Modern self-serve practice software for small UK funeral directors (1-3 branches) — arrangement records, statutory paperwork (cremation forms, burial documentation, coroner/registrar workflows, the 2024+ death-certification/medical-examiner process), first-call logging, invoicing/estimates against the FCA-adjacent CMA transparency rules. Published pricing £79-129/month flat — against incumbents that are quote-only/£400+.
INVESTIGATE:
1. Incumbent teardown with prices: Oak/Eulogy (funeralware), Funeral Manager (£? per funeral), Arranger, PlotBox, Seker/BDMS, Passare (US), any 2025-26 UK entrants. Which offer self-serve signup with published pricing? Free tiers?
2. Swarm check: is there a wave of new AI-built funeral software (search "funeral director software UK 2026", "funeral home software startup")? Or is the niche as unswarmed as hypothesised?
3. The buyer: ~5,000 UK funeral director businesses — how many are small independents vs Co-op/Dignity chains? Are independents limited companies? NAFD and SAIF member directories — public/enumerable? Do independents attend regional trade events?
4. The workflow pain: evidence of what small funeral directors actually run on (paper? Excel? early-2000s desktop software?). The 2024 medical examiner / death certification reform — did it create new admin? CMA price-transparency requirements (standardised price list) — ongoing compliance work?
5. Willingness to pay: what do independents pay for their current systems (Funeral Manager per-funeral ~£10-11 — what does that total for a 50-100 funeral/year firm)? Software budget evidence.
6. Retention/recurrence: is usage per-funeral (recurring by construction) and is the record system-of-record (sticky)?
7. Sensitivity check: any reputational/regulatory reasons a software vendor should avoid this sector (funeral plan FCA regulation 2022 — does record software touch regulated activity?).
Verdict GO/CAUTION/KILL.`, { label: 'validate:funeral', phase: 'Research', schema: SCHEMA }),

  () => agent(`${COMMON}
CONCEPT R3: Martyn's Law compliance system for ENHANCED-tier premises (800+ capacity) — designated senior individual records, vulnerability assessment workflow, public-protection procedures + measures documentation, drill/training logs, versioned compliance document with SIA-ready export. £99-149/month.
INVESTIGATE:
1. THE decisive number: how many enhanced-tier premises exist? The Home Office impact assessment (search extracts of the signed IA PDF; also SIA/ProtectUK publications) should quantify enhanced-tier premises (~800+ capacity). Also: what share are large organisations (stadia, arenas, chains, universities) with procurement functions vs independently-run venues an unknown vendor could sell to? This is the SOC-2-wall check and it may kill the concept.
2. Swarm check: search "Martyn's Law software", "Martyn's Law compliance tool/app/platform 2026" — how many vendors already sell this? (Prior research saw template sellers: Policy Pros, martynslawplan.co.uk, Sentinel Resilience — have SYSTEMS emerged since?) Security-industry incumbents (Halo, Trackforce, iAuditor/SafetyCulture templates) covering it?
3. Timing ground truth: SIA guidance status as of Aug 2026, confirmed commencement (Spring 2027 still?), whether enhanced-tier duties have published detail sufficient to build against NOW.
4. Standard-tier reconsideration: 100k+ premises at 200-799 capacity need PROCEDURES (not documents) — is there a cheaper mass product there (£19-29/mo procedures+drills log) despite the earlier "no compliance document required" finding? Who sells to them today?
5. The buyer reality: for an independent venue (theatre, large pub/club, events space) — who owns this task, what do they pay for adjacent compliance (fire risk assessments £300-800 one-off?), will they buy software vs a consultant's PDF?
6. SafetyCulture/iAuditor free-tier risk: does the generic inspection-app free tier already absorb this job?
Verdict GO/CAUTION/KILL.`, { label: 'validate:martyns-law', phase: 'Research', schema: SCHEMA }),
])

const done = results.filter(Boolean)
log(`${done.length}/3 round-two validation agents completed`)
return { results: done }