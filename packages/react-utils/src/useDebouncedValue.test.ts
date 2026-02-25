import { renderHook, act } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { sleep } from '@ls-stack/utils/sleep';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  test('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('hello', 100));

    expect(result.current.debouncedValue).toBe('hello');
    expect(result.current.isPending).toBe(false);
  });

  test('updates debounced value after delay', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 100),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'b' });

    expect(result.current.debouncedValue).toBe('a');
    expect(result.current.isPending).toBe(true);

    await act(() => sleep(110));

    expect(result.current.debouncedValue).toBe('b');
    expect(result.current.isPending).toBe(false);
  });

  test('batches rapid changes and only uses last value', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 100),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'b' });
    rerender({ value: 'c' });
    rerender({ value: 'd' });

    expect(result.current.debouncedValue).toBe('a');
    expect(result.current.isPending).toBe(true);

    await act(() => sleep(110));

    expect(result.current.debouncedValue).toBe('d');
    expect(result.current.isPending).toBe(false);
  });

  test('isPending reflects pending state', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 100),
      { initialProps: { value: 'a' } },
    );

    expect(result.current.isPending).toBe(false);

    rerender({ value: 'b' });
    expect(result.current.isPending).toBe(true);

    await act(() => sleep(110));
    expect(result.current.isPending).toBe(false);
  });

  test('flush immediately settles the debounced value', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 100),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'b' });

    expect(result.current.debouncedValue).toBe('a');
    expect(result.current.isPending).toBe(true);

    act(() => {
      result.current.flush();
    });

    expect(result.current.debouncedValue).toBe('b');
    expect(result.current.isPending).toBe(false);
  });

  test('updates debounceMs on rerender', async () => {
    const { result, rerender } = renderHook(
      ({ value, ms }) => useDebouncedValue(value, ms),
      { initialProps: { value: 'a', ms: 200 } },
    );

    rerender({ value: 'b', ms: 200 });

    await act(() => sleep(50));

    expect(result.current.debouncedValue).toBe('a');

    rerender({ value: 'b', ms: 10 });

    await act(() => sleep(20));

    expect(result.current.debouncedValue).toBe('b');
  });

  test('cancels pending update on unmount', async () => {
    const { result, rerender, unmount } = renderHook(
      ({ value }) => useDebouncedValue(value, 100),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'b' });

    expect(result.current.debouncedValue).toBe('a');
    expect(result.current.isPending).toBe(true);

    unmount();

    // After unmount, the debounce timer should be cancelled (no leaked timers)
    await sleep(110);
  });
});
