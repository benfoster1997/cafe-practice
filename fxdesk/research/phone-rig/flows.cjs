// Drives the REAL page (app/public/index.html) in a headless browser at iPhone size, with the iPhone's
// notification machinery replaced by a stand-in, against server.mjs. It is the nearest thing to a phone
// the project has: nobody here owns an iPhone. Each scenario prints what the screen says and how many
// requests the page made, which is how the runaway retry loop of 14 Nov 2026 was measured (796 requests
// in six seconds before the fix, 1 after).
// Usage: ./run.sh [scenario ...]   (no arguments = all; takes about three minutes)
// Needs Playwright with Chromium, which Claude's cloud sessions have; it is not a dependency of the app.
const { chromium, devices } = require("playwright");
const crypto = require("node:crypto");
const fs = require("node:fs");
const BASE = "http://localhost:" + (process.env.PORT || 8811);
const STORE = process.env.MOCK_STORE;
const ecdh = crypto.createECDH("prime256v1"); ecdh.generateKeys();
const KEYS = { p256dh: ecdh.getPublicKey().toString("base64url"), auth: crypto.randomBytes(16).toString("base64url") };
const now = Math.floor(Date.now() / 1000);
/** The storage every scenario starts from: a claimed app (passcode "secret1"), a price key, one finished scan. */
function base() {
  const salt = "local-test-salt", hash = crypto.createHash("sha256").update(salt + "secret1").digest("hex");
  const row = (pair, price, bias) => ({ pair, price, time: now - 60, bias, biasWhy: "Yesterday closed above the previous day's high.", levels: [{ name: "Yesterday's high", price: price * 1.002, pips: 20.8, taken: false }, { name: "Yesterday's low", price: price * 0.997, pips: -40.4, taken: false }], note: "Looking to buy, but only inside a killzone." });
  return {
    settings: { tdKey: "local-test", tgToken: "", tgChat: "", balance: 500, alerts: true, clock: "ny7" },
    auth: { salt, hash }, signals: [], push: { subs: [] },
    watch: [row("EURUSD", 1.13177, 1), row("GBPUSD", 1.3265, -1), row("AUDUSD", 0.652, 0), row("USDJPY", 151.12, 1)],
    meta: { time: now - 60, ok: true, note: "OK", lastBar: now - 60, session: "Outside the killzones", credits: 4 },
  };
}
const ticket = (id, status) => ({ id, pair: "EURUSD", dir: 1, entry: 1.1, stop: 1.099, tp: 1.102, signalTime: now - 3600, expireAt: now - 600, flatAt: now + 7200, riskPips: 10, rewardPips: 20, grade: "A", reasons: ["test"], order: {}, lots: 0.05, riskMoney: 5, status, statusNote: "Target hit.", alerted: { fresh: true, fill: true, done: true }, r: 2 });

const stub = (o) => {
  localStorage.setItem("fx-pass", "secret1");
  if (o.hadPush) localStorage.setItem("fx-push", "1");
  if (o.standalone) Object.defineProperty(navigator, "standalone", { value: true, configurable: true });
  if (!o.standalone) return; // a Safari tab on iPhone has no push support at all
  if (!sessionStorage.getItem("perm")) sessionStorage.setItem("perm", o.perm || "default");
  window.__calls = { requestPermission: 0, subscribe: 0, unsubscribe: 0, order: [] };
  window.Notification = class { static get permission() { return sessionStorage.getItem("perm"); } static async requestPermission() { window.__calls.requestPermission++; window.__calls.order.push("requestPermission"); const p = o.deny ? "denied" : "granted"; sessionStorage.setItem("perm", p); return p; } };
  window.PushManager = function () {};
  const keyOf = () => sessionStorage.getItem("subkey") || "";
  const mk = () => ({ endpoint: "https://" + (o.host || "web.push.apple.com") + "/QTESTDEVICE" + (sessionStorage.getItem("gen") || "0"), options: { applicationServerKey: keyOf() ? Uint8Array.from(atob(keyOf()), (c) => c.charCodeAt(0)).buffer : null }, toJSON() { return { endpoint: this.endpoint, keys: o.keys }; }, unsubscribe: async () => { window.__calls.unsubscribe++; sessionStorage.removeItem("sub"); sessionStorage.setItem("gen", String(+(sessionStorage.getItem("gen") || 0) + 1)); return true; } });
  const reg = { pushManager: {
    getSubscription: async () => { window.__calls.order.push("getSubscription"); return sessionStorage.getItem("sub") ? mk() : null; },
    subscribe: async (opt) => { window.__calls.subscribe++; window.__calls.order.push("subscribe"); if (o.subscribeFails) throw new Error("Registration failed - push service error"); sessionStorage.setItem("sub", "1"); sessionStorage.setItem("subkey", btoa(String.fromCharCode(...new Uint8Array(opt.applicationServerKey.buffer || opt.applicationServerKey)))); return mk(); } } };
  Object.defineProperty(navigator, "serviceWorker", { value: { register: async () => reg, ready: o.readyNever ? new Promise(() => {}) : Promise.resolve(reg) }, configurable: true });
};

