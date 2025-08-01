[**@ls-stack/utils**](../README.md)

---

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

Defined in: [packages/utils/src/stringUtils.ts:11](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L11)

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

---

### convertToSnakeCase()

```ts
function convertToSnakeCase(str): string;
```

Defined in: [packages/utils/src/stringUtils.ts:46](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L46)

#### Parameters

##### str

`string`

#### Returns

`string`

---

### formatNum()

```ts
function formatNum(num): string;
```

Defined in: [packages/utils/src/stringUtils.ts:35](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L35)

#### Parameters

##### num

`number`

#### Returns

`string`

---

### isSnakeCase()

```ts
function isSnakeCase(str): boolean;
```

Defined in: [packages/utils/src/stringUtils.ts:42](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L42)

#### Parameters

##### str

`string`

#### Returns

`boolean`

---

### truncateString()

```ts
function truncateString(str, length, ellipsis): string;
```

Defined in: [packages/utils/src/stringUtils.ts:53](https://github.com/lucasols/utils/blob/main/packages/utils/src/stringUtils.ts#L53)

#### Parameters

##### str

`string`

##### length

`number`

##### ellipsis

`string` = `'…'`

#### Returns

`string`
