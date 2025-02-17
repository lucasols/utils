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
   * The throttle for checking expired items in milliseconds.
   * @default
   * 10_000
   */
  expirationThrottle?: number;
};

class RejectValue<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }
}

export type Cache<T> = {
  getOrInsert: (
    cacheKey: string,
    val: (reject: (value: T) => RejectValue<T>) => T | RejectValue<T>,
  ) => T;
  getOrInsertAsync: (
    cacheKey: string,
    val: (reject: (value: T) => RejectValue<T>) => Promise<T | RejectValue<T>>,
  ) => Promise<T>;
  clear: () => void;
  get: (cacheKey: string) => T | undefined;
  set: (cacheKey: string, value: T) => void;
  cleanExpiredItems: () => void;
  getAsync: (cacheKey: string) => Promise<T | undefined>;
  setAsync: (cacheKey: string, value: () => Promise<T>) => void;
  [' cache']: {
    map: Map<string, { value: T | Promise<T>; timestamp: number }>;
  };
};

export function createCache<T>({
  maxCacheSize = 1000,
  maxItemAge,
  expirationThrottle = 10_000,
}: Options = {}): Cache<T> {
  const cache = new Map<string, { value: T | Promise<T>; timestamp: number }>();

  // Debounce variables for expiration checks only
  let lastExpirationCheck = 0;

  function cleanExpiredItems() {
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

  const getRejectedValue = (value: T): RejectValue<T> => new RejectValue(value);

  return {
    getOrInsert(cacheKey, val) {
      const now = Date.now();
      const entry = cache.get(cacheKey);

      if (!entry || isExpired(entry.timestamp, now)) {
        const value = val(getRejectedValue);

        if (value instanceof RejectValue) {
          return value.value;
        }

        cache.set(cacheKey, { value, timestamp: now });
        trimToSize();
        cleanExpiredItems();
        return value;
      }

      if (isPromise(entry.value)) {
        throw new Error(
          'Cache value is a promise, use getOrInsertAsync instead',
        );
      }

      return entry.value;
    },
    async getOrInsertAsync(cacheKey, val) {
      const entry = cache.get(cacheKey);

      if (entry && isPromise(entry.value)) {
        return entry.value;
      }

      const now = Date.now();

      if (entry && !isExpired(entry.timestamp, now)) {
        return entry.value;
      }

      const promise = val(getRejectedValue)
        .then((result) => {
          if (result instanceof RejectValue) {
            return result.value;
          }

          cache.set(cacheKey, { value: result, timestamp: Date.now() });

          return result;
        })
        .catch((error) => {
          cache.delete(cacheKey);
          throw error;
        });

      cache.set(cacheKey, { value: promise, timestamp: now });
      trimToSize();
      cleanExpiredItems();

      return promise;
    },
    clear() {
      cache.clear();
    },
    get(cacheKey) {
      const entry = cache.get(cacheKey);

      if (!entry || isExpired(entry.timestamp, Date.now())) {
        return undefined;
      }

      if (isPromise(entry.value)) {
        throw new Error('Cache value is a promise, use getAsync instead');
      }

      return entry.value;
    },
    set(cacheKey, value) {
      cache.set(cacheKey, { value, timestamp: Date.now() });
      trimToSize();
      cleanExpiredItems();
    },
    async getAsync(cacheKey) {
      const entry = cache.get(cacheKey);

      if (!entry || isExpired(entry.timestamp, Date.now())) {
        return undefined;
      }

      return await entry.value;
    },
    setAsync(cacheKey, value) {
      const promise = value()
        .then((result) => {
          cache.set(cacheKey, { value: result, timestamp: Date.now() });
          return result;
        })
        .catch((error) => {
          cache.delete(cacheKey);
          throw error;
        });

      cache.set(cacheKey, { value: promise, timestamp: Date.now() });
      trimToSize();
      cleanExpiredItems();
    },
    cleanExpiredItems,
    /** @internal */
    ' cache': { map: cache },
  };
}
