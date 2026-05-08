import { rmSync } from "node:fs";

for (const path of ["dist", ".astro"]) {
  rmSync(path, { recursive: true, force: true });
}
