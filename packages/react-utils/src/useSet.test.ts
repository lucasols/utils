import { act, renderHook } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { useSet } from './useSet';

test('adds, deletes and toggles items without duplicates', () => {
  const { result } = renderHook(() => useSet<string>(['a']));

  act(() => {
    result.current.add('b');
    result.current.add('b');
  });
  expect(result.current.array).toEqual(['a', 'b']);
  expect(result.current.has('b')).toBe(true);

  act(() => {
    result.current.delete('a');
  });
  expect(result.current.array).toEqual(['b']);

  act(() => {
    result.current.toggle('b');
    result.current.toggle('c');
  });
  expect(result.current.array).toEqual(['c']);

  act(() => {
    result.current.addOrDelete('d', true);
    result.current.addOrDelete('c', false);
    result.current.addOrDelete('e', null);
  });
  expect(result.current.array).toEqual(['d']);

  act(() => {
    result.current.set(['x', 'y']);
  });
  expect(result.current.array).toEqual(['x', 'y']);
});

test('accepts a lazy initial value', () => {
  const { result } = renderHook(() => useSet(() => [1, 2]));

  expect(result.current.array).toEqual([1, 2]);
});

test('calls onUpdate with the new values', () => {
  const onUpdate = vi.fn();

  const { result } = renderHook(() => useSet<number>([], { onUpdate }));

  act(() => {
    result.current.add(1);
  });

  expect(onUpdate).toHaveBeenLastCalledWith([1]);
});
