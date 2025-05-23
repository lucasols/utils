[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / exhaustiveMatch

# exhaustiveMatch

## Modules

- [\<internal\>](-internal-.md)

## Functions

### exhaustiveMatch()

```ts
function exhaustiveMatch<T>(value): object;
```

Defined in: [src/exhaustiveMatch.ts:1](https://github.com/lucasols/utils/blob/main/src/exhaustiveMatch.ts#L1)

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### value

`T`

#### Returns

##### with()

```ts
with: <R>(pattern) => R = matchWith;
```

The pattern can be:
- a function that returns the result
- '_nxt' to try the next pattern
- '_never' to indicate that this pattern should never be matched

###### Type Parameters

###### R

`R`

###### Parameters

###### pattern

[`Pattern`](-internal-.md#pattern)\<`R`\>

###### Returns

`R`

##### withObject()

```ts
withObject: <R>(pattern) => R;
```

match with early evaluation of the values

###### Type Parameters

###### R

`R`

###### Parameters

###### pattern

`Record`\<`T`, `R`\>

###### Returns

`R`

***

### exhaustiveMatchObjUnion()

```ts
function exhaustiveMatchObjUnion<T, D, K>(obj, key): object;
```

Defined in: [src/exhaustiveMatch.ts:47](https://github.com/lucasols/utils/blob/main/src/exhaustiveMatch.ts#L47)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

##### D

`D` *extends* `string` \| `number` \| `symbol`

##### K

`K` *extends* `string`

#### Parameters

##### obj

`T`

##### key

`D`

#### Returns

`object`

##### with()

```ts
with: <R>(pattern) => R = withLazy;
```

###### Type Parameters

###### R

`R`

###### Parameters

###### pattern

[`Pattern`](-internal-.md#pattern-1)\<`R`\>

###### Returns

`R`
