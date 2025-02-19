import { isObject } from './assertions';

/**
 * Returns a stable key for the input value.
 *
 * @param input - The value to get a stable key for.
 * @param maxSortingDepth - The maximum depth to sort the input value.
 * @returns A stable key for the input value.
 */
export function getValueStableKey(input: unknown, maxSortingDepth = 3): string {
  if (typeof input === 'string') return `"${input}`;
  if (!input || typeof input !== 'object') return `$${input}`;
  return stringifyCompact(input, maxSortingDepth, 0, new WeakSet());
}

function stringifyCompact(
  input: unknown,
  maxSortingDepth: number,
  depth: number,
  refs: WeakSet<any>,
): string {
  if (input && typeof input === 'object') {
    if (refs.has(input)) {
      throw new Error('Circular reference detected');
    }
    refs.add(input);
  }

  let result: string;
  if (Array.isArray(input)) {
    result = '[';
    for (const v of input) {
      if (result.length > 1) result += ',';
      result += stringifyCompact(v, maxSortingDepth, depth + 1, refs);
    }
    result += ']';
  } else if (isObject(input)) {
    let entries = Object.entries(input);

    if (entries.length === 0) {
      result = '{}';
    } else {
      if (depth < maxSortingDepth) {
        entries = entries.sort(([a], [b]) =>
          a < b ? -1
          : a > b ? 1
          : 0,
        );
      }

      result = '{';
      for (const [k, v] of entries) {
        if (v === undefined) continue;

        if (result.length > 1) result += ',';
        result += `${k}:${stringifyCompact(v, maxSortingDepth, depth + 1, refs)}`;
      }
      result += '}';
    }
  } else {
    result = JSON.stringify(input);
  }

  if (input && typeof input === 'object') {
    refs.delete(input);
  }
  return result;
}
