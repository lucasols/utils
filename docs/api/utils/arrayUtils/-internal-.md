[@ls-stack/utils](../modules.md) / [arrayUtils](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### ArrayOps\<T\>

```ts
type ArrayOps<T> = object;
```

Defined in: [packages/utils/src/arrayUtils.ts:301](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L301)

#### Type Parameters

##### T

`T`

#### Properties

##### filterAndMap()

```ts
filterAndMap: <R>(mapFilter) => R[];
```

Defined in: [packages/utils/src/arrayUtils.ts:315](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L315)

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

Defined in: [packages/utils/src/arrayUtils.ts:318](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L318)

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

Defined in: [packages/utils/src/arrayUtils.ts:317](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L317)

###### Parameters

###### getKey

(`item`) => `unknown`

###### Returns

`T`[]

##### sortBy()

```ts
sortBy: (sortByValue, props) => T[];
```

Defined in: [packages/utils/src/arrayUtils.ts:316](https://github.com/lucasols/utils/blob/main/packages/utils/src/arrayUtils.ts#L316)

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
