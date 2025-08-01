import { sleep } from './sleep';

export async function retryOnError<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  options: {
    delayBetweenRetriesMs?: number | ((retry: number) => number);
    retryCondition?: (
      error: unknown,
    ) => boolean | { maxErrorDurationMs: number };
    maxErrorDurationMs?: number;
    debugId?: string;
  } = {},
  retry = 0,
): Promise<T> {
  const {
    delayBetweenRetriesMs,
    retryCondition,
    maxErrorDurationMs = 400,
  } = options;

  if (options.debugId) {
    if (retry > 0) {
      console.info(
        `Retrying ${options.debugId} (retry ${retry}/${maxRetries}) after error`,
      );
    }
  }

  const startTime = Date.now();

  try {
    return await fn();
  } catch (error) {
    if (maxRetries > 0) {
      const errorDuration = Date.now() - startTime;

      const shouldRetry = retryCondition ? retryCondition(error) : true;

      let maxErrorDurationMsToUse = maxErrorDurationMs;

      if (typeof shouldRetry === 'boolean') {
        if (!shouldRetry) throw error;
      } else {
        maxErrorDurationMsToUse = shouldRetry.maxErrorDurationMs;
      }

      if (errorDuration > maxErrorDurationMsToUse) {
        throw error;
      }

      if (delayBetweenRetriesMs) {
        await sleep(
          typeof delayBetweenRetriesMs === 'function' ?
            delayBetweenRetriesMs(retry)
          : delayBetweenRetriesMs,
        );
      }

      return retryOnError(fn, maxRetries - 1, options, retry + 1);
    } else {
      throw error;
    }
  }
}
