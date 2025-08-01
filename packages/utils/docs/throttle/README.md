[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / throttle

# throttle

## Modules

- [\<internal\>](-internal-.md)

## Functions

### createThrottledFunctionFactory()

```ts
function createThrottledFunctionFactory<T, R>(
   wait, 
   callback, 
   options?): object;
```

Defined in: [packages/utils/src/throttle.ts:104](https://github.com/lucasols/utils/blob/main/packages/utils/src/throttle.ts#L104)

Creates a factory for throttled functions that caches throttled instances based on function arguments.
Each unique set of arguments gets its own throttled function instance, allowing for fine-grained
throttling control per argument combination.

This is useful when you want to throttle calls to the same function but with different parameters
independently. For example, throttling API calls per user ID or throttling UI updates per component.

#### Type Parameters

##### T

`T` *extends* `undefined` \| `null` \| `string` \| `number` \| `boolean`

The type of arguments the callback function accepts

##### R

`R`

The return type of the callback function

#### Parameters

##### wait

`number`

The number of milliseconds to throttle invocations to

##### callback

(...`args`) => `R`

The function to throttle

##### options?

[`ThrottleSettings`](-internal-.md#throttlesettings)

The throttle options (leading/trailing behavior)

#### Returns

`object`

An object with a `call` method that accepts the callback arguments

##### call()

```ts
call: (...args) => undefined | R;
```

###### Parameters

###### args

...`T`[]

###### Returns

`undefined` \| `R`

#### Examples

```ts
const apiThrottle = createThrottledFunctionFactory(
  1000,
  (userId: string, action: string) => callAPI(userId, action)
);

// Each user gets their own throttled instance
apiThrottle.call('user1', 'update'); // Executes immediately
apiThrottle.call('user2', 'update'); // Executes immediately (different user)
apiThrottle.call('user1', 'update'); // Throttled (same user)
```

```ts
// Throttle UI updates per component
const updateThrottle = createThrottledFunctionFactory(
  100,
  (componentId: string, data: any) => updateComponent(componentId, data)
);
```

***

### throttle()

```ts
function throttle<T>(
   func, 
   wait, 
options?): DebouncedFunc<T>;
```

Defined in: [packages/utils/src/throttle.ts:51](https://github.com/lucasols/utils/blob/main/packages/utils/src/throttle.ts#L51)

Creates a throttled function that only invokes the provided function at most once per every `wait` milliseconds.
The throttled function comes with a `cancel` method to cancel delayed invocations and a `flush` method to immediately invoke them.

Throttling is useful for rate-limiting events that fire frequently, like scroll or resize handlers.
Unlike debouncing, throttling guarantees the function is called at regular intervals.

#### Type Parameters

##### T

`T` *extends* [`__LEGIT_ANY_FUNCTION__`](../saferTyping.md#__legit_any_function__)

The type of the function to throttle

#### Parameters

##### func

`T`

The function to throttle

##### wait

`number`

The number of milliseconds to throttle invocations to

##### options?

[`ThrottleSettings`](-internal-.md#throttlesettings)

The options object

#### Returns

[`DebouncedFunc`](../debounce.md#debouncedfunc)\<`T`\>

Returns the new throttled function

#### Examples

```ts
const throttledSave = throttle(saveData, 1000);

// Will only call saveData at most once per second
throttledSave();
throttledSave();
throttledSave();
```

```ts
// Only invoke on trailing edge
const throttledHandler = throttle(handleScroll, 100, { leading: false });
```
