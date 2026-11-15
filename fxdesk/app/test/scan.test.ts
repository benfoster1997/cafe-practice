/**
 * The scanner's notification step, end to end, with the outside world
 * replaced: storage in memory, a clock that only moves when something
 * "takes time", a pretend price feed, pretend rules that hand back the
 * messages we choose, and a pretend Apple whose answers we choose.
 * What is real: runScan, the outbox, sendPush, the encryption and signing.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { runScan, type Outbox, type ScanDeps, type Meta } from "../lib/store.ts";
import { addSub, pushState, type Wire } from "../lib/push.ts";
import { type KV } from "../lib/blob.ts";
import { makeBars } from "../../core/bars.ts";
import { type Msg, type ScanResult } from "../lib/engine.ts";

const require = createRequire(import.meta.url);
const ece = require("http_ece");
const SITE = "https://fx-desk-ict.netlify.app";
const utc = (iso: string): number => Date.parse(iso + "Z");
const MON_0645 = utc("2026-11-16T06:45:01"); // Monday, 01:45 New York: the check-in scan

interface Shown { title: string; body: string; navigate: string; tag?: string; ttl: number }
function rig(startMs: number, o: { device?: boolean; alerts?: boolean; kvCostMs?: number } = {}) {
  const data: Record<string, unknown> = { settings: { tdKey: "k", alerts: o.alerts ?? true } };
  let t = startMs;
  const tick = async (ms: number) => { t += ms; };
  const cost = async () => { if (o.kvCostMs) t += o.kvCostMs; };
  const kv: KV = {
    load: (async (k: string, fb: unknown) => { await cost(); return k in data ? structuredClone(data[k]) : fb; }) as KV["load"],
    save: async (k, v) => { await cost(); data[k] = JSON.parse(JSON.stringify(v)); },
    saveIfNew: async (k, v) => { await cost(); if (k in data) return false; data[k] = JSON.parse(JSON.stringify(v)); return true; },
  };
  const ecdh = crypto.createECDH("prime256v1"); ecdh.generateKeys();
  const auth = crypto.randomBytes(16);
  const sub = { endpoint: "https://web.push.apple.com/QTESTTESTTESTTESTTESTTESTTEST", keys: { p256dh: ecdh.getPublicKey().toString("base64url"), auth: auth.toString("base64url") } };
  const w = {
    data, kv, sub,
    /** what the rules will report on the next scan */
    messages: [] as Msg[],
    /** how far behind the feed's newest candle is, in seconds; or an error message to throw */
    feedLag: 0, feedError: "", feedMs: 0,
    /** pairs the rules cannot read (too little history came back) */
    unread: 0,
    /** Apple's answer: a status, or "down", or "hang" (never answers) */
    apple: 201 as number | "down" | "hang", appleMs: 0,
    shown: [] as Shown[], attempts: 0, limits: [] as number[],
    now: () => Math.floor(t / 1000), ms: () => t, set: (ms: number) => { t = ms; }, advance: (ms: number) => { t += ms; },
    deps: {} as Partial<ScanDeps>,
    async scan(settleMs = 9000): Promise<Meta> { return runScan(SITE, settleMs, false, w.deps); },
    outbox: (): Outbox => (data.outbox as Outbox) ?? { items: [] },
    meta: (): Meta => data.meta as Meta,
  };
  w.deps = {
    kv, clock: () => t, sleep: tick,
    bars: async (_pair, _key, now) => {
      await tick(w.feedMs);
      if (w.feedError) throw new Error(w.feedError);
      const open = Math.floor(now / 900) * 900 - 900 - w.feedLag;
      return makeBars(15, [open - 900, open], [1, 1], [1, 1], [1, 1], [1, 1]);
    },
    rules: ((u: Record<string, { m15: { n: number; end: Float64Array } }>, _saved: unknown, now: number): ScanResult => {
      const lastBar = Math.max(...Object.values(u).map((p) => p.m15.end[p.m15.n - 1]));
      const messages = w.messages.map((m) => ({ ...m, until: m.until || now + 3600 })); w.messages = [];
      const watch = (["EURUSD", "GBPUSD", "AUDUSD", "USDJPY"] as const).map((pair, i) => ({ pair, price: 1, time: lastBar, bias: [1, -1, 0, 1][i], biasWhy: "", levels: [], note: "" })).slice(0, 4 - w.unread);
      return { signals: [], watch, messages, lastBar, session: "Outside the killzones" };
    }) as unknown as ScanDeps["rules"],
    send: async (wire: Wire, ms?: number) => {
      w.attempts++; w.limits.push(ms ?? -1);
      if (w.apple === "hang") return new Promise(() => {});
      await tick(w.apple === "down" ? (ms ?? 0) : w.appleMs);
      if (w.apple === "down") throw new Error("no answer");
      if (w.apple >= 200 && w.apple < 300) {
        const n = JSON.parse(ece.decrypt(wire.body, { version: "aes128gcm", privateKey: ecdh, authSecret: auth }).toString("utf8")).notification;
        w.shown.push({ title: n.title, body: n.body, navigate: n.navigate, tag: n.tag, ttl: Number(wire.headers.TTL) });
      }
      return w.apple;
    },
    telegram: async () => ({ ok: true }),
  };
  return w;
}
async function withDevice(startMs: number, o: Parameters<typeof rig>[1] = {}) {
  const w = rig(startMs, o);
  await addSub(w.sub, w.now() - 86400, w.kv);
  return w;
}
const alert = (over: Partial<Msg> = {}): Msg => ({ id: "EURUSD-1", kind: "new", title: "BUY LIMIT EURUSD (demo)", body: "Entry 1.08512", text: "x", until: 0, ...over });

