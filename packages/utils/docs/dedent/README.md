[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / dedent

# dedent

## Modules

- [\<internal\>](-internal-.md)

## Interfaces

### Dedent()

Defined in: [packages/utils/src/dedent.ts:35](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L35)

Dedent function interface that can be used both as a template tag and a regular function

#### Call Signature

```ts
Dedent(literals): string;
```

Defined in: [packages/utils/src/dedent.ts:39](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L39)

Dedent function interface that can be used both as a template tag and a regular function

##### Parameters

###### literals

`string`

##### Returns

`string`

#### Call Signature

```ts
Dedent(strings, ...values): string;
```

Defined in: [packages/utils/src/dedent.ts:43](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L43)

Dedent function interface that can be used both as a template tag and a regular function

##### Parameters

###### strings

`TemplateStringsArray`

###### values

...[`InterpolationValue`](-internal-.md#interpolationvalue)[]

##### Returns

`string`

#### Properties

##### withOptions

```ts
withOptions: CreateDedent;
```

Defined in: [packages/utils/src/dedent.ts:47](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L47)

Create a new dedent function with custom options

***

### DedentOptions

Defined in: [packages/utils/src/dedent.ts:4](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L4)

Configuration options for the dedent function behavior

#### Properties

##### escapeSpecialCharacters?

```ts
optional escapeSpecialCharacters: boolean;
```

Defined in: [packages/utils/src/dedent.ts:10](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L10)

Whether to process escape sequences like \n, `, \$, and {
When true, allows using escaped characters in template literals

###### Default

```ts
true for template literals, false for plain strings
```

##### identInterpolations?

```ts
optional identInterpolations: boolean;
```

Defined in: [packages/utils/src/dedent.ts:21](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L21)

Whether to preserve relative indentation of interpolated multi-line values
When true, multi-line interpolations are re-indented to match the surrounding context

###### Default

```ts
true
```

##### showNullishOrFalseValues?

```ts
optional showNullishOrFalseValues: boolean;
```

Defined in: [packages/utils/src/dedent.ts:27](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L27)

Whether to display nullish or false values (false, null, undefined) in interpolations
When false, nullish or false values are skipped entirely

###### Default

```ts
false
```

##### trimWhitespace?

```ts
optional trimWhitespace: boolean;
```

Defined in: [packages/utils/src/dedent.ts:15](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L15)

Whether to trim leading and trailing whitespace from the final result

###### Default

```ts
true
```

## Type Aliases

### CreateDedent()

```ts
type CreateDedent = (options) => Dedent;
```

Defined in: [packages/utils/src/dedent.ts:53](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L53)

Factory function type for creating dedent functions with custom options

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

Defined in: [packages/utils/src/dedent.ts:75](https://github.com/lucasols/utils/blob/main/packages/utils/src/dedent.ts#L75)

Remove common leading indentation from multi-line strings while preserving relative indentation.
Can be used as a tagged template literal or called with a plain string.

By default, it will dedent interpolated multi-line strings to match the surrounding context.
And it will not show falsy values.

#### Example

```typescript
const text = dedent`
  function hello() {
    console.log('world');
  }
`;
// Result:
"function hello() {
  console.log('world');
}"
```
