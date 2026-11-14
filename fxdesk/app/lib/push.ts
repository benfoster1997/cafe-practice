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
 *    app shows in red. The app also re-registers itself every time it opens.
 *  - A failure would otherwise be silent, because real alerts are rare. So a
 *    short check-in is sent every trading morning (store.ts). No check-in
 *    means something is broken.
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

export interface PushSub { endpoint: string; keys: { p256dh: string; auth: string }; added: number; lastOk?: number }
export interface PushState {
  subs: PushSub[];
  /** when a subscription was last accepted by the push service */
  lastOk?: number;
  /** set when the push service said a subscription is gone and none is left, or a send keeps failing */
  warn?: string; warnAt?: number;
}
export interface Note { title: string; body: string; url?: string; tag?: string }
export interface Wire { endpoint: string; headers: Record<string, string | number>; body: Buffer }
/** Posts one prepared message; returns the HTTP status (and the service's stated reason, if any). Replaceable in tests. */
export type Sender = (w: Wire) => Promise<number | { status: number; detail?: string }>;
/** Reasons Apple gives for an address that can never work again. */
const GONE = /BadWebPushToken|BadDeviceToken|Unregistered|DeviceTokenNotForTopic/i;

/** Only real push services may be stored: the server posts to these addresses, so nothing else is accepted. */
const PUSH_HOSTS = [/\.push\.apple\.com$/, /^fcm\.googleapis\.com$/, /^updates\.push\.services\.mozilla\.com$/, /\.notify\.windows\.com$/];
export function validSub(s: any): s is { endpoint: string; keys: { p256dh: string; auth: string } } {
  try {
    const u = new URL(String(s?.endpoint));
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

export async function addSub(sub: unknown, now: number, kv: KV = blobs): Promise<string | null> {
  if (!validSub(sub)) return "That does not look like a notification subscription from a phone or browser.";
  const st = await pushState(kv);
  const keep = st.subs.filter((s) => s.endpoint !== sub.endpoint).slice(-4); // this device replaces its old entry; at most five devices
  keep.push({ endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth }, added: now });
  await kv.save("push", { ...st, subs: keep, warn: undefined, warnAt: undefined });
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
  const siteUrl = httpsUrl(site);
  const payload = JSON.stringify({
    web_push: 8030,
    notification: { title: note.title, body: note.body, navigate: httpsUrl(note.url ?? siteUrl), ...(note.tag ? { tag: note.tag } : {}) },
  });
  const d = webpush.generateRequestDetails({ endpoint: sub.endpoint, keys: sub.keys }, payload, {
    vapidDetails: { subject: siteUrl, publicKey: keys.publicKey, privateKey: keys.privateKey },
    TTL: ttlSec, urgency: "high", contentEncoding: "aes128gcm",
  });
  return { endpoint: d.endpoint, headers: d.headers as Record<string, string | number>, body: d.body as Buffer };
}

const post: Sender = async (w) => {
  const headers: Record<string, string> = {};
  for (const [k, v] of Object.entries(w.headers)) if (k.toLowerCase() !== "content-length") headers[k] = String(v);
  // eight seconds at most: a stuck notification must not use up the scanner's time allowance
  const r = await fetch(w.endpoint, { method: "POST", headers, body: w.body, signal: AbortSignal.timeout(8000) });
  return { status: r.status, detail: r.ok ? "" : (await r.text().catch(() => "")).slice(0, 120) };
};

/**
 * Send one or more notes to every registered device. Never throws: a
 * notification problem must not stop the scanner. Everything goes out at
 * once (so a slow push service costs eight seconds at most, however many
 * messages there are), and the saved state is then updated in one write
 * that is merged with whatever was saved meanwhile, so a phone that
 * registered during the send is not lost.
 */
export async function sendPush(siteUrl: string, notes: Note | Note[], now: number, ttlSec = 1800, kv: KV = blobs, send: Sender = post): Promise<{ sent: number; failed: number; removed: number }> {
  const out = { sent: 0, failed: 0, removed: 0 };
  const list = Array.isArray(notes) ? notes : [notes];
  try {
    const st = await pushState(kv);
    if (!st.subs.length || !list.length) return out;
    const keys = await vapid(kv);
    const ok = new Set<string>(), gone = new Set<string>();
    let problem = "";
    await Promise.all(st.subs.flatMap((sub) => list.map(async (note) => {
      let status = 0, detail = "";
      try { const r = await send(prepare(sub, note, siteUrl, keys, ttlSec)); if (typeof r === "number") status = r; else { status = r.status; detail = r.detail ?? ""; } }
      catch (e) { problem = `could not reach the notification service (${(e as Error).message})`; }
      if (status >= 200 && status < 300) { out.sent++; ok.add(sub.endpoint); }
      else if (status === 404 || status === 410 || GONE.test(detail)) gone.add(sub.endpoint); // the push service says this address no longer exists
      else { out.failed++; if (status) problem = `the notification service refused the message (code ${status}${detail ? `: ${detail.replace(/[{}"]/g, "").trim()}` : ""})`; }
    })));
    out.removed = gone.size;
    const latest = await pushState(kv);
    const next: PushState = { ...latest, subs: latest.subs.filter((s) => !gone.has(s.endpoint)).map((s) => (ok.has(s.endpoint) ? { ...s, lastOk: now } : s)) };
    if (out.sent) { next.lastOk = now; next.warn = undefined; next.warnAt = undefined; }
    else if (gone.size) { next.warn = "Apple has dropped this phone's notification link. Open Setup and turn notifications on again."; next.warnAt = now; }
    else if (problem) { next.warn = `Last notification failed: ${problem}.`; next.warnAt = now; }
    await kv.save("push", next);
  } catch { /* storage or key trouble: nothing sent is the honest count; the daily check-in will be missed and noticed */ }
  return out;
}
