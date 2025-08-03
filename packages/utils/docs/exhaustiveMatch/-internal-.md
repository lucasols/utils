[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / [exhaustiveMatch](README.md) / \<internal\>

# \<internal\>

## Type Aliases

### Pattern\<R\>

```ts
type Pattern<R> = { [K in T]: (() => R) | "_nxt" | "_never" };
```

Defined in: [packages/utils/src/exhaustiveMatch.ts:2](https://github.com/lucasols/utils/blob/main/packages/utils/src/exhaustiveMatch.ts#L2)

#### Type Parameters

##### R

`R`

***

### Pattern\<R\>

```ts
type Pattern<R> = { [P in K]: ((props: Extract<T, Record<D, P>>) => R) | "_never" };
```

Defined in: [packages/utils/src/exhaustiveMatch.ts:52](https://github.com/lucasols/utils/blob/main/packages/utils/src/exhaustiveMatch.ts#L52)

#### Type Parameters

##### R

`R`
