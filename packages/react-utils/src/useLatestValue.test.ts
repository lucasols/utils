import { sleep } from '@ls-stack/utils/sleep';
import { renderHook } from '@testing-library/react';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { useLatestCb } from './useLatestValue';

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
        const dataRef = useRef(data);

        useLayoutEffect(() => {
          dataRef.current = data;
        });

        useEffect(() => {
          const interval = setInterval(() => {
            // Use latest callback with latest data
            stableFn(dataRef.current);
          }, 50);

          return () => clearInterval(interval);
        }, [stableFn]);

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
        const multiplierRef = useRef(multiplier);

        useLayoutEffect(() => {
          multiplierRef.current = multiplier;
        });

        const outerCallback = useCallback(() => {
          // Simulate a deeply nested callback scenario
          const innerFunction = () => {
            stableFn(multiplierRef.current);
          };

          innerFunction();
        }, [stableFn]); // tests nested stale closures

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
