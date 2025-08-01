import { defineConfig } from 'vitest/config';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  test: {
    include: ['src/*.test.{ts,tsx}'],
    testTimeout: 2_000,
    allowOnly: !isProd,
    poolOptions: {
      forks: {
        execArgv: ['--expose-gc'],
      },
    },
    environment: 'happy-dom',
  },
});