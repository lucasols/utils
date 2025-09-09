[@ls-stack/utils](../modules.md) / [assertions](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### NotUndefined\<T\>

```ts
type NotUndefined<T> = T extends undefined ? never : T;
```

Defined in: [packages/utils/src/assertions.ts:11](https://github.com/lucasols/utils/blob/main/packages/utils/src/assertions.ts#L11)

#### Type Parameters

##### T

`T`

***

### StrictNonNullable\<T, N\>

```ts
type StrictNonNullable<T, N> = undefined extends T ? NonNullable<T> : null extends T ? NonNullable<T> : N;
```

Defined in: [packages/utils/src/assertions.ts:52](https://github.com/lucasols/utils/blob/main/packages/utils/src/assertions.ts#L52)

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

Defined in: [packages/utils/src/assertions.ts:13](https://github.com/lucasols/utils/blob/main/packages/utils/src/assertions.ts#L13)

#### Type Parameters

##### T

`T`

##### N

`N` = `unknown`
