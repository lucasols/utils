[**@ls-stack/react-utils**](../README.md)

***

[@ls-stack/react-utils](../modules.md) / useLatestValue

# useLatestValue

## Modules

- [\<internal\>](-internal-.md)

## Type Aliases

### UseLatestValue\<T\>

```ts
type UseLatestValue<T> = object;
```

Defined in: [packages/react-utils/src/useLatestValue.ts:12](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useLatestValue.ts#L12)

#### Type Parameters

##### T

`T`

#### Properties

##### insideEffect

```ts
insideEffect: T;
```

Defined in: [packages/react-utils/src/useLatestValue.ts:13](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useLatestValue.ts#L13)

## Functions

### useLatestCb()

```ts
function useLatestCb<T>(fn): T;
```

Defined in: [packages/react-utils/src/useLatestValue.ts:77](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useLatestValue.ts#L77)

Hook that provides a stable callback reference that always calls the latest version of the function.

#### Type Parameters

##### T

`T` *extends* [`__LEGIT_ANY_FUNCTION__`](-internal-.md#__legit_any_function__)

#### Parameters

##### fn

`T`

The function to wrap

#### Returns

`T`

A stable callback that always calls the latest version of the function

#### Example

```tsx
function MyComponent({ onDataChange, data }: { onDataChange: (data: any) => void; data: any }) {
  const latestCallback = useLatestCb(onDataChange);

  useEffect(() => {
    const interval = setInterval(() => {
      // Always calls the latest onDataChange function, even with empty deps
      latestCallback(data);
    }, 1000);

    return () => clearInterval(interval);
  }, [latestCallback]); // it is a stable ref that never changes
}
```

***

### useLatestValue()

```ts
function useLatestValue<T>(value): UseLatestValue<T>;
```

Defined in: [packages/react-utils/src/useLatestValue.ts:41](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useLatestValue.ts#L41)

Hook that provides access to the latest value within effects and callbacks.

Returns an object with `insideEffect` property that always contains the most
recent value

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`T`

The value to keep track of

#### Returns

[`UseLatestValue`](#uselatestvalue)\<`T`\>

Object with `insideEffect` property containing the latest value

#### Example

```tsx
function MyComponent({ count }: { count: number }) {
  const latestCount = useLatestValue(count);

  useEffect(() => {
    const timer = setInterval(() => {
      // Always gets the latest count value, even in stale closure
      console.log('Current count:', latestCount.insideEffect);
    }, 1000);

    return () => clearInterval(timer);
  }, [latestCount]);
}
```
