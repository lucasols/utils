import { describe, expect, test } from 'vitest';
import {
  getAutoIncrementId,
  getLocalAutoIncrementIdGenerator,
} from './getAutoIncrementId';

describe('getAutoIncrementId', () => {
  // Note: Since getAutoIncrementId uses a global counter, we can't reset it between tests
  // So these tests are designed to work with the incrementing nature

  test('should return incrementing numbers', () => {
    const id1 = getAutoIncrementId();
    const id2 = getAutoIncrementId();
    const id3 = getAutoIncrementId();

    expect(typeof id1).toBe('number');
    expect(typeof id2).toBe('number');
    expect(typeof id3).toBe('number');
    expect(id2).toBe(id1 + 1);
    expect(id3).toBe(id2 + 1);
  });

  test('should always return unique values', () => {
    const ids = new Set();

    for (let i = 0; i < 100; i++) {
      const id = getAutoIncrementId();
      expect(ids.has(id)).toBe(false);
      ids.add(id);
    }

    expect(ids.size).toBe(100);
  });

  test('should return positive integers', () => {
    const id1 = getAutoIncrementId();
    const id2 = getAutoIncrementId();

    expect(id1).toBeGreaterThan(0);
    expect(id2).toBeGreaterThan(0);
    expect(Number.isInteger(id1)).toBe(true);
    expect(Number.isInteger(id2)).toBe(true);
  });
});

describe('getLocalAutoIncrementIdGenerator', () => {
  test('should create independent generators', () => {
    const gen1 = getLocalAutoIncrementIdGenerator({ prefix: 'a-' });
    const gen2 = getLocalAutoIncrementIdGenerator({ prefix: 'b-' });

    expect(gen1()).toBe('a-1');
    expect(gen2()).toBe('b-1');
    expect(gen1()).toBe('a-2');
    expect(gen2()).toBe('b-2');
  });

  test('should work with prefix only', () => {
    const generator = getLocalAutoIncrementIdGenerator({ prefix: 'test-' });

    expect(generator()).toBe('test-1');
    expect(generator()).toBe('test-2');
    expect(generator()).toBe('test-3');
  });

  test('should work with suffix only', () => {
    const generator = getLocalAutoIncrementIdGenerator({ suffix: '-end' });

    expect(generator()).toBe('1-end');
    expect(generator()).toBe('2-end');
    expect(generator()).toBe('3-end');
  });

  test('should work with both prefix and suffix', () => {
    const generator = getLocalAutoIncrementIdGenerator({
      prefix: 'start-',
      suffix: '-end',
    });

    expect(generator()).toBe('start-1-end');
    expect(generator()).toBe('start-2-end');
    expect(generator()).toBe('start-3-end');
  });

  test('should work without prefix or suffix', () => {
    const generator = getLocalAutoIncrementIdGenerator({});

    expect(generator()).toBe('1');
    expect(generator()).toBe('2');
    expect(generator()).toBe('3');
  });

  test('should handle empty strings for prefix and suffix', () => {
    const generator = getLocalAutoIncrementIdGenerator({
      prefix: '',
      suffix: '',
    });

    expect(generator()).toBe('1');
    expect(generator()).toBe('2');
    expect(generator()).toBe('3');
  });

  test('should handle complex prefix and suffix strings', () => {
    const generator = getLocalAutoIncrementIdGenerator({
      prefix: 'component-id-',
      suffix: '-instance-v1',
    });

    expect(generator()).toBe('component-id-1-instance-v1');
    expect(generator()).toBe('component-id-2-instance-v1');
  });

  test('should maintain separate counters for each generator instance', () => {
    const userGen = getLocalAutoIncrementIdGenerator({ prefix: 'user-' });
    const postGen = getLocalAutoIncrementIdGenerator({ prefix: 'post-' });
    const errorGen = getLocalAutoIncrementIdGenerator({ prefix: 'ERR' });

    // Interleave calls to verify independence
    expect(userGen()).toBe('user-1');
    expect(postGen()).toBe('post-1');
    expect(userGen()).toBe('user-2');
    expect(errorGen()).toBe('ERR1');
    expect(postGen()).toBe('post-2');
    expect(userGen()).toBe('user-3');
    expect(errorGen()).toBe('ERR2');
  });

  test('should generate unique IDs across many calls', () => {
    const generator = getLocalAutoIncrementIdGenerator({ prefix: 'item-' });
    const ids = new Set();

    for (let i = 0; i < 1000; i++) {
      const id = generator();
      expect(ids.has(id)).toBe(false);
      ids.add(id);
    }

    expect(ids.size).toBe(1000);
  });

  test('should handle special characters in prefix and suffix', () => {
    const generator = getLocalAutoIncrementIdGenerator({
      prefix: 'test@#$-',
      suffix: '-[special]',
    });

    expect(generator()).toBe('test@#$-1-[special]');
    expect(generator()).toBe('test@#$-2-[special]');
  });

  test('should handle unicode characters in prefix and suffix', () => {
    const generator = getLocalAutoIncrementIdGenerator({
      prefix: '🚀-',
      suffix: '-✨',
    });

    expect(generator()).toBe('🚀-1-✨');
    expect(generator()).toBe('🚀-2-✨');
  });

  test('should work with very long prefix and suffix', () => {
    const longPrefix = 'a'.repeat(100);
    const longSuffix = 'z'.repeat(100);
    const generator = getLocalAutoIncrementIdGenerator({
      prefix: longPrefix,
      suffix: longSuffix,
    });

    const result = generator();
    expect(result).toBe(`${longPrefix}1${longSuffix}`);
    expect(result.length).toBe(201); // 100 + 1 + 100
  });

  test('should continue incrementing after many calls', () => {
    const generator = getLocalAutoIncrementIdGenerator({ prefix: 'test-' });

    // Skip to a high number
    for (let i = 0; i < 999; i++) {
      generator();
    }

    expect(generator()).toBe('test-1000');
    expect(generator()).toBe('test-1001');
  });
});
