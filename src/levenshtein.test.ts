import { expect, test } from 'vitest';
import { getClosestString, getClosestStringsUpToDist } from './levenshtein';

test('closest', () => {
  expect(getClosestString('hello', ['hello', 'world'])).toBe('hello');

  expect(
    getClosestString('hello', ['loren ipsum dot amet', 'unrelated string']),
  ).toBe(undefined);

  expect(getClosestString('hello', ['loren ipsum dot amet', 'heol'])).toBe(
    'heol',
  );
});

test('getClosestStringsUpToDist', () => {
  const testArray = [
    'hello',
    'loren',
    'hell',
    'help',
    'green',
    'hollow',
    'red',
    'blue',
  ];

  expect(getClosestStringsUpToDist('hello', testArray)).toEqual([
    'hello',
    'hell',
    'help',
    'hollow',
  ]);
});
