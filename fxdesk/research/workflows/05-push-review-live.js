export const meta = {
  name: 'fxdesk-push-review-live',
  description: 'Two independent reviews of the LIVE iPhone notification feature (platform docs, code failure modes), then a skeptic per review that tries to refute each finding against the current code',
  phases: [
    { title: 'Review', detail: '2 reviewers: platform correctness (docs) and failure modes (code)' },
    { title: 'Verify', detail: '1 skeptic per review tries to refute each finding and tests the proposed fix' },
  ],
}

const SCRATCH = '/tmp/claude-0/-home-user-cafe-practice/bfd22efe-ed07-464c-a619-7b1b09244108/scratchpad/pushreview'

const COMMON = `You are an adversarial reviewer on a private project in the git repo at /home/user/cafe-practice (the app lives in fxdesk/). Today is 14 November 2026.

CONTEXT. FX Desk is a small web app for ONE non-technical owner. He opens it on an iPhone 17 Pro Max running iOS 27. It scans forex prices on a schedule (a Netlify scheduled function every 15 minutes, hard limit 30 seconds per run) and, about once a month, issues a trade ticket he must act on within minutes. He chose iPhone notifications from the Home Screen web app INSTEAD of Telegram, after being told they are less dependable. So the feature must be as dependable as web push on iOS can be, and when it fails it must fail LOUDLY (a red warning in the app, a missed morning check-in), never silently. It has NOT been tested on a real iPhone: nobody on this project has one. The owner is doing his first real-phone setup now. Your review is the substitute for a test.

THE FEATURE IS LIVE. Review the code as it stands in the working tree (git HEAD, commit 356dc4c, deployed at https://fx-desk-ict.netlify.app):
- fxdesk/app/lib/push.ts - stores push subscriptions, creates VAPID keys once (write-only-if-absent, Netlify Blobs), builds messages in Apple's "declarative web push" JSON format, sends them with the web-push npm library's generateRequestDetails() and fetch() (8-second cap, all notes for all devices sent together), removes subscriptions the push service says are gone, records a warning, merges with freshly loaded state before saving.
- fxdesk/app/lib/store.ts - runScan(): saves results, then sends a push for each new message, plus a daily "check-in" push on the scan in the quarter hour before the London killzone (01:45-02:00 New York). checkInDue() guards it. The notification step is wrapped so it cannot stop the scan being recorded.
- fxdesk/app/lib/blob.ts - the key/value store (last write wins, plus saveIfNew).
- fxdesk/app/lib/engine.ts - scan(): builds the messages (title, body, id used as the notification tag); isCheckInTime().
- fxdesk/app/netlify/functions/api.mts - routes /api/push (register a subscription and send a hello), /api/pushtest, /api/pushoff, the push block in /api/state; /api/status (no login) exposes the VAPID public key. fxdesk/app/netlify/functions/scan.mts - the scheduled entry point.
- fxdesk/app/public/sw.js - service worker: shows a notification for every push, opens the ticket on tap.
- fxdesk/app/public/manifest.json (served as application/manifest+json via fxdesk/netlify.toml) and icons.
- fxdesk/app/public/index.html - the page: registers the service worker, syncPush() runs after every state refresh, the "Turn on notifications" button (#pushon handler in bind()), the red "alarm" warnings in viewNow(), the Setup card in viewSetup().
- Tests: fxdesk/app/test/push.test.ts and engine.test.ts (run from fxdesk/: node --test 'app/test/*.test.ts'). One real request to https://web.push.apple.com with a made-up device address came back HTTP 400 {"reason":"BadWebPushToken"}.

HARD RULES: do NOT edit, create or delete any file inside the repository; put scratch files in ${SCRATCH}/ (it exists). Do NOT deploy anything, do NOT call https://fx-desk-ict.netlify.app or any Apple push host, do NOT use GitHub, Netlify or other MCP tools, do NOT commit. Do not run anything under fxdesk/backtest. Do not spawn other agents. Be economical: stop when your checklist is done.

WHAT COUNTS AS A FINDING: something that would make a notification not arrive on his iPhone, arrive wrongly, or fail without the app saying so; a way the feature could break the scanner, run away (loops, repeated notifications, hammering the server or Apple) or expose his data; or a statement in the app or in fxdesk/GUIDE.md about notifications that is untrue. For each: file and line in the CURRENT code, the concrete situation, how you know (a quoted source with URL, a script you ran, or exact step-by-step reasoning), and the exact fix. Say plainly when something could not be established. No style points, no padding, no praise.`

