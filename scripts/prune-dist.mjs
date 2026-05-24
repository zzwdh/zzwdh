import { chmod, readdir, rm } from "node:fs/promises";

const panoramaDir = new URL("../dist/panorama/", import.meta.url);
const keepPatterns = [/^pano-\d+\.(?:jpe?g)$/i, /^pano-\d+-web\.jpg$/i, /^pano-\d+-poster\.jpg$/i];

const shouldKeep = (name) => keepPatterns.some((pattern) => pattern.test(name));

try {
  const entries = await readdir(panoramaDir, { withFileTypes: true });
  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && !shouldKeep(entry.name))
      .map((entry) => rm(new URL(entry.name, panoramaDir)))
  );
  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && shouldKeep(entry.name))
      .map((entry) => chmod(new URL(entry.name, panoramaDir), 0o644))
  );
} catch (error) {
  if (error?.code !== "ENOENT") {
    throw error;
  }
}
