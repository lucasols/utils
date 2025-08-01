# @ls-stack/browser-utils

[![npm](https://img.shields.io/npm/v/@ls-stack/browser-utils.svg)](https://www.npmjs.com/package/@ls-stack/browser-utils)

Browser-specific TypeScript utilities for modern JavaScript/TypeScript projects.

## Installation

```bash
npm install @ls-stack/browser-utils
# or
pnpm add @ls-stack/browser-utils
# or
yarn add @ls-stack/browser-utils
```

## Usage

Import specific utilities from their modules:

```typescript
import { yamlStringify } from '@ls-stack/browser-utils/yamlStringify';
```

## Available Utilities

### yamlStringify

Enhanced YAML stringification with browser File API support:

- **File object handling** - Properly serializes browser File objects
- **Comprehensive type support** - Maps, Sets, Dates, RegExp, Functions, Classes
- **Flexible formatting** - Configurable line length, indentation, and object spacing
- **Quote optimization** - Smart quote selection for strings with single/double quotes
- **Multiline string support** - Proper YAML multiline string formatting

```typescript
import { yamlStringify } from '@ls-stack/browser-utils/yamlStringify';

const file = new File(['content'], 'example.txt', { type: 'text/plain' });
const data = {
  file,
  config: { timeout: 5000 },
  items: ['a', 'b', 'c']
};

console.log(yamlStringify(data));
// Output:
// file{File}:
//   name: 'example.txt'
//   type: 'text/plain'
//   lastModified: '2024-01-01T00:00:00.000Z'
//   size: '7 B'
//
// config:
//   timeout: 5000
//
// items: ['a', 'b', 'c']
```

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the library
pnpm build

# Generate documentation
pnpm docs

# Lint code
pnpm lint
```

## License

MIT

## Repository

[github:lucasols/utils](https://github.com/lucasols/utils)