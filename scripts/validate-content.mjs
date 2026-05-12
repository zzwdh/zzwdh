import { access, readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../", import.meta.url);
const contentRoot = new URL("../src/content/", import.meta.url);
const collections = ["works", "videos", "panoramas", "settings"];
const errors = [];
const warnings = [];

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

const checkMedia = async (asset, context, { required = false } = {}) => {
  if (!asset) {
    assert(!required, `${context}: missing media asset`);
    return;
  }

  const source = asset.cdnUrl ?? asset.url ?? asset.key;
  assert(Boolean(source), `${context}: media asset needs key, url, or cdnUrl`);

  if (asset.type === "local" && asset.key) {
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
  }

  if (asset.type === "public" && asset.url?.startsWith("/")) {
    const found = await exists(join(root.pathname, "public", asset.url));
    assert(found, `${context}: public media "${asset.url}" is missing in public/`);
  }

  if (asset.type === "remote" || asset.cdnUrl) {
    assert(/^https?:\/\//.test(asset.cdnUrl ?? asset.url ?? ""), `${context}: remote media should use an absolute URL`);
  }
};

for (const collection of collections) {
  const items = await readJsonFiles(collection);
  const ids = new Set();

  items.forEach((item) => {
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
assert(featuredWorks.length <= 9, `featured works should be 9 or fewer; found ${featuredWorks.length}`);

for (const item of works) {
  const data = item.data;
  assert(Boolean(data.title), `${item.file}: title is required`);
  assert(["photography", "drone"].includes(data.category), `${item.file}: invalid category`);
  assert(Boolean(data.alt), `${item.file}: alt is required`);
  assert(Boolean(data.label), `${item.file}: label is required`);
  assert(Boolean(data.detail?.style), `${item.file}: detail.style is required`);
  assert(Array.isArray(data.detail?.paragraphs), `${item.file}: detail.paragraphs must be an array`);
  await checkMedia(data.image, `${item.file} image`, { required: data.archive !== false });

  if (data.featured && !data.featuredOrder) {
    warnings.push(`${item.file}: featured work has no featuredOrder`);
  }

  if (data.storyStatus === "ready") {
    assert(data.detail.paragraphs.length > 0, `${item.file}: ready story needs at least one paragraph`);
  }
}

for (const item of await readJsonFiles("videos")) {
  if (item.data.image) await checkMedia(item.data.image, `${item.file} image`);
}

for (const item of await readJsonFiles("panoramas")) {
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
