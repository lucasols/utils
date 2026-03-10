import { renderHook, act } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { sleep } from '@ls-stack/utils/sleep';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  test('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('hello', 100));

    const [debouncedValue, , isPending] = result.current;
    expect(debouncedValue).toBe('hello');
    expect(isPending).toBe(false);
  });

  test('updates debounced value after delay', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 100),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'b' });

    expect(result.current[0]).toBe('a');
    expect(result.current[2]).toBe(true);

    await act(() => sleep(110));

    expect(result.current[0]).toBe('b');
    expect(result.current[2]).toBe(false);
  });

  test('batches rapid changes and only uses last value', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 100),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'b' });
    rerender({ value: 'c' });
    rerender({ value: 'd' });

    expect(result.current[0]).toBe('a');
    expect(result.current[2]).toBe(true);

    await act(() => sleep(110));

    expect(result.current[0]).toBe('d');
    expect(result.current[2]).toBe(false);
  });

  test('isPending reflects pending state', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 100),
      { initialProps: { value: 'a' } },
    );

    expect(result.current[2]).toBe(false);

    rerender({ value: 'b' });
    expect(result.current[2]).toBe(true);

    await act(() => sleep(110));
    expect(result.current[2]).toBe(false);
  });

  test('flush immediately settles the debounced value', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 100),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'b' });

    expect(result.current[0]).toBe('a');
    expect(result.current[2]).toBe(true);

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe('b');
    expect(result.current[2]).toBe(false);
  });

  test('updates debounceMs on rerender', async () => {
    const { result, rerender } = renderHook(
      ({ value, ms }) => useDebouncedValue(value, ms),
      { initialProps: { value: 'a', ms: 200 } },
    );

    rerender({ value: 'b', ms: 200 });

    await act(() => sleep(50));

    expect(result.current[0]).toBe('a');

    rerender({ value: 'b', ms: 10 });

    await act(() => sleep(20));

    expect(result.current[0]).toBe('b');
  });

  test('debounceMs=0 passes value through immediately', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 0),
      { initialProps: { value: 'a' } },
    );

    expect(result.current[0]).toBe('a');
    expect(result.current[2]).toBe(false);

    rerender({ value: 'b' });

    expect(result.current[0]).toBe('b');
    expect(result.current[2]).toBe(false);

    rerender({ value: 'c' });

    expect(result.current[0]).toBe('c');
    expect(result.current[2]).toBe(false);
  });

  test('debounceMs=0 flush is a safe noop', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 0),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'b' });

    // flush should not throw
    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe('b');
  });

  test('switching from debounced to debounceMs=0 passes value through', async () => {
    const { result, rerender } = renderHook(
      ({ value, ms }) => useDebouncedValue(value, ms),
      { initialProps: { value: 'a', ms: 100 } },
    );

    rerender({ value: 'b', ms: 100 });
    expect(result.current[0]).toBe('a');
    expect(result.current[2]).toBe(true);

    // Switch to disabled
    rerender({ value: 'b', ms: 0 });
    expect(result.current[0]).toBe('b');
    expect(result.current[2]).toBe(false);
  });

  test('maxWait forces update even with continuous changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300, { maxWait: 300 }),
      { initialProps: { value: 'a' } },
    );

    // Keep changing the value every 100ms so the debounce timer keeps resetting.
    // Without maxWait, the trailing edge would never fire until changes stop for 300ms.
    // With maxWait: 300, it fires 300ms after the first call regardless.
    rerender({ value: 'b' });
    await act(() => sleep(100));
    rerender({ value: 'c' });
    await act(() => sleep(100));
    rerender({ value: 'd' });
    await act(() => sleep(110));

    // ~310ms from first call, maxWait (300ms) has been reached
    expect(result.current[0]).toBe('d');
    expect(result.current[2]).toBe(false);
  });

  test('leading option triggers update immediately on first change', async () => {
    const { result, rerender } = renderHook(
      ({ value }) =>
        useDebouncedValue(value, 200, { leading: true, trailing: false }),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'b' });

    // With leading: true, the debounced callback fires immediately on first call
    // so after the onChange -> debouncedSetter fires leading -> setter runs
    await act(() => sleep(10));

    expect(result.current[0]).toBe('b');
  });

  test('cancels pending update on unmount', async () => {
    const { result, rerender, unmount } = renderHook(
      ({ value }) => useDebouncedValue(value, 100),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'b' });

    expect(result.current[0]).toBe('a');
    expect(result.current[2]).toBe(true);

    unmount();

    // After unmount, the debounce timer should be cancelled (no leaked timers)
    await sleep(110);
  });
});
