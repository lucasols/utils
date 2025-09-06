[@ls-stack/react-utils](../modules.md) / [useOnChange](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### CleanupFn()

```ts
type CleanupFn = () => void;
```

Defined in: [packages/react-utils/src/useOnChange.ts:10](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useOnChange.ts#L10)

Function returned from callbacks to clean up side effects

#### Returns

`void`

***

### EqualityFn()

```ts
type EqualityFn = (a, b) => boolean;
```

Defined in: [packages/react-utils/src/useOnChange.ts:7](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useOnChange.ts#L7)

Function that compares two values for equality

#### Parameters

##### a

[`__LEGIT_ANY__`](../useLatestValue/-internal-.md#__legit_any__)

##### b

[`__LEGIT_ANY__`](../useLatestValue/-internal-.md#__legit_any__)

#### Returns

`boolean`

***

### OnChangeOptions

```ts
type OnChangeOptions = object;
```

Defined in: [packages/react-utils/src/useOnChange.ts:13](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useOnChange.ts#L13)

Options for configuring onChange behavior

#### Properties

##### callOnMount?

```ts
optional callOnMount: boolean;
```

Defined in: [packages/react-utils/src/useOnChange.ts:17](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useOnChange.ts#L17)

Whether to call the callback on component mount. Defaults to false

##### equalityFn?

```ts
optional equalityFn: EqualityFn;
```

Defined in: [packages/react-utils/src/useOnChange.ts:15](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useOnChange.ts#L15)

Custom equality function for value comparison. Defaults to deepEqual
