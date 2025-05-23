[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / xmlSerializer

# xmlSerializer

## Type Aliases

### SerializeOptions

```ts
type SerializeOptions = object;
```

Defined in: [src/xmlSerializer.ts:25](https://github.com/lucasols/utils/blob/main/src/xmlSerializer.ts#L25)

#### Properties

##### escapeText?

```ts
optional escapeText: boolean;
```

Defined in: [src/xmlSerializer.ts:27](https://github.com/lucasols/utils/blob/main/src/xmlSerializer.ts#L27)

##### indent?

```ts
optional indent: number | string;
```

Defined in: [src/xmlSerializer.ts:26](https://github.com/lucasols/utils/blob/main/src/xmlSerializer.ts#L26)

##### validateTagName?

```ts
optional validateTagName: "throw" | "reject" | false;
```

Defined in: [src/xmlSerializer.ts:28](https://github.com/lucasols/utils/blob/main/src/xmlSerializer.ts#L28)

***

### XMLNode

```ts
type XMLNode = object;
```

Defined in: [src/xmlSerializer.ts:18](https://github.com/lucasols/utils/blob/main/src/xmlSerializer.ts#L18)

#### Properties

##### attributes?

```ts
optional attributes: Record<string, string | number | boolean | null | undefined>;
```

Defined in: [src/xmlSerializer.ts:20](https://github.com/lucasols/utils/blob/main/src/xmlSerializer.ts#L20)

##### children?

```ts
optional children: (XMLNode | null | undefined | false)[] | string;
```

Defined in: [src/xmlSerializer.ts:21](https://github.com/lucasols/utils/blob/main/src/xmlSerializer.ts#L21)

##### escapeText?

```ts
optional escapeText: boolean;
```

Defined in: [src/xmlSerializer.ts:22](https://github.com/lucasols/utils/blob/main/src/xmlSerializer.ts#L22)

##### name

```ts
name: string;
```

Defined in: [src/xmlSerializer.ts:19](https://github.com/lucasols/utils/blob/main/src/xmlSerializer.ts#L19)

## Functions

### serializeXML()

```ts
function serializeXML(node, options?): string;
```

Defined in: [src/xmlSerializer.ts:31](https://github.com/lucasols/utils/blob/main/src/xmlSerializer.ts#L31)

#### Parameters

##### node

[`XMLNode`](#xmlnode)

##### options?

[`SerializeOptions`](#serializeoptions)

#### Returns

`string`
