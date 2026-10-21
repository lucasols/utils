import { renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { useDeepMemo, useStableRefValue } from './useDeepMemo';

describe('useDeepMemo', () => {
  test('only recomputes when the deps change structurally', () => {
    const factory = vi.fn((filter: { ids: number[] }) => filter.ids.length);

    const { result, rerender } = renderHook(
      ({ filter }) => useDeepMemo(() => factory(filter), [filter]),
      { initialProps: { filter: { ids: [1, 2] } } },
    );

    expect(result.current).toBe(2);
    expect(factory).toHaveBeenCalledTimes(1);

    rerender({ filter: { ids: [1, 2] } });
    expect(result.current).toBe(2);
    expect(factory).toHaveBeenCalledTimes(1);

    rerender({ filter: { ids: [1, 2, 3] } });
    expect(result.current).toBe(3);
    expect(factory).toHaveBeenCalledTimes(2);
  });
});

describe('useStableRefValue', () => {
  test('keeps the reference while the value is deep equal', () => {
    const first = { a: 1 };

    const { result, rerender } = renderHook(
      ({ value }) => useStableRefValue(value),
      { initialProps: { value: first } },
    );

    rerender({ value: { a: 1 } });
    expect(result.current).toBe(first);

    const changed = { a: 2 };
    rerender({ value: changed });
    expect(result.current).toBe(changed);
  });
});
