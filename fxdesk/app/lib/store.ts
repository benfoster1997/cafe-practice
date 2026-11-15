/**
 * store.ts - everything that touches storage, secrets or the outside world:
 * saved state (Netlify Blobs), the passcode, the price feed, and the two
 * ways of reaching the owner (iPhone notifications, and Telegram as an
 * optional backup).
 */
import { load, save, blobs, type KV } from "./blob.ts";
import { sendPush, pushState, SITE, type Note, type Sender } from "./push.ts";
import { type Bars } from "../../core/bars.ts";
import { marketOpen, tradingDay, ukHM, ukLabel, nyClock } from "../../core/time.ts";
import { nyTimeOnDay } from "../../core/models/common.ts";
import { PAIRS, fetchM15, buildUniverse, scan, sessionLabel, isCheckInTime, CHECKIN_TO, type SignalRec, type WatchRow, type ServerClock } from "./engine.ts";

/** SHA-256 of the one-time setup code given to the owner. The code itself is not stored anywhere in the project. */
const SETUP_HASH = "926b073fd653e65408799fc5e892dba2f50db339df720d9c03167b22ed38e9f5";

export { load, save };

export interface Settings { tdKey: string; tgToken: string; tgChat: string; balance: number; alerts: boolean; clock: ServerClock }
/** Stored under "scantest": when the owner asked for a test notification from the scheduled scanner. Its own record, so that nothing but the owner ever rewrites his settings. */
export interface ScanTest { at?: number }
export const DEFAULTS: Settings = { tdKey: "", tgToken: "", tgChat: "", balance: 500, alerts: true, clock: "ny7" };
export const getSettings = async (kv: KV = blobs): Promise<Settings> => ({ ...DEFAULTS, ...(await kv.load<Partial<Settings>>("settings", {})) });

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

export async function telegram(token: string, method: string, body: unknown, timeoutMs = 8000): Promise<any> {
  const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(timeoutMs) });
  return r.json();
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Time. The hosting platform stops a scheduled run at 30 seconds, so a scan
 * plans to be finished by 27. Every wait on somebody else's server has its
 * own limit, and the steps that matter most are done first: results saved,
 * then the scan recorded, then notifications.
 */
const BUDGET_MS = 27000, FEED_MS = 7000, REFETCH_MS = 4000, AFTER_FEED_MS = 4500, WRAP_UP_MS = 1500;
/**
 * Newest candle older than this while the market is open: the feed is not
 * usable and no trade could be spotted. Ninety minutes, not less, so that a
 * quiet hour at the daily New York roll can never raise a false alarm.
 */
const STALE_SEC = 90 * 60;
const HOURS = 3600;

/**
 * The outbox: notes Apple has not accepted yet. A note is written here
 * BEFORE the first attempt to send it and taken out only when Apple says
 * yes, so nothing is lost if Apple is unreachable or the run is cut short:
 * the next scan, fifteen minutes later, sends it again. A note that is
 * still here when it goes out of date (`until`) is dropped and reported in
 * the app in red as an alert that never arrived.
 */
export interface Queued { note: Note; at: number; until: number }
export interface Outbox { items: Queued[]; missed?: string; missedAt?: number }
/** The last morning check-in: which trading day, when, and whether it had to report a fault. */
export interface CheckIn { day?: number; at?: number; problem?: boolean }
const MAX_QUEUE = 20;

/** Everything a scan needs from the outside world. Tests replace these; the live scanner uses the defaults. */
export interface ScanDeps {
  kv: KV;
  bars: typeof fetchM15;
  rules: typeof scan;
  send?: Sender;
  /** milliseconds, like Date.now */
  clock: () => number;
  sleep: (ms: number) => Promise<unknown>;
  telegram: typeof telegram;
  /** milliseconds the whole run may take. The scheduled scanner has 30 seconds; a scan asked for from the app has less. */
  budgetMs: number;
  /** true only for the scheduled scanner (scan.mts). A test "from the scanner" must not be answered by a scan asked for from the app. */
  scheduled: boolean;
}

