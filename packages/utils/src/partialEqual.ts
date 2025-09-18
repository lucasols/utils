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

type Comparison = {
  '~sc': ComparisonsType;
};

function createComparison(type: ComparisonsType): Comparison {
  return {
    '~sc': type,
  };
}

export const match = {
  hasType: {
    string: createComparison(['hasType', 'string']),
    number: createComparison(['hasType', 'number']),
    boolean: createComparison(['hasType', 'boolean']),
    object: createComparison(['hasType', 'object']),
    array: createComparison(['hasType', 'array']),
    function: createComparison(['hasType', 'function']),
  },
  isInstanceOf: (constructor: new (...args: any[]) => any) =>
    createComparison(['isInstanceOf', constructor]),
  str: {
    contains: (substring: string) =>
      createComparison(['strContains', substring]),
    startsWith: (substring: string) =>
      createComparison(['strStartsWith', substring]),
    endsWith: (substring: string) =>
      createComparison(['strEndsWith', substring]),
    matchesRegex: (regex: RegExp) =>
      createComparison(['strMatchesRegex', regex]),
  },
  num: {
    isGreaterThan: (value: number) =>
      createComparison(['numIsGreaterThan', value]),
    isGreaterThanOrEqual: (value: number) =>
      createComparison(['numIsGreaterThanOrEqual', value]),
    isLessThan: (value: number) => createComparison(['numIsLessThan', value]),
    isLessThanOrEqual: (value: number) =>
      createComparison(['numIsLessThanOrEqual', value]),
    isInRange: (value: [number, number]) =>
      createComparison(['numIsInRange', value]),
  },
  jsonString: {
    hasPartial: (value: any) =>
      createComparison(['jsonStringHasPartial', value]),
  },
  equal: (value: any) => createComparison(['deepEqual', value]),
  partialEqual: (value: any) => createComparison(['partialEqual', value]),
  custom: (isEqual: (value: unknown) => boolean) =>
    createComparison(['custom', isEqual]),
  not: {
    hasType: {
      string: createComparison(['not', ['hasType', 'string']]),
      number: createComparison(['not', ['hasType', 'number']]),
      boolean: createComparison(['not', ['hasType', 'boolean']]),
      object: createComparison(['not', ['hasType', 'object']]),
      array: createComparison(['not', ['hasType', 'array']]),
      function: createComparison(['not', ['hasType', 'function']]),
    },
    isInstanceOf: (constructor: new (...args: any[]) => any) =>
      createComparison(['not', ['isInstanceOf', constructor]]),
    str: {
      contains: (substring: string) =>
        createComparison(['not', ['strContains', substring]]),
      startsWith: (substring: string) =>
        createComparison(['not', ['strStartsWith', substring]]),
      endsWith: (substring: string) =>
        createComparison(['not', ['strEndsWith', substring]]),
      matchesRegex: (regex: RegExp) =>
        createComparison(['not', ['strMatchesRegex', regex]]),
    },
    num: {
      isGreaterThan: (value: number) =>
        createComparison(['not', ['numIsGreaterThan', value]]),
      isGreaterThanOrEqual: (value: number) =>
        createComparison(['not', ['numIsGreaterThanOrEqual', value]]),
      isLessThan: (value: number) =>
        createComparison(['not', ['numIsLessThan', value]]),
      isLessThanOrEqual: (value: number) =>
        createComparison(['not', ['numIsLessThanOrEqual', value]]),
      isInRange: (value: [number, number]) =>
        createComparison(['not', ['numIsInRange', value]]),
    },
    jsonString: {
      hasPartial: (value: any) =>
        createComparison(['not', ['jsonStringHasPartial', value]]),
    },
    equal: (value: any) => createComparison(['not', ['deepEqual', value]]),
    partialEqual: (value: any) =>
      createComparison(['not', ['partialEqual', value]]),
    custom: (value: (target: unknown) => boolean) =>
      createComparison(['not', ['custom', value]]),
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

  // Handle special comparisons first
  if (sub && typeof sub === 'object' && '~sc' in sub) {
    return executeComparison(target, sub['~sc']);
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
