# Distribution: how a non-technical UK solo founder actually gets 10, then 48, paying business customers

**Methodological warning up front.** The egress proxy in this environment blocked direct fetches to `ico.org.uk`, `legislation.gov.uk`, `gov.uk`, `developer.xero.com`, `shopify.dev`, `indiehackers.com`, `freemius.com`, `mayerbrown.com` and most law-firm domains. I could not read the primary sources directly. Everything below marked "primary" is a **search-engine extract quoting** the primary source, not a page I read myself. Treat the legal section as good enough to plan around but **get it confirmed by reading the ICO pages directly before you send a single email**. Separately: the 2026 "micro-SaaS statistics" web is saturated with AI-generated content marketing citing each other's invented numbers. I have flagged low-quality sources explicitly rather than laundering them.

---

## 1. Bottom line

**The plan is viable, but only through one door, and it is not the door most people expect.**

- The fastest, cheapest, and most legally clean route to your first 10 UK business customers is **the telephone, to limited companies, in one narrow vertical, made by you personally**. The arithmetic says roughly 850–2,250 dials for 10 customers — about 15–55 working days of real effort. Nothing else comes close on cost, speed, or legality.
- **Cold email is legally crippled in the UK for this use case.** 63% of the UK business population (3.2m sole proprietorships + 368k ordinary partnerships out of 5.7m) are "individual subscribers" under PECR and **cannot lawfully be cold-emailed without consent**. Only the 2.1m limited companies/LLPs are fair game. And on 2026 reply rates, high-volume cold email needs 2,400–13,300 sends to produce 10 customers — which at safe deliverability limits is 3–15 months on a single mailbox.
- **Marketplaces are not the shortcut they look like.** Shopify has ~18,368 apps and a **median new-app revenue of $0**. Xero has a much smaller pond (~1,000 apps) but on 2 March 2026 **scrapped its 15% revenue share and started charging developers**, with the free tier capped at **5 connections** — i.e. you cannot serve 24 customers on the free tier. QuickBooks review takes **6 weeks to 6+ months**.
- **SEO is dead as a first-10 channel** and roughly dead as a first-50 channel inside your timeline. AI Overviews cut position-1 CTR by up to 58%; 69% of searches now end without a click.
- The single highest-leverage conversation available to you is **not with a customer — it is with someone who already has 50 of them**: one accountant, one trade-association officer, one industry consultant.

Honest expectation: **first paying customer in 2–4 months is realistic if you go phone-first and narrow. £2,335/month is a 12–24 month project**, and roughly 70% of micro-SaaS never clears $1,000 MRR at all.

---

## 2. The legal box — what you may actually do

This section is the hard constraint. Get it wrong and the penalty ceiling is no longer trivial.

### 2.1 The subscriber distinction is the whole ballgame

PECR splits recipients into **individual subscribers** and **corporate subscribers**:

- **Corporate subscribers** = limited companies, LLPs, Scottish partnerships, government bodies. The reg 22 electronic-mail consent rule **does not apply** to them. ([ICO, via search extract](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/))
- **Individual subscribers** = people, **sole traders, and ordinary (English/Welsh/NI) partnerships**. These are treated exactly like consumers: you need **prior consent or the soft opt-in**. ([ICO, via search extract](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/electronic-and-telephone-marketing/electronic-mail-marketing/))

