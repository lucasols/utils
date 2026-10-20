[@ls-stack/utils](modules.md) / enhancedMap

# enhancedMap

## Classes

### EnhancedMap\<K, V\>

Defined in: [packages/utils/src/enhancedMap.ts:5](https://github.com/lucasols/utils/blob/main/packages/utils/src/enhancedMap.ts#L5)

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

Defined in: node\_modules/.pnpm/typescript@6.0.3/node\_modules/typescript/lib/lib.es2015.collection.d.ts:51

###### Parameters

###### entries?

readonly readonly \[`K`, `V`\][] | `null`

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

Defined in: node\_modules/.pnpm/typescript@6.0.3/node\_modules/typescript/lib/lib.es2015.collection.d.ts:50

###### Parameters

###### iterable?

`Iterable`\<readonly \[`K`, `V`\], `any`, `any`\> | `null`

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
  | {
  key: K;
  value: V;
}
  | undefined;
```

Defined in: [packages/utils/src/enhancedMap.ts:6](https://github.com/lucasols/utils/blob/main/packages/utils/src/enhancedMap.ts#L6)

###### Parameters

###### predicate

(`value`, `key`) => `boolean`

###### Returns

  \| \{
  `key`: `K`;
  `value`: `V`;
\}
  \| `undefined`

##### getOrSet()

```ts
getOrSet(key, fallback): V;
```

Defined in: [packages/utils/src/enhancedMap.ts:44](https://github.com/lucasols/utils/blob/main/packages/utils/src/enhancedMap.ts#L44)

###### Parameters

###### key

`K`

###### fallback

(`key`) => `V`

###### Returns

`V`

##### getOrThrow()

```ts
getOrThrow(key): V;
```

Defined in: [packages/utils/src/enhancedMap.ts:34](https://github.com/lucasols/utils/blob/main/packages/utils/src/enhancedMap.ts#L34)

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

Defined in: [packages/utils/src/enhancedMap.ts:18](https://github.com/lucasols/utils/blob/main/packages/utils/src/enhancedMap.ts#L18)

###### Parameters

###### values

`Record`\<`K` & `string`, `V`\>

###### Returns

`this`

###### Call Signature

```ts
setMultiple(...values): this;
```

Defined in: [packages/utils/src/enhancedMap.ts:19](https://github.com/lucasols/utils/blob/main/packages/utils/src/enhancedMap.ts#L19)

###### Parameters

###### values

...\[`K`, `V`\][]

###### Returns

`this`

##### toFilteredValues()

```ts
toFilteredValues(predicate): V[];
```

Defined in: [packages/utils/src/enhancedMap.ts:54](https://github.com/lucasols/utils/blob/main/packages/utils/src/enhancedMap.ts#L54)

###### Parameters

###### predicate

(`value`, `key`) => `boolean`

###### Returns

`V`[]

##### toKeys()

```ts
toKeys(): K[];
```

Defined in: [packages/utils/src/enhancedMap.ts:106](https://github.com/lucasols/utils/blob/main/packages/utils/src/enhancedMap.ts#L106)

###### Returns

`K`[]

##### toMap()

```ts
toMap<T>(mapFunction): T[];
```

Defined in: [packages/utils/src/enhancedMap.ts:66](https://github.com/lucasols/utils/blob/main/packages/utils/src/enhancedMap.ts#L66)

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

Defined in: [packages/utils/src/enhancedMap.ts:86](https://github.com/lucasols/utils/blob/main/packages/utils/src/enhancedMap.ts#L86)

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

Defined in: [packages/utils/src/enhancedMap.ts:102](https://github.com/lucasols/utils/blob/main/packages/utils/src/enhancedMap.ts#L102)

###### Returns

`V`[]

##### from()

###### Call Signature

```ts
static from<T, K>(array, key): EnhancedMap<T[K], T>;
```

Defined in: [packages/utils/src/enhancedMap.ts:110](https://github.com/lucasols/utils/blob/main/packages/utils/src/enhancedMap.ts#L110)

###### Type Parameters

###### T

`T` *extends* `Record`\<`string`, `unknown`\>

###### K

`K` *extends* `string` \| `number` \| `symbol`

###### Parameters

###### array

`Iterable`\<`T`, `any`, `any`\> | `T`[] | `null` | `undefined`

###### key

`K`

###### Returns

[`EnhancedMap`](#enhancedmap)\<`T`\[`K`\], `T`\>

###### Call Signature

```ts
static from<T, K, V>(array, mapFunction): EnhancedMap<K, V>;
```

Defined in: [packages/utils/src/enhancedMap.ts:114](https://github.com/lucasols/utils/blob/main/packages/utils/src/enhancedMap.ts#L114)

###### Type Parameters

###### T

`T`

###### K

`K`

###### V

`V`

###### Parameters

###### array

`T`[] | `Iterable`\<`T`, `any`, `any`\> | `null` | `undefined`

###### mapFunction

(`item`) => `false` \| \[`K`, `V`\]

###### Returns

[`EnhancedMap`](#enhancedmap)\<`K`, `V`\>

## Variables

### enhancedMapReject

```ts
const enhancedMapReject: typeof enhancedMapReject;
```

Defined in: [packages/utils/src/enhancedMap.ts:3](https://github.com/lucasols/utils/blob/main/packages/utils/src/enhancedMap.ts#L3)
