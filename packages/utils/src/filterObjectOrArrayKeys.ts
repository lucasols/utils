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
  type PathToken =
    | { type: 'KEY'; name: string }
    | { type: 'INDEX'; index: number };

  const toArray = (v?: string[] | string): string[] =>
    v === undefined ? []
    : Array.isArray(v) ? v
    : [v];

  const filterPatternsRaw = toArray(filterKeys);
  const rejectPatternsRaw = toArray(rejectKeys);
  const hasFilters = filterPatternsRaw.length > 0;
  const hasRejects = rejectPatternsRaw.length > 0;

  const filterPatterns = filterPatternsRaw.map(parsePattern);
  const rejectPatterns = rejectPatternsRaw.map(parsePattern);

  function matchPath(path: PathToken[], pattern: PatternToken[]): boolean {
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
      }
    }
    return rec(0, 0);
  }

  const matchesAnyFilter = (path: PathToken[]) =>
    filterPatterns.some((p) => matchPath(path, p));
  const matchesAnyReject = (path: PathToken[]) =>
    rejectPatterns.some((p) => matchPath(path, p));

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
        if (hasRejects && matchesAnyReject(childPath)) continue;
        const child = value[index];
        const directInclude = hasFilters ? matchesAnyFilter(childPath) : true;
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
      for (const key of Object.keys(value)) {
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
    objOrArray as any,
    startPath,
    initialAllowed,
    stack,
    true,
    false,
  );
  if (built === undefined) return Array.isArray(objOrArray) ? [] : {};
  return built;
}

type PatternToken =
  | { type: 'KEY'; name: string }
  | { type: 'WILDCARD_ONE' }
  | { type: 'WILDCARD_ANY' }
  | { type: 'INDEX'; index: number }
  | { type: 'INDEX_ANY' }
  | { type: 'INDEX_RANGE'; start: number; end: number | null };

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
      if (inside === '*') {
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
