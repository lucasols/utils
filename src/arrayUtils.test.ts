import { describe, expect, test } from 'vitest';
import {
  findAfterIndex,
  findBeforeIndex,
  hasDuplicates,
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

test('rejectArrayUndefinedValues', () => {
  const array = [1, undefined, 3];

  const result = rejectArrayUndefinedValues(array);

  expect(result).toEqual([1, 3]);
});

test('rejectDuplicates', () => {
  const array = [1, 2, 2, 3];
  const result = rejectDuplicates(array);
  expect(result).toEqual([1, 2, 3]);

  const array2 = [1, 2, 3];
  const result2 = rejectDuplicates(array2);
  expect(result2).toEqual([1, 2, 3]);
});

test('hasDuplicates', () => {
  const array = [1, 2, 2, 3];
  const result = hasDuplicates(array);
  expect(result).toEqual(true);

  const array2 = [1, 2, 3];
  const result2 = hasDuplicates(array2);
  expect(result2).toEqual(false);
});
