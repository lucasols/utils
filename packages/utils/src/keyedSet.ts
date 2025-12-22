import { getCompositeKey } from './getCompositeKey';

/**
 * A Set implementation that uses a custom key function to determine uniqueness.
 * Items with the same key are considered equal, and adding a duplicate replaces
 * the existing item.
 *
 * @example
 *   const set = new KeyedSet<{ id: number; name: string }, number>(
 *     (item) => item.id,
 *   );
 *   set.add({ id: 1, name: 'one' });
 *   set.add({ id: 1, name: 'replaced' }); // replaces previous item
 *   set.getByKey(1); // { id: 1, name: 'replaced' }
 *
 * @template T - The type of items stored in the set
 * @template K - The type of the key extracted from items
 */
export class KeyedSet<T, K = string> {
  private map: Map<K, T>;
  private getKey: (item: T) => K;

  /**
   * @param getKey - Function to extract a unique key from each item
   * @param iterable - Optional initial items to add to the set
   */
  constructor(getKey: (item: T) => K, iterable?: Iterable<T>) {
    this.getKey = getKey;
    this.map = new Map();

    if (iterable) {
      for (const item of iterable) {
        this.add(item);
      }
    }
  }

  /** The number of items in the set */
  get size(): number {
    return this.map.size;
  }

  /**
   * Adds an item to the set. If an item with the same key exists, it will be
   * replaced.
   */
  add(item: T): this {
    const key = this.getKey(item);
    this.map.set(key, item);
    return this;
  }

  /** Adds multiple items to the set. */
  addMultiple(items: Iterable<T>): this {
    for (const item of items) {
      this.add(item);
    }
    return this;
  }

  /** Checks if an item with the same key exists in the set. */
  has(item: T): boolean {
    const key = this.getKey(item);
    return this.map.has(key);
  }

  /** Checks if an item with the given key exists in the set. */
  hasKey(key: K): boolean {
    return this.map.has(key);
  }

  /** Gets an item by its key, or undefined if not found. */
  getByKey(key: K): T | undefined {
    return this.map.get(key);
  }

  /**
   * Removes an item from the set by computing its key. Returns true if the item
   * was removed.
   */
  delete(item: T): boolean {
    const key = this.getKey(item);
    return this.map.delete(key);
  }

  /** Removes an item by its key. Returns true if the item was removed. */
  deleteByKey(key: K): boolean {
    return this.map.delete(key);
  }

  /** Removes multiple items from the set. Returns the number of items removed. */
  deleteMultiple(items: Iterable<T>): number {
    let count = 0;
    for (const item of items) {
      if (this.delete(item)) {
        count++;
      }
    }
    return count;
  }

  /** Removes multiple items by their keys. Returns the number of items removed. */
  deleteMultipleByKeys(keys: Iterable<K>): number {
    let count = 0;
    for (const key of keys) {
      if (this.deleteByKey(key)) {
        count++;
      }
    }
    return count;
  }

  /** Removes all items from the set. */
  clear(): void {
    this.map.clear();
  }

  /** Executes a callback for each item in the set. */
  forEach(
    callback: (value: T, value2: T, set: KeyedSet<T, K>) => void,
    thisArg?: unknown,
  ): void {
    for (const value of this.map.values()) {
      callback.call(thisArg, value, value, this);
    }
  }

  *values(): IterableIterator<T> {
    yield* this.map.values();
  }

  *keys(): IterableIterator<T> {
    yield* this.map.values();
  }

  *entries(): IterableIterator<[T, T]> {
    for (const value of this.map.values()) {
      yield [value, value];
    }
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.values();
  }

  /** Returns all items as an array. */
  toArray(): T[] {
    return [...this.map.values()];
  }
}

/**
 * A Set that compares items by value instead of reference. Uses
 * `getCompositeKey` to generate a stable string key for any value.
 *
 * @example
 *   const set = new ValueSet<{ x: number; y: number }>();
 *   set.add({ x: 1, y: 2 });
 *   set.add({ x: 1, y: 2 }); // ignored, same value already exists
 *   set.size; // 1
 */
export class CompositeKeySet<T> extends KeyedSet<T, string> {
  constructor(iterable?: Iterable<T>) {
    super(getCompositeKey, iterable);
  }
}
