[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / concurrentCalls

# concurrentCalls

## Modules

- [\<internal\>](-internal-.md)

## Functions

### concurrentCalls()

```ts
function concurrentCalls<R>(): ConcurrentCalls<R, Error>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:180](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L180)

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

Defined in: [packages/utils/src/concurrentCalls.ts:373](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L373)

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
