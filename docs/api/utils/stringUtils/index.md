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

Defined in: [packages/utils/src/stringUtils.ts:118](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L118)

Convert a string to `camelCase`

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

Defined in: [packages/utils/src/stringUtils.ts:147](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L147)

Convert a string to `CONSTANT_CASE`

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

Defined in: [packages/utils/src/stringUtils.ts:152](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L152)

Convert a string to `dot.case`

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

Defined in: [packages/utils/src/stringUtils.ts:93](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L93)

Convert a string to `kebab-case`

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

Defined in: [packages/utils/src/stringUtils.ts:110](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L110)

Convert a string to `PascalCase`

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

Defined in: [packages/utils/src/stringUtils.ts:157](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L157)

Convert a string to `path/case`

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

Defined in: [packages/utils/src/stringUtils.ts:124](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L124)

Convert a string to `Sentence Case`

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

Defined in: [packages/utils/src/stringUtils.ts:98](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L98)

Convert a string to `snake_case`

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

Defined in: [packages/utils/src/stringUtils.ts:136](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L136)

Convert a string to `Title Case`

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

Defined in: [packages/utils/src/stringUtils.ts:63](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L63)

Check if a string is `camelCase`

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

Defined in: [packages/utils/src/stringUtils.ts:78](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L78)

Check if a string is `CONSTANT_CASE`

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

Defined in: [packages/utils/src/stringUtils.ts:83](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L83)

Check if a string is `dot.case`

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

Check if a string is `kebab-case`

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

Defined in: [packages/utils/src/stringUtils.ts:58](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L58)

Check if a string is `PascalCase`

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

Defined in: [packages/utils/src/stringUtils.ts:88](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L88)

Check if a string is `path/case`

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

Defined in: [packages/utils/src/stringUtils.ts:73](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L73)

Check if a string is `Sentence Case`

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

Defined in: [packages/utils/src/stringUtils.ts:48](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L48)

Check if a string is `snake_case`

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

Defined in: [packages/utils/src/stringUtils.ts:68](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L68)

Check if a string is `Title Case`

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

Defined in: [packages/utils/src/stringUtils.ts:167](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L167)

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

Defined in: [packages/utils/src/stringUtils.ts:161](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L161)

#### Parameters

##### str

`string`

##### length

`number`

##### ellipsis

`string` = `'…'`

#### Returns

`string`
