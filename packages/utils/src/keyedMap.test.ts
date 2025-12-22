import { describe, expect, test } from 'vitest';
import { CompositeKeyMap, KeyedMap } from './keyedMap';

type Coord = { x: number; y: number };

describe('KeyedMap', () => {
  test('constructor with getKey function', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    expect(map.size).toBe(0);
  });

  test('constructor with entries', () => {
    const entries: [Coord, string][] = [
      [{ x: 1, y: 2 }, 'a'],
      [{ x: 3, y: 4 }, 'b'],
    ];
    const map = new KeyedMap<Coord, string, string>(
      (key) => `${key.x},${key.y}`,
      entries,
    );
    expect(map.size).toBe(2);
  });

  test('set and get', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    map.set({ x: 1, y: 2 }, 'point A');
    expect(map.get({ x: 1, y: 2 })).toBe('point A');
  });

  test('get with different object but same key', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    map.set({ x: 1, y: 2 }, 'point A');
    expect(map.get({ x: 1, y: 2 })).toBe('point A');
  });

  test('set returns this for chaining', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    const result = map.set({ x: 1, y: 2 }, 'a').set({ x: 3, y: 4 }, 'b');
    expect(result).toBe(map);
    expect(map.size).toBe(2);
  });

  test('set replaces value with same key', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    map.set({ x: 1, y: 2 }, 'original');
    map.set({ x: 1, y: 2 }, 'replaced');
    expect(map.size).toBe(1);
    expect(map.get({ x: 1, y: 2 })).toBe('replaced');
  });

  test('setMultiple', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    map.setMultiple([
      [{ x: 1, y: 2 }, 'a'],
      [{ x: 3, y: 4 }, 'b'],
    ]);
    expect(map.size).toBe(2);
    expect(map.get({ x: 1, y: 2 })).toBe('a');
    expect(map.get({ x: 3, y: 4 })).toBe('b');
  });

  test('has', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    map.set({ x: 1, y: 2 }, 'a');
    expect(map.has({ x: 1, y: 2 })).toBe(true);
    expect(map.has({ x: 3, y: 4 })).toBe(false);
  });

  test('delete', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    map.set({ x: 1, y: 2 }, 'a');
    expect(map.delete({ x: 1, y: 2 })).toBe(true);
    expect(map.size).toBe(0);
    expect(map.delete({ x: 1, y: 2 })).toBe(false);
  });

  test('deleteMultiple', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    map.setMultiple([
      [{ x: 1, y: 2 }, 'a'],
      [{ x: 3, y: 4 }, 'b'],
      [{ x: 5, y: 6 }, 'c'],
    ]);
    const deleted = map.deleteMultiple([{ x: 1, y: 2 }, { x: 5, y: 6 }, { x: 7, y: 8 }]);
    expect(deleted).toBe(2);
    expect(map.size).toBe(1);
    expect(map.has({ x: 3, y: 4 })).toBe(true);
  });

  test('clear', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    map.setMultiple([
      [{ x: 1, y: 2 }, 'a'],
      [{ x: 3, y: 4 }, 'b'],
    ]);
    map.clear();
    expect(map.size).toBe(0);
  });

  test('forEach', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    map.setMultiple([
      [{ x: 1, y: 2 }, 'a'],
      [{ x: 3, y: 4 }, 'b'],
    ]);
    const collected: [Coord, string][] = [];
    const forEachFn = map.forEach.bind(map);
    forEachFn((value, key) => {
      collected.push([key, value]);
    });
    expect(collected).toEqual([
      [{ x: 1, y: 2 }, 'a'],
      [{ x: 3, y: 4 }, 'b'],
    ]);
  });

  test('find', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    map.setMultiple([
      [{ x: 1, y: 2 }, 'a'],
      [{ x: 3, y: 4 }, 'b'],
    ]);
    expect(map.find((value) => value === 'b')).toEqual({
      key: { x: 3, y: 4 },
      value: 'b',
    });
    expect(map.find((value) => value === 'c')).toBeUndefined();
  });

  test('getOrThrow', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    map.set({ x: 1, y: 2 }, 'a');
    expect(map.getOrThrow({ x: 1, y: 2 })).toBe('a');
    expect(() => map.getOrThrow({ x: 3, y: 4 })).toThrow('Key not found in KeyedMap');
  });

  test('getOrInsert', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    map.set({ x: 1, y: 2 }, 'existing');
    expect(map.getOrInsert({ x: 1, y: 2 }, () => 'new')).toBe('existing');
    expect(map.getOrInsert({ x: 3, y: 4 }, () => 'inserted')).toBe('inserted');
    expect(map.get({ x: 3, y: 4 })).toBe('inserted');
  });

  test('toFilteredValues', () => {
    const map = new KeyedMap<Coord, number, string>((key) => `${key.x},${key.y}`);
    map.setMultiple([
      [{ x: 1, y: 2 }, 10],
      [{ x: 3, y: 4 }, 20],
      [{ x: 5, y: 6 }, 30],
    ]);
    expect(map.toFilteredValues((value) => value > 15)).toEqual([20, 30]);
  });

  test('toValues', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    map.setMultiple([
      [{ x: 1, y: 2 }, 'a'],
      [{ x: 3, y: 4 }, 'b'],
    ]);
    expect(map.toValues()).toEqual(['a', 'b']);
  });

  test('toKeys', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    map.setMultiple([
      [{ x: 1, y: 2 }, 'a'],
      [{ x: 3, y: 4 }, 'b'],
    ]);
    expect(map.toKeys()).toEqual([
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ]);
  });

  test('keys iterator', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    map.setMultiple([
      [{ x: 1, y: 2 }, 'a'],
      [{ x: 3, y: 4 }, 'b'],
    ]);
    expect([...map.keys()]).toEqual([
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ]);
  });

  test('values iterator', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    map.setMultiple([
      [{ x: 1, y: 2 }, 'a'],
      [{ x: 3, y: 4 }, 'b'],
    ]);
    expect([...map.values()]).toEqual(['a', 'b']);
  });

  test('entries iterator', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    map.setMultiple([
      [{ x: 1, y: 2 }, 'a'],
      [{ x: 3, y: 4 }, 'b'],
    ]);
    expect([...map.entries()]).toEqual([
      [{ x: 1, y: 2 }, 'a'],
      [{ x: 3, y: 4 }, 'b'],
    ]);
  });

  test('Symbol.iterator', () => {
    const map = new KeyedMap<Coord, string, string>((key) => `${key.x},${key.y}`);
    map.setMultiple([
      [{ x: 1, y: 2 }, 'a'],
      [{ x: 3, y: 4 }, 'b'],
    ]);
    expect([...map]).toEqual([
      [{ x: 1, y: 2 }, 'a'],
      [{ x: 3, y: 4 }, 'b'],
    ]);
  });
});

