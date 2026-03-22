import { isPromise } from './assertions';
import { DurationObj, durationObjToMs } from './time';
/**
 * Creates a cached getter that only calls the provided function once. The first
 * access computes and caches the value; subsequent accesses return the cached
 * result. This is useful for lazy initialization of expensive computations.
 *
 * @example
 *   const expensive = cachedGetter(() => {
 *     console.log('Computing...');
 *     return heavyComputation();
 *   });
 *
 *   console.log(expensive.value); // Logs "Computing..." and returns result
 *   console.log(expensive.value); // Returns cached result without logging
 *   console.log(expensive.value); // Returns cached result without logging
 *
 * @param getter - Function that computes the value to cache
 * @returns Object with a `value` property that caches the result
 */
export function cachedGetter<T>(getter: () => T): {
  value: T;
} {
  return {
    get value() {
      const value = getter();
      Object.defineProperty(this, 'value', { value });
      return value;
    },
  };
}

type Options = {
  /**
   * The maximum number of items in the cache.
   *
   * @default 1000
   */
  maxCacheSize?: number;
  /** The maximum age of items in the cache. */
  maxItemAge?: DurationObj;
  /**
   * The throttle for checking expired items in milliseconds.
   *
   * @default
   * 10_000
   */
  expirationThrottle?: number;
};

/**
 * Wrapper class that prevents a value from being cached. When returned from a
 * cache computation function, the value will be returned to the caller but not
 * stored in the cache.
 *
 * @example
 *   const cache = createCache<string>();
 *   const result = cache.getOrInsert('dynamic', ({ skipCaching }) => {
 *     const data = generateData();
 *     if (data.isTemporary) {
 *       return skipCaching(data); // Won't be cached
 *     }
 *     return data; // Will be cached
 *   });
 */
export class SkipCaching<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }
}

/**
 * Wrapper class that sets a custom expiration time for a cached value. Allows
 * individual cache entries to have different expiration times than the default
 * cache expiration.
 *
 * @example
 *   const cache = createCache<string>({ maxItemAge: { hours: 1 } }); // Default 1 hour
 *
 *   const result = cache.getOrInsert('short-lived', ({ withExpiration }) => {
 *     return withExpiration('temporary data', { minutes: 5 }); // Expires in 5 minutes
 *   });
 *
 *   const longLived = cache.getOrInsert(
 *     'long-lived',
 *     ({ withExpiration }) => {
 *       return withExpiration('persistent data', { days: 1 }); // Expires in 1 day
 *     },
 *   );
 */
export class WithExpiration<T> {
  value: T;
  expiration: number;

  /**
   * @param value - The value to store in the cache.
   * @param expiration - The expiration time of the value in seconds or a
   *   duration object.
   */
  constructor(value: T, expiration: DurationObj) {
    this.value = value;
    this.expiration = durationObjToMs(expiration);
  }
}

type Utils<T> = {
  skipCaching: (value: T) => SkipCaching<T>;
  /**
   * Create a new WithExpiration object with the given value and expiration
   * time.
   *
   * @param value - The value to store in the cache.
   * @param expiration - The expiration time of the value in seconds or a
   *   duration object.
   */
  withExpiration: (value: T, expiration: DurationObj) => WithExpiration<T>;
};

type GetOptions<T> = {
  /**
   * A function that determines whether a value should be rejected from being
   * cached. If the function returns true, the value will be returned but not
   * cached.
   *
   * @param value The value to check
   * @returns True if the value should be rejected, false otherwise
   */
  skipCachingWhen?: (value: T) => boolean;
};

export type Cache<T> = {
  getOrInsert: (
    cacheKey: string,
    val: (utils: Utils<T>) => T | SkipCaching<T>,
    options?: GetOptions<T>,
  ) => T;
  getOrInsertAsync: (
    cacheKey: string,
    val: (utils: Utils<T>) => Promise<T | SkipCaching<T>>,
    options?: GetOptions<T>,
  ) => Promise<T>;
  clear: () => void;
  delete: (...cacheKeys: string[]) => void;
  has: (cacheKey: string) => boolean;
  size: number;
  get: (cacheKey: string) => T | undefined;
  set: (cacheKey: string, value: T | WithExpiration<T>) => void;
  cleanExpiredItems: () => void;
  getAsync: (cacheKey: string) => Promise<T | undefined>;
  setAsync: (
    cacheKey: string,
    value: (utils: Utils<T>) => Promise<T | WithExpiration<T>>,
  ) => Promise<T>;
  [' cache']: {
    map: Map<string, { value: T | Promise<T>; timestamp: number }>;
  };
};

