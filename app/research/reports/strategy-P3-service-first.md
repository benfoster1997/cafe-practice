## P3 — SERVICE-FIRST / PRODUCTISED SERVICE: honest assessment

### Bottom line first

P3 is the **best-scoring path of the ones described for reaching the £2,335 number**, and simultaneously the **worst path for satisfying the mission brief as written** (`/home/user/cafe-practice/docs/APP_MISSION_BRIEF.md`: "Identify, validate, build, launch… a **software product** capable of ≥£2,000/month recurring revenue"). Those two sentences are the whole finding. Everything below is the arithmetic and the evidence behind them.

The reason P3 scores better on the number is not motivational, it is arithmetic: **£2,335/month needs 6 clients at £400, not 24–30 customers at £79–99.** Every one of the eight prior kills was ultimately a distribution kill — the founder could not get 24–30 strangers to find, trust and buy from an unknown. Six is a fundamentally different problem from twenty-four, and it is the only structural change any of these paths has offered.

The reason it fails the brief is also structural, and I'll argue it hard in §4: in AI-mediated services in 2026, **the repeatable part is already automated (that is why a non-technical founder can deliver at all), and the part clients pay for is the non-repeatable part — accountability.** You cannot productise accountability. The software you would extract from the service is precisely the low-value residue, and that residue is a thin wrapper any competitor ships in a week — i.e. straight back into mechanism (a), SWARM.

---

### 1. Do productised services become software businesses? Evidence both ways

**Documented agency→SaaS transitions exist, and every credible one I found was run by people who could build software themselves.**

