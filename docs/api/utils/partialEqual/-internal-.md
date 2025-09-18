[@ls-stack/utils](../modules.md) / [partialEqual](index.md) / \<internal\>

# \<internal\>

## Classes

### Comparisons

Defined in: [packages/utils/src/partialEqual.ts:27](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L27)

#### Constructors

##### Constructor

```ts
new Comparisons(type): Comparisons;
```

Defined in: [packages/utils/src/partialEqual.ts:29](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L29)

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

Defined in: [packages/utils/src/partialEqual.ts:28](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L28)

## Type Aliases

### ComparisonsType

```ts
type ComparisonsType = 
  | ["strStartsWith", string]
  | ["strEndsWith", string]
  | ["hasType", "string" | "number" | "boolean" | "object" | "array" | "function"]
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
  | ["isInstanceOf", (...args) => any]
  | ["not", ComparisonsType];
```

Defined in: [packages/utils/src/partialEqual.ts:6](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L6)
