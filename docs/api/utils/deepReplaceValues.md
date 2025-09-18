[@ls-stack/utils](modules.md) / deepReplaceValues

# deepReplaceValues

## Functions

### deepReplaceValues()

```ts
function deepReplaceValues<T, R>(value, replaceValues): R;
```

Defined in: [packages/utils/src/deepReplaceValues.ts:80](https://github.com/lucasols/utils/blob/main/packages/utils/src/deepReplaceValues.ts#L80)

Recursively traverses an object or array and allows conditional replacement of values
based on a provided callback function. The callback receives each value and its path
within the data structure.

#### Type Parameters

##### T

`T`

##### R

`R` = `T`

#### Parameters

##### value

`T`

The input value to process (object, array, or primitive)

##### replaceValues

(`value`, `path`) => 
  \| `false`
  \| \{
  `newValue`: `unknown`;
\}

Callback function that receives each value and its path.
  Return `false` to keep the original value, or `{ newValue: unknown }` to replace it.
  The path uses dot notation for objects (e.g., "user.name") and bracket notation for arrays (e.g., "items[0]")

#### Returns

`R`

A new structure with replaced values. The original structure is not modified.

#### Throws

Error if circular references are detected

#### Example

```ts
const data = { user: { id: 1, name: "Alice" }, scores: [85, 92] };
const result = deepReplaceValues(data, (value, path) => {
  if (typeof value === "number") {
    return { newValue: value * 2 };
  }
  return false;
});
// Result: { user: { id: 2, name: "Alice" }, scores: [170, 184] }
```
