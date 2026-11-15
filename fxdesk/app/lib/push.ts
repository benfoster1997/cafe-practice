/**
 * push.ts - notifications to the owner's iPhone, without any third-party app.
 *
 * How it works. The web app, once added to the Home Screen, asks iOS for a
 * "push subscription": an address at Apple plus two keys. We store that.
 * To notify, we encrypt a short message to those keys and post it to the
 * address; Apple wakes the phone and shows it. The encryption and signing
 * are done by the standard `web-push` library, not by hand.
 *
 * What makes this less dependable than a chat app, and what is done about it:
 *  - Apple can drop a subscription without telling the phone. When we next
 *    send, Apple answers "gone"; we then delete it and raise a warning the
 *    app shows in red. The app also re-registers itself every time it opens,
 *    and asks the iPhone for a brand-new address when Apple says the old one
 *    is finished.
 *  - A failure would otherwise be silent, because real alerts are rare. So a
 *    short check-in is sent every trading morning (store.ts). No check-in
 *    means something is broken.
 *  - Apple's service can hiccup. Each message gets a second attempt a second
 *    later, and anything still undelivered is kept by the scanner and sent
 *    again on the next scan (store.ts, "outbox").
 *  - Messages use Apple's "declarative" format (the 8030 marker), which iOS
 *    18.4 and later displays itself, without needing the page's background
 *    script to run. The background script (public/sw.js) shows the same
 *    message on anything older.
 *
 * The signing keys are created on first use and kept in the app's private
 * storage; they are not in the code or the repository.
 */
import webpush from "web-push";
import { blobs, type KV } from "./blob.ts";

/** Used when the hosting platform does not tell a function its own address. Notifications cannot be signed or linked without one. */
export const SITE = "https://fx-desk-ict.netlify.app";

export interface PushSub { endpoint: string; keys: { p256dh: string; auth: string }; added: number; lastOk?: number; /** sends in a row that this device's push service refused */ fails?: number }
export interface PushState {
  subs: PushSub[];
  /** when a subscription was last accepted by the push service */
  lastOk?: number;
  /** set when the push service said a subscription is gone, or a send keeps failing; cleared by the next message every device accepts */
  warn?: string; warnAt?: number;
  /** the most recent warning, kept after it clears, so there are words to report afterwards */
  lastFail?: string; lastFailAt?: number;
}
/** `ttl`: how many seconds Apple should keep trying if the phone is switched off or out of reach. */
export interface Note { title: string; body: string; url?: string; tag?: string; ttl?: number }
export interface Wire { endpoint: string; headers: Record<string, string | number>; body: Buffer }
/** Posts one prepared message; returns the HTTP status (and the service's stated reason, if any). Replaceable in tests. */
export type Sender = (w: Wire, timeoutMs?: number) => Promise<number | { status: number; detail?: string }>;
export interface SendOptions {
  /** send to this one address only (the hello that proves a phone must not be answered by some other device) */
  only?: string;
  /** milliseconds this call may take in all; the second attempt is skipped when there is no time for it */
  budgetMs?: number;
  /** replaceable in tests */
  pause?: (ms: number) => Promise<unknown>;
  /** milliseconds, like Date.now; replaceable in tests */
  clock?: () => number;
}
export interface SendResult {
  sent: number; failed: number; removed: number;
  /** one entry per note, in order: true if at least one device's push service accepted it */
  delivered: boolean[];
}
/**
 * Reasons Apple gives for an address that can never work again. The last one
 * means the address was made for a different signing key: equally dead, and
 * the phone must ask for a new address.
 */
const GONE = /BadWebPushToken|BadDeviceToken|Unregistered|DeviceTokenNotForTopic|VapidPkHashMismatch/i;
/** How long one attempt may take, and the pause before the second attempt. */
const ATTEMPT_MS = 4000, PAUSE_MS = 1000;

/** Only real push services may be stored: the server posts to these addresses, so nothing else is accepted. */
const PUSH_HOSTS = [/\.push\.apple\.com$/, /^fcm\.googleapis\.com$/, /^updates\.push\.services\.mozilla\.com$/, /\.notify\.windows\.com$/];
export function validSub(s: any): s is { endpoint: string; keys: { p256dh: string; auth: string } } {
  try {
    if (typeof s?.endpoint !== "string") return false;
    const u = new URL(s.endpoint);
    return u.protocol === "https:" && PUSH_HOSTS.some((h) => h.test(u.hostname)) && typeof s.keys?.p256dh === "string" && s.keys.p256dh.length > 40 && typeof s.keys?.auth === "string" && s.keys.auth.length > 10;
  } catch { return false; }
}

