import { defineConfig } from 'tsup';

export default defineConfig([
  // SDK build (library)
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: false,
    target: 'es2020',
    outDir: 'dist',
  },
  // CLI build (executable)
  {
    entry: ['src/cli/index.ts'],
    format: ['cjs'],
    dts: false,
    outDir: 'dist/cli',
    splitting: false,
    sourcemap: false,
    clean: false,
    minify: false,
    target: 'es2020',
  },
]);