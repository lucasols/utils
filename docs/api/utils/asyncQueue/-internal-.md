[@ls-stack/utils](../modules.md) / [asyncQueue](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### AddOptions\<I, T, E\>

```ts
type AddOptions<I, T, E> = object;
```

Defined in: [packages/utils/src/asyncQueue.ts:94](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L94)

Options for adding individual tasks to the queue

#### Type Parameters

##### I

`I`

##### T

`T`

##### E

`E` *extends* `ResultValidErrors`

#### Properties

##### meta?

```ts
optional meta: I;
```

Defined in: [packages/utils/src/asyncQueue.ts:100](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L100)

Metadata to associate with this task

##### onComplete()?

```ts
optional onComplete: (value) => void;
```

Defined in: [packages/utils/src/asyncQueue.ts:102](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L102)

Callback invoked when task completes successfully

###### Parameters

###### value

`T`

###### Returns

`void`

##### onError()?

```ts
optional onError: (error) => void;
```

Defined in: [packages/utils/src/asyncQueue.ts:104](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L104)

Callback invoked when task fails

###### Parameters

###### error

`E` | `Error`

###### Returns

`void`

##### signal?

```ts
optional signal: AbortSignal;
```

Defined in: [packages/utils/src/asyncQueue.ts:96](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L96)

AbortSignal to cancel this specific task

##### timeout?

```ts
optional timeout: number;
```

Defined in: [packages/utils/src/asyncQueue.ts:98](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L98)

Timeout for this specific task in milliseconds

***

### AddOptionsWithId\<I, T, E\>

```ts
type AddOptionsWithId<I, T, E> = Omit<AddOptions<I, T, E>, "meta"> & object;
```

Defined in: [packages/utils/src/asyncQueue.ts:922](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L922)

AddOptions variant that requires metadata to be provided

#### Type declaration

##### meta

```ts
meta: I;
```

#### Type Parameters

##### I

`I`

##### T

`T`

##### E

`E` *extends* `ResultValidErrors`

***

### AsyncQueueOptions

```ts
type AsyncQueueOptions = object;
```

Defined in: [packages/utils/src/asyncQueue.ts:76](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L76)

Configuration options for AsyncQueue initialization

#### Properties

##### autoStart?

```ts
optional autoStart: boolean;
```

Defined in: [packages/utils/src/asyncQueue.ts:88](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L88)

Start processing tasks immediately when added (default: true)

##### concurrency?

```ts
optional concurrency: number;
```

Defined in: [packages/utils/src/asyncQueue.ts:78](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L78)

Maximum number of tasks to run concurrently (default: 1)

##### rateLimit?

```ts
optional rateLimit: RateLimit;
```

Defined in: [packages/utils/src/asyncQueue.ts:90](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L90)

Rate limit configuration to limit tasks per time interval

##### rejectPendingOnError?

```ts
optional rejectPendingOnError: boolean;
```

Defined in: [packages/utils/src/asyncQueue.ts:86](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L86)

Reject all pending tasks when stopping on error (default: false)

##### signal?

```ts
optional signal: AbortSignal;
```

Defined in: [packages/utils/src/asyncQueue.ts:80](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L80)

AbortSignal to cancel the entire queue

##### stopOnError?

```ts
optional stopOnError: boolean;
```

Defined in: [packages/utils/src/asyncQueue.ts:84](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L84)

Stop processing new tasks when any task fails (default: false)

##### timeout?

```ts
optional timeout: number;
```

Defined in: [packages/utils/src/asyncQueue.ts:82](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L82)

Default timeout for all tasks in milliseconds

***

### RateLimit

```ts
type RateLimit = object;
```

Defined in: [packages/utils/src/asyncQueue.ts:68](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L68)

Configuration for rate limiting task execution

#### Properties

##### interval

```ts
interval: DurationObj | number;
```

Defined in: [packages/utils/src/asyncQueue.ts:72](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L72)

Time interval in milliseconds or as a duration object

##### maxTasks

```ts
maxTasks: number;
```

Defined in: [packages/utils/src/asyncQueue.ts:70](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L70)

Maximum number of tasks to execute within the interval

***

### RunCtx\<I\>

```ts
type RunCtx<I> = object;
```

Defined in: [packages/utils/src/asyncQueue.ts:108](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L108)

Runtime context passed to task functions

#### Type Parameters

##### I

`I`

#### Properties

##### meta?

```ts
optional meta: I;
```

Defined in: [packages/utils/src/asyncQueue.ts:112](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L112)

Metadata associated with this task

##### signal?

```ts
optional signal: AbortSignal;
```

Defined in: [packages/utils/src/asyncQueue.ts:110](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L110)

Combined AbortSignal from task, queue, and timeout signals
