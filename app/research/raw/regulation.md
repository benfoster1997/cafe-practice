# Regulation-Forced Software Demand, UK/EU 2026–2028

**Research date: 17 August 2026.** Heavy caveat up front: `gov.uk`, `publications.parliament.uk`, `developer.service.hmrc.gov.uk`, `icaew.com`, `accountingweb.co.uk`, `litrg.org.uk` and most law-firm domains are **blocked by this environment's egress proxy**. I could not read primary regulator pages directly. Everything below comes from search-engine extracts that quote those primary sources, plus reachable secondary sources. Figures are therefore *second-hand quotations of primary sources* — good enough to rank opportunities, not good enough to bet money on without the owner personally opening the GOV.UK page. I flag confidence per claim.

---

## Headline verdict

Of everything researched, **only three regulatory deadlines in the next 24 months plausibly support a £49–99/month product built by a non-coder with Claude**. Most of the rest fail on one of four tests: the deadline is outside the window, the incumbent price is £0, the buyer is not a UK SME, or the compliance artefact is a document rather than a system.

The single most important finding is a **negative** one, and it kills the brief's own leading hypothesis:

> **MTD ITSA for the smallest taxpayers (£20k–£30k, the 2027–2028 waves) is not a viable paid market.** The floor price is already £0 and is being subsidised by HMRC itself and by banks. See §1.4.

---

## Ranked list: regulatory deadlines forcing UK software purchases, next 24 months

| # | Trigger | Bites | Population | Incumbents | Verdict for a solo builder |
|---|---|---|---|---|---|
| 1 | **Employment Rights Act — guaranteed hours, shift notice, cancellation pay** | ~Jan 2027 | 1.23m workers on zero-hours; concentrated in hospitality/care/retail SMEs | Rota tools exist (£3–10/user/mo) but **none can do the ERA calculation yet — the regulations aren't final** | **Best opportunity.** Adjacent-to-rota "evidence layer", not a rota replacement |
| 2 | **Martyn's Law — enhanced tier (800+ capacity)** | Spring 2027 | Subset of 250,000+ premises; enhanced count unverified | Template/PDF vendors only; no living systems at SME price | **Strong second.** Budget headroom is large (~£5,210/yr/premises per Home Office IA) |
| 3 | **MTD ITSA — accountant-side workflow** (NOT taxpayer-side) | Continuous, worsens Apr 2027 | ~294,000 in-scope taxpayers currently non-compliant; every small practice affected | IRIS Elements, TaxCalc, Karbon — priced for mid-size firms | **Viable.** Crucially needs **no HMRC recognition** |
| 4 | **ERA — third-party & sexual harassment "all reasonable steps" duty** | 30 Oct 2026 | All UK employers | E-learning vendors (Skillcast, VinciWorks) | Medium. Buyers want *training*, not software |
| 5 | **Companies House ECCTA identity verification** | 18 Nov 2026 | 6–7 million directors/PSCs | Filing agents, ACSPs | **Too late.** Deadline in 3 months, then the product dies |
| 6 | **EPR packaging — small producer reporting** | 1 Apr annually | ~5,250 registered producers | Compliance schemes sell it as a service | Weak. Annual cadence ⇒ no monthly willingness-to-pay |
| 7 | **EU e-invoicing (BE/PL/FR/DE/ES)** | 2026–2028 | UK exporters to EU | Peppol access points, commoditised | Weak for UK-based solo builder |
| 8 | **UK Deposit Return Scheme** | 1 Oct 2027 | Drinks producers/retailers | DMO will provide infrastructure | Weak, too far out |
| 9 | **EU Accessibility Act** | Enforcement ongoing | Micro-exemption removes most UK SMEs | AudioEye/accessiBe/Level Access | **Avoid.** Overlays legally contested |
| 10 | **EU AI Act Art. 50 transparency** | Live 2 Aug 2026 | AI product companies, not UK SMEs | — | Not a fit for this owner |
| — | **Allergen / Natasha's Law follow-ups** | — | — | — | **Not a forced purchase — guidance is voluntary** |
| — | **UK domestic e-invoicing mandate** | **2029** | — | — | **Outside the window entirely** |

---

## 1. Making Tax Digital for Income Tax

### 1.1 Confirmed thresholds and dates

All three waves are confirmed policy, not proposals:

- **6 April 2026** — qualifying income over **£50,000**
- **6 April 2027** — over **£30,000**
- **6 April 2028** — over **£20,000**

