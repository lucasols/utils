[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / [arrayUtils](README.md) / \<internal\>

# \<internal\>

## Type Aliases

### ArrayOps\<T\>

```ts
type ArrayOps<T> = object;
```

Defined in: [packages/utils/src/arrayUtils.ts:238](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L238)

#### Type Parameters

##### T

`T`

#### Properties

##### filterAndMap()

```ts
filterAndMap: <R>(mapFilter) => R[];
```

Defined in: [packages/utils/src/arrayUtils.ts:251](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L251)

Filter and map an array

###### Type Parameters

###### R

`R`

###### Parameters

###### mapFilter

(`item`, `index`) => `false` \| `R`

A function that takes an item and returns a value or `false`
to reject the item.

###### Returns

`R`[]

###### Example

```ts
const items = [1, 2, 3];

const enhancedItems = arrayOps(items);

enhancedItems.filterAndMap((item) => item === 2 ? false : item);
```

##### rejectDuplicates()

```ts
rejectDuplicates: (getKey) => T[];
```

Defined in: [packages/utils/src/arrayUtils.ts:253](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L253)

###### Parameters

###### getKey

(`item`) => `unknown`

###### Returns

`T`[]

##### sortBy()

```ts
sortBy: (sortByValue, props) => T[];
```

Defined in: [packages/utils/src/arrayUtils.ts:252](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L252)

###### Parameters

###### sortByValue

[`SortByValue`](#sortbyvalue)\<`T`\>

###### props

[`SortByProps`](#sortbyprops)

###### Returns

`T`[]

***

### SortByProps

```ts
type SortByProps = 
  | {
  order?: SortOrder | SortOrder[];
}
  | SortOrder
  | SortOrder[];
```

Defined in: [packages/utils/src/arrayUtils.ts:48](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L48)

***

### SortByValue()\<T\>

```ts
type SortByValue<T> = (item) => (number | string)[] | number | string;
```

Defined in: [packages/utils/src/arrayUtils.ts:46](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L46)

#### Type Parameters

##### T

`T`

#### Parameters

##### item

`T`

#### Returns

(`number` \| `string`)[] \| `number` \| `string`

***

### SortOrder

```ts
type SortOrder = "desc" | "asc";
```

Defined in: [packages/utils/src/arrayUtils.ts:44](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L44)
