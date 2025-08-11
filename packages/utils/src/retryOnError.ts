import { unknownToError, type Result, type ResultValidErrors } from 't-result';
import { sleep } from './sleep';

/**
 * Configuration options for retryOnError function.
 */
type RetryOptions = {
  /** Delay between retries in milliseconds or function returning delay */
  delayBetweenRetriesMs?: number | ((retry: number) => number);
  /** Function to determine if retry should happen, receives error and duration of last attempt */
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
};

/**
 * Retries a function on error with configurable retry logic.
 *
 * @param fn - Function to retry that receives context with retry count
 * @param maxRetries - Maximum number of retries
 * @param options - Configuration options
 * @param retry - internal use only
 * @param originalMaxRetries - internal use only
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
  const { delayBetweenRetriesMs, retryCondition, disableRetries, onRetry } =
    options;

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
    if (maxRetries > 0 && !disableRetries) {
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
 * @param __retry - internal use only
 * @param __originalMaxRetries - internal use only
 * @returns Promise resolving to the function result or rejecting with the final error
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
  } = {},
  __retry = 0,
  __originalMaxRetries = maxRetries,
): Promise<Result<T, E>> {
  const { delayBetweenRetriesMs, retryCondition, onRetry } = options;

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

  if (maxRetries > 0 && !options.disableRetries) {
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
      await sleep(
        typeof delayBetweenRetriesMs === 'function' ?
          delayBetweenRetriesMs(__retry)
        : delayBetweenRetriesMs,
      );
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
