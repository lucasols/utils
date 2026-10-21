import { renderHook } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { useMemoWithPrev } from './useMemoWithPrev';

test('recomputes when a dep changes and passes the previous value', () => {
  const factory = vi.fn((prev: number[] | undefined, item: number) => [
    ...(prev ?? []),
    item,
  ]);

  const { result, rerender } = renderHook(
    ({ item }) =>
      useMemoWithPrev(
        (prev: number[] | undefined) => factory(prev, item),
        [item],
      ),
    { initialProps: { item: 1 } },
  );

  expect(result.current).toEqual([1]);

  rerender({ item: 1 });
  expect(factory).toHaveBeenCalledTimes(1);

  rerender({ item: 2 });
  expect(result.current).toEqual([1, 2]);
  expect(factory).toHaveBeenCalledTimes(2);
});

test('keeps the previous value when the new one is deep equal', () => {
  const prevValues: ({ total: number } | undefined)[] = [];

  const { rerender } = renderHook(
    ({ dep }) =>
      useMemoWithPrev(
        (prev: { total: number } | undefined) => {
          prevValues.push(prev);
          return { total: dep > 0 ? 1 : 0 };
        },
        [dep],
      ),
    { initialProps: { dep: 1 } },
  );

  rerender({ dep: 2 });
  rerender({ dep: 3 });

  expect(prevValues[0]).toBeUndefined();
  expect(prevValues[1]).toEqual({ total: 1 });
  expect(prevValues[2]).toBe(prevValues[1]);
});
