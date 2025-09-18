import { err, ok, type Result } from 't-result';
import { exhaustiveCheck } from './assertions';

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
  | [type: 'custom', value: (target: unknown) => boolean | { error: string }]
  | [type: 'isInstanceOf', value: new (...args: any[]) => any]
  | [type: 'keyNotBePresent', value: null]
  | [type: 'not', value: ComparisonsType]
  | [type: 'any', value: ComparisonsType[]]
  | [type: 'all', value: ComparisonsType[]]
  | [type: 'withNoExtraKeys', partialShape: any]
  | [type: 'withDeepNoExtraKeys', partialShape: any]
  | [type: 'noExtraDefinedKeys', partialShape: any]
  | [type: 'deepNoExtraDefinedKeys', partialShape: any];

type Comparison = {
  '~sc': ComparisonsType;
};

function createComparison(type: ComparisonsType): Comparison {
  return { '~sc': type };
}

type BaseMatch = {
  noExtraKeys: (partialShape: any) => Comparison;
  deepNoExtraKeys: (partialShape: any) => Comparison;
  noExtraDefinedKeys: (partialShape: any) => Comparison;
  deepNoExtraDefinedKeys: (partialShape: any) => Comparison;
  hasType: {
    string: Comparison;
    number: Comparison;
    boolean: Comparison;
    object: Comparison;
    array: Comparison;
    function: Comparison;
  };
  isInstanceOf: (constructor: new (...args: any[]) => any) => Comparison;
  str: {
    contains: (substring: string) => Comparison;
    startsWith: (substring: string) => Comparison;
    endsWith: (substring: string) => Comparison;
    matchesRegex: (regex: RegExp) => Comparison;
  };
  num: {
    isGreaterThan: (value: number) => Comparison;
    isGreaterThanOrEqual: (value: number) => Comparison;
    isLessThan: (value: number) => Comparison;
    isLessThanOrEqual: (value: number) => Comparison;
    isInRange: (value: [number, number]) => Comparison;
  };
  jsonString: {
    hasPartial: (value: any) => Comparison;
  };
  equal: (value: any) => Comparison;
  partialEqual: (value: any) => Comparison;
  custom: (
    isEqual: (value: unknown) => boolean | { error: string },
  ) => Comparison;
  keyNotBePresent: Comparison;
  any: (...values: any[]) => Comparison;
  all: (...values: any[]) => Comparison;
};

type Match = BaseMatch & {
  not: BaseMatch;
};

export const match: Match = {
  noExtraKeys: (partialShape: any) =>
    createComparison(['withNoExtraKeys', partialShape]),
  deepNoExtraKeys: (partialShape: any) =>
    createComparison(['withDeepNoExtraKeys', partialShape]),
  noExtraDefinedKeys: (partialShape: any) =>
    createComparison(['noExtraDefinedKeys', partialShape]),
  deepNoExtraDefinedKeys: (partialShape: any) =>
    createComparison(['deepNoExtraDefinedKeys', partialShape]),
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
  custom: (isEqual: (value: unknown) => boolean | { error: string }) =>
    createComparison(['custom', isEqual]),
  keyNotBePresent: createComparison(['keyNotBePresent', null]),
  any: (...values: any[]) =>
    createComparison([
      'any',
      values.map((v) => {
        if (isComparison(v)) return v['~sc'];
        if (typeof v === 'object' && v !== null)
          return ['partialEqual', v] as ComparisonsType;
        return ['deepEqual', v] as ComparisonsType;
      }),
    ]),
  all: (...values: any[]) =>
    createComparison([
      'all',
      values.map((v) => {
        if (isComparison(v)) return v['~sc'];
        if (typeof v === 'object' && v !== null)
          return ['partialEqual', v] as ComparisonsType;
        return ['deepEqual', v] as ComparisonsType;
      }),
    ]),
  not: {
    hasType: {
      string: createComparison(['not', ['hasType', 'string']]),
      number: createComparison(['not', ['hasType', 'number']]),
      boolean: createComparison(['not', ['hasType', 'boolean']]),
      object: createComparison(['not', ['hasType', 'object']]),
      array: createComparison(['not', ['hasType', 'array']]),
      function: createComparison(['not', ['hasType', 'function']]),
    },
    keyNotBePresent: createComparison(['not', ['keyNotBePresent', null]]),
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
    custom: (value: (target: unknown) => boolean | { error: string }) =>
      createComparison(['not', ['custom', value]]),
    any: (...values: any[]) =>
      createComparison([
        'not',
        [
          'any',
          values.map((v) => {
            if (isComparison(v)) return v['~sc'];
            if (typeof v === 'object' && v !== null)
              return ['partialEqual', v] as ComparisonsType;
            return ['deepEqual', v] as ComparisonsType;
          }),
        ],
      ]),
    all: (...values: any[]) =>
      createComparison([
        'not',
        [
          'all',
          values.map((v) => {
            if (isComparison(v)) return v['~sc'];
            if (typeof v === 'object' && v !== null)
              return ['partialEqual', v] as ComparisonsType;
            return ['deepEqual', v] as ComparisonsType;
          }),
        ],
      ]),
    noExtraKeys: (partialShape: any) =>
      createComparison(['not', ['withNoExtraKeys', partialShape]]),
    deepNoExtraKeys: (partialShape: any) =>
      createComparison(['not', ['withDeepNoExtraKeys', partialShape]]),
    noExtraDefinedKeys: (partialShape: any) =>
      createComparison(['not', ['noExtraDefinedKeys', partialShape]]),
    deepNoExtraDefinedKeys: (partialShape: any) =>
      createComparison(['not', ['deepNoExtraDefinedKeys', partialShape]]),
  },
};

