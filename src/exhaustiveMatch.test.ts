import { exhaustiveMatch } from './exhaustiveMatch';
import { expect, test } from 'vitest';

function hasType<T>(value: T) {
  return value;
}

test('simple check', () => {
  exhaustiveMatch('a' as const).with({
    a: () => 'a',
  });
});

test('check excess keys', () => {
  exhaustiveMatch('a' as const).with({
    a: () => 'a',
    // @ts-expect-error missing keys
    b: () => 'b',
  });
});

test('missing keys', () => {
  expect(() => {
    exhaustiveMatch('a' as const).with(
      // @ts-expect-error missing keys
      {},
    );
  }).toThrowError('Exhaustive match failed: no match for a');
});

function performSimpleMatch(value: 'a' | 'b' | 'c') {
  const result = exhaustiveMatch(value).with<string | number>({
    a: () => 1,
    b: () => 'b',
    c: () => 'c',
  });

  hasType<string | number>(result);

  return result;
  //       ^?
}

function performMatch(
  value: 'a' | 'b' | 'c' | 'group' | 'group2' | 'group3' | 'group4' | 'never',
) {
  const result = exhaustiveMatch(value).with({
    a: () => 'a',
    b: () => 'B',
    c: () => 'C',
    group4: '_nxt',
    group: () => 'group',
    group3: '_nxt',
    group2: () => 'ok',
    never: '_never',
  });

  hasType<string>(result);

  return result;
  //       ^?
}

test('match works', () => {
  expect(performSimpleMatch('a')).toBe(1);
  expect(performSimpleMatch('b')).toBe('b');
  expect(performSimpleMatch('c')).toBe('c');
});

test('match works with references', () => {
  expect(performMatch('group4')).toBe('group');
  expect(performMatch('group2')).toBe('ok');
  expect(performMatch('group3')).toBe('ok');
});

test('match works with never', () => {
  expect(() => performMatch('never')).toThrowError(
    'Exhaustive match failed: no match for never',
  );
});
