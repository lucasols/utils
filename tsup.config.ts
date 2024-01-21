import { defineConfig } from 'tsup';
import pkg from './package.json';
import { writeFileSync } from 'fs';

export default defineConfig({
  entry: ['src/*.ts', '!src/*.test.ts'],
  clean: true,
  dts: true,
  sourcemap: true,
  format: ['esm'],
  esbuildOptions(options) {
    options.mangleProps = /[^_]_$/;
  },
});
