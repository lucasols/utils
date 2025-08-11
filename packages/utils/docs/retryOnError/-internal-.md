[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / [retryOnError](README.md) / \<internal\>

# \<internal\>

## Type Aliases

### RetryOptions

```ts
type RetryOptions = object;
```

Defined in: [packages/utils/src/retryOnError.ts:7](https://github.com/lucasols/utils/blob/main/packages/utils/src/retryOnError.ts#L7)

Configuration options for retryOnError function.

#### Properties

##### debugId?

```ts
optional debugId: string;
```

Defined in: [packages/utils/src/retryOnError.ts:16](https://github.com/lucasols/utils/blob/main/packages/utils/src/retryOnError.ts#L16)

Optional ID for debug logging

##### delayBetweenRetriesMs?

```ts
optional delayBetweenRetriesMs: number | (retry) => number;
```

Defined in: [packages/utils/src/retryOnError.ts:9](https://github.com/lucasols/utils/blob/main/packages/utils/src/retryOnError.ts#L9)

Delay between retries in milliseconds or function returning delay

##### disableRetries?

```ts
optional disableRetries: boolean;
```

Defined in: [packages/utils/src/retryOnError.ts:18](https://github.com/lucasols/utils/blob/main/packages/utils/src/retryOnError.ts#L18)

Disable retries

##### onRetry()?

```ts
optional onRetry: (error, lastAttempt) => void;
```

Defined in: [packages/utils/src/retryOnError.ts:20](https://github.com/lucasols/utils/blob/main/packages/utils/src/retryOnError.ts#L20)

Function to call when retry happens

###### Parameters

###### error

`Error`

###### lastAttempt

###### duration

`number`

###### retry

`number`

###### Returns

`void`

##### retryCondition()?

```ts
optional retryCondition: (error, lastAttempt) => boolean;
```

Defined in: [packages/utils/src/retryOnError.ts:11](https://github.com/lucasols/utils/blob/main/packages/utils/src/retryOnError.ts#L11)

Function to determine if retry should happen, receives error and duration of last attempt

###### Parameters

###### error

`Error`

###### lastAttempt

###### duration

`number`

###### retry

`number`

###### Returns

`boolean`
