import { readFileSync } from "node:fs";
import { defineConfig } from "tsup";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  dts: false,
  outDir: "dist",
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: false,
  target: "es2020",
  define: {
    __CLI_VERSION__: JSON.stringify(pkg.version),
  },
});