function isComparison(value: any): value is Comparison {
  return value && typeof value === 'object' && '~sc' in value;
}

function executeComparison(
  target: any,
  comparison: ComparisonsType,
  context: ErrorCollectionContext,
): boolean {
  const [type, value] = comparison;

  switch (type) {
    case 'strStartsWith':
      if (typeof target !== 'string') {
        addError(context, {
          message: `Expected string starting with "${value}"`,
          received: target,
        });
        return false;
      }
      if (!target.startsWith(value)) {
        addError(context, {
          message: `Expected string starting with "${value}"`,
          received: target,
        });
        return false;
      }
      return true;

    case 'strEndsWith':
      if (typeof target !== 'string') {
        addError(context, {
          message: `Expected string ending with "${value}"`,
          received: target,
        });
        return false;
      }
      if (!target.endsWith(value)) {
        addError(context, {
          message: `Expected string ending with "${value}"`,
          received: target,
        });
        return false;
      }
      return true;

    case 'strContains':
      if (typeof target !== 'string') {
        addError(context, {
          message: `Expected string containing "${value}"`,
          received: target,
        });
        return false;
      }
      if (!target.includes(value)) {
        addError(context, {
          message: `Expected string containing "${value}"`,
          received: target,
        });
        return false;
      }
      return true;

    case 'strMatchesRegex':
      if (typeof target !== 'string') {
        addError(context, {
          message: `Expected string matching regex ${value}`,
          received: target,
        });
        return false;
      }
      if (!value.test(target)) {
        addError(context, {
          message: `Expected string matching regex ${value}`,
          received: target,
        });
        return false;
      }
      return true;

    case 'hasType': {
      let actualType: string;
      if (value === 'array') {
        actualType = Array.isArray(target) ? 'array' : typeof target;
      } else if (value === 'object') {
        // For 'object' type check, we want true objects (excluding arrays and null)
        if (target === null || Array.isArray(target)) {
          actualType = 'not-object'; // Will not match 'object'
        } else {
          actualType = typeof target; // Will be 'object' for actual objects
        }
      } else {
        actualType = typeof target;
      }

      if (actualType !== value) {
        addError(context, {
          message: `Expected type ${value}`,
          received: target,
        });
        return false;
      }
      return true;
    }

    case 'deepEqual':
      if (!deepEqual(target, value)) {
        addError(context, {
          message: 'Values are not deeply equal',
          received: target,
          expected: value,
        });
        return false;
      }
      return true;

    case 'numIsGreaterThan':
      if (typeof target !== 'number' || target <= value) {
        addError(context, {
          message: `Expected number greater than ${value}`,
          received: target,
        });
        return false;
      }
      return true;

    case 'numIsGreaterThanOrEqual':
      if (typeof target !== 'number' || target < value) {
        addError(context, {
          message: `Expected number greater than or equal to ${value}`,
          received: target,
        });
        return false;
      }
      return true;

    case 'numIsLessThan':
      if (typeof target !== 'number' || target >= value) {
        addError(context, {
          message: `Expected number less than ${value}`,
          received: target,
        });
        return false;
      }
      return true;

    case 'numIsLessThanOrEqual':
      if (typeof target !== 'number' || target > value) {
        addError(context, {
          message: `Expected number less than or equal to ${value}`,
          received: target,
        });
        return false;
      }
      return true;

    case 'numIsInRange':
      if (
        typeof target !== 'number' ||
        target < value[0] ||
        target > value[1]
      ) {
        addError(context, {
          message: `Expected number in range [${value[0]}, ${value[1]}]`,
          received: target,
        });
        return false;
      }
      return true;

    case 'jsonStringHasPartial':
      if (typeof target !== 'string') {
        addError(context, {
          message: 'Expected JSON string',
          received: target,
        });
        return false;
      }
      try {
        const parsed = JSON.parse(target);
        if (!partialEqualInternal(parsed, value, context)) {
          return false;
        }
      } catch {
        addError(context, {
          message: 'Expected valid JSON string',
          received: target,
        });
        return false;
      }
      return true;

    case 'partialEqual':
      return partialEqualInternal(target, value, context);

    case 'custom': {
      const result = value(target);
      if (result !== true) {
        addError(context, {
          message: `Custom validation failed ${typeof result === 'object' ? `: ${result.error}` : ''}`,
          received: target,
        });
        return false;
      }
      return true;
    }

    case 'isInstanceOf':
      if (!(target instanceof value)) {
        addError(context, {
          message: `Expected instance of ${value.name}`,
          received: target,
        });
        return false;
      }
      return true;

    case 'keyNotBePresent':
      addError(context, {
        message: 'This property should not be present',
        received: target,
      });
      return false;

    case 'not': {
      // For 'not', we need to check if the negated condition would pass
      const tempContext: ErrorCollectionContext = {
        errors: [],
        path: context.path,
      };
      const result = executeComparison(target, value, tempContext);
      if (result) {
        addError(context, {
          message: 'Expected negated condition to fail',
          received: target,
          expected: { 'not match': value },
        });
        return false;
      }
      return true;
    }

    case 'any': {
      // OR logic - at least one must match
      for (const subComparison of value) {
        const anyTempContext: ErrorCollectionContext = {
          errors: [],
          path: context.path,
        };
        if (executeComparison(target, subComparison, anyTempContext)) {
          return true;
        }
      }
      addError(context, {
        message: 'None of the alternative comparisons matched',
        received: target,
        expected: {
          matchAny: value,
        },
      });
      return false;
    }

    case 'all': {
      // AND logic - all must match
      let allMatch = true;
      for (const subComparison of value) {
        if (!executeComparison(target, subComparison, context)) {
          allMatch = false;
        }
      }
      return allMatch;
    }

    case 'withNoExtraKeys':
      return checkNoExtraKeys(target, value, context, false);

    case 'withDeepNoExtraKeys':
      return checkNoExtraKeys(target, value, context, true);

    case 'noExtraDefinedKeys':
      return checkNoExtraDefinedKeys(target, value, context, false);

    case 'deepNoExtraDefinedKeys':
      return checkNoExtraDefinedKeys(target, value, context, true);

    default:
      throw exhaustiveCheck(type);
  }
}

