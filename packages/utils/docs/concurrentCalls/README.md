[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / concurrentCalls

# concurrentCalls

## Modules

- [\<internal\>](-internal-.md)

## Classes

### ConcurrentCallsAggregateError

Defined in: [packages/utils/src/concurrentCalls.ts:38](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L38)

#### Extends

- `AggregateError`

#### Constructors

##### Constructor

```ts
new ConcurrentCallsAggregateError(
   errors, 
   total, 
   failed): ConcurrentCallsAggregateError;
```

Defined in: [packages/utils/src/concurrentCalls.ts:43](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L43)

###### Parameters

###### errors

`ResultValidErrors`[]

###### total

`number`

###### failed

`number`

###### Returns

[`ConcurrentCallsAggregateError`](#concurrentcallsaggregateerror)

###### Overrides

```ts
AggregateError.constructor
```

#### Properties

##### errors

```ts
errors: ResultValidErrors[] = [];
```

Defined in: [packages/utils/src/concurrentCalls.ts:39](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L39)

###### Overrides

```ts
AggregateError.errors
```

##### failed

```ts
failed: number = 0;
```

Defined in: [packages/utils/src/concurrentCalls.ts:41](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L41)

##### total

```ts
total: number = 0;
```

Defined in: [packages/utils/src/concurrentCalls.ts:40](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L40)

***

### ConcurrentCallsWithMetadataAggregateError\<M\>

Defined in: [packages/utils/src/concurrentCalls.ts:62](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L62)

#### Extends

- `AggregateError`

#### Type Parameters

##### M

`M` *extends* [`ValidMetadata`](-internal-.md#validmetadata)

#### Constructors

##### Constructor

```ts
new ConcurrentCallsWithMetadataAggregateError<M>(
   errors, 
   total, 
failed): ConcurrentCallsWithMetadataAggregateError<M>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:70](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L70)

###### Parameters

###### errors

`object`[]

###### total

`number`

###### failed

`number`

###### Returns

[`ConcurrentCallsWithMetadataAggregateError`](#concurrentcallswithmetadataaggregateerror)\<`M`\>

###### Overrides

```ts
AggregateError.constructor
```

#### Properties

##### errors

```ts
errors: ResultValidErrors[] = [];
```

Defined in: [packages/utils/src/concurrentCalls.ts:65](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L65)

###### Overrides

```ts
AggregateError.errors
```

##### errorsWithMetadata

```ts
errorsWithMetadata: object[] = [];
```

Defined in: [packages/utils/src/concurrentCalls.ts:66](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L66)

###### error

```ts
error: ResultValidErrors;
```

###### metadata

```ts
metadata: M;
```

##### failed

```ts
failed: number = 0;
```

Defined in: [packages/utils/src/concurrentCalls.ts:68](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L68)

##### total

```ts
total: number = 0;
```

Defined in: [packages/utils/src/concurrentCalls.ts:67](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L67)

## Functions

### concurrentCalls()

```ts
function concurrentCalls<R>(): ConcurrentCalls<R, Error>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:273](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L273)

Executes multiple asynchronous calls concurrently and collects the results in a easier to use format.

#### Type Parameters

##### R

`R` = `unknown`

The type of the result value.

#### Returns

[`ConcurrentCalls`](-internal-.md#concurrentcalls)\<`R`, `Error`\>

***

### concurrentCallsWithMetadata()

```ts
function concurrentCallsWithMetadata<M, R>(): ConcurrentCallsWithMetadata<M, R, Error>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:472](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L472)

Executes multiple asynchronous calls concurrently with metadata for each call and collects the results in a easier to use format.

#### Type Parameters

##### M

`M` *extends* [`ValidMetadata`](-internal-.md#validmetadata)

The type of the call metadata.

##### R

`R` = `unknown`

The type of the result value.

#### Returns

[`ConcurrentCallsWithMetadata`](-internal-.md#concurrentcallswithmetadata)\<`M`, `R`, `Error`\>

***

### concurrentResultCalls()

```ts
function concurrentResultCalls<ResultFn>(): ConcurrentCalls<ValueFromResult<Awaited<ReturnType<ResultFn>>>, ErrorFromResult<Awaited<ReturnType<ResultFn>>>>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:487](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L487)

Executes multiple asynchronous result calls concurrently and collects the results in a easier to use format.

#### Type Parameters

##### ResultFn

`ResultFn` *extends* (...`args`) => `Promise`\<`Result`\<`unknown`, `ResultValidErrors`\>\>

#### Returns

[`ConcurrentCalls`](-internal-.md#concurrentcalls)\<[`ValueFromResult`](-internal-.md#valuefromresult)\<`Awaited`\<`ReturnType`\<`ResultFn`\>\>\>, [`ErrorFromResult`](-internal-.md#errorfromresult)\<`Awaited`\<`ReturnType`\<`ResultFn`\>\>\>\>

***

### concurrentResultsWithMetadata()

```ts
function concurrentResultsWithMetadata<M, ResultFn>(): ConcurrentCallsWithMetadata<M, ValueFromResult<Awaited<ReturnType<ResultFn>>>, ErrorFromResult<Awaited<ReturnType<ResultFn>>>>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:504](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L504)

Executes multiple asynchronous result calls concurrently with metadata for each call and collects the results in a easier to use format.

#### Type Parameters

##### M

`M` *extends* [`ValidMetadata`](-internal-.md#validmetadata)

##### ResultFn

`ResultFn` *extends* (...`args`) => `Promise`\<`Result`\<`unknown`, `ResultValidErrors`\>\>

The type of the result function that will be called.

#### Returns

[`ConcurrentCallsWithMetadata`](-internal-.md#concurrentcallswithmetadata)\<`M`, [`ValueFromResult`](-internal-.md#valuefromresult)\<`Awaited`\<`ReturnType`\<`ResultFn`\>\>\>, [`ErrorFromResult`](-internal-.md#errorfromresult)\<`Awaited`\<`ReturnType`\<`ResultFn`\>\>\>\>
