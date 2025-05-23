[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / [promiseUtils](README.md) / \<internal\>

# \<internal\>

## Type Aliases

### Deferred\<T\>

```ts
type Deferred<T> = object;
```

Defined in: [src/promiseUtils.ts:1](https://github.com/lucasols/utils/blob/main/src/promiseUtils.ts#L1)

#### Type Parameters

##### T

`T`

#### Properties

##### promise

```ts
promise: Promise<T>;
```

Defined in: [src/promiseUtils.ts:4](https://github.com/lucasols/utils/blob/main/src/promiseUtils.ts#L4)

##### reject()

```ts
reject: (reason) => void;
```

Defined in: [src/promiseUtils.ts:3](https://github.com/lucasols/utils/blob/main/src/promiseUtils.ts#L3)

###### Parameters

###### reason

`unknown`

###### Returns

`void`

##### resolve()

```ts
resolve: (value) => void;
```

Defined in: [src/promiseUtils.ts:2](https://github.com/lucasols/utils/blob/main/src/promiseUtils.ts#L2)

###### Parameters

###### value

`T` | `PromiseLike`\<`T`\>

###### Returns

`void`