test("the morning check-in goes out once, says which way each pair leans without sounding like an instruction, and is its own notification each day", async () => {
  const w = await withDevice(MON_0645);
  const meta = await w.scan();
  assert.equal(meta.ok, true);
  assert.equal(w.shown.length, 1);
  assert.deepEqual(w.shown[0], { title: "FX Desk is running", body: "Mon 16 Nov, no ticket yet. Bias: EURUSD up, GBPUSD down, AUDUSD none, USDJPY up. Killzones 07:00-10:00 and 12:00-15:00 UK.", navigate: SITE, tag: "checkin-20261116", ttl: 6 * 3600 });
  assert.ok(!/buy|sell/i.test(w.shown[0].body) && w.shown[0].body.length <= 178);
  w.set(MON_0645 + 15 * 60000); await w.scan();
  w.set(MON_0645 + 30 * 60000); await w.scan();
  assert.equal(w.shown.length, 1, "not repeated on the later scans in the window");
  w.set(MON_0645 + 24 * 3600000); await w.scan();
  assert.equal(w.shown[1].tag, "checkin-20261117", "next morning's is a new notification, not a silent replacement");
});

test("if the 06:45 scan does not run, the check-in still goes out on the next scan in the hour", async () => {
  const w = await withDevice(MON_0645 - 15 * 60000);
  await w.scan();
  assert.equal(w.shown.length, 0, "06:30 is too early");
  w.set(MON_0645 + 30 * 60000); // 06:45 and 07:00 never ran
  await w.scan();
  assert.equal(w.shown.length, 1);
  w.set(MON_0645 + 60 * 60000); await w.scan();
  assert.equal(w.shown.length, 1);
});

test("a trade alert opens its ticket, is its own notification, and Apple keeps trying for as long as the order is valid", async () => {
  const w = await withDevice(utc("2026-11-16T08:15:01"));
  w.messages = [alert({ until: Math.floor(utc("2026-11-16T11:00:00") / 1000) }), alert({ kind: "fill", title: "EURUSD: entry traded" })];
  const meta = await w.scan();
  assert.equal(meta.note, "OK");
  assert.equal(w.shown.length, 2);
  const one = w.shown.find((s) => s.title.startsWith("BUY"))!;
  assert.equal(one.navigate, `${SITE}/#t=EURUSD-1`);
  assert.equal(one.tag, "EURUSD-1:new");
  assert.ok(one.ttl > 2.7 * 3600 && one.ttl <= 2.75 * 3600, `lifetime ${one.ttl}s runs to the order's expiry`);
  assert.equal(w.shown.find((s) => s.title.includes("entry"))!.tag, "EURUSD-1:fill", "a different tag, so neither replaces the other");
  assert.deepEqual(w.outbox().items, []);
});

