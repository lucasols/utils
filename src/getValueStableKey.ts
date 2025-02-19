import { isObject } from './assertions';

/**
 * Returns a stable key for the input value.
 *
 * @param input - The value to get a stable key for.
 * @param maxDepth - The maximum depth to traverse the input value.
 * @returns A stable key for the input value.
 */
export function getValueStableKey(input: unknown, maxDepth = 3): string {
  if (typeof input === 'string') return `"${input}`;

  if (!input || typeof input !== 'object') return `$${input}`;

  return JSON.stringify(sortValues(input, maxDepth, 0));
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
