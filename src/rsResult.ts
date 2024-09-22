import { isObject } from './assertions';

type Ok<T> = {
  ok: true;
  error: false;
  value: T;
};

type ResultValidErrors = Error | Record<string, unknown> | unknown[] | true;

type Err<E extends ResultValidErrors> = {
  ok: false;
  error: E;
  errorResult: () => Result<any, E>;
};

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
export type Result<T, E extends ResultValidErrors = Error> =
  | OkResult<T, E, T>
  | ErrResult<E, T>;

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

type OkResult<T, E extends ResultValidErrors, M = any> = Ok<T> &
  ResultMethods<M, E>;

function ok(): OkResult<void, any>;
function ok<T>(value: T): OkResult<T, any>;
function ok(value: any = undefined): OkResult<any, any> {
  return {
    ok: true,
    error: false,
    value,
    unwrapOrNull: okUnwrapOr,
    unwrapOr: okUnwrapOr,
    unwrap: okUnwrapOr,
    mapOk: okMap,
    mapErr: returnResult,
    mapOkAndErr,
  };
}

type ErrResult<E extends ResultValidErrors, T = any> = Err<E> &
  ResultMethods<T, E>;

function err<E extends ResultValidErrors>(error: E): ErrResult<E> {
  return {
    ok: false,
    error,
    unwrapOrNull: () => null,
    unwrapOr: (defaultValue) => defaultValue,
    errorResult() {
      return err(error);
    },
    unwrap: (() => {
      if (error instanceof Error) {
        throw error;
      }

      throw normalizeError(error);
    }) as any,
    mapOk: returnResult,
    mapErr: errMap,
    mapOkAndErr,
  };
}

function unknownToError(error: unknown) {
  return err(normalizeError(error));
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

  throw normalizeError(unwrapped.error);
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
  unknownToError,
  asyncUnwrap,
  asyncMap,
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
      : (normalizeError(error) as unknown as E),
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
      : (normalizeError(error) as unknown as E),
    );
  }
}

export function normalizeError(error: unknown): Error {
  if (error instanceof Error) return error;

  if (typeof error === 'string') {
    return new Error(error);
  }

  if (isObject(error)) {
    return new Error(
      'message' in error && error.message && typeof error.message === 'string' ?
        error.message
      : (safeJsonStringify(error) ?? 'unknown'),
      { cause: error },
    );
  }

  return new Error(safeJsonStringify(error) ?? 'unknown', { cause: error });
}

export function safeJsonStringify(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch (_) {
    return null;
  }
}

export type TypedResult<T, E extends ResultValidErrors = Error> = {
  ok: (value: T) => OkResult<T, E, T>;
  err: (error: E) => ErrResult<E, T>;
};

export function createTypedResult<
  T,
  E extends ResultValidErrors = Error,
>(): TypedResult<T, E> {
  return {
    ok,
    err,
  };
}
