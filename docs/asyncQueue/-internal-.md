[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / [asyncQueue](README.md) / \<internal\>

# \<internal\>

## Classes

### AsyncQueue\<T, E, I\>

Defined in: [src/asyncQueue.ts:39](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L39)

#### Extended by

- [`AsyncQueueWithMeta`](#asyncqueuewithmeta)

#### Type Parameters

##### T

`T`

##### E

`E` *extends* `ResultValidErrors` = `Error`

##### I

`I` = `unknown`

#### Constructors

##### Constructor

```ts
new AsyncQueue<T, E, I>(__namedParameters): AsyncQueue<T, E, I>;
```

Defined in: [src/asyncQueue.ts:57](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L57)

###### Parameters

###### \_\_namedParameters

[`AsyncQueueOptions`](#asyncqueueoptions) = `{}`

###### Returns

[`AsyncQueue`](#asyncqueue)\<`T`, `E`, `I`\>

#### Properties

##### completions

```ts
completions: object[] = [];
```

Defined in: [src/asyncQueue.ts:55](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L55)

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

Defined in: [src/asyncQueue.ts:47](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L47)

##### failures

```ts
failures: object[] = [];
```

Defined in: [src/asyncQueue.ts:54](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L54)

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

Defined in: [src/asyncQueue.ts:282](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L282)

###### Returns

`number`

##### failed

###### Get Signature

```ts
get failed(): number;
```

Defined in: [src/asyncQueue.ts:286](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L286)

###### Returns

`number`

##### pending

###### Get Signature

```ts
get pending(): number;
```

Defined in: [src/asyncQueue.ts:290](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L290)

###### Returns

`number`

##### size

###### Get Signature

```ts
get size(): number;
```

Defined in: [src/asyncQueue.ts:294](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L294)

###### Returns

`number`

#### Methods

##### add()

```ts
add(fn, options?): Promise<Result<T, Error | E>>;
```

Defined in: [src/asyncQueue.ts:80](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L80)

###### Parameters

###### fn

(`ctx`) => `Result`\<`T`, `E`\> \| `Promise`\<`Result`\<`T`, `E`\>\>

###### options?

[`AddOptions`](#addoptions)\<`I`, `T`, `E`\>

###### Returns

`Promise`\<`Result`\<`T`, `Error` \| `E`\>\>

##### clear()

```ts
clear(): void;
```

Defined in: [src/asyncQueue.ts:272](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L272)

###### Returns

`void`

##### onIdle()

```ts
onIdle(): Promise<void>;
```

Defined in: [src/asyncQueue.ts:263](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L263)

###### Returns

`Promise`\<`void`\>

##### resultifyAdd()

```ts
resultifyAdd(fn, options?): Promise<Result<T, Error | E>>;
```

Defined in: [src/asyncQueue.ts:121](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L121)

###### Parameters

###### fn

(`ctx`) => `T` \| `Promise`\<`T`\>

###### options?

[`AddOptions`](#addoptions)\<`I`, `T`, `E`\>

###### Returns

`Promise`\<`Result`\<`T`, `Error` \| `E`\>\>

***

### AsyncQueueWithMeta\<T, I, E\>

Defined in: [src/asyncQueue.ts:304](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L304)

#### Extends

- [`AsyncQueue`](#asyncqueue)\<`T`, `E`, `I`\>

#### Type Parameters

##### T

`T`

##### I

`I`

##### E

`E` *extends* `ResultValidErrors` = `Error`

#### Constructors

##### Constructor

```ts
new AsyncQueueWithMeta<T, I, E>(options?): AsyncQueueWithMeta<T, I, E>;
```

Defined in: [src/asyncQueue.ts:309](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L309)

###### Parameters

###### options?

[`AsyncQueueOptions`](#asyncqueueoptions)

###### Returns

[`AsyncQueueWithMeta`](#asyncqueuewithmeta)\<`T`, `I`, `E`\>

###### Overrides

[`AsyncQueue`](#asyncqueue).[`constructor`](#constructor)

#### Properties

##### completions

```ts
completions: object[] = [];
```

Defined in: [src/asyncQueue.ts:55](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L55)

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

Defined in: [src/asyncQueue.ts:47](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L47)

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`events`](#events)

##### failures

```ts
failures: object[] = [];
```

Defined in: [src/asyncQueue.ts:54](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L54)

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

Defined in: [src/asyncQueue.ts:282](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L282)

###### Returns

`number`

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`completed`](#completed)

##### failed

###### Get Signature

```ts
get failed(): number;
```

Defined in: [src/asyncQueue.ts:286](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L286)

###### Returns

`number`

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`failed`](#failed)

##### pending

###### Get Signature

```ts
get pending(): number;
```

Defined in: [src/asyncQueue.ts:290](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L290)

###### Returns

`number`

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`pending`](#pending)

##### size

###### Get Signature

```ts
get size(): number;
```

Defined in: [src/asyncQueue.ts:294](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L294)

###### Returns

`number`

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`size`](#size)

#### Methods

##### add()

```ts
add(fn, options): Promise<Result<T, Error | E>>;
```

Defined in: [src/asyncQueue.ts:313](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L313)

###### Parameters

###### fn

(`ctx`) => `Result`\<`T`, `E`\> \| `Promise`\<`Result`\<`T`, `E`\>\>

###### options

[`AddOptionsWithId`](#addoptionswithid)\<`I`, `T`, `E`\>

###### Returns

`Promise`\<`Result`\<`T`, `Error` \| `E`\>\>

###### Overrides

[`AsyncQueue`](#asyncqueue).[`add`](#add)

##### clear()

```ts
clear(): void;
```

Defined in: [src/asyncQueue.ts:272](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L272)

###### Returns

`void`

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`clear`](#clear)

##### onIdle()

```ts
onIdle(): Promise<void>;
```

Defined in: [src/asyncQueue.ts:263](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L263)

###### Returns

`Promise`\<`void`\>

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`onIdle`](#onidle)

##### resultifyAdd()

```ts
resultifyAdd(fn, options): Promise<Result<T, Error | E>>;
```

Defined in: [src/asyncQueue.ts:320](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L320)

###### Parameters

###### fn

(`ctx`) => `T` \| `Promise`\<`T`\>

###### options

[`AddOptionsWithId`](#addoptionswithid)\<`I`, `T`, `E`\>

###### Returns

`Promise`\<`Result`\<`T`, `Error` \| `E`\>\>

###### Overrides

[`AsyncQueue`](#asyncqueue).[`resultifyAdd`](#resultifyadd)

## Type Aliases

### AddOptions\<I, T, E\>

```ts
type AddOptions<I, T, E> = object;
```

Defined in: [src/asyncQueue.ts:17](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L17)

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

Defined in: [src/asyncQueue.ts:20](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L20)

##### onComplete()?

```ts
optional onComplete: (value) => void;
```

Defined in: [src/asyncQueue.ts:21](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L21)

###### Parameters

###### value

`T`

###### Returns

`void`

##### onError()?

```ts
optional onError: (error) => void;
```

Defined in: [src/asyncQueue.ts:22](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L22)

###### Parameters

###### error

`E` | `Error`

###### Returns

`void`

##### signal?

```ts
optional signal: AbortSignal;
```

Defined in: [src/asyncQueue.ts:18](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L18)

##### timeout?

```ts
optional timeout: number;
```

Defined in: [src/asyncQueue.ts:19](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L19)

***

### AddOptionsWithId\<I, T, E\>

```ts
type AddOptionsWithId<I, T, E> = Omit<AddOptions<I, T, E>, "meta"> & object;
```

Defined in: [src/asyncQueue.ts:299](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L299)

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

Defined in: [src/asyncQueue.ts:11](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L11)

#### Properties

##### concurrency?

```ts
optional concurrency: number;
```

Defined in: [src/asyncQueue.ts:12](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L12)

##### signal?

```ts
optional signal: AbortSignal;
```

Defined in: [src/asyncQueue.ts:13](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L13)

##### timeout?

```ts
optional timeout: number;
```

Defined in: [src/asyncQueue.ts:14](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L14)

***

### RunCtx\<I\>

```ts
type RunCtx<I> = object;
```

Defined in: [src/asyncQueue.ts:25](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L25)

#### Type Parameters

##### I

`I`

#### Properties

##### meta?

```ts
optional meta: I;
```

Defined in: [src/asyncQueue.ts:27](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L27)

##### signal?

```ts
optional signal: AbortSignal;
```

Defined in: [src/asyncQueue.ts:26](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L26)

***

### Task\<T, E, I\>

```ts
type Task<T, E, I> = object;
```

Defined in: [src/asyncQueue.ts:30](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L30)

#### Type Parameters

##### T

`T`

##### E

`E` *extends* `ResultValidErrors`

##### I

`I`

#### Properties

##### meta

```ts
meta: I;
```

Defined in: [src/asyncQueue.ts:35](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L35)

##### reject()

```ts
reject: (reason?) => void;
```

Defined in: [src/asyncQueue.ts:33](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L33)

###### Parameters

###### reason?

`Result`\<`T`, `E`\>

###### Returns

`void`

##### resolve()

```ts
resolve: (value) => void;
```

Defined in: [src/asyncQueue.ts:32](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L32)

###### Parameters

###### value

`Result`\<`T`, `E` \| `Error`\>

###### Returns

`void`

##### run()

```ts
run: (ctx) => Promise<Result<T, E>>;
```

Defined in: [src/asyncQueue.ts:31](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L31)

###### Parameters

###### ctx

[`RunCtx`](#runctx)\<`I`\>

###### Returns

`Promise`\<`Result`\<`T`, `E`\>\>

##### signal

```ts
signal: AbortSignal | undefined;
```

Defined in: [src/asyncQueue.ts:34](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L34)

##### timeout

```ts
timeout: number | undefined;
```

Defined in: [src/asyncQueue.ts:36](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L36)
