# App project — mission brief (the contract)

Set by the owner, 17 August 2026. This is the binding brief for the software
business project. Supersedes nothing else in the repo; the YouTube project is
parked separately (`channel/STATUS.md`).

## Objective

Identify, validate, build, launch and continuously improve a software product
capable of **≥£2,000/month recurring revenue** with a credible path to
£5k/£10k/£20k+ MRR. Optimise for PAIN → VALUE → PAYMENT → RETENTION →
RECURRING REVENUE, never for impressive code, feature count, or novelty.

## Product requirements (all must hold)

1. Solves a genuine, recurring, expensive problem people already experience
2. Saves meaningful time/money or makes/protects revenue; useful repeatedly
3. Clear reason to keep paying monthly; strong retention mechanics
4. Market large enough to grow; launchable by a solo founder; minimal support
5. £2,000 MRR achievable WITHOUT thousands of customers (24–48 target)
6. Clear competitive advantage — not a generic AI wrapper
7. Describable in one sentence; WHAT → WHO → WHY understood in ~5 seconds

## Process (stages, in order — no production code before stage 7)

1 Research → 2 Product selection (15+ scored opportunities, weighted ranking)
→ 3 Validation (who pays and why; financial argument) → 4 Specification
→ 5 Architecture → 6 UI/UX → 7 MVP → 8 Testing → 9 Security → 10 Billing
→ 11 Deployment → 12 Conversion optimisation → 13 Customer acquisition.

The owner's suggested concept (AI revenue-recovery/follow-up automation) must
be validated against research, not assumed; if research finds better, build
the better one. Reject saturated markets with weak differentiation.

## Hard rules

- **Never fake functionality**: no fake stats, customers, revenue, AI
  responses, payment confirmations, or placebo buttons. Unfinished = labelled
  during dev, removed before launch.
- **Never invent facts**: no claimed demand, integrations, API abilities,
  passing tests, or customers that don't exist. Verify when uncertain.
- **AI must not be a gimmick** — it does work the user can measure, or it's
  cut. Must pass the "ChatGPT-alone" test: value comes from the system
  (persistence, integrations, monitoring, scheduling, auditability), not raw
  generation.
- **The one-feature test**: identify the single "I need this" feature and
  build it exceptionally; everything else is secondary. Do not overbuild.
- **Autonomy**: make reasonable technical/product decisions without asking.
  Ask only for: business-model-changing decisions, legal/business approvals,
  paid purchases, credentials, destructive production actions, genuinely
  incompatible strategic options.

## MVP scope (when reached)

Auth (signup/login/reset/sessions) · fast onboarding · money-relevant
dashboard · one extremely reliable core automation (idempotent, retried,
audited, working-hours/timezone-aware, never silently failing) · simple
customer/lead records · activity history · settings (business info, tone,
timing, hours, contact methods, rules, notifications) · Stripe billing
(plans, checkout, portal, up/downgrade, cancel, trial, webhooks).

## Engineering & compliance bar

Modern maintainable stack (owner is non-technical); multi-tenant Postgres
with proper FKs/indexes/tenant isolation; security fundamentals (authz,
validation, rate limiting, secrets, XSS/CSRF/SQLi, webhook signatures, audit
logs, least privilege); UK GDPR by design (minimisation, retention, deletion,
export, DPA, sub-processor list, complaints route — flag anything needing a
solicitor); tests that exercise real flows incl. browser automation and
billing; error tracking/observability with actionable alerts; secure internal
admin area; performance without over-engineering.

## Commercial bar

Value-based pricing (test £39–£199; no reflex £9.99); healthy unit economics
(AI/SMS/hosting cost per customer modelled BEFORE pricing; no £30-cost
customer on a £39 plan); serious marketing site with SEO fundamentals and the
7 landing-page answers (what/who/problem/money/why-this/trust/price);
acquisition built in, not bolted on; staged plan £0→£100→£500→£1,000→£2,000
MRR with realistic conversion assumptions; simplest sales process
(prospect → demo/trial → activation → first value → subscription → retention)
with a defined aha-moment; retention from real value; meaningful product
analytics; red-team the business before launch (churn, competitors,
platform absorption, "why not ChatGPT/spreadsheet", price too high/low,
acquisition 50% harder).

## Success criteria

Not: clean code, pretty UI, many features, passing build, being online.
Yes: a real target customer understands it immediately, signs up unaided,
reaches first value fast, gets a genuinely useful measurable result, has
reasons to keep using and paying, the economics work, the system is
reliable, and first customers are realistically acquirable.
Ultimate target: first paying customer → £500 → £1,000 → £2,000+ → £10,000+ MRR.
