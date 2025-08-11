[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / concurrentCalls

# concurrentCalls

## Modules

- [\<internal\>](-internal-.md)

## Classes

### ConcurrentCallsAggregateError

Defined in: [packages/utils/src/concurrentCalls.ts:32](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L32)

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

Defined in: [packages/utils/src/concurrentCalls.ts:37](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L37)

###### Parameters

###### errors

`Error`[]

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
errors: Error[] = [];
```

Defined in: [packages/utils/src/concurrentCalls.ts:33](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L33)

###### Overrides

```ts
AggregateError.errors
```

##### failed

```ts
failed: number = 0;
```

Defined in: [packages/utils/src/concurrentCalls.ts:35](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L35)

##### total

```ts
total: number = 0;
```

Defined in: [packages/utils/src/concurrentCalls.ts:34](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L34)

***

### ConcurrentCallsWithMetadataAggregateError\<M\>

Defined in: [packages/utils/src/concurrentCalls.ts:50](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L50)

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

Defined in: [packages/utils/src/concurrentCalls.ts:58](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L58)

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
errors: Error[] = [];
```

Defined in: [packages/utils/src/concurrentCalls.ts:53](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L53)

###### Overrides

```ts
AggregateError.errors
```

##### errorsWithMetadata

```ts
errorsWithMetadata: object[] = [];
```

Defined in: [packages/utils/src/concurrentCalls.ts:54](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L54)

###### error

```ts
error: Error;
```

###### metadata

```ts
metadata: M;
```

##### failed

```ts
failed: number = 0;
```

Defined in: [packages/utils/src/concurrentCalls.ts:56](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L56)

##### total

```ts
total: number = 0;
```

Defined in: [packages/utils/src/concurrentCalls.ts:55](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L55)

## Functions

### concurrentCalls()

```ts
function concurrentCalls<R>(): ConcurrentCalls<R, Error>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:246](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L246)

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

Defined in: [packages/utils/src/concurrentCalls.ts:435](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L435)

Executes multiple asynchronous calls concurrently and collects the results in a easier to use format.

#### Type Parameters

##### M

`M` *extends* [`ValidMetadata`](-internal-.md#validmetadata)

The type of the call metadata.

##### R

`R` = `unknown`

The type of the result value.

#### Returns

[`ConcurrentCallsWithMetadata`](-internal-.md#concurrentcallswithmetadata)\<`M`, `R`, `Error`\>
