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

/**
 * Type helper to check if a type is a subtype of another type.
 *
 * @template BaseType - The base type to check against
 * @template SubType - The type that should extend BaseType
 * @returns {unknown} Returns undefined, only used for type checking
 */
export function isSubTypeOf<BaseType, SubType extends BaseType>(): unknown {
  return undefined as SubType as unknown;
}

/**
 * Type helper to narrow a string to a key of an object.
 */
export function isObjKey<T extends Record<string, unknown>>(
  key: unknown,
  obj: T,
): key is keyof T {
  return typeof key === 'string' && key in obj;
}
