[@ls-stack/utils](../modules.md) / [matchPath](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### \_PathParam\<Path\>

```ts
type _PathParam<Path> = Path extends `${infer L}/${infer R}` ? _PathParam<L> | _PathParam<R> : Path extends `:${infer Param}` ? Param extends `${infer Optional}?` ? Optional : Param : never;
```

Defined in: [packages/utils/src/matchPath.ts:6](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L6)

#### Type Parameters

##### Path

`Path` *extends* `string`