const problemNote = (why: string, now: number): Queued => ({ at: now, until: now + 6 * HOURS, note: { title: "FX Desk has a problem", body: `No trade alerts until this is fixed. ${why}`.slice(0, 170), tag: `problem-${now}` } });
const testNote = (now: number): Queued => ({ at: now, until: now + 2 * HOURS, note: { title: "FX Desk scanner test", body: "This came from the scheduled scanner, by the same route a trade alert takes. If you can read it, that route works.", tag: `scantest-${now}` } });
/**
 * A fault outside the morning check-in is pushed once it has lasted two
 * scans in a row (one failed scan is usually a blip at the price feed), and
 * then not again until it clears. Returns the note to send, if any.
 */
async function faultNote(why: string, now: number, kv: KV, previousOk: boolean | undefined): Promise<Queued[]> {
  if (previousOk !== false) return [];
  const ci = await kv.load<CheckIn>("checkin", {});
  if (ci.problem) return [];
  await kv.save("checkin", { ...ci, problem: true });
  return [problemNote(why, now)];
}
const recoveredNote = (now: number): Queued => ({ at: now, until: now + 6 * HOURS, note: { title: "FX Desk is running again", body: "The fault reported earlier has cleared. Trade alerts are back on.", tag: `running-${now}` } });
function checkInNote(watch: WatchRow[], now: number): Queued {
  const day = tradingDay(now), uk = (min: number) => ukHM(nyTimeOnDay(day, min));
  // "up / down", never "buy / sell": this is which way the rules lean today, not something to act on
  const view = watch.map((w) => `${w.pair} ${w.bias > 0 ? "up" : w.bias < 0 ? "down" : "none"}`).join(", ");
  return { at: now, until: now + 6 * HOURS, note: { title: "FX Desk is running", body: `${ukLabel(now).slice(0, -6)}, no ticket yet. Bias: ${view || "not loaded"}. Killzones ${uk(120)}-${uk(300)} and ${uk(420)}-${uk(600)} UK.`, tag: `checkin-${day}` } };
}

/** Alerts are switched off: nothing waits to be sent later. */
async function emptyOutbox(kv: KV): Promise<void> {
  const box = await kv.load<Outbox>("outbox", { items: [] });
  if (box.items?.length) await kv.save("outbox", { ...box, items: [] });
}

/**
 * Send what is waiting plus what is new. Returns how many devices are
 * registered and how many notes are still waiting afterwards.
 */
