# FX Desk status - read this first in any new session

## CLOSED on 19 Nov 2026, at the owner's request

The owner asked how confident Claude was in the app's win rate, was told
plainly (the rules did not pass their test: 37 to 40% winners, about zero
per trade on 89 trades in six years), and chose to switch it off and keep
the code. **Do not resume, redeploy or work on FX Desk unless he asks.**

- The live site https://fx-desk-ict.netlify.app now serves one static page
  ("FX Desk is closed", `closed/index.html`). `netlify.toml` publishes only
  that folder and deploys no functions, so the scanner does not run and no
  notification is sent. That page also tidies his phone when opened: it
  forgets the saved passcode, gives up the notification address and removes
  the background script.
- Nothing was deleted. The app (`app/`), the shared rules (`core/`), the
  backtest, the research and the simulated-iPhone rig are as they were at
  commit 06044ed. His stored data (passcode hash, price-feed key, settings,
  notification signing key) is still in the site's storage, but with no
  functions deployed nothing can read it from outside. Deleting the site in
  his own Netlify account would erase it for good; Claude cannot do that.
- To bring it back: `git show 06044ed:fxdesk/netlify.toml >
  fxdesk/netlify.toml`, then deploy as under "Deploying" below (the owner
  must say yes to the deploy). The signing key is unchanged, but his phone
  will have given up its notification address, so he would turn
  notifications on again.

Everything below this line is the record as it stood on 15 Nov 2026, when
the app was live. It is history, not a to-do list.

Last updated: 15 Nov 2026, about 01:00 UTC. Branch
`claude/youtube-ai-monetization-study-4ipk3c`. Everything is committed and
pushed. (CLAUDE.md says trading work goes on
`claude/mt5-xauusd-iphone-bot-ndfkda`; this session was restricted to the
branch above, so FX Desk lives here in `fxdesk/`. The old `backtest/`
Python engine is untouched.)

## RESUME HERE

**Where things stand (written 15 Nov 2026, early hours UTC).** The
notification review is finished and written up at the end of
`fxdesk/research/REVIEW.md`: 28 distinct issues, 4 high, all dealt with or
documented; then a review of the fixes themselves found 26 smaller ones
(none high), also dealt with. Everything is committed and pushed. 95 tests pass
(`node --test 'fxdesk/app/test/*.test.ts' 'fxdesk/core/test/*.test.ts'`).

**1. DEPLOY STATE.** Both rounds of fixes are LIVE. Round one (commit
a95efbc, the 28 issues) went live on 15 Nov 2026 at about 00:05 UTC; round
two (commit e311799, the 26 findings in "Review of the fixes" at the end of
`research/REVIEW.md`) at about 00:54 UTC (Netlify deploy
6af902938b07578b0126ec38). The owner said yes to each. Checked after each:
`/api/status` returns the same `pushKey`, the page served is the committed
one, `/manifest.json` and `/sw.js` answer correctly, the locked routes
refuse without a passcode. The scheduled scanner ran and recorded its
scan on round one at 00:15 UTC and on round two at 01:00 UTC. Nothing is
waiting to be deployed.

**2. Find out how the owner's setup went.** Ask him, or look:
`curl https://fx-desk-ict.netlify.app/api/status` shows `claimed` (true
since 14 Nov) and `scannerLastRan`. Everything else needs his passcode,
which Claude must never ask for. His steps, in order (GUIDE.md has them
click by click):
   a. passcode - DONE 14 Nov;
   b. free Twelve Data key pasted into Setup - not confirmed;
   c. Safari, Share, Add to Home Screen (Open as Web App ON), open from the
      icon, passcode again;
   d. Setup, Turn on notifications, Allow - a notification should arrive;
   e. Settings, Focus and Settings, Notifications, FX Desk (GUIDE step 5),
      so that an alert makes a sound;
   f. Setup, "Test from the scanner", lock the phone, wait up to 15
      minutes. This is the first proof that the scheduled scanner can reach
      his phone; until it has worked once, that route is unproven;
   g. (optional) send the MT5 demo screenshot to confirm broker clock.
If (d) or (f) fails, that is the first real-iPhone test of this feature:
get the exact words on his screen. The red text carries Apple's reason. The
app no longer retries in a loop: it waits five minutes after a failure.

**3. One decision is still his:** SPEC section 9 "Real money" (proposed:
no funding on a demo record alone for rules that failed the backtest).
The app shows live trading as locked until he decides.

