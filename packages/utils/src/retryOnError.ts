import { sleep } from './sleep';

/**
 * Configuration options for retryOnError function.
 */
type RetryOptions = {
  /** Delay between retries in milliseconds or function returning delay */
  delayBetweenRetriesMs?: number | ((retry: number) => number);
  /** Function to determine if retry should happen, receives error and duration of last attempt */
  retryCondition?: (
    error: unknown,
    lastAttempt: { duration: number; retry: number },
  ) => boolean;
  /** Optional ID for debug logging */
  debugId?: string;
};

/**
 * Retries a function on error with configurable retry logic.
 *
 * @param fn - Function to retry that receives context with retry count
 * @param maxRetries - Maximum number of retries
 * @param options - Configuration options
 * @param retry
 * @param originalMaxRetries
 * @returns Promise resolving to the function result or rejecting with the final error
 *
 * @example
 * await retryOnError(
 *   async (ctx) => {
 *     console.log(`Attempt ${ctx.retry + 1}`);
 *     return await fetchData();
 *   },
 *   3,
 *   { delayBetweenRetriesMs: 1000 }
 * );
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
  const { delayBetweenRetriesMs, retryCondition } = options;

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
    if (maxRetries > 0) {
      const errorDuration = Date.now() - startTime;

      const shouldRetry =
        retryCondition ?
          retryCondition(error, { duration: errorDuration, retry })
        : true;

      if (!shouldRetry) {
        throw error;
      }

      if (delayBetweenRetriesMs) {
        await sleep(
          typeof delayBetweenRetriesMs === 'function' ?
            delayBetweenRetriesMs(retry)
          : delayBetweenRetriesMs,
        );
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
