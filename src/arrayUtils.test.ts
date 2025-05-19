import { describe, expect, test } from 'vitest';
import {
  findAfterIndex,
  findBeforeIndex,
  rejectArrayUndefinedValues,
  rejectDuplicates,
} from './arrayUtils';

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
