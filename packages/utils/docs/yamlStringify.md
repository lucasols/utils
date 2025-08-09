[**@ls-stack/utils**](README.md)

***

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

Defined in: [packages/utils/src/yamlStringify.ts:15](https://github.com/lucasols/utils/blob/main/packages/utils/src/yamlStringify.ts#L15)

##### collapseObjects?

```ts
optional collapseObjects: boolean;
```

Defined in: [packages/utils/src/yamlStringify.ts:13](https://github.com/lucasols/utils/blob/main/packages/utils/src/yamlStringify.ts#L13)

##### maxDepth?

```ts
optional maxDepth: number;
```

Defined in: [packages/utils/src/yamlStringify.ts:11](https://github.com/lucasols/utils/blob/main/packages/utils/src/yamlStringify.ts#L11)

##### maxLineLength?

```ts
optional maxLineLength: number;
```

Defined in: [packages/utils/src/yamlStringify.ts:7](https://github.com/lucasols/utils/blob/main/packages/utils/src/yamlStringify.ts#L7)

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

Defined in: [packages/utils/src/yamlStringify.ts:18](https://github.com/lucasols/utils/blob/main/packages/utils/src/yamlStringify.ts#L18)

#### Parameters

##### obj

`unknown`

##### \_\_namedParameters

[`YamlStringifyOptions`](#yamlstringifyoptions) = `{}`

#### Returns

`string`
