[**@ls-stack/react-utils**](README.md)

***

[@ls-stack/react-utils](modules.md) / useActionFn

# useActionFn

## Functions

### useActionFn()

```ts
function useActionFn<A, T>(action): object;
```

Defined in: [useActionFn.ts:4](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useActionFn.ts#L4)

#### Type Parameters

##### A

`A` *extends* `unknown`[]

##### T

`T`

#### Parameters

##### action

(...`params`) => `T`

#### Returns

`object`

##### call()

```ts
call: (...args) => Promise<null | Awaited<T>>;
```

###### Parameters

###### args

...`A`

###### Returns

`Promise`\<`null` \| `Awaited`\<`T`\>\>

##### isInProgress

```ts
isInProgress: boolean;
```

***

### useActionFnWithState()

```ts
function useActionFnWithState<T, A, R>(action): object;
```

Defined in: [useActionFn.ts:37](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useActionFn.ts#L37)

#### Type Parameters

##### T

`T` *extends* `string` \| `number`

##### A

`A` *extends* `unknown`[]

##### R

`R`

#### Parameters

##### action

(`state`, ...`params`) => `R`

#### Returns

`object`

##### call()

```ts
call: (state, ...args) => Promise<false | Awaited<R>>;
```

###### Parameters

###### state

`T`

###### args

...`A`

###### Returns

`Promise`\<`false` \| `Awaited`\<`R`\>\>

##### isInProgress()

```ts
isInProgress: (state) => boolean;
```

###### Parameters

###### state

`T`

###### Returns

`boolean`
