import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("../", import.meta.url).pathname;
const errors = [];
const sourceExtensions = new Set([".astro", ".js", ".mjs", ".ts"]);
const canAccessContent = (projectPath) =>
  projectPath === "src/content.config.ts" || projectPath.startsWith("src/data/");
const expectedStyleImports = [
  '@import "./partials/tokens.css";',
  '@import "./partials/base.css";',
  '@import "./partials/site.css";',
  '@import "./partials/work-pages.css";',
  '@import "./partials/overlays.css";',
  '@import "./partials/responsive.css";'
];

const toProjectPath = (path) => relative(root, path).replaceAll("\\", "/");

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if ([".astro", ".git", "dist", "node_modules", "assets"].includes(entry.name)) continue;

    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(path)));
    } else {
      files.push(path);
    }
  }

  return files;
};

const readProjectFile = async (path) => readFile(join(root, path), "utf8");

const assertNoMatch = (file, body, rules) => {
  for (const [pattern, message] of rules) {
    if (pattern.test(body)) errors.push(`${file}: ${message}`);
  }
};

const styleFiles = {
  "src/styles/partials/site.css": [
    [/@media\b/, "viewport rules belong in responsive.css"],
    [/\.archive(?:[-\w]|:|\s|,)/, "archive rules belong in work-pages.css"],
    [/\.work-(?!section\b)[-\w]+/, "work detail rules belong in work-pages.css"],
    [/\.detail-style[-\w]*/, "detail style rules belong in work-pages.css"],
    [/\.story[-\w]*/, "story overlay rules belong in overlays.css"],
    [/body\.story[-\w]*/, "story body rules belong in overlays.css"],
    [/\.lightbox[-\w]*/, "lightbox rules belong in overlays.css"]
  ],
  "src/styles/partials/work-pages.css": [
    [/\.story[-\w]*/, "story overlay rules belong in overlays.css"],
    [/body\.story[-\w]*/, "story body rules belong in overlays.css"],
    [/\.lightbox[-\w]*/, "lightbox rules belong in overlays.css"],
    [/@media\b/, "viewport rules belong in responsive.css"]
  ],
  "src/styles/partials/overlays.css": [
    [/\.archive(?:[-\w]|:|\s|,)/, "archive rules belong in work-pages.css"],
    [/\.work-(?!section\b)[-\w]+/, "work detail rules belong in work-pages.css"],
    [/\.detail-style[-\w]*/, "detail style rules belong in work-pages.css"],
    [/@media\b/, "viewport rules belong in responsive.css"]
  ]
};

for (const [file, rules] of Object.entries(styleFiles)) {
  assertNoMatch(file, await readProjectFile(file), rules);
}

const globalCss = (await readProjectFile("src/styles/global.css")).trim().split(/\r?\n/);
if (
  globalCss.length !== expectedStyleImports.length ||
  globalCss.some((line, index) => line !== expectedStyleImports[index])
) {
  errors.push("src/styles/global.css: style partial import order changed");
}

const sourceFiles = (await walk(join(root, "src"))).filter((file) =>
  sourceExtensions.has(file.slice(file.lastIndexOf(".")))
);

for (const file of sourceFiles) {
  const projectPath = toProjectPath(file);
  const body = await readFile(file, "utf8");

  assertNoMatch(projectPath, body, [
    [/client:(?:load|idle|visible|media|only)\b/, "client hydration needs an explicit architecture decision"],
    [
      /from\s+["'](?:react|vue|svelte|preact|solid-js)(?:\/[^"']*)?["']/,
      "frontend framework imports are not part of this Astro site"
    ]
  ]);

  if (!canAccessContent(projectPath) && /(?:astro:content|src\/content|@content|\.{1,2}\/content)/.test(body)) {
    errors.push(`${projectPath}: content access must go through src/data/`);
  }
}

if (errors.length) {
  errors.forEach((error) => console.error(`FAIL ${error}`));
  process.exitCode = 1;
} else {
  console.log("OK architecture boundaries validated");
}
