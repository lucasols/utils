import { Result } from 't-result';
import { defer } from './promiseUtils';

export type CleanupTimer = () => void;

/**
 * Creates a timeout with automatic cleanup capability.
 *
 * Returns a cleanup function that can be called to cancel the timeout. The
 * cleanup function is idempotent - calling it multiple times is safe.
 *
 * @example
 *   ```typescript
 *   const cleanup = createTimeout(1000, () => {
 *     console.log('Timeout completed');
 *   });
 *
 *   // Cancel the timeout before it completes
 *   cleanup();
 *   ```;
 *
 * @param ms - The timeout duration in milliseconds
 * @param callback - The function to execute when the timeout completes
 * @returns A cleanup function that cancels the timeout when called
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
 * Returns a cleanup function that can be called to cancel the interval. The
 * cleanup function is idempotent - calling it multiple times is safe.
 *
 * @example
 *   ```typescript
 *   const cleanup = createInterval(1000, () => {
 *     console.log('Interval tick');
 *   });
 *
 *   // Stop the interval
 *   cleanup();
 *   ```;
 *
 * @param ms - The interval duration in milliseconds
 * @param callback - The function to execute on each interval tick
 * @returns A cleanup function that cancels the interval when called
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
 * Each call to the `call` function will cancel any previous pending timeout and
 * start a new one. This is useful for debouncing or ensuring only the last call
 * executes after a delay.
 *
 * @example
 *   ```typescript
 *   const { call, clean } = createDebouncedTimeout(1000, () => {
 *     console.log('Only the last call executes');
 *   });
 *
 *   call(); // This will be cancelled
 *   call(); // This will be cancelled
 *   call(); // Only this one will execute after 1000ms
 *
 *   // Or cancel all pending timeouts
 *   clean();
 *   ```;
 *
 * @param ms - The timeout duration in milliseconds
 * @param callback - The function to execute when the timeout completes
 * @returns An object with `call` to trigger the timeout and `clean` to cancel
 *   it
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
 * Polls the condition function at regular intervals until it returns a truthy
 * value, then calls the callback with that value. If the condition doesn't
 * become true within the maximum wait time, the timeout expires without calling
 * the callback.
 *
 * @example
 *   ```typescript
 *   const cleanup = createWaitUntil({
 *     condition: () => document.getElementById('myElement'),
 *     maxWaitMs: 5000,
 *     callback: (element) => {
 *       console.log('Element found:', element);
 *     },
 *     checkIntervalMs: 50
 *   });
 *
 *   // Cancel the condition check
 *   cleanup();
 *   ```;
 *
 * @template T - The type of value returned by the condition function when true
 * @param options - Configuration options
 * @param options.condition - Function that returns false or a truthy value when
 *   the condition is met
 * @param options.maxWaitMs - Maximum time to wait for the condition in
 *   milliseconds
 * @param options.callback - Function to call when the condition becomes true
 * @param options.checkIntervalMs - How often to check the condition in
 *   milliseconds (default: 20)
 * @returns A cleanup function that cancels the condition timeout
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
    cleanMaxWaitTimeout();
    cleanCheckTimeout?.();
  };
}

export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  { polling, timeout }: { polling: number | 'raf'; timeout: number },
): Promise<Result<void, Error>> {
  const { promise, resolve } = defer<Result<void, Error>>();

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let rafId: number | null = null;
  let isResolved = false;

  function cleanup() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (rafId && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function resolveWith(result: Result<void, Error>) {
    if (isResolved) return;
    isResolved = true;
    cleanup();
    resolve(result);
  }

  async function checkCondition() {
    try {
      const result = condition();
      const conditionMet = result instanceof Promise ? await result : result;
      if (conditionMet) {
        resolveWith(Result.ok(undefined));
        return true;
      }
      return false;
    } catch (error) {
      resolveWith(Result.err(new Error(`Condition check failed: ${error}`)));
      return true;
    }
  }

  // Check condition immediately
  checkCondition().then((resolved) => {
    if (resolved) {
      return;
    }

    // Set up timeout
    timeoutId = setTimeout(() => {
      resolveWith(
        Result.err(
          new Error(
            `Timeout of ${timeout}ms exceeded while waiting for condition`,
          ),
        ),
      );
    }, timeout);

    // Set up polling
    if (polling === 'raf') {
      if (typeof requestAnimationFrame === 'undefined') {
        resolveWith(
          Result.err(
            new Error(
              'requestAnimationFrame is not available in this environment',
            ),
          ),
        );
        return;
      }

      function rafCheck() {
        if (isResolved) return;
        checkCondition().then((conditionResolved) => {
          if (!conditionResolved && !isResolved) {
            rafId = requestAnimationFrame(rafCheck);
          }
        }).catch(() => {
          // Error handling is already done in checkCondition
        });
      }
      rafId = requestAnimationFrame(rafCheck);
    } else {
      intervalId = setInterval(() => {
        checkCondition().catch(() => {
          // Error handling is already done in checkCondition
        });
      }, polling);
    }
  }).catch(() => {
    // Error handling is already done in checkCondition
  });

  return promise;
}
