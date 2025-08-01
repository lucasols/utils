# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`@ls-stack/utils` is a TypeScript utility library that provides a comprehensive set of helper functions for modern JavaScript/TypeScript projects. The library is designed with a modular architecture where each utility is exported as a separate module to enable tree-shaking and selective imports.

## Commands

### Development

- `pnpm test` - Run all tests using Vitest
- `pnpm test:ui` - Run tests with Vitest UI
- `pnpm lint` - Run TypeScript compiler and ESLint checks
- `pnpm tsc` - Run TypeScript compiler only
- `pnpm eslint` - Run ESLint only
- `pnpm build` - Full build process (test, lint, build, docs, update exports)
- `pnpm build:no-test` - Build without running tests

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

### Module Structure

The library follows a flat module structure where each utility is a separate TypeScript file in the `src/` directory:

- Each utility has its own `.ts` file (e.g., `arrayUtils.ts`, `asyncQueue.ts`)
- Each utility has corresponding `.test.ts` file for tests
- Tests are co-located with source files for better organization

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

The library uses subpath exports for tree-shaking:

```typescript
// Correct way to import utilities
import { createAsyncQueue } from '@ls-stack/utils/asyncQueue';
import { deepEqual } from '@ls-stack/utils/deepEqual';

// Avoid importing from main entry point
import { createAsyncQueue } from '@ls-stack/utils'; // Less optimal
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

### Special Notes

- The `main.ts` file only exports a placeholder error function
- Some utilities like `tsResult` are deprecated in favor of external libraries
- The build process automatically commits documentation changes
