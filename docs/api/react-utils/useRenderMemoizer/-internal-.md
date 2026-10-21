[@ls-stack/react-utils](../modules.md) / [useRenderMemoizer](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### EqualityFn()

```ts
type EqualityFn = (a, b) => boolean;
```

Defined in: [react-utils/src/useRenderMemoizer.ts:6](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useRenderMemoizer.ts#L6)

#### Parameters

##### a

[`__LEGIT_ANY__`](../useLatestValue/-internal-.md#__legit_any__)

##### b

[`__LEGIT_ANY__`](../useLatestValue/-internal-.md#__legit_any__)

#### Returns

`boolean`

***

### RenderMemoizer

```ts
type RenderMemoizer = object;
```

Defined in: [react-utils/src/useRenderMemoizer.ts:8](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useRenderMemoizer.ts#L8)

#### Properties

##### \_cache

```ts
_cache: unknown;
```

Defined in: [react-utils/src/useRenderMemoizer.ts:22](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useRenderMemoizer.ts#L22)

##### getLazyValueWithDeps()

```ts
getLazyValueWithDeps: <T>(key, value, deps, equalityFn?) => T;
```

Defined in: [react-utils/src/useRenderMemoizer.ts:16](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useRenderMemoizer.ts#L16)

###### Type Parameters

###### T

`T`

###### Parameters

###### key

`string`

###### value

() => `T`

###### deps

[`__LEGIT_ANY__`](../useLatestValue/-internal-.md#__legit_any__)

###### equalityFn?

[`EqualityFn`](#equalityfn)

###### Returns

`T`

##### getValue()

```ts
getValue: <T>(key, value, equalityFn?) => T;
```

Defined in: [react-utils/src/useRenderMemoizer.ts:9](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useRenderMemoizer.ts#L9)

###### Type Parameters

###### T

`T`

###### Parameters

###### key

`string`

###### value

`T`

###### equalityFn?

[`EqualityFn`](#equalityfn)

###### Returns

`T`

##### getValueWithDeps()

```ts
getValueWithDeps: <T>(key, value, deps, equalityFn?) => T;
```

Defined in: [react-utils/src/useRenderMemoizer.ts:10](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useRenderMemoizer.ts#L10)

###### Type Parameters

###### T

`T`

###### Parameters

###### key

`string`

###### value

`T`

###### deps

[`__LEGIT_ANY__`](../useLatestValue/-internal-.md#__legit_any__)

###### equalityFn?

[`EqualityFn`](#equalityfn)

###### Returns

`T`