**Size that constraint.** ONS: at the start of 2025 there were **5.7m private-sector businesses: ~3.2m sole proprietorships (57%), ~2.1m companies (37%), ~368,000 ordinary partnerships (6%)**. ([ONS UK business activity, size and location 2025](https://www.ons.gov.uk/businessindustryandtrade/business/activitysizeandlocation/bulletins/ukbusinessactivitysizeandlocation/2025), via search extract)

So: **63% of UK businesses are off-limits to cold email.** If your target vertical is trades, salons, gardeners, freelancers, small consultancies, market traders, or anything else where the typical operator is unincorporated, **cold email is not a channel you have**. If you target anything with a limited company (agencies, wholesalers, care providers, MOT garages, nurseries, small manufacturers), it is.

**Practical screening workflow:** Companies House is free to search and lists every UK limited company and LLP; sole traders never appear on it. So "is it on Companies House?" is a workable, cheap legality filter for list-building. ([Companies House register](https://find-and-update.company-information.service.gov.uk/), via search extract)

### 2.2 UK GDPR still applies on top, even for corporate subscribers

PECR exempting corporate subscribers does **not** exempt you from UK GDPR. `ben@acmeltd.co.uk` is personal data about a named individual.

- You need a lawful basis — in practice **legitimate interests, with a documented Legitimate Interests Assessment (LIA)**.
- You must be **transparent** (privacy notice, reachable).
- The **right to object to direct marketing is absolute** under UK GDPR — one objection, you stop, permanently. ([Harper James, via search extract](https://harperjames.co.uk/article/b2b-marketing-and-gdpr-the-basics/))

### 2.3 Regulation 23 applies to everyone, including corporate subscribers

You may not disguise or conceal the sender's identity, and you must give a valid address for opt-out requests. This applies to B2B marketing email too. ([ConsentTrail summary of reg 23](https://consenttrail.co.uk/blog/b2b-email-marketing-opt-out-rules)) Practically: real name, real company, real UK address, working unsubscribe, no spoofed "Re:" subject lines, no fake reply threads. The ICO's guidance is that you should honour corporate opt-outs and maintain a suppression list even though reg 22 doesn't compel it.

### 2.4 Telephone: legal, but you must screen

- Live marketing calls to any number registered with **TPS or CTPS are prohibited without consent**. You are **legally required to screen your calling list against both registers before calling**. ([ICO enforcement notices, via search extracts](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/05/glasgow-based-energy-company-fined-160-000-for-making-unsolicited-marketing-calls/))
- **CTPS held over 1.2 million business numbers as of April 2025**, and registrations must be renewed annually. ([Data-8](https://www.data-8.co.uk/data-sources/corporate-telephone-preference-service-ctps/), [Accuradata](https://www.accuradata.co.uk/ctps-checker-the-complete-guide-for-the-ctps-register/)) Against ~5.7m businesses that is roughly a 20%+ suppression rate on a naive list — significant, not fatal.
- You must **identify yourself**, **display your number (CLI)**, and give contact details.
- The register is licensed via the DMA. You will need a screening service; I could not obtain current pricing (see gaps).

**Enforcement is real and current.** March 2025: a compensation company fined **£90,000** for 95,277 calls without valid consent. May 2026: a Glasgow energy company fined **£160,000** for unsolicited marketing calls. ([ICO media centre](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2025/04/compensation-company-fined-90-000-for-unlawful-marketing-calls/))

### 2.5 The penalty ceiling changed in 2026 — this is new and material

The **Data (Use and Access) Act 2025** (Royal Assent 19 June 2025) raised the maximum PECR penalty from **£500,000 to £17.5m or 4% of global turnover**, aligning PECR with UK GDPR. Multiple sources put the fines change in force on **5 February 2026**. ([Blake Morgan](https://www.blakemorgan.co.uk/data-use-and-access-act-2025-privacy-and-electronic-communications-regulations/), [MFMac](https://www.mfmac.com/insights/data-protection/data-use-and-access-act-2025-increased-maximum-fines-for-cookies-and-direct-marketing-practices/), [LegalVision](https://legalvision.co.uk/data-privacy-it/data-use-access-act-2025/))

For a one-person business the realistic exposure is not £17.5m, it is an ICO investigation you cannot afford to answer. But it means **every 2023-vintage "growth hacking" playbook you read is now operating under a 35x higher penalty ceiling**, and the ICO has flagged nuisance marketing as a priority area.

### 2.6 The constraint nobody mentions: LinkedIn DMs are "electronic mail"

The ICO's definition of electronic mail is broad and per multiple summaries of the 2022 guidance explicitly includes **"in-app messages and direct messaging on social media."** ([ICO guidance on direct marketing using electronic mail, via search extract](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-direct-marketing-using-electronic-mail/); [BDO summary](https://www.bdo.co.uk/en-gb/insights/advisory/risk-and-advisory-services/guidance-on-direct-marketing-using-electronic-mail))

The subscriber of a LinkedIn account is **the individual**, not their employer. Read strictly, **cold LinkedIn DMs containing marketing require consent**, regardless of whether the person works for a limited company. This is the single most widely ignored rule in UK B2B outreach.

**Honest weighting:** I found no evidence of the ICO ever fining anyone for LinkedIn DMs, and enforcement appears to be effectively nil. But you asked for evidence, not comfort: automated LinkedIn outreach is legally exposed, and it is also the channel most likely to get your account restricted by LinkedIn itself. **Genuine 1-to-1 conversations that are not marketing** (research questions, "can I ask you about how you handle X") sit outside "direct marketing" and are the safe version of this channel.

### 2.7 One unavoidable running cost

Processing personal data for marketing means you must register with the ICO and pay the **data protection fee: Tier 1 = £52/year (£47 by direct debit)** for organisations with turnover ≤£632k or ≤10 staff. This applies to sole traders and one-person limited companies. ([ICO fee guide, via search extract](https://ico.org.uk/for-organisations/data-protection-fee/data-protection-fee/); [ICO on X, Feb 2025](https://x.com/ICOnews/status/1891472805641806031))

That is ~£4.35/month of your £0–60 budget, and it is not optional.

---

## 3. The arithmetic — what "48 customers" actually costs in conversations

This is where most plans die. Let me build the funnel from 2026 benchmarks rather than vibes.

### 3.1 Cold email — the numbers are worse than you think

| Metric | 2026 benchmark | Source |
|---|---|---|
| Open rate | 27.7% | [Instantly Cold Email Benchmark Report 2026](https://instantly.ai/cold-email-benchmark-report-2026) |
| **Total** reply rate | 3.43% (range 3.43–5.8%) | Instantly / [Prospeo](https://prospeo.io/s/b2b-cold-email-reply-rates) |
| **Positive** reply rate | **0.5–2%** | [Cleanlist, Feb 2026](https://www.cleanlist.ai/blog/2026-02-18-cold-email-response-rate-statistics) |
| YoY trend | 6.8% (2023) → 5.8% (2024), −15% YoY on a 16.5M-email dataset | Instantly |
| Software-sector recipients | **<1% reply** — worst industry | [Cleverly](https://www.cleverly.co/blog/cold-email-benchmarks-by-industry) |

Chain that with SMB sales conversion — demo-to-close 20–30% median for sales-led motions, B2B SaaS win rates 21–30% ([Forrester 2026 B2B Sales Benchmark via Growthspree](https://www.growthspreeofficial.com/blogs/b2b-saas-demo-request-conversion-rate-benchmarks-2026); [Orbix](https://www.orbix.studio/blogs/b2b-saas-conversion-rate-benchmarks)) — and assume 60–70% of positive replies actually take a call:

> **Emails → customer = 0.075% (pessimistic) to 0.42% (optimistic).**
> **10 customers ≈ 2,400–13,300 emails. 48 customers ≈ 11,500–64,000 emails.**

Now apply the physical constraint: safe cold-sending is roughly **20–50 emails/day per mailbox** before deliverability collapses. At 40/day, 5 days a week, one mailbox sends ~870/month. **10 customers = 3 to 15 months on one mailbox.** Scaling past that means multiple domains and inbox-warming tools — which costs money you don't have and increases both spam risk and legal exposure.

**A widely repeated heuristic says "500 cold prospects → 50 demos → 10 customers."** ([LaunchAdvisor](https://www.launchadvisor.co/guides/how-to-close-your-first-10-customers-software-publishers-saas)) Cross-checked against the reply-rate data above, **that is optimistic by roughly 5–10x** for genuinely cold, automated outreach. It is only achievable with warm intros or extreme personalisation. Do not plan against it.

**The one version of email that does work.** A founder sending 20 genuinely researched, specific, non-templated emails a day into one narrow vertical can plausibly hit 5–10% positive reply — this is anecdotal and I could not source it rigorously, so weight it accordingly — which collapses the maths to **~600 emails for 10 customers**, i.e. 6–8 weeks. The strategy that follows is therefore: **narrow + personal + low volume**, never broad + automated. This happens to also be the version that stays legal and deliverable.

### 3.2 Cold calling — materially better maths, and the law is on your side

| Metric | 2026 benchmark | Source |
|---|---|---|
| Dials per booked meeting | **25–35** (top performers 12–18); alternative dataset 40–45 | [Skipcall](https://skipcall.io/en/blog/how-many-cold-calls-to-book-a-meeting), [Belkins](https://belkins.io/blog/cold-calling-benchmarks) |
| Connect rate | 8–12% generic data; 18–22% verified direct dial | Skipcall |
| SMB rep daily volume | 80–100 dials/day | Skipcall |
| Meeting → closed | 20–30% (SMB) | Forrester 2026 via Growthspree |

> **~85–225 dials per customer. 10 customers ≈ 850–2,250 dials.**
> At 40–60 dials/day for a determined solo founder: **15–55 working days.**

**Cost: near zero.** A VOIP line is ~£10/month. The only real costs are CTPS screening and your time.

**This is the finding that decides your plan.** For a UK founder with no audience, no dev skills and no budget, **the phone is 3–10x more time-efficient than cold email, cheaper, legally cleaner for limited companies, and it doubles as customer discovery** — you hear the objection in the person's own words, immediately, which email never gives you.

The obvious counter — "cold calling is horrible" — is true and irrelevant. It is the channel that is available.

### 3.3 The pricing/trial decision is worth more than any channel choice

| Trial model | Trial-to-paid conversion | Source |
|---|---|---|
| Opt-in (no card) | 8–22%, **median 14%** | [Growthspree 2026](https://www.growthspreeofficial.com/blogs/b2b-saas-trial-to-paid-conversion-rate-benchmarks-2026-by-trial-type-acv-length-credit-card) |
| **Opt-out (card required)** | 35–55%, **median 44%** | Growthspree 2026 |
| Overall median | 18.5%, bimodal (20% convert <2.5%; 23% convert >25%) | Growthspree 2026 |

MicroConf's founder survey found **70% of bootstrapped founders now ask for a card upfront**. ([via Freemius State of Micro-SaaS 2025](https://freemius.com/blog/state-of-micro-saas-2025/))

**Implication for you:** to net 48 customers, an opt-in free trial needs ~340 trials; card-required needs ~110. You cannot afford a leaky funnel at these volumes. **Take a card upfront. Sell annual where you can.** Also: founder contact within 4 hours of trial start took conversion to 34.1% vs 13.6% for automated email only (Growthspree) — as a solo founder with 10 customers, you can personally onboard every single one, and that is a genuine structural advantage over funded competitors.

### 3.4 Churn — the thing that turns 48 into a treadmill

I could not source a defensible SMB micro-SaaS churn benchmark, so treat this as **modelling, not evidence**: at a typical 5%/month logo churn, 48 customers bleed ~2.4/month. You must gross-acquire ~60–70 customers to hold 48, and once there you must keep landing ~2–3/month forever. **£2,335/month is not a finish line, it is a running speed.** This materially favours channels that produce recurring inbound (partners, marketplace, community reputation) over channels that only produce one-off pushes (a launch, a mailshot).

---

## 4. Channel-by-channel evidence

### 4.1 Marketplaces — investigate, but they are not a shortcut

**Shopify App Store — do not start here.**

- **~18,368 apps as of May 2026**, with **865 added in the last 30 days (+55% YoY)**. ([StoreCensus](https://www.storecensus.com/stats), [AppNavigator](https://appnavigator.io/statistics/))
- **Of ~700 apps launched in a given quarter, total revenue averaged $29,471 — an average of $39.72 per app and a MEDIAN OF $0.** ([Week One Labs, Shopify App Revenue Benchmarks 2026](https://weekonelabs.com/blog/shopify-app-revenue-benchmarks-2026/))
- **The median listed app earns under $1,000/month.** Top 1% clear $1M+ ARR; top 10% clear $100K+ ARR. Brutally power-law. (Week One Labs)
- **34.14% of apps (3,315) have zero reviews.** ([Craftberry](https://craftberry.co/articles/shopify-app-store-statistics))
- **~60% of installs start with an in-store search**, and new apps reportedly need **10+ reviews in the first 30 days** to gain ranking traction. ([Prys](https://prys.io/learn/shopify-app-store-ranking-factors))
- Revenue share: **0% on the first $1,000,000 USD, 15% thereafter**. ([shopify.dev](https://shopify.dev/docs/apps/launch/distribution/revenue-share))
- You **must** use the Shopify Billing API — not Stripe — so Shopify controls your pricing, currency and payments.
- Policy 1.3 (published 6 July 2026) added escalating penalties for incentivised reviews: review removal, demotion, delisting, Partner account termination. ([shopify.dev App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements))

**Verdict:** listing on Shopify is entering an 18,000-competitor SEO market where the median outcome is zero, you can't ask for reviews aggressively, and your customers are global (so support is 24/7). It is a lottery ticket, not distribution.

**Xero App Store — much smaller pond, but the economics inverted in March 2026.**

- **~1,000 apps as of May 2026** ([Xero blog](https://blog.xero.com/us/news-events/celebrating-1000-apps/)) — roughly **18x less crowded than Shopify**, and Xero is UK/AU/NZ-weighted, which matches your market.
- **This is the critical change:** announced 4 December 2025, effective **2 March 2026**, Xero **retired the 15% revenue-share model** and replaced it with **five tiered developer plans (Starter, Core, Plus, Advanced, Enterprise)** priced on **connections and API data egress**. ([Accounting Today](https://www.accountingtoday.com/news/xero-shifts-to-tiered-pricing-model-for-developers), [Truto](https://truto.one/blog/xero-api-pricing-changes-2026-costs-tiers-and-how-to-minimize-egress/), [Codat](https://docs.codat.io/updates/260116-xero-pricing/))
- **Starter = $0 but capped at 5 connections.** Advanced = **$895/month** with 10,000 connections. Core includes 10GB egress/month, Plus 50GB, Advanced 250GB; **overages at $1.50/excess GB**. Existing apps migrate from 2 March 2026 and must transition by **1 July 2026**.
- App partner certification requires **at least 3 active customer connections within a 30-day period** during review.

**Verdict:** the pond is right but **the free tier caps you at 5 customers, and you now pay Xero before you have revenue.** I could not obtain the Core/Plus monthly prices (blocked). **This is the single most important number to verify before committing to a Xero-integrated product**, because if Core costs more than ~£40/month it eats most of your budget at 5 customers.

**QuickBooks App Store — too slow for your timeline.**

- Technical review validates against **14 technical requirements**, includes a **mandatory scheduled call** with the review team for first-time listings, and there is an **annual re-review** on the publication anniversary. ([Intuit Developer](https://developer.intuit.com/app/developer/qbo/docs/go-live/publish-app/technical-requirements), [Intuit blog, Mar 2025](https://blogs.intuit.com/2025/03/27/speed-through-the-review-process-to-list-on-the-quickbooks-app-store/))
- **Approval takes 6 weeks to 6+ months.** ([Satva Solutions](https://satvasolutions.com/blog/intuit-app-store-approval-timeline-developer-guide))

**Verdict:** you can build a QuickBooks integration and sell it *directly* from day one. The *listing* is a month-6+ project, not a launch channel.

**The one genuinely encouraging marketplace datapoint:** Gartner predicts that **by 2026, 80% of B2B software buyers will use marketplaces to initiate or complete purchases, up from 35% in 2021** ([via DigitalApplied](https://www.digitalapplied.com/blog/partner-channel-marketing-statistics-2026-data)) — and MicroConf found **47% of founders say integrations, partnerships, communities and forums became a more dependable source of growth** ([via Freemius](https://freemius.com/blog/state-of-micro-saas-2025/)). Marketplaces matter *eventually*. They do not produce customer #1.

### 4.2 Partner channels — your highest-leverage move

- **SaaS vendors get 24% of new customer revenue from partner channels.** ([DigitalApplied 2026](https://www.digitalapplied.com/blog/partner-channel-marketing-statistics-2026-data))
- **50% of MicroConf founders lean on communities and referrals, reporting stronger LTV — especially in the early stages.** ([via Freemius](https://freemius.com/blog/state-of-micro-saas-2025/))
- **73% of B2B buyers trust peer recommendations over other sources.** (MicroConf, via Freemius)

For the UK accountancy channel specifically, the *logic* is strong and the *independent evidence is thin*. IRIS, Unleashed, Starling and a dozen practices all run accountant referral programmes ([IRIS](https://www.iris.co.uk/blog/accountancy/how-accountants-add-value-with-saas-referral-partnerships/), [Unleashed](https://www.unleashedsoftware.com/blog/unleashed-new-referral-partner-programme), [Starling](https://www.starlingbank.com/referral/accountant/), [RQ's 2026 roundup](https://rq.app/blog/best-accountant-referral-programmes-uk)) — but every source asserting that "businesses are far more likely to adopt software recommended by their accountant" is a vendor selling a referral programme. **I found no independent measurement of what share of UK SMB software decisions are accountant-influenced.** Flag that as an assumption to test, not a fact.

What *is* structurally true and doesn't need a citation: **one bookkeeping practice with 80 small-business clients is 80 warm introductions in one conversation.** At your target of 48 customers, **two or three cooperative accountants is the entire business.** That asymmetry is the most important strategic fact in this report.

**Trade associations do run affinity/partner deals.** Concrete, dated example: on 4 August 2026 the **FSB launched an exclusive member offer with JournoLink**, an AI PR platform, accessible via the FSB Member Dashboard's Member Offers area. ([Love Business East Midlands, 4 Aug 2026](https://www.lovebusinesseastmidlands.com/love-business-news/2026/08/04/the-federation-of-small-businesses-fsb-launches-an-exclusive-member-offer-via-its-partner-journolink/); [FSB benefits](https://www.fsb.org.uk/membership/benefits)) The BFA also maintains a partner/supplier directory for franchising ([BFA partners](https://www.franchise-association.org.uk/directory_type/partners/)).

**Caveat, honestly stated:** JournoLink is an established vendor, not a two-month-old product. Affinity deals generally require credibility, references, and often a discount or fee. **This is a customer #30–100 channel, not a customer #1–10 channel.** But smaller sector-specific trade bodies (a regional trade association, a specialist institute with 2,000 members, a franchise network with 60 franchisees) are far more approachable than the FSB and are worth systematic cold-calling in their own right — the officer is the buyer of *your credibility*, and one yes reaches the whole membership.

### 4.3 SEO — structurally broken for a new site in 2026

| Finding | Source |
|---|---|
| AI Overviews reduce organic CTR for position 1 **by up to 58%** (Dec 2025), up from 34.5% in April 2025 | Ahrefs, via [GoodFirms](https://www.goodfirms.co/resources/seo-statistics-ai-search-rankings-zero-click-trends) |
| Users clicked organic results **8% of the time with an AI Overview present vs 15% without** | Pew Research, July 2025, via GoodFirms |
| Zero-click searches rose **56% → 69%** between May 2024 and May 2025 | Similarweb, via [DigitalApplied](https://www.digitalapplied.com/blog/zero-click-search-statistics-2026-complete-data) |
| **80–83% zero-click rate** on queries with AI Overviews | via DigitalApplied |
| Sharpest declines hit sites ranked **~100th to 10,000th** — i.e. everyone who isn't already dominant | via [The Digital Bloom](https://thedigitalbloom.com/learn/organic-traffic-crisis-report-2026-update/) |

A new domain typically needs 6–12+ months to rank for anything competitive even in a healthy environment. Combine that with a 58% CTR haircut on the traffic you'd eventually get, and **long-tail "software for [X]" SEO is a month-12-to-24 channel**. It is worth doing *cheaply and early* precisely because it compounds — write the pages, get listed on Capterra UK / GetApp / Software Advice — but **do not put it in your first-10-customers plan.**

One counterpoint worth keeping: **40% of successful micro-SaaS businesses rely on a single organic channel, primarily SEO and content**, and organic CAC runs $0–50 vs $200–600 paid ([via Freemius/Rockingweb](https://www.rockingweb.com.au/micro-saas-revenue-analysis-2025/)). SEO is how you eventually stop dialling. It is not how you start.

### 4.4 In-person and local — undervalued, and it demonstrably works

The best-documented case I found: a restaurant-management vertical SaaS where **two of three founders opened the Yellow Pages at "Restaurants", went A to Z, cold-called, then turned up at the door with an iPad showing mockups. They signed their first 50 paying clients over a single summer with no product** — only mockups — then hired reps and repeated the motion with Excel sheets and no targeting. ([Kima Ventures / Rachel Vanier on Medium](https://medium.com/kima-ventures/vertical-saas-sales-done-right-from-0-to-2500-customers-9bdbe00d9985))

**Weighting:** this is a single anecdote on Medium and appears to predate 2020 — treat the specific numbers as illustrative, not predictive. But the *structure* is exactly your situation: no product, no audience, no technical skill required, local businesses, face-to-face. And "50 paying clients from mockups" is precisely the pre-sell motion that de-risks Claude building the wrong thing.

**Trade shows: attend, do not exhibit.** UK exhibition space runs **£300–£500+ per m²**; a 12m² stand at the NEC costs **£3,000–£5,400 for space alone**, with a realistic first-time total of £5,000–£10,000 once fit-out is included. ([T3 Systems](https://t3systems.com/exhibition-stand-costs/), [Hashtag Events](https://www.hashtagevents.co.uk/how-much-does-an-exhibition-stand-cost-in-the-uk-2026-price-guide/)) That is 2–4 months of your target revenue for one event. **Walk the floor as a visitor instead** — usually free or under £50 — and have 40 conversations with the exact buyers who paid to be in a room looking for suppliers. Same access, ~1% of the cost.

### 4.5 Communities — real but slow, and you must actually be a member

Indie Hackers threads consistently name Reddit, niche Facebook groups, Slack/Discord communities and direct outreach as first-customer sources ([IH: how indie hackers got their first 10/100/1,000](https://www.indiehackers.com/post/indie-hackers-share-how-they-got-their-first-10-100-and-1-000-customers-620ce768ba)). This is self-reported, survivorship-biased anecdote — weight it low as *evidence*, but note it is what founders actually did.

The honest constraint: UK trade Facebook groups (electricians, plumbers, hairdressers, childminders, hauliers) are large and active, and **almost all of them ban promotion**. The only version that works is being a genuine, useful, months-long participant. That is a real channel, but it costs time you'd otherwise spend dialling, and it pays out on a 3–6 month lag.

### 4.6 What to actively avoid

- **Product Hunt.** Only **9 of 326 projects cited Product Hunt as their primary channel** ([IndieLaunches data via Rockingweb](https://www.rockingweb.com.au/micro-saas-revenue-analysis-2025/)). Worse: its audience is other founders. Nobody who runs a UK MOT garage is on Product Hunt.
- **Paid ads.** $200–600 CAC vs $0–50 organic. At £49/month with unknown churn, you cannot afford paid acquisition until you know your LTV, and you won't know it for a year.
- **Automated LinkedIn/cold-email tooling.** Legally exposed (§2.6), platform-risky, and the maths (§3.1) doesn't work at the volumes you can safely run.
- **Building in public on X.** Works for people selling to developers. You are not.

---

## 5. The ranked playbook

**Tier 1 — do these, in this order, starting week 1**

1. **Pick one vertical where the typical operator is a limited company.** This is a legal decision as much as a market one — it determines whether email is available to you at all (§2.1). Cross-check on Companies House before committing.
2. **Phone-first founder-led selling.** CTPS/TPS-screened lists, 40–60 dials/day, your own name, your own number. ~850–2,250 dials for 10 customers. This is your primary channel and it is not optional. It also *is* your customer discovery.
3. **Pre-sell before Claude builds anything substantial.** The Kima case signed 50 customers off mockups. Even 3 paid commitments at £49/month is a real signal and it stops you building the wrong product for six months.
4. **Hunt for one leveraged partner in parallel** — an accountant/bookkeeper serving your vertical, a regional trade-association officer, an industry consultant. Budget 5 of your 40 daily dials to this. One yes is worth 200 cold calls.
5. **Low-volume, hyper-personalised email to limited companies only**, as follow-up to calls and to no-answer numbers. 20/day, genuinely researched, real signature, working unsubscribe, LIA documented.

**Tier 2 — start in month 2–3, pays out month 6+**

6. **Xero App Store listing** *if and only if* the tier pricing checks out (§4.1). ~1,000 apps is a genuinely findable pond and it's UK-weighted.
7. **Directory listings and long-tail content** — Capterra UK, GetApp, Software Advice, plus "[software] for [vertical] UK" pages. Cheap, compounding, slow.
8. **Genuine community membership** in 2–3 niche groups. Answer questions for three months before you mention your product once.
9. **Attend (don't exhibit at) your vertical's trade shows and regional association meetings.**

**Tier 3 — deprioritise or skip**

10. Shopify App Store (18k competitors, median $0). QuickBooks listing (6+ month review). Product Hunt. Paid ads. Automated LinkedIn. Exhibition stands. High-volume cold email.

**Cross-cutting decisions that beat any channel choice**

- **Require a card. No open-ended free trial.** 44% median vs 14% (§3.3). At 48 customers you cannot afford a leaky funnel.
- **Onboard every single customer personally by phone within hours.** 34.1% vs 13.6%. This is the advantage a solo founder has and a funded competitor does not.
- **Consider a productised-service bridge.** Charge for the outcome manually while Claude builds the automation behind it. Revenue in weeks rather than months, upfront payment rather than trial conversion, and it validates willingness-to-pay before a line of code matters. ([Productize & Scale](https://www.productizeandscale.com/why-productized-service/)) At 24 customers × £99 this is genuinely viable as an end state, not just a bridge.

---

## 6. What the evidence says will probably happen

- **43% of startup failures are "no market need"** — the most common cause by a distance. ([ShubHQ post-mortem analysis](https://shubhq.com/saas/research/saas-failure-postmortem/))
- **~70% of micro-SaaS never clear $1,000 MRR**; ~18% reach the $1,000–$5,000 "sustainability zone"; ~5% pass $100,000 MRR. ([SaaSRanger / Rockingweb, 1,000+ founder analysis](https://saasranger.com/blog/micro-saas-revenue-reality-what-1000-founders-actually-earn/))

Note what that second line means for you: **your £2,335/month target sits inside the 18% band, not the 5% band.** The goal is achievable-but-uncommon, not fantastical. That is the right framing.

- Median time to $10K MRR for bootstrapped micro-SaaS is cited as **12–18 months**, and median time to $1M ARR as 24 months. **I do not trust these numbers** — they appear only in AI-generated content-marketing pages attributing them vaguely to "Indie Hackers and MicroConf surveys" without linking the survey. Directionally they're consistent with everything else here; do not quote them to anyone.

**My honest timeline estimate**, built from the funnel maths rather than from those citations:

| Milestone | Realistic | Requires |
|---|---|---|
| First paid customer | **2–4 months** | Phone-first, narrow vertical, pre-sell |
| 10 customers (~£490/mo) | **4–8 months** | ~1,000–2,000 dials sustained |
| 48 customers (£2,335/mo) | **12–24 months** | At least one working partner channel; churn under control |

The 12–24 month figure is not pessimism about you. It is what the dial-to-customer ratio multiplied by a one-person working week produces, plus the fact that you must out-acquire churn on the way up.

**The thing most likely to kill this plan is not the build and not the law. It is that a person with zero sales background will not make 1,000 cold calls.** Everything in this report is downstream of that. If dialling is genuinely off the table, the plan has to become partner-led from day one — find the accountant first and let them make the introductions — and the timeline stretches accordingly, because you are now dependent on someone else's calendar.

---

## 7. Gaps and confidence

**Could not verify directly (proxy-blocked):** `ico.org.uk`, `legislation.gov.uk`, `gov.uk`, `developer.xero.com`, `shopify.dev`, `developer.intuit.com`, `indiehackers.com`, `freemius.com`, `microconf.com`, and all law-firm domains. Every legal statement above comes from search-engine extracts quoting those pages, not from the pages themselves. **Confidence in the legal section: high on the corporate/individual subscriber split and TPS/CTPS screening (multiple independent sources agree); medium on the LinkedIn-DM point and on the exact DUAA commencement date.**

**Specific unknowns that materially affect the plan:**

1. **Xero Core/Plus tier monthly prices.** I have $0 (Starter, 5 connections) and $895 (Advanced) but not the middle. This is the difference between Xero being a viable channel and being unaffordable. **Verify this first.**
2. **CTPS screening licence cost** for a one-person business. Providers exist (Data-8, TPS Services) but I obtained no pricing. Could plausibly be a meaningful slice of a £60/month budget.
3. **QuickBooks revenue share** — an Intuit community thread asks exactly this and the answer wasn't in the extract. Probably zero, unconfirmed.
4. **No independent data** on what share of UK SMB software decisions are accountant-influenced. Every source is a vendor selling a referral programme. The strategic logic stands on structure, not measurement.
5. **Churn** is modelled, not sourced. If real churn is 8%/month rather than 5%, the 48-customer target becomes substantially harder and the timeline extends.
6. **All cold email/call benchmarks are US/global.** No UK-specific figures found. UK response rates may differ, and the UK's smaller addressable pool (2.1m emailable companies, minus your vertical filter) may exhaust faster than US-derived maths assumes.
7. **The 2026 micro-SaaS statistics ecosystem is heavily AI-generated.** Sources like ideaproof.io, softwareseni.com, flowjam.com, bigideasdb.com and similar publish confident, precise, uncheckable numbers. I excluded their distinctive claims and flagged the ones I retained. The MicroConf/Freemius, Instantly, ONS, Shopify/Xero and ICO-derived figures are the load-bearing ones.

**Where I'd push back on my own report:** the cold-calling recommendation rests on US benchmark data applied to a UK market, and on the assumption that a first-time founder can sustain 40+ dials/day. Both are contestable. The recommendation survives anyway because every alternative channel is worse on at least two of {legality, cost, speed} — but it is a recommendation by elimination, not by strong positive evidence.

## OPPORTUNITIES SURFACED
CONCRETE DISTRIBUTION-DERIVED OPPORTUNITIES (this dimension constrains product choice more than product choice constrains distribution)

1. THE VERTICAL FILTER IS A LEGAL DECISION FIRST. Who buys: UK businesses that are LIMITED COMPANIES, because 63% of the UK business population (3.2m sole traders + 368k ordinary partnerships) cannot lawfully be cold-emailed without consent. This rules OUT most trades, salons, gardeners, childminders, freelance consultants, market traders. It rules IN: small agencies, wholesalers/distributors, care homes and domiciliary care providers, MOT garages and vehicle workshops, nurseries and pre-schools, small manufacturers, veterinary practices, letting agents, funeral directors, driving schools operating as Ltd. Pick from the second list. Verify on Companies House before committing a single week of build time. Pain: these sectors run on spreadsheets and paper because horizontal SaaS ignores them. What they pay today: nothing, or a £200+/month legacy vertical system with a 1990s interface. Why now: the owner can build a credible product in weeks with Claude, which was not true 18 months ago.

2. THE ACCOUNTANT/BOOKKEEPER AS THE ENTIRE GO-TO-MARKET. Who buys: 2-3 UK practices serving one vertical. Why it matters: one practice with 80 small-business clients is 80 warm introductions from one conversation — and the target is only 48 customers. This makes the whole plan a 3-conversation problem rather than a 2,000-dial problem, IF it works. Pain the accountant feels: their clients send them shoebox data and they lose billable hours on cleanup; a tool that fixes that makes THEIR margin. Offer 20% recurring rev share. Caveat honestly: every source claiming accountant recommendations drive UK SMB software adoption is a vendor selling a referral programme; there is no independent measurement. Test this with 10 phone calls in week 1 before building around it.

3. XERO APP STORE AS THE ONE VIABLE MARKETPLACE — CONDITIONAL. Who buys: UK/AU/NZ small businesses already on Xero. The pond is ~1,000 apps versus Shopify's 18,368 — genuinely findable. BUT the economics inverted on 2 March 2026: the 15% rev share is gone, replaced by tiered developer pricing where the free Starter tier caps at 5 CONNECTIONS. You cannot serve 24 customers free. HARD GATE: obtain the Core/Plus monthly price before writing any Xero integration. If Core exceeds ~£40/month it consumes most of the £60 budget at 5 customers and the marketplace route dies on arithmetic. This is the single most decision-relevant unknown in the whole report.

4. SMALL TRADE BODIES, NOT BIG ONES. Who buys: the officer of a regional trade association, a specialist institute with 2,000 members, or a franchise network with 60 franchisees. The FSB/JournoLink deal (4 Aug 2026) proves the mechanism exists but the FSB partners with established vendors. A 60-franchisee network is approachable by phone next week, and one yes reaches the entire membership. What they want: a member benefit that makes membership look worth the fee. What you give up: a discount, and the association's name on your product.

5. THE PRODUCTISED-SERVICE BRIDGE AS A DISTRIBUTION HACK, NOT JUST A REVENUE HACK. Who buys: the same limited companies, but they buy an OUTCOME delivered by you, priced at £99-£299/month, while Claude builds the automation behind the curtain. Why this is a distribution advantage specifically: it converts on a phone call with no trial, no free tier, and payment upfront — collapsing the 14%-median opt-in trial funnel entirely. 24 customers at £99 hits the target. It also validates willingness-to-pay before any code exists, directly attacking the 43%-of-failures "no market need" cause. Migrate customers onto self-serve software once they're paying.

6. WALK TRADE SHOWS AS A VISITOR. Exhibiting costs £5,000-£10,000 (2-4 months of target revenue). A visitor ticket is free-to-£50 and puts you in a room where every single attendee paid to be there looking for suppliers. Forty face-to-face conversations in two days, at ~1% of the exhibitor cost. This is the highest-density customer-discovery opportunity available at this budget and it is systematically overlooked.

DELIBERATELY EXCLUDED AS OPPORTUNITIES: Shopify App Store (median new-app revenue $0 across ~700 quarterly launches, 18k competitors), QuickBooks listing (6 weeks-6+ months review), SEO as a launch channel (AI Overviews cut position-1 CTR up to 58%, 69% zero-click), Product Hunt (9/326 projects cite it as primary; wrong audience), paid ads ($200-600 CAC against a £49 price point), automated LinkedIn outreach (legally exposed under PECR's electronic-mail definition, platform-risky), high-volume cold email (needs 2,400-13,300 sends for 10 customers = 3-15 months on one mailbox at safe deliverability limits).

## KEY CLAIMS
- 63% of the UK business population cannot lawfully be cold-emailed without consent: at the start of 2025 there were ~5.7m private-sector businesses, of which ~3.2m (57%) were sole proprietorships and ~368,000 (6%) ordinary partnerships — both classed as 'individual subscribers' under PECR — versus ~2.1m companies (37%) which are corporate subscribers and exempt from the reg 22 consent rule.
  SOURCE: https://www.ons.gov.uk/businessindustryandtrade/business/activitysizeandlocation/bulletins/ukbusinessactivitysizeandlocation/2025 (ONS, via search extract) combined with https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/
- PECR reg 22 does not apply to corporate subscribers (limited companies, LLPs, Scottish partnerships, government bodies), so no consent is needed to email them; sole traders and ordinary partnerships are individual subscribers and require consent or soft opt-in.
  SOURCE: https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/electronic-and-telephone-marketing/electronic-mail-marketing/ (search extract; ico.org.uk was proxy-blocked)
- The ICO's definition of 'electronic mail' is broad and explicitly includes in-app messages and direct messaging on social media — meaning cold LinkedIn DMs containing marketing fall under PECR, and the LinkedIn subscriber is the individual, so consent is required. I found no evidence of ICO enforcement against LinkedIn DMs.
  SOURCE: https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-direct-marketing-using-electronic-mail/ and https://www.bdo.co.uk/en-gb/insights/advisory/risk-and-advisory-services/guidance-on-direct-marketing-using-electronic-mail (search extracts)
- Screening call lists against TPS and CTPS before making marketing calls is a legal obligation, not best practice; CTPS held over 1.2 million business numbers as of April 2025 and registrations renew annually.
  SOURCE: https://www.data-8.co.uk/data-sources/corporate-telephone-preference-service-ctps/ and https://www.accuradata.co.uk/ctps-checker-the-complete-guide-for-the-ctps-register/
- The Data (Use and Access) Act 2025 (Royal Assent 19 June 2025) raised the maximum PECR penalty from £500,000 to £17.5m or 4% of global turnover, aligning PECR with UK GDPR; multiple sources place the fines change in force on 5 February 2026.
  SOURCE: https://www.blakemorgan.co.uk/data-use-and-access-act-2025-privacy-and-electronic-communications-regulations/ and https://www.mfmac.com/insights/data-protection/data-use-and-access-act-2025-increased-maximum-fines-for-cookies-and-direct-marketing-practices/
- ICO PECR enforcement against nuisance marketing is active and current: a compensation company was fined £90,000 in March 2025 for 95,277 calls without valid consent, and a Glasgow energy company was fined £160,000 in May 2026 for unsolicited marketing calls.
  SOURCE: https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2025/04/compensation-company-fined-90-000-for-unlawful-marketing-calls/ and https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/05/glasgow-based-energy-company-fined-160-000-for-making-unsolicited-marketing-calls/ (search extracts)
- ICO registration is a mandatory running cost: the Tier 1 data protection fee is £52/year (£47 by direct debit) for organisations with turnover under £632,000 or 10 or fewer staff, and it applies to sole traders and one-person limited companies processing personal data for marketing.
  SOURCE: https://ico.org.uk/for-organisations/data-protection-fee/data-protection-fee/ and https://x.com/ICOnews/status/1891472805641806031
- Cold email positive reply rates in 2026 are 0.5-2% (total reply rate 3.43%, down from 6.8% in 2023 to 5.8% in 2024 across a 16.5M-email dataset). Chained with SMB demo-to-close of 20-30%, this implies roughly 2,400-13,300 cold emails to produce 10 paying customers — around 5-10x worse than the widely repeated '500 prospects to 10 customers' heuristic.
  SOURCE: https://www.cleanlist.ai/blog/2026-02-18-cold-email-response-rate-statistics and https://instantly.ai/cold-email-benchmark-report-2026 and https://www.growthspreeofficial.com/blogs/b2b-saas-demo-request-conversion-rate-benchmarks-2026
- Cold calling has materially better unit economics for a solo founder than cold email: 2026 benchmarks show 25-35 dials per booked meeting (top performers 12-18; an alternative dataset says 40-45), which at 20-30% meeting-to-close implies roughly 850-2,250 dials for 10 customers, or 15-55 working days at 40-60 dials/day.
  SOURCE: https://skipcall.io/en/blog/how-many-cold-calls-to-book-a-meeting and https://belkins.io/blog/cold-calling-benchmarks
- Requiring a credit card upfront is worth more than any channel choice: opt-out (card-required) trials convert at 35-55% with a 44% median, versus opt-in trials at 8-22% with a 14% median. 70% of MicroConf founders now ask for a card upfront.
  SOURCE: https://www.growthspreeofficial.com/blogs/b2b-saas-trial-to-paid-conversion-rate-benchmarks-2026-by-trial-type-acv-length-credit-card and https://freemius.com/blog/state-of-micro-saas-2025/
- The Shopify App Store is not a distribution shortcut: of ~700 apps launched in a given quarter, average revenue was $39.72 per app and the MEDIAN WAS $0; the median listed app earns under $1,000/month; there are ~18,368 apps as of May 2026 with 865 added in the last 30 days; and 34.14% of apps have zero reviews.
  SOURCE: https://weekonelabs.com/blog/shopify-app-revenue-benchmarks-2026/ and https://www.storecensus.com/stats and https://craftberry.co/articles/shopify-app-store-statistics
- Xero retired its 15% App Store revenue share effective 2 March 2026 and replaced it with five tiered developer plans priced on connections and API data egress. The free Starter tier is capped at 5 connections, Advanced costs $895/month, and egress overages are $1.50/GB — meaning a micro-app now pays Xero before it has revenue and cannot serve 24-48 customers on the free tier.
  SOURCE: https://www.accountingtoday.com/news/xero-shifts-to-tiered-pricing-model-for-developers and https://truto.one/blog/xero-api-pricing-changes-2026-costs-tiers-and-how-to-minimize-egress/ and https://docs.codat.io/updates/260116-xero-pricing/
- The Xero App Store is roughly 18x less crowded than Shopify's, with ~1,000 apps as of May 2026, and is UK/AU/NZ-weighted — making it the more findable marketplace pond for a UK founder, pricing permitting.
  SOURCE: https://blog.xero.com/us/news-events/celebrating-1000-apps/
- QuickBooks App Store listing is incompatible with a months-not-years timeline: approval takes 6 weeks to 6+ months, requires validation against 14 technical requirements and a mandatory scheduled call with the review team, plus annual re-review on the publication anniversary.
  SOURCE: https://satvasolutions.com/blog/intuit-app-store-approval-timeline-developer-guide and https://developer.intuit.com/app/developer/qbo/docs/go-live/publish-app/technical-requirements
- SEO is structurally broken as a first-customers channel in 2026: AI Overviews cut position-1 organic CTR by up to 58% (Ahrefs, Dec 2025, up from 34.5% in April 2025); Pew (July 2025) found users clicked organic results 8% of the time with an AI Overview present versus 15% without; and zero-click searches rose from 56% to 69% between May 2024 and May 2025 (Similarweb).
  SOURCE: https://www.goodfirms.co/resources/seo-statistics-ai-search-rankings-zero-click-trends and https://www.digitalapplied.com/blog/zero-click-search-statistics-2026-complete-data
- Partner and referral channels are the highest-leverage route for tiny B2B SaaS: SaaS vendors take 24% of new customer revenue from partner channels, 50% of MicroConf founders lean on communities and referrals reporting stronger LTV especially early, and Gartner predicts 80% of B2B software buyers will use marketplaces to initiate or complete purchases by 2026 (up from 35% in 2021).
  SOURCE: https://www.digitalapplied.com/blog/partner-channel-marketing-statistics-2026-data and https://freemius.com/blog/state-of-micro-saas-2025/
- UK trade bodies do run software affinity deals — the FSB launched an exclusive member offer with JournoLink on 4 August 2026, delivered via the FSB Member Dashboard's Member Offers area — but the partner was an established vendor, making this a scale channel rather than a first-10-customers channel.
  SOURCE: https://www.lovebusinesseastmidlands.com/love-business-news/2026/08/04/the-federation-of-small-businesses-fsb-launches-an-exclusive-member-offer-via-its-partner-journolink/
- Door-to-door founder-led selling has produced 50 paying vertical-SaaS clients in a single summer from mockups alone: two founders opened the Yellow Pages at 'Restaurants', went A-Z cold-calling, and turned up in person with an iPad showing mockups before any product existed. Single anecdote, likely pre-2020 — structurally instructive, not predictive.
  SOURCE: https://medium.com/kima-ventures/vertical-saas-sales-done-right-from-0-to-2500-customers-9bdbe00d9985
- Exhibiting at UK trade shows is unaffordable at this budget but attending is not: space costs £300-£500+ per square metre, a 12 sq m NEC stand is £3,000-£5,400 for space alone, and a realistic first-time total is £5,000-£10,000 — versus a visitor ticket that is usually free or under £50 for access to the same buyers.
  SOURCE: https://t3systems.com/exhibition-stand-costs/ and https://www.hashtagevents.co.uk/how-much-does-an-exhibition-stand-cost-in-the-uk-2026-price-guide/
- The £2,335/month target sits in the uncommon-but-achievable band, not the lottery band: ~70% of micro-SaaS never clear $1,000 MRR, ~18% reach the $1,000-$5,000 'sustainability zone', and only ~5% pass $100,000 MRR. Separately, 43% of startup failures are attributed to no market need.
  SOURCE: https://saasranger.com/blog/micro-saas-revenue-reality-what-1000-founders-actually-earn/ and https://shubhq.com/saas/research/saas-failure-postmortem/
- Product Hunt is near-worthless for this use case: only 9 of 326 tracked projects cited it as their primary channel, and its audience is other founders rather than UK small-business buyers.
  SOURCE: https://www.rockingweb.com.au/micro-saas-revenue-analysis-2025/ (citing IndieLaunches data)
- Founder speed at trial start is a measurable solo-founder advantage: contact within four hours of trial activation took conversion to 34.1%, versus 13.6% for automated email sequences alone.
  SOURCE: https://www.growthspreeofficial.com/blogs/b2b-saas-trial-to-paid-conversion-rate-benchmarks-2026-by-trial-type-acv-length-credit-card

## GAPS
WHAT I COULD NOT VERIFY

Access limitation (significant): the environment's egress proxy blocked direct fetches to essentially every primary source — ico.org.uk, legislation.gov.uk, gov.uk, developer.xero.com, shopify.dev, developer.intuit.com, indiehackers.com, freemius.com, microconf.com, and all law-firm domains (Mayer Brown, Harper James, etc.). WebSearch worked; WebFetch did not. Every legal statement in this report therefore comes from search-engine extracts QUOTING those pages, not from pages I read. The owner should read the ICO's B2B marketing and electronic-mail guidance pages directly before sending anything.

CONFIDENCE BY SECTION
- Corporate vs individual subscriber split, TPS/CTPS screening obligation, reg 23 sender-identification: HIGH. Multiple independent sources agree and the rule is long-established.
- ONS business population figures (5.7m businesses, 57%/37%/6% split): HIGH. Consistent across sources, standard published statistic.
- LinkedIn DMs as "electronic mail" under PECR: MEDIUM. The ICO's broad definition is consistently reported, but I could not read the guidance itself, and I found zero enforcement precedent — so the practical risk is much lower than the legal reading suggests.
- DUAA 2025 commencement date for the fines change (5 February 2026): MEDIUM. Royal Assent 19 June 2025 is solid; the in-force date for the PECR penalty uplift came from one secondary source.

SPECIFIC UNKNOWNS THAT CHANGE THE PLAN
1. Xero Core and Plus tier monthly prices. I have Starter ($0, 5 connections) and Advanced ($895) but not the middle tiers. This is the difference between Xero being the one viable marketplace and being unaffordable. Highest-priority thing to check.
2. CTPS screening licence cost for a one-person business. Providers exist (Data-8, TPS Services, DMA-licensed) but I obtained no pricing. Could be a meaningful fraction of a £60/month budget, and it gates the primary recommended channel.
3. QuickBooks App Store revenue share. An Intuit community thread asks exactly this; the answer was not in the extract. Probably zero, unconfirmed.
4. Whether the ICO treats a Companies House lookup as adequate diligence for the corporate/individual subscriber distinction. This is the practical compliance workflow I recommend and I could not confirm the regulator endorses it.

EVIDENCE-QUALITY PROBLEMS
5. No independent data anywhere on what share of UK SMB software purchases are accountant-influenced. Every source asserting this is a vendor selling a referral programme. Opportunity #2 rests on structural logic (one practice = 80 clients), not measurement. It must be tested with real phone calls in week 1, not assumed.
6. Churn is MODELLED, NOT SOURCED. I used 5%/month to argue that 48 customers requires ~60-70 gross acquisitions and ~2-3/month ongoing. I found no defensible SMB micro-SaaS churn benchmark. If real churn is 8%/month the target gets substantially harder and the timeline extends.
7. All cold-email and cold-call benchmarks are US/global. No UK-specific figures found. UK response rates may differ, and the UK's much smaller addressable pool (2.1m emailable companies, then filtered to one vertical — plausibly only a few thousand prospects) may EXHAUST before US-derived funnel maths delivers 48 customers. This is a real risk to the phone-first plan that I could not quantify.
8. The 2026 micro-SaaS statistics ecosystem is heavily AI-generated content marketing. Sites like ideaproof.io, softwareseni.com, flowjam.com, bigideasdb.com publish confident, precise, uncheckable figures citing each other. I excluded their distinctive claims. Specifically REJECTED: "median time to $10K MRR is 12-18 months" and "median time to $1M ARR is 24 months" — attributed vaguely to "Indie Hackers and MicroConf surveys" with no linked survey. Do not quote these.
9. The Kima Ventures door-to-door case (50 clients from mockups in one summer) is a single undated Medium anecdote, likely pre-2020. Structurally instructive; the numbers are not predictive.
10. Shopify and micro-SaaS revenue distribution figures come from vendor blogs (Week One Labs, StoreCensus, Craftberry, SaaSRanger) analysing scraped data. Methodologies are not published. The direction — brutal power law, median near zero — is corroborated across several independent scrapers, so I have MEDIUM-HIGH confidence in the shape and LOW confidence in any specific figure.

MY OWN STRONGEST CAVEAT
The cold-calling recommendation applies US benchmark data to a UK market and assumes a first-time, non-technical founder can sustain 40+ dials/day for months. Both are contestable. It survives as the top recommendation by ELIMINATION — every alternative is worse on at least two of {legality, cost, speed} — not by strong positive evidence. If the owner will not realistically make ~1,000 cold calls, the plan must become partner-led from day one and the timeline stretches, because it then depends on someone else's calendar. That is the honest failure mode to plan against, and it is a question about the person, not about the market.