const FINDING = {
  type: 'object',
  required: ['severity', 'confidence', 'file', 'summary', 'evidence', 'fix'],
  properties: {
    severity: { type: 'string', enum: ['high', 'medium', 'low'] },
    confidence: { type: 'string', enum: ['confirmed', 'likely', 'possible'] },
    file: { type: 'string', description: 'path:line in the current code' },
    summary: { type: 'string' },
    evidence: { type: 'string', description: 'Quoted source with URL, script result, or exact reasoning' },
    fix: { type: 'string', description: 'The exact change' },
  },
}
const REVIEW_SCHEMA = {
  type: 'object',
  required: ['verdict', 'findings', 'confirmed_correct', 'could_not_establish'],
  properties: {
    verdict: { type: 'string', enum: ['sound', 'fixable', 'broken'] },
    findings: { type: 'array', items: FINDING },
    confirmed_correct: { type: 'array', items: { type: 'string' }, description: 'Things you checked against a source or by running code and found right, one line each, with the source' },
    could_not_establish: { type: 'array', items: { type: 'string' } },
    owner_advice: { type: 'array', items: { type: 'string' }, description: 'Things the owner should do or know on his iPhone (settings, Focus, etc.), each with its source. Plain English.' },
  },
}
const VERIFY_SCHEMA = {
  type: 'object',
  required: ['checks'],
  properties: {
    checks: {
      type: 'array',
      items: {
        type: 'object',
        required: ['index', 'verdict', 'reason', 'fix_ok'],
        properties: {
          index: { type: 'integer', description: 'Position of the finding in the list you were given, starting at 0' },
          verdict: { type: 'string', enum: ['confirmed', 'refuted', 'uncertain'] },
          reason: { type: 'string', description: 'What you ran or read, and what it showed' },
          fix_ok: { type: 'boolean', description: 'True if the proposed fix would work and break nothing' },
          better_fix: { type: 'string', description: 'A simpler or safer fix, if there is one; otherwise empty' },
        },
      },
    },
    missed: { type: 'array', items: FINDING, description: 'Real problems you noticed that the reviewer did not list. Leave empty unless you are sure.' },
  },
}

