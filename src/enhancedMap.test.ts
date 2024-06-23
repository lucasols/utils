import { describe, expect, test } from 'vitest';
import { EnhancedMap } from './enhancedMap';

describe('EnhancedMap', () => {
  test('find', () => {
    const map = new EnhancedMap<string, number>([
      ['one', 1],
      ['two', 2],
      ['three', 3],
    ]);
    expect(map.find((value) => value > 2)).toEqual({ key: 'three', value: 3 });
    expect(map.find((value) => value > 5)).toBeUndefined();
  });

  test('setMultiple', () => {
    const map = new EnhancedMap<string, number>();
    map.setMultiple(['one', 1], ['two', 2]);
    expect(map.get('one')).toBe(1);
    expect(map.get('two')).toBe(2);
  });

  test('setMultiple with object', () => {
    const map = new EnhancedMap<string, number>();
    map.setMultiple({ one: 1, two: 2 });
    expect(map.get('one')).toBe(1);
    expect(map.get('two')).toBe(2);

    const map2 = new EnhancedMap<{ obj: string }, number>();
    // @ts-expect-error - maps with non string keys should not allow to use objects in setMultiple
    map2.setMultiple({ obj: 'one', two: 2 });
  });

  test('getOrThrow', () => {
    const map = new EnhancedMap<string, number>([['one', 1]]);
    expect(map.getOrThrow('one')).toBe(1);
    expect(() => map.getOrThrow('nonexistent')).toThrow(
      'Key nonexistent not found in EnhancedMap',
    );
  });

  test('getOrInsert', () => {
    const map = new EnhancedMap<string, number>([['one', 1]]);
    expect(map.getOrInsert('two', () => 2)).toBe(2);
    expect(map.get('two')).toBe(2);
    expect(map.getOrInsert('one', () => 10)).toBe(1); // Existing key should not be overwritten
  });

  test('toFilteredValues', () => {
    const map = new EnhancedMap<string, number>([
      ['one', 1],
      ['two', 2],
      ['three', 3],
    ]);
    expect(map.toFilteredValues((value) => value > 1)).toEqual([2, 3]);
  });

  test('toMap', () => {
    const map = new EnhancedMap<string, number>([
      ['one', 1],
      ['two', 2],
      ['three', 3],
    ]);
    const result = map.toMap((value, key, reject) => {
      if (value > 1) return value * 2;
      return reject;
    });
    expect(result).toEqual([4, 6]);
  });

  test('toObjMap', () => {
    const map = new EnhancedMap<string, number>([
      ['one', 1],
      ['two', 2],
      ['three', 3],
    ]);
    const result = map.toObjMap((value, key) => {
      if (value > 1) return [`${key}Double`, value * 2];
      return false;
    });
    expect(result).toEqual({ twoDouble: 4, threeDouble: 6 });
  });

  test('toValues', () => {
    const map = new EnhancedMap<string, number>([
      ['one', 1],
      ['two', 2],
      ['three', 3],
    ]);
    expect(map.toValues()).toEqual([1, 2, 3]);
  });

  test('toKeys', () => {
    const map = new EnhancedMap<string, number>([
      ['one', 1],
      ['two', 2],
      ['three', 3],
    ]);
    expect(map.toKeys()).toEqual(['one', 'two', 'three']);
  });

  describe('static methods', () => {
    test('fromIterMap (deprecated)', () => {
      const array = [1, 2, 3, 4];
      const result = EnhancedMap.fromIterMap(array, (item) => {
        if (item % 2 === 0) return [`even${item}`, item * 2];
        return false;
      });
      expect(result.get('even2')).toBe(4);
      expect(result.get('even4')).toBe(8);
      expect(result.size).toBe(2);
    });

    describe('from', () => {
      test('with key', () => {
        const array = [
          { id: 1, value: 'one' },
          { id: 2, value: 'two' },
        ];
        const result = EnhancedMap.from(array, 'id');
        expect(result.get(1)).toEqual({ id: 1, value: 'one' });
        expect(result.get(2)).toEqual({ id: 2, value: 'two' });
      });

      test('with map function', () => {
        const array = [1, 2, 3, 4];
        const result = EnhancedMap.from(array, (item) => {
          if (item % 2 === 0) return [`even${item}`, item * 2];
          return false;
        });
        expect(result.get('even2')).toBe(4);
        expect(result.get('even4')).toBe(8);
        expect(result.size).toBe(2);
      });

      test('with null or undefined input', () => {
        expect(EnhancedMap.from(null, 'id').size).toBe(0);
        expect(EnhancedMap.from(undefined, 'id').size).toBe(0);
      });
    });
  });
});
