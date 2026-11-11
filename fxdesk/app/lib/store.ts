/**
 * store.ts - everything that touches storage, secrets or the outside world:
 * saved state (Netlify Blobs), the passcode, the price feed and Telegram.
 */
import { getStore } from "@netlify/blobs";
import { type Bars } from "../../core/bars.ts";
import { marketOpen } from "../../core/time.ts";
import { PAIRS, fetchM15, buildUniverse, scan, sessionLabel, type SignalRec, type WatchRow, type ServerClock } from "./engine.ts";

/** SHA-256 of the one-time setup code given to the owner. The code itself is not stored anywhere in the project. */
const SETUP_HASH = "926b073fd653e65408799fc5e892dba2f50db339df720d9c03167b22ed38e9f5";

const store = () => getStore({ name: "fxdesk", consistency: "strong" });
export async function load<T>(key: string, fallback: T): Promise<T> { const v = await store().get(key, { type: "json" }); return (v ?? fallback) as T; }
export const save = (key: string, value: unknown) => store().setJSON(key, value);

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
  const fail = async (note: string, credits = 0): Promise<Meta> => { const prev = await load<Partial<Meta>>("meta", {}); const m: Meta = { time: now, ok: false, note, lastBar: prev.lastBar ?? 0, session: sessionLabel(now), credits }; await save("meta", m); return m; };
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
  if (out.messages.length && s.alerts && s.tgToken && s.tgChat) {
    for (const m of out.messages) {
      const r = await telegram(s.tgToken, "sendMessage", { chat_id: s.tgChat, text: m.text, parse_mode: "HTML", disable_web_page_preview: true, reply_markup: m.id ? { inline_keyboard: [[{ text: "Open ticket", url: `${siteUrl}/#t=${encodeURIComponent(m.id)}` }]] } : undefined });
      if (!r.ok) note = `Telegram refused a message: ${r.description ?? "unknown error"}`;
    }
  } else if (out.messages.length && !(s.tgToken && s.tgChat)) note = "OK (Telegram not connected, so no alert was sent)";
  const meta: Meta = { time: now, ok: true, note, lastBar: out.lastBar, session: out.session, credits };
  await save("meta", meta);
  return meta;
}

export type { SignalRec, WatchRow };