async function notify(site: string, fresh: Queued[], now: number, d: ScanDeps, left: () => number): Promise<{ devices: number; waiting: number }> {
  const { kv } = d;
  const [box, st] = await Promise.all([kv.load<Outbox>("outbox", { items: [] }), pushState(kv)]);
  const before = box.items ?? [];
  const lost: Queued[] = []; // notes given up on in this scan: reported in red, never sent late
  const live = before.filter((q) => q.until > now || (lost.push(q), false));
  // A phone that has never been reached is a phone not set up yet: nothing is kept for it. Once a phone HAS been
  // reached, notes are kept even while no address is registered (Apple dropped it, or it is being renewed), so
  // they go out when the phone reconnects, or are reported as never having arrived.
  let queue = st.subs.length || st.lastOk ? [...live, ...fresh] : live;
  // A note that later news has overtaken is not sent alongside it: a ticket whose entry has since traded or which
  // has ended; and a fault he was never told about needs no all-clear either.
  const tag = (q: Queued) => q.note.tag ?? "", cut = (t: string) => t.lastIndexOf(":");
  const overtaken = (q: Queued) => tag(q).endsWith(":new") && queue.some((x) => x !== q && cut(tag(x)) === cut(tag(q)) && tag(x).startsWith(tag(q).slice(0, cut(tag(q)) + 1)) && /:(fill|late|close|done)$/.test(tag(x)));
  queue = queue.filter((q) => !overtaken(q) || (lost.push(q), false));
  if (queue.some((q) => tag(q).startsWith("running-")) && queue.some((q) => tag(q).startsWith("problem-"))) queue = queue.filter((q) => !/^(problem|running)-/.test(tag(q)));
  while (queue.length > MAX_QUEUE) lost.push(queue.shift()!);
  let missed = box.missed, missedAt = box.missedAt;
  if (lost.length) {
    missed = `${lost.slice(-3).map((q) => `"${q.note.title}" from ${ukLabel(q.at)} UK`).join(", ")}${lost.length > 3 ? ` and ${lost.length - 3} more` : ""} never reached your phone: the notification service did not accept ${lost.length === 1 ? "it" : "them"} in time.`;
    missedAt = now;
  }
  if (!queue.length || !st.subs.length) {
    if (before.length !== queue.length || fresh.length || lost.length) await kv.save("outbox", { items: queue, missed, missedAt });
    return { devices: st.subs.length, waiting: queue.length };
  }
  await kv.save("outbox", { items: queue, missed, missedAt }); // before sending: see the note on the outbox above
  const r = await sendPush(site, queue.map((q) => ({ ...q.note, ttl: Math.max(60, q.until - now) })), now, 1800, kv, d.send, { budgetMs: Math.max(1500, Math.min(9000, left() - WRAP_UP_MS)), pause: d.sleep, clock: d.clock });
  const rest = queue.filter((_, i) => !r.delivered[i]);
  await kv.save("outbox", { items: rest, missed, missedAt });
  return { devices: st.subs.length, waiting: rest.length };
}

/**
 * One full scan: fetch candles, run the rules, save, send alerts.
 * `settleMs` waits for the data vendor to finish the candle that just
 * closed; pairs still missing it are fetched once more. Four pairs cost four
 * requests, eight with the retry: inside the free plan's eight a minute.
 */
