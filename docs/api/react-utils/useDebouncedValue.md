[@ls-stack/react-utils](modules.md) / useDebouncedValue

# useDebouncedValue

## Functions

### useDebouncedValue()

```ts
function useDebouncedValue<T>(value, debounceMs): object;
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

`object`

Object with debouncedValue, isPending, and flush

##### debouncedValue

```ts
debouncedValue: T;
```

##### flush()

```ts
flush: () => void;
```

###### Returns

`void`

##### isPending

```ts
isPending: boolean;
```

#### Example

```tsx
  function SearchResults({ query }: { query: string }) {
    const { debouncedValue, isPending } = useDebouncedValue(query, 300);

    // debouncedValue updates 300ms after the last query change
    return isPending ? <Spinner /> : <Results query={debouncedValue} />;
  }
  ```;
