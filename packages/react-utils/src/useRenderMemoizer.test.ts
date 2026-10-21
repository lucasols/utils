import { renderHook } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { useRenderMemoizer } from './useRenderMemoizer';

test('getValue keeps the previous value while it is shallow equal', () => {
  const first = { a: 1 };

  const { result, rerender } = renderHook(
    ({ value }) => useRenderMemoizer().getValue('key', value),
    { initialProps: { value: first } },
  );

  rerender({ value: { a: 1 } });
  expect(result.current).toBe(first);

  const changed = { a: 2 };
  rerender({ value: changed });
  expect(result.current).toBe(changed);
});

test('getValueWithDeps keeps the previous value while the deps are equal', () => {
  const first = { label: 'a' };

  const { result, rerender } = renderHook(
    ({ value, dep }) =>
      useRenderMemoizer().getValueWithDeps('key', value, [dep]),
    { initialProps: { value: first, dep: 1 } },
  );

  rerender({ value: { label: 'b' }, dep: 1 });
  expect(result.current).toBe(first);

  rerender({ value: { label: 'c' }, dep: 2 });
  expect(result.current).toEqual({ label: 'c' });
});

test('getLazyValueWithDeps only computes the value when the deps change', () => {
  const getValue = vi.fn((dep: number) => ({ dep }));

  const { result, rerender } = renderHook(
    ({ dep }) =>
      useRenderMemoizer().getLazyValueWithDeps('key', () => getValue(dep), [
        dep,
      ]),
    { initialProps: { dep: 1 } },
  );

  rerender({ dep: 1 });
  expect(getValue).toHaveBeenCalledTimes(1);
  expect(result.current).toEqual({ dep: 1 });

  rerender({ dep: 2 });
  expect(getValue).toHaveBeenCalledTimes(2);
  expect(result.current).toEqual({ dep: 2 });
});

test('drops the cache of keys that were not used in the last render', () => {
  const first = { a: 1 };

  const { result, rerender } = renderHook(
    ({ useKey, value }) => {
      const memoizer = useRenderMemoizer();
      memoizer.getValue('other', 0);
      return useKey ? memoizer.getValue('key', value) : null;
    },
    { initialProps: { useKey: true, value: first } },
  );

  rerender({ useKey: false, value: first });
  rerender({ useKey: true, value: { a: 1 } });

  expect(result.current).not.toBe(first);
});

test('getValue does not call a custom equality fn without a cached value', () => {
  const first = { id: 1, label: 'a' };

  const { result, rerender } = renderHook(
    ({ value }) =>
      useRenderMemoizer().getValue(
        'key',
        value,
        (a: { id: number }, b: { id: number }) => a.id === b.id,
      ),
    { initialProps: { value: first } },
  );

  expect(result.current).toBe(first);

  rerender({ value: { id: 1, label: 'b' } });
  expect(result.current).toBe(first);
});

test('getValueWithDeps compares with the deps of the latest render', () => {
  const first = { label: 'first' };
  const second = { label: 'second' };

  const { result, rerender } = renderHook(
    ({ value, dep }) =>
      useRenderMemoizer().getValueWithDeps('key', value, [dep]),
    { initialProps: { value: first, dep: 'a' } },
  );

  rerender({ value: first, dep: 'b' });
  rerender({ value: second, dep: 'a' });

  expect(result.current).toBe(second);
});

test('getLazyValueWithDeps compares with the deps of the latest render', () => {
  const first = { label: 'first' };
  const second = { label: 'second' };

  const { result, rerender } = renderHook(
    ({ value, dep }) =>
      useRenderMemoizer().getLazyValueWithDeps('key', () => value, [dep]),
    { initialProps: { value: first, dep: 'a' } },
  );

  rerender({ value: first, dep: 'b' });
  rerender({ value: second, dep: 'a' });

  expect(result.current).toBe(second);
});

test('getValue caches an initial undefined value', () => {
  const nullishEqual = (a: unknown, b: unknown) => (a ?? null) === (b ?? null);
  const initialProps: { value: null | undefined } = { value: undefined };

  const { result, rerender } = renderHook(
    ({ value }) => useRenderMemoizer().getValue('key', value, nullishEqual),
    { initialProps },
  );

  rerender({ value: null });

  expect(result.current).toBeUndefined();
});
