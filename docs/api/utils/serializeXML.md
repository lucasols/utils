[@ls-stack/utils](modules.md) / serializeXML

# serializeXML

## Type Aliases

### SerializeOptions

```ts
type SerializeOptions = object;
```

Defined in: [packages/utils/src/serializeXML.ts:30](https://github.com/lucasols/utils/blob/main/packages/utils/src/serializeXML.ts#L30)

#### Properties

##### escapeText?

```ts
optional escapeText: boolean;
```

Defined in: [packages/utils/src/serializeXML.ts:32](https://github.com/lucasols/utils/blob/main/packages/utils/src/serializeXML.ts#L32)

##### indent?

```ts
optional indent: number | string;
```

Defined in: [packages/utils/src/serializeXML.ts:31](https://github.com/lucasols/utils/blob/main/packages/utils/src/serializeXML.ts#L31)

##### invalidNodes?

```ts
optional invalidNodes: "throw" | "reject";
```

Defined in: [packages/utils/src/serializeXML.ts:34](https://github.com/lucasols/utils/blob/main/packages/utils/src/serializeXML.ts#L34)

##### validateTagName?

```ts
optional validateTagName: boolean;
```

Defined in: [packages/utils/src/serializeXML.ts:33](https://github.com/lucasols/utils/blob/main/packages/utils/src/serializeXML.ts#L33)

***

### XMLNode

```ts
type XMLNode = 
  | {
  attrs?: Record<string, string | number | boolean | null | undefined>;
  children?: (XMLNode | null | undefined | false)[] | string;
  escapeText?: boolean;
  name: string;
  type?: "node";
}
  | {
  content: string;
  escapeText?: boolean;
  type: "comment";
}
  | {
  type: "emptyLine";
};
```

Defined in: [packages/utils/src/serializeXML.ts:19](https://github.com/lucasols/utils/blob/main/packages/utils/src/serializeXML.ts#L19)

## Functions

### serializeXML()

```ts
function serializeXML(node, options?): string;
```

Defined in: [packages/utils/src/serializeXML.ts:37](https://github.com/lucasols/utils/blob/main/packages/utils/src/serializeXML.ts#L37)

#### Parameters

##### node

[`XMLNode`](#xmlnode) | false \| XMLNode \| null \| undefined[]

##### options?

[`SerializeOptions`](#serializeoptions)

#### Returns

`string`
