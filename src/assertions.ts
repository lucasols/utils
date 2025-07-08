import {
  isFunction as isFunctionFromTypeGuards,
  isObject as isObjectFromTypeGuards,
  isPlainObject as isPlainObjectFromTypeGuards,
  isPromise as isPromiseFromTypeGuards,
} from './typeGuards';

const undefErrMsg = 'not undefined assertion failed';
const nullishErrMsg = 'not nullish assertion failed';

type NotUndefined<T> = T extends undefined ? never : T;

type StrictNonUndefined<T, N = unknown> =
  undefined extends T ? NotUndefined<T> : N;

/**
 * Ensures a value is not undefined and returns it with the correct type.
 *
 * Throws an error if the value is undefined. Use it instead of `!` operator for better type safety.
 *
 * @template T - The type of the input value
 * @param value - The value to check for undefined
 * @param error - Error message string or function that returns an Error to throw if value is undefined
 * @returns The input value with undefined excluded from its type
 * @throws {Error} When the value is undefined
 *
 * @example
 * ```typescript
 * const maybeString: string | undefined = getValue();
 * const definiteString = notUndefined(maybeString); // Type: string
 *
 * // With custom error message
 * const value = notUndefined(maybeValue, 'Value must be defined');
 *
 * // With custom error function
 * const value = notUndefined(maybeValue, () => new ValidationError('Required field'));
 * ```
 */
export function notUndefined<T>(
  value: T,
  error: string | (() => Error) = undefErrMsg,
): StrictNonUndefined<T> {
  if (value === undefined) {
    throw typeof error === 'function' ? error() : new Error(error);
  }

  return value as any;
}

type StrictNonNullable<T, N = unknown> =
  undefined extends T ? NonNullable<T>
  : null extends T ? NonNullable<T>
  : N;

/**
 * Ensures a value is not null or undefined and returns it with the correct type.
 *
 * Throws an error if the value is null or undefined. Use it instead of `!` operator for better type safety.
 *
 * @template T - The type of the input value
 * @param value - The value to check for null or undefined
 * @param error - Error message string or function that returns an Error to throw if value is nullish
 * @returns The input value with null and undefined excluded from its type
 * @throws {Error} When the value is null or undefined
 *
 * @example
 * ```typescript
 * const maybeString: string | null | undefined = getValue();
 * const definiteString = notNullish(maybeString); // Type: string
 *
 * // With custom error message
 * const value = notNullish(maybeValue, 'Value cannot be null or undefined');
 *
 * // With custom error function
 * const value = notNullish(maybeValue, () => new ValidationError('Required field'));
 * ```
 */
export function notNullish<T>(
  value: T,
  error: string | (() => Error) = nullishErrMsg,
): StrictNonNullable<T> {
  if (value === undefined || value === null) {
    throw typeof error === 'function' ? error() : new Error(error);
  }

  return value as any;
}

/**
 * Asserts that a value is not null or undefined using TypeScript's assertion signature.
 *
 * Throws an error if the value is null or undefined. Use it instead of `!` operator for better type safety.
 *
 * @template T - The type of the input value
 * @param value - The value to assert is not null or undefined
 * @param error - Error message string or function that returns an Error to throw if value is nullish
 * @throws {Error} When the value is null or undefined
 *
 * @example
 * ```typescript
 * function processValue(input: string | null | undefined) {
 *   assertIsNotNullish(input);
 *   // TypeScript now knows input is string
 *   console.log(input.toUpperCase());
 * }
 *
 * // With custom error
 * assertIsNotNullish(value, 'Value is required for processing');
 * ```
 */
export function assertIsNotNullish<T>(
  value: T,
  error: string | (() => Error) = nullishErrMsg,
): asserts value is StrictNonNullable<T, never> {
  if (value === undefined || value === null) {
    throw typeof error === 'function' ? error() : new Error(error);
  }
}

