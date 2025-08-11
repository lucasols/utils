[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / stringUtils

# stringUtils

## Modules

- [\<internal\>](-internal-.md)

## Variables

### ~~joinStrings()~~

```ts
const joinStrings: (...args) => string = concatStrings;
```

Defined in: [packages/utils/src/stringUtils.ts:34](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L34)

A util to create more legible conditional concatenated strings

#### Parameters

##### args

...([`Arg`](-internal-.md#arg) \| [`Arg`](-internal-.md#arg)[])[]

#### Returns

`string`

#### Example

```ts
joinStrings('a', 'b', 'c') // 'abc'
joinStrings('a', false, 'c') // 'ac'
joinStrings('a', addBString ? 'b' : null, 'c') // 'ac' if addBString is false, 'abc' if addBString is true
```

#### Deprecated

Use [concatStrings](#concatstrings) instead

## Functions

### concatStrings()

```ts
function concatStrings(...args): string;
```

Defined in: [packages/utils/src/stringUtils.ts:12](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L12)

A util to create more legible conditional concatenated strings

#### Parameters

##### args

...([`Arg`](-internal-.md#arg) \| [`Arg`](-internal-.md#arg)[])[]

#### Returns

`string`

#### Example

```ts
joinStrings('a', 'b', 'c') // 'abc'
joinStrings('a', false, 'c') // 'ac'
joinStrings('a', addBString ? 'b' : null, 'c') // 'ac' if addBString is false, 'abc' if addBString is true
```

***

### convertToCamelCase()

```ts
function convertToCamelCase(str): string;
```

Defined in: [packages/utils/src/stringUtils.ts:72](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L72)

#### Parameters

##### str

`string`

#### Returns

`string`

***

### convertToPascalCase()

```ts
function convertToPascalCase(str): string;
```

Defined in: [packages/utils/src/stringUtils.ts:65](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L65)

#### Parameters

##### str

`string`

#### Returns

`string`

***

### convertToSentenceCase()

```ts
function convertToSentenceCase(str): string;
```

Defined in: [packages/utils/src/stringUtils.ts:77](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L77)

#### Parameters

##### str

`string`

#### Returns

`string`

***

### convertToSnakeCase()

```ts
function convertToSnakeCase(str): string;
```

Defined in: [packages/utils/src/stringUtils.ts:54](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L54)

#### Parameters

##### str

`string`

#### Returns

`string`

***

### convertToTitleCase()

```ts
function convertToTitleCase(str): string;
```

Defined in: [packages/utils/src/stringUtils.ts:85](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L85)

#### Parameters

##### str

`string`

#### Returns

`string`

***

### formatNum()

```ts
function formatNum(num, maxDecimalsOrOptions): string;
```

Defined in: [packages/utils/src/stringUtils.ts:36](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L36)

#### Parameters

##### num

`number`

##### maxDecimalsOrOptions

`number` | `NumberFormatOptions`

#### Returns

`string`

***

### isSnakeCase()

```ts
function isSnakeCase(str): boolean;
```

Defined in: [packages/utils/src/stringUtils.ts:50](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L50)

#### Parameters

##### str

`string`

#### Returns

`boolean`

***

### truncateString()

```ts
function truncateString(
   str, 
   length, 
   ellipsis): string;
```

Defined in: [packages/utils/src/stringUtils.ts:92](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L92)

#### Parameters

##### str

`string`

##### length

`number`

##### ellipsis

`string` = `'…'`

#### Returns

`string`
