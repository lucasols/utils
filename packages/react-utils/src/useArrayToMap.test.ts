import { renderHook } from '@testing-library/react';
import { expect, expectTypeOf, test } from 'vitest';
import { useArrayToMap } from './useArrayToMap';

type Item = { id: number; name: string };

const items: Item[] = [
  { id: 1, name: 'a' },
  { id: 2, name: 'b' },
];

test('maps the items by a key', () => {
  const { result } = renderHook(() => useArrayToMap(items, 'id'));

  expectTypeOf(result.current).toEqualTypeOf<Map<number, Item>>();
  expect(result.current.get(2)).toBe(items[1]);
});

test('maps the items by a getter', () => {
  const { result } = renderHook(() =>
    useArrayToMap(items, (item, index) => `${item.name}-${index}`),
  );

  expectTypeOf(result.current).toEqualTypeOf<
    Map<`${string}-${number}`, Item>
  >();
  expect([...result.current.keys()]).toEqual(['a-0', 'b-1']);
});

test('returns an empty map for nullish arrays', () => {
  const { result } = renderHook(() => useArrayToMap<Item, 'id'>(null, 'id'));

  expect(result.current.size).toBe(0);
});

test('only recomputes the map when the array changes', () => {
  const { result, rerender } = renderHook(
    ({ arr }) => useArrayToMap(arr, (item) => item.id),
    { initialProps: { arr: items } },
  );

  const firstMap = result.current;

  rerender({ arr: items });
  expect(result.current).toBe(firstMap);

  rerender({ arr: [...items] });
  expect(result.current).not.toBe(firstMap);
});
