/** blob.ts - the app's saved state: one small key/value store on Netlify Blobs. */
import { getStore } from "@netlify/blobs";

const store = () => getStore({ name: "fxdesk", consistency: "strong" });
export async function load<T>(key: string, fallback: T): Promise<T> { const v = await store().get(key, { type: "json" }); return (v ?? fallback) as T; }
export const save = (key: string, value: unknown): Promise<unknown> => store().setJSON(key, value);
/** Writes only if the key does not exist yet. True if this call created it. Used for things that must never be overwritten. */
export async function saveIfNew(key: string, value: unknown): Promise<boolean> { const r = await store().setJSON(key, value, { onlyIfNew: true }); return !!r?.modified; }
export interface KV { load: typeof load; save: typeof save; saveIfNew: typeof saveIfNew }
export const blobs: KV = { load, save, saveIfNew };
