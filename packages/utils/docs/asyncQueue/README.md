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

Defined in: [packages/utils/src/asyncQueue.ts:328](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L328)

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

Defined in: [packages/utils/src/asyncQueue.ts:334](https://github.com/lucasols/utils/blob/main/packages/utils/src/asyncQueue.ts#L334)

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
