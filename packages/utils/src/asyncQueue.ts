/**
 * @file AsyncQueue - A powerful, type-safe async task queue with advanced error
 *   handling
 *
 *   Features:
 *
 *   - Concurrency control with configurable limits
 *   - Error handling with stop-on-error and reject-pending options
 *   - Lazy start capability for batch preparation
 *   - Pause/resume functionality for flow control
 *   - Abort signal support for cancellation
 *   - Timeout support per task or globally
 *   - Event emission for progress tracking
 *   - Metadata support for task context
 *   - Reset functionality for error recovery
 *
 * @example
 *   Basic Usage
 *   ```typescript
 *   const queue = createAsyncQueue<string>({ concurrency: 3 });
 *
 *   queue.resultifyAdd(async () => {
 *   const response = await fetch('/api/data');
 *   return response.json();
 *   }).then(result => {
 *   if (result.ok) console.log('Success:', result.value);
 *   else console.error('Error:', result.error);
 *   });
 *
 *   await queue.onIdle(); // Wait for all tasks to complete
 *   ```
 *
 * @example
 *   Error Handling
 *   ```typescript
 *   const queue = createAsyncQueue<string>({
 *   stopOnError: true,
 *   rejectPendingOnError: true
 *   });
 *
 *   // Process batch with automatic error recovery
 *   const items = ['item1', 'item2', 'bad-item', 'item3'];
 *   for (const item of items) {
 *   queue.resultifyAdd(async () => processItem(item));
 *   }
 *
 *   await queue.onIdle();
 *
 *   if (queue.isStopped) {
 *   console.log(`Queue stopped after processing ${queue.completed} items`);
 *   queue.reset(); // Resume processing remaining items
 *   }
 *   ```
 */

import { evtmitter } from 'evtmitter';
import {
  isResult,
  Result,
  resultify,
  unknownToError,
  type ResultValidErrors,
} from 't-result';
import { defer } from './promiseUtils';
import { durationObjToMs, type DurationObj } from './time';

/** Configuration for rate limiting task execution */
type RateLimit = {
  /** Maximum number of tasks to execute within the interval */
  maxTasks: number;
  /** Time interval in milliseconds or as a duration object */
  interval: DurationObj | number;
};

/** Configuration options for AsyncQueue initialization */
type AsyncQueueOptions = {
  /** Maximum number of tasks to run concurrently (default: 1) */
  concurrency?: number;
  /** AbortSignal to cancel the entire queue */
  signal?: AbortSignal;
  /** Default timeout for all tasks in milliseconds */
  timeout?: number;
  /** Stop processing new tasks when any task fails (default: false) */
  stopOnError?: boolean;
  /** Reject all pending tasks when stopping on error (default: false) */
  rejectPendingOnError?: boolean;
  /** Start processing tasks immediately when added (default: true) */
  autoStart?: boolean;
  /** Rate limit configuration to limit tasks per time interval */
  rateLimit?: RateLimit;
};

/** Options for adding individual tasks to the queue */
type AddOptions<I, T, E extends ResultValidErrors> = {
  /** AbortSignal to cancel this specific task */
  signal?: AbortSignal;
  /** Timeout for this specific task in milliseconds */
  timeout?: number;
  /** Metadata to associate with this task */
  meta?: I;
  /** Callback invoked when task completes successfully */
  onComplete?: (value: T) => void;
  /** Callback invoked when task fails */
  onError?: (error: E | Error) => void;
};

/** Runtime context passed to task functions */
type RunCtx<I> = {
  /** Combined AbortSignal from task, queue, and timeout signals */
  signal?: AbortSignal;
  /** Metadata associated with this task */
  meta?: I;
};

/**
 * Internal representation of a queued task
 *
 * @internal
 */
