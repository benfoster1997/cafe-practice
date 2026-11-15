// Local test only: stands in for Netlify's blob store, keeping everything in one JSON file (MOCK_STORE).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
const FILE = process.env.MOCK_STORE || new URL("./store.json", import.meta.url).pathname;
const read = () => (existsSync(FILE) ? JSON.parse(readFileSync(FILE, "utf8")) : {});
export function getStore() {
  return {
    async get(key) { const v = read()[key]; return v === undefined ? null : v; },
    async setJSON(key, value, opts) { const all = read(); if (opts?.onlyIfNew && key in all) return { modified: false }; all[key] = value; writeFileSync(FILE, JSON.stringify(all)); return { modified: true }; },
  };
}
