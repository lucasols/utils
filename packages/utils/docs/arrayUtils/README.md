[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / arrayUtils

# arrayUtils

## Modules

- [\<internal\>](-internal-.md)

## Type Aliases

### FilterAndMapReturn\<T\>

```ts
type FilterAndMapReturn<T> = false | T;
```

Defined in: [packages/utils/src/arrayUtils.ts:42](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L42)

#### Type Parameters

##### T

`T`

## Functions

### arrayWithPrev()

```ts
function arrayWithPrev<T>(array): [T, null | T][];
```

Defined in: [packages/utils/src/arrayUtils.ts:108](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L108)

#### Type Parameters

##### T

`T`

#### Parameters

##### array

`T`[]

#### Returns

\[`T`, `null` \| `T`\][]

***

### arrayWithPrevAndIndex()

```ts
function arrayWithPrevAndIndex<T>(array): object[];
```

Defined in: [packages/utils/src/arrayUtils.ts:112](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L112)

#### Type Parameters

##### T

`T`

#### Parameters

##### array

`T`[]

#### Returns

`object`[]

***

### filterAndMap()

```ts
function filterAndMap<T, R>(array, mapFilter): R[];
```

Defined in: [packages/utils/src/arrayUtils.ts:23](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L23)

allow to filter and map with better typing ergonomics

In the `mapFilter` function return `false` to reject the item, or any other
value to map it.

#### Type Parameters

##### T

`T`

##### R

`R`

#### Parameters

##### array

`IterableIterator`\<`T`, `any`, `any`\> | readonly `T`[]

##### mapFilter

(`item`, `index`) => `false` \| `R`

#### Returns

`R`[]

#### Example

```ts
// Filter reject and turn value into `value mapped`
const items = ['value', 'value', 'reject', 'reject'];

const mappedItems = filterAndMap(items, (item) =>
  item === 'reject'
    ? false
    : `${item} mapped`,
);

mappedItems; // ['value mapped', 'value mapped']
```

***

### findAfterIndex()

```ts
function findAfterIndex<T>(
   array, 
   index, 
   predicate): undefined | T;
```

Defined in: [packages/utils/src/arrayUtils.ts:135](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L135)

#### Type Parameters

##### T

`T`

#### Parameters

##### array

`T`[]

##### index

`number`

##### predicate

(`item`) => `boolean`

#### Returns

`undefined` \| `T`

***

### findBeforeIndex()

```ts
function findBeforeIndex<T>(
   array, 
   index, 
   predicate): undefined | T;
```

Defined in: [packages/utils/src/arrayUtils.ts:149](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L149)

#### Type Parameters

##### T

`T`

#### Parameters

##### array

`T`[]

##### index

`number`

##### predicate

(`item`) => `boolean`

#### Returns

`undefined` \| `T`

***

### hasDuplicates()

```ts
function hasDuplicates<T>(array, getKey): boolean;
```

Defined in: [packages/utils/src/arrayUtils.ts:173](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L173)

#### Type Parameters

##### T

`T`

#### Parameters

##### array

`T`[]

##### getKey

(`item`) => `unknown`

#### Returns

`boolean`

***

### isInArray()

```ts
function isInArray<T, U>(value, oneOf): value is U;
```

Defined in: [packages/utils/src/arrayUtils.ts:122](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L122)

#### Type Parameters

##### T

`T`

##### U

`U`

#### Parameters

##### value

`T`

##### oneOf

readonly `U`[]

#### Returns

`value is U`

***

### rejectArrayUndefinedValues()

```ts
function rejectArrayUndefinedValues<T>(array): T;
```

Defined in: [packages/utils/src/arrayUtils.ts:169](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L169)

#### Type Parameters

##### T

`T` *extends* `unknown`[]

#### Parameters

##### array

`T`

#### Returns

`T`

***

### rejectDuplicates()

```ts
function rejectDuplicates<T>(array, getKey): T[];
```

Defined in: [packages/utils/src/arrayUtils.ts:190](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L190)

#### Type Parameters

##### T

`T`

#### Parameters

##### array

`T`[]

##### getKey

(`item`) => `unknown`

#### Returns

`T`[]

***

### sortBy()

```ts
function sortBy<T>(
   arr, 
   sortByValue, 
   props): T[];
```

Defined in: [packages/utils/src/arrayUtils.ts:67](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L67)

Sort an array based on a value

Sort by `ascending` order by default

Use `Infinity` as as wildcard to absolute max and min values

#### Type Parameters

##### T

`T`

#### Parameters

##### arr

`T`[]

##### sortByValue

(`item`) => `string` \| `number` \| (`string` \| `number`)[]

##### props

[`SortOrder`](-internal-.md#sortorder) | [`SortOrder`](-internal-.md#sortorder)[] | \{
`order?`: SortOrder \| SortOrder\[\] \| undefined;
\}

#### Returns

`T`[]

#### Example

```ts
const items = [1, 3, 2, 4];

const sortedItems = sortBy(items, (item) => item);
// [1, 2, 3, 4]

const items2 = [{ a: 1, b: 2 }, { a: 2, b: 1 }, { a: 1, b: 1}]

// return a array to sort by multiple values
const sortedItems = sortBy(items, (item) => [item.a, item.b]);
```

***

### truncateArray()

```ts
function truncateArray<T>(
   array, 
   maxLength, 
   appendIfTruncated?): T[];
```

Defined in: [packages/utils/src/arrayUtils.ts:210](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L210)

#### Type Parameters

##### T

`T`

#### Parameters

##### array

`T`[]

##### maxLength

`number`

##### appendIfTruncated?

`T` | (`truncatedCount`) => `T`

#### Returns

`T`[]