interface Vapid { publicKey: string; privateKey: string }
/**
 * The signing keys. Created once and then NEVER replaced: a phone's
 * subscription is tied to the public key it was given, so a second key
 * would cut the phone off without any error. Hence write-only-if-absent,
 * and whoever loses that race reads the winner's key.
 */
async function vapid(kv: KV): Promise<Vapid> {
  const have = await kv.load<Vapid | null>("vapid", null);
  if (have?.privateKey) return have;
  await kv.saveIfNew("vapid", webpush.generateVAPIDKeys());
  const now = await kv.load<Vapid | null>("vapid", null);
  if (!now?.privateKey) throw new Error("could not store the notification signing key");
  return now;
}
export const vapidPublic = async (kv: KV = blobs): Promise<string> => (await vapid(kv)).publicKey;
export const pushState = (kv: KV = blobs): Promise<PushState> => kv.load<PushState>("push", { subs: [] });

/**
 * Store a phone's address. This does NOT clear a warning: only a message
 * that Apple actually accepts proves the link works (sendPush clears it).
 */
export async function addSub(sub: unknown, now: number, kv: KV = blobs): Promise<string | null> {
  if (!validSub(sub)) return "That does not look like a notification subscription from a phone or browser.";
  const st = await pushState(kv);
  const old = st.subs.find((s) => s.endpoint === sub.endpoint);
  const keep = st.subs.filter((s) => s.endpoint !== sub.endpoint).slice(-4); // this device replaces its old entry; at most five devices
  keep.push({ endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth }, added: now, ...(old?.lastOk ? { lastOk: old.lastOk } : {}), ...(old?.fails ? { fails: old.fails } : {}) });
  await kv.save("push", { ...st, subs: keep });
  return null;
}
export async function removeSub(endpoint: string, kv: KV = blobs): Promise<void> {
  const st = await pushState(kv);
  await kv.save("push", { ...st, subs: st.subs.filter((s) => s.endpoint !== endpoint) });
}

