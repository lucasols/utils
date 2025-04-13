import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/*.ts', '!src/*.test.ts'],
  clean: true,
  dts: true,
  outDir: 'lib',
  format: ['esm', 'cjs'],
  esbuildOptions(options) {
    options.mangleProps = /[^_]_$/;
  },
});
