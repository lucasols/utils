[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / [retryOnError](README.md) / \<internal\>

# \<internal\>

## Type Aliases

### RetryOptions

```ts
type RetryOptions = object;
```

Defined in: [packages/utils/src/retryOnError.ts:6](https://github.com/lucasols/utils/blob/main/packages/utils/src/retryOnError.ts#L6)

Configuration options for retryOnError function.

#### Properties

##### debugId?

```ts
optional debugId: string;
```

Defined in: [packages/utils/src/retryOnError.ts:15](https://github.com/lucasols/utils/blob/main/packages/utils/src/retryOnError.ts#L15)

Optional ID for debug logging

##### delayBetweenRetriesMs?

```ts
optional delayBetweenRetriesMs: number | (retry) => number;
```

Defined in: [packages/utils/src/retryOnError.ts:8](https://github.com/lucasols/utils/blob/main/packages/utils/src/retryOnError.ts#L8)

Delay between retries in milliseconds or function returning delay

##### retryCondition()?

```ts
optional retryCondition: (error, lastAttempt) => boolean;
```

Defined in: [packages/utils/src/retryOnError.ts:10](https://github.com/lucasols/utils/blob/main/packages/utils/src/retryOnError.ts#L10)

Function to determine if retry should happen, receives error and duration of last attempt

###### Parameters

###### error

`unknown`

###### lastAttempt

###### duration

`number`

###### retry

`number`

###### Returns

`boolean`
