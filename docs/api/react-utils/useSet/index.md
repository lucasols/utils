[@ls-stack/react-utils](../modules.md) / useSet

# useSet

## Modules

- [\<internal\>](-internal-.md)

## Functions

### useSet()

```ts
function useSet<T>(initialValue?, __namedParameters?): UseSet<T>;
```

Defined in: [react-utils/src/useSet.ts:19](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useSet.ts#L19)

Array state with set-like operations, items are compared by reference.
`onUpdate` is called once for each change, in the same call that made it. It
must be memoized, the returned callbacks change when it changes.

#### Type Parameters

##### T

`T`

#### Parameters

##### initialValue?

`T`[] | () => `T`[]

##### \_\_namedParameters?

###### onUpdate?

(`newValues`) => `void`

#### Returns

[`UseSet`](-internal-.md#useset)\<`T`\>
