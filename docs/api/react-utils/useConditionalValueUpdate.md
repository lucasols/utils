[@ls-stack/react-utils](modules.md) / useConditionalValueUpdate

# useConditionalValueUpdate

## Functions

### useConditionalValueUpdate()

```ts
function useConditionalValueUpdate<T>(
   value, 
   shouldUpdate, 
   initialValue): T;
```

Defined in: [react-utils/src/useConditionalValueUpdate.ts:7](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useConditionalValueUpdate.ts#L7)

Returns `value` only when `shouldUpdate(prevValue, value)` is true, otherwise
keeps returning the last value that passed the condition.

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`T`

##### shouldUpdate

(`prevValue`, `value`) => `boolean`

##### initialValue

`T` = `value`

#### Returns

`T`
