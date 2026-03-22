[@ls-stack/utils](../modules.md) / cache

# cache

## Modules

- [\<internal\>](-internal-.md)

## Classes

### SkipCaching\<T\>

Defined in: [packages/utils/src/cache.ts:66](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L66)

Wrapper class that prevents a value from being cached. When returned from a
cache computation function, the value will be returned to the caller but not
stored in the cache.

#### Example

```ts
const cache = createCache<string>();
  const result = cache.getOrInsert('dynamic', ({ skipCaching }) => {
    const data = generateData();
    if (data.isTemporary) {
      return skipCaching(data); // Won't be cached
    }
    return data; // Will be cached
  });
```

#### Type Parameters

##### T

`T`

#### Constructors

##### Constructor

```ts
new SkipCaching<T>(value): SkipCaching<T>;
```

Defined in: [packages/utils/src/cache.ts:69](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L69)

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

Defined in: [packages/utils/src/cache.ts:67](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L67)

***

### WithExpiration\<T\>

Defined in: [packages/utils/src/cache.ts:93](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L93)

Wrapper class that sets a custom expiration time for a cached value. Allows
individual cache entries to have different expiration times than the default
cache expiration.

#### Example

```ts
const cache = createCache<string>({ maxItemAge: { hours: 1 } }); // Default 1 hour

  const result = cache.getOrInsert('short-lived', ({ withExpiration }) => {
    return withExpiration('temporary data', { minutes: 5 }); // Expires in 5 minutes
  });

  const longLived = cache.getOrInsert(
    'long-lived',
    ({ withExpiration }) => {
      return withExpiration('persistent data', { days: 1 }); // Expires in 1 day
    },
  );
```

#### Type Parameters

##### T

`T`

#### Constructors

##### Constructor

```ts
new WithExpiration<T>(value, expiration): WithExpiration<T>;
```

Defined in: [packages/utils/src/cache.ts:102](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L102)

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

Defined in: [packages/utils/src/cache.ts:95](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L95)

##### value

```ts
value: T;
```

Defined in: [packages/utils/src/cache.ts:94](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L94)

## Type Aliases

### Cache\<T\>

```ts
type Cache<T> = object;
```

Defined in: [packages/utils/src/cache.ts:133](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L133)

#### Type Parameters

##### T

`T`

#### Properties

#####  cache

```ts
 cache: object;
```

Defined in: [packages/utils/src/cache.ts:157](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L157)

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

Defined in: [packages/utils/src/cache.ts:150](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L150)

###### Returns

`void`

##### clear()

```ts
clear: () => void;
```

Defined in: [packages/utils/src/cache.ts:144](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L144)

###### Returns

`void`

##### clone()

```ts
clone: () => Cache<T>;
```

Defined in: [packages/utils/src/cache.ts:156](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L156)

###### Returns

