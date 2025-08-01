[**@ls-stack/utils**](README.md)

---

[@ls-stack/utils](modules.md) / serializeXML

# serializeXML

## Type Aliases

### SerializeOptions

```ts
type SerializeOptions = object;
```

Defined in: [packages/utils/src/serializeXML.ts:35](https://github.com/lucasols/utils/blob/main/packages/utils/src/serializeXML.ts#L35)

#### Properties

##### escapeText?

```ts
optional escapeText: boolean;
```

Defined in: [packages/utils/src/serializeXML.ts:37](https://github.com/lucasols/utils/blob/main/packages/utils/src/serializeXML.ts#L37)

##### indent?

```ts
optional indent: number | string;
```

Defined in: [packages/utils/src/serializeXML.ts:36](https://github.com/lucasols/utils/blob/main/packages/utils/src/serializeXML.ts#L36)

##### invalidNodes?

```ts
optional invalidNodes: "throw" | "reject";
```

Defined in: [packages/utils/src/serializeXML.ts:39](https://github.com/lucasols/utils/blob/main/packages/utils/src/serializeXML.ts#L39)

##### validateTagName?

```ts
optional validateTagName: boolean;
```

Defined in: [packages/utils/src/serializeXML.ts:38](https://github.com/lucasols/utils/blob/main/packages/utils/src/serializeXML.ts#L38)

---

### XMLNode

```ts
type XMLNode =
  | {
      attrs?: Record<string, string | number | boolean | null | undefined>;
      children?: (XMLNode | null | undefined | false)[] | string;
      escapeText?: boolean;
      name: string;
      type?: 'node';
    }
  | {
      content: string;
      escapeText?: boolean;
      type: 'comment';
    }
  | {
      type: 'emptyLine';
    };
```

Defined in: [packages/utils/src/serializeXML.ts:18](https://github.com/lucasols/utils/blob/main/packages/utils/src/serializeXML.ts#L18)

## Functions

### serializeXML()

```ts
function serializeXML(node, options?): string;
```

Defined in: [packages/utils/src/serializeXML.ts:42](https://github.com/lucasols/utils/blob/main/packages/utils/src/serializeXML.ts#L42)

#### Parameters

##### node

[`XMLNode`](#xmlnode) | [`XMLNode`](#xmlnode)[]

##### options?

[`SerializeOptions`](#serializeoptions)

#### Returns

`string`
