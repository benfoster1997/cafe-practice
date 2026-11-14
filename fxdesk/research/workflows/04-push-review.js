export const meta = {
  name: 'fxdesk-push-review',
  description: 'Two independent reviews of the iPhone notification feature before it goes live: one against Apple and WebKit documentation, one hunting failure modes in the code',
  phases: [{ title: 'Review', detail: '2 reviewers: platform correctness (docs) and failure modes (code)' }],
}

const COMMON = `You are an adversarial reviewer on a private project in the git repo at /home/user/cafe-practice (the app lives in fxdesk/). Today is 14 November 2026.

CONTEXT. FX Desk is a small web app for ONE non-technical owner. He opens it on an iPhone 17 Pro Max running iOS 27. It scans forex prices on a schedule (a Netlify scheduled function every 15 minutes) and, about once a month, issues a trade ticket he must act on within minutes. He chose iPhone notifications from the Home Screen web app INSTEAD of Telegram, after being told they are less dependable. So the feature under review must be as dependable as web push on iOS can be, and when it fails it must fail LOUDLY, not silently. It has NOT been tested on a real iPhone: nobody on this project has one. Your review is the substitute for that test.

THE FEATURE (commit 6da81ef, not yet deployed):
- fxdesk/app/lib/push.ts - stores push subscriptions, creates VAPID keys on first use (kept in Netlify Blobs), builds messages in Apple's "declarative web push" JSON format, sends them with the web-push npm library's generateRequestDetails() and fetch(), removes subscriptions the push service says are gone and records a warning.
- fxdesk/app/lib/store.ts - runScan(): sends a push for each new message, plus a daily "check-in" push on the scan in the quarter hour before the London killzone (01:45-02:00 New York), so that a broken link is noticed within a day. checkInDue() guards it.
- fxdesk/app/netlify/functions/api.mts - routes /api/push (register a subscription and send a hello), /api/pushtest, /api/pushoff, and the push block in /api/state; /api/status (no login) exposes the VAPID public key.
- fxdesk/app/public/sw.js - service worker: shows a notification for every push, opens the ticket on tap.
- fxdesk/app/public/manifest.webmanifest and icons.
- fxdesk/app/public/index.html - the page: registers the service worker, syncPush() runs after every state refresh, the "Turn on notifications" button (#pushon handler in bind()), the red "alarm" warnings in viewNow(), the Setup card in viewSetup().
- Tests: fxdesk/app/test/push.test.ts and engine.test.ts ("node --test 'fxdesk/app/test/*.test.ts'" passes). A simulated-iPhone browser run with a stand-in push service also passes. One real request to https://web.push.apple.com with a made-up device address came back HTTP 400 {"reason":"BadWebPushToken"}, i.e. Apple objected to the address, not to the request format or signature.

HARD RULES: do NOT edit any file in the repository; put scratch files in /tmp/claude-0/-home-user-cafe-practice/606e4021-0eab-5b80-a5b1-c5b909d6f569/scratchpad/pushreview/ (create it). Do NOT deploy anything, do NOT call https://fx-desk-ict.netlify.app, do NOT use GitHub or other MCP tools. Do not run anything under fxdesk/backtest. Be economical: stop when your checklist is done.

WHAT COUNTS AS A FINDING: something that would make a notification not arrive on his iPhone, arrive wrongly, or fail without the app saying so; or a way the feature could break the scanner or expose his data. For each: file and line, the concrete situation, how you know (a quoted source with URL, a script you ran, or exact reasoning), and the exact fix. Say plainly when something could not be established. No style points, no padding.`

const SCHEMA = {
  type: 'object',
  required: ['verdict', 'findings', 'confirmed_correct', 'could_not_establish'],
  properties: {
    verdict: { type: 'string', enum: ['sound', 'fixable', 'broken'] },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['severity', 'confidence', 'file', 'summary', 'evidence', 'fix'],
        properties: {
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          confidence: { type: 'string', enum: ['confirmed', 'likely', 'possible'] },
          file: { type: 'string', description: 'path:line' },
          summary: { type: 'string' },
          evidence: { type: 'string', description: 'Quoted source with URL, script result, or exact reasoning' },
          fix: { type: 'string', description: 'The exact change' },
        },
      },
    },
    confirmed_correct: { type: 'array', items: { type: 'string' }, description: 'Things you checked against a source or by running code and found right, one line each, with the source' },
    could_not_establish: { type: 'array', items: { type: 'string' } },
  },
}