**Do not:** regenerate the notification signing key (blob key `vapid`);
open the sealed 2021-2026 data; describe the rules as anything but
"did not pass"; add a custom domain to the site without re-testing on the
phone (it changes the address notifications open); deploy without
`/sw.js`. Keep agent fan-out small: his usage limit was hit once.

### Deploying

Ask the Netlify connector for `deploy-site` with site id
`81fd0cc6-186b-4738-885a-c3dbabad0cb5`, then run the `npx @netlify/mcp`
command it returns from inside `fxdesk/`. The command's token expires
after roughly half an hour; ask for a fresh one each session. The session's
safety check may refuse the deploy command until the owner has said yes in
that conversation: ask him, do not work around it. Afterwards check
`/api/status` (must still return the SAME `pushKey`, starting
`BLuaTJbMeTY3`), `/manifest.json` and `/sw.js`.

### How notifications work now (read `app/lib/push.ts` and `store.ts` headers)

- Blob keys: `vapid` (signing key, never replaced), `push` (devices, each
  with `lastOk` and `fails`; `warn`; `lastFail`), `outbox` (notes Apple has
  not accepted yet, plus `missed`), `checkin` (`day`, `at`, `problem`),
  `scantest` (a scanner test the owner asked for; only the scheduled
  scanner answers it).
- A note is written to `outbox` BEFORE the first attempt and removed only
  when Apple accepts it; every scan (weekends too) sends what is waiting. A
  note past its `until` becomes `missed` and shows red for two days. Notes
  are kept while a phone that has been reached before has no address (it
  is reconnecting); nothing is kept for a phone never reached.
- Each send: one attempt of up to 4 s, and one more a second later if the
  answer may pass (no answer, 429, 5xx). "Gone" answers (404, 410,
  BadWebPushToken, VapidPkHashMismatch) delete the address; the page then
  asks the iPhone for a new one by itself (`registerLoud` in index.html).
- The scan plans to finish in 27 s of the platform's 30 (`BUDGET_MS`).
- Check-in: first scan in 01:45-02:45 New York, weekdays. A fault lasting
  two scans is pushed at any hour, once, then "FX Desk is running again".
  A feed is "stale" when any pair's newest candle is over 90 minutes old
  while the market is open.
- The page never retries registration faster than once in five minutes by
  itself (`RETRY_MS`); buttons always act at once.

### Tests and the simulated iPhone

`fxdesk/app/test/*.test.ts` need nothing: `push.test.ts` (the sender),
`scan.test.ts` (the real `runScan` with storage, clock, feed, rules and
Apple replaced through its `deps` argument), `messages.test.ts` (what he is
told, on hand-made tickets). The simulated-iPhone run used a throwaway
harness that is now KEPT in the repo: `fxdesk/research/phone-rig/`
(`./run.sh` runs all 28 scenarios in about four minutes; `./run.sh happy
deadAddress` runs two). It is a Node server that imports
`app/netlify/functions/api.mts` with `@netlify/blobs` swapped for a JSON
file via a loader hook and `fetch` to `*.push.apple.com` answered locally
(a file picks Apple's answer: ok, gone, refuse, down), driven by Playwright
at iPhone size with `navigator.standalone`, `Notification` and
`serviceWorker` stubbed. It counts requests per route, which is how the
runaway loop was measured (796 requests in six seconds before, 1 after).
It needs Playwright with Chromium, which Claude's cloud sessions have.

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
   Notifications are web push (`app/lib/push.ts`, `app/lib/store.ts`,
   `app/public/sw.js`, `app/public/manifest.json`). LIVE since 14 Nov;
   reviewed and reworked on 14-15 Nov (`research/REVIEW.md`, last section).
   **Never tested on a real iPhone.** One real request to Apple with a
   made-up device address returned `400 BadWebPushToken`; that does not
   prove Apple accepts our signature (it may check the address first). The
   owner's first "Turn on notifications" is the first real test, and his
   first "Test from the scanner" is the first proof of the scheduled route.
   Safeguards: every note is re-sent until Apple accepts it or it goes out
   of date; a check-in every weekday morning; "FX Desk has a problem" /
   "running again" notices; red boxes in the app for a dropped link, a
   refusal, alerts switched off, a missed check-in, a note not yet
   delivered, an alert that never arrived; automatic re-registration with
   a new address when Apple drops the old one; two test buttons and a
   reset tool. Telegram remains in Setup as an optional backup.
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
