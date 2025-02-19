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
  return stringifyCompact(sortValues(input, maxSortingDepth, 0));
}

function stringifyCompact(input: unknown, refs = new WeakSet()): string {
  if (input && typeof input === 'object') {
    if (refs.has(input)) {
      throw new Error('Circular reference detected');
    }
    refs.add(input);
  }

  let result: string;
  if (Array.isArray(input)) {
    result = `[${input.map((v) => stringifyCompact(v, refs)).join(',')}]`;
  } else if (isObject(input)) {
    const entries = Object.entries(input);
    if (entries.length === 0) {
      result = '{}';
    } else {
      result = `{${entries.map(([k, v]) => `${k}:${stringifyCompact(v, refs)}`).join(',')}}`;
    }
  } else {
    result = JSON.stringify(input);
  }

  if (input && typeof input === 'object') {
    refs.delete(input);
  }
  return result;
}

function sortValues(input: unknown, maxDepth: number, depth: number): any {
  if (depth >= maxDepth) return input;

  if (Array.isArray(input)) {
    return input.map((v) => sortValues(v, maxDepth, depth + 1));
  }

  if (isObject(input)) {
    return orderedProps(input, (v) => sortValues(v, maxDepth, depth + 1));
  }

  return input;
}

const emptyObject = {};

function orderedProps(
  obj: Record<string, unknown>,
  mapValue: (value: unknown) => any,
) {
  const keys = Object.keys(obj);

  if (keys.length === 0) return emptyObject;

  if (keys.length === 1) {
    const value = obj[keys[0]!];

    if (value === undefined) return emptyObject;

    return { [keys[0]!]: mapValue(value) };
  }

  const sortedKeys = keys.sort();

  const sortedObj: Record<string, unknown> = {};

  for (const k of sortedKeys) {
    const value = obj[k];

    if (value === undefined) continue;

    sortedObj[k] = mapValue(value);
  }

  return sortedObj;
}
