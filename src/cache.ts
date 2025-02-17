import { isPromise } from './assertions';
import { DurationObj, durationObjToMs } from './time';
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
   * The maximum age of items in the cache.
   */
  maxItemAge?: DurationObj;
  /**
   * The throttle for checking expired items in milliseconds.
   * @default
   * 10_000
   */
  expirationThrottle?: number;
};

export class RejectValue<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }
}

export class WithExpiration<T> {
  value: T;
  expiration: number;

  /**
   * @param value - The value to store in the cache.
   * @param expiration - The expiration time of the value in seconds or a duration object.
   */
  constructor(value: T, expiration: DurationObj) {
    this.value = value;
    this.expiration = durationObjToMs(expiration);
  }
}

type Utils<T> = {
  reject: (value: T) => RejectValue<T>;
  /**
   * Create a new WithExpiration object with the given value and expiration time.
   * @param value - The value to store in the cache.
   * @param expiration - The expiration time of the value in seconds or a duration object.
   */
  withExpiration: (value: T, expiration: DurationObj) => WithExpiration<T>;
};

type GetOptions<T> = {
  /**
   * A function that determines whether a value should be rejected from being cached.
   * If the function returns true, the value will be returned but not cached.
   * @param value The value to check
   * @returns true if the value should be rejected, false otherwise
   */
  rejectWhen?: (value: T) => boolean;
};

export type Cache<T> = {
  getOrInsert: (
    cacheKey: string,
    val: (utils: Utils<T>) => T | RejectValue<T>,
    options?: GetOptions<T>,
  ) => T;
  getOrInsertAsync: (
    cacheKey: string,
    val: (utils: Utils<T>) => Promise<T | RejectValue<T>>,
    options?: GetOptions<T>,
  ) => Promise<T>;
  clear: () => void;
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
    reject: (value: T) => new RejectValue(value),
    withExpiration: (value: T, expiration: DurationObj) => {
      return new WithExpiration(value, expiration);
    },
  };

  return {
    getOrInsert(cacheKey, val, options) {
      const now = Date.now();
      const entry = cache.get(cacheKey);

      if (!entry || isExpired(entry, now)) {
        const value = val(utils);

        if (value instanceof RejectValue) {
          return value.value;
        }

        if (options?.rejectWhen?.(value)) {
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

      return entry.value;
    },
    async getOrInsertAsync(cacheKey, val, options) {
      const entry = cache.get(cacheKey);

      if (entry && isPromise(entry.value)) {
        return entry.value;
      }

      const now = Date.now();

      if (entry && !isExpired(entry, now)) {
        return entry.value;
      }

      const promise = val(utils)
        .then((result) => {
          if (result instanceof RejectValue) {
            const cacheValue = cache.get(cacheKey);

            if (cacheValue?.value === promise) {
              cache.delete(cacheKey);
            }

            return result.value;
          }

          if (options?.rejectWhen?.(result)) {
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
    clear() {
      cache.clear();
    },
    get(cacheKey) {
      const entry = cache.get(cacheKey);

      if (!entry || isExpired(entry, Date.now())) {
        return undefined;
      }

      if (isPromise(entry.value)) {
        throw new Error('Cache value is a promise, use getAsync instead');
      }

      return entry.value;
    },
    set(cacheKey, value) {
      cache.set(cacheKey, unwrapValue(value, Date.now()));
      trimToSize();
      cleanExpiredItems();
    },
    async getAsync(cacheKey) {
      const entry = cache.get(cacheKey);

      if (!entry || isExpired(entry, Date.now())) {
        return undefined;
      }

      return entry.value;
    },
    async setAsync(cacheKey, value) {
      const promise = value(utils)
        .then((result) => {
          if (result instanceof RejectValue) {
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
    cleanExpiredItems,
    /** @internal */
    ' cache': { map: cache },
  };
}
