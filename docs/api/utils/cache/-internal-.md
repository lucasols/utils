[@ls-stack/utils](../modules.md) / [cache](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### GetOptions\<T\>

```ts
type GetOptions<T> = object;
```

Defined in: [packages/utils/src/cache.ts:69](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L69)

#### Type Parameters

##### T

`T`

#### Properties

##### skipCachingWhen()?

```ts
optional skipCachingWhen: (value) => boolean;
```

Defined in: [packages/utils/src/cache.ts:78](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L78)

A function that determines whether a value should be rejected from being
cached. If the function returns true, the value will be returned but not
cached.

###### Parameters

###### value

`T`

The value to check

###### Returns

`boolean`

True if the value should be rejected, false otherwise

***

### Options

```ts
type Options = object;
```

Defined in: [packages/utils/src/cache.ts:15](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L15)

#### Properties

##### expirationThrottle?

```ts
optional expirationThrottle: number;
```

Defined in: [packages/utils/src/cache.ts:30](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L30)

The throttle for checking expired items in milliseconds.

###### Default

```ts
10_000
```

##### maxCacheSize?

```ts
optional maxCacheSize: number;
```

Defined in: [packages/utils/src/cache.ts:21](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L21)

The maximum number of items in the cache.

###### Default

```ts
1000
```

##### maxItemAge?

```ts
optional maxItemAge: DurationObj;
```

Defined in: [packages/utils/src/cache.ts:23](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L23)

The maximum age of items in the cache.

***

### Utils\<T\>

```ts
type Utils<T> = object;
```

Defined in: [packages/utils/src/cache.ts:56](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L56)

#### Type Parameters

##### T

`T`

#### Properties

##### skipCaching()

```ts
skipCaching: (value) => SkipCaching<T>;
```

Defined in: [packages/utils/src/cache.ts:57](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L57)

###### Parameters

###### value

`T`

###### Returns

[`SkipCaching`](index.md#skipcaching)\<`T`\>

##### withExpiration()

```ts
withExpiration: (value, expiration) => WithExpiration<T>;
```

Defined in: [packages/utils/src/cache.ts:66](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L66)

Create a new WithExpiration object with the given value and expiration
time.

###### Parameters

###### value

`T`

The value to store in the cache.

###### expiration

[`DurationObj`](../time.md#durationobj)

The expiration time of the value in seconds or a
  duration object.

###### Returns

[`WithExpiration`](index.md#withexpiration)\<`T`\>
