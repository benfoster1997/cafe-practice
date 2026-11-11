import type { Config, Context } from "@netlify/functions";
import { nyTimeOnDay } from "../../../core/models/common.ts";
import { tradingDay, ukHM } from "../../../core/time.ts";
import { mt5HM } from "../../lib/engine.ts";
import { load, save, getSettings, isClaimed, claim, checkPass, telegram, runScan, type Meta, type SignalRec, type WatchRow } from "../../lib/store.ts";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export default async (req: Request, context: Context) => {
  const route = context.params.route ?? "";
  const site = Netlify.env.get("URL") ?? new URL(req.url).origin;
  const body: any = req.method === "POST" ? await req.json().catch(() => ({})) : {};

  if (route === "status") return json({ claimed: await isClaimed(), scannerLastRan: (await load<Partial<Meta>>("meta", {})).time ?? null });
  if (route === "claim" && req.method === "POST") { const err = await claim(body.code ?? "", body.pass ?? ""); return err ? json({ error: err }, 400) : json({ ok: true }); }
  if (!(await checkPass(req.headers.get("x-pass")))) return json({ error: "Wrong passcode." }, 401);

  if (route === "state") {
    const [signals, watch, meta, s, journal] = await Promise.all([load<SignalRec[]>("signals", []), load<WatchRow[]>("watch", []), load<Partial<Meta>>("meta", {}), getSettings(), load<Record<string, SignalRec["mine"]>>("journal", {})]);
    const now = Math.floor(Date.now() / 1000), day = tradingDay(now);
    const uk = (m: number) => ukHM(nyTimeOnDay(day, m));
    return json({
      now, meta, watch,
      windows: [{ name: "London killzone", from: uk(120), to: uk(300) }, { name: "New York killzone", from: uk(420), to: uk(600) }, { name: "Close any open trade", from: uk(960), to: uk(960) }],
      signals: signals.slice(0, 120).map(({ order, ...rest }) => ({ ...rest, mine: journal[rest.id], expireMt5: mt5HM(rest.expireAt, s.clock), flatMt5: mt5HM(rest.flatAt, s.clock) })),
      settings: { hasKey: !!s.tdKey, hasBot: !!s.tgToken, hasChat: !!s.tgChat, balance: s.balance, alerts: s.alerts, clock: s.clock, mt5Now: mt5HM(now, s.clock) },
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
  if (route === "scan") return json(await runScan(site, 0, !!body.force));
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
