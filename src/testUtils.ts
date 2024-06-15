import { arrayWithPrevAndIndex, filterAndMap } from './arrayUtils';
import { isObject } from './assertions';
import { deepEqual } from './deepEqual';
import { clampMin } from './mathUtils';
import { omit, pick } from './objUtils';

export function createLoggerStore({
  filterKeys: defaultFilterKeys,
  rejectKeys: defaultRejectKeys,
}: {
  filterKeys?: string[];
  rejectKeys?: string[];
} = {}) {
  let renders: Record<string, unknown>[] = [];
  let rendersTime: number[] = [];
  let startTime = Date.now();
  let onNextRender: () => void = () => {};

  function reset(keepLastRender = false) {
    renders = keepLastRender ? [renders.at(-1)!] : [];
    rendersTime = [];
    startTime = Date.now();
  }

  function add(
    render: Record<string, unknown> | readonly Record<string, unknown>[],
  ) {
    if (!isObject(render)) {
      for (const [i, r] of render.entries()) {
        renders.push({
          i: i + 1,
          ...r,
        });
        rendersTime.push(Date.now() - startTime);
      }
    } else {
      renders.push(render);
      rendersTime.push(Date.now() - startTime);
    }

    onNextRender();

    if (renders.length > 100) {
      throw new Error('Too many renders');
    }
  }

  function renderCount() {
    return renders.filter((item) => !item._lastSnapshotMark).length;
  }

  async function waitNextRender(timeout = 50) {
    return new Promise<void>((resolve) => {
      const timeoutId = setTimeout(() => {
        throw new Error('Timeout');
      }, timeout);

      onNextRender = () => {
        clearTimeout(timeoutId);
        resolve();
      };
    });
  }

  function getSnapshot({
    arrays = { firstNItems: 1 },
    changesOnly = true,
    filterKeys = defaultFilterKeys,
    rejectKeys = defaultRejectKeys,
    includeLastSnapshotEndMark = true,
  }: {
    arrays?: 'all' | 'firstAndLast' | 'length' | { firstNItems: number };
    changesOnly?: boolean;
    filterKeys?: string[];
    rejectKeys?: string[];
    includeLastSnapshotEndMark?: boolean;
  } = {}) {
    let rendersToUse = renders;

    if (changesOnly || filterKeys || rejectKeys) {
      rendersToUse = [];

      for (let { item, prev } of arrayWithPrevAndIndex(renders)) {
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

    renders.push({ _lastSnapshotMark: true });

    return `\n${filterAndMap(rendersToUse, (render, i) => {
      if (render._lastSnapshotMark) {
        if (includeLastSnapshotEndMark && i !== rendersToUse.length - 1) {
          return '---';
        } else {
          return false;
        }
      }

      if (render._mark) {
        let mark = `\n>>> ${String(render._mark)}`;

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

            value = [
              value[0],
              `...(${intermediateSize} between)`,
              value.at(-1),
            ];
          } else if (typeof arrays === 'object' && value.length > 2) {
            value = [
              ...value.slice(0, arrays.firstNItems),
              `...(${value.length - arrays.firstNItems} more)`,
            ];
          }
        }

        if (value === '') {
          value = `''`;
        }

        if (typeof value === 'object' && value !== null) {
          value = JSON.stringify(value).replace(/"/g, '').replace(/,/g, ', ');
        }

        line += `${key}: ${value} -- `;
      }

      line = line.slice(0, -4);
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
    waitNextRender,
    get changesSnapshot() {
      return getSnapshot({ changesOnly: true });
    },
    get snapshot() {
      return getSnapshot({ changesOnly: false });
    },
    renderCount,
    get rendersTime() {
      return rendersTime;
    },
    addMark,
  };
}
