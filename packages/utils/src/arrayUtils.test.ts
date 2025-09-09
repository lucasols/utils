import { describe, expect, test } from 'vitest';
import {
  arrayOps,
  findAfterIndex,
  findAndMap,
  findBeforeIndex,
  rejectArrayUndefinedValues,
  rejectDuplicates,
  truncateArray,
} from './arrayUtils';
import { typingTest } from './typingTestUtils';

describe('findAfterIndex', () => {
  test('not throws', () => {
    expect(findAfterIndex([1, 2, 3], 1, () => true)).toEqual(3);
    // last index
    expect(findAfterIndex([1, 2, 3], 2, () => true)).toEqual(undefined);
    // out of bound index
    expect(findAfterIndex([1, 2, 3], 20, () => true)).toEqual(undefined);
    expect(findAfterIndex([1, 2, 3], -20, () => true)).toEqual(undefined);
  });
});

describe('findBeforeIndex', () => {
  test('not throws', () => {
    expect(findBeforeIndex([1, 2, 3], 1, () => true)).toEqual(1);
    // first index
    expect(findBeforeIndex([1, 2, 3], 0, () => true)).toEqual(undefined);
    // out of bound index
    expect(findBeforeIndex([1, 2, 3], -20, () => true)).toEqual(undefined);
    expect(findBeforeIndex([1, 2, 3], 20, () => true)).toEqual(3);
  });
});

describe('rejectArrayUndefinedValues', () => {
  test('rejectArrayUndefinedValues', () => {
    const array = [1, undefined, 3];

    const result = rejectArrayUndefinedValues(array);

    expect(result).toEqual([1, 3]);
  });
});

describe('rejectDuplicates', () => {
  test('should remove duplicate numbers', () => {
    const array = [1, 2, 2, 3];
    const result = rejectDuplicates(array);
    expect(result).toEqual([1, 2, 3]);
  });

  test('should return the same array if no duplicates', () => {
    const array2 = [1, 2, 3];
    const result2 = rejectDuplicates(array2);
    expect(result2).toEqual([1, 2, 3]);
  });

  test('should return a single element if all elements are duplicates', () => {
    const array4 = [1, 1, 1, 1];
    const result4 = rejectDuplicates(array4);
    expect(result4).toEqual([1]);
  });

  test('should handle multiple duplicates', () => {
    const array5 = [1, 2, 2, 3, 3, 3, 4, 5, 5];
    const result5 = rejectDuplicates(array5);
    expect(result5).toEqual([1, 2, 3, 4, 5]);
  });

  test('should use getKey to determine uniqueness for objects', () => {
    const array = [
      { id: 1, value: 'a' },
      { id: 2, value: 'b' },
      { id: 1, value: 'c' },
    ];
    const result = rejectDuplicates(array, (item) => item.id);
    expect(result).toEqual([
      { id: 1, value: 'a' },
      { id: 2, value: 'b' },
    ]);
  });

  test('should use getKey with different types', () => {
    const array = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Alice' },
    ];
    const result = rejectDuplicates(array, (item) => item.name);
    expect(result).toEqual([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]);
  });
});

describe('truncateArray', () => {
  test('should return the same array if maxLength is greater than array length', () => {
    const array = [1, 2, 3];
    expect(truncateArray(array, 5)).toEqual([1, 2, 3]);
  });

  test('should truncate the array to maxLength', () => {
    const array = [1, 2, 3, 4, 5];
    expect(truncateArray(array, 3)).toEqual([1, 2, 3]);
  });

  test('should append the given value if array is truncated', () => {
    const array = [1, 2, 3, 4, 5];
    expect(truncateArray(array, 3, 99)).toEqual([1, 2, 3, 99]);
  });

  test('should append the result of the function if array is truncated', () => {
    const array = [1, 2, 3, 4, 5];
    const appendFn = (count: number) => count * 10;
    expect(truncateArray(array, 3, appendFn)).toEqual([1, 2, 3, 20]);
  });

  test('should not append if array is not truncated', () => {
    const array = [1, 2, 3];
    expect(truncateArray(array, 3, 99)).toEqual([1, 2, 3]);
    expect(truncateArray(array, 5, 99)).toEqual([1, 2, 3]);
  });

  test('should return an empty array if input is empty', () => {
    const array: number[] = [];
    expect(truncateArray(array, 3, 99)).toEqual([]);
  });

  test('should handle maxLength of 0', () => {
    const array = [1, 2, 3];
    expect(truncateArray(array, 0)).toEqual([]);
    expect(truncateArray(array, 0, 99)).toEqual([99]);
    expect(truncateArray(array, 0, (count) => count * 100)).toEqual([300]);
  });

  test('should not return a new array instance when not truncating', () => {
    const array = [1, 2, 3];
    const result = truncateArray(array, 5);
    expect(result === array).toBe(true);
  });

  test('should return a new array instance when truncating', () => {
    const array = [1, 2, 3, 4, 5];
    const result = truncateArray(array, 3);
    expect(result).toEqual([1, 2, 3]);
    expect(result).not.toBe(array);
  });
});

