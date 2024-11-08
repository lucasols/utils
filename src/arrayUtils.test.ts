import { describe, expect, test } from 'vitest';
import { findAfterIndex, findBeforeIndex } from './arrayUtils';

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
