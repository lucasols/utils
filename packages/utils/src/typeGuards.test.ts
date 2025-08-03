import { describe, expect, test } from 'vitest';
import {
  arrayHasAtLeastXItems,
  isFunction,
  isNonEmptyArray,
  isObject,
  isPlainObject,
  isPromise,
  isTruthy,
  type NonEmptyArray,
} from './typeGuards';
import { typingTest } from './typingTestUtils';

describe('isObject', () => {
  test('should return true for objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
    expect(isObject(new Object())).toBe(true);
  });

  test('should return false for non-objects', () => {
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(42)).toBe(false);
    expect(isObject('string')).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject([1, 2, 3])).toBe(false);
  });
});

describe('isFunction', () => {
  test('should return true for functions', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function () {})).toBe(true);
    expect(isFunction(isFunction)).toBe(true);
  });

  test('should return false for non-functions', () => {
    expect(isFunction({})).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction(42)).toBe(false);
    expect(isFunction('string')).toBe(false);
    expect(isFunction(true)).toBe(false);
    expect(isFunction([])).toBe(false);
  });
});

describe('isPromise', () => {
  test('should return true for promises', () => {
    expect(isPromise(Promise.resolve())).toBe(true);
    expect(isPromise(new Promise(() => {}))).toBe(true);
  });

  test('should return false for non-promises', () => {
    expect(isPromise({})).toBe(false);
    expect(isPromise(null)).toBe(false);
    expect(isPromise(undefined)).toBe(false);
    expect(isPromise(42)).toBe(false);
    expect(isPromise('string')).toBe(false);
    expect(isPromise(true)).toBe(false);
    expect(isPromise([])).toBe(false);
    expect(isPromise({ then: 'not a function' })).toBe(false); // This is NOT a thenable object
  });
});

describe('isPlainObject', () => {
  test('should return true for plain objects', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
  });

  test('should return false for non-plain objects', () => {
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
    expect(isPlainObject(42)).toBe(false);
    expect(isPlainObject('string')).toBe(false);
    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(/regex/)).toBe(false);

    class TestClass {}
    expect(isPlainObject(new TestClass())).toBe(false);
  });
});

describe('isNonEmptyArray', () => {
  test('should return true for non-empty arrays', () => {
    expect(isNonEmptyArray([1])).toBe(true);
    expect(isNonEmptyArray([1, 2, 3])).toBe(true);
    expect(isNonEmptyArray(['a', 'b'])).toBe(true);
    expect(isNonEmptyArray([null])).toBe(true);
    expect(isNonEmptyArray([undefined])).toBe(true);
  });

  test('should return false for empty arrays', () => {
    expect(isNonEmptyArray([])).toBe(false);
  });

  // Note: isNonEmptyArray now only accepts T[], so non-array tests are not applicable

  typingTest.describe('type narrowing', () => {
    typingTest.test('should narrow number[] to NonEmptyArray<number>', () => {
      const numbers: number[] = [1, 2, 3];

      if (isNonEmptyArray(numbers)) {
        typingTest.expectTypesAre<typeof numbers, NonEmptyArray<number>>(
          'equal',
        );
        // First element should be number, not number | undefined
        typingTest.expectTypesAre<(typeof numbers)[0], number>('equal');
      }
    });

    typingTest.test('should work with union types', () => {
      const mixed: (string | number)[] = ['a', 1, 'b'];

      if (isNonEmptyArray(mixed)) {
        typingTest.expectTypesAre<typeof mixed, NonEmptyArray<string | number>>(
          'equal',
        );
        typingTest.expectTypesAre<(typeof mixed)[0], string | number>('equal');
      }
    });

    typingTest.test('should work with object arrays', () => {
      interface User {
        id: number;
        name: string;
      }

      const users: User[] = [{ id: 1, name: 'Alice' }];

      if (isNonEmptyArray(users)) {
        typingTest.expectTypesAre<typeof users, NonEmptyArray<User>>('equal');
        typingTest.expectTypesAre<(typeof users)[0], User>('equal');
      }
    });

    typingTest.test('should work with empty arrays', () => {
      const emptyNumbers: number[] = [];

      // Should not narrow when array is empty
      if (isNonEmptyArray(emptyNumbers)) {
        typingTest.expectTypesAre<typeof emptyNumbers, NonEmptyArray<number>>(
          'equal',
        );
      } else {
        // Should remain number[] when not narrowed
        typingTest.expectTypesAre<typeof emptyNumbers, number[]>('equal');
      }
    });

    typingTest.test('should work with const arrays', () => {
      const constArray = [1, 2, 3] as const;

      if (isNonEmptyArray(constArray)) {
        typingTest.expectTypesAre<(typeof constArray)[0], 1>('equal');
      }
    });
  });
});

