import { arrayWithPrevAndIndex, filterAndMap } from './arrayUtils';
import { isObject } from './assertions';
import { deepEqual } from './deepEqual';
import { clampMin } from './mathUtils';
import { omit, pick } from './objUtils';
import { defer } from './promiseUtils';
import { isPlainObject } from './typeGuards';
import { yamlStringify, YamlStringifyOptions } from './yamlStringify';

export function createLoggerStore({
  filterKeys: defaultFilterKeys,
  rejectKeys: defaultRejectKeys,
  splitLongLines: defaultSplitLongLines = true,
  maxLineLengthBeforeSplit: defaultMaxLineLengthBeforeSplit = 80,
  fromLastSnapshot: defaultFromLastSnapshot = false,
  arrays: defaultArrays = { firstNItems: 1 },
  changesOnly: defaultChangesOnly = false,
  useEmojiForBooleans: defaultUseEmojiForBooleans = true,
}: {
  filterKeys?: string[];
  rejectKeys?: string[];
  splitLongLines?: true;
  maxLineLengthBeforeSplit?: number;
  fromLastSnapshot?: boolean;
  arrays?: 'all' | 'firstAndLast' | 'length' | { firstNItems: number };
  changesOnly?: boolean;
  useEmojiForBooleans?: boolean;
} = {}) {
  let logs: Record<string, unknown>[] = [];
  let logsTime: number[] = [];
  let startTime = Date.now();
  let onNextLog: () => void = () => {};

  function reset(keepLastRender = false) {
    logs = keepLastRender ? [logs.at(-1)!] : [];
    logsTime = [];
    startTime = Date.now();
  }

  function add(
    render: Record<string, unknown> | readonly Record<string, unknown>[],
  ) {
    if (!isObject(render)) {
      for (const [i, r] of render.entries()) {
        logs.push({
          i: i + 1,
          ...r,
        });
        logsTime.push(Date.now() - startTime);
      }
    } else {
      logs.push(render);
      logsTime.push(Date.now() - startTime);
    }

    onNextLog();

    if (logs.length > 100) {
      throw new Error('Too many logs');
    }
  }

  function logsCount() {
    return logs.filter((item) => !item._lastSnapshotMark).length;
  }

  async function waitNextLog(timeout = 50) {
    return new Promise<void>((resolve) => {
      const timeoutId = setTimeout(() => {
        throw new Error('Timeout');
      }, timeout);

      onNextLog = () => {
        clearTimeout(timeoutId);
        resolve();
      };
    });
  }

  function getSnapshot({
    arrays = defaultArrays,
    changesOnly = defaultChangesOnly,
    filterKeys = defaultFilterKeys,
    rejectKeys = defaultRejectKeys,
    includeLastSnapshotEndMark = true,
    splitLongLines = defaultSplitLongLines,
    maxLineLengthBeforeSplit = defaultMaxLineLengthBeforeSplit,
    fromLastSnapshot = defaultFromLastSnapshot,
    useEmojiForBooleans = defaultUseEmojiForBooleans,
  }: {
    arrays?: 'all' | 'firstAndLast' | 'length' | { firstNItems: number };
    changesOnly?: boolean;
    filterKeys?: string[];
    rejectKeys?: string[];
    includeLastSnapshotEndMark?: boolean;
    splitLongLines?: boolean;
    maxLineLengthBeforeSplit?: number;
    fromLastSnapshot?: boolean;
    useEmojiForBooleans?: boolean;
  } = {}) {
    let rendersToUse = logs;

    if (changesOnly || filterKeys || rejectKeys) {
      rendersToUse = [];

      for (let { item, prev } of arrayWithPrevAndIndex(logs)) {
        if (item._lastSnapshotMark || item._mark) {
          rendersToUse.push(item);
          continue;
        }

        if (filterKeys) {
          prev = prev && pick(prev, filterKeys);
          item = pick(item, filterKeys);
        }

        if (rejectKeys) {
          prev = prev && omit(prev, rejectKeys);
          item = omit(item, rejectKeys);
        }

        if (!deepEqual(prev, item)) {
          rendersToUse.push(item);
        }
      }
    }

    if (fromLastSnapshot) {
      const lastSnapshotMark = rendersToUse.findLastIndex(
        (item) => item._lastSnapshotMark === true,
      );

      rendersToUse = rendersToUse.slice(clampMin(lastSnapshotMark, 0));
    }

    logs.push({ _lastSnapshotMark: true });

    const propDivider = '⋅';

    const snapShot = `\n${filterAndMap(rendersToUse, (render, i) => {
      if (render._lastSnapshotMark) {
        if (includeLastSnapshotEndMark) {
          if (rendersToUse.length === 1) {
            return '⋅⋅⋅';
          }

          if (i !== rendersToUse.length - 1) {
            return '⋅⋅⋅';
          }

          return false;
        } else {
          return false;
        }
      }

      if (render._mark) {
        const prevIsLastSnapshotMark = rendersToUse[i - 1]?._lastSnapshotMark;
        let mark = `${
          prevIsLastSnapshotMark ? '' : '\n'
        }>>> ${String(render._mark as string)}`;

        const nextRender = rendersToUse[i + 1];

        if (nextRender && !nextRender._mark && !nextRender._lastSnapshotMark) {
          mark = `${mark}\n`;
        }

        return mark;
      }

      let line = '';

      for (const [key, _value] of Object.entries(render)) {
        let value = _value;

        if (Array.isArray(value)) {
          if (arrays === 'length') {
            value = `Array(${value.length})`;
          } else if (arrays === 'firstAndLast' && value.length > 2) {
            const intermediateSize = clampMin(value.length - 2, 0);

            value = [value[0], `…(${intermediateSize} between)`, value.at(-1)];
          } else if (typeof arrays === 'object' && value.length > 2) {
            value = [
              ...value.slice(0, arrays.firstNItems),
              `…(${value.length - arrays.firstNItems} more)`,
            ];
          }
        }

        if (typeof value === 'boolean' && useEmojiForBooleans) {
          value = value ? '✅' : '❌';
        }

        if (value === '') {
          value = `''`;
        }

        if (typeof value === 'object' && value !== null) {
          value = JSON.stringify(value)
            .replace(/:true/g, ':✅')
            .replace(/:false/g, ':❌')
            .replace(/:""/g, ":''")
            .replace(/"/g, '')
            .replace(/,/g, ', ');
        }

        line += `${key}: ${value} ${propDivider} `;
      }

      line = line.slice(0, (propDivider.length + 2) * -1);

      if (splitLongLines && line.length > maxLineLengthBeforeSplit) {
        const parts = line.split(` ${propDivider} `);

        if (parts.length === 1) {
          return line;
        }

        line = '';

        const propDividerML = '⋅';

        for (const { item, index } of arrayWithPrevAndIndex(parts)) {
          if (index === 0) {
            line += `┌─\n${propDividerML} `;
          } else if (index === parts.length - 1) {
            line += `${propDividerML} `;
          } else {
            line += `${propDividerML} `;
          }

          line += `${item}\n`;

          if (index === parts.length - 1) {
            line += '└─';
          }
        }
      } else {
        line = `-> ${line}`;
      }

      return line;
    }).join('\n')}\n`;

    return snapShot === `\n⋅⋅⋅\n` ? '⋅⋅⋅empty⋅⋅⋅' : snapShot;
  }

  function addMark(label: string) {
    add({ _mark: label });
  }

  return {
    add,
    reset,
    getSnapshot,
    waitNextLog,
    get changesSnapshot() {
      return getSnapshot({ changesOnly: true });
    },
    get snapshot() {
      return getSnapshot();
    },
    get snapshotFromLast() {
      return getSnapshot({ fromLastSnapshot: true });
    },
    logsCount,
    get rendersTime() {
      return logsTime;
    },
    addMark,
  };
}

