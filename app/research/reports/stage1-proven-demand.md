# What Small Businesses Actually Pay For: Evidence on Micro-SaaS and Vertical Software Revenue (UK, August 2026)

## 0. Methodology and a warning about the evidence base

**Two constraints you should weigh when reading this.**

First, `WebFetch` was blocked by the network egress proxy for essentially every primary source I tried: `microconf.com`, `blog.acquire.com`, `indiehackers.com`, `flippa.com`, `getapp.co.uk`, `tradifyhq.com`, `powerednow.com`, `teamup.com`, `gov.uk`, and the IPSE/Sage PDF all returned `EGRESS_BLOCKED` or a 403 at CONNECT. I could not read pricing pages or reports directly. Everything below comes from search-engine extracts of those pages. Where a figure is a headline price from a vendor's own page as quoted in an extract, I treat it as reasonably solid; where it is a "typical range" invented by a comparison blog, I say so.

Second — and this matters more — **this specific topic is the most AI-slop-polluted corner of the web I have researched.** Searches for "micro-SaaS revenue examples" return dozens of near-identical 2026-dated listicles (`ideaproof.io`, `bigideasdb.com`, `flowjam.com`, `vibrantsnap.com`, `superframeworks.com`, `solopreneurpage.com`) with confident, precise, mutually-inconsistent revenue figures and no citations. Several "case studies" appear to be fabricated. **I am explicitly flagging one below that I believe is invented.** Treat any MRR number you see in a listicle as zero evidence unless the founder published it themselves.

---

## 1. The base rate: what actually happens to micro-SaaS revenue

This is the part most founders skip. Start here.

