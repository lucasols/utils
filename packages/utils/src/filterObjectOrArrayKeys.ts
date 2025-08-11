import { sortBy } from './arrayUtils';
import { isPlainObject } from './typeGuards';

/**
 * Filters the keys of an object based on the provided patterns.
 *
 * Filtering patterns in `rejectKeys` and `filterKeys`:
 * - `'prop'` - Only root-level properties named 'prop'
 * - `'**prop'` - Any property named exactly 'prop' at any level (root or nested)
 * - `'*.prop'` - Any nested property named 'prop' at second level (excludes root-level matches)
 * - `'test.*.prop'` - Any property named 'prop' at second level of 'test'
 * - `'test.*.test.**prop'` - Any property named 'prop' inside of 'test.*.test'
 * - `'prop.nested'` - Exact nested property paths like `obj.prop.nested`
 * - `'prop.**nested'` - All nested properties inside root `prop` with name `nested`
 * - `'prop[0]'` - The first item of the `prop` array
 * - `'prop[*]'` - All items of the `prop` array
 * - `'prop[0].nested'` - `nested` prop of the first item of the `prop` array
 * - `'prop[*].nested'` - `nested` prop of all items of the `prop` array
 * - `'prop[*]**nested'` - all `nested` props of all items of the `prop` array
 * - `'prop[0-2]'` - The first three items of the `prop` array
 * - `'prop[4-*]'` - All items of the `prop` array from the fourth index to the end
 * - `'prop[0-2].nested.**prop'` - Combining multiple nested patterns is supported
 * - Root array:
 *   - `'[0]'` - The first item of the root array
 *   - `'[*]'` - All items of the array
 *   - `'[0].nested'` - `nested` prop of the first item of the array
 *   - `'[*].nested'` - `nested` prop of all items of the array
 *   - `'[*]**nested'` - all `nested` props of all items of the array
 *   - `'[0-2]'` - The first three items of the array
 *   - `'[4-*]'` - All items of the array from the fourth index to the end
 * - Pattern expansion with parentheses:
 *   - `'prop.test.(prop1|prop2|prop3)'` - Expands to `prop.test.prop1`, `prop.test.prop2`, and `prop.test.prop3`
 *   - `'components[*].(table_id|columns|filters[*].value)'` - Expands to `components[*].table_id`, `components[*].columns`, and `components[*].filters[*].value`
 *   - `'(users|admins)[*].name'` - Expands to `users[*].name` and `admins[*].name`
 * - Array filtering by value:
 *   - `'users[%name="John"]'` - Filters the `users` with the `name` property equal to `John`
 *   - `'users[%name="John" | "Jane"]'` - Value-level OR using `|` for multiple values of same property
 *   - `'users[%name="Alice" || %age=35]'` - Property-level OR using `||` for different properties
 *   - `'users[%age=30 && %role="admin"]'` - Property-level AND using `&&` for different properties
 *   - Note: Mixing `&&` and `||` in the same filter is not supported - use separate filter patterns instead
 *   - `'users[%config.name="John" | "Jane"]'` - Dot notation is supported
 *   - `'users[%name*="oh"]'` - Contains operator (*=) - filters users where name contains "oh"
 *   - `'users[%name^="Jo"]'` - Starts with operator (^=) - filters users where name starts with "Jo"
 *   - `'users[%name$="hn"]'` - Ends with operator ($=) - filters users where name ends with "hn"
 *   - `'users[%name!="John"]'` - Not equal operator (!=) - filters users where name is not "John"
 *   - `'users[%name!*="admin"]'` - Not contains operator (!*=) - filters users where name doesn't contain "admin"
 *   - `'users[i%name="john"]'` - Case-insensitive matching (i% prefix) - matches "John", "JOHN", "john", etc.
 *
 * @param objOrArray - The object or array to filter.
 * @param options - The options for the filter.
 * @param options.filterKeys - The keys to filter.
 * @param options.rejectKeys - The keys to reject.
 * @param options.rejectEmptyObjectsInArray - Whether to reject empty objects in arrays (default: true).
 * @param options.sortKeys - Sort all keys by a specific order (optional, preserves original order when not specified).
 * @param options.sortPatterns - Sort specific keys by pattern. Use to control the order of specific properties. The same patterns as `filterKeys` are supported.
 * @returns The filtered object or array.
 */
