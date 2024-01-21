import { isObject } from './objUtils';
import { joinStrings } from './stringUtils';

type Ok<T> = {
  ok: true;
  value: T;
};

type Err<E extends Error> = {
  ok: false;
  error: E;
  errorResult: () => Result<any, E>;
};

type ResultMethods<T> = {
  /** Returns the value if the result is Ok, otherwise returns null */
  unwrapOrNull: () => T | null;
  /** Returns the value if the result is Ok, otherwise returns the provided default value */
  unwrapOr: <R extends T>(defaultValue: R) => T | R;
  unwrap: () => T;
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
export type Result<T, E extends Error = NormalizedError> =
  | OkResult<T, T>
  | ErrResult<E, T>;

function okUnwrapOr<T>(this: Ok<T>) {
  return this.value;
}

type OkResult<T, M = any> = Ok<T> & ResultMethods<M>;

function ok(): OkResult<void>;
function ok<T>(value: T): OkResult<T>;
function ok(value: any = undefined): OkResult<any> {
  return {
    ok: true,
    value,
    unwrapOrNull: okUnwrapOr,
    unwrapOr: okUnwrapOr,
    unwrap: okUnwrapOr,
  };
}

type ErrResult<E extends Error, T = any> = Err<E> & ResultMethods<T>;

function err<E extends Error>(error: E): ErrResult<E> {
  return {
    ok: false,
    error,
    unwrapOrNull: () => null,
    unwrapOr: (defaultValue) => defaultValue,
    errorResult() {
      return err(error);
    },
    unwrap() {
      throw error;
    },
  };
}

function normalizedUnknownErr(error: unknown) {
  return err(normalizeError(error));
}

function normalizedErr(message: string): ErrResult<NormalizedError>;
function normalizedErr<T extends string>(
  id: T,
  message: string,
): ErrResult<NormalizedError<T>>;
function normalizedErr(
  idOrMessage: string,
  message?: string,
): ErrResult<NormalizedError> {
  if (message) {
    return err(
      new NormalizedError({
        id: idOrMessage,
        message,
      }),
    );
  }

  return err(
    new NormalizedError({
      id: 'Error',
      message: idOrMessage,
    }),
  );
}

export const Result = {
  ok,
  err,
  normalizedErr,
  normalizedUnknownErr,
};

/** transfor a function in a result function */
export function resultify<T, E extends Error = NormalizedError>(
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

/** transfor a async function in a result function */
export async function asyncResultify<T, E extends Error = NormalizedError>(
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

export type ValidErrorMetadata =
  | Record<string, unknown>
  | string
  | number
  | boolean
  | undefined;

let normalizedErrorSideEffects:
  | ((normalizedError: NormalizedError) => void)
  | undefined = undefined;

export function setNormalizedErrorSideEffects(
  callback: (normalizedError: NormalizedError) => void,
) {
  normalizedErrorSideEffects = callback;
}

export class NormalizedError<T = string> extends Error {
  id: T;
  metadata?: ValidErrorMetadata;
  cause?: Error;

  constructor({
    id,
    message,
    metadata,
    cause,
  }: {
    id: T;
    message: string;
    metadata?: ValidErrorMetadata;
    cause?: Error;
  }) {
    super(message);
    this.id = id;
    this.name = 'NormalizedError';
    this.metadata = metadata;
    this.cause = cause;

    setTimeout(() => {
      if (normalizedErrorSideEffects) {
        normalizedErrorSideEffects(this as NormalizedError);
      }
    }, 1);
  }

  toString() {
    return joinStrings(
      `${this.id}: ${this.message}`,
      !!this.cause && `\n  Caused by: ${this.cause}`,
      !!this.metadata && `\n  Metadata: ${JSON.stringify(this.metadata)}`,
    );
  }

  toJSON() {
    return {
      id: this.id,
      message: this.message,
      metadata: this.metadata,
      cause:
        this.cause ?
          'toJSON' in this.cause ?
            this.cause
          : String(this.cause)
        : undefined,
    };
  }
}

export class NormalizedErrorWithMetadata<
  M extends ValidErrorMetadata,
  T = string,
> extends NormalizedError<T> {
  metadata: M;

  constructor(
    props:
      | {
          id: T;
          message: string;
          metadata: M;
          cause?: Error;
        }
      | {
          error: NormalizedError<T>;
          metadata: M;
        },
  ) {
    if ('error' in props) {
      super({
        id: props.error.id,
        message: props.error.message,
        cause: props.error.cause,
      });
      this.metadata = props.metadata;
    } else {
      super(props);
      this.metadata = props.metadata;
    }
  }
}

export function normalizeError(error: unknown): NormalizedError {
  if (error instanceof NormalizedError) return error;

  if (typeof error === 'string') {
    return new NormalizedError({
      id: 'Error',
      message: error,
    });
  }

  if (error instanceof Error) {
    return new NormalizedError({
      id: error.name,
      message: error.message,
      cause: error,
    });
  }

  if (isObject(error)) {
    return new NormalizedError({
      id: 'id' in error ? String(error.id) : 'Error',
      message:
        'message' in error ? String(error.message) : JSON.stringify(error),
      metadata: error,
    });
  }

  return new NormalizedError({
    message: JSON.stringify(error),
    id: 'Error',
  });
}
