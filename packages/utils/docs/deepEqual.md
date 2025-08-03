[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / deepEqual

# deepEqual

## Functions

### deepEqual()

```ts
function deepEqual(
   foo, 
   bar, 
   maxDepth): boolean;
```

Defined in: [packages/utils/src/deepEqual.ts:30](https://github.com/lucasols/utils/blob/main/packages/utils/src/deepEqual.ts#L30)

Deep equality comparison between two values

#### Parameters

##### foo

`any`

First value to compare

##### bar

`any`

Second value to compare

##### maxDepth

`number` = `20`

Maximum comparison depth (default: 20)

#### Returns

`boolean`

True if values are deeply equal, false otherwise

#### Example

```ts
deepEqual({a: 1}, {a: 1}) // true
deepEqual({a: 1}, {a: 2}) // false
deepEqual([1, {b: 2}], [1, {b: 2}]) // true
deepEqual(new Map([['a', 1]]), new Map([['a', 1]])) // true
deepEqual(new Set([1, 2]), new Set([1, 2])) // true
```

***

### deepEqualWithMaxDepth()

```ts
function deepEqualWithMaxDepth(maxDepth): (foo, bar) => boolean;
```

Defined in: [packages/utils/src/deepEqual.ts:94](https://github.com/lucasols/utils/blob/main/packages/utils/src/deepEqual.ts#L94)

#### Parameters

##### maxDepth

`number`

#### Returns

```ts
(foo, bar): boolean;
```

##### Parameters

###### foo

`any`

###### bar

`any`

##### Returns

`boolean`