(async () => {
  const browser = await chromium.launch();
  const reset = async (mode, mutate) => {
    const d = base();
    if (mutate) mutate(d);
    fs.writeFileSync(STORE, JSON.stringify(d));
    fs.writeFileSync(__dirname + "/apple-mode", mode || "ok");
    await fetch(BASE + "/__reset");
  };
  const counts = async () => (await fetch(BASE + "/__counts")).json();
  const store = () => JSON.parse(fs.readFileSync(STORE, "utf8"));
  const errors = [];
  const open = async (o, path = "/") => {
    const ctx = await browser.newContext({ ...devices["iPhone 15 Pro Max"] });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    await page.addInitScript(stub, { standalone: true, keys: KEYS, ...o });
    await page.goto(BASE + path); await page.waitForSelector(".card");
    return page;
  };
  const setup = async (page) => { await page.click('nav button[data-tab="setup"]'); await page.waitForTimeout(250); };
  const card = (page) => page.evaluate(() => [...document.querySelectorAll(".card")].find((c) => c.innerText.includes("iPhone notifications"))?.innerText.replace(/\n+/g, " | ").slice(0, 420));
  const alarm = (page) => page.evaluate(() => document.querySelector(".alarm")?.innerText.replace(/\n+/g, " ") ?? "(no red warning)");
  const say = (name, o) => console.log(`\n### ${name}\n` + Object.entries(o).map(([k, v]) => `  ${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`).join("\n"));

  const S = {
    async happy() {
      await reset("ok");
      const page = await open({ perm: "default" }); await setup(page);
      const before = await card(page);
      await page.click("#pushon"); await page.waitForTimeout(2500);
      say("happy: tap Turn on, Apple accepts", { before, after: await card(page), msg: await page.evaluate(() => document.querySelector("#m-push")?.innerText), requests: await counts(), calls: await page.evaluate(() => window.__calls), devices: store().push.subs.length, warn: store().push.warn ?? null });
      await page.context().close();
    },
    async reopen() {
      await reset("ok");
      let page = await open({ perm: "default" }); await setup(page); await page.click("#pushon"); await page.waitForTimeout(1500);
      await fetch(BASE + "/__reset");
      await page.reload(); await page.waitForSelector(".card"); await page.waitForTimeout(3000);
      say("reopen: app opened again with everything fine (expect one quiet re-registration, no hello)", { requests: await counts(), alarm: await alarm(page) });
      await page.context().close();
    },
    async helloRefused() {
      await reset("refuse");
      const page = await open({ perm: "granted", hadPush: true }); await page.waitForTimeout(6000);
      const c = await counts(); const a = await alarm(page); await setup(page);
      say("helloRefused: permission already granted, Apple refuses every hello (6 seconds open)", { requests: c, alarm: a, card: await card(page), warn: store().push.warn ?? null });
      await page.context().close();
    },
    async tapRefused() {
      await reset("refuse");
      const page = await open({ perm: "default" }); await setup(page);
      await page.click("#pushon"); await page.waitForTimeout(6000);
      say("tapRefused: tap Turn on, Apple refuses every hello (6 seconds)", { requests: await counts(), card: await card(page), msg: await page.evaluate(() => document.querySelector("#m-push")?.innerText) });
      await page.context().close();
    },
    async appleDown() {
      await reset("down");
      const page = await open({ perm: "granted", hadPush: true }); await page.waitForTimeout(6000);
      const c = await counts(); const a = await alarm(page); await setup(page);
      say("appleDown: permission granted, Apple unreachable (6 seconds open)", { requests: c, alarm: a, card: await card(page) });
      await page.context().close();
    },
    async serverRejects() {
      await reset("ok");
      const page = await open({ perm: "granted", hadPush: true, host: "example.com" }); await page.waitForTimeout(6000);
      const c = await counts(); const a = await alarm(page); await setup(page);
      say("serverRejects: the server will not accept this phone's address (6 seconds open)", { requests: c, alarm: a, card: await card(page) });
      await page.context().close();
    },
    async subscribeFails() {
      await reset("ok");
      const page = await open({ perm: "granted", hadPush: true, subscribeFails: true }); await page.waitForTimeout(6000);
      const c = await counts(); const calls = await page.evaluate(() => window.__calls.subscribe); await setup(page);
      say("subscribeFails: the phone refuses to make a subscription every time (6 seconds open)", { requests: c, subscribeCalls: calls, card: await card(page) });
      await page.context().close();
    },
    async neverReady() {
      await reset("ok");
      let page = await open({ perm: "default", readyNever: true }); await setup(page);
      await page.click("#pushon"); await page.waitForTimeout(17000);
      say("neverReady (tap): the background script never starts; 17 seconds after tapping Turn on", { card: await card(page), msg: await page.evaluate(() => document.querySelector("#m-push")?.innerText) });
      await page.context().close();
      await reset("ok");
      page = await open({ perm: "granted", hadPush: true, readyNever: true }); await page.waitForTimeout(17000); const a = await alarm(page); await setup(page);
      say("neverReady (open): permission granted, background script never starts; 17 seconds after opening", { alarm: a, card: await card(page) });
      await page.context().close();
    },
    async denied() {
      await reset("ok");
      const page = await open({ perm: "default", deny: true }); await setup(page);
      await page.click("#pushon"); await page.waitForTimeout(1500);
      say("denied: he taps Don't Allow", { card: await card(page), requests: await counts() });
      await page.context().close();
    },
    async permissionFirst() {
      await reset("ok");
      const page = await open({ perm: "default" }); await setup(page);
      await page.click("#pushon"); await page.waitForTimeout(1500);
      say("permissionFirst: order of calls after the tap (requestPermission must be first)", { order: await page.evaluate(() => window.__calls.order) });
      await page.context().close();
    },
    async keyChanged() {
      await reset("ok");
      let page = await open({ perm: "default" }); await setup(page); await page.click("#pushon"); await page.waitForTimeout(1500);
      // the server's signing key is replaced behind the phone's back; Apple then refuses everything sent to the old subscription
      const d = store(); const wp = require("/home/user/cafe-practice/fxdesk/node_modules/web-push"); d.vapid = wp.generateVAPIDKeys(); fs.writeFileSync(STORE, JSON.stringify(d));
      fs.writeFileSync(__dirname + "/apple-mode", "refuse-old");
      await fetch(BASE + "/__reset");
      await page.reload(); await page.waitForSelector(".card"); await page.waitForTimeout(5000);
      const c = await counts(); await setup(page);
      say("keyChanged: signing key replaced on the server, app reopened (5 seconds)", { requests: c, calls: await page.evaluate(() => window.__calls), card: await card(page) });
      await page.context().close();
    },
    async vapidMismatch() {
      await reset("ok");
      const page = await open({ perm: "default" }); await setup(page); await page.click("#pushon"); await page.waitForTimeout(1500);
      fs.writeFileSync(__dirname + "/apple-mode", "mismatch-old"); // Apple now says the phone's address belongs to a different signing key
      await page.click("#pushtest"); await page.waitForTimeout(800);
      const msg = await page.evaluate(() => document.querySelector("#m-push")?.innerText);
      await fetch(BASE + "/__reset");
      await page.reload(); await page.waitForSelector(".card"); await page.waitForTimeout(3000);
      const c = await counts(); const a = await alarm(page); await setup(page);
      say("vapidMismatch: Apple says the address was made for another signing key; app reopened", { testMessage: msg, requests: c, calls: await page.evaluate(() => window.__calls), alarm: a, card: (await card(page)).slice(0, 80), endpoints: store().push.subs.map((x) => x.endpoint.slice(-12)), warn: store().push.warn ?? null });
      await page.context().close();
    },
    async deadAddress() {
      await reset("ok");
      const page = await open({ perm: "default" }); await setup(page); await page.click("#pushon"); await page.waitForTimeout(1500);
      fs.writeFileSync(__dirname + "/apple-mode", "gone-old"); // Apple has dropped the phone's address, but the iPhone still hands out the old one
      await page.click("#pushtest"); await page.waitForTimeout(800);
      const msg = await page.evaluate(() => document.querySelector("#m-push")?.innerText);
      const mid = store().push;
      await fetch(BASE + "/__reset");
      await page.reload(); await page.waitForSelector(".card"); await page.waitForTimeout(3000);
      const c = await counts(); const a = await alarm(page); await setup(page);
      say("deadAddress: Apple dropped the address; the app is reopened and must get a NEW address by itself", { testMessage: msg, serverAfterTest: { devices: mid.subs.length, warn: mid.warn }, requests: c, calls: await page.evaluate(() => window.__calls), alarm: a, card: (await card(page)).slice(0, 70), endpoints: store().push.subs.map((x) => x.endpoint.slice(-7)), warn: store().push.warn ?? null });
      await page.context().close();
    },
    async deadAddressTap() {
      await reset("gone-old", (d) => { d.push = { subs: [] }; });
      const page = await open({ perm: "default" }); await setup(page);
      await page.evaluate(() => { sessionStorage.setItem("sub", "1"); }); // the iPhone still holds an address Apple no longer honours
      await page.click("#pushon"); await page.waitForTimeout(2500);
      say("deadAddressTap: he taps Turn on while the iPhone holds a dead address", { requests: await counts(), calls: await page.evaluate(() => window.__calls), card: (await card(page)).slice(0, 70), msg: await page.evaluate(() => document.querySelector("#m-push")?.innerText), endpoints: store().push.subs.map((x) => x.endpoint.slice(-7)), warn: store().push.warn ?? null });
      await page.context().close();
    },
    async twoDevices() {
      const other = { endpoint: "https://web.push.apple.com/QOTHERDEVICE9", keys: KEYS, added: now - 5000, lastOk: now - 4000 };
      await reset("gone-old", (d) => { d.push = { subs: [other, { endpoint: "https://web.push.apple.com/QTESTDEVICE0", keys: KEYS, added: now - 5000 }] }; });
      const page = await open({ perm: "granted", hadPush: true });
      await page.evaluate(() => { sessionStorage.setItem("sub", "1"); }); await page.reload(); await page.waitForSelector(".card");
      // a scheduled alert finds this phone's address dead while the other device accepts
      await page.waitForTimeout(500); await fetch(BASE + "/__reset");
      const r = await page.evaluate(async () => (await fetch("/api/pushtest", { method: "POST", headers: { "content-type": "application/json", "x-pass": "secret1" }, body: "{}" })).json());
      const afterSend = { result: r, devices: store().push.subs.map((x) => x.endpoint.slice(-7)), warn: store().push.warn ?? null };
      await fetch(BASE + "/__reset");
      await page.reload(); await page.waitForSelector(".card"); await page.waitForTimeout(3000);
      const c = await counts(); await setup(page);
      say("twoDevices: this phone's address is dead, another device is healthy", { afterSend, requestsOnReopen: c, card: (await card(page)).slice(0, 70), devices: store().push.subs.map((x) => x.endpoint.slice(-7)), warn: store().push.warn ?? null });
      await page.context().close();
    },
    async wrongPasscode() {
      await reset("ok");
      const ctx = await browser.newContext({ ...devices["iPhone 15 Pro Max"] }); const page = await ctx.newPage();
      await page.goto(BASE + "/"); await page.waitForSelector("#p");
      await page.fill("#p", "not-the-passcode"); await page.click("#go"); await page.waitForTimeout(1500);
      say("wrongPasscode: what the lock screen says after a wrong passcode", { message: await page.evaluate(() => document.querySelector("#e")?.innerText), formStillThere: await page.evaluate(() => !!document.querySelector("#p")) });
      await page.fill("#p", "secret1"); await page.click("#go"); await page.waitForTimeout(1500);
      say("wrongPasscode: then the right one", { unlocked: await page.evaluate(() => !document.querySelector("#nav").hidden) });
      await ctx.close();
    },
    async alertsOff() {
      await reset("ok", (d) => { d.settings.alerts = false; });
      const page = await open({ perm: "default" }); await page.waitForTimeout(800); const a = await alarm(page); await setup(page);
      say("alertsOff: alerts switched off in Setup", { alarm: a, setupSays: await page.evaluate(() => [...document.querySelectorAll(".err")].map((e) => e.innerText)) });
      await page.context().close();
    },
    async missedAndWaiting() {
      await reset("ok", (d) => { d.outbox = { items: [{ note: { title: "EURUSD: entry traded", body: "b" }, at: now - 600, until: now + 3600 }], missed: '"BUY LIMIT EURUSD (demo)" from Mon 16 Nov 08:15 UK never reached your phone: the notification service did not accept it in time.', missedAt: now - 300 }; d.push = { subs: [{ endpoint: "https://web.push.apple.com/QTESTDEVICE0", keys: KEYS, added: now - 5000 }], warn: "Last notification failed: the notification service refused the message (code 503)." }; });
      const page = await open({ perm: "default" }); await page.waitForTimeout(800);
      say("missedAndWaiting: an alert expired undelivered and another is waiting", { alarms: await page.evaluate(() => [...document.querySelectorAll(".alarm")].map((e) => e.innerText.replace(/\n+/g, " "))) });
      await page.context().close();
    },
    async scannerTest() {
      await reset("ok");
      const page = await open({ perm: "default" }); await setup(page); await page.click("#pushon"); await page.waitForTimeout(1500);
      await fetch(BASE + "/__reset");
      await page.click("#pushlater"); await page.waitForTimeout(800);
      const msg = await page.evaluate(() => document.querySelector("#m-push")?.innerText);
      const asked = { testDue: !!store().settings.testDue, appleSoFar: (await counts()).apple || 0 };
      // the scheduled scanner's next run (the weekend: market closed)
      const meta = await page.evaluate(async () => (await fetch("/api/scan", { method: "POST", headers: { "content-type": "application/json", "x-pass": "secret1" }, body: "{}" })).json());
      const after = { apple: (await counts()).apple || 0, testDue: store().settings.testDue ?? null, outbox: (store().outbox || { items: [] }).items.length, tdKeyKept: !!store().settings.tdKey };
      await page.evaluate(async () => (await fetch("/api/scan", { method: "POST", headers: { "content-type": "application/json", "x-pass": "secret1" }, body: "{}" })).json());
      say("scannerTest: he asks for a test from the scanner; the next scheduled run sends it, once", { message: msg, asked, scanNote: meta.note, after, appleAfterSecondScan: (await counts()).apple });
      await page.context().close();
    },
    async resetTool() {
      await reset("ok");
      const page = await open({ perm: "default" }); await setup(page); await page.click("#pushon"); await page.waitForTimeout(1500);
      await fetch(BASE + "/__reset");
      await page.evaluate(() => { for (const d of document.querySelectorAll("details")) d.open = true; });
      await page.click("#pushreset"); await page.waitForTimeout(2500);
      say("resetTool: 'Reset this phone's notifications' gives the phone a new address and proves it", { requests: await counts(), calls: await page.evaluate(() => window.__calls), msg: await page.evaluate(() => document.querySelector("#m-push")?.innerText), endpoints: store().push.subs.map((x) => x.endpoint.slice(-7)), card: (await card(page)).slice(0, 60) });
      await page.context().close();
    },
    async backgroundLink() {
      await reset("ok", (d) => { d.signals = [ticket("EURUSD-1", "won"), ticket("EURUSD-2", "won")]; d.signals[1].signalTime -= 86400 * 20; for (let i = 3; i < 20; i++) { const t = ticket("EURUSD-" + i, "lost"); t.signalTime -= 86400 * (i - 1); d.signals.push(t); } });
      const page = await open({ perm: "granted" }); await page.waitForTimeout(600); await setup(page);
      // the app is on the Setup tab; a notification is tapped; iOS brings the app forward on the ticket's address
      await page.evaluate(() => { location.hash = "t=EURUSD-19"; }); await page.waitForTimeout(1200);
      say("backgroundLink: the app was left on Setup when a ticket notification is tapped", { tab: await page.evaluate(() => document.querySelector("nav button.sel")?.textContent), ticketShown: await page.evaluate(() => !!document.getElementById("t-EURUSD-19")) });
      await page.context().close();
    },
    async hashLink() {
      await reset("ok", (d) => { d.signals = [ticket("EURUSD-1", "won"), ticket("EURUSD-2", "won")]; d.signals[1].signalTime -= 86400 * 20; for (let i = 3; i < 20; i++) { const t = ticket("EURUSD-" + i, "lost"); t.signalTime -= 86400 * (i - 1); d.signals.push(t); } });
      const page = await open({ perm: "granted" }); await page.waitForTimeout(800);
      const before = await page.evaluate(() => !!document.getElementById("t-EURUSD-19"));
      await page.evaluate(() => { location.hash = "t=EURUSD-19"; }); await page.waitForTimeout(1200);
      const after = await page.evaluate(() => !!document.getElementById("t-EURUSD-19"));
      await page.evaluate(() => { location.hash = "t=EURUSD-18"; }); await page.waitForTimeout(1200);
      const second = await page.evaluate(() => { const el = document.getElementById("t-EURUSD-18"); return el ? Math.round(el.getBoundingClientRect().top) : null; });
      say("hashLink: app already open, a notification link to another ticket is followed", { ticketShownBefore: before, ticketShownAfterLink: after, secondLinkTicketTopPx: second });
      await page.context().close();
    },
  };
  const want = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(S);
  for (const n of want) { try { await S[n](); } catch (e) { console.log(`\n### ${n} FAILED TO RUN: ${e.message}`); } }
  console.log("\npage errors:", errors.length ? errors : "none");
  await browser.close();
})();
