import { readdir, stat } from "node:fs/promises";

const root = new URL("../dist/", import.meta.url);
const astroDir = new URL("./_astro/", root);

const budgets = {
  homeHtml: 220 * 1024,
  archiveHtml: 420 * 1024,
  largestDetailHtml: 220 * 1024,
  largestImage: 1.5 * 1024 * 1024,
  cssTotal: 90 * 1024,
  mainJs: 24 * 1024,
  asyncJs: 110 * 1024,
  optimizedMediaTotal: 70 * 1024 * 1024,
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

const byPath = (files, suffix) => files.find((file) => file.path.endsWith(suffix))?.size ?? 0;

const assertBudget = (label, actual, limit) => {
  const ok = actual <= limit;
  console.log(`${ok ? "OK" : "FAIL"} ${label}: ${formatBytes(actual)} / ${formatBytes(limit)}`);
  return ok;
};

const files = await walk(root);
const assets = await walk(astroDir);
const htmlFiles = files.filter((file) => file.name.endsWith(".html"));
const detailHtml = htmlFiles.filter((file) => /\/works\/[^/]+\/index\.html$/.test(file.path));
const panoramaOriginals = files.filter((file) => /\/panorama\/pano-\d+\.(?:jpe?g)$/i.test(file.path));
const images = assets.filter((file) => /\.(avif|webp|jpe?g|png|svg)$/i.test(file.name));
const css = assets.filter((file) => file.name.endsWith(".css"));
const js = assets.filter((file) => file.name.endsWith(".js"));
const mainJs = js.filter((file) => !file.name.includes("pannellum"));
const asyncJs = js.filter((file) => file.name.includes("pannellum"));
const optimizedMediaTotal = images.reduce((sum, file) => sum + file.size, 0);
const panoramaOriginalTotal = panoramaOriginals.reduce((sum, file) => sum + file.size, 0);

const checks = [
  assertBudget("homepage HTML", byPath(files, "/index.html"), budgets.homeHtml),
  assertBudget("archive HTML", byPath(files, "/archive/index.html"), budgets.archiveHtml),
  assertBudget(
    "largest work detail HTML",
    Math.max(0, ...detailHtml.map((file) => file.size)),
    budgets.largestDetailHtml
  ),
  assertBudget("largest optimized image", Math.max(0, ...images.map((file) => file.size)), budgets.largestImage),
  assertBudget(
    "CSS total",
    css.reduce((sum, file) => sum + file.size, 0),
    budgets.cssTotal
  ),
  assertBudget(
    "main JS total",
    mainJs.reduce((sum, file) => sum + file.size, 0),
    budgets.mainJs
  ),
  assertBudget(
    "panorama async JS",
    asyncJs.reduce((sum, file) => sum + file.size, 0),
    budgets.asyncJs
  ),
  assertBudget("optimized media total", optimizedMediaTotal, budgets.optimizedMediaTotal),
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
