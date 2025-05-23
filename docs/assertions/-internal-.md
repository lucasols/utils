[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / [assertions](README.md) / \<internal\>

# \<internal\>

## Type Aliases

### NotUndefined\<T\>

```ts
type NotUndefined<T> = T extends undefined ? never : T;
```

Defined in: [src/assertions.ts:4](https://github.com/lucasols/utils/blob/main/src/assertions.ts#L4)

#### Type Parameters

##### T

`T`

***

### StrictNonNullable\<T, N\>

```ts
type StrictNonNullable<T, N> = undefined extends T ? NonNullable<T> : null extends T ? NonNullable<T> : N;
```

Defined in: [src/assertions.ts:20](https://github.com/lucasols/utils/blob/main/src/assertions.ts#L20)

#### Type Parameters

##### T

`T`

##### N

`N` = `unknown`

***

### StrictNonUndefined\<T, N\>

```ts
type StrictNonUndefined<T, N> = undefined extends T ? NotUndefined<T> : N;
```

Defined in: [src/assertions.ts:6](https://github.com/lucasols/utils/blob/main/src/assertions.ts#L6)

#### Type Parameters

##### T

`T`

##### N

`N` = `unknown`
