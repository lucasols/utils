[@ls-stack/utils](modules.md) / keyedSet

# keyedSet

## Classes

### CompositeKeySet\<T\>

Defined in: [packages/utils/src/keyedSet.ts:162](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L162)

A Set that compares items by value instead of reference. Uses
`getCompositeKey` to generate a stable string key for any value.

#### Example

```ts
const set = new ValueSet<{ x: number; y: number }>();
  set.add({ x: 1, y: 2 });
  set.add({ x: 1, y: 2 }); // ignored, same value already exists
  set.size; // 1
```

#### Extends

- [`KeyedSet`](#keyedset)\<`T`, `string`\>

#### Type Parameters

##### T

`T`

#### Constructors

##### Constructor

```ts
new CompositeKeySet<T>(iterable?): CompositeKeySet<T>;
```

Defined in: [packages/utils/src/keyedSet.ts:163](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L163)

###### Parameters

###### iterable?

`Iterable`\<`T`, `any`, `any`\>

###### Returns

[`CompositeKeySet`](#compositekeyset)\<`T`\>

###### Overrides

[`KeyedSet`](#keyedset).[`constructor`](#constructor-1)

#### Accessors

##### size

###### Get Signature

```ts
get size(): number;
```

Defined in: [packages/utils/src/keyedSet.ts:39](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L39)

The number of items in the set

###### Returns

`number`

###### Inherited from

[`KeyedSet`](#keyedset).[`size`](#size-1)

#### Methods

##### \[iterator\]()

```ts
iterator: IterableIterator<T>;
```

Defined in: [packages/utils/src/keyedSet.ts:142](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L142)

###### Returns

`IterableIterator`\<`T`\>

###### Inherited from

[`KeyedSet`](#keyedset).[`[iterator]`](#iterator-2)

##### add()

```ts
add(item): this;
```

Defined in: [packages/utils/src/keyedSet.ts:47](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L47)

Adds an item to the set. If an item with the same key exists, it will be
replaced.

###### Parameters

###### item

`T`

###### Returns

`this`

###### Inherited from

[`KeyedSet`](#keyedset).[`add`](#add-2)

##### addMultiple()

```ts
addMultiple(items): this;
```

Defined in: [packages/utils/src/keyedSet.ts:54](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L54)

Adds multiple items to the set.

###### Parameters

###### items

`Iterable`\<`T`\>

###### Returns

`this`

###### Inherited from

[`KeyedSet`](#keyedset).[`addMultiple`](#addmultiple-2)

##### clear()

```ts
clear(): void;
```

Defined in: [packages/utils/src/keyedSet.ts:114](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L114)

Removes all items from the set.

###### Returns

`void`

###### Inherited from

[`KeyedSet`](#keyedset).[`clear`](#clear-2)

##### delete()

```ts
delete(item): boolean;
```

Defined in: [packages/utils/src/keyedSet.ts:81](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L81)

Removes an item from the set by computing its key. Returns true if the item
was removed.

###### Parameters

###### item

`T`

###### Returns

`boolean`

###### Inherited from

[`KeyedSet`](#keyedset).[`delete`](#delete-2)

##### deleteByKey()

```ts
deleteByKey(key): boolean;
```

Defined in: [packages/utils/src/keyedSet.ts:87](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L87)

Removes an item by its key. Returns true if the item was removed.

###### Parameters

###### key

`string`

###### Returns

`boolean`

###### Inherited from

[`KeyedSet`](#keyedset).[`deleteByKey`](#deletebykey-2)

##### deleteMultiple()

```ts
deleteMultiple(items): number;
```

Defined in: [packages/utils/src/keyedSet.ts:92](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L92)

Removes multiple items from the set. Returns the number of items removed.

###### Parameters

###### items

`Iterable`\<`T`\>

###### Returns

`number`

###### Inherited from

[`KeyedSet`](#keyedset).[`deleteMultiple`](#deletemultiple-2)

##### deleteMultipleByKeys()

```ts
deleteMultipleByKeys(keys): number;
```

Defined in: [packages/utils/src/keyedSet.ts:103](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L103)

Removes multiple items by their keys. Returns the number of items removed.

###### Parameters

###### keys

`Iterable`\<`string`\>

###### Returns

`number`

###### Inherited from

[`KeyedSet`](#keyedset).[`deleteMultipleByKeys`](#deletemultiplebykeys-2)

##### entries()

```ts
entries(): IterableIterator<[T, T]>;
```

Defined in: [packages/utils/src/keyedSet.ts:136](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L136)

###### Returns

`IterableIterator`\<\[`T`, `T`\]\>

###### Inherited from

[`KeyedSet`](#keyedset).[`entries`](#entries-2)

##### forEach()

```ts
forEach(callback, thisArg?): void;
```

Defined in: [packages/utils/src/keyedSet.ts:119](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L119)

Executes a callback for each item in the set.

###### Parameters

###### callback

(`value`, `value2`, `set`) => `void`

###### thisArg?

`unknown`

###### Returns

`void`

###### Inherited from

[`KeyedSet`](#keyedset).[`forEach`](#foreach-2)

##### getByKey()

```ts
getByKey(key): undefined | T;
```

Defined in: [packages/utils/src/keyedSet.ts:73](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L73)

Gets an item by its key, or undefined if not found.

###### Parameters

###### key

`string`

###### Returns

`undefined` \| `T`

###### Inherited from

[`KeyedSet`](#keyedset).[`getByKey`](#getbykey-2)

##### has()

```ts
has(item): boolean;
```

Defined in: [packages/utils/src/keyedSet.ts:62](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L62)

Checks if an item with the same key exists in the set.

###### Parameters

###### item

`T`

###### Returns

`boolean`

###### Inherited from

[`KeyedSet`](#keyedset).[`has`](#has-2)

##### hasKey()

```ts
hasKey(key): boolean;
```

Defined in: [packages/utils/src/keyedSet.ts:68](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L68)

Checks if an item with the given key exists in the set.

###### Parameters

###### key

`string`

###### Returns

`boolean`

###### Inherited from

[`KeyedSet`](#keyedset).[`hasKey`](#haskey-2)

##### keys()

```ts
keys(): IterableIterator<T>;
```

Defined in: [packages/utils/src/keyedSet.ts:132](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L132)

###### Returns

`IterableIterator`\<`T`\>

###### Inherited from

[`KeyedSet`](#keyedset).[`keys`](#keys-2)

##### toArray()

```ts
toArray(): T[];
```

Defined in: [packages/utils/src/keyedSet.ts:147](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L147)

Returns all items as an array.

###### Returns

`T`[]

###### Inherited from

[`KeyedSet`](#keyedset).[`toArray`](#toarray-2)

##### values()

```ts
values(): IterableIterator<T>;
```

Defined in: [packages/utils/src/keyedSet.ts:128](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L128)

###### Returns

`IterableIterator`\<`T`\>

###### Inherited from

[`KeyedSet`](#keyedset).[`values`](#values-2)

***

### KeyedSet\<T, K\>

Defined in: [packages/utils/src/keyedSet.ts:19](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L19)

A Set implementation that uses a custom key function to determine uniqueness.
Items with the same key are considered equal, and adding a duplicate replaces
the existing item.

#### Example

```ts
const set = new KeyedSet<{ id: number; name: string }, number>(
    (item) => item.id,
  );
  set.add({ id: 1, name: 'one' });
  set.add({ id: 1, name: 'replaced' }); // replaces previous item
  set.getByKey(1); // { id: 1, name: 'replaced' }
```

#### Extended by

- [`CompositeKeySet`](#compositekeyset)

#### Type Parameters

##### T

`T`

The type of items stored in the set

##### K

`K` = `string`

The type of the key extracted from items

#### Constructors

##### Constructor

```ts
new KeyedSet<T, K>(getKey, iterable?): KeyedSet<T, K>;
```

Defined in: [packages/utils/src/keyedSet.ts:27](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L27)

###### Parameters

###### getKey

(`item`) => `K`

Function to extract a unique key from each item

###### iterable?

`Iterable`\<`T`, `any`, `any`\>

Optional initial items to add to the set

###### Returns

[`KeyedSet`](#keyedset)\<`T`, `K`\>

#### Accessors

##### size

###### Get Signature

```ts
get size(): number;
```

Defined in: [packages/utils/src/keyedSet.ts:39](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L39)

The number of items in the set

###### Returns

`number`

#### Methods

##### \[iterator\]()

```ts
iterator: IterableIterator<T>;
```

Defined in: [packages/utils/src/keyedSet.ts:142](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L142)

###### Returns

`IterableIterator`\<`T`\>

##### add()

```ts
add(item): this;
```

Defined in: [packages/utils/src/keyedSet.ts:47](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L47)

Adds an item to the set. If an item with the same key exists, it will be
replaced.

###### Parameters

###### item

`T`

###### Returns

`this`

##### addMultiple()

```ts
addMultiple(items): this;
```

Defined in: [packages/utils/src/keyedSet.ts:54](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L54)

Adds multiple items to the set.

###### Parameters

###### items

`Iterable`\<`T`\>

###### Returns

`this`

##### clear()

```ts
clear(): void;
```

Defined in: [packages/utils/src/keyedSet.ts:114](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L114)

Removes all items from the set.

###### Returns

`void`

##### delete()

```ts
delete(item): boolean;
```

Defined in: [packages/utils/src/keyedSet.ts:81](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L81)

Removes an item from the set by computing its key. Returns true if the item
was removed.

###### Parameters

###### item

`T`

###### Returns

`boolean`

##### deleteByKey()

```ts
deleteByKey(key): boolean;
```

Defined in: [packages/utils/src/keyedSet.ts:87](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L87)

Removes an item by its key. Returns true if the item was removed.

###### Parameters

###### key

`K`

###### Returns

`boolean`

##### deleteMultiple()

```ts
deleteMultiple(items): number;
```

Defined in: [packages/utils/src/keyedSet.ts:92](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L92)

Removes multiple items from the set. Returns the number of items removed.

###### Parameters

###### items

`Iterable`\<`T`\>

###### Returns

`number`

##### deleteMultipleByKeys()

```ts
deleteMultipleByKeys(keys): number;
```

Defined in: [packages/utils/src/keyedSet.ts:103](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L103)

Removes multiple items by their keys. Returns the number of items removed.

###### Parameters

###### keys

`Iterable`\<`K`\>

###### Returns

`number`

##### entries()

```ts
entries(): IterableIterator<[T, T]>;
```

Defined in: [packages/utils/src/keyedSet.ts:136](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L136)

###### Returns

`IterableIterator`\<\[`T`, `T`\]\>

##### forEach()

```ts
forEach(callback, thisArg?): void;
```

Defined in: [packages/utils/src/keyedSet.ts:119](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L119)

Executes a callback for each item in the set.

###### Parameters

###### callback

(`value`, `value2`, `set`) => `void`

###### thisArg?

`unknown`

###### Returns

`void`

##### getByKey()

```ts
getByKey(key): undefined | T;
```

Defined in: [packages/utils/src/keyedSet.ts:73](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L73)

Gets an item by its key, or undefined if not found.

###### Parameters

###### key

`K`

###### Returns

`undefined` \| `T`

##### has()

```ts
has(item): boolean;
```

Defined in: [packages/utils/src/keyedSet.ts:62](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L62)

Checks if an item with the same key exists in the set.

###### Parameters

###### item

`T`

###### Returns

`boolean`

##### hasKey()

```ts
hasKey(key): boolean;
```

Defined in: [packages/utils/src/keyedSet.ts:68](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L68)

Checks if an item with the given key exists in the set.

###### Parameters

###### key

`K`

###### Returns

`boolean`

##### keys()

```ts
keys(): IterableIterator<T>;
```

Defined in: [packages/utils/src/keyedSet.ts:132](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L132)

###### Returns

`IterableIterator`\<`T`\>

##### toArray()

```ts
toArray(): T[];
```

Defined in: [packages/utils/src/keyedSet.ts:147](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L147)

Returns all items as an array.

###### Returns

`T`[]

##### values()

```ts
values(): IterableIterator<T>;
```

Defined in: [packages/utils/src/keyedSet.ts:128](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedSet.ts#L128)

###### Returns

`IterableIterator`\<`T`\>
