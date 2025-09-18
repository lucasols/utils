import { assert, describe, expect, test } from 'vitest';
import { match, partialEqual } from './partialEqual';
import { compactSnapshot } from './testUtils';

describe('primitive values', () => {
  test('identical primitives should match', () => {
    expect(partialEqual(1, 1)).toBe(true);
    expect(partialEqual('hello', 'hello')).toBe(true);
    expect(partialEqual(true, true)).toBe(true);
    expect(partialEqual(null, null)).toBe(true);
    expect(partialEqual(undefined, undefined)).toBe(true);
  });

  test('different primitives should not match', () => {
    expect(partialEqual(1, 2)).toBe(false);
    expect(partialEqual('hello', 'world')).toBe(false);
    expect(partialEqual(true, false)).toBe(false);
    expect(partialEqual(null, undefined)).toBe(false);
  });

  test('NaN should equal NaN', () => {
    expect(partialEqual(NaN, NaN)).toBe(true);
  });

  test('different types should not match', () => {
    expect(partialEqual(1, '1')).toBe(false);
    expect(partialEqual(true, 1)).toBe(false);
    expect(partialEqual(null, 0)).toBe(false);
  });
});

describe('objects', () => {
  test('empty objects should match', () => {
    expect(partialEqual({}, {})).toBe(true);
  });

  test('sub with fewer properties should match', () => {
    expect(partialEqual({ a: 1, b: 2 }, { a: 1 })).toBe(true);
    expect(partialEqual({ a: 1, b: 2, c: 3 }, { b: 2, c: 3 })).toBe(true);
  });

  test('sub with more properties should not match', () => {
    expect(partialEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  test('sub with different values should not match', () => {
    expect(partialEqual({ a: 1, b: 2 }, { a: 2 })).toBe(false);
    expect(partialEqual({ a: 1, b: 2 }, { b: 3 })).toBe(false);
  });

  test('sub with missing properties should not match', () => {
    expect(partialEqual({ a: 1 }, { b: 2 })).toBe(false);
    expect(partialEqual({ a: 1, b: 2 }, { c: 3 })).toBe(false);
  });

  test('nested objects should work', () => {
    const target = { a: 1, b: { c: 2, d: 3 }, e: 4 };
    expect(partialEqual(target, { b: { c: 2 } })).toBe(true);
    expect(partialEqual(target, { a: 1, b: { d: 3 } })).toBe(true);
    expect(partialEqual(target, { b: { c: 2, d: 3 } })).toBe(true);
    expect(partialEqual(target, { b: { c: 2, d: 4 } })).toBe(false);
    expect(partialEqual(target, { b: { c: 2, d: 3, e: 5 } })).toBe(false);
  });

  test('deeply nested structures', () => {
    const target = {
      user: {
        profile: {
          name: 'John',
          age: 30,
          settings: { theme: 'dark', notifications: true },
        },
        posts: [{ id: 1, title: 'Hello' }],
      },
    };

    expect(partialEqual(target, { user: { profile: { name: 'John' } } })).toBe(
      true,
    );
    expect(
      partialEqual(target, {
        user: { profile: { settings: { theme: 'dark' } } },
      }),
    ).toBe(true);
    expect(partialEqual(target, { user: { posts: [{ id: 1 }] } })).toBe(true);
    expect(partialEqual(target, { user: { profile: { name: 'Jane' } } })).toBe(
      false,
    );
  });
});

describe('arrays', () => {
  test('empty arrays should match', () => {
    expect(partialEqual([], [])).toBe(true);
  });

  test('sub array with fewer elements should match', () => {
    expect(partialEqual([1, 2, 3], [1, 2])).toBe(true);
    expect(partialEqual([1, 2, 3], [1])).toBe(true);
    expect(partialEqual(['a', 'b', 'c'], ['a', 'b'])).toBe(true);
  });

  test('sub array with more elements should not match', () => {
    expect(partialEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(partialEqual(['a'], ['a', 'b'])).toBe(false);
  });

  test('sub array with different elements should not match', () => {
    expect(partialEqual([1, 2, 3], [1, 3])).toBe(false);
    expect(partialEqual([1, 2, 3], [2, 2])).toBe(false);
  });

  test('arrays with objects should work', () => {
    const target = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ];
    expect(partialEqual(target, [{ id: 1 }])).toBe(true);
    expect(partialEqual(target, [{ id: 1, name: 'John' }])).toBe(true);
    expect(partialEqual(target, [{ id: 1 }, { id: 2 }])).toBe(true);
    expect(partialEqual(target, [{ id: 1, name: 'Jane' }])).toBe(false);
  });

  test('nested arrays should work', () => {
    const target = [
      [1, 2],
      [3, 4, 5],
    ];
    expect(partialEqual(target, [[1]])).toBe(true);
    expect(partialEqual(target, [[1, 2]])).toBe(true);
    expect(partialEqual(target, [[1], [3]])).toBe(true);
    expect(
      partialEqual(target, [
        [1, 2],
        [3, 4],
      ]),
    ).toBe(true);
    expect(partialEqual(target, [[1, 3]])).toBe(false);
    expect(
      partialEqual(target, [
        [1, 2],
        [3, 4, 5, 6],
      ]),
    ).toBe(false);
  });
});

describe('Date objects', () => {
  test('same dates should match', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-01');
    expect(partialEqual(date1, date2)).toBe(true);
  });

  test('different dates should not match', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-02');
    expect(partialEqual(date1, date2)).toBe(false);
  });
});

describe('RegExp objects', () => {
  test('same regexes should match', () => {
    expect(partialEqual(/abc/g, /abc/g)).toBe(true);
    expect(partialEqual(/test/i, /test/i)).toBe(true);
  });

  test('different regexes should not match', () => {
    expect(partialEqual(/abc/g, /abc/i)).toBe(false);
    expect(partialEqual(/abc/, /def/)).toBe(false);
  });
});

describe('Set objects', () => {
  test('empty sets should match', () => {
    expect(partialEqual(new Set(), new Set())).toBe(true);
  });

  test('sub set with fewer elements should match', () => {
    const target = new Set([1, 2, 3]);
    expect(partialEqual(target, new Set([1, 2]))).toBe(true);
    expect(partialEqual(target, new Set([2]))).toBe(true);
  });

  test('sub set with more elements should not match', () => {
    const target = new Set([1, 2]);
    expect(partialEqual(target, new Set([1, 2, 3]))).toBe(false);
  });

  test('sub set with different elements should not match', () => {
    const target = new Set([1, 2, 3]);
    expect(partialEqual(target, new Set([1, 4]))).toBe(false);
  });

  test('sets with objects should work', () => {
    const target = new Set([{ id: 1 }, { id: 2 }]);
    expect(partialEqual(target, new Set([{ id: 1 }]))).toBe(true);
    expect(partialEqual(target, new Set([{ id: 3 }]))).toBe(false);
  });
});

describe('Map objects', () => {
  test('empty maps should match', () => {
    expect(partialEqual(new Map(), new Map())).toBe(true);
  });

  test('sub map with fewer entries should match', () => {
    const target = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    expect(partialEqual(target, new Map([['a', 1]]))).toBe(true);
    expect(
      partialEqual(
        target,
        new Map([
          ['a', 1],
          ['c', 3],
        ]),
      ),
    ).toBe(true);
  });

  test('sub map with more entries should not match', () => {
    const target = new Map([['a', 1]]);
    expect(
      partialEqual(
        target,
        new Map([
          ['a', 1],
          ['b', 2],
        ]),
      ),
    ).toBe(false);
  });

  test('sub map with different values should not match', () => {
    const target = new Map([
      ['a', 1],
      ['b', 2],
    ]);
    expect(partialEqual(target, new Map([['a', 2]]))).toBe(false);
  });

  test('sub map with missing keys should not match', () => {
    const target = new Map([['a', 1]]);
    expect(partialEqual(target, new Map([['b', 1]]))).toBe(false);
  });

  test('maps with object keys should work', () => {
    const key1 = { id: 1 };
    const key2 = { id: 2 };
    const target = new Map([
      [key1, 'value1'],
      [key2, 'value2'],
    ]);
    expect(partialEqual(target, new Map([[{ id: 1 }, 'value1']]))).toBe(true);
    expect(partialEqual(target, new Map([[{ id: 3 }, 'value1']]))).toBe(false);
  });
});

describe('mixed types', () => {
  test('should handle complex nested structures', () => {
    const target = {
      users: [
        { id: 1, profile: { name: 'John', age: 30 } },
        { id: 2, profile: { name: 'Jane', age: 25 } },
      ],
      settings: new Map<string, any>([
        ['theme', 'dark'],
        ['notifications', true],
      ]),
      tags: new Set(['typescript', 'testing', 'utils']),
      metadata: {
        created: new Date('2023-01-01'),
        version: '1.0.0',
      },
    };

    expect(
      partialEqual(target, {
        users: [{ id: 1, profile: { name: 'John' } }],
        settings: new Map<string, any>([['theme', 'dark']]),
      }),
    ).toBe(true);

    expect(
      partialEqual(target, {
        tags: new Set(['typescript']),
        metadata: { version: '1.0.0' },
      }),
    ).toBe(true);

    expect(
      partialEqual(target, {
        users: [{ id: 1, profile: { name: 'Jane' } }],
      }),
    ).toBe(false);
  });
});

describe('edge cases', () => {
  test('should handle null and undefined', () => {
    expect(partialEqual(null, null)).toBe(true);
    expect(partialEqual(undefined, undefined)).toBe(true);
    expect(partialEqual(null, undefined)).toBe(false);
    expect(partialEqual({ a: null }, { a: null })).toBe(true);
    expect(partialEqual({ a: undefined }, { a: undefined })).toBe(true);
    expect(partialEqual({ a: null }, { a: undefined })).toBe(false);
  });

  test('should handle functions', () => {
    const fn1 = () => 'test';
    const fn2 = () => 'test';
    expect(partialEqual(fn1, fn1)).toBe(true);
    expect(partialEqual(fn1, fn2)).toBe(false);
  });

  test('should handle circular references without infinite recursion', () => {
    const circular1: any = { a: 1 };
    circular1.self = circular1;

    const circular2: any = { a: 1 };
    circular2.self = circular2;

    const sub: any = { a: 1 };

    expect(partialEqual(circular1, sub)).toBe(true);
  });
});

describe('special comparisons', () => {
  describe('string comparisons', () => {
    test('strContains should match substrings', () => {
      expect(partialEqual('hello world', match.str.contains('world'))).toBe(
        true,
      );
      expect(partialEqual('hello world', match.str.contains('xyz'))).toBe(
        false,
      );
      expect(partialEqual(123, match.str.contains('world'))).toBe(false);
    });

    test('strStartsWith should match prefixes', () => {
      expect(partialEqual('hello world', match.str.startsWith('hello'))).toBe(
        true,
      );
      expect(partialEqual('hello world', match.str.startsWith('world'))).toBe(
        false,
      );
      expect(partialEqual(123, match.str.startsWith('hello'))).toBe(false);
    });

    test('strEndsWith should match suffixes', () => {
      expect(partialEqual('hello world', match.str.endsWith('world'))).toBe(
        true,
      );
      expect(partialEqual('hello world', match.str.endsWith('hello'))).toBe(
        false,
      );
      expect(partialEqual(123, match.str.endsWith('world'))).toBe(false);
    });

    test('strMatchesRegex should match patterns', () => {
      expect(partialEqual('test123', match.str.matchesRegex(/\d+/))).toBe(true);
      expect(partialEqual('test', match.str.matchesRegex(/\d+/))).toBe(false);
      expect(partialEqual(123, match.str.matchesRegex(/\d+/))).toBe(false);
    });
  });

  describe('number comparisons', () => {
    test('numIsGreaterThan should compare numbers', () => {
      expect(partialEqual(10, match.num.isGreaterThan(5))).toBe(true);
      expect(partialEqual(5, match.num.isGreaterThan(10))).toBe(false);
      expect(partialEqual(5, match.num.isGreaterThan(5))).toBe(false);
      expect(partialEqual('10', match.num.isGreaterThan(5))).toBe(false);
    });

    test('numIsGreaterThanOrEqual should compare numbers', () => {
      expect(partialEqual(10, match.num.isGreaterThanOrEqual(5))).toBe(true);
      expect(partialEqual(5, match.num.isGreaterThanOrEqual(5))).toBe(true);
      expect(partialEqual(3, match.num.isGreaterThanOrEqual(5))).toBe(false);
    });

    test('numIsLessThan should compare numbers', () => {
      expect(partialEqual(3, match.num.isLessThan(5))).toBe(true);
      expect(partialEqual(10, match.num.isLessThan(5))).toBe(false);
      expect(partialEqual(5, match.num.isLessThan(5))).toBe(false);
    });

    test('numIsLessThanOrEqual should compare numbers', () => {
      expect(partialEqual(3, match.num.isLessThanOrEqual(5))).toBe(true);
      expect(partialEqual(5, match.num.isLessThanOrEqual(5))).toBe(true);
      expect(partialEqual(10, match.num.isLessThanOrEqual(5))).toBe(false);
    });

    test('numIsInRange should check range', () => {
      expect(partialEqual(5, match.num.isInRange([1, 10]))).toBe(true);
      expect(partialEqual(1, match.num.isInRange([1, 10]))).toBe(true);
      expect(partialEqual(10, match.num.isInRange([1, 10]))).toBe(true);
      expect(partialEqual(0, match.num.isInRange([1, 10]))).toBe(false);
      expect(partialEqual(11, match.num.isInRange([1, 10]))).toBe(false);
    });
  });

  describe('deep equal comparison', () => {
    test('deepEqual should match exactly', () => {
      expect(partialEqual({ a: 1, b: 2 }, match.equal({ a: 1, b: 2 }))).toBe(
        true,
      );
      expect(partialEqual({ a: 1, b: 2 }, match.equal({ a: 1 }))).toBe(false);
      expect(partialEqual([1, 2, 3], match.equal([1, 2, 3]))).toBe(true);
      expect(partialEqual([1, 2], match.equal([1, 2, 3]))).toBe(false);
    });
  });

  describe('partial equal comparison', () => {
    test('partialEqual should work recursively', () => {
      expect(partialEqual({ a: 1, b: 2 }, match.partialEqual({ a: 1 }))).toBe(
        true,
      );
      expect(partialEqual({ a: 1 }, match.partialEqual({ a: 1, b: 2 }))).toBe(
        false,
      );
    });
  });

  describe('custom comparison', () => {
    test('custom should execute provided function', () => {
      const isEven = (value: unknown) =>
        typeof value === 'number' && value % 2 === 0;
      expect(partialEqual(4, match.custom(isEven))).toBe(true);
      expect(partialEqual(3, match.custom(isEven))).toBe(false);
      expect(partialEqual('4', match.custom(isEven))).toBe(false);
    });

    test('custom should work with complex logic', () => {
      const isValidEmail = (value: unknown) =>
        typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      expect(partialEqual('test@example.com', match.custom(isValidEmail))).toBe(
        true,
      );
      expect(partialEqual('invalid-email', match.custom(isValidEmail))).toBe(
        false,
      );
      expect(partialEqual(123, match.custom(isValidEmail))).toBe(false);
    });

    test('custom should work in nested objects', () => {
      const isPositive = (value: unknown) =>
        typeof value === 'number' && value > 0;

      const target = {
        user: { id: 42, score: -5 },
        stats: { wins: 10, losses: 3 },
      };

      expect(
        partialEqual(target, {
          user: { id: match.custom(isPositive) },
          stats: { wins: match.custom(isPositive) },
        }),
      ).toBe(true);

      expect(
        partialEqual(target, {
          user: { score: match.custom(isPositive) },
        }),
      ).toBe(false);
    });

    test('not.custom should negate custom function', () => {
      const isEmpty = (value: unknown) =>
        typeof value === 'string' && value.length === 0;

      expect(partialEqual('hello', match.not.custom(isEmpty))).toBe(true);
      expect(partialEqual('', match.not.custom(isEmpty))).toBe(false);
    });
  });

  describe('type checking with hasType', () => {
    test('hasType.string should check string type', () => {
      expect(partialEqual('hello', match.hasType.string)).toBe(true);
      expect(partialEqual(123, match.hasType.string)).toBe(false);
      expect(partialEqual(null, match.hasType.string)).toBe(false);
    });

    test('hasType.number should check number type', () => {
      expect(partialEqual(42, match.hasType.number)).toBe(true);
      expect(partialEqual(3.14, match.hasType.number)).toBe(true);
      expect(partialEqual('42', match.hasType.number)).toBe(false);
      expect(partialEqual(NaN, match.hasType.number)).toBe(true);
    });

    test('hasType.boolean should check boolean type', () => {
      expect(partialEqual(true, match.hasType.boolean)).toBe(true);
      expect(partialEqual(false, match.hasType.boolean)).toBe(true);
      expect(partialEqual(0, match.hasType.boolean)).toBe(false);
      expect(partialEqual('true', match.hasType.boolean)).toBe(false);
    });

    test('hasType.function should check function type', () => {
      const fn = () => 'test';
      expect(partialEqual(fn, match.hasType.function)).toBe(true);
      expect(partialEqual(Array, match.hasType.function)).toBe(true);
      expect(partialEqual({}, match.hasType.function)).toBe(false);
    });

    test('hasType.array should check array type', () => {
      expect(partialEqual([], match.hasType.array)).toBe(true);
      expect(partialEqual([1, 2, 3], match.hasType.array)).toBe(true);
      expect(partialEqual({}, match.hasType.array)).toBe(false);
      expect(partialEqual('[]', match.hasType.array)).toBe(false);
    });

    test('hasType.object should check object type (excluding arrays and null)', () => {
      expect(partialEqual({}, match.hasType.object)).toBe(true);
      expect(partialEqual({ a: 1 }, match.hasType.object)).toBe(true);
      expect(partialEqual([], match.hasType.object)).toBe(false);
      expect(partialEqual(null, match.hasType.object)).toBe(false);
      expect(partialEqual('object', match.hasType.object)).toBe(false);
    });

    test('hasType should work in nested objects', () => {
      const target = {
        name: 'John',
        age: 30,
        active: true,
        hobbies: ['reading', 'gaming'],
        settings: { theme: 'dark' },
      };

      expect(
        partialEqual(target, {
          name: match.hasType.string,
          age: match.hasType.number,
          active: match.hasType.boolean,
          hobbies: match.hasType.array,
          settings: match.hasType.object,
        }),
      ).toBe(true);

      expect(
        partialEqual(target, {
          name: match.hasType.number,
        }),
      ).toBe(false);
    });

    test('not.hasType should negate type checks', () => {
      expect(partialEqual('hello', match.not.hasType.number)).toBe(true);
      expect(partialEqual(42, match.not.hasType.number)).toBe(false);
      expect(partialEqual([], match.not.hasType.object)).toBe(true);
      expect(partialEqual({}, match.not.hasType.array)).toBe(true);
    });
  });

  describe('instance checking with isInstanceOf', () => {
    test('isInstanceOf should check Date instances', () => {
      const date = new Date();
      expect(partialEqual(date, match.isInstanceOf(Date))).toBe(true);
      expect(partialEqual('2023-01-01', match.isInstanceOf(Date))).toBe(false);
      expect(partialEqual({}, match.isInstanceOf(Date))).toBe(false);
    });

    test('isInstanceOf should check RegExp instances', () => {
      const regex = /test/g;
      expect(partialEqual(regex, match.isInstanceOf(RegExp))).toBe(true);
      expect(partialEqual('/test/g', match.isInstanceOf(RegExp))).toBe(false);
      expect(partialEqual({}, match.isInstanceOf(RegExp))).toBe(false);
    });

    test('isInstanceOf should check Error instances', () => {
      const error = new Error('test');
      const typeError = new TypeError('test');
      expect(partialEqual(error, match.isInstanceOf(Error))).toBe(true);
      expect(partialEqual(typeError, match.isInstanceOf(Error))).toBe(true);
      expect(partialEqual(typeError, match.isInstanceOf(TypeError))).toBe(true);
      expect(partialEqual(error, match.isInstanceOf(TypeError))).toBe(false);
      expect(partialEqual('Error', match.isInstanceOf(Error))).toBe(false);
    });

    test('isInstanceOf should work with custom classes', () => {
      class User {
        constructor(public name: string) {}
      }
      class Admin extends User {
        constructor(
          name: string,
          public permissions: string[],
        ) {
          super(name);
        }
      }

      const user = new User('John');
      const admin = new Admin('Jane', ['read', 'write']);

      expect(partialEqual(user, match.isInstanceOf(User))).toBe(true);
      expect(partialEqual(admin, match.isInstanceOf(User))).toBe(true);
      expect(partialEqual(admin, match.isInstanceOf(Admin))).toBe(true);
      expect(partialEqual(user, match.isInstanceOf(Admin))).toBe(false);
      expect(partialEqual({ name: 'John' }, match.isInstanceOf(User))).toBe(
        false,
      );
    });

    test('isInstanceOf should work in nested objects', () => {
      const target = {
        createdAt: new Date(),
        pattern: /test/i,
        error: new TypeError('validation failed'),
        metadata: { id: 123 },
      };

      expect(
        partialEqual(target, {
          createdAt: match.isInstanceOf(Date),
          pattern: match.isInstanceOf(RegExp),
          error: match.isInstanceOf(Error),
        }),
      ).toBe(true);

      expect(
        partialEqual(target, {
          metadata: match.isInstanceOf(Date),
        }),
      ).toBe(false);
    });

    test('not.isInstanceOf should negate instance checks', () => {
      const date = new Date();
      expect(partialEqual(date, match.not.isInstanceOf(RegExp))).toBe(true);
      expect(partialEqual(date, match.not.isInstanceOf(Date))).toBe(false);
      expect(partialEqual('hello', match.not.isInstanceOf(String))).toBe(true);
    });
  });

  describe('JSON string comparison', () => {
    test('jsonStringHasPartial should parse and compare', () => {
      const jsonString = JSON.stringify({ user: { name: 'John', age: 30 } });
      expect(
        partialEqual(
          jsonString,
          match.jsonString.hasPartial({ user: { name: 'John' } }),
        ),
      ).toBe(true);
      expect(
        partialEqual(
          jsonString,
          match.jsonString.hasPartial({ user: { name: 'Jane' } }),
        ),
      ).toBe(false);
      expect(
        partialEqual('invalid json', match.jsonString.hasPartial({ a: 1 })),
      ).toBe(false);
      expect(partialEqual(123, match.jsonString.hasPartial({ a: 1 }))).toBe(
        false,
      );
    });
  });

  describe('negation with not', () => {
    test('not.str.contains should negate string contains', () => {
      expect(partialEqual('hello world', match.not.str.contains('xyz'))).toBe(
        true,
      );
      expect(partialEqual('hello world', match.not.str.contains('world'))).toBe(
        false,
      );
    });

    test('not.num.isGreaterThan should negate number comparison', () => {
      expect(partialEqual(3, match.not.num.isGreaterThan(5))).toBe(true);
      expect(partialEqual(10, match.not.num.isGreaterThan(5))).toBe(false);
    });

    test('not.deepEqual should negate deep equal', () => {
      expect(partialEqual({ a: 1 }, match.not.equal({ a: 2 }))).toBe(true);
      expect(partialEqual({ a: 1 }, match.not.equal({ a: 1 }))).toBe(false);
    });
  });

  describe('complex nested comparisons', () => {
    test('should work with nested objects and special comparisons', () => {
      const target = {
        user: {
          name: 'John Doe',
          age: 30,
          email: 'john.doe@example.com',
        },
        scores: [85, 92, 78],
        metadata: '{"lastLogin": "2023-01-15", "theme": "dark"}',
      };

      const isValidEmail = (value: unknown) =>
        typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      expect(
        partialEqual(target, {
          user: {
            name: match.str.startsWith('John'),
            age: match.num.isGreaterThan(25),
            email: match.custom(isValidEmail),
          },
          scores: [match.num.isGreaterThanOrEqual(80)],
          metadata: match.jsonString.hasPartial({ theme: 'dark' }),
        }),
      ).toBe(true);

      expect(
        partialEqual(target, {
          user: {
            name: match.str.startsWith('Jane'),
          },
        }),
      ).toBe(false);
    });

    test('should work with arrays containing special comparisons', () => {
      const target = [
        { name: 'Alice', score: 95 },
        { name: 'Bob', score: 82 },
        { name: 'Charlie', score: 78 },
      ];

      expect(
        partialEqual(target, [
          {
            name: match.str.contains('Alice'),
            score: match.num.isGreaterThan(90),
          },
        ]),
      ).toBe(true);

      expect(
        partialEqual(target, [
          { name: 'Alice', score: match.num.isLessThan(90) },
        ]),
      ).toBe(false);
    });
  });

  test('special comparisons should be serializable', () => {
    const target = {
      user: {
        name: 'John Doe',
        age: 30,
        email: match.str.contains('@'),
      },
    };

    const serialized = JSON.stringify(target);
    const deserialized = JSON.parse(serialized);
    expect(
      partialEqual(
        {
          user: {
            name: 'John Doe',
            age: 30,
            email: 'john.doe@example.com',
          },
        },
        deserialized,
      ),
    ).toBe(true);
  });

  test('keyNotBePresent should check property absence', () => {
    // Property exists with undefined - should fail
    expect(partialEqual({ a: 1 }, { a: 1, c: undefined })).toBe(false);

    // Property doesn't exist - should pass with keyNotBePresent
    expect(partialEqual({ a: 1 }, { a: 1, c: match.keyNotBePresent })).toBe(
      true,
    );

    // Property exists with null - should fail with keyNotBePresent
    expect(
      partialEqual({ a: 1, c: null }, { a: 1, c: match.keyNotBePresent }),
    ).toBe(false);

    // Property exists with value - should fail with keyNotBePresent
    expect(
      partialEqual({ a: 1, c: 'test' }, { a: 1, c: match.keyNotBePresent }),
    ).toBe(false);

    // Multiple properties with keyNotBePresent
    expect(
      partialEqual(
        { a: 1 },
        {
          a: 1,
          b: match.keyNotBePresent,
          c: match.keyNotBePresent,
        },
      ),
    ).toBe(true);

    // Some properties exist, some don't
    expect(
      partialEqual(
        { a: 1, b: 2 },
        {
          a: 1,
          b: 2,
          c: match.keyNotBePresent,
        },
      ),
    ).toBe(true);

    // Property exists when it shouldn't
    expect(
      partialEqual(
        { a: 1, b: 2, c: 3 },
        {
          a: 1,
          c: match.keyNotBePresent,
        },
      ),
    ).toBe(false);
  });

  test('keyNotBePresent should work with nested objects', () => {
    const target = {
      user: { name: 'John', age: 30 },
      settings: { theme: 'dark' },
    };

    // Nested property doesn't exist - should pass
    expect(
      partialEqual(target, {
        user: { name: 'John', email: match.keyNotBePresent },
        settings: { theme: 'dark', lang: match.keyNotBePresent },
      }),
    ).toBe(true);

    // Nested property exists - should fail
    expect(
      partialEqual(target, {
        user: { name: 'John', age: match.keyNotBePresent },
      }),
    ).toBe(false);

    // Top-level property doesn't exist - should pass
    expect(
      partialEqual(target, {
        user: { name: 'John' },
        profile: match.keyNotBePresent,
      }),
    ).toBe(true);
  });

  test('keyNotBePresent should be serializable', () => {
    const pattern = {
      a: 1,
      b: match.keyNotBePresent,
    };

    const serialized = JSON.stringify(pattern);
    const deserialized = JSON.parse(serialized);

    // Should work with deserialized pattern
    expect(partialEqual({ a: 1 }, deserialized)).toBe(true);
    expect(partialEqual({ a: 1, b: 2 }, deserialized)).toBe(false);
  });

  describe('logical operations with any/all', () => {
    describe('match.any() - OR logic', () => {
      test('should match if ANY condition is true', () => {
        // String OR conditions
        expect(
          partialEqual(
            'hello world',
            match.any(
              match.str.startsWith('hello'),
              match.str.endsWith('world'),
              match.str.contains('xyz'),
            ),
          ),
        ).toBe(true); // first two match

        expect(
          partialEqual(
            'test',
            match.any(
              match.str.startsWith('hello'),
              match.str.endsWith('world'),
              match.str.contains('xyz'),
            ),
          ),
        ).toBe(false); // none match

        // Mixed type conditions
        expect(
          partialEqual(
            42,
            match.any(
              match.hasType.string,
              match.hasType.number,
              match.hasType.boolean,
            ),
          ),
        ).toBe(true); // number matches

        expect(
          partialEqual(
            'text',
            match.any(
              match.hasType.number,
              match.hasType.boolean,
              match.hasType.function,
            ),
          ),
        ).toBe(false); // none match
      });

      test('should work with single condition', () => {
        expect(
          partialEqual('hello', match.any(match.str.contains('ell'))),
        ).toBe(true);

        expect(
          partialEqual('hello', match.any(match.str.contains('xyz'))),
        ).toBe(false);
      });

      test('should work in nested objects', () => {
        const target = {
          status: 'active',
          priority: 'high',
        };

        expect(
          partialEqual(target, {
            status: match.any(
              match.str.contains('active'),
              match.str.contains('pending'),
            ),
          }),
        ).toBe(true);

        expect(
          partialEqual(target, {
            priority: match.any(
              match.str.contains('low'),
              match.str.contains('medium'),
            ),
          }),
        ).toBe(false);
      });

      test('should work with keyNotBePresent', () => {
        // Property should either contain 'test' OR not exist at all
        expect(
          partialEqual(
            { a: 1 },
            {
              a: 1,
              b: match.any(match.str.contains('test'), match.keyNotBePresent),
            },
          ),
        ).toBe(true); // b doesn't exist, so keyNotBePresent matches

        expect(
          partialEqual(
            { a: 1, b: 'testing' },
            {
              a: 1,
              b: match.any(match.str.contains('test'), match.keyNotBePresent),
            },
          ),
        ).toBe(true); // b contains 'test'

        expect(
          partialEqual(
            { a: 1, b: 'hello' },
            {
              a: 1,
              b: match.any(match.str.contains('test'), match.keyNotBePresent),
            },
          ),
        ).toBe(false); // b exists but doesn't contain 'test'
      });
    });

    describe('match.all() - AND logic', () => {
      test('should match only if ALL conditions are true', () => {
        // All string conditions must match
        expect(
          partialEqual(
            'hello world',
            match.all(
              match.str.startsWith('hello'),
              match.str.endsWith('world'),
              match.str.contains(' '),
            ),
          ),
        ).toBe(true); // all match

        expect(
          partialEqual(
            'hello world',
            match.all(
              match.str.startsWith('hello'),
              match.str.endsWith('world'),
              match.str.contains('xyz'),
            ),
          ),
        ).toBe(false); // last one fails

        // All type and value conditions must match
        expect(
          partialEqual(
            42,
            match.all(
              match.hasType.number,
              match.num.isGreaterThan(40),
              match.num.isLessThan(50),
            ),
          ),
        ).toBe(true); // all match

        expect(
          partialEqual(
            42,
            match.all(
              match.hasType.number,
              match.num.isGreaterThan(40),
              match.num.isLessThan(40),
            ),
          ),
        ).toBe(false); // last one fails
      });

      test('should work with single condition', () => {
        expect(
          partialEqual('hello', match.all(match.str.contains('ell'))),
        ).toBe(true);

        expect(
          partialEqual('hello', match.all(match.str.contains('xyz'))),
        ).toBe(false);
      });

      test('should work in nested objects', () => {
        const target = {
          user: { name: 'John Doe', age: 30 },
          active: true,
        };

        expect(
          partialEqual(target, {
            user: {
              name: match.all(
                match.hasType.string,
                match.str.startsWith('John'),
                match.str.contains(' '),
              ),
              age: match.all(match.hasType.number, match.num.isGreaterThan(25)),
            },
          }),
        ).toBe(true);

        expect(
          partialEqual(target, {
            user: {
              name: match.all(
                match.hasType.string,
                match.str.startsWith('Jane'), // This fails
                match.str.contains(' '),
              ),
            },
          }),
        ).toBe(false);
      });

      test('should work with keyNotBePresent', () => {
        // Property must be a number AND not exist (impossible)
        expect(
          partialEqual(
            { a: 1 },
            {
              a: 1,
              b: match.all(match.hasType.number, match.keyNotBePresent),
            },
          ),
        ).toBe(false); // Can't be both a number and not exist

        // In a more realistic scenario - checking constraints on optional properties
        expect(
          partialEqual(
            { a: 1, b: undefined },
            {
              a: 1,
              b: match.any(
                match.all(match.hasType.string, match.str.contains('test')),
                match.keyNotBePresent,
              ),
            },
          ),
        ).toBe(false); // b exists with undefined, doesn't match either condition
      });
    });

    describe('negated logical operations', () => {
      test('not.any() should be NOR logic', () => {
        // None of the conditions should match
        expect(
          partialEqual(
            'hello',
            match.not.any(
              match.str.contains('xyz'),
              match.str.startsWith('bye'),
              match.hasType.number,
            ),
          ),
        ).toBe(true); // none match, so NOT(false) = true

        expect(
          partialEqual(
            'hello',
            match.not.any(
              match.str.contains('ell'), // This matches
              match.str.startsWith('bye'),
              match.hasType.number,
            ),
          ),
        ).toBe(false); // one matches, so NOT(true) = false
      });

      test('not.all() should be NAND logic', () => {
        // NOT all conditions should match
        expect(
          partialEqual(
            'hello world',
            match.not.all(
              match.str.startsWith('hello'),
              match.str.endsWith('world'),
              match.str.contains('xyz'), // This fails
            ),
          ),
        ).toBe(true); // not all match, so NOT(false) = true

        expect(
          partialEqual(
            'hello world',
            match.not.all(
              match.str.startsWith('hello'),
              match.str.endsWith('world'),
              match.str.contains(' '),
            ),
          ),
        ).toBe(false); // all match, so NOT(true) = false
      });
    });

    describe('nested any/all combinations', () => {
      test('should handle complex nested logic', () => {
        const target = {
          url: 'https://example.com/api/v1',
          method: 'GET',
        };

        // URL should start with http OR https, AND method should be GET or POST
        expect(
          partialEqual(target, {
            url: match.all(
              match.hasType.string,
              match.any(
                match.str.startsWith('http://'),
                match.str.startsWith('https://'),
              ),
              match.str.contains('api'),
            ),
            method: match.any(
              match.str.contains('GET'),
              match.str.contains('POST'),
            ),
          }),
        ).toBe(true);

        expect(
          partialEqual(target, {
            url: match.all(
              match.hasType.string,
              match.any(
                match.str.startsWith('ftp://'), // Neither matches
                match.str.startsWith('smtp://'),
              ),
            ),
          }),
        ).toBe(false);
      });
    });

    describe('serialization', () => {
      test('any/all should be serializable', () => {
        const pattern = {
          value: match.any(match.str.contains('test'), match.hasType.number),
        };

        const serialized = JSON.stringify(pattern);
        const deserialized = JSON.parse(serialized);

        expect(partialEqual({ value: 'testing' }, deserialized)).toBe(true);
        expect(partialEqual({ value: 42 }, deserialized)).toBe(true);
        expect(partialEqual({ value: true }, deserialized)).toBe(false);
      });

      test('nested any/all should be serializable', () => {
        const pattern = {
          data: match.all(
            match.hasType.string,
            match.any(
              match.str.startsWith('prefix'),
              match.str.endsWith('suffix'),
            ),
          ),
        };

        const serialized = JSON.stringify(pattern);
        const deserialized = JSON.parse(serialized);

        expect(partialEqual({ data: 'prefix-test' }, deserialized)).toBe(true);
        expect(partialEqual({ data: 'test-suffix' }, deserialized)).toBe(true);
        expect(partialEqual({ data: 'middle' }, deserialized)).toBe(false);
      });
    });

    describe('any/all with arbitrary values', () => {
      describe('match.any() with mixed values', () => {
        test('should accept literal values alongside comparisons', () => {
          // String literal matches
          expect(
            partialEqual(
              'hello',
              match.any('hello', 'world', match.str.contains('test')),
            ),
          ).toBe(true);
          expect(
            partialEqual(
              'world',
              match.any('hello', 'world', match.str.contains('test')),
            ),
          ).toBe(true);
          expect(
            partialEqual(
              'testing',
              match.any('hello', 'world', match.str.contains('test')),
            ),
          ).toBe(true);
          expect(
            partialEqual(
              'xyz',
              match.any('hello', 'world', match.str.contains('test')),
            ),
          ).toBe(false);

          // Number literal matches
          expect(
            partialEqual(
              42,
              match.any('hello', 42, match.str.contains('test')),
            ),
          ).toBe(true);
          expect(
            partialEqual(
              100,
              match.any('hello', 42, match.str.contains('test')),
            ),
          ).toBe(false);

          // Boolean literal matches
          expect(
            partialEqual(true, match.any(false, true, match.hasType.string)),
          ).toBe(true);
          expect(
            partialEqual(false, match.any(false, true, match.hasType.string)),
          ).toBe(true);
        });

        test('should work with object literals', () => {
          const target = { name: 'John', age: 30 };

          // Should match the literal object
          expect(
            partialEqual(
              target,
              match.any(
                { name: 'John' },
                { name: 'Jane' },
                match.hasType.string,
              ),
            ),
          ).toBe(true);

          // Should match partial object literal
          expect(
            partialEqual(
              target,
              match.any(
                { name: 'Jane', age: 25 },
                { name: 'John' },
                match.hasType.string,
              ),
            ),
          ).toBe(true);

          // Should not match if no literal matches and no comparison matches
          expect(
            partialEqual(
              target,
              match.any({ name: 'Jane' }, { age: 25 }, match.hasType.string),
            ),
          ).toBe(false);
        });

        test('should work with array literals', () => {
          expect(
            partialEqual(
              [1, 2, 3],
              match.any([1, 2], [4, 5], match.hasType.string),
            ),
          ).toBe(true);

          expect(
            partialEqual(
              [1, 2, 3],
              match.any([4, 5], [6, 7], match.hasType.string),
            ),
          ).toBe(false);
        });

        test('should work in nested objects', () => {
          const target = {
            user: { name: 'John', age: 30 },
            status: 'active',
          };

          expect(
            partialEqual(target, {
              user: match.any(
                { name: 'John' },
                { name: 'Jane' },
                match.hasType.string,
              ),
              status: match.any(
                'active',
                'inactive',
                match.str.contains('pending'),
              ),
            }),
          ).toBe(true);

          expect(
            partialEqual(target, {
              user: match.any(
                { name: 'Jane' },
                { age: 25 },
                match.hasType.string,
              ),
            }),
          ).toBe(false);
        });
      });

      describe('match.all() with mixed values', () => {
        test('should require all conditions including literals to match', () => {
          // All conditions must pass
          const target = { name: 'John', age: 30, status: 'active' };

          expect(
            partialEqual(
              target,
              match.all(
                { name: 'John' },
                { age: match.num.isGreaterThan(25) },
                { status: 'active' },
              ),
            ),
          ).toBe(true);

          expect(
            partialEqual(
              target,
              match.all(
                { name: 'John' },
                { age: match.num.isGreaterThan(35) }, // This fails
                { status: 'active' },
              ),
            ),
          ).toBe(false);

          expect(
            partialEqual(
              target,
              match.all(
                { name: 'Jane' }, // This fails
                { age: match.num.isGreaterThan(25) },
                { status: 'active' },
              ),
            ),
          ).toBe(false);
        });

        test('should work with primitive literals', () => {
          expect(
            partialEqual(
              'hello',
              match.all(
                'hello',
                match.hasType.string,
                match.str.contains('ell'),
              ),
            ),
          ).toBe(true);

          expect(
            partialEqual(
              'hello',
              match.all(
                'world', // This fails
                match.hasType.string,
                match.str.contains('ell'),
              ),
            ),
          ).toBe(false);

          expect(
            partialEqual(
              42,
              match.all(42, match.hasType.number, match.num.isGreaterThan(40)),
            ),
          ).toBe(true);
        });

        test('should work with mixed object and primitive values', () => {
          const target = { data: 'test', count: 5 };

          expect(
            partialEqual(
              target,
              match.all({ data: 'test' }, { count: 5 }, match.hasType.object),
            ),
          ).toBe(true);

          expect(
            partialEqual(
              target,
              match.all(
                { data: 'test' },
                { count: 10 }, // This fails
                match.hasType.object,
              ),
            ),
          ).toBe(false);
        });
      });

      describe('negated any/all with arbitrary values', () => {
        test('not.any() should work with mixed values', () => {
          // None should match
          expect(
            partialEqual(
              'hello',
              match.not.any('world', 'test', match.str.contains('xyz')),
            ),
          ).toBe(true);

          // At least one matches, so not.any fails
          expect(
            partialEqual(
              'hello',
              match.not.any(
                'hello', // This matches
                'test',
                match.str.contains('xyz'),
              ),
            ),
          ).toBe(false);

          expect(
            partialEqual(
              { name: 'John' },
              match.not.any(
                { name: 'Jane' },
                { age: 30 },
                match.hasType.string,
              ),
            ),
          ).toBe(true);
        });

        test('not.all() should work with mixed values', () => {
          // Not all conditions match
          expect(
            partialEqual(
              'hello',
              match.not.all(
                'hello',
                match.hasType.string,
                match.str.contains('xyz'), // This fails
              ),
            ),
          ).toBe(true);

          // All conditions match, so not.all fails
          expect(
            partialEqual(
              'hello',
              match.not.all(
                'hello',
                match.hasType.string,
                match.str.contains('ell'),
              ),
            ),
          ).toBe(false);

          expect(
            partialEqual(
              { name: 'John', age: 30 },
              match.not.all(
                { name: 'John' },
                { age: 25 }, // This doesn't match
                match.hasType.object,
              ),
            ),
          ).toBe(true);
        });
      });
    });
  });

  describe('withNoExtraKeys comparison', () => {
    test('should match object with exact same keys', () => {
      expect(
        partialEqual({ a: 1, b: 2 }, match.noExtraKeys({ a: 1, b: 2 })),
      ).toBe(true);
      expect(
        partialEqual(
          { name: 'John', age: 30 },
          match.noExtraKeys({ name: 'John', age: 30 }),
        ),
      ).toBe(true);
    });

    test('should match empty objects', () => {
      expect(partialEqual({}, match.noExtraKeys({}))).toBe(true);
    });

    test('should fail if target has extra keys', () => {
      expect(
        partialEqual({ a: 1, b: 2, c: 3 }, match.noExtraKeys({ a: 1, b: 2 })),
      ).toBe(false);
      expect(
        partialEqual(
          { name: 'John', age: 30, city: 'NYC' },
          match.noExtraKeys({ name: 'John', age: 30 }),
        ),
      ).toBe(false);
    });

    test('should fail if target is missing required keys', () => {
      expect(partialEqual({ a: 1 }, match.noExtraKeys({ a: 1, b: 2 }))).toBe(
        false,
      );
      expect(partialEqual({}, match.noExtraKeys({ name: 'John' }))).toBe(false);
    });

    test('should fail if values do not match', () => {
      expect(
        partialEqual({ a: 1, b: 3 }, match.noExtraKeys({ a: 1, b: 2 })),
      ).toBe(false);
      expect(
        partialEqual(
          { name: 'Jane', age: 30 },
          match.noExtraKeys({ name: 'John', age: 30 }),
        ),
      ).toBe(false);
    });

    test('should work with nested objects (root level only)', () => {
      const target1 = { user: { name: 'John', age: 30 } };
      const partial1 = { user: { name: 'John', age: 30 } };
      expect(partialEqual(target1, match.noExtraKeys(partial1))).toBe(true);

      // withNoExtraKeys now allows extra keys in nested objects (only checks root level)
      const target2 = { user: { name: 'John', age: 30, city: 'NYC' } };
      const partial2 = { user: { name: 'John', age: 30 } };
      expect(partialEqual(target2, match.noExtraKeys(partial2))).toBe(true);

      // But still fails if root level has extra keys
      const target3 = { user: { name: 'John', age: 30 }, extra: 'value' };
      const partial3 = { user: { name: 'John', age: 30 } };
      expect(partialEqual(target3, match.noExtraKeys(partial3))).toBe(false);
    });

    test('should handle non-object types gracefully', () => {
      expect(partialEqual('string', match.noExtraKeys({ key: 'value' }))).toBe(
        false,
      );
      expect(partialEqual(42, match.noExtraKeys({ key: 'value' }))).toBe(false);
      expect(partialEqual(null, match.noExtraKeys({ key: 'value' }))).toBe(
        false,
      );
      expect(partialEqual(undefined, match.noExtraKeys({ key: 'value' }))).toBe(
        false,
      );
      expect(partialEqual([1, 2, 3], match.noExtraKeys({ key: 'value' }))).toBe(
        false,
      );
    });

    test('should fail if partialShape is not an object', () => {
      expect(
        partialEqual({ key: 'value' }, match.noExtraKeys('not an object')),
      ).toBe(false);
      expect(partialEqual({ key: 'value' }, match.noExtraKeys(42))).toBe(false);
      expect(partialEqual({ key: 'value' }, match.noExtraKeys([1, 2, 3]))).toBe(
        false,
      );
      expect(partialEqual({ key: 'value' }, match.noExtraKeys(null))).toBe(
        false,
      );
    });

    test('should work with special comparison matchers in partialShape', () => {
      expect(
        partialEqual(
          { a: 'hello', b: 25 },
          match.noExtraKeys({
            a: match.str.startsWith('h'),
            b: match.num.isGreaterThan(20),
          }),
        ),
      ).toBe(true);
      expect(
        partialEqual(
          { a: 'hello', b: 15 },
          match.noExtraKeys({
            a: match.str.startsWith('h'),
            b: match.num.isGreaterThan(20),
          }),
        ),
      ).toBe(false);
    });

    test('should handle declared but undefined keys', () => {
      expect(
        partialEqual(
          { a: 1, b: undefined },
          match.noExtraKeys({ a: 1, b: undefined }),
        ),
      ).toBe(true);
      expect(
        partialEqual(
          { a: 1, b: undefined, c: 2 },
          match.noExtraKeys({ a: 1, b: undefined }),
        ),
      ).toBe(false);
      expect(
        partialEqual({ a: 1 }, match.noExtraKeys({ a: 1, b: undefined })),
      ).toBe(false);
    });

    test('not.withNoExtraKeys should invert the result', () => {
      expect(
        partialEqual(
          { a: 1, b: 2, c: 3 },
          match.not.noExtraKeys({ a: 1, b: 2 }),
        ),
      ).toBe(true);
      expect(
        partialEqual({ a: 1, b: 2 }, match.not.noExtraKeys({ a: 1, b: 2 })),
      ).toBe(false);
    });
  });

  describe('withDeepNoExtraKeys comparison', () => {
    test('should match object with exact same keys at all levels', () => {
      expect(
        partialEqual({ a: 1, b: 2 }, match.deepNoExtraKeys({ a: 1, b: 2 })),
      ).toBe(true);
      expect(
        partialEqual(
          { name: 'John', age: 30 },
          match.deepNoExtraKeys({ name: 'John', age: 30 }),
        ),
      ).toBe(true);
    });

    test('should match empty objects', () => {
      expect(partialEqual({}, match.deepNoExtraKeys({}))).toBe(true);
    });

    test('should fail if target has extra keys at root level', () => {
      expect(
        partialEqual(
          { a: 1, b: 2, c: 3 },
          match.deepNoExtraKeys({ a: 1, b: 2 }),
        ),
      ).toBe(false);
      expect(
        partialEqual(
          { name: 'John', age: 30, city: 'NYC' },
          match.deepNoExtraKeys({ name: 'John', age: 30 }),
        ),
      ).toBe(false);
    });

    test('should fail if nested objects have extra keys', () => {
      const target1 = { user: { name: 'John', age: 30, city: 'NYC' } };
      const partial1 = { user: { name: 'John', age: 30 } };
      expect(partialEqual(target1, match.deepNoExtraKeys(partial1))).toBe(
        false,
      );

      const target2 = {
        data: { user: { name: 'John', extra: 'field' }, count: 5 },
      };
      const partial2 = { data: { user: { name: 'John' }, count: 5 } };
      expect(partialEqual(target2, match.deepNoExtraKeys(partial2))).toBe(
        false,
      );
    });

    test('should work with deeply nested exact matches', () => {
      const target = {
        level1: {
          level2: {
            level3: { name: 'John', age: 30 },
          },
        },
      };
      const partial = {
        level1: {
          level2: {
            level3: { name: 'John', age: 30 },
          },
        },
      };
      expect(partialEqual(target, match.deepNoExtraKeys(partial))).toBe(true);
    });

    test('should fail with deeply nested extra keys', () => {
      const target = {
        level1: {
          level2: {
            level3: { name: 'John', age: 30, extra: 'key' },
          },
        },
      };
      const partial = {
        level1: {
          level2: {
            level3: { name: 'John', age: 30 },
          },
        },
      };
      expect(partialEqual(target, match.deepNoExtraKeys(partial))).toBe(false);
    });

    test('should fail if target is missing required keys', () => {
      expect(
        partialEqual({ a: 1 }, match.deepNoExtraKeys({ a: 1, b: 2 })),
      ).toBe(false);
      expect(partialEqual({}, match.deepNoExtraKeys({ name: 'John' }))).toBe(
        false,
      );
    });

    test('should fail if values do not match', () => {
      expect(
        partialEqual({ a: 1, b: 3 }, match.deepNoExtraKeys({ a: 1, b: 2 })),
      ).toBe(false);
      expect(
        partialEqual(
          { name: 'Jane', age: 30 },
          match.deepNoExtraKeys({ name: 'John', age: 30 }),
        ),
      ).toBe(false);
    });

    test('should handle non-object types gracefully', () => {
      expect(
        partialEqual('string', match.deepNoExtraKeys({ key: 'value' })),
      ).toBe(false);
      expect(partialEqual(42, match.deepNoExtraKeys({ key: 'value' }))).toBe(
        false,
      );
      expect(partialEqual(null, match.deepNoExtraKeys({ key: 'value' }))).toBe(
        false,
      );
      expect(
        partialEqual(undefined, match.deepNoExtraKeys({ key: 'value' })),
      ).toBe(false);
      expect(
        partialEqual([1, 2, 3], match.deepNoExtraKeys({ key: 'value' })),
      ).toBe(false);
    });

    test('should fail if partialShape is not an object', () => {
      expect(
        partialEqual({ key: 'value' }, match.deepNoExtraKeys('not an object')),
      ).toBe(false);
      expect(partialEqual({ key: 'value' }, match.deepNoExtraKeys(42))).toBe(
        false,
      );
      expect(
        partialEqual({ key: 'value' }, match.deepNoExtraKeys([1, 2, 3])),
      ).toBe(false);
      expect(partialEqual({ key: 'value' }, match.deepNoExtraKeys(null))).toBe(
        false,
      );
    });

    test('should work with special comparison matchers in partialShape', () => {
      expect(
        partialEqual(
          { a: 'hello', b: 25 },
          match.deepNoExtraKeys({
            a: match.str.startsWith('h'),
            b: match.num.isGreaterThan(20),
          }),
        ),
      ).toBe(true);
      expect(
        partialEqual(
          { a: 'hello', b: 15 },
          match.deepNoExtraKeys({
            a: match.str.startsWith('h'),
            b: match.num.isGreaterThan(20),
          }),
        ),
      ).toBe(false);
    });

    test('should handle declared but undefined keys', () => {
      expect(
        partialEqual(
          { a: 1, b: undefined },
          match.deepNoExtraKeys({ a: 1, b: undefined }),
        ),
      ).toBe(true);
      expect(
        partialEqual(
          { a: 1, b: undefined, c: 2 },
          match.deepNoExtraKeys({ a: 1, b: undefined }),
        ),
      ).toBe(false);
      expect(
        partialEqual({ a: 1 }, match.deepNoExtraKeys({ a: 1, b: undefined })),
      ).toBe(false);
    });

    test('not.withDeepNoExtraKeys should invert the result', () => {
      expect(
        partialEqual(
          { a: 1, b: 2, c: 3 },
          match.not.deepNoExtraKeys({ a: 1, b: 2 }),
        ),
      ).toBe(true);
      expect(
        partialEqual({ a: 1, b: 2 }, match.not.deepNoExtraKeys({ a: 1, b: 2 })),
      ).toBe(false);
    });
  });

  describe('noExtraDefinedKeys comparison', () => {
    test('should match object with exact same keys', () => {
      expect(
        partialEqual({ a: 1, b: 2 }, match.noExtraDefinedKeys({ a: 1, b: 2 })),
      ).toBe(true);
      expect(
        partialEqual(
          { name: 'John', age: 30 },
          match.noExtraDefinedKeys({ name: 'John', age: 30 }),
        ),
      ).toBe(true);
    });

    test('should match empty objects', () => {
      expect(partialEqual({}, match.noExtraDefinedKeys({}))).toBe(true);
    });

    test('should fail if target has extra defined keys', () => {
      expect(
        partialEqual(
          { a: 1, b: 2, c: 3 },
          match.noExtraDefinedKeys({ a: 1, b: 2 }),
        ),
      ).toBe(false);
      expect(
        partialEqual(
          { name: 'John', age: 30, city: 'NYC' },
          match.noExtraDefinedKeys({ name: 'John', age: 30 }),
        ),
      ).toBe(false);
    });

    test('should pass if target has extra undefined keys (root level only)', () => {
      // undefined keys are not considered "extra defined keys"
      expect(
        partialEqual(
          { a: 1, b: 2, c: undefined },
          match.noExtraDefinedKeys({ a: 1, b: 2 }),
        ),
      ).toBe(true);
      expect(
        partialEqual(
          { name: 'John', age: 30, city: undefined },
          match.noExtraDefinedKeys({ name: 'John', age: 30 }),
        ),
      ).toBe(true);
    });

    test('should work with nested objects (root level only)', () => {
      // Allows extra keys in nested objects (only checks root level)
      const target1 = { user: { name: 'John', age: 30, city: 'NYC' } };
      const partial1 = { user: { name: 'John', age: 30 } };
      expect(partialEqual(target1, match.noExtraDefinedKeys(partial1))).toBe(
        true,
      );

      // But still fails if root level has extra defined keys
      const target2 = { user: { name: 'John', age: 30 }, extra: 'value' };
      const partial2 = { user: { name: 'John', age: 30 } };
      expect(partialEqual(target2, match.noExtraDefinedKeys(partial2))).toBe(
        false,
      );

      // But passes if root level has extra undefined keys
      const target3 = { user: { name: 'John', age: 30 }, extra: undefined };
      const partial3 = { user: { name: 'John', age: 30 } };
      expect(partialEqual(target3, match.noExtraDefinedKeys(partial3))).toBe(
        true,
      );
    });

    test('should fail if target is missing required keys', () => {
      expect(
        partialEqual({ a: 1 }, match.noExtraDefinedKeys({ a: 1, b: 2 })),
      ).toBe(false);
      expect(partialEqual({}, match.noExtraDefinedKeys({ name: 'John' }))).toBe(
        false,
      );
    });

    test('should fail if values do not match', () => {
      expect(
        partialEqual({ a: 1, b: 3 }, match.noExtraDefinedKeys({ a: 1, b: 2 })),
      ).toBe(false);
      expect(
        partialEqual(
          { name: 'Jane', age: 30 },
          match.noExtraDefinedKeys({ name: 'John', age: 30 }),
        ),
      ).toBe(false);
    });

    test('should handle non-object types gracefully', () => {
      expect(
        partialEqual('string', match.noExtraDefinedKeys({ key: 'value' })),
      ).toBe(false);
      expect(partialEqual(42, match.noExtraDefinedKeys({ key: 'value' }))).toBe(
        false,
      );
      expect(
        partialEqual(null, match.noExtraDefinedKeys({ key: 'value' })),
      ).toBe(false);
      expect(
        partialEqual(undefined, match.noExtraDefinedKeys({ key: 'value' })),
      ).toBe(false);
      expect(
        partialEqual([1, 2, 3], match.noExtraDefinedKeys({ key: 'value' })),
      ).toBe(false);
    });

    test('should work with special comparison matchers in partialShape', () => {
      expect(
        partialEqual(
          { a: 'hello', b: 25 },
          match.noExtraDefinedKeys({
            a: match.str.startsWith('h'),
            b: match.num.isGreaterThan(20),
          }),
        ),
      ).toBe(true);
      expect(
        partialEqual(
          { a: 'hello', b: 15 },
          match.noExtraDefinedKeys({
            a: match.str.startsWith('h'),
            b: match.num.isGreaterThan(20),
          }),
        ),
      ).toBe(false);
    });

    test('not.noExtraDefinedKeys should invert the result', () => {
      expect(
        partialEqual(
          { a: 1, b: 2, c: 3 },
          match.not.noExtraDefinedKeys({ a: 1, b: 2 }),
        ),
      ).toBe(true);
      expect(
        partialEqual(
          { a: 1, b: 2 },
          match.not.noExtraDefinedKeys({ a: 1, b: 2 }),
        ),
      ).toBe(false);
    });
  });

  describe('deepNoExtraDefinedKeys comparison', () => {
    test('should match object with exact same keys at all levels', () => {
      expect(
        partialEqual(
          { a: 1, b: 2 },
          match.deepNoExtraDefinedKeys({ a: 1, b: 2 }),
        ),
      ).toBe(true);
      expect(
        partialEqual(
          { name: 'John', age: 30 },
          match.deepNoExtraDefinedKeys({ name: 'John', age: 30 }),
        ),
      ).toBe(true);
    });

    test('should match empty objects', () => {
      expect(partialEqual({}, match.deepNoExtraDefinedKeys({}))).toBe(true);
    });

    test('should fail if target has extra defined keys at root level', () => {
      expect(
        partialEqual(
          { a: 1, b: 2, c: 3 },
          match.deepNoExtraDefinedKeys({ a: 1, b: 2 }),
        ),
      ).toBe(false);
      expect(
        partialEqual(
          { name: 'John', age: 30, city: 'NYC' },
          match.deepNoExtraDefinedKeys({ name: 'John', age: 30 }),
        ),
      ).toBe(false);
    });

    test('should pass if target has extra undefined keys at root level', () => {
      expect(
        partialEqual(
          { a: 1, b: 2, c: undefined },
          match.deepNoExtraDefinedKeys({ a: 1, b: 2 }),
        ),
      ).toBe(true);
      expect(
        partialEqual(
          { name: 'John', age: 30, city: undefined },
          match.deepNoExtraDefinedKeys({ name: 'John', age: 30 }),
        ),
      ).toBe(true);
    });

    test('should fail if nested objects have extra defined keys', () => {
      const target1 = { user: { name: 'John', age: 30, city: 'NYC' } };
      const partial1 = { user: { name: 'John', age: 30 } };
      expect(
        partialEqual(target1, match.deepNoExtraDefinedKeys(partial1)),
      ).toBe(false);

      const target2 = {
        data: { user: { name: 'John', extra: 'field' }, count: 5 },
      };
      const partial2 = { data: { user: { name: 'John' }, count: 5 } };
      expect(
        partialEqual(target2, match.deepNoExtraDefinedKeys(partial2)),
      ).toBe(false);
    });

    test('should pass if nested objects have extra undefined keys', () => {
      const target1 = { user: { name: 'John', age: 30, city: undefined } };
      const partial1 = { user: { name: 'John', age: 30 } };
      expect(
        partialEqual(target1, match.deepNoExtraDefinedKeys(partial1)),
      ).toBe(true);

      const target2 = {
        data: { user: { name: 'John', extra: undefined }, count: 5 },
      };
      const partial2 = { data: { user: { name: 'John' }, count: 5 } };
      expect(
        partialEqual(target2, match.deepNoExtraDefinedKeys(partial2)),
      ).toBe(true);
    });

    test('should work with deeply nested exact matches', () => {
      const target = {
        level1: {
          level2: {
            level3: { name: 'John', age: 30 },
          },
        },
      };
      const partial = {
        level1: {
          level2: {
            level3: { name: 'John', age: 30 },
          },
        },
      };
      expect(partialEqual(target, match.deepNoExtraDefinedKeys(partial))).toBe(
        true,
      );
    });

    test('should fail with deeply nested extra defined keys', () => {
      const target = {
        level1: {
          level2: {
            level3: { name: 'John', age: 30, extra: 'key' },
          },
        },
      };
      const partial = {
        level1: {
          level2: {
            level3: { name: 'John', age: 30 },
          },
        },
      };
      expect(partialEqual(target, match.deepNoExtraDefinedKeys(partial))).toBe(
        false,
      );
    });

    test('should pass with deeply nested extra undefined keys', () => {
      const target = {
        level1: {
          level2: {
            level3: { name: 'John', age: 30, extra: undefined },
          },
        },
      };
      const partial = {
        level1: {
          level2: {
            level3: { name: 'John', age: 30 },
          },
        },
      };
      expect(partialEqual(target, match.deepNoExtraDefinedKeys(partial))).toBe(
        true,
      );
    });

    test('should fail if target is missing required keys', () => {
      expect(
        partialEqual({ a: 1 }, match.deepNoExtraDefinedKeys({ a: 1, b: 2 })),
      ).toBe(false);
      expect(
        partialEqual({}, match.deepNoExtraDefinedKeys({ name: 'John' })),
      ).toBe(false);
    });

    test('should fail if values do not match', () => {
      expect(
        partialEqual(
          { a: 1, b: 3 },
          match.deepNoExtraDefinedKeys({ a: 1, b: 2 }),
        ),
      ).toBe(false);
      expect(
        partialEqual(
          { name: 'Jane', age: 30 },
          match.deepNoExtraDefinedKeys({ name: 'John', age: 30 }),
        ),
      ).toBe(false);
    });

    test('should handle non-object types gracefully', () => {
      expect(
        partialEqual('string', match.deepNoExtraDefinedKeys({ key: 'value' })),
      ).toBe(false);
      expect(
        partialEqual(42, match.deepNoExtraDefinedKeys({ key: 'value' })),
      ).toBe(false);
      expect(
        partialEqual(null, match.deepNoExtraDefinedKeys({ key: 'value' })),
      ).toBe(false);
      expect(
        partialEqual(undefined, match.deepNoExtraDefinedKeys({ key: 'value' })),
      ).toBe(false);
      expect(
        partialEqual([1, 2, 3], match.deepNoExtraDefinedKeys({ key: 'value' })),
      ).toBe(false);
    });

    test('should work with special comparison matchers in partialShape', () => {
      expect(
        partialEqual(
          { a: 'hello', b: 25 },
          match.deepNoExtraDefinedKeys({
            a: match.str.startsWith('h'),
            b: match.num.isGreaterThan(20),
          }),
        ),
      ).toBe(true);
      expect(
        partialEqual(
          { a: 'hello', b: 15 },
          match.deepNoExtraDefinedKeys({
            a: match.str.startsWith('h'),
            b: match.num.isGreaterThan(20),
          }),
        ),
      ).toBe(false);
    });

    test('not.deepNoExtraDefinedKeys should invert the result', () => {
      expect(
        partialEqual(
          { a: 1, b: 2, c: 3 },
          match.not.deepNoExtraDefinedKeys({ a: 1, b: 2 }),
        ),
      ).toBe(true);
      expect(
        partialEqual(
          { a: 1, b: 2 },
          match.not.deepNoExtraDefinedKeys({ a: 1, b: 2 }),
        ),
      ).toBe(false);
    });
  });
});

describe('error reporting', () => {
  test('should return detailed errors for simple value mismatch', () => {
    const result = partialEqual(42, 'hello', true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - { path: '', message: 'Value mismatch', received: 42, expected: 'hello' }
      "
    `);
  });

  test('should return success for matching values', () => {
    const result = partialEqual({ a: 1, b: 2 }, { a: 1 }, true);

    expect(result.ok).toBe(true);
  });

  test('should report missing property errors with correct path', () => {
    const target = { a: 1 };
    const sub = { a: 1, b: 2 };
    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - { path: 'b', message: 'Missing property', expected: 2 }
      "
    `);
  });

  test('should report array index errors with correct path formatting', () => {
    const target = [1, 2, { name: 'John' }];
    const sub = [1, 3, { name: 'Jane', age: 30 }];
    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - { path: '[1]', message: 'Value mismatch', received: 2, expected: 3 }
      - { path: '[2].name', message: 'Value mismatch', received: 'John', expected: 'Jane' }
      - { path: '[2].age', message: 'Missing property', expected: 30 }
      "
    `);
  });

  test('should report nested object errors with correct paths', () => {
    const target = {
      user: {
        profile: {
          name: 'John',
          age: 30,
        },
        settings: {
          theme: 'light',
        },
      },
    };

    const sub = {
      user: {
        profile: {
          name: 'Jane',
          age: 25,
          email: 'jane@example.com',
        },
        settings: {
          theme: 'dark',
          notifications: true,
        },
      },
    };

    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - { path: 'user.profile.name', message: 'Value mismatch', received: 'John', expected: 'Jane' }
      - { path: 'user.profile.age', message: 'Value mismatch', received: 30, expected: 25 }
      - { path: 'user.profile.email', message: 'Missing property', expected: 'jane@example.com' }
      - { path: 'user.settings.theme', message: 'Value mismatch', received: 'light', expected: 'dark' }
      - { path: 'user.settings.notifications', message: 'Missing property', expected: '✅' }
      "
    `);
  });

  test('should report type validation errors', () => {
    const target = {
      name: 42,
      age: 'thirty',
      active: 'yes',
    };

    const sub = {
      name: match.hasType.string,
      age: match.hasType.number,
      active: match.hasType.boolean,
    };

    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - { path: 'name', message: 'Expected type string', received: 42 }
      - { path: 'age', message: 'Expected type number', received: 'thirty' }
      - { path: 'active', message: 'Expected type boolean', received: 'yes' }
      "
    `);
  });

  test('should report string validation errors', () => {
    const target = {
      email: 'user@domain',
      message: 'Hello world',
      code: 'ABC',
      pattern: 'no-digits',
    };

    const sub = {
      email: match.str.endsWith('.com'),
      message: match.str.contains('goodbye'),
      code: match.str.startsWith('XYZ'),
      pattern: match.str.matchesRegex(/\d+/),
    };

    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - path: 'email'
        message: 'Expected string ending with ".com"'
        received: 'user@domain'
      - path: 'message'
        message: 'Expected string containing "goodbye"'
        received: 'Hello world'
      - path: 'code'
        message: 'Expected string starting with "XYZ"'
        received: 'ABC'
      - path: 'pattern'
        message: 'Expected string matching regex /\\d+/'
        received: 'no-digits'
      "
    `);
  });

  test('should report numeric validation errors', () => {
    const target = {
      score: 85,
      temperature: 32,
      range1: 5,
      range2: 15,
    };

    const sub = {
      score: match.num.isGreaterThan(90),
      temperature: match.num.isLessThan(30),
      range1: match.num.isInRange([10, 20]),
      range2: match.num.isGreaterThanOrEqual(20),
    };

    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - { path: 'score', message: 'Expected number greater than 90', received: 85 }
      - { path: 'temperature', message: 'Expected number less than 30', received: 32 }
      - { path: 'range1', message: 'Expected number in range [10, 20]', received: 5 }
      - { path: 'range2', message: 'Expected number greater than or equal to 20', received: 15 }
      "
    `);
  });

  test('should report custom validation errors', () => {
    const isEven = (n: unknown) => typeof n === 'number' && n % 2 === 0;

    const target = {
      value1: 7,
      value2: 'not a number',
    };

    const sub = {
      value1: match.custom(isEven),
      value2: match.custom(isEven),
    };

    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - { path: 'value1', message: 'Custom validation failed ', received: 7 }
      - { path: 'value2', message: 'Custom validation failed ', received: 'not a number' }
      "
    `);
  });

  test('should report array length errors', () => {
    const target = [1, 2];
    const sub = [1, 2, 3, 4];
    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - path: ''
        message: 'Array too short: expected at least 4 elements, got 2'
        received: [1, 2]
        expected: [1, 2, 3, 4]
      "
    `);
  });

  test('should handle empty path for root level errors', () => {
    const result = partialEqual('hello', 42, true);

    assert(!result.ok);
    expect(result.error[0]?.path).toBe('');
  });

  test('should handle complex nested array and object paths', () => {
    const target = {
      items: [{ data: [{ value: 1 }] }, { data: [{ value: 2 }] }],
    };

    const sub = {
      items: [{ data: [{ value: 5 }] }, { data: [{ value: 10, extra: true }] }],
    };

    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - { path: 'items[0].data[0].value', message: 'Value mismatch', received: 1, expected: 5 }
      - { path: 'items[1].data[0].value', message: 'Value mismatch', received: 2, expected: 10 }
      - { path: 'items[1].data[0].extra', message: 'Missing property', expected: '✅' }
      "
    `);
  });

  test('should handle Date mismatch errors', () => {
    const target = { timestamp: new Date('2023-01-01') };
    const sub = { timestamp: new Date('2023-01-02') };
    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(result.error[0]?.message).toBe('Date mismatch');
    expect(result.error[0]?.path).toBe('timestamp');
  });

  test('should handle RegExp mismatch errors', () => {
    const target = { pattern: /abc/g };
    const sub = { pattern: /def/i };
    const result = partialEqual(target, sub, true);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error[0]?.message).toBe('RegExp mismatch');
      expect(result.error[0]?.path).toBe('pattern');
    }
  });

  test('should report keyNotBePresent errors', () => {
    const target = { a: 1, b: 2, unwanted: 'should not exist' };
    const sub = { a: 1, b: 2, unwanted: match.keyNotBePresent };
    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - path: 'unwanted'
        message: 'Key should not be present'
        received: 'should not exist'
        expected: 'key not present'
      "
    `);
  });

  test('should report keyNotBePresent errors in nested objects', () => {
    const target = {
      user: { name: 'John', age: 30, id: 'should-not-exist' },
      settings: { theme: 'dark' },
    };
    const sub = {
      user: { name: 'John', age: 30, id: match.keyNotBePresent },
      settings: { theme: 'dark' },
    };
    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - path: 'user.id'
        message: 'Key should not be present'
        received: 'should-not-exist'
        expected: 'key not present'
      "
    `);
  });

  test('should report not (negation) errors', () => {
    const target = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
      score: 85,
    };

    const sub = {
      name: match.not.hasType.string, // Should fail - name IS a string
      age: match.not.num.isGreaterThan(25), // Should fail - age IS greater than 25
      email: match.not.str.contains('@'), // Should fail - email DOES contain @
      score: match.not.num.isInRange([80, 90]), // Should fail - score IS in range
    };

    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - path: 'name'
        message: 'Expected negated condition to fail'
        received: 'John'
        expected:
          not match: ['hasType', 'string']
      - path: 'age'
        message: 'Expected negated condition to fail'
        received: 30
        expected:
          not match: ['numIsGreaterThan', 25]
      - path: 'email'
        message: 'Expected negated condition to fail'
        received: 'john@example.com'
        expected:
          not match: ['strContains', '@']
      - path: 'score'
        message: 'Expected negated condition to fail'
        received: 85
        expected:
          not match:
            - 'numIsInRange'
            - [80, 90]
      "
    `);
  });

  test('should report not.keyNotBePresent errors', () => {
    const target = { a: 1, b: 2 }; // missing key 'c'
    const sub = { a: 1, b: 2, c: match.not.keyNotBePresent }; // 'c' should be present
    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - path: 'c'
        message: 'Missing property'
        expected:
          ~sc:
            - 'not'
            - ['keyNotBePresent', null]
      "
    `);
  });

  test('should report any (OR logic) errors when none match', () => {
    const target = {
      value: 15,
      text: 'hello world',
    };

    const sub = {
      value: match.any(
        match.num.isLessThan(10), // 15 is not < 10
        match.num.isGreaterThan(20), // 15 is not > 20
        match.hasType.string, // 15 is not a string
      ),
      text: match.any(
        match.str.startsWith('goodbye'), // doesn't start with goodbye
        match.str.endsWith('planet'), // doesn't end with planet
        match.hasType.number, // is not a number
      ),
    };

    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - path: 'value'
        message: 'None of the alternative comparisons matched'
        received: 15
        expected:
          matchAny:
            - ['numIsLessThan', 10]
            - ['numIsGreaterThan', 20]
            - ['hasType', 'string']
      - path: 'text'
        message: 'None of the alternative comparisons matched'
        received: 'hello world'
        expected:
          matchAny:
            - ['strStartsWith', 'goodbye']
            - ['strEndsWith', 'planet']
            - ['hasType', 'number']
      "
    `);
  });

  test('should report all (AND logic) errors', () => {
    const target = {
      value: 15,
      text: 'hello',
    };

    const sub = {
      value: match.all(
        match.num.isGreaterThan(10), // 15 > 10 ✓
        match.num.isLessThan(20), // 15 < 20 ✓
        match.num.isGreaterThan(18), // 15 > 18 ✗
      ),
      text: match.all(
        match.hasType.string, // 'hello' is string ✓
        match.str.startsWith('h'), // 'hello' starts with 'h' ✓
        match.str.endsWith('world'), // 'hello' ends with 'world' ✗
      ),
    };

    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - { path: 'value', message: 'Expected number greater than 18', received: 15 }
      - path: 'text'
        message: 'Expected string ending with "world"'
        received: 'hello'
      "
    `);
  });

  test('should report noExtraKeys errors', () => {
    const target = { a: 1, b: 2, c: 3, extra: 'not allowed' };
    const sub = match.noExtraKeys({ a: 1, b: 2, c: 3 });
    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - path: 'extra'
        message: 'Extra key not allowed'
        received: 'not allowed'
        expected: 'no extra keys'
      "
    `);
  });

  test('should report deepNoExtraKeys errors', () => {
    const target = {
      user: { name: 'John', age: 30, extra: 'not allowed' },
      settings: { theme: 'dark' },
      extraTop: 'also not allowed',
    };
    const sub = match.deepNoExtraKeys({
      user: { name: 'John', age: 30 },
      settings: { theme: 'dark' },
    });
    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - path: 'extraTop'
        message: 'Extra key not allowed'
        received: 'also not allowed'
        expected: 'no extra keys'
      "
    `);
  });

  test('should report noExtraDefinedKeys errors', () => {
    const target = { a: 1, b: 2, c: 3, extra: 'not allowed', undef: undefined };
    const sub = match.noExtraDefinedKeys({ a: 1, b: 2, c: 3 });
    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - path: 'extra'
        message: 'Extra defined key not allowed'
        received: 'not allowed'
        expected: 'no extra defined keys'
      "
    `);
  });

  test('should report deepNoExtraDefinedKeys errors', () => {
    const target = {
      user: { name: 'John', age: 30, extra: 'not allowed', undef: undefined },
      settings: { theme: 'dark' },
      extraTop: 'also not allowed',
      undefTop: undefined,
    };
    const sub = match.deepNoExtraDefinedKeys({
      user: { name: 'John', age: 30 },
      settings: { theme: 'dark' },
    });
    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - path: 'extraTop'
        message: 'Extra defined key not allowed'
        received: 'also not allowed'
        expected: 'no extra defined keys'
      "
    `);
  });

  test('should report missing properties in extra keys comparisons', () => {
    const target = { a: 1 }; // missing b
    const sub = match.noExtraKeys({ a: 1, b: 2 });
    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - { path: 'b', message: 'Missing property', expected: 2 }
      "
    `);
  });

  test('should report value mismatches in extra keys comparisons', () => {
    const target = { a: 1, b: 3 }; // b has wrong value
    const sub = match.noExtraKeys({ a: 1, b: 2 });
    const result = partialEqual(target, sub, true);

    assert(!result.ok);
    expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
      "
      - { path: 'b', message: 'Value mismatch', received: 3, expected: 2 }
      "
    `);
  });
});