describe('arrayHasAtLeastXItems', () => {
  test('should return true when array has at least the specified number of items', () => {
    const arr = [1, 2, 3, 4, 5];

    expect(arrayHasAtLeastXItems(arr, 1)).toBe(true);
    expect(arrayHasAtLeastXItems(arr, 2)).toBe(true);
    expect(arrayHasAtLeastXItems(arr, 3)).toBe(true);
    expect(arrayHasAtLeastXItems(arr, 4)).toBe(true);
    expect(arrayHasAtLeastXItems(arr, 5)).toBe(true);
  });

  test('should return false when array has fewer than the specified number of items', () => {
    const arr = [1, 2, 3];

    expect(arrayHasAtLeastXItems(arr, 4)).toBe(false);
    expect(arrayHasAtLeastXItems(arr, 5)).toBe(false);
  });

  test('should return false for empty array', () => {
    const arr: number[] = [];

    expect(arrayHasAtLeastXItems(arr, 1)).toBe(false);
    expect(arrayHasAtLeastXItems(arr, 2)).toBe(false);
    expect(arrayHasAtLeastXItems(arr, 3)).toBe(false);
  });

  typingTest.describe('type narrowing', () => {
    typingTest.test('should narrow to [T, ...T[]] for minLength: 1', () => {
      const arr: number[] = [1, 2, 3];

      if (arrayHasAtLeastXItems(arr, 1)) {
        typingTest.expectTypesAre<typeof arr, [number, ...number[]]>('equal');
        // First element should be number, not number | undefined
        typingTest.expectTypesAre<(typeof arr)[0], number>('equal');
      }
    });

    typingTest.test('should narrow to [T, T, ...T[]] for minLength: 2', () => {
      const arr: string[] = ['a', 'b', 'c'];

      if (arrayHasAtLeastXItems(arr, 2)) {
        typingTest.expectTypesAre<typeof arr, [string, string, ...string[]]>(
          'equal',
        );
        // First two elements should be string, not string | undefined
        typingTest.expectTypesAre<(typeof arr)[0], string>('equal');
        typingTest.expectTypesAre<(typeof arr)[1], string>('equal');
      }
    });

    typingTest.test(
      'should narrow to [T, T, T, ...T[]] for minLength: 3',
      () => {
        const arr: boolean[] = [true, false, true, false];

        if (arrayHasAtLeastXItems(arr, 3)) {
          typingTest.expectTypesAre<
            typeof arr,
            [boolean, boolean, boolean, ...boolean[]]
          >('equal');
          // First three elements should be boolean, not boolean | undefined
          typingTest.expectTypesAre<(typeof arr)[0], boolean>('equal');
          typingTest.expectTypesAre<(typeof arr)[1], boolean>('equal');
          typingTest.expectTypesAre<(typeof arr)[2], boolean>('equal');
        }
      },
    );

    typingTest.test(
      'should narrow to [T, T, T, T, ...T[]] for minLength: 4',
      () => {
        const arr: number[] = [1, 2, 3, 4, 5];

        if (arrayHasAtLeastXItems(arr, 4)) {
          typingTest.expectTypesAre<
            typeof arr,
            [number, number, number, number, ...number[]]
          >('equal');
          // First four elements should be number, not number | undefined
          typingTest.expectTypesAre<(typeof arr)[0], number>('equal');
          typingTest.expectTypesAre<(typeof arr)[1], number>('equal');
          typingTest.expectTypesAre<(typeof arr)[2], number>('equal');
          typingTest.expectTypesAre<(typeof arr)[3], number>('equal');
        }
      },
    );

    typingTest.test(
      'should narrow to [T, T, T, T, T, ...T[]] for minLength: 5',
      () => {
        const arr: string[] = ['a', 'b', 'c', 'd', 'e', 'f'];

        if (arrayHasAtLeastXItems(arr, 5)) {
          typingTest.expectTypesAre<
            typeof arr,
            [string, string, string, string, string, ...string[]]
          >('equal');
          // First five elements should be string, not string | undefined
          typingTest.expectTypesAre<(typeof arr)[0], string>('equal');
          typingTest.expectTypesAre<(typeof arr)[1], string>('equal');
          typingTest.expectTypesAre<(typeof arr)[2], string>('equal');
          typingTest.expectTypesAre<(typeof arr)[3], string>('equal');
          typingTest.expectTypesAre<(typeof arr)[4], string>('equal');
        }
      },
    );

    typingTest.test('should work with union types', () => {
      const mixed: (string | number)[] = ['a', 1, 'b', 2, 'c'];

      if (arrayHasAtLeastXItems(mixed, 3)) {
        typingTest.expectTypesAre<
          typeof mixed,
          [
            string | number,
            string | number,
            string | number,
            ...(string | number)[],
          ]
        >('equal');
        // First three elements should be string | number, not (string | number) | undefined
        typingTest.expectTypesAre<(typeof mixed)[0], string | number>('equal');
        typingTest.expectTypesAre<(typeof mixed)[1], string | number>('equal');
        typingTest.expectTypesAre<(typeof mixed)[2], string | number>('equal');
      }
    });

    typingTest.test('should work with object arrays', () => {
      interface User {
        id: number;
        name: string;
      }

      const users: User[] = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ];

      if (arrayHasAtLeastXItems(users, 2)) {
        typingTest.expectTypesAre<typeof users, [User, User, ...User[]]>(
          'equal',
        );
        // First two elements should be User, not User | undefined
        typingTest.expectTypesAre<(typeof users)[0], User>('equal');
        typingTest.expectTypesAre<(typeof users)[1], User>('equal');
      }
    });

    typingTest.test('should handle edge cases with exact length', () => {
      const exactLength1 = [1];
      const exactLength2 = [1, 2];
      const exactLength3 = [1, 2, 3];

      if (arrayHasAtLeastXItems(exactLength1, 1)) {
        typingTest.expectTypesAre<typeof exactLength1, [number, ...number[]]>(
          'equal',
        );
      }

      if (arrayHasAtLeastXItems(exactLength2, 2)) {
        typingTest.expectTypesAre<
          typeof exactLength2,
          [number, number, ...number[]]
        >('equal');
      }

      if (arrayHasAtLeastXItems(exactLength3, 3)) {
        typingTest.expectTypesAre<
          typeof exactLength3,
          [number, number, number, ...number[]]
        >('equal');
      }
    });
  });
});

