import { getCompositeKey } from './getCompositeKey';

/**
 * A Map implementation that uses a custom key function to determine key equality.
 * Keys with the same computed internal key are considered equal.
 *
 * @example
 *   const map = new KeyedMap<{ x: number; y: number }, string, string>(
 *     (key) => `${key.x},${key.y}`,
 *   );
 *   map.set({ x: 1, y: 2 }, 'point A');
 *   map.get({ x: 1, y: 2 }); // 'point A' (different object, same computed key)
 *
 * @template K - The type of the external key
 * @template V - The type of the value
 * @template InternalKey - The type of the internal key used for comparison
 */
export class KeyedMap<K, V, InternalKey = string> {
  private map: Map<InternalKey, { key: K; value: V }>;
  private getKey: (key: K) => InternalKey;

  /**
   * @param getKey - Function to compute an internal key from the external key
   * @param entries - Optional initial entries to add to the map
   */
  constructor(getKey: (key: K) => InternalKey, entries?: Iterable<[K, V]>) {
    this.getKey = getKey;
    this.map = new Map();

    if (entries) {
      for (const [key, value] of entries) {
        this.set(key, value);
      }
    }
  }

  /** The number of entries in the map */
  get size(): number {
    return this.map.size;
  }

  /** Sets a value for the given key. If the key exists, replaces both key and value. */
  set(key: K, value: V): this {
    const internalKey = this.getKey(key);
    this.map.set(internalKey, { key, value });
    return this;
  }

  /** Sets multiple entries at once. */
  setMultiple(entries: Iterable<[K, V]>): this {
    for (const [key, value] of entries) {
      this.set(key, value);
    }
    return this;
  }

  /** Gets the value for the given key, or undefined if not found. */
  get(key: K): V | undefined {
    const internalKey = this.getKey(key);
    return this.map.get(internalKey)?.value;
  }

  /** Checks if the map contains the given key. */
  has(key: K): boolean {
    const internalKey = this.getKey(key);
    return this.map.has(internalKey);
  }

  /** Removes the entry for the given key. Returns true if the entry was removed. */
  delete(key: K): boolean {
    const internalKey = this.getKey(key);
    return this.map.delete(internalKey);
  }

  /** Removes multiple entries. Returns the number of entries removed. */
  deleteMultiple(keys: Iterable<K>): number {
    let count = 0;
    for (const key of keys) {
      if (this.delete(key)) {
        count++;
      }
    }
    return count;
  }

  /** Removes all entries from the map. */
  clear(): void {
    this.map.clear();
  }

  /** Executes a callback for each entry in the map. */
  forEach(
    callback: (value: V, key: K, map: KeyedMap<K, V, InternalKey>) => void,
    thisArg?: unknown,
  ): void {
    for (const { key, value } of this.map.values()) {
      callback.call(thisArg, value, key, this);
    }
  }

  /** Finds the first entry matching the predicate. */
  find(
    predicate: (value: V, key: K) => boolean,
  ): { key: K; value: V } | undefined {
    for (const { key, value } of this.map.values()) {
      if (predicate(value, key)) {
        return { key, value };
      }
    }
    return undefined;
  }

  /** Gets the value for the given key, or throws if not found. */
  getOrThrow(key: K): V {
    const value = this.get(key);
    if (value === undefined && !this.has(key)) {
      throw new Error(`Key not found in KeyedMap`);
    }
    return value as V;
  }

  /** Gets the value for the given key, or inserts and returns the fallback value. */
  getOrInsert(key: K, fallback: () => V): V {
    if (!this.has(key)) {
      this.set(key, fallback());
    }
    return this.getOrThrow(key);
  }

  /** Returns values that match the predicate. */
  toFilteredValues(predicate: (value: V, key: K) => boolean): V[] {
    const values: V[] = [];
    for (const { key, value } of this.map.values()) {
      if (predicate(value, key)) {
        values.push(value);
      }
    }
    return values;
  }

  /** Returns all values as an array. */
  toValues(): V[] {
    return [...this.values()];
  }

  /** Returns all keys as an array. */
  toKeys(): K[] {
    return [...this.keys()];
  }

  *keys(): IterableIterator<K> {
    for (const { key } of this.map.values()) {
      yield key;
    }
  }

  *values(): IterableIterator<V> {
    for (const { value } of this.map.values()) {
      yield value;
    }
  }

  *entries(): IterableIterator<[K, V]> {
    for (const { key, value } of this.map.values()) {
      yield [key, value];
    }
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }
}

/**
 * A Map that compares keys by value instead of reference.
 * Uses `getCompositeKey` to generate a stable string key for any value.
 *
 * @example
 *   const map = new CompositeKeyMap<{ x: number; y: number }, string>();
 *   map.set({ x: 1, y: 2 }, 'point A');
 *   map.get({ x: 1, y: 2 }); // 'point A' (different object, same value)
 */
export class CompositeKeyMap<K, V> extends KeyedMap<K, V, string> {
  constructor(entries?: Iterable<[K, V]>) {
    super(getCompositeKey, entries);
  }
}