type PartialError = {
  path: string;
  message: string;
  received?: any;
  expected?: any;
};

type ErrorCollectionContext = {
  errors: PartialError[];
  path: string[];
};

function formatPath(path: string[]): string {
  if (path.length === 0) return '';

  let result = path[0] || '';
  for (let i = 1; i < path.length; i++) {
    const segment = path[i];
    if (segment && segment.startsWith('[') && segment.endsWith(']')) {
      // Array index - no dot prefix
      result += segment;
    } else if (segment) {
      // Property name - add dot prefix if result is not empty
      if (result) {
        result += `.${segment}`;
      } else {
        result += segment;
      }
    }
  }
  return result;
}

function addError(
  context: ErrorCollectionContext,
  error: Omit<PartialError, 'path'>,
): void {
  context.errors.push({
    path: formatPath(context.path),
    ...error,
  });
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!has.call(b, key) || !deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
}

function partialEqualInternal(
  target: any,
  sub: any,
  context: ErrorCollectionContext,
): boolean {
  // Handle special comparison objects
  if (isComparison(sub)) {
    return executeComparison(target, sub['~sc'], context);
  }

  // Handle keyNotBePresent special case
  if (isComparison(sub) && sub['~sc'][0] === 'keyNotBePresent') {
    addError(context, {
      message: 'This property should not be present',
      received: target,
    });
    return false;
  }

  // Handle primitives and null/undefined
  if (target === sub) return true;
  if (Number.isNaN(target) && Number.isNaN(sub)) return true;
  if (
    target === null ||
    sub === null ||
    target === undefined ||
    sub === undefined
  ) {
    if (target !== sub) {
      addError(context, {
        message: 'Value mismatch',
        received: target,
        expected: sub,
      });
      return false;
    }
    return true;
  }

  // Handle Date objects
  if (target instanceof Date && sub instanceof Date) {
    if (target.getTime() !== sub.getTime()) {
      addError(context, {
        message: 'Date mismatch',
        received: target,
        expected: sub,
      });
      return false;
    }
    return true;
  }

  // Handle RegExp objects
  if (target instanceof RegExp && sub instanceof RegExp) {
    if (target.source !== sub.source || target.flags !== sub.flags) {
      addError(context, {
        message: 'RegExp mismatch',
        received: target,
        expected: sub,
      });
      return false;
    }
    return true;
  }

  // Handle Set objects
  if (target instanceof Set && sub instanceof Set) {
    if (sub.size > target.size) {
      addError(context, {
        message: 'Set too small',
        received: target,
        expected: sub,
      });
      return false;
    }

    for (const subValue of sub) {
      let found = false;
      for (const targetValue of target) {
        const tempContext: ErrorCollectionContext = {
          errors: [],
          path: context.path,
        };
        if (partialEqualInternal(targetValue, subValue, tempContext)) {
          found = true;
          break;
        }
      }
      if (!found) {
        addError(context, {
          message: 'Set element not found',
          received: target,
          expected: sub,
        });
        return false;
      }
    }
    return true;
  }

  // Handle Map objects
  if (target instanceof Map && sub instanceof Map) {
    if (sub.size > target.size) {
      addError(context, {
        message: 'Map has less entries than expected',
        received: `${target.size} entries`,
        expected: `${sub.size} entries`,
      });
      return false;
    }

    for (const [subKey, subValue] of sub) {
      let found = false;
      for (const [targetKey, targetValue] of target) {
        const tempContextKey: ErrorCollectionContext = {
          errors: [],
          path: context.path,
        };
        const tempContextValue: ErrorCollectionContext = {
          errors: [],
          path: context.path,
        };
        if (
          partialEqualInternal(targetKey, subKey, tempContextKey) &&
          partialEqualInternal(targetValue, subValue, tempContextValue)
        ) {
          found = true;
          break;
        }
      }
      if (!found) {
        addError(context, {
          message: 'Map entry not found',
          received: target,
          expected: sub,
        });
        return false;
      }
    }
    return true;
  }

  // Handle type mismatches (but treat as value mismatch for primitives)
  if (typeof target !== typeof sub) {
    addError(context, {
      message: 'Value mismatch',
      received: target,
      expected: sub,
    });
    return false;
  }

  // Handle arrays
  if (Array.isArray(sub)) {
    if (!Array.isArray(target)) {
      addError(context, {
        message: 'Expected array',
        received: target,
        expected: sub,
      });
      return false;
    }

    if (target.length < sub.length) {
      addError(context, {
        message: `Array too short: expected at least ${sub.length} elements, got ${target.length}`,
        received: target,
        expected: sub,
      });
      return false;
    }

    let allMatch = true;
    for (let i = 0; i < sub.length; i++) {
      const oldPath = context.path;
      context.path = [...oldPath, `[${i}]`];
      const result = partialEqualInternal(target[i], sub[i], context);
      context.path = oldPath;
      if (!result) allMatch = false;
    }
    return allMatch;
  }

  // Handle objects
  if (typeof sub === 'object') {
    if (typeof target !== 'object' || Array.isArray(target)) {
      addError(context, {
        message: 'Expected object',
        received: target,
        expected: sub,
      });
      return false;
    }

    let allMatch = true;

    for (const key of Object.keys(sub)) {
      if (isComparison(sub[key]) && sub[key]['~sc'][0] === 'keyNotBePresent') {
        if (has.call(target, key)) {
          const oldPath = context.path;
          context.path = [...oldPath, key];
          addError(context, {
            message: 'Key should not be present',
            received: target[key],
          });
          context.path = oldPath;
          allMatch = false;
        }
        continue;
      }

      // Check if key exists in target
      if (!has.call(target, key)) {
        // Key doesn't exist, but check if sub[key] is a comparison that can handle missing keys
        if (isComparison(sub[key])) {
          const comparison = sub[key]['~sc'];

          // Check if it's an any() comparison that includes keyNotBePresent
          if (comparison[0] === 'any') {
            const anyComparisons = comparison[1] as ComparisonsType[];
            const hasKeyNotBePresent = anyComparisons.some(
              (comp) => comp[0] === 'keyNotBePresent',
            );

            if (hasKeyNotBePresent) {
              // keyNotBePresent matches since the key doesn't exist
              continue;
            }
          }
        }

        // Property is missing and not handled by special logic
        const oldPath = context.path;
        context.path = [...oldPath, key];
        addError(context, {
          message: 'Missing property',
          expected: sub[key],
          received: { objectWithKeys: Object.keys(target) },
        });
        context.path = oldPath;
        allMatch = false;
        continue;
      }

      const oldPath = context.path;
      context.path = [...oldPath, key];
      const result = partialEqualInternal(target[key], sub[key], context);
      context.path = oldPath;
      if (!result) allMatch = false;
    }
    return allMatch;
  }

  // Handle primitive values
  if (target !== sub) {
    addError(context, {
      message: 'Value mismatch',
      received: target,
      expected: sub,
    });
    return false;
  }

  return true;
}

