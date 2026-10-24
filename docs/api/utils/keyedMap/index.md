[@ls-stack/utils](../modules.md) / keyedMap

# keyedMap

## Modules

- [\<internal\>](-internal-.md)

## Classes

### CompositeKeyMap\<K, V\>

Defined in: [packages/utils/src/keyedMap.ts:189](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L189)

A Map that compares keys by value instead of reference. Uses
`getCompositeKey` to generate a stable string key for any value.

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

Defined in: [packages/utils/src/keyedMap.ts:190](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L190)

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

Defined in: [packages/utils/src/keyedMap.ts:175](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L175)

###### Returns

`IterableIterator`\<\[`K`, `V`\]\>

###### Inherited from

[`KeyedMap`](#keyedmap).[`[iterator]`](#iterator-2)

##### clear()

```ts
clear(): void;
```

Defined in: [packages/utils/src/keyedMap.ts:90](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L90)

Removes all entries from the map.

###### Returns

`void`

###### Inherited from

```ts
KeyedMap.clear
```

##### delete()

```ts
delete(key): boolean;
```

Defined in: [packages/utils/src/keyedMap.ts:73](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L73)

Removes the entry for the given key. Returns true if the entry was removed.

###### Parameters

###### key

`K`

###### Returns

`boolean`

###### Inherited from

```ts
KeyedMap.delete
```

##### deleteMultiple()

```ts
deleteMultiple(keys): number;
```

Defined in: [packages/utils/src/keyedMap.ts:79](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L79)

Removes multiple entries. Returns the number of entries removed.

###### Parameters

###### keys

`Iterable`\<`K`\>

###### Returns

`number`

###### Inherited from

```ts
KeyedMap.deleteMultiple
```

##### entries()

```ts
entries(): IterableIterator<[K, V]>;
```

Defined in: [packages/utils/src/keyedMap.ts:169](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L169)

###### Returns

`IterableIterator`\<\[`K`, `V`\]\>

###### Inherited from

```ts
KeyedMap.entries
```

##### find()

```ts
find(predicate): 
  | {
  key: K;
  value: V;
}
  | undefined;
```

Defined in: [packages/utils/src/keyedMap.ts:105](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L105)

Finds the first entry matching the predicate.

###### Parameters

###### predicate

(`value`, `key`) => `boolean`

###### Returns

  \| \{
  `key`: `K`;
  `value`: `V`;
\}
  \| `undefined`

###### Inherited from

```ts
KeyedMap.find
```

##### forEach()

```ts
forEach(callback, thisArg?): void;
```

Defined in: [packages/utils/src/keyedMap.ts:95](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L95)

Executes a callback for each entry in the map.

###### Parameters

###### callback

(`value`, `key`, `map`) => `void`

###### thisArg?

`unknown`

###### Returns

`void`

###### Inherited from

```ts
KeyedMap.forEach
```

##### get()

```ts
get(key): V | undefined;
```

Defined in: [packages/utils/src/keyedMap.ts:61](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L61)

Gets the value for the given key, or undefined if not found.

###### Parameters

###### key

`K`

###### Returns

`V` \| `undefined`

###### Inherited from

```ts
KeyedMap.get
```

##### getOrInsert()

```ts
getOrInsert(key, fallback): V;
```

Defined in: [packages/utils/src/keyedMap.ts:129](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L129)

Gets the value for the given key, or inserts and returns the fallback
value.

###### Parameters

###### key

`K`

###### fallback

() => `V`

###### Returns

`V`

###### Inherited from

```ts
KeyedMap.getOrInsert
```

##### getOrThrow()

```ts
getOrThrow(key): V;
```

Defined in: [packages/utils/src/keyedMap.ts:117](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L117)

Gets the value for the given key, or throws if not found.

###### Parameters

###### key

`K`

###### Returns

`V`

###### Inherited from

```ts
KeyedMap.getOrThrow
```

##### has()

```ts
has(key): boolean;
```

Defined in: [packages/utils/src/keyedMap.ts:67](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L67)

Checks if the map contains the given key.

###### Parameters

###### key

`K`

###### Returns

`boolean`

###### Inherited from

```ts
KeyedMap.has
```

##### keys()

```ts
keys(): IterableIterator<K>;
```

Defined in: [packages/utils/src/keyedMap.ts:157](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L157)

###### Returns

`IterableIterator`\<`K`\>

###### Inherited from

```ts
KeyedMap.keys
```

##### set()

```ts
set(key, value): this;
```

Defined in: [packages/utils/src/keyedMap.ts:46](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L46)

Sets a value for the given key. If the key exists, replaces both key and
value.

###### Parameters

###### key

`K`

###### value

`V`

###### Returns

`this`

###### Inherited from

```ts
KeyedMap.set
```

##### setMultiple()

```ts
setMultiple(entries): this;
```

Defined in: [packages/utils/src/keyedMap.ts:53](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L53)

Sets multiple entries at once.

###### Parameters

###### entries

`Iterable`\<\[`K`, `V`\]\>

###### Returns

`this`

###### Inherited from

```ts
KeyedMap.setMultiple
```

##### toFilteredValues()

```ts
toFilteredValues(predicate): V[];
```

Defined in: [packages/utils/src/keyedMap.ts:137](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L137)

Returns values that match the predicate.

###### Parameters

###### predicate

(`value`, `key`) => `boolean`

###### Returns

`V`[]

###### Inherited from

```ts
KeyedMap.toFilteredValues
```

##### toKeys()

```ts
toKeys(): K[];
```

Defined in: [packages/utils/src/keyedMap.ts:153](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L153)

Returns all keys as an array.

###### Returns

`K`[]

###### Inherited from

```ts
KeyedMap.toKeys
```

##### toValues()

```ts
toValues(): V[];
```

Defined in: [packages/utils/src/keyedMap.ts:148](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L148)

Returns all values as an array.

###### Returns

`V`[]

###### Inherited from

```ts
KeyedMap.toValues
```

##### values()

```ts
values(): IterableIterator<V>;
```

Defined in: [packages/utils/src/keyedMap.ts:163](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L163)

###### Returns

`IterableIterator`\<`V`\>

###### Inherited from

```ts
KeyedMap.values
```

***

### KeyedMap\<K, V, InternalKey\>

Defined in: [packages/utils/src/keyedMap.ts:18](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L18)

A Map implementation that uses a custom key function to determine key
equality. Keys with the same computed internal key are considered equal.

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

Defined in: [packages/utils/src/keyedMap.ts:175](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L175)

###### Returns

`IterableIterator`\<\[`K`, `V`\]\>

##### clear()

```ts
clear(): void;
```

Defined in: [packages/utils/src/keyedMap.ts:90](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L90)

Removes all entries from the map.

###### Returns

`void`

##### delete()

```ts
delete(key): boolean;
```

Defined in: [packages/utils/src/keyedMap.ts:73](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L73)

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

Defined in: [packages/utils/src/keyedMap.ts:79](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L79)

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

Defined in: [packages/utils/src/keyedMap.ts:169](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L169)

###### Returns

`IterableIterator`\<\[`K`, `V`\]\>

##### find()

```ts
find(predicate): 
  | {
  key: K;
  value: V;
}
  | undefined;
```

Defined in: [packages/utils/src/keyedMap.ts:105](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L105)

Finds the first entry matching the predicate.

###### Parameters

###### predicate

(`value`, `key`) => `boolean`

###### Returns

  \| \{
  `key`: `K`;
  `value`: `V`;
\}
  \| `undefined`

##### forEach()

```ts
forEach(callback, thisArg?): void;
```

Defined in: [packages/utils/src/keyedMap.ts:95](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L95)

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
get(key): V | undefined;
```

Defined in: [packages/utils/src/keyedMap.ts:61](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L61)

Gets the value for the given key, or undefined if not found.

###### Parameters

###### key

`K`

###### Returns

`V` \| `undefined`

##### getOrInsert()

```ts
getOrInsert(key, fallback): V;
```

Defined in: [packages/utils/src/keyedMap.ts:129](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L129)

Gets the value for the given key, or inserts and returns the fallback
value.

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

Defined in: [packages/utils/src/keyedMap.ts:117](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L117)

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

Defined in: [packages/utils/src/keyedMap.ts:67](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L67)

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

Defined in: [packages/utils/src/keyedMap.ts:157](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L157)

###### Returns

`IterableIterator`\<`K`\>

##### set()

```ts
set(key, value): this;
```

Defined in: [packages/utils/src/keyedMap.ts:46](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L46)

Sets a value for the given key. If the key exists, replaces both key and
value.

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

Defined in: [packages/utils/src/keyedMap.ts:53](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L53)

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

Defined in: [packages/utils/src/keyedMap.ts:137](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L137)

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

Defined in: [packages/utils/src/keyedMap.ts:153](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L153)

Returns all keys as an array.

###### Returns

`K`[]

##### toValues()

```ts
toValues(): V[];
```

Defined in: [packages/utils/src/keyedMap.ts:148](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L148)

Returns all values as an array.

###### Returns

`V`[]

##### values()

```ts
values(): IterableIterator<V>;
```

Defined in: [packages/utils/src/keyedMap.ts:163](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L163)

###### Returns

`IterableIterator`\<`V`\>
