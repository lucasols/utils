[@ls-stack/react-utils](modules.md) / useMemoWithPrev

# useMemoWithPrev

## Functions

### useMemoWithPrev()

```ts
function useMemoWithPrev<T>(factory, deps): T;
```

Defined in: [react-utils/src/useMemoWithPrev.ts:17](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useMemoWithPrev.ts#L17)

Like `useMemo`, but the factory receives the previous computed value. The
previous value is only replaced when the new one is not deep equal to it.

#### Type Parameters

##### T

`T`

#### Parameters

##### factory

(`prev`) => `T`

##### deps

`unknown`[]

#### Returns

`T`
