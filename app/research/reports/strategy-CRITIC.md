### Read this first

Four of the five reports are better than the average of this genre. P4's arithmetic (~1.4 in-vertical people inside a 15k-subscriber UK audience) is the single best piece of reasoning in the set and should be treated as settled. P2's correction of the "one accountant = 80 customers" fallacy is correct and important. I am not going to relitigate those.

My job is what is missing and what is wrong. Three things:

1. **A load-bearing legal premise shared by all five reports is materially wrong**, and it is the premise that produces P5's decisive kill.
2. **The single largest structural fact about this founder's situation was noticed by nobody**: US Eastern business hours *are* UK evenings. The constraint that P5 calls arithmetically closed is a self-imposed geographic choice.
3. **The odds are anchored**, visibly and in a documentable way, on a number supplied in the prompt.

---

## 1. THE CLAIM MOST LIKELY WRONG

### "PECR bars cold-emailing sole traders/partnerships (~63% of UK businesses) without consent"

The *law* is stated correctly. The *market arithmetic* built on it is wrong by roughly a factor of four, and it is the foundation of P5's verdict.

**What is true:** PECR reg. 22 reaches only "individual subscribers"; ICO treats sole traders and non-LLP partnerships as individual subscribers, so they need consent. Corporate subscribers (limited companies, LLPs, PLCs, and public bodies) can be cold-emailed without consent provided you identify yourself and offer opt-out ([ICO guidance on PECR electronic mail rules](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-direct-marketing-using-electronic-mail/how-do-we-comply-with-the-pecr-electronic-mail-marketing-rules/); [marketinggraham UK B2B email law guide](https://www.marketinggraham.com/uk-b2b-email-marketing-laws/)).

**Where the 63% comes from:** ONS's *total* business population. At the start of 2025 there were ~5.7m UK private-sector businesses; 3.2m sole proprietorships (57%), 368,000 ordinary partnerships (6%), 2.1m companies (37%) — and **4.3m (75%) of the total have no employees at all** ([ONS via FSB/House of Commons Library summaries](https://commonslibrary.parliament.uk/research-briefings/sn06152/)).

**Why that denominator is the wrong one.** A business with no employees and no VAT/PAYE registration is not a plausible £79–99/month software buyer. The right denominator is registered businesses. ONS *UK Business: Activity, Size and Location 2025* (IDBR extract, 14 March 2025, released 24 Sept 2025): there were **2.73m VAT and/or PAYE-registered UK businesses, of which companies and public corporations are 76.7% and sole proprietors plus partnerships are 19.8%** ([ONS 2025 bulletin](https://www.ons.gov.uk/businessindustryandtrade/business/activitysizeandlocation/bulletins/ukbusinessactivitysizeandlocation/2025); the ons.gov.uk domain is egress-blocked to me — this figure came back identically from two independent search extracts and must be verified in a browser before it is acted on).

**So: PECR closes ~20% of the addressable UK market, not 63%.** Roughly **2.1 million UK businesses can legally be cold-emailed today**, and they are disproportionately the ones with revenue.

**Why this matters more than it looks.** P5's decisive reason is: *"the only distribution channel still open… is business-hours B2B phone and in-person selling."* That sentence is false, and P5 applies a **×0.6 multiplier** for "evenings-only versus a business-hours-only open channel" on the strength of it. Remove the false premise and P5's own arithmetic moves from 2% to ~3.3% before anything else changes.

Run the corrected email arithmetic honestly. 2026 benchmarks: overall cold reply ~3.43%, down from 5% in 2025 and 8.5% in 2019; **positive** reply 0.5–2%, 5% exceptional ([Instantly 2026 benchmark report](https://instantly.ai/cold-email-benchmark-report-2026), [EmailBison SaaS cold email 2026](https://emailbison.com/blogs/cold-email-saas-startup), [Amplemarket benchmarks](https://www.amplemarket.com/blog/cold-email-benchmarks)). At 40 emails/day to UK limited companies (well under the 5,000/day "bulk sender" threshold that triggers Google/Microsoft/Yahoo enforcement — [Red Sift bulk sender checklist](https://redsift.com/guides/bulk-email-sender-requirements)), that is ~800/month, ~14,400 over 18 months, ~144 positive replies at 1%. Convert 10–15% and that is **14–22 customers**. Not target, but not zero — and it is *asynchronous*, which is the whole point: it runs in the founder's actual hours.

This does not rescue the £79–99 SaaS plan on its own. It does destroy the claim that the plan is *structurally* closed, and it should be running in parallel with whatever else is chosen, because its marginal cost is a £10 domain and ~£14/month for a mailbox.

### Two smaller claims that are also wrong

**"Paid ads CAC £200–600 makes it unaffordable."** Wrong category of objection. At £99/month with the repo's own 5%/month churn assumption, average customer life is ~20 months and gross LTV ≈ £1,980. CAC of £400 is an LTV:CAC of ~5:1 with ~4-month payback. That is a *good* business, not an unaffordable one. The real objections are (i) you cannot buy traffic before you have a converting offer, and (ii) it needs float. Both are addressable: **Start Up Loans lend £500–£25,000 per person, unsecured, at 7.5% fixed from 6 April 2026 (up from 6%), for businesses trading up to 60 months, usable for marketing** ([British Business Bank / Start Up Loans FAQ](https://www.startuploans.co.uk/support-and-guidance/frequently-asked-questions/changes-to-interest-rate-and-eligibility), [Business Expert 2026 review](https://www.businessexpert.co.uk/business-loans/british-business-bank-start-up-loans-review/)). £25k funds ~60 acquisitions at £400. "Closed channel" should be reclassified as "financeable channel, gated on proving conversion first."

**P3's "accountability doesn't compile into software" is over-clever and internally inconsistent.** P3's own evidence shows productised services *do* become software (Mailchimp, Typeform, Freshworks), then explains them away with "the founders were technical." But P3's stated premise is that Claude removes the technical constraint. You cannot accept free unlimited build capacity as a premise and then use *the founders could build* as the discriminating variable. Either the premise is real, in which case the historical objection dissolves, or it is not, in which case every path here is mispriced. P3 wants it both ways.

---

## 2. WHAT WAS NOT CONSIDERED AT ALL

### OMISSION A — GEOGRAPHY. **US Eastern business hours are UK evenings.** (the big one)

Every one of the five reports treats "UK" as a fixed parameter. Nobody questioned it, and it is the parameter doing the most damage.

**The arithmetic, which is not in dispute:** US Eastern is UK minus 5 hours year-round (both observe DST, near-synchronously). US Pacific is UK minus 8.

| Founder's stated availability | US Eastern | US Pacific |
|---|---|---|
| Weekday 17:00–22:00 UK | **12:00–17:00** | **09:00–14:00** |
| Weekday 19:00–21:00 UK | 14:00–16:00 | 11:00–13:00 |
| Saturday 09:00–13:00 UK | 04:00–08:00 (dead) | 01:00–05:00 (dead) |

**That is 25 hours per week of prime, mid-afternoon US business-hours calling time, sitting entirely inside the hours the founder already has.** Compare P3's UK plan, which explicitly scavenges 07:00–08:00, a 45-minute lunch, 17:30–18:30 and Saturday mornings for roughly 10 usable hours — and which had to pick contractors *specifically because* they answer phones outside office hours. The US shift produces ~2.5x the calling capacity and removes the need to constrain the niche to trades who answer at 7am.

**The legal position is also strictly better, in both channels:**

- **Email.** CAN-SPAM requires *no prior consent* for commercial email, B2B or B2C. The obligations are honest headers, honest subject line, ad disclosure, physical postal address, working opt-out, prompt processing, and monitoring anyone you hire. Penalties up to $53,088 per email under the FTC's 2026 inflation adjustment ([Mailmeteor 2026 guide](https://mailmeteor.com/cold-email/is-it-legal), [Mailshake 2026 compliance guide](https://mailshake.com/blog/cold-email-compliance/)). There is no US equivalent of the sole-trader carve-out. **The entire US small business population is legally emailable.**
- **Phone.** B2B calls to business landlines are generally exempt from the federal National Do Not Call Registry, which applies primarily to residential numbers ([Cove Law](https://covelaw.com/b2b-calls-exemptions-the-dnc-list/), [DoNotCallProtection B2B guide](https://www.donotcallprotection.com/blog/business-to-business-b2b-do-not-call-compliance)). Calling window is 8am–9pm *local* time — 12:00–17:00 ET is comfortably inside. **Two hard carve-outs:** calls to a decision-maker's personal mobile are *not* exempt, and **Florida, Oklahoma, Washington and Maryland have mini-TCPA statutes with no B2B exemption** — exclude those four states from the list, which costs about 10% of the market and is a trivial filter.
- **Market size.** ~36.2m US small businesses on the SBA-derived count ([SellersCommerce 2026](https://www.sellerscommerce.com/blog/small-business-statistics/)) against 2.73m UK registered businesses. Even restricting to US employer firms (~6m), that is roughly 3–6x the addressable pool.
- **Tax friction is nil at this scale.** US state sales-tax economic nexus is most commonly $100,000 of sales *per state* ([TaxCloud 2026 nexus chart](https://taxcloud.com/blog/sales-tax-nexus-by-state/), [Avalara: US nexus for UK businesses](https://www.avalara.com/blog/en/europe/2026/05/sales-tax-nexus-for-uk-problems.html)). £2,335/month is ~$35k/year *total*. No state is reached. Stripe UK accepts USD. This is a non-issue until roughly 30x the target.

**Now the honest case against, because this is not a magic bullet.**

1. **There is no price arbitrage.** I looked for it and the evidence points the other way: for developer-persona products, UK/Northern/Western European buyers pay **20–30% more** than US counterparts, and Nordic customers pay 28% more than US prices ([Monetizely: Europe vs USA SaaS pricing](https://www.getmonetizely.com/articles/europe-vs-usa-adapting-your-saas-pricing-to-regional-expectations), [SBI Growth 2025 State of SaaS Pricing](https://index.sbigrowth.com/hubfs/2025_StateofSaaS_Pricing2_v4%20(1).pdf)). The US thesis rests on **channel access and market size, not willingness to pay.**
2. **Do not believe the SMB software-spend statistics.** The widely-cited "$121,336/year on software for companies with 0–20 employees" and "$156 per user per month" figures come from Cledara, a SaaS spend-management vendor whose customer base is venture-backed tech companies ([Cledara 2025 Software Spend Report](https://www.cledara.com/blog/2025-software-spend-report), via [Medha Cloud SMB IT spending stats](https://medhacloud.com/blog/smb-it-spending-statistics-2026)). A six-person landscaping company in Ohio does not spend $121k/year on software. **Treat these as unusable.** I flag this because the founder's process values evidence hygiene and this particular statistic will show up in every optimistic write-up he reads.
3. **The swarm is denser, not thinner.** The US is where AI-clone building is most concentrated. Kill mechanism (a) gets *worse*.
4. **The in-person channel is deleted entirely.** P5's "visit them on a Saturday" and P3's "meet the contractor at the yard" are the highest-trust moves available to an unknown vendor, and the US path removes both. This is a real, uncompensated loss.
5. **First-sale credibility is worse.** A UK sole trader with no US customers, no US references, no US address beyond a mail-forwarding line. Reference-selling only starts working from customer 3.

**Net:** the US shift converts P5's decisive kill from *structural* to *solvable*. It buys ~2.5x usable selling hours, ~3–6x addressable businesses, and full email legality, at the cost of the in-person fallback and any local-trust advantage. It is a **channel-capacity unlock, not a demand unlock** — and channel capacity is precisely what the founder's own diagnosis (d) says is binding.

One clean corollary that kills a tempting alternative: **Australia and New Zealand are time-zone-fatal.** AEST is UK+9/10; UK 18:00 is 03:00–04:00 in Sydney. Ireland and the EU are the same hours as the UK, so they add market but not hours. **North America is the only large English-speaking market whose business hours coincide with this founder's free hours.** That is not a preference, it is a fact about the Earth, and it should drive the decision.

### OMISSION B — BUY THE REVENUE INSTEAD OF BUILDING IT

P5 mentions "buying a £500–700/month micro-SaaS" in one line and moves on. It deserves more, because it is the only path where **day-one revenue is not zero** and where the binding activity is the one competence this founder has *demonstrated* — six months of structured, adversarial, source-checked research — rather than the one he has never once exercised.

**The market exists and is priced.** Bootstrapped SaaS under $1M ARR sells at an average **2.85x annual profit**, top-quartile 6.13x, and **deals under $100k close at just 1.68x profit**; Acquire.com's median profit multiple for 2024–25 is 3.9x ([Flippa 2026 M&A guide](https://flippa.com/blog/the-ultimate-guide-to-saas-mergers-and-acquisitions/), [Acquire.com biannual multiples report, Jan 2026](https://blog.acquire.com/acquire-com-biannual-acquisition-multiples-report-jan-2026/)). Micro-SaaS commonly transacts at **25–40x MRR** ([mediafa.st 2026 valuation guide](https://www.mediafa.st/how-to-sell-your-micro-saas)). So **£1,000/month MRR costs roughly £25,000–40,000**, and something at £700/month at the low multiples that apply to sub-£100k deals can go for **£15,000–20,000**.

**The financing exists.** £25,000 per person, unsecured, 7.5% fixed, usable for acquisition ([Start Up Loans](https://www.startuploans.co.uk/support-and-guidance/frequently-asked-questions/changes-to-interest-rate-and-eligibility)). Seller notes and earnouts are standard on these platforms.

**The arithmetic that makes this interesting.** Buy a book at £1,000–1,400/month. That is **43–60% of target on completion day**, with zero customers acquired by the founder. The remaining gap is 8–14 more customers over 18 months — and, critically, you now have existing customers to interview, an existing acquisition channel to measure, and referenceable logos. Every one of the eight kills was a distribution kill. This buys distribution that already works.

**The stronger sub-variant nobody named: buy a recurring *service* book, not a SaaS.** Website-maintenance-and-hosting books, small payroll bureaux, small IT-support books. They trade cheap (owner is bored, not growing), the delivery is exactly the kind of repetitive work Claude collapses, and no licence is required — unlike bookkeeping, where a practice sale generally needs a qualified, AML-supervised buyer, which this founder is not.

**The honest case against:**
- **Adverse selection is severe.** Good micro-SaaS sells privately to people the seller knows. What reaches a public marketplace has usually failed to sell elsewhere. The founder has no network, so he is confined to the adversely-selected pool.
- **Commercial diligence is hard and Claude cannot do the part that matters.** Claude can review code, infra, and dependencies competently. Claude cannot tell you whether the MRR is 40 customers or 4, whether the SEO traffic survived the last AI-Overviews shift, or whether the seller is exiting because a platform partner is about to shut them off. Insist on a live screen-share of Stripe and Google Analytics, not exports.
- **This is the only option that can end below zero**, with personal liability on £25k at 7.5%.
- **Eligibility risk to verify in week one:** Start Up Loans are pitched at businesses *trading up to 60 months*. Whether a newly-formed entity acquiring an established asset qualifies is not something I can settle from the search extracts. **Ask the lender before building any plan on it.**
- It also does not satisfy the mission brief as written. It buys a business; it does not build a product.

### OMISSION C — BESPOKE INTERNAL TOOLS WITH A RECURRING TAIL (the sleeper)

Nobody considered selling *bespoke* software to individual SMEs. UK bespoke development runs **£10,000–£500,000+**, with regional agency blended day rates of **£350–550** and London £600–900; median UK developer day rate ~£510 ([Red Eagle 2026 UK bespoke cost guide](https://redeagle.tech/blog/bespoke-software-cost-uk), [Hidden Brains 2026 UK cost guide](https://www.hiddenbrains.com/blog/software-development-company-in-uk-cost-guide.html)).

A solo non-technical operator with Claude can deliver in evenings what an agency quotes £12–20k for. Sell at £6–10k — a genuine, defensible discount rather than a suspicious one — plus **£300–500/month for hosting, support and changes**. Five or six such clients is the target, and the upfront fees fund the time.

Why it beats P3 on economics: revenue per client is 5–10x higher, the retainer is stickier than a service subscription (it is attached to a system they now depend on), and the first delivered project is a case study that makes sale two dramatically easier. Why it is harder: **a £8,000 decision from an unknown vendor is a much harder first sale than a £395/month one.** It also concentrates risk brutally — at six clients, losing one is −17% of revenue, a concentration risk that both P3 and P5 sell as an unalloyed benefit of "fewer customers" without pricing it.

### OMISSION D — CIVIC AND VOLUNTEER-RUN BUYERS (structurally elegant, arithmetically dead)

Parish councils, churches, grassroots sports clubs, small charities, PTAs, village halls. The structural fit is genuinely attractive and worth stating because it is seductive: the decision-maker is a **volunteer or part-time clerk who does the work in the evenings** — the same hours as the founder; contact details are published; parish councils and registered charities are corporate bodies, so PECR-clean; and they meet in the evening, so demos are easy.

**Price point kills it, decisively.**
- **10,000 parish and town councils in England** ([NALC](https://www.nalc.gov.uk/about/parish-and-town-councils.html)). Scribe Accounts — the category leader, **1,100 councils**, SLCC-listed — starts at **£12+VAT/month** ([Scribe](https://resources.scribeaccounts.com/scribe-acccounts-free-trial/)).
- **ChurchSuite** runs £15.50–£56/month depending on modules ([Capterra](https://www.capterra.com/p/122430/ChurchApp/pricing/)).
- Grassroots sport is worse: **Spond is entirely free**, monetising only on payment fees; Pitchero is £38/month for up to *20 teams* ([Spond vs Pitchero](https://www.spond.com/news-and-blog/spond-v-pitchero/)).

At £12–30/month you need **80–195 customers** to reach £2,335 — three to eight times the customer count of the plan that already failed eight times, sold to committee buyers spending public or donated money. And Spond being *free* is kill mechanism (b) — the state prices at zero — reappearing in a private-sector costume.

**One salvage worth taking:** this is the best available *rehearsal ground*. Parish clerks and club secretaries reliably answer emails from strangers and will talk in the evening. If the founder wants 20 low-stakes conversations with real buyers in two weeks to find out whether he can do this at all, this is where to get them cheapest. Use it as a training range, never as a market.

### Briefly dismissed, with reasons

- **Open-source then monetise.** Distribution is GitHub stars, which is a power-law lottery decided by a developer audience the founder does not have and cannot fake. Worse odds than Product Hunt, and it hands the swarm the source code.
- **B2C micro-tools.** App-store discovery is a power law; ASO and TikTok are full-time content jobs; and PECR/GDPR are *stricter* for consumers, not looser. Sub-1%.
- **Marketplaces / two-sided.** Cold-start problem × 2, with no network on either side. Sub-1%.
- **Becoming a platform implementer** (Xero advisor directory, HubSpot Solutions Partner, Monday/Airtable expert directories). This is the one dismissed item with any merit — a directory listing is a genuine inbound channel and it inverts kill #3 (instead of competing with GoHighLevel's resellers, become one). But it is a service business with thin margins, gated on certification, and it makes the founder a commodity in a directory of hundreds. It is a strictly worse version of Omission C. ~3%.

---

## 3. ARE THE ODDS CALIBRATED, OR ANCHORED?

**Anchored. Demonstrably, and in a way you can check.**

The prompt handed every agent the sentence *"Honest base rate accepted by the founder: single-digit to ~10% chance of success."* Four of five agents returned point estimates of **5%, 7%, 7%, 12%**. The fifth — the one explicitly tasked with arguing the null — returned 2%. That distribution is what anchoring looks like.

**The mechanism is visible in the text.** P1 runs a four-term chain, gets **2.4%**, and writes: *"I am rounding UP to ~7% rather than reporting 2.4%."* That is a **2.9x unexplained upward adjustment** landing precisely on the pre-supplied anchor. P2 does a softer version: chain yields 6–9%, headline 7%. The justifications offered (referral compounding; the outside view) may well be correct — but the correct response to "term three is too low" is to **raise term three and re-multiply, showing the new number**, not to override the arithmetic with a narrative. As written, both adjustments are un-auditable.

**Three genuine methodological errors, in both directions:**

1. **Correlated terms multiplied as if independent (biases DOWN).** In P1's chain, a founder who sustains 90 days of daily unpaid participation is *also* more likely to convert standing into customers and *also* more likely to grind to 24 customers. These are not independent draws; they are four measurements of one underlying trait. Multiplying correlated conditionals systematically understates. P1's 2.4% is too low for this reason. So P1 had a real problem — it just fixed it with a fudge instead of a correction.
2. **A stock statistic used as a flow probability (biases UP).** "18% of micro-SaaS sit in the $1k–5k band" is a snapshot of *currently existing* products. Dead products have exited the denominator. Using it as "18% of new products reach this band" overstates, and P5 half-notices this ("already survivorship-filtered") before using it anyway.
3. **The paths are priced as independent options; they are not.** Every chain contains a term of the form *P(founder sustains outbound selling)* at 0.35–0.50. It is the same term every time, it is the dominant term every time, and **it has never been measured** — five months of work, zero customer conversations. This means (a) you get almost no diversification from trying several paths, so max ≈ best single path rather than 1−∏(1−pᵢ), and (b) the correct decision is not *which path* but *measure the common term first*.

**One internal inconsistency worth naming.** P5's own table gives contracting/fractional at **"potentially 40%+"** — the highest number anywhere in the five reports — at £390–470/day for ~6 billed days a month. But contracting is *daytime* work. It is flatly incompatible with the evenings-and-weekends constraint that P5 uses to kill everything else. P5 never reconciles this. Either the constraint is soft (in which case every path is repriced upward and contracting probably wins outright) or it is hard (in which case P5's best option is not actually available and shouldn't headline the table). **This is the highest-value unresolved question in the entire five-report set, and it is answerable tonight.**

**Nobody priced partial success.** The modal non-zero outcome is £800–1,500/month, not £0 and not £2,335. Whether that outcome is worth having differs enormously by path — a half-built SaaS is worth nothing, three service retainers are worth £1,200/month and a year of paid industry knowledge, and a half-grown acquired book is a saleable asset. P3 alone gestures at this. It should be a column in the decision table, not a footnote.

---

## 4. THE ONE PIECE OF EVIDENCE TO GATHER IN TWO WEEKS

**Do the free thing first, tonight, before anything else.** P5's day-one work-history audit costs five minutes and, if it comes back positive, dominates every other option on this page by an order of magnitude. Write down the day job and the full work history and check it against UK contract rates. **But add the question P5 forgot: can the day job go to four days a week, or accommodate a day of contracting?** If yes, the constraint that killed eight concepts is soft and the entire analysis changes. If no, that is settled and you proceed below. Cost: zero. Time: one evening.

**Then, the two-week test. Measure the common term — the thing that appears as 0.35–0.50 in every chain and has never been observed.**

Not a survey. Not a waitlist. Not another niche. **Conversations with strangers.** Run two channels in parallel, both legal, both free or near-free, both inside the founder's actual hours:

**Channel A — asynchronous, UK, PECR-clean.** Build a list of 400 UK **limited companies** in any single trade using Companies House free bulk data and free API (SIC code + incorporation date + registered-office region), then their websites for a named contact. Companies are corporate subscribers, so cold email is legal with identification and one-click opt-out. Send **200 over two weeks** — 20/day from one warmed inbox, far below any bulk-sender threshold. Plain text, no design, no attachment. One question only: *"I'm trying to understand how firms like yours handle [specific monthly chore]. Would you spare 15 minutes? I'm not selling anything and I'll send you what I learn."* Zero pitch. Cost: ~£10 domain + ~£14 mailbox.

**Channel B — synchronous, US, in UK evenings.** Build 200 US SMB records in one trade from Google Maps (free), business landlines only, **excluding Florida, Oklahoma, Washington and Maryland**. Dial **150 between 17:00 and 21:00 UK** across ten weekday evenings — that is 12:00–16:00 Eastern, inside the 8am–9pm local window, DNC-exempt for B2B landlines. Cost: a VoIP number, ~£10.

**Log exactly three numbers and nothing else:**
1. **Conversations held** — 5+ minutes with a named owner or manager.
2. **Hours actually spent** — the real logged figure, not the planned one.
3. **How it felt on day 10 versus day 1** — one honest sentence. This predicts month 14 better than any of the above.

**Pre-commit to the decision rule now, in writing:**
- **Fewer than 5 conversations from 350 approaches** → the binding constraint is execution, not market selection. Every probability on this page should be divided by roughly 3, and the honest move is to stop looking for a ninth niche.
- **5–15 conversations** → the channel works, the term is ~0.4 as assumed, and path choice now genuinely matters. Proceed to the 90-day plan.
- **More than 15 conversations** → all five reports, mine included, have been systematically over-pessimistic. Go straight to the highest-price-point path (bespoke tools, Omission C) and stop analysing.

**Why this and nothing else.** Every other candidate test — validating a niche, testing willingness to pay, checking a competitor — is *downstream* of a term that has never been measured and that dominates every chain. Two weeks and £35 buys the single number that reprices the entire portfolio. Five months of desk research has not produced it, and no amount of further desk research will.

Channel B doubles as the cheapest possible test of the US-hours hypothesis. If the founder can hold thirty conversations a week at 6pm with American business owners, the constraint P5 called arithmetically closed was a map, not a territory.

---

## Verdict

BACK P3 AS CORRECTED — productised service, 6-8 clients at £395-800, sold by phone and legal cold email — but with the buyer chosen for TIME-ZONE REACHABILITY rather than UK-only, which in practice means North American SMBs called at 17:00-21:00 UK (= 12:00-16:00 US Eastern) as the primary channel, with legal cold email to UK limited companies running as a free parallel async channel.

The single decisive reason: US Eastern business hours ARE UK evenings — a fact none of the five analyses noticed, and the one that dissolves P5's decisive kill. P5 declared the path closed because "the only distribution channel still open is business-hours B2B phone and in-person selling" and the founder has no business hours. He has 25 hours a week of them; they are simply in a different country. Combined with the second correction — PECR closes ~20% of the addressable UK market, not 63%, because 76.7% of VAT/PAYE-registered UK businesses are companies (ONS 2025) — the two channels P5 called closed are both open, one synchronous and one asynchronous, both inside the founder's actual hours.

This is a correction to the constraint set, not a new idea. It does not fix demand, trust, or the swarm. It does not make the founder able to sell. It removes a false structural impossibility and replaces it with an ordinary, hard, measurable problem.

SECOND CHOICE, and genuinely close: BUY THE REVENUE (acquire a £1,000-1,400/month recurring service or micro-SaaS book with a Start Up Loan). It is the only path with non-zero revenue on day one — 43-60% of target at completion — and the only one whose binding activity is structured adversarial diligence, the single competence this founder has actually demonstrated over six months, rather than selling, which he has never once attempted. It carries real ruin risk (£25k personally liable) and fails the mission brief as written.

DEAD, and stay dead: civic/volunteer buyers (£12-30/mo price ceiling needs 80-195 customers), open-source, B2C micro-tools, marketplaces, Australia/NZ (time-zone-fatal), and the original 24-30-strangers-at-£79-99 SaaS plan.

## Odds

All numbers below share one dominant, never-measured term: S = P(founder sustains 12+ months of outbound selling on evenings/weekends alongside a job). I put S at 0.35-0.45 on the evidence available, which is six months of demonstrated *research* persistence — a different and far less aversive muscle — and zero observations of sales persistence. Because S is common to every path, THESE PROBABILITIES DO NOT ADD. Trying three paths does not give you 3x the odds; it gives you roughly the best single path plus a few points.

MY NUMBERS (point estimate, honest range):

- P3+ — productised service, £395-800/client, 6-8 clients, North-America-facing by phone in UK evenings plus legal UK cold email: **12% (8-17%)**. Chain: S 0.40 x P(finds a sellable offer within 2 attempts | selling) 0.55 x P(reaches 6-8 retained clients in remaining runway | offer found) 0.55 = 12.1%. The uplift over P3's own 12% for a harder-delivery geography is cancelled by 2.5x the usable calling hours; net, same number, arrived at differently.
- P3 as written — UK trades only, 7am/lunch/Saturday windows: **10% (6-14%)**. Slightly below P3's self-assessment. Its ~10 scavenged hours/week is the ceiling on everything downstream.
- Omission B — BUY THE REVENUE (acquire £1,000-1,400/mo book): **9% (5-14%)**. Chain: P(loan approved, eligibility confirmed) 0.65 x P(sources and completes a non-disastrous deal from an adversely-selected public pool) 0.28 x P(holds it and adds £900-1,300/mo in 18 months from an existing base) 0.50 = 9.1%. Distinct risk profile: only path that can end at −£25k, only path with revenue on day one, only path where the binding skill is one he has demonstrated.
- Omission C — bespoke internal tools, £6-10k + £300-500/mo retainer, 5-6 clients: **8% (5-13%)**. Best revenue per client and best EV of anything here; discounted because a £8,000 first sale from an unknown is a much steeper first hill than £395/month, and six-client concentration is brutal.
- P2 franchisor-mandate variant: **6% (3-10%)**. Below P2's 8-12%. A 9-18 month partner revenue lag against a 24-month clock with, by P2's own admission, no slack for a failed first partner.
- P4c hybrid (vertical first, sell from week one, list as by-product): **6% (3-9%)**. Below P4's 8-12%. A permission asset is worth a lot at 200 customers and very little at 25; the newsletter component mostly consumes the scarce resource (founder evenings) to relieve the abundant one.
- P1 community embedding: **5% (3-8%)**. P1's own chain gave 2.4% and its terms are positively correlated, so 2.4% is too low — but 7% is a fudge, not a correction. 5% is where the corrected chain lands if you raise the referral term honestly instead of overriding the product.
- Omission A applied to SOFTWARE rather than service (US-facing £99/mo SaaS): **5% (3-8%)**. Better channel, worse swarm, no in-person fallback, still needs 24-30 strangers.
- P1 as literal pain-mining: **3%**. Agree with P1.
- Civic/volunteer buyers: **2%**. Price ceiling is fatal.
- P5 null / current plan unchanged: **2-3%**. Agree with P5's conclusion, disagree with one of its three reasons.

AGGREGATE, which is the number that actually matters:
- P(founder reaches £2,335/month recurring by ANY route within 24 months, IF he starts selling or buying within 30 days and service/acquired revenue counts): **15% (10-22%)**.
- Same, if it must be SOFTWARE sold to 24-30 strangers: **4-6%**.
- Same, if the next three months look like the last five — desk research, no customer conversations, no money committed: **2%**, and falling, because the 24-month clock has not started and P5 is right that it starts at first revenue, not today.

CALIBRATION NOTE ON MY OWN NUMBERS: my top figure (12-15%) is above the 5-10% the founder has accepted, and I want to be explicit that this is NOT because I found something encouraging. It is one arithmetic correction (US hours = UK evenings, ~2.5x usable selling capacity) and one legal correction (PECR blocks 20% not 63% of the addressable market). Both are checkable in an afternoon. If either fails browser verification, subtract 3-4 points from every figure above. And all of it is conditional on S, which remains the largest number in every chain and has never been observed once in six months. Measure S before believing any of this.

## First 90 days

TONIGHT, BEFORE ANYTHING ELSE (two hours, £0)
1. Write down the day job and full work history. Check it against UK contract rates (BA ~£455/day, PM ~£470/day, market average ~£390/day). Then answer the question P5 left out: CAN THE DAY JOB GO TO FOUR DAYS, or accommodate occasional contract days? If yes, price that route properly before reading further — six billed days a month is the target, and it makes everything below optional.
2. Read the employment contract for IP-assignment and moonlighting clauses. An IP clause capturing work created during employment kills the software path and leaves the service path untouched. Twenty minutes.
3. Verify the ONS figure in a browser (link in gaps). If companies really are 76.7% of registered UK businesses, cold email to UK limited companies is legal and open, and P5's decisive kill is false.

DAYS 1-14 — THE TWO-CHANNEL CONVERSATION TEST (~£35 total, ~20 hours)
This is not niche validation. It measures the one term that appears in every probability chain in all six reports and has never been observed: whether this founder will hold conversations with strangers, repeatedly, in the evening, when it is unpleasant.

Channel A (async, UK, PECR-clean): 400 UK LIMITED COMPANIES in one trade from Companies House free bulk data (SIC code + incorporation + region), names from their websites. Buy one domain (~£10) and one mailbox (~£14/mo), warm it for four days, then send 20/day for ten days = 200 emails. Plain text. Your real name. One-click opt-out and your address in the footer. One question, zero pitch: "I'm trying to understand how firms like yours handle [specific monthly chore]. Would you spare 15 minutes? I'm not selling anything and I'll send you what I learn."

Channel B (sync, US, in UK evenings): 200 US SMB records in one trade from Google Maps. Business landlines ONLY. Exclude Florida, Oklahoma, Washington and Maryland (mini-TCPA, no B2B exemption). Get a VoIP number (~£10). Dial 150 between 17:00 and 21:00 UK across ten weekday evenings — that is 12:00-16:00 Eastern, inside the 8am-9pm local rule, DNC-exempt for B2B landlines. Same question, no pitch.

Log three numbers and nothing else: conversations held (5+ min, named owner/manager); hours actually spent; and one honest sentence about how it felt on day 10 versus day 1. That third one predicts month 14 better than the other two.

DAY 14 GATE — WRITE THIS DOWN NOW, BEFORE STARTING
- Under 5 conversations from 350 approaches: the constraint is execution, not niche selection. Divide every probability in every report by three. Stop looking for a ninth idea; that is not the problem and never was.
- 5-15 conversations: the channel works and the assumed 0.4 term holds. Proceed to days 15-90.
- Over 15 conversations: all six of us have been over-pessimistic. Skip straight to the highest-price-point path (bespoke tools at £6-10k + £400/mo) and stop analysing.

DAYS 15-45 — ONE OFFER, PRICED, SOLD BY VOICE (~45 hours)
4. Pick the single most-repeated chore from the day-1-14 conversations. Not the most interesting one — the most repeated one. Write it as one page: one outcome, one price, cancel anytime, first one free.
5. Price at £395-495/month if it is a recurring service, or £6,000-10,000 plus £400/month if it is a system they will depend on. Do not price at £79-99. Six to eight customers is a different business from twenty-five and it is the only structural change on offer.
6. Scale Channel B to 40 dials per evening, four evenings a week: 12:00-16:00 Eastern is the most productive B2B calling window that exists and it costs this founder nothing but his evenings. Keep Channel A running at 20 emails/day — it is nearly free and it is asynchronous.
7. Before spending money: PI insurance quote (~£150-300/yr), GoCardless or Stripe for direct debit, sole trader registration. No company, no logo, no website beyond one page with a name, a number and the offer.
8. WRITE NO PRODUCTION CODE. Deliver by hand with Claude behind the curtain. Log every minute.

DAYS 46-75 — FIRST MONEY, AND RUN THE ACQUISITION TRACK IN PARALLEL
9. Target: two paying clients by day 60, three by day 75. Free first delivery is the conversion mechanism and the only substitute for references you have.
10. In parallel, two evenings a week only: run the buy-the-revenue track as a hedge, because it is the one path that does not depend on selling. Call a Start Up Loans delivery partner and settle the acquisition-eligibility question. Set alerts on Acquire.com and Flippa for recurring-revenue businesses at £700-1,400/month. Have Claude do technical diligence on three of them as a dry run. Rule: NEVER accept exported figures — demand a live screen-share of Stripe and analytics. Do not commit money before day 90.
11. Ask every paying client for exactly two things: a written testimonial and one introduction. Referral converts at 15-25% to meeting versus 1.5-2% cold. That is how client four gets cheap.

DAYS 76-90 — HARD GATE
12. CONTINUE only if: 2+ clients paying real money; effective hourly rate above £25; 300+ approaches actually made; and you would honestly rather do another 90 days of this than not.
13. If 300+ approaches produced conversations but zero money: change the OFFER once, not the path. You get one such change.
14. If 300+ approaches produced fewer than 15 conversations: the founder-level constraint is confirmed. Move the effort to the acquisition track, where the binding activity is diligence rather than selling, and where six months of demonstrated structured adversarial research is directly transferable. That is not a consolation prize; on this evidence it may be the better fit.
15. Amend docs/APP_MISSION_BRIEF.md either way, with two changes: first milestone becomes £500/month from fewer than 10 customers, not £2,000 from 24-48; and a paying customer must precede production code, reversing the stage 1-6-then-7 ordering that produced five months and eight kills without a single buyer conversation.

DO NOT, IN THE FIRST 90 DAYS
Write production code. Register a company or buy a domain beyond the one outreach mailbox. Resume the YouTube channel — it consumes the same evenings and cannot run alongside this. Cold-email UK sole traders or partnerships (PECR); limited companies only. Call US personal mobiles, or any number in FL/OK/WA/MD. Announce anything as AI-built. Run a ninth concept-validation workflow — the last eight answered a question that was never the binding one.

## Key claims

- **Claim:** ONS UK Business: Activity, Size and Location 2025 (IDBR extract 14 March 2025, published 24 Sept 2025) reports 2.73m VAT/PAYE-registered UK businesses, of which companies and public corporations are 76.7% and sole proprietors plus partnerships are 19.8%. This means PECR's consent requirement closes ~20% of the addressable UK market, not the 63% cited in the framing — which counts 3.2m mostly non-employing, non-registered sole proprietorships that were never plausible £79-99/mo buyers. VERIFIED via two independent search extracts; ons.gov.uk is egress-blocked, so browser verification is required before acting.
  **Source:** https://www.ons.gov.uk/businessindustryandtrade/business/activitysizeandlocation/bulletins/ukbusinessactivitysizeandlocation/2025
- **Claim:** UK PECR reg. 22 reaches only individual subscribers; cold email to corporate subscribers (limited companies, LLPs, public bodies) requires no prior consent, only identification and a working opt-out. ICO treats sole traders and non-LLP partnerships as individual subscribers. VERIFIED.
  **Source:** https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-direct-marketing-using-electronic-mail/how-do-we-comply-with-the-pecr-electronic-mail-marketing-rules/
- **Claim:** US CAN-SPAM requires no prior consent for commercial email, B2B or B2C, with obligations limited to honest headers/subject, ad disclosure, physical address, working opt-out and prompt processing. Penalties up to $53,088 per email under the FTC's 2026 inflation adjustment. There is no US equivalent of the PECR sole-trader carve-out, so the entire US small business population is legally emailable. VERIFIED.
  **Source:** https://mailmeteor.com/cold-email/is-it-legal
- **Claim:** Under the TCPA, B2B calls to business landlines are generally exempt from the federal National Do Not Call Registry, which applies primarily to residential numbers; calling window is 8am-9pm recipient-local. Two hard carve-outs: calls to a decision-maker's personal mobile are NOT exempt, and Florida, Oklahoma, Washington and Maryland have mini-TCPA statutes with no B2B exemption. VERIFIED.
  **Source:** https://covelaw.com/b2b-calls-exemptions-the-dnc-list/
- **Claim:** US Eastern time is UK minus 5 hours year-round (both observe near-synchronous DST). The founder's weekday 17:00-22:00 UK window is 12:00-17:00 US Eastern and 09:00-14:00 US Pacific — approximately 25 hours per week of prime US business-hours selling capacity sitting entirely inside his stated availability, versus roughly 10 scavenged hours in P3's UK-only plan. Australia/NZ are time-zone-fatal (UK 18:00 = 03:00-04:00 Sydney); Ireland and the EU share UK hours and add market but no hours. North America is the only large English-speaking market whose business hours coincide with this founder's free hours. ARITHMETIC, not inference.
  **Source:** Time zone arithmetic; ET = UTC-4 (summer) / UTC-5 (winter), BST = UTC+1 / GMT = UTC
- **Claim:** US small business count is ~36.2 million on SBA-derived figures, against 2.73m UK VAT/PAYE-registered businesses — roughly 3-6x the addressable pool even restricting to US employer firms (~6m).
  **Source:** https://www.sellerscommerce.com/blog/small-business-statistics/
- **Claim:** There is NO price arbitrage in shifting to the US. Evidence points the other way: for developer-persona products, UK/Northern/Western European buyers pay 20-30% more than US counterparts, and Nordic customers pay 28% more than US prices. The US thesis rests on channel access and market size only.
  **Source:** https://www.getmonetizely.com/articles/europe-vs-usa-adapting-your-saas-pricing-to-regional-expectations
- **Claim:** The widely-cited SMB software-spend figures ($121,336/year for 0-20 employee companies; $156 per user per month) originate from Cledara, a SaaS spend-management vendor whose customer base is venture-backed tech companies. They do not describe typical SMBs and should not be used for planning. EVIDENCE-QUALITY WARNING, inferred from source provenance.
  **Source:** https://www.cledara.com/blog/2025-software-spend-report
- **Claim:** US state sales-tax economic nexus is most commonly $100,000 of sales per state. At £2,335/month (~$35k/year total) no state threshold is reached, so US sales tax is a non-issue for a UK seller until roughly 30x the target. VERIFIED.
  **Source:** https://taxcloud.com/blog/sales-tax-nexus-by-state/
- **Claim:** 2026 cold email benchmarks: overall reply ~3.43% (down from 5% in 2025, 8.5% in 2019); positive reply 0.5-2%, with 5% exceptional. Google/Microsoft/Yahoo bulk-sender enforcement triggers at 5,000+ emails/day, so 20-40/day sits far below it. The framing's 0.5-2% positive reply figure is CORRECT and survives scrutiny.
  **Source:** https://instantly.ai/cold-email-benchmark-report-2026
- **Claim:** Bootstrapped SaaS under $1M ARR sells at an average 2.85x annual profit (top quartile 6.13x), deals under $100k close at just 1.68x profit, and Acquire.com's median profit multiple for 2024-25 is 3.9x; micro-SaaS commonly transacts at 25-40x MRR. So £1,000/month MRR costs roughly £25,000-40,000, and sub-£100k deals can go materially cheaper.
  **Source:** https://blog.acquire.com/acquire-com-biannual-acquisition-multiples-report-jan-2026/
- **Claim:** UK Start Up Loans lend £500-£25,000 per person, unsecured, over 1-5 years, at 7.5% fixed from 6 April 2026 (raised from 6%), with eligibility extended to businesses trading up to 60 months, and are structured as personal loans usable for business purposes including marketing. Whether a new entity acquiring an established business qualifies is UNVERIFIED and must be confirmed with the lender before any acquisition plan relies on it.
  **Source:** https://www.startuploans.co.uk/support-and-guidance/frequently-asked-questions/changes-to-interest-rate-and-eligibility
- **Claim:** Civic/volunteer buyer segments are arithmetically dead on price despite an elegant structural fit (evening decision-makers, published contacts, PECR-clean). 10,000 parish and town councils in England; category leader Scribe Accounts serves 1,100 of them starting at £12+VAT/month. ChurchSuite runs £15.50-£56/month. Spond, the leading grassroots sports club app, is entirely free. At £12-30/month, £2,335 requires 80-195 customers — 3-8x the count of the plan that already failed.
  **Source:** https://resources.scribeaccounts.com/scribe-acccounts-free-trial/ and https://www.nalc.gov.uk/about/parish-and-town-councils.html and https://www.spond.com/news-and-blog/spond-v-pitchero/
- **Claim:** UK bespoke software runs £10,000-£500,000+, with regional agency blended day rates of £350-550 and London £600-900; median UK developer day rate ~£510. A solo operator with free build capacity can sell at £6-10k plus a £300-500/month support retainer, making 5-6 clients sufficient for target — but a £8,000 first sale from an unknown vendor is materially harder than a £395/month one, and at six clients losing one is -17% of revenue.
  **Source:** https://redeagle.tech/blog/bespoke-software-cost-uk
- **Claim:** ANCHORING IS DOCUMENTABLE, not inferred. The prompt supplied 'single-digit to ~10% accepted' to every agent; four of five returned 5%, 7%, 7%, 12%. P1 explicitly computed 0.50 x 0.35 x 0.30 x 0.45 = 2.4% and then wrote 'I am rounding UP to ~7%' — a 2.9x unexplained upward adjustment landing exactly on the supplied anchor. P2 shows a softer version (chain 6-9%, headline 7%).
  **Source:** Path 1 and Path 2 digests as supplied in the task prompt
- **Claim:** P5's own table gives contracting/fractional at 'potentially 40%+' — the highest figure in the five reports — but contracting is daytime work and is flatly incompatible with the evenings-and-weekends constraint P5 uses to kill every other path. P5 never reconciles this. It is the highest-value unresolved question in the set and is answerable in one evening.
  **Source:** Path 5 digest as supplied in the task prompt

## Gaps

WHAT I COULD NOT VERIFY, IN ORDER OF HOW MUCH IT MATTERS

1. The ONS 76.7% / 19.8% split — my single most load-bearing new fact — came back identically from two independent search extracts but ons.gov.uk is egress-blocked to me. If it is wrong, the PECR correction collapses and P5's verdict stands closer to as written. VERIFY IN A BROWSER FIRST: https://www.ons.gov.uk/businessindustryandtrade/business/activitysizeandlocation/bulletins/ukbusinessactivitysizeandlocation/2025

2. Whether the founder's day job can go to four days, or accommodate contracting. P5's own table puts contracting/fractional at "potentially 40%+" — the highest figure anywhere in the five reports — while simultaneously using the evenings-only constraint to kill everything else, and never reconciles the two. If the constraint is soft, contracting at £390-470/day for ~6 billed days a month hits the target directly and the whole software analysis is moot. Answerable tonight, free.

3. Whether Start Up Loans will fund an ACQUISITION. The scheme is framed for businesses trading up to 60 months. A newly-formed entity buying an established asset may or may not qualify. Nothing in the search extracts settles it. One phone call to a delivery partner.

4. Whether a British voice on a US SMB cold call helps, hurts, or is neutral. I found no usable evidence either way and I am not going to invent some. This is a material unknown in my top-ranked path and is answerable only by making 150 dials.

5. Reply-to-close conversion for an unknown vendor. I have solid data on cold-email positive-reply rates (0.5-2%, 2026) but nothing credible on positive-reply-to-paying-customer for a no-track-record solo seller. I assumed 10-15%. If it is 3%, the email-channel arithmetic stops closing and the async channel becomes a supplement, not a route.

6. Actual US SMB software spend for non-tech small businesses. Every figure I found traces to vendors selling to venture-backed tech companies (Cledara). The honest position is that I do not know what a six-person US landscaping firm spends, and neither does anyone quoting $121k/year.

7. Micro-SaaS acquisition OUTCOMES. I found what they sell for; I found nothing on what fraction of sub-£50k acquisitions are still generating the acquired revenue 24 months later. Given adverse selection in the public marketplace pool, I would guess it is poor, and my 0.28 completion term and 0.50 growth term are the softest numbers in this document.

WHAT NO REPORT INCLUDING MINE HAS PRICED

8. Concentration risk in the low-customer-count reframe. Both P3 and P5 sell "6 clients not 24" as an unalloyed benefit. At six clients, losing one is -17% of revenue and one bad month wipes out a quarter's growth. That is a real cost of the reframe and it appears nowhere.

9. Partial outcomes. The modal non-zero result is £800-1,500/month, not £0 and not £2,335, and its value differs enormously by path: a half-built SaaS is worth nothing, three service retainers are worth £1,200/month plus a year of paid industry knowledge, a half-grown acquired book is a saleable asset. This belongs as a column in the decision table.

10. The founder's employment contract. Nobody checked for restrictive covenants, IP-assignment clauses, or moonlighting restrictions. An IP-assignment clause that captures work created during employment would be a genuine kill for a software path and is irrelevant to a service path. Read the contract before writing code.

11. What happens after 24 months. Every path is priced against a deadline nobody has justified. If the real objective is £2,335/month sustainably rather than by August 2028, the acquisition path and the bespoke-tools path both improve materially, and P1's community embedding stops being crippled by its own 90-day gate.
