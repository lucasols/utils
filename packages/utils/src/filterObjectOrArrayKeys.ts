import { isPlainObject } from './typeGuards';

/**
 * Filters the keys of an object based on the provided patterns.
 *
 * Filtering patterns in `rejectKeys` and `filterKeys`:
 * - `'prop'` - Only root-level properties named 'prop'
 * - `'*prop'` - Any property named exactly 'prop' at any level (root or nested)
 * - `'*.prop'` - Any nested property named 'prop' (excludes root-level matches)
 * - `'prop.nested'` - Exact nested property paths like `obj.prop.nested`
 * - `'prop.*nested'` - All nested properties inside `prop` with name `nested`
 * - `'prop[0]'` - The first item of the `prop` array
 * - `'prop[*]'` - All items of the `prop` array
 * - `'prop[0].nested'` - `nested` prop of the first item of the `prop` array
 * - `'prop[*].nested'` - `nested` prop of all items of the `prop` array
 * - `'prop[*]*nested'` - all `nested` props of all items of the `prop` array
 * - `'prop[0-2]'` - The first three items of the `prop` array
 * - `'prop[4-*]'` - All items of the `prop` array from the fourth index to the end
 * - `'prop[0-2].nested.*prop'` - Combining multiple nested patterns is supported
 * - `'[0]'` - The first item of the array
 * - `'[*]'` - All items of the array
 * - `'[0].nested'` - `nested` prop of the first item of the array
 * - `'[*].nested'` - `nested` prop of all items of the array
 * - `'[*]*nested'` - all `nested` props of all items of the array
 * - `'[0-2]'` - The first three items of the array
 * - `'[4-*]'` - All items of the array from the fourth index to the end
 *
 * @param objOrArray - The object or array to filter.
 * @param options - The options for the filter.
 * @param options.filterKeys - The keys to filter.
 * @param options.rejectKeys - The keys to reject.
 * @param options.rejectEmptyObjects - When true (default), remove empty objects or properties with empty children that result from filtering.
 * @returns The filtered object or array.
 */
