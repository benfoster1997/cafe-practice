# App project status — read this first in any new session

Last updated: 17 Aug 2026, ~13:30 UTC. Branch: `claude/youtube-ai-monetization-study-4ipk3c`.
The contract is `docs/APP_MISSION_BRIEF.md`. Owner communication style:
direct, honest, no sugar-coating (see CLAUDE.md).

## Where we are in the mission-brief stages

- ✅ **Stage 1 (market research)** — done. 12-agent workflow (6 dimensions +
  6 adversarial fact-checks). Condensed: `app/research/MARKET_FINDINGS.md`.
  Full reports: `app/research/reports/stage1-*.md`.
- ✅ **Stage 2 (opportunity selection)** — 16 candidates scored:
  `app/research/OPPORTUNITY_SCORING.md`.
- ✅ **Stage 2b (competitor deep-dive on 3 finalists)** — **ALL THREE
  KILLED** with evidence, including the owner's revenue-recovery
  hypothesis. Verdicts + strategic lesson: `app/research/KILL_LEDGER.md`.
  Full reports: `app/research/reports/stage2b-*.md`.
- 🔄 **Stage 2c (round-two validation)** — was IN FLIGHT when the owner
  cleared context. Three clone-resistant concepts under adversarial
  validation: (1) party-wall/niche-surveying document workflow with RICS
  AI-standard compliance, (2) small funeral-director practice software,
  (3) Martyn's Law enhanced-tier system. See recovery instructions below.
- ⬜ Stage 3+ (validation → spec → build) — blocked on a concept surviving.

## FIRST ACTION ON RESUME — recover round-two results

The round-two workflow (run `wf_fc3e26d9-32d`, task `wtqfrcdi0`) was
running at context-clear; 2 of 3 agents mid-research, 0 results journaled.
Recovery, in order:

1. Check the journal for results that landed after the clear:
   `/root/.claude/projects/-home-user-cafe-practice/606e4021-0eab-5b80-a5b1-c5b909d6f569/subagents/workflows/wf_fc3e26d9-32d/journal.jsonl`
   — each line `{"type":"result","result":{...}}` holds a full report
   (field is `result`, NOT `value`). Save any found to
   `app/research/reports/round2-*.md`.
2. If incomplete/absent (likely — the container suspends on idle and kills
   background workflows): **re-run from the saved script**
   `app/research/workflows/round-two-validation.js` via
   `Workflow({scriptPath: "<repo path>"})`. Same-session `resumeFromRunId`
   will NOT work in a fresh session.
3. **Hold the turn open** with blocking `TaskOutput` calls until the
   workflow completes — background workflows die if the session idles
   (twice-learned lesson, 10 Aug and 17 Aug).

## Then: the decision rule (pre-committed)

- Any round-two concept scoring GO or strong-CAUTION → proceed to the
  mission brief's Stage 3: write the section-43 strategic report (20
  items), owner sees it, then spec and build begin.
- All three KILL → report honestly to the owner with: the full kill
  ledger, the next-tier shortlist (DWTS waste-carrier capture for 2027,
  agent-first compliance repack, productised-service bridge per
  `MARKET_FINDINGS.md` distribution section), and the recommendation that
  niche choice follow the owner's real-world access (ask again — it was
  declined once but is now decision-critical).

## The selection criteria (validated the hard way — do not relax)

Six filters from Stage 1 (buyer without procurement; async; recurring
duty; enumerable prospects; no free gov/association tool; no
platform-subsidised incumbent) PLUS the Stage 2b lesson: **the moat must
be un-clonable by a weekend AI build** — statutory/liability-grade document
workflows, a maintained dataset, a fulfilment component, or a news-quiet
niche the SEO swarm ignores. "Track dates and remind" products are dead on
arrival — 15+ clones appeared in landlord compliance alone within a year.

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
- Other projects: YouTube parked (`channel/STATUS.md`), trading bot on its
  own branch. Do not touch either without owner instruction.