type Task<T, E extends ResultValidErrors, I> = {
  /** The task function to execute */
  run: (ctx: RunCtx<I>) => Promise<Result<T, E>>;
  /** Promise resolver for task completion */
  resolve: (value: Result<T, E | Error>) => void;
  /** Promise rejector for task failure */
  reject: (reason?: Result<T, E>) => void;
  /** Task-specific abort signal */
  signal: AbortSignal | undefined;
  /** Task metadata */
  meta: I;
  /** Task-specific timeout */
  timeout: number | undefined;
};

/**
 * A powerful async task queue with advanced error handling and flow control
 *
 * @example
 *   Basic Usage
 *   ```typescript
 *   const queue = createAsyncQueue<string>({ concurrency: 2 });
 *
 *   const processedItems: string[] = [];
 *
 *   queue.resultifyAdd(async () => {
 *   await delay(100);
 *   return 'task completed';
 *   }).then(result => {
 *   if (result.ok) processedItems.push(result.value);
 *   });
 *
 *   await queue.onIdle();
 *   console.log('Processed:', processedItems);
 *   ```
 *
 * @example
 *   Error Recovery
 *   ```typescript
 *   const queue = createAsyncQueue<string>({
 *   stopOnError: true,
 *   rejectPendingOnError: false
 *   });
 *
 *   // Add batch of tasks
 *   const items = ['item1', 'item2', 'bad-item', 'item3'];
 *   items.forEach(item => {
 *   queue.resultifyAdd(async () => {
 *   if (item === 'bad-item') throw new Error('Processing failed');
 *   return item.toUpperCase();
 *   });
 *   });
 *
 *   await queue.onIdle();
 *
 *   if (queue.isStopped) {
 *   console.log(`Stopped at ${queue.failed} failures, ${queue.size} remaining`);
 *   // Reset and continue with remaining tasks
 *   queue.reset();
 *   await queue.onIdle();
 *   }
 *   ```
 *
 * @example
 *   Lazy Start
 *   ```typescript
 *   const queue = createAsyncQueue<string>({ autoStart: false });
 *
 *   // Prepare all tasks without starting
 *   queue.resultifyAdd(() => processTask1());
 *   queue.resultifyAdd(() => processTask2());
 *   queue.resultifyAdd(() => processTask3());
 *
 *   // Start processing when ready
 *   queue.start();
 *   await queue.onIdle();
 *   ```
 *
 * @template T - The type of value returned by successful tasks
 * @template E - The type of errors that tasks can produce (defaults to Error)
 * @template I - The type of metadata associated with tasks (defaults to
 *   unknown)
 */
class AsyncQueue<T, E extends ResultValidErrors = Error, I = unknown> {
  #queue: Array<Task<T, E, I>> = [];
  #pending = 0;
  #size = 0;
  #concurrency: number;
  #completed: number = 0;
  #failed: number = 0;
  #idleResolvers: Array<() => void> = [];
  #sizeLessThanWaiters: Array<{ limit: number; resolve: () => void }> = [];
  /**
   * Event emitter for tracking task lifecycle
   *
   * @example
   *   Listening to Events
   *   ```typescript
   *   const queue = createAsyncQueue<string>();
   *
   *   queue.events.on('start', (event) => {
   *   console.log('Task started:', event.payload.meta);
   *   });
   *
   *   queue.events.on('complete', (event) => {
   *   console.log('Task completed:', event.payload.value);
   *   });
   *
   *   queue.events.on('error', (event) => {
   *   console.error('Task failed:', event.payload.error);
   *   });
   *   ```
   */
  events = evtmitter<{
    /** Emitted when a task starts executing */
    start: { meta: I };
    /** Emitted when a task completes successfully */
    complete: { meta: I; value: T };
    /** Emitted when a task fails */
    error: { meta: I; error: E | Error };
  }>();
  #signal?: AbortSignal;
  #taskTimeout?: number;
  #stopped = false;
  #paused = false;
  #started = false;
  #stopOnError = false;
  #rejectPendingOnError = false;
  #autoStart = true;
  #stoppedReason?: Error;
  #rateLimit?: RateLimit;
  #taskExecutionTimes: number[] = [];
  #rateLimitTimeouts: Set<ReturnType<typeof setTimeout>> = new Set();
  /** Array of all task failures with metadata for debugging and analysis */
  failures: Array<{ meta: I; error: E | Error }> = [];

