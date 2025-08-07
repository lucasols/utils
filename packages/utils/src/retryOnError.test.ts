import { expect, test, vi } from 'vitest';
import { retryOnError } from './retryOnError';
import { sleep } from './sleep';

test('does not retry when it does not fail', async () => {
  const fn = vi.fn(() => Promise.resolve('ok'));

  const result = await retryOnError((_ctx) => fn(), 1);

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

  const result = await retryOnError((_ctx) => fn(), 1);

  expect(result).toBe('ok');
  expect(fn).toHaveBeenCalledTimes(2);
});

test('retries when it fails and stops after max retries', async () => {
  const fn = vi.fn(() => Promise.reject(new Error('fail')));

  await expect(retryOnError((_ctx) => fn(), 3)).rejects.toThrow('fail');

  expect(fn).toHaveBeenCalledTimes(4);
});

test('passes context with retry count', async () => {
  const contexts: Array<{ retry: number }> = [];

  const fn = vi.fn((ctx: { retry: number }) => {
    contexts.push({ ...ctx });
    throw new Error(`attempt ${ctx.retry}`);
  });

  await expect(retryOnError(fn, 2)).rejects.toThrow('attempt 2');

  expect(contexts).toHaveLength(3);
  expect(contexts[0]).toEqual({ retry: 0 });
  expect(contexts[1]).toEqual({ retry: 1 });
  expect(contexts[2]).toEqual({ retry: 2 });
});

test('retry condition', async () => {
  const fn = vi.fn((error: 'fail' | 'error') =>
    Promise.reject(new Error(error)),
  );

  await expect(
    retryOnError((_ctx) => fn('fail'), 3, {
      retryCondition: (error) =>
        error instanceof Error ? error.message === 'fail' : false,
    }),
  ).rejects.toThrow('fail');

  expect(fn).toHaveBeenCalledTimes(4);

  await expect(
    retryOnError((_ctx) => fn('error'), 3, {
      retryCondition: (error) =>
        error instanceof Error ? error.message === 'fail' : false,
    }),
  ).rejects.toThrow('error');

  expect(fn).toHaveBeenCalledTimes(5);
});

test.concurrent('retry condition with attempt duration', async () => {
  const fn = vi.fn(async () => {
    await sleep(10);
    throw new Error('fail');
  });

  await expect(
    retryOnError((_ctx) => fn(), 3, {
      retryCondition: (_error, ctx) => ctx.duration < 5,
    }),
  ).rejects.toThrow('fail');

  expect(fn).toHaveBeenCalledTimes(1);
});

test.concurrent('delay between retries', { retry: 3 }, async () => {
  const fn = vi.fn(() => {
    throw new Error('fail');
  });

  const startTime = Date.now();

  await expect(
    retryOnError((_ctx) => fn(), 3, { delayBetweenRetriesMs: 5 }),
  ).rejects.toThrow('fail');

  expect(fn).toHaveBeenCalledTimes(4);

  expect(Date.now() - startTime).toBeGreaterThan(10);
});

test.concurrent('retry condition with duration and error', { retry: 3 }, async () => {
  const fn = vi.fn(async (maxErrorDurationMs: number) => {
    await sleep(10);
    throw new Error(String(maxErrorDurationMs));
  });

  await expect(
    retryOnError((_ctx) => fn(5), 3, {
      retryCondition: (error, ctx) =>
        error instanceof Error && ctx.duration < Number(error.message),
    }),
  ).rejects.toThrow('5');

  expect(fn).toHaveBeenCalledTimes(1);

  await expect(
    retryOnError((_ctx) => fn(20), 2, {
      retryCondition: (error, ctx) =>
        error instanceof Error && ctx.duration < Number(error.message),
    }),
  ).rejects.toThrow('20');

  expect(fn).toHaveBeenCalledTimes(4);
});

test('maxRetries of 0 should not retry', async () => {
  const fn = vi.fn(() => Promise.reject(new Error('fail')));

  await expect(retryOnError((_ctx) => fn(), 0)).rejects.toThrow('fail');

  expect(fn).toHaveBeenCalledTimes(1);
});


test('delayBetweenRetriesMs as function', { retry: 3 }, async () => {
  const fn = vi.fn(() => Promise.reject(new Error('fail')));
  const delayFn = vi.fn((retry: number) => retry * 10);
  
  const startTime = Date.now();

  await expect(
    retryOnError((_ctx) => fn(), 2, { 
      delayBetweenRetriesMs: delayFn 
    }),
  ).rejects.toThrow('fail');

  expect(fn).toHaveBeenCalledTimes(3);
  expect(delayFn).toHaveBeenCalledWith(0);
  expect(delayFn).toHaveBeenCalledWith(1);
  expect(Date.now() - startTime).toBeGreaterThan(10); // 0 + 10 = 10ms minimum
});


test('debug logging with debugId', async () => {
  const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
  
  try {
    const fn = vi.fn(() => Promise.reject(new Error('fail')));

    await expect(
      retryOnError((_ctx) => fn(), 2, { debugId: 'test-operation' }),
    ).rejects.toThrow('fail');

    expect(consoleSpy).toHaveBeenCalledWith('Retrying test-operation (retry 1/2) after error');
    expect(consoleSpy).toHaveBeenCalledWith('Retrying test-operation (retry 2/2) after error');
    expect(consoleSpy).toHaveBeenCalledTimes(2);
  } finally {
    consoleSpy.mockRestore();
  }
});




test('retryCondition with changing behavior', async () => {
  const fn = vi.fn(() => Promise.reject(new Error('fail')));
  let conditionCallCount = 0;
  const retryCondition = vi.fn(() => {
    conditionCallCount++;
    return conditionCallCount <= 2; // Allow first 2 retries, then stop
  });

  await expect(
    retryOnError((_ctx) => fn(), 5, { retryCondition }),
  ).rejects.toThrow('fail');

  expect(fn).toHaveBeenCalledTimes(3); // original + 2 retries
  expect(retryCondition).toHaveBeenCalledTimes(3);
});



test('success after retries', async () => {
  let attemptCount = 0;
  const fn = vi.fn(() => {
    attemptCount++;
    if (attemptCount < 3) {
      throw new Error(`fail-${attemptCount}`);
    }
    return Promise.resolve('success');
  });

  const result = await retryOnError((_ctx) => fn(), 3);

  expect(result).toBe('success');
  expect(fn).toHaveBeenCalledTimes(3);
});

test('retryCondition receives correct context', async () => {
  const fn = vi.fn(async () => {
    await sleep(10);
    throw new Error('fail');
  });

  const retryConditions: Array<{ error: unknown; ctx: { duration: number; retry: number } }> = [];
  const retryCondition = vi.fn((error: unknown, ctx: { duration: number; retry: number }) => {
    retryConditions.push({ error, ctx });
    return ctx.retry < 2;
  });

  await expect(
    retryOnError((_ctx) => fn(), 5, { retryCondition }),
  ).rejects.toThrow('fail');

  expect(retryConditions).toHaveLength(3);
  expect(retryConditions[0]?.ctx.retry).toBe(0);
  expect(retryConditions[1]?.ctx.retry).toBe(1);
  expect(retryConditions[2]?.ctx.retry).toBe(2);
  
  // All should have reasonable durations
  for (const { ctx } of retryConditions) {
    expect(ctx.duration).toBeGreaterThan(5);
    expect(ctx.duration).toBeLessThan(100);
  }
});
