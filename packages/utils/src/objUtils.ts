import { sortBy, type SortByProps, type SortByValueFn } from './arrayUtils';
import type { MakeUndefinedKeysOptional } from './typeUtils';
import { typedObjectEntries } from './typingFnUtils';

/**
 * @deprecated Use typedObjectEntries from @ls-stack/utils/typingFnUtils instead
 * @param obj
 */
export function objectTypedEntries<T extends Record<string, unknown>>(obj: T) {
  return Object.entries(obj) as [Extract<keyof T, string>, T[keyof T]][];
}

export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const result: any = {};

  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}

export function mapArrayToObject<T, K extends string, O>(
  array: T[],
  mapper: (item: T, index: number) => [K, O],
): Record<K, O> {
  return Object.fromEntries(array.map(mapper)) as any;
}

export function mapObjectToObject<
  I extends Record<string | number | symbol, unknown>,
  K extends string | number | symbol,
  O,
>(obj: I, mapper: (key: keyof I, value: I[keyof I]) => [K, O]): Record<K, O> {
  return Object.fromEntries(
    objectTypedEntries(obj).map(([key, value]) => mapper(key, value)),
  ) as any;
}

export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result: any = {};

  for (const key of Object.keys(obj)) {
    if (!keys.includes(key as K)) {
      result[key] = obj[key];
    }
  }

  return result;
}

export function looseGetObjectProperty<T extends Record<string, unknown>>(
  obj: T,
  key: string,
): T[keyof T] | undefined {
  return obj[key as keyof T];
}

export function rejectObjUndefinedValues<T extends Record<string, unknown>>(
  obj: T,
): MakeUndefinedKeysOptional<T> {
  const result: any = {};

  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }

  return result;
}

export function filterObjectKeys<T extends Record<string, unknown>>(
  obj: T,
  predicate: (key: keyof T, value: T[keyof T]) => boolean,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) =>
      predicate(key as keyof T, value as T[keyof T]),
    ),
  ) as Partial<T>;
}

export function sortObjectKeys<T extends Record<string, unknown>>(
  obj: T,
  sortByFn: SortByValueFn<[key: keyof T, value: T[keyof T]]>,
  options?: SortByProps,
): T {
  return Object.fromEntries(
    sortBy(typedObjectEntries(obj), sortByFn, options),
  ) as T;
}
