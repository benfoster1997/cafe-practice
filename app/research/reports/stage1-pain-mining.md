## Direct evidence of unmet business pain — UK SMEs, August 2026

### 0. Read this first: what I could and could not access

This dimension asked me to mine complaints. I have to be blunt that **the egress proxy blocked almost every primary complaint source**. Confirmed blocked in this session: `reddit.com` (blocked at both the fetch layer and at the search-index layer — the search API returns `400: domains not accessible to our user agent`), `capterra.com`, `capterra.co.uk`, `uk.trustpilot.com`, `apps.xero.com`, `accountingweb.co.uk`, `electriciansforums.net`, `community.screwfix.com`, and `www.gov.uk` itself.

What that means practically:
- **I could not do the Reddit/G2/Trustpilot 1-star mining you asked for.** Anything I say about it is second-hand from search extracts. I have flagged every instance.
- **I could not count app-marketplace listings or review counts** on Xero/QuickBooks/Shopify/HubSpot/AppSource. The marketplace gap analysis in section 4 is therefore weak and should be redone by a human with a browser. It is ~30 minutes of clicking.
- What I *could* verify well is **statutory forcing functions with dates, population sizes and penalties**. I'd argue this is actually stronger buy-signal evidence than complaint mining: a complaint tells you someone is annoyed; a statutory deadline tells you a nameable population *must* change behaviour by a known date or be fined. Annoyance rarely converts at £49/month. Deadlines do.

I have reweighted the report accordingly and I flag it as a deviation from the brief.

---

### 1. The single most important structural finding

For a solo non-coder doing their own sales at £0–60/month running costs, **the binding constraint is not "is there pain" — it is "can I enumerate and reach 300 buyers by hand."** UK SME pain is abundant; reachable, listable buyers are not.

That reframes the whole exercise. Rank opportunities by:
1. Is there a **statutory deadline** forcing a purchase decision in the next 6–18 months?
2. Is the buyer list **publicly enumerable** (a register, a licence list, a public dataset)?
3. Is the incumbent either **absent, enterprise-priced, or a free government portal**? (The third is a killer — see counter-evidence throughout.)

Only three or four of the pains below score on all three.

---

### 2. Statutory forcing functions — the highest-confidence evidence class

| Change | In force | Who it hits | Population | Penalty |
|---|---|---|---|---|
| **MTD for Income Tax** | Live since 6 Apr 2026; first quarterly deadline was **7 Aug 2026** (ten days ago) | Sole traders + landlords, qualifying income >£50k. Drops to £30k Apr 2027, £20k Apr 2028 | **864,000 in scope**; HMRC confirmed **~400,000 still unregistered** weeks before the deadline | Soft landing for 2026/27; points-based £200 penalties from Apr 2027 |
| **Digital Waste Tracking (DWTS)** | **1 Oct 2026** for permitted/licensed receiving sites (England, Wales, NI); **Jan 2027** Scotland; **Oct 2027** carriers/brokers/dealers | Waste sites, then every registered carrier | Not verified — see gaps | Waste duty-of-care offence framework |
| **Companies House software-only filing** | **1 April 2027** | *Every* company + LLP incl. dormant and micro. Web and paper filing routes close. iXBRL tagging required. Abridged accounts abolished | ~5m+ registered entities | Filing default penalties |
| **Payrolling benefits in kind** | **6 Apr 2027** (cars, car fuel, vans, van fuel, private medical), rest **Apr 2028**. Delayed 12 months from Apr 2026 at software vendors' request | Every employer providing BIK | — | PAYE penalties |
| **Employment Rights Act 2025 — zero/low hours** | **2027** (consultation on detail closed 25 Aug 2026) | Any employer using zero/low-hours: guaranteed-hours offers after a reference period (likely 12 weeks), reasonable shift notice, **pay for cancelled/curtailed shifts** | Hospitality, retail, care, security | Tribunal claims |
| **ERA 2025 — tipping** | **Oct 2026** | Must *consult workers* before introducing/changing a tipping policy (on top of the Oct 2024 Tips Act duties) | Hospitality | Tribunal |
| **Renters' Rights Act 2025 — PRS Database** | Rollout **late 2026** | Every private landlord, incl. single-property. Must be registered before letting or advertising | ~2.3m UK landlords (widely cited, not verified here) | Civil penalties from £7,000 up to £40,000; up to £5,000 for non-registration |
| **Martyn's Law (Terrorism (Protection of Premises) Act 2025)** | Statutory guidance **April 2026**; duties expected **~April 2027** | Standard tier = 200–799 expected capacity | Not verified — see gaps | Up to £10k standard tier |

