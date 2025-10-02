import { renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { sleep } from '@ls-stack/utils/sleep';
import { useDebouncedCallback } from './useDebouncedCallback';

describe('useDebouncedCallback', () => {
  test('should debounce callback execution', async () => {
    const callback = vi.fn();

    const { result } = renderHook(() => useDebouncedCallback(callback, 100));

    result.current('arg1');
    result.current('arg2');
    result.current('arg3');

    expect(callback).not.toHaveBeenCalled();

    await sleep(110);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('arg3');
  });

  test('should update callback when it changes', async () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { result, rerender } = renderHook(
      ({ cb }) => useDebouncedCallback(cb, 100),
      { initialProps: { cb: callback1 } },
    );

    result.current('test1');

    rerender({ cb: callback2 });

    await sleep(110);

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledWith('test1');
  });

  test('should maintain stable reference across renders', () => {
    const callback = vi.fn();

    const { result, rerender } = renderHook(
      ({ cb }) => useDebouncedCallback(cb, 100),
      { initialProps: { cb: callback } },
    );

    const firstRef = result.current;

    rerender({ cb: vi.fn() });

    expect(result.current).toBe(firstRef);
  });

  test('should support leading option', async () => {
    const callback = vi.fn();

    const { result } = renderHook(() =>
      useDebouncedCallback(callback, 100, { leading: true, trailing: false }),
    );

    result.current('first');
    expect(callback).toHaveBeenCalledWith('first');

    result.current('second');
    result.current('third');

    await sleep(110);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should support cancel', async () => {
    const callback = vi.fn();

    const { result } = renderHook(() => useDebouncedCallback(callback, 100));

    result.current('test');
    result.current.cancel();

    await sleep(110);

    expect(callback).not.toHaveBeenCalled();
  });

  test('should support flush', () => {
    const callback = vi.fn();

    const { result } = renderHook(() => useDebouncedCallback(callback, 100));

    result.current('test');
    result.current.flush();

    expect(callback).toHaveBeenCalledWith('test');
  });

  test('should support pending', async () => {
    const callback = vi.fn();

    const { result } = renderHook(() => useDebouncedCallback(callback, 100));

    expect(result.current.pending()).toBe(false);

    result.current('test');
    expect(result.current.pending()).toBe(true);

    await sleep(110);
    expect(result.current.pending()).toBe(false);
  });

  test('should work with maxWait option', async () => {
    const callback = vi.fn();

    const { result } = renderHook(() =>
      useDebouncedCallback(callback, 100, { maxWait: 150 }),
    );

    result.current('first');
    await sleep(60);

    result.current('second');
    await sleep(60);

    result.current('third');
    await sleep(60);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('third');

    await sleep(110);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should update debounce wait on rerender', async () => {
    const callback = vi.fn();

    const { result, rerender } = renderHook(
      ({ wait }) => useDebouncedCallback(callback, wait),
      { initialProps: { wait: 100 } },
    );

    result.current('value');
    await sleep(60);
    expect(callback).not.toHaveBeenCalled();

    rerender({ wait: 10 });

    await sleep(20);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('value');
  });

  test('should update debounce options on rerender', async () => {
    const callback = vi.fn();

    const { result, rerender } = renderHook(
      ({ opts }) => useDebouncedCallback(callback, 50, opts),
      { initialProps: { opts: { leading: true, trailing: false } } },
    );

    result.current('first');
    expect(callback).toHaveBeenCalledTimes(1);

    rerender({ opts: { leading: false, trailing: true } });

    result.current('second');
    expect(callback).toHaveBeenCalledTimes(1);

    await sleep(60);

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith('second');
  });
});