function checkNoExtraKeys(
  target: any,
  partialShape: any,
  context: ErrorCollectionContext,
  deep: boolean,
): boolean {
  if (typeof target !== 'object' || target === null || Array.isArray(target)) {
    addError(context, {
      message: 'Expected object for key validation',
      received: target,
    });
    return false;
  }

  // First check that the partial shape matches
  if (!partialEqualInternal(target, partialShape, context)) {
    return false;
  }

  // Check for extra keys
  const allowedKeys = new Set(Object.keys(partialShape));
  for (const key of Object.keys(target)) {
    if (!allowedKeys.has(key)) {
      const oldPath = context.path;
      context.path = [...oldPath, key];
      addError(context, {
        message: `Extra key "${key}" should not be present`,
        received: target[key],
      });
      context.path = oldPath;
      return false;
    }
  }

  // If deep checking, recursively check nested objects
  if (deep) {
    for (const key of Object.keys(partialShape)) {
      if (
        typeof partialShape[key] === 'object' &&
        partialShape[key] !== null &&
        !Array.isArray(partialShape[key]) &&
        !isComparison(partialShape[key])
      ) {
        const oldPath = context.path;
        context.path = [...oldPath, key];
        const result = checkNoExtraKeys(
          target[key],
          partialShape[key],
          context,
          true,
        );
        context.path = oldPath;
        if (!result) return false;
      }
    }
  }

  return true;
}

