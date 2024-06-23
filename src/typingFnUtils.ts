import { NonPartial } from './typingUtils';

export function asNonPartial<T extends Record<string, unknown>>(
  obj: T,
): NonPartial<T> {
  return obj;
}

/** a wrapper to Object.entries with a better typing inference */
export function typedObjectEntries<T extends Record<string, unknown>>(
  obj: T,
): NonNullable<
  {
    [K in keyof T]: [K, T[K]];
  }[keyof T]
>[] {
  return Object.entries(obj) as any;
}

/** a wrapper to Object.keys with a better typing inference */
export function typedObjectKeys<T extends Record<string, unknown>>(
  obj: T,
): (keyof T)[] {
  return Object.keys(obj) as any;
}

/** a safe way to cast types, use to substitute the `as Type` */
export function asType<T = unknown>(value: T): T {
  return value;
}

/** narrow a string to a union of strings */
export function narrowStringToUnion<const T extends string>(
  key: string | undefined | null,
  union: T[],
): T | undefined {
  if (key && union.includes(key as T)) {
    return key as T;
  }

  return undefined;
}