describe('isTruthy', () => {
  test('should return true for truthy values', () => {
    expect(isTruthy(1)).toBe(true);
    expect(isTruthy(-1)).toBe(true);
    expect(isTruthy('hello')).toBe(true);
    expect(isTruthy(true)).toBe(true);
    expect(isTruthy({})).toBe(true);
    expect(isTruthy([])).toBe(true);
    expect(isTruthy(new Date())).toBe(true);
    expect(isTruthy(Infinity)).toBe(true);
  });

  test('should return false for falsy values', () => {
    expect(isTruthy(false)).toBe(false);
    expect(isTruthy(0)).toBe(false);
    expect(isTruthy('')).toBe(false);
    expect(isTruthy(null)).toBe(false);
    expect(isTruthy(undefined)).toBe(false);
    expect(isTruthy(NaN)).toBe(false);
    expect(isTruthy(0n)).toBe(false);
  });

  typingTest.describe('type narrowing', () => {
    typingTest.test('should narrow union types correctly', () => {
      const value: string | null | undefined = 'hello';

      if (isTruthy(value)) {
        typingTest.expectTypesAre<typeof value, string>('equal');
      }
    });

    typingTest.test('should exclude all falsy values from type', () => {
      const value = 5 as string | number | boolean | null | undefined;

      if (isTruthy(value)) {
        // Should exclude null, undefined, false, but cannot exclude specific falsy strings/numbers from general types
        typingTest.expectTypesAre<typeof value, string | number | true>(
          'equal',
        );
      }
    });

    typingTest.test('should handle literal types', () => {
      const value: 0 | 1 | '' | 'hello' | false | true = 1;

      if (isTruthy(value)) {
        typingTest.expectTypesAre<typeof value, 1>('equal');
      }
    });

    typingTest.test('should work with objects', () => {
      const value: { name: string } | null | undefined = { name: 'test' };

      if (isTruthy(value)) {
        typingTest.expectTypesAre<typeof value, { name: string }>('equal');
      }
    });
  });
});
