# The real cost, legal setup, and base rates of running a one-person UK software business

**Prepared 17 August 2026. All figures GBP unless stated. USD converted at ~$1 = £0.78, EUR at ~€1 = £0.85 — flag FX as an assumption, not a fact.**

**Sourcing note up front:** several primary sources are blocked by this environment's egress proxy — `stripe.com`, `ico.org.uk`, `developers.cloudflare.com`, `microconf.com`, `indiehackers.com`, `lemonsqueezy.com`, `freemius.com`. Where a figure below comes from a search extract or a secondary source rather than the vendor/regulator page itself, I say so. **Every price and every fee in this report should be re-checked on the vendor's own pricing page before you commit money to it.** The base-rate section is the weakest evidentially and I have flagged exactly why.

---

## 1. Headline answer

At 20–50 business customers paying £49–99/month, a UK one-person software business costs roughly **£75–140 per month all-in**, of which:

- **£25–45/month** is infrastructure (hosting, database, email, monitoring, domain, backups)
- **£40–70/month** is payment processing (2.4–2.6% of revenue on Stripe direct; 5.4–5.8% if you use a Merchant of Record)
- **£50–115/month** is amortised compliance and admin (ICO fee, insurance, accountancy, Companies House)

That is **3–6% of revenue**. Infrastructure is not your constraint and never will be at this scale. Your constraints are, in order: (1) finding customers, (2) keeping them, (3) your own time.

