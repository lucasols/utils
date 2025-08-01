import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { awaitDebounce } from './awaitDebounce';
import { sleep } from './sleep';

describe('awaitDebounce', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should resolve with "continue" after debounce delay', async () => {
    const promise = awaitDebounce({ callId: 'test', debounce: 50 });

    await sleep(60);

    const result = await promise;
    expect(result).toBe('continue');
  });

  it('should resolve previous calls with "skip" when new call is made', async () => {
    const promise1 = awaitDebounce({ callId: 'test', debounce: 50 });
    const promise2 = awaitDebounce({ callId: 'test', debounce: 50 });

    const result1 = await promise1;
    expect(result1).toBe('skip');

    await sleep(60);
    const result2 = await promise2;
    expect(result2).toBe('continue');
  });

  it('should handle multiple sequential calls with same callId', async () => {
    const results: ('continue' | 'skip')[] = [];

    const promise1 = awaitDebounce({ callId: 'test', debounce: 50 });
    promise1.then((result) => results.push(result));

    const promise2 = awaitDebounce({ callId: 'test', debounce: 50 });
    promise2.then((result) => results.push(result));

    const promise3 = awaitDebounce({ callId: 'test', debounce: 50 });
    promise3.then((result) => results.push(result));

    // Wait for immediate skip resolutions
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(results).toEqual(['skip', 'skip']);

    await sleep(60);
    await promise3;

    expect(results).toEqual(['skip', 'skip', 'continue']);
  });

  it('should handle different callIds independently', async () => {
    const promise1 = awaitDebounce({ callId: 'test1', debounce: 50 });
    const promise2 = awaitDebounce({ callId: 'test2', debounce: 50 });

    await sleep(60);

    const [result1, result2] = await Promise.all([promise1, promise2]);
    expect(result1).toBe('continue');
    expect(result2).toBe('continue');
  });

  it('should work with complex callId types', async () => {
    const promise1 = awaitDebounce({ callId: ['user', 123], debounce: 50 });
    const promise2 = awaitDebounce({
      callId: { type: 'search', query: 'test' },
      debounce: 50,
    });

    await sleep(60);

    const [result1, result2] = await Promise.all([promise1, promise2]);
    expect(result1).toBe('continue');
    expect(result2).toBe('continue');
  });

  it('should treat equivalent complex callIds as the same', async () => {
    const promise1 = awaitDebounce({ callId: ['user', 123], debounce: 50 });
    const promise2 = awaitDebounce({ callId: ['user', 123], debounce: 50 });

    const result1 = await promise1;
    expect(result1).toBe('skip');

    await sleep(60);
    const result2 = await promise2;
    expect(result2).toBe('continue');
  });

  it('should reset debounce timer on subsequent calls', async () => {
    const promise1 = awaitDebounce({ callId: 'test', debounce: 80 });

    await sleep(30);

    const promise2 = awaitDebounce({ callId: 'test', debounce: 80 });

    const result1 = await promise1;
    expect(result1).toBe('skip');

    // Should need full 80ms from the second call
    await sleep(40);
    // Not resolved yet
    let resolved = false;
    promise2.then(() => {
      resolved = true;
    });
    await Promise.resolve();
    expect(resolved).toBe(false);

    await sleep(50);
    const result2 = await promise2;
    expect(result2).toBe('continue');
  });

  it('should handle string, number, and boolean callIds', async () => {
    const stringPromise = awaitDebounce({ callId: 'string-id', debounce: 50 });
    const numberPromise = awaitDebounce({ callId: 42, debounce: 50 });
    const booleanPromise = awaitDebounce({ callId: true, debounce: 50 });

    await sleep(60);

    const [stringResult, numberResult, booleanResult] = await Promise.all([
      stringPromise,
      numberPromise,
      booleanPromise,
    ]);

    expect(stringResult).toBe('continue');
    expect(numberResult).toBe('continue');
    expect(booleanResult).toBe('continue');
  });

  it('should handle null and undefined callIds', async () => {
    const nullPromise = awaitDebounce({ callId: null, debounce: 50 });
    const undefinedPromise = awaitDebounce({ callId: undefined, debounce: 50 });

    await sleep(60);

    const [nullResult, undefinedResult] = await Promise.all([
      nullPromise,
      undefinedPromise,
    ]);

    expect(nullResult).toBe('continue');
    expect(undefinedResult).toBe('continue');
  });

  it('should work with zero debounce time', async () => {
    const promise = awaitDebounce({ callId: 'test', debounce: 0 });

    await sleep(10);

    const result = await promise;
    expect(result).toBe('continue');
  });

  it('should handle rapid fire calls correctly', async () => {
    const results: ('continue' | 'skip')[] = [];
    const promises: Promise<'continue' | 'skip'>[] = [];

    // Create 10 rapid calls
    for (let i = 0; i < 10; i++) {
      const promise = awaitDebounce({ callId: 'rapid', debounce: 50 });
      promises.push(promise);
      promise.then((result) => results.push(result));
    }

    // Allow all skip resolutions to process
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));

    // First 9 should be skip
    expect(results.filter((r) => r === 'skip')).toHaveLength(9);
    expect(results.filter((r) => r === 'continue')).toHaveLength(0);

    await sleep(60);
    await Promise.all(promises);

    // Only the last one should continue
    expect(results.filter((r) => r === 'skip')).toHaveLength(9);
    expect(results.filter((r) => r === 'continue')).toHaveLength(1);
  });
});
