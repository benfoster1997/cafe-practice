/**
 * Proves the notification sender without a phone: a pretend device makes
 * the same kind of keys an iPhone would, we prepare a real encrypted,
 * signed message for it, then open the message with the device's private
 * key and check the signature the way Apple's server does.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { prepare, sendPush, addSub, pushState, vapidPublic, validSub, type PushSub, type Wire } from "../lib/push.ts";
import { type KV } from "../lib/blob.ts";

const require = createRequire(import.meta.url);
const ece = require("http_ece");
const webpush = require("web-push");

function memory(): KV & { data: Record<string, unknown> } {
  const data: Record<string, unknown> = {};
  return {
    data, load: (async (k: string, fb: unknown) => (k in data ? structuredClone(data[k]) : fb)) as KV["load"],
    save: async (k, v) => { data[k] = JSON.parse(JSON.stringify(v)); },
    saveIfNew: async (k, v) => { if (k in data) return false; data[k] = JSON.parse(JSON.stringify(v)); return true; },
  };
}
function device(host = "web.push.apple.com") {
  const ecdh = crypto.createECDH("prime256v1"); ecdh.generateKeys();
  const auth = crypto.randomBytes(16);
  const b64u = (b: Buffer) => b.toString("base64url");
  return { ecdh, auth, sub: { endpoint: `https://${host}/QABC${b64u(crypto.randomBytes(12))}`, keys: { p256dh: b64u(ecdh.getPublicKey()), auth: b64u(auth) } } };
}
const SITE = "https://fx-desk-ict.netlify.app";
const NOW = 1794700000;

test("a prepared message decrypts on the device to Apple's declarative format", () => {
  const d = device(), keys = webpush.generateVAPIDKeys();
  const w = prepare({ ...d.sub, added: NOW } as PushSub, { title: "BUY LIMIT GBPUSD (demo)", body: "Entry 1.32650", url: `${SITE}/#t=abc`, tag: "abc" }, SITE, keys, 1800);
  assert.equal(w.endpoint, d.sub.endpoint);
  assert.equal(w.headers["Content-Encoding"], "aes128gcm");
  assert.equal(String(w.headers.TTL), "1800");
  assert.equal(w.headers.Urgency, "high");
  const plain = ece.decrypt(w.body, { version: "aes128gcm", privateKey: d.ecdh, authSecret: d.auth }).toString("utf8");
  assert.deepEqual(JSON.parse(plain), { web_push: 8030, notification: { title: "BUY LIMIT GBPUSD (demo)", body: "Entry 1.32650", navigate: `${SITE}/#t=abc`, tag: "abc" } });
});

test("the message is signed for the right push service, by our key, and expires within a day", () => {
  const d = device(), keys = webpush.generateVAPIDKeys();
  const w = prepare({ ...d.sub, added: NOW } as PushSub, { title: "t", body: "b" }, SITE, keys, 600);
  const m = String(w.headers.Authorization).match(/^vapid t=([^,]+), k=(.+)$/);
  assert.ok(m, "VAPID authorization header");
  const [h, p, sig] = m![1].split(".");
  const claims = JSON.parse(Buffer.from(p, "base64url").toString());
  assert.equal(claims.aud, "https://web.push.apple.com");
  assert.equal(claims.sub, SITE);
  assert.ok(claims.exp - Date.now() / 1000 <= 24 * 3600 + 5 && claims.exp > Date.now() / 1000);
  assert.equal(m![2], keys.publicKey);
  const pub = crypto.createPublicKey({ key: { kty: "EC", crv: "P-256", x: Buffer.from(keys.publicKey, "base64url").subarray(1, 33).toString("base64url"), y: Buffer.from(keys.publicKey, "base64url").subarray(33).toString("base64url") }, format: "jwk" });
  assert.ok(crypto.verify("sha256", Buffer.from(`${h}.${p}`), { key: pub, dsaEncoding: "ieee-p1363" }, Buffer.from(sig, "base64url")), "signature verifies with the public key the phone was given");
});

test("an http site address is never used to sign or to open: push services demand https", () => {
  const d = device(), keys = webpush.generateVAPIDKeys();
  const w = prepare({ ...d.sub, added: NOW } as PushSub, { title: "t", body: "b", url: "http://fx-desk-ict.netlify.app/#t=1" }, "http://fx-desk-ict.netlify.app", keys, 600);
  const claims = JSON.parse(Buffer.from(String(w.headers.Authorization).match(/t=([^,]+)/)![1].split(".")[1], "base64url").toString());
  assert.equal(claims.sub, SITE);
  const plain = JSON.parse(ece.decrypt(w.body, { version: "aes128gcm", privateKey: d.ecdh, authSecret: d.auth }).toString("utf8"));
  assert.equal(plain.notification.navigate, `${SITE}/#t=1`);
});

test("signing keys are created once and reused, and only the public half is handed out", async () => {
  const kv = memory();
  const a = await vapidPublic(kv), b = await vapidPublic(kv);
  assert.equal(a, b);
  assert.equal(Buffer.from(a, "base64url").length, 65);
  assert.ok((kv.data.vapid as any).privateKey);
});

test("only real push services can be registered", async () => {
  const kv = memory(), d = device();
  assert.equal(await addSub(d.sub, NOW, kv), null);
  assert.ok(validSub(device("fcm.googleapis.com").sub));
  for (const bad of [{ ...d.sub, endpoint: "https://evil.example.com/x" }, { ...d.sub, endpoint: "http://web.push.apple.com/x" }, { ...d.sub, endpoint: "https://web.push.apple.com.evil.io/x" }, { endpoint: d.sub.endpoint }, null, "x"])
    assert.notEqual(await addSub(bad, NOW, kv), null);
  assert.equal((await pushState(kv)).subs.length, 1);
});

test("re-registering the same phone replaces its entry instead of piling up", async () => {
  const kv = memory(), d = device();
  await addSub(d.sub, NOW, kv); await addSub(d.sub, NOW + 60, kv);
  const st = await pushState(kv);
  assert.equal(st.subs.length, 1);
  assert.equal(st.subs[0].added, NOW + 60);
});

test("a delivered message is recorded; a dropped subscription is removed and raises the warning", async () => {
  const kv = memory(), d = device();
  await addSub(d.sub, NOW, kv);
  const seen: Wire[] = [];
  const ok = await sendPush(SITE, { title: "t", body: "b" }, NOW + 1, 600, kv, async (w) => { seen.push(w); return 201; });
  assert.deepEqual(ok, { sent: 1, failed: 0, removed: 0 });
  assert.equal(seen.length, 1);
  assert.equal((await pushState(kv)).lastOk, NOW + 1);
  assert.equal((await pushState(kv)).warn, undefined);
  const gone = await sendPush(SITE, { title: "t", body: "b" }, NOW + 2, 600, kv, async () => 410);
  assert.deepEqual(gone, { sent: 0, failed: 0, removed: 1 });
  const st = await pushState(kv);
  assert.equal(st.subs.length, 0);
  assert.match(st.warn!, /dropped/);
  // turning notifications back on clears the warning
  await addSub(d.sub, NOW + 3, kv);
  assert.equal((await pushState(kv)).warn, undefined);
});

test("a refused or unreachable send keeps the subscription, raises a warning, and never throws", async () => {
  const kv = memory(), d = device();
  await addSub(d.sub, NOW, kv);
  const refused = await sendPush(SITE, { title: "t", body: "b" }, NOW + 1, 600, kv, async () => 403);
  assert.deepEqual(refused, { sent: 0, failed: 1, removed: 0 });
  assert.match((await pushState(kv)).warn!, /403/);
  const down = await sendPush(SITE, { title: "t", body: "b" }, NOW + 2, 600, kv, async () => { throw new Error("network down"); });
  assert.equal(down.sent, 0);
  assert.equal((await pushState(kv)).subs.length, 1);
  const none = await sendPush(SITE, { title: "t", body: "b" }, NOW + 3, 600, memory(), async () => 201);
  assert.deepEqual(none, { sent: 0, failed: 0, removed: 0 });
});

test("Apple's 'bad token' answer counts as a dropped subscription; other refusals show Apple's reason", async () => {
  const kv = memory(), d = device();
  await addSub(d.sub, NOW, kv);
  const other = await sendPush(SITE, { title: "t", body: "b" }, NOW + 1, 600, kv, async () => ({ status: 403, detail: '{"reason":"BadJwtToken"}' }));
  assert.equal(other.failed, 1);
  assert.match((await pushState(kv)).warn!, /403: reason:BadJwtToken/);
  const bad = await sendPush(SITE, { title: "t", body: "b" }, NOW + 2, 600, kv, async () => ({ status: 400, detail: '{"reason":"BadWebPushToken"}' }));
  assert.equal(bad.removed, 1);
  assert.equal((await pushState(kv)).subs.length, 0);
});

test("with two phones, one dead and one alive, the alert still arrives and no warning is raised", async () => {
  const kv = memory(), a = device(), b = device();
  await addSub(a.sub, NOW, kv); await addSub(b.sub, NOW, kv);
  const r = await sendPush(SITE, { title: "t", body: "b" }, NOW + 1, 600, kv, async (w) => (w.endpoint === a.sub.endpoint ? 410 : 201));
  assert.deepEqual(r, { sent: 1, failed: 0, removed: 1 });
  const st = await pushState(kv);
  assert.equal(st.subs.length, 1);
  assert.equal(st.subs[0].endpoint, b.sub.endpoint);
  assert.equal(st.warn, undefined);
});

test("several notes go out together, and a phone that registers during the send is not lost", async () => {
  const kv = memory(), a = device(), late = device();
  await addSub(a.sub, NOW, kv);
  let calls = 0;
  const r = await sendPush(SITE, [{ title: "one", body: "b" }, { title: "two", body: "b" }], NOW + 1, 600, kv, async () => { if (++calls === 1) await addSub(late.sub, NOW + 1, kv); return 201; });
  assert.deepEqual(r, { sent: 2, failed: 0, removed: 0 });
  const st = await pushState(kv);
  assert.deepEqual(st.subs.map((s) => s.endpoint).sort(), [a.sub.endpoint, late.sub.endpoint].sort());
  assert.equal(st.subs.find((s) => s.endpoint === a.sub.endpoint)!.lastOk, NOW + 1);
});

test("the signing key is never replaced, even if two requests try to create it at once", async () => {
  const kv = memory();
  const [x, y] = await Promise.all([vapidPublic(kv), vapidPublic(kv)]);
  assert.equal(x, y);
  assert.equal(await vapidPublic(kv), x);
});
