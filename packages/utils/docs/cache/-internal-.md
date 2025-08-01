[**@ls-stack/utils**](../README.md)

---

[@ls-stack/utils](../modules.md) / [cache](README.md) / \<internal\>

# \<internal\>

## Type Aliases

### GetOptions\<T\>

```ts
type GetOptions<T> = object;
```

Defined in: [packages/utils/src/cache.ts:65](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L65)

#### Type Parameters

##### T

`T`

#### Properties

##### skipCachingWhen()?

```ts
optional skipCachingWhen: (value) => boolean;
```

Defined in: [packages/utils/src/cache.ts:72](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L72)

A function that determines whether a value should be rejected from being cached.
If the function returns true, the value will be returned but not cached.

###### Parameters

###### value

`T`

The value to check

###### Returns

`boolean`

true if the value should be rejected, false otherwise

---

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
10_000;
```

##### maxCacheSize?

```ts
optional maxCacheSize: number;
```

Defined in: [packages/utils/src/cache.ts:20](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L20)

The maximum number of items in the cache.

###### Default

```ts
1000;
```

##### maxItemAge?

```ts
optional maxItemAge: DurationObj;
```

Defined in: [packages/utils/src/cache.ts:24](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L24)

The maximum age of items in the cache.

---

### Utils\<T\>

```ts
type Utils<T> = object;
```

Defined in: [packages/utils/src/cache.ts:55](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L55)

#### Type Parameters

##### T

`T`

#### Properties

##### skipCaching()

```ts
skipCaching: (value) => SkipCaching<T>;
```

Defined in: [packages/utils/src/cache.ts:56](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L56)

###### Parameters

###### value

`T`

###### Returns

[`SkipCaching`](README.md#skipcaching)\<`T`\>

##### withExpiration()

```ts
withExpiration: (value, expiration) => WithExpiration<T>;
```

Defined in: [packages/utils/src/cache.ts:62](https://github.com/lucasols/utils/blob/main/packages/utils/src/cache.ts#L62)

Create a new WithExpiration object with the given value and expiration time.

###### Parameters

###### value

`T`

The value to store in the cache.

###### expiration

[`DurationObj`](../time.md#durationobj)

The expiration time of the value in seconds or a duration object.

###### Returns

[`WithExpiration`](README.md#withexpiration)\<`T`\>