test("an alert Apple does not accept is kept and sent again on the next scan", async () => {
  const w = await withDevice(utc("2026-11-16T08:15:01"));
  w.apple = 503; w.messages = [alert()];
  const meta = await w.scan();
  assert.equal(w.attempts, 2, "two attempts within the scan");
  assert.equal(w.shown.length, 0);
  assert.equal(w.outbox().items.length, 1);
  assert.equal(meta.ok, true);
  assert.equal(meta.note, "OK, but a notification could not be delivered. The next scan will send it again.");
  assert.match((await pushState(w.kv)).warn!, /code 503/);
  w.set(utc("2026-11-16T08:30:01")); w.apple = 201; // fifteen minutes later Apple is back; the rules have nothing new to say
  const next = await w.scan();
  assert.equal(next.note, "OK");
  assert.deepEqual(w.shown.map((s) => s.title), ["BUY LIMIT EURUSD (demo)"]);
  assert.deepEqual(w.outbox().items, []);
  assert.equal((await pushState(w.kv)).warn, undefined);
  w.set(utc("2026-11-16T08:45:01")); await w.scan();
  assert.equal(w.shown.length, 1, "delivered once, not again");
});

test("a run that is cut off in the middle of sending loses nothing: the note is already in the outbox", async () => {
  const w = await withDevice(utc("2026-11-16T08:15:01"));
  w.apple = "hang"; w.messages = [alert()];
  await Promise.race([w.scan(), new Promise((r) => setTimeout(r, 50))]); // the platform kills the run while Apple has not answered
  assert.equal(w.outbox().items.length, 1, "written before the first attempt");
  assert.equal(w.meta().time, Math.floor(utc("2026-11-16T08:15:10") / 1000), "and the scan itself is on record");
  w.set(utc("2026-11-16T08:30:01")); w.apple = 201;
  await w.scan();
  assert.deepEqual(w.shown.map((s) => s.title), ["BUY LIMIT EURUSD (demo)"]);
});

test("an alert that goes out of date undelivered is dropped and reported in red, not sent late", async () => {
  const w = await withDevice(utc("2026-11-16T08:15:01"));
  w.apple = "down"; w.messages = [alert({ until: Math.floor(utc("2026-11-16T08:40:00") / 1000) })];
  await w.scan();
  w.set(utc("2026-11-16T08:30:01")); await w.scan();
  assert.equal(w.outbox().items.length, 1);
  assert.equal(w.outbox().missed, undefined);
  w.set(utc("2026-11-16T08:45:01")); w.apple = 201; await w.scan();
  assert.equal(w.shown.length, 0, "too late to be useful");
  assert.deepEqual(w.outbox().items, []);
  assert.equal(w.outbox().missed, '"BUY LIMIT EURUSD (demo)" from Mon 16 Nov 08:15 UK never reached your phone: the notification service did not accept it in time.');
});

test("when the price feed fails at check-in time he is told there is a problem, and told again when it clears", async () => {
  const w = await withDevice(MON_0645);
  w.feedError = "EURUSD: You have run out of API credits for the current minute. 9 API credits were used, with the current limit being 8. Wait for the next minute or consider switching to a higher tier plan at https://twelvedata.com/pricing";
  const meta = await w.scan();
  assert.equal(meta.ok, false);
  assert.equal(w.shown.length, 1);
  assert.equal(w.shown[0].title, "FX Desk has a problem");
  assert.ok(w.shown[0].body.startsWith("No trade alerts until this is fixed. Price feed problem: EURUSD: You have run out"), w.shown[0].body);
  assert.ok(w.shown[0].body.length <= 170);
  w.set(MON_0645 + 15 * 60000); w.feedError = "";
  await w.scan();
  assert.deepEqual(w.shown.map((s) => s.title), ["FX Desk has a problem", "FX Desk is running again"]);
  w.set(MON_0645 + 30 * 60000); await w.scan();
  assert.equal(w.shown.length, 2, "said once");
});