const LENSES = [
  {
    key: 'platform',
    brief: `YOUR LENS: DOES THIS MATCH HOW iOS WEB PUSH ACTUALLY WORKS? Check the implementation against PRIMARY sources.

An earlier reviewer was interrupted. What its fetch tool returned from seven pages is saved in ${SCRATCH}/earlier-fetches.md - READ THAT FILE FIRST. It covers: the WebKit posts "Meet Declarative Web Push" and "Web Push for Web Apps on iOS and iPadOS", the Push API specification's declarative parser, Apple's "Sending web push notifications in web apps and browsers" (headers, status codes, reason strings, the user-gesture rule), WebKit's NotificationJSONParser.cpp (required members, navigate must be an absolute URL, wrong types are errors), the Safari 26 WWDC post and two searches for Safari 27. Those notes are second-hand summaries: rely on them where they quote the source directly, and do not re-fetch those pages unless a point is in doubt.

Then FIRST call ToolSearch with query "select:WebSearch,WebFetch" and spend AT MOST 10 searches or fetches on the GAPS the notes leave. Prefer webkit.org, developer.apple.com, raw WebKit source on raw.githubusercontent.com/WebKit/WebKit/main/..., the Push API / Notifications specifications, RFC 8030 / 8292, and the web-push library's own source in fxdesk/node_modules/web-push (read locally, costs nothing).

Answer each of these, with a quoted source, and for each say whether the CURRENT code gets it right:
1. Our payload (push.ts prepare()): is it a valid declarative message for WebKit given the parser facts in the notes (title, absolute navigate URL, tag as string)? What exactly can make "navigate" not absolute here (trace where the site address comes from in scan.mts and api.mts, and what push.ts does with an empty one, including the VAPID subject)?
2. When a declarative message FAILS WebKit's parser, is it dropped or handed to the service worker's push event? When it parses and a service worker with a push handler exists (ours) and "mutable" is absent, who displays it, can there be two notifications or none, and does a tap navigate or fire notificationclick?
3. Tags. We set tag to the ticket id, so "new ticket", "entry traded" and "finished" for one ticket share a tag, and two of them can be sent in the same instant; the check-in uses the fixed tag "checkin" every morning. What does iOS do with a notification whose tag matches one already in Notification Center: replace silently (no banner, no sound), or alert again? Is "renotify" supported in WebKit, in declarative push? Is a fixed daily tag a risk that the morning check-in arrives without any alert?
4. VAPID as Apple enforces it: the "sub" formats accepted, "exp" maximum, and Apple's "Don't refresh your JWT more frequently than once per hour" - the web-push library signs a fresh JWT per request; is that known to cause refusals from web.push.apple.com? What do other senders report?
5. Response handling in push.ts sendPush(): which Apple status codes and reason strings mean "this subscription is dead, delete it" (410, 404, 400 BadWebPushToken, 403 VapidPkHashMismatch ...) and which are transient (429, 5xx)? Is deleting on 404 right for Apple? Is any dead-subscription answer treated as transient or the reverse?
6. Getting permission on iOS (index.html #pushon handler, ensureSub(), syncPush()): must Notification.requestPermission() be the first awaited call in the tap handler (it is - confirm)? Does pushManager.subscribe() need a fresh tap when permission is already "granted" (syncPush() calls it on every app open; check WebKit's PushManager source)? Does Notification / PushManager exist in a Safari tab on iOS or only in the Home Screen app? Are the manifest and meta tags sufficient on iOS 26/27 where every Home Screen site opens as a web app by default?
7. Known ways iOS web push subscriptions die or notifications stop (storage eviction after weeks unused, removing the icon, restoring a backup or moving to a new phone, OS updates, Focus and Sleep modes, Low Power Mode, notification summary, the silent-push penalty) and whether our safeguards (daily check-in, warning on a "gone" answer, re-register on open) catch each. Name any failure that would still be silent. What should the owner set on his phone (Focus allow-list, etc.)?
8. Anything about iOS 26 or 27 specifically that changes the above. If you find nothing, say so.`,
  },
  {
    key: 'failure-modes',
    brief: `YOUR LENS: FAILURE MODES IN THE CODE. No web research; read the code and run small scripts (Node runs TypeScript directly: "node file.ts", .ts extensions in imports, absolute paths work; fxdesk/app/test/push.test.ts shows how to drive push.ts with an in-memory store and a fake sender). For browser logic in index.html you may extract the functions into a scratch file and drive them with stubs, or use Playwright (require('playwright') works from any directory, chromium.launch() needs no options) with navigator.standalone, Notification and serviceWorker stubbed and fetch to /api/* answered by your own handler.
Check:
1. State consistency. All state is in a last-write-wins key/value store. The scheduled scan and the owner's taps can run at the same moment. Find any interleaving in push.ts / store.ts / api.mts where a subscription just registered is lost, a warning is wrongly cleared or wrongly kept, the check-in is sent twice or never, or the VAPID key is regenerated. Give the exact interleaving.
2. The daily check-in (store.ts checkInDue and runScan, engine.ts isCheckInTime): can it be skipped on a normal trading day (the scheduled function running late or not at all in that quarter hour, the price feed failing, alerts switched off, a send that fails after the day was already marked done), and when skipped, does the owner find out WHY when he opens the app? Does it behave across US and UK clock changes? Is a check-in that says "FX Desk is running" ever sent when the scan actually failed?
3. The scanner's time budget. Work out the worst case second by second in runScan (9-second settle, feed fetch with no timeout, a possible 8-second wait and refetch, the ticket pushes, then a SEPARATE sendPush for the check-in, then Telegram with no timeout, then saving "meta"). What is lost if the platform kills the run at 30 seconds, and at which points? Tickets are marked as alerted and saved BEFORE the push is attempted: if the push then fails or the run is killed, is the alert ever retried, and does the owner find out?
4. The page (index.html): walk syncPush(), ensureSub(), registerSub(), refresh() and the #pushon handler as a state machine, step by step with the exact order of awaits, for: first visit in a Safari tab on iPhone; first open from the Home Screen icon (he re-enters his passcode there: storage is separate); permission granted and all well; permission denied; the hello notification being refused by the push service every time (server answers 502 and sets a warning); the server rejecting the subscription (400); ensureSub() throwing every time; the service worker never becoming ready; the phone's subscription vanishing while permission stays granted; the server forgetting the subscription; the VAPID key changing; two devices. Look hard for runaway loops (refresh -> syncPush -> refresh ...), repeated hello notifications, a hang that leaves the Setup card on "Checking this phone" or "Switching on" for ever, a state where the page says "On" while the server has no subscription, and anything awaited before Notification.requestPermission(). PROVE any loop by running it and counting requests.
5. sw.js: does every push event end in showNotification, even with a malformed or empty payload? Does notificationclick behave when no window is open? When the app is already open on "/" and a notification link to "/#t=<id>" is followed, does the page show that ticket (is there a hashchange handler; what does bind.jumped do the second time)?
6. Tags: which messages share a tag (engine.ts scan() and store.ts), which of them can be sent in the same scan, and what that means given that a browser replaces a notification with one carrying the same tag.
7. Security: is anything beyond the public key exposed without the passcode? Can a logged-in caller make the server post to an arbitrary address (validSub)? Is any secret written to logs or returned by /api/state? Is text from the push service shown in the page safely?
8. The messages themselves (engine.ts scan(): title and body for new ticket, entry traded, finished, skipped; store.ts check-in and problem notes): anything wrong, missing or misleading for a man who has to copy numbers into MetaTrader within minutes? And fxdesk/GUIDE.md section on notifications: is every statement true of the current code?`,
  },
]

