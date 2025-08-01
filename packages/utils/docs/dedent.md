[**@ls-stack/utils**](README.md)

---

[@ls-stack/utils](modules.md) / dedent

# dedent

## Interfaces

### Dedent()

Defined in: [packages/utils/src/dedent.ts:6](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L6)

#### Call Signature

```ts
Dedent(literals): string;
```

Defined in: [packages/utils/src/dedent.ts:7](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L7)

##### Parameters

###### literals

`string`

##### Returns

`string`

#### Call Signature

```ts
Dedent(strings, ...values): string;
```

Defined in: [packages/utils/src/dedent.ts:8](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L8)

##### Parameters

###### strings

`TemplateStringsArray`

###### values

...`unknown`[]

##### Returns

`string`

#### Properties

##### withOptions

```ts
withOptions: CreateDedent;
```

Defined in: [packages/utils/src/dedent.ts:9](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L9)

---

### DedentOptions

Defined in: [packages/utils/src/dedent.ts:1](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L1)

#### Properties

##### escapeSpecialCharacters?

```ts
optional escapeSpecialCharacters: boolean;
```

Defined in: [packages/utils/src/dedent.ts:2](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L2)

##### trimWhitespace?

```ts
optional trimWhitespace: boolean;
```

Defined in: [packages/utils/src/dedent.ts:3](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L3)

## Type Aliases

### CreateDedent()

```ts
type CreateDedent = (options) => Dedent;
```

Defined in: [packages/utils/src/dedent.ts:12](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L12)

#### Parameters

##### options

[`DedentOptions`](#dedentoptions)

#### Returns

[`Dedent`](#dedent)

## Variables

### dedent

```ts
const dedent: Dedent;
```

Defined in: [packages/utils/src/dedent.ts:14](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L14)
