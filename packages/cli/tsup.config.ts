import { defineConfig } from "tsup";

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
});
