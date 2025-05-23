[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / [asyncQueue](README.md) / \<internal\>

# \<internal\>

## Classes

### AsyncQueue\<T, E, I\>

Defined in: [src/asyncQueue.ts:38](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L38)

#### Extended by

- [`AsyncQueueWithId`](#asyncqueuewithid)

#### Type Parameters

##### T

`T`

##### E

`E` *extends* `ResultValidErrors` = `Error`

##### I

`I` = `undefined`

#### Constructors

##### Constructor

```ts
new AsyncQueue<T, E, I>(__namedParameters): AsyncQueue<T, E, I>;
```

Defined in: [src/asyncQueue.ts:54](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L54)

###### Parameters

###### \_\_namedParameters

[`AsyncQueueOptions`](#asyncqueueoptions) = `{}`

###### Returns

[`AsyncQueue`](#asyncqueue)\<`T`, `E`, `I`\>

#### Properties

##### events

```ts
events: Emitter<{
  complete: {
     id: I;
     value: T;
  };
  error: {
     error: Error | E;
     id: I;
  };
  start: {
     id: I;
  };
}>;
```

Defined in: [src/asyncQueue.ts:46](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L46)

#### Accessors

##### completed

###### Get Signature

```ts
get completed(): number;
```

Defined in: [src/asyncQueue.ts:251](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L251)

###### Returns

`number`

##### failed

###### Get Signature

```ts
get failed(): number;
```

Defined in: [src/asyncQueue.ts:255](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L255)

###### Returns

`number`

##### pending

###### Get Signature

```ts
get pending(): number;
```

Defined in: [src/asyncQueue.ts:259](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L259)

###### Returns

`number`

##### size

###### Get Signature

```ts
get size(): number;
```

Defined in: [src/asyncQueue.ts:263](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L263)

###### Returns

`number`

#### Methods

##### add()

```ts
add(fn, options?): Promise<Result<T, Error | E>>;
```

Defined in: [src/asyncQueue.ts:69](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L69)

###### Parameters

###### fn

`Promise`\<`Result`\<`T`, `E`\>\> | (`ctx`) => `Result`\<`T`, `E`\> \| `Promise`\<`Result`\<`T`, `E`\>\>

###### options?

[`AddOptions`](#addoptions)\<`I`\>

###### Returns

`Promise`\<`Result`\<`T`, `Error` \| `E`\>\>

##### clear()

```ts
clear(__namedParameters): void;
```

Defined in: [src/asyncQueue.ts:236](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L236)

###### Parameters

###### \_\_namedParameters

###### resetCounters?

`boolean` = `true`

###### Returns

`void`

##### onIdle()

```ts
onIdle(): Promise<void>;
```

Defined in: [src/asyncQueue.ts:227](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L227)

###### Returns

`Promise`\<`void`\>

##### resultifyAdd()

```ts
resultifyAdd(fn, options?): Promise<Result<T, Error | E>>;
```

Defined in: [src/asyncQueue.ts:98](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L98)

###### Parameters

###### fn

`Promise`\<`T`\> | (`ctx`) => `T` \| `Promise`\<`T`\>

###### options?

[`AddOptions`](#addoptions)\<`I`\>

###### Returns

`Promise`\<`Result`\<`T`, `Error` \| `E`\>\>

***

### AsyncQueueWithId\<T, I, E\>

Defined in: [src/asyncQueue.ts:270](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L270)

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
new AsyncQueueWithId<T, I, E>(options?): AsyncQueueWithId<T, I, E>;
```

Defined in: [src/asyncQueue.ts:275](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L275)

###### Parameters

###### options?

[`AsyncQueueOptions`](#asyncqueueoptions)

###### Returns

[`AsyncQueueWithId`](#asyncqueuewithid)\<`T`, `I`, `E`\>

###### Overrides

[`AsyncQueue`](#asyncqueue).[`constructor`](#constructor)

#### Properties

##### events

```ts
events: Emitter<{
  complete: {
     id: I;
     value: T;
  };
  error: {
     error: Error | E;
     id: I;
  };
  start: {
     id: I;
  };
}>;
```

Defined in: [src/asyncQueue.ts:46](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L46)

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`events`](#events)

#### Accessors

##### completed

###### Get Signature

```ts
get completed(): number;
```

Defined in: [src/asyncQueue.ts:251](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L251)

###### Returns

`number`

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`completed`](#completed)

##### failed

###### Get Signature

```ts
get failed(): number;
```

Defined in: [src/asyncQueue.ts:255](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L255)

###### Returns

`number`

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`failed`](#failed)

##### pending

###### Get Signature

```ts
get pending(): number;
```

Defined in: [src/asyncQueue.ts:259](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L259)

###### Returns

`number`

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`pending`](#pending)

##### size

###### Get Signature

```ts
get size(): number;
```

Defined in: [src/asyncQueue.ts:263](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L263)

###### Returns

`number`

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`size`](#size)

#### Methods

##### add()

```ts
add(fn, options?): Promise<Result<T, Error | E>>;
```

Defined in: [src/asyncQueue.ts:279](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L279)

###### Parameters

###### fn

(`ctx`) => `Result`\<`T`, `E`\> \| `Promise`\<`Result`\<`T`, `E`\>\> | `Promise`\<`Result`\<`T`, `E`\>\>

###### options?

[`AddOptionsWithId`](#addoptionswithid)\<`I`\>

###### Returns

`Promise`\<`Result`\<`T`, `Error` \| `E`\>\>

###### Overrides

[`AsyncQueue`](#asyncqueue).[`add`](#add)

##### clear()

```ts
clear(__namedParameters): void;
```

Defined in: [src/asyncQueue.ts:236](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L236)

###### Parameters

###### \_\_namedParameters

###### resetCounters?

`boolean` = `true`

###### Returns

`void`

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`clear`](#clear)

##### onIdle()

```ts
onIdle(): Promise<void>;
```

Defined in: [src/asyncQueue.ts:227](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L227)

###### Returns

`Promise`\<`void`\>

###### Inherited from

[`AsyncQueue`](#asyncqueue).[`onIdle`](#onidle)

##### resultifyAdd()

```ts
resultifyAdd(fn, options?): Promise<Result<T, Error | E>>;
```

Defined in: [src/asyncQueue.ts:288](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L288)

###### Parameters

###### fn

(`ctx`) => `T` \| `Promise`\<`T`\> | `Promise`\<`T`\>

###### options?

[`AddOptionsWithId`](#addoptionswithid)\<`I`\>

###### Returns

`Promise`\<`Result`\<`T`, `Error` \| `E`\>\>

###### Overrides

[`AsyncQueue`](#asyncqueue).[`resultifyAdd`](#resultifyadd)

## Type Aliases

### AddOptions\<I\>

```ts
type AddOptions<I> = object;
```

Defined in: [src/asyncQueue.ts:18](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L18)

#### Type Parameters

##### I

`I`

#### Properties

##### id?

```ts
optional id: I;
```

Defined in: [src/asyncQueue.ts:21](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L21)

##### signal?

```ts
optional signal: AbortSignal;
```

Defined in: [src/asyncQueue.ts:19](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L19)

##### timeout?

```ts
optional timeout: number;
```

Defined in: [src/asyncQueue.ts:20](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L20)

***

### AddOptionsWithId\<I\>

```ts
type AddOptionsWithId<I> = Omit<AddOptions<I>, "id"> & object;
```

Defined in: [src/asyncQueue.ts:268](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L268)

#### Type declaration

##### id

```ts
id: I;
```

#### Type Parameters

##### I

`I`

***

### AsyncQueueOptions

```ts
type AsyncQueueOptions = object;
```

Defined in: [src/asyncQueue.ts:12](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L12)

#### Properties

##### concurrency?

```ts
optional concurrency: number;
```

Defined in: [src/asyncQueue.ts:13](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L13)

##### signal?

```ts
optional signal: AbortSignal;
```

Defined in: [src/asyncQueue.ts:14](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L14)

##### timeout?

```ts
optional timeout: number;
```

Defined in: [src/asyncQueue.ts:15](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L15)

***

### RunCtx\<I\>

```ts
type RunCtx<I> = object;
```

Defined in: [src/asyncQueue.ts:24](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L24)

#### Type Parameters

##### I

`I`

#### Properties

##### id?

```ts
optional id: I;
```

Defined in: [src/asyncQueue.ts:26](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L26)

##### signal?

```ts
optional signal: AbortSignal;
```

Defined in: [src/asyncQueue.ts:25](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L25)

***

### Task\<T, E, I\>

```ts
type Task<T, E, I> = object;
```

Defined in: [src/asyncQueue.ts:29](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L29)

#### Type Parameters

##### T

`T`

##### E

`E` *extends* `ResultValidErrors`

##### I

`I`

#### Properties

##### id

```ts
id: I;
```

Defined in: [src/asyncQueue.ts:34](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L34)

##### reject()

```ts
reject: (reason?) => void;
```

Defined in: [src/asyncQueue.ts:32](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L32)

###### Parameters

###### reason?

`Result`\<`T`, `E`\>

###### Returns

`void`

##### resolve()

```ts
resolve: (value) => void;
```

Defined in: [src/asyncQueue.ts:31](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L31)

###### Parameters

###### value

`Result`\<`T`, `E` \| `Error`\>

###### Returns

`void`

##### run()

```ts
run: (ctx) => Promise<Result<T, E>>;
```

Defined in: [src/asyncQueue.ts:30](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L30)

###### Parameters

###### ctx

[`RunCtx`](#runctx)\<`I`\>

###### Returns

`Promise`\<`Result`\<`T`, `E`\>\>

##### signal

```ts
signal: AbortSignal | undefined;
```

Defined in: [src/asyncQueue.ts:33](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L33)

##### timeout

```ts
timeout: number | undefined;
```

Defined in: [src/asyncQueue.ts:35](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L35)
