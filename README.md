# @ls-stack TypeScript Utilities Monorepo

This monorepo contains three TypeScript utility packages:

- **[@ls-stack/utils](./packages/utils)** - Universal utilities for both browser and Node.js environments
- **[@ls-stack/node-utils](./packages/node-utils)** - Node.js-specific utilities 
- **[@ls-stack/browser-utils](./packages/browser-utils)** - Browser-specific utilities

## Packages

### @ls-stack/utils
[![npm](https://img.shields.io/npm/v/@ls-stack/utils.svg)](https://www.npmjs.com/package/@ls-stack/utils)

Universal utilities that work in both browser and Node.js environments. Contains 39 utility modules including array manipulation, async operations, type assertions, caching, and more.

### @ls-stack/node-utils
[![npm](https://img.shields.io/npm/v/@ls-stack/node-utils.svg)](https://www.npmjs.com/package/@ls-stack/node-utils)

Node.js-specific utilities including shell command execution.

### @ls-stack/browser-utils
[![npm](https://img.shields.io/npm/v/@ls-stack/browser-utils.svg)](https://www.npmjs.com/package/@ls-stack/browser-utils)

Browser-specific utilities including enhanced YAML stringification with File API support.

## Installation

Install the package you need:

```bash
# Universal utilities
npm install @ls-stack/utils

# Node.js utilities
npm install @ls-stack/node-utils

# Browser utilities
npm install @ls-stack/browser-utils
```

## Usage

Import utilities from their specific packages:

```typescript
// Universal utilities
import { createAsyncQueue } from '@ls-stack/utils/asyncQueue';
import { deepEqual } from '@ls-stack/utils/deepEqual';

// Node.js utilities
import { runCmd } from '@ls-stack/node-utils/runShellCmd';

// Browser utilities
import { yamlStringify } from '@ls-stack/browser-utils/yamlStringify';
```

## Documentation

Each package has its own comprehensive TypeScript documentation:

- **[@ls-stack/utils docs](./packages/utils/docs/README.md)** - Complete API reference for universal utilities
- **[@ls-stack/node-utils docs](./packages/node-utils/docs/README.md)** - API reference for Node.js utilities
- **[@ls-stack/browser-utils docs](./packages/browser-utils/docs/README.md)** - API reference for browser utilities

### Generating Documentation

```bash
# Generate docs for all packages
pnpm docs

# Generate docs for specific package
pnpm docs:utils
pnpm docs:node-utils
pnpm docs:browser-utils

# Watch mode for all packages
pnpm docs:watch
```

## Development

This is a monorepo managed with pnpm workspaces.

```bash
# Install dependencies
pnpm install

# Run tests for all packages
pnpm test

# Build all packages
pnpm build

# Lint all packages
pnpm lint

# Build specific package
pnpm build:utils
pnpm build:node-utils
pnpm build:browser-utils
```

## Migration from Old Package

If you're using the original `@ls-stack/utils` package, utilities have been split:

- `runShellCmd` → `@ls-stack/node-utils`
- `yamlStringify` → `@ls-stack/browser-utils`
- All other utilities remain in `@ls-stack/utils`

The original imports still work but show deprecation warnings.

## License

MIT

## Repository

[github:lucasols/utils](https://github.com/lucasols/utils)