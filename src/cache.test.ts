import { describe, expect, test, vi } from 'vitest';
import { cachedGetter, createCache } from './cache';

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

    expect(cache['~cache']).toMatchInlineSnapshot(`
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

    expect(cache['~cache']).toMatchInlineSnapshot(`
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

    expect(cache['~cache']).toMatchInlineSnapshot(`Map {}`);
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
    expect(cache['~cache']).toMatchInlineSnapshot(`
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

    expect(cache['~cache'].size).toBe(1);
    expect(cache['~cache'].get('key3')).toBeDefined();
    expect(cache['~cache'].get('key1')).toBeUndefined();
    expect(cache['~cache'].get('key2')).toBeUndefined();

    vi.useRealTimers();
  });
});
