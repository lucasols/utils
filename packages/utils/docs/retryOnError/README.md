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

Defined in: [packages/utils/src/retryOnError.ts:38](https://github.com/lucasols/utils/blob/main/packages/utils/src/retryOnError.ts#L38)

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

##### originalMaxRetries

`number` = `maxRetries`

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
