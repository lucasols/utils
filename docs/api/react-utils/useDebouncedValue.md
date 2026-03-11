[@ls-stack/react-utils](modules.md) / useDebouncedValue

# useDebouncedValue

## Functions

### useDebouncedValue()

```ts
function useDebouncedValue<T>(
   value, 
   debounceMs, 
   options?): readonly [T, () => void, boolean];
```

Defined in: [packages/react-utils/src/useDebouncedValue.ts:35](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useDebouncedValue.ts#L35)

Hook that debounces a reactive value, returning a delayed version that only
updates after the specified delay has passed without changes.

Pass `0` as `debounceMs` to disable debouncing entirely, which makes the
hook act as a passthrough (the returned value always matches the input).
This is useful for conditionally disabling debouncing without changing the
call site.

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`T`

The value to debounce

##### debounceMs

`number`

The debounce delay in milliseconds. Use `0` to disable
  debouncing and pass the value through immediately.

##### options?

[`DebounceOptions`](useDebouncedCallback/-internal-.md#debounceoptions)

Debounce options (leading, trailing, maxWait)

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
