import type { Config } from "@netlify/functions";
import { runScan } from "../../lib/store.ts";

// Every quarter hour, all week (UTC). The scan itself skips the weekend.
// It waits a few seconds first so the data vendor has finished the candle that just closed.
export default async () => {
  const site = Netlify.env.get("URL") ?? "";
  const meta = await runScan(site, 9000);
  console.log("scan", JSON.stringify(meta));
};

export const config: Config = { schedule: "*/15 * * * *" };
