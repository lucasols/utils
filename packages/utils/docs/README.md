**@ls-stack/utils**

***

# @ls-stack/utils

Generic TypeScript utilities for modern JavaScript/TypeScript projects.

## Installation

```bash
npm install @ls-stack/utils
# or
pnpm add @ls-stack/utils
# or
yarn add @ls-stack/utils
```

## Usage

Import specific utilities from their modules:

```typescript
import { createAsyncQueue } from '@ls-stack/utils/asyncQueue';
import { deepEqual } from '@ls-stack/utils/deepEqual';
import { debounce } from '@ls-stack/utils/debounce';
```

## Available Utilities

This package includes a wide range of utilities for:

- **Array manipulation** (`arrayUtils`) - sorting, grouping, filtering
- **Async operations** (`asyncQueue`, `parallelAsyncCalls`, `promiseUtils`) - queue management and promise utilities
- **Type assertions** (`assertions`) - runtime type checking
- **Caching** (`cache`) - efficient caching with TTL support
- **Concurrency control** (`concurrentCalls`, `createThrottleController`) - rate limiting and throttling
- **Object utilities** (`objUtils`) - deep operations on objects
- **String utilities** (`stringUtils`) - string manipulation and formatting
- **Math utilities** (`mathUtils`) - mathematical operations and calculations
- **And many more...**

## Documentation

Comprehensive API documentation is available in the [`docs/`](docs/) folder. Start with the [modules overview](docs/modules.md) to explore all available utilities.

### Generating Documentation

To regenerate the documentation after making changes:

```bash
pnpm docs
```

For continuous updates during development:

```bash
pnpm docs:watch
```

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Build the library
pnpm build

# Lint code
pnpm lint
```

## License

MIT

## Repository

[github:lucasols/utils](https://github.com/lucasols/utils)
