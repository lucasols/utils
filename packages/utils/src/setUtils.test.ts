import { describe, expect, test } from 'vitest';
import { KeyedSet } from './setUtils';

type Item = { id: number; name: string };

describe('KeyedSet', () => {
  test('constructor with getKey function', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    expect(set.size).toBe(0);
  });

  test('constructor with iterable', () => {
    const items: Item[] = [
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
    ];
    const set = new KeyedSet<Item, number>((item) => item.id, items);
    expect(set.size).toBe(2);
  });

  test('add item', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    set.add({ id: 1, name: 'one' });
    expect(set.size).toBe(1);
    expect(set.hasKey(1)).toBe(true);
  });

  test('add returns this for chaining', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    const result = set.add({ id: 1, name: 'one' }).add({ id: 2, name: 'two' });
    expect(result).toBe(set);
    expect(set.size).toBe(2);
  });

  test('add replaces item with same key', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    set.add({ id: 1, name: 'one' });
    set.add({ id: 1, name: 'replaced' });
    expect(set.size).toBe(1);
    expect(set.getByKey(1)).toEqual({ id: 1, name: 'replaced' });
  });

  test('addMultiple', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    set.addMultiple([
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
    ]);
    expect(set.size).toBe(2);
  });

  test('addMultiple returns this for chaining', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    const result = set.addMultiple([{ id: 1, name: 'one' }]);
    expect(result).toBe(set);
  });

  test('has checks by key', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    set.add({ id: 1, name: 'one' });
    expect(set.has({ id: 1, name: 'different' })).toBe(true);
    expect(set.has({ id: 2, name: 'two' })).toBe(false);
  });

  test('hasKey', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    set.add({ id: 1, name: 'one' });
    expect(set.hasKey(1)).toBe(true);
    expect(set.hasKey(2)).toBe(false);
  });

  test('getByKey', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    set.add({ id: 1, name: 'one' });
    expect(set.getByKey(1)).toEqual({ id: 1, name: 'one' });
    expect(set.getByKey(2)).toBeUndefined();
  });

  test('delete', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    set.add({ id: 1, name: 'one' });
    expect(set.delete({ id: 1, name: 'any' })).toBe(true);
    expect(set.size).toBe(0);
    expect(set.delete({ id: 1, name: 'any' })).toBe(false);
  });

  test('deleteByKey', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    set.add({ id: 1, name: 'one' });
    expect(set.deleteByKey(1)).toBe(true);
    expect(set.size).toBe(0);
    expect(set.deleteByKey(1)).toBe(false);
  });

  test('deleteMultiple', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    set.addMultiple([
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
      { id: 3, name: 'three' },
    ]);
    const deleted = set.deleteMultiple([
      { id: 1, name: 'any' },
      { id: 3, name: 'any' },
      { id: 4, name: 'nonexistent' },
    ]);
    expect(deleted).toBe(2);
    expect(set.size).toBe(1);
    expect(set.hasKey(2)).toBe(true);
  });

  test('deleteMultipleByKeys', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    set.addMultiple([
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
      { id: 3, name: 'three' },
    ]);
    const deleted = set.deleteMultipleByKeys([1, 3, 4]);
    expect(deleted).toBe(2);
    expect(set.size).toBe(1);
    expect(set.hasKey(2)).toBe(true);
  });

  test('clear', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    set.addMultiple([
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
    ]);
    set.clear();
    expect(set.size).toBe(0);
  });

  test('forEach', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    set.addMultiple([
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
    ]);
    const collected: Item[] = [];
    for (const value of set) {
      collected.push(value);
    }
    expect(collected).toEqual([
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
    ]);
  });

  test('forEach with thisArg', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    set.add({ id: 1, name: 'one' });
    const context = { multiplier: 10 };
    let result = 0;
    const forEachFn = set.forEach.bind(set);
    forEachFn(function (this: typeof context, value) {
      result = value.id * this.multiplier;
    }, context);
    expect(result).toBe(10);
  });

  test('values iterator', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    set.addMultiple([
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
    ]);
    expect([...set.values()]).toEqual([
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
    ]);
  });

  test('keys iterator returns values (like native Set)', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    set.addMultiple([
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
    ]);
    expect([...set.keys()]).toEqual([
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
    ]);
  });

  test('entries iterator returns [value, value] pairs', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    set.addMultiple([
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
    ]);
    expect([...set.entries()]).toEqual([
      [
        { id: 1, name: 'one' },
        { id: 1, name: 'one' },
      ],
      [
        { id: 2, name: 'two' },
        { id: 2, name: 'two' },
      ],
    ]);
  });

  test('Symbol.iterator', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    set.addMultiple([
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
    ]);
    expect([...set]).toEqual([
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
    ]);
  });

  test('toArray', () => {
    const set = new KeyedSet<Item, number>((item) => item.id);
    set.addMultiple([
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
    ]);
    expect(set.toArray()).toEqual([
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
    ]);
  });

  test('works with string keys', () => {
    type Person = { name: string; age: number };
    const set = new KeyedSet<Person, string>((p) => p.name);
    set.add({ name: 'Alice', age: 30 });
    set.add({ name: 'Bob', age: 25 });
    set.add({ name: 'Alice', age: 35 });
    expect(set.size).toBe(2);
    expect(set.getByKey('Alice')).toEqual({ name: 'Alice', age: 35 });
  });

  test('works with composite keys', () => {
    type Coord = { x: number; y: number };
    const set = new KeyedSet<Coord, string>((c) => `${c.x},${c.y}`);
    set.add({ x: 1, y: 2 });
    set.add({ x: 3, y: 4 });
    set.add({ x: 1, y: 2 });
    expect(set.size).toBe(2);
    expect(set.hasKey('1,2')).toBe(true);
    expect(set.hasKey('3,4')).toBe(true);
  });
});