- Mailchimp was started as a side project *inside* Ben Chestnut and Dan Kurzius's web design agency, with the agency kept running to pay the bills while the product grew ([imfounder](https://imfounder.com/entrepreneurship/bootstrapped-startups-2026/)). The agency was a *web design* agency — the founders were the build capacity.
- Typeform emerged from two web design/build agencies sharing a co-working space; a client project became a standalone product ([davidhart](https://davidhart.substack.com/p/agencies-who-switched-to-saas)).
- Freshdesk/Freshworks, BotsCrew, Botmakers — same shape: technical service firms extracting a product from repeated client work ([Gamaniuk](https://oleksandr-gamaniuk.medium.com/bot-agencies-that-made-their-own-products-and-became-saas-companies-827d3c8b3ebd)).

**This is a real asymmetry and it cuts both ways for this founder.** The classic reason agencies fail to ship product is that the people who would build it are billing. Here, Claude is the build capacity and is not billable — so the classic bottleneck genuinely does not apply. That is the strongest single argument in P3's favour and I am not going to under-sell it. What Claude does *not* replace is the founder's judgement about *what* to build, and (see §4) the thing worth building may not exist.

**Evidence in the other direction is stronger than the pro-case and is more recent.** The most instructive case I found runs *backwards*: Icon pivoted **from** a $39/month self-serve SaaS **to** a $1,000–$3,000/month "Managed Service" tier — described as "empirical proof that their automated software failed to deliver a viable end product without massive human-in-the-loop intervention" ([jtbd.one](https://www.jtbd.one/p/destroying-the-saas-multiple-how)). A 2026 AI company found that the software could not deliver the outcome and the human had to be put back in. That is the exact transition P3 assumes it can run in reverse.

Supporting: 88% of SaaS failures are attributed to mistimed pivots — too early destroys momentum, too late exhausts runway ([saasfactor](https://www.saasfactor.co/blogs/pivot-or-persevere-how-saas-founders-can-make-data-informed-decisions-for-business-success)) — and the canonical agency failure mode is "working IN the business, not ON the business" ([e2m](https://www.e2msolutions.com/blog/common-mistakes-agency-owners/)). Neither is a hard statistic; both are the consensus folk-diagnosis, and both point the same way.

**Verdict on Q1:** productised service → sustainable business: well evidenced. Productised service → *software* business run by a non-technical operator: I found **no documented case**. Absence of evidence in a heavily-blogged space is weak evidence of absence, and I'm treating it that way.

### 2. Is the AI-done-for-you market itself swarmed? Yes — at the generic layer, completely

- Fiverr's own 2026 cost guide puts AI automation experts at **$75–$520 per project, $18–$150/hour**, with "most sellers in the Make.com and n8n category pricing between $100 and $300 for a single scenario build" ([Fiverr](https://www.fiverr.com/resources/guides/costs/ai-automation-experts)). That is the market-clearing price for generic AI automation labour and it is *below UK minimum-viable rates* once you account for scoping and revisions.
- The AI-agency community's own reading: "If your offer is 'I build AI automations for businesses using n8n and Make,' you're competing with thousands of operators globally, many charging less than you" ([Ciela](https://ciela.ai/blogs/is-ai-agency-market-saturated-reddit)). Self-serving source (they sell to agencies), but the claim is the pessimistic one, which makes it more credible, not less.
- Upwork reported AI-related freelance skill demand **up 109% YoY** in Feb 2026, with prompt-writing now "the baseline expectation" rather than a premium skill ([Upwork rates](https://www.upwork.com/resources/upwork-hourly-rates)). Demand is growing *and* the floor skill is worthless — both true at once.

**But — and this is the key distinction — the swarm operates on the *offer*, not on the *relationship*.** A swarmed category kills a product that needs 30 strangers to discover and choose it from a search result. It does much less damage when you need six specific people to say yes to a person who phoned them and offered to take a job off their desk. Mechanism (a) is a discovery-channel mechanism. Services bought by outbound don't use that channel.

Where the swarm *does* bite in P3: any niche where a **product** already sells the outcome. UK AI receptionists are already a crowded product market at **£49–£299/month with unlimited calls** (Hey Jodie £49/£99/£199; Softomate from £299; plus Smith.ai, Goodcall, Synthflow) ([heyjodie](https://heyjodie.com/en-gb/guides/best-ai-receptionist/), [softomate](https://www.softomatesolutions.com/blog/ai-receptionist-pricing-uk/)). Reselling into that is a zero-margin channel play. Rule that follows: **the service must sell an outcome no shipped product currently sells.**

### 3. The economics, modelled explicitly

**Capacity inputs (evidence):**
- Solo productised-service operators run **4–8 clients** depending on scope, with AI tooling raising the ceiling since 2022; solo social media managers cap at 5–8 accounts before quality degrades ([brainy.ink](https://brainy.ink/paper/productized-design-services)). Soft source, but consistent with the MSP and account-management literature (recommended billable cap 15–25 h/week for full-timers, [Databox](https://databox.com/how-many-accounts)).
- Comparable delivery load: UK bookkeeping runs **2–8 hours/month per client** for £150–£950/month ([alto](https://www.alto-accounting.com/insights/bookkeeping-services-cost), [acenteus](https://acenteus-cca.com/blog/outsourced-bookkeeping-costs-in-uk)). That is the realistic benchmark for a document/admin-shaped monthly service.
- Churn: small agencies (1–10 people) run **~25–32% annual client churn**, vs 15% for 51+ staff; **most churn happens in the first six months** ([Focus Digital](https://focus-digital.co/average-marketing-agency-churn/), [Promethean](https://prometheanresearch.com/client-retention-rate/)). ≈2–2.5%/month. Notably *better* than typical SMB SaaS churn.

**Founder inputs:** evenings/weekends. Sustained realistic figure: 2h × 5 weeknights + 6h weekend ≈ **16 h/week ≈ 70 h/month**. Anything above that is not sustainable for 24 months alongside a job.

**Acquisition cost, in hours (this is the number that decides everything):**
- Cold-call dial→meeting benchmarks for 2026 span **1 meeting per 40 dials (2.5%, average)** to **~200+ dials (Bridge Group)** to **1 per 370 on poor data**; connect rates 8–12% on generic lists, 18–22% on verified direct dials ([Belkins](https://belkins.io/blog/cold-calling-benchmarks), [skipcall](https://skipcall.io/en/blog/cold-call-connect-rate-benchmarks), [Optifai](https://optif.ai/learn/questions/cold-call-to-meeting-conversion-rate/), [Cleverly](https://www.cleverly.co/blog/cold-calling-statistics)). For micro-businesses where the "direct dial" is the owner's mobile, take **100–200 dials per booked conversation**.
- Meeting→paying client for an unknown solo seller, £400/mo, cancel-anytime, no case studies: **15–25%**. Inference, not measured. Use 20%.
- ⇒ **500–1,000 dials per client won ⇒ at ~20 dials/hour, 25–50 hours of calling per client.**
- Six clients ⇒ **150–300 hours of outbound**, plus ~1.5–2 clients/year replaced for churn.

**The model (base case, assuming sustained effort):**

| Period | Clients | MRR @£400 | Delivery h/mo (@4h) | Outbound h/mo | Total h/mo |
|---|---|---|---|---|---|
| M1–3 | 0–1 | £0–400 | 0–8 | 20 | 20–28 |
| M4–6 | 2–3 | £800–1,200 | 12–20 | 18 | 30–38 |
| M7–12 | 3–5 | £1,200–2,000 | 16–28 | 15 | 31–43 |
| **M13–18** | **5–7** | **£2,000–2,800** | 24–32 | 12 | 36–44 |
| M19–24 | 6–8 | £2,400–3,200 | 28–36 | 10 | 38–46 |

**Target crossed around month 15–18** in the base case, inside the 24-month window with margin. Effective rate at target: £2,600 ÷ ~44 h ≈ **£59/hour** — genuinely decent side income.

**Pessimistic case — and this is the realistic one for months 1–9:** delivery is unsystematised at 7–8 h/client/month. Seven clients ⇒ 50 h/mo delivery + 12 h outbound + 8 h admin = **70 h/month = the entire capacity budget, with zero hours left to build anything.** Effective rate £37/hour. Still a viable job. Still no software.

**Answering the question directly: does £2,335 arrive faster this way than via SaaS?** Yes, materially — because the customer count needed is 4–5× lower and because the sales motion is one the founder can actually execute. But it arrives as **earned income with a hard capacity ceiling of roughly £3,000–4,500/month**, not as recurring software revenue. A 6-client owner-delivered service has essentially no resale value; if the founder stops working, revenue stops within one month.

### 4. The trap, quantified

The trap is not "the service takes all the time" in the abstract. It has a specific numeric threshold:

> **The software only gets built if delivery drops below ~3.5 hours per client per month.** At 4h × 7 clients you have ~26 h/month spare. At 7h × 7 clients you have zero.

That is the metric to run the business on, and it is measurable from week one if the founder keeps a time log. It is also the honest reason to be pessimistic: the hours-per-client that make the software possible are the same hours-per-client at which the client starts asking what they're paying for.

**The deeper problem, which I think is decisive.** In 2026 the mechanical, repeatable portion of a document/admin service is *already* automated — by Claude, on day one. That is the entire premise that lets a non-technical founder deliver at all. So when the founder later "extracts the repeated workflow into software", what is being extracted is a prompt chain and a form. Everything the client is actually paying for — that a named person checked it, chased it, and is answerable for it — is what remains, and it does not compile. The Icon case is the empirical demonstration of exactly this force, observed running in the opposite direction ([jtbd.one](https://www.jtbd.one/p/destroying-the-saas-multiple-how)).

Corollary: if the extracted software *were* valuable and standalone, mechanism (a) applies to it at full strength and the founder is back at square one, competing on discovery against clones — except now with six clients' worth of delivery obligations eating the evenings.

### 5. Niche candidates — named, then attacked

Filter: no qualification or statutory sign-off required; Claude supplies the competence; deliverable asynchronously in evenings; no shipped product already sells the outcome; recurring; buyer reachable without a network.

**a) Bookkeeping / monthly accounts prep.** £150–950/mo, 2–8 h/mo — best-documented economics of any candidate. **KILLED for this founder.** Bookkeepers must be registered with an AML supervisor under MLR 2017; HMRC route costs £300 application + £400 per premises + fit-and-proper fee, professional-body route ~£375/yr, and non-compliance carries up to two years' imprisonment ([gov.uk](https://www.gov.uk/government/publications/anti-money-laundering-aml-supervision-discussion-about-fees/hmrcs-anti-money-laundering-aml-supervision-fees), [CIOT](https://www.tax.org.uk/amlsreg)). More importantly, buyers ask "are you AAT/ICB qualified?" in the first minute — pure liability inversion (mechanism c). Xero/Dext already automate the mechanical part; what's left is judgement Claude cannot underwrite.

**b) AI receptionist / call answering, resold.** **KILLED.** Swarmed product market at £49–£299/mo unlimited ([heyjodie](https://heyjodie.com/en-gb/guides/best-ai-receptionist/)). You'd be a reseller of someone else's product at reseller margin, with 24/7 failure exposure and evenings-only availability.

**c) Local SEO / Google Business Profile management for trades.** £150–500/mo. **KILLED.** The single most swarmed service offer in existence — every GoHighLevel reseller sells it (already a documented kill in concept #3). Outcome is publicly measurable, so failure is visible; churn concentrates in the first six months exactly where you're most fragile.

**d) Monthly client-newsletter / content production for professional firms.** £300–600/mo, 3–5 h/mo with Claude. **KILLED.** AI collapsed content prices and buyers know it; white-label newsletter incumbents already serve accountants and IFAs; and IFA-facing content requires FCA financial-promotion sign-off — liability inversion again.

**e) Tender / PQQ / SSIP (CHAS, SafeContractor, Constructionline) application support.** Existing services from **£349** per application, accreditations themselves £219–£429/yr ([Bradley Enviro](https://www.bradley-enviro.co.uk/services/health-and-safety-consultants/chas-constructionline-exor-safe-contractor-and-achillies-ssip-applications), [Safety Services Direct](https://safetyservicesdirect.com/blog/chas-accreditation-guide/)). **KILLED as primary.** Project fee not recurring; assessors expect a competent H&S person behind the policy documents; incumbent H&S consultancies bundle it with insurance-backed advice. Classic (c).

**f) Generic "back-office VA" for one trade.** **KILLED.** This is a VA job at VA prices; the comparator is offshore VAs at £6–10/h, and every client's stack is different so nothing productises.

**g) Credit control / invoice chasing for small B2B firms.** £200–500/mo. **CONDITIONAL, second-best.** The human phone-chase is genuinely the bit Chaser/Satago/Xero don't do, so no product sells the outcome. But it requires *daytime* calls (fatal for this founder's schedule) and read access to the client's sales ledger (trust barrier for an unknown).

**h) BEST FIT — quotation and tender-response production for small trade/service contractors.** £350–495/mo, unlimited. Contractor sends a voice note or site photos; you return a professional, priced, properly-termed quote or tender response within 24 hours. Why it survives the filter:
- **No regulator, no qualification, no AML, no statutory sign-off.** The contractor sets the price and signs the quote; you produce the document. Liability inversion (c) does not bite — you are not the accountable party.
- **Asynchronous by nature** — work arrives during the day, is delivered overnight. This is the *only* candidate that is a natural fit for evenings/weekends rather than a compromise with them.
- **Claude does ~90% of the drafting** and genuinely does it well.
- **Value is obvious and arithmetic**: one extra £5k job won pays for a year.
- **The buyer is reachable outside 9–5.** Contractors are on site all day and answer their mobiles at 7am, at lunch, at 6pm and on Saturday mornings — which inverts the timing constraint in §6 in the founder's favour.
- **It is genuinely repetitive across clients**, so a "notes in → quote out" tool is a coherent later product.

**Now attack it.** Contractors are price-sensitive, chaotic, and slow payers — direct debit from day one or don't bother. Quoting tools exist (Payaca, Tradify, Jobber, Powered Now) and will be raised as an objection; the honest counter is that those are templates and you are writing, but the objection will cost deals. Churn will be high when a contractor's pipeline dries up — expect worse than the 25–32% agency benchmark. The founder has no construction knowledge, so early quotes will contain errors that embarrass the client; budget for losing client #1 to this. And the moment the tool works, it is a wrapper — mechanism (a) at full strength. **Which is why I'd sell this as a service and expect it to stay one.**

### 6. Is selling a service easier than selling software for an unknown? Yes — three specific reasons, one of which is a legal asymmetry

1. **Reply-rate data favours services.** Agency/service senders in 2026 average **2.5–4.5% cold-email reply rates** (elite >7%), while "SaaS and software sit at the bottom with rates often under 2%" ([Puzzle Inbox](https://puzzleinbox.com/blog/cold-email-reply-rate-benchmarks-2026-by-segment), [Mailshake](https://mailshake.com/blog/cold-email-benchmarks-2026/)). Vendor blogs — treat as directional, not precise. The mechanism behind it is sound though: an outcome is more tangible than a tool.
2. **The legal asymmetry, which is the biggest single finding here.** PECR bars cold *email* to sole traders and partnerships (~63% of UK businesses) — that was the hard constraint in mechanism (d). But **B2B cold *calling* is permitted in the UK without prior consent**, subject to screening against TPS/CTPS at least every 28 days, identifying yourself and displaying your number ([ICO B2B guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/), [Accuradata](https://www.accuradata.co.uk/b2b-telemarketing-how-to-run-outbound-calling-campaigns/)). **Phone is a legal, open, un-swarmed channel that the founder has not used.** It also works far better for a £400/mo service than a £79/mo SaaS, because £400/mo justifies the founder spending 30 minutes on one prospect and £79/mo does not.
3. **Lower commitment for the buyer.** Cancel-anytime, no migration, no data import, no platform trust — the buyer is trusting a person for one month, not adopting a system.

**The counter-evidence, and it is serious.** Best call windows are **10–11am and 4–5pm**, answer rates drop ~35% between 12–2pm, and Tuesday–Thursday beats Monday/Friday by 30–50% ([skipcall](https://skipcall.io/en/blog/best-time-to-cold-call-b2b), [CloudTalk](https://www.cloudtalk.io/blog/best-time-to-cold-call/), [ZoomInfo](https://pipeline.zoominfo.com/sales/best-days-to-cold-call)). **The one open channel operates precisely during the hours this founder does not have.** For classic office-hours B2B this is close to fatal. It is survivable *only* for buyer segments reachable outside 9–5 — which is why candidate (h) targets contractors and not offices. This constraint should drive the niche choice more than the niche's attractiveness does.

### 7. How P3 interacts with the four structural mechanisms

| Mechanism | Effect on P3 |
|---|---|
| **(a) SWARM** | **Largely neutralised at 6 clients.** Swarm is a discovery-channel phenomenon; outbound relationship sales don't use that channel. It returns at full force the moment you try to extract software. |
| **(b) STATE PRICES AT ZERO** | **Largely neutralised.** A free government portal plus no time is still a reason to buy. This is why bookkeepers exist despite free HMRC tools. |
| **(c) LIABILITY INVERSION** | **Worse, not better.** The buyer now trusts a person, not a tool. Only avoidable by choosing work where the *client* signs and is accountable — which rules out most compliance work and is the main filter in §5. |
| **(d) DISTRIBUTION** | **Partially relieved, and this is the real prize.** Fewer customers needed (6 vs 24–30), a legal open channel (phone), better cold conversion, and a price point that pays for human selling. Not solved — replaced with 150–300 hours of dialling and a timing conflict with the founder's schedule. |

Three of four mechanisms move in P3's favour. That is more than any of the eight killed concepts achieved, and it is why the verdict is not DEAD.

### 8. What P3 does not deliver

Be clear-eyed about what is being traded away:
- **It is a job, not an asset.** A 6–8 client owner-delivered service is close to unsellable and stops paying within one month of the founder stopping.
- **It does not satisfy the mission brief.** The brief specifies a software product with defensible advantage, minimal support, "not a generic AI wrapper", and 24–48 customers. P3 delivers ~6 customers, maximal support, and — if the software ever appears — a generic AI wrapper.
- **It caps at roughly £3,000–4,500/month** on evenings/weekends. There is no £5k/£10k/£20k path without hiring, which is a different business the founder has not signed up for.
- **Its failure mode is much better than SaaS's**, and this deserves stating. A failed SaaS attempt yields £0 and a dead codebase. A P3 attempt that stalls at three clients still yields ~£1,200/month and a year of paid, first-hand knowledge of a real workflow — which is the only asset that has ever plausibly generated a defensible software idea. **The expected value of P3 exceeds its probability of full success**, which is not true of the eight killed concepts.

### 9. Evidence quality — read this before weighting anything above

Most 2026 benchmark figures here come from vendor and SEO content (Mailshake, skipcall, Belkins, Puzzle Inbox, Focus Digital, brainy.ink). These have a commercial interest in the numbers they publish. I have used them for **order of magnitude and direction only**, and flagged the two inferences that are mine and unmeasured: the 15–25% meeting→close rate for an unknown solo seller, and the 4h/client delivery assumption. **Verified hard facts** in this report are: the ICO's B2B calling position and CTPS screening obligation; HMRC AML supervision fees; published UK bookkeeping and AI-receptionist price points; published CHAS/SSIP support pricing. I could not access the one directly analogous case study I found ("Growing a productized service to $10k MRR in 18 months with no audience or network", Indie Hackers) — the domain is blocked by the network proxy, so I have **not** relied on it and mention it only as a lead worth the founder reading himself.

---

## Verdict

CONDITIONAL — viable as a route to the £2,335 NUMBER, not as a route to a software business. Decisive reason: £2,335/month needs 6 clients at £400 instead of 24-30 customers at £79-99, and UK law leaves cold CALLING open to B2B (unlike the PECR-blocked email channel), so the binding distribution constraint genuinely loosens for the first time across all nine paths. But the automation endgame does not survive scrutiny — in 2026 the repeatable part of the work is already done by Claude on day one, so what remains and what clients actually pay for is accountability, which does not compile into software. Condition for pursuing it: the founder must accept, in writing, that this builds a capped ~£3,000-4,500/month owner-delivered job with near-zero resale value, and must choose a niche whose buyers are reachable outside 9-5 (contractors/trades), since the only open sales channel operates 10am-12pm on weekdays.

## Odds

Two separate numbers, because the mission brief and the money target are not the same thing.

REACHING £2,335/month of SERVICE revenue within 24 months: ~12% (range 8-18%).
Decomposition: P(founder sustains 2-4 hours/week of cold calling small businesses, rejection-heavy and unglamorous, for 18+ months alongside a job) ≈ 35% — this is the dominant term and the one I am least able to evidence; he has demonstrated a year of research persistence, which is a different and far less aversive muscle than sales persistence. × P(reaches 6-7 retained clients | that effort) ≈ 33-38%, reflecting 500-1,000 dials per client won, ~25-32% annual churn, no references for the first two sales, and the 9-5 timing conflict. 0.35 × 0.35 ≈ 12%.

REACHING £2,335/month where the delivery is MOSTLY AUTOMATED (i.e. P3 actually converts to the software business the brief specifies) within 24 months: ~3-4%. This requires the 12% above AND driving delivery below ~3.5 hours/client/month AND the extracted software being something a stranger would pay for. Each additional condition is roughly a coin-flip at best, and the third is worse than a coin-flip because the extracted artefact is a wrapper competing in a swarmed discovery channel.

For calibration against the paths already killed: those sat at roughly 2-5% on the same basis, because they required 24-30 strangers to find and trust an unknown through channels that are closed (PECR email), dead (year-one SEO), unaffordable (£200-600 CAC on a £79 product) or power-law lottery (Product Hunt, marketplaces). P3 is roughly 3x better, not 10x better, and the improvement comes almost entirely from needing 6 customers instead of 24-30.

One number that matters more than the odds: expected value. P3's partial-failure state (3 clients, ~£1,200/month, a year of paid first-hand workflow knowledge) is worth substantially more than a failed SaaS's partial-failure state (£0 and a dead codebase). On expected value rather than probability of full success, P3 is clearly the best of the nine paths examined.

## First 90 days

NICHE COMMITMENT (day 1, non-negotiable, one choice only): quotation and tender-response production for small trade/service contractors. £395/month, unlimited, 24-hour turnaround. Contractor sends a voice note or site photos; you return a professional, priced, properly-termed quote or tender response. Chosen not because it is the most attractive market but because it is the only candidate that clears all four filters simultaneously: no qualification or AML registration required; the CLIENT signs and prices the quote so liability inversion does not bite; the work is asynchronous so it fits evenings; and the buyers answer their mobiles at 7am, at lunch and on Saturday mornings, which is the only way around the 10am-12pm calling window.

WEEKS 1-2 — SETUP, NO CODE.
- Write the offer on one page: one outcome, one price (£395/mo), cancel anytime, first quote free as the proof. No tiers, no menu.
- Register as a sole trader. Get a VoIP business number with caller ID displayed (a PECR requirement for live marketing calls). Get professional indemnity insurance quoted (~£150-300/yr) — buy it before client one.
- Set up GoCardless direct debit. Contractors are slow payers; never invoice.
- Build the list: 500 small contractors across 3 counties from Companies House and Google Maps — roofers, electricians, groundworks, commercial cleaning, fit-out. Screen the entire list against TPS and CTPS before a single dial, and diarise re-screening every 28 days.
- Write nothing else. No website beyond a one-page holding page with your name, number and the offer.

WEEKS 3-8 — 300 CONVERSATIONS. THIS IS THE WHOLE JOB.
- Target 400-500 dials in this window. Call windows that fit your life: 7:00-8:00am weekdays, 12:00-12:45 weekdays, 5:30-6:30pm weekdays, 8:00-11:00am Saturdays. That is ~10 hours/week available and roughly 20 dials/hour.
- Opening line sells the outcome, not the tool: "I write quotes and tender responses for contractors. You send me a voice note off site, I send you a finished quote by the next morning. First one free — want to try it on the next job you price?"
- Free first quote is the conversion mechanism: it removes the trust barrier entirely and it is the only asset you have in place of references.
- Target by day 60: 10-15 free quotes delivered, 2 paying clients.
- Log EVERY minute of delivery from the first quote. The time log is the most valuable artefact of the whole 90 days.

WEEKS 9-12 — DELIVER, MEASURE, ASK.
- Deliver to 2-3 clients. Measure hours per client per month. If it is above 6 hours, either the scope is wrong or the price is wrong — raise the price to £495 rather than absorb it.
- Ask each paying client for exactly two things: one written testimonial and one introduction to another contractor. Referral converts at 15-25% to meeting versus 1.5-2% cold — this is how client 4 onward gets cheaper.
- Write down the five steps that repeat IDENTICALLY across every client. That list, and only that list, is the eventual software spec.
- Keep dialling. Do not stop outbound because you have two clients; that is the single most common failure and it is why month 5 is empty.

HARD RULES FOR THE 90 DAYS.
- Zero lines of production code. None. If you write software in the first 90 days you have chosen the path that already failed eight times.
- One offer change permitted, at day 45, if you have had 150+ real conversations and zero free-quote takers.
- Do not add a second service. Do not add a second niche.

KILL AND CONTINUE CRITERIA.
- Day 90, zero paying clients after 300+ real conversations: change the offer once, not the path.
- Day 180, still zero paying clients: P3 is dead for you, and so, honestly, is the whole solo-founder plan — because 300 conversations with no sale means you cannot sell, and no path here works without that.
- Day 180, 2+ paying clients: continue, and set the automation threshold as the operating metric — the software only becomes possible if delivery drops below 3.5 hours per client per month.
- Ongoing: track effective hourly rate. If it is below £25/hour at month 6, this is a worse-paid job than a shift job and should be killed on those grounds alone regardless of how the MRR line looks.

## Key claims

- **Claim:** B2B cold calling is legal in the UK without prior consent, subject to screening against TPS/CTPS at least every 28 days, identifying yourself and displaying your number. This is an open legal channel that PECR's email restrictions do not close — the single biggest distribution finding for this path.
  **Source:** ICO, Business-to-business marketing guidance — https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/ ; Accuradata B2B telemarketing guide — https://www.accuradata.co.uk/b2b-telemarketing-how-to-run-outbound-calling-campaigns/
- **Claim:** Peak B2B call-answer windows are 10–11am and 4–5pm, with a ~35% drop in answer rates 12pm–2pm and Monday/Friday lagging 30–50% behind Tue–Thu. The one open channel operates during the hours this founder does not have — which must drive niche selection toward buyers reachable outside 9–5 (contractors, trades).
  **Source:** https://skipcall.io/en/blog/best-time-to-cold-call-b2b ; https://www.cloudtalk.io/blog/best-time-to-cold-call/ ; https://pipeline.zoominfo.com/sales/best-days-to-cold-call
- **Claim:** Agency/service cold-email senders average 2.5–4.5% reply rates in 2026 (elite >7%), while SaaS/software 'sit at the bottom with rates often under 2%'. Services convert better cold than software for an unknown sender. Vendor-blog data — directional only.
  **Source:** https://puzzleinbox.com/blog/cold-email-reply-rate-benchmarks-2026-by-segment ; https://mailshake.com/blog/cold-email-benchmarks-2026/
- **Claim:** Cold-call dial-to-meeting rates in 2026 range from ~2.5% (1 per 40 dials) to 200+ dials per booked appointment; connect rates are 8–12% on generic lists vs 18–22% on verified direct dials. Combined with an inferred 20% meeting-to-close for an unknown seller, this implies roughly 25–50 hours of dialling per client won, or 150–300 hours to reach six clients.
  **Source:** https://belkins.io/blog/cold-calling-benchmarks ; https://skipcall.io/en/blog/cold-call-connect-rate-benchmarks ; https://optif.ai/learn/questions/cold-call-to-meeting-conversion-rate/ ; https://www.cleverly.co/blog/cold-calling-statistics
- **Claim:** Solo productised-service operators sustainably run 4–8 clients; comparable monthly services (UK bookkeeping) consume 2–8 hours per client per month at £150–£950/month. At £400/client this puts the evenings/weekends income ceiling at roughly £3,000–£4,500/month before any automation.
  **Source:** https://brainy.ink/paper/productized-design-services ; https://www.alto-accounting.com/insights/bookkeeping-services-cost ; https://acenteus-cca.com/blog/outsourced-bookkeeping-costs-in-uk
- **Claim:** Small agencies (1–10 people) run ~25–32% annual client churn versus 15% for 51+ staff, and most churn occurs in the first six months. At ~2–2.5%/month this is better than typical SMB SaaS churn, but at six clients it means replacing 1.5–2 clients per year.
  **Source:** https://focus-digital.co/average-marketing-agency-churn/ ; https://prometheanresearch.com/client-retention-rate/
- **Claim:** A 2026 AI company (Icon) pivoted FROM a $39/month self-serve SaaS TO a $1,000–$3,000/month managed service because the automated software could not deliver the outcome without heavy human-in-the-loop work. This is the service-to-software thesis running empirically in reverse and is the strongest single piece of evidence against P3's automation endgame.
  **Source:** https://www.jtbd.one/p/destroying-the-saas-multiple-how
- **Claim:** Every documented agency-to-SaaS transition found (Mailchimp from a web design agency, Typeform from two web agencies, Freshdesk, BotsCrew) was run by founders who could build software themselves. No documented case of a non-technical solo operator converting a productised service into a software business was located.
  **Source:** https://imfounder.com/entrepreneurship/bootstrapped-startups-2026/ ; https://davidhart.substack.com/p/agencies-who-switched-to-saas ; https://oleksandr-gamaniuk.medium.com/bot-agencies-that-made-their-own-products-and-became-saas-companies-827d3c8b3ebd
- **Claim:** Generic AI automation service work is fully commoditised: Fiverr's own 2026 guide puts AI automation experts at $75–$520 per project and $18–$150/hour, with most Make.com/n8n sellers at $100–$300 per scenario build. Undifferentiated 'AI automation agency' offers compete against thousands of cheaper global operators.
  **Source:** https://www.fiverr.com/resources/guides/costs/ai-automation-experts ; https://www.upwork.com/resources/upwork-hourly-rates ; https://ciela.ai/blogs/is-ai-agency-market-saturated-reddit
- **Claim:** Bookkeeping — the best-documented productised-service economics — is legally closed to this founder: bookkeepers must register with an AML supervisor under MLR 2017 (HMRC route: £300 application + £400 per premises + fit-and-proper fee; professional body ~£375/year), with non-compliance carrying up to two years' imprisonment.
  **Source:** https://www.gov.uk/government/publications/anti-money-laundering-aml-supervision-discussion-about-fees/hmrcs-anti-money-laundering-aml-supervision-fees ; https://www.tax.org.uk/amlsreg
- **Claim:** AI receptionist services are already a swarmed UK product market at £49–£299/month with unlimited calls (Hey Jodie £49/£99/£199, Softomate from £299, plus Smith.ai, Goodcall, Synthflow), making resale a zero-margin channel play. Rule that follows: the service must sell an outcome no shipped product currently sells.
  **Source:** https://heyjodie.com/en-gb/guides/best-ai-receptionist/ ; https://www.softomatesolutions.com/blog/ai-receptionist-pricing-uk/
- **Claim:** CHAS/SafeContractor/Constructionline application support already exists as a service from £349 per application (accreditations themselves £219–£429/year ex-VAT), delivered by H&S consultancies whose competent-person status is the product. It is project-fee work, not recurring, and carries liability inversion.
  **Source:** https://www.bradley-enviro.co.uk/services/health-and-safety-consultants/chas-constructionline-exor-safe-contractor-and-achillies-ssip-applications ; https://safetyservicesdirect.com/blog/chas-accreditation-guide/

## Gaps