export function getResultFn<T extends (...args: any[]) => any>(
  fnGetter: () => T,
  wrapper?: (...args: any[]) => any,
): T {
  return ((...args: any[]) => {
    const fn = fnGetter();

    if (wrapper) {
      return wrapper(fn(...args));
    } else {
      return fn(...args);
    }
  }) as T;
}

export function waitController(): {
  wait: Promise<void>;
  stopWaiting: () => void;
  stopWaitingAfter: (ms: number) => void;
} {
  const { promise, resolve } = defer();

  return {
    wait: promise,
    stopWaiting: () => {
      resolve();
    },
    stopWaitingAfter: (ms: number) => {
      setTimeout(() => {
        resolve();
      }, ms);
    },
  };
}

function parseArrayPattern(pattern: string): {
  base: string;
  indices: number[] | '*' | { from: number } | null;
  suffix: string;
} | null {
  const arrayMatch = pattern.match(/^([^[]+)\[([^\]]+)\](.*)$/);
  if (!arrayMatch || arrayMatch.length < 4) return null;

  const [, base, indexPart, suffix] = arrayMatch;

  if (!base || !indexPart || suffix === undefined) return null;

  if (indexPart === '*') {
    return { base, indices: '*', suffix };
  }

  // Handle open-ended range patterns like "1-*" (from index 1 to end)
  const openRangeMatch = indexPart.match(/^(\d+)-\*$/);
  if (openRangeMatch && openRangeMatch.length >= 2) {
    const [, start] = openRangeMatch;
    if (start) {
      const startNum = parseInt(start, 10);
      return { base, indices: { from: startNum }, suffix };
    }
  }

  // Handle closed range patterns like "0-2"
  const rangeMatch = indexPart.match(/^(\d+)-(\d+)$/);
  if (rangeMatch && rangeMatch.length >= 3) {
    const [, start, end] = rangeMatch;
    if (start && end) {
      const startNum = parseInt(start, 10);
      const endNum = parseInt(end, 10);
      const indices = [];
      for (let i = startNum; i <= endNum; i++) {
        indices.push(i);
      }
      return { base, indices, suffix };
    }
  }

  // Handle single index patterns like "0"
  const singleIndex = parseInt(indexPart, 10);
  if (!isNaN(singleIndex)) {
    return { base, indices: [singleIndex], suffix };
  }

  return null;
}