[`Cache`](#cache)\<`T`\>

##### delete()

```ts
delete: (...cacheKeys) => void;
```

Defined in: [packages/utils/src/cache.ts:145](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L145)

###### Parameters

###### cacheKeys

...`string`[]

###### Returns

`void`

##### get()

```ts
get: (cacheKey) => T | undefined;
```

Defined in: [packages/utils/src/cache.ts:148](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L148)

###### Parameters

###### cacheKey

`string`

###### Returns

`T` \| `undefined`

##### getAsync()

```ts
getAsync: (cacheKey) => Promise<T | undefined>;
```

Defined in: [packages/utils/src/cache.ts:151](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L151)

###### Parameters

###### cacheKey

`string`

###### Returns

`Promise`\<`T` \| `undefined`\>

##### getOrInsert()

```ts
getOrInsert: (cacheKey, val, options?) => T;
```

Defined in: [packages/utils/src/cache.ts:134](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L134)

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

Defined in: [packages/utils/src/cache.ts:139](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L139)

###### Parameters

###### cacheKey

`string`

###### val

(`utils`) => `Promise`\<`T` \| [`SkipCaching`](#skipcaching)\<`T`\>\>

###### options?

[`GetOptions`](-internal-.md#getoptions)\<`T`\>

###### Returns

`Promise`\<`T`\>

##### has()

```ts
has: (cacheKey) => boolean;
```

Defined in: [packages/utils/src/cache.ts:146](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L146)

###### Parameters

###### cacheKey

`string`

###### Returns

`boolean`

##### set()

```ts
set: (cacheKey, value) => void;
```

Defined in: [packages/utils/src/cache.ts:149](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L149)

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

Defined in: [packages/utils/src/cache.ts:152](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L152)

###### Parameters

###### cacheKey

`string`

###### value

(`utils`) => `Promise`\<`T` \| [`WithExpiration`](#withexpiration)\<`T`\>\>

###### Returns

`Promise`\<`T`\>

##### size

```ts
size: number;
```

Defined in: [packages/utils/src/cache.ts:147](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L147)

## Functions

### cachedGetter()

```ts
function cachedGetter<T>(getter): object;
```

Defined in: [packages/utils/src/cache.ts:21](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L21)

Creates a cached getter that only calls the provided function once. The first
access computes and caches the value; subsequent accesses return the cached
result. This is useful for lazy initialization of expensive computations.

#### Type Parameters

##### T

`T`

#### Parameters

##### getter

() => `T`

Function that computes the value to cache

#### Returns

`object`

Object with a `value` property that caches the result

##### value

```ts
value: T;
```

#### Example

```ts
const expensive = cachedGetter(() => {
    console.log('Computing...');
    return heavyComputation();
  });

  console.log(expensive.value); // Logs "Computing..." and returns result
  console.log(expensive.value); // Returns cached result without logging
  console.log(expensive.value); // Returns cached result without logging
```

***

### createCache()

```ts
function createCache<T>(cacheOptions): Cache<T>;
```

Defined in: [packages/utils/src/cache.ts:226](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L226)

Creates a full-featured cache with time-based expiration, async support, and
advanced features. This is a more powerful alternative to `fastCache` when
you need expiration, async operations, or advanced caching strategies.

#### Type Parameters

##### T

`T`

#### Parameters

##### cacheOptions

[`Options`](-internal-.md#options) = `{}`

Configuration options for the cache

#### Returns

[`Cache`](#cache)\<`T`\>

A cache instance with various methods for storing and retrieving
  values

#### Example

```ts
// Basic usage with expiration
  const cache = createCache<string>({
    maxCacheSize: 100,
    maxItemAge: { minutes: 5 },
  });

  // Simple caching
  const result = cache.getOrInsert('user:123', () => {
    return fetchUserFromDatabase('123');
  });

  // Async caching with promise deduplication
  const asyncResult = await cache.getOrInsertAsync(
    'api:data',
    async () => {
      return await fetchFromApi('/data');
    },
  );

  // Skip caching for certain values
  const value = cache.getOrInsert('dynamic', ({ skipCaching }) => {
    const data = generateDynamicData();
    if (data.shouldNotCache) {
      return skipCaching(data); // Won't be cached
    }
    return data;
  });

  // Custom expiration per item
  const shortLivedValue = cache.getOrInsert(
    'temp',
    ({ withExpiration }) => {
      return withExpiration('temporary data', { seconds: 30 });
    },
  );

  // Conditional caching based on the computed value
  const result = cache.getOrInsert(
    'conditional',
    () => {
      return computeValue();
    },
    {
      skipCachingWhen: (value) => value === null || value.error,
    },
  );
```

***

### fastCache()

```ts
function fastCache<T>(fastCacheOptions): object;
```

Defined in: [packages/utils/src/cache.ts:609](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L609)

Creates a simple, fast cache with FIFO (First In, First Out) eviction policy.
This is a lightweight alternative to `createCache` for basic caching needs
without expiration, async support, or advanced features.

#### Type Parameters

##### T

`T`

#### Parameters

##### fastCacheOptions

[`FastCacheOptions`](-internal-.md#fastcacheoptions) = `{}`

Configuration options for the cache

#### Returns

An object with cache methods

##### clear()

```ts
clear: () => void;
```

Clears all cached values

###### Returns

`void`

##### delete()

```ts
delete: (...cacheKeys) => void;
```

Removes one or more items from the cache.

###### Parameters

###### cacheKeys

...`string`[]

Keys of the items to remove

###### Returns

`void`

##### get()

```ts
get: (cacheKey) => undefined | T;
```

Gets a value from the cache without computing it if missing.

###### Parameters

###### cacheKey

`string`

Key to look up in the cache

###### Returns

`undefined` \| `T`

The cached value or undefined if not found

##### getOrInsert()

```ts
getOrInsert: (cacheKey, val) => T;
```

Gets a value from the cache or computes and stores it if not present.

###### Parameters

###### cacheKey

`string`

The key to store/retrieve the value under

###### val

() => `T`

Function that computes the value if not cached

###### Returns

`T`

The cached or newly computed value

##### has()

```ts
has: (cacheKey) => boolean;
```

Checks whether an item exists for the given key.

###### Parameters

###### cacheKey

`string`

Key to check

###### Returns

`boolean`

True if the entry exists

##### size

###### Get Signature

```ts
get size(): number;
```

The number of items currently in the cache.

###### Returns

`number`

##### clone()

```ts
clone(): { getOrInsert: (cacheKey: string, val: () => T) => T; clear: () => void; delete: (...cacheKeys: string[]) => void; has: (cacheKey: string) => boolean; get: (cacheKey: string) => T | undefined; readonly size: number; clone(): ...; " cache": Map<...>; };
```

Creates an independent copy of this cache with the same options.

###### Returns

\{ getOrInsert: (cacheKey: string, val: () =\> T) =\> T; clear: () =\> void; delete: (...cacheKeys: string\[\]) =\> void; has: (cacheKey: string) =\> boolean; get: (cacheKey: string) =\> T \| undefined; readonly size: number; clone(): ...; " cache": Map\<...\>; \}

#### Example

```ts
const cache = fastCache<string>({ maxCacheSize: 100 });

  // Cache expensive computation
  const result = cache.getOrInsert('user:123', () => {
    return fetchUserFromDatabase('123');
  });

  // Subsequent calls return cached value without re-computation
  const cachedResult = cache.getOrInsert('user:123', () => {
    return fetchUserFromDatabase('123'); // Won't be called
  });

  // Clear all cached values
  cache.clear();
```
