**@ls-stack/react-utils**

***

# React Utils

React-specific TypeScript utilities for the @ls-stack monorepo.

## Installation

```bash
npm install @ls-stack/react-utils
```

## Usage

```typescript
import { useConst } from '@ls-stack/react-utils/useConst';

function MyComponent() {
  const expensiveValue = useConst(() => computeExpensiveValue());
  // ...
}
```

## Available Utilities

- `useConst` - A React hook for creating constant values that only compute once