The single largest controllable line item is not on that list — it is the AI subscription that does your building. Claude Pro is $20/month (~£16); Claude Max is $100 or $200/month (~£78 / ~£156) ([Anthropic plan tiers, via secondary sources](https://www.superblocks.com/blog/claude-code-pricing)). If you need Max to sustain the build, your real running cost is £150–290/month, not £75–140, and your stated £0–60/month budget is already exceeded before you host anything.

---

## 2. Exact monthly cost model

### 2.1 Infrastructure — three tiers

| Component | Tier A: "free-tier" | Tier B: **recommended** | Tier C: managed comfort |
|---|---|---|---|
| Compute | Cloudflare Workers free (100k req/day) — **£0** | Hetzner CX22, 2 vCPU / 4 GB / 40 GB NVMe, €4.35/mo — **£3.70** | Vercel Pro $20 — **£15.60** |
| Database | Supabase free (500 MB, projects pause when idle) — **£0** | Neon Launch $19 — **£14.80** *or* self-hosted Postgres on the Hetzner box — **£0** | Supabase Pro $25 — **£19.50** |
| Transactional email | Resend free, 3,000/mo — **£0** | Resend free until you exceed 3,000/mo — **£0** | Resend Pro $20 (50,000/mo) — **£15.60** |
| Error monitoring | Sentry Developer free, 5,000 errors/mo — **£0** | Sentry free — **£0** | Sentry Team ~$26 — **£20** |
| DNS / CDN / WAF | Cloudflare free — **£0** | Cloudflare free — **£0** | Cloudflare free — **£0** |
| Backups | none guaranteed — **£0** | Hetzner backups (+20% of server) + object storage — **£1.50** | managed — **£0** (included) |
| Uptime monitoring | UptimeRobot free — **£0** | UptimeRobot / Better Stack free — **£0** | Better Stack paid — **£12** |
| Support inbox | Gmail — **£0** | Gmail / Fastmail — **£0–4** | Help Scout ~$25 — **£19.50** |
| Domain (.co.uk or .com) | ~£12/yr — **£1** | **£1** | **£1** |
| **Total / month** | **~£1** | **~£21–25** | **~£103** |

Sources for pricing: [Hetzner CX22 ~€4.35/mo, 2 vCPU/4 GB/40 GB NVMe, 20 TB traffic](https://vpsfor.dev/posts/hetzner-cx22-pricing-2026/); [Supabase Free 500 MB / Pro $25 with $10 compute credit; Neon $19](https://makerkit.dev/blog/saas/supabase-pricing); [Resend free 3,000 emails/mo, Pro $20 for 50,000](https://blog.vibecoder.me/email-service-pricing-resend-sendgrid-postmark); [Sentry Developer free tier 5,000 errors/mo](https://last9.io/blog/sentry-pricing/); [Cloudflare Workers Paid $5/mo for 10M requests](https://toolradar.com/tools/cloudflare-workers/pricing); [Vercel Pro $20/user/mo with $20 usage credit](https://comparedge.com/tools/vercel/pricing). All vendor pages were proxy-blocked; these are secondary and must be re-verified.

**Recommendation: Tier B.** Tier A is not appropriate once businesses depend on you — Supabase free-tier projects pause when idle, free tiers carry no SLA, and "my database went to sleep" is a churn event with a paying business customer. Tier C buys convenience you can add later.

**Two cost landmines the tables hide:**

1. **AI/LLM API calls inside your product.** If the thing you build calls an LLM on each customer action, that cost scales with usage and can make a £49/month customer unprofitable on its own. Current Anthropic API rates are $5/$25 per million tokens for Claude Opus 5 and $3/$15 for Claude Sonnet 5 (introductory $2/$10 through 31 Aug 2026). A single heavy customer running long documents through Opus can cost more than they pay you. If your product idea has an LLM in the loop, model per-customer token cost *before* you set the price, and cap usage in the product.
2. **Egress and bandwidth.** Fine on Hetzner (20 TB included) and Cloudflare (no egress charge on Workers). Not fine on some managed platforms. Avoid anything that bills per GB out if your product moves files.

### 2.2 Payments — the real numbers

**Stripe UK standard rates** (secondary sources; stripe.com blocked): 1.5% + 20p for UK domestic cards, 1.9% + 20p for UK premium/commercial cards, 2.5% + 20p for EEA cards, 3.25% + 20p for non-European international cards. Disputes are £20 each and non-refundable even if you win. Stripe currency conversion adds 2%. ([summary](https://www.wearefounders.uk/stripe-fees-uk-2026/), [detail](https://chosepayments.com/insights/stripe-fees-explained))

**Stripe Billing** (the subscription layer — recurring invoices, Smart Retries, dunning) is a flat **0.70% of billing volume**; the old Starter 0.5% / Scale 0.8% split was consolidated in July 2024 ([Stripe support summary](https://support.stripe.com/questions/changes-to-the-stripe-billing-starter-and-scale-plans?locale=en-GB)).

**Stripe Tax** is a further 0.5% per transaction, and does **not** file or remit for you in most jurisdictions ([summary](https://feetrace.com/blog/stripe-tax-fees-for-saas-in-2026-complete-guide)). At your scale you almost certainly do not need it — see §3.3.

At the target of ~£2,352/month:

| Scenario | Card fees | Billing 0.7% | **Total** | **% of revenue** |
|---|---|---|---|---|
| 48 × £49, all UK cards | £44.88 | £16.46 | **£61.34** | **2.61%** |
| 24 × £99, all UK cards | £40.44 | £16.63 | **£57.07** | **2.40%** |
| 48 × £49, 25% EEA cards | £56.40 | £16.46 | **£72.86** | **3.10%** |
| 48 × £49 via **Paddle** (5% + ~40p) | £136.80 | n/a | **£136.80** | **5.82%** |

**Merchant of Record pricing:** Paddle is 5% + $0.50 per checkout, no monthly fee, covering global payments, VAT/sales tax as legal seller, fraud and chargeback cover ([Paddle fee breakdown](https://dodopayments.com/blogs/paddle-fees-explained)). Lemon Squeezy is 5% + $0.50 with add-ons that can push the effective rate to ~8.9% (international cards +1.5%, PayPal +1.5%, subscriptions +0.5%) ([breakdown](https://getstacksmart.com/blog/lemon-squeezy-merchant-of-record-fees-2026)). Both apply FX margins of roughly 2–3% above mid-market if your sale currency differs from your payout currency — which turns a nominal 5% into 7–8% on international sales.

**Three MoR facts that matter for you specifically, and that most "Stripe vs Paddle" content omits:**

1. **Paddle rejects applicants with no prior payment-processing history** — reported as a requirement for ~3 months of processing history, undisclosed on their site ([review](https://fungies.io/paddle-review-2026/)). A brand-new UK micro-business may simply not be accepted. Do not build your billing around Paddle before you have been approved.
2. **Lemon Squeezy is being wound into Stripe.** Stripe acquired it in July 2024 and is migrating users to **Stripe Managed Payments** ([Lemon Squeezy 2026 update](https://www.lemonsqueezy.com/blog/2026-update) — page blocked, title and summary from search).
3. **Stripe Managed Payments — Stripe's own MoR — is expensive and mostly US-only.** It is 3.5% *on top of* standard Stripe Payments fees, giving ~6.4% + 30¢ on a US domestic card and 8–10%+ on international cards with conversion; as of mid-2026 it is primarily available to US-based businesses ([cost analysis](https://tiun.io/blog/cost-of-jstripe-managed-payments-2026), [second analysis](https://dodopayments.com/blogs/stripe-managed-payments-fees-explained)). It is not a realistic default for a UK micro-business today.

**Verdict: use Stripe directly.** For a UK business selling B2B to mostly-UK customers, an MoR costs you roughly **£75/month more** at target (£900/year) and buys you a VAT problem you do not have. See §3.3.

### 2.3 Compliance and admin — annual costs, amortised

| Item | Sole trader | Limited company | Notes |
|---|---|---|---|
| ICO data protection fee (tier 1) | £52 (£47 by direct debit) | £52 (£47 by DD) | Required — see §4.1 |
| Companies House incorporation | £0 | £100 one-off | Rose from £50 on 1 Feb 2026 |
| Confirmation statement | £0 | £50/year | Rose from £34 on 1 Feb 2026 |
| Accountancy | £150–400 (self-assessment) or DIY | £800–1,500 | |
| Professional indemnity (£1m) | £90–350 | £90–350 | See §3.4 |
| Cyber liability (optional, often contractual) | £175–600 | £175–600 | |
| Business bank account | £0 (Starling / Mettle / Tide free) | £0 | |
| Domain | £12 | £12 | |
| Legal templates (ToS, DPA, privacy policy) | £0–500 one-off | £0–500 one-off | |
| **Annual total (typical)** | **~£450–900** | **~£1,300–2,100** | |
| **Per month** | **~£38–75** | **~£108–175** | |

Sources: [Companies House fee increases from 1 Feb 2026 — digital incorporation £50→£100, confirmation statement £34→£50](https://www.1stformations.co.uk/blog/companies-house-filing-fees-increase/); [ICO fees £52 / £78 / £3,763, reduced £5 by direct debit](https://ico.org.uk/for-organisations/data-protection-fee/data-protection-fee/) (page blocked; figures via [secondary](https://ico.opencourtdata.uk/do-i-need-to-register-with-the-ico)); [free UK business accounts — Starling, Mettle, Tide](https://www.businessexpert.co.uk/business-banking/best-free-business-bank-accounts/).

### 2.4 The complete monthly picture at target revenue

| Line | Sole trader, Stripe direct | Ltd company, Paddle |
|---|---|---|
| Revenue (48 × £49) | £2,352 | £2,352 |
| Payment processing | −£61 | −£137 |
| Infrastructure (Tier B) | −£25 | −£25 |
| Compliance/admin amortised | −£50 | −£150 |
| **Operating profit before AI tooling** | **£2,216 (94%)** | **£2,040 (87%)** |
| Claude Pro ($20) | −£16 | −£16 |
| *or* Claude Max 5x ($100) | −£78 | −£78 |
| **Profit, Pro tier** | **£2,200** | **£2,024** |
| **Profit, Max 5x tier** | **£2,138** | **£1,962** |

The margin is excellent. That is exactly why this business model is oversubscribed and why the hard part is elsewhere.

---

## 3. UK legal and structural setup

### 3.1 Sole trader vs limited company

**At £25–28k annual profit, the tax case for incorporating has got weaker, not stronger, in 2026.** Dividend tax rose two percentage points on 6 April 2026: basic rate 8.75% → **10.75%**, higher rate 33.75% → **35.75%**, additional rate unchanged at 39.35%, dividend allowance still £500 ([ICAEW on Autumn Budget 2025](https://www.icaew.com/insights/tax-news/2025/nov-2025/budget-taxes-on-property-savings-and-dividends-increased), [HMRC policy paper](https://www.gov.uk/government/publications/changes-to-tax-rates-for-property-savings-dividend-income/changes-to-tax-rates-for-property-savings-dividend-income)). Commentary now puts the incorporation break-even at roughly **£40,000–50,000 profit**, above the old £30–35k rule of thumb, once you net off £800–1,500/year of extra accountancy ([2026/27 comparison](https://uktaxdrag.co.uk/sole-trader-vs-limited-company-uk-2026-27.html), [second](https://accountingstack.co.uk/tax-hmrc/business-structures/sole-trader-vs-limited-company/)).

**But tax is the wrong reason to decide this.** The real arguments:

*For starting as a sole trader:* registration is free and takes minutes; you can be invoicing within a day; there is no Companies House filing, no confirmation statement, no separate corporation tax return; your home address is not published.

*For incorporating, earlier than the tax maths suggests:* you are holding other businesses' data under contracts with liability clauses. A limited company puts a legal wall between a claim and your house. Some business customers prefer contracting with a company. And there is one concrete 2026 admin advantage: **Making Tax Digital for Income Tax does not apply to limited companies.** MTD for ITSA started April 2026 for sole traders and landlords with qualifying income over £50,000, drops to £30,000 in April 2027 and **£20,000 in April 2028** ([FSB](https://www.fsb.org.uk/resources/article/making-tax-digital-2026-deadlines-rules-and-more-MCQVRXUNIJC5EQRAZBQ7DFJNGYMA), [ICAEW TAXguide 04/25](https://www.icaew.com/technical/tax/tax-faculty/taxguides/2025/taxguide-04-25)). Qualifying income is **gross**, so a sole trader turning over £28k would be caught from April 2028 and would be filing quarterly digital updates plus a year-end declaration, with a points-based penalty regime (£200 at four points, £200 per subsequent miss).

**Practical recommendation:** start as a sole trader to reach first revenue fast. Incorporate when the *first* of these happens — you sign a contract with a liability clause you cannot cap comfortably, you reach ~10 paying customers, or profit approaches £40k. Migrating Stripe accounts and novating customer contracts on incorporation is annoying but routine; do not let that fear keep you a sole trader past the point where liability matters.

### 3.2 ICO registration — you almost certainly must pay

The data protection fee is **£52 (tier 1: turnover ≤£632,000 or ≤10 staff), £78 (tier 2), £3,763 (tier 3)**, each reduced by £5 for direct debit. There is **no small-business or sole-trader exemption** — the test is what you do with personal data, not your size. Failure to register can attract a fine of up to £4,350 ([ICO fee guide](https://ico.org.uk/for-organisations/data-protection-fee/data-protection-fee/), [self-assessment tool](https://ico.org.uk/for-organisations/data-protection-fee/data-protection-fee-self-assessment/) — both blocked; figures via [1st Formations](https://www.1stformations.co.uk/blog/ico-data-protection-fee/) and [LegalVision](https://legalvision.co.uk/data-privacy-it/data-protection-register/)).

The exemptions (staff administration, accounts and records, marketing your own goods and services, purely paper records) do not cover running a hosted application that stores customer account data. **Pay the £47. Do it on day one.**

Note: the fee regime applies to *controllers*. A pure processor is not liable for the fee — but you will be a controller of at least your own customer/account/billing/support data, so this does not help you. See §4.1.

### 3.3 VAT — the section that saves you money

This is where most generic advice misleads UK micro-founders. Three separate rules:

**(a) UK VAT registration.** Threshold is **£90,000** of taxable turnover in any rolling 12-month period, frozen since 1 April 2024 and confirmed unchanged for 2026/27 ([THP](https://www.thp.co.uk/uk-vat-threshold-2026-a-complete-guide-for-growing-businesses/), [House of Commons Library briefing SN00963](https://commonslibrary.parliament.uk/research-briefings/sn00963/)). Your target of £28,020/year is under a third of it. **You do not need to register.**

**(b) Selling to EU businesses.** For B2B digital services, place of supply is the customer's country and the **reverse charge** applies — the customer accounts for the VAT in their own country. You do not register anywhere in the EU. You need the customer's VAT number and a line on the invoice such as *"Reverse charge: customer to account for VAT to their local tax authority."* ([vatcalc](https://www.vatcalc.com/global/vat-on-cross-border-b2b-digital-services/), [The Accountancy Partnership](https://www.theaccountancy.co.uk/vat/cross-border-supply/vat-on-cross-border-services-and-digital-sales-after-brexit-75904.html))

**(c) Selling to EU consumers.** This is the trap. There is **no threshold** for a non-EU business supplying B2C digital services into the EU — VAT is due from the first sale, and you must either register in each member state or use the **Non-Union One Stop Shop**, filing a single quarterly return ([AVASK](https://avask.com/blog/vat-for-digital-services/), [Fungies OSS guide](https://fungies.io/eu-vat-oss-scheme-saas/)).

**Therefore: does a Merchant of Record remove the VAT burden for you?** It removes a burden you do not have, at a cost of roughly 3.2 percentage points of revenue. An MoR becomes the legal seller, charges the correct local VAT, and files the OSS returns ([RevExOS explainer](https://revexos.com/blog/Merchant-of-Record-MoR-Explained-for-SaaS-Companies), [tiun](https://tiun.io/blog/best-merchant-of-record-eu-saas)). That is genuinely valuable — **if you sell B2C into the EU, or sell globally at volume**. It is not valuable if you sell B2B, mostly to UK businesses, under the £90k threshold.

**Decision rule:** Stripe direct if B2B and UK-weighted. Switch to an MoR only when EU/international *consumer* sales become material, or when EU B2B customers without VAT numbers become common enough that reverse-charge evidence gets awkward. Revisit if you approach £90k.

One caveat: staying unregistered means you cannot reclaim input VAT on your costs (~20% of £25–140/month — trivial). And since business customers reclaim VAT anyway, not charging it is competitively neutral for you. Do not voluntarily register at this scale.

### 3.4 Insurance

**Professional indemnity** is the one that matters — it covers claims that your software caused the customer financial loss. UK software developer quotes are low: Simply Business reports 10% of software developers paying **£92.11 or less per year** for up to £1m cover (Oct 2025–Mar 2026), and 10% of software engineers at **£70.50 or less**; other providers quote from ~£8/month for £100k cover up to ~£336/year ([Simply Business software developers](https://www.simplybusiness.co.uk/business-insurance/software-developers-insurance/), [Hiscox](https://www.hiscox.co.uk/business-insurance/software-developers)). **Budget £150–350/year for £1m PI**, and treat sub-£100 quotes as a signal to read the exclusions carefully.

**Cyber liability** is separate and increasingly demanded in B2B contracts. UK small business premiums run **£350–£5,000/year**, with micro-businesses with minimal data exposure as low as ~£175. Most insurers now require MFA, EDR, backups, and Cyber Essentials as underwriting prerequisites. Certifying **Cyber Essentials** through an IASME-licensed body includes £25,000 of cyber liability at no extra cost for UK businesses turning over under £20m — a small limit, but a useful signal ([Get Indemnity](https://getindemnity.co.uk/business-insurance/cyber/how-much-does-cyber-insurance-cost), [Connection Technologies](https://connection-technologies.co.uk/blog/cyber-insurance-uk-2026)). *Cyber Essentials certification cost for a micro-business is roughly £300–400 + VAT — I could not verify the current IASME price band and you should check it directly.*

### 3.5 Contracts you actually need

Four documents, in order of necessity:

1. **Terms of Service / SaaS agreement** — the contract. Must cap your liability (industry norm: 12 months' fees paid), exclude indirect and consequential loss, disclaim uptime guarantees unless you deliberately offer one, define acceptable use, and set out termination and data-return terms.
2. **Privacy policy** — required, and from 19 June 2026 it must also carry your complaints route (see §4.4).
3. **Data Processing Agreement** — required by law where you process personal data on a customer's behalf. See §4.2.
4. **Sub-processor list** — a public page naming your hosting, email, and analytics vendors. Your DPA will commit you to notifying customers of changes.

Cost: free templates exist and are usable at this scale ([SEQ Legal free SaaS agreement](https://seqlegal.com/free-legal-documents/saas-agreement/), [Docue](https://docue.com/en-gb/legal-templates/saas-terms-and-conditions/O7W4qO)). A solicitor-reviewed set runs £500–1,500. **Start with a good template; pay for review when your first customer redlines it or when contract value justifies it.**

### 3.6 SLA expectations — and the SOC 2 wall

Micro-business customers at £49/month rarely demand a contractual SLA with service credits. They will ask about uptime, backups, where data is held, and what happens if you get hit by a bus. Publish a support commitment (e.g. "response within one business day"), a status page, a one-click data export, and a plain-English security page. **Do not sign SLAs with financial credits or uncapped liability at this price point** — the downside is unbounded and the revenue is not.

The hard ceiling: **SOC 2 Type 2 first-year cost for a small-to-mid-size SaaS is $20,000–35,000**, with the audit fee only 30–40% of it, and many mid-market and enterprise RFPs treat it as a hard requirement rather than a bonus. Vendors report 10–30 hours per security questionnaire and 10–20 questionnaires a year ([SOC 2 for B2B SaaS](https://soc2-auditors.com/insights/soc-2-for-b2b-saas), [Konfirmity](https://www.konfirmity.com/blog/soc-2-customer-security-questionnaire)). At £2,335/month that is not affordable, and the time cost alone would consume your business.

**This is a strategic constraint, not a cost line.** It means your addressable market is businesses *without* a formal vendor-risk process: sole practitioners, micro-businesses, small firms, trades, single-site operators. Target accordingly. If your idea only sells to companies with a procurement function, the economics do not work at £49/month.

---

## 4. Data protection in practice

### 4.1 Controller or processor? Both.

You will be **both**, simultaneously, and this confuses people:

- **Controller** for your own data: customer contacts, account holders, billing records, support email, marketing list, server logs. You decide the purposes and means. This is why you pay the ICO fee.
- **Processor** for the personal data your business customers put into your app about *their* clients, staff, or contacts. They decide what goes in and why; you process on instruction.

The distinction is functional, not contractual: a processor that starts deciding the purpose and means of processing becomes a controller and carries controller liability ([ICO guidance on controller/processor responsibilities](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/contracts-and-liabilities-between-controllers-and-processors-multi/responsibilities-and-liabilities-for-processors-in-their-own-right/)). Practical consequence: do not mine your customers' uploaded data for your own product analytics without a lawful basis and their instruction.

### 4.2 What a DPA must contain

Article 28(3) UK GDPR sets mandatory minimum terms. A compliant DPA must state the **subject matter and duration** of processing, the **nature and purpose**, the **types of personal data**, the **categories of data subject**, and the controller's rights and obligations — plus the eight processor obligations:

1. process only on the controller's **documented instructions**
2. ensure staff are under a duty of **confidentiality**
3. take appropriate **technical and organisational security measures** (Art. 32)
4. **not engage a sub-processor** without prior specific or general written authorisation, and flow the same terms down
5. assist the controller in responding to **data subject rights requests**
6. assist with **security, breach notification and DPIAs** (Arts. 32–36)
7. **delete or return** all personal data at the end of the contract
8. make available information to demonstrate compliance and **allow audits and inspections**

([ICO: what needs to be included in the contract](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/contracts-and-liabilities-between-controllers-and-processors-multi/what-needs-to-be-included-in-the-contract/) — page blocked; contents confirmed via [ToS Lawyer](https://toslawyer.com/data-processing-agreements-explained-what-every-saas-company-needs-in-2026/) and [Yerman](https://yerman.uk/guide/data-processing-agreement-template-uk/))

**Audit rights (h) are the one small vendors get wrong.** Do not sign an unlimited on-site audit right for a £49/month customer. Standard mitigation: offer a written information response and/or a third-party report, cap audits to once per year, at the customer's cost, on reasonable notice.

**International transfers.** If your hosting, email, or monitoring sits in the US, you need a transfer mechanism — the UK IDTA or the UK Addendum to EU SCCs — plus a Transfer Risk Assessment. **The cheapest compliance move available to you is to host in the UK/EU** (Hetzner Germany/Finland, Supabase London region, Cloudflare). It removes a whole paperwork category and answers a question business customers do ask.

### 4.3 Breach notification

- **As controller:** notify the ICO **without undue delay and, where feasible, within 72 hours** of becoming aware, where there is a risk to individuals' rights and freedoms. The 72 hours run on calendar time including weekends. Phased reporting is explicitly permitted under Art. 33(4) — you do not have to finish investigating first. Late reports must explain the delay. Notify affected individuals where the risk is high. ([ICO personal data breaches guide](https://ico.org.uk/for-organisations/report-a-breach/personal-data-breach/personal-data-breaches-a-guide/), [Art. 33](https://gdpr-info.eu/art-33-gdpr/))
- **As processor:** notify your affected business customer **without undue delay** (Art. 33(2)). Their 72-hour clock generally starts when they become aware.
- **Always:** keep an internal breach log, including non-notifiable breaches. This is a legal requirement, and it is one text file.

**Contract negotiation point:** customers will push for 24- or 48-hour notification windows in the DPA. Negotiate to "without undue delay and in any event within 72 hours" — matching the statute you actually have to meet.

### 4.4 New for 2026 — the complaints duty (already live)

The **Data (Use and Access) Act 2025** amends UK GDPR. The main reforms took effect **5 February 2026**, and a new **statutory duty to handle data protection complaints applies from 19 June 2026** — which is already in force as of today. Organisations must provide an accessible route (including electronic) for individuals to complain, **acknowledge complaints within 30 days**, and manage them through a documented process. Individuals must now complain to you before escalating to the ICO. **There is no small-business exemption.** ([CMS legal update](https://cms.law/en/gbr/legal-updates/data-use-and-access-act-2025-new-statutory-rules-on-handling-data-protection-complaints-from-19th-june-2026), [Sage](https://www.sage.com/en-gb/blog/data-use-and-access-act-2025-need-to-know/))

The Act also relaxed cookie consent for statistical/analytics cookies, which may now operate on an opt-out basis ([Clym](https://www.clym.io/blog/data-use-and-access-act-2025-uk-cookie-consent-complaints)).

**Practical fix, one afternoon:** add a "Data protection complaints" section to your privacy policy with a dedicated email address, a stated 30-day acknowledgement, and a one-page written procedure you keep on file. Cost: £0. Cost of skipping it: a regulator-facing failure you cannot retro-fix.

### 4.5 What small SaaS vendors actually do

Honestly: the median micro-SaaS ships a template privacy policy, a template DPA available on request, hosts wherever is cheapest, and does not think about any of this until a customer's IT person asks. That is common, and it is a risk you carry silently until the day you do not. The minimum defensible position — and it costs under £150 and one weekend — is: ICO fee paid, template ToS + privacy policy + DPA published, sub-processor list published, EU/UK hosting, breach log started, complaints procedure documented, PI insurance in place, MFA on everything, automated backups tested by an actual restore.

---

## 5. Support burden and churn — the operational reality

### 5.1 How much support will 48 customers generate?

The published benchmarks are thin and mostly consumer-weighted. What exists: top-performing support organisations run about **0.5 tickets per user per month**; SaaS companies allocate roughly **8% of ARR to customer support**; cost per ticket for SaaS is **$18–35**, B2B enterprise $30–60 ([Fullview](https://www.fullview.io/blog/support-stats), [Lorikeet](https://www.lorikeetcx.ai/articles/customer-service-cost-per-ticket)). Founder-blog claims of "1–2 hours daily at 100 users" or "30 minutes a day at 10–200 customers" are anecdotal marketing content and should be weighted very low.

A defensible estimate for a simple B2B tool: **0.2–0.5 tickets per customer per month**, so **10–25 tickets/month at 48 customers**, at ~15 minutes each including context-switching = **3–6 hours per month**. That is manageable.

**The ticket count is not the burden. These are:**

- **Onboarding concentration.** The first 30 days of each customer generate most of their lifetime contact. Roughly **70% of churn happens in the first 90 days**, and companies with time-to-first-value under 7 days see materially lower churn ([ChurnCost benchmarks](https://churncost.com/b2b-saas-churn-benchmarks-2026)). At a steady 3 new customers/month you are always onboarding someone.
- **Incidents.** One outage that breaks a business workflow generates a burst of contact plus trust damage plus, potentially, churn.
- **Always-on-ness.** You cannot take a holiday without cover. This is the cost that appears on no spreadsheet and is the most common reason solo founders sell or abandon.
- **Sales time.** At £49/month with a ~20-month lifetime, gross LTV is ~£980. You can afford a 30-minute demo. You cannot afford a 3-call sales process. Design the product to sell itself or the unit economics of your time collapse.

**Mitigations that actually work at this scale:** a shared inbox with 3–4 canned replies, a five-page knowledge base, a published 1-business-day response commitment, and — most importantly — **choosing an idea with no real-time or 24/7 expectation.** Async tools (reports, scheduling, reconciliation, document generation) generate far less out-of-hours pressure than anything customers use live with their own clients.

### 5.2 Churn — the arithmetic that decides whether this works

Monthly logo churn benchmarks for B2B SaaS: **SMB 3–5%**, mid-market 1.5–3%, enterprise 1–2%, best-in-class under 1%; one 2026 dataset puts the B2B median at **3.5% monthly** with top quartile under 1.2% ([Vitally](https://www.vitally.io/post/saas-churn-benchmarks), [ChurnCost](https://churncost.com/b2b-saas-benchmarks-2026), [Lighter Capital](https://www.lightercapital.com/blog/2025-b2b-saas-startup-benchmarks)). At £49/month selling to micro-businesses, plan for the **upper end: 4–6% monthly**.

**The key insight, and the most useful arithmetic in this report:**

> Your target is not "get 48 customers." It is **"sustain an acquisition rate of ~2.5–3 new customers per month against 4–6% monthly churn, indefinitely."**

Equilibrium customer count = (gross new customers per month) ÷ (monthly churn rate).

| New customers/month | Churn 3% | Churn 5% | Churn 7% |
|---|---|---|---|
| 2 | 67 (£3,283) | 40 (£1,960) | 29 (£1,421) |
| 3 | 100 (£4,900) | 60 (£2,940) | 43 (£2,107) |
| 4 | 133 (£6,517) | 80 (£3,920) | 57 (£2,793) |
| 5 | 167 (£8,183) | 100 (£4,900) | 71 (£3,479) |

*(equilibrium customers, and monthly revenue at £49)*

To hold £2,335/month at £49 you need equilibrium ≥48, which at 5% churn means **≥2.4 new customers every month, forever.** Miss a month of marketing and you go backwards. If acquisition stops entirely, revenue halves in **ln(2)/0.05 ≈ 14 months**.

**Time to reach 48 customers**, from N(t) = (a/c)(1 − e^(−ct)):

| Gross new/month | Churn 5% | Churn 3% |
|---|---|---|
| 3 | 32 months | 19 months |
| 4 | 18 months | 13 months |
| 5 | 13 months | 10 months |

**And that clock starts on the day you get your first customer, not the day you start building.** Add 3–9 months for build, discovery, and first sale.

**The £99 route is materially easier.** 24 customers at £99 with 3.5% churn needs only 0.84 replacements/month, gross LTV is ~£2,829 (nearly 3× the £49 case), and higher ACV correlates with lower churn. It buys you a longer sales cycle in exchange, but the retention maths is far more forgiving. **If the product can credibly be sold at £99, sell it at £99.**

---

## 6. Base rates — the blunt section

### 6.1 Why the data is bad

There is **no rigorous, representative dataset** on micro-SaaS outcomes. Everything available is survivorship-biased by construction:

- **MicroConf State of Independent SaaS** surveys people who already identify as SaaS founders and follow a conference brand. Its 2025 conference cohort reported 28% of 230 founders above $100K MRR — a number that tells you about MicroConf attendees, not about founders ([MicroConf](https://microconf.com/state-of-indie-saas) — blocked; figures via search).
- **Indie Hackers milestone data** counts people who self-report revenue milestones — it excludes failures by definition.
- **Billing-platform reports** (Freemius and similar) sample products that already have paying customers and billing infrastructure.

None of these count the person who built for six months, launched, got no customers, and quietly stopped. That population is large and invisible.

### 6.2 What the biased data nonetheless says

- **~70% of independent SaaS products earn under $1,000 MRR** (~£790); ~18% sit in $1K–$5K ([Freemius State of Micro-SaaS 2025](https://freemius.com/blog/state-of-micro-saas-2025/) — blocked, via search; corroborated by [SaaSRanger](https://saasranger.com/blog/micro-saas-revenue-reality-what-1000-founders-actually-earn/))
- **Median micro-SaaS revenue is ~$500/month** (~£395) across a 1,000+ product study ([rockingweb analysis](https://www.rockingweb.com.au/micro-saas-revenue-analysis-2025/))
- **Median profitable micro-SaaS ~$4.2K MRR** — i.e., conditional on crossing into profitability at all
- **Median time to first paying customer: ~3 months**
- **Median time to $1,000 MRR: 8 months** in one dataset (25th percentile 5 months, 75th percentile 12 months); other sources say 12–18 months ([Indie Hackers analysis](https://www.indiehackers.com/post/it-takes-5-months-to-reach-1k-in-mrr-491742f806) — blocked, via search; [SaaSRanger](https://saasranger.com/blog/micro-saas-revenue-reality-what-1000-founders-actually-earn/))
- **~70% of indie products never break $1,000/month at all**

### 6.3 Positioning your target honestly

£2,335/month ≈ **$2,950 MRR**. That is:

- roughly **3× the $1,000 threshold that ~70% of launched products never cross**
- roughly **6× the $500 median**
- inside the **top 20–25% of products that already have revenue** — and those datasets exclude everything that never launched, never charged, or was abandoned

**My honest estimate of P(reach £2,335/month | a first-time non-technical founder starts building today): single digits — I would say 3–10% with genuine distribution advantages (existing audience, industry relationships, direct access to buyers), and materially lower without.** Label this as my estimate, not a measurement. No dataset supports a precise number, and anyone who gives you one is guessing with more confidence than the evidence permits.

**Realistic timeline in the success case: 18–36 months from today, not months.** "First paying customers within months" is achievable and consistent with the median 3-month-to-first-dollar figure. "£2,335/month within months" is not supported by any dataset I found.

### 6.4 What AI changes, and what it does not

Claude doing 100% of the building removes build cost and build time. It does **not** remove: customer discovery, distribution, trust-building, support, or churn. **Every base rate above is dominated by the non-build parts.** The dominant failure mode of micro-SaaS is not "couldn't build it" — it is "built something nobody would pay for" and "had no repeatable way to reach buyers."

There is also a second-order effect that cuts against you: cheap AI-assisted building lowers the barrier for everyone, so obvious niches commoditise faster and competitors appear sooner. The defensible asset in this business is your domain access and relationships, not your code.

---

## 7. Compliance checklist

**Before your first paying customer**
- [ ] Register as sole trader with HMRC (free) — or incorporate (£100)
- [ ] Open a free business bank account (Starling / Mettle / Tide)
- [ ] Pay the ICO data protection fee — **£47 by direct debit**, tier 1
- [ ] Publish Terms of Service, Privacy Policy, and Sub-processor list
- [ ] Have a DPA ready to send on request (Art. 28(3) contents — §4.2)
- [ ] Add a data protection complaints route + 30-day acknowledgement (mandatory since 19 June 2026)
- [ ] Buy professional indemnity, £1m cover (~£150–350/year)
- [ ] Host in UK/EU regions to avoid international transfer paperwork
- [ ] Start a breach log file
- [ ] Enable MFA on every account; set up and **test-restore** automated backups

**Before customer #10**
- [ ] Cap liability in your ToS at 12 months' fees; exclude indirect loss
- [ ] Publish a status page and a support response commitment
- [ ] Build a one-click customer data export (satisfies DPA obligation (g) and reduces churn friction)
- [ ] Consider Cyber Essentials (~£300–400 + VAT, unverified) — includes £25k cyber liability
- [ ] Get a solicitor to review your ToS + DPA once (£500–1,500)

**Watch-outs by threshold**
- [ ] **£90,000 rolling 12-month turnover** → UK VAT registration within 30 days
- [ ] **Any B2C sale to an EU consumer** → EU VAT from the first transaction; register for Non-Union OSS or use an MoR
- [ ] **~£40,000 profit** → revisit incorporation
- [ ] **April 2028, if sole trader with gross income >£20,000** → Making Tax Digital for Income Tax; quarterly digital updates. (Limited companies are out of scope.)
- [ ] **First mid-market prospect** → they will ask for SOC 2. You will not have it. Decide now whether that market is yours.

---

## 8. Gaps and what I could not verify

**Proxy-blocked primary sources.** stripe.com, ico.org.uk, developers.cloudflare.com, microconf.com, indiehackers.com, lemonsqueezy.com, freemius.com. Every price and fee taken from a secondary source is flagged inline and **must be re-verified on the vendor or regulator page** before you rely on it financially.

**Specific unverified figures:** Cyber Essentials certification price band for a micro-business (~£300–400 + VAT is from memory, not a source found today); exact Hetzner backup pricing; whether Paddle's undisclosed 3-month-processing-history requirement is a firm policy or an inconsistently applied one; current Anthropic consumer subscription pricing beyond the tier structure.

**Support-burden evidence is weak.** The published per-customer ticket ratios are consumer-weighted and the founder-blog claims are marketing content. My 0.2–0.5 tickets/customer/month estimate is inference, not measurement.

**Base rates are the weakest section and I have said why in §6.1.** No representative dataset exists. All published figures are survivorship-biased. My 3–10% probability estimate is judgement, not evidence.

**Not covered here, and worth separate research:** the actual mechanics of customer acquisition for a non-technical UK founder selling B2B at £49–99 (this is the binding constraint and this report deliberately does not address it); pricing psychology at the £49 vs £99 boundary; and whether any specific niche has enough buyers reachable without paid acquisition.

**FX assumption:** all USD/EUR conversions use $1 = £0.78 and €1 = £0.85. Rates move; vendor prices denominated in USD will drift in GBP terms.

## OPPORTUNITIES SURFACED
This dimension does not surface product ideas directly — it surfaces **constraints that eliminate whole categories of idea**, which is more valuable at this stage because it prunes the search space before any building happens. Five concrete implications:

**1. The SOC 2 wall defines the customer profile, and it is non-negotiable.** SOC 2 Type 2 costs $20,000-35,000 in year one and many mid-market RFPs treat it as a hard requirement. At £2,335/month that is unreachable, so the buyer must be a business with **no formal vendor-risk process**: sole practitioners, 1-10 person firms, trades, single-site operators, independent professionals. Who buys: the owner, personally, usually with a card, usually without involving anyone else. This is a filter to apply to every candidate idea on day one — if the buyer has a procurement function or an IT policy, the idea is dead at this price point regardless of how good it is.

**2. Sell B2B and UK-weighted, and you save ~£900/year and an entire compliance category.** The MoR-vs-Stripe analysis (§3.3) shows a Merchant of Record costs 3.2 percentage points of revenue to solve a VAT problem that a UK B2B business under £90k turnover does not have. B2C or EU-consumer sales flip this instantly — EU VAT is due from the first consumer transaction with no threshold. **This is a product-design constraint, not just a billing one:** a product that could plausibly attract individual consumers alongside businesses drags you into OSS registration or a 5.8% payment rate. Deliberately building something only a business would buy is worth roughly £900/year plus the avoided filing burden.

**3. Choose an idea with no real-time or out-of-hours expectation.** The support analysis shows ticket volume is manageable but always-on-ness is what breaks solo founders. Async categories — scheduled reports, reconciliation, document generation, compliance record-keeping, periodic data pulls — generate a fraction of the out-of-hours pressure of anything a customer uses live in front of their own clients. What they pay today: spreadsheets, a bookkeeper's hourly time, or a generic tool that does 20% of what they need. Why now: the Data (Use and Access) Act complaints duty (live since 19 June 2026) and MTD for Income Tax (£30k threshold April 2027, £20k April 2028) are both creating new, dated, mandatory record-keeping obligations for very small UK businesses — the exact buyer profile that clears the SOC 2 filter, with a deadline that supplies urgency.

**4. Price at £99, not £49 — the retention maths is roughly 3x better.** Gross LTV at £99 with 3.5% monthly churn is ~£2,829 versus ~£980 at £49 with 5% churn. At £99 you need 24 customers and ~0.84 replacements/month; at £49 you need 48 and ~2.4/month, forever. Higher ACV also correlates with lower churn in every benchmark set. The trade is a longer sales cycle, which is affordable when LTV supports a 30-45 minute conversation. **If a candidate idea cannot credibly carry £99/month, treat that as evidence the pain is not sharp enough, not as a reason to halve the price.**

**5. Host in the UK/EU from day one.** Hetzner (Germany/Finland), Supabase London, and Cloudflare remove the international-transfer paperwork category entirely — no IDTA, no UK Addendum, no Transfer Risk Assessment. It costs nothing extra (Hetzner CX22 is ~£3.70/month), and "your data stays in the UK" is a concrete answer to a question small business buyers genuinely ask. This is the cheapest credibility you can buy.

**The honest framing on the opportunity as a whole:** the cost structure is excellent (94% operating margin at target) and the compliance burden is real but bounded at roughly £450-900/year and one weekend of setup. Neither is the reason this fails. It fails on distribution, and the arithmetic that should drive the go/no-go decision is §5.2: can you name a specific channel that plausibly produces 2.5-3 new customers every month, indefinitely, without paid acquisition? If you cannot answer that for a candidate idea, the cost model in this report is irrelevant to it.

## KEY CLAIMS
- UK VAT registration threshold is £90,000 of taxable turnover on a rolling 12-month basis, frozen since 1 April 2024 and unchanged for 2026/27 — a £28,020/year business is well under it and need not register.
  SOURCE: https://commonslibrary.parliament.uk/research-briefings/sn00963/ and https://www.thp.co.uk/uk-vat-threshold-2026-a-complete-guide-for-growing-businesses/
- For B2B digital services to EU businesses the reverse charge applies — the customer accounts for VAT in their own country and the UK supplier registers nowhere in the EU. But for B2C digital services to EU consumers there is NO threshold: VAT is due from the first transaction and requires Non-Union OSS registration. This distinction determines whether a Merchant of Record is worth 3.2 percentage points of revenue.
  SOURCE: https://www.vatcalc.com/global/vat-on-cross-border-b2b-digital-services/ and https://avask.com/blog/vat-for-digital-services/
- Stripe UK charges 1.5% + 20p for UK domestic cards, 2.5% + 20p for EEA cards, 3.25% + 20p for non-European international cards, with a non-refundable £20 dispute fee. Stripe Billing adds a flat 0.70% of billing volume (Starter 0.5%/Scale 0.8% were consolidated in July 2024). Total effective cost at 48 x £49/month UK-only: ~£61/month, or 2.6% of revenue.
  SOURCE: https://www.wearefounders.uk/stripe-fees-uk-2026/ and https://support.stripe.com/questions/changes-to-the-stripe-billing-starter-and-scale-plans?locale=en-GB (stripe.com proxy-blocked; secondary sources)
- Paddle charges 5% + $0.50 per checkout with no monthly fee, plus 2-3% FX margin if payout currency differs from sale currency. At 48 x £49/month this is ~£137/month vs ~£61 on Stripe direct — a £900/year premium for VAT handling a UK B2B micro-business under £90k does not need.
  SOURCE: https://dodopayments.com/blogs/paddle-fees-explained
- Paddle operates an approval model and has rejected applicants for not having ~3 months of prior payment-processing history — a requirement not disclosed on their site. A brand-new UK micro-business may not be accepted, so billing architecture should not depend on Paddle before approval.
  SOURCE: https://fungies.io/paddle-review-2026/
- Stripe Managed Payments (Stripe's own Merchant of Record, built from the Lemon Squeezy acquisition) charges 3.5% ON TOP of standard Stripe Payments fees — ~6.4% + 30c domestic, 8-10%+ on international cards with conversion — and as of mid-2026 is primarily available to US-based businesses. It is not a realistic default for a UK micro-business.
  SOURCE: https://tiun.io/blog/cost-of-stripe-managed-payments-2026 and https://dodopayments.com/blogs/stripe-managed-payments-fees-explained
- The ICO data protection fee is £52 (tier 1: turnover ≤£632,000 or ≤10 staff), £78 (tier 2), £3,763 (tier 3), each reduced by £5 for direct debit. There is no small-business or sole-trader exemption — the test is what you do with personal data. Non-payment can attract a fine up to £4,350. A SaaS vendor is a controller of its own customer/billing/support data, so must pay.
  SOURCE: https://ico.org.uk/for-organisations/data-protection-fee/data-protection-fee/ (blocked) — figures via https://www.1stformations.co.uk/blog/ico-data-protection-fee/ and https://legalvision.co.uk/data-privacy-it/data-protection-register/
- The Data (Use and Access) Act 2025 imposes a statutory data-protection complaints duty from 19 June 2026 — already in force. All organisations processing personal data must provide an accessible electronic complaints route and acknowledge complaints within 30 days, with no small-business exemption. Individuals must complain to the business before escalating to the ICO.
  SOURCE: https://cms.law/en/gbr/legal-updates/data-use-and-access-act-2025-new-statutory-rules-on-handling-data-protection-complaints-from-19th-june-2026
- A UK GDPR Article 28(3) DPA must specify subject matter, duration, nature and purpose of processing, types of personal data and categories of data subject, plus eight processor obligations: documented instructions only, staff confidentiality, Art.32 security, sub-processor authorisation with flow-down, assistance with data-subject rights, assistance with breach notification and DPIAs, deletion/return at end, and audit/inspection rights.
  SOURCE: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/contracts-and-liabilities-between-controllers-and-processors-multi/what-needs-to-be-included-in-the-contract/ (blocked) — contents confirmed via https://toslawyer.com/data-processing-agreements-explained-what-every-saas-company-needs-in-2026/
- Breach duties: as controller, notify the ICO without undue delay and where feasible within 72 calendar hours (phased reporting permitted under Art.33(4)); as processor, notify your business customer without undue delay under Art.33(2). Business customers commonly push for 24-48h contractual windows — negotiate to match the 72-hour statutory standard.
  SOURCE: https://ico.org.uk/for-organisations/report-a-breach/personal-data-breach/personal-data-breaches-a-guide/ and https://gdpr-info.eu/art-33-gdpr/
- UK dividend tax rose two percentage points on 6 April 2026 (basic 8.75%→10.75%, higher 33.75%→35.75%), pushing the sole-trader-vs-limited-company break-even up to roughly £40,000-50,000 profit once £800-1,500/year of extra accountancy is netted off. At ~£25-28k profit, sole trader is simpler and roughly tax-neutral; incorporate for liability protection, not tax.
  SOURCE: https://www.icaew.com/insights/tax-news/2025/nov-2025/budget-taxes-on-property-savings-and-dividends-increased and https://uktaxdrag.co.uk/sole-trader-vs-limited-company-uk-2026-27.html
- Companies House fees rose on 1 February 2026: digital incorporation £50→£100, confirmation statement £34→£50, same-day digital £78→£156.
  SOURCE: https://www.1stformations.co.uk/blog/companies-house-filing-fees-increase/
- Making Tax Digital for Income Tax applies to sole traders with qualifying (gross) income over £50,000 from April 2026, over £30,000 from April 2027, and over £20,000 from April 2028 — so a £28k-turnover sole trader is caught from April 2028 and must file quarterly digital updates with a points-based penalty regime (£200 at four points). Limited companies are out of scope, which is an under-appreciated argument for incorporating.
  SOURCE: https://www.fsb.org.uk/resources/article/making-tax-digital-2026-deadlines-rules-and-more-MCQVRXUNIJC5EQRAZBQ7DFJNGYMA and https://www.icaew.com/technical/tax/tax-faculty/taxguides/2025/taxguide-04-25
- Professional indemnity for UK software developers is cheap: Simply Business reports 10% of software developers paid £92.11 or less per year for up to £1m cover (Oct 2025-Mar 2026). Cyber liability is separate at £350-£5,000/year for small businesses (~£175 for minimal-exposure micro-businesses), with MFA, EDR, backups and Cyber Essentials now standard underwriting prerequisites.
  SOURCE: https://www.simplybusiness.co.uk/business-insurance/software-developers-insurance/ and https://getindemnity.co.uk/business-insurance/cyber/how-much-does-cyber-insurance-cost
- SOC 2 Type 2 first-year cost for a small-to-mid-size SaaS is $20,000-35,000, and many mid-market/enterprise RFPs treat it as a hard requirement; vendors report 10-30 hours per security questionnaire across 10-20 questionnaires a year. This is unaffordable at £2,335/month MRR and hard-caps the addressable market to businesses without a formal vendor-risk process.
  SOURCE: https://soc2-auditors.com/insights/soc-2-for-b2b-saas and https://www.konfirmity.com/blog/soc-2-customer-security-questionnaire
- B2B SaaS monthly logo churn benchmarks: SMB 3-5%, mid-market 1.5-3%, enterprise 1-2%; one 2026 dataset puts the B2B median at 3.5%/month with top quartile under 1.2%. Roughly 70% of churn occurs in the first 90 days. At £49/month to micro-businesses, plan for 4-6% monthly.
  SOURCE: https://www.vitally.io/post/saas-churn-benchmarks and https://churncost.com/b2b-saas-churn-benchmarks-2026
- Equilibrium customer count = gross new customers per month ÷ monthly churn rate. Holding 48 customers at 5% monthly churn requires ~2.4 new customers every month indefinitely; if acquisition stops, revenue halves in ~14 months. Reaching 48 customers takes ~18 months at 4 gross new/month and 5% churn, or ~32 months at 3/month — and that clock starts at first customer, not at first line of code.
  SOURCE: Derived from N(t) = (a/c)(1 − e^(−ct)) using churn benchmarks from https://churncost.com/b2b-saas-churn-benchmarks-2026 — arithmetic is mine, not a cited source
- Approximately 70% of independent SaaS products earn under $1,000 MRR (~£790); the median micro-SaaS earns ~$500/month across a 1,000+ product study; median time to first paying customer is ~3 months and median time to $1,000 MRR is 8-18 months depending on source. All of these datasets are survivorship-biased — they sample people who already identify as SaaS founders or already have billing infrastructure, and exclude everything that never launched or never charged.
  SOURCE: https://freemius.com/blog/state-of-micro-saas-2025/ (blocked) and https://www.rockingweb.com.au/micro-saas-revenue-analysis-2025/ and https://saasranger.com/blog/micro-saas-revenue-reality-what-1000-founders-actually-earn/
- £2,335/month ≈ $2,950 MRR — roughly 3x the $1,000 threshold that ~70% of launched products never cross, and ~6x the $500 median. It sits in the top 20-25% of products that ALREADY have revenue. My estimate of P(a first-time non-technical founder reaches this) is single digits: 3-10% with genuine distribution advantages, lower without. This is judgement, not measurement — no dataset supports a precise figure.
  SOURCE: Author's estimate, derived from the distributions in https://www.rockingweb.com.au/micro-saas-revenue-analysis-2025/ and https://saasranger.com/blog/micro-saas-revenue-reality-what-1000-founders-actually-earn/ — explicitly not a sourced statistic
- Realistic all-in running cost for a 20-50 customer UK B2B SaaS in 2026 is £75-140/month (3-6% of revenue at target): ~£25 infrastructure (Hetzner CX22 at ~£3.70, Neon or self-hosted Postgres, Resend free tier, Sentry free tier, Cloudflare free, domain), ~£61 Stripe fees, ~£50 amortised compliance. The AI coding subscription (£16 Pro to £156 Max 20x) is the largest single controllable line item and can exceed all infrastructure combined.
  SOURCE: Composed from https://vpsfor.dev/posts/hetzner-cx22-pricing-2026/, https://makerkit.dev/blog/saas/supabase-pricing, https://blog.vibecoder.me/email-service-pricing-resend-sendgrid-postmark, https://last9.io/blog/sentry-pricing/, https://www.superblocks.com/blog/claude-code-pricing

## GAPS
**Blocked primary sources.** The environment's egress proxy blocked stripe.com, ico.org.uk, developers.cloudflare.com, microconf.com, indiehackers.com, lemonsqueezy.com, and freemius.com. Every price, fee, and regulatory figure taken from a secondary source is flagged inline in the report. Confidence in these is moderate — the numbers were consistent across multiple independent secondary sources, which is corroboration but not verification. **Before committing money, re-check each figure on the vendor's or regulator's own page.** Highest-priority re-checks: Stripe UK card rates and Billing 0.7%, the ICO fee tiers, and Cloudflare Workers free/paid limits.

**Specific figures I could not verify at all:** Cyber Essentials certification price for a micro-business (I quoted ~£300-400 + VAT from memory and labelled it unverified); exact Hetzner backup add-on pricing; whether Paddle's reported 3-month-processing-history requirement is firm policy or inconsistently applied (single source, founder anecdote); current Anthropic consumer subscription pricing beyond the tier structure ($20 Pro / $100 Max 5x / $200 Max 20x came from secondary sources only).

**Support-burden evidence is genuinely weak — this is the softest quantitative section.** The published ticket-per-user benchmarks are consumer-weighted and vendor-published; the founder-blog claims ("1-2 hours daily at 100 users", "30 minutes a day at 10-200 customers") are content marketing with no methodology and I weighted them near zero. My estimate of 0.2-0.5 tickets per customer per month is inference from adjacent benchmarks, not a measurement. Treat the 3-6 hours/month figure as an order-of-magnitude guess. I have low confidence in it and moderate-to-high confidence only in the qualitative claim that ticket volume is not the real burden — onboarding concentration, incidents, and inability to take a holiday are.

**Base rates are the weakest section in the report and I want to be explicit about why.** There is no representative dataset on micro-SaaS outcomes and I do not believe one exists. Every source available samples on the dependent variable: MicroConf surveys conference-affiliated founders, Indie Hackers counts self-reported milestones, billing-platform reports sample products that already have revenue infrastructure. None counts the person who built for six months, launched, got nothing, and stopped. My 3-10% probability estimate for reaching £2,335/month is explicitly labelled as judgement in the report and should not be quoted as a statistic. If precision here matters to the decision, the honest answer is that the number is unknowable from public data, and the useful substitute is the churn/acquisition arithmetic in §5.2, which is deterministic given assumptions you can test cheaply.

**Deliberately out of scope, and it is the binding constraint.** This report says nothing about how a non-technical UK founder actually acquires B2B customers at £49-99/month without paid advertising or an existing audience. Every cost and compliance number here is comfortable; every base rate is dominated by distribution. If only one further research dimension gets commissioned, it should be that one — specifically, whether any candidate niche contains enough reachable buyers to sustain 2.5-3 new customers per month indefinitely, and through what channel.

**Also not covered:** pricing psychology at the £49 vs £99 boundary; competitive dynamics as AI-assisted building commoditises obvious niches; and the practical mechanics of migrating Stripe accounts and novating customer contracts on incorporation (I asserted it is "annoying but routine" without a source).

**FX risk.** All conversions use $1 = £0.78 and €1 = £0.85. USD-denominated vendor prices will drift in GBP terms; a 10% adverse move adds roughly £3-8/month to the infrastructure line and £8-16/month to a Max-tier AI subscription.