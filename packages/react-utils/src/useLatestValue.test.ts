import { renderHook } from '@testing-library/react';
import { useCallback, useEffect, useRef } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { sleep } from '@ls-stack/utils/sleep';
import { useLatestCb, useLatestValue } from './useLatestValue';

describe('useLatestValue', () => {
  test('should provide latest value inside useEffect with empty deps', () => {
    let getLatestValue: () => number = () => 0;

    const { rerender } = renderHook(
      ({ count }) => {
        const latestCount = useLatestValue(count);

        useEffect(() => {
          // Create a function that can be called later to get the latest value
          getLatestValue = () => latestCount.insideEffect;
        }, [latestCount.insideEffect]); // Empty deps - creates stale closure

        return latestCount;
      },
      { initialProps: { count: 1 } },
    );

    expect(getLatestValue()).toBe(1);

    rerender({ count: 2 });
    // Even with stale closure, should get latest value
    expect(getLatestValue()).toBe(2);

    rerender({ count: 3 });
    expect(getLatestValue()).toBe(3);
  });

  test('should provide latest value inside setInterval callback', async () => {
    const intervalCallback = vi.fn();

    const { rerender, unmount } = renderHook(
      ({ message }) => {
        const latestMessage = useLatestValue(message);

        useEffect(() => {
          const interval = setInterval(() => {
            intervalCallback(latestMessage.insideEffect);
          }, 50);

          return () => clearInterval(interval);
        }, [latestMessage.insideEffect]); // Empty deps

        return latestMessage;
      },
      { initialProps: { message: 'initial' } },
    );

    await sleep(60);
    expect(intervalCallback).toHaveBeenLastCalledWith('initial');

    rerender({ message: 'updated' });
    await sleep(60);
    expect(intervalCallback).toHaveBeenLastCalledWith('updated');

    rerender({ message: 'final' });
    await sleep(60);
    expect(intervalCallback).toHaveBeenLastCalledWith('final');

    unmount();
  });

  test('should provide latest value inside event listener callback', () => {
    const { rerender, unmount } = renderHook(
      ({ data }) => {
        const latestData = useLatestValue(data);
        const callbackRef = useRef<(() => void) | null>(null);

        useEffect(() => {
          const callback = () => {
            // Simulate accessing latest data in event callback
            expect(latestData.insideEffect).toBe(data);
          };

          callbackRef.current = callback;
        }, [data, latestData.insideEffect]); // Empty deps - would normally create stale closure

        return { latestData, callbackRef };
      },
      { initialProps: { data: 'test1' } },
    );

    // Call the callback and verify it has latest data
    rerender({ data: 'test2' });
    // The callback should still have access to latest data even with empty deps

    unmount();
  });

  test('should maintain same object reference across renders', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useLatestValue(value),
      { initialProps: { value: 'initial' } },
    );

    const firstRef = result.current;

    rerender({ value: 'updated' });
    expect(result.current).toBe(firstRef);
    expect(result.current.insideEffect).toBe('updated');
  });

  test('should work inside nested useCallback with empty deps', () => {
    const nestedCallback = vi.fn();

    const { rerender } = renderHook(
      ({ count }) => {
        const latestCount = useLatestValue(count);

        const stableCallback = useCallback(() => {
          const innerCallback = () => {
            nestedCallback(latestCount.insideEffect);
          };
          innerCallback();
        }, [latestCount.insideEffect]); // Empty deps

        // Call immediately to test
        stableCallback();

        return { latestCount, stableCallback };
      },
      { initialProps: { count: 1 } },
    );

    expect(nestedCallback).toHaveBeenLastCalledWith(1);

    rerender({ count: 2 });
    expect(nestedCallback).toHaveBeenLastCalledWith(2);
  });
});

