/**
 * What the owner is told about a ticket, and when. These use hand-made
 * tickets, so every case is exact: the rules that find real setups are
 * tested in fxdesk/core and by the backtest self-test.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { messagesFor, type SignalRec } from "../lib/engine.ts";

const utc = (iso: string): number => Date.parse(iso + "Z") / 1000;
// Monday 16 Nov 2026 (winter: UK = UTC, New York = UTC-5, MT5 clock = UTC+2)
const SIGNAL = utc("2026-11-16T08:15:00"), EXPIRE = utc("2026-11-16T11:00:00"), FLAT = utc("2026-11-16T21:00:00");
const ticket = (over: Partial<SignalRec> = {}): SignalRec => ({
  id: "EURUSD-20261116-LON", pair: "EURUSD", dir: 1, entry: 1.08512, stop: 1.08412, tp: 1.08812, signalTime: SIGNAL, expireAt: EXPIRE, flatAt: FLAT,
  riskPips: 10, rewardPips: 30, grade: "A", reasons: [], order: {} as SignalRec["order"], lots: 0.05, riskMoney: 5, status: "pending", statusNote: "", alerted: {}, ...over,
});
const at = (s: SignalRec, now: number) => messagesFor([s], now, "ny7");

test("a new ticket gives one notification with everything needed to place the order, once", () => {
  const s = ticket();
  const [m, ...rest] = at(s, SIGNAL + 10);
  assert.equal(rest.length, 0);
  assert.equal(m.kind, "new");
  assert.equal(m.title, "BUY LIMIT EURUSD (demo)");
  assert.equal(m.body, "Entry 1.08512, stop 1.08412, target 1.08812, 0.05 lots. Issued 08:15 UK, expires 11:00 UK (13:00 on the MT5 clock).");
  assert.equal(m.until, EXPIRE, "worth delivering for as long as the order may be placed");
  assert.match(m.text, /did not pass its historical test/);
  assert.deepEqual(at(s, SIGNAL + 910), [], "not repeated on the next scan");
});

test("a ticket whose stop is too wide to size says skip", () => {
  const [m] = at(ticket({ lots: 0 }), SIGNAL + 10);
  assert.equal(m.body, "Stop too wide to size at 1%. Skip this one.");
});

test("when the entry trades he is told once, as a separate notification", () => {
  const s = ticket();
  at(s, SIGNAL + 10);
  s.status = "open";
  const [m, ...rest] = at(s, SIGNAL + 1810);
  assert.equal(rest.length, 0);
  assert.equal(m.kind, "fill");
  assert.equal(m.title, "EURUSD: entry traded");
  assert.equal(m.until, FLAT);
  assert.deepEqual(at(s, SIGNAL + 2710), []);
});

test("a setup first seen after its entry has traded gives one 'skip' note, never a ticket to chase, and nothing afterwards", () => {
  const s = ticket({ status: "open" });
  const msgs = at(s, SIGNAL + 1210);
  assert.equal(msgs.length, 1);
  assert.equal(msgs[0].kind, "late");
  assert.equal(msgs[0].title, "EURUSD buy: found too late, skip");
  assert.match(msgs[0].body, /Do not chase it/);
  s.status = "won"; s.statusNote = "Target hit Mon 16 Nov 12:00."; s.r = 3;
  assert.deepEqual(at(s, SIGNAL + 9000), []);
  assert.deepEqual(messagesFor([ticket({ status: "open" })], FLAT - 600), messagesFor([ticket({ status: "open" })], FLAT - 600).filter((m) => m.kind === "late"), "no close-by reminder for a trade he was told to skip");
});

test("a setup that was over before he could have heard of it sends nothing", () => {
  for (const status of ["won", "lost", "flat", "expired", "withdrawn"] as const) {
    const s = ticket({ status });
    assert.deepEqual(at(s, SIGNAL + 1210), [], status);
    assert.deepEqual(at(s, SIGNAL + 2110), [], status);
  }
});

test("a ticket the account rules rule out AFTER it was sent tells him to delete or close his order", () => {
  const s = ticket();
  at(s, SIGNAL + 10);
  s.status = "blocked"; s.statusNote = "Another open trade already carried the same currency bet.";
  const [m, ...rest] = at(s, SIGNAL + 1810);
  assert.equal(rest.length, 0);
  assert.equal(m.title, "EURUSD: delete this order");
  assert.equal(m.body, "The account rules now rule this trade out: Another open trade already carried the same currency bet. If your EURUSD order is still waiting, delete it. If it has filled, close it.");
  assert.deepEqual(at(s, SIGNAL + 2710), []);
});

test("a setup blocked from the start is reported as skipped, once", () => {
  const s = ticket({ status: "blocked", statusNote: "Two trades already taken that day." });
  const [m, ...rest] = at(s, SIGNAL + 10);
  assert.equal(rest.length, 0);
  assert.equal(m.title, "EURUSD: setup skipped");
  assert.deepEqual(at(s, SIGNAL + 910), []);
});

test("an open trade gets a reminder a quarter of an hour before the end-of-day cut-off, once", () => {
  const s = ticket({ status: "open", alerted: { fresh: true, fill: true } });
  assert.deepEqual(at(s, FLAT - 1790), [], "not yet");
  const [m, ...rest] = at(s, FLAT - 890);
  assert.equal(rest.length, 0);
  assert.equal(m.kind, "close");
  assert.equal(m.title, "EURUSD: close at 21:00 UK");
  assert.equal(m.body, "End-of-day cut-off. If your EURUSD buy is still open at 21:00 UK (23:00 on the MT5 clock), close it by hand.");
  assert.deepEqual(at(s, FLAT + 10), [], "not repeated");
});

test("if the reminder scan did not run, the next one says close it now; later than ten minutes it is left to the ending note", () => {
  const s = ticket({ status: "open", alerted: { fresh: true, fill: true } });
  const [m] = at(s, FLAT + 10);
  assert.equal(m.title, "EURUSD: close it now");
  assert.equal(m.body, "End-of-day cut-off was 21:00 UK. If your EURUSD buy is still open, close it by hand now.");
  assert.deepEqual(at(ticket({ status: "open", alerted: { fresh: true, fill: true } }), FLAT + 700), []);
});

test("endings: a result is 'finished', an unfilled order is 'delete the order', the cut-off says close it", () => {
  const done = (status: SignalRec["status"], statusNote: string, r?: number) => { const s = ticket({ status, statusNote, r, alerted: { fresh: true, fill: true, flat: true } }); return at(s, FLAT + 910)[0]; };
  assert.deepEqual([done("won", "Target hit Mon 16 Nov 12:00.", 3).title, done("won", "Target hit Mon 16 Nov 12:00.", 3).body], ["EURUSD buy finished", "Target hit Mon 16 Nov 12:00. Result by the rules: +3R."]);
  assert.equal(done("lost", "Stopped out Mon 16 Nov 09:30.", -1).body, "Stopped out Mon 16 Nov 09:30. Result by the rules: -1R.");
  assert.equal(done("expired", "Never filled. Delete the order in MT5 if you placed it.").title, "EURUSD: delete the order");
  assert.equal(done("withdrawn", "Price reached the target without filling. Delete the order in MT5 if you placed it.").title, "EURUSD: delete the order");
  const flat = done("flat", "End-of-day cut-off Mon 16 Nov 21:00: the rules close the trade here. If yours is still open, close it now.", 0.4);
  assert.equal(flat.title, "EURUSD: cut-off reached, close it", "never 'finished': nothing closes his trade but him");
  assert.match(flat.body, /If yours is still open, close it now\. Result by the rules: \+0\.4R\./);
});

test("history found when the app first started is never notified", () => {
  assert.deepEqual(at(ticket({ backfilled: true }), SIGNAL + 10), []);
});

test("every notification fits an iPhone banner", () => {
  const all = [
    ...at(ticket({ pair: "USDJPY", entry: 151.123, stop: 150.923, tp: 151.723, lots: 12.34, dir: -1 }), SIGNAL + 10),
    ...at(ticket({ status: "open" }), SIGNAL + 1210),
    ...at(ticket({ status: "open", alerted: { fresh: true } }), FLAT - 890),
    ...at(ticket({ status: "blocked", statusNote: "Another open trade already carried the same currency bet.", alerted: { fresh: true } }), SIGNAL + 1810),
  ];
  assert.ok(all.length >= 5);
  for (const m of all) { assert.ok(m.title.length <= 40, `${m.title.length}: ${m.title}`); assert.ok(m.body.length <= 178, `${m.body.length}: ${m.body}`); assert.ok(m.until > SIGNAL); }
});
