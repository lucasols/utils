import { isFunction } from './assertions';

/**
 * Allow to filter and map with better typing ergonomics
 *
 * In the `mapFilter` function return `false` to reject the item, or any other
 * value to map it.
 *
 * @example
 *   // Filter reject and turn value into `value mapped`
 *   const items = ['value', 'value', 'reject', 'reject'];
 *
 *   const mappedItems = filterAndMap(items, (item) =>
 *     item === 'reject' ? false : `${item} mapped`,
 *   );
 *
 *   mappedItems; // ['value mapped', 'value mapped']
 *
 * @param array
 * @param mapFilter
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

export type SortByValueFn<T> = (
  item: T,
) => (number | string)[] | number | string;

export type SortByProps =
  | {
      order?: SortOrder | SortOrder[];
    }
  | SortOrder
  | SortOrder[];

/**
 * Sort an array based on a value
 *
 * Sort by `ascending` order by default
 *
 * Use `Infinity` as as wildcard to absolute max and min values
 *
 * @example
 *   const items = [1, 3, 2, 4];
 *
 *   const sortedItems = sortBy(items, (item) => item);
 *   // [1, 2, 3, 4]
 *
 *   const items2 = [
 *     { a: 1, b: 2 },
 *     { a: 2, b: 1 },
 *     { a: 1, b: 1 },
 *   ];
 *
 *   // return a array to sort by multiple values
 *   const sortedItems = sortBy(items, (item) => [item.a, item.b]);
 *
 * @param arr
 * @param sortByValue
 * @param props
 */
