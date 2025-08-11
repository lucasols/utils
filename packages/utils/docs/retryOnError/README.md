[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / retryOnError

# retryOnError

## Modules

- [\<internal\>](-internal-.md)

## Functions

### retryOnError()

```ts
function retryOnError<T>(
   fn, 
   maxRetries, 
   options, 
   retry, 
originalMaxRetries): Promise<T>;
```

Defined in: [packages/utils/src/retryOnError.ts:41](https://github.com/lucasols/utils/blob/main/packages/utils/src/retryOnError.ts#L41)

Retries a function on error with configurable retry logic.

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

(`ctx`) => `Promise`\<`T`\>

Function to retry that receives context with retry count

##### maxRetries

`number`

Maximum number of retries

##### options

[`RetryOptions`](-internal-.md#retryoptions) = `{}`

Configuration options

##### retry

`number` = `0`

internal use only

##### originalMaxRetries

`number` = `maxRetries`

internal use only

#### Returns

`Promise`\<`T`\>

Promise resolving to the function result or rejecting with the final error

#### Example

```ts
await retryOnError(
  async (ctx) => {
    console.log(`Attempt ${ctx.retry + 1}`);
    return await fetchData();
  },
  3,
  { delayBetweenRetriesMs: 1000 }
);
```

***

### retryResultOnError()

```ts
function retryResultOnError<T, E>(
   fn, 
   maxRetries, 
   options, 
   __retry, 
__originalMaxRetries): Promise<Result<T, E>>;
```

Defined in: [packages/utils/src/retryOnError.ts:116](https://github.com/lucasols/utils/blob/main/packages/utils/src/retryOnError.ts#L116)

Retries a result function on error with configurable retry logic.

#### Type Parameters

##### T

`T`

##### E

`E` *extends* `ResultValidErrors`

#### Parameters

##### fn

(`ctx`) => `Promise`\<`Result`\<`T`, `E`\>\>

Function to retry that receives context with retry count

##### maxRetries

`number`

Maximum number of retries

##### options

Configuration options

###### debugId?

`string`

###### delayBetweenRetriesMs?

`number` \| (`retry`) => `number`

###### disableRetries?

`boolean`

###### retryCondition?

(`error`, `lastAttempt`) => `boolean`

##### \_\_retry

`number` = `0`

internal use only

##### \_\_originalMaxRetries

`number` = `maxRetries`

internal use only

#### Returns

`Promise`\<`Result`\<`T`, `E`\>\>

Promise resolving to the function result or rejecting with the final error
