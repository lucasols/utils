import { renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { sleep } from '@ls-stack/utils/sleep';
import { useTimeout } from './useTimeout';

describe('useTimeout', () => {
  test('should call callback after specified time', async () => {
    const callback = vi.fn();

    const { result } = renderHook(() => useTimeout(100));

    result.current.call(callback);

    expect(callback).not.toHaveBeenCalled();

    await sleep(110);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should support override ms', async () => {
    const callback = vi.fn();

    const { result } = renderHook(() => useTimeout(100));

    result.current.call(callback, 50);

    await sleep(60);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should track multiple timeouts', async () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const callback3 = vi.fn();

    const { result } = renderHook(() => useTimeout(100));

    result.current.call(callback1, 50);
    result.current.call(callback2, 80);
    result.current.call(callback3, 110);

    await sleep(60);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();

    await sleep(30);
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(callback3).not.toHaveBeenCalled();

    await sleep(40);
    expect(callback3).toHaveBeenCalledTimes(1);
  });

  test('should clear all pending timeouts', async () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { result } = renderHook(() => useTimeout(100));

    result.current.call(callback1);
    result.current.call(callback2, 150);

    result.current.clear();

    await sleep(200);

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
  });

  test('should clear existing and schedule new timeout', async () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { result } = renderHook(() => useTimeout(100));

    result.current.call(callback1);
    result.current.clearAndCall(callback2, 50);

    await sleep(110);

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  test('should clear timeouts on unmount by default', async () => {
    const callback = vi.fn();

    const { result, unmount } = renderHook(() => useTimeout(100));

    result.current.call(callback);

    unmount();

    await sleep(110);

    expect(callback).not.toHaveBeenCalled();
  });

  test('should not clear timeouts on unmount when noClearOnUnmount is true', async () => {
    const callback = vi.fn();

    const { result, unmount } = renderHook(() => useTimeout(100, true));

    result.current.call(callback);

    unmount();

    await sleep(110);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should maintain stable reference', () => {
    const { result, rerender } = renderHook(() => useTimeout(100));

    const firstRef = result.current;

    rerender();

    expect(result.current).toBe(firstRef);
  });

  test('should update timeout duration when ms changes', async () => {
    const callback = vi.fn();

    const { result, rerender } = renderHook(
      ({ ms }) => useTimeout(ms),
      { initialProps: { ms: 100 } },
    );

    rerender({ ms: 50 });

    result.current.call(callback);

    await sleep(60);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
