---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "@ls-stack/utils"
  text: "TypeScript Utility Packages"
  tagline: High-quality, type-safe utilities for modern JavaScript/TypeScript projects
  actions:
    - theme: brand
      text: API Documentation
      link: /api/

features:
  - title: Universal Utils
    details: Core utilities that work in both browser and Node.js environments, including async operations, data manipulation, and type utilities
    link: /api/utils/
  - title: Node.js Utils
    details: Server-side utilities for file system operations, shell commands, and Node.js-specific functionality
    link: /api/node-utils/
  - title: Browser Utils
    details: Client-side utilities for DOM manipulation, File API helpers, and browser-specific operations
    link: /api/browser-utils/
  - title: React Utils
    details: React-specific hooks and utilities for component development and state management
    link: /api/react-utils/
  - title: Tree-Shakable
    details: Modular architecture with individual exports for optimal bundle sizes and selective imports
  - title: Type-Safe
    details: Full TypeScript support with comprehensive type definitions and strict typing
---

