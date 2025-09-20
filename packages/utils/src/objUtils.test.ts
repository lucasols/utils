import { assert, describe, expect, test } from 'vitest';
import {
  filterObjectKeys,
  getValueFromPath,
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

describe('getValueFromPath', () => {
  const testObj = {
    name: 'test',
    user: {
      id: 123,
      profile: {
        email: 'test@example.com',
        settings: {
          theme: 'dark',
        },
      },
    },
    items: [
      { name: 'item1', value: 100 },
      { name: 'item2', value: 200 },
      { name: 'item3', nested: { deep: 'value' } },
    ],
    mixed: {
      data: [
        { users: [{ name: 'John' }, { name: 'Jane' }] },
        { users: [{ name: 'Bob' }] },
      ],
    },
  };

  test('should return value for simple path', () => {
    const result = getValueFromPath(testObj, 'name');

    assert(result.ok);
    expect(result.value).toBe('test');
  });

  test('should return value for nested object path', () => {
    const result = getValueFromPath(testObj, 'user.profile.email');

    assert(result.ok);
    expect(result.value).toBe('test@example.com');
  });

  test('should return value for deeply nested path', () => {
    const result = getValueFromPath(testObj, 'user.profile.settings.theme');

    assert(result.ok);
    expect(result.value).toBe('dark');
  });

  test('should return value for array access with dot notation', () => {
    const result = getValueFromPath(testObj, 'items.0.name');

    assert(result.ok);
    expect(result.value).toBe('item1');
  });

  test('should return value for array access with bracket notation', () => {
    const result = getValueFromPath(testObj, 'items[1].value');

    assert(result.ok);
    expect(result.value).toBe(200);
  });

  test('should return value for nested array and object access', () => {
    const result = getValueFromPath(testObj, 'items[2].nested.deep');

    assert(result.ok);
    expect(result.value).toBe('value');
  });

  test('should return value for complex mixed notation', () => {
    const result = getValueFromPath(testObj, 'mixed.data[0].users[1].name');

    assert(result.ok);
    expect(result.value).toBe('Jane');
  });

  test('should return error for empty path', () => {
    const result = getValueFromPath(testObj, '');

    assert(!result.ok);
    expect(result.error.message).toBe('Path cannot be empty');
  });

  test('should return error for property not found', () => {
    const result = getValueFromPath(testObj, 'nonexistent');

    assert(!result.ok);
    expect(result.error.message).toBe("Property 'nonexistent' not found");
  });

  test('should return error for nested property not found', () => {
    const result = getValueFromPath(testObj, 'user.nonexistent');

    assert(!result.ok);
    expect(result.error.message).toBe("Property 'nonexistent' not found");
  });

  test('should return error for array index out of bounds', () => {
    const result = getValueFromPath(testObj, 'items[10].name');

    assert(!result.ok);
    expect(result.error.message).toBe('Array index \'10\' out of bounds');
  });

  test('should return error for accessing array index on non-array', () => {
    const result = getValueFromPath(testObj, 'name[0]');

    assert(!result.ok);
    expect(result.error.message).toBe(
      "Cannot access array index '0' on non-array value",
    );
  });

  test('should return error for accessing property on null', () => {
    const objWithNull = { data: null };
    const result = getValueFromPath(objWithNull, 'data.value');

    assert(!result.ok);
    expect(result.error.message).toBe(
      "Cannot access property 'value' on null or undefined",
    );
  });

  test('should return error for accessing property on primitive value', () => {
    const result = getValueFromPath(testObj, 'name.length');

    assert(!result.ok);
    expect(result.error.message).toBe(
      "Cannot access property 'length' on non-object value",
    );
  });

  test('should handle negative array indices as property names', () => {
    const objWithNegative = { items: { '-1': 'negative index' } };
    const result = getValueFromPath(objWithNegative, 'items.-1');

    assert(result.ok);
    expect(result.value).toBe('negative index');
  });

  test('should return value at root level for single property', () => {
    const result = getValueFromPath(testObj, 'user');

    assert(result.ok);
    expect(result.value).toEqual(testObj.user);
  });
});
