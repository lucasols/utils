import { defineConfig, type Options } from 'tsup';

export function createTsupConfig(options: Partial<Options> = {}) {
  return defineConfig({
    entry: [
      'src/*.ts',
      '!src/*.test.ts',
      '!src/*.test.tsx',
      '!src/*.typesTest.ts',
    ],
    clean: true,
    dts: true,
    outDir: 'dist',
    format: ['esm', 'cjs'],
    ...options,
  });
}