export function filterObjectOrArrayKeys(
  objOrArray: Record<string, any> | Record<string, any>[],
  {
    filterKeys,
    rejectKeys,
    rejectEmptyObjectsInArray = true,
    sortKeys,
    sortPatterns,
  }: {
    filterKeys?: string[] | string;
    rejectKeys?: string[] | string;
    rejectEmptyObjectsInArray?: boolean;
    sortKeys?: 'asc' | 'desc' | 'simpleValuesFirst' | false;
    sortPatterns?: string[];
  },
): Record<string, any> | Record<string, any>[] {
  type PathToken =
    | { type: 'KEY'; name: string }
    | { type: 'INDEX'; index: number };

  // Helper function to get nested property value
  function getNestedValue(obj: any, path: string): any {
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
      if (current == null || typeof current !== 'object') {
        return undefined;
      }
      current = current[part];
    }
    return current;
  }

  // Helper function to evaluate a filter condition
  function evaluateCondition(item: any, condition: FilterCondition): boolean {
    const value = getNestedValue(item, condition.property);
    let valueStr = String(value);

    // Apply case-insensitive matching if needed
    if (condition.caseInsensitive) {
      valueStr = valueStr.toLowerCase();
    }

    const processValue = (v: string) =>
      condition.caseInsensitive ? v.toLowerCase() : v;

    switch (condition.operator) {
      case '=':
        return condition.values.some((v) => valueStr === processValue(v));
      case '!=':
        return condition.values.every((v) => valueStr !== processValue(v));
      case '*=':
        return condition.values.some((v) => valueStr.includes(processValue(v)));
      case '!*=':
        return condition.values.every(
          (v) => !valueStr.includes(processValue(v)),
        );
      case '^=':
        return condition.values.some((v) =>
          valueStr.startsWith(processValue(v)),
        );
      case '!^=':
        return condition.values.every(
          (v) => !valueStr.startsWith(processValue(v)),
        );
      case '$=':
        return condition.values.some((v) => valueStr.endsWith(processValue(v)));
      case '!$=':
        return condition.values.every(
          (v) => !valueStr.endsWith(processValue(v)),
        );
      default:
        return false;
    }
  }

  const toArray = (v?: string[] | string): string[] =>
    v === undefined ? []
    : Array.isArray(v) ? v
    : [v];

  const filterPatternsRaw = toArray(filterKeys);
  const rejectPatternsRaw = toArray(rejectKeys);
  const hasFilters = filterPatternsRaw.length > 0;
  const hasRejects = rejectPatternsRaw.length > 0;

  const expandedFilterPatterns = filterPatternsRaw.flatMap(expandPatterns);
  const expandedRejectPatterns = rejectPatternsRaw.flatMap(expandPatterns);

  // Separate patterns with INDEX_FILTER + field selection from others
  const { filterOnlyPatterns, combinedPatterns } = separateFilterPatterns(
    expandedFilterPatterns,
  );

  const filterPatterns = filterOnlyPatterns.map(parsePattern);
  const rejectPatterns = expandedRejectPatterns.map(parsePattern);

  // Parse sort patterns if provided
  const sortPatternsRaw = toArray(sortPatterns);
  const expandedSortPatterns = sortPatternsRaw.flatMap(expandPatterns);
  const sortPatternsParsed = expandedSortPatterns.map(parsePattern);

  // Handle combined patterns (INDEX_FILTER + field selection) with two-step approach
  let dataToProcess = objOrArray;
  if (combinedPatterns.length > 0) {
    // Group by filter part to avoid applying the same filter multiple times
    const groupedByFilter = new Map<string, string[]>();
    for (const { filterPart, fieldPart } of combinedPatterns) {
      if (!groupedByFilter.has(filterPart)) {
        groupedByFilter.set(filterPart, []);
      }
      groupedByFilter.get(filterPart)!.push(fieldPart);
    }

    const combinedResult = Array.isArray(objOrArray) ? [] : {};
    for (const [filterPart, fieldParts] of groupedByFilter) {
      // First apply the filter
      const filteredResult = filterObjectOrArrayKeys(objOrArray, {
        filterKeys: [filterPart],
        rejectKeys,
        rejectEmptyObjectsInArray,
      });
      // Then apply all field selections for this filter
      const fieldSelectedResult = filterObjectOrArrayKeys(filteredResult, {
        filterKeys: fieldParts,
        rejectEmptyObjectsInArray,
      });

      // Merge results
      if (Array.isArray(combinedResult) && Array.isArray(fieldSelectedResult)) {
        // For arrays, we need to merge the items
        combinedResult.push(...fieldSelectedResult);
      } else if (
        !Array.isArray(combinedResult) &&
        !Array.isArray(fieldSelectedResult)
      ) {
        // For objects, merge properties
        Object.assign(combinedResult, fieldSelectedResult);
      }
    }

    // If we had combined patterns and no other patterns, return the combined result
    if (filterOnlyPatterns.length === 0) {
      return combinedResult;
    }

    // Use the combined result for further processing if there are more patterns
    dataToProcess = combinedResult;
  }

  function matchPath(
    path: PathToken[],
    pattern: PatternToken[],
    value?: any,
  ): boolean {
    function rec(pi: number, pti: number): boolean {
      if (pti >= pattern.length) return pi === path.length;
      const pt = pattern[pti]!;
      if (pt.type === 'WILDCARD_ANY') {
        if (rec(pi, pti + 1)) return true;
        if (pi < path.length) return rec(pi + 1, pti);
        return false;
      }
      if (pt.type === 'WILDCARD_ONE') {
        let j = pi;
        let sawKey = false;
        while (j < path.length) {
          if (path[j]!.type === 'KEY') sawKey = true;
          if (sawKey && rec(j, pti + 1)) return true;
          j += 1;
        }
        return false;
      }
      if (pi >= path.length) return false;
      const ct = path[pi]!;
      switch (pt.type) {
        case 'KEY':
          if (ct.type === 'KEY' && ct.name === pt.name)
            return rec(pi + 1, pti + 1);
          // allow skipping index tokens transparently when matching keys
          if (ct.type === 'INDEX') return rec(pi + 1, pti);
          return false;
        case 'INDEX':
          if (ct.type === 'INDEX' && ct.index === pt.index)
            return rec(pi + 1, pti + 1);
          return false;
        case 'INDEX_ANY':
          if (ct.type === 'INDEX') return rec(pi + 1, pti + 1);
          return false;
        case 'INDEX_RANGE':
          if (ct.type === 'INDEX') {
            const okLower = ct.index >= pt.start;
            const okUpper = pt.end === null ? true : ct.index <= pt.end;
            if (okLower && okUpper) return rec(pi + 1, pti + 1);
          }
          return false;
        case 'INDEX_FILTER':
          if (ct.type === 'INDEX' && value !== undefined) {
            // Evaluate filter conditions
            const results = pt.conditions.map((cond) =>
              evaluateCondition(value, cond),
            );
            const matches =
              pt.logic === 'AND' ?
                results.every((r) => r)
              : results.some((r) => r);
            if (matches) return rec(pi + 1, pti + 1);
          }
          return false;
      }
    }
    return rec(0, 0);
  }

  const matchesAnyFilter = (path: PathToken[], value?: any) =>
    filterPatterns.some((p) => matchPath(path, p, value));
  const matchesAnyReject = (path: PathToken[], value?: any) =>
    rejectPatterns.some((p) => matchPath(path, p, value));

  // Helper functions for sorting
  function getSortPriority(path: PathToken[]): number {
    // Find the first matching sort pattern and return its index (lower index = higher priority)
    for (let i = 0; i < sortPatternsParsed.length; i++) {
      if (matchPath(path, sortPatternsParsed[i]!)) {
        return i;
      }
    }
    // If no pattern matches, return a high number (low priority)
    return sortPatternsParsed.length;
  }

  function applySortKeys(
    keys: string[],
    obj: any,
    sortOrder: 'asc' | 'desc' | 'simpleValuesFirst',
  ): string[] {
    if (sortOrder === 'asc') {
      return [...keys].sort();
    }
    if (sortOrder === 'desc') {
      return [...keys].sort().reverse();
    }
    // sortOrder is 'simpleValuesFirst'
    return sortBy(
      sortBy(keys, (k) => k),
      (key) => {
        const value = obj[key];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value) && value.length === 0) return 0;
          if (isPlainObject(value)) {
            const objLength = Object.keys(value).length;
            return 1.99 + objLength * -0.001;
          }
          if (Array.isArray(value)) {
            const allItemsArePrimitives = value.every(
              (item) =>
                typeof item === 'string' ||
                typeof item === 'number' ||
                typeof item === 'boolean' ||
                item === null ||
                item === undefined,
            );
            if (allItemsArePrimitives) {
              return 1.9 + value.length * -0.001;
            } else {
              return 1.5 + value.length * -0.01;
            }
          }
          if (typeof value === 'string') return 3;
          return 2;
        }
        return 0;
      },
      'desc',
    );
  }

  function sortKeysWithPatterns(
    keys: string[],
    obj: any,
    currentPath: PathToken[],
  ): string[] {
    // If no sorting is requested and no sort patterns, return original order
    if (!sortKeys && sortPatternsParsed.length === 0) {
      return keys;
    }

    if (sortPatternsParsed.length === 0) {
      return sortKeys ? applySortKeys(keys, obj, sortKeys) : keys;
    }

    // Sort by pattern priority first, then by the general sort order
    const sortedKeys = [...keys].sort((a, b) => {
      const pathA = currentPath.concat({ type: 'KEY', name: a });
      const pathB = currentPath.concat({ type: 'KEY', name: b });

      const priorityA = getSortPriority(pathA);
      const priorityB = getSortPriority(pathB);

      if (priorityA !== priorityB) {
        return priorityA - priorityB; // Lower priority number = higher priority
      }

      // Same priority, use general sort order
      if (sortKeys === 'desc') {
        return b.localeCompare(a);
      }
      if (sortKeys === 'asc') {
        return a.localeCompare(b);
      }
      // If no sortKeys specified, maintain original relative order
      return 0;
    });

    return sortedKeys;
  }

  const build = (
    value: any,
    path: PathToken[],
    allowedByFilter: boolean,
    stack: WeakSet<object>,
    isRoot: boolean,
    parentIsArray: boolean,
  ): any => {
    if (Array.isArray(value)) {
      if (stack.has(value)) {
        throw new TypeError('Circular references are not supported');
      }
      stack.add(value);
      const out: any[] = [];
      const includeAllChildren = allowedByFilter || !hasFilters;
      for (let index = 0; index < value.length; index += 1) {
        const childPath = path.concat({ type: 'INDEX', index });
        const child = value[index];
        if (hasRejects && matchesAnyReject(childPath, child)) continue;
        const directInclude =
          hasFilters ? matchesAnyFilter(childPath, child) : true;
        const childAllowed = includeAllChildren || directInclude;
        if (isPlainObject(child) || Array.isArray(child)) {
          const builtChild = build(
            child,
            childPath,
            childAllowed,
            stack,
            false,
            true,
          );
          if (builtChild !== undefined) {
            out.push(builtChild);
          }
        } else {
          if (childAllowed) {
            out.push(child);
          }
        }
      }
      stack.delete(value);
      const filteredOut =
        rejectEmptyObjectsInArray ?
          out.filter(
            (item) => !(isPlainObject(item) && Object.keys(item).length === 0),
          )
        : out;
      if (filteredOut.length === 0 && !allowedByFilter && !isRoot)
        return undefined;
      return filteredOut;
    }

    if (isPlainObject(value)) {
      if (stack.has(value)) {
        throw new TypeError('Circular references are not supported');
      }
      stack.add(value);
      const result: Record<string, any> = {};
      const includeAllChildren = allowedByFilter || !hasFilters;
      const sortedKeys = sortKeysWithPatterns(Object.keys(value), value, path);
      for (const key of sortedKeys) {
        const childPath = path.concat({ type: 'KEY', name: key });
        if (hasRejects && matchesAnyReject(childPath)) continue;
        const val = (value as any)[key];
        const directInclude = hasFilters ? matchesAnyFilter(childPath) : true;
        const childAllowed = includeAllChildren || directInclude;
        if (isPlainObject(val) || Array.isArray(val)) {
          const builtChild = build(
            val,
            childPath,
            childAllowed,
            stack,
            false,
            false,
          );
          if (builtChild === undefined) {
            continue;
          }
          if (
            Array.isArray(builtChild) &&
            builtChild.length === 0 &&
            !childAllowed
          ) {
            continue;
          }
          if (
            isPlainObject(builtChild) &&
            Object.keys(builtChild).length === 0 &&
            !childAllowed
          ) {
            continue;
          }
          result[key] = builtChild;
        } else {
          if (childAllowed) {
            result[key] = val;
          }
        }
      }
      stack.delete(value);
      if (Object.keys(result).length === 0 && !allowedByFilter && !isRoot) {
        if (parentIsArray && !rejectEmptyObjectsInArray) {
          return {};
        }
        return undefined;
      }
      return result;
    }

    return allowedByFilter || !hasFilters ? value : undefined;
  };

  const startPath: PathToken[] = [];
  const initialAllowed = !hasFilters;
  const stack = new WeakSet<object>();
  const built = build(
    dataToProcess as any,
    startPath,
    initialAllowed,
    stack,
    true,
    false,
  );
  if (built === undefined) return Array.isArray(dataToProcess) ? [] : {};
  return built;
}

