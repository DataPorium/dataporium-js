// Compiles src/ to dist/esm (import) and dist/cjs (require).
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const tsc = require.resolve("typescript/bin/tsc");
const dist = new URL("../dist", import.meta.url);

rmSync(dist, { recursive: true, force: true });
execFileSync(process.execPath, [tsc, "-p", "tsconfig.json"], { stdio: "inherit" });
execFileSync(process.execPath, [tsc, "-p", "tsconfig.cjs.json"], { stdio: "inherit" });
mkdirSync(new URL("../dist/cjs", import.meta.url), { recursive: true });
writeFileSync(new URL("../dist/cjs/package.json", import.meta.url), JSON.stringify({ type: "commonjs" }) + "\n");
console.log("Built dist/esm and dist/cjs");
