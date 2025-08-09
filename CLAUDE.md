## Overview

This is a monorepo containing three TypeScript utility packages:

- **`@ls-stack/utils`** - Universal utilities that work in both browser and Node.js environments
- **`@ls-stack/node-utils`** - Node.js-specific utilities (shell commands, file system operations)
- **`@ls-stack/browser-utils`** - Browser-specific utilities (File API, DOM-related operations)

All packages are designed with a modular architecture where each utility is exported as a separate module to enable tree-shaking and selective imports.

## Commands

### Monorepo Commands

- `pnpm test:all` - Run tests for all packages
- `pnpm lint:all` - Run lint checks for all packages
- `pnpm build:all` - Build all packages
- `pnpm build:deps` - Build only dependency packages (node-utils, browser-utils)

### Individual Package Commands

- `pnpm test` - Run tests for the package
- `pnpm lint` - Run TypeScript compiler and ESLint checks
- `pnpm tsc` - Run TypeScript compiler only
- `pnpm eslint` - Run ESLint only

### Package-Specific Commands

To run commands in specific packages:

- `pnpm --filter @ls-stack/utils <command>` - Run command in utils package
- `pnpm --filter @ls-stack/node-utils <command>` - Run command in node-utils package
- `pnpm --filter @ls-stack/browser-utils <command>` - Run command in browser-utils package

### Testing Single Files

- `cd package && pnpm test src/fileName.test.ts` - Run specific test file

### running single test

- `cd package && pnpm test src/testUtils.test.ts -t "should filter with wildcard patterns"` - Run specific test in test file

## Architecture

### Monorepo Structure

```
packages/
├── utils/           # Universal utilities (browser + Node.js)
├── node-utils/      # Node.js-specific utilities
└── browser-utils/   # Browser-specific utilities
```

### Module Structure

Each package follows a flat module structure:

- Each utility has its own `.ts` file (e.g., `arrayUtils.ts`, `asyncQueue.ts`)
- Each utility has corresponding `.test.ts` file for tests
- Tests are co-located with source files for better organization

### Package Distribution

- **`@ls-stack/utils`**: Contains 39 universal utilities that work in both environments
- **`@ls-stack/node-utils`**: Contains `runShellCmd` utility for shell command execution
- **`@ls-stack/browser-utils`**: Contains `yamlStringify` utility with File API support

### Build System

- **Bundler**: Uses `tsup` for building ESM and CJS formats
- **Output**: Generates dual-format packages in `lib/` directory
- **Exports**: Package exports are automatically updated via `scripts/updatePackageExports.ts`
- **Type Generation**: Generates both `.d.ts` and `.d.cts` declaration files

### Testing

- **Framework**: Vitest for unit testing
- **Pattern**: `src/*.test.{ts,tsx}` files
- **Timeout**: 2 second test timeout
- **Coverage**: Tests run with garbage collection exposed via `--expose-gc`
- Do not run tests with `pnpm vitest` use `pnpm test` instead

### Key Dependencies

- **Runtime**: `evtmitter` (event emitter), `t-result` (result types)
- **Type System**: Strict TypeScript with `noUncheckedIndexedAccess`
- **Linting**: Custom ESLint config with `@ls-stack/extended-lint`

### Import Patterns

#### Import Patterns

```typescript
// Universal utilities (work in both browser and Node.js)
import { createAsyncQueue } from '@ls-stack/utils/asyncQueue';
import { deepEqual } from '@ls-stack/utils/deepEqual';

// Node.js-specific utilities
import { runCmd } from '@ls-stack/node-utils/runShellCmd';

// Browser-specific utilities
import { yamlStringify } from '@ls-stack/browser-utils/yamlStringify';
```

### Utility Categories

- **Array Operations**: `arrayUtils` - filtering, mapping, sorting with enhanced typing
- **Async Control**: `asyncQueue`, `parallelAsyncCalls`, `createThrottleController` - concurrency management
- **Type Safety**: `assertions`, `typeGuards`, `exhaustiveMatch` - runtime type checking
- **Object Manipulation**: `objUtils` - deep object operations
- **Caching**: `cache` - TTL-based caching system
- **Result Types**: `tsResult` - functional error handling (deprecated in favor of `t-result`)

### Code Conventions

- All utilities are pure functions where possible
- Heavy use of generics for type safety
- Comprehensive JSDoc documentation with examples
- Test-driven development with co-located tests
- Consistent naming: camelCase for functions, PascalCase for types

### Shared Configurations

The monorepo uses shared base configurations to maintain consistency:

- **`eslint.config.base.ts`** - Shared ESLint configuration with TypeScript, Vitest, and extended-lint rules
- **`tsup.config.base.ts`** - Shared build configuration for dual ESM/CJS output
- **`tsconfig.base.json`** - Common TypeScript compiler options
- **`scripts/updatePackageExports.ts`** - Automated package.json exports generation

### Special Notes

- Some utilities like `tsResult` are deprecated in favor of external libraries (`t-result`)

## Testing Best Practices

- **Timing in Tests**:
  - Do not use `vi.useFakeTimers()`
  - Instead, use `await sleep()` with small intervals when simulating time-based behaviors
- prefer `toMatchInlineSnapshot` over `toEqual`
- prefer `toThrowErrorMatchingInlineSnapshot` over `toThrowError`

## Documentation Guidelines

- **JSDoc Best Practices**:
  - Do not add more than one example in JSDocs
  - Do not add examples for simple or very intuitive functions

```

```
