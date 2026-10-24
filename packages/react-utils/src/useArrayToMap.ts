import type { __LEGIT_ANY__ } from '@ls-stack/utils/saferTyping';
import { useMemo } from 'react';

/**
 * Memoized `Map` of the array items by a key or a getter. The map is recomputed
 * when the array or the key/getter changes, so pass a memoized getter.
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
  getItemId:
    | ((item: __LEGIT_ANY__, index: number) => string | number)
    | PropertyKey,
): Map<__LEGIT_ANY__, unknown> {
  return useMemo(() => {
    if (!arr) return new Map<string | number, unknown>();

    const getId =
      typeof getItemId === 'function'
        ? getItemId
        : (item: Record<PropertyKey, __LEGIT_ANY__>) => {
            const itemId: string | number = item[getItemId];
            return itemId;
          };

    return new Map(
      arr.map((item, i): [string | number, unknown] => [getId(item, i), item]),
    );
  }, [arr, getItemId]);
}
