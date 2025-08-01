import { defineConfig, type Options } from 'tsup';

export function createTsupConfig(options: Partial<Options> = {}) {
  return defineConfig({
    entry: ['src/*.ts', '!src/*.test.ts'],
    clean: true,
    dts: true,
    outDir: 'lib',
    format: ['esm', 'cjs'],
    esbuildOptions(esbuildOptions) {
      esbuildOptions.mangleProps = /[^_]_$/;
    },
    ...options,
  });
}