function matchesKeyPattern(
  fullPath: string,
  key: string,
  pattern: string,
  currentPath: string,
): boolean {
  // Handle exact full path matches first (e.g., 'user.settings.theme')
  if (fullPath === pattern) {
    return true;
  }

  // Handle array patterns (e.g., 'prop[0]', 'prop[*]', 'prop[0-2]', 'prop[0].nested')
  const arrayPattern = parseArrayPattern(pattern);
  if (arrayPattern) {
    const { base, indices, suffix } = arrayPattern;

    // Handle patterns like 'prop[0].nested' or 'prop[*].nested'
    if (suffix) {
      // Check if we're matching a property inside an array element
      if (fullPath.startsWith(`${base}[`) && fullPath.includes(']')) {
        const arrayMatch = fullPath.match(
          new RegExp(
            `^${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\[(\\d+)\\](.*)$`,
          ),
        );
        if (arrayMatch && arrayMatch.length >= 3) {
          const [, arrayIndex, afterBracket] = arrayMatch;
          if (!arrayIndex) return false;
          const idx = parseInt(arrayIndex, 10);

          if (
            !isNaN(idx) &&
            afterBracket !== undefined &&
            (indices === '*' ||
              (Array.isArray(indices) && indices.includes(idx)) ||
              (typeof indices === 'object' &&
                indices !== null &&
                'from' in indices &&
                idx >= indices.from))
          ) {
            // Now check if the remaining path matches the suffix pattern
            if (suffix.startsWith('.')) {
              const suffixPath = suffix.slice(1); // Remove leading dot

              // Handle exact suffix matches like 'prop[0].nested'
              if (afterBracket === `.${suffixPath}`) {
                return true;
              }

              // Handle nested patterns within the suffix
              if (afterBracket.startsWith('.')) {
                const pathWithoutDot = afterBracket.slice(1);
                const lastDotIndex = pathWithoutDot.lastIndexOf('.');
                const contextPath =
                  lastDotIndex > 0 ? pathWithoutDot.slice(0, lastDotIndex) : '';
                return matchesKeyPattern(
                  pathWithoutDot,
                  key,
                  suffixPath,
                  contextPath,
                );
              }
            } else if (suffix.startsWith('*') && !suffix.startsWith('*.')) {
              // Handle patterns like 'prop[*]*nested' (no dot before *nested)
              const targetProp = suffix.slice(1);
              return key === targetProp;
            }
          }
        }
      }
      return false;
    }

    // Simple array patterns without suffix (e.g., 'prop[0]', 'prop[*]')
    // Check if we're matching an array element directly
    if (fullPath.startsWith(`${base}[`) && fullPath.includes(']')) {
      const arrayMatch = fullPath.match(
        new RegExp(
          `^${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\[(\\d+)\\]$`,
        ),
      );
      if (arrayMatch && arrayMatch.length >= 2) {
        const [, arrayIndex] = arrayMatch;
        if (arrayIndex !== undefined) {
          const idx = parseInt(arrayIndex, 10);

          return (
            !isNaN(idx) &&
            (indices === '*' ||
              (Array.isArray(indices) && indices.includes(idx)) ||
              (typeof indices === 'object' &&
                indices !== null &&
                'from' in indices &&
                idx >= indices.from))
          );
        }
      }
    }
    return false;
  }

  // Handle nested wildcard patterns with property paths (e.g., 'prop.*nested')
  if (pattern.includes('.*')) {
    const parts = pattern.split('.*');
    if (parts.length === 2) {
      const [basePath, targetProp] = parts;

      if (basePath && targetProp) {
        // Check if we're inside the base path and key matches
        if (fullPath.startsWith(`${basePath}.`) && key === targetProp) {
          return true;
        }
      }
    }
  }

  // Handle patterns starting with '*.' (nested wildcards like '*.prop')
  if (pattern.startsWith('*.')) {
    const propName = pattern.slice(2); // Remove '*.'
    // Must be nested (have a parent path) and key must match
    return currentPath !== '' && key === propName;
  }

  // Handle patterns starting with '*' but not '*.' (global wildcards like '*prop')
  if (pattern.startsWith('*') && !pattern.startsWith('*.')) {
    const propName = pattern.slice(1); // Remove '*'
    // Match exact key name at any level (root or nested)
    return key === propName;
  }

  // Handle simple patterns without wildcards (e.g., 'prop')
  if (!pattern.includes('*') && !pattern.includes('[')) {
    // Root level only - must have empty currentPath and key matches
    return currentPath === '' && key === pattern;
  }

  return false;
}

