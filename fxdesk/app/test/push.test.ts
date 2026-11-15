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

/** No real waiting between the two attempts in tests. */
const QUICK = { pause: async () => {} };

test("a delivered message is recorded; a dropped subscription is removed and raises the warning", async () => {
  const kv = memory(), d = device();
  await addSub(d.sub, NOW, kv);
  const seen: Wire[] = [];
  const ok = await sendPush(SITE, { title: "t", body: "b" }, NOW + 1, 600, kv, async (w) => { seen.push(w); return 201; });
  assert.deepEqual(ok, { sent: 1, failed: 0, removed: 0, delivered: [true] });
  assert.equal(seen.length, 1);
  assert.equal((await pushState(kv)).lastOk, NOW + 1);
  assert.equal((await pushState(kv)).warn, undefined);
  const gone = await sendPush(SITE, { title: "t", body: "b" }, NOW + 2, 600, kv, async () => 410);
  assert.deepEqual(gone, { sent: 0, failed: 0, removed: 1, delivered: [false] });
  const st = await pushState(kv);
  assert.equal(st.subs.length, 0);
  assert.match(st.warn!, /dropped this phone's notification link/);
});

test("storing a phone's address does not clear a warning; only a message Apple accepts does", async () => {
  const kv = memory(), d = device();
  await addSub(d.sub, NOW, kv);
  await sendPush(SITE, { title: "t", body: "b" }, NOW + 1, 600, kv, async () => 403);
  assert.match((await pushState(kv)).warn!, /403/);
  await addSub(d.sub, NOW + 2, kv); // the quiet re-registration every time the app opens
  assert.match((await pushState(kv)).warn!, /403/, "nothing was delivered, so the warning must stay");
  await sendPush(SITE, { title: "hello", body: "b" }, NOW + 3, 600, kv, async () => 201, { only: d.sub.endpoint });
  assert.equal((await pushState(kv)).warn, undefined);
});

test("the last failure stays on record after the warning clears, so there are words to report", async () => {
  const kv = memory(), d = device();
  await addSub(d.sub, NOW, kv);
  await sendPush(SITE, { title: "t", body: "b" }, NOW + 1, 600, kv, async () => ({ status: 403, detail: '{"reason":"BadJwtToken"}' }));
  await sendPush(SITE, { title: "t", body: "b" }, NOW + 9, 600, kv, async () => 201);
  const st = await pushState(kv);
  assert.equal(st.warn, undefined);
  assert.match(st.lastFail!, /403: reason:BadJwtToken/);
  assert.equal(st.lastFailAt, NOW + 1);
});

test("re-registering keeps the phone's delivery record", async () => {
  const kv = memory(), d = device();
  await addSub(d.sub, NOW, kv);
  await sendPush(SITE, { title: "t", body: "b" }, NOW + 1, 600, kv, async () => 201);
  await addSub(d.sub, NOW + 60, kv);
  assert.equal((await pushState(kv)).subs[0].lastOk, NOW + 1);
});

test("a refused or unreachable send keeps the subscription, raises a warning, and never throws", async () => {
  const kv = memory(), d = device();
  await addSub(d.sub, NOW, kv);
  const refused = await sendPush(SITE, { title: "t", body: "b" }, NOW + 1, 600, kv, async () => 403, QUICK);
  assert.deepEqual(refused, { sent: 0, failed: 1, removed: 0, delivered: [false] });
  assert.match((await pushState(kv)).warn!, /403/);
  const down = await sendPush(SITE, { title: "t", body: "b" }, NOW + 2, 600, kv, async () => { throw new Error("network down"); }, QUICK);
  assert.equal(down.sent, 0);
  assert.match((await pushState(kv)).warn!, /could not reach the notification service \(network down\)/);
  assert.equal((await pushState(kv)).subs.length, 1);
  const none = await sendPush(SITE, { title: "t", body: "b" }, NOW + 3, 600, memory(), async () => 201);
  assert.deepEqual(none, { sent: 0, failed: 0, removed: 0, delivered: [false] });
});

test("a hiccup at Apple gets one more attempt a second later; a refusal does not", async () => {
  const kv = memory(), d = device();
  await addSub(d.sub, NOW, kv);
  for (const first of [503, 500, 429, 0]) {
    let calls = 0, paused = 0;
    const r = await sendPush(SITE, { title: "t", body: "b" }, NOW + 1, 600, kv, async () => { if (++calls === 1) { if (!first) throw new Error("timeout"); return first; } return 201; }, { pause: async (ms) => { paused += ms; } });
    assert.equal(calls, 2, `first answer ${first}: tried again`);
    assert.equal(paused, 1000);
    assert.deepEqual(r, { sent: 1, failed: 0, removed: 0, delivered: [true] });
    assert.equal((await pushState(kv)).warn, undefined);
  }
  for (const refusal of [400, 403, 413]) {
    let calls = 0;
    const r = await sendPush(SITE, { title: "t", body: "b" }, NOW + 2, 600, kv, async () => { calls++; return refusal; }, QUICK);
    assert.equal(calls, 1, `answer ${refusal}: not repeated`);
    assert.equal(r.failed, 1);
  }
  // still failing on the second attempt: reported, and no third attempt
  let calls = 0;
  const r = await sendPush(SITE, { title: "t", body: "b" }, NOW + 3, 600, kv, async () => { calls++; return 503; }, QUICK);
  assert.equal(calls, 2);
  assert.deepEqual(r, { sent: 0, failed: 1, removed: 0, delivered: [false] });
  assert.match((await pushState(kv)).warn!, /code 503/);
});

test("with no time left there is one attempt only, and it is given a short limit", async () => {
  const kv = memory(), d = device();
  await addSub(d.sub, NOW, kv);
  let calls = 0; const limits: number[] = [];
  const r = await sendPush(SITE, { title: "t", body: "b" }, NOW + 1, 600, kv, async (_w, ms) => { calls++; limits.push(ms!); return 503; }, { budgetMs: 2000, pause: async () => {} });
  assert.equal(calls, 1);
  assert.ok(limits[0] <= 2000 && limits[0] >= 1000, `attempt limit ${limits[0]} ms`);
  assert.equal(r.sent, 0);
});

test("Apple's 'bad token' and 'wrong key' answers count as a dropped subscription; other refusals show Apple's reason", async () => {
  const kv = memory(), d = device();
  await addSub(d.sub, NOW, kv);
  const other = await sendPush(SITE, { title: "t", body: "b" }, NOW + 1, 600, kv, async () => ({ status: 403, detail: '{"reason":"BadJwtToken"}' }));
  assert.equal(other.failed, 1);
  assert.match((await pushState(kv)).warn!, /403: reason:BadJwtToken/);
  const bad = await sendPush(SITE, { title: "t", body: "b" }, NOW + 2, 600, kv, async () => ({ status: 400, detail: '{"reason":"BadWebPushToken"}' }));
  assert.equal(bad.removed, 1);
  assert.equal((await pushState(kv)).subs.length, 0);
  // an address made for a different signing key can never work: it is removed, so the phone asks for a new one
  await addSub(d.sub, NOW + 3, kv);
  const key = await sendPush(SITE, { title: "t", body: "b" }, NOW + 4, 600, kv, async () => ({ status: 403, detail: '{"reason":"VapidPkHashMismatch"}' }));
  assert.equal(key.removed, 1);
  assert.match((await pushState(kv)).warn!, /dropped this phone's notification link \(VapidPkHashMismatch\)/);
});

test("with two devices, one dead and one alive, the alert still arrives and the dead one is reported", async () => {
  const kv = memory(), a = device(), b = device();
  await addSub(a.sub, NOW, kv); await addSub(b.sub, NOW, kv);
  const r = await sendPush(SITE, { title: "t", body: "b" }, NOW + 1, 600, kv, async (w) => (w.endpoint === a.sub.endpoint ? 410 : 201));
  assert.deepEqual(r, { sent: 1, failed: 0, removed: 1, delivered: [true] });
  const st = await pushState(kv);
  assert.equal(st.subs.length, 1);
  assert.equal(st.subs[0].endpoint, b.sub.endpoint);
  assert.match(st.warn!, /dropped one device's notification link/);
  // the next send that every remaining device accepts clears it
  await sendPush(SITE, { title: "t", body: "b" }, NOW + 2, 600, kv, async () => 201);
  assert.equal((await pushState(kv)).warn, undefined);
});

test("a device that keeps being refused is reported even while another device is fine", async () => {
  const kv = memory(), a = device(), b = device();
  await addSub(a.sub, NOW, kv); await addSub(b.sub, NOW, kv);
  const send = async (w: Wire) => (w.endpoint === a.sub.endpoint ? { status: 403, detail: '{"reason":"BadJwtToken"}' } : 201);
  await sendPush(SITE, { title: "t", body: "b" }, NOW + 1, 600, kv, send);
  assert.equal((await pushState(kv)).warn, undefined, "one refusal may be a blip");
  await sendPush(SITE, { title: "t", body: "b" }, NOW + 2, 600, kv, send);
  const st = await pushState(kv);
  assert.match(st.warn!, /One device keeps being refused.*BadJwtToken/);
  assert.equal(st.subs.find((s) => s.endpoint === a.sub.endpoint)!.fails, 2);
  assert.equal(st.subs.find((s) => s.endpoint === b.sub.endpoint)!.fails, 0);
});

test("the hello that proves a phone goes to that phone only, so another device cannot pass for it", async () => {
  const kv = memory(), mine = device(), other = device();
  await addSub(mine.sub, NOW, kv); await addSub(other.sub, NOW, kv);
  const hit: string[] = [];
  const r = await sendPush(SITE, { title: "hello", body: "b" }, NOW + 1, 600, kv, async (w) => { hit.push(w.endpoint); return w.endpoint === mine.sub.endpoint ? 410 : 201; }, { only: mine.sub.endpoint });
  assert.deepEqual(hit, [mine.sub.endpoint]);
  assert.deepEqual(r, { sent: 0, failed: 0, removed: 1, delivered: [false] });
  assert.deepEqual((await pushState(kv)).subs.map((s) => s.endpoint), [other.sub.endpoint]);
});

test("several notes go out together, each reported on its own, and a phone that registers during the send is not lost", async () => {
  const kv = memory(), a = device(), late = device();
  await addSub(a.sub, NOW, kv);
  let calls = 0;
  const r = await sendPush(SITE, [{ title: "one", body: "b" }, { title: "two", body: "b" }], NOW + 1, 600, kv, async () => { if (++calls === 1) await addSub(late.sub, NOW + 1, kv); return 201; });
  assert.deepEqual(r, { sent: 2, failed: 0, removed: 0, delivered: [true, true] });
  const st = await pushState(kv);
  assert.deepEqual(st.subs.map((s) => s.endpoint).sort(), [a.sub.endpoint, late.sub.endpoint].sort());
  assert.equal(st.subs.find((s) => s.endpoint === a.sub.endpoint)!.lastOk, NOW + 1);
  // one note accepted, one refused: each is reported separately
  const d = device(), kv2 = memory(); await addSub(d.sub, NOW, kv2);
  const titles: string[] = [];
  const mixed = await sendPush(SITE, [{ title: "one", body: "b", ttl: 7200 }, { title: "two", body: "b" }], NOW + 2, 600, kv2, async (w) => {
    const plain = JSON.parse(ece.decrypt(w.body, { version: "aes128gcm", privateKey: d.ecdh, authSecret: d.auth }).toString("utf8"));
    titles.push(`${plain.notification.title}:${w.headers.TTL}`);
    return plain.notification.title === "one" ? 201 : 413;
  });
  assert.deepEqual(mixed.delivered, [true, false]);
  assert.deepEqual(titles.sort(), ["one:7200", "two:600"], "each note carries its own lifetime");
});

test("a phone that registers a new address while its old one is being dropped raises no false alarm", async () => {
  const kv = memory(), oldOne = device(), newOne = device();
  await addSub(oldOne.sub, NOW, kv);
  await sendPush(SITE, { title: "t", body: "b" }, NOW + 5, 600, kv, async () => { await addSub(newOne.sub, NOW + 6, kv); return 410; });
  const st = await pushState(kv);
  assert.deepEqual(st.subs.map((s) => s.endpoint), [newOne.sub.endpoint]);
  assert.equal(st.warn, undefined);
});

test("a message can always be opened: an empty site address or a partial link falls back to the app's own address", () => {
  const d = device(), keys = webpush.generateVAPIDKeys();
  for (const [site, url] of [["", undefined], ["", "/#t=abc"], [SITE, "#t=abc"]] as const) {
    const w = prepare({ ...d.sub, added: NOW } as PushSub, { title: "", body: "b", url }, site, keys, 600);
    const plain = JSON.parse(ece.decrypt(w.body, { version: "aes128gcm", privateKey: d.ecdh, authSecret: d.auth }).toString("utf8"));
    assert.equal(plain.notification.navigate, SITE);
    assert.equal(plain.notification.title, "FX Desk", "Apple rejects a message without a title");
    const claims = JSON.parse(Buffer.from(String(w.headers.Authorization).match(/t=([^,]+)/)![1].split(".")[1], "base64url").toString());
    assert.equal(claims.sub, SITE);
  }
});

test("the signing key is never replaced, even if two requests try to create it at once", async () => {
  const kv = memory();
  const [x, y] = await Promise.all([vapidPublic(kv), vapidPublic(kv)]);
  assert.equal(x, y);
  assert.equal(await vapidPublic(kv), x);
});
