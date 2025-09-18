/* eslint-disable @typescript-eslint/no-unsafe-call */
import { deepEqual } from './deepEqual';

const has = Object.prototype.hasOwnProperty;

type ComparisonsType =
  | [type: 'strStartsWith', value: string]
  | [type: 'strEndsWith', value: string]
  | [type: 'strContains', value: string]
  | [type: 'strMatchesRegex', value: RegExp]
  | [type: 'deepEqual', value: any]
  | [type: 'numIsGreaterThan', value: number]
  | [type: 'numIsGreaterThanOrEqual', value: number]
  | [type: 'numIsLessThan', value: number]
  | [type: 'numIsLessThanOrEqual', value: number]
  | [type: 'numIsInRange', value: [number, number]]
  | [type: 'jsonStringHasPartial', value: any]
  | [type: 'partialEqual', value: any]
  | [type: 'not', value: ComparisonsType];

class Comparisons {
  type: ComparisonsType;
  constructor(type: ComparisonsType) {
    this.type = type;
  }
}

export const match = {
  str: {
    contains: (substring: string) =>
      new Comparisons(['strContains', substring]),
    startsWith: (substring: string) =>
      new Comparisons(['strStartsWith', substring]),
    endsWith: (substring: string) =>
      new Comparisons(['strEndsWith', substring]),
    matchesRegex: (regex: RegExp) =>
      new Comparisons(['strMatchesRegex', regex]),
  },
  num: {
    isGreaterThan: (value: number) =>
      new Comparisons(['numIsGreaterThan', value]),
    isGreaterThanOrEqual: (value: number) =>
      new Comparisons(['numIsGreaterThanOrEqual', value]),
    isLessThan: (value: number) => new Comparisons(['numIsLessThan', value]),
    isLessThanOrEqual: (value: number) =>
      new Comparisons(['numIsLessThanOrEqual', value]),
    isInRange: (value: [number, number]) =>
      new Comparisons(['numIsInRange', value]),
  },
  jsonString: {
    hasPartial: (value: any) =>
      new Comparisons(['jsonStringHasPartial', value]),
  },
  deepEqual: (value: any) => new Comparisons(['deepEqual', value]),
  partialEqual: (value: any) => new Comparisons(['partialEqual', value]),
  not: {
    str: {
      contains: (substring: string) =>
        new Comparisons(['not', ['strContains', substring]]),
      startsWith: (substring: string) =>
        new Comparisons(['not', ['strStartsWith', substring]]),
      endsWith: (substring: string) =>
        new Comparisons(['not', ['strEndsWith', substring]]),
      matchesRegex: (regex: RegExp) =>
        new Comparisons(['not', ['strMatchesRegex', regex]]),
    },
    num: {
      isGreaterThan: (value: number) =>
        new Comparisons(['not', ['numIsGreaterThan', value]]),
      isGreaterThanOrEqual: (value: number) =>
        new Comparisons(['not', ['numIsGreaterThanOrEqual', value]]),
      isLessThan: (value: number) =>
        new Comparisons(['not', ['numIsLessThan', value]]),
      isLessThanOrEqual: (value: number) =>
        new Comparisons(['not', ['numIsLessThanOrEqual', value]]),
      isInRange: (value: [number, number]) =>
        new Comparisons(['not', ['numIsInRange', value]]),
    },
    jsonString: {
      hasPartial: (value: any) =>
        new Comparisons(['not', ['jsonStringHasPartial', value]]),
    },
    deepEqual: (value: any) => new Comparisons(['not', ['deepEqual', value]]),
    partialEqual: (value: any) =>
      new Comparisons(['not', ['partialEqual', value]]),
  },
};

function find(iter: any[], tar: any): any {
  for (const key of iter.keys()) {
    if (partialEqual(key, tar)) return key;
  }
}

/**
 * Checks if sub is a partial match of target (all properties in sub exist and
 * match in target)
 *
 * @example
 *   partialEqual({ a: 1, b: 2 }, { a: 1 }); // true - sub is subset of target
 *   partialEqual({ a: 1 }, { a: 1, b: 2 }); // false - sub has more properties than target
 *   partialEqual([1, 2, 3], [1, 2]); // true - sub array is prefix of target
 *   partialEqual([1, 2], [1, 2, 3]); // false - sub array is longer than target
 */
function executeComparison(target: any, comparison: ComparisonsType): boolean {
  const [type, value] = comparison;

  switch (type) {
    case 'strStartsWith':
      return typeof target === 'string' && target.startsWith(value);
    case 'strEndsWith':
      return typeof target === 'string' && target.endsWith(value);
    case 'strContains':
      return typeof target === 'string' && target.includes(value);
    case 'strMatchesRegex':
      return typeof target === 'string' && value.test(target);
    case 'numIsGreaterThan':
      return typeof target === 'number' && target > value;
    case 'numIsGreaterThanOrEqual':
      return typeof target === 'number' && target >= value;
    case 'numIsLessThan':
      return typeof target === 'number' && target < value;
    case 'numIsLessThanOrEqual':
      return typeof target === 'number' && target <= value;
    case 'numIsInRange':
      return (
        typeof target === 'number' && target >= value[0] && target <= value[1]
      );
    case 'jsonStringHasPartial':
      if (typeof target !== 'string') return false;
      try {
        const parsed = JSON.parse(target);
        return partialEqual(parsed, value);
      } catch {
        return false;
      }
    case 'deepEqual':
      return deepEqual(target, value);
    case 'partialEqual':
      return partialEqual(target, value);
    case 'not':
      return !executeComparison(target, value);
    default:
      return false;
  }
}

export function partialEqual(target: any, sub: any): boolean {
  if (sub === target) return true;

  // Handle special comparisons
  if (sub instanceof Comparisons) {
    return executeComparison(target, sub.type);
  }

  if (sub && target && sub.constructor === target.constructor) {
    const ctor = sub.constructor;

    if (ctor === Date) {
      return sub.getTime() === target.getTime();
    }

    if (ctor === RegExp) {
      return sub.toString() === target.toString();
    }

    if (ctor === Array) {
      if (sub.length > target.length) return false;
      for (let i = 0; i < sub.length; i++) {
        if (!partialEqual(target[i], sub[i])) return false;
      }
      return true;
    }

    if (ctor === Set) {
      if (sub.size > target.size) return false;
      for (const value of sub) {
        let found = false;
        if (value && typeof value === 'object') {
          found = !!find(target, value);
        } else {
          found = target.has(value);
        }
        if (!found) return false;
      }
      return true;
    }

    if (ctor === Map) {
      if (sub.size > target.size) return false;
      for (const [key, value] of sub) {
        let targetKey = key;
        if (key && typeof key === 'object') {
          targetKey = find(target, key);
          if (!targetKey) return false;
        }
        if (
          !target.has(targetKey) ||
          !partialEqual(target.get(targetKey), value)
        ) {
          return false;
        }
      }
      return true;
    }

    if (!ctor || typeof sub === 'object') {
      for (const key in sub) {
        if (has.call(sub, key)) {
          if (!has.call(target, key) || !partialEqual(target[key], sub[key])) {
            return false;
          }
        }
      }
      return true;
    }
  }

  return sub !== sub && target !== target; // NaN === NaN
}
