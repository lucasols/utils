[@ls-stack/utils](../modules.md) / [partialEqual](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### Comparison

```ts
type Comparison = object;
```

Defined in: [packages/utils/src/partialEqual.ts:27](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L27)

#### Properties

##### ~sc

```ts
~sc: ComparisonsType;
```

Defined in: [packages/utils/src/partialEqual.ts:28](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L28)

***

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
