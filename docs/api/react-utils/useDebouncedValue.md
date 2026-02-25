[@ls-stack/react-utils](modules.md) / useDebouncedValue

# useDebouncedValue

## Functions

### useDebouncedValue()

```ts
function useDebouncedValue<T>(value, debounceMs): readonly [T, () => void, boolean];
```

Defined in: [packages/react-utils/src/useDebouncedValue.ts:24](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useDebouncedValue.ts#L24)

Hook that debounces a reactive value, returning a delayed version that only
updates after the specified delay has passed without changes.

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`T`

The value to debounce

##### debounceMs

`number`

The debounce delay in milliseconds

#### Returns

readonly \[`T`, () => `void`, `boolean`\]

Tuple of [debouncedValue, flush, isPending]

#### Example

```tsx
  function SearchResults({ query }: { query: string }) {
    const [debouncedQuery, flush, isPending] = useDebouncedValue(query, 300);

    // debouncedQuery updates 300ms after the last query change
    return isPending ? <Spinner /> : <Results query={debouncedQuery} />;
  }
  ```;
