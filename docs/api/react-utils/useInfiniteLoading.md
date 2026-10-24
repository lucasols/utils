[@ls-stack/react-utils](modules.md) / useInfiniteLoading

# useInfiniteLoading

## Functions

### useInfiniteLoading()

```ts
function useInfiniteLoading(__namedParameters): void;
```

Defined in: [react-utils/src/useInfiniteLoading.ts:21](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useInfiniteLoading.ts#L21)

Calls `loadMore` when the container is scrolled near its end, or when the
loaded content doesn't fill the container yet.

`containerRef` can be a ref or the element itself. A ref is read again after
every commit of the component that uses the hook, pass the element (e.g. from
a `useState` callback ref) when it can be attached, replaced or removed by a
child component without this one re-rendering.

#### Parameters

##### \_\_namedParameters

###### containerRef

[`ElementTarget`](internalUtils/useCommittedElement.md#elementtarget)

###### disable?

`boolean`

###### hasMore

`boolean`

###### isLoaded

`boolean`

###### loadMore

() => `void`

###### triggerMargin?

`number` = `0`

#### Returns

`void`
