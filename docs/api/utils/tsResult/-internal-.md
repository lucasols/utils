[@ls-stack/utils](../modules.md) / [tsResult](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### AnyResultMethods

```ts
type AnyResultMethods = Record<ResultMethodsKeys, never>;
```

Defined in: [packages/utils/src/tsResult.ts:6](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L6)

***

### Err\<E\>

```ts
type Err<E> = object & AnyResultMethods;
```

Defined in: [packages/utils/src/tsResult.ts:16](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L16)

#### Type Declaration

##### error

```ts
error: E;
```

##### ~~errorResult()~~

```ts
errorResult: () => Err<E>;
```

###### Returns

[`Err`](#err)\<`E`\>

###### Deprecated

Use `t-result` library instead.

##### ok

```ts
ok: false;
```

#### Type Parameters

##### E

`E` *extends* [`ResultValidErrors`](index.md#resultvaliderrors)

***

### Ok\<T\>

```ts
type Ok<T> = object & AnyResultMethods;
```

Defined in: [packages/utils/src/tsResult.ts:4](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L4)

#### Type Declaration

##### error

```ts
error: false;
```

##### ok

```ts
ok: true;
```

##### value

```ts
value: T;
```

#### Type Parameters

##### T

`T`

***

### ResultMethods\<T, E\>

```ts
type ResultMethods<T, E> = object;
```

Defined in: [packages/utils/src/tsResult.ts:23](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L23)

#### Type Parameters

##### T

`T`

##### E

`E` *extends* [`ResultValidErrors`](index.md#resultvaliderrors)

#### Properties

##### ~~ifErr()~~

```ts
ifErr: (fn) => Result<T, E>;
```

Defined in: [packages/utils/src/tsResult.ts:44](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L44)

###### Parameters

###### fn

(`error`) => `void`

###### Returns

[`Result`](index.md#result)\<`T`, `E`\>

###### Deprecated

Use `t-result` library instead.

##### ~~ifOk()~~

```ts
ifOk: (fn) => Result<T, E>;
```

Defined in: [packages/utils/src/tsResult.ts:42](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L42)

###### Parameters

###### fn

(`value`) => `void`

###### Returns

[`Result`](index.md#result)\<`T`, `E`\>

###### Deprecated

Use `t-result` library instead.

##### ~~mapErr()~~

```ts
mapErr: <NewError>(mapFn) => Result<T, NewError>;
```

Defined in: [packages/utils/src/tsResult.ts:33](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L33)

###### Type Parameters

###### NewError

`NewError` *extends* [`ResultValidErrors`](index.md#resultvaliderrors)

###### Parameters

###### mapFn

(`error`) => `NewError`

###### Returns

[`Result`](index.md#result)\<`T`, `NewError`\>

###### Deprecated

Use `t-result` library instead.

##### ~~mapOk()~~

```ts
mapOk: <NewValue>(mapFn) => Result<NewValue, E>;
```

Defined in: [packages/utils/src/tsResult.ts:31](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L31)

###### Type Parameters

###### NewValue

`NewValue`

###### Parameters

###### mapFn

(`value`) => `NewValue`

###### Returns

[`Result`](index.md#result)\<`NewValue`, `E`\>

###### Deprecated

Use `t-result` library instead.

##### ~~mapOkAndErr()~~

```ts
mapOkAndErr: <NewValue, NewError>(mapFns) => Result<NewValue, NewError>;
```

Defined in: [packages/utils/src/tsResult.ts:37](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L37)

###### Type Parameters

###### NewValue

`NewValue`

###### NewError

`NewError` *extends* [`ResultValidErrors`](index.md#resultvaliderrors)

###### Parameters

###### mapFns

###### err

(`error`) => `NewError`

###### ok

(`value`) => `NewValue`

###### Returns

[`Result`](index.md#result)\<`NewValue`, `NewError`\>

###### Deprecated

Use `t-result` library instead.

##### ~~unwrap()~~

```ts
unwrap: () => T;
```

Defined in: [packages/utils/src/tsResult.ts:29](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L29)

###### Returns

`T`

###### Deprecated

Use `t-result` library instead.

##### ~~unwrapOr()~~

```ts
unwrapOr: <R>(defaultValue) => T | R;
```

Defined in: [packages/utils/src/tsResult.ts:27](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L27)

###### Type Parameters

###### R

`R` *extends* `T`

###### Parameters

###### defaultValue

`R`

###### Returns

`T` \| `R`

###### Deprecated

Use `t-result` library instead.

##### ~~unwrapOrNull()~~

```ts
unwrapOrNull: () => T | null;
```

Defined in: [packages/utils/src/tsResult.ts:25](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L25)

###### Returns

`T` \| `null`

###### Deprecated

Use `t-result` library instead.

***

### ResultMethodsKeys

```ts
type ResultMethodsKeys = keyof ResultMethods<any, any>;
```

Defined in: [packages/utils/src/tsResult.ts:54](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L54)
