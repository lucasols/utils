[@ls-stack/utils](../modules.md) / fuzzySearch

# fuzzySearch

## Modules

- [\<internal\>](-internal-.md)

## Functions

### fuzzySearchItems()

```ts
function fuzzySearchItems<T>(__namedParameters): T[];
```

Defined in: [packages/utils/src/fuzzySearch.ts:127](https://github.com/lucasols/utils/blob/main/packages/utils/src/fuzzySearch.ts#L127)

Performs fuzzy search on a list of items and returns matched items.

Simplified version of `fuzzySearchItemsWithResultMetadata` that only returns
items.

#### Type Parameters

##### T

`T`

#### Parameters

##### \_\_namedParameters

`Omit`\<[`SearchOptions`](-internal-.md#searchoptions)\<`T`\>, `"ignoreBestMatch"`\>

#### Returns

`T`[]

***

### fuzzySearchItemsWithResultMetadata()

```ts
function fuzzySearchItemsWithResultMetadata<T>(options): object;
```

Defined in: [packages/utils/src/fuzzySearch.ts:35](https://github.com/lucasols/utils/blob/main/packages/utils/src/fuzzySearch.ts#L35)

Performs fuzzy search on a list of items and returns matched items with score
metadata.

Uses uFuzzy for efficient fuzzy matching with Latin character normalization.
Falls back to simple string inclusion matching if an error occurs.

#### Type Parameters

##### T

`T`

#### Parameters

##### options

[`SearchOptions`](-internal-.md#searchoptions)\<`T`\>

Configuration options for the fuzzy search

#### Returns

`object`

Object containing filtered/sorted items and the best match score
  (higher is better)

##### bestMatchScore

```ts
bestMatchScore: number;
```

##### items

```ts
items: T[];
```

***

### getUFuzzyInstance()

```ts
function getUFuzzyInstance(): uFuzzy;
```

Defined in: [packages/utils/src/fuzzySearch.ts:149](https://github.com/lucasols/utils/blob/main/packages/utils/src/fuzzySearch.ts#L149)

Creates a configured uFuzzy instance with custom sorting for optimal fuzzy
matching.

The instance uses intraMode=1 and custom sorting that prioritizes: contiguous
character matches, prefix bounds, match density, and early start position.

#### Returns

`uFuzzy`
