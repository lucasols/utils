[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / retryOnError

# retryOnError

## Functions

### retryOnError()

```ts
function retryOnError<T>(
   fn, 
   maxRetries, 
   options, 
retry): Promise<T>;
```

Defined in: [src/retryOnError.ts:3](https://github.com/lucasols/utils/blob/main/src/retryOnError.ts#L3)

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

() => `Promise`\<`T`\>

##### maxRetries

`number`

##### options

###### debugId?

`string`

###### delayBetweenRetriesMs?

`number` \| (`retry`) => `number`

###### maxErrorDurationMs?

`number`

###### retryCondition?

(`error`) => 
  \| `boolean`
  \| \{
  `maxErrorDurationMs`: `number`;
\}

##### retry

`number` = `0`

#### Returns

`Promise`\<`T`\>
