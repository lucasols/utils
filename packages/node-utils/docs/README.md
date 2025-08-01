**@ls-stack/node-utils**

***

# @ls-stack/node-utils

[![npm](https://img.shields.io/npm/v/@ls-stack/node-utils.svg)](https://www.npmjs.com/package/@ls-stack/node-utils)

Node.js-specific TypeScript utilities for modern JavaScript/TypeScript projects.

## Installation

```bash
npm install @ls-stack/node-utils
# or
pnpm add @ls-stack/node-utils
# or
yarn add @ls-stack/node-utils
```

## Usage

Import specific utilities from their modules:

```typescript
import { runCmd, concurrentCmd } from '@ls-stack/node-utils/runShellCmd';
```

## Available Utilities

### runShellCmd

Shell command execution utilities with enhanced features:

- **`runCmd`** - Execute shell commands with comprehensive options
- **`concurrentCmd`** - Run commands concurrently with result tracking  
- **`runCmdUnwrap`** - Execute commands and return stdout directly
- **`runCmdSilent`** - Run commands silently without output
- **`runCmdSilentUnwrap`** - Silent execution with stdout return

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
