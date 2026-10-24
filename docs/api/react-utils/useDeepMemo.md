[@ls-stack/react-utils](modules.md) / useDeepMemo

# useDeepMemo

## Functions

### useDeepMemo()

```ts
function useDeepMemo<T>(callback, deeps): T;
```

Defined in: [react-utils/src/useDeepMemo.ts:9](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useDeepMemo.ts#L9)

Like `useMemo`, but the dependencies are compared with `deepEqual` instead of
by reference, so the value is only recomputed when a dependency changes
structurally.

#### Type Parameters

##### T

`T`

#### Parameters

##### callback

() => `T`

##### deeps

`unknown`[]

#### Returns

`T`

***

### useStableRefValue()

```ts
function useStableRefValue<T>(value): T;
```

Defined in: [react-utils/src/useDeepMemo.ts:25](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useDeepMemo.ts#L25)

Returns the first received value that is deep equal to `value`, keeping the
reference stable while the value doesn't change structurally.

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`T`

#### Returns

`T`
