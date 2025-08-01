# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a monorepo containing three TypeScript utility packages:

- **`@ls-stack/utils`** - Universal utilities that work in both browser and Node.js environments
- **`@ls-stack/node-utils`** - Node.js-specific utilities (shell commands, file system operations)
- **`@ls-stack/browser-utils`** - Browser-specific utilities (File API, DOM-related operations)

The original `@ls-stack/utils` package now serves as a backward compatibility wrapper that re-exports utilities from the appropriate specialized packages with deprecation warnings.

## Commands

### Monorepo Commands
- `pnpm test:all` - Run tests for all packages
- `pnpm lint:all` - Run lint checks for all packages  
- `pnpm build:all` - Build all packages
- `pnpm build:deps` - Build only dependency packages (node-utils, browser-utils)

### Individual Package Commands
- `pnpm test` - Run tests for root package (backward compatibility wrapper)
- `pnpm test:ui` - Run tests with Vitest UI
- `pnpm lint` - Run TypeScript compiler and ESLint checks for root package
- `pnpm tsc` - Run TypeScript compiler only
- `pnpm eslint` - Run ESLint only
- `pnpm build` - Full build process for root package (includes building dependencies first)
- `pnpm build:no-test` - Build root package without running tests

### Package-Specific Commands
To run commands in specific packages:
- `pnpm --filter @ls-stack/utils <command>` - Run command in utils package
- `pnpm --filter @ls-stack/node-utils <command>` - Run command in node-utils package
- `pnpm --filter @ls-stack/browser-utils <command>` - Run command in browser-utils package

### Documentation
- `pnpm docs` - Generate TypeDoc documentation
- `pnpm docs:watch` - Generate docs in watch mode

### Testing Single Files
- `pnpm vitest src/fileName.test.ts` - Run specific test file
- `pnpm vitest src/fileName.test.ts --ui` - Run specific test with UI

### Other
- `pnpm bench:deepEqual` - Run deepEqual benchmarks
- `pnpm test:console-fmt` - Test console formatting utilities

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

### Key Dependencies
- **Runtime**: `evtmitter` (event emitter), `t-result` (result types)
- **Type System**: Strict TypeScript with `noUncheckedIndexedAccess`
- **Linting**: Custom ESLint config with `@ls-stack/extended-lint`

### Import Patterns

#### Recommended (New Packages)
```typescript
// Universal utilities (work in both browser and Node.js)
import { createAsyncQueue } from '@ls-stack/utils/asyncQueue';
import { deepEqual } from '@ls-stack/utils/deepEqual';

// Node.js-specific utilities
import { runCmd } from '@ls-stack/node-utils/runShellCmd';

// Browser-specific utilities  
import { yamlStringify } from '@ls-stack/browser-utils/yamlStringify';
```

#### Backward Compatibility (Deprecated)
```typescript
// These still work but show deprecation warnings
import { runCmd } from '@ls-stack/utils/runShellCmd'; // ⚠️ Deprecated
import { yamlStringify } from '@ls-stack/utils/yamlStringify'; // ⚠️ Deprecated

// Universal utilities continue to work as before
import { deepEqual } from '@ls-stack/utils/deepEqual'; // ✅ Still preferred
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

### Migration Guide

#### For Node.js-specific utilities:
```typescript
// Before
import { runCmd, concurrentCmd } from '@ls-stack/utils/runShellCmd';

// After  
import { runCmd, concurrentCmd } from '@ls-stack/node-utils/runShellCmd';
```

#### For Browser-specific utilities:
```typescript
// Before
import { yamlStringify } from '@ls-stack/utils/yamlStringify';

// After
import { yamlStringify } from '@ls-stack/browser-utils/yamlStringify';
```

#### Universal utilities (no change needed):
```typescript
// These imports remain the same
import { deepEqual } from '@ls-stack/utils/deepEqual';
import { createAsyncQueue } from '@ls-stack/utils/asyncQueue';
// ... all other utilities
```

### Special Notes
- The root `@ls-stack/utils` package now serves as a backward compatibility wrapper
- Deprecated imports show console warnings in development but continue to work
- Some utilities like `tsResult` are deprecated in favor of external libraries
- The build process automatically commits documentation changes
- ESLint rules are stricter in CI environment