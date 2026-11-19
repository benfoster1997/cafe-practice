# Stage 1 — Market intelligence: verified findings that constrain the build

Condensed from the 12-agent workflow of 17 Aug 2026 (6 researchers + 6
adversarial fact-checkers). Confidence noted where it matters. Full reports
archived in the session transcript; corrections from fact-checkers applied.

## Base rates (the honest frame)

- ~70% of launched micro-SaaS never clear ~$1,000 MRR; the target
  (£2,335/mo ≈ $3,000) sits in roughly the top 10–20% of outcomes that
  *have* revenue. Survivorship bias means true odds are worse than any
  published figure. Estimated P(success) for this profile: single digits
  to ~10% — a judgement, not a statistic.
- Realistic timeline: first paying customer 2–4 months; £2,335/month
  **12–24 months**, and only with churn under control. Anyone promising
  faster is selling something.
- The binding constraint is distribution, not build quality. Claude removes
  build cost; it cannot remove customer discovery, trust, or churn.

## The six filters every idea must pass (each backed by evidence)

1. **Buyer has staff/revenue but NO procurement function** — SOC 2 Type 2
   costs $20–35k/yr; mid-market RFPs demand it; therefore sell only to
   businesses where the owner buys with a card.
2. **A statutory/professional duty forces the purchase** — discretionary
   SMB spend churns; compelled spend retains.
3. **The duty RECURS** — one-off deadlines (ECCTA, 18 Nov 2026) make dead
   products; rolling duties (certificates, quarterly filings) make retained
   ones.
4. **Price-ladder hole at £49–99** — UK vertical software barbells: dense
   floor £10–35, dense ceiling £95–500+; the middle is empty in several
   verticals.
5. **Prospects enumerable** — a public register/directory you can work
   through by hand beats an unreachable "huge market".
6. **No £0 competitor** — in UK compliance software the state itself ships
   free portals (HMRC MTD tool, DEFRA waste portal, Companies House filing
   tool); banks bundle software free. Never sell the mandated submission —
   sell the workflow around it.

## Distribution (the decisive constraints)

- **PECR splits the UK market**: ~63% of UK businesses (sole traders +
  ordinary partnerships) may NOT be cold-emailed without consent; ~2.1m
  limited companies may. Companies House lookup = practical legality filter.
  Cold calls require TPS/CTPS screening (a legal duty). Max PECR penalty
  rose to £17.5m/4% in Feb 2026. ICO fee (£47–52/yr) is mandatory.
- **Channel maths** (US benchmarks, UK unknown — plan conservatively):
  cold email ≈ 0.5–2% positive reply → thousands of sends per 10 customers;
  phone ≈ 25–45 dials/meeting; cold-booked meetings close WELL below the
  20–30% inbound-demo benchmark (fact-checker correction). Partner leverage
  beats both: one accountant/association with 80 clients ≈ the whole
  customer target.
- **Dead channels for this profile**: SEO year one (AI Overviews cut
  position-1 CTR up to ~58%; ~69% zero-click), Product Hunt, paid ads
  (CAC $200–600), Shopify apps (median new-app revenue $0), automated
  LinkedIn (PECR-exposed).
- **Conversion levers that matter**: card-upfront trials convert ~3× opt-in
  (fewer trials though — use with a sales conversation, not instead of one);
  founder onboarding within hours measurably lifts conversion; annual
  billing correlates with ~⅓ the churn (self-selection, but still worth
  defaulting to).

## Economics (verified enough to build on)

- All-in running costs: ~£25/mo infrastructure (Hetzner/Neon/Resend/
  Sentry-free/Cloudflare), ~2.6% of revenue Stripe (UK cards + Billing
  0.7%), ~£50/mo amortised compliance (ICO fee, PI insurance £150–350/yr,
  templates), plus the Claude subscription. Total ~£150/mo at target scale
  including AI tooling; ~90% operating margin. Infrastructure is never the
  constraint.
- **Stripe direct, no Merchant of Record**: UK B2B under the £90k VAT
  threshold has no VAT problem to outsource; MoR costs ~3.2pp more. B2B
  reverse charge for EU business customers. Avoid B2C entirely (EU VAT from
  first consumer sale).
- **Sole trader first, incorporate at ~10 customers** or first uncapped
  liability clause (2026 dividend-tax rise pushed the tax break-even to
  ~£40–50k profit; incorporation is for liability, not tax).
- Churn decides everything: at 5%/mo, 48 customers needs ~2.4 new/month
  forever; at £99×24 with lower churn the treadmill halves. **If the pain
  can't carry £99, treat that as evidence, not a pricing decision.**
- LLM unit costs are a rounding error IF architected sanely (Haiku/Sonnet
  with downsampled images ≈ 0.5–2p/document; £68–180/mo at full scale) —
  but flat pricing needs a fair-use cap, and thinking-off/batching/routing
  matter. One naive Opus-default heavy customer can be margin-negative.

## AI capability truth (what we may promise)

- Production-ready: field-level document extraction (97%+ headers),
  long-context analysis, image description, voice-to-structured-record.
  NOT ready: line-item perfection, multi-step autonomous agents (~20-25%
  end-to-end on 2024-era benchmarks; fact-checker: no credible 2026 public
  benchmark shows production-grade multi-step reliability). Product shape
  = confidence-gated review queue with human sign-off, never a magic box.
- Defensible AI product traits (MIT study + market evidence): owns the
  boring workflow end-to-end; produces a compliance artefact someone must
  hold; named human sign-off; niche too small for platforms; accumulates
  customer-specific data. Doomed: standalone "AI does X" wrappers —
  platforms ship them free (Claude file creation is free-tier now; Xero
  ships native capture + agent builder).
- UK-only selling keeps us out of EU AI Act scope in year one (Article 50
  transparency is live for EU users; UK has no AI Act).
- Insurance: 2025–26 London-market policies are adding AI exclusions and
  ~10% sublimits — get a PI quote and read the AI wording BEFORE customer
  one; cap contract liability at 12 months' fees.

## Corrections log (what the fact-checkers changed)

- RRA penalties: **up to £7,000 initial / up to £40,000 or criminal** for
  serious/repeat breaches (the "£5,000" figure was from another regime) —
  the forcing function is STRONGER than first reported.
- MTD April-2026 wave ≈ **780k** (not 864k); ~400k unregistered near the
  first deadline is plausible but unverified.
- ERA shift-rights and unfair-dismissal changes are **2027**, not 2026;
  guaranteed-hours regulations are not final.
- Payrolling BIK 2027 covers ALL benefits except loans/accommodation
  (scope was inverted in research).
- The "£70k exit valuation" claim was overstated — small products sell at
  ~2–3× SDE, so ~£40–55k at target. Still a real asset.
- Bluevine SMB AI-spend stats are internally contradictory — not used.
- Nursery/funeral "population" counts were directory listings, not
  registers — direction fine, precision spurious.
- Shopify/Xero marketplace statistics contained irreconcilable figures —
  only the direction (power law, median ≈ £0; Xero smaller but now charges
  developers) is retained.
