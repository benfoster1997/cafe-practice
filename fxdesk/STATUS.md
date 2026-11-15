# FX Desk status - read this first in any new session

Last updated: 15 Nov 2026, about 00:10 UTC. Branch
`claude/youtube-ai-monetization-study-4ipk3c`. Everything is committed and
pushed. (CLAUDE.md says trading work goes on
`claude/mt5-xauusd-iphone-bot-ndfkda`; this session was restricted to the
branch above, so FX Desk lives here in `fxdesk/`. The old `backtest/`
Python engine is untouched.)

## RESUME HERE

**Where things stand (written 15 Nov 2026, early hours UTC).** The
notification review is finished and written up at the end of
`fxdesk/research/REVIEW.md`: 28 distinct issues, 4 high, all dealt with or
documented. The fixes are committed and pushed. 85 tests pass
(`node --test 'fxdesk/app/test/*.test.ts' 'fxdesk/core/test/*.test.ts'`).

**1. DEPLOY STATE - check this first.** The fixes went live on 15 Nov 2026 at
about 00:05 UTC (commit a95efbc, Netlify deploy 6af8f750ab72df734d4ee543),
after the owner said "deploy". Checked afterwards: `/api/status` returns
the same `pushKey`, the page served is the committed one, `/manifest.json`
and `/sw.js` answer correctly. A last pair of reviewers was still checking
the fixes themselves at that moment (`research/workflows/06-push-fix-review.js`);
see "Review of the fixes" at the very end of `research/REVIEW.md` for what
they found and whether it has been applied and redeployed. If that heading
is missing, the session ended first: run the script again (two agents,
about 25 minutes) against the current code.

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
  `settings.testDue` (a scanner test the owner asked for).
- A note is written to `outbox` BEFORE the first attempt and removed only
  when Apple accepts it; every scan (weekends too) sends what is waiting. A
  note past its `until` becomes `missed` and shows red for two days.
- Each send: one attempt of up to 4 s, and one more a second later if the
  answer may pass (no answer, 429, 5xx). "Gone" answers (404, 410,
  BadWebPushToken, VapidPkHashMismatch) delete the address; the page then
  asks the iPhone for a new one by itself (`registerLoud` in index.html).
- The scan plans to finish in 27 s of the platform's 30 (`BUDGET_MS`).
- Check-in: first scan in 01:45-02:45 New York, weekdays. A fault lasting
  two scans is pushed at any hour, once, then "FX Desk is running again".
- The page never retries registration faster than once in five minutes by
  itself (`RETRY_MS`); buttons always act at once.

### Tests and the simulated iPhone

`fxdesk/app/test/*.test.ts` need nothing: `push.test.ts` (the sender),
`scan.test.ts` (the real `runScan` with storage, clock, feed, rules and
Apple replaced through its `deps` argument), `messages.test.ts` (what he is
told, on hand-made tickets). The simulated-iPhone run used a throwaway
harness that is now KEPT in the repo: `fxdesk/research/phone-rig/`
(`./run.sh` runs all 22 scenarios in about three minutes; `./run.sh happy
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
