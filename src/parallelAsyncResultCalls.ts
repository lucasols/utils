import { invariant, isObject } from './assertions';
import {
  NormalizedError,
  NormalizedErrorWithMetadata,
  Result,
  ValidErrorMetadata,
  normalizeError,
} from './rsResult';
import { sleep } from './sleep';

type RunProps = {
  delayStart?: (index: number) => number;
};

type Failed<M> = {
  metadata: M;
  error: NormalizedError;
};
type Succeeded<R, M> = {
  value: R;
  metadata: M;
};

class ParallelAsyncResultCalls<
  M extends ValidErrorMetadata | undefined = undefined,
  R = unknown,
> {
  pendingCalls: {
    metadata: M;
    fn: () => Promise<Result<R>>;
  }[] = [];

  constructor() {}

  add(
    call: M extends undefined ? () => Promise<Result<R>>
    : { metadata: M; fn: () => Promise<Result<R>> },
  ) {
    this.pendingCalls.push(
      isObject(call) ? call : { metadata: undefined as any, fn: call },
    );

    return this;
  }

  async runAllSettled({ delayStart }: RunProps = {}) {
    const asyncResults = await Promise.allSettled(
      this.pendingCalls.map(async (call, i) => {
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

    const failed: Failed<M>[] = [];
    const succeeded: Succeeded<R, M>[] = [];

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

    return {
      failed,
      succeeded,
      allFailed: failed.length === this.pendingCalls.length,
    };
  }

  async runAll({
    delayStart,
  }: { delayStart?: (index: number) => number } = {}): Promise<
    Result<Succeeded<R, M>[], NormalizedErrorWithMetadata<M>>
  > {
    try {
      const asyncResults = await Promise.all(
        this.pendingCalls.map(async (call, i) => {
          try {
            if (delayStart) {
              await sleep(delayStart(i));
            }

            const result = await call.fn();

            if (!result.ok) {
              throw result.error;
            }

            return {
              value: result.value,
              metadata: call.metadata,
            };
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

      return Result.ok(asyncResults);
    } catch (exception) {
      return Result.err(exception as NormalizedErrorWithMetadata<M>);
    }
  }
}

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
  return new ParallelAsyncResultCalls<M, R>();
}
