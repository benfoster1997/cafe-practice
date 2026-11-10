# What is newly buildable and sellable in 2026 because of AI — and where AI is a trap

**Scope note:** UK-based, zero-coding owner; Claude builds 100%; target ~£2,335/month (48 × £49 or 24 × £99); £0–60/month running-cost budget; first paying customers within months. All figures GBP unless marked. FX assumption where I convert: **$1.30 = £1** (flag: not verified against a live rate).

---

## 1. Bottom line up front

Three things are simultaneously true in August 2026, and the owner needs all three:

1. **The capability is real.** Document extraction, voice-to-structured-data, and photo understanding are production-grade enough to sell — at the *field* level. Line items, tables, handwriting and multi-step autonomous chains are not.
2. **"AI does the data entry" as a standalone product is the single most commoditised idea on the market.** Xero is shipping it natively (JAX / Smart Document Capture), Anthropic shipped Office file creation to *free* users in 2026, and Dext/AutoEntry/Hubdoc already own the accounting-adjacent niche at £12–25/client/month. Building a generic "upload your invoice, get JSON" tool in 2026 is building a product with a 12–24 month life expectancy and no pricing power.
3. **What is genuinely newly buildable and defensible for a one-person vendor is not the AI — it is the *compliance-shaped workflow* the AI now makes cheap to build.** Two dated UK forcing functions landed in 2026 that create compelled buyers who did not exist in 2024: the **RICS mandatory AI standard (9 March 2026)** and **MTD for Income Tax (April 2026, widening 2027 and 2028)**. Those are the openings.

The economics work. The LLM cost is *not* the binding constraint at sensible model choice (0.5–2p per document). The binding constraints are (a) unbounded usage on a flat price, (b) support hours, (c) distribution.

---

## 2. What is genuinely production-ready in 2026 (and what isn't)

### 2a. Document extraction / OCR of messy paperwork — **sellable, with caveats**

