# Overview

This is a monorepo containing three TypeScript utility packages:

- **`@ls-stack/utils`** - Universal utilities that work in both browser and Node.js environments
- **`@ls-stack/node-utils`** - Node.js-specific utilities (shell commands, file system operations)
- **`@ls-stack/browser-utils`** - Browser-specific utilities (File API, DOM-related operations)

All packages are designed with a modular architecture where each utility is exported as a separate module to enable tree-shaking and selective imports.

# Commands

## Monorepo Commands

- `pnpm test:all` - Run tests for all packages
- `pnpm lint:all` - Run lint checks for all packages
- `pnpm build:all` - Build all packages
- `pnpm build:deps` - Build only dependency packages (node-utils, browser-utils)

## Individual Package Commands

- `pnpm test` - Run tests for the package
- `pnpm lint` - Run TypeScript compiler and ESLint checks
- `pnpm tsc` - Run TypeScript compiler only
- `pnpm eslint` - Run ESLint only

## Package-Specific Commands

To run commands in specific packages:

- `pnpm --filter @ls-stack/utils <command>` - Run command in utils package
- `pnpm --filter @ls-stack/node-utils <command>` - Run command in node-utils package
- `pnpm --filter @ls-stack/browser-utils <command>` - Run command in browser-utils package

## Testing Single Files

- `cd package && pnpm test src/fileName.test.ts` - Run specific test file

## running single test

- `cd package && pnpm test src/testUtils.test.ts -t "should filter with wildcard patterns"` - Run specific test in test file

# Architecture

## Monorepo Structure

```
packages/
├── utils/           # Universal utilities (browser + Node.js)
├── node-utils/      # Node.js-specific utilities
└── browser-utils/   # Browser-specific utilities
```

## Module Structure

Each package follows a flat module structure:

- Each utility has its own `.ts` file (e.g., `arrayUtils.ts`, `asyncQueue.ts`)
- Each utility has corresponding `.test.ts` file for tests
- Tests are co-located with source files for better organization

# Code Conventions

- All utilities are pure functions where possible
- Heavy use of generics for type safety
- Comprehensive JSDoc documentation with examples
- Test-driven development with co-located tests
- Consistent naming: camelCase for functions, PascalCase for types

# Special Notes

- Some utilities like `tsResult` are deprecated in favor of external libraries (`t-result`)

# Testing Best Practices

- **Framework**: Vitest for unit testing
- Do not run tests with `pnpm vitest` use `pnpm test` instead

- **Timing in Tests**:
  - Do not use `vi.useFakeTimers()`
  - Instead, use `await sleep()` with small intervals when simulating time-based behaviors
- prefer `toMatchInlineSnapshot` over `toEqual`
- prefer `toThrowErrorMatchingInlineSnapshot` over `toThrowError`
- use `test` instead of `it`

- **Creating tests that reflect real-world usage**:
  - Don't create tests that don't use properly the feature/utility you are testing

# IMPORTANT GUIDELINES FOR TESTS

- NEVER workaround bug you found in tests. IN NO CIRCUMSTANCES workaround bugs you found in tests. Fix the bug instead!
- NEVER DO THIS:
  - change the test to make it pass just because you found a bug

# Documentation Guidelines

- **JSDoc Best Practices**:
  - Do not add more than one example in JSDocs
  - Do not add examples for simple or very intuitive functions
