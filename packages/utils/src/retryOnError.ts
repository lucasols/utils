import { unknownToError, type Result, type ResultValidErrors } from 't-result';
import { sleep } from './sleep';

/** Configuration options for retryOnError function. */
type RetryOptions = {
  /** Delay between retries in milliseconds or function returning delay */
  delayBetweenRetriesMs?: number | ((retry: number) => number);
  /**
   * Function to determine if retry should happen, receives error and duration
   * of last attempt
   */
  retryCondition?: (
    error: Error,
    lastAttempt: { duration: number; retry: number },
  ) => boolean;
  /** Optional ID for debug logging */
  debugId?: string;
  /** Disable retries */
  disableRetries?: boolean;
  /** Function to call when retry happens */
  onRetry?: (
    error: Error,
    lastAttempt: { duration: number; retry: number },
  ) => void;
  /**
   * Cancels the pending retries: no retry starts after the signal is aborted
   * and a pending delay between retries ends early. The function then rejects
   * with the error of the last attempt.
   */
  signal?: AbortSignal;
};

function waitForRetryDelay(
  ms: number,
  signal: AbortSignal | undefined,
): Promise<unknown> {
  if (!signal) return sleep(ms);

  return new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    function onAbort() {
      clearTimeout(timeout);
      resolve();
    }

    signal.addEventListener('abort', onAbort, { once: true });
  });
}

/**
 * Retries a function on error with configurable retry logic.
 *
 * @example
 *   await retryOnError(
 *     async (ctx) => {
 *       console.log(`Attempt ${ctx.retry + 1}`);
 *       return await fetchData();
 *     },
 *     3,
 *     { delayBetweenRetriesMs: 1000 },
 *   );
 *
 * @param fn - Function to retry that receives context with retry count
 * @param maxRetries - Maximum number of retries
 * @param options - Configuration options
 * @param retry - Internal use only
 * @param originalMaxRetries - Internal use only
 * @returns Promise resolving to the function result or rejecting with the final
 *   error
 */
export async function retryOnError<T>(
  fn: (ctx: {
    /** Current retry count, (0 for first attempt) */
    retry: number;
  }) => Promise<T>,
  maxRetries: number,
  options: RetryOptions = {},
  retry = 0,
  originalMaxRetries = maxRetries,
): Promise<T> {
  const {
    delayBetweenRetriesMs,
    retryCondition,
    disableRetries,
    onRetry,
    signal,
  } = options;

  if (options.debugId) {
    if (retry > 0) {
      console.info(
        `Retrying ${options.debugId} (retry ${retry}/${originalMaxRetries}) after error`,
      );
    }
  }

  const startTime = Date.now();

  try {
    return await fn({ retry });
  } catch (error) {
    if (maxRetries > 0 && !disableRetries && !signal?.aborted) {
      const errorDuration = Date.now() - startTime;

      const normalizedError = unknownToError(error);

      const shouldRetry =
        retryCondition ?
          retryCondition(normalizedError, {
            duration: errorDuration,
            retry,
          })
        : true;

      if (!shouldRetry) {
        throw normalizedError;
      }

      if (onRetry) {
        onRetry(normalizedError, {
          duration: errorDuration,
          retry,
        });
      }

      if (delayBetweenRetriesMs) {
        await waitForRetryDelay(
          typeof delayBetweenRetriesMs === 'function' ?
            delayBetweenRetriesMs(retry)
          : delayBetweenRetriesMs,
          signal,
        );

        if (signal?.aborted) {
          throw normalizedError;
        }
      }

      return retryOnError(
        fn,
        maxRetries - 1,
        options,
        retry + 1,
        originalMaxRetries,
      );
    } else {
      throw error;
    }
  }
}

/**
 * Retries a result function on error with configurable retry logic.
 *
 * @param fn - Function to retry that receives context with retry count
 * @param maxRetries - Maximum number of retries
 * @param options - Configuration options
 * @param options.delayBetweenRetriesMs
 * @param options.retryCondition
 * @param options.debugId
 * @param options.disableRetries
 * @param options.onRetry
 * @param options.signal - Cancels the pending retries, the last error result is
 *   returned
 * @param __retry - Internal use only
 * @param __originalMaxRetries - Internal use only
 * @returns Promise resolving to the function result or rejecting with the final
 *   error
 */
export async function retryResultOnError<T, E extends ResultValidErrors>(
  fn: (ctx: {
    /** Current retry count, (0 for first attempt) */
    retry: number;
  }) => Promise<Result<T, E>>,
  maxRetries: number,
  options: {
    delayBetweenRetriesMs?: number | ((retry: number) => number);
    retryCondition?: (
      error: E,
      lastAttempt: { duration: number; retry: number },
    ) => boolean;
    debugId?: string;
    disableRetries?: boolean;
    onRetry?: (
      error: E,
      lastAttempt: { duration: number; retry: number },
    ) => void;
    signal?: AbortSignal;
  } = {},
  __retry = 0,
  __originalMaxRetries = maxRetries,
): Promise<Result<T, E>> {
  const { delayBetweenRetriesMs, retryCondition, onRetry, signal } = options;

  if (options.debugId) {
    if (__retry > 0) {
      console.info(
        `Retrying ${options.debugId} (retry ${__retry}/${__originalMaxRetries}) after error`,
      );
    }
  }

  const startTime = Date.now();

  const result = await fn({ retry: __retry });

  if (result.ok) {
    return result;
  }

  if (maxRetries > 0 && !options.disableRetries && !signal?.aborted) {
    const errorDuration = Date.now() - startTime;

    const shouldRetry =
      retryCondition ?
        retryCondition(result.error, {
          duration: errorDuration,
          retry: __retry,
        })
      : true;

    if (!shouldRetry) {
      return result;
    }

    if (onRetry) {
      onRetry(result.error, {
        duration: errorDuration,
        retry: __retry,
      });
    }

    if (delayBetweenRetriesMs) {
      await waitForRetryDelay(
        typeof delayBetweenRetriesMs === 'function' ?
          delayBetweenRetriesMs(__retry)
        : delayBetweenRetriesMs,
        signal,
      );

      if (signal?.aborted) {
        return result;
      }
    }

    return retryResultOnError(
      fn,
      maxRetries - 1,
      options,
      __retry + 1,
      __originalMaxRetries,
    );
  } else {
    return result;
  }
}
