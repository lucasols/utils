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