test("a feed that answers with old prices is not reported as running", async () => {
  const w = await withDevice(MON_0645);
  w.feedLag = 5 * 3600;
  const meta = await w.scan();
  assert.equal(meta.ok, false);
  assert.equal(meta.note, "Prices are about 5 hours behind (a price-feed fault or a market holiday). No trade can be spotted until they catch up.");
  assert.equal(w.shown[0].title, "FX Desk has a problem");
  // a candle the vendor is merely a few minutes late with is normal
  const fine = await withDevice(MON_0645); fine.feedLag = 900;
  assert.equal((await fine.scan()).ok, true);
  assert.equal(fine.shown[0].title, "FX Desk is running");
  // so is a quiet hour (the daily New York roll): ninety minutes is the line
  const quiet = await withDevice(utc("2026-11-16T23:15:01")); quiet.feedLag = 75 * 60;
  assert.equal((await quiet.scan()).ok, true);
  const stuck = await withDevice(utc("2026-11-16T23:15:01")); stuck.feedLag = 100 * 60;
  assert.equal((await stuck.scan()).ok, false);
  // the first scans after the weekend see Friday's last candle: that is not a fault
  const sunday = await withDevice(utc("2026-11-15T22:15:01")); sunday.feedLag = 48 * 3600;
  assert.equal((await sunday.scan()).ok, true);
});

test("with alerts switched off nothing is sent, nothing is kept for later, and the day's check-in is not used up", async () => {
  const w = await withDevice(MON_0645, { alerts: false });
  w.data.outbox = { items: [{ note: { title: "old", body: "b" }, at: w.now() - 60, until: w.now() + 3600 }] };
  w.messages = [alert()];
  await w.scan();
  assert.equal(w.attempts, 0);
  assert.deepEqual(w.outbox().items, []);
  assert.equal(w.data.checkin, undefined);
});

test("with no phone registered nothing piles up, and the scan record says no alert was sent", async () => {
  const w = rig(utc("2026-11-16T08:15:01"));
  w.messages = [alert()];
  const meta = await w.scan();
  assert.equal(meta.note, "OK (notifications are not switched on, so no alert was sent)");
  assert.deepEqual(w.outbox().items, []);
  assert.equal(w.attempts, 0);
});

test("the worst case stays inside the platform's 30 seconds", async () => {
  // slow storage, a feed that takes its full time, the newest candle missing, and Apple not answering at all
  const w = await withDevice(utc("2026-11-16T08:15:00"), { kvCostMs: 150 });
  const start = w.ms();
  w.feedMs = 6900 / 4; w.feedLag = 900; w.apple = "down"; w.messages = [alert()];
  await w.scan();
  const slowFeed = w.ms() - start;
  assert.ok(slowFeed <= 29000, `slow feed: ${slowFeed} ms`);
  assert.equal(w.outbox().items.length, 1, "the undelivered alert is kept");
  // a quick feed with the candle missing: the scanner waits for the vendor, refetches, and still finishes in time
  const v = await withDevice(utc("2026-11-16T08:30:00"), { kvCostMs: 150 });
  const start2 = v.ms();
  v.feedMs = 400; v.feedLag = 900; v.apple = "down"; v.messages = [alert()];
  await v.scan();
  const waited = v.ms() - start2;
  assert.ok(waited <= 29000, `candle missing: ${waited} ms`);
  assert.ok(waited >= 9000 + 3000, "it did wait for the vendor");
  assert.ok(v.limits.every((ms) => ms >= 1000 && ms <= 4000), `attempt limits ${v.limits}`);
});