const results = await pipeline(
  LENSES,
  (l) => agent(`${COMMON}

${l.brief}

Return the structured result: verdict for your lens, findings most severe first, what you confirmed correct (with the source), what you could not establish, and plain-English advice for the owner where a phone setting matters.`, { label: `review:${l.key}`, phase: 'Review', schema: REVIEW_SCHEMA }),
  (review, l) => {
    if (!review) return null
    if (!review.findings.length) return { lens: l.key, review, checks: [], missed: [] }
    const list = review.findings.map((f, i) => `[${i}] (${f.severity}, ${f.confidence}) ${f.file}\n    SUMMARY: ${f.summary}\n    EVIDENCE: ${f.evidence}\n    PROPOSED FIX: ${f.fix}`).join('\n\n')
    return agent(`${COMMON}

YOUR JOB IS DIFFERENT: you are the SKEPTIC. Another reviewer (lens: ${l.key}) produced the findings below. Some will be wrong: misread code, a situation that cannot occur, a source that does not say what is claimed, or a fix that breaks something else. For EACH finding, try to REFUTE it against the current code:
- read the cited lines yourself;
- where it is a claim about behaviour, reproduce it with a small script in ${SCRATCH}/ (Node runs TypeScript directly; fxdesk/app/test/push.test.ts shows how to drive push.ts with an in-memory store and a fake sender; for index.html use Playwright with stubs, require('playwright') works anywhere) and report what the script printed;
- where it rests on documentation, check the quote: ${SCRATCH}/earlier-fetches.md holds second-hand notes from Apple and WebKit pages; you may call ToolSearch "select:WebFetch,WebSearch" and use at most 4 fetches for claims the notes do not settle.
Verdict "confirmed" only if you reproduced it or the source plainly says so; "refuted" if you showed it cannot happen or the source says otherwise; "uncertain" otherwise. Then judge the proposed fix: would it work, could it break anything (remember the 30-second limit, the last-write-wins store, and that nothing here has run on a real iPhone), and is there a simpler or safer one. Spend your effort on the high and medium findings; a line each is enough for low ones.

FINDINGS FROM THE "${l.key}" REVIEWER:

${list}`, { label: `verify:${l.key}`, phase: 'Verify', schema: VERIFY_SCHEMA })
      .then((v) => ({ lens: l.key, review, checks: v ? v.checks : null, missed: v && v.missed ? v.missed : [] }))
  },
)

const ok = results.filter(Boolean)
const missing = LENSES.filter((l, i) => !results[i]).map((l) => l.key)
if (missing.length) log(`Lenses that returned nothing: ${missing.join(', ')}`)
const unverified = ok.filter((r) => r.checks === null).map((r) => r.lens)
if (unverified.length) log(`Reviews whose skeptic returned nothing (findings unverified): ${unverified.join(', ')}`)
log(`${ok.length}/2 reviews; ${ok.reduce((n, r) => n + r.review.findings.length, 0)} findings; ${ok.reduce((n, r) => n + (r.checks || []).filter((c) => c.verdict === 'refuted').length, 0)} refuted by the skeptics`)
return { results: ok, missing, unverified }
