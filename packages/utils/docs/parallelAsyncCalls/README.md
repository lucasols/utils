[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / parallelAsyncCalls

# parallelAsyncCalls

## Modules

- [\<internal\>](-internal-.md)

## Functions

### ~~parallelAsyncCalls()~~

```ts
function parallelAsyncCalls<M, R>(): ParallelAsyncResultCalls<M, R>;
```

Defined in: [packages/utils/src/parallelAsyncCalls.ts:214](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L214)

Executes multiple asynchronous calls in parallel and collects the results in a easier to use format.

#### Type Parameters

##### M

`M` *extends* `undefined` \| [`ValidMetadata`](-internal-.md#validmetadata) = `undefined`

The type of the call metadata.

##### R

`R` = `unknown`

The type of the result value.

#### Returns

[`ParallelAsyncResultCalls`](-internal-.md#parallelasyncresultcalls)\<`M`, `R`\>

#### Deprecated

Use concurrentAsyncCalls instead.