export async function runScan(siteUrl: string, settleMs = 0, force = false, deps: Partial<ScanDeps> = {}): Promise<Meta> {
  const d: ScanDeps = { kv: blobs, bars: fetchM15, rules: scan, clock: Date.now, sleep, telegram, budgetMs: BUDGET_MS, scheduled: false, ...deps };
  const { kv } = d;
  const started = d.clock(), left = () => d.budgetMs - (d.clock() - started), secs = () => Math.floor(d.clock() / 1000);
  const site = siteUrl || SITE;
  const s = await getSettings(kv);
  let now = secs();
  // The owner asked, in Setup, for a test from the scanner itself: the one route no button in the app can exercise.
  // Only the scheduled scanner answers it; a scan asked for from the app leaves it waiting.
  const extra: Queued[] = [];
  if (d.scheduled) {
    const asked = await kv.load<ScanTest>("scantest", {});
    if (asked.at) {
      await kv.save("scantest", {});
      if (s.alerts && now - asked.at < 2 * HOURS) extra.push(testNote(now));
    }
  }
  const before = await kv.load<Partial<Meta>>("meta", {});
  const fail = async (note: string, credits = 0): Promise<Meta> => {
    const m: Meta = { time: now, ok: false, note, lastBar: before.lastBar ?? 0, session: sessionLabel(now), credits };
    await kv.save("meta", m);
    try {
      if (s.alerts) await notify(site, [...extra, ...((await checkInDue(now, kv, true, before.ok)) ? [problemNote(note, now)] : await faultNote(note, now, kv, before.ok))], now, d, left);
      else await emptyOutbox(kv);
    } catch (e) { console.log("notification step failed", (e as Error).message); } // reported in the app instead
    return m;
  };
  if (!s.tdKey) return fail("No price-feed key yet. Add it in Setup.");
  if (!marketOpen(now) && !force) {
    const m: Meta = { time: now, ok: true, note: "Market closed. Scanning resumes Sunday 22:00 UK.", lastBar: before.lastBar ?? 0, session: "Market closed", credits: 0 };
    await kv.save("meta", m);
    try { if (s.alerts) await notify(site, extra, now, d, left); else await emptyOutbox(kv); } catch (e) { console.log("notification step failed", (e as Error).message); } // a requested test, or anything still waiting
    return m;
  }
  if (settleMs) await d.sleep(settleMs);
  const bars: Record<string, Bars> = {};
  let credits = 0;
  const pull = async (pairs: readonly string[], ms: number) => { await Promise.all(pairs.map(async (p) => { credits++; bars[p] = await d.bars(p, s.tdKey, secs(), 3500, ms); })); };
  try {
    await pull(PAIRS, Math.max(2500, Math.min(FEED_MS, left() - AFTER_FEED_MS)));
    const due = Math.floor(secs() / 900) * 900;
    const stale = PAIRS.filter((p) => !bars[p].n || bars[p].end[bars[p].n - 1] < due);
    // wait for the vendor to publish the candle, but only as long as the rest of the run can still be afforded
    const wait = Math.min(8000, left() - REFETCH_MS - AFTER_FEED_MS);
    if (stale.length && settleMs && marketOpen(due - 1) && wait >= 3000) {
      await d.sleep(wait);
      try { await pull(stale, REFETCH_MS); } catch { /* keep the first answer: it lacks only the newest candle, and the next scan will have it */ }
    }
  } catch (e) { return fail(`Price feed problem: ${(e as Error).name === "TimeoutError" ? "the price feed did not answer in time" : (e as Error).message}`, credits); }
  now = secs();
  const saved = await kv.load<SignalRec[]>("signals", []);
  const out = d.rules(buildUniverse(bars), saved, now, s.balance, "GBP", s.clock);
  await kv.save("signals", out.signals);
  await kv.save("watch", out.watch);
  // The feed answered, but with old prices: a setup can only be alerted while it is fresh, so say so instead of "OK".
  // Judged pair by pair: one pair hours behind cannot produce a ticket even while the others are fine.
  const wide = marketOpen(now) && marketOpen(now - STALE_SEC);
  const stuck = wide ? out.watch.filter((x) => now - x.time > STALE_SEC) : [];
  const behind = Math.max(0, ...stuck.map((x) => now - x.time), wide && !out.watch.length && out.lastBar > 0 ? now - out.lastBar : 0);
  const late = behind > STALE_SEC;
  const short = PAIRS.length - out.watch.length; // pairs the rules could not read at all: too little history came back
  const old = late || short > 0;
  const lag = behind >= 2 * HOURS ? `about ${Math.round(behind / HOURS)} hours` : `${Math.round(behind / 60)} minutes`;
  const which = stuck.length && stuck.length < out.watch.length ? ` for ${stuck.map((x) => x.pair).join(", ")}` : "";
  const meta: Meta = {
    time: now, ok: !old, lastBar: out.lastBar, session: out.session, credits,
    note: late ? `Prices${which} are ${lag} behind (a price-feed fault or a market holiday). No trade can be spotted${which ? " there" : ""} until they catch up.` : short > 0 ? `The price feed sent too little history for ${short} of the ${PAIRS.length} pairs, so ${short === 1 ? "it is" : "they are"} not being watched.` : "OK",
  };
  await kv.save("meta", meta); // the scan is on record before any notification is attempted
  // Telegram, the optional backup, goes out alongside the iPhone notifications, not after them: it must not be
  // the thing that is dropped when Apple is slow, which is exactly when a backup is wanted.
  const tgJob = (async (): Promise<string> => {
    let said = "";
    if (!(out.messages.length && s.alerts && s.tgToken && s.tgChat)) return said;
    for (const m of out.messages) {
      if (left() < 2500) return "Telegram was skipped: the scan ran out of time.";
      try {
        const r = await d.telegram(s.tgToken, "sendMessage", { chat_id: s.tgChat, text: m.text, parse_mode: "HTML", disable_web_page_preview: true, reply_markup: m.id ? { inline_keyboard: [[{ text: "Open ticket", url: `${site}/#t=${encodeURIComponent(m.id)}` }]] } : undefined }, Math.max(1000, Math.min(5000, left() - 1000)));
        if (!r.ok) said = `Telegram refused a message: ${r.description ?? "unknown error"}`;
      } catch { said = "Telegram could not be reached."; }
    }
    return said;
  })();
  let devices = 0, waiting = 0, stepFailed = "";
  try {
    if (s.alerts) {
      const fresh: Queued[] = [...extra, ...out.messages.map((m) => ({ at: now, until: Math.max(m.until, now + 900), note: { title: m.title, body: m.body, url: m.id ? `${site}/#t=${encodeURIComponent(m.id)}` : site, tag: m.id ? `${m.id}:${m.kind}` : undefined } }))];
      // the daily check-in: proof, every trading morning, that alerts can still reach the phone
      if (await checkInDue(now, kv, old, before.ok)) fresh.push(old ? problemNote(meta.note, now) : checkInNote(out.watch, now));
      else if (old) fresh.push(...(await faultNote(meta.note, now, kv, before.ok)));
      else {
        const ci = await kv.load<CheckIn>("checkin", {});
        if (ci.problem) { fresh.push(recoveredNote(now)); await kv.save("checkin", { ...ci, problem: false }); } // he was told alerts were off: tell him they are back
      }
      ({ devices, waiting } = await notify(site, fresh, now, d, left));
    } else {
      devices = (await pushState(kv)).subs.length;
      await emptyOutbox(kv);
    }
  } catch (e) { stepFailed = (e as Error).message; console.log("notification step failed", stepFailed); } // never let notifications stop the scan being recorded
  const tgSaid = await tgJob;
  let note = meta.note;
  if (!old) {
    if (stepFailed) note = `OK, but the notification step failed (${stepFailed}).`;
    else if (waiting && !devices) note = `OK, but no phone is registered for notifications. ${waiting === 1 ? "A notification is" : `${waiting} notifications are`} kept and will be sent when the phone reconnects.`;
    else if (out.messages.length && s.alerts && !devices && !(s.tgToken && s.tgChat)) note = "OK (notifications are not switched on, so no alert was sent)";
    else if (waiting) note = `OK, but ${waiting === 1 ? "a notification" : `${waiting} notifications`} could not be delivered. The next scan will send ${waiting === 1 ? "it" : "them"} again.`;
  }
  if (tgSaid) note = tgSaid;
  if (note !== meta.note) { meta.note = note; await kv.save("meta", meta); }
  return meta;
}

/**
 * True once per trading day, on the first scan in the hour around the London
 * killzone's opening (01:45 to 02:45 New York; 06:45 UK for most of the
 * year), so one missed scan does not cost the day's check-in. Marks the day
 * as done, so a second call the same day is false. `problem` records
 * whether the check-in had to report a fault. A scan that has only just
 * started failing does not use the check-in up while a later scan remains
 * in the hour: one failed scan is usually a blip, and "FX Desk has a
 * problem" should mean it.
 */
async function checkInDue(now: number, kv: KV, problem: boolean, previousOk: boolean | undefined): Promise<boolean> {
  if (!isCheckInTime(now)) return false;
  if (problem && previousOk !== false && nyClock(now).minuteOfDay < CHECKIN_TO - 15) return false;
  const day = tradingDay(now);
  if ((await kv.load<CheckIn>("checkin", {})).day === day) return false;
  await kv.save("checkin", { day, at: now, problem });
  return true;
}

export type { SignalRec, WatchRow };
