/* eslint-disable no-restricted-syntax */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cachedGetter, createCache, fastCache, WithExpiration } from './cache';
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

  test('should respect maxCacheSize with LRU eviction', () => {
    vi.useFakeTimers();
    vi.setSystemTime('2025-01-01T00:00:00.000Z');

    const cache = createCache({ maxCacheSize: 2 });

    cache.getOrInsert('key1', () => 'value1');
    cache.getOrInsert('key2', () => 'value2');

    // Access key1 to make it most recently used
    cache.get('key1');

    // Adding key3 should evict key2 (least recently used), not key1
    cache.getOrInsert('key3', () => 'value3');

    expect(cache[' cache'].map).toMatchInlineSnapshot(`
      Map {
        "key1" => {
          "expiration": undefined,
          "timestamp": 1735689600000,
          "value": "value1",
        },
        "key3" => {
          "expiration": undefined,
          "timestamp": 1735689600000,
          "value": "value3",
        },
      }
    `);

    // Access key3 to make it most recently used
    cache.get('key3');

    // Adding key4 should evict key1 (now least recently used)
    cache.getOrInsert('key4', () => 'value4');

    expect(cache[' cache'].map).toMatchInlineSnapshot(`
      Map {
        "key3" => {
          "expiration": undefined,
          "timestamp": 1735689600000,
          "value": "value3",
        },
        "key4" => {
          "expiration": undefined,
          "timestamp": 1735689600000,
          "value": "value4",
        },
      }
    `);

    vi.useRealTimers();
  });

  test('should evict least recently used items when maxCacheSize exceeded', () => {
    vi.useFakeTimers();
    vi.setSystemTime('2025-01-01T00:00:00.000Z');

    const cache = createCache({ maxCacheSize: 3 });

    // Fill cache to capacity
    cache.getOrInsert('A', () => 'valueA');
    cache.getOrInsert('B', () => 'valueB');
    cache.getOrInsert('C', () => 'valueC');

    // Access A and B to make them recently used (C is now LRU)
    cache.get('A');
    cache.get('B');

    // Adding D should evict C (least recently used)
    cache.getOrInsert('D', () => 'valueD');

    expect(cache[' cache'].map.has('A')).toBe(true);
    expect(cache[' cache'].map.has('B')).toBe(true);
    expect(cache[' cache'].map.has('C')).toBe(false); // Evicted
    expect(cache[' cache'].map.has('D')).toBe(true);

    // Access A to make it recently used (B is now LRU among A,B,D)
    cache.get('A');

    // Adding E should evict B (least recently used)
    cache.getOrInsert('E', () => 'valueE');

    expect(cache[' cache'].map.has('A')).toBe(true);
    expect(cache[' cache'].map.has('B')).toBe(false); // Evicted
    expect(cache[' cache'].map.has('D')).toBe(true);
    expect(cache[' cache'].map.has('E')).toBe(true);

    vi.useRealTimers();
  });

  test('should prevent eviction of frequently accessed items', () => {
    vi.useFakeTimers();
    vi.setSystemTime('2025-01-01T00:00:00.000Z');

    const cache = createCache({ maxCacheSize: 2 });

    cache.getOrInsert('persistent', () => 'persistentValue');
    cache.getOrInsert('temp1', () => 'temp1Value');

    // Keep accessing 'persistent' while adding new items
    cache.get('persistent'); // Make persistent recently used

    cache.getOrInsert('temp2', () => 'temp2Value'); // Should evict temp1

    expect(cache[' cache'].map.has('persistent')).toBe(true);
    expect(cache[' cache'].map.has('temp1')).toBe(false); // Evicted
    expect(cache[' cache'].map.has('temp2')).toBe(true);

    cache.get('persistent'); // Keep accessing persistent

    cache.getOrInsert('temp3', () => 'temp3Value'); // Should evict temp2

    expect(cache[' cache'].map.has('persistent')).toBe(true);
    expect(cache[' cache'].map.has('temp2')).toBe(false); // Evicted
    expect(cache[' cache'].map.has('temp3')).toBe(true);

    cache.get('persistent'); // Keep accessing persistent

    cache.getOrInsert('temp4', () => 'temp4Value'); // Should evict temp3

    expect(cache[' cache'].map.has('persistent')).toBe(true);
    expect(cache[' cache'].map.has('temp3')).toBe(false); // Evicted
    expect(cache[' cache'].map.has('temp4')).toBe(true);

    // Verify persistent item was never evicted despite multiple additions
    expect(cache.get('persistent')).toBe('persistentValue');

    vi.useRealTimers();
  });

  test.concurrent('should update LRU order with async operations', async () => {
    const cache = createCache({ maxCacheSize: 2 });

    // Add two async values
    await cache.getOrInsertAsync('async1', async () => 'asyncValue1');
    await cache.getOrInsertAsync('async2', async () => 'asyncValue2');

    // Access async1 via getAsync to make it recently used
    await cache.getAsync('async1');

    // Add async3 - should evict async2 (least recently used)
    await cache.getOrInsertAsync('async3', async () => 'asyncValue3');

    expect(cache[' cache'].map.has('async1')).toBe(true);
    expect(cache[' cache'].map.has('async2')).toBe(false); // Evicted
    expect(cache[' cache'].map.has('async3')).toBe(true);

    // Access async3 via getOrInsertAsync (cache hit) to make it recently used
    await cache.getOrInsertAsync('async3', async () => 'shouldNotBeCalled');

    // Add async4 - should evict async1 (now least recently used)
    await cache.getOrInsertAsync('async4', async () => 'asyncValue4');

    expect(cache[' cache'].map.has('async1')).toBe(false); // Evicted
    expect(cache[' cache'].map.has('async3')).toBe(true);
    expect(cache[' cache'].map.has('async4')).toBe(true);

    // Verify final values
    expect(await cache.getAsync('async3')).toBe('asyncValue3');
    expect(await cache.getAsync('async4')).toBe('asyncValue4');
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
          "expiration": undefined,
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

    const cache = createCache({ maxItemAge: { seconds: 60 } }); // 60 seconds
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

    const cache = createCache({ maxItemAge: { seconds: 60 } }); // 60 seconds

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

  test('get should respect maxItemAge', () => {
    vi.useFakeTimers();
    const cache = createCache<string>({ maxItemAge: { seconds: 60 } }); // 60 seconds

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
  test('should store value with custom expiration time inferior to default', () => {
    vi.useFakeTimers();
    const now = new Date('2025-01-01T00:00:00.000Z');
    vi.setSystemTime(now);

    const cache = createCache<string>({ maxItemAge: { seconds: 60 } }); // 60 seconds default

    const value = cache.getOrInsert('key1', ({ withExpiration }) => {
      return withExpiration('value1', { seconds: 30 }); // 30 seconds expiration
    });

    expect(value).toBe('value1');

    // Advance time by 29 seconds (not expired)
    vi.advanceTimersByTime(29 * 1000);
    expect(cache.get('key1')).toBe('value1');

    // Advance time by 2 more seconds (expired)
    vi.advanceTimersByTime(2 * 1000);
    expect(cache.get('key1')).toBeUndefined();

    vi.useRealTimers();
  });

  test('should work with duration object', () => {
    vi.useFakeTimers();
    const now = new Date('2025-01-01T00:00:00.000Z');
    vi.setSystemTime(now);

    const cache = createCache<string>({ maxItemAge: { seconds: 120 } }); // 120 seconds default

    const value = cache.getOrInsert('key1', ({ withExpiration }) => {
      return withExpiration('value1', { seconds: 60 }); // 60 seconds expiration
    });

    expect(value).toBe('value1');

    // Advance time by 59 seconds (not expired)
    vi.advanceTimersByTime(59 * 1000);
    expect(cache.get('key1')).toBe('value1');

    // Advance time by 2 more seconds (expired)
    vi.advanceTimersByTime(2 * 1000);
    expect(cache.get('key1')).toBeUndefined();

    vi.useRealTimers();
  });

  test('should work with custom expiration time superior to default', () => {
    vi.useFakeTimers();
    const now = new Date('2025-01-01T00:00:00.000Z');
    vi.setSystemTime(now);

    const cache = createCache<string>({ maxItemAge: { seconds: 30 } }); // 30 seconds default

    const value = cache.getOrInsert('key1', ({ withExpiration }) => {
      return withExpiration('value1', { seconds: 60 }); // 60 seconds expiration
    });

    expect(value).toBe('value1');

    // Advance time by 31 seconds (default expiration would trigger)
    vi.advanceTimersByTime(31 * 1000);
    expect(cache.get('key1')).toBe('value1'); // Still valid

    // Advance time to 61 seconds (custom expiration triggers)
    vi.advanceTimersByTime(30 * 1000);
    expect(cache.get('key1')).toBeUndefined();

    vi.useRealTimers();
  });

  test('works with cache.set and cache.get', () => {
    vi.useFakeTimers();
    const cache = createCache<string>({
      maxItemAge: { ms: 100 },
    });
    cache.set('key1', new WithExpiration('value1', { seconds: 30 }));
    expect(cache.get('key1')).toBe('value1');

    vi.advanceTimersByTime(31 * 1000);
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

  test.concurrent(
    'works with cache.setAsync and cache.getAsync',
    { retry: 3 },
    async () => {
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
    },
  );
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

  test('should delete a single key', () => {
    const cache = createCache<string>();
    cache.getOrInsert('key1', () => 'value1');
    cache.getOrInsert('key2', () => 'value2');

    cache.delete('key1');

    expect(cache.has('key1')).toBe(false);
    expect(cache.has('key2')).toBe(true);

    const mockFn = vi.fn(() => 'new-value1');
    expect(cache.getOrInsert('key1', mockFn)).toBe('new-value1');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('should delete multiple keys at once', () => {
    const cache = createCache<string>();
    cache.getOrInsert('key1', () => 'value1');
    cache.getOrInsert('key2', () => 'value2');
    cache.getOrInsert('key3', () => 'value3');

    cache.delete('key1', 'key3');

    expect(cache.has('key1')).toBe(false);
    expect(cache.has('key2')).toBe(true);
    expect(cache.has('key3')).toBe(false);
  });

  test('should return false from has for expired items', () => {
    vi.useFakeTimers();
    vi.setSystemTime('2025-01-01T00:00:00.000Z');

    const cache = createCache<string>({ maxItemAge: { seconds: 10 } });
    cache.getOrInsert('key1', () => 'value1');

    expect(cache.has('key1')).toBe(true);

    vi.advanceTimersByTime(11_000);

    expect(cache.has('key1')).toBe(false);
  });

  test('should silently ignore deleting non-existent keys', () => {
    const cache = createCache<string>();
    cache.delete('non-existent');
    expect(cache.has('non-existent')).toBe(false);
  });
});

describe('fastCache', () => {
  test('should store and retrieve values', () => {
    const mockGetValue = vi.fn(() => 'value1');
    const cache = fastCache<string>();

    const value = cache.getOrInsert('key1', mockGetValue);
    expect(value).toBe('value1');
    expect(mockGetValue).toHaveBeenCalledTimes(1);

    // Second call should return cached value
    const cachedValue = cache.getOrInsert('key1', mockGetValue);
    expect(cachedValue).toBe('value1');
    expect(mockGetValue).toHaveBeenCalledTimes(1);
  });

  test('should work with different value types', () => {
    const cache = fastCache<number | string | object>();

    const numberValue = cache.getOrInsert('num', () => 42);
    const stringValue = cache.getOrInsert('str', () => 'hello');
    const objectValue = cache.getOrInsert('obj', () => ({ foo: 'bar' }));

    expect(numberValue).toBe(42);
    expect(stringValue).toBe('hello');
    expect(objectValue).toEqual({ foo: 'bar' });
  });

  test('should handle multiple different keys', () => {
    const cache = fastCache<string>();
    const mockFn1 = vi.fn(() => 'value1');
    const mockFn2 = vi.fn(() => 'value2');
    const mockFn3 = vi.fn(() => 'value3');

    const value1 = cache.getOrInsert('key1', mockFn1);
    const value2 = cache.getOrInsert('key2', mockFn2);
    const value3 = cache.getOrInsert('key3', mockFn3);

    expect(value1).toBe('value1');
    expect(value2).toBe('value2');
    expect(value3).toBe('value3');
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
    expect(mockFn3).toHaveBeenCalledTimes(1);

    // Subsequent calls should use cached values
    expect(cache.getOrInsert('key1', mockFn1)).toBe('value1');
    expect(cache.getOrInsert('key2', mockFn2)).toBe('value2');
    expect(cache.getOrInsert('key3', mockFn3)).toBe('value3');
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
    expect(mockFn3).toHaveBeenCalledTimes(1);
  });

  test('should respect maxCacheSize and remove oldest entries (FIFO)', () => {
    const cache = fastCache<string>({ maxCacheSize: 2 });

    cache.getOrInsert('key1', () => 'value1');
    cache.getOrInsert('key2', () => 'value2');

    // Cache should contain both values
    expect(cache.getOrInsert('key1', () => 'new-value1')).toBe('value1');
    expect(cache.getOrInsert('key2', () => 'new-value2')).toBe('value2');

    // Adding third item should remove the first (oldest)
    cache.getOrInsert('key3', () => 'value3');

    // key1 should be evicted, so it should be recomputed
    const mockFnForKey1 = vi.fn(() => 'new-value1');
    expect(cache.getOrInsert('key1', mockFnForKey1)).toBe('new-value1');
    expect(mockFnForKey1).toHaveBeenCalledTimes(1); // Called because key1 was evicted

    // After re-adding key1, key2 gets evicted, so it should be recomputed
    const mockFnForKey2 = vi.fn(() => 'new-value2');
    expect(cache.getOrInsert('key2', mockFnForKey2)).toBe('new-value2');
    expect(mockFnForKey2).toHaveBeenCalledTimes(1); // Called because key2 was evicted

    // At this point cache should have [key1, key2], but key3 was evicted
    // So accessing key3 again should trigger recomputation and evict key1
    const mockFnForKey3 = vi.fn(() => 'newer-value3');
    expect(cache.getOrInsert('key3', mockFnForKey3)).toBe('newer-value3'); // Recomputed because evicted
    expect(mockFnForKey3).toHaveBeenCalledTimes(1); // Called because key3 was evicted

    // Now cache should have [key2, key3], so key1 was evicted again
    // But key2 should still be cached
    const mockFnForKey2Again = vi.fn(() => 'newer-value2');
    expect(cache.getOrInsert('key2', mockFnForKey2Again)).toBe('new-value2'); // Still cached from before
    expect(mockFnForKey2Again).not.toHaveBeenCalled(); // Should use cached value
  });

  test('should handle edge case with maxCacheSize of 1', () => {
    const cache = fastCache<string>({ maxCacheSize: 1 });
    const mockFn1 = vi.fn(() => 'value1');
    const mockFn2 = vi.fn(() => 'value2');

    cache.getOrInsert('key1', mockFn1);
    expect(cache.getOrInsert('key1', mockFn1)).toBe('value1');
    expect(mockFn1).toHaveBeenCalledTimes(1);

    // Adding second key should evict first
    cache.getOrInsert('key2', mockFn2);
    expect(cache.getOrInsert('key2', mockFn2)).toBe('value2');
    expect(mockFn2).toHaveBeenCalledTimes(1);

    // First key should be evicted
    expect(cache.getOrInsert('key1', mockFn1)).toBe('value1');
    expect(mockFn1).toHaveBeenCalledTimes(2); // Called again
  });

  test('should handle maxCacheSize of 0', () => {
    const cache = fastCache<string>({ maxCacheSize: 0 });
    const mockFn = vi.fn(() => 'value1');

    // Should never cache with size 0, but still return the computed value
    expect(cache.getOrInsert('key1', mockFn)).toBe('value1');
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Should call function again since nothing is cached
    expect(cache.getOrInsert('key1', mockFn)).toBe('value1');
    expect(mockFn).toHaveBeenCalledTimes(2); // Called again
  });

  test('should clear all cached values', () => {
    const cache = fastCache<string>();
    const mockFn1 = vi.fn(() => 'value1');
    const mockFn2 = vi.fn(() => 'value2');

    cache.getOrInsert('key1', mockFn1);
    cache.getOrInsert('key2', mockFn2);

    // Values should be cached
    expect(cache.getOrInsert('key1', mockFn1)).toBe('value1');
    expect(cache.getOrInsert('key2', mockFn2)).toBe('value2');
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);

    // Clear the cache
    cache.clear();

    // Values should be recomputed
    expect(cache.getOrInsert('key1', mockFn1)).toBe('value1');
    expect(cache.getOrInsert('key2', mockFn2)).toBe('value2');
    expect(mockFn1).toHaveBeenCalledTimes(2);
    expect(mockFn2).toHaveBeenCalledTimes(2);
  });

  test('should handle functions that return undefined', () => {
    const cache = fastCache<string | undefined>();
    const mockFn = vi.fn(() => undefined);

    const value = cache.getOrInsert('key1', mockFn);
    expect(value).toBeUndefined();
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Should cache undefined value
    const cachedValue = cache.getOrInsert('key1', mockFn);
    expect(cachedValue).toBeUndefined();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('should handle functions that return null', () => {
    const cache = fastCache<string | null>();
    const mockFn = vi.fn(() => null);

    const value = cache.getOrInsert('key1', mockFn);
    expect(value).toBeNull();
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Should cache null value
    const cachedValue = cache.getOrInsert('key1', mockFn);
    expect(cachedValue).toBeNull();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('should handle functions that throw errors', () => {
    const cache = fastCache<string>();
    const error = new Error('Test error');
    const mockFn = vi.fn(() => {
      throw error;
    });

    expect(() => cache.getOrInsert('key1', mockFn)).toThrow(error);
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Should not cache failed computations
    expect(() => cache.getOrInsert('key1', mockFn)).toThrow(error);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test('should handle expensive computations correctly', () => {
    const cache = fastCache<number>();
    let callCount = 0;

    const expensiveComputation = vi.fn(() => {
      callCount++;
      return callCount * 100;
    });

    // First call
    const result1 = cache.getOrInsert('expensive', expensiveComputation);
    expect(result1).toBe(100);
    expect(expensiveComputation).toHaveBeenCalledTimes(1);

    // Subsequent calls should return cached result
    const result2 = cache.getOrInsert('expensive', expensiveComputation);
    const result3 = cache.getOrInsert('expensive', expensiveComputation);
    expect(result2).toBe(100);
    expect(result3).toBe(100);
    expect(expensiveComputation).toHaveBeenCalledTimes(1);
  });

  test('should work with complex objects and preserve references', () => {
    const cache = fastCache<{ data: number[]; metadata: { id: string } }>();
    const complexObject = {
      data: [1, 2, 3, 4, 5],
      metadata: { id: 'test-123' }
    };

    const mockFn = vi.fn(() => complexObject);

    const result1 = cache.getOrInsert('complex', mockFn);
    const result2 = cache.getOrInsert('complex', mockFn);

    expect(result1).toBe(complexObject); // Same reference
    expect(result2).toBe(complexObject); // Same reference
    expect(result1).toBe(result2); // Same reference
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('should trim cache correctly when exceeding size by multiple items', () => {
    const cache = fastCache<string>({ maxCacheSize: 3 });

    // Fill cache to capacity
    cache.getOrInsert('key1', () => 'value1');
    cache.getOrInsert('key2', () => 'value2');
    cache.getOrInsert('key3', () => 'value3');

    // Add two more items, should remove the first two oldest entries
    cache.getOrInsert('key4', () => 'value4');
    cache.getOrInsert('key5', () => 'value5');

    // At this point cache should have [key3, key4, key5]
    // key1 and key2 should be evicted
    const mockFn1 = vi.fn(() => 'new-value1');
    const mockFn2 = vi.fn(() => 'new-value2');

    expect(cache.getOrInsert('key1', mockFn1)).toBe('new-value1');
    expect(cache.getOrInsert('key2', mockFn2)).toBe('new-value2');
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);

    // However, accessing key1 and key2 above will have evicted other keys
    // So let's just verify that the cache is working with FIFO behavior
    // by checking the most recently added items
    const cache2 = fastCache<string>({ maxCacheSize: 3 });
    cache2.getOrInsert('a', () => 'value-a');
    cache2.getOrInsert('b', () => 'value-b');
    cache2.getOrInsert('c', () => 'value-c');

    // All should be cached
    expect(cache2.getOrInsert('a', () => 'new-a')).toBe('value-a');
    expect(cache2.getOrInsert('b', () => 'new-b')).toBe('value-b');
    expect(cache2.getOrInsert('c', () => 'new-c')).toBe('value-c');

    // Add one more item
    cache2.getOrInsert('d', () => 'value-d');

    // Now 'a' should be evicted, but b, c, d should remain
    // Test this by checking only the remaining keys without accessing the evicted one
    const mockFnB = vi.fn(() => 'new-b');
    const mockFnC = vi.fn(() => 'new-c');
    const mockFnD = vi.fn(() => 'new-d');
    expect(cache2.getOrInsert('b', mockFnB)).toBe('value-b'); // Still cached
    expect(cache2.getOrInsert('c', mockFnC)).toBe('value-c'); // Still cached
    expect(cache2.getOrInsert('d', mockFnD)).toBe('value-d'); // Still cached
    expect(mockFnB).not.toHaveBeenCalled();
    expect(mockFnC).not.toHaveBeenCalled();
    expect(mockFnD).not.toHaveBeenCalled();

    // Now test that 'a' was indeed evicted by accessing it
    const mockFnA = vi.fn(() => 'new-a');
    expect(cache2.getOrInsert('a', mockFnA)).toBe('new-a');
    expect(mockFnA).toHaveBeenCalledTimes(1); // Was evicted and recomputed
  });

  test('should delete a single key', () => {
    const cache = fastCache<string>();
    cache.getOrInsert('key1', () => 'value1');
    cache.getOrInsert('key2', () => 'value2');

    cache.delete('key1');

    expect(cache.has('key1')).toBe(false);
    expect(cache.has('key2')).toBe(true);

    const mockFn = vi.fn(() => 'new-value1');
    expect(cache.getOrInsert('key1', mockFn)).toBe('new-value1');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('should delete multiple keys at once', () => {
    const cache = fastCache<string>();
    cache.getOrInsert('key1', () => 'value1');
    cache.getOrInsert('key2', () => 'value2');
    cache.getOrInsert('key3', () => 'value3');

    cache.delete('key1', 'key3');

    expect(cache.has('key1')).toBe(false);
    expect(cache.has('key2')).toBe(true);
    expect(cache.has('key3')).toBe(false);
  });

  test('should use default maxCacheSize when not specified', () => {
    const cache = fastCache<string>(); // Default should be 1000

    // Test that we can store many items (proving default is not 0 or 1)
    for (let i = 0; i < 100; i++) {
      cache.getOrInsert(`key${i}`, () => `value${i}`);
    }

    // All should be cached (since 100 < 1000 default)
    for (let i = 0; i < 100; i++) {
      const mockFn = vi.fn(() => `new-value${i}`);
      expect(cache.getOrInsert(`key${i}`, mockFn)).toBe(`value${i}`);
      expect(mockFn).not.toHaveBeenCalled();
    }
  });
});