function checkNoExtraDefinedKeys(
  target: any,
  partialShape: any,
  context: ErrorCollectionContext,
  deep: boolean,
): boolean {
  if (typeof target !== 'object' || target === null || Array.isArray(target)) {
    addError(context, {
      message: 'Expected object for key validation',
      received: target,
    });
    return false;
  }

  // First check that the partial shape matches
  if (!partialEqualInternal(target, partialShape, context)) {
    return false;
  }

  // Check for extra defined keys (ignore undefined values)
  const allowedKeys = new Set(Object.keys(partialShape));
  for (const key of Object.keys(target)) {
    if (!allowedKeys.has(key) && target[key] !== undefined) {
      const oldPath = context.path;
      context.path = [...oldPath, key];
      addError(context, {
        message: `Extra defined key "${key}" should not be present`,
        received: target[key],
      });
      context.path = oldPath;
      return false;
    }
  }

  // If deep checking, recursively check nested objects
  if (deep) {
    for (const key of Object.keys(partialShape)) {
      if (
        typeof partialShape[key] === 'object' &&
        partialShape[key] !== null &&
        !Array.isArray(partialShape[key]) &&
        !isComparison(partialShape[key])
      ) {
        const oldPath = context.path;
        context.path = [...oldPath, key];
        const result = checkNoExtraDefinedKeys(
          target[key],
          partialShape[key],
          context,
          true,
        );
        context.path = oldPath;
        if (!result) return false;
      }
    }
  }

  return true;
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
export function partialEqual(
  target: any,
  sub: any,
  returnErrors: true,
): Result<void, PartialError[]>;
export function partialEqual(target: any, sub: any): boolean;
export function partialEqual(
  target: any,
  sub: any,
  returnErrors?: boolean,
): boolean | Result<void, PartialError[]> {
  const context: ErrorCollectionContext = { errors: [], path: [] };
  const result = partialEqualInternal(target, sub, context);

  if (returnErrors) {
    return result ? ok(undefined) : err(context.errors);
  }

  return result;
}
