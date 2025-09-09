[@ls-stack/utils](modules.md) / getValueStableKey

# getValueStableKey

## Variables

### ~~getValueStableKey()~~

```ts
const getValueStableKey: (input, maxSortingDepth) => string = getCompositeKey;
```

Defined in: [packages/utils/src/getValueStableKey.ts:13](https://github.com/lucasols/utils/blob/main/packages/utils/src/getValueStableKey.ts#L13)

Returns a stable key for the input value.

Returns a stable key for the input value.

#### Parameters

##### input

`unknown`

The value to get a stable key for.

##### maxSortingDepth

`number` = `3`

The maximum depth to sort the input value. Default
  is 3.

#### Returns

`string`

A stable key for the input value.

#### Deprecated

Use `getCompositeKey` from `@ls-stack/utils/getCompositeKey`
  instead.

#### Param

The value to get a stable key for.

#### Param

The maximum depth to sort the input value. Default
  is 3.

#### Returns

A stable key for the input value.
