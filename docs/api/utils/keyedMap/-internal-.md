[@ls-stack/utils](../modules.md) / [keyedMap](index.md) / \<internal\>

# \<internal\>

## Functions

### clear()

```ts
function clear(): void;
```

Defined in: [packages/utils/src/keyedMap.ts:90](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L90)

Removes all entries from the map.

#### Returns

`void`

***

### delete()

```ts
function delete(key): boolean;
```

Defined in: [packages/utils/src/keyedMap.ts:73](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L73)

Removes the entry for the given key. Returns true if the entry was removed.

#### Parameters

##### key

`K`

#### Returns

`boolean`

***

### deleteMultiple()

```ts
function deleteMultiple(keys): number;
```

Defined in: [packages/utils/src/keyedMap.ts:79](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L79)

Removes multiple entries. Returns the number of entries removed.

#### Parameters

##### keys

`Iterable`\<`K`\>

#### Returns

`number`

***

### entries()

```ts
function entries(): IterableIterator<[K, V]>;
```

Defined in: [packages/utils/src/keyedMap.ts:169](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L169)

#### Returns

`IterableIterator`\<\[`K`, `V`\]\>

***

### find()

```ts
function find(predicate): 
  | {
  key: K;
  value: V;
}
  | undefined;
```

Defined in: [packages/utils/src/keyedMap.ts:105](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L105)

Finds the first entry matching the predicate.

#### Parameters

##### predicate

(`value`, `key`) => `boolean`

#### Returns

  \| \{
  `key`: `K`;
  `value`: `V`;
\}
  \| `undefined`

***

### forEach()

```ts
function forEach(callback, thisArg?): void;
```

Defined in: [packages/utils/src/keyedMap.ts:95](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L95)

Executes a callback for each entry in the map.

#### Parameters

##### callback

(`value`, `key`, `map`) => `void`

##### thisArg?

`unknown`

#### Returns

`void`

***

### get()

```ts
function get(key): V | undefined;
```

Defined in: [packages/utils/src/keyedMap.ts:61](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L61)

Gets the value for the given key, or undefined if not found.

#### Parameters

##### key

`K`

#### Returns

`V` \| `undefined`

***

### getOrInsert()

```ts
function getOrInsert(key, fallback): V;
```

Defined in: [packages/utils/src/keyedMap.ts:129](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L129)

Gets the value for the given key, or inserts and returns the fallback
value.

#### Parameters

##### key

`K`

##### fallback

() => `V`

#### Returns

`V`

***

### getOrThrow()

```ts
function getOrThrow(key): V;
```

Defined in: [packages/utils/src/keyedMap.ts:117](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L117)

Gets the value for the given key, or throws if not found.

#### Parameters

##### key

`K`

#### Returns

`V`

***

### has()

```ts
function has(key): boolean;
```

Defined in: [packages/utils/src/keyedMap.ts:67](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L67)

Checks if the map contains the given key.

#### Parameters

##### key

`K`

#### Returns

`boolean`

***

### keys()

```ts
function keys(): IterableIterator<K>;
```

Defined in: [packages/utils/src/keyedMap.ts:157](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L157)

#### Returns

`IterableIterator`\<`K`\>

***

### set()

```ts
function set(key, value): this;
```

Defined in: [packages/utils/src/keyedMap.ts:46](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L46)

Sets a value for the given key. If the key exists, replaces both key and
value.

#### Parameters

##### key

`K`

##### value

`V`

#### Returns

`this`

***

### setMultiple()

```ts
function setMultiple(entries): this;
```

Defined in: [packages/utils/src/keyedMap.ts:53](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L53)

Sets multiple entries at once.

#### Parameters

##### entries

`Iterable`\<\[`K`, `V`\]\>

#### Returns

`this`

***

### toFilteredValues()

```ts
function toFilteredValues(predicate): V[];
```

Defined in: [packages/utils/src/keyedMap.ts:137](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L137)

Returns values that match the predicate.

#### Parameters

##### predicate

(`value`, `key`) => `boolean`

#### Returns

`V`[]

***

### toKeys()

```ts
function toKeys(): K[];
```

Defined in: [packages/utils/src/keyedMap.ts:153](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L153)

Returns all keys as an array.

#### Returns

`K`[]

***

### toValues()

```ts
function toValues(): V[];
```

Defined in: [packages/utils/src/keyedMap.ts:148](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L148)

Returns all values as an array.

#### Returns

`V`[]

***

### values()

```ts
function values(): IterableIterator<V>;
```

Defined in: [packages/utils/src/keyedMap.ts:163](https://github.com/lucasols/utils/blob/main/packages/utils/src/keyedMap.ts#L163)

#### Returns

`IterableIterator`\<`V`\>
