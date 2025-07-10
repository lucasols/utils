import { describe, expect, test } from 'vitest';
import {
  looseGetObjectProperty,
  pick,
  rejectObjUndefinedValues,
} from './objUtils';
import { typingTest, type TestTypeIsEqual } from './typingTestUtils';

describe('looseGetObjectProperty', () => {
  test('should return the property value', () => {
    const obj = { a: 1, b: '2', c: { d: '3' } };

    const result = looseGetObjectProperty(obj, 'a');

    typingTest.expectType<
      TestTypeIsEqual<
        typeof result,
        number | undefined | string | { d: string }
      >
    >();

    expect(result).toBe(1);
  });
});

test('rejectObjUndefinedValues', () => {
  const obj = { a: 1, b: undefined, c: { d: '3' } };

  const result = rejectObjUndefinedValues(obj);

  expect(result).toEqual({ a: 1, c: { d: '3' } });
});

describe('pick', () => {
  test('should return the picked properties', () => {
    const obj = { a: 1, b: '2', c: { d: '3' } };

    const result = pick(obj, ['a', 'c']);

    typingTest.expectType<
      TestTypeIsEqual<typeof result, { a: number; c: { d: string } }>
    >();

    expect(result).toEqual({ a: 1, c: { d: '3' } });
  });
});
