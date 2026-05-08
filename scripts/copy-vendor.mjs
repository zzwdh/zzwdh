import { copyFile, mkdir } from "node:fs/promises";

const vendorDir = new URL("../public/vendor/", import.meta.url);
const pannellumSource = new URL("../node_modules/pannellum/build/pannellum.css", import.meta.url);
const pannellumTarget = new URL("./pannellum.css", vendorDir);

await mkdir(vendorDir, { recursive: true });
await copyFile(pannellumSource, pannellumTarget);
