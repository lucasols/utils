[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / concurrentCalls

# concurrentCalls

## Modules

- [\<internal\>](-internal-.md)

## Functions

### concurrentCalls()

```ts
function concurrentCalls<R, E>(): ConcurrentCalls<R, E>;
```

Defined in: [src/concurrentCalls.ts:180](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L180)

Executes multiple asynchronous calls concurrently and collects the results in a easier to use format.

#### Type Parameters

##### R

`R` = `unknown`

The type of the result value.

##### E

`E` *extends* `Error` = `Error`

The type of the error.

#### Returns

[`ConcurrentCalls`](-internal-.md#concurrentcalls)\<`R`, `E`\>

***

### concurrentCallsWithMetadata()

```ts
function concurrentCallsWithMetadata<M, R, E>(): ConcurrentCallsWithMetadata<M, R, E>;
```

Defined in: [src/concurrentCalls.ts:369](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L369)

Executes multiple asynchronous calls concurrently and collects the results in a easier to use format.

#### Type Parameters

##### M

`M` *extends* [`ValidMetadata`](-internal-.md#validmetadata)

The type of the call metadata.

##### R

`R` = `unknown`

The type of the result value.

##### E

`E` *extends* `Error` = `Error`

The type of the error from individual Result objects.

#### Returns

[`ConcurrentCallsWithMetadata`](-internal-.md#concurrentcallswithmetadata)\<`M`, `R`, `E`\>