/**
 * Creates a full-featured cache with time-based expiration, async support, and
 * advanced features. This is a more powerful alternative to `fastCache` when
 * you need expiration, async operations, or advanced caching strategies.
 *
 * @example
 *   // Basic usage with expiration
 *   const cache = createCache<string>({
 *     maxCacheSize: 100,
 *     maxItemAge: { minutes: 5 },
 *   });
 *
 *   // Simple caching
 *   const result = cache.getOrInsert('user:123', () => {
 *     return fetchUserFromDatabase('123');
 *   });
 *
 *   // Async caching with promise deduplication
 *   const asyncResult = await cache.getOrInsertAsync(
 *     'api:data',
 *     async () => {
 *       return await fetchFromApi('/data');
 *     },
 *   );
 *
 *   // Skip caching for certain values
 *   const value = cache.getOrInsert('dynamic', ({ skipCaching }) => {
 *     const data = generateDynamicData();
 *     if (data.shouldNotCache) {
 *       return skipCaching(data); // Won't be cached
 *     }
 *     return data;
 *   });
 *
 *   // Custom expiration per item
 *   const shortLivedValue = cache.getOrInsert(
 *     'temp',
 *     ({ withExpiration }) => {
 *       return withExpiration('temporary data', { seconds: 30 });
 *     },
 *   );
 *
 *   // Conditional caching based on the computed value
 *   const result = cache.getOrInsert(
 *     'conditional',
 *     () => {
 *       return computeValue();
 *     },
 *     {
 *       skipCachingWhen: (value) => value === null || value.error,
 *     },
 *   );
 *
 * @param options - Configuration options for the cache
 * @param options.maxCacheSize - Maximum number of items to store. When
 *   exceeded, oldest items are removed first. Defaults to 1000.
 * @param options.maxItemAge - Default expiration time for all cached items.
 *   Items older than this will be automatically removed.
 * @param options.expirationThrottle - Minimum time in milliseconds between
 *   expiration cleanup runs. Prevents excessive cleanup operations. Defaults to
 *   10,000ms.
 * @returns A cache instance with various methods for storing and retrieving
 *   values
 */
