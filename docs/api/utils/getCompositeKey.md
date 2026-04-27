[@ls-stack/utils](modules.md) / getCompositeKey

# getCompositeKey

## Type Aliases

### GetCompositeKeyOptions

```ts
type GetCompositeKeyOptions = object;
```

Defined in: [packages/utils/src/getCompositeKey.ts:7](https://github.com/lucasols/utils/blob/main/packages/utils/src/getCompositeKey.ts#L7)

#### Properties

##### maxSortingDepth?

```ts
optional maxSortingDepth: number;
```

Defined in: [packages/utils/src/getCompositeKey.ts:11](https://github.com/lucasols/utils/blob/main/packages/utils/src/getCompositeKey.ts#L11)

The maximum depth to sort the input value. Default is 3.

##### stringify?

```ts
optional stringify: GetCompositeKeyStringifier;
```

Defined in: [packages/utils/src/getCompositeKey.ts:16](https://github.com/lucasols/utils/blob/main/packages/utils/src/getCompositeKey.ts#L16)

Custom stringifier for values that need special handling. Return undefined
to keep using the default stringifier for that value.

***

### GetCompositeKeyStringifier()

```ts
type GetCompositeKeyStringifier = (input) => string | undefined;
```

Defined in: [packages/utils/src/getCompositeKey.ts:3](https://github.com/lucasols/utils/blob/main/packages/utils/src/getCompositeKey.ts#L3)

#### Parameters

##### input

`unknown`

#### Returns

`string` \| `undefined`

## Functions

### getCompositeKey()

```ts
function getCompositeKey(
   input, 
   options, 
   stringify?): string;
```

Defined in: [packages/utils/src/getCompositeKey.ts:34](https://github.com/lucasols/utils/blob/main/packages/utils/src/getCompositeKey.ts#L34)

Returns a stable key for the input value.

#### Parameters

##### input

`unknown`

The value to get a stable key for.

##### options

The maximum depth to sort the input value, or options for
  key generation.

`number` | [`GetCompositeKeyOptions`](#getcompositekeyoptions)

##### stringify?

[`GetCompositeKeyStringifier`](#getcompositekeystringifier)

Custom stringifier used with the legacy maxSortingDepth
  parameter.

#### Returns

`string`

A stable key for the input value.