/** Push services insist the sender identifies itself with an https address, and a notification must open an https page. */
export const httpsUrl = (u: string): string => u.replace(/^http:\/\//i, "https://");

/** The encrypted, signed request for one subscription (exposed so tests can open it up). */
export function prepare(sub: PushSub, note: Note, site: string, keys: Vapid, ttlSec: number): Wire {
  const siteUrl = httpsUrl(site || SITE);
  // Apple's format needs a full https address to open on a tap; a missing or partial one would make iOS reject the whole message
  const link = httpsUrl(note.url && /^https?:\/\//i.test(note.url) ? note.url : siteUrl);
  const payload = JSON.stringify({
    web_push: 8030,
    notification: { title: note.title || "FX Desk", body: note.body, navigate: link, ...(note.tag ? { tag: note.tag } : {}) },
  });
  const d = webpush.generateRequestDetails({ endpoint: sub.endpoint, keys: sub.keys }, payload, {
    vapidDetails: { subject: siteUrl, publicKey: keys.publicKey, privateKey: keys.privateKey },
    TTL: Math.max(60, Math.round(note.ttl ?? ttlSec)), urgency: "high", contentEncoding: "aes128gcm",
  });
  return { endpoint: d.endpoint, headers: d.headers as Record<string, string | number>, body: d.body as Buffer };
}

const post: Sender = async (w, timeoutMs = ATTEMPT_MS) => {
  const headers: Record<string, string> = {};
  for (const [k, v] of Object.entries(w.headers)) if (k.toLowerCase() !== "content-length") headers[k] = String(v);
  // a stuck notification must not use up the scanner's time allowance
  const r = await fetch(w.endpoint, { method: "POST", headers, body: w.body, signal: AbortSignal.timeout(timeoutMs) });
  return { status: r.status, detail: r.ok ? "" : (await r.text().catch(() => "")).slice(0, 120) };
};

/**
 * Send one or more notes to every registered device (or to one, with
 * `only`). Never throws: a notification problem must not stop the scanner.
 *
 * Everything goes out at once, so a slow push service costs one attempt's
 * time however many messages there are. An attempt that fails for a reason
 * that may pass (no answer, "too many requests", a fault at Apple) is made
 * once more a second later; a refusal is not repeated. The saved state is
 * then updated in one write that is merged with whatever was saved
 * meanwhile, so a phone that registered during the send is not lost.
 */
export async function sendPush(siteUrl: string, notes: Note | Note[], now: number, ttlSec = 1800, kv: KV = blobs, send: Sender = post, opts: SendOptions = {}): Promise<SendResult> {
  const list = Array.isArray(notes) ? notes : [notes];
  const out: SendResult = { sent: 0, failed: 0, removed: 0, delivered: list.map(() => false) };
  const clock = opts.clock ?? Date.now, started = clock(), budget = opts.budgetMs ?? 2 * ATTEMPT_MS + PAUSE_MS;
  const left = () => budget - (clock() - started);
  const pause = opts.pause ?? ((ms: number) => new Promise((r) => setTimeout(r, ms)));
  try {
    const st = await pushState(kv);
    const targets = opts.only ? st.subs.filter((s) => s.endpoint === opts.only) : st.subs;
    if (!targets.length || !list.length) return out;
    const keys = await vapid(kv);
    const ok = new Set<string>(), gone = new Set<string>(), bad = new Set<string>();
    let problem = "", goneWhy = "";
    await Promise.all(targets.flatMap((sub) => list.map(async (note, i) => {
      let status = 0, detail = "", err = "";
      const attempt = async (ms: number) => {
        status = 0; detail = ""; err = "";
        try { const r = await send(prepare(sub, note, siteUrl, keys, ttlSec), ms); if (typeof r === "number") status = r; else { status = r.status; detail = r.detail ?? ""; } }
        catch (e) { err = (e as Error).message; }
      };
      await attempt(Math.max(1000, Math.min(ATTEMPT_MS, left())));
      const mayPass = () => status === 0 || status === 429 || status >= 500;
      if (mayPass() && left() > PAUSE_MS + 1500) { await pause(PAUSE_MS); await attempt(Math.max(1000, Math.min(ATTEMPT_MS, left()))); }
      const reason = detail.replace(/[{}"]/g, "").trim();
      if (status >= 200 && status < 300) { out.sent++; out.delivered[i] = true; ok.add(sub.endpoint); }
      else if (status === 404 || status === 410 || GONE.test(detail)) { gone.add(sub.endpoint); goneWhy = reason.replace(/^reason:\s*/i, "") || `code ${status}`; } // the push service says this address no longer exists
      else {
        out.failed++; bad.add(sub.endpoint);
        problem = status ? `the notification service refused the message (code ${status}${reason ? `: ${reason}` : ""})` : `could not reach the notification service (${err || "no answer"})`;
      }
    })));
    out.removed = gone.size;
    const latest = await pushState(kv);
    const next: PushState = {
      ...latest,
      subs: latest.subs.filter((s) => !gone.has(s.endpoint)).map((s) => (ok.has(s.endpoint) ? { ...s, lastOk: now, fails: 0 } : bad.has(s.endpoint) ? { ...s, fails: (s.fails ?? 0) + 1 } : s)),
    };
    if (out.sent) next.lastOk = now;
    // a phone that registered a new address after this send began has already replaced the dropped one
    const replaced = next.subs.some((s) => s.added >= now && !targets.some((t) => t.endpoint === s.endpoint));
    const stuck = next.subs.some((s) => bad.has(s.endpoint) && !ok.has(s.endpoint) && (s.fails ?? 0) >= 2);
    if (gone.size && !replaced) { next.warn = `Apple has dropped ${next.subs.length ? "one device's" : "this phone's"} notification link (${goneWhy}). Open FX Desk from its Home Screen icon and it will reconnect by itself; if it does not, use the button in Setup.`; next.warnAt = now; }
    else if (problem && !out.sent) { next.warn = `Last notification failed: ${problem}.`; next.warnAt = now; }
    else if (problem && stuck) { next.warn = `One device keeps being refused: ${problem}.`; next.warnAt = now; }
    else if (out.sent && !problem && !next.subs.some((s) => (s.fails ?? 0) >= 2)) { next.warn = undefined; next.warnAt = undefined; } // cleared only when no device is left failing
    if (next.warn && next.warnAt === now) { next.lastFail = next.warn; next.lastFailAt = now; }
    await kv.save("push", next);
  } catch { /* storage or key trouble: nothing sent is the honest count; the scanner keeps the notes and the daily check-in will be missed and noticed */ }
  return out;
}
