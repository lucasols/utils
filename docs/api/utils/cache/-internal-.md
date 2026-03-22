[@ls-stack/utils](../modules.md) / [cache](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### FastCacheOptions

```ts
type FastCacheOptions = object;
```

Defined in: [packages/utils/src/cache.ts:562](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L562)

#### Properties

##### maxCacheSize?

```ts
optional maxCacheSize: number;
```

Defined in: [packages/utils/src/cache.ts:562](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L562)

***

### GetOptions\<T\>

```ts
type GetOptions<T> = object;
```

Defined in: [packages/utils/src/cache.ts:121](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L121)

#### Type Parameters

##### T

`T`

#### Properties

##### skipCachingWhen()?

```ts
optional skipCachingWhen: (value) => boolean;
```

Defined in: [packages/utils/src/cache.ts:130](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L130)

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

Defined in: [packages/utils/src/cache.ts:33](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L33)

#### Properties

##### expirationThrottle?

```ts
optional expirationThrottle: number;
```

Defined in: [packages/utils/src/cache.ts:48](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L48)

The throttle for checking expired items in milliseconds.

###### Default

```ts
10_000
```

##### maxCacheSize?

```ts
optional maxCacheSize: number;
```

Defined in: [packages/utils/src/cache.ts:39](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L39)

The maximum number of items in the cache.

###### Default

```ts
1000
```

##### maxItemAge?

```ts
optional maxItemAge: DurationObj;
```

Defined in: [packages/utils/src/cache.ts:41](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L41)

The maximum age of items in the cache.

***

### Utils\<T\>

```ts
type Utils<T> = object;
```

Defined in: [packages/utils/src/cache.ts:108](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L108)

#### Type Parameters

##### T

`T`

#### Properties

##### skipCaching()

```ts
skipCaching: (value) => SkipCaching<T>;
```

Defined in: [packages/utils/src/cache.ts:109](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L109)

###### Parameters

###### value

`T`

###### Returns

[`SkipCaching`](index.md#skipcaching)\<`T`\>

##### withExpiration()

```ts
withExpiration: (value, expiration) => WithExpiration<T>;
```

Defined in: [packages/utils/src/cache.ts:118](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L118)

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
