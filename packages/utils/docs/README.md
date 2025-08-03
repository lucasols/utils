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

## Documentation

For a complete list of available utilities and their APIs, see the auto-generated documentation in the [`docs/`](docs/) folder. Start with the [modules overview](_media/modules.md) to explore all available utilities.

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