  /** Array of all task completions with metadata for debugging and analysis */
  completions: Array<{ meta: I; value: T }> = [];

  constructor({
    concurrency = 1,
    signal,
    timeout: taskTimeout,
    stopOnError = false,
    rejectPendingOnError = false,
    autoStart = true,
    rateLimit,
  }: AsyncQueueOptions = {}) {
    this.#concurrency = concurrency;
    this.#signal = signal;
    this.#taskTimeout = taskTimeout;
    this.#stopOnError = stopOnError;
    this.#rejectPendingOnError = rejectPendingOnError;
    this.#autoStart = autoStart;
    this.#started = autoStart;
    this.#rateLimit = rateLimit;

    this.events.on('error', (e) => {
      this.failures.push(e.payload);
    });

    this.events.on('complete', (e) => {
      this.completions.push(e.payload);
    });
  }

  #getRateLimitIntervalMs(): number {
    if (!this.#rateLimit) return 0;

    return typeof this.#rateLimit.interval === 'number' ?
        this.#rateLimit.interval
      : durationObjToMs(this.#rateLimit.interval);
  }

  #cleanupExpiredExecutionTimes(now: number) {
    if (!this.#rateLimit) return;

    const intervalMs = this.#getRateLimitIntervalMs();
    const cutoff = now - intervalMs;
    this.#taskExecutionTimes = this.#taskExecutionTimes.filter(
      (time) => time > cutoff,
    );
  }

  #isRateLimited(): boolean {
    if (!this.#rateLimit) return false;

    const now = Date.now();
    this.#cleanupExpiredExecutionTimes(now);

    return this.#taskExecutionTimes.length >= this.#rateLimit.maxTasks;
  }

  #getRateLimitDelay(): number {
    if (!this.#rateLimit || this.#taskExecutionTimes.length === 0) return 0;

    const oldestExecution = this.#taskExecutionTimes[0];
    if (oldestExecution === undefined) return 0;

    const intervalMs = this.#getRateLimitIntervalMs();
    const timeUntilSlotOpens = oldestExecution + intervalMs - Date.now();

    return Math.max(0, timeUntilSlotOpens);
  }

  #recordTaskExecution() {
    if (!this.#rateLimit) return;

    const now = Date.now();
    this.#taskExecutionTimes.push(now);
    this.#cleanupExpiredExecutionTimes(now);
  }

