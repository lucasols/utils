[@ls-stack/utils](modules.md) / getCompositeKey

# getCompositeKey

## Functions

### getCompositeKey()

```ts
function getCompositeKey(input, maxSortingDepth): string;
```

Defined in: [packages/utils/src/getCompositeKey.ts:11](https://github.com/lucasols/utils/blob/main/packages/utils/src/getCompositeKey.ts#L11)

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