export function filterObjectOrArrayKeys(
  objOrArray: Record<string, any> | Record<string, any>[],
  {
    filterKeys,
    rejectKeys,
    rejectEmptyObjects = true,
  }: {
    filterKeys?: string[] | string;
    rejectKeys?: string[] | string;
    rejectEmptyObjects?: boolean;
  },
): Record<string, any> | Record<string, any>[] {
  const normalizedFilterPatterns = normalizePatterns(filterKeys);
  const normalizedRejectPatterns = normalizePatterns(rejectKeys);

  const visited = new Set<object>();

  function filterValue(
    value: unknown,
    currentPath: string,
    filterActive = true,
    pruneActive = filterActive,
  ): unknown {
    if (!isPlainObject(value) && !Array.isArray(value)) {
      return value;
    }

    if (Array.isArray(value)) {
      if (visited.has(value)) {
        throw new Error(
          'Circular reference detected in array during filtering',
        );
      }
      visited.add(value);
      try {
        const result: unknown[] = [];
        for (let index = 0; index < value.length; index++) {
          const indexPath =
            currentPath ? `${currentPath}[${index}]` : `[${index}]`;

          if (shouldReject(indexPath, `[${index}]`)) {
            continue;
          }

          if (filterActive && normalizedFilterPatterns) {
            const includeExactly = matchesAny(
              indexPath,
              `[${index}]`,
              normalizedFilterPatterns,
            );
            const includeAsParent = isParentOfAny(
              indexPath,
              normalizedFilterPatterns,
            );
            if (!includeExactly && !includeAsParent) {
              continue;
            }

            if (includeExactly) {
              // Include whole element content; only apply rejectKeys below
              const childIncluded = filterValue(
                value[index],
                indexPath,
                false,
                true,
              );
              if (
                !(
                  rejectEmptyObjects &&
                  pruneActive &&
                  isPlainObject(childIncluded) &&
                  Object.keys(childIncluded as any).length === 0
                )
              ) {
                result.push(childIncluded);
              }
              continue;
            }
            // includeAsParent -> keep filtering descendants
          }

          const child = filterValue(
            value[index],
            indexPath,
            filterActive,
            pruneActive,
          );
          if (
            !(
              rejectEmptyObjects &&
              pruneActive &&
              isPlainObject(child) &&
              Object.keys(child as any).length === 0
            )
          ) {
            result.push(child);
          }
        }
        return result;
      } finally {
        visited.delete(value);
      }
    }

    // plain object
    if (visited.has(value)) {
      throw new Error('Circular reference detected in object during filtering');
    }
    visited.add(value);
    try {
      const output: Record<string, unknown> = {};
      for (const [key, child] of Object.entries(value)) {
        const fullPath = currentPath ? `${currentPath}.${key}` : key;

        if (shouldReject(fullPath, key)) {
          continue;
        }

        if (filterActive && normalizedFilterPatterns) {
          const includeExactly = matchesAny(
            fullPath,
            key,
            normalizedFilterPatterns,
          );
          const includeAsParent = isParentOfAny(
            fullPath,
            normalizedFilterPatterns,
          );
          if (!includeExactly && !includeAsParent) {
            continue;
          }
          if (includeExactly) {
            const childIncluded = filterValue(child, fullPath, false, true);
            if (
              !(
                rejectEmptyObjects &&
                pruneActive &&
                isPlainObject(childIncluded) &&
                Object.keys(childIncluded as any).length === 0
              )
            ) {
              output[key] = childIncluded;
            }
            continue;
          }
          // includeAsParent -> keep filtering
        }

        const filteredChild = filterValue(
          child,
          fullPath,
          filterActive,
          pruneActive,
        );
        if (
          !(
            rejectEmptyObjects &&
            pruneActive &&
            isPlainObject(filteredChild) &&
            Object.keys(filteredChild as any).length === 0
          ) &&
          // Also drop empty arrays when pruning is enabled (only in filtered contexts)
          !(
            rejectEmptyObjects &&
            pruneActive &&
            Array.isArray(filteredChild) &&
            filteredChild.length === 0
          )
        ) {
          output[key] = filteredChild;
        }
      }
      return output;
    } finally {
      visited.delete(value);
    }
  }

  function shouldReject(fullPath: string, keyOrIndexToken: string): boolean {
    if (!normalizedRejectPatterns) return false;
    return matchesAny(fullPath, keyOrIndexToken, normalizedRejectPatterns);
  }

  function matchesAny(
    fullPath: string,
    keyOrIndexToken: string,
    patterns: string[],
  ): boolean {
    for (const pattern of patterns) {
      if (matchesPattern(fullPath, keyOrIndexToken, pattern)) {
        return true;
      }
    }
    return false;
  }

  function isParentOfAny(path: string, patterns: string[]): boolean {
    for (const pattern of patterns) {
      if (isParentOfPattern(path, pattern)) return true;
    }
    return false;
  }

  // Pattern matching rules
  function matchesPattern(
    fullPath: string,
    keyOrIndexToken: string,
    pattern: string,
  ): boolean {
    // Exact full path
    if (fullPath === pattern) return true;

    // Array patterns
    const arrayParsed = parseArrayPattern(pattern);
    if (arrayParsed) {
      const { base, indices, suffix } = arrayParsed;

      // Root array (pattern like "[0]", "[*]", "[1-*]")
      const isRootArrayPattern = base === '';

      if (suffix) {
        // suffix like ".name" or "*name"
        const match = matchArrayElementPrefix(fullPath, base);
        if (!match) return false;
        const { index: idx, rest } = match;
        if (!indexMatches(idx, indices)) return false;

        if (suffix.startsWith('.')) {
          const expected = suffix;
          return rest === expected || rest.startsWith(`${expected}.`);
        }
        if (suffix.startsWith('*') && !suffix.startsWith('*.')) {
          const propName = suffix.slice(1);
          return rest === `.${propName}` || rest.startsWith(`.${propName}.`);
        }
        return false;
      }

      // No suffix means matching element itself
      const match = matchArrayElementExact(fullPath, base, isRootArrayPattern);
      if (!match) return false;
      return indexMatches(match.index, indices);
    }

    // Nested wildcard "prop.*nested"
    const dotStar = pattern.indexOf('.*');
    if (dotStar !== -1) {
      const base = pattern.slice(0, dotStar);
      const target = pattern.slice(dotStar + 2);
      if (!base || !target) return false;
      if (!fullPath.startsWith(`${base}.`)) return false;
      const afterBase = fullPath.slice(base.length + 1);
      // match any descendant whose last segment equals target
      const segments = afterBase.split('.');
      return segments.includes(target) && keyOrIndexToken === target;
    }

    // Patterns starting with '*.prop' (nested only)
    if (pattern.startsWith('*.')) {
      const prop = pattern.slice(2);
      return fullPath.includes('.') && keyOrIndexToken === prop;
    }

    // Patterns starting with '*prop' (global wildcard by exact key name)
    if (pattern.startsWith('*') && !pattern.startsWith('*.')) {
      const prop = pattern.slice(1);
      return keyOrIndexToken === prop;
    }

    // Simple root-only property name (no wildcard/brackets)
    if (
      !pattern.includes('*') &&
      !pattern.includes('[') &&
      !pattern.includes(']')
    ) {
      // Only match root-level property
      return !fullPath.includes('.') && fullPath === pattern;
    }

    return false;
  }

  function isParentOfPattern(path: string, pattern: string): boolean {
    // Exact path can't be its own parent
    if (pattern === path) return false;

    // Array patterns
    const arrayParsed = parseArrayPattern(pattern);
    if (arrayParsed) {
      const { base, suffix } = arrayParsed;
      // Parent of base
      if (base) {
        if (path === base) return true;
        if (base.startsWith(`${path}.`)) return true;
      } else {
        // root array: parent is empty path, but since we never call with empty, nothing to do
      }
      // Parent of element with suffix
      if (suffix) {
        // path may be like `${base}[n]` or any ancestor of that
        if (path.startsWith(base) && /\[\d+\]$/.test(path)) return true;
      }
      return false;
    }

    // Nested wildcard like 'prop.*nested'
    const dotStar = pattern.indexOf('.*');
    if (dotStar !== -1) {
      const base = pattern.slice(0, dotStar);
      return path === base || base.startsWith(`${path}.`);
    }

    // '*.prop' nested-only: any ancestor except root prop with same name
    if (pattern.startsWith('*.')) {
      const prop = pattern.slice(2);
      // If path ends with that prop, it's not parent; otherwise any other path can be parent
      return !path.endsWith(`.${prop}`) && path !== prop;
    }

    // '*prop' global: any ancestor can be parent
    if (pattern.startsWith('*') && !pattern.startsWith('*.')) {
      return true;
    }

    // Exact dot path: parent if pattern starts with `${path}.`
    if (!pattern.includes('*') && !pattern.includes('[')) {
      return pattern.startsWith(`${path}.`);
    }

    return false;
  }

  function parseArrayPattern(pattern: string): null | {
    base: string; // '' means root array
    indices: number[] | '*' | { from: number };
    suffix: string; // may be empty string
  } {
    const m = pattern.match(/^(.*)\[([^\]]+)](.*)$/);
    if (!m) return null;
    let base = m[1] ?? '';
    const indexPart = m[2] ?? '';
    const suffix = m[3] ?? '';
    if (base.endsWith('.')) base = base.slice(0, -1);

    let indices: number[] | '*' | { from: number };
    if (indexPart === '*') {
      indices = '*';
    } else if (/^\d+-\*$/.test(indexPart)) {
      const start = parseInt(indexPart.split('-')[0]!, 10);
      indices = { from: start };
    } else if (/^\d+-\d+$/.test(indexPart)) {
      const [startStr, endStr] = indexPart.split('-');
      const start = parseInt(startStr!, 10);
      const end = parseInt(endStr!, 10);
      const arr: number[] = [];
      for (let i = start; i <= end; i++) arr.push(i);
      indices = arr;
    } else if (/^\d+$/.test(indexPart)) {
      indices = [parseInt(indexPart, 10)];
    } else {
      return null;
    }

    return { base, indices, suffix };
  }

  function matchArrayElementPrefix(
    fullPath: string,
    base: string,
  ): null | {
    index: number;
    rest: string; // remains including leading dot for properties, e.g., ".name" or ""
  } {
    // fullPath examples: 'items[0].name', '[0].name', 'items[2]', '[1]'
    const pattern =
      base ? `^${escapeRegExp(base)}\\[(\\d+)](.*)$` : `^\\[(\\d+)](.*)$`;
    const m = fullPath.match(new RegExp(pattern));
    if (!m) return null;
    const index = parseInt(m[1]!, 10);
    const rest = m[2] ?? '';
    if (Number.isNaN(index)) return null;
    return { index, rest };
  }

  function matchArrayElementExact(
    fullPath: string,
    base: string,
    isRoot: boolean,
  ): null | { index: number } {
    const pattern =
      isRoot ? `^\\[(\\d+)]$` : `^${escapeRegExp(base)}\\[(\\d+)]$`;
    const m = fullPath.match(new RegExp(pattern));
    if (!m) return null;
    const index = parseInt(m[1]!, 10);
    if (Number.isNaN(index)) return null;
    return { index };
  }

  function indexMatches(
    index: number,
    indices: number[] | '*' | { from: number },
  ): boolean {
    if (indices === '*') return true;
    if (Array.isArray(indices)) return indices.includes(index);
    return index >= indices.from;
  }

  function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function normalizePatterns(input?: string[] | string): string[] | undefined {
    if (input === undefined) return undefined;
    const arr = Array.isArray(input) ? input : [input];
    const cleaned = arr.filter((p) => p.trim().length > 0);
    return cleaned.length > 0 ? cleaned : undefined;
  }

  return filterValue(objOrArray, '') as any;
}