type FilterCondition = {
  property: string; // The property path to check (e.g., "name" or "config.name")
  operator: '=' | '!=' | '*=' | '^=' | '$=' | '!*=' | '!^=' | '!$=';
  values: string[]; // List of values to match (OR condition)
  caseInsensitive?: boolean; // Whether to perform case-insensitive matching
};

type PatternToken =
  | { type: 'KEY'; name: string }
  | { type: 'WILDCARD_ONE' }
  | { type: 'WILDCARD_ANY' }
  | { type: 'INDEX'; index: number }
  | { type: 'INDEX_ANY' }
  | { type: 'INDEX_RANGE'; start: number; end: number | null }
  | {
      type: 'INDEX_FILTER';
      conditions: FilterCondition[];
      logic: 'AND' | 'OR'; // For multiple conditions
    };

function parseFilterConditions(filterContent: string): PatternToken | null {
  const conditions: FilterCondition[] = [];
  let logic: 'AND' | 'OR' = 'AND';

  // Check if it starts with i for case-insensitive matching (after the % is removed)
  const caseInsensitive = filterContent.startsWith('i');
  const content = caseInsensitive ? filterContent.slice(1) : filterContent;

  // Check for mixed && and || operators - this is not supported
  const hasAnd = content.includes('&&');
  const hasOr = content.includes(' || ');

  if (hasAnd && hasOr) {
    throw new Error(
      'Mixing && and || operators in the same filter is not supported. Use separate filter patterns instead.',
    );
  }

  // Split by && first to handle AND conditions
  const andGroups = content.split('&&').map((s) => s.trim());

  for (const andGroup of andGroups) {
    // Check if this group contains OR conditions
    if (andGroup.includes(' || ')) {
      logic = 'OR';
      const orConditions = andGroup.split(' || ').map((s) => s.trim());
      for (const orCondition of orConditions) {
        const parsed = parseSingleCondition(orCondition, caseInsensitive);
        if (parsed) {
          conditions.push(parsed);
        }
      }
    } else {
      const parsed = parseSingleCondition(andGroup, caseInsensitive);
      if (parsed) {
        conditions.push(parsed);
      }
    }
  }

  if (conditions.length === 0) {
    return null;
  }

  return {
    type: 'INDEX_FILTER',
    conditions,
    logic,
  };
}

