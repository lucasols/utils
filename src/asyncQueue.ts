import { evtmitter } from 'evtmitter';
import {
  isResult,
  Result,
  resultify,
  unknownToError,
  type ResultValidErrors,
} from 't-result';
import { isPromise } from './assertions';
import { defer } from './promiseUtils';

type AsyncQueueOptions = {
  concurrency?: number;
  signal?: AbortSignal;
  timeout?: number;
};

type AddOptions<I> = {
  signal?: AbortSignal;
  timeout?: number;
  id?: I;
};

type Task<T, E extends ResultValidErrors, I> = {
  run: (ctx: { signal?: AbortSignal }) => Promise<Result<T, E>>;
  resolve: (value: Result<T, E | Error>) => void;
  reject: (reason?: Result<T, E>) => void;
  signal: AbortSignal | undefined;
  id: I;
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
    error: { id: I; error: E | Error };
    complete: { id: I; value: T };
    start: { id: I };
  }>();
  #signal?: AbortSignal;
  #taskTimeout?: number;

  constructor({
    concurrency = 1,
    signal,
    timeout: taskTimeout,
  }: AsyncQueueOptions = {}) {
    this.#concurrency = concurrency;
    this.#signal = signal;
    this.#taskTimeout = taskTimeout;
  }

  #enqueue(task: Task<T, E, I>) {
    this.#queue.push(task);
    this.#size++;
  }

  add(
    fn:
      | ((ctx: {
          signal?: AbortSignal;
        }) => Promise<Result<T, E>> | Result<T, E>)
      | Promise<Result<T, E>>,
    options?: AddOptions<I>,
  ): Promise<Result<T, E | Error>> {
    const deferred = defer<Result<T, E | Error>>();

    const taskTimeout = this.#taskTimeout ?? options?.timeout;

    const task: Task<T, E, I> = {
      run: async (ctx) => {
        if (isPromise(fn)) {
          return fn;
        }
        return await fn(ctx);
      },
      resolve: deferred.resolve,
      reject: deferred.reject,
      signal: options?.signal,
      id: options?.id as I,
      timeout: taskTimeout,
    };
    this.#enqueue(task);
    this.#processQueue();

    return deferred.promise;
  }

  resultifyAdd(
    fn: ((ctx: { signal?: AbortSignal }) => Promise<T> | T) | Promise<T>,
    options?: AddOptions<I>,
  ): Promise<Result<T, E | Error>> {
    const cb: (ctx: { signal?: AbortSignal }) => Promise<T> = async (ctx) => {
      if (isPromise(fn)) {
        return await fn;
      }
      return fn(ctx);
    };
    return this.add((ctx) => resultify(cb(ctx)), options);
  }

  async #processQueue(): Promise<void> {
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
    // Promise that rejects if the signal is aborted
    const signalAbortPromise = new Promise((_, reject) => {
      if (signal) {
        const error =
          signal.reason instanceof Error ?
            signal.reason
          : new DOMException('Aborted', 'AbortError');
        if (signal.aborted) {
          reject(error);
          return;
        }
        abortListener = () => {
          reject(error);
        };
        signal.addEventListener('abort', abortListener, { once: true });
      }
      // If no signal, this promise never settles, Promise.race will wait for the other promise.
    });

    try {
      // Original task execution
      const taskRunPromise = task.run({ signal });

      this.events.emit('start', { id: task.id });

      // Race the task execution against its abortion signal
      const result = await Promise.race([taskRunPromise, signalAbortPromise]);

      // If we are here, taskRunPromise won, or signalAbortPromise won with a non-error (not possible with current setup)
      // The result is from task.run()
      if (isResult(result)) {
        task.resolve(result as Result<T, E | Error>);
        if (result.error) {
          this.#failed++;
          this.events.emit('error', { id: task.id, error: result.error as E });
        } else {
          this.#completed++;
          this.events.emit('complete', { id: task.id, value: result.value });
        }
      } else {
        const error = new Error('Response not a Result');
        task.resolve(Result.err(error));
        this.#failed++;
        this.events.emit('error', {
          id: task.id,
          error: unknownToError(error),
        });
      }
    } catch (error: any) {
      task.resolve(Result.err(error));

      this.#failed++;
      this.events.emit('error', { id: task.id, error: unknownToError(error) });
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

  clear({ resetCounters = true }: { resetCounters?: boolean } = {}) {
    this.#queue = [];
    this.#size = 0;

    if (resetCounters) {
      this.#completed = 0;
      this.#failed = 0;
    }

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

type AddOptionsWithId<I> = Omit<AddOptions<I>, 'id'> & { id: I };

class AsyncQueueWithId<
  T,
  I,
  E extends ResultValidErrors = Error,
> extends AsyncQueue<T, E, I> {
  constructor(options?: AsyncQueueOptions) {
    super(options);
  }

  add(
    fn: (() => Promise<Result<T, E>> | Result<T, E>) | Promise<Result<T, E>>,
    options?: AddOptionsWithId<I>,
  ): Promise<Result<T, E | Error>> {
    return super.add(fn, options);
  }

  resultifyAdd(
    fn: (() => Promise<T> | T) | Promise<T>,
    options?: AddOptionsWithId<I>,
  ): Promise<Result<T, E | Error>> {
    return super.resultifyAdd(fn, options);
  }
}

export function createAsyncQueue<T, E extends ResultValidErrors = Error>(
  options?: AsyncQueueOptions,
) {
  return new AsyncQueue<T, E>(options);
}

export function createAsyncQueueWithId<
  T,
  I,
  E extends ResultValidErrors = Error,
>(options?: AsyncQueueOptions) {
  return new AsyncQueueWithId<T, I, E>(options);
}
