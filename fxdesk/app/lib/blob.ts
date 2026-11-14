/** blob.ts - the app's saved state: one small key/value store on Netlify Blobs. */
import { getStore } from "@netlify/blobs";

const store = () => getStore({ name: "fxdesk", consistency: "strong" });
export async function load<T>(key: string, fallback: T): Promise<T> { const v = await store().get(key, { type: "json" }); return (v ?? fallback) as T; }
export const save = (key: string, value: unknown): Promise<unknown> => store().setJSON(key, value);
export interface KV { load: typeof load; save: typeof save }
export const blobs: KV = { load, save };
