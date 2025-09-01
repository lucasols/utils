import { afterEach, describe, expect, test, vi } from 'vitest';
import { cachedGetter, createCache, WithExpiration } from './cache';
import { sleep } from './sleep';

afterEach(() => {
  vi.useRealTimers();
});

describe('cachedGetter', () => {
  test('should only call getter once', () => {
    const mockFn = vi.fn(() => 42);
    const cached = cachedGetter(mockFn);

    expect(cached.value).toBe(42);
    expect(cached.value).toBe(42);
    expect(cached.value).toBe(42);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('should work with different types', () => {
    const obj = { foo: 'bar' };
    const cached = cachedGetter(() => obj);
    expect(cached.value).toBe(obj);
  });
});

describe('createCache', () => {
  test('should store and retrieve values', () => {
    const mockGetValue = vi.fn(() => 'value1');

    const cache = createCache();
    const value = cache.getOrInsert('key1', () => mockGetValue());
    expect(value).toBe('value1');

    const cachedValue = cache.getOrInsert('key1', () => mockGetValue());

    expect(cachedValue).toBe('value1');
    expect(mockGetValue).toHaveBeenCalledTimes(1);
  });

  test('should respect maxCacheSize', () => {
    const cache = createCache({ maxCacheSize: 2 });

    cache.getOrInsert('key1', () => 'value1');
    cache.getOrInsert('key2', () => 'value2');
    cache.getOrInsert('key3', () => 'value3');

    // Should only keep the last 2 entries
    expect(cache[' cache'].map.size).toBe(2);
    expect(cache[' cache'].map.has('key2')).toBe(true);
    expect(cache[' cache'].map.has('key3')).toBe(true);
    expect(cache[' cache'].map.has('key1')).toBe(false);

    cache.getOrInsert('key4', () => 'value4');

    // Should still only keep the last 2 entries
    expect(cache[' cache'].map.size).toBe(2);
    expect(cache[' cache'].map.has('key3')).toBe(true);
    expect(cache[' cache'].map.has('key4')).toBe(true);
    expect(cache[' cache'].map.has('key2')).toBe(false);
  });

  test('clear should remove all entries', () => {
    const cache = createCache();

    cache.getOrInsert('key1', () => 'value1');
    cache.getOrInsert('key2', () => 'value2');

    cache.clear();

    expect(cache[' cache'].map).toMatchInlineSnapshot(`Map {}`);
  });

  test('getOrInsertAsync', async () => {
    const asyncMockFn = vi.fn(() => Promise.resolve({ foo: 'bar' }));

    const cache = createCache();
    const value = await cache.getOrInsertAsync('key1', async () =>
      asyncMockFn(),
    );
    const cachedValue = await cache.getOrInsertAsync('key1', async () =>
      asyncMockFn(),
    );

    expect(value).toEqual(cachedValue);
    expect(value).toEqual({ foo: 'bar' });
    expect(asyncMockFn).toHaveBeenCalledTimes(1);
    expect(cache[' cache'].map.get('key1')?.value).toEqual({ foo: 'bar' });
  });

  test('should expire items based on maxItemAge', async () => {
    const cache = createCache({ maxItemAge: { ms: 50 } }); // 50ms
    const mockFn = vi.fn(() => 'value1');

    // First call
    const value1 = cache.getOrInsert('key1', mockFn);
    expect(value1).toBe('value1');
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Should use cached value
    const value2 = cache.getOrInsert('key1', mockFn);
    expect(value2).toBe('value1');
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Wait for cache to expire
    await sleep(60);
    const value3 = cache.getOrInsert('key1', mockFn);
    expect(value3).toBe('value1');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test('should expire items when trimming cache', async () => {
    const cache = createCache({ maxItemAge: { ms: 50 } }); // 50ms

    cache.getOrInsert('key1', () => 'value1');
    cache.getOrInsert('key2', () => 'value2');

    // Wait for items to expire
    await sleep(60);

    // Adding a new item should trigger cache trimming
    cache.getOrInsert('key3', () => 'value3');

    expect(cache[' cache'].map.size).toBe(1);
    expect(cache[' cache'].map.get('key3')).toBeDefined();
    expect(cache[' cache'].map.get('key1')).toBeUndefined();
    expect(cache[' cache'].map.get('key2')).toBeUndefined();
  });

  test.concurrent('should cache concurrent async calls', async () => {
    const cache = createCache();
    const asyncMockFn = vi.fn(async () => {
      await sleep(20);
      return { foo: 'bar' };
    });

    const result1 = await cache.getOrInsertAsync('key1', asyncMockFn);
    const result2 = await cache.getOrInsertAsync('key1', asyncMockFn);

    expect(result1).toEqual(result2);
    expect(result1).toEqual({ foo: 'bar' });
    expect(asyncMockFn).toHaveBeenCalledTimes(1);
  });

  test.concurrent('should remove cache entry on async failure', async () => {
    const cache = createCache();
    const error = new Error('Failed request');
    const failingMock = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce('success');

    // First call should fail
    await expect(cache.getOrInsertAsync('key1', failingMock)).rejects.toThrow(
      error,
    );
    // Cache should be cleared on error
    expect(cache[' cache'].map.has('key1')).toBe(false);

    // Second call should retry and succeed
    const result = await cache.getOrInsertAsync('key1', failingMock);
    expect(result).toBe('success');
    expect(failingMock).toHaveBeenCalledTimes(2);
  });

  test.concurrent(
    'should handle concurrent async requests before resolution',
    async () => {
      const cache = createCache();
      const resolvers: Array<(value: string) => void> = [];
      const asyncMock = vi.fn(
        () =>
          new Promise<string>((resolve) => {
            resolvers.push(resolve);
          }),
      );

      const promise1 = cache.getOrInsertAsync('key1', asyncMock);
      const promise2 = cache.getOrInsertAsync('key1', asyncMock);

      // Resolve the pending promise
      resolvers[0]!('result');
      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(result1).toBe('result');
      expect(result2).toBe('result');
      expect(asyncMock).toHaveBeenCalledTimes(1);
      expect(cache[' cache'].map.get('key1')?.value).toBe('result');
    },
  );

  test.concurrent(
    'should create new promise when expired entry exists',
    async () => {
      const cache = createCache({ maxItemAge: { ms: 10 } }); // 10ms expiration

      // First call - store promise
      const mockFn1 = vi.fn(async () => {
        await sleep(10);
        return 'first';
      });
      const promise1 = cache.getOrInsertAsync('key1', mockFn1);

      // Wait for expiration plus debounce buffer
      await sleep(30);

      // Second call - should create new promise
      const mockFn2 = vi.fn(async () => {
        await sleep(10);
        return 'second';
      });
      const promise2 = cache.getOrInsertAsync('key1', mockFn2);

      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(result1).toBe('first');
      expect(result2).toBe('second');
      expect(mockFn1).toHaveBeenCalledTimes(1);
      expect(mockFn2).toHaveBeenCalledTimes(1);
    },
  );

  test('get and set should work with basic values', () => {
    const cache = createCache<string>();

    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');

    // Should return undefined for non-existent key
    expect(cache.get('nonexistent')).toBeUndefined();
  });

  test('get should throw error when accessing promise value', () => {
    const cache = createCache<string>();
    const promise = Promise.resolve('value1');

    cache.set('key1', promise as any); // Intentionally setting a promise

    expect(() => cache.get('key1')).toThrow(
      'Cache value is a promise, use getAsync instead',
    );
  });

  test('get should respect maxItemAge', async () => {
    const cache = createCache<string>({ maxItemAge: { ms: 50 } }); // 50ms

    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');

    // Wait for expiration
    await sleep(60);

    expect(cache.get('key1')).toBeUndefined();
  });

  test.concurrent(
    'getAsync and setAsync should work with promises',
    async () => {
      const cache = createCache<string>();
      const getValue = vi.fn(() => Promise.resolve('asyncValue1'));

      cache.setAsync('key1', getValue);

      const value1 = await cache.getAsync('key1');
      expect(value1).toBe('asyncValue1');
      expect(getValue).toHaveBeenCalledTimes(1);

      // Second get should return the same cached value
      const value2 = await cache.getAsync('key1');
      expect(value2).toBe('asyncValue1');
      expect(getValue).toHaveBeenCalledTimes(1);
    },
  );

  test.concurrent(
    'getAsync should return undefined for non-existent key',
    async () => {
      const cache = createCache<string>();

      const value = await cache.getAsync('nonexistent');
      expect(value).toBeUndefined();
    },
  );

  test.concurrent('setAsync should handle rejected promises', async () => {
    const cache = createCache<string>();
    const getValue = vi.fn(async () => {
      await sleep(1);
      throw new Error('Async error');
    });

    cache.setAsync('key1', getValue).catch(() => {
      // handle error
    });

    await expect(() => cache.getAsync('key1')).rejects.toThrow('Async error');
    expect(getValue).toHaveBeenCalledTimes(1);

    // Cache entry should be removed after error
    expect(cache[' cache'].map.has('key1')).toBe(false);
  });

  test.concurrent('setAsync should respect maxItemAge', async () => {
    const cache = createCache<string>({ maxItemAge: { ms: 100 } }); // 100ms
    const getValue = vi.fn(() => Promise.resolve('asyncValue1'));

    cache.setAsync('key1', getValue);

    // Get the value immediately
    const value1 = await cache.getAsync('key1');
    expect(value1).toBe('asyncValue1');

    // Wait for expiration (110ms)
    await sleep(110);

    // Should return undefined after expiration
    const value2 = await cache.getAsync('key1');
    expect(value2).toBeUndefined();
  });

  test('getOrInsert should reject caching when using reject callback', () => {
    const cache = createCache<string>();
    const getValueMock = vi.fn((value: string) => {
      return value;
    });

    const value = cache.getOrInsert('key1', ({ skipCaching: reject }) => {
      return reject(getValueMock('rejected-value'));
    });
    expect(value).toBe('rejected-value');
    expect(getValueMock).toHaveBeenCalledTimes(1);
    expect(cache.get('key1')).toBeUndefined();

    // Subsequent call should call the mock again
    const value2 = cache.getOrInsert('key1', ({ skipCaching: reject }) => {
      return reject(getValueMock('rejected-value-2'));
    });
    expect(value2).toBe('rejected-value-2');
    expect(getValueMock).toHaveBeenCalledTimes(2);

    expect(cache[' cache'].map.size).toBe(0);
  });

  test.concurrent(
    'getOrInsertAsync should reject caching when using reject callback',
    async () => {
      const cache = createCache<string>();
      const getValueMock = vi.fn((value: string) => {
        return Promise.resolve(value);
      });

      const value = await cache.getOrInsertAsync(
        'key1',
        async ({ skipCaching: reject }) => {
          return reject(await getValueMock('rejected-value'));
        },
      );

      expect(value).toBe('rejected-value');
      expect(getValueMock).toHaveBeenCalledTimes(1);

      const value2 = await cache.getOrInsertAsync(
        'key1',
        async ({ skipCaching: reject }) => {
          return reject(await getValueMock('rejected-value-2'));
        },
      );

      expect(value2).toBe('rejected-value-2');
      expect(getValueMock).toHaveBeenCalledTimes(2);

      expect(cache[' cache'].map.size).toBe(0);
    },
  );
});

describe('withExpiration', () => {
  test('should store value with custom expiration time inferior to default', async () => {
    const cache = createCache<string>({ maxItemAge: { ms: 100 } }); // 100ms default

    const value = cache.getOrInsert('key1', ({ withExpiration }) => {
      return withExpiration('value1', { ms: 50 }); // 50ms expiration
    });

    expect(value).toBe('value1');

    // Should still be cached before expiration
    await sleep(40);
    expect(cache.get('key1')).toBe('value1');

    // Should be expired after timeout
    await sleep(20);
    expect(cache.get('key1')).toBeUndefined();
  });

  test('should work with duration object', async () => {
    const cache = createCache<string>({ maxItemAge: { ms: 100 } }); // 100ms default

    const value = cache.getOrInsert('key1', ({ withExpiration }) => {
      return withExpiration('value1', { ms: 60 }); // 60ms expiration
    });

    expect(value).toBe('value1');

    // Should still be cached before expiration
    await sleep(50);
    expect(cache.get('key1')).toBe('value1');

    // Should be expired after timeout
    await sleep(20);
    expect(cache.get('key1')).toBeUndefined();
  });

  test('should work with custom expiration time superior to default', async () => {
    const cache = createCache<string>({ maxItemAge: { ms: 50 } }); // 50ms default

    const value = cache.getOrInsert('key1', ({ withExpiration }) => {
      return withExpiration('value1', { ms: 80 }); // 80ms expiration (longer than default)
    });

    expect(value).toBe('value1');

    // Default expiration would trigger at 50ms, but custom is 80ms
    await sleep(60);
    expect(cache.get('key1')).toBe('value1'); // Still valid

    // Custom expiration triggers at 80ms
    await sleep(30);
    expect(cache.get('key1')).toBeUndefined();
  });

  test('works with cache.set and cache.get', async () => {
    const cache = createCache<string>({
      maxItemAge: { ms: 100 },
    });
    cache.set('key1', new WithExpiration('value1', { ms: 50 }));
    expect(cache.get('key1')).toBe('value1');

    await sleep(60);
    expect(cache.get('key1')).toBeUndefined();
  });

  test.concurrent('should work with async values', async () => {
    const cache = createCache<string>({ maxItemAge: { ms: 100 } }); // 100ms

    const value = await cache.getOrInsertAsync(
      'key1',
      async ({ withExpiration }) => {
        await sleep(10);
        return withExpiration('value1', { ms: 80 }); // 80ms expiration (more generous)
      },
    );

    expect(value).toBe('value1');

    // Check before expiration (after 50ms)
    await sleep(50);
    const cachedValue = await cache.getAsync('key1');
    expect(cachedValue).toBe('value1');

    // Check after expiration (after additional 50ms)
    await sleep(50);
    const expiredValue = await cache.getAsync('key1');
    expect(expiredValue).toBeUndefined();
  });

  test.concurrent('works with cache.setAsync and cache.getAsync', async () => {
    const cache = createCache<string>({ maxItemAge: { ms: 100 } }); // 100ms

    cache.setAsync('key1', async ({ withExpiration }) => {
      await sleep(10);
      return withExpiration('value1', { ms: 50 }); // 50ms expiration
    });

    // Check before expiration (after 40ms)
    await sleep(40);
    const cachedValue = await cache.getAsync('key1');
    expect(cachedValue).toBe('value1');

    // Check after expiration (after additional 30ms)
    await sleep(30);
    const expiredValue = await cache.getAsync('key1');
    expect(expiredValue).toBeUndefined();
  });
});

describe('options.rejectWhen', () => {
  test('should not cache values that match rejection condition', () => {
    const cache = createCache<number>();
    const mockFn = vi.fn((n: number) => n);

    // First call with value that should be rejected
    const value1 = cache.getOrInsert('key1', () => mockFn(42), {
      skipCachingWhen: (value) => value === 42,
    });
    expect(value1).toBe(42);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(cache[' cache'].map.size).toBe(0);

    // Second call should call the function again since value was rejected
    const value2 = cache.getOrInsert('key1', () => mockFn(42), {
      skipCachingWhen: (value) => value === 42,
    });
    expect(value2).toBe(42);
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(cache[' cache'].map.size).toBe(0);
  });

  test('should cache values that do not match rejection condition', () => {
    const cache = createCache<number>();
    const mockFn = vi.fn((n: number) => n);

    // First call with value that should not be rejected
    const value1 = cache.getOrInsert('key1', () => mockFn(41), {
      skipCachingWhen: (value) => value === 42,
    });
    expect(value1).toBe(41);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(cache[' cache'].map.size).toBe(1);

    // Second call should use cached value
    const value2 = cache.getOrInsert('key1', () => mockFn(41), {
      skipCachingWhen: (value) => value === 42,
    });
    expect(value2).toBe(41);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test.concurrent('should work with async values', async () => {
    const cache = createCache<number>();
    const mockFn = vi.fn(async (n: number) => {
      await sleep(10);
      return n;
    });

    // First call with value that should be rejected
    const value1 = await cache.getOrInsertAsync(
      'key1',
      async () => await mockFn(42),
      { skipCachingWhen: (value) => value === 42 },
    );
    expect(value1).toBe(42);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(cache[' cache'].map.size).toBe(0);

    // Second call should call the function again since value was rejected
    const value2 = await cache.getOrInsertAsync(
      'key1',
      async () => await mockFn(41),
      { skipCachingWhen: (value) => value === 42 },
    );
    expect(value2).toBe(41);
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(cache[' cache'].map.size).toBe(1);

    // Third call should be cached
    const value3 = await cache.getOrInsertAsync(
      'key1',
      async () => await mockFn(41),
      { skipCachingWhen: (value) => value === 42 },
    );
    expect(value3).toBe(41);
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(cache[' cache'].map.size).toBe(1);
  });
});
