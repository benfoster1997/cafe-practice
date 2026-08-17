# App project status — read this first in any new session

Last updated: 17 Aug 2026, ~14:45 UTC. Branch: `claude/youtube-ai-monetization-study-4ipk3c`.
The contract is `docs/APP_MISSION_BRIEF.md`. Owner communication style:
direct, honest, no sugar-coating (see CLAUDE.md).

## Where we are in the mission-brief stages

- ✅ **Stage 1 (market research)** — done. 12-agent workflow (6 dimensions +
  6 adversarial fact-checks). Condensed: `app/research/MARKET_FINDINGS.md`.
  Full reports: `app/research/reports/stage1-*.md`.
- ✅ **Stage 2 (opportunity selection)** — 16 candidates scored:
  `app/research/OPPORTUNITY_SCORING.md`.
- ✅ **Stage 2b (competitor deep-dive on 3 finalists)** — all three killed.
- ✅ **Stage 2c (round-two validation)** — re-run 17 Aug after the earlier
  workflow died at context-clear. **ALL THREE KILLED**: party-wall/RICS-AI
  workflow (exact incumbent at £35/mo), funeral-director software (core
  pricing premise factually false; £11/funeral incumbent), Martyn's Law
  enhanced tier (procurement wall + exact £29/mo clone + government
  anti-vendor stance). Verdicts + sharpened lesson:
  `app/research/KILL_LEDGER.md`. Full reports:
  `app/research/reports/round2-*.md` (each ends with a verify-in-browser
  list — vendor sites were egress-blocked, claims rest on search extracts).
- ✅ **Stage 2d (fallback shortlist)** — owner confirmed **no real-world
  industry access** ("i cant walk into any"). DWTS waste-carrier capture
  tested on four independent dimensions — **all four KILL**; letting-agent
  repack **KILL**. Total: **8 concepts, 8 kills.** See `KILL_LEDGER.md`.
- ✅ **Strategy fork analysis** — 5 paths + a completeness critic. Output:
  **`app/research/STRATEGIC_POSITION.md` — the decision document. Read it
  before anything else.** Reports: `reports/strategy-*.md`.
- ⏸️ **Stage 3+ (spec → build)** — **BLOCKED, deliberately.** Not blocked
  on a better niche; blocked on the owner deciding a path and, per the
  recommendation, on a customer conversation happening before any code.

## THE POSITION (as at 17 Aug 2026)

The category we searched is structurally closed to this founder profile:
the AI-clone swarm reaches any keyword-discoverable niche, the state
prices compliance tooling at zero, liability-grade documents make buyers
*more* vendor-conservative (moat → wall), and **the search method itself
was the flaw** — "what regulation is coming?" is the query every clone
builder runs.

Honest odds (24 months to £2,335/mo): ~2-4% on the current plan; ~15% by
some route **if selling starts within 30 days**; ~2% and falling if the
next three months look like the last five.

**Recommendation delivered to owner: stop researching, test whether the
owner will actually do outbound — 14 days, ~£35, ~200 approaches, one
question, no pitch.** Gate rules and the first-90-days plan are in
`STRATEGIC_POSITION.md` §3.

**Do NOT launch a ninth concept-validation workflow.** The last eight
answered a question that was never the binding one.

### Open items needing the owner (not blocking Claude's next action)

1. Owner's real availability — Claude *assumed* a day job + evenings and
   fed that to the strategy agents; it is recorded nowhere in the repo and
   several conclusions lean on it. Correcting it changes the ranking.
2. Employment contract IP-assignment / moonlighting clauses (would kill
   the software path, not the service path).
3. Whether daytime hours can be freed — contracting at ~£390-470/day hits
   the target with ~6 billed days/month, more reliably than any path here.
4. Browser-verify: ONS business-population split; whether Start Up Loans
   fund acquisitions; any kill-ledger vendor price before acting on it.

## The selection criteria (validated the hard way — do not relax)

Six filters from Stage 1 (buyer without procurement; async; recurring
duty; enumerable prospects; no free gov/association tool; no
platform-subsidised incumbent) PLUS, from six kills:

- The moat must be un-clonable by a weekend AI build — but **round two
  proved "liability-grade documents" is NOT such a moat for us**: where
  documents carry statutory/personal liability, buyers become more
  vendor-conservative and buy incumbents/consultants/nothing. What
  survives for a no-track-record founder: a maintained dataset, a
  fulfilment component, or the owner's real-world access.
- The swarm reaches even ~1,000-person statutory niches (party wall: 5
  tools) and pre-enforcement regimes (Martyn's Law clone 8 months before
  commencement). Any statute with a name journalists use is swarmed.
- Re-verify carry-over premises before seeding new concepts on them (the
  funeral concept died on a false "quote-only/£400+" premise one search
  disproved).

## Key economics (verified, from MARKET_FINDINGS.md)

Target = £2,335/month pre-tax ≈ 24-30 customers at £79-99. Running costs
~£150/month all-in at scale. Stripe direct, no MoR. Sole trader first,
incorporate ~10 customers. Churn maths: at 5%/month, ~2.5 new
customers/month forever; prefer £99 × 24 over £49 × 48. Realistic
timeline to target: 12-24 months from first customer. P(success) single
digits to ~10% — honest expectations, owner has accepted this framing.

## Session-environment notes

- Egress proxy blocks gov.uk, ico.org.uk, stripe.com, most vendor pricing
  pages — research via search extracts; owner verifies critical figures in
  a browser before money commits.
- WebSearch budget ≈ 200/session shared with subagents — budget agent
  prompts (~14 searches each).
- Background workflows die if the session idles — hold the turn open with
  blocking `TaskOutput` calls (thrice-learned: 10 Aug, 17 Aug ×2).
- Other projects: YouTube parked (`channel/STATUS.md`), trading bot on its
  own branch. Do not touch either without owner instruction.
