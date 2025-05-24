import { evtmitter } from 'evtmitter';
import {
  isResult,
  Result,
  resultify,
  unknownToError,
  type ResultValidErrors,
} from 't-result';
import { defer } from './promiseUtils';

type AsyncQueueOptions = {
  concurrency?: number;
  signal?: AbortSignal;
  timeout?: number;
};

type AddOptions<I, T, E extends ResultValidErrors> = {
  signal?: AbortSignal;
  timeout?: number;
  meta?: I;
  onComplete?: (value: T) => void;
  onError?: (error: E | Error) => void;
};

type RunCtx<I> = {
  signal?: AbortSignal;
  meta?: I;
};

type Task<T, E extends ResultValidErrors, I> = {
  run: (ctx: RunCtx<I>) => Promise<Result<T, E>>;
  resolve: (value: Result<T, E | Error>) => void;
  reject: (reason?: Result<T, E>) => void;
  signal: AbortSignal | undefined;
  meta: I;
  timeout: number | undefined;
};

class AsyncQueue<T, E extends ResultValidErrors = Error, I = unknown> {
  #queue: Array<Task<T, E, I>> = [];
  #pending = 0;
  #size = 0;
  #concurrency: number;
  #completed: number = 0;
  #failed: number = 0;
  #idleResolvers: Array<() => void> = [];
  events = evtmitter<{
    error: { meta: I; error: E | Error };
    complete: { meta: I; value: T };
    start: { meta: I };
  }>();
  #signal?: AbortSignal;
  #taskTimeout?: number;
  failures: Array<{ meta: I; error: E | Error }> = [];
  completions: Array<{ meta: I; value: T }> = [];

  constructor({
    concurrency = 1,
    signal,
    timeout: taskTimeout,
  }: AsyncQueueOptions = {}) {
    this.#concurrency = concurrency;
    this.#signal = signal;
    this.#taskTimeout = taskTimeout;

    this.events.on('error', (e) => {
      this.failures.push(e);
    });

    this.events.on('complete', (e) => {
      this.completions.push(e);
    });
  }

