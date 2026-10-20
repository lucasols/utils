[@ls-stack/utils](../modules.md) / [keyedSet](index.md) / \<internal\>

# \<internal\>

## Functions

### add()

```ts
function add(item): this;
```

Defined in: [packages/utils/src/keyedSet.ts:47](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L47)

Adds an item to the set. If an item with the same key exists, it will be
replaced.

#### Parameters

##### item

`T`

#### Returns

`this`

***

### addMultiple()

```ts
function addMultiple(items): this;
```

Defined in: [packages/utils/src/keyedSet.ts:54](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L54)

Adds multiple items to the set.

#### Parameters

##### items

`Iterable`\<`T`\>

#### Returns

`this`

***

### clear()

```ts
function clear(): void;
```

Defined in: [packages/utils/src/keyedSet.ts:114](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L114)

Removes all items from the set.

#### Returns

`void`

***

### delete()

```ts
function delete(item): boolean;
```

Defined in: [packages/utils/src/keyedSet.ts:81](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L81)

Removes an item from the set by computing its key. Returns true if the item
was removed.

#### Parameters

##### item

`T`

#### Returns

`boolean`

***

### deleteByKey()

```ts
function deleteByKey(key): boolean;
```

Defined in: [packages/utils/src/keyedSet.ts:87](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L87)

Removes an item by its key. Returns true if the item was removed.

#### Parameters

##### key

`K`

#### Returns

`boolean`

***

### deleteMultiple()

```ts
function deleteMultiple(items): number;
```

Defined in: [packages/utils/src/keyedSet.ts:92](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L92)

Removes multiple items from the set. Returns the number of items removed.

#### Parameters

##### items

`Iterable`\<`T`\>

#### Returns

`number`

***

### deleteMultipleByKeys()

```ts
function deleteMultipleByKeys(keys): number;
```

Defined in: [packages/utils/src/keyedSet.ts:103](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L103)

Removes multiple items by their keys. Returns the number of items removed.

#### Parameters

##### keys

`Iterable`\<`K`\>

#### Returns

`number`

***

### entries()

```ts
function entries(): IterableIterator<[T, T]>;
```

Defined in: [packages/utils/src/keyedSet.ts:136](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L136)

#### Returns

`IterableIterator`\<\[`T`, `T`\]\>

***

### forEach()

```ts
function forEach(callback, thisArg?): void;
```

Defined in: [packages/utils/src/keyedSet.ts:119](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L119)

Executes a callback for each item in the set.

#### Parameters

##### callback

(`value`, `value2`, `set`) => `void`

##### thisArg?

`unknown`

#### Returns

`void`

***

### getByKey()

```ts
function getByKey(key): T | undefined;
```

Defined in: [packages/utils/src/keyedSet.ts:73](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L73)

Gets an item by its key, or undefined if not found.

#### Parameters

##### key

`K`

#### Returns

`T` \| `undefined`

***

### has()

```ts
function has(item): boolean;
```

Defined in: [packages/utils/src/keyedSet.ts:62](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L62)

Checks if an item with the same key exists in the set.

#### Parameters

##### item

`T`

#### Returns

`boolean`

***

### hasKey()

```ts
function hasKey(key): boolean;
```

Defined in: [packages/utils/src/keyedSet.ts:68](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L68)

Checks if an item with the given key exists in the set.

#### Parameters

##### key

`K`

#### Returns

`boolean`

***

### keys()

```ts
function keys(): IterableIterator<T>;
```

Defined in: [packages/utils/src/keyedSet.ts:132](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L132)

#### Returns

`IterableIterator`\<`T`\>

***

### toArray()

```ts
function toArray(): T[];
```

Defined in: [packages/utils/src/keyedSet.ts:147](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L147)

Returns all items as an array.

#### Returns

`T`[]

***

### values()

```ts
function values(): IterableIterator<T>;
```

Defined in: [packages/utils/src/keyedSet.ts:128](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L128)

#### Returns

`IterableIterator`\<`T`\>
