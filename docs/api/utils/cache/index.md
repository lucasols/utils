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

Defined in: [packages/utils/src/cache.ts:50](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L50)

###### Parameters

###### value

`T`

The value to store in the cache.

###### expiration

[`DurationObj`](../time.md#durationobj)

The expiration time of the value in seconds or a
  duration object.

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

Defined in: [packages/utils/src/cache.ts:81](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L81)

#### Type Parameters

##### T

`T`

#### Properties

#####  cache

```ts
 cache: object;
```

Defined in: [packages/utils/src/cache.ts:101](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L101)

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

Defined in: [packages/utils/src/cache.ts:95](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L95)

###### Returns

`void`

##### clear()

```ts
clear: () => void;
```

Defined in: [packages/utils/src/cache.ts:92](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L92)

###### Returns

`void`

##### get()

```ts
get: (cacheKey) => T | undefined;
```

Defined in: [packages/utils/src/cache.ts:93](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L93)

###### Parameters

###### cacheKey

`string`

###### Returns

`T` \| `undefined`

##### getAsync()

```ts
getAsync: (cacheKey) => Promise<T | undefined>;
```

Defined in: [packages/utils/src/cache.ts:96](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L96)

###### Parameters

###### cacheKey

`string`

###### Returns

`Promise`\<`T` \| `undefined`\>

##### getOrInsert()

```ts
getOrInsert: (cacheKey, val, options?) => T;
```

Defined in: [packages/utils/src/cache.ts:82](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L82)

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

Defined in: [packages/utils/src/cache.ts:87](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L87)

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

Defined in: [packages/utils/src/cache.ts:94](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L94)

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

Defined in: [packages/utils/src/cache.ts:97](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L97)

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

Defined in: [packages/utils/src/cache.ts:106](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L106)

#### Type Parameters

##### T

`T`

#### Parameters

##### \_\_namedParameters

[`Options`](-internal-.md#options) = `{}`

#### Returns

[`Cache`](#cache)\<`T`\>
