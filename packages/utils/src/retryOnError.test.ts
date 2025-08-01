import { expect, test, vi } from 'vitest';
import { retryOnError } from './retryOnError';
import { sleep } from './sleep';

test('does not retry when it does not fail', async () => {
  const fn = vi.fn(() => Promise.resolve('ok'));

  const result = await retryOnError(() => fn(), 1);

  expect(result).toBe('ok');
  expect(fn).toHaveBeenCalledTimes(1);
});

test('retries when it fails', async () => {
  let shouldFail = true;

  const fn = vi.fn(async () => {
    if (shouldFail) {
      shouldFail = false;
      throw new Error('fail');
    } else {
      return Promise.resolve('ok');
    }
  });

  const result = await retryOnError(() => fn(), 1);

  expect(result).toBe('ok');
  expect(fn).toHaveBeenCalledTimes(2);
});

test('retries when it fails and stops after max retries', async () => {
  const fn = vi.fn(() => Promise.reject(new Error('fail')));

  await expect(retryOnError(() => fn(), 3)).rejects.toThrow('fail');

  expect(fn).toHaveBeenCalledTimes(4);
});

test('retry condition', async () => {
  const fn = vi.fn((error: 'fail' | 'error') =>
    Promise.reject(new Error(error)),
  );

  await expect(
    retryOnError(() => fn('fail'), 3, {
      retryCondition: (error) =>
        error instanceof Error ? error.message === 'fail' : false,
    }),
  ).rejects.toThrow('fail');

  expect(fn).toHaveBeenCalledTimes(4);

  await expect(
    retryOnError(() => fn('error'), 3, {
      retryCondition: (error) =>
        error instanceof Error ? error.message === 'fail' : false,
    }),
  ).rejects.toThrow('error');

  expect(fn).toHaveBeenCalledTimes(5);
});

test.concurrent('max error duration', async () => {
  const fn = vi.fn(async () => {
    await sleep(10);
    throw new Error('fail');
  });

  await expect(
    retryOnError(() => fn(), 3, { maxErrorDurationMs: 5 }),
  ).rejects.toThrow('fail');

  expect(fn).toHaveBeenCalledTimes(1);
});

test.concurrent('delay between retries', { retry: 3 }, async () => {
  const fn = vi.fn(() => {
    throw new Error('fail');
  });

  const startTime = Date.now();

  await expect(
    retryOnError(() => fn(), 3, { delayBetweenRetriesMs: 5 }),
  ).rejects.toThrow('fail');

  expect(fn).toHaveBeenCalledTimes(4);

  expect(Date.now() - startTime).toBeGreaterThan(10);
});

test.concurrent('conditional max error duration', { retry: 3 }, async () => {
  const fn = vi.fn(async (maxErrorDurationMs: number) => {
    await sleep(10);
    throw new Error(String(maxErrorDurationMs));
  });

  await expect(
    retryOnError(() => fn(5), 3, {
      retryCondition: (error) =>
        error instanceof Error ?
          { maxErrorDurationMs: Number(error.message) }
        : false,
    }),
  ).rejects.toThrow('5');

  expect(fn).toHaveBeenCalledTimes(1);

  await expect(
    retryOnError(() => fn(20), 2, {
      retryCondition: (error) =>
        error instanceof Error ?
          { maxErrorDurationMs: Number(error.message) }
        : false,
    }),
  ).rejects.toThrow('20');

  expect(fn).toHaveBeenCalledTimes(4);
});
