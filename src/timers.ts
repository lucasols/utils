export type CleanupTimer = () => void;

/**
 * Creates a timeout with automatic cleanup capability.
 *
 * Returns a cleanup function that can be called to cancel the timeout.
 * The cleanup function is idempotent - calling it multiple times is safe.
 *
 * @param ms - The timeout duration in milliseconds
 * @param callback - The function to execute when the timeout completes
 * @returns A cleanup function that cancels the timeout when called
 *
 * @example
 * ```typescript
 * const cleanup = createTimeout(1000, () => {
 *   console.log('Timeout completed');
 * });
 *
 * // Cancel the timeout before it completes
 * cleanup();
 * ```
 */
export function createTimeout(ms: number, callback: () => void): CleanupTimer {
  const timeoutId = setTimeout(callback, ms);
  let isCleaned = false;

  return () => {
    if (isCleaned) return;

    clearTimeout(timeoutId);

    isCleaned = true;
  };
}

/**
 * Creates an interval with automatic cleanup capability.
 *
 * Returns a cleanup function that can be called to cancel the interval.
 * The cleanup function is idempotent - calling it multiple times is safe.
 *
 * @param ms - The interval duration in milliseconds
 * @param callback - The function to execute on each interval tick
 * @returns A cleanup function that cancels the interval when called
 *
 * @example
 * ```typescript
 * const cleanup = createInterval(1000, () => {
 *   console.log('Interval tick');
 * });
 *
 * // Stop the interval
 * cleanup();
 * ```
 */
export function createInterval(ms: number, callback: () => void): CleanupTimer {
  const intervalId = setInterval(callback, ms);
  let isCleaned = false;

  return () => {
    if (isCleaned) return;

    clearInterval(intervalId);

    isCleaned = true;
  };
}

/**
 * Creates a timeout that prevents concurrent executions.
 *
 * Each call to the `call` function will cancel any previous pending timeout
 * and start a new one. This is useful for debouncing or ensuring only the
 * last call executes after a delay.
 *
 * @param ms - The timeout duration in milliseconds
 * @param callback - The function to execute when the timeout completes
 * @returns An object with `call` to trigger the timeout and `clean` to cancel it
 *
 * @example
 * ```typescript
 * const { call, clean } = createDebouncedTimeout(1000, () => {
 *   console.log('Only the last call executes');
 * });
 *
 * call(); // This will be cancelled
 * call(); // This will be cancelled
 * call(); // Only this one will execute after 1000ms
 *
 * // Or cancel all pending timeouts
 * clean();
 * ```
 */
export function createDebouncedTimeout(
  ms: number,
  callback: () => void,
): { call: () => void; clean: CleanupTimer } {
  let cleanupTimer: CleanupTimer | null = null;

  return {
    clean: () => {
      cleanupTimer?.();
    },
    call: () => {
      cleanupTimer?.();

      cleanupTimer = createTimeout(ms, () => {
        callback();
      });
    },
  };
}

/**
 * Creates a timeout that waits for a condition to become true.
 *
 * Polls the condition function at regular intervals until it returns a truthy value,
 * then calls the callback with that value. If the condition doesn't become true
 * within the maximum wait time, the timeout expires without calling the callback.
 *
 * @template T - The type of value returned by the condition function when true
 * @param options - Configuration options
 * @param options.condition - Function that returns false or a truthy value when the condition is met
 * @param options.maxWaitMs - Maximum time to wait for the condition in milliseconds
 * @param options.callback - Function to call when the condition becomes true
 * @param options.checkIntervalMs - How often to check the condition in milliseconds (default: 20)
 * @returns A cleanup function that cancels the condition timeout
 *
 * @example
 * ```typescript
 * const cleanup = createWaitUntil({
 *   condition: () => document.getElementById('myElement'),
 *   maxWaitMs: 5000,
 *   callback: (element) => {
 *     console.log('Element found:', element);
 *   },
 *   checkIntervalMs: 50
 * });
 *
 * // Cancel the condition check
 * cleanup();
 * ```
 */
export function createWaitUntil<T extends NonNullable<unknown>>({
  condition,
  maxWaitMs,
  callback,
  checkIntervalMs = 20,
}: {
  condition: () => false | T;
  maxWaitMs: number;
  callback: (value: T) => void;
  checkIntervalMs?: number;
}): CleanupTimer {
  let cleanCheckTimeout: CleanupTimer | null = null;
  let cleanMaxWaitTimeout: CleanupTimer | null = null;

  cleanMaxWaitTimeout = createTimeout(maxWaitMs, () => {
    cleanCheckTimeout?.();
  });

  function check() {
    const result = condition();
    if (result) {
      cleanMaxWaitTimeout?.();
      callback(result);
    } else {
      cleanCheckTimeout = createTimeout(checkIntervalMs, check);
    }
  }

  check();

  return () => {
    cleanMaxWaitTimeout?.();
    cleanCheckTimeout?.();
  };
}
