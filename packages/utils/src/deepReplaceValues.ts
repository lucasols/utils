import { isPlainObject } from './typeGuards';

function applyValueReplacements(
  value: unknown,
  replaceValues: (
    value: unknown,
    path: string,
  ) => false | { newValue: unknown },
  visited: Set<object>,
  currentPath: string,
): unknown {
  function processValue(val: unknown, path: string): unknown {
    // Call replaceValues for this value
    const replacement = replaceValues(val, path);
    if (replacement !== false) {
      return replacement.newValue;
    }

    // If not replaced, process recursively based on type
    if (Array.isArray(val)) {
      if (visited.has(val)) {
        throw new Error('Circular reference detected in array');
      }
      visited.add(val);
      try {
        return val.map((item, index) => {
          const itemPath = path ? `${path}[${index}]` : `[${index}]`;
          return processValue(item, itemPath);
        });
      } finally {
        visited.delete(val);
      }
    }

    if (isPlainObject(val)) {
      if (visited.has(val)) {
        throw new Error('Circular reference detected in object');
      }
      visited.add(val);
      try {
        const result: Record<string, unknown> = {};
        for (const [key, itemValue] of Object.entries(val)) {
          const itemPath = path ? `${path}.${key}` : key;
          result[key] = processValue(itemValue, itemPath);
        }
        return result;
      } finally {
        visited.delete(val);
      }
    }

    return val;
  }

  return processValue(value, currentPath);
}

/**
 * Recursively traverses an object or array and allows conditional replacement of values
 * based on a provided callback function. The callback receives each value and its path
 * within the data structure.
 *
 * @param value - The input value to process (object, array, or primitive)
 * @param replaceValues - Callback function that receives each value and its path.
 *   Return `false` to keep the original value, or `{ newValue: unknown }` to replace it.
 *   The path uses dot notation for objects (e.g., "user.name") and bracket notation for arrays (e.g., "items[0]")
 * @returns A new structure with replaced values. The original structure is not modified.
 * @throws Error if circular references are detected
 *
 * @example
 * const data = { user: { id: 1, name: "Alice" }, scores: [85, 92] };
 * const result = deepReplaceValues(data, (value, path) => {
 *   if (typeof value === "number") {
 *     return { newValue: value * 2 };
 *   }
 *   return false;
 * });
 * // Result: { user: { id: 2, name: "Alice" }, scores: [170, 184] }
 */
export function deepReplaceValues<T, R = T>(
  value: T,
  replaceValues: (
    value: unknown,
    path: string,
  ) => false | { newValue: unknown },
): R {
  return applyValueReplacements(value, replaceValues, new Set(), '') as R;
}
