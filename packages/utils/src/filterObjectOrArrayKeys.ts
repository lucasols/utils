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
 * @param options.rejectEmptyObjectsInArray - Whether to reject empty objects in arrays (default: true).
 * @returns The filtered object or array.
 */
export function filterObjectOrArrayKeys(
  objOrArray: Record<string, any> | Record<string, any>[],
  {
    filterKeys,
    rejectKeys,
    rejectEmptyObjectsInArray = true,
  }: {
    filterKeys?: string[] | string;
    rejectKeys?: string[] | string;
    rejectEmptyObjectsInArray?: boolean;
  },
): Record<string, any> | Record<string, any>[] {
  const filterPatterns = normalizePatterns(filterKeys);
  const rejectPatterns = normalizePatterns(rejectKeys);

  // Track visited objects to detect circular references
  const visited = new WeakSet();

  function normalizePatterns(
    patterns: string[] | string | undefined,
  ): string[] {
    if (!patterns) return [];
    return Array.isArray(patterns) ? patterns : [patterns];
  }

  function matchesPattern(path: string, pattern: string): boolean {
    // Direct match
    if (path === pattern) return true;

    // Handle array range patterns (must come before wildcard check)
    if (pattern.includes('[') && pattern.includes('-')) {
      return matchesRangePattern(path, pattern);
    }

    // Handle simple array index patterns like [0], [1], [2]
    if (pattern.match(/^\[\d+\]$/)) {
      return path === pattern;
    }

    // Handle wildcard patterns
    if (pattern.includes('*')) {
      return matchesWildcardPattern(path, pattern);
    }

    return false;
  }

  function matchesWildcardPattern(path: string, pattern: string): boolean {
    // Convert pattern to regex
    let regexPattern = escapeRegex(pattern);

    // Handle different wildcard types
    // '*prop' - matches any property named 'prop' at any level
    if (pattern.match(/^\*[^.[]+$/)) {
      const propName = pattern.slice(1);
      const pathSegments = path.split(/[.[\]]+/).filter(Boolean);
      return pathSegments[pathSegments.length - 1] === propName;
    }

    // '*.prop' - matches nested property 'prop' (not at root)
    if (pattern.match(/^\*\.[^*]+$/)) {
      const propName = pattern.slice(2);
      if (!path.includes('.')) return false;
      const pathSegments = path.split(/[.[\]]+/).filter(Boolean);
      return pathSegments[pathSegments.length - 1] === propName;
    }

    // Handle patterns with wildcards in various positions
    regexPattern = regexPattern
      .replace(/\\\*/g, '.*') // Replace escaped * with .*
      .replace(/\\\[/g, '\\[')
      .replace(/\\\]/g, '\\]')
      .replace(/\\\./g, '\\.');

    // Handle [*] patterns
    regexPattern = regexPattern.replace(/\\\[\\.\*\\\]/g, '\\[\\d+\\]');

    // Handle patterns like 'prop.*nested' or '*.*.name'
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
  }

  function matchesRangePattern(path: string, pattern: string): boolean {
    // Extract range from pattern
    const rangeMatch = pattern.match(/\[(\d+)-(\d+|\*)\]/);
    if (!rangeMatch) return false;

    const rangeStart = parseInt(rangeMatch[1] ?? '0');
    const rangeEnd =
      rangeMatch[2] === '*' ? Infinity : parseInt(rangeMatch[2] ?? '0');

    // Extract index from path
    const indexMatch = path.match(/\[(\d+)\]/);
    if (!indexMatch) return false;

    const index = parseInt(indexMatch[1] ?? '0');

    // Check if index is in range
    if (index < rangeStart || index > rangeEnd) return false;

    // Check if the rest of the pattern matches
    const patternWithIndex = pattern.replace(rangeMatch[0], `[${index}]`);
    return path === patternWithIndex;
  }

  function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function shouldIncludePath(path: string): boolean | 'partial' {
    const hasFilters = filterPatterns.length > 0;
    const hasRejects = rejectPatterns.length > 0;

    // Check if explicitly rejected
    if (hasRejects && rejectPatterns.some((p) => matchesPattern(path, p))) {
      return false;
    }

    // If no filters, include everything not rejected
    if (!hasFilters) {
      return true;
    }

    // Check if explicitly included
    if (filterPatterns.some((p) => matchesPattern(path, p))) {
      return true;
    }

    // Check if this path is a child of any included pattern
    // For example, if '[0]' is included, then '[0].name' should also be included
    // This also handles range patterns like '[1-3]' matching '[1].name'
    for (const pattern of filterPatterns) {
      if (path.startsWith(`${pattern}.`) || path.startsWith(`${pattern}[`)) {
        return true;
      }

      // Handle range patterns: if pattern is '[1-3]' and path is '[2].name', check if '[2]' matches '[1-3]'
      if (pattern.includes('[') && pattern.includes('-')) {
        // Extract the array index part of the path
        const pathIndexMatch = path.match(/^(\[\d+\])/);
        if (
          pathIndexMatch?.[1] &&
          matchesRangePattern(pathIndexMatch[1], pattern)
        ) {
          return true;
        }
      }
    }

    // Check if any filter pattern is a child of this path
    // This means we need to traverse deeper
    for (const pattern of filterPatterns) {
      if (pattern.startsWith(`${path}.`) || pattern.startsWith(`${path}[`)) {
        return 'partial';
      }
      // Handle wildcard patterns that might match descendants
      if (pattern.includes('*')) {
        const segments = pattern.split(/[.[\]]+/).filter(Boolean);
        const pathSegments = path.split(/[.[\]]+/).filter(Boolean);
        if (pathSegments.length < segments.length) {
          // Could potentially match descendants
          return 'partial';
        }
      }
    }

    return false;
  }

  function filterValue(value: any, path: string): any {
    // Handle primitives and null/undefined
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value !== 'object') {
      return value;
    }

    // Check for circular references
    if (visited.has(value)) {
      throw new TypeError('Circular references are not supported');
    }
    visited.add(value);

    // Handle arrays
    if (Array.isArray(value)) {
      const result: any[] = [];
      let hasContent = false;

      for (let i = 0; i < value.length; i++) {
        const itemPath = path ? `${path}[${i}]` : `[${i}]`;
        const includeStatus = shouldIncludePath(itemPath);

        if (includeStatus === true) {
          const filtered = filterValue(value[i], itemPath);
          // Apply rejectEmptyObjectsInArray logic even for 'true' status
          if (!rejectEmptyObjectsInArray || !isEmpty(filtered)) {
            result[i] = filtered;
            hasContent = true;
          }
        } else if (includeStatus === 'partial') {
          const filtered = filterValue(value[i], itemPath);
          if (!rejectEmptyObjectsInArray || !isEmpty(filtered)) {
            result[i] = filtered;
            hasContent = true;
          }
        }
      }

      // Return compacted array (remove undefined slots)
      return hasContent ? result.filter((_, i) => i in result) : [];
    }

    // Handle objects
    const result: Record<string, any> = {};

    for (const key in value) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) continue;

      const keyPath = path ? `${path}.${key}` : key;
      const includeStatus = shouldIncludePath(keyPath);

      if (includeStatus === true) {
        result[key] = filterValue(value[key], keyPath);
      } else if (includeStatus === 'partial') {
        const filtered = filterValue(value[key], keyPath);
        result[key] = filtered;
      }
    }

    return result;
  }

  function isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value !== 'object') return false;
    if (Array.isArray(value)) return value.length === 0;
    return Object.keys(value).length === 0;
  }

  return filterValue(objOrArray, '');
}
