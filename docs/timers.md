[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / timers

# timers

## Type Aliases

### CleanupTimer()

```ts
type CleanupTimer = () => void;
```

Defined in: [src/timers.ts:1](https://github.com/lucasols/utils/blob/main/src/timers.ts#L1)

#### Returns

`void`

## Functions

### createDebouncedTimeout()

```ts
function createDebouncedTimeout(ms, callback): object;
```

Defined in: [src/timers.ts:94](https://github.com/lucasols/utils/blob/main/src/timers.ts#L94)

Creates a timeout that prevents concurrent executions.

Each call to the `call` function will cancel any previous pending timeout
and start a new one. This is useful for debouncing or ensuring only the
last call executes after a delay.

#### Parameters

##### ms

`number`

The timeout duration in milliseconds

##### callback

() => `void`

The function to execute when the timeout completes

#### Returns

`object`

An object with `call` to trigger the timeout and `clean` to cancel it

##### call()

```ts
call: () => void;
```

###### Returns

`void`

##### clean

```ts
clean: CleanupTimer;
```

#### Example

```typescript
const { call, clean } = createDebouncedTimeout(1000, () => {
  console.log('Only the last call executes');
});

call(); // This will be cancelled
call(); // This will be cancelled
call(); // Only this one will execute after 1000ms

// Or cancel all pending timeouts
clean();
```

***

### createInterval()

```ts
function createInterval(ms, callback): CleanupTimer;
```

Defined in: [src/timers.ts:56](https://github.com/lucasols/utils/blob/main/src/timers.ts#L56)

Creates an interval with automatic cleanup capability.

Returns a cleanup function that can be called to cancel the interval.
The cleanup function is idempotent - calling it multiple times is safe.

#### Parameters

##### ms

`number`

The interval duration in milliseconds

##### callback

() => `void`

The function to execute on each interval tick

#### Returns

[`CleanupTimer`](#cleanuptimer)

A cleanup function that cancels the interval when called

#### Example

```typescript
const cleanup = createInterval(1000, () => {
  console.log('Interval tick');
});

// Stop the interval
cleanup();
```

***

### createTimeout()

```ts
function createTimeout(ms, callback): CleanupTimer;
```

Defined in: [src/timers.ts:23](https://github.com/lucasols/utils/blob/main/src/timers.ts#L23)

Creates a timeout with automatic cleanup capability.

Returns a cleanup function that can be called to cancel the timeout.
The cleanup function is idempotent - calling it multiple times is safe.

#### Parameters

##### ms

`number`

The timeout duration in milliseconds

##### callback

() => `void`

The function to execute when the timeout completes

#### Returns

[`CleanupTimer`](#cleanuptimer)

A cleanup function that cancels the timeout when called

#### Example

```typescript
const cleanup = createTimeout(1000, () => {
  console.log('Timeout completed');
});

// Cancel the timeout before it completes
cleanup();
```

***

### createWaitUntil()

```ts
function createWaitUntil<T>(options): CleanupTimer;
```

Defined in: [src/timers.ts:144](https://github.com/lucasols/utils/blob/main/src/timers.ts#L144)

Creates a timeout that waits for a condition to become true.

Polls the condition function at regular intervals until it returns a truthy value,
then calls the callback with that value. If the condition doesn't become true
within the maximum wait time, the timeout expires without calling the callback.

#### Type Parameters

##### T

`T` *extends* `object`

The type of value returned by the condition function when true

#### Parameters

##### options

Configuration options

###### callback

(`value`) => `void`

Function to call when the condition becomes true

###### checkIntervalMs?

`number` = `20`

How often to check the condition in milliseconds (default: 20)

###### condition

() => `false` \| `T`

Function that returns false or a truthy value when the condition is met

###### maxWaitMs

`number`

Maximum time to wait for the condition in milliseconds

#### Returns

[`CleanupTimer`](#cleanuptimer)

A cleanup function that cancels the condition timeout

#### Example

```typescript
const cleanup = createWaitUntil({
  condition: () => document.getElementById('myElement'),
  maxWaitMs: 5000,
  callback: (element) => {
    console.log('Element found:', element);
  },
  checkIntervalMs: 50
});

// Cancel the condition check
cleanup();
```
