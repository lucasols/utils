[@ls-stack/react-utils](../modules.md) / [useSet](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### UseSet\<T\>

```ts
type UseSet<T> = object;
```

Defined in: [react-utils/src/useSet.ts:4](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useSet.ts#L4)

#### Type Parameters

##### T

`T`

#### Properties

##### add()

```ts
add: (item) => void;
```

Defined in: [react-utils/src/useSet.ts:5](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useSet.ts#L5)

###### Parameters

###### item

`T`

###### Returns

`void`

##### addOrDelete()

```ts
addOrDelete: (item, addOrRemove) => void;
```

Defined in: [react-utils/src/useSet.ts:9](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useSet.ts#L9)

###### Parameters

###### item

`T`

###### addOrRemove

`boolean` | `null`

###### Returns

`void`

##### array

```ts
array: T[];
```

Defined in: [react-utils/src/useSet.ts:11](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useSet.ts#L11)

##### delete()

```ts
delete: (item) => void;
```

Defined in: [react-utils/src/useSet.ts:7](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useSet.ts#L7)

###### Parameters

###### item

`T`

###### Returns

`void`

##### has()

```ts
has: (item) => boolean;
```

Defined in: [react-utils/src/useSet.ts:6](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useSet.ts#L6)

###### Parameters

###### item

`T`

###### Returns

`boolean`

##### set()

```ts
set: (items) => void;
```

Defined in: [react-utils/src/useSet.ts:10](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useSet.ts#L10)

###### Parameters

###### items

`T`[]

###### Returns

`void`

##### toggle()

```ts
toggle: (item) => void;
```

Defined in: [react-utils/src/useSet.ts:8](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useSet.ts#L8)

###### Parameters

###### item

`T`

###### Returns

`void`
