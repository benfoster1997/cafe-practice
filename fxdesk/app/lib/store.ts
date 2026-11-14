/**
 * store.ts - everything that touches storage, secrets or the outside world:
 * saved state (Netlify Blobs), the passcode, the price feed, and the two
 * ways of reaching the owner (iPhone notifications, and Telegram as an
 * optional backup).
 */
import { load, save } from "./blob.ts";
import { sendPush, pushState } from "./push.ts";
import { type Bars } from "../../core/bars.ts";
import { marketOpen, tradingDay, ukHM } from "../../core/time.ts";
import { nyTimeOnDay } from "../../core/models/common.ts";
import { PAIRS, fetchM15, buildUniverse, scan, sessionLabel, isCheckInTime, type SignalRec, type WatchRow, type ServerClock } from "./engine.ts";

/** SHA-256 of the one-time setup code given to the owner. The code itself is not stored anywhere in the project. */
const SETUP_HASH = "926b073fd653e65408799fc5e892dba2f50db339df720d9c03167b22ed38e9f5";

export { load, save };

export interface Settings { tdKey: string; tgToken: string; tgChat: string; balance: number; alerts: boolean; clock: ServerClock }
export const DEFAULTS: Settings = { tdKey: "", tgToken: "", tgChat: "", balance: 500, alerts: true, clock: "ny7" };
export const getSettings = async (): Promise<Settings> => ({ ...DEFAULTS, ...(await load<Partial<Settings>>("settings", {})) });

export interface Meta { time: number; ok: boolean; note: string; lastBar: number; session: string; credits: number }

async function sha(text: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
export const isClaimed = async (): Promise<boolean> => !!(await load<{ hash?: string }>("auth", {})).hash;
export async function claim(code: string, pass: string): Promise<string | null> {
  if (await isClaimed()) return "A passcode has already been set.";
  if ((await sha(String(code).trim().toUpperCase())) !== SETUP_HASH) return "That setup code is not right.";
  if (String(pass).length < 6) return "Use at least 6 characters.";
  const salt = crypto.randomUUID();
  await save("auth", { salt, hash: await sha(salt + pass) });
  return null;
}
export async function checkPass(pass: string | null): Promise<boolean> {
  const a = await load<{ salt?: string; hash?: string }>("auth", {});
  return !!a.hash && !!pass && (await sha(a.salt + pass)) === a.hash;
}

export async function telegram(token: string, method: string, body: unknown): Promise<any> {
  const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  return r.json();
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * One full scan: fetch candles, run the rules, save, send alerts.
 * `settleMs` waits for the data vendor to finish the candle that just
 * closed; pairs still missing it are fetched once more. Four pairs cost four
 * requests, eight with the retry: inside the free plan's eight a minute.
 */
export async function runScan(siteUrl: string, settleMs = 0, force = false): Promise<Meta> {
  const s = await getSettings();
  let now = Math.floor(Date.now() / 1000);
  const fail = async (note: string, credits = 0): Promise<Meta> => {
    const prev = await load<Partial<Meta>>("meta", {});
    const m: Meta = { time: now, ok: false, note, lastBar: prev.lastBar ?? 0, session: sessionLabel(now), credits };
    await save("meta", m);
    if (s.alerts && (await checkInDue(now))) await sendPush(siteUrl, { title: "FX Desk has a problem", body: `${note} No trade alerts until this is fixed.`, tag: "checkin" }, now, 6 * 3600);
    return m;
  };
  if (!s.tdKey) return fail("No price-feed key yet. Add it in Setup.");
  if (!marketOpen(now) && !force) { const prev = await load<Partial<Meta>>("meta", {}); const m: Meta = { time: now, ok: true, note: "Market closed. Scanning resumes Sunday 22:00 UK.", lastBar: prev.lastBar ?? 0, session: "Market closed", credits: 0 }; await save("meta", m); return m; }
  if (settleMs) await sleep(settleMs);
  const bars: Record<string, Bars> = {};
  let credits = 0;
  const pull = async (pairs: readonly string[]) => { await Promise.all(pairs.map(async (p) => { credits++; bars[p] = await fetchM15(p, s.tdKey, Math.floor(Date.now() / 1000)); })); };
  try {
    await pull(PAIRS);
    const due = Math.floor(Date.now() / 1000 / 900) * 900;
    const stale = PAIRS.filter((p) => !bars[p].n || bars[p].end[bars[p].n - 1] < due);
    if (stale.length && settleMs && marketOpen(due - 1)) { await sleep(8000); await pull(stale); }
  } catch (e) { return fail(`Price feed problem: ${(e as Error).message}`, credits); }
  now = Math.floor(Date.now() / 1000);
  const saved = await load<SignalRec[]>("signals", []);
  const out = scan(buildUniverse(bars), saved, now, s.balance, "GBP", s.clock);
  await save("signals", out.signals);
  await save("watch", out.watch);
  let note = "OK";
  if (s.alerts) {
    for (const m of out.messages) await sendPush(siteUrl, { title: m.title, body: m.body, url: m.id ? `${siteUrl}/#t=${encodeURIComponent(m.id)}` : siteUrl, tag: m.id }, now, 1800);
    // the daily check-in: proof, every trading morning, that alerts can still reach the phone
    if (await checkInDue(now)) {
      const day = tradingDay(now), uk = (min: number) => ukHM(nyTimeOnDay(day, min));
      const view = out.watch.map((w) => `${w.pair} ${w.bias > 0 ? "buy" : w.bias < 0 ? "sell" : "no trade"}`).join(", ");
      await sendPush(siteUrl, { title: "FX Desk is running", body: `Today: ${view}. Killzones ${uk(120)}-${uk(300)} and ${uk(420)}-${uk(600)} UK.`, tag: "checkin" }, now, 6 * 3600);
    }
  }
  const devices = (await pushState()).subs.length;
  if (out.messages.length && s.alerts && s.tgToken && s.tgChat) {
    for (const m of out.messages) {
      const r = await telegram(s.tgToken, "sendMessage", { chat_id: s.tgChat, text: m.text, parse_mode: "HTML", disable_web_page_preview: true, reply_markup: m.id ? { inline_keyboard: [[{ text: "Open ticket", url: `${siteUrl}/#t=${encodeURIComponent(m.id)}` }]] } : undefined });
      if (!r.ok) note = `Telegram refused a message: ${r.description ?? "unknown error"}`;
    }
  }
  if (out.messages.length && !devices && !(s.tgToken && s.tgChat)) note = "OK (notifications are not switched on, so no alert was sent)";
  const meta: Meta = { time: now, ok: true, note, lastBar: out.lastBar, session: out.session, credits };
  await save("meta", meta);
  return meta;
}

/**
 * True once per trading day, on the scan in the quarter hour before the
 * London killzone opens (01:45 New York, 06:45 UK for most of the year).
 * Marks the day as done, so a second call the same day is false.
 */
async function checkInDue(now: number): Promise<boolean> {
  if (!isCheckInTime(now)) return false;
  const day = tradingDay(now);
  if ((await load<{ day?: number }>("checkin", {})).day === day) return false;
  await save("checkin", { day, at: now });
  return true;
}

export type { SignalRec, WatchRow };
