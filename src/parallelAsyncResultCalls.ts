import { invariant, isObject } from './assertions';
import {
  NormalizedError,
  NormalizedErrorWithMetadata,
  Result,
  ValidErrorMetadata,
  normalizeError,
} from './rsResult';
import { sleep } from './sleep';

type TupleRunAllSuccess<T> =
  T extends () => Promise<Result<infer V>> ? Succeeded<V, undefined>
  : T extends { metadata: infer M; fn: () => Promise<Result<infer V>> } ?
    Succeeded<V, M>
  : never;

type TupleRunAllFailed<T> =
  T extends () => Promise<Result<any>> ? NormalizedErrorWithMetadata<undefined>
  : T extends { metadata: infer M extends ValidErrorMetadata } ?
    NormalizedErrorWithMetadata<M>
  : never;

type TupleRunAllSettled<T> =
  T extends () => Promise<Result<infer V>> ?
    Succeeded<V, undefined> | Failed<undefined>
  : T extends { metadata: infer M; fn: () => Promise<Result<infer V>> } ?
    Succeeded<V, M> | Failed<M>
  : never;

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
  private pendingCalls: {
    metadata: M;
    fn: () => Promise<Result<R>>;
  }[] = [];
  alreadyRun = false;

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

  /** adds calls return tuples with infered results */
  addTuple<
    T extends (M extends undefined ? () => Promise<Result<R>>
    : { metadata: M; fn: () => Promise<Result<R>> })[],
  >(
    ...calls: T
  ): {
    runAllSettled: (props?: RunProps) => Promise<{
      results: {
        [I in keyof T]: TupleRunAllSettled<T[I]>;
      };
      allFailed: boolean;
    }>;
    runAll: (props?: RunProps) => Promise<
      Result<
        {
          [I in keyof T]: TupleRunAllSuccess<T[I]>;
        },
        TupleRunAllFailed<T[number]>
      >
    >;
  } {
    for (const call of calls) {
      this.pendingCalls.push(
        isObject(call) ? call : { metadata: undefined as any, fn: call },
      );
    }

    return {
      runAll: this.runAll.bind(this) as any,
      runAllSettled: this.runAllSettled.bind(this) as any,
    };
  }

  async runAllSettled({ delayStart }: RunProps = {}) {
    invariant(!this.alreadyRun, 'Already run');

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
    const results: (Failed<M> | Succeeded<R, M>)[] = [];

    for (const asyncResult of asyncResults) {
      invariant(asyncResult.status === 'fulfilled');

      const { result, callMetadata } = asyncResult.value;

      if (result.ok) {
        const success = { value: result.value, metadata: callMetadata };
        results.push(success);
        succeeded.push(success);
      } else {
        const fail = { metadata: callMetadata, error: result.error };
        results.push(fail);
        failed.push(fail);
      }
    }

    const allFailed = failed.length === this.pendingCalls.length;

    this.alreadyRun = true;
    this.pendingCalls = [];

    return {
      failed,
      succeeded,
      allFailed,
      results,
    };
  }

  async runAll({
    delayStart,
  }: { delayStart?: (index: number) => number } = {}): Promise<
    Result<Succeeded<R, M>[], NormalizedErrorWithMetadata<M>>
  > {
    invariant(!this.alreadyRun, 'Already run');

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
    } finally {
      this.alreadyRun = true;
      this.pendingCalls = [];
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
