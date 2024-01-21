import { invariant } from './assertions';
import { isObject } from './objUtils';
import {
  NormalizedError,
  NormalizedErrorWithMetadata,
  Result,
  ValidErrorMetadata,
  normalizeError,
} from './rsResult';
import { sleep } from './sleep';

/**
 * Executes multiple asynchronous calls in parallel and collects the results in a easier to use format.
 *
 * @template R - The type of the result value.
 * @template M - The type of the call metadata.
 */
export function parallelAsyncResultCalls<
  M extends ValidErrorMetadata | undefined = undefined,
  R = unknown,
>() {
  const pendingCalls: {
    metadata: M;
    fn: () => Promise<Result<R>>;
  }[] = [];

  function add(
    call: M extends undefined ? () => Promise<Result<R>>
    : { metadata: M; fn: () => Promise<Result<R>> },
  ) {
    pendingCalls.push(
      isObject(call) ? call : { metadata: undefined as any, fn: call },
    );

    return methods;
  }

  type Failed = {
    metadata: M;
    error: NormalizedError;
  };
  type Succeeded = {
    value: R;
    metadata: M;
  };

  type RunProps = {
    delayStart?: (index: number) => number;
  };

  /** Runs all the calls in parallel and returns the results. */
  async function runAllSettled({ delayStart }: RunProps = {}) {
    const asyncResults = await Promise.allSettled(
      pendingCalls.map(async (call, i) => {
        try {
          if (delayStart) {
            await sleep(delayStart(i));
          }

          const result = await call.fn();

          return { result, callMetadata: call.metadata };
        } catch (exception) {
          return {
            result: Result.normalizedUnknownErr(exception),
            callMetadata: call.metadata,
          };
        }
      }),
    );

    const failed: Failed[] = [];
    const succeeded: Succeeded[] = [];

    for (const asyncResult of asyncResults) {
      invariant(asyncResult.status === 'fulfilled');

      const { result, callMetadata } = asyncResult.value;

      if (result.ok) {
        succeeded.push({
          value: result.value,
          metadata: callMetadata,
        });
      } else {
        failed.push({
          metadata: callMetadata,
          error: result.error,
        });
      }
    }

    return { failed, succeeded };
  }

  /** Runs all the calls in parallel and rejects if any of them fails. */
  async function runAll({
    delayStart,
  }: { delayStart?: (index: number) => number } = {}): Promise<
    Result<Succeeded[], NormalizedErrorWithMetadata<M>>
  > {
    try {
      const asyncResults = await Promise.all(
        pendingCalls.map(async (call, i) => {
          try {
            if (delayStart) {
              await sleep(delayStart(i));
            }

            const result = await call.fn();

            if (!result.ok) {
              throw result.error;
            }

            return Result.ok({
              value: result.value,
              metadata: call.metadata,
            });
          } catch (exception) {
            const error = normalizeError(exception);

            throw new NormalizedErrorWithMetadata({
              id: error.id,
              message: error.message,
              cause: error.cause,
              metadata: call.metadata,
            });
          }
        }),
      );

      return Result.ok(
        asyncResults.map((result) => ({
          value: result.unwrap(),
          metadata: result.unwrap(),
        })),
      );
    } catch (exception) {
      return Result.err(exception as NormalizedErrorWithMetadata<M>);
    }
  }

  const methods = { add, runAllSettled, runAll };

  return methods;
}
