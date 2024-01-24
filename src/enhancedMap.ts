import { KeysType } from './internalUtils/types';

export const enhancedMapReject = Symbol();

export class EnhancedMap<K, V> extends Map<K, V> {
  find(predicate: (value: V, key: K) => boolean): { key: K, value: V} | undefined {
    for (const [key, value] of this) {
      if (predicate(value, key)) {
        return { key, value };
      }
    }

    return undefined;
  }

  getOrThrow(key: K): V {
    const value = this.get(key);

    if (value === undefined) {
      throw new Error(`Key ${key} not found in EnhancedMap`);
    }

    return value;
  }

  getOrInsert(key: K, fallback: () => V): V {
    if (!this.has(key)) {
      this.set(key, fallback());
    }

    return this.getOrThrow(key);
  }

  toFilteredValues(predicate: (value: V, key: K) => boolean): V[] {
    const values: V[] = [];

    for (const [key, value] of this) {
      if (predicate(value, key)) {
        values.push(value);
      }
    }

    return values;
  }

  toMap<T>(
    mapFunction: (
      value: V,
      key: K,
      reject: typeof enhancedMapReject,
    ) => T | typeof enhancedMapReject,
  ): T[] {
    const values: T[] = [];

    for (const [key, value] of this) {
      const result = mapFunction(value, key, enhancedMapReject);

      if (result !== enhancedMapReject) {
        values.push(result);
      }
    }

    return values;
  }

  toObjMap<ObjKey extends KeysType, ObjValue>(
    mapFunction: (value: V, key: K) => [key: ObjKey, value: ObjValue] | false,
  ): Record<ObjKey, ObjValue> {
    const values: Record<ObjKey, ObjValue> = {} as any;

    for (const [key, value] of this) {
      const result = mapFunction(value, key);

      if (result) {
        values[result[0]] = result[1];
      }
    }

    return values;
  }

  toValues(): V[] {
    return [...this.values()];
  }

  toKeys(): K[] {
    return [...this.keys()];
  }

  static fromIterMap<T, K, V>(
    array: T[] | Iterable<T>,
    mapFunction: (item: T) => [key: K, value: V] | false,
  ): EnhancedMap<K, V> {
    const map = new EnhancedMap<K, V>();

    for (const item of array) {
      const result = mapFunction(item);

      if (result) {
        map.set(result[0], result[1]);
      }
    }

    return map;
  }
}
