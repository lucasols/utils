import { assert, describe, expect, test } from 'vitest';
import { match, partialEqual } from './partialEqual';
import { compactSnapshot } from './testUtils';

describe('partialEqual with error reporting', () => {
  describe('primitive values', () => {
    test('should match identical primitives', () => {
      const result = partialEqual(1, 1, true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report errors for different primitives', () => {
      const result = partialEqual(1, 2, true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: '', message: 'Value mismatch', received: 1, expected: 2 }
        "
      `);
    });

    test('should handle type mismatches', () => {
      const result = partialEqual(1, '1', true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: '', message: 'Value mismatch', received: 1, expected: '1' }
        "
      `);
    });
  });

  describe('objects', () => {
    test('should match partial objects', () => {
      const result = partialEqual({ a: 1, b: 2 }, { a: 1 }, true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report missing properties', () => {
      const result = partialEqual({ a: 1 }, { a: 1, b: 2 }, true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: 'b', message: 'Missing property', expected: 2 }
        "
      `);
    });

    test('should report property value mismatches', () => {
      const result = partialEqual({ a: 1, b: 2 }, { a: 2 }, true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: 'a', message: 'Value mismatch', received: 1, expected: 2 }
        "
      `);
    });

    test('should handle nested objects', () => {
      const result = partialEqual(
        { user: { name: 'John', age: 30 } },
        { user: { name: 'Jane' } },
        true
      );
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: 'user.name', message: 'Value mismatch', received: 'John', expected: 'Jane' }
        "
      `);
    });
  });

  describe('arrays', () => {
    test('should match partial arrays', () => {
      const result = partialEqual([1, 2, 3], [1, 2], true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report array length issues', () => {
      const result = partialEqual([1], [1, 2], true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: ''
          message: 'Array too short: expected at least 2 elements, got 1'
          received: [1]
          expected: [1, 2]
        "
      `);
    });

    test('should report element mismatches', () => {
      const result = partialEqual([1, 2, 3], [1, 4], true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: '[1]', message: 'Value mismatch', received: 2, expected: 4 }
        "
      `);
    });
  });

  describe('string comparisons', () => {
    test('should work with str.contains', () => {
      const result = partialEqual('hello world', match.str.contains('world'), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report str.contains failures', () => {
      const result = partialEqual('hello', match.str.contains('world'), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: ''
          message: 'Expected string containing "world"'
          received: 'hello'
        "
      `);
    });

    test('should work with str.startsWith', () => {
      const result = partialEqual('hello world', match.str.startsWith('hello'), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report str.startsWith failures', () => {
      const result = partialEqual('hello world', match.str.startsWith('world'), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: ''
          message: 'Expected string starting with "world"'
          received: 'hello world'
        "
      `);
    });

    test('should work with str.endsWith', () => {
      const result = partialEqual('hello world', match.str.endsWith('world'), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report str.endsWith failures', () => {
      const result = partialEqual('hello world', match.str.endsWith('hello'), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: ''
          message: 'Expected string ending with "hello"'
          received: 'hello world'
        "
      `);
    });

    test('should work with str.matchesRegex', () => {
      const result = partialEqual('hello123', match.str.matchesRegex(/\d+/), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report str.matchesRegex failures', () => {
      const result = partialEqual('hello', match.str.matchesRegex(/\d+/), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: ''
          message: 'Expected string matching regex /\\d+/'
          received: 'hello'
        "
      `);
    });
  });

  describe('number comparisons', () => {
    test('should work with num.isGreaterThan', () => {
      const result = partialEqual(42, match.num.isGreaterThan(40), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report num.isGreaterThan failures', () => {
      const result = partialEqual(30, match.num.isGreaterThan(40), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: '', message: 'Expected number greater than 40', received: 30 }
        "
      `);
    });

    test('should work with num.isGreaterThanOrEqual', () => {
      const result = partialEqual(40, match.num.isGreaterThanOrEqual(40), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report num.isGreaterThanOrEqual failures', () => {
      const result = partialEqual(30, match.num.isGreaterThanOrEqual(40), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: '', message: 'Expected number greater than or equal to 40', received: 30 }
        "
      `);
    });

    test('should work with num.isLessThan', () => {
      const result = partialEqual(30, match.num.isLessThan(40), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report num.isLessThan failures', () => {
      const result = partialEqual(50, match.num.isLessThan(40), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: '', message: 'Expected number less than 40', received: 50 }
        "
      `);
    });

    test('should work with num.isLessThanOrEqual', () => {
      const result = partialEqual(40, match.num.isLessThanOrEqual(40), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report num.isLessThanOrEqual failures', () => {
      const result = partialEqual(50, match.num.isLessThanOrEqual(40), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: '', message: 'Expected number less than or equal to 40', received: 50 }
        "
      `);
    });

    test('should work with num.isInRange', () => {
      const result = partialEqual(35, match.num.isInRange([30, 40]), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report num.isInRange failures', () => {
      const result = partialEqual(50, match.num.isInRange([30, 40]), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: '', message: 'Expected number in range [30, 40]', received: 50 }
        "
      `);
    });
  });

  describe('type checks', () => {
    test('should work with hasType.string', () => {
      const result = partialEqual('hello', match.hasType.string, true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report hasType.string failures', () => {
      const result = partialEqual(123, match.hasType.string, true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: '', message: 'Expected type string', received: 123 }
        "
      `);
    });

    test('should work with hasType.number', () => {
      const result = partialEqual(42, match.hasType.number, true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report hasType.number failures', () => {
      const result = partialEqual('hello', match.hasType.number, true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: '', message: 'Expected type number', received: 'hello' }
        "
      `);
    });

    test('should work with hasType.boolean', () => {
      const result = partialEqual(true, match.hasType.boolean, true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report hasType.boolean failures', () => {
      const result = partialEqual('true', match.hasType.boolean, true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: '', message: 'Expected type boolean', received: 'true' }
        "
      `);
    });

    test('should work with hasType.object', () => {
      const result = partialEqual({ a: 1 }, match.hasType.object, true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report hasType.object failures for arrays', () => {
      const result = partialEqual([1, 2, 3], match.hasType.object, true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: ''
          message: 'Expected type object'
          received: [1, 2, 3]
        "
      `);
    });

    test('should work with hasType.array', () => {
      const result = partialEqual([1, 2, 3], match.hasType.array, true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report hasType.array failures', () => {
      const result = partialEqual({ a: 1 }, match.hasType.array, true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: ''
          message: 'Expected type array'
          received: { a: 1 }
        "
      `);
    });

    test('should work with hasType.function', () => {
      const result = partialEqual(() => {}, match.hasType.function, true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report hasType.function failures', () => {
      const result = partialEqual('function', match.hasType.function, true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: '', message: 'Expected type function', received: 'function' }
        "
      `);
    });
  });

  describe('equality comparisons', () => {
    test('should work with equal (deep equality)', () => {
      const result = partialEqual({ a: 1, b: 2 }, match.equal({ a: 1, b: 2 }), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report equal failures', () => {
      const result = partialEqual({ a: 1, b: 2 }, match.equal({ a: 1, b: 3 }), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: ''
          message: 'Values are not deeply equal'
          received: { a: 1, b: 2 }
          expected: { a: 1, b: 3 }
        "
      `);
    });

    test('should work with partialEqual', () => {
      const result = partialEqual({ a: 1, b: 2, c: 3 }, match.partialEqual({ a: 1, b: 2 }), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report partialEqual failures', () => {
      const result = partialEqual({ a: 1 }, match.partialEqual({ a: 1, b: 2 }), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: 'b', message: 'Missing property', expected: 2 }
        "
      `);
    });
  });

  describe('custom comparisons', () => {
    test('should work with custom function returning true', () => {
      const result = partialEqual(42, match.custom((value) => typeof value === 'number' && value > 40), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report custom function returning false', () => {
      const result = partialEqual(30, match.custom((value) => typeof value === 'number' && value > 40), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: '', message: 'Custom validation failed ', received: 30 }
        "
      `);
    });

    test('should work with custom function returning error object', () => {
      const result = partialEqual(30, match.custom((_value) => ({ error: 'Value must be greater than 40' })), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: '', message: 'Custom validation failed : Value must be greater than 40', received: 30 }
        "
      `);
    });
  });

  describe('instance checking', () => {
    test('should work with isInstanceOf', () => {
      const result = partialEqual(new Date(), match.isInstanceOf(Date), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report isInstanceOf failures', () => {
      const result = partialEqual('not a date', match.isInstanceOf(Date), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: '', message: 'Expected instance of Date', received: 'not a date' }
        "
      `);
    });
  });

  describe('JSON string comparisons', () => {
    test('should work with jsonString.hasPartial', () => {
      const result = partialEqual('{"name":"John","age":30}', match.jsonString.hasPartial({ name: 'John' }), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report jsonString.hasPartial failures for invalid JSON', () => {
      const result = partialEqual('not json', match.jsonString.hasPartial({ name: 'John' }), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: '', message: 'Expected valid JSON string', received: 'not json' }
        "
      `);
    });

    test('should report jsonString.hasPartial failures for non-matching partial', () => {
      const result = partialEqual('{"name":"Jane","age":25}', match.jsonString.hasPartial({ name: 'John' }), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: 'name', message: 'Value mismatch', received: 'Jane', expected: 'John' }
        "
      `);
    });
  });

  describe('special data types', () => {
    test('should handle RegExp objects', () => {
      const regex1 = /test/gi;
      const regex2 = /test/gi;
      const regex3 = /different/gi;

      const result1 = partialEqual(regex1, regex2, true);
      assert(result1.ok);
      expect(result1.ok).toBe(true);

      const result2 = partialEqual(regex1, regex3, true);
      assert(result2.error);
      expect(result2.error[0]?.message).toBe('RegExp mismatch');
    });

    test('should handle Set objects', () => {
      const set1 = new Set([1, 2, 3]);
      const set2 = new Set([1, 2]);
      const set3 = new Set([4, 5]);

      const result1 = partialEqual(set1, set2, true);
      assert(result1.ok);
      expect(result1.ok).toBe(true);

      const result2 = partialEqual(set1, set3, true);
      assert(result2.error);
      expect(result2.error[0]?.message).toBe('Set element not found');
    });

    test('should handle Map objects', () => {
      const map1 = new Map([['a', 1], ['b', 2], ['c', 3]]);
      const map2 = new Map([['a', 1], ['b', 2]]);
      const map3 = new Map([['x', 1]]);

      const result1 = partialEqual(map1, map2, true);
      assert(result1.ok);
      expect(result1.ok).toBe(true);

      const result2 = partialEqual(map1, map3, true);
      assert(result2.error);
      expect(result2.error[0]?.message).toBe('Map entry not found');
    });
  });

  describe('key validation', () => {
    test('should work with noExtraKeys', () => {
      const result = partialEqual({ a: 1, b: 2 }, match.noExtraKeys({ a: 1, b: 2 }), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report noExtraKeys failures', () => {
      const result = partialEqual({ a: 1, b: 2, c: 3 }, match.noExtraKeys({ a: 1, b: 2 }), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: 'c'
          message: 'Extra key "c" not expected'
        "
      `);
    });

    test('should work with deepNoExtraKeys', () => {
      const result = partialEqual(
        { user: { name: 'John', age: 30 } },
        match.deepNoExtraKeys({ user: { name: 'John', age: 30 } }),
        true
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report deepNoExtraKeys failures', () => {
      const result = partialEqual(
        { user: { name: 'John', age: 30, extra: 'bad' } },
        match.deepNoExtraKeys({ user: { name: 'John', age: 30 } }),
        true
      );
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: 'user.extra'
          message: 'Extra key "extra" not expected'
        "
      `);
    });

    test('should work with noExtraDefinedKeys', () => {
      const result = partialEqual(
        { a: 1, b: 2, c: undefined },
        match.noExtraDefinedKeys({ a: 1, b: 2 }),
        true
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report noExtraDefinedKeys failures', () => {
      const result = partialEqual(
        { a: 1, b: 2, c: 3 },
        match.noExtraDefinedKeys({ a: 1, b: 2 }),
        true
      );
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: 'c'
          message: 'Extra defined key "c" not expected'
        "
      `);
    });

    test('should work with deepNoExtraDefinedKeys', () => {
      const result = partialEqual(
        { user: { name: 'John', age: 30, extra: undefined } },
        match.deepNoExtraDefinedKeys({ user: { name: 'John', age: 30 } }),
        true
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report deepNoExtraDefinedKeys failures', () => {
      const result = partialEqual(
        { user: { name: 'John', age: 30, extra: 'bad' } },
        match.deepNoExtraDefinedKeys({ user: { name: 'John', age: 30 } }),
        true
      );
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: 'user.extra'
          message: 'Extra defined key "extra" not expected'
        "
      `);
    });
  });

  describe('any/all with mixed values', () => {
    test('any() should work with mixed literal and comparison values', () => {
      const result = partialEqual('hello', match.any('hello', 'world', match.str.contains('test')), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('any() should report when no conditions match', () => {
      const result = partialEqual('xyz', match.any('hello', 'world', match.str.contains('test')), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: ''
          message: 'None of the alternative comparisons matched'
          received: 'xyz'
          expected:
            matchAny:
              - ['deepEqual', 'hello']
              - ['deepEqual', 'world']
              - ['strContains', 'test']
        "
      `);
    });

    test('all() should work with mixed literal and comparison values', () => {
      const result = partialEqual({ name: 'John', age: 30 }, match.all(
        { name: 'John' },
        { age: match.num.isGreaterThan(25) }
      ), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('all() should report when conditions fail', () => {
      const result = partialEqual({ name: 'John', age: 20 }, match.all(
        { name: 'John' },
        { age: match.num.isGreaterThan(25) }
      ), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: 'age', message: 'Expected number greater than 25', received: 20 }
        "
      `);
    });

    test('should work with object literals in any()', () => {
      const result = partialEqual({ name: 'John', age: 30 }, match.any(
        { name: 'Jane' },
        { name: 'John' },
        match.hasType.string
      ), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('not.any() should work with mixed values', () => {
      const result = partialEqual('hello', match.not.any('world', 'test', match.str.contains('xyz')), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('not.all() should work with mixed values', () => {
      const result = partialEqual('hello', match.not.all(
        'hello',
        match.hasType.string,
        match.str.contains('xyz') // This fails, so not.all passes
      ), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });
  });

  describe('complex scenarios', () => {
    test('should handle deeply nested structures with mixed comparisons', () => {
      const target = {
        user: { name: 'John Doe', age: 30, active: true },
        settings: { theme: 'dark', notifications: true },
        posts: [{ id: 1, title: 'Hello World' }]
      };

      const result = partialEqual(target, {
        user: {
          name: match.str.startsWith('John'),
          age: match.num.isGreaterThan(25),
          active: true
        },
        settings: match.any(
          { theme: 'light' },
          { theme: 'dark' }
        ),
        posts: match.all(
          match.hasType.array,
          [{ id: match.num.isGreaterThan(0) }]
        )
      }, true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report multiple errors in complex structures', () => {
      const target = {
        user: { name: 'John', age: 20 },
        status: 'pending'
      };

      const result = partialEqual(target, {
        user: {
          name: 'Jane', // Wrong name
          age: match.num.isGreaterThan(25) // Age too low
        },
        status: match.str.contains('complete') // Doesn't contain 'complete'
      }, true);

      assert(result.error);
      expect(result.error.length).toBe(3);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: 'user.name', message: 'Value mismatch', received: 'John', expected: 'Jane' }
        - { path: 'user.age', message: 'Expected number greater than 25', received: 20 }
        - path: 'status'
          message: 'Expected string containing "complete"'
          received: 'pending'
        "
      `);
    });
  });

  describe('negated comparisons', () => {
    test('should work with not.str.contains', () => {
      const result = partialEqual('hello', match.not.str.contains('world'), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report not.str.contains failures', () => {
      const result = partialEqual('hello world', match.not.str.contains('world'), true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: ''
          message: 'Expected negated condition to fail'
          received: 'hello world'
          expected:
            not match: ['strContains', 'world']
        "
      `);
    });

    test('should work with not.hasType.string', () => {
      const result = partialEqual(123, match.not.hasType.string, true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report not.hasType.string failures', () => {
      const result = partialEqual('hello', match.not.hasType.string, true);
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: ''
          message: 'Expected negated condition to fail'
          received: 'hello'
          expected:
            not match: ['hasType', 'string']
        "
      `);
    });

    test('should work with not.num.isGreaterThan', () => {
      const result = partialEqual(30, match.not.num.isGreaterThan(40), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should work with not.equal', () => {
      const result = partialEqual({ a: 1 }, match.not.equal({ a: 2 }), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should work with not.partialEqual', () => {
      const result = partialEqual({ a: 1 }, match.not.partialEqual({ a: 1, b: 2 }), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should work with not.custom', () => {
      const result = partialEqual(30, match.not.custom((value) => typeof value === 'number' && value > 40), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should work with not.isInstanceOf', () => {
      const result = partialEqual('not a date', match.not.isInstanceOf(Date), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should work with not.keyNotBePresent (key should be present)', () => {
      const result = partialEqual({ a: 1, b: 2 }, {
        a: 1,
        b: match.not.keyNotBePresent
      }, true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should work with not.noExtraKeys', () => {
      const result = partialEqual({ a: 1, b: 2, c: 3 }, match.not.noExtraKeys({ a: 1, b: 2 }), true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });
  });

  describe('edge cases', () => {
    test('should handle null and undefined correctly', () => {
      const result1 = partialEqual(null, null, true);
      assert(result1.ok);
      expect(result1.ok).toBe(true);

      const result2 = partialEqual(null, undefined, true);
      assert(result2.error);
      expect(compactSnapshot(result2.error)).toMatchInlineSnapshot(`
        "
        - { path: '', message: 'Value mismatch', received: null }
        "
      `);
    });

    test('should handle NaN correctly', () => {
      const result = partialEqual(NaN, NaN, true);
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should handle Date objects', () => {
      const date1 = new Date('2023-01-01');
      const date2 = new Date('2023-01-01');
      const date3 = new Date('2023-01-02');

      const result1 = partialEqual(date1, date2, true);
      assert(result1.ok);
      expect(result1.ok).toBe(true);

      const result2 = partialEqual(date1, date3, true);
      assert(result2.error);
      expect(result2.error[0]?.message).toBe('Date mismatch');
    });

    test('should handle keyNotBePresent', () => {
      const result = partialEqual({ a: 1 }, {
        a: 1,
        b: match.keyNotBePresent
      }, true);
      assert(result.ok);
      expect(result.ok).toBe(true);

      const result2 = partialEqual({ a: 1, b: 2 }, {
        a: 1,
        b: match.keyNotBePresent
      }, true);
      assert(result2.error);
      expect(result2.error[0]?.message).toBe('Key should not be present');
    });
  });
});

describe('partialEqual boolean return (basic smoke tests)', () => {
  test('should return true for matches', () => {
    expect(partialEqual(1, 1)).toBe(true);
    expect(partialEqual({ a: 1, b: 2 }, { a: 1 })).toBe(true);
    expect(partialEqual([1, 2, 3], [1, 2])).toBe(true);
    expect(partialEqual('hello', match.str.contains('ell'))).toBe(true);
  });

  test('should return false for non-matches', () => {
    expect(partialEqual(1, 2)).toBe(false);
    expect(partialEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(partialEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(partialEqual('hello', match.str.contains('xyz'))).toBe(false);
  });

  test('should work with new any/all mixed values', () => {
    expect(partialEqual('hello', match.any('hello', 'world', match.str.contains('test')))).toBe(true);
    expect(partialEqual('xyz', match.any('hello', 'world', match.str.contains('test')))).toBe(false);

    expect(partialEqual({ name: 'John', age: 30 }, match.all(
      { name: 'John' },
      { age: match.num.isGreaterThan(25) }
    ))).toBe(true);

    expect(partialEqual({ name: 'John', age: 20 }, match.all(
      { name: 'John' },
      { age: match.num.isGreaterThan(25) }
    ))).toBe(false);
  });
});