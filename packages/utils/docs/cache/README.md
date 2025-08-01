[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / cache

# cache

## Modules

- [\<internal\>](-internal-.md)

## Classes

### SkipCaching\<T\>

Defined in: [packages/utils/src/cache.ts:33](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L33)

#### Type Parameters

##### T

`T`

#### Constructors

##### Constructor

```ts
new SkipCaching<T>(value): SkipCaching<T>;
```

Defined in: [packages/utils/src/cache.ts:36](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L36)

###### Parameters

###### value

`T`

###### Returns

[`SkipCaching`](#skipcaching)\<`T`\>

#### Properties

##### value

```ts
value: T;
```

Defined in: [packages/utils/src/cache.ts:34](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L34)

***

### WithExpiration\<T\>

Defined in: [packages/utils/src/cache.ts:41](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L41)

#### Type Parameters

##### T

`T`

#### Constructors

##### Constructor

```ts
new WithExpiration<T>(value, expiration): WithExpiration<T>;
```

Defined in: [packages/utils/src/cache.ts:49](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L49)

###### Parameters

###### value

`T`

The value to store in the cache.

###### expiration

[`DurationObj`](../time.md#durationobj)

The expiration time of the value in seconds or a duration object.

###### Returns

[`WithExpiration`](#withexpiration)\<`T`\>

#### Properties

##### expiration

```ts
expiration: number;
```

Defined in: [packages/utils/src/cache.ts:43](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L43)

##### value

```ts
value: T;
```

Defined in: [packages/utils/src/cache.ts:42](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L42)

## Type Aliases

### Cache\<T\>

```ts
type Cache<T> = object;
```

Defined in: [packages/utils/src/cache.ts:75](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L75)

#### Type Parameters

##### T

`T`

#### Properties

#####  cache

```ts
 cache: object;
```

Defined in: [packages/utils/src/cache.ts:95](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L95)

###### map

```ts
map: Map<string, {
  timestamp: number;
  value: T | Promise<T>;
}>;
```

##### cleanExpiredItems()

```ts
cleanExpiredItems: () => void;
```

Defined in: [packages/utils/src/cache.ts:89](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L89)

###### Returns

`void`

##### clear()

```ts
clear: () => void;
```

Defined in: [packages/utils/src/cache.ts:86](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L86)

###### Returns

`void`

##### get()

```ts
get: (cacheKey) => T | undefined;
```

Defined in: [packages/utils/src/cache.ts:87](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L87)

###### Parameters

###### cacheKey

`string`

###### Returns

`T` \| `undefined`

##### getAsync()

```ts
getAsync: (cacheKey) => Promise<T | undefined>;
```

Defined in: [packages/utils/src/cache.ts:90](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L90)

###### Parameters

###### cacheKey

`string`

###### Returns

`Promise`\<`T` \| `undefined`\>

##### getOrInsert()

```ts
getOrInsert: (cacheKey, val, options?) => T;
```

Defined in: [packages/utils/src/cache.ts:76](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L76)

###### Parameters

###### cacheKey

`string`

###### val

(`utils`) => `T` \| [`SkipCaching`](#skipcaching)\<`T`\>

###### options?

[`GetOptions`](-internal-.md#getoptions)\<`T`\>

###### Returns

`T`

##### getOrInsertAsync()

```ts
getOrInsertAsync: (cacheKey, val, options?) => Promise<T>;
```

Defined in: [packages/utils/src/cache.ts:81](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L81)

###### Parameters

###### cacheKey

`string`

###### val

(`utils`) => `Promise`\<`T` \| [`SkipCaching`](#skipcaching)\<`T`\>\>

###### options?

[`GetOptions`](-internal-.md#getoptions)\<`T`\>

###### Returns

`Promise`\<`T`\>

##### set()

```ts
set: (cacheKey, value) => void;
```

Defined in: [packages/utils/src/cache.ts:88](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L88)

###### Parameters

###### cacheKey

`string`

###### value

`T` | [`WithExpiration`](#withexpiration)\<`T`\>

###### Returns

`void`

##### setAsync()

```ts
setAsync: (cacheKey, value) => Promise<T>;
```

Defined in: [packages/utils/src/cache.ts:91](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L91)

###### Parameters

###### cacheKey

`string`

###### value

(`utils`) => `Promise`\<`T` \| [`WithExpiration`](#withexpiration)\<`T`\>\>

###### Returns

`Promise`\<`T`\>

## Functions

### cachedGetter()

```ts
function cachedGetter<T>(getter): object;
```

Defined in: [packages/utils/src/cache.ts:3](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L3)

#### Type Parameters

##### T

`T`

#### Parameters

##### getter

() => `T`

#### Returns

`object`

##### value

```ts
value: T;
```

***

### createCache()

```ts
function createCache<T>(__namedParameters): Cache<T>;
```

Defined in: [packages/utils/src/cache.ts:100](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L100)

#### Type Parameters

##### T

`T`

#### Parameters

##### \_\_namedParameters

[`Options`](-internal-.md#options) = `{}`

#### Returns

[`Cache`](#cache)\<`T`\>
