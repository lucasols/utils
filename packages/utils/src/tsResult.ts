import { isFunction, isObject, isPromise } from './assertions';
import { safeJsonStringify as internalSafeJsonStringify } from './safeJson';

type Ok<T> = {
  ok: true;
  error: false;
  value: T;
} & AnyResultMethods;

type AnyResultMethods = Record<ResultMethodsKeys, never>;

/** @deprecated Use `t-result` library instead. */
export type ResultValidErrors =
  | Error
  | Record<string, unknown>
  | unknown[]
  | readonly unknown[]
  | true;

type Err<E extends ResultValidErrors> = {
  ok: false;
  error: E;
  /** @deprecated Use `t-result` library instead. */
  errorResult: () => Err<E>;
} & AnyResultMethods;

type ResultMethods<T, E extends ResultValidErrors> = {
  /** @deprecated Use `t-result` library instead. */
  unwrapOrNull: () => T | null;
  /** @deprecated Use `t-result` library instead. */
  unwrapOr: <R extends T>(defaultValue: R) => T | R;
  /** @deprecated Use `t-result` library instead. */
  unwrap: () => T;
  /** @deprecated Use `t-result` library instead. */
  mapOk: <NewValue>(mapFn: (value: T) => NewValue) => Result<NewValue, E>;
  /** @deprecated Use `t-result` library instead. */
  mapErr: <NewError extends ResultValidErrors>(
    mapFn: (error: E) => NewError,
  ) => Result<T, NewError>;
  /** @deprecated Use `t-result` library instead. */
  mapOkAndErr: <NewValue, NewError extends ResultValidErrors>(mapFns: {
    ok: (value: T) => NewValue;
    err: (error: E) => NewError;
  }) => Result<NewValue, NewError>;
  /** @deprecated Use `t-result` library instead. */
  ifOk: (fn: (value: T) => void) => Result<T, E>;
  /** @deprecated Use `t-result` library instead. */
  ifErr: (fn: (error: E) => void) => Result<T, E>;
};

/** @deprecated Use `t-result` library instead. */
export type Result<T, E extends ResultValidErrors = Error> = (
  | Omit<Ok<T>, ResultMethodsKeys>
  | Omit<Err<E>, ResultMethodsKeys>
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

function okOnOk<T, E extends ResultValidErrors>(
  this: Result<T, E>,
  fn: (value: T) => void,
): Result<T, E> {
  if (this.ok) {
    fn(this.value);
  }
  return this;
}

function errOnErr<T, E extends ResultValidErrors>(
  this: Result<T, E>,
  fn: (error: E) => void,
): Result<T, E> {
  if (!this.ok) {
    fn(this.error);
  }
  return this;
}

/** @deprecated Use `t-result` library instead. */
export function ok(): Ok<void>;
/** @deprecated Use `t-result` library instead. */
export function ok<T>(value: T): Ok<T>;
/** @deprecated Use `t-result` library instead. */
export function ok(value: any = undefined): Ok<any> {
  const methods: ResultMethods<any, any> = {
    unwrapOrNull: okUnwrapOr,
    unwrapOr: okUnwrapOr,
    unwrap: okUnwrapOr,
    mapOk: okMap,
    mapErr: returnResult,
    mapOkAndErr,
    ifOk: okOnOk,
    ifErr: returnResult,
  };

  return {
    ok: true,
    error: false,
    value,
    ...(methods as AnyResultMethods),
  };
}

/** @deprecated Use `t-result` library instead. */
export function err<E extends ResultValidErrors>(error: E): Err<E> {
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
    ifOk: returnResult,
    ifErr: errOnErr,
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

/** @deprecated Use `t-result` library instead. */
export const Result = {
  ok,
  err,
  unknownToError: unknownToResultError,
  asyncUnwrap,
  asyncMap,
  getOkErr,
};

/** @deprecated Use `t-result` library instead. */
export function resultify<T, E extends ResultValidErrors = Error>(
  fn: () => T extends Promise<any> ? never : T,
  errorNormalizer?: (err: unknown) => E,
): Result<T, E>;
/** @deprecated Use `t-result` library instead. */
export function resultify<T, E extends ResultValidErrors = Error>(
  fn: () => Promise<T>,
  errorNormalizer?: (err: unknown) => E,
): Promise<Result<Awaited<T>, E>>;
/** @deprecated Use `t-result` library instead. */
export function resultify<T, E extends ResultValidErrors = Error>(
  fn: Promise<T>,
  errorNormalizer?: (err: unknown) => E,
): Promise<Result<T, E>>;
export function resultify(
  fn: (() => unknown) | Promise<unknown>,
  errorNormalizer?: (err: unknown) => ResultValidErrors,
):
  | Result<unknown, ResultValidErrors>
  | Promise<Result<unknown, ResultValidErrors>> {
  if (!isFunction(fn)) {
    return fn
      .then((value) => ok(value))
      .catch((error) =>
        err(
          errorNormalizer ?
            errorNormalizer(error)
          : (unknownToError(error) as unknown as ResultValidErrors),
        ),
      );
  }

  try {
    const result = fn();

    if (isPromise(result)) {
      return result
        .then((value) => ok(value))
        .catch((error) =>
          err(
            errorNormalizer ?
              errorNormalizer(error)
            : (unknownToError(error) as unknown as ResultValidErrors),
          ),
        );
    }

    return ok(result);
  } catch (error) {
    return err(
      errorNormalizer ?
        errorNormalizer(error)
      : (unknownToError(error) as unknown as ResultValidErrors),
    );
  }
}

/** @deprecated Use `t-result` library instead. */
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

/** @deprecated Use `t-result` library instead. */
export type TypedResult<T, E extends ResultValidErrors = Error> = {
  /** @deprecated Use `t-result` library instead. */
  ok: (value: T) => Ok<T>;
  /** @deprecated Use `t-result` library instead. */
  err: (error: E) => Err<E>;
  /** @deprecated Use `t-result` library instead. */
  _type: Result<T, E>;
};

/** @deprecated Use `t-result` library instead. */
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
