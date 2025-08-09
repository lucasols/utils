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
  if (!pattern.includes('*')) {
    // Root level only - must have empty currentPath and key matches
    return currentPath === '' && key === pattern;
  }

  return false;
}

function isParentOfPattern(path: string, pattern: string): boolean {
  // Check if this path is a parent of the pattern path
  if (pattern.includes('*')) {
    // For wildcard patterns, check if the pattern could match a child path
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
      return value.map((item, index) =>
        applyKeyFiltering(
          item,
          { rejectKeys, filterKeys },
          currentPath ? `${currentPath}[${index}]` : `[${index}]`,
          visited,
        ),
      );
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
     * **Pattern Syntax:**
     * - `'prop'` - Only root-level properties named 'prop'
     * - `'prop.nested'` - Exact nested property paths like `obj.prop.nested` 
     * - `'*prop'` - Any property named exactly 'prop' at any level (root or nested)
     * - `'*.prop'` - Any nested property named 'prop' (excludes root-level matches)
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
     * **Pattern Syntax:** (same as rejectKeys)
     * - `'prop'` - Only root-level properties named 'prop'
     * - `'prop.nested'` - Exact nested property paths like `obj.prop.nested`
     * - `'*prop'` - Any property named exactly 'prop' at any level (root or nested) 
     * - `'*.prop'` - Any nested property named 'prop' (excludes root-level matches)
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
