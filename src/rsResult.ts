import { isObject } from './assertions';
import { safeJsonStringify as internalSafeJsonStringify } from './safeJson';

type Ok<T> = {
  ok: true;
  error: false;
  value: T;
} & AnyResultMethods;

type AnyResultMethods = Record<ResultMethodsKeys, never>;

type ResultValidErrors = Error | Record<string, unknown> | unknown[] | true;

type Err<E extends ResultValidErrors> = {
  ok: false;
  error: E;
  errorResult: () => Result<any, E>;
} & AnyResultMethods;

type ResultMethods<T, E extends ResultValidErrors> = {
  /** Returns the value if the result is Ok, otherwise returns null */
  unwrapOrNull: () => T | null;
  /** Returns the value if the result is Ok, otherwise returns the provided default value */
  unwrapOr: <R extends T>(defaultValue: R) => T | R;
  unwrap: () => T;
  mapOk: <NewValue>(mapFn: (value: T) => NewValue) => Result<NewValue, E>;
  mapErr: <NewError extends ResultValidErrors>(
    mapFn: (error: E) => NewError,
  ) => Result<T, NewError>;
  mapOkAndErr: <NewValue, NewError extends ResultValidErrors>(mapFns: {
    ok: (value: T) => NewValue;
    err: (error: E) => NewError;
  }) => Result<NewValue, NewError>;
};

/**
 * Util for implementing something similar to Result<T, E> in Rust, for better error handling.
 *
 * Usage:
 *
 * @example
 * function doSomething(): Result<string, Error> {
 *  if (something) {
 *    return ok('success');
 *  }
 *
 *  return err(new Error('something went wrong'));
 * }
 *
 * const result = doSomething();
 *
 * if (result.ok) {
 *   // result.value is a string
 * } else {
 *   // result.error is an Error
 * }
 */
export type Result<T, E extends ResultValidErrors = Error> = (
  | Omit<OkResult<T>, ResultMethodsKeys>
  | Omit<ErrResult<E>, ResultMethodsKeys>
) &
  ResultMethods<T, E>;

type ResultMethodsKeys = keyof ResultMethods<any, any>;

function okUnwrapOr<T>(this: Ok<T>) {
  return this.value;
}

function okMap<T, NewValue>(
  this: Result<T, any>,
  mapFn: (value: T) => NewValue,
) {
  return this.ok ? ok(mapFn(this.value)) : this;
}

function errMap<
  E extends ResultValidErrors,
  NewError extends ResultValidErrors,
>(
  this: Result<any, E>,
  mapFn: (error: E) => ResultValidErrors,
): Result<any, NewError> {
  return this.ok ? (this as any) : err(mapFn(this.error));
}

function mapOkAndErr<
  T,
  E extends ResultValidErrors,
  NewValue,
  NewError extends ResultValidErrors,
>(
  this: Result<T, E>,
  {
    ok: mapFn,
    err: mapErrFn,
  }: {
    ok: (value: T) => NewValue;
    err: (error: E) => NewError;
  },
) {
  return this.ok ? ok(mapFn(this.value)) : err(mapErrFn(this.error));
}

function returnResult(this: Result<any, any>) {
  return this;
}

type OkResult<T> = Ok<T>;

function ok(): OkResult<void>;
function ok<T>(value: T): OkResult<T>;
function ok(value: any = undefined): OkResult<any> {
  const methods: ResultMethods<any, any> = {
    unwrapOrNull: okUnwrapOr,
    unwrapOr: okUnwrapOr,
    unwrap: okUnwrapOr,
    mapOk: okMap,
    mapErr: returnResult,
    mapOkAndErr,
  };

  return {
    ok: true,
    error: false,
    value,
    ...(methods as AnyResultMethods),
  };
}

type ErrResult<E extends ResultValidErrors> = Err<E>;

function err<E extends ResultValidErrors>(error: E): ErrResult<E> {
  const methods: ResultMethods<any, any> = {
    unwrapOrNull: () => null,
    unwrapOr: (defaultValue) => defaultValue,
    unwrap: (() => {
      if (error instanceof Error) {
        throw error;
      }

      throw unknownToError(error);
    }) as any,
    mapOk: returnResult,
    mapErr: errMap,
    mapOkAndErr,
  };

  return {
    ok: false,
    error,
    errorResult() {
      return err(error);
    },
    ...(methods as AnyResultMethods),
  };
}

function unknownToResultError(error: unknown) {
  return err(unknownToError(error));
}

/** Unwraps a promise result */
async function asyncUnwrap<T>(
  result: Promise<Result<T, ResultValidErrors>>,
): Promise<T> {
  const unwrapped = await result;

  if (unwrapped.ok) {
    return unwrapped.value;
  }

  if (unwrapped.error instanceof Error) {
    throw unwrapped.error;
  }

  throw unknownToError(unwrapped.error);
}

