[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / getValueStableKey

# getValueStableKey

## Functions

### getValueStableKey()

```ts
function getValueStableKey(input, maxSortingDepth): string;
```

Defined in: [src/getValueStableKey.ts:10](https://github.com/lucasols/utils/blob/main/src/getValueStableKey.ts#L10)

Returns a stable key for the input value.

#### Parameters

##### input

`unknown`

The value to get a stable key for.

##### maxSortingDepth

`number` = `3`

The maximum depth to sort the input value. Default is 3.

#### Returns

`string`

A stable key for the input value.
