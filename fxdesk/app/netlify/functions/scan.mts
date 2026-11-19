import type { Config } from "@netlify/functions";
import { runScan } from "../../lib/store.ts";
import { SITE } from "../../lib/push.ts";

// Every quarter hour, all week (UTC). The scan itself skips the weekend.
// It waits a few seconds first so the data vendor has finished the candle that just closed.
export default async () => {
  const site = Netlify.env.get("URL") || SITE; // alerts cannot be signed or linked without the site's address
  const meta = await runScan(site, 9000, false, { scheduled: true });
  console.log("scan", JSON.stringify(meta), "site", site, "from the platform:", !!Netlify.env.get("URL"));
};

export const config: Config = { schedule: "*/15 * * * *" };
