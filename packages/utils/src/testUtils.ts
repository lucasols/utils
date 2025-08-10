import { arrayWithPrevAndIndex, filterAndMap } from './arrayUtils';
import { isObject } from './assertions';
import { deepEqual } from './deepEqual';
import { filterObjectOrArrayKeys } from './filterObjectOrArrayKeys';
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

/**
 * Produces a more compact and readable snapshot of a value using yaml.
 * By default booleans are shown as `✅` and `❌`, use `showBooleansAs` to disable/configure this.
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
 * - Expanding the patterns with parentheses:
 *   - `'prop.test.(prop1|prop2|prop3.prop4)'` - Will produce `prop.test.prop1`, `prop.test.prop2`, and `prop.test.prop3.prop4`
 *
 * @param value - The value to snapshot.
 * @param options - The options for the snapshot.
 * @param options.collapseObjects - Whether to collapse objects into a single line.
 * @param options.maxLineLength - The maximum length of a line.
 * @param options.showUndefined - Whether to show undefined values.
 * @param options.showBooleansAs - Whether to show booleans as text, by default true is `✅` and false is `❌`
 * @param options.rejectKeys - The keys to reject.
 * @param options.filterKeys - The keys to filter.
 * @param options.ignoreProps - The props to ignore.
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
    if (isPlainObject(processedValue) || Array.isArray(processedValue)) {
      processedValue = filterObjectOrArrayKeys(processedValue, {
        rejectKeys,
        filterKeys,
      });
    }
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
