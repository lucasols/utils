import { describe, expect, test } from 'vitest';
import {
  filterObjectKeys,
  looseGetObjectProperty,
  pick,
  rejectObjUndefinedValues,
  sortObjectKeys,
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

test('rejectObjUndefinedValues', () => {
  const obj: {
    a: number;
    b: undefined;
    c: { d: string };
    mayBeUndefined: undefined | string;
  } = { a: 1, b: undefined, c: { d: '3' }, mayBeUndefined: undefined };

  const result = rejectObjUndefinedValues(obj);

  typingTest.expectTypesAreEqual<
    typeof result,
    {
      a: number;
      c: { d: string };
      mayBeUndefined?: undefined | string;
      b?: undefined;
    }
  >();

  expect(result).toEqual({ a: 1, c: { d: '3' } });
});

describe('filterObjectKeys', () => {
  test('should return the filtered properties', () => {
    const obj = { a: 1, b: '2', c: { d: '3' } };

    const result = filterObjectKeys(
      obj,
      (key, value) => key === 'a' || value === '2',
    );

    typingTest.expectTypesAreEqual<
      typeof result,
      { a?: number; b?: string; c?: { d: string } }
    >();

    expect(result).toEqual({ a: 1, b: '2' });
  });
});

test('sortObjectKeys', () => {
  const obj = { b: 2, a: 1, c: 3 };

  const result = sortObjectKeys(obj, ([_, value]) => value);

  expect(result).toEqual({ a: 1, b: 2, c: 3 });
});
