import { access, readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../", import.meta.url);
const contentRoot = new URL("../src/content/", import.meta.url);
const collections = ["works", "videos", "panoramas", "settings"];
const errors = [];
const warnings = [];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const mediaSource = await readFile(new URL("../src/data/media.ts", import.meta.url), "utf8");
const registeredLocalMediaKeys = new Set(
  Array.from(mediaSource.matchAll(/"([^"]+)":\s*[a-zA-Z]/g)).map((match) => match[1])
);

const readJsonFiles = async (collection) => {
  const dir = new URL(`${collection}/`, contentRoot);
  const entries = await readdir(dir, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".json"));

  return Promise.all(
    files.map(async (file) => {
      const body = await readFile(new URL(file.name, dir), "utf8");
      return {
        id: file.name.replace(/\.json$/, ""),
        file: `src/content/${collection}/${file.name}`,
        data: JSON.parse(body)
      };
    })
  );
};

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const assert = (condition, message) => {
  if (!condition) errors.push(message);
};

const isAbsoluteHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const checkOrderedItems = (items, field, context, { required = false } = {}) => {
  const seen = new Map();

  for (const item of items) {
    const value = item.data[field];
    if (value === undefined) {
      assert(!required, `${item.file}: ${field} is required for ${context}`);
      continue;
    }

    assert(Number.isInteger(value) && value > 0, `${item.file}: ${field} must be a positive integer`);

    const existing = seen.get(value);
    assert(!existing, `${item.file}: duplicate ${field} ${value}; already used by ${existing}`);
    if (!existing) seen.set(value, item.file);
  }
};

const checkMedia = async (asset, context, { required = false } = {}) => {
  if (!asset) {
    assert(!required, `${context}: missing media asset`);
    return;
  }

  assert(["local", "public", "remote"].includes(asset.type), `${context}: media asset needs a valid type`);

  if (asset.type === "local") {
    assert(Boolean(asset.key), `${context}: local media needs key`);
    assert(!asset.url && !asset.cdnUrl, `${context}: local media should not define url or cdnUrl`);
    assert(
      registeredLocalMediaKeys.has(asset.key),
      `${context}: local media key "${asset.key}" is not registered in src/data/media.ts`
    );
    const candidates = [
      join(root.pathname, "assets", `${asset.key}.jpg`),
      join(root.pathname, "assets", `${asset.key}.JPG`),
      join(root.pathname, "assets", `${asset.key}.jpeg`),
      join(root.pathname, "assets", `${asset.key}.JPEG`),
      join(root.pathname, "assets", `${asset.key}.png`),
      join(root.pathname, "assets", `${asset.key}.PNG`),
      join(root.pathname, "assets", `${asset.key}.webp`),
      join(root.pathname, "assets", `${asset.key}.WEBP`)
    ];
    const found = (await Promise.all(candidates.map((candidate) => exists(candidate)))).some(Boolean);
    assert(found, `${context}: local media key "${asset.key}" has no matching file in assets/`);
    return;
  }

  if (asset.type === "public") {
    assert(Boolean(asset.url), `${context}: public media needs url`);
    assert(!asset.key && !asset.cdnUrl, `${context}: public media should not define key or cdnUrl`);
    assert(asset.url?.startsWith("/"), `${context}: public media should use a root-relative /public URL`);
    const found = await exists(join(root.pathname, "public", asset.url));
    assert(found, `${context}: public media "${asset.url}" is missing in public/`);
    return;
  }

  if (asset.type === "remote") {
    assert(Boolean(asset.url), `${context}: remote media needs url`);
    assert(!asset.key, `${context}: remote media should not define key`);
    assert(/^https?:\/\//.test(asset.url ?? ""), `${context}: remote media url should be absolute`);
    assert(
      !asset.cdnUrl || /^https?:\/\//.test(asset.cdnUrl),
      `${context}: remote media cdnUrl should be absolute when provided`
    );
    assert(Number.isInteger(asset.width) && asset.width > 0, `${context}: remote media needs positive integer width`);
    assert(
      Number.isInteger(asset.height) && asset.height > 0,
      `${context}: remote media needs positive integer height`
    );
  }
};

for (const collection of collections) {
  const items = await readJsonFiles(collection);
  const ids = new Set();

  items.forEach((item) => {
    assert(slugPattern.test(item.id), `${item.file}: id should be a lowercase hyphenated slug`);
    assert(!ids.has(item.id), `${item.file}: duplicate id ${item.id}`);
    ids.add(item.id);
  });
}

const settings = await readJsonFiles("settings");
const site = settings.find((item) => item.id === "site");
assert(Boolean(site), "settings/site.json is required");
if (site) {
  await checkMedia(site.data.heroImage, `${site.file} heroImage`, { required: true });
  await checkMedia(site.data.wechatQr, `${site.file} wechatQr`, { required: true });
}

const works = await readJsonFiles("works");
const featuredWorks = works.filter((item) => item.data.featured);
const archiveWorks = works.filter((item) => item.data.archive !== false);
assert(featuredWorks.length <= 9, `featured works should be 9 or fewer; found ${featuredWorks.length}`);
checkOrderedItems(featuredWorks, "featuredOrder", "featured works", { required: true });
checkOrderedItems(archiveWorks, "archiveOrder", "archive works", { required: true });

for (const item of works) {
  const data = item.data;
  assert(Boolean(data.title), `${item.file}: title is required`);
  assert(["photography", "drone"].includes(data.category), `${item.file}: invalid category`);
  assert(Boolean(data.alt), `${item.file}: alt is required`);
  assert(Boolean(data.label), `${item.file}: label is required`);
  assert(Boolean(data.detail?.style), `${item.file}: detail.style is required`);
  assert(Array.isArray(data.detail?.paragraphs), `${item.file}: detail.paragraphs must be an array`);
  await checkMedia(data.image, `${item.file} image`, { required: data.archive !== false });

  if (data.storyStatus === "ready") {
    assert(data.detail.paragraphs.length > 0, `${item.file}: ready story needs at least one paragraph`);
  }
}

const videos = await readJsonFiles("videos");
checkOrderedItems(videos, "order", "videos", { required: true });
for (const item of videos) {
  if (item.data.image) await checkMedia(item.data.image, `${item.file} image`);
  if (item.data.externalUrl) {
    assert(isAbsoluteHttpUrl(item.data.externalUrl), `${item.file}: externalUrl should be an absolute http(s) URL`);
  }
}

const panoramas = await readJsonFiles("panoramas");
checkOrderedItems(panoramas, "order", "panoramas", { required: true });
for (const item of panoramas) {
  await checkMedia(item.data.panorama, `${item.file} panorama`, { required: true });
  await checkMedia(item.data.preview, `${item.file} preview`, { required: true });
}

warnings.forEach((warning) => console.warn(`WARN ${warning}`));

if (errors.length) {
  errors.forEach((error) => console.error(`FAIL ${error}`));
  process.exitCode = 1;
} else {
  console.log(`OK content validated: ${works.length} works, ${featuredWorks.length} featured works`);
}
