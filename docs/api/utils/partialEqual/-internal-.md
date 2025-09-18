[@ls-stack/utils](../modules.md) / [partialEqual](index.md) / \<internal\>

# \<internal\>

## Classes

### Comparisons

Defined in: [packages/utils/src/partialEqual.ts:22](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L22)

#### Constructors

##### Constructor

```ts
new Comparisons(type): Comparisons;
```

Defined in: [packages/utils/src/partialEqual.ts:24](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L24)

###### Parameters

###### type

[`ComparisonsType`](#comparisonstype-1)

###### Returns

[`Comparisons`](#comparisons)

#### Properties

##### type

```ts
type: ComparisonsType;
```

Defined in: [packages/utils/src/partialEqual.ts:23](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L23)

## Type Aliases

### ComparisonsType

```ts
type ComparisonsType = 
  | ["strStartsWith", string]
  | ["strEndsWith", string]
  | ["strContains", string]
  | ["strMatchesRegex", RegExp]
  | ["deepEqual", any]
  | ["numIsGreaterThan", number]
  | ["numIsGreaterThanOrEqual", number]
  | ["numIsLessThan", number]
  | ["numIsLessThanOrEqual", number]
  | ["numIsInRange", [number, number]]
  | ["jsonStringHasPartial", any]
  | ["partialEqual", any]
  | ["custom", (target) => boolean]
  | ["not", ComparisonsType];
```

Defined in: [packages/utils/src/partialEqual.ts:6](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L6)
