# API Documentation

Welcome to the comprehensive API documentation for the **@ls-stack** utility packages. This monorepo contains four TypeScript utility packages designed to provide high-quality, type-safe utilities for different environments and use cases.

## Packages Overview

### [@ls-stack/utils](/api/utils/)
Universal TypeScript utilities that work in both browser and Node.js environments. This is the core package containing essential utilities for:
- Array and object manipulation
- Async operations and queues
- String processing
- Type utilities and guards
- Caching and performance optimizations

### [@ls-stack/node-utils](/api/node-utils/)
Node.js-specific utilities for server-side development including:
- File system operations
- Shell command execution
- Process management
- Path utilities

### [@ls-stack/browser-utils](/api/browser-utils/)
Browser-specific utilities for client-side development including:
- File API helpers
- DOM manipulation utilities
- Local storage management
- Browser-specific type guards

### [@ls-stack/react-utils](/api/react-utils/)
React-specific utilities and hooks for React applications including:
- Custom hooks
- Component utilities
- State management helpers
- Performance optimization tools

## Getting Started

Each package is designed with a modular architecture where utilities are exported as separate modules to enable tree-shaking and selective imports. You can install and use individual packages based on your needs:

```bash
# Universal utilities
npm install @ls-stack/utils

# Node.js utilities
npm install @ls-stack/node-utils

# Browser utilities  
npm install @ls-stack/browser-utils

# React utilities
npm install @ls-stack/react-utils
```

## Code Quality

All packages follow strict coding standards:
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Tree Shaking**: Modular exports for optimal bundle sizes
- **Testing**: Comprehensive test coverage with Vitest
- **Documentation**: JSDoc comments with examples for all public APIs
- **Performance**: Optimized implementations with benchmarking

Navigate to any package documentation above to explore the available utilities and their APIs.