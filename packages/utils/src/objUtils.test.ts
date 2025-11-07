import { assert, describe, expect, test } from 'vitest';
import {
  addPrefixToObjKeys,
  addSuffixToObjKeys,
  filterObjectKeys,
  getObjPropertyOrInsert,
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

describe('getObjPropertyOrInsert', () => {
  test('should return existing property value when it exists', () => {
    const obj = { count: 5, name: 'test' };
    const insertFn = () => 10;

    const result = getObjPropertyOrInsert(obj, 'count', insertFn);

    typingTest.expectType<TestTypeIsEqual<typeof result, number>>();
    expect(result).toBe(5);
    expect(obj.count).toBe(5);
  });

  test('should insert and return new value when property is undefined', () => {
    const obj: { count?: number; name: string } = { name: 'test' };
    const insertFn = () => 10;

    const result = getObjPropertyOrInsert(obj, 'count', insertFn);

    typingTest.expectType<TestTypeIsEqual<typeof result, number>>();
    expect(result).toBe(10);
    expect(obj.count).toBe(10);
  });

  test('should insert array when property is undefined', () => {
    const obj: { items?: string[] } = {};
    const insertFn = () => ['a', 'b', 'c'];

    const result = getObjPropertyOrInsert(obj, 'items', insertFn);

    typingTest.expectType<TestTypeIsEqual<typeof result, string[]>>();
    expect(result).toEqual(['a', 'b', 'c']);
    expect(obj.items).toEqual(['a', 'b', 'c']);
  });

  test('should insert object when property is undefined', () => {
    const obj: { config?: { enabled: boolean } } = {};
    const insertFn = () => ({ enabled: true });

    const result = getObjPropertyOrInsert(obj, 'config', insertFn);

    typingTest.expectType<
      TestTypeIsEqual<typeof result, { enabled: boolean }>
    >();
    expect(result).toEqual({ enabled: true });
    expect(obj.config).toEqual({ enabled: true });
  });

  test('should mutate the original object', () => {
    const obj: { cache?: Map<string, number> } = {};
    const insertFn = () => new Map([['key', 1]]);

    const result = getObjPropertyOrInsert(obj, 'cache', insertFn);

    expect(result).toBe(obj.cache);
    expect(obj.cache?.get('key')).toBe(1);
  });

  test('should handle zero as existing value', () => {
    const obj = { count: 0 };
    const insertFn = () => 10;

    const result = getObjPropertyOrInsert(obj, 'count', insertFn);

    expect(result).toBe(0);
    expect(obj.count).toBe(0);
  });

  test('should handle empty string as existing value', () => {
    const obj = { text: '' };
    const insertFn = () => 'default';

    const result = getObjPropertyOrInsert(obj, 'text', insertFn);

    expect(result).toBe('');
    expect(obj.text).toBe('');
  });

  test('should handle false as existing value', () => {
    const obj = { flag: false };
    const insertFn = () => true;

    const result = getObjPropertyOrInsert(obj, 'flag', insertFn);

    expect(result).toBe(false);
    expect(obj.flag).toBe(false);
  });
});

describe('addPrefixToObjKeys', () => {
  test('should add prefix to all object keys', () => {
    const obj = { name: 'John', age: 30, city: 'NYC' };

    const result = addPrefixToObjKeys(obj, 'user_');

    typingTest.expectType<
      TestTypeIsEqual<
        typeof result,
        { user_name: string; user_age: number; user_city: string }
      >
    >();
    expect(result).toEqual({
      user_name: 'John',
      user_age: 30,
      user_city: 'NYC',
    });
  });

  test('should work with empty prefix', () => {
    const obj = { a: 1, b: 2 };

    const result = addPrefixToObjKeys(obj, '');

    expect(result).toEqual({ a: 1, b: 2 });
  });

  test('should preserve value types', () => {
    const obj = {
      str: 'text',
      num: 42,
      bool: true,
      arr: [1, 2, 3],
      nested: { key: 'value' },
      nul: null,
    };

    const result = addPrefixToObjKeys(obj, 'data_');

    expect(result.data_str).toBe('text');
    expect(result.data_num).toBe(42);
    expect(result.data_bool).toBe(true);
    expect(result.data_arr).toEqual([1, 2, 3]);
    expect(result.data_nested).toEqual({ key: 'value' });
    expect(result.data_nul).toBe(null);
  });

  test('should work with empty object', () => {
    const obj = {};

    const result = addPrefixToObjKeys(obj, 'prefix_');

    expect(result).toEqual({});
  });

  test('should handle special characters in prefix', () => {
    const obj = { id: 1, name: 'test' };

    const result = addPrefixToObjKeys(obj, '$_');

    expect(result).toEqual({ $_id: 1, $_name: 'test' });
  });

  test('should not mutate original object', () => {
    const obj = { a: 1, b: 2 };
    const original = { ...obj };

    addPrefixToObjKeys(obj, 'prefix_');

    expect(obj).toEqual(original);
  });
});

describe('addSuffixToObjKeys', () => {
  test('should add suffix to all object keys', () => {
    const obj = { name: 'John', age: 30, city: 'NYC' };

    const result = addSuffixToObjKeys(obj, '_old');

    typingTest.expectType<
      TestTypeIsEqual<
        typeof result,
        { name_old: string; age_old: number; city_old: string }
      >
    >();
    expect(result).toEqual({
      name_old: 'John',
      age_old: 30,
      city_old: 'NYC',
    });
  });

  test('should work with empty suffix', () => {
    const obj = { a: 1, b: 2 };

    const result = addSuffixToObjKeys(obj, '');

    expect(result).toEqual({ a: 1, b: 2 });
  });

  test('should preserve value types', () => {
    const obj = {
      str: 'text',
      num: 42,
      bool: true,
      arr: [1, 2, 3],
      nested: { key: 'value' },
      nul: null,
    };

    const result = addSuffixToObjKeys(obj, '_v1');

    expect(result.str_v1).toBe('text');
    expect(result.num_v1).toBe(42);
    expect(result.bool_v1).toBe(true);
    expect(result.arr_v1).toEqual([1, 2, 3]);
    expect(result.nested_v1).toEqual({ key: 'value' });
    expect(result.nul_v1).toBe(null);
  });

  test('should work with empty object', () => {
    const obj = {};

    const result = addSuffixToObjKeys(obj, '_suffix');

    expect(result).toEqual({});
  });

  test('should handle special characters in suffix', () => {
    const obj = { id: 1, name: 'test' };

    const result = addSuffixToObjKeys(obj, '_$');

    expect(result).toEqual({ id_$: 1, name_$: 'test' });
  });

  test('should not mutate original object', () => {
    const obj = { a: 1, b: 2 };
    const original = { ...obj };

    addSuffixToObjKeys(obj, '_suffix');

    expect(obj).toEqual(original);
  });
});
