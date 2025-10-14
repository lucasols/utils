[@ls-stack/react-utils](../modules.md) / [useAsyncResource](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### AsyncResult\<T\>

```ts
type AsyncResult<T> = AsyncState<T> & object;
```

Defined in: [packages/react-utils/src/useAsyncResource.ts:13](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L13)

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

Defined in: [packages/react-utils/src/useAsyncResource.ts:7](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L7)

#### Type Parameters

##### T

`T`

#### Properties

##### data

```ts
data: T;
```

Defined in: [packages/react-utils/src/useAsyncResource.ts:10](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L10)

##### error

```ts
error: null | Error;
```

Defined in: [packages/react-utils/src/useAsyncResource.ts:9](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L9)

##### status

```ts
status: "idle" | "loading" | "refetching" | "success" | "error";
```

Defined in: [packages/react-utils/src/useAsyncResource.ts:8](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L8)

***

### Options

```ts
type Options = object;
```

Defined in: [packages/react-utils/src/useAsyncResource.ts:15](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L15)

#### Properties

##### asyncFnUsesExternalDeps?

```ts
optional asyncFnUsesExternalDeps: boolean;
```

Defined in: [packages/react-utils/src/useAsyncResource.ts:17](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L17)

##### externalDeps?

```ts
optional externalDeps: unknown[];
```

Defined in: [packages/react-utils/src/useAsyncResource.ts:18](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L18)

##### lazy?

```ts
optional lazy: boolean;
```

Defined in: [packages/react-utils/src/useAsyncResource.ts:16](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L16)
