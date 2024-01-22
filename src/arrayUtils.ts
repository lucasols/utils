/**
 * allow to filter and map with better typing ergonomics
 *
 * In the `mapFilter` function return `false` to reject the item, or any other
 * value to map it.
 *
 * @example
 * // Filter reject and turn value into `value mapped`
 * const items = ['value', 'value', 'reject', 'reject'];
 *
 * const mappedItems = filterAndMap(items, (item) =>
 *   item === 'reject'
 *     ? false
 *     : `${item} mapped`,
 * );
 *
 * mappedItems; // ['value mapped', 'value mapped']
 */
export function filterAndMap<T, R>(
  array: IterableIterator<T> | readonly T[],
  mapFilter: (item: T, index: number) => false | R,
): R[] {
  const result: R[] = [];

  let i = -1;
  for (const item of array) {
    i += 1;
    const filterResult = mapFilter(item, i);

    if (filterResult !== false) {
      result.push(filterResult);
    }
  }

  return result;
}

export type FilterAndMapReturn<T> = false | T;

type SortOrder = 'desc' | 'asc';

/**
 * Sort an array based on a value
 *
 * Sort by `ascending` order by default
 *
 * Use `Infinity` as as wildcard to absulute max and min values
 *
 * @example
 * const items = [1, 3, 2, 4];
 *
 * const sortedItems = sortBy(items, (item) => item);
 * // [1, 2, 3, 4]
 *
 * const items2 = [{ a: 1, b: 2 }, { a: 2, b: 1 }, { a: 1, b: 1}]
 *
 * // return a array to sort by multiple values
 * const sortedItems = sortBy(items, (item) => [item.a, item.b]);
 **/
export function sortBy<T>(
  arr: T[],
  sortByValue: (item: T) => (number | string)[] | number | string,
  { order = 'asc' }: { order?: SortOrder | SortOrder[] } = {},
) {
  return [...arr].sort((a, b) => {
    const _aPriority = sortByValue(a);
    const _bPriority = sortByValue(b);

    const aPriority = Array.isArray(_aPriority) ? _aPriority : [_aPriority];
    const bPriority = Array.isArray(_bPriority) ? _bPriority : [_bPriority];

    for (let i = 0; i < aPriority.length; i++) {
      const levelOrder: SortOrder =
        typeof order === 'string' ? order : order[i] ?? 'asc';

      const aP = aPriority[i] ?? 0;
      const bP = bPriority[i] ?? 0;

      if (aP === bP) {
        continue;
      }

      if (bP === Infinity || aP === -Infinity || aP < bP) {
        return levelOrder === 'asc' ? -1 : 1;
      }

      if (aP === Infinity || bP === -Infinity || aP > bP) {
        return levelOrder === 'asc' ? 1 : -1;
      }
    }

    return 0;
  });
}
