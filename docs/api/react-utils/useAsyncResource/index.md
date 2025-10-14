[@ls-stack/react-utils](../modules.md) / useAsyncResource

# useAsyncResource

## Modules

- [\<internal\>](-internal-.md)

## Functions

### useAsyncResource()

```ts
function useAsyncResource<T>(asyncFn, options): AsyncResult<null | T>;
```

Defined in: [packages/react-utils/src/useAsyncResource.ts:58](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L58)

React hook to manage the lifecycle of an async resource (fetching, loading,
error, success).

Handles loading state, error state, and provides a `load` function to trigger
the async operation. By default, the async function runs on mount unless
`lazy: true` is passed.

#### Type Parameters

##### T

`T`

#### Parameters

##### asyncFn

() => `Promise`\<`T`\>

Function returning a Promise for the resource to load

##### options

[`Options`](-internal-.md#options) = `{}`

Optional configuration object

#### Returns

[`AsyncResult`](-internal-.md#asyncresult)\<`null` \| `T`\>

Object with:

  - `status`: 'idle' | 'loading' | 'refetching' | 'success' | 'error'
  - `error`: Error or null
  - `data`: The loaded data or null
  - `isLoading`: boolean (true if loading or refetching)
  - `load`: function to trigger loading

#### Examples

```ts
const { data, isLoading, error, load } = useAsyncResource(() =>
    fetchUser(id),
  );
  // Optionally, call `load()` to re-fetch or if using lazy mode
```

```ts
// Auto-refetch when dependencies change
  const { data, isLoading, status } = useAsyncResource(
    () => fetchUser(userId),
    { asyncFnUsesExternalDeps: true },
  );
  // Will refetch automatically when userId changes, status becomes 'refetching'
```
