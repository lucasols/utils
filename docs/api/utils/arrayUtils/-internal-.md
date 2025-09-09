[@ls-stack/utils](../modules.md) / [arrayUtils](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### ArrayOps\<T\>

```ts
type ArrayOps<T> = object;
```

Defined in: [packages/utils/src/arrayUtils.ts:265](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L265)

#### Type Parameters

##### T

`T`

#### Properties

##### filterAndMap()

```ts
filterAndMap: <R>(mapFilter) => R[];
```

Defined in: [packages/utils/src/arrayUtils.ts:279](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L279)

Filter and map an array

###### Type Parameters

###### R

`R`

###### Parameters

###### mapFilter

(`item`, `index`) => `false` \| `R`

A function that takes an item and returns a value or
  `false` to reject the item.

###### Returns

`R`[]

###### Example

```ts
const items = [1, 2, 3];

  const enhancedItems = arrayOps(items);

  enhancedItems.filterAndMap((item) => (item === 2 ? false : item));
```

##### findAndMap()

```ts
findAndMap: <R>(predicate) => R | undefined;
```

Defined in: [packages/utils/src/arrayUtils.ts:282](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L282)

###### Type Parameters

###### R

`R`

###### Parameters

###### predicate

(`value`) => `R` \| `false`

###### Returns

`R` \| `undefined`

##### rejectDuplicates()

```ts
rejectDuplicates: (getKey) => T[];
```

Defined in: [packages/utils/src/arrayUtils.ts:281](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L281)

###### Parameters

###### getKey

(`item`) => `unknown`

###### Returns

`T`[]

##### sortBy()

```ts
sortBy: (sortByValue, props) => T[];
```

Defined in: [packages/utils/src/arrayUtils.ts:280](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L280)

###### Parameters

###### sortByValue

[`SortByValueFn`](index.md#sortbyvaluefn)\<`T`\>

###### props

[`SortByProps`](index.md#sortbyprops)

###### Returns

`T`[]

***

### SortOrder

```ts
type SortOrder = "desc" | "asc";
```

Defined in: [packages/utils/src/arrayUtils.ts:43](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L43)
