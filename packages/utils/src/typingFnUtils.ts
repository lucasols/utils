import type { NonPartial } from './typingUtils.ts';

export function asNonPartial<T extends Record<string, unknown>>(
  obj: T,
): NonPartial<T> {
  return obj;
}

/**
 * a wrapper to Object.entries with a better typing inference
 * @param obj
 */
export function typedObjectEntries<T extends Record<string, unknown>>(
  obj: T,
): NonNullable<
  {
    [K in keyof T]: [K, T[K]];
  }[keyof T]
>[] {
  return Object.entries(obj) as any;
}

/**
 * a wrapper to Object.keys with a better typing inference
 * @param obj
 */
export function typedObjectKeys<T extends Record<string, unknown>>(
  obj: T,
): (keyof T)[] {
  return Object.keys(obj) as any;
}

/**
 * a safe way to cast types, use to substitute the `as Type`
 * @param value
 */
export function asType<T = unknown>(value: T): T {
  return value;
}

/**
 * narrow a string to a union of strings
 * @param key
 * @param union
 */
export function narrowStringToUnion<const T extends string>(
  key: string | undefined | null,
  union: T[] | readonly T[] | Set<T>,
): T | undefined {
  if (!key) return undefined;

  if (union instanceof Set) {
    return union.has(key as T) ? (key as T) : undefined;
  }

  if (union.includes(key as T)) {
    return key as T;
  }

  return undefined;
}

/**
 * Type helper to check if a type is a subtype of another type.
 *
 * @template BaseType - The base type to check against
 * @template SubType - The type that should extend BaseType
 * @returns Returns undefined, only used for type checking
 */
export function typeOnRightExtendsLeftType<
  BaseType,
  SubType extends BaseType,
>(): unknown {
  return undefined as SubType as unknown;
}

/** @deprecated use typeOnRightExtendsLeftType instead */
export const isSubTypeOf = typeOnRightExtendsLeftType;

/**
 * Type helper to narrow a string to a key of an object.
 * @param key
 * @param obj
 */
export function isObjKey<T extends Record<string, unknown>>(
  key: unknown,
  obj: T,
): key is keyof T {
  return typeof key === 'string' && key in obj;
}

type UnionDiff<T, U> =
  [T] extends [U] ?
    [U] extends [T] ?
      null
    : { onRightHasExtraErr: Exclude<U, T> }
  : [U] extends [T] ? { onRightHasMissingErr: Exclude<T, U> }
  : { onRightHasExtraErr: Exclude<U, T>; onRightHasMissingErr: Exclude<T, U> };

/**
 * Type helper to compare two union types and determine their relationship.
 *
 * @template T - The first union type (left side)
 * @template U - The second union type (right side)
 * @param _diff - null if unions are identical, or an object describing the errors
 */
export function unionsAreTheSame<T, U>(_diff: UnionDiff<T, U>): void {}