export function createCache<T>({
  maxCacheSize = 1000,
  maxItemAge,
  expirationThrottle = 10_000,
}: Options = {}): Cache<T> {
  type CacheEntry = {
    value: T | Promise<T>;
    timestamp: number;
    expiration: number | undefined;
  };

  const cache = new Map<string, CacheEntry>();

  // Debounce variables for expiration checks only
  let lastExpirationCheck = 0;

  const defaultMaxItemAgeMs = maxItemAge && durationObjToMs(maxItemAge);

  function cleanExpiredItems() {
    const now = Date.now();
    if (!defaultMaxItemAgeMs || now - lastExpirationCheck < expirationThrottle)
      return;
    lastExpirationCheck = now;

    for (const [key, item] of cache.entries()) {
      if (isExpired(item, now)) {
        cache.delete(key);
      }
    }
  }

  function trimToSize() {
    const currentSize = cache.size;
    if (currentSize > maxCacheSize) {
      const keysToRemove = currentSize - maxCacheSize;
      const iterator = cache.keys();
      for (let i = 0; i < keysToRemove; i++) {
        const { value: key } = iterator.next();
        if (key) {
          cache.delete(key);
        }
      }
    }
  }

  function isExpired(
    entry: { timestamp: number; expiration?: number },
    now: number,
  ): boolean {
    const maxItemAgeMs = entry.expiration ?? defaultMaxItemAgeMs;

    return !!maxItemAgeMs && now - entry.timestamp > maxItemAgeMs;
  }

  function unwrapValue(
    value: T | WithExpiration<T>,
    now: number,
  ): {
    value: T;
    timestamp: number;
    expiration: number | undefined;
  } {
    if (value instanceof WithExpiration) {
      return {
        value: value.value,
        timestamp: now,
        expiration:
          value.expiration ?
            typeof value.expiration === 'number' ?
              value.expiration
            : now + durationObjToMs(value.expiration)
          : undefined,
      };
    }

    return { value, timestamp: now, expiration: undefined };
  }

  const utils = {
    skipCaching: (value: T) => new SkipCaching(value),
    withExpiration: (value: T, expiration: DurationObj) => {
      return new WithExpiration(value, expiration);
    },
  };

  function refreshEntry(key: string, now: number): void {
    const entry = cache.get(key);
    if (entry && !isExpired(entry, now)) {
      cache.delete(key);
      cache.set(key, entry);
    }
  }

  return {
    /**
     * Gets a value from the cache or computes and stores it if not present.
     * This is the primary method for synchronous caching operations.
     *
     * @param cacheKey - Unique key to identify the cached value
     * @param val - Function that computes the value if not cached. Receives
     *   utility functions for advanced features.
     * @param options - Optional configuration for this specific get operation
     * @returns The cached or newly computed value
     * @throws Error if the cached value is a promise (use getOrInsertAsync
     *   instead)
     */
    getOrInsert(cacheKey, val, options) {
      const now = Date.now();
      const entry = cache.get(cacheKey);

      if (!entry || isExpired(entry, now)) {
        const value = val(utils);

        if (value instanceof SkipCaching) {
          return value.value;
        }

        if (options?.skipCachingWhen?.(value)) {
          return value;
        }

        const unwrappedValue = unwrapValue(value, now);

        cache.set(cacheKey, unwrappedValue);
        trimToSize();
        cleanExpiredItems();
        return unwrappedValue.value;
      }

      if (isPromise(entry.value)) {
        throw new Error(
          'Cache value is a promise, use getOrInsertAsync instead',
        );
      }

      refreshEntry(cacheKey, now);
      return entry.value;
    },
    /**
     * Gets a value from the cache or computes and stores it asynchronously.
     * Provides promise deduplication - concurrent calls with the same key will
     * share the same promise.
     *
     * @param cacheKey - Unique key to identify the cached value
     * @param val - Async function that computes the value if not cached.
     *   Receives utility functions for advanced features.
     * @param options - Optional configuration for this specific get operation
     * @returns Promise that resolves to the cached or newly computed value
     */
    async getOrInsertAsync(cacheKey, val, options) {
      const entry = cache.get(cacheKey);

      if (entry && isPromise(entry.value)) {
        return entry.value;
      }

      const now = Date.now();

      if (entry && !isExpired(entry, now)) {
        refreshEntry(cacheKey, now);
        return entry.value;
      }

      const promise = val(utils)
        .then((result) => {
          if (result instanceof SkipCaching) {
            const cacheValue = cache.get(cacheKey);

            if (cacheValue?.value === promise) {
              cache.delete(cacheKey);
            }

            return result.value;
          }

          if (options?.skipCachingWhen?.(result)) {
            const cacheValue = cache.get(cacheKey);
            if (cacheValue?.value === promise) {
              cache.delete(cacheKey);
            }
            return result;
          }

          const unwrappedValue = unwrapValue(result, Date.now());

          cache.set(cacheKey, unwrappedValue);

          return unwrappedValue.value;
        })
        .catch((error) => {
          cache.delete(cacheKey);
          throw error;
        });

      cache.set(cacheKey, {
        value: promise,
        timestamp: now,
        expiration: undefined,
      });
      trimToSize();
      cleanExpiredItems();

      return promise;
    },
    /** Removes all items from the cache. */
    clear() {
      cache.clear();
    },
    /**
     * Removes one or more items from the cache.
     *
     * @param cacheKeys - Keys of the items to remove
     */
    delete(...cacheKeys) {
      for (const key of cacheKeys) {
        cache.delete(key);
      }
    },
    /**
     * Checks whether a non-expired item exists for the given key.
     *
     * @param cacheKey - Key to check
     * @returns True if a valid (non-expired) entry exists
     */
    has(cacheKey) {
      const entry = cache.get(cacheKey);
      if (!entry) return false;
      return !isExpired(entry, Date.now());
    },
    /** The number of items currently in the cache (including pending promises). */
    get size() {
      return cache.size;
    },
    /**
     * Gets a value from the cache without computing it if missing. Returns
     * undefined if the key doesn't exist or has expired.
     *
     * @param cacheKey - Key to look up in the cache
     * @returns The cached value or undefined if not found/expired
     * @throws Error if the cached value is a promise (use getAsync instead)
     */
    get(cacheKey) {
      const entry = cache.get(cacheKey);
      const now = Date.now();

      if (!entry || isExpired(entry, now)) {
        return undefined;
      }

      if (isPromise(entry.value)) {
        throw new Error('Cache value is a promise, use getAsync instead');
      }

      refreshEntry(cacheKey, now);
      return entry.value;
    },
    /**
     * Manually sets a value in the cache.
     *
     * @param cacheKey - Key to store the value under
     * @param value - Value to store, or WithExpiration wrapper for custom
     *   expiration
     */
    set(cacheKey, value) {
      cache.set(cacheKey, unwrapValue(value, Date.now()));
      trimToSize();
      cleanExpiredItems();
    },
    /**
     * Gets a value from the cache without computing it if missing. Works with
     * both sync and async cached values.
     *
     * @param cacheKey - Key to look up in the cache
     * @returns Promise that resolves to the cached value or undefined if not
     *   found/expired
     */
    async getAsync(cacheKey) {
      const entry = cache.get(cacheKey);
      const now = Date.now();

      if (!entry || isExpired(entry, now)) {
        return undefined;
      }

      refreshEntry(cacheKey, now);
      return entry.value;
    },
    /**
     * Manually sets an async value in the cache. The promise will be stored
     * immediately and shared with concurrent requests.
     *
     * @param cacheKey - Key to store the value under
     * @param value - Async function that returns the value to cache
     * @returns Promise that resolves to the computed value
     */
    async setAsync(cacheKey, value) {
      const promise = value(utils)
        .then((result) => {
          if (result instanceof SkipCaching) {
            const cacheValue = cache.get(cacheKey);

            if (cacheValue?.value === promise) {
              cache.delete(cacheKey);
            }

            return result.value;
          }

          const unwrappedValue = unwrapValue(result, Date.now());
          cache.set(cacheKey, unwrappedValue);
          return unwrappedValue.value;
        })
        .catch((error) => {
          cache.delete(cacheKey);
          throw error;
        });

      cache.set(cacheKey, {
        value: promise,
        timestamp: Date.now(),
        expiration: undefined,
      });
      trimToSize();
      cleanExpiredItems();

      return promise;
    },
    /**
     * Manually triggers cleanup of expired items. Normally this happens
     * automatically during cache operations.
     */
    cleanExpiredItems,
    /** @internal */
    ' cache': { map: cache },
  };
}

