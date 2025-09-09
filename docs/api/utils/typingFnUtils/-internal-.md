[@ls-stack/utils](../modules.md) / [typingFnUtils](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### KeysWithUndefinedValues\<T\>

```ts
type KeysWithUndefinedValues<T> = { [K in keyof T]: undefined extends T[K] ? K : never }[keyof T];
```

Defined in: [packages/utils/src/typeUtils.ts:155](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L155)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

***

### UnionDiff\<T, U\>

```ts
type UnionDiff<T, U> = [T] extends [U] ? [U] extends [T] ? null : object : [U] extends [T] ? object : object;
```

Defined in: [packages/utils/src/typingFnUtils.ts:98](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L98)

#### Type Parameters

##### T

`T`

##### U

`U`
