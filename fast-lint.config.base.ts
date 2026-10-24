import { defineConfig } from '@ls-stack/fast-lint';

// fast-lint runs the `@ls-stack` rules and the rules ported from ESLint
// plugins, the oxlint native rules are in `oxlint.config.base.ts`

export function createBaseConfig({ react = false }: { react?: boolean } = {}) {
  return defineConfig({
    projects: ['tsconfig.json'],
    ignores: ['dist/**', 'lib/**', 'build/**', 'docs/**'],
    reportUnusedDisableDirectives: true,
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          disallow: [
            {
              selector: 'CallExpression[callee.property.name="only"]',
              message: 'No test.only',
            },
            {
              selector: 'CallExpression[callee.property.name="todo"]',
              message: 'No test.todo',
            },
            {
              selector: 'CallExpression[callee.name="it"]',
              message: 'Do not use `it()` use `test()` instead',
            },
          ],
        },
      ],
      'naming-convention': ['error', { values: false }],
    },
    overrides: react
      ? [
          {
            files: ['src/**'],
            ignores: ['**/*.test.{ts,tsx}'],
            rules: { 'react-compiler-extra': 'error' },
          },
        ]
      : [],
  });
}
