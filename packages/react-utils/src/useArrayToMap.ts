import type { __LEGIT_ANY__ } from '@ls-stack/utils/saferTyping';
import { useMemo } from 'react';
import { useLatestValue } from './useLatestValue';

/**
 * Memoized `Map` of the array items by a key or a getter. The map is only
 * recomputed when the array changes.
 */
export function useArrayToMap<
  T extends Record<string, unknown>,
  K extends keyof T,
>(arr: T[] | null | undefined, key: K): Map<T[K], T>;
export function useArrayToMap<T, K extends string | number>(
  arr: T[] | null | undefined,
  getItemId: (item: T, index: number) => K,
): Map<K, T>;
export function useArrayToMap(
  arr: __LEGIT_ANY__[] | null | undefined,
  getItemId: ((item: __LEGIT_ANY__, index: number) => string | number) | string,
): Map<__LEGIT_ANY__, unknown> {
  const latestGetItemId = useLatestValue(
    typeof getItemId === 'string' ?
      (item: Record<string, __LEGIT_ANY__>) => {
        const itemId: string | number = item[getItemId];
        return itemId;
      }
    : getItemId,
  );
  return useMemo(
    () =>
      !arr ?
        new Map<string | number, unknown>()
      : new Map(
          arr.map((item, i): [string | number, unknown] => [
            latestGetItemId.insideEffect(item, i),
            item,
          ]),
        ),
    [arr, latestGetItemId],
  );
}
