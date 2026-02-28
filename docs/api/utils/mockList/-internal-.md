[@ls-stack/utils](../modules.md) / [mockList](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### ItemProps

```ts
type ItemProps = object;
```

Defined in: [packages/utils/src/mockList.ts:3](https://github.com/lucasols/utils/blob/main/packages/utils/src/mockList.ts#L3)

#### Properties

##### afterOrEqualId()

```ts
afterOrEqualId: <T, O>(id, value, otherwise?) => T | O;
```

Defined in: [packages/utils/src/mockList.ts:16](https://github.com/lucasols/utils/blob/main/packages/utils/src/mockList.ts#L16)

###### Type Parameters

###### T

`T`

###### O

`O` = `undefined`

###### Parameters

###### id

`number`

###### value

`T`

###### otherwise?

`O`

###### Returns

`T` \| `O`

##### afterOrEqualIndex()

```ts
afterOrEqualIndex: <T>(index, value, otherwise?) => T | undefined;
```

Defined in: [packages/utils/src/mockList.ts:11](https://github.com/lucasols/utils/blob/main/packages/utils/src/mockList.ts#L11)

###### Type Parameters

###### T

`T`

###### Parameters

###### index

`number`

###### value

`T`

###### otherwise?

`T`

###### Returns

`T` \| `undefined`

##### atId()

```ts
atId: <T, O>(id, value, otherwise?) => T | O;
```

Defined in: [packages/utils/src/mockList.ts:9](https://github.com/lucasols/utils/blob/main/packages/utils/src/mockList.ts#L9)

###### Type Parameters

###### T

`T`

###### O

`O` = `undefined`

###### Parameters

###### id

`number`

###### value

`T`

###### otherwise?

`O`

###### Returns

`T` \| `O`

##### atIndex()

```ts
atIndex: <T, O>(index, value, otherwise?) => T | O;
```

Defined in: [packages/utils/src/mockList.ts:8](https://github.com/lucasols/utils/blob/main/packages/utils/src/mockList.ts#L8)

###### Type Parameters

###### T

`T`

###### O

`O` = `undefined`

###### Parameters

###### index

`number`

###### value

`T`

###### otherwise?

`O`

###### Returns

`T` \| `O`

##### cycle()

```ts
cycle: <V, T>(valuesToCycle, getValue?) => T;
```

Defined in: [packages/utils/src/mockList.ts:10](https://github.com/lucasols/utils/blob/main/packages/utils/src/mockList.ts#L10)

###### Type Parameters

###### V

`V`

###### T

`T` = `V`

###### Parameters

###### valuesToCycle

`V`[]

###### getValue?

(`v`) => `T`

###### Returns

`T`

##### id

```ts
id: number;
```

Defined in: [packages/utils/src/mockList.ts:5](https://github.com/lucasols/utils/blob/main/packages/utils/src/mockList.ts#L5)

##### index

```ts
index: number;
```

Defined in: [packages/utils/src/mockList.ts:4](https://github.com/lucasols/utils/blob/main/packages/utils/src/mockList.ts#L4)

##### onEven()

```ts
onEven: <T, O>(value, otherwise?) => T | O;
```

Defined in: [packages/utils/src/mockList.ts:7](https://github.com/lucasols/utils/blob/main/packages/utils/src/mockList.ts#L7)

###### Type Parameters

###### T

`T`

###### O

`O` = `undefined`

###### Parameters

###### value

`T`

###### otherwise?

`O`

###### Returns

`T` \| `O`

##### onEvery()

```ts
onEvery: <T, O>(index, value, otherwise?) => T | O;
```

Defined in: [packages/utils/src/mockList.ts:6](https://github.com/lucasols/utils/blob/main/packages/utils/src/mockList.ts#L6)

###### Type Parameters

###### T

`T`

###### O

`O` = `undefined`

###### Parameters

###### index

`number`

###### value

`T`

###### otherwise?

`O`

###### Returns

`T` \| `O`
