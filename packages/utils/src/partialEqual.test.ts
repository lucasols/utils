import { describe, expect, test } from 'vitest';
import { match, partialEqual } from './partialEqual';

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
});