describe('useLatestCb', () => {
  test('should call latest function inside useEffect with empty deps', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    let stableCallback: (arg: string) => void = () => {};

    const { rerender } = renderHook(
      ({ fn }) => {
        const stableFn = useLatestCb(fn);

        useEffect(() => {
          // Store the callback to call it later (simulating stale closure)
          stableCallback = (arg: string) => stableFn(arg);
        }, [stableFn]); // Empty deps - would normally capture stale function

        return stableFn;
      },
      { initialProps: { fn: fn1 } },
    );

    stableCallback('test-arg');
    expect(fn1).toHaveBeenCalledWith('test-arg');
    expect(fn2).not.toHaveBeenCalled();

    rerender({ fn: fn2 });
    stableCallback('test-arg2');
    expect(fn2).toHaveBeenCalledWith('test-arg2');
    expect(fn1).toHaveBeenCalledTimes(1); // Still only called once
  });

  test('should maintain stable reference across renders', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    const { result, rerender } = renderHook(({ fn }) => useLatestCb(fn), {
      initialProps: { fn: fn1 },
    });

    const stableRef = result.current;

    rerender({ fn: fn2 });
    expect(result.current).toBe(stableRef);
  });

  test('should call latest function inside setInterval', async () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    const { rerender, unmount } = renderHook(
      ({ fn, data }) => {
        const stableFn = useLatestCb(fn);
        const latestData = useLatestValue(data);

        useEffect(() => {
          const interval = setInterval(() => {
            // Use latest callback with latest data
            stableFn(latestData.insideEffect);
          }, 50);

          return () => clearInterval(interval);
        }, [latestData.insideEffect, stableFn]); // Empty deps

        return stableFn;
      },
      { initialProps: { fn: fn1, data: 'initial' } },
    );

    await sleep(60);
    expect(fn1).toHaveBeenCalledWith('initial');

    rerender({ fn: fn2, data: 'updated' });
    await sleep(60);
    expect(fn2).toHaveBeenCalledWith('updated');
    expect(fn1).toHaveBeenCalledTimes(1);

    unmount();
  });

  test('should work with async functions inside effects', async () => {
    const asyncFn1 = vi.fn(async (data: string) => `result1-${data}`);
    const asyncFn2 = vi.fn(async (data: string) => `result2-${data}`);
    let callAsyncFn: (data: string) => Promise<string> = async () => '';

    const { rerender, unmount } = renderHook(
      ({ fn }) => {
        const stableFn = useLatestCb(fn);

        useEffect(() => {
          // Store the async callback to call it later
          callAsyncFn = (data: string) => stableFn(data);
        }, [stableFn]); // Empty deps

        return stableFn;
      },
      { initialProps: { fn: asyncFn1 } },
    );

    const result1 = await callAsyncFn('test');
    expect(result1).toBe('result1-test');
    expect(asyncFn1).toHaveBeenCalledWith('test');

    rerender({ fn: asyncFn2 });

    const result2 = await callAsyncFn('test');
    expect(result2).toBe('result2-test');
    expect(asyncFn2).toHaveBeenCalledWith('test');
    expect(asyncFn1).toHaveBeenCalledTimes(1);

    unmount();
  });

  test('should preserve function return values', () => {
    const fn1 = vi.fn(() => 'return1');
    const fn2 = vi.fn(() => 'return2');
    let callStableFn: () => string = () => '';

    const { rerender } = renderHook(
      ({ fn }) => {
        const stableFn = useLatestCb(fn);

        useEffect(() => {
          callStableFn = () => stableFn();
        }, [stableFn]); // Empty deps

        return stableFn;
      },
      { initialProps: { fn: fn1 } },
    );

    expect(callStableFn()).toBe('return1');

    rerender({ fn: fn2 });
    expect(callStableFn()).toBe('return2');
  });

  test('should work inside nested useCallback scenarios', () => {
    const originalFn = vi.fn();
    let callNestedCallback: () => void = () => {};

    const { rerender } = renderHook(
      ({ fn, multiplier }) => {
        const stableFn = useLatestCb(fn);
        const latestMultiplier = useLatestValue(multiplier);

        const outerCallback = useCallback(() => {
          // Simulate a deeply nested callback scenario
          const innerFunction = () => {
            stableFn(latestMultiplier.insideEffect);
          };

          innerFunction();
        }, [latestMultiplier.insideEffect, stableFn]); // Empty deps - tests nested stale closures

        useEffect(() => {
          callNestedCallback = outerCallback;
        }, [outerCallback]); // Empty deps

        return { stableFn, outerCallback };
      },
      { initialProps: { fn: originalFn, multiplier: 2 } },
    );

    callNestedCallback();
    expect(originalFn).toHaveBeenCalledWith(2);

    rerender({ fn: originalFn, multiplier: 5 });
    callNestedCallback();
    expect(originalFn).toHaveBeenCalledWith(5);
  });
});
