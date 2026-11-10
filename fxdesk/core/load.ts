/** load.ts - read the historical one-minute files (Node only; the live app never imports this). */
import { readFileSync } from "node:fs";
import { type Bars, barsFromBin } from "./bars.ts";

export function loadM1(pair: string, dir = "data/histdata/bin"): Bars {
  const buf = readFileSync(`${dir}/${pair}.m1.bin`);
  return barsFromBin(buf.buffer, buf.byteOffset);
}
