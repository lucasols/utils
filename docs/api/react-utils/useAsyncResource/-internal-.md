[@ls-stack/react-utils](../modules.md) / [useAsyncResource](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### AsyncResult\<T\>

```ts
type AsyncResult<T> = AsyncState<T> & object;
```

Defined in: [react-utils/src/useAsyncResource.ts:19](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L19)

#### Type Declaration

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

Defined in: [react-utils/src/useAsyncResource.ts:13](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L13)

#### Type Parameters

##### T

`T`

#### Properties

##### data

```ts
data: T;
```

Defined in: [react-utils/src/useAsyncResource.ts:16](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L16)

##### error

```ts
error: null | Error;
```

Defined in: [react-utils/src/useAsyncResource.ts:15](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L15)

##### status

```ts
status: "idle" | "loading" | "refetching" | "success" | "error";
```

Defined in: [react-utils/src/useAsyncResource.ts:14](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L14)

***

### Options

```ts
type Options = object;
```

Defined in: [react-utils/src/useAsyncResource.ts:21](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L21)

#### Properties

##### asyncFnUsesExternalDeps?

```ts
optional asyncFnUsesExternalDeps: boolean;
```

Defined in: [react-utils/src/useAsyncResource.ts:23](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L23)

##### externalDeps?

```ts
optional externalDeps: unknown[];
```

Defined in: [react-utils/src/useAsyncResource.ts:24](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L24)

##### lazy?

```ts
optional lazy: boolean;
```

Defined in: [react-utils/src/useAsyncResource.ts:22](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useAsyncResource.ts#L22)
