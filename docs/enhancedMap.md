[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / enhancedMap

# enhancedMap

## Classes

### EnhancedMap\<K, V\>

Defined in: [src/enhancedMap.ts:5](https://github.com/lucasols/utils/blob/main/src/enhancedMap.ts#L5)

#### Extends

- `Map`\<`K`, `V`\>

#### Type Parameters

##### K

`K`

##### V

`V`

#### Constructors

##### Constructor

```ts
new EnhancedMap<K, V>(entries?): EnhancedMap<K, V>;
```

Defined in: node\_modules/.pnpm/typescript@5.7.3/node\_modules/typescript/lib/lib.es2015.collection.d.ts:50

###### Parameters

###### entries?

`null` | readonly readonly \[`K`, `V`\][]

###### Returns

[`EnhancedMap`](#enhancedmap)\<`K`, `V`\>

###### Inherited from

```ts
Map<K, V>.constructor
```

##### Constructor

```ts
new EnhancedMap<K, V>(iterable?): EnhancedMap<K, V>;
```

Defined in: node\_modules/.pnpm/typescript@5.7.3/node\_modules/typescript/lib/lib.es2015.collection.d.ts:49

###### Parameters

###### iterable?

`null` | `Iterable`\<readonly \[`K`, `V`\], `any`, `any`\>

###### Returns

[`EnhancedMap`](#enhancedmap)\<`K`, `V`\>

###### Inherited from

```ts
Map<K, V>.constructor
```

#### Methods

##### find()

```ts
find(predicate): 
  | undefined
  | {
  key: K;
  value: V;
};
```

Defined in: [src/enhancedMap.ts:6](https://github.com/lucasols/utils/blob/main/src/enhancedMap.ts#L6)

###### Parameters

###### predicate

(`value`, `key`) => `boolean`

###### Returns

  \| `undefined`
  \| \{
  `key`: `K`;
  `value`: `V`;
\}

##### getOrInsert()

```ts
getOrInsert(key, fallback): V;
```

Defined in: [src/enhancedMap.ts:44](https://github.com/lucasols/utils/blob/main/src/enhancedMap.ts#L44)

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

Defined in: [src/enhancedMap.ts:34](https://github.com/lucasols/utils/blob/main/src/enhancedMap.ts#L34)

###### Parameters

###### key

`K`

###### Returns

`V`

##### setMultiple()

###### Call Signature

```ts
setMultiple(values): this;
```

Defined in: [src/enhancedMap.ts:18](https://github.com/lucasols/utils/blob/main/src/enhancedMap.ts#L18)

###### Parameters

###### values

`Record`\<`K` & `string`, `V`\>

###### Returns

`this`

###### Call Signature

```ts
setMultiple(...values): this;
```

Defined in: [src/enhancedMap.ts:19](https://github.com/lucasols/utils/blob/main/src/enhancedMap.ts#L19)

###### Parameters

###### values

...\[`K`, `V`\][]

###### Returns

`this`

##### toFilteredValues()

```ts
toFilteredValues(predicate): V[];
```

Defined in: [src/enhancedMap.ts:52](https://github.com/lucasols/utils/blob/main/src/enhancedMap.ts#L52)

###### Parameters

###### predicate

(`value`, `key`) => `boolean`

###### Returns

`V`[]

##### toKeys()

```ts
toKeys(): K[];
```

Defined in: [src/enhancedMap.ts:104](https://github.com/lucasols/utils/blob/main/src/enhancedMap.ts#L104)

###### Returns

`K`[]

##### toMap()

```ts
toMap<T>(mapFunction): T[];
```

Defined in: [src/enhancedMap.ts:64](https://github.com/lucasols/utils/blob/main/src/enhancedMap.ts#L64)

###### Type Parameters

###### T

`T`

###### Parameters

###### mapFunction

(`value`, `key`, `reject`) => *typeof* [`enhancedMapReject`](#enhancedmapreject) \| `T`

###### Returns

`T`[]

##### toObjMap()

```ts
toObjMap<ObjKey, ObjValue>(mapFunction): Record<ObjKey, ObjValue>;
```

Defined in: [src/enhancedMap.ts:84](https://github.com/lucasols/utils/blob/main/src/enhancedMap.ts#L84)

###### Type Parameters

###### ObjKey

`ObjKey` *extends* `PropertyKey`

###### ObjValue

`ObjValue`

###### Parameters

###### mapFunction

(`value`, `key`) => `false` \| \[`ObjKey`, `ObjValue`\]

###### Returns

`Record`\<`ObjKey`, `ObjValue`\>

##### toValues()

```ts
toValues(): V[];
```

Defined in: [src/enhancedMap.ts:100](https://github.com/lucasols/utils/blob/main/src/enhancedMap.ts#L100)

###### Returns

`V`[]

##### from()

###### Call Signature

```ts
static from<T, K>(array, key): EnhancedMap<T[K], T>;
```

Defined in: [src/enhancedMap.ts:108](https://github.com/lucasols/utils/blob/main/src/enhancedMap.ts#L108)

###### Type Parameters

###### T

`T` *extends* `Record`\<`string`, `unknown`\>

###### K

`K` *extends* `string` \| `number` \| `symbol`

###### Parameters

###### array

`undefined` | `null` | `Iterable`\<`T`, `any`, `any`\> | `T`[]

###### key

`K`

###### Returns

[`EnhancedMap`](#enhancedmap)\<`T`\[`K`\], `T`\>

###### Call Signature

```ts
static from<T, K, V>(array, mapFunction): EnhancedMap<K, V>;
```

Defined in: [src/enhancedMap.ts:112](https://github.com/lucasols/utils/blob/main/src/enhancedMap.ts#L112)

###### Type Parameters

###### T

`T`

###### K

`K`

###### V

`V`

###### Parameters

###### array

`undefined` | `null` | `T`[] | `Iterable`\<`T`, `any`, `any`\>

###### mapFunction

(`item`) => `false` \| \[`K`, `V`\]

###### Returns

[`EnhancedMap`](#enhancedmap)\<`K`, `V`\>

## Variables

### enhancedMapReject

```ts
const enhancedMapReject: typeof enhancedMapReject;
```

Defined in: [src/enhancedMap.ts:3](https://github.com/lucasols/utils/blob/main/src/enhancedMap.ts#L3)
