import { defineConfig, type DummyRuleMap } from 'oxlint';

// oxlint runs the native rules and type checks the files, the `@ls-stack`
// rules run on fast-lint, see `fast-lint.config.base.ts`

const reactRules: DummyRuleMap = {
  'react/rules-of-hooks': 'error',
  'react/exhaustive-deps': [
    'error',
    { additionalHooks: 'useMemoWithPrev|useDeepMemo' },
  ],
};

// catch code that breaks with the React 19 concurrent rendering, StrictMode and
// the React compiler
const reactCompilerRules: DummyRuleMap = {
  'react/capitalized-calls': 'error',
  'react/error-boundaries': 'error',
  'react/globals': 'error',
  'react/hooks': 'error',
  'react/immutability': 'error',
  'react/incompatible-library': 'error',
  'react/invariant': 'error',
  'react/memo-dependencies': 'error',
  'react/no-deriving-state-in-effects': 'error',
  'react/preserve-manual-memoization': 'error',
  'react/purity': 'error',
  'react/refs': 'error',
  'react/rule-suppression': 'error',
  'react/set-state-in-render': 'error',
  'react/syntax': 'error',
  'react/todo': 'error',
  'react/unsupported-syntax': 'error',
  'react/use-memo': 'error',
  'react/void-use-memo': 'error',
};

export function createBaseConfig({ react = false }: { react?: boolean } = {}) {
  return defineConfig({
    plugins: [
      'typescript',
      'unicorn',
      'vitest',
      'jsdoc',
      ...(react ? (['react'] as const) : []),
    ],
    categories: { correctness: 'off' },
    options: {
      typeAware: true,
      reportUnusedDisableDirectives: 'error',
      // oxlint rules use `oxlint-disable` comments, the rules that run on
      // fast-lint use `fast-lint-disable` comments
      respectEslintDisableDirectives: false,
    },
    rules: {
      // eslint recommended rules
      'for-direction': 'error',
      'no-async-promise-executor': 'error',
      'no-case-declarations': 'error',
      'no-compare-neg-zero': 'error',
      'no-cond-assign': 'error',
      'no-control-regex': 'error',
      'no-debugger': 'error',
      'no-delete-var': 'error',
      'no-dupe-else-if': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'error',
      'no-empty-character-class': 'error',
      'no-empty-pattern': 'error',
      'no-empty-static-block': 'error',
      'no-ex-assign': 'error',
      'no-extra-boolean-cast': 'error',
      'no-fallthrough': 'error',
      'no-global-assign': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-loss-of-precision': 'error',
      'no-misleading-character-class': 'error',
      'no-nonoctal-decimal-escape': 'error',
      'no-regex-spaces': 'error',
      'no-self-assign': 'error',
      'no-shadow-restricted-names': 'error',
      'no-sparse-arrays': 'error',
      'no-unexpected-multiline': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-optional-chaining': 'error',
      'no-unused-labels': 'error',
      'no-unused-private-class-members': 'error',
      'no-useless-backreference': 'error',
      'no-useless-catch': 'error',
      'no-useless-escape': 'error',
      'no-with': 'error',
      'require-yield': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',
      'no-var': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'no-array-constructor': 'error',

      // typescript recommended rules
      'typescript/no-duplicate-enum-values': 'error',
      'typescript/no-empty-object-type': 'error',
      'typescript/no-extra-non-null-assertion': 'error',
      'typescript/no-misused-new': 'error',
      'typescript/no-namespace': 'error',
      'typescript/no-non-null-asserted-optional-chain': 'error',
      'typescript/no-require-imports': 'error',
      'typescript/no-this-alias': 'error',
      'typescript/no-unnecessary-type-constraint': 'error',
      'typescript/no-unsafe-declaration-merging': 'error',
      'typescript/no-unsafe-function-type': 'error',
      'typescript/no-wrapper-object-types': 'error',
      'typescript/prefer-as-const': 'error',
      'typescript/prefer-namespace-keyword': 'error',
      'typescript/triple-slash-reference': 'error',

      // typescript recommended type checked rules
      'typescript/await-thenable': 'error',
      'typescript/no-array-delete': 'error',
      'typescript/no-base-to-string': 'error',
      'typescript/no-duplicate-type-constituents': 'error',
      'typescript/no-for-in-array': 'error',
      'typescript/no-implied-eval': 'error',
      'typescript/no-redundant-type-constituents': 'error',
      'typescript/no-unnecessary-type-assertion': 'error',
      'typescript/no-unsafe-call': 'error',
      'typescript/no-unsafe-enum-comparison': 'error',
      'typescript/no-unsafe-unary-minus': 'error',
      'typescript/prefer-promise-reject-errors': 'error',
      'typescript/restrict-plus-operands': 'error',

      // eslint rules
      'no-warning-comments': ['error', { terms: ['FIX:'] }],
      'no-constant-binary-expression': 'error',
      'object-shorthand': 'error',
      'no-useless-rename': 'error',
      'no-param-reassign': 'error',
      'prefer-template': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['*.test'], message: 'Do not import test files' },
            { group: ['dist-old', 'dist'], message: 'Only import from src' },
          ],
        },
      ],
      'no-implicit-coercion': [
        'error',
        { disallowTemplateShorthand: true, allow: ['!!'] },
      ],
      'no-unused-expressions': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-shadow': [
        'error',
        { ignoreOnInitialization: true, allow: ['expect'] },
      ],

      // typescript rules
      'typescript/no-unnecessary-condition': 'error',
      'typescript/prefer-optional-chain': 'error',

      // vitest rules
      'vitest/expect-expect': 'error',
      'vitest/no-identical-title': 'error',

      // unicorn rules
      'unicorn/require-array-join-separator': 'error',
      'unicorn/no-empty-file': 'error',
      'unicorn/no-array-reduce': ['error', { allowSimpleOperations: true }],
      'unicorn/no-array-for-each': 'error',

      // jsdoc recommended rules
      'jsdoc/check-access': 'error',
      'jsdoc/check-property-names': 'error',
      'jsdoc/check-tag-names': ['error', { typed: true }],
      'jsdoc/empty-tags': 'error',
      'jsdoc/implements-on-classes': 'error',
      'jsdoc/no-defaults': 'error',
      'jsdoc/require-param-name': 'error',
      'jsdoc/require-property': 'error',
      'jsdoc/require-property-description': 'error',
      'jsdoc/require-property-name': 'error',
      'jsdoc/require-returns-description': 'error',
      'jsdoc/require-yields': 'error',

      ...(react ? { ...reactRules, ...reactCompilerRules } : {}),
    },
    overrides: react
      ? [
          {
            // test components mutate outer variables to observe the renders
            files: ['**/*.test.{ts,tsx}'],
            rules: Object.fromEntries(
              Object.keys(reactCompilerRules).map((rule) => [rule, 'off']),
            ),
          },
        ]
      : [],
    ignorePatterns: ['dist', 'lib', 'build', 'docs', '**/*.d.ts'],
  });
}
