[@ls-stack/react-utils](../modules.md) / useDebouncedCallback

# useDebouncedCallback

## Modules

- [\<internal\>](-internal-.md)

## Functions

### useDebouncedCallback()

```ts
function useDebouncedCallback<T>(
   callback, 
   debounceMs, 
options?): DebouncedFunc<T>;
```

Defined in: [packages/react-utils/src/useDebouncedCallback.ts:25](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useDebouncedCallback.ts#L25)

Hook that debounces a callback function with a stable reference.

The returned debounced function reference stays stable across renders while
always calling the latest version of the callback.

#### Type Parameters

##### T

`T` *extends* (...`args`) => `void`

#### Parameters

##### callback

`T`

The function to debounce

##### debounceMs

`number`

The number of milliseconds to delay

##### options?

[`DebounceOptions`](-internal-.md#debounceoptions)

Debounce options (leading, trailing, maxWait)

#### Returns

[`DebouncedFunc`](-internal-.md#debouncedfunc)\<`T`\>

Debounced function with cancel, flush, and pending methods

#### Example

```tsx
  function SearchInput({ onSearch }: { onSearch: (query: string) => void }) {
    const debouncedSearch = useDebouncedCallback(onSearch, 300);

    return <input onChange={(e) => debouncedSearch(e.target.value)} />;
  }
  ```;
