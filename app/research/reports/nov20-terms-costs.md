# The rules and running costs of paid client work with Claude, for one person in the UK

Date: 20 November 2026. Scope: a narrow evidence check on the standing recommendation (the quote-writing service at £395 a month). This is not a search for new ideas.

Source labels: **primary** (Anthropic's own terms, docs and price pages; the ICO; gov.uk; legislation.gov.uk; a firm's own price page), **independent** (law firms, press, academic work), **vendor_or_seo** (marketing pages: direction only), **inference** (my own reasoning).

How this was checked. I used 11 of the 12 permitted searches. I opened these pages directly today: Anthropic's Consumer Terms, Usage Policy, Commercial Terms, Privacy Policy, Data Processing Addendum and price page; the Claude Code docs; the ICO; legislation.gov.uk; gov.uk; Stripe; GoCardless; PolicyBee. The Consumer Terms and the Usage Policy were read as full page text, so those quotes are exact. Most other pages came through a reader that returns short quotes, so those quotes are short. These pages did not open (error 404): three support.claude.com articles on plan prices and usage, one GoCardless help page, and one gov.uk campaign page. Where I relied on a search extract only, I say so.

I am not a lawyer. The data protection and contract points below are my reading of the official guidance. Where a point matters, it is marked as inference.

## Bottom line

1. **Clear with conditions.** Nothing in Anthropic's terms stops him selling quotes drafted with Claude on a Pro or Max plan. Anthropic gives him its rights in the output.
2. **The real condition is client data.** A Pro or Max plan comes with no data-processing contract. So end-customers' names and addresses must stay out of Claude, or the work must move to the pay-as-you-go API or a Team plan.
3. **He must tell each contractor, in writing, that AI drafts the quotes.** The phrase "Claude behind the curtain" in the plan should go.
4. **The top model and ultracode are not needed to draft a quote.** The cheapest paid plan (US$20 a month plus VAT) should be enough. That is my estimate. Anthropic publishes no exact limits.
5. **First-year running costs are about £300 to £750** on top of whatever Claude plan he already pays for. HMRC registration is not needed before the first client.

## Q1. Anthropic's terms

**Which terms apply to him.**

