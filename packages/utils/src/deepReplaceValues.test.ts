import { describe, expect, test } from 'vitest';
import { deepReplaceValues } from './deepReplaceValues';

describe('deepReplaceValues', () => {
  test('should replace values in simple object', () => {
    const input = { a: 1, b: 'hello', c: true };
    const result = deepReplaceValues(input, (value, _path) => {
      if (typeof value === 'number') {
        return { newValue: value * 2 };
      }
      return false;
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "a": 2,
        "b": "hello",
        "c": true,
      }
    `);
  });

  test('should replace values in simple array', () => {
    const input = [1, 'hello', true, 42];
    const result = deepReplaceValues(input, (value, _path) => {
      if (typeof value === 'number') {
        return { newValue: value * 10 };
      }
      return false;
    });

    expect(result).toMatchInlineSnapshot(`
      [
        10,
        "hello",
        true,
        420,
      ]
    `);
  });

  test('should replace values in nested structures', () => {
    const input = {
      level1: {
        level2: {
          value: 5,
          arr: [1, 2, { nested: 3 }],
        },
      },
      topLevel: 10,
    };

    const result = deepReplaceValues(input, (value) => {
      if (typeof value === 'number') {
        return { newValue: `num_${value}` };
      }
      return false;
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "level1": {
          "level2": {
            "arr": [
              "num_1",
              "num_2",
              {
                "nested": "num_3",
              },
            ],
            "value": "num_5",
          },
        },
        "topLevel": "num_10",
      }
    `);
  });

  test('should provide correct paths to replacement function', () => {
    const input = {
      a: 1,
      b: {
        c: 2,
        d: [3, { e: 4 }],
      },
    };

    const paths: string[] = [];
    deepReplaceValues(input, (value, path) => {
      paths.push(path);
      return false;
    });

    expect(paths).toMatchInlineSnapshot(`
      [
        "",
        "a",
        "b",
        "b.c",
        "b.d",
        "b.d[0]",
        "b.d[1]",
        "b.d[1].e",
      ]
    `);
  });

  test('should handle arrays with correct path indexing', () => {
    const input = [{ name: 'item1' }, { name: 'item2', nested: [1, 2] }];

    const paths: string[] = [];
    deepReplaceValues(input, (value, path) => {
      if (typeof value === 'string' || typeof value === 'number') {
        paths.push(path);
      }
      return false;
    });

    expect(paths).toMatchInlineSnapshot(`
      [
        "[0].name",
        "[1].name",
        "[1].nested[0]",
        "[1].nested[1]",
      ]
    `);
  });

  test('should handle replacement of entire objects and arrays', () => {
    const input = {
      obj: { replace: true },
      arr: [1, 2, 3],
      keep: 'this',
    };

    const result = deepReplaceValues(input, (value, path) => {
      if (path === 'obj') {
        return { newValue: 'replaced_object' };
      }
      if (path === 'arr') {
        return { newValue: 'replaced_array' };
      }
      return false;
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "arr": "replaced_array",
        "keep": "this",
        "obj": "replaced_object",
      }
    `);
  });

  test('should handle null and undefined values', () => {
    const input = {
      nullValue: null,
      undefinedValue: undefined,
      nested: {
        alsoNull: null,
      },
    };

    const result = deepReplaceValues(input, (value) => {
      if (value === null) {
        return { newValue: 'was_null' };
      }
      if (value === undefined) {
        return { newValue: 'was_undefined' };
      }
      return false;
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "nested": {
          "alsoNull": "was_null",
        },
        "nullValue": "was_null",
        "undefinedValue": "was_undefined",
      }
    `);
  });

  test('should handle empty objects and arrays', () => {
    const input = {
      emptyObj: {},
      emptyArr: [],
      nested: {
        alsoEmpty: {},
      },
    };

    const result = deepReplaceValues(input, (value) => {
      if (Array.isArray(value) && value.length === 0) {
        return { newValue: 'empty_array' };
      }
      return false;
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "emptyArr": "empty_array",
        "emptyObj": {},
        "nested": {
          "alsoEmpty": {},
        },
      }
    `);
  });

  test('should handle primitive values at root level', () => {
    expect(
      deepReplaceValues('hello', (value) =>
        typeof value === 'string' ? { newValue: value.toUpperCase() } : false,
      ),
    ).toBe('HELLO');

    expect(
      deepReplaceValues(42, (value) =>
        typeof value === 'number' ? { newValue: value * 2 } : false,
      ),
    ).toBe(84);

    expect(
      deepReplaceValues(true, (value) =>
        typeof value === 'boolean' ? { newValue: !value } : false,
      ),
    ).toBe(false);
  });

  test('should not replace when callback returns false', () => {
    const input = { a: 1, b: 2, c: 3 };
    const result = deepReplaceValues(input, () => false);

    expect(result).toEqual(input);
    expect(result).not.toBe(input); // Should create new object
  });

  test('should throw error on circular references in objects', () => {
    const input: any = { a: 1 };
    input.circular = input;

    expect(() => {
      deepReplaceValues(input, () => false);
    }).toThrowErrorMatchingInlineSnapshot(
      `[Error: Circular reference detected in object]`,
    );
  });

  test('should throw error on circular references in arrays', () => {
    const input: any = [1, 2];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    input.push(input);

    expect(() => {
      deepReplaceValues(input, () => false);
    }).toThrowErrorMatchingInlineSnapshot(
      `[Error: Circular reference detected in array]`,
    );
  });

  test('should handle complex mixed data structures', () => {
    const input = {
      users: [
        { id: 1, name: 'Alice', active: true },
        { id: 2, name: 'Bob', active: false },
      ],
      config: {
        settings: {
          theme: 'dark',
          version: 1.5,
        },
      },
      metadata: null,
    };

    const result = deepReplaceValues(input, (value, path) => {
      // Replace IDs with UUIDs
      if (path.endsWith('.id')) {
        return { newValue: `uuid-${value}` };
      }
      // Convert version numbers to strings
      if (path.endsWith('.version')) {
        return { newValue: `v${value}` };
      }
      // Replace null with empty object
      if (value === null) {
        return { newValue: {} };
      }
      return false;
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "config": {
          "settings": {
            "theme": "dark",
            "version": "v1.5",
          },
        },
        "metadata": {},
        "users": [
          {
            "active": true,
            "id": "uuid-1",
            "name": "Alice",
          },
          {
            "active": false,
            "id": "uuid-2",
            "name": "Bob",
          },
        ],
      }
    `);
  });

  test('should preserve type information when possible', () => {
    interface User {
      id: number;
      name: string;
    }

    const input: User = { id: 1, name: 'test' };
    const result = deepReplaceValues(input, (value) => {
      if (typeof value === 'number') {
        return { newValue: value + 100 };
      }
      return false;
    });

    // TypeScript should infer the correct type
    expect(result.id).toBe(101);
    expect(result.name).toBe('test');
  });

  test('should handle Date objects as non-plain objects', () => {
    const input = {
      date: new Date('2023-01-01'),
      obj: { nested: true },
    };

    const result = deepReplaceValues(input, (value) => {
      if (value instanceof Date) {
        return { newValue: value.toISOString() };
      }
      return false;
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "date": "2023-01-01T00:00:00.000Z",
        "obj": {
          "nested": true,
        },
      }
    `);
  });

  test('should handle class instances as non-plain objects', () => {
    class CustomClass {
      constructor(public value: number) {}
    }

    const input = {
      instance: new CustomClass(42),
      obj: { nested: true },
    };

    const result = deepReplaceValues(input, (value) => {
      if (value instanceof CustomClass) {
        return { newValue: `class_instance_${value.value}` };
      }
      return false;
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "instance": "class_instance_42",
        "obj": {
          "nested": true,
        },
      }
    `);
  });
});
