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

#### Type Declaration

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

## Functions

### add()

```ts
function add(fn, options?): Promise<Result<T, Error | E>>;
```

Defined in: [packages/utils/src/asyncQueue.ts:404](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L404)

Add a task that returns a Result to the queue

Use this method when your task function already returns a Result type. For
functions that throw errors or return plain values, use `resultifyAdd`
instead.

#### Parameters

##### fn

(`ctx`) => `Result`\<`T`, `E`\> \| `Promise`\<`Result`\<`T`, `E`\>\>

Task function that returns a Result

##### options?

[`AddOptions`](#addoptions)\<`I`, `T`, `E`\>

Optional configuration for this task

#### Returns

`Promise`\<`Result`\<`T`, `Error` \| `E`\>\>

Promise that resolves with the task result

#### Example

```typescript
  const queue = createAsyncQueue<string>();

  const result = await queue.add(async () => {
    try {
      const data = await fetchData();
      return Result.ok(data);
    } catch (error) {
      return Result.err(error);
    }
  });

  if (result.ok) {
    console.log('Success:', result.value);
  } else {
    console.log('Error:', result.error);
  }
  ```;

***

### clear()

```ts
function clear(): void;
```

Defined in: [packages/utils/src/asyncQueue.ts:775](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L775)

Clear all queued tasks (does not affect currently running tasks)

This removes all tasks waiting in the queue but allows currently executing
tasks to complete normally.

#### Returns

`void`

#### Example

```typescript
  const queue = createAsyncQueue({ concurrency: 1 });

  // Add multiple tasks
  queue.resultifyAdd(async () => longRunningTask()); // Will start immediately
  queue.resultifyAdd(async () => task2()); // Queued
  queue.resultifyAdd(async () => task3()); // Queued

  // Clear remaining queued tasks
  queue.clear();

  // Only the first task will complete
  await queue.onIdle();
  ```;

***

### onIdle()

```ts
function onIdle(): Promise<void>;
```

Defined in: [packages/utils/src/asyncQueue.ts:719](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L719)

Wait for the queue to become idle (no pending tasks, no queued tasks, and
no rate-limit timers)

This method resolves when:

- All tasks have completed (success or failure)
- The queue is stopped due to error (stopOnError), even with remaining tasks
- There are no queued tasks, no running tasks, and no pending rate-limit
  timers

#### Returns

`Promise`\<`void`\>

Promise that resolves when the queue is idle

#### Example

```typescript
  const queue = createAsyncQueue<string>();

  // Add multiple tasks
  for (let i = 0; i < 10; i++) {
  queue.resultifyAdd(async () => `task ${i}`);
  }

  // Wait for all tasks to complete
  await queue.onIdle();

  console.log(`Completed: ${queue.completed}, Failed: ${queue.failed}`);
  ```

***

### onSizeLessThan()

```ts
function onSizeLessThan(limit): Promise<void>;
```

Defined in: [packages/utils/src/asyncQueue.ts:744](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L744)

Wait until the queued task count is below a limit

Resolves immediately if `size < limit` at the moment of calling. This only
considers queued (not yet started) tasks; running tasks are tracked by
`pending`.

#### Parameters

##### limit

`number`

Threshold that `size` must be below to resolve

#### Returns

`Promise`\<`void`\>

***

### pause()

```ts
function pause(): void;
```

Defined in: [packages/utils/src/asyncQueue.ts:854](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L854)

Pause processing new tasks (currently running tasks continue)

#### Returns

`void`

#### Example

```typescript
  const queue = createAsyncQueue();

  // Start some tasks
  queue.resultifyAdd(async () => longRunningTask1());
  queue.resultifyAdd(async () => longRunningTask2());

  // Pause before more tasks are picked up
  queue.pause();

  // Later, resume processing
  queue.resume();
  ```;

***

### reset()

```ts
function reset(): void;
```

Defined in: [packages/utils/src/asyncQueue.ts:891](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L891)

Reset the queue after being stopped, allowing new tasks to be processed

This clears the stopped state and error reason, and resumes processing any
remaining queued tasks if autoStart was enabled.

#### Returns

`void`

#### Example

```typescript
  const queue = createAsyncQueue({ stopOnError: true });

  // Add tasks that will cause the queue to stop
  queue.resultifyAdd(async () => { throw new Error('fail'); });
  queue.resultifyAdd(async () => 'remaining task');

  await queue.onIdle();

  if (queue.isStopped) {
  console.log(`Queue stopped, ${queue.size} tasks remaining`);

  // Reset and process remaining tasks
  queue.reset();
  await queue.onIdle();
  }
  ```

***

### resultifyAdd()

```ts
function resultifyAdd(fn, options?): Promise<Result<T, Error | E>>;
```

Defined in: [packages/utils/src/asyncQueue.ts:494](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L494)

Add a task that returns a plain value or throws errors to the queue

This is the most commonly used method. It automatically wraps your function
to handle errors and convert them to Result types.

#### Parameters

##### fn

(`ctx`) => `T` \| `Promise`\<`T`\>

Task function that returns a value or throws

##### options?

[`AddOptions`](#addoptions)\<`I`, `T`, `E`\>

Optional configuration for this task

#### Returns

`Promise`\<`Result`\<`T`, `Error` \| `E`\>\>

Promise that resolves with the task result wrapped in Result

#### Examples

Basic Usage
  ```typescript
  const queue = createAsyncQueue<string>();

  queue.resultifyAdd(async () => {
  const response = await fetch('/api/data');
  return response.json();
  }).then(result => {
  if (result.ok) {
  console.log('Data:', result.value);
  } else {
  console.error('Failed:', result.error);
  }
  });
  ```

With Callbacks
  ```typescript
  queue.resultifyAdd(
  async () => processData(),
  {
  onComplete: (data) => console.log('Processed:', data),
  onError: (error) => console.error('Failed:', error),
  timeout: 5000
  }
  );
  ```

***

### resume()

```ts
function resume(): void;
```

Defined in: [packages/utils/src/asyncQueue.ts:859](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L859)

Resume processing tasks after pause

#### Returns

`void`

***

### start()

```ts
function start(): void;
```

Defined in: [packages/utils/src/asyncQueue.ts:828](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L828)

Manually start processing tasks (only needed if autoStart: false)

#### Returns

`void`

#### Example

```typescript
  const queue = createAsyncQueue({ autoStart: false });

  // Add tasks without starting processing
  queue.resultifyAdd(async () => 'task1');
  queue.resultifyAdd(async () => 'task2');

  // Start processing when ready
  queue.start();
  await queue.onIdle();
  ```;
