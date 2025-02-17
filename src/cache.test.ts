import { describe, expect, test, vi } from 'vitest';
import { cachedGetter, createCache } from './cache';
import { sleep } from './sleep';

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
    vi.useFakeTimers();
    vi.setSystemTime('2025-01-01T00:00:00.000Z');

    const cache = createCache({ maxCacheSize: 2 });

    cache.getOrInsert('key1', () => 'value1');
    cache.getOrInsert('key2', () => 'value2');
    cache.getOrInsert('key3', () => 'value3');

    expect(cache[' cache'].map).toMatchInlineSnapshot(`
      Map {
        "key2" => {
          "timestamp": 1735689600000,
          "value": "value2",
        },
        "key3" => {
          "timestamp": 1735689600000,
          "value": "value3",
        },
      }
    `);

    cache.getOrInsert('key4', () => 'value1');

    expect(cache[' cache'].map).toMatchInlineSnapshot(`
      Map {
        "key3" => {
          "timestamp": 1735689600000,
          "value": "value3",
        },
        "key4" => {
          "timestamp": 1735689600000,
          "value": "value1",
        },
      }
    `);

    vi.useRealTimers();
  });

  test('clear should remove all entries', () => {
    const cache = createCache();

    cache.getOrInsert('key1', () => 'value1');
    cache.getOrInsert('key2', () => 'value2');

    cache.clear();

    expect(cache[' cache'].map).toMatchInlineSnapshot(`Map {}`);
  });

  test('getOrInsertAsync', async () => {
    vi.useFakeTimers();
    vi.setSystemTime('2025-01-01T00:00:00.000Z');

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
    expect(cache[' cache'].map).toMatchInlineSnapshot(`
      Map {
        "key1" => {
          "timestamp": 1735689600000,
          "value": {
            "foo": "bar",
          },
        },
      }
    `);

    vi.useRealTimers();
  });

  test('should expire items based on maxItemAge', () => {
    vi.useFakeTimers();
    const now = new Date('2025-01-01T00:00:00.000Z');
    vi.setSystemTime(now);

    const cache = createCache({ maxItemAge: 60 }); // 60 seconds
    const mockFn = vi.fn(() => 'value1');

    // First call
    const value1 = cache.getOrInsert('key1', mockFn);
    expect(value1).toBe('value1');
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Should use cached value
    const value2 = cache.getOrInsert('key1', mockFn);
    expect(value2).toBe('value1');
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Advance time by 30 seconds (not expired)
    vi.advanceTimersByTime(30 * 1000);
    const value3 = cache.getOrInsert('key1', mockFn);
    expect(value3).toBe('value1');
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Advance time by another 31 seconds (expired)
    vi.advanceTimersByTime(31 * 1000);
    const value4 = cache.getOrInsert('key1', mockFn);
    expect(value4).toBe('value1');
    expect(mockFn).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  test('should expire items when trimming cache', () => {
    vi.useFakeTimers();
    const now = new Date('2025-01-01T00:00:00.000Z');
    vi.setSystemTime(now);

    const cache = createCache({ maxItemAge: 60 }); // 60 seconds

    cache.getOrInsert('key1', () => 'value1');
    cache.getOrInsert('key2', () => 'value2');

    // Advance time by 61 seconds
    vi.advanceTimersByTime(61 * 1000);

    // Adding a new item should trigger cache trimming
    cache.getOrInsert('key3', () => 'value3');

    expect(cache[' cache'].map.size).toBe(1);
    expect(cache[' cache'].map.get('key3')).toBeDefined();
    expect(cache[' cache'].map.get('key1')).toBeUndefined();
    expect(cache[' cache'].map.get('key2')).toBeUndefined();

    vi.useRealTimers();
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
      const cache = createCache({ maxItemAge: 0.01 }); // 10ms expiration

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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    cache.set('key1', promise as any); // Intentionally setting a promise

    expect(() => cache.get('key1')).toThrow(
      'Cache value is a promise, use getAsync instead',
    );
  });

  test('get should respect maxItemAge', () => {
    vi.useFakeTimers();
    const cache = createCache<string>({ maxItemAge: 60 }); // 60 seconds

    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');

    // Advance time by 61 seconds
    vi.advanceTimersByTime(61 * 1000);

    expect(cache.get('key1')).toBeUndefined();

    vi.useRealTimers();
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
    const error = new Error('Async error');
    const getValue = vi.fn().mockRejectedValue(error);

    cache.setAsync('key1', getValue);

    await expect(cache.getAsync('key1')).rejects.toThrow(error);
    expect(getValue).toHaveBeenCalledTimes(1);

    // Cache entry should be removed after error
    expect(cache[' cache'].map.has('key1')).toBe(false);
  });

  test.concurrent('setAsync should respect maxItemAge', async () => {
    vi.useFakeTimers();
    const cache = createCache<string>({ maxItemAge: 60 }); // 60 seconds
    const getValue = vi.fn(() => Promise.resolve('asyncValue1'));

    cache.setAsync('key1', getValue);

    // Get the value immediately
    const value1 = await cache.getAsync('key1');
    expect(value1).toBe('asyncValue1');

    // Advance time by 61 seconds
    vi.advanceTimersByTime(61 * 1000);

    // Should return undefined after expiration
    const value2 = await cache.getAsync('key1');
    expect(value2).toBeUndefined();

    vi.useRealTimers();
  });

  test('getOrInsert should reject caching when using reject callback', () => {
    const cache = createCache<string>();
    const getValueMock = vi.fn((value: string) => {
      return value;
    });

    const value = cache.getOrInsert('key1', ({ reject }) => {
      return reject(getValueMock('rejected-value'));
    });
    expect(value).toBe('rejected-value');
    expect(getValueMock).toHaveBeenCalledTimes(1);
    expect(cache.get('key1')).toBeUndefined();

    // Subsequent call should call the mock again
    const value2 = cache.getOrInsert('key1', ({ reject }) => {
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

      const value = await cache.getOrInsertAsync('key1', async ({ reject }) => {
        return reject(await getValueMock('rejected-value'));
      });

      expect(value).toBe('rejected-value');
      expect(getValueMock).toHaveBeenCalledTimes(1);

      const value2 = await cache.getOrInsertAsync(
        'key1',
        async ({ reject }) => {
          return reject(await getValueMock('rejected-value-2'));
        },
      );

      expect(value2).toBe('rejected-value-2');
      expect(getValueMock).toHaveBeenCalledTimes(2);

      expect(cache[' cache'].map.size).toBe(0);
    },
  );
});
