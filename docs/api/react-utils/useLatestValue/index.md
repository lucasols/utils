[@ls-stack/react-utils](../modules.md) / useLatestValue

# useLatestValue

## Modules

- [\<internal\>](-internal-.md)

## Functions

### useLatestCb()

```ts
function useLatestCb<T>(fn): T;
```

Defined in: [react-utils/src/useLatestValue.ts:37](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useLatestValue.ts#L37)

Hook that provides a stable callback reference that always calls the latest
version of the function.

#### Type Parameters

##### T

`T` *extends* [`__LEGIT_ANY_FUNCTION__`](-internal-.md#legit-any-function)

#### Parameters

##### fn

`T`

The function to wrap

#### Returns

`T`

A stable callback that always calls the latest version of the
  function

#### Example

```tsx
  function MyComponent({
    onDataChange,
    data,
  }: {
    onDataChange: (data: any) => void;
    data: any;
  }) {
    const latestCallback = useLatestCb(onDataChange);

    useEffect(() => {
      const interval = setInterval(() => {
        // Always calls the latest onDataChange function, even with empty deps
        latestCallback(data);
      }, 1000);

      return () => clearInterval(interval);
    }, [latestCallback]); // it is a stable ref that never changes
  }
  ```;
