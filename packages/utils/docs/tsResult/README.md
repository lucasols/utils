[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / tsResult

# tsResult

## Modules

- [\<internal\>](-internal-.md)

## Type Aliases

### ~~GetTypedResult\<R\>~~

```ts
type GetTypedResult<R> = TypedResult<R extends Result<infer T, any> ? T : never, R extends Result<any, infer E> ? E : never>;
```

Defined in: [packages/utils/src/tsResult.ts:328](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L328)

#### Type Parameters

##### R

`R` *extends* [`Result`](#result)\<`any`, `any`\>

#### Deprecated

Use `t-result` library instead.

***

### ~~Result\<T, E\>~~

```ts
type Result<T, E> = 
  | Omit<Ok<T>, ResultMethodsKeys>
| Omit<Err<E>, ResultMethodsKeys> & ResultMethods<T, E>;
```

Defined in: [packages/utils/src/tsResult.ts:52](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L52)

#### Type Parameters

##### T

`T`

##### E

`E` *extends* [`ResultValidErrors`](#resultvaliderrors) = `Error`

#### Deprecated

Use `t-result` library instead.

***

### ~~ResultValidErrors~~

```ts
type ResultValidErrors = 
  | Error
  | Record<string, unknown>
  | unknown[]
  | readonly unknown[]
  | true;
```

Defined in: [packages/utils/src/tsResult.ts:13](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L13)

#### Deprecated

Use `t-result` library instead.

***

### ~~TypedResult\<T, E\>~~

```ts
type TypedResult<T, E> = object;
```

Defined in: [packages/utils/src/tsResult.ts:318](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L318)

#### Deprecated

Use `t-result` library instead.

#### Type Parameters

##### T

`T`

##### E

`E` *extends* [`ResultValidErrors`](#resultvaliderrors) = `Error`

#### Properties

##### ~~\_type~~

```ts
_type: Result<T, E>;
```

Defined in: [packages/utils/src/tsResult.ts:324](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L324)

###### Deprecated

Use `t-result` library instead.

##### ~~err()~~

```ts
err: (error) => Err<E>;
```

Defined in: [packages/utils/src/tsResult.ts:322](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L322)

###### Parameters

###### error

`E`

###### Returns

[`Err`](-internal-.md#err)\<`E`\>

###### Deprecated

Use `t-result` library instead.

##### ~~ok()~~

```ts
ok: (value) => Ok<T>;
```

Defined in: [packages/utils/src/tsResult.ts:320](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L320)

###### Parameters

###### value

`T`

###### Returns

[`Ok`](-internal-.md#ok)\<`T`\>

###### Deprecated

Use `t-result` library instead.

## Variables

### ~~Result~~

```ts
Result: object;
```

Defined in: [packages/utils/src/tsResult.ts:52](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L52)

#### Type declaration

##### ~~asyncMap()~~

```ts
asyncMap: <T, E>(resultPromise) => object;
```

###### Type Parameters

###### T

`T`

###### E

`E` *extends* [`ResultValidErrors`](#resultvaliderrors)

###### Parameters

###### resultPromise

`Promise`\<[`Result`](#result)\<`T`, `E`\>\>

###### Returns

`object`

###### ~~err()~~

```ts
err: <NewError>(mapFn) => Promise<Result<T, NewError>>;
```

###### Type Parameters

###### NewError

`NewError` *extends* [`ResultValidErrors`](#resultvaliderrors)

###### Parameters

###### mapFn

(`error`) => `NewError`

###### Returns

`Promise`\<[`Result`](#result)\<`T`, `NewError`\>\>

###### ~~ok()~~

```ts
ok: <NewValue>(mapFn) => Promise<Result<NewValue, E>>;
```

###### Type Parameters

###### NewValue

`NewValue`

###### Parameters

###### mapFn

(`value`) => `NewValue`

###### Returns

`Promise`\<[`Result`](#result)\<`NewValue`, `E`\>\>

###### ~~okAndErr()~~

```ts
okAndErr: <NewValue, NewError>(__namedParameters) => Promise<Result<NewValue, NewError>>;
```

###### Type Parameters

###### NewValue

`NewValue`

###### NewError

`NewError` *extends* [`ResultValidErrors`](#resultvaliderrors)

###### Parameters

###### \_\_namedParameters

###### err

(`error`) => `NewError`

###### ok

(`value`) => `NewValue`

###### Returns

`Promise`\<[`Result`](#result)\<`NewValue`, `NewError`\>\>

##### ~~asyncUnwrap()~~

```ts
asyncUnwrap: <T>(result) => Promise<T>;
```

Unwraps a promise result

###### Type Parameters

###### T

`T`

###### Parameters

###### result

`Promise`\<[`Result`](#result)\<`T`, [`ResultValidErrors`](#resultvaliderrors)\>\>

###### Returns

`Promise`\<`T`\>

##### ~~err()~~

```ts
err: <E>(error) => Err<E>;
```

###### Type Parameters

###### E

`E` *extends* [`ResultValidErrors`](#resultvaliderrors)

###### Parameters

###### error

`E`

###### Returns

[`Err`](-internal-.md#err)\<`E`\>

###### Deprecated

Use `t-result` library instead.

##### ~~getOkErr()~~

```ts
getOkErr: {
<F>  (): TypedResult<Awaited<ReturnType<F>> extends Result<T, any> ? T : never, Awaited<ReturnType<F>> extends Result<any, E> ? E : never>;
<F>  (): TypedResult<ReturnType<F> extends Result<T, any> ? T : never, ReturnType<F> extends Result<any, E> ? E : never>;
<R>  (): TypedResult<R extends Result<T, any> ? T : never, R extends Result<any, E> ? E : never>;
<T, E>  (): TypedResult<T, E>;
};
```

###### Call Signature

```ts
<F>(): TypedResult<Awaited<ReturnType<F>> extends Result<T, any> ? T : never, Awaited<ReturnType<F>> extends Result<any, E> ? E : never>;
```

###### Type Parameters

###### F

`F` *extends* (...`args`) => `Promise`\<[`Result`](#result)\<`any`, `any`\>\>

###### Returns

[`TypedResult`](#typedresult)\<`Awaited`\<`ReturnType`\<`F`\>\> *extends* [`Result`](#result)\<`T`, `any`\> ? `T` : `never`, `Awaited`\<`ReturnType`\<`F`\>\> *extends* [`Result`](#result)\<`any`, `E`\> ? `E` : `never`\>

###### Call Signature

```ts
<F>(): TypedResult<ReturnType<F> extends Result<T, any> ? T : never, ReturnType<F> extends Result<any, E> ? E : never>;
```

###### Type Parameters

###### F

`F` *extends* (...`args`) => [`Result`](#result)\<`any`, `any`\>

###### Returns

[`TypedResult`](#typedresult)\<`ReturnType`\<`F`\> *extends* [`Result`](#result)\<`T`, `any`\> ? `T` : `never`, `ReturnType`\<`F`\> *extends* [`Result`](#result)\<`any`, `E`\> ? `E` : `never`\>

###### Call Signature

```ts
<R>(): TypedResult<R extends Result<T, any> ? T : never, R extends Result<any, E> ? E : never>;
```

###### Type Parameters

###### R

`R` *extends* [`Result`](#result)\<`any`, `any`\>

###### Returns

[`TypedResult`](#typedresult)\<`R` *extends* [`Result`](#result)\<`T`, `any`\> ? `T` : `never`, `R` *extends* [`Result`](#result)\<`any`, `E`\> ? `E` : `never`\>

###### Call Signature

```ts
<T, E>(): TypedResult<T, E>;
```

###### Type Parameters

###### T

`T`

###### E

`E` *extends* [`ResultValidErrors`](#resultvaliderrors) = `Error`

###### Returns

[`TypedResult`](#typedresult)\<`T`, `E`\>

##### ~~ok()~~

```ts
ok: {
  (): Ok<void>;
<T>  (value): Ok<T>;
};
```

###### Call Signature

```ts
(): Ok<void>;
```

###### Returns

[`Ok`](-internal-.md#ok)\<`void`\>

###### Deprecated

Use `t-result` library instead.

###### Call Signature

```ts
<T>(value): Ok<T>;
```

###### Type Parameters

###### T

`T`

###### Parameters

###### value

`T`

###### Returns

[`Ok`](-internal-.md#ok)\<`T`\>

###### Deprecated

Use `t-result` library instead.

##### ~~unknownToError()~~

```ts
unknownToError: (error) => Err<Error> = unknownToResultError;
```

###### Parameters

###### error

`unknown`

###### Returns

[`Err`](-internal-.md#err)\<`Error`\>

#### Deprecated

Use `t-result` library instead.

## Functions

### ~~err()~~

```ts
function err<E>(error): Err<E>;
```

Defined in: [packages/utils/src/tsResult.ts:149](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L149)

#### Type Parameters

##### E

`E` *extends* [`ResultValidErrors`](#resultvaliderrors)

#### Parameters

##### error

`E`

#### Returns

[`Err`](-internal-.md#err)\<`E`\>

#### Deprecated

Use `t-result` library instead.

***

### ~~ok()~~

#### Deprecated

Use `t-result` library instead.

#### Call Signature

```ts
function ok(): Ok<void>;
```

Defined in: [packages/utils/src/tsResult.ts:124](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L124)

##### Returns

[`Ok`](-internal-.md#ok)\<`void`\>

##### Deprecated

Use `t-result` library instead.

##### Deprecated

Use `t-result` library instead.

#### Call Signature

```ts
function ok<T>(value): Ok<T>;
```

Defined in: [packages/utils/src/tsResult.ts:126](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L126)

##### Type Parameters

###### T

`T`

##### Parameters

###### value

`T`

##### Returns

[`Ok`](-internal-.md#ok)\<`T`\>

##### Deprecated

Use `t-result` library instead.

##### Deprecated

Use `t-result` library instead.

***

### ~~resultify()~~

#### Call Signature

```ts
function resultify<T, E>(fn, errorNormalizer?): Result<T, E>;
```

Defined in: [packages/utils/src/tsResult.ts:238](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L238)

##### Type Parameters

###### T

`T`

###### E

`E` *extends* [`ResultValidErrors`](#resultvaliderrors) = `Error`

##### Parameters

###### fn

() => `T` *extends* `Promise`\<`any`\> ? `never` : `T`

###### errorNormalizer?

(`err`) => `E`

##### Returns

[`Result`](#result)\<`T`, `E`\>

##### Deprecated

Use `t-result` library instead.

#### Call Signature

```ts
function resultify<T, E>(fn, errorNormalizer?): Promise<Result<Awaited<T>, E>>;
```

Defined in: [packages/utils/src/tsResult.ts:243](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L243)

##### Type Parameters

###### T

`T`

###### E

`E` *extends* [`ResultValidErrors`](#resultvaliderrors) = `Error`

##### Parameters

###### fn

() => `Promise`\<`T`\>

###### errorNormalizer?

(`err`) => `E`

##### Returns

`Promise`\<[`Result`](#result)\<`Awaited`\<`T`\>, `E`\>\>

##### Deprecated

Use `t-result` library instead.

#### Call Signature

```ts
function resultify<T, E>(fn, errorNormalizer?): Promise<Result<T, E>>;
```

Defined in: [packages/utils/src/tsResult.ts:248](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L248)

##### Type Parameters

###### T

`T`

###### E

`E` *extends* [`ResultValidErrors`](#resultvaliderrors) = `Error`

##### Parameters

###### fn

`Promise`\<`T`\>

###### errorNormalizer?

(`err`) => `E`

##### Returns

`Promise`\<[`Result`](#result)\<`T`, `E`\>\>

##### Deprecated

Use `t-result` library instead.

***

### ~~unknownToError()~~

```ts
function unknownToError(error): Error;
```

Defined in: [packages/utils/src/tsResult.ts:296](https://github.com/lucasols/utils/blob/main/packages/utils/src/tsResult.ts#L296)

#### Parameters

##### error

`unknown`

#### Returns

`Error`

#### Deprecated

Use `t-result` library instead.