/**
 * Asserts that a value is not undefined using TypeScript's assertion signature.
 *
 * Throws an error if the value is undefined. Use it instead of `!` operator for better type safety.
 *
 * @template T - The type of the input value
 * @param value - The value to assert is not undefined
 * @param error - Error message string or function that returns an Error to throw if value is undefined
 * @throws {Error} When the value is undefined
 *
 * @example
 * ```typescript
 * function processValue(input: string | undefined) {
 *   assertIsNotUndefined(input);
 *   // TypeScript now knows input is string
 *   console.log(input.toUpperCase());
 * }
 *
 * // With custom error
 * assertIsNotUndefined(value, 'Value must be defined');
 * ```
 */
export function assertIsNotUndefined<T>(
  value: T,
  error: string | (() => Error) = undefErrMsg,
): asserts value is StrictNonUndefined<T, never> {
  if (value === undefined) {
    throw typeof error === 'function' ? error() : new Error(error);
  }
}

/**
 * Asserts that a condition is always true, throwing an error if it's falsy.
 *
 * This function is useful for enforcing invariants in your code - conditions that
 * should always be true. It uses TypeScript's assertion signature to narrow types
 * based on the condition.
 *
 * @param condition - The condition to check (any truthy/falsy value)
 * @param error - Error message string or function that returns an Error to throw if condition is falsy
 * @throws {Error} When the condition is falsy
 *
 * @example
 * ```typescript
 * function divide(a: number, b: number) {
 *   invariant(b !== 0, 'Division by zero is not allowed');
 *   return a / b;
 * }
 *
 * // Type narrowing example
 * function processUser(user: User | null) {
 *   invariant(user, 'User must be logged in');
 *   // TypeScript now knows user is User, not null
 *   console.log(user.name);
 * }
 *
 * // With custom error function
 * invariant(isValid, () => new ValidationError('Invalid state detected'));
 * ```
 */
export function invariant(
  condition: any,
  error: string | (() => Error) = 'Invariant violation',
): asserts condition {
  if (!condition) {
    throw typeof error === 'function' ? error() : (
        new Error(`Invariant violation: ${error}`)
      );
  }
}

/**
 * Ensures exhaustive type checking in switch statements or conditional logic.
 *
 * This function should be used in the default case of switch statements or
 * the final else branch of conditional logic to ensure all possible cases
 * are handled. It helps catch missing cases at compile time when new union
 * members are added.
 *
 * @template Except - The type that should never be reached
 * @param narrowedType - The value that should never exist at runtime
 * @returns An Error object (this function should never actually execute)
 *
 * @example
 * ```typescript
 * type Status = 'pending' | 'success' | 'error';
 *
 * function handleStatus(status: Status) {
 *   switch (status) {
 *     case 'pending':
 *       return 'Loading...';
 *     case 'success':
 *       return 'Done!';
 *     case 'error':
 *       return 'Failed!';
 *     default:
 *       throw exhaustiveCheck(status); // TypeScript error if Status gains new members
 *   }
 * }
 *
 * // In conditional logic
 * function processValue(value: string | number) {
 *   if (typeof value === 'string') {
 *     return value.toUpperCase();
 *   } else if (typeof value === 'number') {
 *     return value.toString();
 *   } else {
 *     throw exhaustiveCheck(value); // Ensures all cases are covered
 *   }
 * }
 * ```
 */
export function exhaustiveCheck<Except = never>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- we use this function only for type checking
  narrowedType: NoInfer<Except>,
): Error {
  return new Error('This should never happen');
}

/** @deprecated use import from `@ls-stack/typeGuards` instead */
export const isFunction = isFunctionFromTypeGuards;
/** @deprecated use import from `@ls-stack/typeGuards` instead */
export const isObject = isObjectFromTypeGuards;
/** @deprecated use import from `@ls-stack/typeGuards` instead */
export const isPlainObject = isPlainObjectFromTypeGuards;
/** @deprecated use import from `@ls-stack/typeGuards` instead */
export const isPromise = isPromiseFromTypeGuards;