  #enqueue(task: Task<T, E, I>) {
    this.#queue.push(task);
    this.#size++;
  }

  async add(
    fn: (ctx: RunCtx<I>) => Promise<Result<T, E>> | Result<T, E>,
    options?: AddOptions<I, T, E>,
  ): Promise<Result<T, E | Error>> {
    if (this.#signal?.aborted) {
      return Result.err(
        this.#signal.reason instanceof Error ?
          this.#signal.reason
        : new DOMException('Queue aborted', 'AbortError'),
      );
    }

    const deferred = defer<Result<T, E | Error>>();

    const taskTimeout = this.#taskTimeout ?? options?.timeout;

    const task: Task<T, E, I> = {
      run: async (ctx) => {
        return fn(ctx);
      },
      resolve: deferred.resolve,
      reject: deferred.reject,
      signal: options?.signal,
      meta: options?.meta as I,
      timeout: taskTimeout,
    };
    this.#enqueue(task);
    this.#processQueue();

    const r = await deferred.promise;

    if (options?.onComplete) {
      r.onOk(options.onComplete);
    }
    if (options?.onError) {
      r.onErr(options.onError);
    }

    return r;
  }

  resultifyAdd(
    fn: (ctx: RunCtx<I>) => Promise<T> | T,
    options?: AddOptions<I, T, E>,
  ): Promise<Result<T, E | Error>> {
    return this.add(
      (ctx) =>
        resultify(async () => {
          return fn(ctx);
        }),
      options,
    );
  }

  async #processQueue(): Promise<void> {
    if (this.#signal?.aborted) {
      this.clear();
      return;
    }

    if (this.#pending >= this.#concurrency || this.#queue.length === 0) {
      return;
    }

    const task = this.#queue.shift();
    if (!task) {
      // Should not happen if queue.length > 0, but good for type safety
      return;
    }

    this.#pending++;
    this.#size--;

    const signals: AbortSignal[] = [];
    if (task.signal) {
      signals.push(task.signal);
    }
    if (this.#signal) {
      signals.push(this.#signal);
    }
    if (task.timeout) {
      signals.push(AbortSignal.timeout(task.timeout));
    }

    const signal = signals.length > 1 ? AbortSignal.any(signals) : signals[0];

    // Listener needs to be defined here to be removable in finally
    let abortListener: (() => void) | undefined;

    try {
      // Check if signal is already aborted before setting up anything
      if (signal?.aborted) {
        const error =
          signal.reason instanceof Error ?
            signal.reason
          : new DOMException('This operation was aborted', 'AbortError');

        throw error;
      }

      // Promise that rejects if the signal is aborted
      const signalAbortPromise = new Promise((_, reject) => {
        if (signal) {
          const error =
            signal.reason instanceof Error ?
              signal.reason
            : new DOMException('This operation was aborted', 'AbortError');
          abortListener = () => {
            reject(error);
          };
          signal.addEventListener('abort', abortListener, { once: true });
        }
        // If no signal, this promise never settles, Promise.race will wait for the other promise.
      });

      // Original task execution
      const taskRunPromise = task.run({ signal, meta: task.meta });

      this.events.emit('start', { meta: task.meta });

      // Race the task execution against its abortion signal
      const result = await Promise.race([taskRunPromise, signalAbortPromise]);

      // If we are here, taskRunPromise won, or signalAbortPromise won with a non-error (not possible with current setup)
      // The result is from task.run()
      if (isResult(result)) {
        task.resolve(result as Result<T, E | Error>);
        if (result.error) {
          this.#failed++;
          this.events.emit('error', {
            meta: task.meta,
            error: result.error as E,
          });
        } else {
          this.#completed++;
          this.events.emit('complete', {
            meta: task.meta,
            value: result.value,
          });
        }
      } else {
        const error = new Error('Response not a Result');
        task.resolve(Result.err(error));
        this.#failed++;
        this.events.emit('error', {
          meta: task.meta,
          error,
        });
      }
    } catch (error: any) {
      task.resolve(Result.err(error));

      this.#failed++;
      this.events.emit('error', {
        meta: task.meta,
        error: unknownToError(error),
      });
    } finally {
      // Clean up the abort listener if it was added
      if (signal && abortListener) {
        signal.removeEventListener('abort', abortListener);
      }

      this.#pending--;
      this.#processQueue(); // Try to process next task

      if (this.#pending === 0 && this.#size === 0) {
        this.#resolveIdleWaiters();
      }
    }
  }

  #resolveIdleWaiters() {
    while (this.#idleResolvers.length > 0) {
      const resolve = this.#idleResolvers.shift();
      if (resolve) {
        resolve();
      }
    }
  }

  async onIdle(): Promise<void> {
    if (this.#pending === 0 && this.#size === 0) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      this.#idleResolvers.push(resolve);
    });
  }

  clear() {
    this.#queue = [];
    this.#size = 0;

    // If no tasks were pending, and queue is now clear, it's idle.
    if (this.#pending === 0) {
      this.#resolveIdleWaiters();
    }
  }

  get completed() {
    return this.#completed;
  }

  get failed() {
    return this.#failed;
  }

  get pending() {
    return this.#pending;
  }

  get size() {
    return this.#size;
  }
}

type AddOptionsWithId<I, T, E extends ResultValidErrors> = Omit<
  AddOptions<I, T, E>,
  'meta'
> & { meta: I };

class AsyncQueueWithMeta<
  T,
  I,
  E extends ResultValidErrors = Error,
> extends AsyncQueue<T, E, I> {
  constructor(options?: AsyncQueueOptions) {
    super(options);
  }

  add(
    fn: (ctx: RunCtx<I>) => Promise<Result<T, E>> | Result<T, E>,
    options?: AddOptionsWithId<I, T, E>,
  ): Promise<Result<T, E | Error>> {
    return super.add(fn, options);
  }

  resultifyAdd(
    fn: (ctx: RunCtx<I>) => Promise<T> | T,
    options?: AddOptionsWithId<I, T, E>,
  ): Promise<Result<T, E | Error>> {
    return super.resultifyAdd(fn, options);
  }
}

export function createAsyncQueue<T, E extends ResultValidErrors = Error>(
  options?: AsyncQueueOptions,
): AsyncQueue<T, E> {
  return new AsyncQueue<T, E>(options);
}

export function createAsyncQueueWithMeta<
  T,
  I,
  E extends ResultValidErrors = Error,
>(options?: AsyncQueueOptions): AsyncQueueWithMeta<T, I, E> {
  return new AsyncQueueWithMeta<T, I, E>(options);
}
