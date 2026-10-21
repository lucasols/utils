import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { usePreventMultipleConsecutiveChanges } from './usePreventMultipleConsecutiveChanges';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test('returns true until the min time between changes has passed', () => {
  const { result, rerender } = renderHook(
    ({ changeKey }) => usePreventMultipleConsecutiveChanges(changeKey, 1000),
    { initialProps: { changeKey: 'a' } },
  );

  expect(result.current).toBe(false);

  act(() => {
    vi.advanceTimersByTime(200);
  });
  rerender({ changeKey: 'b' });

  expect(result.current).toBe(true);

  act(() => {
    vi.advanceTimersByTime(799);
  });
  expect(result.current).toBe(true);

  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(result.current).toBe(false);
});

test('returns false when the changes are far enough apart', () => {
  const { result, rerender } = renderHook(
    ({ changeKey }) => usePreventMultipleConsecutiveChanges(changeKey, 1000),
    { initialProps: { changeKey: 'a' } },
  );

  act(() => {
    vi.advanceTimersByTime(1000);
  });
  rerender({ changeKey: 'b' });

  expect(result.current).toBe(false);
});

test('ignores falsy change keys', () => {
  const initialProps: { changeKey: string | null } = { changeKey: 'a' };

  const { result, rerender } = renderHook(
    ({ changeKey }) => usePreventMultipleConsecutiveChanges(changeKey, 1000),
    { initialProps },
  );

  rerender({ changeKey: null });
  rerender({ changeKey: 'a' });

  expect(result.current).toBe(false);
});
