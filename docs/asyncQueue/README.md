[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / asyncQueue

# asyncQueue

## Modules

- [\<internal\>](-internal-.md)

## Functions

### createAsyncQueue()

```ts
function createAsyncQueue<T, E>(options?): AsyncQueue<T, E>;
```

Defined in: [src/asyncQueue.ts:316](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L316)

#### Type Parameters

##### T

`T`

##### E

`E` *extends* `ResultValidErrors` = `Error`

#### Parameters

##### options?

[`AsyncQueueOptions`](-internal-.md#asyncqueueoptions)

#### Returns

[`AsyncQueue`](-internal-.md#asyncqueue)\<`T`, `E`\>

***

### createAsyncQueueWithMeta()

```ts
function createAsyncQueueWithMeta<T, I, E>(options?): AsyncQueueWithMeta<T, I, E>;
```

Defined in: [src/asyncQueue.ts:322](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L322)

#### Type Parameters

##### T

`T`

##### I

`I`

##### E

`E` *extends* `ResultValidErrors` = `Error`

#### Parameters

##### options?

[`AsyncQueueOptions`](-internal-.md#asyncqueueoptions)

#### Returns

[`AsyncQueueWithMeta`](-internal-.md#asyncqueuewithmeta)\<`T`, `I`, `E`\>
