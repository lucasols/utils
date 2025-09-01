[**@ls-stack/react-utils**](../README.md)

***

[@ls-stack/react-utils](../modules.md) / [useAsyncResource](README.md) / \<internal\>

# \<internal\>

## Type Aliases

### AsyncResult\<T\>

```ts
type AsyncResult<T> = AsyncState<T> & object;
```

Defined in: [packages/react-utils/src/useAsyncResource.ts:11](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L11)

#### Type declaration

##### isLoading

```ts
isLoading: boolean;
```

##### load()

```ts
load: () => void;
```

###### Returns

`void`

#### Type Parameters

##### T

`T`

***

### AsyncState\<T\>

```ts
type AsyncState<T> = object;
```

Defined in: [packages/react-utils/src/useAsyncResource.ts:5](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L5)

#### Type Parameters

##### T

`T`

#### Properties

##### data

```ts
data: T;
```

Defined in: [packages/react-utils/src/useAsyncResource.ts:8](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L8)

##### error

```ts
error: null | Error;
```

Defined in: [packages/react-utils/src/useAsyncResource.ts:7](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L7)

##### status

```ts
status: "idle" | "loading" | "refetching" | "success" | "error";
```

Defined in: [packages/react-utils/src/useAsyncResource.ts:6](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L6)

***

### Options

```ts
type Options = object;
```

Defined in: [packages/react-utils/src/useAsyncResource.ts:13](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L13)

#### Properties

##### asyncFnUsesExternalDeps?

```ts
optional asyncFnUsesExternalDeps: boolean;
```

Defined in: [packages/react-utils/src/useAsyncResource.ts:15](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L15)

##### lazy?

```ts
optional lazy: boolean;
```

Defined in: [packages/react-utils/src/useAsyncResource.ts:14](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L14)