Header-field extraction (supplier, invoice number, date, total) is a solved problem: most tools hit **97%+** on those fields ([AIMultiple invoice OCR benchmark](https://aimultiple.com/invoice-ocr)). Model-level accuracy on scanned invoices in 2026 benchmarking clusters around **90–94%** (Gemini 94%, GPT+OCR 91%, Claude 90%) and **96–98%** on text-native PDFs.

**Line items remain the hard part.** Every credible 2026 source says the same thing, including sources with an incentive to say otherwise: Xero's own native capture "can read an uploaded bill and pre-fill the supplier and total... but the line-item detail on a real supplier bill still tends to need a human" ([Receipt Bot on Xero 2026 features](https://www.receipt-bot.com/blog/xero-feature-deep-dive-new-features-in-xero-for-2026)). The recommended architecture is hybrid — OCR for headers, LLM for line items ([Vellum, 2026](https://www.vellum.ai/blog/document-data-extraction-llms-vs-ocrs)).

**The number that matters for product design:** fully automated document processing runs at roughly **80% accuracy**; structured human-review workflows reach **99.9%** ([idp-software HITL guide, 2026](https://idp-software.com/guides/human-in-the-loop-document-processing/)). This is *not* a reason not to build. It's the reason your product must be a **confidence-gated review queue**, not a magic box. Confidence-gated routing — auto-approve above threshold, queue the rest — is the standard 2026 pattern.

**Verdict: sellable.** But the product is "a fast review queue that is right most of the time and shows you exactly what to check", not "we eliminate data entry".

### 2b. Voice-to-structured-data — **sellable, best-evidenced category**

The medical-scribe evidence base is the strongest real-world evidence available for any AI business-software category, because it's the one people actually studied:

- The Permanente Medical Group: **7,260 physicians, 2.57 million encounters**; UCSF: 44.6% adoption across 1.2 million encounters ([NEJM Catalyst, 2026](https://catalyst.nejm.org/doi/full/10.1056/CAT.25.0040)).
- Measured benefit is **modest but real**: 13.4 fewer minutes of EHR time, 16 fewer minutes of documentation, 0.49 additional weekly visits ([multisite study, PubMed 41920565](https://pubmed.ncbi.nlm.nih.gov/41920565/)); STAT summarised the same body of work as "modest time savings, inconsistent use" ([STAT, 1 Apr 2026](https://www.statnews.com/2026/04/01/ai-ambient-scribes-modest-time-savings-clinical-documentation/)).
- Error rates: legacy speech recognition 7–11%; modern LLM ambient scribes **≈1–3%**, but with new failure modes (hallucination) ([npj Digital Medicine](https://www.nature.com/articles/s41746-025-01895-6)).
- Burnout scores moved 51.9% → 38.8% within 30 days.

**The commercial read-across is the important bit:** this category sustains **$150–200/vet/month** in veterinary (ScribbleVet: $150/vet/month annual, $200 monthly, no free tier — [VetSoftwareHub, 2026](https://www.vetsoftwarehub.com/article/scribblevet-pricing-2026-real-costs-and-how-it-compares)), with a broader market range of **$40–450/month** across 12 tools ([VetSoftwareHub pricing comparison](https://www.vetsoftwarehub.com/article/veterinary-ai-scribe-pricing-comparison-2026)). ScribbleVet was acquired by Instinct Science in January 2026 — the category is consolidating, which means the obvious verticals (human medicine, vet) are taken.

**Verdict: the highest-value capability, and the strongest £99+/month price justification — but only in verticals where someone is legally obliged to produce a written record.**

### 2c. Image understanding (photos of equipment/sites/damage) — **sellable at the "describe and draft" level, not the "judge and decide" level**

Claude's high-resolution tier (2576px long edge, 4784 visual tokens) landed with 4.7-class models and is automatic — no opt-in ([Anthropic vision docs](https://platform.claude.com/docs/en/build-with-claude/vision)). This is a genuine 2026 capability step for photographed paperwork and site photos.

But Anthropic's own limitations list is the honest spec: coordinate/localisation outputs are **approximate**, counting is **approximate**, and the model "might hallucinate or make mistakes when interpreting low-quality, rotated, or very small images". For a damage-assessment or defect-detection product, that means the AI drafts the description and a named human signs it — which, conveniently, is exactly what UK professional standards now *require* (§6).

### 2d. Long-context document analysis — **real, and cheap**

1M-token context at standard pricing across Opus 5, Sonnet 5, Fable 5 ([Anthropic model catalogue](https://platform.claude.com/docs/en/about-claude/models/overview)). A 200-page lease, a full set of contract documents, or a year of bank statements fits in one call. This is the least-hyped, most quietly useful 2026 capability for small-vendor products.

### 2e. Agentic workflow automation — **NOT production-ready as a product promise**

This is where I'd push back hardest on any plan.

- Leading models score **80–90% on single-turn tasks** but drop to **~18–24% on sustained multi-step workflows that cross applications** ([sqmagazine AI agent autonomy statistics, 2026](https://sqmagazine.co.uk/ai-agent-autonomy-statistics/)).
- The arithmetic is brutal and unavoidable: **85% per-step reliability over 10 steps ≈ 20% end-to-end success; 95% per step ≈ 60%.**
- Gartner-sourced projection: **>40% of agentic AI projects cancelled by end of 2027.**
- METR's time-horizon tracker (8 May 2026) put a frontier agent at ~2h17m of human-expert task time at **50% reliability** — 50% is not a product.

**Verdict:** sell 1–3 step assistance with a human gate. Do not sell "the agent runs your back office". A solo vendor cannot absorb the support load of a 20%-success-rate product.

---

## 3. Where the money actually is: real vendors, real prices

I could not find audited revenue disclosures for one-person AI vertical tools — indie-hacker MRR claims are self-reported and I weight them near zero (see §9). What I *can* evidence is **prices people actually charge and buyers actually pay**, which is more decision-useful.

| Vendor / category | Price | Source |
|---|---|---|
| **SurveyorSuite** (UK, snagging/survey reports, built on Anthropic's Claude, RICS-2026-compliant with disclosure block + audit trail + named inspector sign-off) | **£35/month** (£30 annual) | [SurveyorSuite](https://surveyorsuite.co.uk/reports/snagging-report) via search extract — *direct fetch was proxy-blocked* |
| AutoEntry (Sage) — credit-based document capture | £14/mo (50 credits) → £469/mo (2,500 credits) ex-VAT; 1 credit/invoice, 2 for line items, 3/page bank statements | [Datamolino comparison, 2026](https://www.datamolino.com/blog/pricing-and-features-autoentry-vs-hubdoc-vs-dext-vs-datamolino-in-2026/) |
| Dext (UK, per-client) | £12–25/client/month | [AccountsOS, 2026](https://accounts-os.com/blog/dext-alternatives-receipt-scanning-uk) |
| ScribbleVet (vet AI scribe) | $150–200/vet/month | [VetSoftwareHub](https://www.vetsoftwarehub.com/article/scribblevet-pricing-2026-real-costs-and-how-it-compares) |
| Checker (UK trades certificates) | £10.99 / £19.99 / £25.99 per sub-user +VAT | [Checker App, 2026](https://checker.app/best-eicr-electrician-software-uk-2026/) |
| Tradify (UK trades) | from £19/user/month | [Checker App](https://checker.app/best-job-management-all-in-one-app-for-uk-tradespeople-2026/) |
| PlanRadar (snagging) | from $35/user/month | [GoAudits, 2026](https://goaudits.com/blog/punch-list-app/) |
| Commusoft (UK field service, 6+ staff) | from $70/user/month, 12-month contract | [ITQlick](https://www.itqlick.com/commusoft/pricing) |

**What this tells you about your £49/£99 target:**

- **£49/month for a single-user tool is at the *top* of the UK trades band** (£11–26/user) and roughly at parity with UK snagging/survey tools (£30–35). It works if you sell to a *practice* (2–3 seats) or if the tool carries compliance risk.
- **£99/month single-seat requires the buyer to be a professional whose licence, insurance, or regulator is involved.** The vet-scribe band ($150–200/vet) proves people pay that when the alternative is unpaid evening admin plus liability.
- **48 customers at £49 is a realistic, unglamorous number.** 24 at £99 is harder — fewer prospects, longer sales cycle, but far less churn.

**Demand-side reality check (the most useful number in this report):** in Bluevine's 2026 SMB survey, **28% of SMBs spend $25–99/month on AI tools, 16% spend $100–249, 10% spend $250+, and 33% spend nothing at all** ([Bluevine 2026 Small Business AI Trends Report](https://www.bluevine.com/blog/small-business-ai-trends-report-2026) — *direct fetch proxy-blocked; figures from search extract*). Separately, only **17.7% of small businesses have actually paid for AI while 55% say they use it** ([FactoryJet, 2026](https://factoryjet.com/blog/ai-adoption-us-small-businesses-2026)) — the gap is free ChatGPT/Gemini tiers.

£49/month lands squarely in the largest *paying* band. Good. But budget for the fact that **roughly two-thirds of the prospect list will never pay for AI at all**, so top-of-funnel needs to be ~3× what a normal SaaS plan would assume.

And the single most strategically important sentence I found: *"When owners are willing to pay a premium for AI, it's usually for tools embedded in the software they are already using every day"* (Bluevine, via search extract). Standalone AI tools lose to embedded ones. Plan accordingly — either integrate into a system of record, or be the system of record for a workflow nobody else covers.

---

## 4. The commoditisation trap — mapped, with dates

### 4a. What the platforms have already eaten

- **Anthropic (2026):** Claude add-ins for Excel, Word, PowerPoint went GA and Outlook to public beta via Microsoft Marketplace (7 May 2026), with cross-app shared context; file creation (Excel/PPT/Word/PDF) was opened to **free** Claude users ([FindSkill](https://findskill.ai/blog/claude-free-file-creation-2026/), [Pasquale Pillitteri guide](https://pasqualepillitteri.it/en/news/265/claude-excel-powerpoint-ai-add-ins-guide)). Every "AI for spreadsheets / AI document generator / chat with your PDF" product is now competing with free.
- **Xero (2026):** JAX ("Just Ask Xero") went from beta to full agentic platform in early 2026, orchestrating multiple agents; **XeroForce** lets small businesses and accountants *build their own AI agents in natural language* ([Xero media release](https://www.xero.com/us/media-releases/xero-introduces-xeroforce/), [CPA Practice Advisor, 13 May 2026](https://www.cpapracticeadvisor.com/2026/05/13/xero-provides-small-businesses-and-accountants-with-a-natural-language-custom-ai-agent-builder/183351/)). Native Smart Document Capture is live in most markets ([Xero blog](https://blog.xero.com/product-updates/smart-document-capture/)). AI-assisted bill payments capture-to-settlement is on the H2 2026 roadmap.
- The 2023 canary is still the clearest lesson: OpenAI shipping file upload rendered dozens of "ChatGPT for PDFs" startups obsolete overnight.

### 4b. The platform-dependency trap — a specific, dated UK-relevant risk

If the plan involves building on Xero, read this twice:

**Xero is moving third-party app developers from revenue-share to a tiered pricing structure based on API usage and connections, scheduled for March 2026** ([Accounting Today](https://www.accountingtoday.com/news/xero-shifts-to-tiered-pricing-model-for-developers)). Xero also now prohibits using API data to train AI/ML models, and bans bots or browser extensions that simulate user actions.

Translation for a £49/month product: your platform can unilaterally introduce a per-connection cost that lands directly on your gross margin, at the same time it ships a free native version of your feature. Building a thin layer on Xero in 2026 means holding both risks at once.

### 4c. What actually differentiates a defensible product from a doomed wrapper — evidence, not theory

The MIT "GenAI Divide" study (July 2025; 52 executive interviews, 153 leader surveys, 300 public deployments) found **95% of enterprise GenAI pilots delivered no measurable P&L impact**, and that the 5% that worked shared specific traits: **workflow integration**, customised/learning-capable systems, and deployment in back-office functions like document automation and procurement ([MIT via Fortune/Yahoo Finance](https://finance.yahoo.com/news/mit-report-95-generative-ai-105412686.html); [Forbes analysis](https://www.forbes.com/sites/jasonsnyder/2025/08/26/mit-finds-95-of-genai-pilots-fail-because-companies-avoid-friction/)). Only 5% of organisations had integrated AI into workflows at scale, versus 40% who had "deployed tools".

**Concretely, for a tiny vendor, the defensible attributes are:**

| Defensible | Doomed |
|---|---|
| Owns the workflow end-to-end, including the boring non-AI 80% | AI is the whole product |
| Produces a *compliance artefact* someone is obliged to hold | Produces a nice summary |
| Named human sign-off + audit trail baked in | "Trust the AI" |
| Serves a niche too small for Xero/Sage to bother with | Serves the biggest, most obvious segment |
| Owner has direct, personal access to the buyer community | Buys traffic / cold outbound |
| Model-agnostic — can swap Haiku→Sonnet→whatever as prices fall | Locked to one model's specific behaviour |
| Accumulates customer-specific data (templates, coding rules, supplier history) that makes month 12 better than month 1 | Stateless — every customer starts from zero |

The last one is the only real technical moat available at this scale, and it's cheap: remembering that *this* customer codes "Screwfix" to 5000-Materials and *that* supplier's invoices put VAT in an odd place is proprietary data the platform vendor doesn't have.

---

## 5. Unit economics — worked, in GBP, from published 2026 pricing

**Sources for all inputs:** Anthropic published per-token pricing and the vision token formula (visual tokens = ⌈w/28⌉ × ⌈h/28⌉; high-res tier caps at 2576px long edge / 4784 tokens; standard tier 1568px / 1568 tokens) — [Anthropic vision docs](https://platform.claude.com/docs/en/build-with-claude/vision), [models overview](https://platform.claude.com/docs/en/about-claude/models/overview). **The arithmetic below is mine.**

**2026 list prices (per 1M tokens):** Haiku 4.5 $1 in / $5 out · Sonnet 5 $3/$15 (intro $2/$10 through 31 Aug 2026) · Opus 5 $5/$25. Batch API = **−50%**. Cache reads ≈ 0.1×. Minimum cacheable prefix: **512 tokens (Opus 5), 1024 (Sonnet 5), 4096 (Haiku 4.5)** — that last one matters (see below).

### Worked example: one scanned A4 invoice → structured JSON

Assume A4 at 200dpi (1654 × 2339 px), a 1,500-token system prompt + JSON schema, ~600 output tokens (header + 10 line items).

| Setup | Image tokens | Cost/doc (USD) | Cost/doc (GBP) |
|---|---|---|---|
| **Haiku 4.5**, standard tier, no caching (1.5k prefix is *below* Haiku's 4096 minimum, so it never caches) | 1,568 | $0.0061 | **0.47p** |
| **Sonnet 5**, image pre-downsampled to 1568px long edge, thinking off, prefix cached | 2,240 | $0.0162 | **1.25p** |
| **Sonnet 5**, full-resolution image, thinking off, prefix cached | 4,784 | $0.0238 | **1.8p** |
| **Opus 5, default settings** — full-res image, adaptive thinking ON (~1,500 thinking tokens billed as output) | 4,784 | $0.0772 | **5.9p** |

**Three non-obvious cost traps in that table:**

1. **Thinking is ON by default on Opus 5** (a 2026 change from Opus 4.8 where omitting the parameter meant no thinking). Thinking tokens bill at the output rate. For extraction, this is pure waste — it roughly **3× the output cost** for no accuracy gain. Set `thinking: {type: "disabled"}` at effort `high` or below, or use `effort: low`.
2. **Pre-downsampling the image to 1568px long edge halves the input cost on high-res-tier models** with negligible accuracy loss on a clean A4 scan. Anthropic says this explicitly. Free money.
3. **Haiku 4.5's 4096-token minimum cacheable prefix** means a typical extraction prompt never caches on Haiku — the cheapest model is the one where caching helps least. Still cheapest overall, but don't budget for a cache discount that won't arrive.

### What that means at your price point

**48 customers × £49 = £2,352/month revenue.**

| Scenario | LLM cost/month | Notes |
|---|---|---|
| 48 customers × 300 docs, Haiku 4.5 | **£68** | Comfortable |
| 48 × 300 docs, Sonnet 5 downsampled | **£180** | Comfortable |
| 48 × 300 docs, Opus 5 default settings | **£850** | 36% of revenue — survivable but painful |
| **One** heavy customer at 3,000 docs, Opus 5 default | **£177 from that customer alone** | **−261% gross margin on a £49 seat** |

Plus: card fees roughly 1.5–3% + ~20p per transaction (≈£45–70/month at this volume — *flag: I did not verify current Stripe UK rates*), hosting £10–25/month, email/domain/misc £15–25/month.

**Realistic gross margin at 48 customers on Sonnet-downsampled: ~86–88%.** That is a healthy software business.

**The honest correction to the £0–60/month budget:** that holds for infrastructure at low customer counts. It does **not** hold once 48 customers are processing real volume — expect **£180–300/month all-in at target scale**, funded out of revenue, not savings. Budget £30–60/month for the *pre-revenue* phase, which is achievable.

**The actual economic risk is not the per-token price — it's variance.** Flat £49/month against unbounded document volume is the failure mode. Mitigations, in order of preference:
1. **Publish a fair-use cap** in the plan (e.g. 500 documents/month, then 3p each). Not hostile — Dext and AutoEntry both meter, so the market already accepts it.
2. **Route by difficulty:** Haiku for clean text-native PDFs, Sonnet only for photos and poor scans. Cuts blended cost ~60%.
3. **Batch API (−50%)** for anything that doesn't need a sub-10-second response — overnight bulk imports especially.
4. **Cap retries.** A low-confidence document that gets re-run three times through a premium model costs more than the customer's daily subscription value.

**Price-deflation tailwind:** Sonnet 5's introductory $2/$10 (through 31 Aug 2026) vs list $3/$15 is a live example of downward pressure. Historically per-token prices for a given capability level have fallen fast. Build model-agnostic; the cost line improves without you doing anything.

---

## 6. Risk: liability, insurance, regulation, data protection

### 6a. Liability for wrong AI output — the settled position

*Moffatt v Air Canada* (2024 BCCRT 149) is the reference point every commentator uses: the tribunal **rejected the argument that the chatbot was a separate entity**, held the company liable for negligent misrepresentation by its own AI, and awarded C$812.02 ([McCarthy Tétrault](https://www.mccarthy.ca/en/insights/blogs/techlex/moffatt-v-air-canada-misrepresentation-ai-chatbot); [Pinsent Masons](https://www.pinsentmasons.com/out-law/news/air-canada-chatbot-case-highlights-ai-liability-risks)). It's a small-claims tribunal in British Columbia — **not binding in England & Wales** — but Pinsent Masons' read is that UK courts would likely look to the business deploying the technology.

For a £49/month product this is manageable *if the product is architected so the customer signs off*. It is not manageable if the product silently posts figures into someone's accounts.

### 6b. Insurance — the genuinely under-appreciated 2026 risk

This is the finding I'd most want the owner to act on:

- **Tech E&O policies — the coverage most relevant to an AI vendor — often exclude the exact risks AI creates:** hallucination-related losses, IP infringement, and data disclosure through outputs ([Honigman](https://www.honigman.com/the-matrix/ai-insurance-gap-what-it-means-for-technology-contracts)).
- **Cyber and PI wordings across the London market are being amended in 2025–2026 to exclude losses arising from the development, training, deployment or operation of AI systems** ([Fenwick, "The End of 'Silent AI'"](https://www.fenwick.com/insights/publications/end-silent-ai-emerging-ai-exclusions-coverage-fragmentation-and-practical-implications)).
- **Beazley and QBE have introduced AI sublimits on the London market capping AI-related payouts at roughly 10% of the total limit.**
- Affirmative AI E&O products exist (HSB/Munich Re, Armilla, Counterpart) but are new and priced accordingly.

**Action:** get a written quote for tech E&O/PI *before* signing the first customer, and read the AI exclusion wording specifically. A £1m PI policy with a full AI exclusion is worth nothing to this business. Also: cap liability in the T&Cs at 12 months of fees (the market-standard cap, per the same sources) — at £49/month that's £588 of exposure per customer, which is a survivable number.

### 6c. EU AI Act — probably *less* of a problem than expected, but check the customer geography

- The **Digital Omnibus (Regulation (EU) 2026/1744, in force 27 July 2026)** deferred Annex III high-risk obligations to **2 December 2027** and Annex I embedded high-risk to **2 August 2028** ([Gibson Dunn](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/); [Lumenova](https://www.lumenova.ai/blog/eu-ai-act-delays-july-2026/)).
- **Article 50 transparency duties were NOT delayed** and took effect **2 August 2026** — disclose to users that they're interacting with AI, mark AI-generated content, label deepfakes. Applies regardless of high-risk classification. Fines up to **€15m or 3% of worldwide turnover** ([Sidley Data Matters](https://datamatters.sidley.com/2026/06/24/eu-ai-act-transparency-obligations-preparing-for-compliance-by-2-august-2026/); [Cooley](https://www.cooley.com/news/insight/2026/2026-08-03-eu-ai-act-transparency-obligations-take-effect-2-august-2026); [official EC guidance](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act)). **No SME exemption found.**
- **Practical read:** for a document-extraction or report-drafting tool, Article 50's substantive burden is "say clearly that AI is involved and mark AI-generated output" — a paragraph in the UI and a line in the T&Cs. Cheap. **But it only bites if you have EU users at all.** Selling only to UK customers keeps you out of scope. That's a defensible early-stage decision — and a reason to *not* chase EU customers in year one.

### 6d. UK regulation — there is no UK AI Act, and that matters

**As of May 2026 no AI Bill sits before Parliament**, and the AI Opportunities Action Plan (January 2026) **explicitly rejected a UK AI Act on the EU model** ([House of Commons Library CBP-10003](https://commonslibrary.parliament.uk/research-briefings/cbp-10003/); [Bratby Law](https://bratby.law/uk-ai-regulation-what-the-law-says/)). Regulation runs through existing regulators: ICO (UK GDPR as amended by the **Data (Use and Access) Act 2025**, most data-protection provisions in force **5 February 2026**), FCA, Ofcom.

**This is a meaningful competitive asymmetry in the owner's favour.** A UK-only product selling to UK customers carries materially lighter AI-specific compliance load than an EU-facing one in 2026.

### 6e. Data protection — the concrete UK checklist

Processing customers' documents makes you a **data processor** (they're the controller). Obligations: act only on documented instructions, implement appropriate security, have a **written DPA**, manage sub-processors (Anthropic/OpenAI is a sub-processor — you need the customer's authorisation), notify breaches, delete on termination ([ICO on processors](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/controllers-and-processors/controllers-and-processors/what-does-it-mean-if-you-are-a-processor/)).

**ICO data protection fee 2026: unchanged — Tier 1 £52/year (£47 by Direct Debit)** for micro-organisations (≤10 staff or ≤£632,000 turnover); Tier 2 £78; Tier 3 £3,763 ([ICO](https://ico.org.uk/for-organisations/advice-for-small-organisations/getting-started-with-gdpr/data-protection-fee-what-you-need-to-do/)). So **£47/year**, comfortably inside the running-cost budget.

Practical points that will come up in every sales conversation:
- Anthropic states uploaded images are **ephemeral, deleted after processing, and not used for training** ([vision docs FAQ](https://platform.claude.com/docs/en/build-with-claude/vision)). Put that in your DPA — it closes the most common objection.
- Data-security concern among SMBs **jumped 10 points YoY, from 23% to 33%** (Bluevine 2026). Expect it, prepare a one-page answer.
- Note the odd asymmetry: **Xero now forbids using its API data to train AI models** — so if you integrate with Xero, "we never train on your data" isn't a choice, it's a contractual requirement. Say it loudly.

---

## 7. Where AI is NOT the answer

Cases where a boring, reliable CRUD app beats an AI feature for the customer's actual job:

1. **When the customer's real job is "produce a defensible document on time", not "type less."** Under **Awaab's Law** (in force 27 October 2025), social landlords must investigate significant damp/mould hazards within **10 working days** and give the tenant a written summary within **3 working days** of concluding, with clear records of compliance attempts; requirements expand to more hazard categories during 2026 ([GOV.UK guidance](https://www.gov.uk/government/publications/awaabs-law-guidance-for-social-landlords/awaabs-law-guidance-for-social-landlords-timeframes-for-repairs-in-the-social-rented-sector); [Shelter England](https://england.shelter.org.uk/professional_resources/news_and_updates/how_awaabs_law_changes_the_rules_on_hazards_in_social_housing)). The hard part is the **clock, the audit trail, and the evidence chain** — all deterministic CRUD. AI drafting the narrative is a 10% nicety on top of a 90% boring app.
2. **Anything where a wrong answer is silent.** AI is good where errors are *visible* (a misread invoice total looks wrong) and dangerous where they're invisible (a subtly wrong VAT treatment, a missed clause). Prefer visible-error surfaces.
3. **Anything with a deterministic rule.** VAT rates, CIS deduction percentages, mileage rates, certificate expiry dates, notice periods — these belong in code. Using an LLM for arithmetic or lookup tables is slower, costlier, and *less* accurate.
4. **Scheduling, reminders, invoicing, payment chasing.** These are why trades buy Tradify at £19/user or Checker at £11–26. Zero AI, high retention. If the owner's chosen niche lacks a decent boring app, *that's* the opportunity, and AI is the wedge — not the product.
5. **When the customer will not review the output.** If the workflow has no natural review moment, either build one or don't ship the feature. An unreviewed AI output in a regulated context is a liability generator.
6. **Search and filtering over structured data.** A well-designed table with good filters beats a chat box for a user who does the same query 40 times a day.

The design rule that follows: **make AI a keystroke-eliminator inside a boring app the customer must open anyway.** Bluevine's finding — that SMBs pay premiums for AI *embedded in software they already use daily* — says the same thing from the demand side.

---

## 8. Concrete opportunity shapes for this specific situation

Ranked by fit with: UK, solo, non-technical owner, £0–60/mo pre-revenue, months to first customer, 24–48 customers needed.

### A. RICS-compliant AI documentation for a small surveying niche — **strongest fit**

**The forcing function:** RICS published the first global professional standard for responsible AI use in surveying, **mandatory from 9 March 2026** for RICS members and regulated firms worldwide ([RICS announcement](https://www.rics.org/news-insights/rics-launches-landmark-global-standard-on-responsible-use-of-ai-in-surveying); [Beale & Co](https://beale-law.com/article/rics-sets-the-standard-responsible-ai-use-becomes-mandatory-in-surveying/); [CMS](https://cms.law/en/gbr/legal-updates/rics-introduces-mandatory-ai-standard-for-surveyors-what-insurers-and-their-clients-need-to-know)). Requirements: **written client disclosure before work commences** (engagement letters), **disclosure in reports where AI materially contributed**, and a **recorded written assessment of whether AI is the right tool** before deploying it. Non-compliance risks complaints and disciplinary action.

**Why it's a solo-vendor opportunity:** a sole-practitioner surveyor now has a mandatory compliance obligation and no compliance department. The product is not "AI writes your report" — it's "AI drafts your report *and* generates the disclosure block, the audit trail, the written AI-suitability assessment, and the named sign-off record." The compliance artefact is the moat, and it's exactly the kind of unglamorous work a big vendor won't do for a 3-person practice.

**Proof the shape works and the price holds:** SurveyorSuite is doing precisely this at **£35/month**, explicitly built around the RICS 2026 standard, using Anthropic's Claude, with disclosure block + audit trail + named inspector sign-off.

**The move:** don't compete head-on with SurveyorSuite in general building surveys. Go to an adjacent RICS-touching niche it doesn't serve — party wall surveying, damp & timber reports, HMO licensing inspections, dilapidations schedules, EPC assessments. Same mandate, no incumbent.

**Numbers:** 24 practices × £99/month = £2,376. At a 2-seat average that's £49.50/seat — right in the market band.

### B. The MTD for Income Tax pre-processing layer — **biggest compelled-buyer pool**

**The forcing function:** From April 2026, sole traders and landlords with gross business/property income **over £50,000** must keep digital records and file quarterly. **864,000 individuals** are drawn in for 2026/27 ([ByteStart](https://www.bytestart.co.uk/news-insights/864000-sole-traders-and-landlords-face-new-mtd-reporting-rules-from-april-2026/); [ICAS](https://www.icas.com/news-insights-events/news/tax/further-updates-to-making-tax-digital-for-income-tax-self-assessment-announced)). Threshold drops to **£30,000 in April 2027** and **£20,000 in April 2028**. A sole trader who is also a landlord files **two** quarterly updates.

**The trap to avoid:** building an actual MTD filing product requires HMRC recognition and API access — a serious barrier for a non-technical solo founder, and a crowded field. **Don't do that.**

**The opportunity instead:** build the **pre-processing layer** that turns the mess into clean digital records and hands them to whatever recognised MTD product the customer already uses. Photograph receipt → categorised, VAT-correct, property-allocated digital record. No HMRC recognition needed. This is where the AI capability is genuinely production-ready (§2a) and where the pain is real and newly *mandatory*.

**Sharpest niche:** landlords with 2–10 properties who are not businesses, have no bookkeeper, and now face quarterly filing for the first time. They are the least-served, most-panicked segment, and property-level allocation is a specific, non-generic problem Xero doesn't solve well.

**Risk to state honestly:** this is closest to the commoditised core (§4), and it competes with free/cheap capture in every accounting package. It only works with a hard niche focus.

### C. Voice-to-record for a UK regulated trade with a mandatory certificate

Gas safety (CP12), EICR, PAT, fire door inspections, legionella risk assessments, asbestos management surveys. The engineer talks; the app produces the certificate. The value is the compliance artefact and the audit trail — the AI just removes the typing on a cold van bonnet.

The vet-scribe evidence (§2b) shows this shape sustains high prices when a written record is legally required. Trades pricing (£11–26/user) is lower, so target 2–4 seat firms: **£99/month per firm × 24 firms = £2,376**.

Existing competition is real (Checker, Tradify, Commusoft) but is mostly *not* voice-first, and the incumbents are boring-app companies who will be slow to add it.

### D. Awaab's Law evidence-chain tooling for small housing providers

The 10-working-day / 3-working-day clocks with mandatory record-keeping (§7.1) create a genuinely new compliance workload from October 2025, expanding through 2026. The product is 90% CRUD (clock, evidence chain, tenant correspondence log) with AI drafting the written summary and reading inspection photos.

Buyers are small housing associations, ALMOs, and managing agents — a small, reachable, list-able UK population who cannot afford enterprise housing systems. Higher price tolerance (£99–299/month). **Flag: I have not verified the size of the small-provider segment or their current tooling** — this is a hypothesis to test with 10 phone calls, not a validated opportunity.

### What I'd advise against

- **Generic "AI bookkeeping assistant" / "AI receipt scanner"** — directly in Xero's and Dext's path, with the March 2026 API repricing pointed at your margin.
- **Anything whose core value is "chat with your documents"** — free in Claude and ChatGPT.
- **Multi-step autonomous agents** — 18–24% end-to-end success (§2e); the support load alone will end the business.
- **Anything requiring HMRC recognition, FCA authorisation, or medical device classification** in year one.

---

## 9. Honest gaps and confidence

**High confidence** (primary or near-primary sources, cross-checked):
- Anthropic pricing, token formula, image cost arithmetic — from Anthropic's own docs; the arithmetic is mine and reproducible.
- ICO fees (£52/£47 Tier 1) — ICO's own site.
- EU AI Act dates and Article 50 scope — multiple law-firm sources plus EC guidance, mutually consistent.
- MTD ITSA thresholds and dates — multiple independent UK accounting sources agreeing.
- RICS mandatory AI standard, 9 March 2026 — RICS's own announcement plus two law firms.
- UK has no AI Act — House of Commons Library.
- Awaab's Law timescales — GOV.UK guidance.

**Medium confidence** (single or secondary sources, plausible but not verified):
- **Bluevine SMB spending figures** (28% at $25–99/mo etc.) — direct fetch was **proxy-blocked**; figures come from a search extract. The headline numbers are the most decision-relevant in the report, so **verify these directly before betting a price point on them.**
- **SurveyorSuite's £35/month and its RICS-compliance claims** — direct fetch **proxy-blocked**; from search extract only. Worth 10 minutes on their site.
- Competitor pricing from Capterra/ITQlick/comparison sites — these are frequently stale or list US pricing for UK products. Treat as directional.
- Agentic reliability figures (18–24% multi-step) — the direction is corroborated across sources, the specific percentages come from one aggregator.

**Low confidence / unverified — flagged explicitly:**
- **Stripe UK card fees** (I quoted ~1.5% + 20p from memory; not verified).
- **UK VAT registration threshold** (I believe £90,000; at £28k/year revenue you're well under either way, but check).
- **ASR/speech-to-text pricing** — I could not verify 2026 per-minute rates from a primary source. For opportunity C the LLM side computes to ~1.8p per 15-minute consultation, but **transcription cost is likely to dominate and I have not priced it.** This is a real hole in the unit economics for any voice product.
- **FX rate** — all GBP figures use an assumed $1.30/£1.

**What I could not find at all:**
- **Audited or verifiable revenue disclosures for one-person AI vertical tools.** The indie-hacker MRR content (Medium/Flowjam/VibrantSnap listicles claiming "$1K–$200K MRR") is self-reported, unauditable, survivorship-biased content marketing. **I have deliberately excluded all of it.** The claim that "the average micro-SaaS earns $1,735 MRR" has no methodology behind it that I could locate. Treat any revenue claim in that genre as zero evidence.
- **Churn data for small vertical AI tools.** This is the number that would actually determine whether 48 customers at £49 is a stable business or a leaky bucket. I found nothing credible. Given that G2's 2026 buyer research found seven in ten buyers pushing toward **shorter contracts** because of AI's pace, and one-third of SMBs spend nothing on AI, I would plan for **higher churn than a normal SaaS** — assume 5–7% monthly and price/build accordingly, i.e. you need ~55–60 gross additions to hold 48.
- **Direct evidence on whether UK small surveying/trades firms will actually pay for compliance tooling.** The RICS mandate is real; the willingness to pay is inferred. That is exactly what customer discovery — the owner's actual job — is for.

**The single biggest judgement call in this report:** I am confident the *capability* is production-ready and the *unit economics* work. I am much less confident that any specific niche has 48 reachable buyers who will pay £49/month, and no amount of desk research settles that. The evidence points strongly toward compliance-mandated niches because those buyers are *compelled* rather than merely interested — but 20 phone calls to actual surveyors, gas engineers, or landlords will produce better evidence than another week of searching.

## OPPORTUNITIES SURFACED
**Ranked for this exact situation (UK, solo, non-technical owner, Claude builds, £0–60/mo pre-revenue, 24–48 customers needed, months not years).**

**A. RICS-compliant AI documentation for an under-served surveying niche — strongest fit.**
*Who buys:* sole practitioners and 2–5 person RICS-regulated practices in niches the incumbents ignore — party wall surveying, damp & timber reports, dilapidations schedules, HMO licensing inspections, EPC assessment.
*What pain:* RICS's mandatory AI standard took effect **9 March 2026**. Every regulated firm must now give written client disclosure before work commences, disclose in reports where AI materially contributed, and keep a recorded written assessment of whether AI was the right tool. A three-person practice has no compliance function to produce any of that.
*What they pay today:* generic report tools plus unpaid evening typing. The proven price point for this exact shape is SurveyorSuite at **£35/month**, Claude-powered, RICS-compliant with disclosure block, audit trail and named inspector sign-off.
*Why now:* the mandate is dated, live, and creates *compelled* buyers rather than merely interested ones. The product is not "AI writes your report" — it is "AI drafts it AND generates the disclosure block, audit trail, AI-suitability assessment and named sign-off record." The compliance artefact is the moat; it is exactly the unglamorous work no large vendor will do for a 3-person firm.
*Numbers:* 24 practices × £99/month = £2,376. At a 2-seat average that is £49.50/seat, squarely in the market band.

**B. The MTD-for-Income-Tax pre-processing layer — biggest compelled-buyer pool.**
*Who buys:* landlords with 2–10 properties and no bookkeeper — the least-served, most-panicked segment.
*What pain:* From April 2026, sole traders and landlords over £50,000 gross income must keep digital records and file quarterly — **864,000 people in 2026/27 alone**, widening to £30,000 in April 2027 and £20,000 in April 2028. Someone who is both a sole trader and a landlord files *two* quarterly updates. Property-level allocation of expenses is a specific problem Xero handles badly.
*What they pay today:* nothing, or a shoebox and an accountant's year-end fee.
*Why now:* a hard statutory deadline with a widening population for three consecutive years.
*Critical design decision:* **do not build an HMRC-recognised filing product** — that needs HMRC API access and recognition, a serious barrier for a non-technical solo founder in a crowded field. Build the layer *before* it: photo of receipt → categorised, VAT-correct, property-allocated digital record, exported into whatever recognised MTD product they already use. No HMRC recognition required, and it sits exactly where the AI capability is genuinely production-ready.
*Risk to state plainly:* this is the closest of the four to the commoditised core and competes with free capture in every accounting package. Only works with ruthless niche focus.

**C. Voice-to-record for a UK regulated trade with a mandatory certificate.**
*Who buys:* 2–4 seat firms doing gas safety (CP12), EICR, PAT, fire door inspections, legionella risk assessments, asbestos management surveys.
*What pain:* the engineer types the certificate on a van bonnet after a 10-hour day. The legally required artefact is the certificate, not the notes.
*What they pay today:* £11–26/user/month (Checker), from £19/user (Tradify), $70/user (Commusoft for 6+ staff) — mostly boring job-management apps that are *not* voice-first.
*Why now:* the vet-scribe market proves this shape sustains $150–200/seat where a written record is legally required; UK trades pricing is lower, so target the firm not the seat: **£99/month × 24 firms = £2,376**.
*Caveat:* I could not verify 2026 ASR pricing — transcription cost likely dominates the ~1.8p LLM cost per record and must be priced before committing.

**D. Awaab's Law evidence-chain tooling for small housing providers — highest price tolerance, least validated.**
*Who buys:* small housing associations, ALMOs, managing agents — a small, list-able, reachable UK population priced out of enterprise housing systems.
*What pain:* since 27 October 2025, significant damp/mould hazards must be investigated within 10 working days with a written tenant summary within 3 working days of conclusion, plus clear records of compliance attempts; scope expands to further hazard categories during 2026.
*Why it fits:* the product is 90% deterministic CRUD (clock, evidence chain, correspondence log) with AI drafting the written summary and reading inspection photos — which is precisely the right ratio (§7).
*Price tolerance:* £99–299/month.
*Honest flag:* I have not verified the size of the small-provider segment or their current tooling. This is a hypothesis for 10 phone calls, not a validated opportunity.

**Advise against:** generic "AI bookkeeping assistant" or "AI receipt scanner" (directly in Xero's and Dext's path, with Xero's March 2026 API repricing pointed at your margin); anything whose core value is "chat with your documents" (free in Claude and ChatGPT since 2026); multi-step autonomous agents (18–24% end-to-end success — the support load alone ends the business); anything needing HMRC recognition, FCA authorisation or medical device classification in year one.

**The cross-cutting design rule:** make AI a keystroke-eliminator inside a boring app the customer must open anyway, producing a compliance artefact someone is obliged to hold, with a named human sign-off. Bluevine's demand-side finding — SMBs pay premiums for AI *embedded in software they already use daily*, not for standalone AI tools — says the same thing from the buyer's side.

**Two immediate operational actions regardless of niche:** (1) Get a written tech E&O/PI quote and read the **AI exclusion wording specifically** before signing customer one — AI exclusions and ~10% sublimits are entering London-market policies through 2026 renewals; a £1m policy with a blanket AI exclusion is worthless here. Cap liability at 12 months of fees (£588/customer at £49) in the T&Cs. (2) Publish a fair-use document cap (e.g. 500/month then 3p each) from day one — flat pricing against unbounded volume is the one way these unit economics break, and Dext and AutoEntry both meter, so the market already accepts it.

## KEY CLAIMS
- Multi-step agentic workflows are not production-ready as a product promise: leading models score 80-90% on single-turn tasks but drop to roughly 18-24% on sustained multi-step workflows crossing applications; at 85% per-step reliability a 10-step chain succeeds ~20% of the time. Gartner-sourced projection: >40% of agentic AI projects cancelled by end of 2027.
  SOURCE: https://sqmagazine.co.uk/ai-agent-autonomy-statistics/
- Fully automated document processing runs at roughly 80% accuracy; structured human-in-the-loop review workflows reach 99.9%. Confidence-gated routing (auto-approve above threshold, queue the rest) is the standard 2026 production architecture.
  SOURCE: https://idp-software.com/guides/human-in-the-loop-document-processing/
- RICS published the first global mandatory professional standard for responsible AI use in surveying, effective 9 March 2026: written client disclosure before work commences, disclosure in reports where AI materially contributed, and a recorded written assessment of whether AI is the right tool. Non-compliance risks complaints and disciplinary action. This creates compelled buyers with no compliance infrastructure.
  SOURCE: https://www.rics.org/news-insights/rics-launches-landmark-global-standard-on-responsible-use-of-ai-in-surveying
- MTD for Income Tax draws 864,000 sole traders and landlords with gross income over £50,000 into mandatory quarterly digital filing from April 2026; the threshold drops to £30,000 in April 2027 and £20,000 in April 2028.
  SOURCE: https://www.bytestart.co.uk/news-insights/864000-sole-traders-and-landlords-face-new-mtd-reporting-rules-from-april-2026/
- Xero is moving third-party app developers from a revenue-share model to tiered pricing based on API usage and connections, scheduled for March 2026, and prohibits using API data to train AI/ML models — a direct margin risk for any small vendor building on Xero, concurrent with Xero shipping native AI document capture (JAX/Smart Document Capture) and XeroForce natural-language agent building.
  SOURCE: https://www.accountingtoday.com/news/xero-shifts-to-tiered-pricing-model-for-developers
- Anthropic shipped Claude add-ins for Excel, Word and PowerPoint to GA (7 May 2026) via Microsoft Marketplace and opened Excel/PowerPoint/Word/PDF file creation to FREE Claude users — commoditising every standalone 'AI for documents/spreadsheets' product.
  SOURCE: https://findskill.ai/blog/claude-free-file-creation-2026/
- Cyber and professional indemnity wordings across the London market are being amended in 2025-2026 to exclude losses arising from the development, training, deployment or operation of AI systems; Beazley and QBE have introduced AI sublimits capping AI-related payouts at roughly 10% of the total limit. Tech E&O policies often exclude hallucination-related losses specifically.
  SOURCE: https://www.fenwick.com/insights/publications/end-silent-ai-emerging-ai-exclusions-coverage-fragmentation-and-practical-implications
- EU AI Act Article 50 transparency obligations took effect 2 August 2026 and were NOT delayed by the Digital Omnibus (which deferred Annex III high-risk to 2 December 2027). Fines up to €15m or 3% of worldwide turnover; no SME exemption found. High-risk deferral came via Regulation (EU) 2026/1744, in force 27 July 2026.
  SOURCE: https://datamatters.sidley.com/2026/06/24/eu-ai-act-transparency-obligations-preparing-for-compliance-by-2-august-2026/
- As of May 2026 the UK has no AI Act and no AI Bill before Parliament; the AI Opportunities Action Plan (January 2026) explicitly rejected an EU-style horizontal statute. Regulation runs through existing regulators (ICO under UK GDPR as amended by the Data (Use and Access) Act 2025, most provisions in force 5 February 2026). A UK-only product carries materially lighter AI-specific compliance load than an EU-facing one.
  SOURCE: https://commonslibrary.parliament.uk/research-briefings/cbp-10003/
- ICO data protection fee is unchanged in 2026: Tier 1 £52/year (£47 by Direct Debit) for micro-organisations with ≤10 staff or ≤£632,000 turnover. Processing customer documents makes the vendor a data processor requiring a written DPA, documented-instructions-only processing, sub-processor management and breach notification.
  SOURCE: https://ico.org.uk/for-organisations/advice-for-small-organisations/getting-started-with-gdpr/data-protection-fee-what-you-need-to-do/
- Anthropic 2026 published pricing: Haiku 4.5 $1/$5 per MTok, Sonnet 5 $3/$15 (intro $2/$10 through 31 Aug 2026), Opus 5 $5/$25; Batch API -50%; cache reads ~0.1x. Vision tokens = ceil(w/28) x ceil(h/28), capped at 4784 tokens / 2576px long edge on high-res-tier models (Claude 4.7+) and 1568/1568px on standard tier. Minimum cacheable prefix is 4096 tokens on Haiku 4.5 vs 1024 on Sonnet 5 and 512 on Opus 5.
  SOURCE: https://platform.claude.com/docs/en/build-with-claude/vision
- My calculation from Anthropic's published pricing and token formula: one scanned A4 invoice to structured JSON costs ~0.47p on Haiku 4.5, ~1.25p on Sonnet 5 with the image pre-downsampled to 1568px and thinking disabled, and ~5.9p on Opus 5 at default settings (full-resolution image plus adaptive thinking, which is ON by default on Opus 5 and bills at the output rate). At 48 customers x 300 docs/month that is £68, £180 and £850/month respectively against £2,352 revenue.
  SOURCE: Calculated from https://platform.claude.com/docs/en/build-with-claude/vision and https://platform.claude.com/docs/en/about-claude/models/overview
- UK market price anchors for this product shape: SurveyorSuite (UK, Claude-powered, RICS-2026-compliant snagging/survey reports with disclosure block, audit trail and named inspector sign-off) charges £35/month. UK trades software runs £11-26/user/month (Checker) and from £19/user/month (Tradify). Dext charges £12-25/client/month; AutoEntry £14-469/month on credits (1 credit per invoice, 2 for line items, 3 per page for bank statements). Veterinary AI scribes sustain $150-200/vet/month.
  SOURCE: https://checker.app/best-eicr-electrician-software-uk-2026/
- Demand-side evidence: 28% of SMBs spend $25-99/month on AI tools, 16% spend $100-249, 10% spend $250+, and 33% spend nothing; only 17.7% of small businesses have actually paid for AI while 55% claim to use it. SMBs pay a premium for AI mainly when it is embedded in software they already use daily. Data-security concern rose from 23% to 33% year-over-year. [MEDIUM CONFIDENCE — direct fetch was proxy-blocked; figures from search extract, verify before relying on them.]
  SOURCE: https://www.bluevine.com/blog/small-business-ai-trends-report-2026
- MIT 'GenAI Divide' study (July 2025; 52 executive interviews, 153 leader surveys, 300 public deployments): 95% of enterprise GenAI pilots delivered no measurable P&L impact. Only 5% integrated AI into workflows at scale versus 40% who 'deployed tools'. The successful 5% shared workflow integration, customised/learning-capable systems, and back-office focus (document automation, procurement, risk review).
  SOURCE: https://finance.yahoo.com/news/mit-report-95-generative-ai-105412686.html
- Moffatt v Air Canada (2024 BCCRT 149): the tribunal rejected the argument that the chatbot was a separate entity and held the company liable for negligent misrepresentation by its own AI. Not binding in England & Wales, but Pinsent Masons' assessment is that UK courts would likely look to the deploying business to accept liability.
  SOURCE: https://www.pinsentmasons.com/out-law/news/air-canada-chatbot-case-highlights-ai-liability-risks
- AI scribe evidence base (the best-studied AI business-software category): Permanente Medical Group deployed across 7,260 physicians and 2.57m encounters; measured benefit is modest — 13.4 fewer minutes EHR time, 16 fewer minutes documentation, 0.49 extra weekly visits. Modern LLM ambient scribes report ~1-3% error rates versus 7-11% for legacy speech recognition, but introduce hallucination as a distinct failure mode.
  SOURCE: https://catalyst.nejm.org/doi/full/10.1056/CAT.25.0040
- Awaab's Law (in force 27 October 2025) requires social landlords to investigate significant damp and mould hazards within 10 working days and give tenants a written summary within 3 working days of concluding, with clear records of compliance attempts; requirements expand to further hazard categories during 2026. The hard part is the clock and evidence chain — deterministic CRUD, not AI.
  SOURCE: https://www.gov.uk/government/publications/awaabs-law-guidance-for-social-landlords/awaabs-law-guidance-for-social-landlords-timeframes-for-repairs-in-the-social-rented-sector
- Document extraction is production-grade at field level but not line-item level: header fields (supplier, invoice number, date, total) hit 97%+, model accuracy on scanned invoices clusters at 90-94% and 96-98% on text-native PDFs, but line-item extraction on real supplier bills still requires human review — a limitation acknowledged even in Xero-ecosystem sources describing Xero's own native capture.
  SOURCE: https://www.receipt-bot.com/blog/xero-feature-deep-dive-new-features-in-xero-for-2026

## GAPS
**Verified with high confidence:** Anthropic pricing and the vision token formula (primary source, arithmetic mine and reproducible); ICO fees (ICO's own site); EU AI Act dates/Article 50 scope (EC guidance + three law firms, mutually consistent); MTD ITSA thresholds (multiple independent UK accounting sources); RICS AI standard (RICS announcement + two law firms); UK has no AI Act (House of Commons Library); Awaab's Law timescales (GOV.UK).

**Medium confidence — verify before betting on:** (1) The **Bluevine 2026 SMB AI spending figures** (28% at $25–99/mo; only 17.7% have paid for AI) — direct fetch was **proxy-blocked**, figures come from a search extract. These are the most price-decision-relevant numbers in the report and deserve 10 minutes of direct verification. (2) **SurveyorSuite's £35/month and RICS-compliance claims** — also proxy-blocked, search extract only; this is my single best proof-of-shape data point so it should be checked directly. (3) Competitor pricing sourced from Capterra/ITQlick/GetApp — these sites are frequently stale and often show US pricing for UK products; treat as directional only. (4) Agentic reliability percentages (18–24% multi-step) — direction corroborated across several sources, exact figures from one aggregator.

**Unverified, flagged in-report:** Stripe UK card fees (quoted ~1.5% + 20p from memory); UK VAT registration threshold (believed £90,000 — immaterial at £28k/yr revenue but should be checked); **ASR/speech-to-text per-minute pricing for 2026 — a genuine hole**, since transcription cost likely dominates the LLM cost in any voice product and I priced only the LLM side (~1.8p per 15-min consultation); FX rate ($1.30/£1 assumed throughout).

**Could not find at all — and these matter:** (1) **Any audited or verifiable revenue disclosure for a one-person AI vertical tool.** The abundant indie-hacker MRR content ("$1K–$200K MRR", "average micro-SaaS earns $1,735 MRR") is self-reported, unauditable, survivorship-biased content marketing with no locatable methodology. I deliberately excluded all of it rather than launder it into evidence — this means the report has **no direct proof that a solo founder reaches £2,335/month with this product shape**, only proof of prices charged and buyers compelled. (2) **Churn data for small vertical AI tools** — the number that actually determines whether 48 customers at £49 is stable or a leaky bucket. Given G2's finding that ~70% of buyers are pushing toward shorter contracts because of AI's pace, and that a third of SMBs spend nothing on AI, I'd plan for 5–7% monthly churn (≈55–60 gross adds to hold 48), but that is inference, not evidence. (3) **Direct evidence that UK surveyors/gas engineers/landlords will pay for compliance tooling** — the RICS and MTD mandates are real and dated; the willingness to pay is inferred from adjacent price points.

**Biggest judgement call:** I am confident the capability is production-ready and the unit economics work (86–88% gross margin at target scale on sensible model choice). I am much less confident any specific niche contains 48 reachable buyers at £49/month, and no further desk research resolves that. The evidence points toward compliance-mandated niches specifically because those buyers are *compelled* rather than merely interested — but 20 phone calls will beat another week of searching.