function isParentOfPattern(path: string, pattern: string): boolean {
  // Handle array patterns
  const arrayPattern = parseArrayPattern(pattern);
  if (arrayPattern) {
    const { base, suffix } = arrayPattern;

    // Check if path matches the array base exactly (e.g., "items" is parent of "items[0]")
    if (path === base) {
      return true;
    }

    // Check if path is parent of the array base
    if (base.startsWith(`${path}.`)) {
      return true;
    }

    // For patterns with suffix like "items[0].name", check if path is the array element
    if (suffix) {
      // Check if path matches an array element that the pattern targets
      const arrayElementMatch = path.match(
        new RegExp(
          `^${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\[\\d+\\]$`,
        ),
      );
      if (arrayElementMatch) {
        return true;
      }

      // Check if path is inside an array element and is parent to the suffix
      if (path.startsWith(`${base}[`) && path.includes(']')) {
        const afterBracket = path.slice(path.indexOf(']') + 1);
        if (suffix.startsWith('.')) {
          const suffixPath = suffix.slice(1);
          return suffixPath.startsWith(`${afterBracket.slice(1)}.`);
        }
      }
    }

    return false;
  }

  // Check if this path is a parent of the pattern path
  if (pattern.includes('*')) {
    // Handle nested wildcard patterns like 'prop.*nested'
    if (pattern.includes('.*')) {
      const parts = pattern.split('.*');
      if (parts.length === 2) {
        const [basePath] = parts;
        // Check if path is the base or a parent of the base
        return Boolean(basePath && (path === basePath || basePath.startsWith(`${path}.`)));
      }
    }

    // For other wildcard patterns, check if the pattern could match a child path
    const patternParts = pattern.split('.');
    const pathParts = path.split('.');

    if (pathParts.length >= patternParts.length) {
      return false;
    }

    // Check if the path parts match the beginning of the pattern
    for (let i = 0; i < pathParts.length; i++) {
      const pathPart = pathParts[i];
      const patternPart = patternParts[i];

      if (patternPart === '*') {
        continue; // Wildcard matches anything
      }
      if (pathPart !== patternPart) {
        return false;
      }
    }
    return true;
  } else {
    // For exact patterns, check if this is a parent path
    return pattern.startsWith(`${path}.`);
  }
}