function parseSingleCondition(
  condition: string,
  caseInsensitive: boolean = false,
): FilterCondition | null {
  // Remove % if present at the start
  const cleanCondition =
    condition.startsWith('%') ? condition.slice(1) : condition;

  // Find the operator
  let operator: FilterCondition['operator'] | null = null;
  let operatorIndex = -1;
  let operatorLength = 0;

  // Check for operators in order of specificity (longer ones first)
  const operators: Array<[string, FilterCondition['operator']]> = [
    ['!*=', '!*='],
    ['!^=', '!^='],
    ['!$=', '!$='],
    ['!=', '!='],
    ['*=', '*='],
    ['^=', '^='],
    ['$=', '$='],
    ['=', '='],
  ];

  for (const [op, opType] of operators) {
    const index = cleanCondition.indexOf(op);
    if (index !== -1) {
      operator = opType;
      operatorIndex = index;
      operatorLength = op.length;
      break;
    }
  }

  if (operator === null || operatorIndex === -1) {
    return null;
  }

  const property = cleanCondition.slice(0, operatorIndex).trim();

  // Extract the value(s) after the operator
  const valueStr = cleanCondition.slice(operatorIndex + operatorLength).trim();

  // Parse values (handle "value1" | "value2" format)
  const values: string[] = [];

  // Check if it contains OR values
  if (valueStr.includes(' | ')) {
    const parts = valueStr.split(' | ');
    for (const part of parts) {
      const trimmed = part.trim();
      // Remove quotes if present
      const value =
        trimmed.startsWith('"') && trimmed.endsWith('"') ?
          trimmed.slice(1, -1)
        : trimmed;
      values.push(value);
    }
  } else {
    // Single value
    const trimmed = valueStr.trim();
    const value =
      trimmed.startsWith('"') && trimmed.endsWith('"') ?
        trimmed.slice(1, -1)
      : trimmed;
    values.push(value);
  }

  return {
    property,
    operator,
    values,
    caseInsensitive,
  };
}

