import { isPromise } from './assertions';

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
   * @default 1000
   */
  maxCacheSize?: number;
  /**
   * The maximum age of items in the cache in seconds.
   */
  maxItemAge?: number;
  /**
   * The maximum number of items to check for expiration in a single call.
   * @default 10_000
   */
  expirationThrottle?: number;
};

export function createCache({
  maxCacheSize = 1000,
  maxItemAge,
  expirationThrottle = 10_000,
}: Options = {}) {
  const cache = new Map<
    string,
    {
      value: unknown;
      timestamp: number;
    }
  >();

  // Debounce variables for expiration checks only
  let lastExpirationCheck = 0;

  function checkExpiredItems() {
    const now = Date.now();
    if (!maxItemAge || now - lastExpirationCheck < expirationThrottle) return;
    lastExpirationCheck = now;

    const maxAgeMs = maxItemAge * 1000;
    for (const [key, item] of cache.entries()) {
      if (now - item.timestamp > maxAgeMs) {
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

  function isExpired(timestamp: number, now: number): boolean {
    return maxItemAge !== undefined && now - timestamp > maxItemAge * 1000;
  }

  function getOrInsert<T>(cacheKey: string, val: () => T): T {
    const now = Date.now();
    const entry = cache.get(cacheKey);

    if (!entry || isExpired(entry.timestamp, now)) {
      const value = val();
      cache.set(cacheKey, { value, timestamp: now });
      trimToSize();
      checkExpiredItems();
      return value;
    }

    return entry.value as T;
  }

  async function getOrInsertAsync<T>(
    cacheKey: string,
    val: () => Promise<T>,
  ): Promise<T> {
    const entry = cache.get(cacheKey);

    if (entry && isPromise(entry.value)) {
      return entry.value as Promise<T>;
    }

    const now = Date.now();

    if (entry && !isExpired(entry.timestamp, now)) {
      return entry.value as T;
    }

    const promise = val()
      .then((result) => {
        cache.set(cacheKey, { value: result, timestamp: Date.now() });
        return result;
      })
      .catch((error) => {
        cache.delete(cacheKey);
        throw error;
      });

    cache.set(cacheKey, { value: promise, timestamp: now });
    trimToSize();
    checkExpiredItems();

    return promise;
  }

  return {
    getOrInsert,
    getOrInsertAsync,
    clear: () => cache.clear(),
    /** @internal */
    '~cache': cache,
  };
}
