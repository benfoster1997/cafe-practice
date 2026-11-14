# FX Desk status - read this first in any new session

Last updated: 14 Nov 2026, about 23:10 UTC. Branch
`claude/youtube-ai-monetization-study-4ipk3c`. Everything is committed and
pushed. (CLAUDE.md says trading work goes on
`claude/mt5-xauusd-iphone-bot-ndfkda`; this session was restricted to the
branch above, so FX Desk lives here in `fxdesk/`. The old `backtest/`
Python engine is untouched.)

## RESUME HERE

The owner cleared the conversation on 14 Nov with one job half-closed.
Do these in order, then tell him in plain English what happened.

**1. Finish the notification review (the only open engineering item).**
iPhone notifications were built, tested (49 tests, plus a simulated-iPhone
browser run) and DEPLOYED on 14 Nov, because the owner wanted to finish
setup that evening. A two-reviewer check against Apple / WebKit
documentation was still running when the context was cleared, so its
findings have NOT been applied.
- Results, if they survived: `/root/.claude/projects/-home-user-cafe-practice/606e4021-0eab-5b80-a5b1-c5b909d6f569/subagents/workflows/wf_c7f92814-34d/journal.jsonl`
  (one `{"type":"result"}` line per reviewer).
- If that file is gone (the container is recycled after idle time), run
  the review again: `fxdesk/research/workflows/04-push-review.js` with the
  Workflow tool. Two agents, about 20 minutes.
- The reviewers read commit 6da81ef. Hardening was added AFTER that
  (commit "notifications live"): all notes sent together with an 8-second
  cap, state merged on save, signing key written only if absent, the scan
  wrapped so notifications can never stop it, https forced for the signing
  subject and links, manifest served as `application/manifest+json`. Check
  each finding against the current code before acting on it.
- Fix what is confirmed, run
  `node --test 'fxdesk/app/test/*.test.ts' 'fxdesk/core/test/*.test.ts'`,
  redeploy (see "Deploying" below), commit, push, and write the findings
  into `fxdesk/research/REVIEW.md` under a new heading.
- A scheduled check-in ("FX Desk: finish notifications") was set to fire
  into this session at 23:38 UTC on 14 Nov with the same instruction. If
  it has fired and this is done, ignore it.

**2. Find out how the owner's setup went.** Ask him, or look:
`curl https://fx-desk-ict.netlify.app/api/status` shows `claimed` (true
since 14 Nov) and `scannerLastRan`. Everything else needs his passcode,
which Claude must never ask for. His steps, in order:
   a. passcode - DONE 14 Nov;
   b. free Twelve Data key pasted into Setup - not confirmed;
   c. Safari, Share, Add to Home Screen, open from the icon, passcode again;
   d. Setup, Turn on notifications, Allow - a notification should arrive;
   e. (optional) send the MT5 demo screenshot to confirm broker clock.
If (d) fails, that is the first real-iPhone test of this feature: get the
exact words on his screen. The red text in Setup carries Apple's reason.

**3. One decision is still his:** SPEC section 9 "Real money" (proposed:
no funding on a demo record alone for rules that failed the backtest).
The app shows live trading as locked until he decides.

**Do not:** regenerate the notification signing key (blob key `vapid`);
open the sealed 2021-2026 data; describe the rules as anything but
"did not pass". Keep agent fan-out small: his usage limit was hit once.

### Deploying

Ask the Netlify connector for `deploy-site` with site id
`81fd0cc6-186b-4738-885a-c3dbabad0cb5`, then run the `npx @netlify/mcp`
command it returns from inside `fxdesk/`. The command's token expires
after roughly half an hour; ask for a fresh one each session. Afterwards
check `/api/status` (must still return the SAME `pushKey`, starting
`BLuaTJbMeTY3`), `/manifest.json` and `/sw.js`.

### Local test rig (scratchpad, may have been wiped)

`fxdesk/app/test/*.test.ts` need nothing. The simulated-iPhone run used a
throwaway harness in the session scratchpad (`local/server2.mjs`,
`local/pushflow.cjs`): a Node server that imports
`app/netlify/functions/api.mts` with `@netlify/blobs` swapped for a JSON
file via a loader hook and `fetch` to `*.push.apple.com` answered locally,
driven by Playwright at iPhone size with `navigator.standalone`,
`Notification` and `serviceWorker` stubbed. Rebuild it if needed.

## What the owner asked for (10 Nov 2026)