describe('findAndMap', () => {
  test('should find and map the first matching item', () => {
    const array = [1, 2, 3, 4];
    const result = findAndMap(array, (item) => (item > 2 ? item * 10 : false));

    expect(result).toMatchInlineSnapshot(`30`);
  });

  test('should return undefined when no items match', () => {
    const array = [1, 2, 3];
    const result = findAndMap(array, (item) => (item > 5 ? item : false));

    expect(result).toMatchInlineSnapshot(`undefined`);
  });

  test('should return undefined for empty array', () => {
    const array: number[] = [];
    const result = findAndMap(array, (item) => item);

    expect(result).toMatchInlineSnapshot(`undefined`);
  });

  test('should return the first matching result when multiple items could match', () => {
    const array = [1, 2, 3, 4];
    const result = findAndMap(array, (item) =>
      item > 1 ? `item-${item}` : false,
    );

    expect(result).toMatchInlineSnapshot(`"item-2"`);
  });

  test('should work with object arrays', () => {
    const users = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ];

    const result = findAndMap(users, (user) =>
      user.age >= 30 ? user.name.toUpperCase() : false,
    );

    expect(result).toMatchInlineSnapshot(`"BOB"`);
  });

  test('should handle mixed return types', () => {
    const array = ['apple', 'banana', 'cherry'];
    const result = findAndMap(array, (item) =>
      item.startsWith('b') ? item.length : false,
    );

    expect(result).toMatchInlineSnapshot(`6`);
  });

  test('should handle truthy values that are not false', () => {
    const array = [0, 1, 2];
    const result = findAndMap(array, (item) => (item === 0 ? 'zero' : false));

    expect(result).toMatchInlineSnapshot(`"zero"`);
  });

  test('should distinguish false from other falsy values', () => {
    const array = [1, 2, 3];
    const result = findAndMap(array, (item) => (item === 2 ? 0 : false));

    expect(result).toMatchInlineSnapshot(`0`);
  });

  test('should work with complex mapping function', () => {
    const data = [
      { status: 'pending', value: 10 },
      { status: 'completed', value: 20 },
      { status: 'failed', value: 30 },
    ];

    const result = findAndMap(data, (item) =>
      item.status === 'completed' ? { processed: item.value * 2 } : false,
    );

    expect(result).toMatchInlineSnapshot(`
      {
        "processed": 40,
      }
    `);
  });
});

describe('arrayOps', () => {
  test('should provide filterAndMap method', () => {
    const array = [1, 2, 3, 4];
    const result = arrayOps(array).filterAndMap((item) =>
      item % 2 === 0 ? item * 2 : false,
    );

    typingTest.expectTypesAre<typeof result, number[]>('equal');
    expect(result).toMatchInlineSnapshot(`
      [
        4,
        8,
      ]
    `);
  });

  test('should provide sortBy method', () => {
    const array = [3, 1, 4, 2];
    const result = arrayOps(array).sortBy((item) => item, 'asc');

    typingTest.expectTypesAre<typeof result, number[]>('equal');
    expect(result).toMatchInlineSnapshot(`
      [
        1,
        2,
        3,
        4,
      ]
    `);
  });

  test('should provide rejectDuplicates method', () => {
    const array = [1, 2, 2, 3, 1];
    const result = arrayOps(array).rejectDuplicates((item) => item);

    typingTest.expectTypesAre<typeof result, number[]>('equal');
    expect(result).toMatchInlineSnapshot(`
      [
        1,
        2,
        3,
      ]
    `);
  });

  test('should provide findAndMap method', () => {
    const array = [1, 2, 3, 4];
    const result = arrayOps(array).findAndMap((item) =>
      item > 2 ? `found-${item}` : false,
    );

    typingTest.expectTypesAre<typeof result, string | undefined>('equal');
    expect(result).toMatchInlineSnapshot(`"found-3"`);
  });
});
