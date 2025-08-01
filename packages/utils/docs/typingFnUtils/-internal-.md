[**@ls-stack/utils**](../README.md)

---

[@ls-stack/utils](../modules.md) / [typingFnUtils](README.md) / \<internal\>

# \<internal\>

## Type Aliases

### UnionDiff\<T, U\>

```ts
type UnionDiff<T, U> =
  [T] extends [U] ?
    [U] extends [T] ?
      null
    : object
  : [U] extends [T] ? object
  : object;
```

Defined in: [packages/utils/src/typingFnUtils.ts:71](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L71)

#### Type Parameters

##### T

`T`

##### U

`U`
