[@ls-stack/utils](../modules.md) / stringUtils

# stringUtils

## Modules

- [\<internal\>](-internal-.md)

## Variables

### ~~joinStrings()~~

```ts
const joinStrings: (...args) => string = concatStrings;
```

Defined in: [packages/utils/src/stringUtils.ts:33](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L33)

A util to create more legible conditional concatenated strings

#### Parameters

##### args

...([`Arg`](-internal-.md#arg) \| [`Arg`](-internal-.md#arg)[])[]

#### Returns

`string`

#### Example

```ts
joinStrings('a', 'b', 'c'); // 'abc'
  joinStrings('a', false, 'c'); // 'ac'
  joinStrings('a', addBString ? 'b' : null, 'c'); // 'ac' if addBString is false, 'abc' if addBString is true
```

#### Deprecated

Use [concatStrings](#concatstrings) instead

## Functions

### concatStrings()

```ts
function concatStrings(...args): string;
```

Defined in: [packages/utils/src/stringUtils.ts:13](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L13)

A util to create more legible conditional concatenated strings

#### Parameters

##### args

...([`Arg`](-internal-.md#arg) \| [`Arg`](-internal-.md#arg)[])[]

#### Returns

`string`

#### Example

```ts
joinStrings('a', 'b', 'c'); // 'abc'
  joinStrings('a', false, 'c'); // 'ac'
  joinStrings('a', addBString ? 'b' : null, 'c'); // 'ac' if addBString is false, 'abc' if addBString is true
```

***

### convertToCamelCase()

```ts
function convertToCamelCase(str): string;
```

Defined in: [packages/utils/src/stringUtils.ts:103](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L103)

#### Parameters

##### str

`string`

#### Returns

`string`

***

### convertToConstantCase()

```ts
function convertToConstantCase(str): string;
```

Defined in: [packages/utils/src/stringUtils.ts:129](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L129)

#### Parameters

##### str

`string`

#### Returns

`string`

***

### convertToDotCase()

```ts
function convertToDotCase(str): string;
```

Defined in: [packages/utils/src/stringUtils.ts:133](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L133)

#### Parameters

##### str

`string`

#### Returns

`string`

***

### convertToKebabCase()

```ts
function convertToKebabCase(str): string;
```

Defined in: [packages/utils/src/stringUtils.ts:81](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L81)

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

Defined in: [packages/utils/src/stringUtils.ts:96](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L96)

#### Parameters

##### str

`string`

#### Returns

`string`

***

### convertToPathCase()

```ts
function convertToPathCase(str): string;
```

Defined in: [packages/utils/src/stringUtils.ts:137](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L137)

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

Defined in: [packages/utils/src/stringUtils.ts:108](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L108)

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

Defined in: [packages/utils/src/stringUtils.ts:85](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L85)

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

Defined in: [packages/utils/src/stringUtils.ts:119](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L119)

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

Defined in: [packages/utils/src/stringUtils.ts:35](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L35)

#### Parameters

##### num

`number`

##### maxDecimalsOrOptions

`number` | `NumberFormatOptions`

#### Returns

`string`

***

### isCamelCase()

```ts
function isCamelCase(str): boolean;
```

Defined in: [packages/utils/src/stringUtils.ts:59](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L59)

#### Parameters

##### str

`string`

#### Returns

`boolean`

***

### isConstantCase()

```ts
function isConstantCase(str): boolean;
```

Defined in: [packages/utils/src/stringUtils.ts:69](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L69)

#### Parameters

##### str

`string`

#### Returns

`boolean`

***

### isDotCase()

```ts
function isDotCase(str): boolean;
```

Defined in: [packages/utils/src/stringUtils.ts:73](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L73)

#### Parameters

##### str

`string`

#### Returns

`boolean`

***

### isKebabCase()

```ts
function isKebabCase(str): boolean;
```

Defined in: [packages/utils/src/stringUtils.ts:53](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L53)

#### Parameters

##### str

`string`

#### Returns

`boolean`

***

### isPascalCase()

```ts
function isPascalCase(str): boolean;
```

Defined in: [packages/utils/src/stringUtils.ts:56](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L56)

#### Parameters

##### str

`string`

#### Returns

`boolean`

***

### isPathCase()

```ts
function isPathCase(str): boolean;
```

Defined in: [packages/utils/src/stringUtils.ts:77](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L77)

#### Parameters

##### str

`string`

#### Returns

`boolean`

***

### isSentenceCase()

```ts
function isSentenceCase(str): boolean;
```

Defined in: [packages/utils/src/stringUtils.ts:65](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L65)

#### Parameters

##### str

`string`

#### Returns

`boolean`

***

### isSnakeCase()

```ts
function isSnakeCase(str): boolean;
```

Defined in: [packages/utils/src/stringUtils.ts:49](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L49)

#### Parameters

##### str

`string`

#### Returns

`boolean`

***

### isTitleCase()

```ts
function isTitleCase(str): boolean;
```

Defined in: [packages/utils/src/stringUtils.ts:62](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L62)

#### Parameters

##### str

`string`

#### Returns

`boolean`

***

### removeANSIColors()

```ts
function removeANSIColors(str): string;
```

Defined in: [packages/utils/src/stringUtils.ts:147](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L147)

#### Parameters

##### str

`string`

#### Returns

`string`

***

### truncateString()

```ts
function truncateString(
   str, 
   length, 
   ellipsis): string;
```

Defined in: [packages/utils/src/stringUtils.ts:141](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L141)

#### Parameters

##### str

`string`

##### length

`number`

##### ellipsis

`string` = `'…'`

#### Returns

`string`
