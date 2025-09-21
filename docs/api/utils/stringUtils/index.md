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

Defined in: [packages/utils/src/stringUtils.ts:120](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L120)

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

Defined in: [packages/utils/src/stringUtils.ts:149](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L149)

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

Defined in: [packages/utils/src/stringUtils.ts:154](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L154)

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

Defined in: [packages/utils/src/stringUtils.ts:95](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L95)

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

Defined in: [packages/utils/src/stringUtils.ts:112](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L112)

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

Defined in: [packages/utils/src/stringUtils.ts:159](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L159)

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

Defined in: [packages/utils/src/stringUtils.ts:126](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L126)

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

Defined in: [packages/utils/src/stringUtils.ts:100](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L100)

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

Defined in: [packages/utils/src/stringUtils.ts:138](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L138)

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

Defined in: [packages/utils/src/stringUtils.ts:65](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L65)

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

Defined in: [packages/utils/src/stringUtils.ts:80](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L80)

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

Defined in: [packages/utils/src/stringUtils.ts:85](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L85)

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

Defined in: [packages/utils/src/stringUtils.ts:55](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L55)

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

Defined in: [packages/utils/src/stringUtils.ts:60](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L60)

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

Defined in: [packages/utils/src/stringUtils.ts:90](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L90)

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

Defined in: [packages/utils/src/stringUtils.ts:75](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L75)

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

Defined in: [packages/utils/src/stringUtils.ts:50](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L50)

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

Defined in: [packages/utils/src/stringUtils.ts:70](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L70)

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

Defined in: [packages/utils/src/stringUtils.ts:169](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L169)

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

Defined in: [packages/utils/src/stringUtils.ts:163](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L163)

#### Parameters

##### str

`string`

##### length

`number`

##### ellipsis

`string` = `'…'`

#### Returns

`string`
