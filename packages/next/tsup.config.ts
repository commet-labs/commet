import { defineConfig } from "tsup";
import pkg from "./package.json";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  target: "es2020",
  outDir: "dist",
  define: {
    __PKG_VERSION__: JSON.stringify(pkg.version),
  },
});
