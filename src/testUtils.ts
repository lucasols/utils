import { arrayWithPrevAndIndex, filterAndMap } from './arrayUtils';
import { isObject } from './assertions';
import { deepEqual } from './deepEqual';
import { clampMin } from './mathUtils';
import { omit, pick } from './objUtils';

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

    return `\n${filterAndMap(rendersToUse, (render, i) => {
      if (render._lastSnapshotMark) {
        if (includeLastSnapshotEndMark && i !== rendersToUse.length - 1) {
          return '⋅⋅⋅';
        } else {
          return false;
        }
      }

      if (render._mark) {
        const prevIsLastSnapshotMark = rendersToUse[i - 1]?._lastSnapshotMark;
        let mark = `${
          prevIsLastSnapshotMark ? '' : '\n'
        }>>> ${String(render._mark)}`;

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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return wrapper(fn(...args));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return fn(...args);
    }
  }) as T;
}