Qualifying income is **gross** (turnover, not profit) combined self-employment + UK/foreign property income, tested on the tax return two years prior. HMRC used 2024/25 returns filed by 31 January 2026 to identify the April 2026 cohort and wrote to them.
Sources: [LexisNexis on the April 2028 threshold](https://www.lexisnexis.co.uk/legal/news/hmrc-publishes-reduction-of-making-tax-digital-income-threshold-from-april-2028), [CIOT](https://www.tax.org.uk/making-tax-digital-hmrc-write-to-taxpayers-in-scope-from-april-2026), [ICAS](https://www.icas.com/regulation-technical-resources/technical-resources/tax/making-tax-digital/making-tax-digital-who-needs-to-use-mtd). **Confidence: high** — consistent across many independent professional bodies.

### 1.2 Population per wave — and the live compliance gap

This is the most commercially interesting data I found, because it is a **real-time measurement of failure**:

- **864,000** taxpayers required to join from April 2026 (HMRC estimate)
- **~280,000** had signed up as at April 2026
- **~570,000** registered as at August 2026, of which **~436,000** had actually filed a quarterly update

Source: search extracts quoting [ICAEW, June 2026](https://www.icaew.com/insights/tax-news/2026/jun-2026/hmrc-contacts-final-group-of-taxpayers-within-mtd-income-tax) and [AccountingWEB, "HMRC to start signing up MTD no-shows"](https://www.accountingweb.co.uk/tax/hmrc-policy/hmrc-to-start-signing-up-mtd-no-shows). **Confidence: medium-high** — figures are internally consistent and quoted from ICAEW/AccountingWEB, but I could not open either page.

**Read that carefully: roughly 294,000 legally-required taxpayers are still not filing, four months into the regime.** A separate source states "less than one third of the sole traders and landlords required to comply have signed up so far." HMRC is reportedly moving to sign up no-shows itself.

Wave 3 (April 2028, £20k) adds **~900,000–970,000** additional sole traders and landlords — the largest single wave. Exchequer yield projected at **£155m/year by 2030–31**.
Source: [LexisNexis](https://www.lexisnexis.co.uk/legal/news/hmrc-publishes-reduction-of-making-tax-digital-income-threshold-from-april-2028). **Confidence: high.**

**Gap:** I could not find a reliable figure for the *incremental* population of the April 2027 (£30k) wave. One source cites "an estimated 1.7 million taxpayers" for the £30k stage but it is ambiguous whether that is cumulative or incremental. **Do not rely on it.**

### 1.3 Penalties — the forcing function is weaker than it looks in year one

- **No late-submission penalties apply to quarterly updates during 2026/27.** Taxpayers must still file all quarterly updates before they can file the return.
- The points-based regime applies to all ITSA taxpayers **from 6 April 2027** (2027/28 onwards), confirmed at Autumn Budget 2025.
- Quarterly filers: **£200 penalty at 4 points**, then £200 for each further miss. Points expire after 24 months.

Source: [ICAEW penalty guidance](https://www.icaew.com/technical/tax/making-tax-digital/mtd-for-income-tax-penalties), [ICAEW March 2026](https://www.icaew.com/insights/tax-news/2026/mar-2026/penalty-regime-for-mtd-for-income-tax-becomes-clearer). **Confidence: medium-high.**

Implication: the pain does not become financially sharp until **April 2027**. That is good timing for a product launched in 2026 — but it also explains the current 34% non-compliance.

### 1.4 What the software costs today — and why the bottom of the market is dead

Typical paid pricing is **£7–£15/month** for sole traders and landlords. Specifics found:

| Product | Price |
|---|---|
| FreeAgent | £19/mo or £190/yr — **free** with NatWest, RBS, Ulster or Mettle account |
| Coconut | £10/mo — **free for up to 2 years** with a Zempler business account |
| Hammock | **Free for 1 property**, ~£1/property/month thereafter |
| Untied | Free with restrictions, up to £7/mo |
| Clear Books | Free tier |
| Zoho Books | **Free** under £35,000 turnover |
| Landlord Studio | **Free** up to 2 properties |
| Starling Bank / SumUp | **Free** MTD tooling bundled with the business account |
| **HMRC's own tool** | **Free** — suits a single trade, low transaction volume |

Sources: [MTD Compare](https://mtdcompare.co.uk/), [TechRadar free MTD roundup](https://www.techradar.com/pro/software-services/free-making-tax-digital-mtd-software), [Starling](https://www.starlingbank.com/features/making-tax-digital/), [SumUp](https://www.sumup.com/en-gb/business-account/making-tax-digital/), [Clear Books](https://www.clearbooks.co.uk/free-mtd-software/). **Confidence: medium-high** on the pattern; individual prices may have moved.

**This is the kill shot for the brief's hypothesis.** A taxpayer earning £20,000–£30,000 gross — the 2027 and 2028 waves — has a single trade, low transaction volume, and is precisely the user HMRC's free tool and the bank-bundled tools were built for. You cannot charge £49/month, or £5/month, into that. The banks are using free MTD software as customer-acquisition for current accounts, which means the marginal cost of the competition is *negative*. **Do not build a taxpayer-facing MTD filing tool.**

### 1.5 The barrier nobody mentions: HMRC recognition

To submit to HMRC you need **production credentials**, which requires:

- Sending **~24 `Gov-Client-*` / `Gov-Vendor-*` fraud prevention headers** on every API call, describing device, network, screen, timezone and your own server. This is a **legal requirement**, used to support fraud prosecutions.
- HMRC must **see evidence of the headers being sent and be satisfied as to their accuracy** before approving.
- Completing and returning a **Production Approvals Checklist** to HMRC's software developer support team.
- A **six-month window** to complete the request — miss it and your progress is deleted and you start again.

Sources: [HMRC Developer Hub fraud prevention guide](https://developer.service.hmrc.gov.uk/guides/fraud-prevention/), [HMRC MTD ITSA integration guide](https://developer.service.hmrc.gov.uk/guides/income-tax-mtd-end-to-end-service-guide/documentation/how-to-integrate.html), and a founder post-mortem: [TapTax, "5 things that surprised me building on HMRC's Making Tax Digital API"](https://taptax.co.uk/blog/5-things-that-surprised-me-building-on-hmrcs-making-tax-digital-api) — built solo by Solomon Amos, who describes several issues that "cost a full day each", version-per-endpoint quirks, and a sandbox that behaves as "a strict reviewer rather than a forgiving toy". **Confidence: high** that this is real friction; **medium** on exact process details since the Hub itself was blocked.

The TapTax case proves a solo developer *can* ship this. But note what it costs the **owner** in this scenario, not Claude: the owner must personally run an approval correspondence with HMRC, attest to data accuracy, and hold liability. That is business-process work a zero-coding owner can do, but it is months of latency before a single pound of revenue.

### 1.6 Where the real, documented MTD pain actually is

Consistent, specific complaints from the profession:

1. **"MTD software blind spot":** stripped-back tools aimed at sole traders "leave nowhere to record transactions that fall outside quarterly updates but still matter for the final tax return", handing accountants a costly clean-up job. ([AccountingWEB](https://www.accountingweb.co.uk/tech/accounting-software/mtd-software-blind-spot-creates-year-end-headache-for-firms))
2. **It is a labour/operations problem, not a software problem:** "the software works; getting clients to actually produce complete, correctly-dated records on time is the bottleneck." Client contact frequency goes from annual to quarterly — a **4x increase in engagement per client with no increase in headcount**. ([Accountex](https://www.accountex.co.uk/insight/2026/05/01/mtd-is-a-labour-problem-not-a-software-problem/), [AccountingWEB](https://www.accountingweb.co.uk/community/industry-insights/mtd-isnt-a-software-problem-its-an-operations-problem), [TaxCalc](https://www.taxcalc.com/blog/mtd-solving-the-capacity-puzzle))
3. **Chaos at the first deadline:** accountants questioned "whether the software, HMRC guidance and the rules were all actually saying the same thing", with confusion over standard vs calendar quarters, cash vs accruals, and how quarterly figures feed the year-end return. ([AccountingWEB, "How MTD reached its first deadline in chaos"](https://www.accountingweb.co.uk/practice/general-practice/how-mtd-reached-its-first-deadline-in-chaos))
4. **Landlords are poorly served:** "landlord income and expenses tend to be quite complex compared to many sole traders, and standard accounting software may not always be ideal." ([AccountingWEB](https://www.accountingweb.co.uk/community/industry-insights/why-landlord-accounting-software-wont-work-for-most-landlords))

**Confidence: medium** — these are quotations from search extracts of AccountingWEB/Accountex articles I could not open. They are trade press, i.e. informed but not primary data.

---

## 2. E-invoicing

### 2.1 UK — the mandate is 2029. This category is dead for this timeline.

The consultation "Electronic invoicing: promoting e-invoicing across UK businesses and the public sector" ran **13 Feb – 7 May 2025**. Government confirmed at **Budget 2025** that e-invoicing becomes **compulsory for all VAT invoices from 2029**, using **Peppol** as the interoperability framework. A detailed implementation roadmap and standards are due at **Budget 2026**. Structured stakeholder engagement with software vendors began January 2026.

Sources: [LexisNexis consultation outcome](https://www.lexisnexis.com/en-gb/legal/news/hmrc-dbt-publish-outcome-of-electronic-invoicing-consultation), [vatcalc](https://www.vatcalc.com/united-kingdom/uk-2029-mandatory-b2b-e-invoicing/), [Avalara](https://www.avalara.com/blog/en/europe/2026/04/uk-mandatory-e-invoicing-2029.html). **Confidence: high** — multiple independent tax-tech sources agree.

**Verdict: 2029 is three years beyond the brief's window.** Building UK e-invoicing now means three years of no forced demand while Sage, Xero, QuickBooks and the Peppol access-point vendors build it into products people already own. Do not touch this.

### 2.2 EU mandates 2026–2028

| Country | Date | Requirement |
|---|---|---|
| **Belgium** | 1 Jan 2026 | All domestic B2B via Peppol |
| **Poland** | 1 Feb 2026 (large) / 1 Apr 2026 (all) | KSeF clearance; 11-month penalty-free soft landing to Dec 2026 |
| **France** | 1 Sep 2026 | **Receiving mandatory for all**; issuing for large/mid-sized |
| **France** | 1 Sep 2027 | SME issuance |
| **Spain (Verifactu)** | Jan 2027 (corporates) / Jul 2027 (autónomos) | Certified billing software |
| **Germany** | 1 Jan 2027 | Issuing for companies >€800,000 turnover |
| **Germany** | 1 Jan 2028 | All companies issuing |
| **EU (ViDA)** | 31 Dec 2026 | Member states must transpose the Directive |
| **EU (ViDA)** | 1 Jul 2030 | EU-wide intra-EU B2B structured e-invoicing |

Sources: [fiskaly](https://www.fiskaly.com/blog/e-invoicing-mandates-in-europe-2026), [Gerlach on ViDA 2026–27](https://gerlach-customs.com/news/news-and-trends/eu-vida-timeline-2026-2027/), [Novutech](https://www.novutech.com/news/e-invoicing-in-europe-overview-of-mandates-2025-2027). **Confidence: medium-high** — vendor blogs, but highly consistent and these firms sell against these dates.

**Do UK businesses need anything?** Mostly no, and this is where listicles mislead. The obligations bind the **EU-established** party. A UK exporter's French customer must be able to receive structured invoices; the UK seller generally is not itself mandated (cross-border invoices sit outside domestic clearance regimes until ViDA's 2030 intra-EU rules). Where a UK business has an **EU establishment or VAT registration**, local rules can bite. Peppol access is already a commodity (Storecove, Tickstar, and the large ERP vendors).

**Verdict: not an opportunity for this owner.** Wrong buyer geography, commoditised plumbing, incumbent-dominated.

---

## 3. Employment Rights Act 2025 — **the best opportunity found**

### 3.1 Timeline (Royal Assent late 2025; phased commencement)

| Date | Change |
|---|---|
| **1 Jan 2026** | Unfair dismissal qualifying period cut to **6 months** — note the government **abandoned** the day-one manifesto pledge |
| **18 Feb 2026** | First major enforcement wave |
| **6 Apr 2026** | **SSP from day one**; **Lower Earnings Limit removed** — £123.25/wk or 80% of average weekly earnings, whichever lower. Government estimates **1.3 million additional employees** qualify. Day-one statutory paternity and unpaid parental leave |
| **1 Oct 2026** | Employment Tribunal time limits **3 → 6 months** |
| **30 Oct 2026** | **Harassment reforms**: duty to take "all reasonable steps" to prevent sexual harassment; **third-party harassment** protections. Trade union access and recognition reforms |
| **9 Nov 2026** | Scotland: breach of contract claims |
| **1 Jan 2027** | Fire-and-rehire restrictions (moved from Oct 2026) |
| **~Jan 2027** | **Zero/low-hours: guaranteed hours offer, reasonable shift notice, cancellation compensation** |

Sources: [Blake Morgan, October 2026 dates confirmed](https://www.blakemorgan.co.uk/employment-rights-act-2025-october-2026-implementation-dates-confirmed/), [Hill Dickinson tracker](https://www.hilldickinson.com/our-view/articles/what-does-the-employment-rights-act-2025-contain/), [Brodies on SSP](https://brodies.com/insights/employment-and-immigration/employment-rights-act-2025-reforms-to-statutory-sick-pay-from-april-2026/), [Womble Bond Dickinson](https://www.womblebonddickinson.com/uk/insights/articles-and-briefings/employment-law-changes-april-2026-day-one-rights-and-statutory-sick), [DLA Piper revised timeline](https://knowledge.dlapiper.com/dlapiperknowledge/globalemploymentlatestdevelopments/2026/revised-timeline-for-implementation-of-the-employment-rights-act-2025), [Acas](https://www.acas.org.uk/employment-rights-act-2025). **Confidence: high** on Oct 2026 and April 2026 dates; **medium** on the precise guaranteed-hours commencement month.

### 3.2 The guaranteed-hours duty is a genuinely software-shaped problem

Four new rights: (1) guaranteed hours offer; (2) reasonable notice of shifts; (3) compensation for changed/cancelled shifts; (4) protection from detriment.

Mechanics that create the software need:

- Employers must offer a guaranteed-hours contract reflecting hours **usually worked over a reference period** — government preference is **12 weeks** (consultation also floated 26 and 52).
- Consultation is considering whether the calculation uses **mean or median** hours.
- "Low hours" threshold under consultation, options **8 to 48 hours/week**, government preference **8–20**.
- Practitioner guidance is explicit about the data requirement: *"record actual hours worked for every zero-hours and casual worker, with real start and end times per shift — not just scheduled hours. Track this against individual workers, not just shifts. Employers need to be able to pull up a 12-week picture for any given person at any point."*
- **Consultation responses were due 25 August 2026** — i.e. **eight days from now**. The regulations are not final.

Sources: [Farrer & Co](https://www.farrer.co.uk/news-and-insights/employment-rights-bill-spotlight-on-changes-to-zero-hours-contracts/), [Lewis Silkin, "Guaranteed hours: more detail, more complexity"](https://www.lewissilkin.com/en/insights/2026/06/10/guaranteed-hours-more-detail-more-complexity), [Policy Pros employer guide](https://www.policypros.co.uk/zero-hours-contracts-january-2027-employer-guide/), [Rotageek](https://www.rotageek.com/blog/employment-law-changes-2026-2027-what-it-means-for-shift-based-operations), [Personnel Today](https://www.personneltoday.com/hr/guaranteed-hours-what-we-know-so-far/). **Confidence: medium-high** on mechanics, **low-medium** on final parameters — *they genuinely are not settled yet*.

### 3.3 Population

- **1.23–1.24 million** people on zero-hours contracts — a **record high**, up 207,000 since July 2024.
- **32.2%** of the accommodation and food services workforce is on zero-hours arrangements.
- Most affected sectors: hospitality, retail, health and social care, security, leisure, warehousing.

Sources: [ONS EMP17](https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandemployeetypes/datasets/emp17peopleinemploymentonzerohourscontracts), [Lancaster University Work Foundation](https://www.lancaster.ac.uk/work-foundation/news/zero-hour-contracts-reach-new-record-high-as-workers-wait-for-new-rights-to-arrive), [ITV News, 9 Aug 2026](https://www.itv.com/news/2026-08-09/record-number-relying-on-zero-hours-contracts-despite-crackdown-plans). **Confidence: high** — ONS is the primary source and multiple outlets quote it consistently.

### 3.4 Incumbent landscape — cheap, crowded, but **not yet compliant**

| Tool | Price |
|---|---|
| Planday | from £2.99/user/mo, min 5 users |
| RotaCloud | from £10/mo (5 employees); ~£45–55/mo at 25 people |
| Deputy | from £30/mo; ~£130/mo at 25 people (Core) |

Source: [Workforce.com UK buyers guide](https://www.workforce.com/uk/buyers-guides/best-staff-rota-software-in-the-uk-2026), [Shiftbase](https://www.shiftbase.com/blog/best-staff-rota-software-uk), [ExpertSure RotaCloud review](https://www.expertsure.com/uk/time-attendance/rotacloud-review/). **Confidence: medium** — comparison sites, likely affiliate-influenced; verify on vendor pricing pages.

**The honest risk:** RotaCloud, Planday, Deputy and Rotageek will ship guaranteed-hours logic as a *feature* once the regulations land. Rotageek is already publishing content about it. A standalone product competing on "we do the 12-week calculation" has a moat measured in months, not years.

---

## 4. Martyn's Law (Terrorism (Protection of Premises) Act 2025)

- **Royal Assent 3 April 2025**; expected **in force Spring 2027** after an implementation period of at least 24 months.
- Regulator: **Security Industry Authority (SIA)**, which has consulted on draft operational guidance.
- **250,000+ premises** estimated in scope.
- **Standard tier (200–799 capacity):** must have "appropriate, reasonably practicable public protection procedures" across **evacuation, invacuation, lockdown, communication**. Capacity counts *everyone who could reasonably be present at once* — staff, contractors, volunteers — not ticket sales or licensed capacity.
- **Enhanced tier (800+):** everything above **plus** public protection *measures*, a **vulnerability assessment**, a **designated senior individual**, and a **compliance document provided to the SIA**.
- **Critical distinction: a compliance document is required only for enhanced-duty premises and qualifying events — NOT for standard tier.**
- Home Office impact assessment: **£52,093 10-year PV per enhanced premises (~£5,210/year)**.

Sources: [ProtectUK](https://www.protectuk.police.uk/martyns-law/martyns-law-overview-and-what-you-need-know), [Home Office Impact Assessment (PDF)](https://assets.publishing.service.gov.uk/media/66e30684e47cfc6de429d612/TPOP_Signed_IA.pdf), [Home Office mythbuster (PDF)](https://assets.publishing.service.gov.uk/media/69281f35b3b9afff34e960f0/martyns-law-mythbuster.pdf), [Policy Pros](https://www.policypros.co.uk/martyns-law-standard-tier-procedures/), [TLT LLP](https://www.tlt.com/insights-and-events/insight/martyns-law-receives-royal-assent--act-now-do-not-wait). **Confidence: high** on tiers and dates; **high** on the cost figure (Home Office IA); **medium** on the exact standard-tier documentation position.

**Commercial read:** the £5,210/year enhanced-tier budget means **£49–99/month is trivially affordable** for that buyer. But the standard-tier majority explicitly does *not* need a document system, which caps the addressable population well below 250,000. Existing suppliers (Policy Pros, martynslawplan.co.uk, Sentinel Resilience) are selling **templates and PDFs**, not living systems with drill logs, staff training records and version-controlled compliance documents. That is a real gap.

---

## 5. Other forced-purchase triggers — mostly negative findings

**Companies House / ECCTA identity verification.** Existing directors and PSCs must verify by **18 November 2026**; **6–7 million people** in scope; mandatory for new directors since 18 Nov 2025. Non-compliance can block filings and lead to prosecution. Sources: [OneID](https://oneid.uk/news-and-events/companies-house-identity-verification-under-eccta-what-is-changing), [Farrer & Co](https://www.farrer.co.uk/news-and-insights/eccta-further-developments-in-the-identity-verification-regime/). **Confidence: high.** *But the deadline is three months away and then the urgency evaporates.* A tracking tool for accountants would have ~12 weeks of selling window. Not a business.

**EPR for packaging.** Large producers: >£2m turnover **and** >50t packaging — report every 6 months (1 Oct, 1 Apr). Small producers: £1–2m turnover with 25–50t — report **annually by 1 April**. ~**5,250** producers registered with the Environment Agency. From 2026–27 fees are modulated by recyclability using a **RAG rating**. Sources: [House of Commons Library CBP-10352](https://commonslibrary.parliament.uk/research-briefings/cbp-10352/), [ERP UK](https://erp-recycling.org/uk/news-and-events/2026/07/packaging-epr-for-small-producers-2026-reporting-obligations/), [Wastepack](https://www.wastepackgroup.co.uk/2025/09/19/epr-producer-register-introduced/). **Annual cadence + established compliance schemes = weak monthly SaaS.**

**Deposit Return Scheme.** Launches **1 October 2027** UK-wide. Producers, manufacturers, importers and return point operators must register with the **DMO before 1 Oct 2027** and keep supply records. Sources: [Brodies](https://brodies.com/insights/environmental-social-and-governance/towards-a-uk-deposit-return-scheme-uk-government-reaffirms-its-commitment-to-an-october-2027-launch/), [FDF](https://www.fdf.org.uk/fdf/business-guidance-hubs/packaging/packaging-latest/deposit-return-scheme/deposit-return-scheme-overview/). Too far out; the DMO will supply the infrastructure.

**European Accessibility Act.** Applies to any operator serving EU consumers regardless of HQ, so UK sellers *can* be caught. **Microenterprise exemption: fewer than 10 employees AND ≤€2m turnover/balance sheet — services only, both limbs required.** Standard is EN 301 549 / **WCAG 2.1 AA**. Penalties by member state: Hungary €1.26m, Spain €1m, Netherlands €900k, France €250k, Germany €100k, Italy up to 5% turnover. Sources: [Level Access](https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/), [Brambla UK guide](https://www.brambla.co.uk/blog/european-accessibility-act-uk-businesses/). **Confidence: medium** — vendor sources with an incentive to alarm; one extract said "enforcement began June 2026" which likely conflates the 28 June 2025 application date with subsequent enforcement ramp-up. **Verdict: avoid** — the micro-exemption removes most UK SMEs, incumbents are entrenched, and accessibility overlays carry real legal risk.

**EU AI Act.** Article 50 transparency obligations became **applicable and enforceable on 2 August 2026** — disclosure when users interact with AI, marking of synthetic content, emotion/biometric notices. Fines up to **€15m or 3% of global turnover**. **High-risk obligations were pushed back to 2 December 2027** by the Digital Omnibus (August 2028 for safety-component AI). Pre-existing generative systems have until **2 December 2026** for machine-readable marking. Sources: [Goodwin](https://www.goodwinlaw.com/en/insights/publications/2026/08/alerts-technology-dpc-eu-ai-act-transparency-obligations-now-in-force), [Skadden](https://www.skadden.com/insights/publications/2026/05/ai-act-state-of-play), [DLA Piper](https://knowledge.dlapiper.com/dlapiperknowledge/globalemploymentlatestdevelopments/2026/The-Digital-AI-Omnibus-Proposed-deferral-of-high-risk-AI-obligations-under-the-AI-Act). **Confidence: high.** Buyer is AI product companies, not UK SMEs — wrong customer for this owner.

**Food allergens / Natasha's Law follow-ups.** The FSA position on non-prepacked foods and precautionary allergen labelling is **best-practice guidance, not new law**. Written allergen information "supported by a conversation" is *recommended*, not mandated. Sources: [FSA business guidance](https://www.food.gov.uk/business-guidance/allergen-information-for-non-prepacked-foods-best-practice-voluntary-information), [Food Safety Magazine](https://www.food-safety.com/articles/8852-uk-fsa-updates-guidance-on-precautionary-allergen-labeling-clarifies-vegan-vs-free-from). **No forced purchase. Cross this off the list.**

**SSP changes.** Day-one SSP and LEL removal (6 Apr 2026) are handled by existing payroll software. No gap.

---

## 6. Cross-cutting warnings

1. **"Regulation forces a purchase" does not mean "regulation forces a purchase *from you*."** In every category examined, the incumbent path is that Sage/Xero/QuickBooks/RotaCloud/payroll bureaux add the feature to a product the customer already pays for. Regulatory deadlines create demand for *capability*, and capability usually gets absorbed by existing vendors.
2. **Free is a real competitor and it is getting freer.** HMRC ships its own free MTD tool; five banks bundle MTD software to win current accounts.
3. **Deadline-driven products have deadline-shaped revenue.** A Companies House verification tracker dies on 19 November 2026. Prefer *recurring* obligations (quarterly filings, rolling 12-week reference periods, annual drills) over one-off deadlines.
4. **Selling is the hard part, not building.** One source (weak, but plausible) puts average CAC for UK SaaS selling to SMEs at **~£3,500** — which would be fatal at £49/month. The owner's route has to be direct, unpaid, founder-led sales into a niche they can personally reach.
5. **Regulations that aren't final yet cannot be built against.** The guaranteed-hours consultation closes 25 August 2026. Reference period, mean-vs-median and the low-hours threshold are all still open.

## OPPORTUNITIES SURFACED
RANKED, with the honest case against each.

**1. ERA guaranteed-hours evidence layer — "prove you complied" for shift employers (BEST FIT)**
Who buys: owner-managers of 20–80 staff hospitality, care, retail, security and leisure businesses — the sectors where 32.2% of the workforce is zero-hours. Reachable by the owner in person: pubs, restaurant groups, care homes, cleaning firms in one UK region.
Pain: from ~Jan 2027 they must identify, per worker, when a guaranteed-hours offer is triggered on a rolling ~12-week reference period, give reasonable shift notice, and pay compensation for cancelled shifts — with tribunal exposure and a 6-month claim window (from Oct 2026). They cannot answer "show me this person's 12-week picture" today.
What they pay today: £2.99–£10/user/month for rota tools (Planday, RotaCloud, Deputy) that schedule shifts but do not compute the ERA entitlement or keep an audit trail. Employment solicitors charge far more for a one-off review.
Why now: regulations land after the 25 Aug 2026 consultation closes; employers need reference-period data BEFORE Jan 2027, meaning data collection must start ~Oct 2026. Perfect timing for a Q4 2026 launch.
The wedge that avoids a fight with incumbents: do NOT build a rota tool. Build the compliance/evidence layer that ingests CSV exports from RotaCloud/Planday/Deputy/payroll, computes the rolling reference-period position per worker, flags who crosses the trigger, generates the offer letters, and keeps a timestamped audit trail for tribunal. £49–99/month is defensible against a single tribunal claim.
Against it: incumbents will ship this as a feature; the spec is not final; you are betting on a date that has already slipped once.

**2. Martyn's Law enhanced-tier compliance system (BEST MARGIN)**
Who buys: the responsible person at enhanced-tier premises (800+ capacity) — larger venues, conference centres, theatres, stadia, large retail, universities, places of worship, visitor attractions.
Pain: by Spring 2027 they must appoint a designated senior individual, complete a vulnerability assessment, maintain public protection procedures AND measures, and provide a compliance document to the SIA — then keep it current as staff and layouts change.
What they pay today: template packs and PDF guides (Policy Pros, martynslawplan.co.uk, Sentinel Resilience). The Home Office impact assessment budgets ~£5,210/year per enhanced premises, so £99/month consumes under a quarter of an already-assumed budget.
Why now: SIA operational guidance is being consulted on; Spring 2027 is inside the window; nobody is selling a living system (drill logs, staff training records, versioned compliance document, SIA-ready export) at SME price.
Against it: the enhanced-tier population is unquantified and is a small minority of the 250,000 figure. Standard tier — the bulk — explicitly does not need a compliance document, so the big number is not your market. Verify the enhanced-tier count in the Home Office IA before committing.

**3. MTD practice-side client chasing and quarterly status board (SAFEST TO BUILD)**
Who buys: sole-practitioner and 2–10 person accountancy practices with 50–400 MTD clients.
Pain: client contact goes from annual to quarterly — a 4x engagement increase with no extra headcount — and the documented bottleneck is chasing clients for records, not filing. ~294,000 in-scope taxpayers are currently not filing at all, and HMRC is moving to sign up no-shows.
What they pay today: IRIS Elements and TaxCalc practice tools priced for larger firms; Karbon/Senta practice management at per-user rates; or nothing (spreadsheets and manual email).
Why now: penalties begin 6 April 2027 and the £30k wave lands the same day, roughly doubling client counts per practice.
Decisive advantage: this needs NO HMRC recognition — no fraud prevention headers, no production approval, no six-month HMRC correspondence. It reads nothing from HMRC; it tracks who has sent what. That removes the single biggest execution risk for a non-coder-led build, and it is the reason I rank a "boring" workflow tool above the more obvious filing product.
Price: £49–99/month per practice is normal for practice tooling. 48 practices is a plausible target for founder-led sales via ICAEW/AAT local networks and AccountingWEB.
Against it: it is a crowded adjacency; accountants are famously slow buyers; you must win against "we just use a spreadsheet".

**EXPLICITLY DO NOT BUILD**
- Any taxpayer-facing MTD filing tool. HMRC's free tool plus five banks giving software away to win current accounts means the price floor is £0 and the competitors' marginal cost is negative.
- Anything UK e-invoicing. The mandate is 2029.
- EU accessibility scanning/overlays. Micro-exemption removes your buyers; overlays carry legal risk; incumbents are entrenched.
- A Companies House ECCTA verification tracker. The deadline is 18 Nov 2026 and the product dies the next day.
- Allergen labelling compliance. FSA guidance is voluntary; there is no forced purchase.

## KEY CLAIMS
- MTD ITSA thresholds are confirmed: over £50,000 from 6 April 2026, over £30,000 from 6 April 2027, over £20,000 from 6 April 2028. The 2028 wave brings in approximately 900,000–970,000 additional sole traders and landlords.
  SOURCE: https://www.lexisnexis.co.uk/legal/news/hmrc-publishes-reduction-of-making-tax-digital-income-threshold-from-april-2028 (quoted via search extract; gov.uk blocked)
- HMRC estimated 864,000 taxpayers were required to join MTD from April 2026. As at August 2026 only ~570,000 had registered and ~436,000 had actually filed a quarterly update — leaving roughly 294,000 legally-required taxpayers non-compliant four months in.
  SOURCE: https://www.icaew.com/insights/tax-news/2026/jun-2026/hmrc-contacts-final-group-of-taxpayers-within-mtd-income-tax and https://www.accountingweb.co.uk/tax/hmrc-policy/hmrc-to-start-signing-up-mtd-no-shows (both domains blocked; figures from search extracts)
- The bottom of the MTD market is priced at £0: HMRC ships its own free tool for simple single-trade taxpayers, and Starling, SumUp, NatWest/RBS/Ulster (FreeAgent), Mettle, Zempler (Coconut), Clear Books, Zoho and Landlord Studio all offer free MTD tiers. Paid tools cluster at £7–15/month. This makes the £20k–£30k 2027/2028 waves commercially unaddressable at £49/month.
  SOURCE: https://www.techradar.com/pro/software-services/free-making-tax-digital-mtd-software , https://www.starlingbank.com/features/making-tax-digital/ , https://mtdcompare.co.uk/
- MTD late-submission penalties do NOT apply to quarterly updates during 2026/27; the points-based regime applies to all ITSA taxpayers only from 6 April 2027, with a £200 penalty at 4 points for quarterly filers. The financial forcing function therefore starts April 2027, not now.
  SOURCE: https://www.icaew.com/technical/tax/making-tax-digital/mtd-for-income-tax-penalties and https://www.icaew.com/insights/tax-news/2026/mar-2026/penalty-regime-for-mtd-for-income-tax-becomes-clearer (blocked; via search extract)
- Building MTD software requires HMRC production credentials: ~24 Gov-Client-*/Gov-Vendor-* fraud prevention headers on every API call (a legal requirement), HMRC review of header accuracy, a Production Approvals Checklist, and a six-month window after which progress is deleted. A solo developer (TapTax / Solomon Amos) has done it, but it is months of latency before revenue.
  SOURCE: https://developer.service.hmrc.gov.uk/guides/fraud-prevention/ and https://taptax.co.uk/blog/5-things-that-surprised-me-building-on-hmrcs-making-tax-digital-api (both blocked; via search extracts)
- The UK domestic e-invoicing mandate is 2029, not 2026-2028. Government confirmed at Budget 2025 that e-invoicing becomes compulsory for all VAT invoices from 2029 using Peppol, with an implementation roadmap due at Budget 2026. This places the entire UK e-invoicing category outside the 24-month window.
  SOURCE: https://www.vatcalc.com/united-kingdom/uk-2029-mandatory-b2b-e-invoicing/ and https://www.lexisnexis.com/en-gb/legal/news/hmrc-dbt-publish-outcome-of-electronic-invoicing-consultation
- EU e-invoicing mandates land 2026-2028 (Belgium 1 Jan 2026 B2B Peppol; Poland KSeF Feb/Apr 2026; France 1 Sep 2026 receive-all and large/mid issuance, Sep 2027 SMEs; Germany Jan 2027 >€800k then Jan 2028 all; Spain Verifactu Jan 2027 corporates/Jul 2027 autónomos), with ViDA transposition by 31 Dec 2026 and the EU-wide intra-EU B2B mandate only on 1 July 2030. Obligations bind the EU-established party, so UK exporters are largely not themselves mandated.
  SOURCE: https://www.fiskaly.com/blog/e-invoicing-mandates-in-europe-2026 and https://gerlach-customs.com/news/news-and-trends/eu-vida-timeline-2026-2027/
- The Employment Rights Act guaranteed-hours duty (~January 2027) requires employers to track actual hours worked per individual worker over a reference period (government preference: 12 weeks) and offer a guaranteed-hours contract. The regulations are NOT final — the consultation on reference period length, mean-vs-median calculation and the low-hours threshold (options 8–48 hrs/wk, preference 8–20) closed 25 August 2026.
  SOURCE: https://www.lewissilkin.com/en/insights/2026/06/10/guaranteed-hours-more-detail-more-complexity and https://www.farrer.co.uk/news-and-insights/employment-rights-bill-spotlight-on-changes-to-zero-hours-contracts/
- 1.23–1.24 million people are on zero-hours contracts in the UK — a record high, up 207,000 since July 2024 — and 32.2% of the accommodation and food services workforce is on zero-hours arrangements.
  SOURCE: https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandemployeetypes/datasets/emp17peopleinemploymentonzerohourscontracts via https://www.lancaster.ac.uk/work-foundation/news/zero-hour-contracts-reach-new-record-high-as-workers-wait-for-new-rights-to-arrive and https://www.itv.com/news/2026-08-09/record-number-relying-on-zero-hours-contracts-despite-crackdown-plans
- Confirmed ERA dates: 6 April 2026 SSP payable from day one with the Lower Earnings Limit removed (1.3m additional employees qualify, £123.25/wk or 80% AWE); 1 October 2026 tribunal time limits rise from 3 to 6 months; 30 October 2026 the 'all reasonable steps' sexual harassment duty and third-party harassment protections take effect; 1 January 2027 fire-and-rehire restrictions. Day-one unfair dismissal was abandoned — it became a 6-month qualifying period from 1 January 2026.
  SOURCE: https://www.blakemorgan.co.uk/employment-rights-act-2025-october-2026-implementation-dates-confirmed/ and https://brodies.com/insights/employment-and-immigration/employment-rights-act-2025-reforms-to-statutory-sick-pay-from-april-2026/
- Martyn's Law comes into force Spring 2027, regulated by the SIA, affecting 250,000+ premises. Critically, a compliance document is required ONLY for enhanced-tier (800+ capacity) premises and qualifying events — standard tier (200–799) needs procedures across evacuation/invacuation/lockdown/communication but no compliance document. The Home Office impact assessment puts the cost at £52,093 10-year PV (~£5,210/year) per enhanced-tier premises.
  SOURCE: https://assets.publishing.service.gov.uk/media/66e30684e47cfc6de429d612/TPOP_Signed_IA.pdf and https://www.protectuk.police.uk/martyns-law/martyns-law-overview-and-what-you-need-know and https://www.policypros.co.uk/martyns-law-standard-tier-procedures/
- Companies House ECCTA identity verification requires 6–7 million existing directors and PSCs to verify by 18 November 2026 — a hard deadline three months away, after which the compliance urgency (and any product built for it) evaporates.
  SOURCE: https://oneid.uk/news-and-events/companies-house-identity-verification-under-eccta-what-is-changing and https://www.farrer.co.uk/news-and-insights/eccta-further-developments-in-the-identity-verification-regime/
- The documented MTD pain is operational, not technical: client contact frequency rises from annual to quarterly (a 4x increase per client with no headcount increase), and stripped-back sole-trader MTD tools have a 'blind spot' with nowhere to record transactions excluded from quarterly updates but needed for the annual return, creating clean-up work for accountants.
  SOURCE: https://www.accountingweb.co.uk/tech/accounting-software/mtd-software-blind-spot-creates-year-end-headache-for-firms and https://www.accountex.co.uk/insight/2026/05/01/mtd-is-a-labour-problem-not-a-software-problem/ (blocked; via search extracts)
- UK rota/workforce incumbents are already cheap and entrenched: Planday from £2.99/user/month (min 5), RotaCloud from £10/month (5 employees, ~£45–55/month at 25 people), Deputy from £30/month (~£130/month at 25). None yet implement the ERA guaranteed-hours calculation because the regulations are not final.
  SOURCE: https://www.workforce.com/uk/buyers-guides/best-staff-rota-software-in-the-uk-2026 and https://www.expertsure.com/uk/time-attendance/rotacloud-review/ and https://www.rotageek.com/blog/employment-law-changes-2026-2027-what-it-means-for-shift-based-operations
- The EU Accessibility Act exempts microenterprises (fewer than 10 employees AND ≤€2m turnover/balance sheet) for services, which removes most UK small businesses from scope; and UK food allergen requirements for non-prepacked food remain FSA best-practice guidance rather than new law. Neither is a forced-purchase trigger for UK SMEs.
  SOURCE: https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/ and https://www.food.gov.uk/business-guidance/allergen-information-for-non-prepacked-foods-best-practice-voluntary-information
- EU AI Act Article 50 transparency obligations became applicable and enforceable on 2 August 2026 (fines up to €15m or 3% of global turnover), while high-risk obligations were deferred to 2 December 2027 by the Digital Omnibus. The buyers are AI product companies, not UK SMEs.
  SOURCE: https://www.goodwinlaw.com/en/insights/publications/2026/08/alerts-technology-dpc-eu-ai-act-transparency-obligations-now-in-force and https://www.skadden.com/insights/publications/2026/05/ai-act-state-of-play

## GAPS
WHAT I COULD NOT VERIFY, AND HOW MUCH IT MATTERS

**1. Blocked primary sources (biggest limitation).** The egress proxy blocked gov.uk, publications.parliament.uk, developer.service.hmrc.gov.uk, legislation.gov.uk, icaew.com, accountingweb.co.uk, litrg.org.uk, taxscape.deloitte.com, protectuk.police.uk, farrer.co.uk, vinciworks.com, mtd.digital and taptax.co.uk. Direct curl to gov.uk also returned a 403 CONNECT tunnel failure. Every figure attributed to those domains is a search-engine extract QUOTING them, not a page I read. The owner should personally open the GOV.UK MTD pages, the Home Office Martyn's Law impact assessment and the HMRC Developer Hub before committing. Confidence in the direction of travel: high. Confidence in any single number: medium.

**2. The April 2027 (£30k) wave population is unresolved.** I could not find a defensible incremental figure. One source cites "an estimated 1.7 million taxpayers" but it is ambiguous whether cumulative or incremental, and it contradicts the pattern of 864,000 (2026) + ~900–970,000 (2028). Do not use 1.7m in any business case.

**3. Martyn's Law enhanced-tier premises count is unknown.** The 250,000+ figure covers both tiers. Since standard tier needs no compliance document, the actual addressable market for opportunity #2 is the enhanced-tier subset, which I could not size. This is the single most load-bearing unknown in that recommendation — the Home Office signed impact assessment (assets.publishing.service.gov.uk/media/66e30684e47cfc6de429d612/TPOP_Signed_IA.pdf) will have it.

**4. Guaranteed-hours regulations are genuinely not final.** Reference period (12 vs 26 vs 52 weeks), mean vs median calculation, the low-hours threshold (8–48 hrs/wk range, 8–20 preference), and the precise commencement month are all open. The consultation closed 25 August 2026 — eight days from this research date. Anything built before the response is published is building against a guess. The commencement has already moved once (fire-and-rehire slipped from Oct 2026 to Jan 2027), so further slippage is likely.

**5. Date inconsistencies I could not resolve.** (a) One source states the ERA received Royal Assent in December 2025; others imply earlier — the phased commencement dates are well-corroborated, the Assent date is not. (b) A source stated EAA "enforcement began June 2026", which probably conflates the 28 June 2025 application date with a later enforcement ramp; treat EAA timing as unverified. (c) Sources differ on the 2028 MTD wave being 900,000 vs 970,000 additional taxpayers.

**6. I did not verify incumbent feature roadmaps.** I found no evidence that RotaCloud, Planday, Deputy or any payroll vendor has SHIPPED guaranteed-hours reference-period tracking — but absence of evidence in search results is weak evidence of absence. Rotageek is already publishing content on the topic, which suggests they intend to. Before building opportunity #1, the owner should book demos with three incumbents and ask directly. This is a 30-minute check that could save six months.

**7. Vendor pricing is soft.** Rota and MTD prices came from comparison/affiliate sites, not vendor pricing pages (mtd.digital was blocked). Directionally right, individually unreliable.

**8. Weak/discarded evidence.** My search on SaaS willingness-to-pay and churn returned exactly the "top 10 ideas" content-marketing slop the brief warned about. I discarded almost all of it. The one figure I noted — ~£3,500 average CAC for UK SaaS selling to SMEs — comes from an unverifiable source and should be treated as unsourced folklore, though its implication (paid acquisition is fatal at £49/month, so sales must be founder-led and direct) is sound regardless.

**9. Not investigated.** UK data protection changes (Data Use and Access Act 2025) — I ran out of search budget and found no signal that it forces SME software purchases. Also unexamined: fire safety/Building Safety Act duties, and sector-specific regimes (FCA Consumer Duty, CQC) which may be richer veins than anything above but were outside this dimension's scope.

**OVERALL CONFIDENCE:** High that the ranking order is right and that the two negative findings (MTD taxpayer-side is dead; UK e-invoicing is 2029) are correct and decision-relevant. Medium on specific populations and prices. Low on anything about the guaranteed-hours regulations' final parameters, because they do not exist yet.