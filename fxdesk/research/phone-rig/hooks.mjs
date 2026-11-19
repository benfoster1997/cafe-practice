// Local test only: swap Netlify's blob store for a JSON file on disk.
export async function resolve(specifier, context, next) {
  if (specifier === "@netlify/blobs") return { url: new URL("./mockBlobs.mjs", import.meta.url).href, shortCircuit: true };
  return next(specifier, context);
}
