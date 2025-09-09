[@ls-stack/utils](../modules.md) / arrayUtils

# arrayUtils

## Modules

- [\<internal\>](-internal-.md)

## Type Aliases

### FilterAndMapReturn\<T\>

```ts
type FilterAndMapReturn<T> = false | T;
```

Defined in: [packages/utils/src/arrayUtils.ts:41](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L41)

#### Type Parameters

##### T

`T`

***

### SortByProps

```ts
type SortByProps = 
  | {
  order?:   | SortOrder
     | SortOrder[];
}
  | SortOrder
  | SortOrder[];
```

Defined in: [packages/utils/src/arrayUtils.ts:49](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L49)

***

### SortByValueFn()\<T\>

```ts
type SortByValueFn<T> = (item) => (number | string)[] | number | string;
```

Defined in: [packages/utils/src/arrayUtils.ts:45](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L45)

#### Type Parameters

##### T

`T`

#### Parameters

##### item

`T`

#### Returns

(`number` \| `string`)[] \| `number` \| `string`

## Functions

### arrayOps()

```ts
function arrayOps<T>(array): ArrayOps<T>;
```

Defined in: [packages/utils/src/arrayUtils.ts:333](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L333)

Enhance an array with extra methods

#### Type Parameters

##### T

`T`

#### Parameters

##### array

`T`[]

#### Returns

[`ArrayOps`](-internal-.md#arrayops)\<`T`\>

#### Example

```ts
const enhancedItems = arrayOps(array);

  enhancedItems.filterAndMap((item) => (item === 2 ? false : item));
  enhancedItems.sortBy((item) => item);
  enhancedItems.rejectDuplicates((item) => item);
```

***

### arrayWithPrev()

```ts
function arrayWithPrev<T>(array): [T, null | T][];
```

Defined in: [packages/utils/src/arrayUtils.ts:144](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L144)

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

Defined in: [packages/utils/src/arrayUtils.ts:148](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L148)

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

Defined in: [packages/utils/src/arrayUtils.ts:22](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L22)

Allow to filter and map with better typing ergonomics

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
    item === 'reject' ? false : `${item} mapped`,
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

Defined in: [packages/utils/src/arrayUtils.ts:171](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L171)

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

### findAndMap()

```ts
function findAndMap<T, R>(array, predicate): undefined | R;
```

Defined in: [packages/utils/src/arrayUtils.ts:310](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L310)

Finds the first item in an array where the predicate returns a non-false
value and returns that mapped value.

Combines find and map operations - applies the predicate to each item until
one returns a value that is not `false`, then returns that mapped value. If
no item matches, returns `undefined`.

#### Type Parameters

##### T

`T`

##### R

`R`

#### Parameters

##### array

`T`[]

The array to search through

##### predicate

(`value`) => `false` \| `R`

Function that returns a mapped value or `false` to skip
  the item

#### Returns

`undefined` \| `R`

The first mapped value that is not `false`, or `undefined` if no
  item matches

#### Example

```ts
const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];

  const foundName = findAndMap(users, (user) =>
    user.id === 2 ? user.name.toUpperCase() : false,
  );
  // foundName is 'BOB'
```

***

### findBeforeIndex()

```ts
function findBeforeIndex<T>(
   array, 
   index, 
   predicate): undefined | T;
```

Defined in: [packages/utils/src/arrayUtils.ts:185](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L185)

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

### getAscIndexOrder()

```ts
function getAscIndexOrder(index): number;
```

Defined in: [packages/utils/src/arrayUtils.ts:140](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L140)

Get the correct 0 based value for sync with other array in ascending order

#### Parameters

##### index

`undefined` | `number`

#### Returns

`number`

#### Example

```ts
  const items = [1, 2, 3];

  const index = sortBy(
    items,
    (item) => getAscIndexOrder(
      followOrder.findIndex((order) => order === item)
    )
  );
  ```;

***

### hasDuplicates()

```ts
function hasDuplicates<T>(array, getKey): boolean;
```

Defined in: [packages/utils/src/arrayUtils.ts:209](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L209)

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

Defined in: [packages/utils/src/arrayUtils.ts:158](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L158)

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

Defined in: [packages/utils/src/arrayUtils.ts:205](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L205)

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

Defined in: [packages/utils/src/arrayUtils.ts:226](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L226)

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

Defined in: [packages/utils/src/arrayUtils.ts:82](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L82)

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

[`SortByValueFn`](#sortbyvaluefn)\<`T`\>

##### props

[`SortByProps`](#sortbyprops) = `'asc'`

#### Returns

`T`[]

#### Example

```ts
const items = [1, 3, 2, 4];

  const sortedItems = sortBy(items, (item) => item);
  // [1, 2, 3, 4]

  const items2 = [
    { a: 1, b: 2 },
    { a: 2, b: 1 },
    { a: 1, b: 1 },
  ];

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

Defined in: [packages/utils/src/arrayUtils.ts:246](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L246)

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
