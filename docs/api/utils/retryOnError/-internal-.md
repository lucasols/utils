[@ls-stack/utils](../modules.md) / [retryOnError](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### RetryOptions

```ts
type RetryOptions = object;
```

Defined in: [packages/utils/src/retryOnError.ts:5](https://github.com/lucasols/utils/blob/main/packages/utils/src/retryOnError.ts#L5)

Configuration options for retryOnError function.

#### Properties

##### debugId?

```ts
optional debugId: string;
```

Defined in: [packages/utils/src/retryOnError.ts:17](https://github.com/lucasols/utils/blob/main/packages/utils/src/retryOnError.ts#L17)

Optional ID for debug logging

##### delayBetweenRetriesMs?

```ts
optional delayBetweenRetriesMs: number | (retry) => number;
```

Defined in: [packages/utils/src/retryOnError.ts:7](https://github.com/lucasols/utils/blob/main/packages/utils/src/retryOnError.ts#L7)

Delay between retries in milliseconds or function returning delay

##### disableRetries?

```ts
optional disableRetries: boolean;
```

Defined in: [packages/utils/src/retryOnError.ts:19](https://github.com/lucasols/utils/blob/main/packages/utils/src/retryOnError.ts#L19)

Disable retries

##### onRetry()?

```ts
optional onRetry: (error, lastAttempt) => void;
```

Defined in: [packages/utils/src/retryOnError.ts:21](https://github.com/lucasols/utils/blob/main/packages/utils/src/retryOnError.ts#L21)

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

Defined in: [packages/utils/src/retryOnError.ts:12](https://github.com/lucasols/utils/blob/main/packages/utils/src/retryOnError.ts#L12)

Function to determine if retry should happen, receives error and duration
of last attempt

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