const LENSES = [
  {
    key: 'platform',
    brief: `YOUR LENS: DOES THIS MATCH HOW iOS WEB PUSH ACTUALLY WORKS? Check the implementation against PRIMARY sources. FIRST call ToolSearch with query "select:WebSearch" and also try "select:WebFetch"; use at most 10 searches or fetches in total. Preferred sources: webkit.org blog posts ("Web Push for Web Apps on iOS and iPadOS", "Meet Declarative Web Push"), developer.apple.com ("Sending web push notifications in web apps and browsers"), the Push API / Declarative Web Push specifications, and the web-push npm library's own source in fxdesk/node_modules/web-push.
Answer each of these, with a quoted source:
1. Declarative Web Push payload: exact required and optional members and their names (web_push: 8030, notification.title, notification.navigate, body, tag, silent, app_badge, mutable ...). Is "navigate" required and must it be an absolute https URL? Does a declarative message need any particular Content-Type or header? Is our JSON in push.ts prepare() valid? What does iOS do if a member is missing or wrong (drop silently? fall back to the service worker?).
2. With a declarative payload AND a registered service worker with a "push" handler (our sw.js): which one displays the notification on iOS 18.4+ and on older iOS? Any risk of two notifications, or of none? Does the tap open "navigate" or fire notificationclick?
3. Apple's VAPID requirements: accepted "sub" formats (is an https URL accepted or must it be mailto:?), maximum "exp", "aud" value, required headers (TTL, Urgency, Topic), payload size limit, and the HTTP status codes and reason strings Apple returns for a subscription that is gone, a bad signature, or too many requests. Does push.ts handle each one correctly (which should delete the subscription, which should not)?
4. Getting permission on iOS: where Notification and PushManager exist (Safari tab versus Home Screen web app), what manifest fields are required for the Home Screen app to qualify ("display", "id", icons), whether requestPermission() must be called directly from a tap, whether pushManager.subscribe() without a fresh tap works once permission is granted (our syncPush() calls it on every app open), and what iOS 26 or 27 changed (for example "Open as Web App" by default). Does index.html get any of this wrong?
5. Known ways iOS web push subscriptions die or notifications stop (storage eviction, removing the icon, restoring a backup, OS updates, Focus modes, Low Power Mode, the "silent push" penalty) and whether our safeguards (daily check-in, warning on a "gone" answer, re-register on open) actually catch each one. Name any failure that would still be silent.
6. Anything about iOS 27 specifically that changes the above. If you find nothing, say so.`,
  },
  {
    key: 'failure-modes',
    brief: `YOUR LENS: FAILURE MODES IN THE CODE. No web research; read the code and run small scripts (Node runs TypeScript directly: "node file.ts", .ts extensions in imports, absolute paths work; fxdesk/app/test/push.test.ts shows how to drive push.ts with an in-memory store and a fake sender).
Check:
1. State consistency. All state is in a last-write-wins key/value store (fxdesk/app/lib/blob.ts). The scheduled scan and the owner's taps can run at the same moment. Find any interleaving in push.ts / store.ts / api.mts where a subscription just registered is lost, a warning is wrongly cleared or wrongly kept, the check-in is sent twice or never, or the VAPID key is regenerated (which would silently invalidate the phone's subscription). Give the exact interleaving.
2. The daily check-in (store.ts checkInDue and runScan, engine.ts isCheckInTime): can it be skipped on a normal trading day (for example when the price feed fails, when alerts are switched off, when the scheduled function runs a minute late or twice), and when skipped, does the owner find out? Does it behave across US and UK clock changes and on days the market opens late? Is a check-in that says "FX Desk is running" ever sent when the scan actually failed?
3. The scanner's time budget: Netlify scheduled functions are killed at 30 seconds. runScan waits 9 seconds, may wait 8 more and refetch, then sends pushes one at a time with an 8-second limit each, then possibly Telegram. Work out the worst case and say whether a slow push service could stop the scan saving its results. Should pushes be sent after state is saved (they are - confirm) and in parallel?
4. The page (index.html): walk syncPush(), ensureSub(), registerSub() and the #pushon handler as a state machine for: first visit in a Safari tab on iPhone; first open from the Home Screen icon (he must re-enter his passcode there: storage is separate); permission granted; permission denied; the phone's subscription vanishing while permission stays granted; the server forgetting the subscription; the VAPID key changing; two devices. Find loops (refresh -> syncPush -> refresh), repeated hello notifications, a state where the page says "On" while the server has no subscription, and anything awaited before Notification.requestPermission() that would break the "called from a tap" rule.
5. sw.js: does every push event end in showNotification, even with a malformed or empty payload? Does notificationclick behave when no window is open?
6. Security: /api/status is reachable without the passcode and now returns the VAPID public key - is anything else exposed? Can a logged-in caller make the server post to an arbitrary address (check validSub)? Is any secret written to logs or returned by /api/state?
7. The messages themselves (engine.ts scan(): title and body for new ticket, fill, finish, blocked): is anything wrong, missing or misleading for a man who has to copy numbers into MetaTrader within minutes? Are bodies short enough to show in a banner?`,
  },
]

phase('Review')
const reviews = await parallel(LENSES.map((l) => () => agent(`${COMMON}

${l.brief}

Return the structured result: verdict for your lens, findings most severe first, what you confirmed correct (with the source), and what you could not establish.`, { label: `review:${l.key}`, phase: 'Review', schema: SCHEMA }).then((r) => (r ? { lens: l.key, ...r } : null))))

const ok = reviews.filter(Boolean)
const missing = LENSES.filter((l, i) => !reviews[i]).map((l) => l.key)
if (missing.length) log(`Reviewers that returned nothing: ${missing.join(', ')}`)
log(`${ok.length}/2 reviews; ${ok.reduce((n, r) => n + r.findings.filter((f) => f.severity === 'high').length, 0)} high-severity findings`)
return { reviews: ok, missing }