  #enqueue(task: Task<T, E, I>) {
    this.#queue.push(task);
    this.#size++;
  }

  static #createTimeoutSignal(ms: number): AbortSignal {
    const controller = new AbortController();
    const id = setTimeout(() => {
      controller.abort(
        new DOMException(
          'The operation was aborted due to timeout',
          'TimeoutError',
        ),
      );
    }, ms);
    controller.signal.addEventListener(
      'abort',
      () => {
        clearTimeout(id);
      },
      { once: true },
    );
    return controller.signal;
  }

  // removed: onEmpty-related waiters

  #resolveSizeLessThanWaiters() {
    if (this.#sizeLessThanWaiters.length === 0) return;
    const remaining: Array<{ limit: number; resolve: () => void }> = [];
    for (const waiter of this.#sizeLessThanWaiters) {
      if (this.#size < waiter.limit) {
        waiter.resolve();
      } else {
        remaining.push(waiter);
      }
    }
    this.#sizeLessThanWaiters = remaining;
  }

  /**
   * Add a task that returns a Result to the queue
   *
   * Use this method when your task function already returns a Result type. For
   * functions that throw errors or return plain values, use `resultifyAdd`
   * instead.
   *
   * @example
   *   ```typescript
   *   const queue = createAsyncQueue<string>();
   *
   *   const result = await queue.add(async () => {
   *     try {
   *       const data = await fetchData();
   *       return Result.ok(data);
   *     } catch (error) {
   *       return Result.err(error);
   *     }
   *   });
   *
   *   if (result.ok) {
   *     console.log('Success:', result.value);
   *   } else {
   *     console.log('Error:', result.error);
   *   }
   *   ```;
   *
   * @param fn - Task function that returns a Result
   * @param options - Optional configuration for this task
   * @returns Promise that resolves with the task result
   */
  async add(
    fn: (ctx: RunCtx<I>) => Promise<Result<T, E>> | Result<T, E>,
    options?: AddOptions<I, T, E>,
  ): Promise<Result<T, E | Error>> {
    if (this.#signal?.aborted) {
      return Result.err(
        this.#signal.reason instanceof Error ?
          this.#signal.reason
        : new DOMException('This operation was aborted', 'AbortError'),
      );
    }

    if (this.#stopped) {
      return Result.err(
        this.#stoppedReason ?? new Error('Queue has been stopped'),
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

    if (this.#autoStart && this.#started) {
      this.#processQueue();
    }

    const r = await deferred.promise;

    if (options?.onComplete) {
      r.onOk(options.onComplete);
    }
    if (options?.onError) {
      r.onErr(options.onError);
    }

    return r;
  }

  /**
   * Add a task that returns a plain value or throws errors to the queue
   *
   * This is the most commonly used method. It automatically wraps your function
   * to handle errors and convert them to Result types.
   *
   * @example
   *   Basic Usage
   *   ```typescript
   *   const queue = createAsyncQueue<string>();
   *
   *   queue.resultifyAdd(async () => {
   *   const response = await fetch('/api/data');
   *   return response.json();
   *   }).then(result => {
   *   if (result.ok) {
   *   console.log('Data:', result.value);
   *   } else {
   *   console.error('Failed:', result.error);
   *   }
   *   });
   *   ```
   *
   * @example
   *   With Callbacks
   *   ```typescript
   *   queue.resultifyAdd(
   *   async () => processData(),
   *   {
   *   onComplete: (data) => console.log('Processed:', data),
   *   onError: (error) => console.error('Failed:', error),
   *   timeout: 5000
   *   }
   *   );
   *   ```
   *
   * @param fn - Task function that returns a value or throws
   * @param options - Optional configuration for this task
   * @returns Promise that resolves with the task result wrapped in Result
   */
  resultifyAdd(
    fn: (ctx: RunCtx<I>) => Promise<T> | T,
    options?: AddOptions<I, T, E>,
  ): Promise<Result<T, E | Error>> {
    return this.add(
      (ctx) =>
        resultify(async () => {
          return fn(ctx);
        }) as Promise<Result<T, E>>,
      options,
    );
  }

  async #processQueue(): Promise<void> {
    if (this.#signal?.aborted) {
      this.clear();
      return;
    }

    if (this.#stopped || this.#paused || !this.#started) {
      return;
    }

    if (this.#pending >= this.#concurrency || this.#queue.length === 0) {
      return;
    }

    // Check rate limiting before processing a task
    if (this.#isRateLimited()) {
      const delay = this.#getRateLimitDelay();
      if (delay > 0) {
        const timeoutId = setTimeout(() => {
          this.#rateLimitTimeouts.delete(timeoutId);
          this.#processQueue();
        }, delay);
        this.#rateLimitTimeouts.add(timeoutId);
        return;
      }
    }

    const task = this.#queue.shift();
    if (!task) {
      // Should not happen if queue.length > 0, but good for type safety
      return;
    }

    this.#pending++;
    this.#size--;
    // No onEmpty resolution; only size and sizeLessThan waiters depend on size.
    this.#resolveSizeLessThanWaiters();

    // Record the task execution for rate limiting
    this.#recordTaskExecution();

    const signals: AbortSignal[] = [];
    if (task.signal) {
      signals.push(task.signal);
    }
    if (this.#signal) {
      signals.push(this.#signal);
    }
    if (task.timeout !== undefined) {
      signals.push(AsyncQueue.#createTimeoutSignal(task.timeout));
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
          abortListener = () => {
            const reason = signal.reason;
            const err =
              reason instanceof Error ? reason : (
                new DOMException('This operation was aborted', 'AbortError')
              );
            setTimeout(() => {
              reject(err);
            }, 0);
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
        if (!result.ok) {
          this.#failed++;
          this.events.emit('error', {
            meta: task.meta,
            error: result.error as E,
          });
          this.#stopOnErrorAndRejectPending(unknownToError(result.error));
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
        this.#stopOnErrorAndRejectPending(error);
      }
    } catch (error: any) {
      const processedError = unknownToError(error);
      task.resolve(Result.err(processedError));

      this.#failed++;
      this.events.emit('error', {
        meta: task.meta,
        error: processedError,
      });
      this.#stopOnErrorAndRejectPending(processedError);
    } finally {
      // Clean up the abort listener if it was added
      if (signal && abortListener) {
        signal.removeEventListener('abort', abortListener);
      }

      this.#pending--;
      this.#processQueue(); // Try to process next task

      if (
        this.#pending === 0 &&
        this.#size === 0 &&
        this.#rateLimitTimeouts.size === 0
      ) {
        // When everything is finished, resolve idle waiters
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

  #stopOnErrorAndRejectPending(error: Error) {
    if (!this.#stopOnError) {
      return;
    }

    this.#stopped = true;
    this.#stoppedReason = error;

    if (this.#rejectPendingOnError) {
      while (this.#queue.length > 0) {
        const task = this.#queue.shift();
        if (task) {
          task.resolve(Result.err(error));
        }
      }
      this.#size = 0;
      this.#resolveSizeLessThanWaiters();
    }

    // Always resolve idle waiters when stopping
    this.#resolveIdleWaiters();
  }

  /**
   * Wait for the queue to become idle (no pending tasks, no queued tasks, and
   * no rate-limit timers)
   *
   * This method resolves when:
   *
   * - All tasks have completed (success or failure)
   * - The queue is stopped due to error (stopOnError), even with remaining tasks
   * - There are no queued tasks, no running tasks, and no pending rate-limit
   *   timers
   *
   * @example
   *   ```typescript
   *   const queue = createAsyncQueue<string>();
   *
   *   // Add multiple tasks
   *   for (let i = 0; i < 10; i++) {
   *   queue.resultifyAdd(async () => `task ${i}`);
   *   }
   *
   *   // Wait for all tasks to complete
   *   await queue.onIdle();
   *
   *   console.log(`Completed: ${queue.completed}, Failed: ${queue.failed}`);
   *   ```
   *
   * @returns Promise that resolves when the queue is idle
   */
  async onIdle(): Promise<void> {
    if (
      this.#stopped ||
      (this.#pending === 0 &&
        this.#size === 0 &&
        this.#rateLimitTimeouts.size === 0)
    ) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      this.#idleResolvers.push(resolve);
    });
  }

  // removed: onEmpty()

  /**
   * Wait until the queued task count is below a limit
   *
   * Resolves immediately if `size < limit` at the moment of calling. This only
   * considers queued (not yet started) tasks; running tasks are tracked by
   * `pending`.
   *
   * @param limit Threshold that `size` must be below to resolve
   */
  onSizeLessThan(limit: number): Promise<void> {
    if (this.#size < limit) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      this.#sizeLessThanWaiters.push({ limit, resolve });
    });
  }

  /**
   * Clear all queued tasks (does not affect currently running tasks)
   *
   * This removes all tasks waiting in the queue but allows currently executing
   * tasks to complete normally.
   *
   * @example
   *   ```typescript
   *   const queue = createAsyncQueue({ concurrency: 1 });
   *
   *   // Add multiple tasks
   *   queue.resultifyAdd(async () => longRunningTask()); // Will start immediately
   *   queue.resultifyAdd(async () => task2()); // Queued
   *   queue.resultifyAdd(async () => task3()); // Queued
   *
   *   // Clear remaining queued tasks
   *   queue.clear();
   *
   *   // Only the first task will complete
   *   await queue.onIdle();
   *   ```;
   */
  clear() {
    this.#queue = [];
    this.#size = 0;

    // Clear any pending rate limit timeouts
    for (const timeoutId of this.#rateLimitTimeouts) {
      clearTimeout(timeoutId);
    }
    this.#rateLimitTimeouts.clear();

    // If no tasks are pending and queue is now clear, it's idle.
    if (this.#pending === 0) {
      this.#resolveIdleWaiters();
    }
    this.#resolveSizeLessThanWaiters();
  }

  /** Number of tasks that have completed successfully */
  get completed() {
    return this.#completed;
  }

  /** Number of tasks that have failed */
  get failed() {
    return this.#failed;
  }

  /** Number of tasks currently being processed */
  get pending() {
    return this.#pending;
  }

  /** Number of tasks waiting in the queue to be processed */
  get size() {
    return this.#size;
  }

  /**
   * Manually start processing tasks (only needed if autoStart: false)
   *
   * @example
   *   ```typescript
   *   const queue = createAsyncQueue({ autoStart: false });
   *
   *   // Add tasks without starting processing
   *   queue.resultifyAdd(async () => 'task1');
   *   queue.resultifyAdd(async () => 'task2');
   *
   *   // Start processing when ready
   *   queue.start();
   *   await queue.onIdle();
   *   ```;
   */
  start(): void {
    if (this.#stopped) {
      return;
    }
    this.#started = true;
    this.#processQueue();
  }

  /**
   * Pause processing new tasks (currently running tasks continue)
   *
   * @example
   *   ```typescript
   *   const queue = createAsyncQueue();
   *
   *   // Start some tasks
   *   queue.resultifyAdd(async () => longRunningTask1());
   *   queue.resultifyAdd(async () => longRunningTask2());
   *
   *   // Pause before more tasks are picked up
   *   queue.pause();
   *
   *   // Later, resume processing
   *   queue.resume();
   *   ```;
   */
  pause(): void {
    this.#paused = true;
  }

  /** Resume processing tasks after pause */
  resume(): void {
    this.#paused = false;
    if (this.#started && !this.#stopped) {
      this.#processQueue();
    }
  }

  /**
   * Reset the queue after being stopped, allowing new tasks to be processed
   *
   * This clears the stopped state and error reason, and resumes processing any
   * remaining queued tasks if autoStart was enabled.
   *
   * @example
   *   ```typescript
   *   const queue = createAsyncQueue({ stopOnError: true });
   *
   *   // Add tasks that will cause the queue to stop
   *   queue.resultifyAdd(async () => { throw new Error('fail'); });
   *   queue.resultifyAdd(async () => 'remaining task');
   *
   *   await queue.onIdle();
   *
   *   if (queue.isStopped) {
   *   console.log(`Queue stopped, ${queue.size} tasks remaining`);
   *
   *   // Reset and process remaining tasks
   *   queue.reset();
   *   await queue.onIdle();
   *   }
   *   ```
   */
  reset(): void {
    this.#stopped = false;
    this.#stoppedReason = undefined;
    if (this.#autoStart) {
      this.#started = true;
      this.#processQueue();
    }
  }

  /** Whether the queue is stopped due to an error */
  get isStopped(): boolean {
    return this.#stopped;
  }

  /** Whether the queue is currently paused */
  get isPaused(): boolean {
    return this.#paused;
  }

  /** Whether the queue has been started (relevant for autoStart: false) */
  get isStarted(): boolean {
    return this.#started;
  }

  /** The error that caused the queue to stop (if any) */
  get stoppedReason(): Error | undefined {
    return this.#stoppedReason;
  }
}

/** AddOptions variant that requires metadata to be provided */
type AddOptionsWithId<I, T, E extends ResultValidErrors> = Omit<
  AddOptions<I, T, E>,
  'meta'
> & { meta: I };

/**
 * AsyncQueue variant that requires metadata for all tasks
 *
 * This class enforces that every task must include metadata, which is useful
 * when you need to track or identify tasks consistently.
 *
 * @example
 *   ```typescript
 *   interface TaskMeta {
 *   id: string;
 *   priority: number;
 *   }
 *
 *   const queue = createAsyncQueueWithMeta<string, TaskMeta>({ concurrency: 2 });
 *
 *   queue.resultifyAdd(
 *   async () => processImportantTask(),
 *   { meta: { id: 'task-1', priority: 1 } }
 *   );
 *
 *   // Listen to events with metadata
 *   queue.events.on('complete', (event) => {
 *   console.log(`Task ${event.payload.meta.id} completed`);
 *   });
 *   ```
 *
 * @template T - The type of value returned by successful tasks
 * @template I - The type of metadata (required for all tasks)
 * @template E - The type of errors that tasks can produce
 */
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
    options: AddOptionsWithId<I, T, E>,
  ): Promise<Result<T, E | Error>> {
    return super.add(fn, options);
  }

  resultifyAdd(
    fn: (ctx: RunCtx<I>) => Promise<T> | T,
    options: AddOptionsWithId<I, T, E>,
  ): Promise<Result<T, E | Error>> {
    return super.resultifyAdd(fn, options);
  }
}

/**
 * Create a new AsyncQueue instance
 *
 * @example
 *   Basic Queue
 *   ```typescript
 *   const queue = createAsyncQueue<string>({ concurrency: 3 });
 *   ```
 *
 * @example
 *   Error Handling Queue
 *   ```typescript
 *   const queue = createAsyncQueue<string>({
 *   concurrency: 2,
 *   stopOnError: true,
 *   rejectPendingOnError: true
 *   });
 *   ```
 *
 * @example
 *   Lazy Start Queue
 *   ```typescript
 *   const queue = createAsyncQueue<string>({
 *   autoStart: false,
 *   concurrency: 1
 *   });
 *   ```
 *
 * @template T - The type of value returned by successful tasks
 * @template E - The type of errors that tasks can produce (defaults to Error)
 * @param options - Configuration options for the queue
 * @returns A new AsyncQueue instance
 */
export function createAsyncQueue<T, E extends ResultValidErrors = Error>(
  options?: AsyncQueueOptions,
): AsyncQueue<T, E> {
  return new AsyncQueue<T, E>(options);
}

export type { AsyncQueue };

/**
 * Create a new AsyncQueueWithMeta instance that requires metadata for all tasks
 *
 * @example
 *   ```typescript
 *   interface TaskInfo {
 *   taskId: string;
 *   userId: string;
 *   }
 *
 *   const queue = createAsyncQueueWithMeta<ProcessResult, TaskInfo>({
 *   concurrency: 5
 *   });
 *
 *   queue.resultifyAdd(
 *   async (ctx) => {
 *   console.log(`Processing task ${ctx.meta.taskId} for user ${ctx.meta.userId}`);
 *   return await processUserTask(ctx.meta.userId);
 *   },
 *   { meta: { taskId: '123', userId: 'user456' } }
 *   );
 *   ```
 *
 * @template T - The type of value returned by successful tasks
 * @template I - The type of metadata (required for all tasks)
 * @template E - The type of errors that tasks can produce (defaults to Error)
 * @param options - Configuration options for the queue
 * @returns A new AsyncQueueWithMeta instance
 */
export function createAsyncQueueWithMeta<
  T,
  I,
  E extends ResultValidErrors = Error,
>(options?: AsyncQueueOptions): AsyncQueueWithMeta<T, I, E> {
  return new AsyncQueueWithMeta<T, I, E>(options);
}

export type { AsyncQueueWithMeta };
