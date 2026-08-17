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
- ⏸️ **Stage 3+ (validation → spec → build)** — **BLOCKED ON OWNER INPUT.**
  Six concepts validated, six killed. The pre-committed all-KILL rule has
  fired: the owner has been given the honest position, the next-tier
  shortlist, and the real-world-access question (see below).

## THE OPEN QUESTION TO THE OWNER (blocking)

Reported to the owner 17 Aug: niche choice should now follow the owner's
real-world access — what industries can they walk into via work history,
family, friends, or their local area? Asked once before (declined), now
decision-critical: access/trust is the one moat the AI-clone swarm cannot
copy, and round two proved liability-grade document moats invert against
an unknown solo vendor (buyers get MORE vendor-conservative, not less).

**Do not launch further concept-validation workflows until the owner
answers or explicitly says "pick without me."** The next-tier shortlist if
they decline again:

1. **DWTS waste-carrier capture** timed for the Oct 2027 carrier/broker
   mandate — EA public register of carriers = the best cold-call list
   Stage 1 found; public beta spring 2027 is the build window; known
   hazard: DEFRA's free portal + free CSV upload (wedge must be
   driver-phone-side speed). See `reports/stage1-pain-mining.md` PAIN 2.
2. **Agent-first compliance repack** (~£79/mo × letting-agent offices) —
   weak survival case per Stage 2b (Kamma ~£0.50/property/mo, Goodlord own
   the space); only with an access edge.
3. **Productised-service bridge** — sell the outcome as a service first
   (manual + Claude behind the curtain), software second; converts the
   distribution constraint into paid customer discovery.

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
