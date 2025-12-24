import { defineConfig, type UserConfig } from 'tsdown';

export function createTsdownConfig(options: Partial<UserConfig> = {}) {
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
    format: ['esm'],
    ...options,
  });
}
