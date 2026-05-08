import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../dist/", import.meta.url);
const astroDir = new URL("./_astro/", root);

const budgets = {
  pagePayloadTotal: 25 * 1024 * 1024,
  largestImage: 1.5 * 1024 * 1024,
  largestCss: 35 * 1024,
  mainJs: 20 * 1024,
  asyncJs: 100 * 1024,
  panoramaOriginalTotal: 180 * 1024 * 1024,
  largestPanoramaOriginal: 70 * 1024 * 1024
};

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const walk = async (dirUrl) => {
  const entries = await readdir(dirUrl, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const child = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, dirUrl);
      if (entry.isDirectory()) return walk(child);
      const info = await stat(child);
      return [{ path: child.pathname, name: entry.name, size: info.size }];
    })
  );
  return files.flat();
};

const assertBudget = (label, actual, limit) => {
  const ok = actual <= limit;
  console.log(`${ok ? "OK" : "FAIL"} ${label}: ${formatBytes(actual)} / ${formatBytes(limit)}`);
  return ok;
};

const files = await walk(root);
const assets = await walk(astroDir);
const panoramaOriginals = files.filter((file) =>
  /\/panorama\/pano-\d+\.(?:jpe?g)$/i.test(file.path)
);
const pagePayloadFiles = files.filter((file) => !panoramaOriginals.includes(file));
const pagePayloadTotal = pagePayloadFiles.reduce((sum, file) => sum + file.size, 0);
const panoramaOriginalTotal = panoramaOriginals.reduce((sum, file) => sum + file.size, 0);
const images = assets.filter((file) => /\.(avif|webp|jpe?g|png|svg)$/i.test(file.name));
const css = assets.filter((file) => file.name.endsWith(".css"));
const js = assets.filter((file) => file.name.endsWith(".js"));
const mainJs = js.filter((file) => !file.name.includes("pannellum"));
const asyncJs = js.filter((file) => file.name.includes("pannellum"));

const checks = [
  assertBudget("page payload excluding panorama originals", pagePayloadTotal, budgets.pagePayloadTotal),
  assertBudget("largest image", Math.max(0, ...images.map((file) => file.size)), budgets.largestImage),
  assertBudget("largest CSS chunk", Math.max(0, ...css.map((file) => file.size)), budgets.largestCss),
  assertBudget("main JS total", mainJs.reduce((sum, file) => sum + file.size, 0), budgets.mainJs),
  assertBudget("panorama async JS", asyncJs.reduce((sum, file) => sum + file.size, 0), budgets.asyncJs),
  assertBudget("panorama originals total", panoramaOriginalTotal, budgets.panoramaOriginalTotal),
  assertBudget(
    "largest panorama original",
    Math.max(0, ...panoramaOriginals.map((file) => file.size)),
    budgets.largestPanoramaOriginal
  )
];

if (checks.includes(false)) {
  process.exitCode = 1;
}