function separateFilterPatterns(patterns: string[]): {
  filterOnlyPatterns: string[];
  combinedPatterns: Array<{ filterPart: string; fieldPart: string }>;
} {
  const filterOnlyPatterns: string[] = [];
  const combinedPatterns: Array<{ filterPart: string; fieldPart: string }> = [];

  for (const pattern of patterns) {
    // Check if pattern contains INDEX_FILTER followed by field selection
    const filterMatch = pattern.match(/^(.+\[[i%][^[\]]*\])\.(.+)$/);
    if (filterMatch?.[1] && filterMatch[2]) {
      const filterPart = filterMatch[1];
      const fieldPart = filterMatch[2];
      // Convert the field part to use [*] instead of the filter
      const baseArrayPath = filterPart.replace(/\[[i%][^[\]]*\]/, '[*]');
      combinedPatterns.push({
        filterPart,
        fieldPart: `${baseArrayPath}.${fieldPart}`,
      });
    } else {
      filterOnlyPatterns.push(pattern);
    }
  }

  return { filterOnlyPatterns, combinedPatterns };
}

function expandPatterns(pattern: string): string[] {
  function expandSingle(str: string): string[] {
    const start = str.indexOf('(');
    if (start === -1) {
      return [str];
    }

    const end = str.indexOf(')', start);
    if (end === -1) {
      return [str];
    }

    const before = str.slice(0, start);
    const inside = str.slice(start + 1, end);
    const after = str.slice(end + 1);

    if (!inside.includes('|')) {
      return expandSingle(before + inside + after);
    }

    const options = inside
      .split('|')
      .filter((option) => option.trim().length > 0);
    const results: string[] = [];

    for (const option of options) {
      const newStr = before + option + after;
      results.push(...expandSingle(newStr));
    }

    return results;
  }

  return expandSingle(pattern);
}