Sources: [GOV.UK MTD deadline news](https://www.gov.uk/government/news/deadline-approaches-for-first-making-tax-digital-quarterly-update) (Jul 2026); [ICAS on ECCTA filing changes](https://www.icas.com/news-insights-events/news/charities/breaking-news-from-companies-house-on-filing-changes-under-eccta-2023); [Environment Agency blog, DWTS go-live, 30 Apr 2026](https://environmentagency.blog.gov.uk/2026/04/30/digital-waste-tracking-goes-live-a-major-step-forward-in-stopping-waste-crime/); [VWS on the Oct 2026 mandate](https://www.vwssoftware.com/digital-waste-tracking-explained-what-the-october-2026-mandate-means-for-uk-waste-operators/); [Saffery on mandatory payrolling from Apr 2027](https://www.saffery.com/insights/articles/mandatory-payrolling-of-benefits-in-kind-from-april-2027/); [Acas, Employment Rights Act 2025](https://www.acas.org.uk/employment-rights-act-2025); [Hill Dickinson ERA 2025 tracker](https://www.hilldickinson.com/our-view/articles/what-does-the-employment-rights-act-2025-contain/); [NRLA key dates](https://www.nrla.org.uk/news/renters-rights-act-2025-key-dates-for-landlords); [Terrorism (Protection of Premises) Act 2025 Statutory Guidance, April 2026 (PDF)](https://assets.publishing.service.gov.uk/media/69d7c1ff4abe5b6c5ddf26c9/Web_accessible_PDF_-_Terrorism__Protection_of_Premises__Act_2025_Stat_Guidance.pdf); [UKHospitality on tips and tronc, 2026](https://www.ukhospitality.org.uk/why-getting-tips-and-tronc-right-in-2026-matters-more-than-ever/).

---

### 3. Specific evidenced pains — user, workaround, why unsolved, and what kills it

#### PAIN 1 — "Did my client actually file?" MTD submission tracking for small accountancy practices
- **Exact user:** the practice manager / sole-practitioner accountant with 50–400 MTD-affected clients.
- **Current workaround:** spreadsheets. Practices are tracking client-by-client MTD readiness, sign-up status, quarter status and confirmation in Excel, because no single tool spans "clients using six different MTD products."
- **Evidence of the specific gap:** two independent, non-marketing failure modes are documented. First, the **"confirmation gap"** — *"the space between software saying an update has been sent and HMRC showing that it has been received… no standard HMRC acknowledgement… no universally recognised confirmation from HMRC, and even terminology varies from one provider to another"* ([AccountingWEB, 2026](https://www.accountingweb.co.uk/community/industry-insights/why-no-mtd-quarterly-update-penalties-doesnt-mean-no-problem)). Second, a **year-end blind spot** — *"many products designed for sole traders and landlords lack a full chart of accounts or customisable nominal codes, instead providing only the rigid expense categories prescribed by HMRC… creates a major blind spot for the annual tax return"* ([AccountingWEB](https://www.accountingweb.co.uk/tech/accounting-software/mtd-software-blind-spot-creates-year-end-headache-for-firms)).
- **Why incumbents haven't solved it:** the incumbents *are* the problem. Each vendor confirms only its own submissions; the practice needs a cross-vendor status board. AccountingWEB's own framing: *"MTD isn't a software problem. It's an operations problem."*
- **Demand proxy:** 864k taxpayers in scope, 400k unregistered at the first deadline, threshold drops to £30k in Apr 2027 and £20k in Apr 2028 — the affected population roughly triples over 24 months.
- **What kills it:** HMRC could ship a proper agent-facing status API/dashboard. A competitor already exists — `checkmymtd.co.uk` surfaced in search. Accountants are notoriously slow buyers and are already drowning in practice-management subscriptions.
- **Score:** deadline ✅ / enumerable buyers ✅ (ICAEW, ACCA, AAT member directories are public) / incumbent gap ✅.

#### PAIN 2 — Digital Waste Tracking for small waste carriers, brokers and dealers
- **Exact user:** the 1–15 vehicle skip hire / muckaway / grab hire / house-clearance operator, and the waste broker.
- **Current workaround:** carbon-copy paper waste transfer notes; season-ticket annual WTNs in a folder.
- **Evidence:** *"Paper waste transfer notes are no longer sufficient from October 2026 — digital DWTS logs are the legal requirement."* Phase 1 (1 Oct 2026) hits permitted/licensed receiving sites; **carriers/brokers/dealers are mandated from October 2027, with public beta from spring 2027**. Data goes in by **API, CSV upload, or a secure online portal**. Editing/creating records costs **£26/year**. Carrier registration itself is £184 initial / £125 renewal ([EA blog](https://environmentagency.blog.gov.uk/2026/04/30/digital-waste-tracking-goes-live-a-major-step-forward-in-stopping-waste-crime/), [Innovent](https://www.innovent-recycling.co.uk/defra-digital-waste-tracking-uk), [Access Group](https://www.theaccessgroup.com/en-gb/waste-management/mandatory-digital-waste-tracking/)).
- **Why unsolved:** existing UK waste software (AMCS, Isis, Weighsoft, VWS) is priced and built for weighbridge operators and multi-site MRFs, not for a 4-truck grab-hire firm. Nobody has shipped a phone-first "driver taps three things at the tip, DWTS record is created" tool at trade prices.
- **What kills it — and this is serious:** DEFRA is providing a **free government portal and free CSV upload**. A one-man skip firm doing 12 loads a day may simply use the free portal. Your product only survives if the driver-side capture is dramatically faster than the portal. That is a real but narrow wedge, and it is unproven.
- **Score:** deadline ✅ (Oct 2027, with beta from spring 2027 — this is *the* timing to build for) / enumerable buyers ✅✅ (the Environment Agency public register of waste carriers is downloadable — the single best cold-call list in this whole report) / incumbent gap ✅ but undercut by a free portal ⚠️.

#### PAIN 3 — Shift-notice and cancelled-shift evidencing under the Employment Rights Act 2025
- **Exact user:** the 2–6 site pub group, café chain, care agency or security firm; 15–80 staff, mostly zero/low hours.
- **Current workaround:** rota printed and pinned in the back office; changes made in a **WhatsApp group**; hours reconciled into a spreadsheet for payroll.
- **Evidence:** from 2027 employers must offer guaranteed-hours contracts reflecting a reference period (anticipated 12 weeks), give reasonable notice of shifts and shift changes, and **pay workers when a shift is cancelled, moved or cut short**. Legal advisers are explicitly telling employers to *"check their record-keeping systems are detailed enough… and be able to track working patterns over the reference period"* ([Eversheds Sutherland](https://www.eversheds-sutherland.com/en/united-kingdom/insights/the-employment-rights-bill-zero-and-low-hours-provisions), [Farrer & Co](https://www.farrer.co.uk/news-and-insights/employment-rights-bill-spotlight-on-changes-to-zero-hours-contracts/)).
- **Why incumbents haven't solved it:** every UK rota product (RotaCloud, Planday, Deputy, Findmyshift) schedules forward. Almost none produce the *backward-looking evidential artefact* — "here is the notice we gave, here is the change we made, here is the compensation owed" — that a tribunal will ask for. That's the new requirement and the products predate it.
- **Real complaint evidence (thin, via Capterra UK snippets):** *"extremely fiddly both to set up and operate,"* *"the order of shifts can be very difficult to navigate,"* *"cannot phone anyone for support, frequent glitches and no square integration is very painful,"* *"unable to duplicate shifts, which means all shifts need to be typed in manually"* ([Capterra UK rota software listings](https://www.capterra.co.uk/software/137099/rotacloud)). Weight this lightly — I could not open the pages or verify star ratings.
- **What kills it:** the incumbents will bolt this on. They have the distribution and this is a feature, not a product. Also the regulations were still in consultation until 25 Aug 2026, so the exact record requirements aren't fixed — building now is building on sand.
- **Score:** deadline ⚠️ (2027, details unfixed) / enumerable buyers ⚠️ / incumbent gap ⚠️ (features get absorbed).

#### PAIN 4 — Tips allocation records under the Tips Act + Oct 2026 consultation duty
- **Exact user:** independent restaurant / pub / bar owner, 1–3 sites.
- **Current workaround:** a spreadsheet, or a tronc-master's notebook, plus a Word policy document written once in 2024 and never touched.
- **Evidence:** since 1 Oct 2024 employers must pass 100% of tips on, fairly, distributed by the end of the following month, with a **written policy and records kept for three years**. From **Oct 2026, consulting workers before introducing or changing a tipping policy is a legal requirement** under ERA 2025. There is live litigation on whether tronc paid via PAYE attracts holiday pay, with *"potential financial impact… particularly for single-site businesses, estimated at £10,000 or more per year"* ([Charles Russell Speechlys, 2026](https://www.charlesrussellspeechlys.com/en/insights/expert-insights/employment/2026/the-employment-allocation-of-tips-act-2023--practical-impact-since-implementation/); [UKHospitality](https://www.ukhospitality.org.uk/why-getting-tips-and-tronc-right-in-2026-matters-more-than-ever/)).
- **Why unsolved:** the same source concedes *"for small operators with modest tip volumes, compliance may be manageable with a clear policy, timely payments and basic record-keeping."* **That sentence is the counter-evidence and you should take it seriously.** The people with real pain are large groups — who buy from Access, Fourth or a tronc consultancy, not from you.
- **Score:** deadline ✅ / enumerable buyers ✅ (FSA Food Hygiene Rating Scheme data is a public, downloadable dataset of every UK food business with address) / incumbent gap ❌ — **the small end may not have enough pain to pay.**

#### PAIN 5 — Food safety / SFBB diaries still on paper
- **Exact user:** the independent café, takeaway, bakery, pub kitchen.
- **Current workaround:** literally a printed book. The 2026 edition of the Safer Food Better Business pack — *13-month diary, 13-month fridge/cold-room temperature records, laminated allergen sign* — is a current-selling physical product on Amazon UK ([listing](https://www.amazon.co.uk/Business-Updated-Caterers-Restaurants-Takeaways/dp/B0DNFJ2PL9)). **A paper product still being manufactured and sold in 2026 is direct, unfaked evidence of a paper workflow.**
- **Why the pain exists:** *"the businesses that get caught out by inspections are almost never doing something wrong — they are doing things right but not recording it consistently"* ([Culinary Key, 2026](https://www.culinarykey.co.uk/resources/the-best-food-safety-apps-for-uk-businesses-in-2026)).
- **What kills it — decisively:** this category is **already saturated and partly free**. FoodDocs, ukfoodsafety.app, Forkto, TempTake and others already ship UK-specific digital SFBB, and at least one advertises a **free** tier. On top of that, the FSA's March 2025 written-allergen guidance is **best practice guidance, not law** ([FSA press release, 7 Mar 2025](https://www.wired-gov.net/wg/news.nsf/articles/updated+industry+guidance+issued+for+food+allergen+information+in+the+outofhome+sector+07032025102500)) — so there is no statutory forcing function, and a café owner on 4% margins will keep using the £15 paper book. **I would not build here.**

#### PAIN 6 — Trade job management: real price and complexity complaints, but a brutal market
- **Evidence of complaint:** a UK electrician on Electricians Forums: *"Simpro is OK but is very expensive"* — and reports going to a custom system instead as cheaper ([thread](https://www.electriciansforums.net/threads/what-job-management-software-do-you-use.122386/), accessed via search extract; the forum itself is proxy-blocked). Joblogic Capterra reviewers report it is **slow, has poor accounting integration, and "there is a lot to learn and it is not always obvious how things connect"** ([Capterra](https://www.capterra.com/p/134632/JobLogic/reviews/)). Market structure: entry tier £19–£40/user/month, **Commusoft from ~£59/month**, Joblogic/Commusoft *"priced for six-plus-engineer operations rather than sole traders"*, simPRO and BigChange enterprise.
- **Why I'd avoid it anyway:** this is the most crowded SMB software category in the UK. Tradify, Powered Now, Fergus, YourTradebase, Payaca, plus a dozen new entrants. There is no deadline, and the buyer is a price-sensitive sole trader with high churn. The complaints are real; the market is not winnable by a solo non-coder.

#### PAIN 7 — Construction CDM / RAMS paperwork
- **Population:** construction is **the largest UK sector by business count — 885,485 businesses, 15.6% of all UK businesses** ([DBT Business Population Estimates 2025, via ONS/Commons Library](https://www.ons.gov.uk/businessindustryandtrade/business/activitysizeandlocation/bulletins/ukbusinessactivitysizeandlocation/2025)).
- **Critical competitive evidence:** **The Site Book** (thesitebook.co.uk) is already doing exactly the thing this brief is describing — UK-specific CDM 2015 compliance, RAMS/CPP/COSHH/inductions/toolbox talks — at **£39/month or £360/year**, with a free starter tier and a £199/month business tier ([pricing page](https://thesitebook.co.uk/pricing)).
- **Why this matters more as *proof* than as a target:** £39/month is almost exactly the owner's £49 price point. This is the strongest single piece of evidence in the report that **a narrow, UK-statute-specific, flat-rate compliance micro-SaaS at ~£40/month is a real business someone is actually running.** But it also means this specific niche is taken, by an operator running an aggressive comparison-page SEO strategy.

---

### 4. App marketplace gap analysis — weak, flagged

I could not open the marketplaces. What I could establish: the Xero App Store UK carries **1,000+ add-ons**; its own merchandising organises around industry (hospitality, retail) and pain points. In hospitality the surfaced apps are broad platforms (Loaded: rostering, timeclocks, recipe costing, menu management, margin analysis, stocktaking). I found **no** UK-specific allergen-compliance app surfaced in the Xero hospitality category — the search-model's own summary was *"limited specific information about allergen compliance features."* That is suggestive of a gap and nothing more; it may just be a search artefact. **Do not act on this without opening the marketplace and counting listings and review volumes manually.**

---

### 5. Sizing numbers you can rely on

- **5.69 million** UK private-sector businesses (2025), employing ~28.1 million people.
- **4.27 million** have **no employees** — i.e. three-quarters of the population is a one-person business. This is the population most reachable and least able to pay £49/month. Price accordingly or sell up-market.
- **5.4 million micro businesses**; 99.9% of UK businesses are SMEs, 95% micro.
- **Construction: 885,485** businesses (largest sector, 15.6%).
- **Accommodation and food services: 233,080** businesses.
- Care software price anchors: **£12–£35 per carer per month**; single-site care home **£100–£350/month** ([Unique IQ, 2026](https://www.uniqueiq.co.uk/resource/care-software-pricing-2026/)).

At 48 customers, the owner needs **0.0008% of UK businesses**. Market size is genuinely irrelevant here; reachability and retention are everything.

---

### 6. Counter-evidence I want on the record

Three things in this report are traps, and I'd rather flag them than have them found later:

1. **Companies House software-only filing looks like a gift and probably isn't.** Companies House has **confirmed a free filing tool will be available for small companies, micro entities and dormant companies** who want to self-file ([Barnes Roffe](https://barnesroffe.com/insights/changes-to-small-company-filing-options-from-april-2027/), [Just Dormant Accounts](https://www.justdormantaccounts.co.uk/post/companies-house-software-only-filing-from-2027-dormant-companies)). The government is going to eat the simplest, highest-volume segment for free. Do not build a micro-entity filing tool.
2. **DEFRA's DWTS gives away a free portal and free CSV upload.** Same shape of risk.
3. **Free-with-banking bookkeeping.** I did not verify this in-session and flag it as an unverified recollection, but I believe FreeAgent is bundled free with NatWest/RBS/Mettle business current accounts. If so, the floor price for UK sole-trader bookkeeping is £0 and the whole MTD-for-sole-traders category is unwinnable on price. **Verify this before considering anything in that space.**

The general lesson: in UK compliance software, the state is a competitor, and it prices at zero. The defensible ground is the **workflow around the mandated submission** (evidence capture, chasing, multi-client status, driver/phone-side data entry), never the submission itself.

---

### 7. Honest assessment of this dimension

The complaint-mining brief was largely unexecutable in this environment, and I don't want to dress up regulatory research as complaint evidence. What I have is: two genuinely strong statutory forcing functions with hard dates and a real buyer list (MTD tracking for practices; DWTS for waste carriers), one strong competitive proof point that the £39/month UK compliance micro-SaaS model works (The Site Book), one saturated-and-partly-free category I'd actively steer away from (food safety), and a handful of thin, second-hand review complaints that would not survive scrutiny on their own.

## OPPORTUNITIES SURFACED
RANKED, with who buys / what pain / what they pay today / why now.

1. MTD CLIENT-STATUS TRACKER FOR SMALL ACCOUNTANCY PRACTICES — Buyer: sole practitioner or 2-8 person practice with 50-400 MTD clients (public buyer lists: ICAEW, ACCA, AAT, CIOT member directories). Pain: cannot see, across six different client-chosen MTD products, who has signed up with HMRC, who has submitted, and whether HMRC actually received it — the documented "confirmation gap". Today they pay: nothing; they run it in Excel. Why now: 864k taxpayers in scope with ~400k unregistered at the first deadline (7 Aug 2026); threshold drops to £30k Apr 2027 and £20k Apr 2028, roughly tripling the affected population, and the penalty soft-landing ends April 2027. Price: £49-£99/month per practice is easy — it protects them from client penalties. 24-48 practices is a realistic hand-sold target. Risk: checkmymtd.co.uk already exists; HMRC could ship an agent dashboard.

2. DRIVER-SIDE DIGITAL WASTE TRACKING CAPTURE FOR SMALL CARRIERS — Buyer: 1-15 vehicle skip hire, grab hire, muckaway and clearance firms. THE key advantage: the Environment Agency public register of waste carriers, brokers and dealers is a downloadable list of every single prospect with contact details — the best cold-outreach list in this entire report for someone doing sales by hand. Pain: carbon-copy paper transfer notes become non-compliant; mandation October 2027 with public beta spring 2027. Today they pay: £184/£125 registration plus £26/year DWTS access, and nothing for software; incumbents (AMCS, Weighsoft, VWS) are weighbridge-scale. Why now: build through 2026, be in the spring 2027 beta, sell into the Oct 2027 deadline. Timing is close to perfect for a months-not-years runway. HONEST RISK: DEFRA ships a free portal and free CSV upload, so the only defensible wedge is that the driver captures the load at the tip on a phone in 15 seconds. If that wedge isn't real, this dies.

3. SHIFT-NOTICE EVIDENCE LAYER FOR ERA 2025 — Buyer: 2-6 site hospitality/care/security employers, 15-80 mostly zero-hours staff. Pain: from 2027 they must evidence notice given, changes made, and compensation owed for cancelled/curtailed shifts; every existing rota tool schedules forward and produces no backward-looking tribunal-ready artefact. Today: rota on the wall, changes over WhatsApp, hours reconciled in Excel. Why now: regulations firm up after the 25 Aug 2026 consultation. WEAKER: this is a feature RotaCloud/Planday/Deputy will absorb, and the buyer list is not enumerable. Treat as a fast-follow, not a first bet.

4. WHAT I WOULD NOT BUILD — Micro-entity Companies House filing (free government tool confirmed). Digital SFBB/food safety (saturated, free tiers, and the FSA allergen rule is guidance not law). Trade job management (most crowded UK SMB category, no deadline, high-churn sole-trader buyer). Sole-trader bookkeeping (likely £0 floor via bank-bundled FreeAgent — verify).

CROSS-CUTTING RULE THIS RESEARCH SUPPORTS: in UK compliance software the state is a competitor that prices at zero. Never sell the mandated submission itself. Sell the workflow around it — evidence capture, chasing, cross-client status, phone-side data entry — and pick pains where the buyer list is a public register you can work through by hand.

## KEY CLAIMS
- 864,000 UK sole traders and landlords were in scope for MTD for Income Tax at its first quarterly deadline (7 August 2026), and HMRC confirmed roughly 400,000 of them were still not registered for MTD in the final weeks before it — implying high, live non-compliance right now.
  SOURCE: https://www.gov.uk/government/news/deadline-approaches-for-first-making-tax-digital-quarterly-update (accessed 17 Aug 2026 via search extract; gov.uk is proxy-blocked for direct fetch)
- From 1 April 2027 Companies House closes web and paper accounts filing entirely; all companies and LLPs including dormant and micro entities must file via commercial software with iXBRL tagging, and abridged accounts are abolished. BUT Companies House has confirmed a FREE filing tool for small, micro and dormant companies — which removes the obvious opportunity.
  SOURCE: https://barnesroffe.com/insights/changes-to-small-company-filing-options-from-april-2027/ and https://www.icas.com/news-insights-events/news/charities/breaking-news-from-companies-house-on-filing-changes-under-eccta-2023
- Digital Waste Tracking becomes mandatory for permitted/licensed waste receiving sites on 1 October 2026 (England, Wales, NI; Scotland January 2027), and for waste carriers, brokers and dealers from October 2027 with public beta from spring 2027. Paper waste transfer notes cease to be sufficient. Access is via API, CSV upload or a free government portal, at £26/year per record-creating organisation.
  SOURCE: https://environmentagency.blog.gov.uk/2026/04/30/digital-waste-tracking-goes-live-a-major-step-forward-in-stopping-waste-crime/ and https://www.vwssoftware.com/digital-waste-tracking-explained-what-the-october-2026-mandate-means-for-uk-waste-operators/
- 'The Site Book', a UK-specific CDM 2015 / RAMS compliance micro-SaaS, sells at £39/month (£360/year) with a free starter tier and a £199/month business tier — direct proof that a narrow, UK-statute-specific compliance tool sustains almost exactly the owner's target price point.
  SOURCE: https://thesitebook.co.uk/pricing
- MTD has two documented software-level gaps independent of vendor marketing: a 'confirmation gap' (no standard HMRC acknowledgement of receipt, terminology varies by provider) and a year-end blind spot (sole-trader/landlord products offer only HMRC's rigid expense categories, no full chart of accounts or customisable nominal codes).
  SOURCE: https://www.accountingweb.co.uk/community/industry-insights/why-no-mtd-quarterly-update-penalties-doesnt-mean-no-problem and https://www.accountingweb.co.uk/tech/accounting-software/mtd-software-blind-spot-creates-year-end-headache-for-firms
- Employment Rights Act 2025 will from 2027 require guaranteed-hours offers based on a reference period (anticipated 12 weeks), reasonable notice of shifts and shift changes, and payment when a shift is cancelled, moved or cut short — with legal advisers explicitly warning employers their record-keeping systems are not detailed enough to evidence this. Regulatory detail was still in consultation until 25 August 2026.
  SOURCE: https://www.eversheds-sutherland.com/en/united-kingdom/insights/the-employment-rights-bill-zero-and-low-hours-provisions and https://www.acas.org.uk/employment-rights-act-2025
- There were 5.69 million UK private-sector businesses in 2025, of which 4.27 million have no employees; construction is the largest sector at 885,485 businesses (15.6%) and accommodation and food services accounts for 233,080. The owner's 48-customer target is ~0.0008% of the population, so market size is irrelevant and reachability is the binding constraint.
  SOURCE: https://www.ons.gov.uk/businessindustryandtrade/business/activitysizeandlocation/bulletins/ukbusinessactivitysizeandlocation/2025 (DBT Business Population Estimates 2025)
- The FSA's written-allergen-information requirement for non-prepacked food (March 2025, England/Wales/NI) is BEST PRACTICE GUIDANCE, not law — so it is not a genuine forcing function, and the digital SFBB/food-safety category already has multiple UK incumbents including free tiers.
  SOURCE: https://www.wired-gov.net/wg/news.nsf/articles/updated+industry+guidance+issued+for+food+allergen+information+in+the+outofhome+sector+07032025102500
- Renters' Rights Act 2025 phase two introduces a mandatory PRS Landlord Database from late 2026 covering every private landlord including single-property landlords, with penalties up to £5,000 for non-registration and civil penalties from £7,000 up to £40,000 for serious or repeated breaches.
  SOURCE: https://www.nrla.org.uk/news/renters-rights-act-2025-key-dates-for-landlords
- Documented UK trade-software complaints: Joblogic reviewers report it is slow with poor accounting integration and a steep, non-obvious learning curve; a UK electrician describes Simpro as 'very expensive' and moved to a custom system as cheaper; Commusoft/Joblogic are 'priced for six-plus-engineer operations rather than sole traders' (entry tier £19-£40/user/month, Commusoft from ~£59/month).
  SOURCE: https://www.capterra.com/p/134632/JobLogic/reviews/ and https://www.electriciansforums.net/threads/what-job-management-software-do-you-use.122386/ (both accessed only via search extracts — domains proxy-blocked)
- Mandatory payrolling of benefits in kind starts 6 April 2027 for cars, car fuel, vans, van fuel and private medical (rest April 2028), having been delayed a full year from April 2026 specifically because payroll software providers and employers said they could not integrate systems in time.
  SOURCE: https://www.saffery.com/insights/articles/mandatory-payrolling-of-benefits-in-kind-from-april-2027/
- The 2026 edition of the paper Safer Food Better Business pack — including a 13-month diary and 13-month fridge/cold-room temperature record book — is a current commercial product on Amazon UK, which is unfaked evidence that UK food-business temperature and hygiene logging is still a paper workflow in 2026.
  SOURCE: https://www.amazon.co.uk/Business-including-Comprehensive-Restaurants-Takeaways/dp/B0DNFJ2PL9

## GAPS
MAJOR — the core of this brief was not executable. The egress proxy blocked, and I confirmed blocked, every primary complaint source: reddit.com (blocked at BOTH the fetch layer and the search-index layer — the search API returns "400: domains not accessible to our user agent", so there is no workaround from this environment), capterra.com, capterra.co.uk, uk.trustpilot.com, apps.xero.com, accountingweb.co.uk, electriciansforums.net, community.screwfix.com, and www.gov.uk. I therefore did NOT do the Reddit / G2 / Trustpilot 1-3 star mining or the app-marketplace listing-and-review-count analysis that this dimension was defined by. Everything I report from those sources is a second-hand search-engine extract, and I have marked each one. A human with an ordinary browser can close most of this gap in about two hours; that is the single highest-value follow-up.

SPECIFIC UNVERIFIED ITEMS:
- App marketplace gap analysis (Xero, QuickBooks, Shopify, HubSpot, AppSource): essentially not done. My one suggestive finding — no UK allergen-compliance app surfaced in Xero's hospitality category — may be a search artefact. Do not act on it. Needs manual listing counts and review-volume counts per category.
- Review complaint text: I have a handful of Capterra UK snippets on rota software ("extremely fiddly", "cannot phone anyone for support", "unable to duplicate shifts") and Joblogic ("slow", "poor integration with accounting software"). I could not verify star ratings, review counts, reviewer country, or company size, and I could not confirm these came from 1-3 star reviews rather than the cons field of positive ones. Weight low.
- Number of premises in Martyn's Law standard tier: NOT FOUND. The impact assessment gives £330/year per standard-tier premises but I could not extract the population count. This materially affects whether that opportunity is worth anything.
- Number of registered UK waste carriers, brokers and dealers: NOT FOUND. This is load-bearing for opportunity #2 — it determines whether the addressable list is 5,000 or 60,000. Get it from the Environment Agency public register directly.
- Number of UK landlords (I cite ~2.3m as widely-quoted but did NOT verify it in this session), and the PRS Database annual fee (still TBC by government).
- FreeAgent being bundled free with NatWest/RBS/Mettle business accounts: this is my recollection, NOT verified in this session. It is potentially decisive against anything in sole-trader bookkeeping and must be checked.
- No UK trade Facebook groups were reachable at all; no evidence from them.

CONFIDENCE: HIGH on the statutory forcing functions, their dates, and the UK business population figures — these are consistent across multiple independent professional-services sources. MEDIUM on the "why incumbents haven't solved it" reasoning, which is inference from product positioning rather than from user testimony. LOW on everything derived from review sites and forums, for the access reasons above. The overall shape of the recommendation (deadline + enumerable buyer list + no free government substitute) rests on the high-confidence material, so it survives the gaps; the specific product details do not.