function asyncMap<T, E extends ResultValidErrors>(
  resultPromise: Promise<Result<T, E>>,
) {
  return {
    err: async <NewError extends ResultValidErrors>(
      mapFn: (error: E) => NewError,
    ): Promise<Result<T, NewError>> => {
      const result = await resultPromise;
      return result.ok ? ok(result.value) : err(mapFn(result.error));
    },
    ok: async <NewValue>(
      mapFn: (value: T) => NewValue,
    ): Promise<Result<NewValue, E>> => {
      const result = await resultPromise;
      return result.ok ? ok(mapFn(result.value)) : err(result.error);
    },
    okAndErr: async <NewValue, NewError extends ResultValidErrors>({
      ok: mapFn,
      err: mapErrFn,
    }: {
      ok: (value: T) => NewValue;
      err: (error: E) => NewError;
    }): Promise<Result<NewValue, NewError>> => {
      const result = await resultPromise;
      return result.ok ? ok(mapFn(result.value)) : err(mapErrFn(result.error));
    },
  };
}

export const Result = {
  ok,
  err,
  unknownToError: unknownToResultError,
  asyncUnwrap,
  asyncMap,
  getOkErr,
};

/** transform a function in a result function */
export function resultify<T, E extends ResultValidErrors = Error>(
  fn: () => T,
  errorNormalizer?: (err: unknown) => E,
): Result<T, E> {
  try {
    return ok(fn());
  } catch (error) {
    return err(
      errorNormalizer ?
        errorNormalizer(error)
      : (unknownToError(error) as unknown as E),
    );
  }
}

/** transform a async function in a result function */
export async function asyncResultify<T, E extends Error = Error>(
  fn: () => Promise<T>,
  errorNormalizer?: (err: unknown) => E,
): Promise<Result<Awaited<T>, E>> {
  try {
    return ok(await fn());
  } catch (error) {
    return err(
      errorNormalizer ?
        errorNormalizer(error)
      : (unknownToError(error) as unknown as E),
    );
  }
}

/**
 * Converts an unknown error value into an Error object.
 *
 * @param error - The unknown value to convert to an Error
 * @returns An Error object
 *
 * @example
 * try {
 *   // some code that might throw
 * } catch (err) {
 *   const error = unknownToError(err); // Guaranteed to be Error instance
 * }
 *
 * The function handles different error types:
 * - Returns the error directly if it's already an Error instance
 * - Converts strings into Error objects using the string as the message
 * - For objects, tries to extract a message property or stringifies the object
 * - For other values, stringifies them or uses 'unknown' as fallback
 *
 * The original error value is preserved as the `cause` property of the returned Error.
 */
export function unknownToError(error: unknown): Error {
  if (error instanceof Error) return error;

  if (typeof error === 'string') {
    return new Error(error);
  }

  if (isObject(error)) {
    return new Error(
      'message' in error && error.message && typeof error.message === 'string' ?
        error.message
      : (internalSafeJsonStringify(error) ?? 'unknown'),
      { cause: error },
    );
  }

  return new Error(internalSafeJsonStringify(error) ?? 'unknown', {
    cause: error,
  });
}

/** @deprecated use unknownToError instead, this will be removed in the next major version */
export function normalizeError(error: unknown): Error {
  return unknownToError(error);
}

/** @deprecated use safeJsonStringify from `@ls-stack/utils/safeJson` instead, this will be removed in the next major version */
export const safeJsonStringify = internalSafeJsonStringify;

export type TypedResult<T, E extends ResultValidErrors = Error> = {
  ok: (value: T) => OkResult<T>;
  err: (error: E) => ErrResult<E>;
  /**
   * Use in combination with `typeof` to get the return type of the result
   *
   * @example
   * const typedResult = createTypedResult<{ a: 'test' }>();
   *
   * function foo(): typeof typedResult.type {
   *   return typedResult.ok({ a: 'test' });
   * }
   */
  _type: Result<T, E>;
};

export type GetTypedResult<R extends Result<any, any>> = TypedResult<
  R extends Result<infer T, any> ? T : never,
  R extends Result<any, infer E> ? E : never
>;

const typedResult: TypedResult<any, any> = {
  ok,
  err,
  get _type(): any {
    throw new Error('usage as value is not allowed');
  },
};

/** @deprecated use getOkErr instead, this may be removed in the next major version */
export function createTypedResult<
  T,
  E extends ResultValidErrors = Error,
>(): TypedResult<T, E> {
  return typedResult;
}

function getOkErr<
  F extends (...args: any[]) => Promise<Result<any, any>>,
>(): TypedResult<
  Awaited<ReturnType<F>> extends Result<infer T, any> ? T : never,
  Awaited<ReturnType<F>> extends Result<any, infer E> ? E : never
>;
function getOkErr<
  F extends (...args: any[]) => Result<any, any>,
>(): TypedResult<
  ReturnType<F> extends Result<infer T, any> ? T : never,
  ReturnType<F> extends Result<any, infer E> ? E : never
>;
function getOkErr<R extends Result<any, any>>(): TypedResult<
  R extends Result<infer T, any> ? T : never,
  R extends Result<any, infer E> ? E : never
>;
function getOkErr<T, E extends ResultValidErrors = Error>(): TypedResult<T, E>;
function getOkErr(): unknown {
  return typedResult;
}
