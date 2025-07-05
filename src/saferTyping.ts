/* eslint-disable @typescript-eslint/naming-convention */

/** Use this only when you have 100% of certainty that this will not break the types */
export type __LEGIT_ANY__ = any;

export type __FIX_THIS_TYPING__ = any;

export type __LEGIT_ANY_FUNCTION__ = (...params: any) => __LEGIT_ANY__;

/**
 * An empty object type, equivalent to `{}` but with safer typing
 */
export type EmptyObject = Record<string, never>;

/**
 * Cast a value to `any` type. Use this when you have legit usage of `any` casting.
 *
 * @template V (optional) - When used enforces that the casted value is assignable to the type V, use it for safer casts
 */
export function __LEGIT_ANY_CAST__<V = unknown>(value: V): __LEGIT_ANY__ {
  return value;
}

/**
 * Cast a value to a specific type T. Use this when you have legit usage of type assertion.
 *
 * @template T - The type to cast to
 * @template V (optional) - When used enforces that the casted value is assignable to the type V, use it for safer casts
 */
export function __LEGIT_CAST__<T, V = unknown>(value: V): T {
  return value as unknown as T;
}

/**
 * Refine a value to a specific type T. Use this when you have legit usage of type assertion.
 *
 * @template T - The type to cast to
 * @template V (optional) - When used enforces that the casted value is assignable to the type V, use it for safer casts
 */
export function __REFINE_CAST__<T>(value: T) {
  return <R extends T>() => value as R;
}

export function __FIX_THIS_CASTING__<T>(value: unknown): T {
  return value as T;
}

export function __FIX_THIS_TYPING__(value: unknown): __LEGIT_ANY__ {
  return value;
}

/**
 * Any type that is not a primitive (number, string, boolean, null, undefined, symbol, bigint, ...)
 * Equivalent to `object` type
 */
export type AnyNonPrimitiveValue = object;
