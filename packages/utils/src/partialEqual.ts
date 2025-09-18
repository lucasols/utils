/* eslint-disable @typescript-eslint/no-unsafe-call */
import { deepEqual } from './deepEqual';

const has = Object.prototype.hasOwnProperty;

type ComparisonsType =
  | [type: 'strStartsWith', value: string]
  | [type: 'strEndsWith', value: string]
  | [
      type: 'hasType',
      value: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function',
    ]
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
  | [type: 'custom', value: (target: unknown) => boolean]
  | [type: 'isInstanceOf', value: new (...args: any[]) => any]
  | [type: 'not', value: ComparisonsType];

class Comparisons {
  type: ComparisonsType;
  constructor(type: ComparisonsType) {
    this.type = type;
  }
}

export const match = {
  hasType: {
    string: new Comparisons(['hasType', 'string']),
    number: new Comparisons(['hasType', 'number']),
    boolean: new Comparisons(['hasType', 'boolean']),
    object: new Comparisons(['hasType', 'object']),
    array: new Comparisons(['hasType', 'array']),
    function: new Comparisons(['hasType', 'function']),
  },
  isInstanceOf: (constructor: new (...args: any[]) => any) =>
    new Comparisons(['isInstanceOf', constructor]),
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
  equal: (value: any) => new Comparisons(['deepEqual', value]),
  partialEqual: (value: any) => new Comparisons(['partialEqual', value]),
  custom: (isEqual: (value: unknown) => boolean) =>
    new Comparisons(['custom', isEqual]),
  not: {
    hasType: {
      string: new Comparisons(['not', ['hasType', 'string']]),
      number: new Comparisons(['not', ['hasType', 'number']]),
      boolean: new Comparisons(['not', ['hasType', 'boolean']]),
      object: new Comparisons(['not', ['hasType', 'object']]),
      array: new Comparisons(['not', ['hasType', 'array']]),
      function: new Comparisons(['not', ['hasType', 'function']]),
    },
    isInstanceOf: (constructor: new (...args: any[]) => any) =>
      new Comparisons(['not', ['isInstanceOf', constructor]]),
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
    equal: (value: any) => new Comparisons(['not', ['deepEqual', value]]),
    partialEqual: (value: any) =>
      new Comparisons(['not', ['partialEqual', value]]),
    custom: (value: (target: unknown) => boolean) =>
      new Comparisons(['not', ['custom', value]]),
  },
};

function find(iter: any[], tar: any): any {
  for (const key of iter.keys()) {
    if (partialEqual(key, tar)) return key;
  }
}

/**
 * Checks if sub is a partial match of target (all properties in sub exist and
 * match in target). Supports special comparison matchers for flexible pattern
 * matching.
 *
 * @example
 *   // Basic partial matching
 *   partialEqual({ a: 1, b: 2 }, { a: 1 }); // true - sub is subset of target
 *   partialEqual([1, 2, 3], [1, 2]); // true - sub array is prefix of target
 *
 *   // Special comparisons
 *   partialEqual('hello world', match.str.contains('world')); // true
 *   partialEqual(25, match.num.isGreaterThan(18)); // true
 *   partialEqual(
 *     'test@example.com',
 *     match.custom((v) => typeof v === 'string' && v.includes('@')),
 *   ); // true
 *
 *   // Complex nested matching
 *   partialEqual(
 *     { user: { name: 'John', age: 30 } },
 *     {
 *       user: {
 *         name: match.str.startsWith('J'),
 *         age: match.num.isGreaterThan(25),
 *       },
 *     },
 *   ); // true
 */
function executeComparison(target: any, comparison: ComparisonsType): boolean {
  const [type, value] = comparison;

  switch (type) {
    case 'hasType':
      switch (value) {
        case 'string':
          return typeof target === 'string';
        case 'number':
          return typeof target === 'number';
        case 'boolean':
          return typeof target === 'boolean';
        case 'function':
          return typeof target === 'function';
        case 'array':
          return Array.isArray(target);
        case 'object':
          return (
            typeof target === 'object' &&
            target !== null &&
            !Array.isArray(target)
          );
        default:
          return false;
      }
    case 'isInstanceOf':
      return target instanceof value;
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
    case 'custom':
      return value(target);
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