export function sortBy<T>(
  arr: T[],
  sortByValue: SortByValueFn<T>,
  props: SortByProps = 'asc',
) {
  const order =
    Array.isArray(props) || typeof props === 'string' ?
      props
    : (props.order ?? 'asc');

  return [...arr].sort((a, b) => {
    const _aPriority = sortByValue(a);
    const _bPriority = sortByValue(b);

    const aPriority = Array.isArray(_aPriority) ? _aPriority : [_aPriority];
    const bPriority = Array.isArray(_bPriority) ? _bPriority : [_bPriority];

    for (let i = 0; i < aPriority.length; i++) {
      const levelOrder: SortOrder =
        typeof order === 'string' ? order : (order[i] ?? 'asc');

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

/**
 * Get the correct 0 based value for sync with other array in ascending order
 *
 * @example
 *   ```ts
 *   const items = [1, 2, 3];
 *
 *   const index = sortBy(
 *     items,
 *     (item) => getAscIndexOrder(
 *       followOrder.findIndex((order) => order === item)
 *     )
 *   );
 *   ```;
 *
 * @param index
 */
export function getAscIndexOrder(index: number | undefined): number {
  return index === -1 ? Infinity : (index ?? Infinity);
}

export function arrayWithPrev<T>(array: T[]): [current: T, prev: T | null][] {
  return array.map((item, i) => [item, array[i - 1] ?? null]);
}

export function arrayWithPrevAndIndex<T>(
  array: T[],
): { item: T; prev: T | null; index: number }[] {
  return array.map((item, i) => ({
    item,
    prev: array[i - 1] ?? null,
    index: i,
  }));
}

export function isInArray<T, const U extends T>(
  value: T,
  oneOf: readonly U[],
): value is U {
  for (let i = 0; i < oneOf.length; i++) {
    if (oneOf[i] === value) {
      return true;
    }
  }

  return false;
}

export function findAfterIndex<T>(
  array: T[],
  index: number,
  predicate: (item: T) => boolean,
): T | undefined {
  for (let i = index + 1; i < array.length; i++) {
    if (predicate(array[i]!)) {
      return array[i];
    }
  }

  return undefined;
}

export function findBeforeIndex<T>(
  array: T[],
  index: number,
  predicate: (item: T) => boolean,
): T | undefined {
  let indexToUse = index;

  if (indexToUse >= array.length) {
    indexToUse = array.length;
  }

  for (let i = indexToUse - 1; i >= 0; i--) {
    if (predicate(array[i]!)) {
      return array[i];
    }
  }

  return undefined;
}

export function rejectArrayUndefinedValues<T extends unknown[]>(array: T): T {
  return array.filter((item) => item !== undefined) as T;
}

export function hasDuplicates<T>(
  array: T[],
  getKey: (item: T) => unknown = (item) => item,
): boolean {
  const seen = new Set();

  for (const item of array) {
    const key = getKey(item);
    if (seen.has(key)) {
      return true;
    }
    seen.add(key);
  }

  return false;
}

export function rejectDuplicates<T>(
  array: T[],
  getKey: (item: T) => unknown = (item) => item,
): T[] {
  const seen = new Set();
  const result: T[] = [];

  for (const item of array) {
    const key = getKey(item);
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(item);
  }

  return result;
}

export function truncateArray<T>(
  array: T[],
  maxLength: number,
  appendIfTruncated?: T | ((truncatedCount: number) => T),
): T[] {
  const truncate = array.length > maxLength;
  const result = truncate ? [...array.slice(0, maxLength)] : array;

  if (truncate && appendIfTruncated) {
    if (isFunction(appendIfTruncated)) {
      return [...result, appendIfTruncated(array.length - maxLength)];
    }

    return [...result, appendIfTruncated];
  }

  return result;
}

type ArrayOps<T> = {
  /**
   * Filter and map an array
   *
   * @example
   *   const items = [1, 2, 3];
   *
   *   const enhancedItems = arrayOps(items);
   *
   *   enhancedItems.filterAndMap((item) => (item === 2 ? false : item));
   *
   * @param mapFilter - A function that takes an item and returns a value or
   *   `false` to reject the item.
   */
  filterAndMap: <R>(mapFilter: (item: T, index: number) => false | R) => R[];
  sortBy: (sortByValue: SortByValueFn<T>, props: SortByProps) => T[];
  rejectDuplicates: (getKey: (item: T) => unknown) => T[];
  findAndMap: <R>(predicate: (value: T) => R | false) => R | undefined;
};

/**
 * Finds the first item in an array where the predicate returns a non-false
 * value and returns that mapped value.
 *
 * Combines find and map operations - applies the predicate to each item until
 * one returns a value that is not `false`, then returns that mapped value. If
 * no item matches, returns `undefined`.
 *
 * @example
 *   const users = [
 *     { id: 1, name: 'Alice' },
 *     { id: 2, name: 'Bob' },
 *   ];
 *
 *   const foundName = findAndMap(users, (user) =>
 *     user.id === 2 ? user.name.toUpperCase() : false,
 *   );
 *   // foundName is 'BOB'
 *
 * @param array - The array to search through
 * @param predicate - Function that returns a mapped value or `false` to skip
 *   the item
 * @returns The first mapped value that is not `false`, or `undefined` if no
 *   item matches
 */
export function findAndMap<T, R>(
  array: T[],
  predicate: (value: T) => R | false,
): R | undefined {
  for (const item of array) {
    const value = predicate(item);
    if (value !== false) return value;
  }
  return undefined;
}

/**
 * Enhance an array with extra methods
 *
 * @example
 *   const enhancedItems = arrayOps(array);
 *
 *   enhancedItems.filterAndMap((item) => (item === 2 ? false : item));
 *   enhancedItems.sortBy((item) => item);
 *   enhancedItems.rejectDuplicates((item) => item);
 *
 * @param array
 */
export function arrayOps<T>(array: T[]): ArrayOps<T> {
  return {
    filterAndMap: (mapFilter) => filterAndMap(array, mapFilter),
    sortBy: (sortByValue, props) => sortBy(array, sortByValue, props),
    rejectDuplicates: (getKey) => rejectDuplicates(array, getKey),
    findAndMap: (predicate) => findAndMap(array, predicate),
  };
}
