import { Result, resultify, unknownToError } from 't-result';
import { truncateArray } from './arrayUtils';
import { invariant, isPromise } from './assertions';
import { sleep } from './sleep';
import { truncateString } from './stringUtils';

type ValidMetadata = string | number | boolean | Record<string, unknown>;

type RunProps = {
  delayStart?: (index: number) => number;
};

// Succeeded and Failed types will be used by ConcurrentCallsWithMetadata directly for its return structure
type SucceededCall<R, M> = {
  value: R;
  metadata: M;
};
type FailedCall<M, E extends Error = Error> = {
  metadata: M;
  error: E;
};

type Action<R, E extends Error> =
  | (() => Promise<Result<R, E>>)
  | Promise<Result<R, E>>;

// Type for the elements in the 'results' array of runAllSettled for ConcurrentCallsWithMetadata
type SettledResultWithMetadata<R, M, E extends Error = Error> =
  | { ok: true; value: R; metadata: M; error: false }
  | { ok: false; error: E; metadata: M };

class ConcurrentCalls<R = unknown, E extends Error = Error> {
  #pendingCalls: Action<R, E>[] = [];
  #alreadyRun = false;

  add(...calls: Action<R, E>[]): this {
    this.#pendingCalls.push(...calls);

    return this;
  }

  resultifyAdd(
    ...calls: (Promise<R> | (() => R) | (() => Promise<R>))[]
  ): this {
    const processedCalls = calls.map((call) => {
      if (isPromise(call)) {
        // Input is Promise<R>, transform to Promise<Result<R, E>>
        return call
          .then((value: R) => Result.ok<R>(value))
          .catch((err) => Result.err(unknownToError(err) as E));
      } else {
        // Input is (() => R) or (() => Promise<R>), transform to () => Promise<Result<R, E>>
        const originalFn = call;
        return async (): Promise<Result<R, E>> => {
          try {
            const valueOrPromise = originalFn();
            const value =
              isPromise(valueOrPromise) ? await valueOrPromise : valueOrPromise;
            return Result.ok<R>(value);
          } catch (err) {
            return Result.err(unknownToError(err) as E);
          }
        };
      }
    });
    // Ensure processedCalls is correctly typed before spreading
    const correctlyTypedProcessedCalls: (
      | Promise<Result<R, E>>
      | (() => Promise<Result<R, E>>)
    )[] = processedCalls;
    return this.add(...correctlyTypedProcessedCalls);
  }

  async runAll({ delayStart }: RunProps = {}): Promise<Result<R[], E>> {
    invariant(!this.#alreadyRun, 'Already run');

    this.#alreadyRun = true;

    try {
      const asyncResults = await Promise.all(
        this.#pendingCalls.map(async (fn, i) => {
          try {
            const isP = isPromise(fn);

            if (delayStart) {
              invariant(
                !isP,
                'Delay start is not supported direct promise calls',
              );
              await sleep(delayStart(i));
            }

            const result = await (isP ? fn : fn());

            if (!result.ok) throw result.error;

            return result.value;
          } catch (exception) {
            throw unknownToError(exception);
          }
        }),
      );

      return Result.ok(asyncResults);
    } catch (exception) {
      return Result.err(unknownToError(exception) as E);
    } finally {
      this.#pendingCalls = [];
    }
  }

  async runAllSettled({ delayStart }: RunProps = {}): Promise<{
    allFailed: boolean;
    failures: E[];
    succeeded: R[];
    total: number;
    aggregatedError: AggregateError | null;
  }> {
    invariant(!this.#alreadyRun, 'Already run');
    this.#alreadyRun = true;

    const total = this.#pendingCalls.length;
    const settledResults = await Promise.allSettled(
      this.#pendingCalls.map(async (callOrPromise, i) => {
        try {
          const isP = isPromise(callOrPromise);
          if (delayStart) {
            invariant(
              !isP,
              'Delay start is not supported for direct promise calls',
            );
            await sleep(delayStart(i));
          }
          const result = await (isP ? callOrPromise : callOrPromise());
          if (!result.ok) {
            throw result.error;
          }
          return result.value;
        } catch (exception) {
          throw unknownToError(exception);
        }
      }),
    );

    const succeeded: R[] = [];
    const failed: E[] = [];

    for (const settledResult of settledResults) {
      if (settledResult.status === 'fulfilled') {
        succeeded.push(settledResult.value as R);
      } else {
        failed.push(settledResult.reason as E);
      }
    }

    const allFailed = failed.length === total;
    const aggregatedError =
      failed.length > 0 ?
        new AggregateError(failed, 'One or more calls failed')
      : null;

    this.#pendingCalls = [];

    return {
      succeeded,
      failures: failed,
      allFailed,
      total,
      aggregatedError,
    };
  }
}

/**
 * Executes multiple asynchronous calls concurrently and collects the results in a easier to use format.
 *
 * @template R - The type of the result value.
 * @template E - The type of the error.
 */
export function concurrentCalls<R = unknown, E extends Error = Error>() {
  return new ConcurrentCalls<R, E>();
}

class ConcurrentCallsWithMetadata<
  M extends ValidMetadata,
  R = unknown,
  E extends Error = Error,
