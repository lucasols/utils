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
};

export function createCache({ maxCacheSize = 1000, maxItemAge }: Options = {}) {
  const cache = new Map<
    string,
    {
      value: unknown;
      timestamp: number;
    }
  >();

  function trimCache() {
    const now = Date.now();

    // Remove expired items if maxItemAge is set
    if (maxItemAge !== undefined) {
      const maxAgeMs = maxItemAge * 1000;
      for (const [key, item] of cache.entries()) {
        if (now - item.timestamp > maxAgeMs) {
          cache.delete(key);
        }
      }
    }

    // Handle max size limit
    const cacheSize = cache.size;
    if (cacheSize > maxCacheSize) {
      const keys = Array.from(cache.keys());
      for (let i = 0; i < cacheSize - maxCacheSize; i++) {
        cache.delete(keys[i]!);
      }
    }
  }

  function isExpired(timestamp: number): boolean {
    if (maxItemAge === undefined) return false;
    return Date.now() - timestamp > maxItemAge * 1000;
  }

  function getOrInsert<T>(cacheKey: string, val: () => T | Promise<T>): T {
    const cached = cache.get(cacheKey);
    if (!cached || isExpired(cached.timestamp)) {
      cache.set(cacheKey, {
        value: val(),
        timestamp: Date.now(),
      });
      trimCache();
    }

    return cache.get(cacheKey)!.value as T;
  }

  async function getOrInsertAsync<T>(
    cacheKey: string,
    val: () => Promise<T>,
  ): Promise<T> {
    const cached = cache.get(cacheKey);
    if (!cached || isExpired(cached.timestamp)) {
      cache.set(cacheKey, {
        value: await val(),
        timestamp: Date.now(),
      });
      trimCache();
    }

    return cache.get(cacheKey)!.value as T;
  }

  return {
    getOrInsert,
    getOrInsertAsync,
    clear: () => cache.clear(),
    /** @internal */
    '~cache': cache,
  };
}
