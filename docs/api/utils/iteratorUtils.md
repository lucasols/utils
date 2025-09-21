[@ls-stack/utils](modules.md) / iteratorUtils

# iteratorUtils

## Functions

### enumerate()

```ts
function enumerate<T>(iter, start): Generator<[number, T]>;
```

Defined in: [packages/utils/src/iteratorUtils.ts:1](https://github.com/lucasols/utils/blob/main/packages/utils/src/iteratorUtils.ts#L1)

#### Type Parameters

##### T

`T`

#### Parameters

##### iter

`Iterable`\<`T`\>

##### start

`number` = `0`

#### Returns

`Generator`\<\[`number`, `T`\]\>

***

### range()

```ts
function range(
   start, 
   end, 
step): Generator<number>;
```

Defined in: [packages/utils/src/iteratorUtils.ts:38](https://github.com/lucasols/utils/blob/main/packages/utils/src/iteratorUtils.ts#L38)

#### Parameters

##### start

`number`

##### end

`number`

##### step

`number` = `1`

#### Returns

`Generator`\<`number`\>

***

### rangeArray()

```ts
function rangeArray(
   start, 
   end, 
   step): number[];
```

Defined in: [packages/utils/src/iteratorUtils.ts:54](https://github.com/lucasols/utils/blob/main/packages/utils/src/iteratorUtils.ts#L54)

#### Parameters

##### start

`number`

##### end

`number`

##### step

`number` = `1`

#### Returns

`number`[]

***

### withIsLast()

```ts
function withIsLast<T>(array): Generator<[boolean, T, number]>;
```

Defined in: [packages/utils/src/iteratorUtils.ts:13](https://github.com/lucasols/utils/blob/main/packages/utils/src/iteratorUtils.ts#L13)

#### Type Parameters

##### T

`T`

#### Parameters

##### array

`T`[]

#### Returns

`Generator`\<\[`boolean`, `T`, `number`\]\>

***

### withPrevious()

```ts
function withPrevious<T>(iter): Generator<{
  current: T;
  prev: undefined | T;
}>;
```

Defined in: [packages/utils/src/iteratorUtils.ts:27](https://github.com/lucasols/utils/blob/main/packages/utils/src/iteratorUtils.ts#L27)

#### Type Parameters

##### T

`T`

#### Parameters

##### iter

`Iterable`\<`T`\>

#### Returns

`Generator`\<\{
  `current`: `T`;
  `prev`: `undefined` \| `T`;
\}\>
