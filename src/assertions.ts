import { NoInfer } from './internalUtils/types.js';

const undefErrMsg = 'not undefined assertion failed';
const nullishErrMsg = 'not nullish assertion failed';

type NotUndefined<T> = T extends undefined ? never : T;

type StrictNonUndefined<T, N = unknown> =
  undefined extends T ? NotUndefined<T> : N;

export function notUndefined<T>(value: T): StrictNonUndefined<T> {
  if (value === undefined) {
    throw new Error(undefErrMsg);
  }

  return value as any;
}

type StrictNonNullable<T, N = unknown> =
  undefined extends T ? NonNullable<T>
  : null extends T ? NonNullable<T>
  : N;

export function notNullish<T>(value: T): StrictNonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(nullishErrMsg);
  }

  return value as any;
}

export function assertIsNotNullish<T>(
  value: T,
  errorMsg = nullishErrMsg,
): asserts value is StrictNonNullable<T, never> {
  if (value === undefined || value === null) {
    throw new Error(errorMsg);
  }
}

export function assertIsNotUndefined<T>(
  value: T,
  errorMsg = undefErrMsg,
): asserts value is StrictNonUndefined<T, never> {
  if (value === undefined) {
    throw new Error(errorMsg);
  }
}

/** Use this function to assert that a certain condition is always true. */
export function invariant(
  condition: any,
  errorMsg = 'Invariant violation',
): asserts condition {
  if (!condition) {
    throw new Error(`Invariant violation: ${errorMsg}`);
  }
}

/** ensures all type possibilities are being handled */
export function exhaustiveCheck<Except = never>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- we use this function only for type checking
  narrowedType: NoInfer<Except>,
  // eslint-disable-next-line @typescript-eslint/no-empty-function -- we use this function only for type checking only
): Error {
  return new Error('This should never happen');
}
