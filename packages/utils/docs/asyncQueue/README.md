[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / asyncQueue

# asyncQueue

## Modules

- [\<internal\>](-internal-.md)

## Classes

### AsyncQueue\<T, E, I\>

Defined in: [packages/utils/src/asyncQueue.ts:202](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L202)

A powerful async task queue with advanced error handling and flow control

#### Examples

```typescript
const queue = createAsyncQueue<string>({ concurrency: 2 });

const processedItems: string[] = [];

queue.resultifyAdd(async () => {
  await delay(100);
  return 'task completed';
}).then(result => {
  if (result.ok) processedItems.push(result.value);
});

await queue.onIdle();
console.log('Processed:', processedItems);
```

```typescript
const queue = createAsyncQueue<string>({
  stopOnError: true,
  rejectPendingOnError: false
});

// Add batch of tasks
const items = ['item1', 'item2', 'bad-item', 'item3'];
items.forEach(item => {
  queue.resultifyAdd(async () => {
    if (item === 'bad-item') throw new Error('Processing failed');
    return item.toUpperCase();
  });
});

await queue.onIdle();

if (queue.isStopped) {
  console.log(`Stopped at ${queue.failed} failures, ${queue.size} remaining`);
  // Reset and continue with remaining tasks
  queue.reset();
  await queue.onIdle();
}
```

```typescript
const queue = createAsyncQueue<string>({ autoStart: false });

// Prepare all tasks without starting
queue.resultifyAdd(() => processTask1());
queue.resultifyAdd(() => processTask2());
queue.resultifyAdd(() => processTask3());

// Start processing when ready
queue.start();
await queue.onIdle();
```

#### Extended by

- [`AsyncQueueWithMeta`](#asyncqueuewithmeta)

#### Type Parameters

##### T

`T`

The type of value returned by successful tasks

##### E

`E` *extends* `ResultValidErrors` = `Error`

The type of errors that tasks can produce (defaults to Error)

##### I

`I` = `unknown`

The type of metadata associated with tasks (defaults to unknown)

#### Constructors

##### Constructor

```ts
new AsyncQueue<T, E, I>(__namedParameters): AsyncQueue<T, E, I>;
```

Defined in: [packages/utils/src/asyncQueue.ts:257](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L257)

###### Parameters

###### \_\_namedParameters

[`AsyncQueueOptions`](-internal-.md#asyncqueueoptions) = `{}`

###### Returns

[`AsyncQueue`](#asyncqueue)\<`T`, `E`, `I`\>

#### Properties

##### completions

```ts
completions: object[] = [];
```

Defined in: [packages/utils/src/asyncQueue.ts:255](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L255)

Array of all task completions with metadata for debugging and analysis

###### meta

```ts
meta: I;
```

###### value

```ts
value: T;
```

##### events

```ts
events: Emitter<{
  complete: {
     meta: I;
     value: T;
  };
  error: {
     error: Error | E;
     meta: I;
  };
  start: {
     meta: I;
  };
}>;
```

Defined in: [packages/utils/src/asyncQueue.ts:231](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L231)

Event emitter for tracking task lifecycle

###### Example

```typescript
const queue = createAsyncQueue<string>();

queue.events.on('start', (event) => {
  console.log('Task started:', event.payload.meta);
});

queue.events.on('complete', (event) => {
  console.log('Task completed:', event.payload.value);
});

queue.events.on('error', (event) => {
  console.error('Task failed:', event.payload.error);
});
```

##### failures

```ts
failures: object[] = [];
```

Defined in: [packages/utils/src/asyncQueue.ts:252](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L252)

Array of all task failures with metadata for debugging and analysis

###### error

```ts
error: Error | E;
```

###### meta

```ts
meta: I;
```

#### Accessors

##### completed

###### Get Signature

```ts
get completed(): number;
```

Defined in: [packages/utils/src/asyncQueue.ts:785](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L785)

Number of tasks that have completed successfully

###### Returns

`number`

##### failed

###### Get Signature

```ts
get failed(): number;
```

Defined in: [packages/utils/src/asyncQueue.ts:790](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L790)

Number of tasks that have failed

###### Returns

`number`

##### isPaused

###### Get Signature

```ts
get isPaused(): boolean;
```

Defined in: [packages/utils/src/asyncQueue.ts:900](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L900)

Whether the queue is currently paused

###### Returns

`boolean`

##### isStarted

###### Get Signature

```ts
get isStarted(): boolean;
```

Defined in: [packages/utils/src/asyncQueue.ts:905](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L905)

Whether the queue has been started (relevant for autoStart: false)

###### Returns

`boolean`

##### isStopped

###### Get Signature

```ts
get isStopped(): boolean;
```

Defined in: [packages/utils/src/asyncQueue.ts:895](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L895)

Whether the queue is stopped due to an error

###### Returns

`boolean`

##### pending

###### Get Signature

```ts
get pending(): number;
```

Defined in: [packages/utils/src/asyncQueue.ts:795](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L795)

Number of tasks currently being processed

###### Returns

`number`

##### size

###### Get Signature

```ts
get size(): number;
```

Defined in: [packages/utils/src/asyncQueue.ts:800](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L800)

Number of tasks waiting in the queue to be processed

###### Returns

`number`

##### stoppedReason

###### Get Signature

```ts
get stoppedReason(): undefined | Error;
```

Defined in: [packages/utils/src/asyncQueue.ts:910](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L910)

The error that caused the queue to stop (if any)

###### Returns

`undefined` \| `Error`

#### Methods

##### add()

```ts
add(fn, options?): Promise<Result<T, Error | E>>;
```

Defined in: [packages/utils/src/asyncQueue.ts:401](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L401)

Add a task that returns a Result to the queue

Use this method when your task function already returns a Result type.
For functions that throw errors or return plain values, use `resultifyAdd` instead.

###### Parameters

###### fn

(`ctx`) => `Result`\<`T`, `E`\> \| `Promise`\<`Result`\<`T`, `E`\>\>

Task function that returns a Result

###### options?

[`AddOptions`](-internal-.md#addoptions)\<`I`, `T`, `E`\>

Optional configuration for this task

###### Returns

`Promise`\<`Result`\<`T`, `Error` \| `E`\>\>

Promise that resolves with the task result

###### Example

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
```

##### clear()

```ts
clear(): void;
```

Defined in: [packages/utils/src/asyncQueue.ts:767](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L767)

Clear all queued tasks (does not affect currently running tasks)

This removes all tasks waiting in the queue but allows currently
executing tasks to complete normally.

###### Returns

`void`

###### Example

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
```

##### onIdle()

```ts
onIdle(): Promise<void>;
```

Defined in: [packages/utils/src/asyncQueue.ts:711](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L711)

Wait for the queue to become idle (no pending tasks, no queued tasks, and no rate-limit timers)

This method resolves when:
- All tasks have completed (success or failure)
- The queue is stopped due to error (stopOnError), even with remaining tasks
- There are no queued tasks, no running tasks, and no pending rate-limit timers

###### Returns

`Promise`\<`void`\>

Promise that resolves when the queue is idle

###### Example

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

##### onSizeLessThan()

```ts
onSizeLessThan(limit): Promise<void>;
```

Defined in: [packages/utils/src/asyncQueue.ts:736](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L736)

Wait until the queued task count is below a limit

Resolves immediately if `size < limit` at the moment of calling. This only
considers queued (not yet started) tasks; running tasks are tracked by
`pending`.

###### Parameters

###### limit

`number`

Threshold that `size` must be below to resolve

###### Returns

`Promise`\<`void`\>

##### pause()

```ts
pause(): void;
```

Defined in: [packages/utils/src/asyncQueue.ts:846](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L846)

Pause processing new tasks (currently running tasks continue)

###### Returns

`void`

###### Example

```typescript
const queue = createAsyncQueue();

// Start some tasks
queue.resultifyAdd(async () => longRunningTask1());
queue.resultifyAdd(async () => longRunningTask2());

// Pause before more tasks are picked up
queue.pause();

// Later, resume processing
queue.resume();
```

##### reset()

```ts
reset(): void;
```

Defined in: [packages/utils/src/asyncQueue.ts:885](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L885)

Reset the queue after being stopped, allowing new tasks to be processed

This clears the stopped state and error reason, and resumes processing
any remaining queued tasks if autoStart was enabled.

###### Returns

`void`

###### Example

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

##### resultifyAdd()

```ts
resultifyAdd(fn, options?): Promise<Result<T, Error | E>>;
```

Defined in: [packages/utils/src/asyncQueue.ts:489](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L489)

Add a task that returns a plain value or throws errors to the queue

This is the most commonly used method. It automatically wraps your function
to handle errors and convert them to Result types.

###### Parameters

###### fn

(`ctx`) => `T` \| `Promise`\<`T`\>

Task function that returns a value or throws

###### options?

[`AddOptions`](-internal-.md#addoptions)\<`I`, `T`, `E`\>

Optional configuration for this task

###### Returns

`Promise`\<`Result`\<`T`, `Error` \| `E`\>\>

Promise that resolves with the task result wrapped in Result

###### Examples

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

##### resume()

```ts
resume(): void;
```

Defined in: [packages/utils/src/asyncQueue.ts:853](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L853)

Resume processing tasks after pause

###### Returns

`void`

##### start()

```ts
start(): void;
```

Defined in: [packages/utils/src/asyncQueue.ts:820](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L820)

Manually start processing tasks (only needed if autoStart: false)

###### Returns

`void`

###### Example

```typescript
const queue = createAsyncQueue({ autoStart: false });

// Add tasks without starting processing
queue.resultifyAdd(async () => 'task1');
queue.resultifyAdd(async () => 'task2');

// Start processing when ready
queue.start();
await queue.onIdle();
```

***

### AsyncQueueWithMeta\<T, I, E\>

Defined in: [packages/utils/src/asyncQueue.ts:953](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L953)

AsyncQueue variant that requires metadata for all tasks

This class enforces that every task must include metadata, which is useful
when you need to track or identify tasks consistently.

#### Example

```typescript
interface TaskMeta {
  id: string;
  priority: number;
}

const queue = createAsyncQueueWithMeta<string, TaskMeta>({ concurrency: 2 });

queue.resultifyAdd(
  async () => processImportantTask(),
  { meta: { id: 'task-1', priority: 1 } }
);

// Listen to events with metadata
queue.events.on('complete', (event) => {
  console.log(`Task ${event.payload.meta.id} completed`);
});
```

#### Extends

- [`AsyncQueue`](#asyncqueue)\<`T`, `E`, `I`\>

#### Type Parameters

##### T

`T`

The type of value returned by successful tasks

##### I

`I`

The type of metadata (required for all tasks)

##### E

`E` *extends* `ResultValidErrors` = `Error`

The type of errors that tasks can produce

#### Constructors

##### Constructor

```ts
new AsyncQueueWithMeta<T, I, E>(options?): AsyncQueueWithMeta<T, I, E>;
```

Defined in: [packages/utils/src/asyncQueue.ts:958](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L958)

###### Parameters

###### options?

[`AsyncQueueOptions`](-internal-.md#asyncqueueoptions)

###### Returns

[`AsyncQueueWithMeta`](#asyncqueuewithmeta)\<`T`, `I`, `E`\>

###### Overrides

[`AsyncQueue`](#asyncqueue).[`constructor`](#constructor)

#### Properties

##### completions

```ts
completions: object[] = [];
```

Defined in: [packages/utils/src/asyncQueue.ts:255](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L255)

Array of all task completions with metadata for debugging and analysis

###### meta

```ts
meta: I;
```

###### value

```ts
value: T;
```

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`completions`](#completions)

##### events

```ts
events: Emitter<{
  complete: {
     meta: I;
     value: T;
  };
  error: {
     error: Error | E;
     meta: I;
  };
  start: {
     meta: I;
  };
}>;
```

Defined in: [packages/utils/src/asyncQueue.ts:231](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L231)

Event emitter for tracking task lifecycle

###### Example

```typescript
const queue = createAsyncQueue<string>();

queue.events.on('start', (event) => {
  console.log('Task started:', event.payload.meta);
});

queue.events.on('complete', (event) => {
  console.log('Task completed:', event.payload.value);
});

queue.events.on('error', (event) => {
  console.error('Task failed:', event.payload.error);
});
```

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`events`](#events)

##### failures

```ts
failures: object[] = [];
```

Defined in: [packages/utils/src/asyncQueue.ts:252](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L252)

Array of all task failures with metadata for debugging and analysis

###### error

```ts
error: Error | E;
```

###### meta

```ts
meta: I;
```

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`failures`](#failures)

#### Accessors

##### completed

###### Get Signature

```ts
get completed(): number;
```

Defined in: [packages/utils/src/asyncQueue.ts:785](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L785)

Number of tasks that have completed successfully

###### Returns

`number`

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`completed`](#completed)

##### failed

###### Get Signature

```ts
get failed(): number;
```

Defined in: [packages/utils/src/asyncQueue.ts:790](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L790)

Number of tasks that have failed

###### Returns

`number`

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`failed`](#failed)

##### isPaused

###### Get Signature

```ts
get isPaused(): boolean;
```

Defined in: [packages/utils/src/asyncQueue.ts:900](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L900)

Whether the queue is currently paused

###### Returns

`boolean`

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`isPaused`](#ispaused)

##### isStarted

###### Get Signature

```ts
get isStarted(): boolean;
```

Defined in: [packages/utils/src/asyncQueue.ts:905](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L905)

Whether the queue has been started (relevant for autoStart: false)

###### Returns

`boolean`

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`isStarted`](#isstarted)

##### isStopped

###### Get Signature

```ts
get isStopped(): boolean;
```

Defined in: [packages/utils/src/asyncQueue.ts:895](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L895)

Whether the queue is stopped due to an error

###### Returns

`boolean`

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`isStopped`](#isstopped)

##### pending

###### Get Signature

```ts
get pending(): number;
```

Defined in: [packages/utils/src/asyncQueue.ts:795](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L795)

Number of tasks currently being processed

###### Returns

`number`

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`pending`](#pending)

##### size

###### Get Signature

```ts
get size(): number;
```

Defined in: [packages/utils/src/asyncQueue.ts:800](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L800)

Number of tasks waiting in the queue to be processed

###### Returns

`number`

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`size`](#size)

##### stoppedReason

###### Get Signature

```ts
get stoppedReason(): undefined | Error;
```

Defined in: [packages/utils/src/asyncQueue.ts:910](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L910)

The error that caused the queue to stop (if any)

###### Returns

`undefined` \| `Error`

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`stoppedReason`](#stoppedreason)

#### Methods

##### add()

```ts
add(fn, options): Promise<Result<T, Error | E>>;
```

Defined in: [packages/utils/src/asyncQueue.ts:962](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L962)

Add a task that returns a Result to the queue

Use this method when your task function already returns a Result type.
For functions that throw errors or return plain values, use `resultifyAdd` instead.

###### Parameters

###### fn

(`ctx`) => `Result`\<`T`, `E`\> \| `Promise`\<`Result`\<`T`, `E`\>\>

Task function that returns a Result

###### options

[`AddOptionsWithId`](-internal-.md#addoptionswithid)\<`I`, `T`, `E`\>

Optional configuration for this task

###### Returns

`Promise`\<`Result`\<`T`, `Error` \| `E`\>\>

Promise that resolves with the task result

###### Example

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
```

###### Overrides

[`AsyncQueue`](#asyncqueue).[`add`](#add)

##### clear()

```ts
clear(): void;
```

Defined in: [packages/utils/src/asyncQueue.ts:767](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L767)

Clear all queued tasks (does not affect currently running tasks)

This removes all tasks waiting in the queue but allows currently
executing tasks to complete normally.

###### Returns

`void`

###### Example

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
```

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`clear`](#clear)

##### onIdle()

```ts
onIdle(): Promise<void>;
```

Defined in: [packages/utils/src/asyncQueue.ts:711](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L711)

Wait for the queue to become idle (no pending tasks, no queued tasks, and no rate-limit timers)

This method resolves when:
- All tasks have completed (success or failure)
- The queue is stopped due to error (stopOnError), even with remaining tasks
- There are no queued tasks, no running tasks, and no pending rate-limit timers

###### Returns

`Promise`\<`void`\>

Promise that resolves when the queue is idle

###### Example

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

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`onIdle`](#onidle)

##### onSizeLessThan()

```ts
onSizeLessThan(limit): Promise<void>;
```

Defined in: [packages/utils/src/asyncQueue.ts:736](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L736)

Wait until the queued task count is below a limit

Resolves immediately if `size < limit` at the moment of calling. This only
considers queued (not yet started) tasks; running tasks are tracked by
`pending`.

###### Parameters

###### limit

`number`

Threshold that `size` must be below to resolve

###### Returns

`Promise`\<`void`\>

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`onSizeLessThan`](#onsizelessthan)

##### pause()

```ts
pause(): void;
```

Defined in: [packages/utils/src/asyncQueue.ts:846](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L846)

Pause processing new tasks (currently running tasks continue)

###### Returns

`void`

###### Example

```typescript
const queue = createAsyncQueue();

// Start some tasks
queue.resultifyAdd(async () => longRunningTask1());
queue.resultifyAdd(async () => longRunningTask2());

// Pause before more tasks are picked up
queue.pause();

// Later, resume processing
queue.resume();
```

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`pause`](#pause)

##### reset()

```ts
reset(): void;
```

Defined in: [packages/utils/src/asyncQueue.ts:885](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L885)

Reset the queue after being stopped, allowing new tasks to be processed

This clears the stopped state and error reason, and resumes processing
any remaining queued tasks if autoStart was enabled.

###### Returns

`void`

###### Example

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

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`reset`](#reset)

##### resultifyAdd()

```ts
resultifyAdd(fn, options): Promise<Result<T, Error | E>>;
```

Defined in: [packages/utils/src/asyncQueue.ts:969](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L969)

Add a task that returns a plain value or throws errors to the queue

This is the most commonly used method. It automatically wraps your function
to handle errors and convert them to Result types.

###### Parameters

###### fn

(`ctx`) => `T` \| `Promise`\<`T`\>

Task function that returns a value or throws

###### options

[`AddOptionsWithId`](-internal-.md#addoptionswithid)\<`I`, `T`, `E`\>

Optional configuration for this task

###### Returns

`Promise`\<`Result`\<`T`, `Error` \| `E`\>\>

Promise that resolves with the task result wrapped in Result

###### Examples

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

###### Overrides

[`AsyncQueue`](#asyncqueue).[`resultifyAdd`](#resultifyadd)

##### resume()

```ts
resume(): void;
```

Defined in: [packages/utils/src/asyncQueue.ts:853](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L853)

Resume processing tasks after pause

###### Returns

`void`

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`resume`](#resume)

##### start()

```ts
start(): void;
```

Defined in: [packages/utils/src/asyncQueue.ts:820](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L820)

Manually start processing tasks (only needed if autoStart: false)

###### Returns

`void`

###### Example

```typescript
const queue = createAsyncQueue({ autoStart: false });

// Add tasks without starting processing
queue.resultifyAdd(async () => 'task1');
queue.resultifyAdd(async () => 'task2');

// Start processing when ready
queue.start();
await queue.onIdle();
```

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`start`](#start)

## Functions

### createAsyncQueue()

```ts
function createAsyncQueue<T, E>(options?): AsyncQueue<T, E>;
```

Defined in: [packages/utils/src/asyncQueue.ts:1007](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L1007)

Create a new AsyncQueue instance

#### Type Parameters

##### T

`T`

The type of value returned by successful tasks

##### E

`E` *extends* `ResultValidErrors` = `Error`

The type of errors that tasks can produce (defaults to Error)

#### Parameters

##### options?

[`AsyncQueueOptions`](-internal-.md#asyncqueueoptions)

Configuration options for the queue

#### Returns

[`AsyncQueue`](#asyncqueue)\<`T`, `E`\>

A new AsyncQueue instance

#### Examples

```typescript
const queue = createAsyncQueue<string>({ concurrency: 3 });
```

```typescript
const queue = createAsyncQueue<string>({
  concurrency: 2,
  stopOnError: true,
  rejectPendingOnError: true
});
```

```typescript
const queue = createAsyncQueue<string>({
  autoStart: false,
  concurrency: 1
});
```

***

### createAsyncQueueWithMeta()

```ts
function createAsyncQueueWithMeta<T, I, E>(options?): AsyncQueueWithMeta<T, I, E>;
```

Defined in: [packages/utils/src/asyncQueue.ts:1044](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L1044)

Create a new AsyncQueueWithMeta instance that requires metadata for all tasks

#### Type Parameters

##### T

`T`

The type of value returned by successful tasks

##### I

`I`

The type of metadata (required for all tasks)

##### E

`E` *extends* `ResultValidErrors` = `Error`

The type of errors that tasks can produce (defaults to Error)

#### Parameters

##### options?

[`AsyncQueueOptions`](-internal-.md#asyncqueueoptions)

Configuration options for the queue

#### Returns

[`AsyncQueueWithMeta`](#asyncqueuewithmeta)\<`T`, `I`, `E`\>

A new AsyncQueueWithMeta instance

#### Example

```typescript
interface TaskInfo {
  taskId: string;
  userId: string;
}

const queue = createAsyncQueueWithMeta<ProcessResult, TaskInfo>({
  concurrency: 5
});

queue.resultifyAdd(
  async (ctx) => {
    console.log(`Processing task ${ctx.meta.taskId} for user ${ctx.meta.userId}`);
    return await processUserTask(ctx.meta.userId);
  },
  { meta: { taskId: '123', userId: 'user456' } }
);
```
