[@ls-stack/utils](modules.md) / yamlStringify

# yamlStringify

## Type Aliases

### YamlStringifyOptions

```ts
type YamlStringifyOptions = object;
```

Defined in: [packages/utils/src/yamlStringify.ts:5](https://github.com/lucasols/utils/blob/main/packages/utils/src/yamlStringify.ts#L5)

#### Properties

##### addRootObjSpaces?

```ts
optional addRootObjSpaces: "before" | "after" | "beforeAndAfter" | false;
```

Defined in: [packages/utils/src/yamlStringify.ts:21](https://github.com/lucasols/utils/blob/main/packages/utils/src/yamlStringify.ts#L21)

##### collapseObjects?

```ts
optional collapseObjects: boolean;
```

Defined in: [packages/utils/src/yamlStringify.ts:19](https://github.com/lucasols/utils/blob/main/packages/utils/src/yamlStringify.ts#L19)

##### includeErrorCause?

```ts
optional includeErrorCause: boolean;
```

Defined in: [packages/utils/src/yamlStringify.ts:28](https://github.com/lucasols/utils/blob/main/packages/utils/src/yamlStringify.ts#L28)

When serializing `Error`, include `cause` recursively. Default true.

##### includeErrorStack?

```ts
optional includeErrorStack: boolean;
```

Defined in: [packages/utils/src/yamlStringify.ts:26](https://github.com/lucasols/utils/blob/main/packages/utils/src/yamlStringify.ts#L26)

When serializing `Error`, include `stack`. Default true (direct
`yamlStringify`); `compactSnapshot` passes false by default.

##### maxDepth?

```ts
optional maxDepth: number;
```

Defined in: [packages/utils/src/yamlStringify.ts:17](https://github.com/lucasols/utils/blob/main/packages/utils/src/yamlStringify.ts#L17)

Max nesting depth from the YAML root for objects/arrays. For `Error`
values, each `cause` hop uses the depth of that `Error` in the tree (the
depth at which the instance is visited, then +1 per nested `Error`
`cause`). Payload fields skip YAML truncation; only `cause` may become
`{max depth reached}`.

##### maxLineLength?

```ts
optional maxLineLength: number;
```

Defined in: [packages/utils/src/yamlStringify.ts:7](https://github.com/lucasols/utils/blob/main/packages/utils/src/yamlStringify.ts#L7)

##### pickErrorOwnProps?

```ts
optional pickErrorOwnProps: string[] | (key, value) => boolean;
```

Defined in: [packages/utils/src/yamlStringify.ts:34](https://github.com/lucasols/utils/blob/main/packages/utils/src/yamlStringify.ts#L34)

Limit which extra enumerable own keys appear on `Error` (not `message` /
`name` / `stack` / `cause`). Omit to include all extras. Array =
allowlist.

##### showUndefined?

```ts
optional showUndefined: boolean;
```

Defined in: [packages/utils/src/yamlStringify.ts:9](https://github.com/lucasols/utils/blob/main/packages/utils/src/yamlStringify.ts#L9)

## Functions

### yamlStringify()

```ts
function yamlStringify(obj, __namedParameters): string;
```

Defined in: [packages/utils/src/yamlStringify.ts:101](https://github.com/lucasols/utils/blob/main/packages/utils/src/yamlStringify.ts#L101)

#### Parameters

##### obj

`unknown`

##### \_\_namedParameters

[`YamlStringifyOptions`](#yamlstringifyoptions) = `{}`

#### Returns

`string`