function applyKeyFiltering(
  value: unknown,
  { rejectKeys, filterKeys }: { rejectKeys?: string[]; filterKeys?: string[] },
  currentPath = '',
  visited: Set<object> = new Set(),
): unknown {
  if (!isPlainObject(value) && !Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value)) {
    if (visited.has(value)) {
      throw new Error(
        'Circular reference detected in array during key filtering',
      );
    }
    visited.add(value);
    try {
      const result: unknown[] = [];

      for (let index = 0; index < value.length; index++) {
        const item = value[index];
        const indexPath =
          currentPath ? `${currentPath}[${index}]` : `[${index}]`;

        // Check if this array index should be rejected
        if (
          rejectKeys?.some((rejectPath) =>
            matchesKeyPattern(indexPath, `[${index}]`, rejectPath, currentPath),
          )
        ) {
          continue;
        }

        // Check if we have filter keys and this index doesn't match
        if (filterKeys) {
          const exactMatch = filterKeys.some((filterPath) => {
            // Also check if this index matches an open-ended range pattern
            const arrayPattern = parseArrayPattern(filterPath);
            if (
              arrayPattern &&
              arrayPattern.base === currentPath.replace(/\[\d+\]$/, '')
            ) {
              const { indices, suffix } = arrayPattern;
              // If there's a suffix (like .name), this is not an exact match for the array element
              if (suffix) {
                return false;
              }
              return (
                indices === '*' ||
                (Array.isArray(indices) && indices.includes(index)) ||
                (typeof indices === 'object' &&
                  indices !== null &&
                  'from' in indices &&
                  index >= indices.from)
              );
            }
            return matchesKeyPattern(
              indexPath,
              `[${index}]`,
              filterPath,
              currentPath,
            );
          });

          const isParent = filterKeys.some((filterPath) =>
            isParentOfPattern(indexPath, filterPath),
          );

          if (!exactMatch && !isParent) {
            continue;
          }

          // If this index exactly matches a filter pattern, include its entire value
          // but still apply rejectKeys filtering
          if (exactMatch) {
            result.push(
              applyKeyFiltering(item, { rejectKeys }, indexPath, visited),
            );
          } else {
            // If this is a parent path, continue filtering the children
            result.push(
              applyKeyFiltering(
                item,
                { rejectKeys, filterKeys },
                indexPath,
                visited,
              ),
            );
          }
        } else {
          result.push(
            applyKeyFiltering(
              item,
              { rejectKeys, filterKeys },
              indexPath,
              visited,
            ),
          );
        }
      }

      return result;
    } finally {
      visited.delete(value);
    }
  }

  if (isPlainObject(value)) {
    if (visited.has(value)) {
      throw new Error(
        'Circular reference detected in object during key filtering',
      );
    }
    visited.add(value);
    try {
      const result: Record<string, unknown> = {};

      for (const [key, itemValue] of Object.entries(value)) {
        const fullPath = currentPath ? `${currentPath}.${key}` : key;

        // Check if this key should be rejected
        if (
          rejectKeys?.some((rejectPath) =>
            matchesKeyPattern(fullPath, key, rejectPath, currentPath),
          )
        ) {
          continue;
        }

        // Check if we have filter keys and this key doesn't match
        if (filterKeys) {
          const exactMatch = filterKeys.some((filterPath) =>
            matchesKeyPattern(fullPath, key, filterPath, currentPath),
          );

          const isParent = filterKeys.some((filterPath) =>
            isParentOfPattern(fullPath, filterPath),
          );

          if (!exactMatch && !isParent) {
            continue;
          }

          // If this key exactly matches a filter pattern, include its entire value
          // but still apply rejectKeys filtering
          if (exactMatch) {
            result[key] = applyKeyFiltering(
              itemValue,
              { rejectKeys },
              fullPath,
              visited,
            );
          } else {
            // If this is a parent path, continue filtering the children
            result[key] = applyKeyFiltering(
              itemValue,
              { rejectKeys, filterKeys },
              fullPath,
              visited,
            );
          }
        } else {
          result[key] = applyKeyFiltering(
            itemValue,
            { rejectKeys, filterKeys },
            fullPath,
            visited,
          );
        }
      }

      return result;
    } finally {
      visited.delete(value);
    }
  }

  return value;
}

/*
 * Produces a more compact and readable snapshot of a value using yaml.
 * By default booleans are shown as `✅` and `❌`, use `showBooleansAs` to disable/configure this.
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
 *
 * @param value - The value to snapshot.
 * @param options - The options for the snapshot.
 * @returns The compact snapshot of the value.
 */