type FastCacheOptions = { maxCacheSize?: number };

/**
 * Creates a simple, fast cache with FIFO (First In, First Out) eviction policy.
 * This is a lightweight alternative to `createCache` for basic caching needs
 * without expiration, async support, or advanced features.
 *
 * @example
 *   const cache = fastCache<string>({ maxCacheSize: 100 });
 *
 *   // Cache expensive computation
 *   const result = cache.getOrInsert('user:123', () => {
 *     return fetchUserFromDatabase('123');
 *   });
 *
 *   // Subsequent calls return cached value without re-computation
 *   const cachedResult = cache.getOrInsert('user:123', () => {
 *     return fetchUserFromDatabase('123'); // Won't be called
 *   });
 *
 *   // Clear all cached values
 *   cache.clear();
 *
 * @param options - Configuration options for the cache
 * @param options.maxCacheSize - Maximum number of items to store in the cache.
 *   When exceeded, oldest items are removed first. Defaults to 1000.
 * @returns An object with cache methods
 */
export function fastCache<T>({ maxCacheSize = 1000 }: FastCacheOptions = {}) {
  const cache = new Map<string, T>();

  function trimCache() {
    const cacheSize = cache.size;

    if (cacheSize > maxCacheSize) {
      const keys = Array.from(cache.keys());

      for (let i = 0; i < cacheSize - maxCacheSize; i++) {
        cache.delete(keys[i] as string);
      }
    }
  }

  /**
   * Gets a value from the cache or computes and stores it if not present.
   *
   * @param cacheKey - The key to store/retrieve the value under
   * @param val - Function that computes the value if not cached
   * @returns The cached or newly computed value
   */
  function getOrInsert(cacheKey: string, val: () => T): T {
    if (!cache.has(cacheKey)) {
      const value = val();
      cache.set(cacheKey, value);
      trimCache();

      // Return the computed value even if it was immediately evicted
      return cache.get(cacheKey) ?? value;
    }

    return cache.get(cacheKey) as T;
  }

  return {
    getOrInsert,
    /** Clears all cached values */
    clear: () => cache.clear(),
    /**
     * Removes one or more items from the cache.
     *
     * @param cacheKeys - Keys of the items to remove
     */
    delete: (...cacheKeys: string[]) => {
      for (const key of cacheKeys) {
        cache.delete(key);
      }
    },
    /**
     * Checks whether an item exists for the given key.
     *
     * @param cacheKey - Key to check
     * @returns True if the entry exists
     */
    has: (cacheKey: string) => cache.has(cacheKey),
    /**
     * Gets a value from the cache without computing it if missing.
     *
     * @param cacheKey - Key to look up in the cache
     * @returns The cached value or undefined if not found
     */
    get: (cacheKey: string) => cache.get(cacheKey),
    /** The number of items currently in the cache. */
    get size() {
      return cache.size;
    },
  };
}
