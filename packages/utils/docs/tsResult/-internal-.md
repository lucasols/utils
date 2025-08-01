[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / [tsResult](README.md) / \<internal\>

# \<internal\>

## Type Aliases

### AnyResultMethods

```ts
type AnyResultMethods = Record<ResultMethodsKeys, never>;
```

Defined in: [packages/utils/src/tsResult.ts:10](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L10)

***

### Err\<E\>

```ts
type Err<E> = object & AnyResultMethods;
```

Defined in: [packages/utils/src/tsResult.ts:20](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L20)

#### Type declaration

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

`E` *extends* [`ResultValidErrors`](README.md#resultvaliderrors)

***

### Ok\<T\>

```ts
type Ok<T> = object & AnyResultMethods;
```

Defined in: [packages/utils/src/tsResult.ts:4](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L4)

#### Type declaration

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

Defined in: [packages/utils/src/tsResult.ts:27](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L27)

#### Type Parameters

##### T

`T`

##### E

`E` *extends* [`ResultValidErrors`](README.md#resultvaliderrors)

#### Properties

##### ~~ifErr()~~

```ts
ifErr: (fn) => Result<T, E>;
```

Defined in: [packages/utils/src/tsResult.ts:48](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L48)

###### Parameters

###### fn

(`error`) => `void`

###### Returns

[`Result`](README.md#result)\<`T`, `E`\>

###### Deprecated

Use `t-result` library instead.

##### ~~ifOk()~~

```ts
ifOk: (fn) => Result<T, E>;
```

Defined in: [packages/utils/src/tsResult.ts:46](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L46)

###### Parameters

###### fn

(`value`) => `void`

###### Returns

[`Result`](README.md#result)\<`T`, `E`\>

###### Deprecated

Use `t-result` library instead.

##### ~~mapErr()~~

```ts
mapErr: <NewError>(mapFn) => Result<T, NewError>;
```

Defined in: [packages/utils/src/tsResult.ts:37](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L37)

###### Type Parameters

###### NewError

`NewError` *extends* [`ResultValidErrors`](README.md#resultvaliderrors)

###### Parameters

###### mapFn

(`error`) => `NewError`

###### Returns

[`Result`](README.md#result)\<`T`, `NewError`\>

###### Deprecated

Use `t-result` library instead.

##### ~~mapOk()~~

```ts
mapOk: <NewValue>(mapFn) => Result<NewValue, E>;
```

Defined in: [packages/utils/src/tsResult.ts:35](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L35)

###### Type Parameters

###### NewValue

`NewValue`

###### Parameters

###### mapFn

(`value`) => `NewValue`

###### Returns

[`Result`](README.md#result)\<`NewValue`, `E`\>

###### Deprecated

Use `t-result` library instead.

##### ~~mapOkAndErr()~~

```ts
mapOkAndErr: <NewValue, NewError>(mapFns) => Result<NewValue, NewError>;
```

Defined in: [packages/utils/src/tsResult.ts:41](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L41)

###### Type Parameters

###### NewValue

`NewValue`

###### NewError

`NewError` *extends* [`ResultValidErrors`](README.md#resultvaliderrors)

###### Parameters

###### mapFns

###### err

(`error`) => `NewError`

###### ok

(`value`) => `NewValue`

###### Returns

[`Result`](README.md#result)\<`NewValue`, `NewError`\>

###### Deprecated

Use `t-result` library instead.

##### ~~unwrap()~~

```ts
unwrap: () => T;
```

Defined in: [packages/utils/src/tsResult.ts:33](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L33)

###### Returns

`T`

###### Deprecated

Use `t-result` library instead.

##### ~~unwrapOr()~~

```ts
unwrapOr: <R>(defaultValue) => T | R;
```

Defined in: [packages/utils/src/tsResult.ts:31](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L31)

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

Defined in: [packages/utils/src/tsResult.ts:29](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L29)

###### Returns

`T` \| `null`

###### Deprecated

Use `t-result` library instead.

***

### ResultMethodsKeys

```ts
type ResultMethodsKeys = keyof ResultMethods<any, any>;
```

Defined in: [packages/utils/src/tsResult.ts:58](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L58)