export function compactSnapshot(
  value: unknown,
  {
    collapseObjects = true,
    maxLineLength = 100,
    showUndefined = false,
    showBooleansAs = true,
    rejectKeys,
    filterKeys,
    ...options
  }: YamlStringifyOptions & {
    /* show booleans as text, by default true is `✅` and false is `❌` */
    showBooleansAs?:
      | boolean
      | {
          /* configure individual props */
          props?: Record<
            string,
            { trueText?: string; falseText?: string } | true
          >;
          /* ignore props */
          ignoreProps?: string[];
          /* default true text */
          trueText?: string;
          /* default false text */
          falseText?: string;
        };
    /**
     * Reject (exclude) keys from the snapshot using pattern matching.
     *
     * **Examples:**
     * ```typescript
     * // Reject root-level 'secret' only
     * rejectKeys: ['secret']
     *
     * // Reject nested 'password' properties only
     * rejectKeys: ['*.password']
     *
     * // Reject any 'apiKey' property at any level
     * rejectKeys: ['*apiKey']
     *
     * // Reject specific nested path
     * rejectKeys: ['user.settings.theme']
     * ```
     */
    rejectKeys?: string[] | string;

    /**
     * Filter (include only) keys that match the specified patterns.
     *
     * **Examples:**
     * ```typescript
     * // Include only root-level 'user'
     * filterKeys: ['user']
     *
     * // Include all 'name' properties at any level
     * filterKeys: ['*name']
     *
     * // Include only nested 'id' properties
     * filterKeys: ['*.id']
     *
     * // Include specific nested paths
     * filterKeys: ['user.profile.email', 'settings.theme']
     * ```
     *
     * **Note:** When filtering, parent paths are automatically included if needed
     * to preserve the structure for nested matches.
     */
    filterKeys?: string[] | string;
  } = {},
) {
  let processedValue = value;

  // Apply key filtering before boolean processing
  if (rejectKeys || filterKeys) {
    processedValue = applyKeyFiltering(processedValue, {
      rejectKeys:
        Array.isArray(rejectKeys) ? rejectKeys
        : rejectKeys ? [rejectKeys]
        : undefined,
      filterKeys:
        Array.isArray(filterKeys) ? filterKeys
        : filterKeys ? [filterKeys]
        : undefined,
    });
  }

  // Apply boolean emoji replacement
  processedValue =
    showBooleansAs ?
      replaceBooleansWithEmoji(processedValue, showBooleansAs)
    : processedValue;

  return `\n${yamlStringify(processedValue, {
    collapseObjects,
    maxLineLength,
    showUndefined,
    ...options,
  })}`;
}

function replaceBooleansWithEmoji(
  value: unknown,
  showBooleansAs:
    | boolean
    | {
        props?: Record<
          string,
          { trueText?: string; falseText?: string } | true
        >;
        ignoreProps?: string[];
        trueText?: string;
        falseText?: string;
      },
  visited: Set<object> = new Set(),
): unknown {
  if (showBooleansAs === false) {
    return value;
  }

  const defaultTrueText = '✅';
  const defaultFalseText = '❌';

  const config =
    typeof showBooleansAs === 'boolean' ?
      { trueText: defaultTrueText, falseText: defaultFalseText }
    : {
        trueText: showBooleansAs.trueText ?? defaultTrueText,
        falseText: showBooleansAs.falseText ?? defaultFalseText,
        props: showBooleansAs.props ?? {},
        ignoreProps: showBooleansAs.ignoreProps ?? [],
      };

  function processValue(val: unknown, propName?: string): unknown {
    if (typeof val === 'boolean') {
      if (propName && config.ignoreProps?.includes(propName)) {
        return val;
      }

      if (propName && config.props?.[propName]) {
        const propConfig = config.props[propName];
        if (propConfig === true) {
          return val ? config.trueText : config.falseText;
        }
        return val ?
            (propConfig.trueText ?? config.trueText)
          : (propConfig.falseText ?? config.falseText);
      }

      return val ? config.trueText : config.falseText;
    }

    if (Array.isArray(val)) {
      if (visited.has(val)) {
        throw new Error('Circular reference detected in array');
      }
      visited.add(val);
      try {
        return val.map((item) => processValue(item));
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
          result[key] = processValue(itemValue, key);
        }
        return result;
      } finally {
        visited.delete(val);
      }
    }

    return val;
  }

  return processValue(value);
}
