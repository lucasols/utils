import { Result } from 't-result';
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

export function getValueFromPath(
  obj: Record<string, unknown>,
  path: string,
): Result<unknown, Error> {
  if (!path.trim()) {
    return Result.err(new Error('Path cannot be empty'));
  }

  const segments = parsePath(path);
  let current: any = obj;

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    if (!segment) {
      return Result.err(new Error('Invalid empty segment in path'));
    }

    if (current == null) {
      return Result.err(
        new Error(`Cannot access property '${segment}' on null or undefined`),
      );
    }

    if (isNumericString(segment)) {
      if (!Array.isArray(current)) {
        return Result.err(
          new Error(
            `Cannot access array index '${segment}' on non-array value`,
          ),
        );
      }

      const index = parseInt(segment, 10);
      if (index < 0 || index >= current.length) {
        return Result.err(new Error(`Array index '${index}' out of bounds`));
      }

      current = current[index];
    } else {
      if (typeof current !== 'object' || current === null) {
        return Result.err(
          new Error(`Cannot access property '${segment}' on non-object value`),
        );
      }

      if (!(segment in current)) {
        return Result.err(new Error(`Property '${segment}' not found`));
      }

      current = current[segment];
    }
  }

  return Result.ok(current);
}

function parsePath(path: string): string[] {
  const segments: string[] = [];
  let current = '';
  let inBrackets = false;

  for (let i = 0; i < path.length; i++) {
    const char = path[i];

    if (char === '[') {
      if (current) {
        segments.push(current);
        current = '';
      }
      inBrackets = true;
    } else if (char === ']') {
      if (inBrackets && current) {
        segments.push(current);
        current = '';
      }
      inBrackets = false;
    } else if (char === '.' && !inBrackets) {
      if (current) {
        segments.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current) {
    segments.push(current);
  }

  return segments;
}

function isNumericString(str: string): boolean {
  return /^\d+$/.test(str);
}
