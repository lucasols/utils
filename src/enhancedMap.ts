import { isFunction } from './assertions';

export const enhancedMapReject = Symbol();

export class EnhancedMap<K, V> extends Map<K, V> {
  find(
    predicate: (value: V, key: K) => boolean,
  ): { key: K; value: V } | undefined {
    for (const [key, value] of this) {
      if (predicate(value, key)) {
        return { key, value };
      }
    }

    return undefined;
  }

  setMultiple(values: Record<K & string, V>): this;
  setMultiple(...values: [key: K, value: V][]): this;
  setMultiple(...values: [key: K, value: V][] | [Record<K & string, V>]): this {
    if (Array.isArray(values[0])) {
      for (const [key, value] of values as [key: K, value: V][]) {
        this.set(key, value);
      }
    } else {
      for (const [key, value] of Object.entries(values[0])) {
        this.set(key as K, value as V);
      }
    }

    return this;
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

  toObjMap<ObjKey extends PropertyKey, ObjValue>(
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

  /** @deprecated, will be removed in v5 use `from` method instead */
  static fromIterMap<T, K, V>(
    array: T[] | Iterable<T>,
    mapFunction: (item: T) => [key: K, value: V] | false,
  ): EnhancedMap<K, V> {
    return this.from(array, mapFunction);
  }

  static from<T extends Record<string, unknown>, K extends keyof T>(
    array: T[] | Iterable<T> | null | undefined,
    key: K,
  ): EnhancedMap<T[K], T>;
  static from<T, K, V>(
    array: T[] | Iterable<T> | null | undefined,
    mapFunction: (item: T) => [key: K, value: V] | false,
  ): EnhancedMap<K, V>;
  static from(
    array: any[] | Iterable<any> | null | undefined,
    mapFunction: ((item: any) => [key: any, value: any] | false) | string,
  ): EnhancedMap<any, any> {
    const map = new EnhancedMap<any, any>();

    if (!array) return map;

    const isFn = isFunction(mapFunction);

    for (const item of array) {
      if (isFn) {
        const result = mapFunction(item);

        if (result) {
          map.set(result[0], result[1]);
        }
      } else {
        const key = item[mapFunction];

        if (key !== undefined) {
          map.set(key, item);
        }
      }
    }

    return map;
  }
}
