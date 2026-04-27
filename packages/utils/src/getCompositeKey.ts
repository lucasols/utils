import { isObject } from './assertions';

export type GetCompositeKeyStringifier = (
  input: unknown,
) => string | undefined;

export type GetCompositeKeyOptions = {
  /**
   * The maximum depth to sort the input value. Default is 3.
   */
  maxSortingDepth?: number;
  /**
   * Custom stringifier for values that need special handling. Return undefined
   * to keep using the default stringifier for that value.
   */
  stringify?: GetCompositeKeyStringifier;
};

type ResolvedGetCompositeKeyOptions = Required<
  Pick<GetCompositeKeyOptions, 'maxSortingDepth'>
> &
  Pick<GetCompositeKeyOptions, 'stringify'>;

/**
 * Returns a stable key for the input value.
 *
 * @param input - The value to get a stable key for.
 * @param options - The maximum depth to sort the input value, or options for
 *   key generation.
 * @param stringify - Custom stringifier used with the legacy maxSortingDepth
 *   parameter.
 * @returns A stable key for the input value.
 */
export function getCompositeKey(
  input: unknown,
  options: number | GetCompositeKeyOptions = 3,
  stringify?: GetCompositeKeyStringifier,
): string {
  const resolvedOptions = resolveOptions(options, stringify);

  if (typeof input === 'string' || !input || typeof input !== 'object') {
    const customKey = resolvedOptions.stringify?.(input);
    if (customKey !== undefined) return customKey;

    if (typeof input === 'string') return `"${input}`;
    return `$${input}`;
  }

  return stringifyCompact(input, resolvedOptions, 0, new WeakSet());
}

function resolveOptions(
  options: number | GetCompositeKeyOptions,
  stringify: GetCompositeKeyStringifier | undefined,
): ResolvedGetCompositeKeyOptions {
  if (typeof options === 'number') {
    return { maxSortingDepth: options, stringify };
  }

  return {
    maxSortingDepth: options.maxSortingDepth ?? 3,
    stringify: options.stringify,
  };
}

function stringifyCompact(
  input: unknown,
  options: ResolvedGetCompositeKeyOptions,
  depth: number,
  refs: WeakSet<any>,
): string {
  const customKey = options.stringify?.(input);
  if (customKey !== undefined) return customKey;

  const isJsObj = input && typeof input === 'object';
  if (isJsObj) {
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
      result += stringifyCompact(v, options, depth + 1, refs);
    }
    result += ']';
  } else if (isObject(input)) {
    let entries = Object.entries(input);

    if (entries.length === 0) {
      result = '{}';
    } else {
      if (depth < options.maxSortingDepth) {
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
        result += `${k}:${stringifyCompact(v, options, depth + 1, refs)}`;
      }
      result += '}';
    }
  } else {
    result = JSON.stringify(input);
  }

  if (isJsObj) {
    refs.delete(input);
  }
  return result;
}
