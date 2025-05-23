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

Defined in: [src/asyncQueue.ts:296](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L296)

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

### createAsyncQueueWithId()

```ts
function createAsyncQueueWithId<T, I, E>(options?): AsyncQueueWithId<T, I, E>;
```

Defined in: [src/asyncQueue.ts:302](https://github.com/lucasols/utils/blob/main/src/asyncQueue.ts#L302)

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

[`AsyncQueueWithId`](-internal-.md#asyncqueuewithid)\<`T`, `I`, `E`\>