| Statistic | Figure | Source quality |
|---|---|---|
| Micro-SaaS founders under $1,000 MRR | ~70% | MicroConf State of Independent SaaS, via secondary ([saasranger.com](https://saasranger.com/blog/micro-saas-revenue-reality-what-1000-founders-actually-earn/)) |
| Median *profitable* micro-SaaS | ~$4.2k MRR (~£3.3k) | Same |
| Micro-SaaS above $50k MRR | 1–2% | Same |
| Median MRR across 8,000+ tracked startups | **$145** | [bigideasdb.com](https://bigideasdb.com/bootstrapping-a-company-in-2026) |
| Share clearing $10k MRR | ~6.1% | Same |
| Solo-founded share of independent SaaS | ~50% | MicroConf survey, via secondary |
| SaaS startups failing within 3 years | ~92% (widely-repeated, weakly-sourced) | [shubhq.com](https://shubhq.com/saas/research/saas-failure-postmortem/) — treat as folklore |

**Read this correctly.** The target here — £2,335/month ≈ $2,950 MRR — sits *below* the median profitable micro-SaaS ($4.2k) but *above* roughly 80–90% of all micro-SaaS products ever launched. It is not a modest goal in absolute terms; it is modest only relative to venture ambitions. The realistic framing is: **you are aiming to land in the top ~10–15% of outcomes, and the single biggest determinant of that is not build quality (Claude handles that) but distribution and niche choice.**

Also note the timeline evidence: the commonly-cited solo-founder progression is $0–1k MRR in months 3–6, $1k–5k in months 6–12 ([bigideasdb.com](https://bigideasdb.com/solo-developer-saas-monthly-revenue-examples)). That source is a listicle, but the shape matches everything else I found. **"First paying customers within months" is realistic. "£2,335/month within months" is not.** A 12–24 month path to the target is the honest expectation.

### 1.1 Named examples with real revenue — and which ones I trust

**Verified / multi-source (trust these):**

- **Swifteq — Sorin Alupoaie, solo, Dublin.** A portfolio of small apps for the **Zendesk marketplace**. Publicly documented: >€20k MRR and 300+ customers by June 2024; **€44k/month portfolio as of November 2025**. Bootstrapped, no outside investment, no Product Hunt launch. Documented by the founder on Medium and Indie Hackers ([medium.com/@asorin](https://medium.com/@asorin/getting-to-20k-mrr-with-swifteq-234ad1eefa72), [indiehackers.com](https://www.indiehackers.com/product/swifteq-apps/getting-to-20k-mrr-with-swifteq--O-yq-LdknOUPxdjmasT), [starterstory.com](https://www.starterstory.com/swifteq-breakdown)). **This is the single most relevant case study in the entire report** — see §7.
- **ServiceTitan** (plumbers/HVAC contractors) — S-1 disclosed FY2025 revenue $771.9m, +26%, **net dollar retention >110% and gross retention >95% for 10 consecutive quarters** ([saasmag.com](https://www.saasmag.com/vertical-saas-niche-beats-horizontal-2026/)). Not a solo business, but it is the hardest public proof that trades-vertical software retains customers.
- **Pieter Levels (Photo AI, ~$132k MRR)** and **Marc Lou (~$1.03m/year across a portfolio)** — widely self-reported, solo, but both are *technical* founders with large pre-existing audiences. Not replicable models for this situation.

**Historical and stale — do not plan against these:**
- Baremetrics (Josh Pigford) — $40k MRR in 18 months. That was **2013–2015**. Stripe analytics is a solved, crowded category now.
- ConvertKit (Nathan Barry) — the "$5k/month in six months" challenge was **2013**. Email marketing in 2026 is not that market.

**Flagged as likely fabricated — do not cite:**
- **"Auxpanel", "Sophia Chou", dental compliance, "$30–50k MRR from 100+ dental practices at $300–500/practice/month"** ([medium.com/@urano10](https://medium.com/@urano10/vertical-saas-micro-niches-beyond-the-obvious-01e0adf16a98)). I could find no company, no website, no founder, and no corroborating source. The figures are suspiciously round and the story fits a template. **I believe this is AI-generated fiction.** I mention it only because it will surface repeatedly if you research this space, and because the *shape* of the claim (high-priced vertical compliance software) is directionally sound even though this instance appears invented.
- Notionlytics ($43,160 MRR), Angel Match ($39,328 MRR), Simple Analytics ($39,353 MRR) — all sourced only to listicles with implausible precision. Simple Analytics is a genuine company; the specific figure is unverified.

---

## 2. UK vertical software price points — the actual market

This is the most useful table in the report. All figures GBP/month unless stated, 2026 pricing.

### 2.1 The anchor: what "essential" costs in the UK

Accounting software is the reference price every UK small business has in their head.

| Product | UK price |
|---|---|
| QuickBooks Sole Trader | **£10/mo** |
| Xero Starter | **£16/mo** (some sources £15+VAT) |
| FreeAgent | **£19/mo** — but **free for NatWest/RBS/Ulster/Mettle customers** |

Source: [taxroot.co.uk](https://taxroot.co.uk/blog/xero-vs-quickbooks-vs-freeagent-uk), [loyals.uk](https://www.loyals.uk/blog/mtd-itsa-software-comparison). Range across the three: roughly £12–29/mo.

**Implication: £10–20/month is what a UK microbusiness thinks "business software" costs.** Anything you price above that has to justify itself against that anchor.

### 2.2 Sole-trader / microbusiness tier (£10–35/mo) — commoditised

| Vertical | Vendor | Price |
|---|---|---|
| Trades job management | Powered Now | £19–27/user/mo |
| Trades job management | Tradify | £34–44/user/mo |
| Trades job management | VioTrade | £20/mo flat (£200/yr) |
| Electrical certificates | Checker (Lite) | **£10.99/mo + VAT**, no lock-in |
| Electrical certificates | Tradecert | unlimited certs, all types included |
| Gas Safe records | Gas Certificate App / GasCert | flat fee per user role |
| Salon (solo) | Fresha Independent | **£14.95/mo** |
| Salon (team) | Fresha Team | £9.95/team member/mo |
| Fitness (solo/small) | Gymcatch | from **£12.75/mo** |
| Driving instructors | DriveSchoolPro | **£22/mo** solo, +£12/extra instructor |
| Driving instructors | ADI Network | **free** |
| Cleaning (solo) | various | under £10/mo |

Sources: [checker.app](https://checker.app/best-eicr-electrician-software-uk-2026/), [dashlink.media](https://dashlink.media/tradify-alternatives-uk/), [dothebeauty.com](https://www.dothebeauty.com/blog/fresha-cost-uk-salons), [getapp.co.uk](https://www.getapp.co.uk/software/2043635/gymcatch), [driveschoolpro.com](https://driveschoolpro.com/blog/best-driving-school-software/), [viotrade.co.uk](https://www.viotrade.co.uk/blog/best-tools-for-managing-trade-jobs).

Aggregate: **"Most UK tradespeople pay between £15 and £80 per user per month, with sole traders typically spending £15 to £30"** ([itrade.net](https://www.itrade.net/post/best-job-management-software-for-tradesmen-uk)).

### 2.3 The £49–99 band — thin, and that is the interesting part

| Vertical | Vendor | Price |
|---|---|---|
| Nursery (small) | Blossom Educational | **~£49/mo** up to 50 children |
| Nursery (per-child) | Blossom / Connect | £2–5 per child/mo |
| Cleaning (up to 20 cleaners) | ProCleanerUK Bronze | **£49.99/mo** |
| Cleaning (up to 50) | ProCleanerUK Silver | £79.99/mo |
| Cleaning (up to 150) | ProCleanerUK Gold | £99.99/mo |
| Dental (single practitioner) | Dentally | **from £79/mo** |
| Dental (basic) | Carestack | from £65/mo |
| Salon | Phorest | £24–79/mo |
| Fitness studio | TeamUp | **£99–299/mo** (solo PT studios £99–150) |

Sources: [esremedia.co.uk](https://esremedia.co.uk/blog/famly-alternatives-uk-nursery-software), [esremedia.co.uk cleaning costs](https://esremedia.co.uk/blog/cleaning-company-software-costs-uk), [tradepick.co.uk](https://www.tradepick.co.uk/guides/best-practice-management-software-dental-practices-uk), [tradepick.co.uk fitness](https://www.tradepick.co.uk/guides/best-software-gyms-fitness-studios-uk), [pabau.com](https://pabau.com/blog/best-salon-software-uk/).

### 2.4 The £95–500+ tier — multi-staff businesses

| Vertical | Vendor | Price |
|---|---|---|
| Nursery | Famly | **£94.80 / £178.80 / £238.80 per setting/mo** |
| Dental (multi-site) | Dentally / Carestack | £149–195/mo |
| Letting agents | Jupix | **£95–120/user/mo** |
| Letting agents (solo) | Alto | **£300–500/mo** |
| Letting agents | LettingGuru | from **£299/mo** |
| Letting agents (5-tool stack, ~50 properties) | — | **£500–950/mo** |
| Funeral directors | typical SaaS | **£400–500/mo** |
| Funeral directors (per-use) | Funeral Manager / Arranger | **£10–11 per funeral** |
| Veterinary | Provet | $249 first vet + $99/additional |
| Veterinary | Shepherd | $299/mo unlimited users |
| Field service (6+ staff) | Commusoft | quote-only, min licence count |

Sources: [lettingguru.co.uk](https://lettingguru.co.uk/blog/property-management-software-for-letting-agents/), [datamerge.co.uk](https://datamerge.co.uk/funeral-software-buyers-guide/), [funeralmanager.co.uk](https://funeralmanager.co.uk/pricing/), [vetsycare.com](https://vetsycare.com/blog/veterinary-software-pricing-guide-2026), [gettraddie.com](https://www.gettraddie.com/compare/tradify-vs-commusoft).

### 2.5 The single most important pattern in this table

**UK vertical software prices barbell.** There is a dense floor at £10–35/mo (sole traders, commoditised, often with a free competitor) and a dense ceiling at £95–500/mo (businesses with staff, quote-only, demo-led, incumbent-heavy). **The £49–99 band is comparatively empty in most verticals** — not because it doesn't work, but because most vendors either chase volume at the bottom or land-grab at the top.

For a £2,335/month goal that band is exactly right, and it tells you who the buyer must be: **not a sole trader.** A sole trader anchored on £16 Xero will not pay £49 to an unknown vendor. The £49–99 buyer is a business with 3–30 staff, real revenue, and a pain that either costs them money or creates legal exposure.

---

## 3. Price ceiling for an unknown vendor — what the evidence actually says

I could not find a clean study of "maximum price an unknown UK vendor can charge." Here is the closest evidence.

- **Self-serve entry points work below ~$99/mo (~£78).** "Self-service typically requires an inexpensive entry point below $99... as long as the entry point is credit-card appropriate" ([blume.vc](https://blume.vc/commentaries/pricing-201-for-b2b-saas-companies-price-product-fit)).
- **Micro businesses (1–10 employees) buy self-serve at $500–$2,000 ACV** (≈£33–133/mo). Small businesses (11–50) shift to inside sales at $2k–15k ACV ([saber.app](https://www.saber.app/glossary/smb-account)).
- **Sub-$5k ACV trials convert at 16–28% (opt-in trials) because the buying decision is unilateral** ([growthspreeofficial.com](https://www.growthspreeofficial.com/blogs/b2b-saas-trial-to-paid-conversion-rate-benchmarks-2026-by-trial-type-acv-length-credit-card)).

**Translation for this situation.** £49/mo = £588/yr ACV — squarely in the self-serve micro-business band. £99/mo = £1,188/yr — still in that band but at its upper edge, where a human conversation starts to be expected. Both are viable. **£99 is not above the psychological ceiling; it is above the *no-conversation* ceiling.** Since the owner is doing sales anyway, £99 with a demo call is arguably a *better* fit for their skill split than £49 pure self-serve. Half the customers, half the support tickets, same revenue.

The real constraint is not price, it is **trust in an unknown vendor holding business-critical data.** No hard evidence found; my honest read is that this is mitigated by narrowness (a tool that does one job is easier to trust than a system of record) and by an annual-billing option that signals permanence.

---

## 4. Churn: the number that decides whether £2,335/month is reachable

| Segment | Monthly churn |
|---|---|
| SMB / prosumer, healthy | 2–4% logo churn |
| SMB self-serve, low-priced | **3–7%** |
| Best-in-class revenue churn | <1% |

Source: [koji.so](https://www.koji.so/blog/saas-churn-rate-benchmarks-2026), [getspike.ai](https://getspike.ai/blog/saas-churn-rate-benchmarks/), [growigami.com](https://growigami.com/blog/saas-churn-rate-benchmarks).

Two structural drivers, both relevant: **~20% of small businesses fail in year one**, and SMB subscriptions are often owned by a single person who takes the subscription with them when they leave.

**The arithmetic you need to internalise.** At £49/mo you need 48 paying customers. At a mid-range 5% monthly churn you lose ~2.4 customers every month at steady state. So you must acquire **~2.4 customers/month just to stand still**, and realistically **5–6 gross new customers per month** to climb to 48 within a year. That is roughly one new paying customer per week, sustained, for a year — while also doing support and building.

At £99/mo you need 24 customers: ~1.2 lost/month, ~2.5–3 gross new/month. **Materially easier operationally.**

**The strongest lever available: annual billing.** "Annual subscribers churn at roughly one-third the rate of monthly subscribers, and companies that switch from monthly-default to annual-default billing typically see churn drop by 40–60%" ([koji.so](https://www.koji.so/blog/saas-churn-rate-benchmarks-2026)). A £490/year prepaid offer against a £49/month list price would cut the retention problem substantially and front-load cash. **This should be a default design decision, not an afterthought.**

---

## 5. The "boring software" thesis — supported, but with an honest caveat

**Supporting evidence:**
- Vertical SaaS retention: ServiceTitan's S-1 numbers (>95% GRR, >110% NDR, 10 consecutive quarters) are the hardest public data point that trades software is genuinely sticky. Switching costs are operational — workflows, staff training, historical records ([saasmag.com](https://www.saasmag.com/vertical-saas-niche-beats-horizontal-2026/)).
- Compliance-forced software has a buyer who *cannot decline*. Every vertical with a statutory record-keeping duty (see §6) has demand that is not discretionary.
- The Swifteq case: quality-of-life utilities for support agents — about as unsexy as software gets — reached €44k/month solo.

**The caveat you should not skip.** SaaS Capital's benchmarking data shows the retention difference between vertical and horizontal SaaS is **"minor and mixed" — not the 3× advantage that circulates online** ([saasmag.com](https://www.saasmag.com/vertical-saas-niche-beats-horizontal-2026/) reporting SaaS Capital). The stickiness is real at the top end; the average vertical SaaS is not dramatically stickier than the average horizontal one. **Choosing a boring vertical does not automatically buy you retention. Being embedded in a workflow does.** A tool people open once a quarter to file a return will churn like any other.

---

## 6. UK-specific regulatory forcing functions in 2026 — the strongest "why now" evidence in this report

This is where UK-specific advantage exists, and it is the most decision-relevant material I found. Three statutory changes are creating non-discretionary software demand *right now*.

### 6.1 Employment Rights Act 2025 — holiday record-keeping (LIVE since 6 April 2026)

- Royal Assent **18 December 2025**; staged implementation across 2026–27.
- **From 6 April 2026: employers must keep annual leave and holiday pay records for at least 6 years. Failure to keep adequate holiday records is a criminal offence and can attract a fine** ([brownejacobson.com](https://www.brownejacobson.com/insights/employment-rights-act-2025-new-record-keeping-obligation), [bakermckenzie.com](https://www.bakermckenzie.com/en/insight/publications/2026/04/united-kingdom-new-record-keeping-obligations-for-annual-leave)).
- **From October 2026: shift notice and cancellation payment rights** — employers must give reasonable notice of hours/days/times; notice too close to the shift is *presumed unreasonable* ([workplacecomply.co.uk](https://workplacecomply.co.uk/guides/zero-hours)).
- From 2027: guaranteed-hours offers based on a ~12-week reference period.
- "The changes coming into effect on 1 October 2026 and 1 January 2027... are likely to hit smaller businesses hardest. Most SMEs only have one person doing that job alongside several others, and it is easy for a date to be missed" ([insidermedia.com](https://www.insidermedia.com/blogs/north-west/employment-rights-act-2025-is-your-sme-really-ready)).

**Caveat: this is contested ground already.** RotaCloud, BrightHR, Employment Hero, PeopleHR and Rotageek are all publishing content on it. The incumbents moved fast. A wedge here must be narrower than "rota system."

### 6.2 Renters' Rights Act 2025 — PRS Database (main reforms 1 May 2026, database late 2026)

- Main reforms activated **1 May 2026**; the **Private Rented Sector Database goes live late 2026** ([elliotleigh.com](https://www.elliotleigh.com/post/prs-database-registration-2026-everything-landlords-need-to-know/), [nrla.org.uk](https://www.nrla.org.uk/resources/renters-rights)).
- All private landlords in England must register properties, pay annual fees, and **keep information current — new tenancies, rent increases, certificate renewals, address changes — within specified timeframes**.
- **Penalties: fines up to £5,000, inability to serve Section 8 possession notices, potential prohibition orders.**
- Existing tenancies must be registered within a transition period (likely 6–12 months).

**This is the best-shaped opportunity I found**, for four reasons: a hard statutory deadline; a severe, specific penalty (losing possession rights is worse than the fine); a recurring update duty (not one-and-done, so it retains); and — critically — **a gaping hole in the price ladder.** Small landlords and micro-agents currently choose between a spreadsheet (£0) and Alto/Jupix at £300–500/mo. Nothing sensible sits at £49–99.

### 6.3 Making Tax Digital for Income Tax — LIVE since 6 April 2026

- **From 6 April 2026:** sole traders and landlords with **gross income over £50,000** must keep digital records and file quarterly via compatible software. **April 2027: >£30,000. April 2028: >£20,000** ([fsb.org.uk](https://www.fsb.org.uk/resources/article/making-tax-digital-2026-deadlines-rules-and-more-MCQVRXUNIJC5EQRAZBQ7DFJNGYMA), [sage.com](https://www.sage.com/en-gb/blog/self-assessment-ending-making-tax-digital-sole-traders/)).
- Threshold is **gross turnover, not profit** — catching many people who don't expect it.
- **Readiness is dire.** IPSE/Sage survey of UK sole traders: **66% use spreadsheets, 56% rely on bank statements, 33% use pen and paper, only 10% use cloud accounting software** ([cfotech.co.uk](https://cfotech.co.uk/story/uk-sole-traders-unready-for-making-tax-digital-shift), [ipse.co.uk](https://www.ipse.co.uk/downloads/making-tax-digital-readiness-report)). Separately, only 17% of micro businesses report adopting the latest digital tools ([gov.uk SME Digital Adoption Taskforce 2026](https://www.gov.uk/government/publications/sme-digital-adoption-taskforce-2026-update/sme-digital-adoption-taskforce-2026-update)).

**But do not build MTD accounting software.** See §8. QuickBooks is £10/mo and FreeAgent is free with a NatWest account. This is a *tailwind that makes small businesses receptive to buying software for the first time*, not a category to enter.

---

## 7. The distribution shortcut: marketplace/ecosystem apps

For a founder whose hardest problem is *finding customers*, not *building software*, this deserves serious weight.

**The evidence for:**
- **Swifteq**: €44k/month, solo, from Zendesk marketplace apps. The founder explicitly notes he did *not* launch on Product Hunt. Distribution came from the marketplace ([medium.com/@asorin](https://medium.com/@asorin/getting-to-20k-mrr-with-swifteq-234ad1eefa72)).
- **Shopify**: 80.4% of App Store apps belong to single-app partners; 82.4% of developers focus on one app. Developers keep **100% of their first $1,000,000/yr** in gross app revenue (from 1 Jan 2025), 85% above that ([shopify.dev](https://shopify.dev/docs/apps/launch/distribution/revenue-share), [craftberry.co](https://craftberry.co/articles/shopify-app-store-statistics)).
- Top 10% of apps in a Shopify category make **$5k–50k MRR** ([weekonelabs.com](https://weekonelabs.com/blog/shopify-app-revenue-benchmarks-2026/)).

**The evidence against — read this carefully:**
- **Median listed Shopify app earns under $1,000/month, and a meaningful chunk earn nothing** ([weekonelabs.com](https://weekonelabs.com/blog/shopify-app-revenue-benchmarks-2026/)). Marketplace presence is not distribution; ranking in the marketplace is.
- **Platform risk is documented and severe.** Xero is retiring its App Store revenue-share model **from 2 March 2026** and replacing it with tiered pricing based on connections and data egress — **$0 (Starter, 5 connections) up to $895/month (Advanced)**. Coverage describes it as feeling like "a rug pull that threatens their survival" for smaller vendors ([accountingtoday.com](https://www.accountingtoday.com/news/xero-shifts-to-tiered-pricing-model-for-developers), [accountingweb.co.uk](https://www.accountingweb.co.uk/tech/accounting-software/xeros-api-shift-who-owns-the-accounting-data), [truto.one](https://truto.one/blog/xero-api-pricing-changes-2026-costs-tiers-and-how-to-minimize-egress/)). **Under this model an app with 48 customers could face material platform fees before earning a penny of profit — model this before committing to Xero.**
- **Checkout X** reached €600k MRR on Shopify and was then shut out by the platform ([linkedin.com](https://www.linkedin.com/pulse/bootstrapping-600k-mrr-getting-killed-shopify-story-x-ruslan-leteyski)).

**Honest verdict: marketplace apps solve the distribution problem and create a platform-dependency problem in its place.** For an owner with no audience and no technical background, that trade is probably worth making *provided* the chosen platform's economics are checked first — and provided you accept that the platform can change the deal, as Xero just did.

---

## 8. Anti-evidence: the graveyards

**Do not enter these.**

| Category | Why it's dead | Evidence |
|---|---|---|
| **Invoicing / bookkeeping / MTD accounting** | QuickBooks Sole Trader £10/mo; **FreeAgent free for all NatWest/RBS/Ulster/Mettle customers**. You cannot compete with free-with-a-bank-account. | [taxroot.co.uk](https://taxroot.co.uk/blog/xero-vs-quickbooks-vs-freeagent-uk) |
| **Electrical / gas certificate apps** | Already commoditised: Checker Lite **£10.99/mo**, Tradecert unlimited certificates, Powered Now bundles them. Multiple UK vendors competing on "unlimited, no per-cert charges." The obvious "boring compliance" idea is taken. | [checker.app](https://checker.app/best-eicr-electrician-software-uk-2026/), [tradecert.app](https://www.tradecert.app/) |
| **Salon / beauty booking** | Fresha is effectively free (£14.95 solo) and monetises via payment processing (1.40%+25p) and a 20% new-client marketplace fee. Treatwell takes 20–35% commission. Subscription competitors cannot match a payments-subsidised price. | [dothebeauty.com](https://www.dothebeauty.com/blog/fresha-cost-uk-salons), [subseat.co.uk](https://www.subseat.co.uk/blog/how-much-does-treatwell-cost-per-month-2026) |
| **Driving instructor diaries** | ADI Network is **completely free**; DriveSchoolPro is £22/mo and actively discounting. ~37,000–43,000 ADIs total. Small market, free incumbent, low willingness to pay. | [adinetwork.co.uk](https://www.adinetwork.co.uk/why-join-adi/free-driving-instructor-app), [gov.uk ADI register](https://www.gov.uk/government/statistical-data-sets/driving-instructor-and-motorcycle-instructor-register-data) |
| **Generic AI wrappers** | Reported: 60–70% generate zero revenue; only 3–5% cross $10k MRR; **65% churn within 90 days vs ~35% SaaS average**; 25–35% gross margins vs 70–85% for traditional SaaS. *(Source quality is poor — a marketing blog. But the direction is corroborated everywhere and the margin argument is structurally sound: you pay per token, they pay per month.)* | [chyshkala.com](https://chyshkala.com/blog/micro-saas-reckoning-ai-changed-everything-2025), [alexcloudstar.com](https://www.alexcloudstar.com/blog/ai-wrappers-dead-what-to-build-instead-2026/) |
| **General trades job management** | Tradify, Powered Now, Commusoft, ServiceM8, ToolTime, VioTrade, Workever, iTrade, Traddie — at least nine vendors fighting over £15–44/user/mo. Fully saturated. | §2.2 |
| **Product Hunt as a launch channel** | Featured products fell from 47/day to 16/day (Sept 2023 → 2024), a 66% decline. Swifteq's founder explicitly reached €44k/mo *without* it. | [chyshkala.com](https://chyshkala.com/blog/micro-saas-reckoning-ai-changed-everything-2025) |

**One more, unquantified but important:** general CRM and project management. I found no direct 2026 data, but the structural argument is unarguable — HubSpot, Zoho, Trello, Notion and ClickUp all have free tiers, and the buyer has no vertical-specific need you can serve better.

---

## 9. Acquisition marketplace evidence — what real cash flow is worth

| Metric | Figure |
|---|---|
| Acquire.com median SaaS profit multiple, 2024 **and** 2025 | **3.9× SDE** (stable) |
| Acquire.com lifetime deal volume | $500m+, 2,000+ acquisitions |
| Flippa SaaS transactions, 2025 | **+73.5%** |
| Flippa sweet spot | $100k–500k, average deal **$323k** |
| Flippa profit multiples by tier | 2.1×–2.9× |
| Best-selling profile under $100k | 12+ months of *verified* revenue, categories buyers understand |

Sources: [blog.acquire.com Jan 2026 report](https://blog.acquire.com/acquire-com-biannual-acquisition-multiples-report-jan-2026/) (via search extract — page blocked), [ctacquisitions.com](https://ctacquisitions.com/microacquire-acquire-com-platform-guide/), [exitbid.io](https://exitbid.io/blog/flippa-review-2026), [startupa.ge](https://startupa.ge/blog/how-to-sell-micro-saas).

**What this means for the £2,335/month target.** £2,335/mo = £28k/yr revenue. If it runs at a typical micro-SaaS ~64% margin, that's ~£18k SDE, which at 3.9× is **~£70k**. So the business being built here is a ~£70k asset that also pays a wage. That is a genuinely useful framing for motivation and for decision-making: **it argues strongly for annual billing, clean books, and a boring verifiable niche from day one**, because "12+ months of verified revenue in a category buyers understand" is precisely what makes a small SaaS sellable.

---

## 10. Market-size sanity check: is 48 customers actually findable?

| UK vertical | Number of businesses | 48 customers = |
|---|---|---|
| Estate/letting agents | **26,374** (2026, +2.2% YoY) | 0.18% |
| Nurseries (UK) | **15,162** (March 2026: England 13,842, Scotland 711, Wales 387, NI 222) | 0.32% |
| Funeral directors | **5,329** (April 2026, +3.72% since 2023) | 0.90% |
| Driving instructors (ADIs) | ~37,000–43,334 (Sept 2025) | 0.11–0.13% |

Sources: [ibisworld.com](https://www.ibisworld.com/united-kingdom/number-of-businesses/estate-agents/3845/), [daynurseries.co.uk](https://www.daynurseries.co.uk/advice/early-years-facts-and-stats), [rentechdigital.com](https://rentechdigital.com/smartscraper/business-report-details/list-of-funeral-directors-in-united-kingdom), [gov.uk](https://www.gov.uk/government/statistical-data-sets/driving-instructor-and-motorcycle-instructor-register-data).

**This is the encouraging half of the report.** Needing under 1% of any of these verticals is not a market-size problem. **The constraint is entirely reachability and willingness to pay, not market size.** Every one of these verticals is enumerable — you can build a list of every UK funeral director or nursery. That is a real advantage for a founder doing manual outbound, and it is the opposite of a consumer or horizontal product where the addressable market is theoretically huge and practically unreachable.

---

## 11. Synthesis: where small-scale software revenue genuinely exists in 2026

Six criteria, each backed by something above:

1. **Buyer has staff and revenue** — because £49–99/mo is above the sole-trader ceiling (§2.5, §3).
2. **A statutory or contractual duty forces the purchase** — because discretionary spend churns and compliance spend doesn't (§6).
3. **The duty is recurring, not one-off** — filing a return once churns; maintaining a register retains (§5 caveat).
4. **The price ladder has a hole at £49–99** — spreadsheet at £0 or incumbent at £300+ (§2.5).
5. **The vertical is enumerable** — you can list every prospect in the UK (§10).
6. **No free platform-subsidised incumbent** — the Fresha/FreeAgent/ADI Network test (§8).

Very few ideas pass all six. The ones that do are in the opportunities field.

---

## 12. Honest bottom line

The evidence supports a narrow version of the plan and refutes a broad one.

**Refuted:** "Build a micro-SaaS, price it at £49, get 48 customers." The median micro-SaaS makes $145/month. Most categories a beginner would pick are already commoditised below the target price by a free or payments-subsidised incumbent.

**Supported:** "Pick a UK vertical where a 2026 statute created a new recurring duty, where prospects are enumerable, and where the price ladder jumps from £0 to £300; build the narrow tool that discharges that duty; sell it at £79–99 with an annual-billing default." Every clause of that sentence is doing work, and each one is backed by a specific finding above.

The founder's genuine edge here is **not** that Claude can build software — everyone has that in 2026, which is precisely why AI-wrapper economics collapsed. The edge is being a UK person who can phone 200 UK letting agents or nursery managers about a UK regulation that lands this year. That is the scarce input. The evidence says spend the effort there.

## OPPORTUNITIES SURFACED
RANKED BY EVIDENCE STRENGTH. Each is scored against six criteria the report derives: (1) buyer has staff/revenue, (2) statutory duty forces purchase, (3) duty is RECURRING not one-off, (4) price ladder has a hole at £49-99, (5) prospects are enumerable, (6) no free platform-subsidised incumbent.

=== TIER 1: PASSES ALL SIX ===

1. RENTERS' RIGHTS ACT / PRS DATABASE COMPLIANCE FOR PORTFOLIO LANDLORDS AND MICRO LETTING AGENTS — strongest opportunity found.
- Who buys: landlords with 4-50 properties, and independent letting agents with 20-200 managed properties. 26,374 estate/letting agent businesses in the UK plus ~2m private landlords.
- The pain: main reforms live 1 May 2026; PRS Database goes live late 2026. Every property must be registered, and information must be UPDATED within specified timeframes on new tenancies, rent increases, certificate renewals and address changes. Non-compliance = fines up to £5,000, inability to serve Section 8 possession notices, potential prohibition orders. Losing possession rights is a far bigger threat than the fine and is the thing to sell on.
- What they pay today: nothing (a spreadsheet), or £300-500/mo for Alto, £299/mo for LettingGuru, £95-120/user/mo for Jupix. A realistic five-tool stack for ~50 properties is £500-950/mo. There is NO sensible option at £49-99. This is the clearest price-ladder hole in the entire report.
- Why now: hard statutory deadline in the next few months, plus a transition period (likely 6-12 months) for existing tenancies that creates a scramble.
- Why it retains: the duty is continuous, not annual. Certificate expiry tracking (gas, EICR, EPC) plus registration currency is a permanent recurring job.
- Price: £79-99/mo, annual-default at ~£790-990/yr.
- Wedge product: NOT a property management system. A compliance register — every property, every certificate, every expiry date, every registration status, with reminders and an exportable audit pack. One job, done completely.
- Risk to check first: whether MHCLG ships free tooling alongside the database, and whether Alto/Goodlord/Fixflo launch a cheap tier. Verify before building.

2. HOLIDAY AND LEAVE RECORD-KEEPING AUDIT TRAIL FOR SMALL EMPLOYERS (Employment Rights Act 2025)
- Who buys: UK employers with roughly 5-50 staff in hospitality, retail, care, cleaning and trades — businesses with hourly/variable-hours workers and no HR department.
- The pain: since 6 April 2026 employers must retain annual leave and holiday pay records for at least SIX YEARS, and failure to keep adequate records is a CRIMINAL OFFENCE attracting a fine. From October 2026, shift notice and cancellation payment rights add a second evidencing burden. Commentary is explicit that SMEs will be hit hardest because "most SMEs only have one person doing that job alongside several others."
- What they pay today: usually nothing (a spreadsheet), or £3-5/employee/mo for a full HR/rota system they don't otherwise want.
- Price: £39-79/mo flat (flat pricing beats per-employee here — the buyer is fleeing complexity).
- Wedge: a six-year tamper-evident leave ledger with one-click "produce my records" export. Sell on criminal liability, not on convenience.
- HONEST CAVEAT — this is the most contested of the three: RotaCloud, BrightHR, Employment Hero, PeopleHR and Rotageek are already publishing marketing on exactly this Act. The incumbents moved fast. Only viable if the product is dramatically narrower and cheaper than a rota system. Validate by asking 20 small employers what they actually did in April 2026 — if they all bought BrightHR, drop it.

=== TIER 2: STRONG, NEEDS VALIDATION ===

3. UNDERSERVED VERTICALS WITH NO SELF-SERVE BOTTOM RUNG
- Funeral directors: 5,329 UK businesses (+3.72% since 2023). Incumbents are £400-500/mo SaaS or per-funeral pricing (Funeral Manager £11/funeral, Arranger from £10/funeral). 48 customers = 0.9% of the market — the highest penetration required in the table, so validate demand hard. But an ageing population, a growing business count, and cited "lack of regulation causing a surge of funeral directors" means many new small entrants with no incumbent relationship.
- Veterinary: UK pricing is opaque and the visible market is US-priced ($119-299/mo). Worth a discovery pass specifically on whether UK small animal practices are underserved at the £49-99 tier.
- Common shape: incumbents are quote-only and demo-led, which means a self-serve £79-99 product with a published price is itself the differentiator.

4. ZENDESK/MARKETPLACE ECOSYSTEM APPS (the Swifteq model)
- Why it deserves consideration: it is the ONLY verified solo-founder path in this report (€44k/month, November 2025) and it solves the owner's single biggest weakness — having no audience and no way to reach buyers. The marketplace is the distribution.
- Who buys: businesses already paying for the host platform, so budget and card-on-file already exist. Price sensitivity is much lower than a UK sole trader's.
- HARD CAVEATS, both evidenced: (a) the median listed Shopify app earns under $1,000/month — marketplace presence is not distribution, ranking is; (b) platform risk is live and current — Xero retired revenue-share on 2 March 2026 for connection/egress tiers up to $895/mo, described in trade press as a rug pull, and Checkout X was killed by Shopify at €600k MRR. MODEL THE PLATFORM FEES AT 48 CUSTOMERS BEFORE COMMITTING. Under Xero's new tiers a 48-customer app could face material fees before any profit. Zendesk and Shopify economics currently look better than Xero's.

=== EXPLICITLY DO NOT BUILD ===
- Invoicing, bookkeeping or MTD accounting software (QuickBooks £10/mo; FreeAgent FREE with a NatWest/RBS/Ulster/Mettle account — you cannot beat free-with-a-bank-account).
- Electrical or gas certificate apps (already commoditised to £10.99-25/mo across at least five UK vendors competing on "unlimited certificates").
- Salon/beauty booking (Fresha is payments-subsidised at £14.95; Treatwell takes 20-35% commission).
- Driving instructor diaries (ADI Network is completely free; ~40k total market; low willingness to pay).
- General trades job management (nine-plus vendors at £15-44/user/mo).
- Generic CRM, project management, or any AI wrapper (structural margin problem: you pay per token, they pay per month).

=== THREE CROSS-CUTTING DESIGN DECISIONS THE EVIDENCE SUPPORTS ===
a) PRICE AT £79-99, NOT £49. Halves the customer count (24 vs 48), halves support load for the same revenue, and stays inside the self-serve micro-business ACV band ($500-2,000). £99 is above the no-conversation ceiling but not above the psychological ceiling — and since the owner is doing sales anyway, a demo call is an asset here, not a cost.
b) ANNUAL BILLING AS THE DEFAULT. Annual subscribers churn at ~one-third the rate of monthly, and monthly-to-annual-default switches cut churn 40-60%. At 5% monthly churn the 48-customer plan needs ~5-6 new customers EVERY MONTH just to climb; annual billing is the single highest-leverage change available.
c) TREAT IT AS AN ASSET FROM DAY ONE. At £2,335/mo and ~64% margin (~£18k SDE), the business is worth roughly £70k at Acquire.com's stable 3.9x median. What sells under £100k is "12+ months of verified revenue in a category buyers understand" — so clean books, a boring enumerable niche, and Stripe from the first customer.

## KEY CLAIMS
- ~70% of micro-SaaS founders make under $1,000 MRR; the median PROFITABLE micro-SaaS makes ~$4.2k MRR; only 1-2% exceed $50k MRR. Separately, across 8,000+ tracked startups the MEDIAN MRR is $145 and only ~6.1% clear $10k MRR. The £2,335/month target therefore requires landing in roughly the top 10-15% of all micro-SaaS outcomes.
  SOURCE: https://saasranger.com/blog/micro-saas-revenue-reality-what-1000-founders-actually-earn/ (citing MicroConf State of Independent SaaS) and https://bigideasdb.com/bootstrapping-a-company-in-2026 — accessed 17 Aug 2026. NOTE: microconf.com itself was egress-blocked; these are secondary reports of the MicroConf survey.
- VERIFIED SOLO CASE STUDY: Swifteq (Sorin Alupoaie, solo, Dublin, bootstrapped) reached >€20k MRR with 300+ customers by June 2024 and a €44k/month portfolio by November 2025, selling small quality-of-life apps via the Zendesk marketplace — explicitly without a Product Hunt launch. This is the most relevant and best-corroborated example found.
  SOURCE: https://medium.com/@asorin/getting-to-20k-mrr-with-swifteq-234ad1eefa72 ; https://www.indiehackers.com/product/swifteq-apps/getting-to-20k-mrr-with-swifteq--O-yq-LdknOUPxdjmasT ; https://www.starterstory.com/swifteq-breakdown — accessed 17 Aug 2026
- UK vertical software prices barbell: a dense floor at £10-35/mo (Fresha £14.95, Checker £10.99+VAT, Gymcatch £12.75, DriveSchoolPro £22, Powered Now £19-27/user, Tradify £34-44/user) and a dense ceiling at £95-500/mo (Famly £94.80-238.80/setting, Jupix £95-120/user, Alto £300-500, LettingGuru from £299, funeral SaaS £400-500). The £49-99 band is comparatively empty. Anchor price for 'essential' UK software is accounting: QuickBooks Sole Trader £10/mo, Xero Starter £16/mo, FreeAgent £19/mo (free for NatWest/RBS/Ulster/Mettle customers).
  SOURCE: https://www.dothebeauty.com/blog/fresha-cost-uk-salons ; https://checker.app/best-eicr-electrician-software-uk-2026/ ; https://dashlink.media/tradify-alternatives-uk/ ; https://esremedia.co.uk/blog/famly-alternatives-uk-nursery-software ; https://lettingguru.co.uk/blog/property-management-software-for-letting-agents/ ; https://taxroot.co.uk/blog/xero-vs-quickbooks-vs-freeagent-uk — all accessed 17 Aug 2026
- UK REGULATORY FORCING FUNCTION 1 — Employment Rights Act 2025 (Royal Assent 18 Dec 2025): from 6 April 2026 employers must keep annual leave and holiday pay records for at least 6 years, and failure to keep adequate records is a CRIMINAL OFFENCE subject to a fine. From October 2026, shift notice and cancellation payment rights apply, with notice given close to a shift presumed unreasonable.
  SOURCE: https://www.brownejacobson.com/insights/employment-rights-act-2025-new-record-keeping-obligation ; https://www.bakermckenzie.com/en/insight/publications/2026/04/united-kingdom-new-record-keeping-obligations-for-annual-leave ; https://workplacecomply.co.uk/guides/zero-hours — accessed 17 Aug 2026
- UK REGULATORY FORCING FUNCTION 2 — Renters' Rights Act 2025: main reforms live 1 May 2026; the Private Rented Sector Database goes live late 2026 requiring all private landlords in England to register properties, pay annual fees and keep tenancy/compliance/certificate information updated within specified timeframes. Non-registration penalties include fines up to £5,000, inability to serve Section 8 possession notices, and potential prohibition orders. Current tooling gap: spreadsheets (£0) or Alto/Jupix (£300-500/mo), with nothing at £49-99.
  SOURCE: https://www.elliotleigh.com/post/prs-database-registration-2026-everything-landlords-need-to-know/ ; https://www.nrla.org.uk/resources/renters-rights ; https://housinghub.campaign.gov.uk/wp-content/uploads/sites/172/2026/03/503154_MHCLG_PRS_A4_Checklist_HiRes_Web50.pdf — accessed 17 Aug 2026
- UK REGULATORY FORCING FUNCTION 3 — MTD for Income Tax live from 6 April 2026 for sole traders/landlords with GROSS income (turnover, not profit) over £50,000; £30,000 from April 2027; £20,000 from April 2028. Readiness is very low: an IPSE/Sage survey found 66% of UK sole traders use spreadsheets, 56% rely on bank statements, 33% use pen and paper, and only 10% use cloud accounting software. Only 17% of UK micro businesses report adopting the latest digital tools.
  SOURCE: https://www.fsb.org.uk/resources/article/making-tax-digital-2026-deadlines-rules-and-more-MCQVRXUNIJC5EQRAZBQ7DFJNGYMA ; https://cfotech.co.uk/story/uk-sole-traders-unready-for-making-tax-digital-shift ; https://www.ipse.co.uk/downloads/making-tax-digital-readiness-report ; https://www.gov.uk/government/publications/sme-digital-adoption-taskforce-2026-update/sme-digital-adoption-taskforce-2026-update — accessed 17 Aug 2026
- CHURN MATHS: SMB self-serve products run 3-7% monthly churn (healthy SMB logo churn 2-4%). At 5%/month, holding 48 customers at £49 means losing ~2.4/month at steady state, requiring ~5-6 gross new customers per month to reach the target inside a year — roughly one new paying customer per week, sustained. Critical lever: annual subscribers churn at ~one-third the rate of monthly, and switching from monthly-default to annual-default billing typically drops churn 40-60%.
  SOURCE: https://www.koji.so/blog/saas-churn-rate-benchmarks-2026 ; https://getspike.ai/blog/saas-churn-rate-benchmarks/ ; https://growigami.com/blog/saas-churn-rate-benchmarks — accessed 17 Aug 2026
- PLATFORM RISK IS REAL AND CURRENT: Xero retired its App Store 15% revenue-share model from 2 March 2026, replacing it with tiered API pricing based on active connections and data egress — $0/month (Starter, 5 connections) up to $895/month (Advanced). Trade press describes it as feeling like 'a rug pull that threatens their survival' for smaller vendors. Separately, Checkout X reached ~€600k MRR on Shopify before being shut out by the platform.
  SOURCE: https://www.accountingtoday.com/news/xero-shifts-to-tiered-pricing-model-for-developers ; https://www.accountingweb.co.uk/tech/accounting-software/xeros-api-shift-who-owns-the-accounting-data ; https://truto.one/blog/xero-api-pricing-changes-2026-costs-tiers-and-how-to-minimize-egress/ ; https://www.linkedin.com/pulse/bootstrapping-600k-mrr-getting-killed-shopify-story-x-ruslan-leteyski — accessed 17 Aug 2026
- MARKETPLACE DISTRIBUTION IS NOT A FREE LUNCH: the median listed Shopify app earns under $1,000/month and a meaningful share earn nothing; only the top 10% of a category make $5k-50k MRR. 80.4% of App Store apps come from single-app partners and 82.4% of developers focus on one app. Developers keep 100% of their first $1m/yr gross app revenue (from 1 Jan 2025), 85% above that.
  SOURCE: https://weekonelabs.com/blog/shopify-app-revenue-benchmarks-2026/ ; https://craftberry.co/articles/shopify-app-store-statistics ; https://shopify.dev/docs/apps/launch/distribution/revenue-share — accessed 17 Aug 2026
- EXIT VALUE: Acquire.com's median SaaS acquisition profit multiple held steady at 3.9x SDE across both 2024 and 2025 (Jan 2026 biannual report). Flippa SaaS transactions rose 73.5% in 2025, sweet spot $100k-500k with average deal size $323k and profit multiples of 2.1x-2.9x by tier; under $100k, what sells is 12+ months of VERIFIED revenue in categories buyers understand. A business at £2,335/mo revenue and ~64% margin (~£18k SDE) implies roughly a £70k asset at 3.9x.
  SOURCE: https://blog.acquire.com/acquire-com-biannual-acquisition-multiples-report-jan-2026/ (page egress-blocked; figures via search extract) ; https://ctacquisitions.com/microacquire-acquire-com-platform-guide/ ; https://exitbid.io/blog/flippa-review-2026 — accessed 17 Aug 2026
- VERTICAL-SAAS STICKINESS IS OVERSOLD: ServiceTitan's S-1 shows >95% gross retention and >110% net dollar retention for 10 consecutive quarters (FY2025 revenue $771.9m, +26%) — but SaaS Capital benchmark data shows the retention difference between vertical and horizontal SaaS is 'minor and mixed', NOT the 3x advantage commonly claimed online. Choosing a boring vertical does not automatically buy retention; being embedded in a recurring workflow does.
  SOURCE: https://www.saasmag.com/vertical-saas-niche-beats-horizontal-2026/ (reporting both ServiceTitan S-1 and SaaS Capital) — accessed 17 Aug 2026
- MARKET SIZE IS NOT THE CONSTRAINT: 48 customers represents under 1% of every candidate UK vertical — 26,374 estate/letting agent businesses (2026, +2.2% YoY) = 0.18%; 15,162 UK nurseries (March 2026) = 0.32%; 5,329 UK funeral directors (April 2026) = 0.90%; ~37,000-43,334 ADIs = ~0.12%. All are enumerable lists, which suits manual outbound by a non-technical founder.
  SOURCE: https://www.ibisworld.com/united-kingdom/number-of-businesses/estate-agents/3845/ ; https://www.daynurseries.co.uk/advice/early-years-facts-and-stats ; https://rentechdigital.com/smartscraper/business-report-details/list-of-funeral-directors-in-united-kingdom ; https://www.gov.uk/government/statistical-data-sets/driving-instructor-and-motorcycle-instructor-register-data — accessed 17 Aug 2026
- PRICE CEILING: self-serve B2B typically requires an entry point below $99/mo; micro businesses (1-10 employees) buy self-serve at $500-$2,000 ACV, while 11-50 employee firms shift to inside sales at $2k-15k ACV. Sub-$5k ACV trials convert at 16-28% because the decision is unilateral. £49/mo (£588 ACV) and £99/mo (£1,188 ACV) both sit inside the self-serve band — £99 is above the no-conversation ceiling, not above the psychological ceiling.
  SOURCE: https://blume.vc/commentaries/pricing-201-for-b2b-saas-companies-price-product-fit ; https://www.saber.app/glossary/smb-account ; https://www.growthspreeofficial.com/blogs/b2b-saas-trial-to-paid-conversion-rate-benchmarks-2026-by-trial-type-acv-length-credit-card — accessed 17 Aug 2026
- GRAVEYARD EVIDENCE: (a) invoicing/bookkeeping is unwinnable — QuickBooks Sole Trader £10/mo and FreeAgent free for all NatWest/RBS/Ulster/Mettle customers; (b) electrical/gas certificate apps are already commoditised at £10.99-25/mo across Checker, Tradecert, GasCert, Gas Certificate App and Powered Now; (c) salon booking is payments-subsidised — Fresha £14.95 solo plus 1.40%+25p card fees and a 20% marketplace new-client fee, Treatwell 20-35% commission; (d) driving instructor diaries have a completely free incumbent (ADI Network); (e) Product Hunt featured products fell from 47/day to 16/day (Sept 2023 to 2024), a 66% decline.
  SOURCE: https://taxroot.co.uk/blog/xero-vs-quickbooks-vs-freeagent-uk ; https://checker.app/best-eicr-electrician-software-uk-2026/ ; https://www.dothebeauty.com/blog/fresha-cost-uk-salons ; https://www.subseat.co.uk/blog/how-much-does-treatwell-cost-per-month-2026 ; https://www.adinetwork.co.uk/why-join-adi/free-driving-instructor-app ; https://chyshkala.com/blog/micro-saas-reckoning-ai-changed-everything-2025 — accessed 17 Aug 2026
- LIKELY FABRICATED SOURCE — FLAGGED: the widely-recirculated 'Auxpanel / Sophia Chou dental compliance, $30-50k MRR from 100+ dental practices at $300-500/practice/month' case study could not be corroborated by any company website, founder record, or independent source. I assess it as probably AI-generated fiction and it should not be cited. This matters because near-identical uncited revenue claims dominate search results for this topic (ideaproof.io, bigideasdb.com, flowjam.com, vibrantsnap.com, solopreneurpage.com et al.).
  SOURCE: https://medium.com/@urano10/vertical-saas-micro-niches-beyond-the-obvious-01e0adf16a98 — accessed 17 Aug 2026; no corroborating source found

## GAPS
SIGNIFICANT GAPS AND CONFIDENCE LEVELS.

1. WEBFETCH WAS BLOCKED FOR NEARLY EVERY PRIMARY SOURCE. The network egress proxy returned EGRESS_BLOCKED or a 403-at-CONNECT for microconf.com, blog.acquire.com, indiehackers.com, flippa.com, getapp.co.uk, capterra.co.uk, tradifyhq.com, powerednow.com, teamup.com, gov.uk and the IPSE/Sage PDF. I could NOT read a single vendor pricing page or benchmark report directly. Every price and statistic here is a search-engine extract of those pages. CONFIDENCE: prices quoted as vendor headline figures (Fresha £14.95, Famly £94.80/£178.80/£238.80, Checker £10.99+VAT, DriveSchoolPro £22, Blossom ~£49) are probably accurate; "typical range" figures invented by comparison blogs (e.g. "funeral SaaS £400-500/mo", "cleaning £20-80/mo") are weak. BEFORE ACTING ON ANY PRICE, THE OWNER SHOULD OPEN THE VENDOR'S PRICING PAGE IN A BROWSER — this is a five-minute check I could not perform.

2. THE EVIDENCE BASE FOR THIS TOPIC IS HEAVILY AI-POLLUTED — this is itself a finding. Searches for micro-SaaS revenue return dozens of near-identical 2026-dated listicles with precise, uncited, mutually inconsistent MRR figures. I identified one case study ("Auxpanel"/"Sophia Chou", dental compliance) that I believe is fabricated, and I distrust the Notionlytics/$43,160, Angel Match/$39,328 and Simple Analytics/$39,353 figures for the same reason. LOW CONFIDENCE in any MRR number in this report EXCEPT Swifteq (founder-published, multi-source) and ServiceTitan (S-1 disclosed).

3. I FOUND NO VERIFIED UK SOLO-FOUNDER VERTICAL SAAS AT £2-20k MRR. This is the most important gap relative to the brief. My search for UK-based founders with disclosed GBP revenue returned nothing usable. The one solid solo case study (Swifteq) is Irish, technical, and marketplace-app-based rather than UK-vertical-SaaS. I cannot show you a named person in the UK who has done the specific thing being contemplated. That absence is weak evidence against, not neutral — though it may equally reflect that UK indie founders publish revenue less than US ones.

4. WILLINGNESS-TO-PAY IS INFERRED, NOT MEASURED. The claim that £49-99 sits in an empty band is derived from listed incumbent prices, not from any survey of what UK small businesses would pay an unknown vendor. I found no study of price sensitivity or vendor-trust thresholds for UK SMBs. The self-serve ceiling evidence ($99 entry point, $500-2k micro-business ACV) is US-centric and from marketing-agency blogs. MEDIUM-LOW CONFIDENCE on §3 of the report. This is the single highest-value thing for the owner to test directly in customer discovery — ten phone calls would beat everything I found.

5. CHURN AND AI-WRAPPER FIGURES COME FROM MARKETING BLOGS. The 3-7% SMB churn band, the "annual billing cuts churn 40-60%" claim, and all the AI-wrapper failure statistics (90% fail, 65% 90-day churn, 25-35% margins) are from SEO content, not primary research. The DIRECTION is corroborated across many independent sources and the AI-wrapper margin argument is structurally sound on first principles, but treat the precise numbers as indicative only.

6. COMPETITIVE DEPTH IN THE TIER-1 OPPORTUNITIES IS UNVERIFIED. I did not search for existing PRS Database compliance products, and I could not check whether MHCLG intends to ship free tooling alongside the database — that single fact could invalidate opportunity #1 entirely. For the holiday-records opportunity I have clear evidence that incumbents (RotaCloud, BrightHR, Employment Hero, PeopleHR, Rotageek) are already marketing on the Act, but no evidence on whether small employers actually bought anything in April 2026 or simply carried on with spreadsheets. BOTH TIER-1 IDEAS NEED A COMPETITIVE SWEEP AND CUSTOMER CALLS BEFORE ANY BUILDING.

7. NOT COVERED FOR LACK OF SEARCH BUDGET: restaurants/hospitality, care homes, physiotherapy/chiropractic, opticians, garages/MOT, security firms, scaffolding/plant hire, courier and man-and-van, tutors. UK Gas Safe registered engineer count could not be found. Acquire.com and Flippa category-level breakdowns (which categories sell most) could not be retrieved — I have overall multiples but not the per-category picture the brief asked for.

8. TIMELINE CONFIDENCE. "First paying customers within months" is well supported. "£2,335/month within months" is not supported by anything I found; the evidence points to 12-24 months, and to a distribution problem rather than a build problem. I am confident in that directional claim and would flag any plan assuming faster as unrealistic.