function parsePattern(pattern: string): PatternToken[] {
  const tokens: PatternToken[] = [];
  let i = 0;
  const n = pattern.length;
  const pushKey = (name: string) => {
    if (name.length === 0) return;
    tokens.push({ type: 'KEY', name });
  };
  while (i < n) {
    const ch = pattern[i];
    if (ch === '.') {
      i += 1;
      continue;
    }
    if (ch === '[') {
      const end = pattern.indexOf(']', i + 1);
      const inside =
        end === -1 ? pattern.slice(i + 1) : pattern.slice(i + 1, end);

      // Check if it's a filter pattern (starts with % or i%)
      if (inside.startsWith('%') || inside.startsWith('i%')) {
        // For i%name pattern, pass iname to parseFilterConditions
        // For %name pattern, pass name to parseFilterConditions
        // For %iname pattern, pass iname to parseFilterConditions
        let filterContent: string;
        if (inside.startsWith('i%')) {
          filterContent = `i${inside.slice(2)}`; // Convert i%name to iname
        } else if (inside.startsWith('%')) {
          filterContent = inside.slice(1); // Remove the % prefix
        } else {
          filterContent = inside;
        }
        const filterToken = parseFilterConditions(filterContent);
        if (filterToken) {
          tokens.push(filterToken);
        }
      } else if (inside === '*') {
        tokens.push({ type: 'INDEX_ANY' });
      } else if (inside.includes('-')) {
        const parts = inside.split('-');
        const startStr = parts[0] ?? '';
        const endStr = parts[1] ?? '';
        const start = parseInt(startStr, 10);
        const endNum = endStr === '*' ? null : parseInt(endStr, 10);
        tokens.push({
          type: 'INDEX_RANGE',
          start,
          end: endNum === null || Number.isFinite(endNum) ? endNum : null,
        });
      } else if (inside.length > 0) {
        const idx = parseInt(inside, 10);
        tokens.push({ type: 'INDEX', index: idx });
      }
      i = end === -1 ? n : end + 1;
      continue;
    }
    if (ch === '*') {
      if (pattern[i + 1] === '*') {
        tokens.push({ type: 'WILDCARD_ANY' });
        i += 2;
        let j = i;
        while (j < n) {
          const c = pattern[j];
          if (c === '.' || c === '[') break;
          j += 1;
        }
        if (j > i) {
          pushKey(pattern.slice(i, j));
          i = j;
        }
        continue;
      } else {
        tokens.push({ type: 'WILDCARD_ONE' });
        i += 1;
        continue;
      }
    }
    let j = i;
    while (j < n) {
      const c = pattern[j];
      if (c === '.' || c === '[') break;
      j += 1;
    }
    pushKey(pattern.slice(i, j));
    i = j;
  }
  return tokens;
}