describe('CompositeKeyMap', () => {
  test('uses deep equality for keys', () => {
    const map = new CompositeKeyMap<Coord, string>();
    map.set({ x: 1, y: 2 }, 'point A');
    expect(map.get({ x: 1, y: 2 })).toBe('point A');
    expect(map.size).toBe(1);
  });

  test('constructor with entries', () => {
    const map = new CompositeKeyMap<Coord, string>([
      [{ x: 1, y: 2 }, 'a'],
      [{ x: 3, y: 4 }, 'b'],
    ]);
    expect(map.size).toBe(2);
    expect(map.get({ x: 1, y: 2 })).toBe('a');
  });

  test('same structure keys are considered equal', () => {
    const map = new CompositeKeyMap<Coord, string>();
    map.set({ x: 1, y: 2 }, 'first');
    map.set({ x: 1, y: 2 }, 'second');
    expect(map.size).toBe(1);
    expect(map.get({ x: 1, y: 2 })).toBe('second');
  });

  test('works with complex nested keys', () => {
    type ComplexKey = { a: { b: number }; c: number[] };
    const map = new CompositeKeyMap<ComplexKey, string>();
    map.set({ a: { b: 1 }, c: [1, 2, 3] }, 'value');
    expect(map.get({ a: { b: 1 }, c: [1, 2, 3] })).toBe('value');
    expect(map.has({ a: { b: 1 }, c: [1, 2, 3] })).toBe(true);
  });
});
