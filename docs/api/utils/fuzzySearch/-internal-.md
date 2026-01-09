[@ls-stack/utils](../modules.md) / [fuzzySearch](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### SearchOptions\<T\>

```ts
type SearchOptions<T> = object;
```

Defined in: [packages/utils/src/fuzzySearch.ts:3](https://github.com/lucasols/utils/blob/main/packages/utils/src/fuzzySearch.ts#L3)

#### Type Parameters

##### T

`T`

#### Properties

##### getStringToMatch()

```ts
getStringToMatch: (item) => string;
```

Defined in: [packages/utils/src/fuzzySearch.ts:5](https://github.com/lucasols/utils/blob/main/packages/utils/src/fuzzySearch.ts#L5)

###### Parameters

###### item

`T`

###### Returns

`string`

##### ignoreBestMatch?

```ts
optional ignoreBestMatch: boolean;
```

Defined in: [packages/utils/src/fuzzySearch.ts:9](https://github.com/lucasols/utils/blob/main/packages/utils/src/fuzzySearch.ts#L9)

##### items

```ts
items: T[];
```

Defined in: [packages/utils/src/fuzzySearch.ts:4](https://github.com/lucasols/utils/blob/main/packages/utils/src/fuzzySearch.ts#L4)

##### searchQuery

```ts
searchQuery: string | null;
```

Defined in: [packages/utils/src/fuzzySearch.ts:6](https://github.com/lucasols/utils/blob/main/packages/utils/src/fuzzySearch.ts#L6)

##### throwOnError?

```ts
optional throwOnError: boolean;
```

Defined in: [packages/utils/src/fuzzySearch.ts:10](https://github.com/lucasols/utils/blob/main/packages/utils/src/fuzzySearch.ts#L10)

##### uFuzzy

```ts
uFuzzy: uFuzzy;
```

Defined in: [packages/utils/src/fuzzySearch.ts:8](https://github.com/lucasols/utils/blob/main/packages/utils/src/fuzzySearch.ts#L8)

Pass a stable uFuzzy instance, you can use `getUFuzzyInstance` for this
