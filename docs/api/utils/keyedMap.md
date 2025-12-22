[@ls-stack/utils](modules.md) / keyedMap

# keyedMap

## Classes

### CompositeKeyMap\<K, V\>

Defined in: [packages/utils/src/keyedMap.ts:183](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L183)

A Map that compares keys by value instead of reference.
Uses `getCompositeKey` to generate a stable string key for any value.

#### Example

```ts
const map = new CompositeKeyMap<{ x: number; y: number }, string>();
  map.set({ x: 1, y: 2 }, 'point A');
  map.get({ x: 1, y: 2 }); // 'point A' (different object, same value)
```

#### Extends

- [`KeyedMap`](#keyedmap)\<`K`, `V`, `string`\>

#### Type Parameters

##### K

`K`

##### V

`V`

#### Constructors

##### Constructor

```ts
new CompositeKeyMap<K, V>(entries?): CompositeKeyMap<K, V>;
```

Defined in: [packages/utils/src/keyedMap.ts:184](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L184)

###### Parameters

###### entries?

`Iterable`\<\[`K`, `V`\], `any`, `any`\>

###### Returns

[`CompositeKeyMap`](#compositekeymap)\<`K`, `V`\>

###### Overrides

[`KeyedMap`](#keyedmap).[`constructor`](#constructor-1)

#### Accessors

##### size

###### Get Signature

```ts
get size(): number;
```

Defined in: [packages/utils/src/keyedMap.ts:38](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L38)

The number of entries in the map

###### Returns

`number`

###### Inherited from

[`KeyedMap`](#keyedmap).[`size`](#size-1)

#### Methods

##### \[iterator\]()

```ts
iterator: IterableIterator<[K, V]>;
```

Defined in: [packages/utils/src/keyedMap.ts:169](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L169)

###### Returns

`IterableIterator`\<\[`K`, `V`\]\>

###### Inherited from

[`KeyedMap`](#keyedmap).[`[iterator]`](#iterator-2)

##### clear()

```ts
clear(): void;
```

Defined in: [packages/utils/src/keyedMap.ts:87](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L87)

Removes all entries from the map.

###### Returns

`void`

###### Inherited from

[`KeyedMap`](#keyedmap).[`clear`](#clear-2)

##### delete()

```ts
delete(key): boolean;
```

Defined in: [packages/utils/src/keyedMap.ts:70](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L70)

Removes the entry for the given key. Returns true if the entry was removed.

###### Parameters

###### key

`K`

###### Returns

`boolean`

###### Inherited from

[`KeyedMap`](#keyedmap).[`delete`](#delete-2)

##### deleteMultiple()

```ts
deleteMultiple(keys): number;
```

Defined in: [packages/utils/src/keyedMap.ts:76](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L76)

Removes multiple entries. Returns the number of entries removed.

###### Parameters

###### keys

`Iterable`\<`K`\>

###### Returns

`number`

###### Inherited from

[`KeyedMap`](#keyedmap).[`deleteMultiple`](#deletemultiple-2)

##### entries()

```ts
entries(): IterableIterator<[K, V]>;
```

Defined in: [packages/utils/src/keyedMap.ts:163](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L163)

###### Returns

`IterableIterator`\<\[`K`, `V`\]\>

###### Inherited from

[`KeyedMap`](#keyedmap).[`entries`](#entries-2)

##### find()

```ts
find(predicate): 
  | undefined
  | {
  key: K;
  value: V;
};
```

Defined in: [packages/utils/src/keyedMap.ts:102](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L102)

Finds the first entry matching the predicate.

###### Parameters

###### predicate

(`value`, `key`) => `boolean`

###### Returns

  \| `undefined`
  \| \{
  `key`: `K`;
  `value`: `V`;
\}

###### Inherited from

[`KeyedMap`](#keyedmap).[`find`](#find-2)

##### forEach()

```ts
forEach(callback, thisArg?): void;
```

Defined in: [packages/utils/src/keyedMap.ts:92](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L92)

Executes a callback for each entry in the map.

###### Parameters

###### callback

(`value`, `key`, `map`) => `void`

###### thisArg?

`unknown`

###### Returns

`void`

###### Inherited from

[`KeyedMap`](#keyedmap).[`forEach`](#foreach-2)

##### get()

```ts
get(key): undefined | V;
```

Defined in: [packages/utils/src/keyedMap.ts:58](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L58)

Gets the value for the given key, or undefined if not found.

###### Parameters

###### key

`K`

###### Returns

`undefined` \| `V`

###### Inherited from

[`KeyedMap`](#keyedmap).[`get`](#get-2)

##### getOrInsert()

```ts
getOrInsert(key, fallback): V;
```

Defined in: [packages/utils/src/keyedMap.ts:123](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L123)

Gets the value for the given key, or inserts and returns the fallback value.

###### Parameters

###### key

`K`

###### fallback

() => `V`

###### Returns

`V`

###### Inherited from

[`KeyedMap`](#keyedmap).[`getOrInsert`](#getorinsert-2)

##### getOrThrow()

```ts
getOrThrow(key): V;
```

Defined in: [packages/utils/src/keyedMap.ts:114](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L114)

Gets the value for the given key, or throws if not found.

###### Parameters

###### key

`K`

###### Returns

`V`

###### Inherited from

[`KeyedMap`](#keyedmap).[`getOrThrow`](#getorthrow-2)

##### has()

```ts
has(key): boolean;
```

Defined in: [packages/utils/src/keyedMap.ts:64](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L64)

Checks if the map contains the given key.

###### Parameters

###### key

`K`

###### Returns

`boolean`

###### Inherited from

[`KeyedMap`](#keyedmap).[`has`](#has-2)

##### keys()

```ts
keys(): IterableIterator<K>;
```

Defined in: [packages/utils/src/keyedMap.ts:151](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L151)

###### Returns

`IterableIterator`\<`K`\>

###### Inherited from

[`KeyedMap`](#keyedmap).[`keys`](#keys-2)

##### set()

```ts
set(key, value): this;
```

Defined in: [packages/utils/src/keyedMap.ts:43](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L43)

Sets a value for the given key. If the key exists, replaces both key and value.

###### Parameters

###### key

`K`

###### value

`V`

###### Returns

`this`

###### Inherited from

[`KeyedMap`](#keyedmap).[`set`](#set-2)

##### setMultiple()

```ts
setMultiple(entries): this;
```

Defined in: [packages/utils/src/keyedMap.ts:50](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L50)

Sets multiple entries at once.

###### Parameters

###### entries

`Iterable`\<\[`K`, `V`\]\>

###### Returns

`this`

###### Inherited from

[`KeyedMap`](#keyedmap).[`setMultiple`](#setmultiple-2)

##### toFilteredValues()

```ts
toFilteredValues(predicate): V[];
```

Defined in: [packages/utils/src/keyedMap.ts:131](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L131)

Returns values that match the predicate.

###### Parameters

###### predicate

(`value`, `key`) => `boolean`

###### Returns

`V`[]

###### Inherited from

[`KeyedMap`](#keyedmap).[`toFilteredValues`](#tofilteredvalues-2)

##### toKeys()

```ts
toKeys(): K[];
```

Defined in: [packages/utils/src/keyedMap.ts:147](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L147)

Returns all keys as an array.

###### Returns

`K`[]

###### Inherited from

[`KeyedMap`](#keyedmap).[`toKeys`](#tokeys-2)

##### toValues()

```ts
toValues(): V[];
```

Defined in: [packages/utils/src/keyedMap.ts:142](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L142)

Returns all values as an array.

###### Returns

`V`[]

###### Inherited from

[`KeyedMap`](#keyedmap).[`toValues`](#tovalues-2)

##### values()

```ts
values(): IterableIterator<V>;
```

Defined in: [packages/utils/src/keyedMap.ts:157](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L157)

###### Returns

`IterableIterator`\<`V`\>

###### Inherited from

[`KeyedMap`](#keyedmap).[`values`](#values-2)

***

### KeyedMap\<K, V, InternalKey\>

Defined in: [packages/utils/src/keyedMap.ts:18](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L18)

A Map implementation that uses a custom key function to determine key equality.
Keys with the same computed internal key are considered equal.

#### Example

```ts
const map = new KeyedMap<{ x: number; y: number }, string, string>(
    (key) => `${key.x},${key.y}`,
  );
  map.set({ x: 1, y: 2 }, 'point A');
  map.get({ x: 1, y: 2 }); // 'point A' (different object, same computed key)
```

#### Extended by

- [`CompositeKeyMap`](#compositekeymap)

#### Type Parameters

##### K

`K`

The type of the external key

##### V

`V`

The type of the value

##### InternalKey

`InternalKey` = `string`

The type of the internal key used for comparison

#### Constructors

##### Constructor

```ts
new KeyedMap<K, V, InternalKey>(getKey, entries?): KeyedMap<K, V, InternalKey>;
```

Defined in: [packages/utils/src/keyedMap.ts:26](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L26)

###### Parameters

###### getKey

(`key`) => `InternalKey`

Function to compute an internal key from the external key

###### entries?

`Iterable`\<\[`K`, `V`\], `any`, `any`\>

Optional initial entries to add to the map

###### Returns

[`KeyedMap`](#keyedmap)\<`K`, `V`, `InternalKey`\>

#### Accessors

##### size

###### Get Signature

```ts
get size(): number;
```

Defined in: [packages/utils/src/keyedMap.ts:38](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L38)

The number of entries in the map

###### Returns

`number`

#### Methods

##### \[iterator\]()

```ts
iterator: IterableIterator<[K, V]>;
```

Defined in: [packages/utils/src/keyedMap.ts:169](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L169)

###### Returns

`IterableIterator`\<\[`K`, `V`\]\>

##### clear()

```ts
clear(): void;
```

Defined in: [packages/utils/src/keyedMap.ts:87](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L87)

Removes all entries from the map.

###### Returns

`void`

##### delete()

```ts
delete(key): boolean;
```

Defined in: [packages/utils/src/keyedMap.ts:70](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L70)

Removes the entry for the given key. Returns true if the entry was removed.

###### Parameters

###### key

`K`

###### Returns

`boolean`

##### deleteMultiple()

```ts
deleteMultiple(keys): number;
```

Defined in: [packages/utils/src/keyedMap.ts:76](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L76)

Removes multiple entries. Returns the number of entries removed.

###### Parameters

###### keys

`Iterable`\<`K`\>

###### Returns

`number`

##### entries()

```ts
entries(): IterableIterator<[K, V]>;
```

Defined in: [packages/utils/src/keyedMap.ts:163](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L163)

###### Returns

`IterableIterator`\<\[`K`, `V`\]\>

##### find()

```ts
find(predicate): 
  | undefined
  | {
  key: K;
  value: V;
};
```

Defined in: [packages/utils/src/keyedMap.ts:102](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L102)

Finds the first entry matching the predicate.

###### Parameters

###### predicate

(`value`, `key`) => `boolean`

###### Returns

  \| `undefined`
  \| \{
  `key`: `K`;
  `value`: `V`;
\}

##### forEach()

```ts
forEach(callback, thisArg?): void;
```

Defined in: [packages/utils/src/keyedMap.ts:92](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L92)

Executes a callback for each entry in the map.

###### Parameters

###### callback

(`value`, `key`, `map`) => `void`

###### thisArg?

`unknown`

###### Returns

`void`

##### get()

```ts
get(key): undefined | V;
```

Defined in: [packages/utils/src/keyedMap.ts:58](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L58)

Gets the value for the given key, or undefined if not found.

###### Parameters

###### key

`K`

###### Returns

`undefined` \| `V`

##### getOrInsert()

```ts
getOrInsert(key, fallback): V;
```

Defined in: [packages/utils/src/keyedMap.ts:123](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L123)

Gets the value for the given key, or inserts and returns the fallback value.

###### Parameters

###### key

`K`

###### fallback

() => `V`

###### Returns

`V`

##### getOrThrow()

```ts
getOrThrow(key): V;
```

Defined in: [packages/utils/src/keyedMap.ts:114](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L114)

Gets the value for the given key, or throws if not found.

###### Parameters

###### key

`K`

###### Returns

`V`

##### has()

```ts
has(key): boolean;
```

Defined in: [packages/utils/src/keyedMap.ts:64](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L64)

Checks if the map contains the given key.

###### Parameters

###### key

`K`

###### Returns

`boolean`

##### keys()

```ts
keys(): IterableIterator<K>;
```

Defined in: [packages/utils/src/keyedMap.ts:151](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L151)

###### Returns

`IterableIterator`\<`K`\>

##### set()

```ts
set(key, value): this;
```

Defined in: [packages/utils/src/keyedMap.ts:43](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L43)

Sets a value for the given key. If the key exists, replaces both key and value.

###### Parameters

###### key

`K`

###### value

`V`

###### Returns

`this`

##### setMultiple()

```ts
setMultiple(entries): this;
```

Defined in: [packages/utils/src/keyedMap.ts:50](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L50)

Sets multiple entries at once.

###### Parameters

###### entries

`Iterable`\<\[`K`, `V`\]\>

###### Returns

`this`

##### toFilteredValues()

```ts
toFilteredValues(predicate): V[];
```

Defined in: [packages/utils/src/keyedMap.ts:131](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L131)

Returns values that match the predicate.

###### Parameters

###### predicate

(`value`, `key`) => `boolean`

###### Returns

`V`[]

##### toKeys()

```ts
toKeys(): K[];
```

Defined in: [packages/utils/src/keyedMap.ts:147](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L147)

Returns all keys as an array.

###### Returns

`K`[]

##### toValues()

```ts
toValues(): V[];
```

Defined in: [packages/utils/src/keyedMap.ts:142](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L142)

Returns all values as an array.

###### Returns

`V`[]

##### values()

```ts
values(): IterableIterator<V>;
```

Defined in: [packages/utils/src/keyedMap.ts:157](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L157)

###### Returns

`IterableIterator`\<`V`\>