A web app for his iPhone that analyses live forex data and says BUY / SELL /
NO TRADE with a suggested pair, easy to copy by hand into MT5 on iOS; demo
account first, live later. Started from scratch (he said to forget Scalp
Desk). His answers:
- Method: ICT (Inner Circle Trader), "research his best strategy".
- Style: intraday, M15 to H1. Placing: copy by hand. Alerts: he first chose
  Telegram, then on 14 Nov chose iPhone notifications instead (told plainly
  they are less dependable; Telegram stays in Setup as an optional backup).
- Broker: he will send a screenshot of his MT5 demo account (NOT YET RECEIVED).
- Later live stake: about GBP 500.

## Where things stand

1. DONE - price history: HistData M1, 7 majors, 2015 to Nov 2026, vendor
   clock corrected (it is NOT fixed EST; see `backtest/data.py`). Data is in
   `data/histdata/` which is git-ignored: rebuild with
   `python3 fxdesk/scripts/download_histdata.py data/histdata/zips 2015 2026 EURUSD GBPUSD USDJPY AUDUSD USDCAD USDCHF NZDUSD`
   then `python3 fxdesk/scripts/build_history.py <pairs>` (about 15 minutes).
2. DONE - shared TypeScript core (`fxdesk/core/`), used by backtest AND app:
   clock, candles, simulator with account rules, metrics. 34 tests:
   `node --test 'fxdesk/core/test/*.test.ts'`.
3. DONE - rulebook `fxdesk/SPEC.md`, pre-registered before any result.
   Two ICT plans, 12 configurations. `node fxdesk/backtest/run.ts selftest`
   proves no lookahead and live/backtest equivalence.
4. DONE - calibration 2015-2020, run twice (before and after the code
   review): **nothing passed** either time (`research/RESULTS.md`). Plan B
   loses clearly; Plan A is about zero on too few trades and swings with
   the price feed. Validation (2021 to mid-2023) and verdict (mid-2023 to
   Oct 2026) data are SEALED; `run.ts` refuses to open them without a named
   eligible configuration, and there is none.
5. DONE - the app is deployed: https://fx-desk-ict.netlify.app (Netlify
   project `fx-desk-ict`, site id 81fd0cc6-186b-4738-885a-c3dbabad0cb5).
   Code in `fxdesk/app/`; deploy root is `fxdesk/` (`netlify.toml`). One
   scheduled function scans every 15 minutes; state lives in Netlify Blobs
   (store `fxdesk`); the owner's keys are entered in the app's Setup screen
   and stored there, never in the repo. Live config: Plan A2, graded by A4.
   To redeploy: ask the Netlify connector for `deploy-site` with that site
   id and run the command it returns from inside `fxdesk/`.
   The one-time setup code was given to the owner in chat; only its hash is
   in `app/lib/store.ts`. If the owner loses access, delete the `auth` key
   from the blob store (or change SETUP_HASH and redeploy).
6. OWNER SETUP - see RESUME HERE above.
   Notifications are web push (`app/lib/push.ts`, `app/public/sw.js`,
   `app/public/manifest.json`): signing keys in the blob store (key
   `vapid`), subscriptions and warnings in `push`, last check-in day in
   `checkin`. LIVE since 14 Nov. Never tested on a real iPhone. One real
   request to Apple with a made-up device address returned
   `400 BadWebPushToken`, i.e. Apple objected to the address, not to the
   request or its signature. Safeguards: a check-in on the 01:45 New York
   scan every weekday (06:45 UK most of the year), a red warning when Apple
   reports a dead subscription or refuses a message, automatic
   re-registration when the app opens (proved with a visible notification),
   a test button. Telegram remains in Setup as an optional backup.
7. DONE - independent code review, 11 Nov: 27 findings, all dealt with or
   documented (`research/REVIEW.md`); decision log in `SPEC.md` section 11.
8. OWNER DECISION PENDING - SPEC section 9 "Real money": the reviewers
   showed the 40-trade demo gate alone is weak (a no-edge rule meets it
   about one time in five). Proposed: no funding on a demo record alone for
   a plan that failed its backtest. The app already shows live as locked.

## Honest position to keep telling the owner

No ICT rule set tested here or last summer has shown an edge after costs.
The app is a disciplined demo tool with an honest scoreboard, not a money
machine. Live trading stays locked behind the demo gate in `docs/PLAN.md` s.6.

## Research notes

Usage limits cut the first research round short: only two of seven web
research reports exist (`research/reports/forex-native-models.md`,
`ict-own-ranking.md`), not fact-checked. Our own measurements
(`measured-base-rates.md`, `measured-feed-differences.md`) are solid.
Workflow scripts are in `research/workflows/`. Keep agent fan-out small:
the owner's 5-hour usage limit was hit once by seven web-heavy agents.