> {
  #pendingCalls: { fn: Action<R, E>; metadata: M }[] = [];
  #alreadyRun = false;

  add(
    ...calls: {
      fn: Action<R, E>;
      metadata: M;
    }[]
  ): this {
    invariant(
      !this.#alreadyRun,
      'Cannot add calls after execution has started.',
    );
    this.#pendingCalls.push(...calls);
    return this;
  }

  resultifyAdd(
    ...items: { fn: (() => R) | (() => Promise<R>) | Promise<R>; metadata: M }[]
  ): this {
    const processedItems = items.map(({ fn, metadata }) => {
      const cb: Action<R, E> =
        isPromise(fn) ?
          resultify(fn)
        : () =>
            resultify(async () => {
              const result = await fn();
              return result;
            });

      return {
        fn: cb,
        metadata,
      };
    });
    return this.add(...processedItems);
  }

  async runAll({ delayStart }: RunProps = {}): Promise<
    Result<SucceededCall<R, M>[], FailedCall<M, E>>
  > {
    invariant(!this.#alreadyRun, 'Already run');
    this.#alreadyRun = true;
    const currentCalls = [...this.#pendingCalls]; // Work on a copy
    this.#pendingCalls = []; // Clear original immediately

    try {
      const successfulResults: SucceededCall<R, M>[] = [];
      for (let i = 0; i < currentCalls.length; i++) {
        const call = currentCalls[i]!;
        try {
          if (delayStart) {
            await sleep(delayStart(i));
          }
          const result = await (isPromise(call.fn) ? call.fn : call.fn());
          if (!result.ok) {
            throw { metadata: call.metadata, error: result.error };
          }
          successfulResults.push({
            value: result.value,
            metadata: call.metadata,
          });
        } catch (exception) {
          if (
            typeof exception === 'object' &&
            exception !== null &&
            'metadata' in exception &&
            'error' in exception &&
            exception.metadata === call.metadata
          ) {
            throw exception as FailedCall<M, E>;
          } else {
            throw {
              metadata: call.metadata,
              error: unknownToError(exception) as E,
            } as FailedCall<M, E>;
          }
        }
      }
      return Result.ok(successfulResults);
    } catch (errorPayload) {
      return Result.err(errorPayload as FailedCall<M, E>);
    }
  }

  async runAllSettled({ delayStart }: RunProps = {}): Promise<{
    allFailed: boolean;
    failed: FailedCall<M, E>[];
    succeeded: SucceededCall<R, M>[];
    total: number;
    results: SettledResultWithMetadata<R, M, E>[];
    aggregatedError: AggregateError | null;
  }> {
    invariant(!this.#alreadyRun, 'Already run');
    this.#alreadyRun = true;
    const currentCalls = [...this.#pendingCalls]; // Work on a copy
    this.#pendingCalls = []; // Clear original immediately

    const total = currentCalls.length;
    if (total === 0) {
      return {
        succeeded: [],
        failed: [],
        results: [],
        allFailed: false,
        total: 0,
        aggregatedError: null,
      };
    }

    const settledOutcomes = await Promise.allSettled(
      currentCalls.map(async (call, i) => {
        try {
          if (delayStart) {
            await sleep(delayStart(i));
          }
          const result = await (isPromise(call.fn) ? call.fn : call.fn());
          if (!result.ok) {
            throw result.error; // Throw the raw error to be caught by this inner catch
          }
          return result.value; // Resolve with the value for Promise.allSettled
        } catch (innerException) {
          // This catch is for errors from call.fn() or if result.ok was false
          // We want Promise.allSettled to see this as a rejection with the error itself.
          throw unknownToError(innerException);
        }
      }),
    );

    const succeededProcessing: SucceededCall<R, M>[] = [];
    const failedProcessing: FailedCall<M, E>[] = [];
    const resultsProcessing: SettledResultWithMetadata<R, M, E>[] = [];

    for (let i = 0; i < settledOutcomes.length; i++) {
      const outcome = settledOutcomes[i]!;
      const { metadata } = currentCalls[i]!;

      if (outcome.status === 'fulfilled') {
        const value = outcome.value as R;
        succeededProcessing.push({ value, metadata });
        resultsProcessing.push({ ok: true, value, metadata, error: false });
      } else {
        // outcome.reason is the error thrown from the inner catch
        const error = outcome.reason as E;
        failedProcessing.push({ error, metadata });
        resultsProcessing.push({ ok: false, error, metadata });
      }
    }

    const allFailed = failedProcessing.length === total;
    const aggregatedError =
      failedProcessing.length > 0 ?
        new AggregateError(
          failedProcessing.map((f) => f.error),
          `${failedProcessing.length}/${total} calls failed: ${truncateArray(
            failedProcessing.map((f) => truncateString(f.error.message, 20)),
            5,
            (count) => `+${count} more`,
          ).join('; ')}`,
        )
      : null;

    return {
      succeeded: succeededProcessing,
      failed: failedProcessing,
      results: resultsProcessing,
      allFailed,
      total,
      aggregatedError,
    };
  }
}

/**
 * Executes multiple asynchronous calls concurrently and collects the results in a easier to use format.
 *
 * @template M - The type of the call metadata.
 * @template R - The type of the result value.
 * @template E - The type of the error from individual Result objects.
 */
export function concurrentCallsWithMetadata<
  M extends ValidMetadata,
  R = unknown,
  E extends Error = Error,
>() {
  return new ConcurrentCallsWithMetadata<M, R, E>();
}
