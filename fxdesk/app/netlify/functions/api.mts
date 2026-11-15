import type { Config, Context } from "@netlify/functions";
import { nyTimeOnDay } from "../../../core/models/common.ts";
import { tradingDay, ukHM, nyClock } from "../../../core/time.ts";
import { mt5HM, CHECKIN_FROM, CHECKIN_TO } from "../../lib/engine.ts";
import { vapidPublic, pushState, addSub, removeSub, sendPush, SITE } from "../../lib/push.ts";
import { load, save, getSettings, isClaimed, claim, checkPass, telegram, runScan, type Meta, type SignalRec, type WatchRow, type Outbox, type CheckIn, type ScanTest } from "../../lib/store.ts";

/** A request from the app must be answered well inside the platform's limit for ordinary functions (ten seconds on some plans). */
const QUICK_MS = 6000;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export default async (req: Request, context: Context) => {
  const route = context.params.route ?? "";
  const site = Netlify.env.get("URL") || new URL(req.url).origin || SITE;
  const body: any = req.method === "POST" ? await req.json().catch(() => ({})) : {};

  // pushKey is the PUBLIC half of the notification signing key; a phone needs it to subscribe.
  if (route === "status") return json({ claimed: await isClaimed(), scannerLastRan: (await load<Partial<Meta>>("meta", {})).time ?? null, pushKey: await vapidPublic() });
  if (route === "claim" && req.method === "POST") { const err = await claim(body.code ?? "", body.pass ?? ""); return err ? json({ error: err }, 400) : json({ ok: true }); }
  if (!(await checkPass(req.headers.get("x-pass")))) return json({ error: "Wrong passcode." }, 401);

  if (route === "state") {
    const [signals, watch, meta, s, journal, push, box, ci, asked] = await Promise.all([load<SignalRec[]>("signals", []), load<WatchRow[]>("watch", []), load<Partial<Meta>>("meta", {}), getSettings(), load<Record<string, SignalRec["mine"]>>("journal", {}), pushState(), load<Outbox>("outbox", { items: [] }), load<CheckIn>("checkin", {}), load<ScanTest>("scantest", {})]);
    const now = Math.floor(Date.now() / 1000), day = tradingDay(now);
    const uk = (m: number) => ukHM(nyTimeOnDay(day, m));
    // Has this morning's check-in gone out? Asked only once its hour has passed, on a weekday, when one was owed.
    const ny = nyClock(now), windowOpened = now - (ny.minuteOfDay - CHECKIN_FROM) * 60 - 60;
    const checkinMissed = ny.dow >= 1 && ny.dow <= 5 && ny.minuteOfDay >= CHECKIN_TO && s.alerts && push.subs.length > 0 && !((ci.at ?? 0) >= windowOpened);
    const tail = (x: { endpoint: string }) => x.endpoint.slice(-24);
    return json({
      now, meta, watch,
      push: {
        key: await vapidPublic(), devices: push.subs.length, endpoints: push.subs.map(tail), lastOk: push.lastOk ?? null, warn: push.warn ?? null,
        failing: push.subs.filter((x) => (x.fails ?? 0) >= 2).map(tail),                                   // devices Apple keeps refusing
        waiting: (box.items ?? []).map((q) => ({ title: q.note.title, at: q.at })),                         // notes not yet accepted, to be sent again at the next scan
        lastFail: push.lastFail ?? null, lastFailAt: push.lastFailAt ?? null,                               // the most recent warning, kept after it clears
        missed: box.missed && now - (box.missedAt ?? 0) < 2 * 86400 ? box.missed : null,                    // an alert that went out of date undelivered
        checkin: ci.at ?? null, checkinMissed,
      },
      windows: [{ name: "London killzone", from: uk(120), to: uk(300) }, { name: "New York killzone", from: uk(420), to: uk(600) }, { name: "Close any open trade", from: uk(960), to: uk(960) }],
      signals: signals.slice(0, 120).map(({ order, ...rest }) => ({ ...rest, mine: journal[rest.id], expireMt5: mt5HM(rest.expireAt, s.clock), flatMt5: mt5HM(rest.flatAt, s.clock) })),
      settings: { hasKey: !!s.tdKey, hasBot: !!s.tgToken, hasChat: !!s.tgChat, balance: s.balance, alerts: s.alerts, clock: s.clock, mt5Now: mt5HM(now, s.clock), testDue: asked.at ?? null },
    });
  }
  if (req.method !== "POST") return json({ error: "Not found." }, 404);

  if (route === "settings") {
    const s = await getSettings();
    if (typeof body.tdKey === "string" && body.tdKey.trim()) s.tdKey = body.tdKey.trim();
    if (typeof body.tgToken === "string" && body.tgToken.trim()) { s.tgToken = body.tgToken.trim(); s.tgChat = ""; }
    if (Number.isFinite(+body.balance) && +body.balance >= 50) s.balance = Math.round(+body.balance);
    if (typeof body.alerts === "boolean") s.alerts = body.alerts;
    if (["ny7", "utc", "uk"].includes(body.clock)) s.clock = body.clock;
    await save("settings", s);
    return json({ ok: true });
  }
  if (route === "telegram") {
    // Finds the chat by reading the message the owner just sent to his own bot, then says hello.
    const s = await getSettings();
    if (!s.tgToken) return json({ error: "Add the bot token first." }, 400);
    const me = await telegram(s.tgToken, "getMe", {});
    if (!me.ok) return json({ error: "Telegram does not recognise that bot token. Copy it again from BotFather." }, 400);
    if (!s.tgChat) {
      const up = await telegram(s.tgToken, "getUpdates", { limit: 20 });
      const chat = (up.result ?? []).map((u: any) => u.message?.chat).filter((c: any) => c && c.type === "private").pop();
      if (!chat) return json({ error: `Open Telegram, find @${me.result.username}, press Start (or send it any message), then tap Connect again.` }, 400);
      s.tgChat = String(chat.id);
      await save("settings", s);
    }
    const sent = await telegram(s.tgToken, "sendMessage", { chat_id: s.tgChat, text: "FX Desk is connected. Trade alerts will arrive here.", reply_markup: { inline_keyboard: [[{ text: "Open FX Desk", url: site }]] } });
    return sent.ok ? json({ ok: true, bot: me.result.username }) : json({ error: sent.description ?? "Telegram refused the test message." }, 400);
  }
  if (route === "push") {
    // the phone hands over its notification address; a hello proves the whole chain there and then
    const now = Math.floor(Date.now() / 1000);
    const err = await addSub(body.subscription, now);
    if (err) return json({ error: err }, 400);
    if (!body.quiet) {
      // to THIS phone only: another device accepting the hello would prove nothing about this one
      const r = await sendPush(site, { title: "FX Desk notifications are on", body: "Trade alerts and the morning check-in will arrive like this." }, now, 600, undefined, undefined, { only: body.subscription.endpoint, budgetMs: QUICK_MS });
      // `dead`: Apple says this address is finished, so the phone must ask the iPhone for a new one (the page does that by itself)
      if (!r.sent && !r.failed && !r.removed) return json({ error: "This phone's address was not on the server's list when the test was sent. Try again." }, 502);
      if (!r.sent) return json({ error: (await pushState()).warn ?? "The notification service did not accept the test message.", dead: r.removed > 0 }, 502);
    }
    return json({ ok: true });
  }
  if (route === "pushtest") {
    const now = Math.floor(Date.now() / 1000);
    if (!(await pushState()).subs.length) return json({ error: "Notifications are not switched on for any device yet." }, 400);
    const r = await sendPush(site, { title: "FX Desk test", body: "If you can read this, alerts can reach this phone." }, now, 600, undefined, undefined, { budgetMs: QUICK_MS });
    const devices = (await pushState()).subs.length + r.removed;
    return r.sent ? json({ ok: true, sent: r.sent, devices }) : json({ error: (await pushState()).warn ?? "The notification service did not accept the message." }, 502);
  }
  if (route === "pushlater") {
    // A test from the scheduled scanner itself, on its next run: the one route a trade alert takes that no button here can exercise.
    const s = await getSettings();
    if (!(await pushState()).subs.length) return json({ error: "Notifications are not switched on for any device yet." }, 400);
    if (!s.alerts) return json({ error: "Alerts are switched off, so the scanner sends nothing. Switch them on first." }, 400);
    await save("scantest", { at: Math.floor(Date.now() / 1000) }); // its own record: the scanner clears it without ever rewriting the owner's settings
    return json({ ok: true, next: (Math.floor(Date.now() / 1000 / 900) + 1) * 900 });
  }
  if (route === "pushoff") { await removeSub(String(body.endpoint ?? "")); return json({ ok: true }); }
  if (route === "scan") return json(await runScan(site, 0, !!body.force, { budgetMs: 8500 }));
  if (route === "mine") {
    const journal = await load<Record<string, SignalRec["mine"]>>("journal", {});
    if (!body.id) return json({ error: "Missing ticket." }, 400);
    journal[String(body.id)] = { took: !!body.took, note: String(body.note ?? "").slice(0, 300), at: Math.floor(Date.now() / 1000) };
    await save("journal", journal);
    return json({ ok: true });
  }
  return json({ error: "Not found." }, 404);
};

export const config: Config = { path: "/api/:route" };