- Anthropic's legal index says the Consumer Terms are the "Terms governing individual use of Claude Free, Pro and Max plans", "including usage of Claude Code and Claude Cowork through those plans". The Commercial Terms are the "Terms governing commercial use of Claude API and Claude for Work (Teams and Enterprise plans)". Source: [anthropic.com/legal](https://www.anthropic.com/legal) (primary).
- The Claude Code docs say the same: "Consumer Terms of Service - for Free, Pro, Max, and Ultra users" and "Commercial Terms of Service - for Team, Enterprise, and Claude API users". Source: [Claude Code, Legal and compliance](https://code.claude.com/docs/en/legal-and-compliance) (primary).
- A naming note. "Ultra is the new name for the Max 20x plan, and Max is the new name for Max 5x." Source: [Claude Code, Feature availability](https://code.claude.com/docs/en/feature-availability) (primary).

**Do the consumer plans allow work that is sold to clients?**

- I read the whole of the Consumer Terms (effective 8 October 2025). They contain no clause that bans commercial use of a paid plan. Source: [Consumer Terms](https://www.anthropic.com/legal/consumer-terms) (primary).
- The words "non-commercial" appear once, and only about trial access: "Use of our Services for evaluation purposes are for your personal, non-commercial use only." (same page, section 2).
- The Terms also say the Commercial Terms cover API keys and the Console, and then: "For clarity, this does not include Claude.ai or Claude Pro use for individuals or entities." In plain words, even a business that uses Claude Pro is under the Consumer Terms (same page, opening section).
- So paid client work on Pro or Max is allowed, in my reading (inference from the primary text). I did not find an Anthropic page that says so in plain words. See "What I could not find".

**Who owns the output.**

- "As between you and Anthropic, and to the extent permitted by applicable law, you retain any right, title, and interest that you have in the Inputs you submit." Anthropic then assigns to him "all of our right, title, and interest" in Outputs, with the words "if any" added, and "Subject to your compliance with our Terms". Source: [Consumer Terms](https://www.anthropic.com/legal/consumer-terms), section 4 (primary).
- In plain words: Anthropic claims nothing in the quotes. He can hand them to the contractor. Whether UK copyright protects AI-drafted text at all was not researched here. It matters little for a one-off quote.
- Accuracy is his problem, not Anthropic's: "You should not rely on any Outputs or Actions without independently confirming their accuracy." (same page, section 4). This is why the plan's "he checks and sends" step is not optional.

**Restrictions that bite on a service for third parties.** All from the [Consumer Terms](https://www.anthropic.com/legal/consumer-terms) (primary) unless shown.

| Rule | Exact words | What it means for him |
|---|---|---|
| No sharing | "You may not share your Account login information, Anthropic API key, or Account credentials with anyone else. You also may not make your Account available to anyone else." | No helper, partner or contractor may use his login. One person, one account. |
| No reselling | He may not use the service "To develop any products or services that compete with our Services, including to develop or train any artificial intelligence or machine learning algorithms or models or resell the Services." | Selling a finished quote is fine. Selling a contractor access to Claude through his plan is not. |
| No bots on a plan login | "Except when you are accessing our Services via an Anthropic API Key or where we otherwise explicitly permit it, to access the Services through automated or non-human means, whether through a bot, script, or otherwise." | He types and Claude drafts: fine. A script that takes a WhatsApp message and returns a quote with no human: needs an API key. |
| No deceiving | He may not use the service "to deceive any person". | See Q5. |
| Ordinary use | "Advertised usage limits for Pro, Max, and Ultra plans assume ordinary, individual usage of Claude Code and the Agent SDK." Source: [Claude Code, Legal and compliance](https://code.claude.com/docs/en/legal-and-compliance) (primary) | One person drafting a few quotes a day is ordinary use (inference). |
| No routing others through his plan | "Anthropic does not permit third-party developers to offer Claude.ai login into their own applications, or to route requests through Free, Pro, Max, or Ultra plan credentials on behalf of their users." (same Claude Code page) | The later "notes in, quote out" tool in the plan could not run on his plan login. |

**When he would need the commercial terms (the API or a Team plan) instead.**

1. When end-customers' personal details go into Claude. See Q3. This is the one that matters now.
2. When any step is automated with a script or bot (the rule above).
3. When a second person does the work (the no-sharing rule).
4. When he builds a tool that contractors use themselves.

What the commercial terms add. Source: [Commercial Terms](https://www.anthropic.com/legal/commercial-terms), effective 17 June 2025 (primary):

- "Anthropic may not train models on Customer Content from Services."
- The customer "owns its Outputs".
- A data-processing contract comes built in: the Data Processing Addendum "is incorporated into these Terms by reference".
- They say "Services under these Terms are not for consumer use." A sole trader acting as a business can accept them, in my reading (inference; the Terms do not say so directly).

What each route costs:

- **API, pay as you go.** No seat minimum. He pays per use. My estimate for 60 to 100 quotes a month is in Q2: about US$7 to US$54 a month.
- **Team plan.** "Team plans require a minimum of two members." Standard seats are "$25 per member per month, billed monthly" or "$20 per member per month, billed annually". So the floor is US$50 a month before tax, for a second seat he does not need. Source: [What is the Team plan](https://support.claude.com/en/articles/9266767-what-is-the-team-plan) (primary).

## Q2. Plans, prices, limits, and whether the top model is needed

**Prices.** Anthropic's price page shows US dollars only and says "Prices shown don't include applicable tax". Source: [claude.com/pricing](https://claude.com/pricing) (primary).

| Plan | Price (US$, before tax) | Usage | Top model (Fable 5.2) | Claude Code |
|---|---|---|---|---|
| Pro | $20 a month, or $17 a month billed yearly ($200 up front) | "More usage than Free, every 5 hours and every week" | "Fable, paid with usage credits" (extra money, not included) | Yes |
| Max (was Max 5x) | $100 a month | "5x Pro usage every 5 hours and every week" | "Fable included, up to half your weekly limit" | Yes |
| Ultra (was Max 20x) | $200 a month | "10x Pro usage every week" and "No 5-hour limit" for verified accounts | Included, shown as "50% of weekly limits" | Yes |

- **UK pound prices: not found.** No Anthropic page I could open shows pounds. UK VAT at 20 percent turns $20 into $24. One UK guide estimates Pro at "£19.50 to £21.00" a month from exchange rates. Source: [AI Tools Review](https://aitoolsreview.co.uk/guides/claude-pro-pricing-2026-uk-guide) (vendor_or_seo; an estimate, not a checkout price). Anthropic's 2023 launch price for Pro was £18 (search extract of [Anthropic's launch post](https://www.anthropic.com/news/claude-pro), primary but old). He can see the exact figure on his own billing page.
- **"Usage credits"** are extra money on top of a plan. "Usage credits are billed at standard API rates". Source: [Extra usage for paid Claude plans](https://support.claude.com/en/articles/12429409-extra-usage-for-paid-claude-plans) (primary).
- **API list prices**, per million tokens (a token is roughly three quarters of a word): Fable 5.2 $8 in and $40 out. Opus 5.5 $4 in and $20 out. Sonnet 5.5 $2 in and $10 out. Haiku 5.5 $0.10 in and $0.50 out. Source: [Anthropic API pricing](https://platform.claude.com/docs/en/about-claude/pricing) (primary).

**Usage limits.**

- "Pro and Max plans have a five-hour session limit and a weekly limit." "Max and Ultra plans also have a separate weekly limit for Fable." "These limits are shared across Claude and Claude Code, meaning all activity in both tools counts against the same limits." Source: [Using Claude Code with your Pro or Max plan](https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan) (primary).
- Anthropic publishes no number of messages or quotes per plan. **Not found.** The price page says only: "How fast you reach a limit depends on the model you use, how long your chats are, and how large your files are."

**Multi-agent workflows ("ultracode").**

- "Dynamic workflows are available on all paid plans". "On Pro, turn them on from the Dynamic workflows row in /config." Source: [Claude Code, Dynamic workflows](https://code.claude.com/docs/en/workflows) (primary). So ultracode is not limited to the dearer plans.
- What it is: "Ultracode is a Claude Code setting that turns on automatic workflow orchestration for the session". It is built for "codebase audits, large migrations, and cross-checked research" (same page).
- What it costs: "each request uses more tokens and takes longer than the same request without a workflow", and "a session with ultracode on reaches a session or weekly limit sooner than the same work with it off" (same page).

**Is the top model at maximum effort needed to draft a quote? No.**

- In Claude Code every plan "defaults to Opus 5.5", and "No Fable model is the account-type default on any plan or provider." The default effort is medium. Of the top effort setting Anthropic says: "`max` may show diminishing returns and is prone to overthinking, so test before adopting it broadly". Source: [Claude Code, Model configuration](https://code.claude.com/docs/en/model-config) (primary).
- A quote is a one or two page document built from a voice note, a price list and a template. That is routine writing (inference). The errors that will embarrass a client are wrong prices, wrong quantities and missed scope. Those come from the contractor's facts, not from the model's reasoning depth. A bigger model does not fix a wrong measurement (inference).
- Ultracode sends many agents at one task. For a one-page quote that burns the weekly limit for nothing (inference from the primary text above).
- Fable with ultracode stays the right tool for what the repo's notes ask it for: hard build and research phases. It is the wrong tool for daily quote drafting.

**Would 60 to 100 quote drafts a month fit a cheaper plan? Probably yes on Pro. Not proven.**

My working, so it can be checked (inference, using Anthropic's prices above):

- Low case per finished quote: 10,000 tokens in, 4,000 out. On Opus 5.5 that is $0.04 plus $0.08, so $0.12. Sixty quotes: about $7 a month.
- High case per finished quote, with photos and three rounds of correction: 60,000 tokens in, 15,000 out. On Opus 5.5 that is $0.24 plus $0.30, so $0.54. A hundred quotes: about $54 a month.
- A site photo costs about 1,300 to 4,800 tokens depending on size and model. Source: [Anthropic vision docs](https://platform.claude.com/docs/en/build-with-claude/vision) (primary).
- For scale: Anthropic says the average Claude Code cost for software developers is "around $13 per developer per active day and $150-250 per developer per month". Source: [Claude Code, Manage costs](https://code.claude.com/docs/en/costs) (primary). Quote drafting is a fraction of that.
- So the work is light. Pro should carry it, and Max has five times the room. But this is an estimate, because Anthropic publishes no limit numbers.

Two practical warnings (inference):

- The limits are shared across everything on the account. A heavy multi-agent research run in the same week, like the ones in this repo, could use up the weekly limit just when a client's 24-hour quote is due. Keep client delivery and heavy research from colliding, or switch on usage credits with a small monthly cap as a safety net.
- The pay-as-you-go API has no weekly limit of this kind and costs about the same at this volume ($7 to $54 a month on my estimate). It also solves the data problem in Q3.

One thing to check, not confirmed: the price page says Max includes "$100 a month in API credits to build on the Claude Platform", and Ultra $200. If he is on Max or Ultra already, those credits might cover API-based delivery at no added cost. I could not read the footnote that sets the conditions. Which plan he is on now is not recorded in the files I read.

## Q3. Client data and UK GDPR

**His role.** There are two roles here (my reading of the ICO's guidance; inference).

- For end-customers' names and addresses in the quotes, he is most likely a **processor**. He handles them only because the contractor told him to. The ICO's own example: a printing company that prints invitations for a gym "is a processor processing the personal data only on the gym's instructions". An accountant, by contrast, is a controller because of professional obligations, which he does not have. Source: [ICO, What are controllers and processors](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/controllers-and-processors/controllers-and-processors/what-are-controllers-and-processors/) (primary).
- For his own business records (contractors' contact and billing details, his call list), he is a **controller**.

**What he needs.**

1. **A written contract with each contractor.** The ICO says that whenever a controller uses a processor "there must be a written contract". Source: [ICO, When is a contract needed](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/contracts-and-liabilities-between-controllers-and-processors-multi/when-is-a-contract-needed-and-why-is-it-important/) (primary). It must cover eight points: "Processing only on the documented instructions of the controller", "Duty of confidence", "Appropriate security measures", "Using sub-processors", "Data subjects' rights", "Assisting the controller", "End-of-contract provisions", "Audits and inspections". Source: [ICO, What needs to be included in the contract](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/contracts-and-liabilities-between-controllers-and-processors-multi/what-needs-to-be-included-in-the-contract/) (primary). In practice this is one page added to his service agreement. It applies to the free first quote too (inference).
2. **Permission before passing data on.** A processor must not use another processor "without the controller's prior specific or general written authorisation", and must "put a contract in place imposing the same Article 28(3) data protection obligations on that sub-processor" (same ICO page, primary). Both ICO pages carry a notice that the guidance "is under review" after the Data (Use and Access) Act.
3. **The ICO fee.** £52 a year for the smallest tier (turnover of £632,000 or less, or 10 or fewer staff), less £5 by Direct Debit, so £47. A controller must pay unless all of its processing is exempt. Exempt purposes include marketing its own business and keeping its own accounts and records. Source: [Data Protection (Charges and Information) Regulations 2018](https://www.legislation.gov.uk/uksi/2018/480), regulations 2 and 3 and the Schedule (primary). My reading: he may be exempt, because the customer data is handled as a processor and the rest is marketing and accounts (inference). The ICO's fee checker decides, not me. If the answer is unclear, pay the £47. The ICO says: "If you need to pay and don't pay, you could be fined." Source: [ICO, data protection fee](https://ico.org.uk/for-organisations/advice-for-small-organisations/getting-started-with-gdpr/data-protection-fee-what-you-need-to-do/) (primary).
4. **A retention rule.** UK GDPR requires that data is not kept longer than needed. A simple rule he can write into the contract: delete job files 90 days after the quote is delivered, and everything within 30 days of a client leaving (inference; the periods are my suggestion).

**Is a consumer plan (Pro, Max, Ultra) acceptable for customers' names and addresses? In my reading, no.**

- On consumer plans Anthropic acts as its own controller, not as his processor. The Privacy Policy (effective 10 September 2026) says that for UK users "the data controller responsible for your personal data is Anthropic Ireland, Limited", and that the policy "does not apply to content that we process on behalf of customers of our business offerings". It puts the duty on him: "you are responsible for ensuring you have the necessary rights, permissions, or authority to do so". Source: [Anthropic Privacy Policy](https://www.anthropic.com/legal/privacy) (primary).
- The data-processing contract exists only on the business side. The Data Processing Addendum "is incorporated into and forms part of the Anthropic Commercial Terms of Service". It says "Customer is the controller and Anthropic is Customer's processor", includes the UK transfer addendum, and promises breach notice "within 48 hours". Source: [Anthropic Data Processing Addendum](https://www.anthropic.com/legal/data-processing-addendum), effective 24 February 2025 (primary). For Team and Enterprise, Anthropic's privacy centre says "Anthropic acts as a "Processor" of the data on behalf of the customer". Source: [Anthropic Privacy Center](https://privacy.claude.com/en/articles/9267385-does-anthropic-act-as-a-data-processor-or-controller) (primary).
- So on a consumer plan he cannot get the sub-processor contract the ICO requires in point 2 (inference). A Berlin law firm reaches the same view under the EU version of the same rule: "Claude Pro and Claude Free do not include a DPA." "There is no processor agreement." Source: [Compound Law, 27 April 2026](https://compound.law/en-DE/tools/claude-business-gdpr/) (independent; German and EU law, not UK). That page says Team needs five users. Anthropic's own page says two, and I trust Anthropic's.

**Privacy settings on a consumer plan, if he uses one.**

- Training: "We may use Materials to provide, maintain, and improve the Services and to develop other products and services, including training our models, unless you opt out of training through your account settings." Source: [Consumer Terms](https://www.anthropic.com/legal/consumer-terms), section 4 (primary).
- The opt-out is not total: "Even if you opt out, we will use Materials for model training when: (1) you provide Feedback to us regarding any Materials, or (2) your Materials are flagged for safety review" (same section).
- Retention: with training allowed, a "5-year retention period". With training off, a "30-day retention period". The switch is at claude.ai/settings/data-privacy-controls. Under commercial terms it is 30 days as standard and no training. Transcripts sent with the feedback command "are retained for 5 years". Claude Code also keeps session transcripts "locally in plaintext" on his own computer "for 30 days by default". Source: [Claude Code, Data usage](https://code.claude.com/docs/en/data-usage) (primary).

**The simplest compliant way to work** (inference, built from the sources above):

1. **Keep personal details out of Claude.** No customer names, street addresses, phone numbers or emails in what he types or pastes. Use placeholders such as [CUSTOMER] and [SITE ADDRESS]. Add the real details by hand in the finished document.
2. **Watch the photos and the voice notes.** Crop out faces, house numbers and number plates, or do not upload that photo. If a voice note says "Mrs Jones at number 14", type the job details without the name and address.
3. **Turn training off** in the privacy settings. Never press thumbs up, thumbs down or the feedback command on client work.
4. **Still sign the one-page data contract** with each contractor, because he receives the real details by phone or WhatsApp and puts them in the final document himself.
5. **Lock the laptop and phone.** Transcripts sit on his own machine in plain text.
6. **If leaving details out proves too fiddly**, move delivery to the API (commercial terms, the data contract built in, no training, about $7 to $54 a month on my estimate) and name Anthropic as a sub-processor in the contract with each contractor.

With steps 1 to 5 in place, a consumer plan is acceptable in my reading, because Anthropic never receives the customers' personal data.

## Q4. Minimum UK paperwork before a first paying client

**HMRC. Nothing is needed before the first client.**

- "The trading allowance is a tax exemption of up to £1,000 a year". "If your gross income for a tax year is more than £1,000, you must register for Self Assessment", "by 5 October in the following tax year". Gross income means before expenses. Source: [gov.uk, Tax-free allowances on property and trading income](https://www.gov.uk/guidance/tax-free-allowances-on-property-and-trading-income) (primary; the page was last updated in 2019 but is the live guidance).
- "You register as a sole trader by registering for Self Assessment." "If you register late or do not register when you need to, you may get a penalty." "When you start trading you must keep records." Source: [gov.uk, Register as a sole trader](https://www.gov.uk/become-sole-trader/register-sole-trader) (primary).
- What this means at £395 a month: he passes £1,000 with the third monthly payment (inference). The deadline is then the 5 October after that tax year ends. The plan's "register as a sole trader" step in weeks 1 and 2 is allowed and free, but the law does not require it that early. He must keep records of income and costs from day one.
- A change is planned. A gov.uk campaign page says a new online service will let people earning between £1,000 and £3,000 from trading tell HMRC without a full tax return (search extract only; the page would not open). Start date: not found. Tax is still due on profit above the allowance either way.
- Profit is taxed on top of his wages. I did not work out the tax.

**The ICO fee.** £47 by Direct Debit, or £52. See Q3.

**Insurance.**

- No law I found requires professional indemnity cover for an unregulated document service (inference). The plan says buy it before client one, and I agree.
- PolicyBee quotes admin businesses "from £9.15 a month for £100,000 cover", "Based on an annual income of up to £40,000. All prices include IPT at 12%." That is about £110 a year. Source: [PolicyBee admin insurance](https://www.policybee.co.uk/admin-insurance) (vendor_or_seo; a "from" price).
- Simply Business says the cheapest tenth of consultants paid £91 or less a year in the first half of 2026. Source: [Simply Business](https://www.simplybusiness.co.uk/business-insurance/consultants-insurance/) (vendor_or_seo; search extract only).
- These are entry prices, not averages. The plan's £150 to £300 is a fair budget. I use £110 to £300 below.
- **The AI point.** PolicyBee warns: "Your insurer may include an exclusion for AI-related claims." Source: [PolicyBee, 30 April 2026](https://www.policybee.co.uk/blog/insurance-for-ai-risks) (vendor_or_seo). The law firm DAC Beachcroft says policies "tend not to explicitly cover AI-related errors or omissions" but "many PI policies may respond irrespective of whether AI formed part of the factual background", and that insurers are "focussing their disclosure requirements on how AI-enabled services are supervised and disclosed". Source: [DAC Beachcroft, 28 September 2026](https://www.dacbeachcroft.com/en/What-we-think/Professional-indemnity-insurance-risk-of-AI-hallucinations) (independent).
- The law on telling the insurer: "Before a contract of insurance is entered into, the insured must make to the insurer a fair presentation of the risk", including "every material circumstance which the insured knows or ought to know". Source: [Insurance Act 2015, section 3](https://www.legislation.gov.uk/ukpga/2015/4/section/3) (primary). In plain words: tell the insurer that AI drafts the quotes, and get it in writing that there is no AI exclusion. A policy bought without saying so may not pay out (inference).

**Payment collection.** One collection of £395 a month per client.

| Method | Fee | Cost on £395 | Source |
|---|---|---|---|
| GoCardless Direct Debit, Standard plan | 1% plus 20p, capped at £4. "Prices exclude VAT." No monthly fee for most users. | £4.00 plus VAT, so £4.80 | [gocardless.com/pricing](https://gocardless.com/pricing) (primary) |
| Stripe, Bacs Direct Debit | 1%, minimum 20p, capped at £4.00 | £3.95 | [stripe.com/gb/pricing](https://stripe.com/gb/pricing) (primary) |
| Stripe, standard UK card | 1.5% plus 20p | £6.13 | same page |
| Stripe, premium UK card | 2.8% plus 20p | £11.26 | same page |
| Stripe Billing, if used for subscriptions | a further 0.7% | £2.77 extra | same page |

Direct Debit costs about 1 percent of income, roughly £58 a year per client with GoCardless. The plan's choice of GoCardless stands.

**A business phone number.** UK guides put a virtual number that forwards to his mobile at about £3.75 to £10 a month. Sources: [Startups.co.uk](https://startups.co.uk/phone-systems/virtual-landlines/) and [Expert Market](https://www.expertmarket.com/uk/telephones/cheap-voip-providers) (vendor_or_seo; search extracts only, and it is not clear whether each price includes VAT). Call it £54 to £144 a year.

**Number screening.** The sister report prices each check of the call list against the TPS and CTPS lists at about £5 to £9, repeated every 28 days while he is calling. See `nov20-channel-law.md`, Q3.

**Realistic first-year total** (my sums from the figures above; inference):

| Item | Low | High | Note |
|---|---|---|---|
| The 14-day conversation test | £35 | £35 | The repo's figure. Not re-checked here. |
| HMRC registration | £0 | £0 | Free. |
| ICO fee | £47 | £52 | May be exempt. Budget for it. |
| Professional indemnity insurance | £110 | £300 | Entry price to the plan's upper figure. |
| Phone number | £54 | £144 | Twelve months. |
| Number screening | £5 | £100 | One check, up to a check every month. |
| Direct Debit fees | £29 | £130 | One client for 6 months, up to three clients for 9 months each, at £4.80. |
| **Total new money** | **about £280** | **about £760** | |
| Claude Pro, only if he has no paid plan now | about £235 | about £250 | Estimate from the one UK guide above. Not a checkout price. |
| **Total with Pro counted** | **about £515** | **about £1,010** | |

For scale: one client for a full year pays £4,740 (£395 times 12). Running costs are not what decides this plan. Finding the clients is.

## Q5. Does telling clients that AI drafts the quotes matter?

**Legally: no general duty, but four specific rules point the same way.**

- I found no UK law that makes a business tell its business clients that AI was used. One search found only guidance from professional bodies for lawyers and accountants. For example the Law Society advises firms to disclose AI use to clients (search extract; [MLex report](https://www.mlex.com/mlex/articles/2540589), independent). He belongs to no such body.
- **Rule 1: no false claims when selling to businesses.** "Advertising which is misleading is prohibited." The test includes whether it "deceives or is likely to deceive the traders to whom it is addressed", and the factors include the advertiser's "qualifications". Source: [Business Protection from Misleading Marketing Regulations 2008, regulation 3](https://www.legislation.gov.uk/uksi/2008/1276/regulation/3) (primary). Saying nothing is one thing. Saying or hinting "written by hand" or "written by a qualified estimator" would be a false claim (inference).
- **Rule 2: data protection.** If any customer details go to Claude, the contractor's written permission is needed first (Q3). He cannot ask for that without saying an AI service is involved.
- **Rule 3: Anthropic's own Usage Policy** (effective 12 November 2026, so eight days old). It bans using Claude "to falsely attribute content or mislead audiences about its origin". For "high-risk" work it requires that "A qualified person must meaningfully review" the result, and that the person affected "must be clearly told that AI was used to produce it". One listed high-risk area is "preparing legal documents for them to sign or file". The policy does not apply to "Business operations that do not advise or decide about a specific individual." Source: [Anthropic Usage Policy](https://www.anthropic.com/legal/aup) (primary).
  - My reading (inference): pricing a building job is not on the high-risk list. Writing fresh contract terms for a homeowner to sign is a close call. The safe line: Claude drafts the scope and the prices. The terms and conditions are the contractor's own existing wording, or a trade body's, pasted in unchanged.
- **Rule 4: the insurer** must be told (Q4).

**Commercially: telling costs some trust. Being found out costs more.**

- A 2025 study ran "13 experiments involving more than 5,000 participants". Clients trusted graphic designers 20 percent less once AI use was disclosed. Softer wording did not help: "In all cases, trust levels still declined." But the worst case was being exposed by someone else: "that's the worst possible outcome as far as trust is concerned." Source: [University of Arizona, 22 May 2025](https://news.arizona.edu/news/disclosing-ai-use-can-backfire-research-shows), reporting a paper in Organizational Behavior and Human Decision Processes (independent; a US university, not UK, not tradespeople).
- How UK trade contractors react to AI disclosure: **not found.**

**What follows for the plan** (inference):

- Tell the contractor once, plainly, in the offer and in the contract. For example: "I use AI software to draft your quote. I check every one before you see it. You approve the price before it goes to your customer."
- Sell what he is answerable for: a checked quote back within 24 hours. That is true and it is the part the client is paying for.
- The quote goes out in the contractor's name. Whether the homeowner is told is the contractor's choice. I found no law that requires it.
- The plan's opening line, "I write quotes and tender responses for contractors", is acceptable. The phrase "Claude behind the curtain" in `STRATEGIC_POSITION.md` should be dropped. Hiding it clashes with rules 2 and 4 and risks the worst trust outcome.

## What I could not find

- An Anthropic page that says in plain words that paid client work is allowed on Pro or Max. The finding rests on the absence of any ban in the Consumer Terms, read in full.
- UK pound prices at checkout for Pro, Max or Ultra.
- Any published number of messages, tokens or hours for the Pro, Max or Ultra limits.
- The conditions on the API credits that the price page lists for Max and Ultra, and whether they would cover delivery under the commercial terms.
- Whether the Claude apps accept a voice note as an audio file. Not checked. He may need to turn voice notes into text first.
- An ICO statement on whether a one-person processor has to pay the fee. The ICO pages I opened do not list the exemptions. The regulations do.
- The start date of HMRC's planned simpler reporting for trading income between £1,000 and £3,000.
- An average (not entry-level) professional indemnity premium for a one-person document service, any UK policy wording with an AI exclusion, and how many UK insurers use one.
- UK evidence on how tradespeople respond to being told AI is used.
- A UK law requiring businesses to tell business clients about AI use. One search found none. That is not proof that none exists.
- Not researched: consumer contract law for the wording of quotes sent to homeowners, the VAT position, the tax due on profits, and whether UK copyright protects AI-drafted text.
- Pages that would not open: three support.claude.com articles on plan prices and Pro usage, one GoCardless help page, and the gov.uk side-income campaign page.

## Verdict

**CLEAR_WITH_CONDITIONS**

Decisive reason: Anthropic's Consumer Terms contain no ban on commercial use and pass the output to him, and the first-year running costs are a few hundred pounds. But a consumer plan gives no data-processing contract, so the service is only compliant if customers' personal details stay out of Claude or the work moves to the API or a Team plan.

The conditions, in order of importance:

1. **No end-customer names, addresses, phone numbers or identifying photos go into Claude on a Pro, Max or Ultra plan.** Use placeholders. Or run delivery through the API under the commercial terms.
2. **A one-page written data contract with every contractor before the first quote, including the free one.** It must list the ICO's eight points and name any AI service used.
3. **Tell every contractor in writing that AI drafts and he checks.** Remove "behind the curtain" from the plan. Never claim hand-written or qualified work.
4. **Tell the insurer about the AI before buying cover, and get confirmation in writing that there is no AI exclusion.**
5. **Claude drafts scope and prices only.** Contract terms are the contractor's existing wording, unchanged. Drop "properly-termed" as a promise.
6. **One person, one login, no scripts.** Any helper, any automation, or any tool for contractors needs an API key under the commercial terms.
7. **Training switched off, and no feedback buttons on client work.**
8. **Do not use Fable or ultracode for daily quotes.** Keep a small usage-credit cap as a safety net for the 24-hour promise, and keep heavy research runs away from delivery days.
9. **Budget £47 for the ICO fee** unless the ICO's checker says he is exempt. Register with HMRC once income passes £1,000 in a tax year. Keep records from day one.
10. **Re-read Anthropic's terms just before launch.** The Usage Policy changed on 12 November 2026.
