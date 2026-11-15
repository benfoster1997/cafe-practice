// Local test server for the phone page: the REAL api.mts, with Netlify's storage swapped for a JSON file
// (hooks.mjs, mockBlobs.mjs) and Apple's push service answered here instead of by Apple.
// The file "apple-mode" beside this script picks Apple's answer:
//   ok | gone | refuse | down | gone-old | mismatch-old   (the last two refuse only the phone's first address)
// GET /__counts returns how many times each route and Apple were called; GET /__reset zeroes them.
// Start it with run.sh, or: MOCK_STORE=$PWD/store.json PORT=8811 URL=https://fx-desk-ict.netlify.app node --import ./register.mjs server.mjs
// Nothing here touches the live site, the real storage or Apple.
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
const here = (f) => new URL("./" + f, import.meta.url);
const ROOT = process.env.ROOT || new URL("../../", import.meta.url).pathname.replace(/\/$/, ""); // the fxdesk folder
const mode = () => (existsSync(here("apple-mode")) ? readFileSync(here("apple-mode"), "utf8").trim() : "ok");
let counts = {};
const hit = (k) => { counts[k] = (counts[k] || 0) + 1; };
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, init) => {
  const u = String(url);
  if (/push\.apple\.com/.test(u)) {
    hit("apple"); hit("apple:" + u.slice(-7));
    const m = mode();
    if (m === "gone") return new Response('{"reason":"Unregistered"}', { status: 410 });
    if (m === "refuse") return new Response('{"reason":"BadJwtToken"}', { status: 403 });
    if (m === "mismatch-old" && /DEVICE0$/.test(u)) return new Response('{"reason":"VapidPkHashMismatch"}', { status: 403 });
    if (m === "gone-old" && /DEVICE0$/.test(u)) return new Response('{"reason":"Unregistered"}', { status: 410 });
    if (m === "down") throw new Error("connect ETIMEDOUT");
    return new Response(null, { status: 201 });
  }
  return realFetch(url, init);
};
const api = (await import(ROOT + "/app/netlify/functions/api.mts")).default;
const PUB = ROOT + "/app/public";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".png": "image/png", ".json": "application/manifest+json" };
const PORT = +process.env.PORT || 8811;
createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost:" + PORT);
  if (url.pathname === "/__counts") { res.writeHead(200, { "content-type": "application/json" }); res.end(JSON.stringify(counts)); return; }
  if (url.pathname === "/__reset") { counts = {}; res.writeHead(200); res.end("ok"); return; }
  if (url.pathname.startsWith("/api/")) {
    hit(url.pathname.slice(5));
    const chunks = []; for await (const c of req) chunks.push(c);
    const r = await api(new Request(url, { method: req.method, headers: req.headers, body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks) }), { params: { route: url.pathname.slice(5) } });
    res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(await r.text()); return;
  }
  const file = url.pathname === "/" ? "/index.html" : url.pathname, ext = file.slice(file.lastIndexOf("."));
  try { const body = readFileSync(PUB + file); res.writeHead(200, { "content-type": TYPES[ext] ?? "application/octet-stream" }); res.end(body); } catch { res.writeHead(404); res.end("not found"); }
}).listen(PORT, () => console.log("listening " + PORT));