test("a scan asked for from the app keeps to its own, shorter time limit", async () => {
  // requests from the app may be cut off at ten seconds: slow storage, a feed that never answers in time, Apple not answering
  const w = await withDevice(utc("2026-11-16T08:15:00"), { kvCostMs: 100 });
  w.deps.budgetMs = 8500; w.apple = "down"; w.messages = [alert()];
  const limits: number[] = [];
  const bars = w.deps.bars!;
  w.deps.bars = (async (pair: string, key: string, now: number, size?: number, ms?: number) => { limits.push(ms!); w.advance(ms! / 4); return bars(pair, key, now, size, ms); }) as typeof bars;
  const start = w.ms();
  await w.scan(0);
  assert.ok(limits.every((ms) => ms <= 4000), `feed limits ${limits}`);
  assert.ok(w.ms() - start <= 9800, `took ${w.ms() - start} ms`);
  assert.equal(w.outbox().items.length, 1, "the undelivered alert is kept for the scheduled scanner to send");
});

test("a fault outside the check-in hour is pushed once it has lasted two scans, once, and followed by an all-clear", async () => {
  const w = await withDevice(utc("2026-11-16T09:00:01")); // inside the London killzone
  await w.scan();
  assert.equal(w.shown.length, 0);
  w.set(utc("2026-11-16T09:15:01")); w.feedError = "EURUSD: no data from the price feed";
  await w.scan();
  assert.equal(w.shown.length, 0, "one failed scan may be a blip: nothing is sent");
  w.set(utc("2026-11-16T09:30:01")); await w.scan();
  assert.deepEqual(w.shown.map((s) => s.title), ["FX Desk has a problem"]);
  assert.ok(w.shown[0].body.startsWith("No trade alerts until this is fixed. Price feed problem: EURUSD: no data"));
  w.set(utc("2026-11-16T09:45:01")); await w.scan();
  assert.equal(w.shown.length, 1, "not repeated while it lasts");
  w.set(utc("2026-11-16T10:00:01")); w.feedError = ""; await w.scan();
  assert.deepEqual(w.shown.map((s) => s.title), ["FX Desk has a problem", "FX Desk is running again"]);
});

test("pairs the feed sent too little history for are reported, not silently dropped", async () => {
  const w = await withDevice(MON_0645);
  w.unread = 1;
  const meta = await w.scan();
  assert.equal(meta.ok, false);
  assert.equal(meta.note, "The price feed sent too little history for 1 of the 4 pairs, so it is not being watched.");
  assert.equal(w.shown[0].title, "FX Desk has a problem");
});

test("a test asked for in Setup comes from the scanner itself, even at the weekend, once", async () => {
  const w = await withDevice(utc("2026-11-14T23:45:01")); // Saturday night: market closed
  (w.data.settings as Record<string, unknown>).testDue = w.now() - 300;
  const meta = await w.scan();
  assert.equal(meta.note, "Market closed. Scanning resumes Sunday 22:00 UK.");
  assert.equal(w.shown.length, 1);
  assert.equal(w.shown[0].title, "FX Desk scanner test");
  assert.equal(w.shown[0].navigate, SITE);
  assert.equal((w.data.settings as Record<string, unknown>).testDue, undefined);
  assert.equal((w.data.settings as Record<string, unknown>).tdKey, "k", "the rest of the settings are untouched");
  w.set(utc("2026-11-15T00:00:01")); await w.scan();
  assert.equal(w.shown.length, 1);
  // and if Apple is down at that moment it is kept and sent by the next scan, like any other note
  const v = await withDevice(utc("2026-11-14T23:45:01"));
  (v.data.settings as Record<string, unknown>).testDue = v.now(); v.apple = 503;
  await v.scan();
  assert.equal(v.outbox().items.length, 1);
  v.set(utc("2026-11-15T00:00:01")); v.apple = 201; await v.scan();
  assert.deepEqual(v.shown.map((s) => s.title), ["FX Desk scanner test"]);
});
