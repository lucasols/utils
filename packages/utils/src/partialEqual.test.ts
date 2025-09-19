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
        - path: 'b'
          message: 'Missing property'
          expected: 2
          received:
            objectWithKeys: ['a']
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
        true,
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

    test('should handle deep partial arrays with objects', () => {
      const result = partialEqual(
        [
          { id: 1, name: 'John', age: 30 },
          { id: 2, name: 'Jane', age: 25 },
          { id: 3, name: 'Bob', age: 35 },
        ],
        [
          { id: 1, name: 'John' },
          { id: 2, age: 25 },
        ],
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should handle nested arrays', () => {
      const result = partialEqual(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
        [
          [1, 2],
          [4, 5],
        ],
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should handle arrays with matchers', () => {
      const result = partialEqual(
        [
          { name: 'John', age: 30 },
          { name: 'Jane', age: 25 },
        ],
        [
          { name: match.str.startsWith('J'), age: match.num.isGreaterThan(25) },
          { name: match.str.contains('ane') },
        ],
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });
  });

  describe('array matchers', () => {
    describe('array.contains', () => {
      test('should match when array contains all elements', () => {
        const result = partialEqual(
          [1, 2, 3, 4, 5],
          match.array.contains([3, 1, 5]),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should match when array contains all objects partially', () => {
        const result = partialEqual(
          [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
            { id: 3, name: 'Bob' },
          ],
          match.array.contains([{ id: 2 }, { name: 'John' }]),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should report when element is missing', () => {
        const result = partialEqual(
          [1, 2, 3],
          match.array.contains([1, 4]),
          true,
        );
        assert(result.error);
        expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
          "
          - path: ''
            message: 'Array does not contain expected element'
            received: [1, 2, 3]
            expected: 4
          "
        `);
      });

      test('should report when not an array', () => {
        const result = partialEqual(
          'not an array',
          match.array.contains([1, 2]),
          true,
        );
        assert(result.error);
        expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
          "
          - { path: '', message: 'Expected array', received: 'not an array' }
          "
        `);
      });
    });

    describe('array.containsInOrder', () => {
      test('should match when array contains elements in order', () => {
        const result = partialEqual(
          [1, 2, 3, 4, 5],
          match.array.containsInOrder([2, 4, 5]),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should match non-consecutive elements in order', () => {
        const result = partialEqual(
          ['a', 'b', 'c', 'd', 'e'],
          match.array.containsInOrder(['a', 'c', 'e']),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should report when elements are out of order', () => {
        const result = partialEqual(
          [1, 2, 3, 4, 5],
          match.array.containsInOrder([3, 1, 5]),
          true,
        );
        assert(result.error);
        expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
          "
          - path: ''
            message: 'Array does not contain expected elements in order'
            received: [1, 2, 3, 4, 5]
            expected: [3, 1, 5]
          "
        `);
      });
    });

    describe('array.startsWith', () => {
      test('should match when array starts with elements', () => {
        const result = partialEqual(
          [1, 2, 3, 4, 5],
          match.array.startsWith([1, 2, 3]),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should match with objects', () => {
        const result = partialEqual(
          [{ id: 1 }, { id: 2 }, { id: 3 }],
          match.array.startsWith([{ id: 1 }, { id: 2 }]),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should report when array is too short', () => {
        const result = partialEqual(
          [1, 2],
          match.array.startsWith([1, 2, 3]),
          true,
        );
        assert(result.error);
        expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
          "
          - path: ''
            message: 'Array too short: expected to start with 3 elements, got 2'
            received: [1, 2]
            expected: [1, 2, 3]
          "
        `);
      });

      test('should report element mismatches', () => {
        const result = partialEqual(
          [1, 3, 4],
          match.array.startsWith([1, 2]),
          true,
        );
        assert(result.error);
        expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
          "
          - { path: '[1]', message: 'Value mismatch', received: 3, expected: 2 }
          "
        `);
      });
    });

    describe('array.endsWith', () => {
      test('should match when array ends with elements', () => {
        const result = partialEqual(
          [1, 2, 3, 4, 5],
          match.array.endsWith([4, 5]),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should match with objects', () => {
        const result = partialEqual(
          [{ id: 1 }, { id: 2 }, { id: 3 }],
          match.array.endsWith([{ id: 2 }, { id: 3 }]),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should report when array is too short', () => {
        const result = partialEqual(
          [1, 2],
          match.array.endsWith([1, 2, 3]),
          true,
        );
        assert(result.error);
        expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
          "
          - path: ''
            message: 'Array too short: expected to end with 3 elements, got 2'
            received: [1, 2]
            expected: [1, 2, 3]
          "
        `);
      });

      test('should report element mismatches', () => {
        const result = partialEqual(
          [1, 2, 4],
          match.array.endsWith([2, 3]),
          true,
        );
        assert(result.error);
        expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
          "
          - { path: '[2]', message: 'Value mismatch', received: 4, expected: 3 }
          "
        `);
      });
    });

    describe('array.length', () => {
      test('should match exact length', () => {
        const result = partialEqual([1, 2, 3], match.array.length(3), true);
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should report wrong length', () => {
        const result = partialEqual([1, 2, 3], match.array.length(2), true);
        assert(result.error);
        expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
          "
          - path: ''
            message: 'Expected array length 2, got 3'
            received: [1, 2, 3]
          "
        `);
      });

      test('should work with empty array', () => {
        const result = partialEqual([], match.array.length(0), true);
        assert(result.ok);
        expect(result.ok).toBe(true);
      });
    });

    describe('array.minLength', () => {
      test('should match when array meets minimum length', () => {
        const result = partialEqual([1, 2, 3], match.array.minLength(2), true);
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should match when array exceeds minimum length', () => {
        const result = partialEqual([1, 2, 3, 4], match.array.minLength(2), true);
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should report when array is too short', () => {
        const result = partialEqual([1], match.array.minLength(3), true);
        assert(result.error);
        expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
          "
          - path: ''
            message: 'Expected array with at least 3 elements, got 1'
            received: [1]
          "
        `);
      });
    });

    describe('array.maxLength', () => {
      test('should match when array meets maximum length', () => {
        const result = partialEqual([1, 2], match.array.maxLength(3), true);
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should match when array equals maximum length', () => {
        const result = partialEqual([1, 2, 3], match.array.maxLength(3), true);
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should report when array is too long', () => {
        const result = partialEqual([1, 2, 3, 4], match.array.maxLength(2), true);
        assert(result.error);
        expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
          "
          - path: ''
            message: 'Expected array with at most 2 elements, got 4'
            received: [1, 2, 3, 4]
          "
        `);
      });
    });

    describe('array.includes', () => {
      test('should match when array includes element', () => {
        const result = partialEqual([1, 2, 3], match.array.includes(2), true);
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should match when array includes object partially', () => {
        const result = partialEqual(
          [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
          match.array.includes({ id: 1 }),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should report when element is not included', () => {
        const result = partialEqual([1, 2, 3], match.array.includes(4), true);
        assert(result.error);
        expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
          "
          - path: ''
            message: 'Array does not include expected element'
            received: [1, 2, 3]
            expected: 4
          "
        `);
      });
    });

    describe('array.every', () => {
      test('should match when all elements satisfy condition', () => {
        const result = partialEqual(
          [10, 20, 30],
          match.array.every(match.num.isGreaterThan(5)),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should match with object conditions', () => {
        const result = partialEqual(
          [{ active: true }, { active: true }],
          match.array.every(match.partialEqual({ active: true })),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should report when not all elements match', () => {
        const result = partialEqual(
          [10, 5, 30],
          match.array.every(match.num.isGreaterThan(8)),
          true,
        );
        assert(result.error);
        expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
          "
          - { path: '[1]', message: 'Expected number greater than 8', received: 5 }
          "
        `);
      });

      test('should work with empty array', () => {
        const result = partialEqual(
          [],
          match.array.every(match.num.isGreaterThan(5)),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });
    });

    describe('array.some', () => {
      test('should match when at least one element satisfies condition', () => {
        const result = partialEqual(
          [1, 10, 3],
          match.array.some(match.num.isGreaterThan(8)),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should match with object conditions', () => {
        const result = partialEqual(
          [{ active: false }, { active: true }],
          match.array.some(match.partialEqual({ active: true })),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should report when no elements match', () => {
        const result = partialEqual(
          [1, 2, 3],
          match.array.some(match.num.isGreaterThan(10)),
          true,
        );
        assert(result.error);
        expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
          "
          - path: ''
            message: 'No array element matches the condition'
            received: [1, 2, 3]
          "
        `);
      });

      test('should report when empty array', () => {
        const result = partialEqual(
          [],
          match.array.some(match.num.isGreaterThan(5)),
          true,
        );
        assert(result.error);
        expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
          "
          - path: ''
            message: 'No array element matches the condition'
            received: []
          "
        `);
      });
    });

    describe('negated array matchers', () => {
      test('should work with not.array.contains', () => {
        const result = partialEqual(
          [1, 2, 3],
          match.not.array.contains([4, 5]),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should work with not.array.length', () => {
        const result = partialEqual([1, 2, 3], match.not.array.length(2), true);
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should work with not.array.includes', () => {
        const result = partialEqual([1, 2, 3], match.not.array.includes(4), true);
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should work with not.array.every', () => {
        const result = partialEqual(
          [1, 10, 3],
          match.not.array.every(match.num.isGreaterThan(5)),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should work with not.array.some', () => {
        const result = partialEqual(
          [1, 2, 3],
          match.not.array.some(match.num.isGreaterThan(10)),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });
    });

    describe('complex array scenarios', () => {
      test('should handle mixed array matchers', () => {
        const result = partialEqual(
          [1, 2, 3, 4, 5, 6],
          match.all(
            match.array.length(6),
            match.array.startsWith([1, 2]),
            match.array.endsWith([5, 6]),
            match.array.contains([3, 4]),
            match.array.every(match.num.isGreaterThan(0)),
            match.array.some(match.num.isGreaterThan(5)),
          ),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should handle arrays with deep object matching', () => {
        const result = partialEqual(
          [
            { user: { name: 'John', age: 30, active: true } },
            { user: { name: 'Jane', age: 25, active: false } },
            { user: { name: 'Bob', age: 35, active: true } },
          ],
          match.all(
            match.array.length(3),
            match.array.contains([
              { user: { name: match.str.startsWith('J') } },
              { user: { active: true } },
            ]),
            match.array.every(match.partialEqual({ user: match.hasType.object })),
            match.array.some(match.partialEqual({ user: { age: match.num.isGreaterThan(30) } })),
          ),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });

      test('should handle nested array matching', () => {
        const result = partialEqual(
          [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
          ],
          match.all(
            match.array.length(3),
            match.array.every(match.array.length(3)),
            match.array.some(match.array.contains([1, 2])),
            match.array.contains([match.array.startsWith([4, 5])]),
          ),
          true,
        );
        assert(result.ok);
        expect(result.ok).toBe(true);
      });
    });
  });

  describe('string comparisons', () => {
    test('should work with str.contains', () => {
      const result = partialEqual(
        'hello world',
        match.str.contains('world'),
        true,
      );
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
      const result = partialEqual(
        'hello world',
        match.str.startsWith('hello'),
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report str.startsWith failures', () => {
      const result = partialEqual(
        'hello world',
        match.str.startsWith('world'),
        true,
      );
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
      const result = partialEqual(
        'hello world',
        match.str.endsWith('world'),
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report str.endsWith failures', () => {
      const result = partialEqual(
        'hello world',
        match.str.endsWith('hello'),
        true,
      );
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
      const result = partialEqual(
        'hello123',
        match.str.matchesRegex(/\d+/),
        true,
      );
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
      const result = partialEqual(
        { a: 1, b: 2 },
        match.equal({ a: 1, b: 2 }),
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report equal failures', () => {
      const result = partialEqual(
        { a: 1, b: 2 },
        match.equal({ a: 1, b: 3 }),
        true,
      );
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
      const result = partialEqual(
        { a: 1, b: 2, c: 3 },
        match.partialEqual({ a: 1, b: 2 }),
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report partialEqual failures', () => {
      const result = partialEqual(
        { a: 1 },
        match.partialEqual({ a: 1, b: 2 }),
        true,
      );
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: 'b'
          message: 'Missing property'
          expected: 2
          received:
            objectWithKeys: ['a']
        "
      `);
    });
  });

  describe('custom comparisons', () => {
    test('should work with custom function returning true', () => {
      const result = partialEqual(
        42,
        match.custom((value) => typeof value === 'number' && value > 40),
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report custom function returning false', () => {
      const result = partialEqual(
        30,
        match.custom((value) => typeof value === 'number' && value > 40),
        true,
      );
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: '', message: 'Custom validation failed ', received: 30 }
        "
      `);
    });

    test('should work with custom function returning error object', () => {
      const result = partialEqual(
        30,
        match.custom((_value) => ({ error: 'Value must be greater than 40' })),
        true,
      );
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
      const result = partialEqual(
        '{"name":"John","age":30}',
        match.jsonString.hasPartial({ name: 'John' }),
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report jsonString.hasPartial failures for invalid JSON', () => {
      const result = partialEqual(
        'not json',
        match.jsonString.hasPartial({ name: 'John' }),
        true,
      );
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: '', message: 'Expected valid JSON string', received: 'not json' }
        "
      `);
    });

    test('should report jsonString.hasPartial failures for non-matching partial', () => {
      const result = partialEqual(
        '{"name":"Jane","age":25}',
        match.jsonString.hasPartial({ name: 'John' }),
        true,
      );
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
      expect(compactSnapshot(result2.error)).toMatchInlineSnapshot(`
        "
        - path: ''
          message: 'RegExp mismatch'
          received{RegExp}: '/test/gi'
          expected{RegExp}: '/different/gi'
        "
      `);
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
      expect(compactSnapshot(result2.error)).toMatchInlineSnapshot(`
        "
        - path: ''
          message: 'Set element not found'
          received{Set}: [1, 2, 3]
          expected{Set}: [4, 5]
        "
      `);
    });

    test('should handle Map objects', () => {
      const map1 = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const map2 = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      const map3 = new Map([['x', 1]]);

      const result1 = partialEqual(map1, map2, true);
      assert(result1.ok);
      expect(result1.ok).toBe(true);

      const result2 = partialEqual(map1, map3, true);
      assert(result2.error);
      expect(compactSnapshot(result2.error)).toMatchInlineSnapshot(`
        "
        - path: ''
          message: 'Map entry not found'
          received{Map}: { a: 1, b: 2, c: 3 }
          expected{Map}: { x: 1 }
        "
      `);
    });
  });

  describe('key validation', () => {
    test('should work with noExtraKeys', () => {
      const result = partialEqual(
        { a: 1, b: 2 },
        match.noExtraKeys({ a: 1, b: 2 }),
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report noExtraKeys failures', () => {
      const result = partialEqual(
        { a: 1, b: 2, c: 3 },
        match.noExtraKeys({ a: 1, b: 2 }),
        true,
      );
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: 'c'
          message: 'Extra key "c" should not be present'
          received: 3
        "
      `);
    });

    test('should work with deepNoExtraKeys', () => {
      const result = partialEqual(
        { user: { name: 'John', age: 30 } },
        match.deepNoExtraKeys({ user: { name: 'John', age: 30 } }),
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report deepNoExtraKeys failures', () => {
      const result = partialEqual(
        { user: { name: 'John', age: 30, extra: 'bad' } },
        match.deepNoExtraKeys({ user: { name: 'John', age: 30 } }),
        true,
      );
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: 'user.extra'
          message: 'Extra key "extra" should not be present'
          received: 'bad'
        "
      `);
    });

    test('should work with noExtraDefinedKeys', () => {
      const result = partialEqual(
        { a: 1, b: 2, c: undefined },
        match.noExtraDefinedKeys({ a: 1, b: 2 }),
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report noExtraDefinedKeys failures', () => {
      const result = partialEqual(
        { a: 1, b: 2, c: 3 },
        match.noExtraDefinedKeys({ a: 1, b: 2 }),
        true,
      );
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: 'c'
          message: 'Extra defined key "c" should not be present'
          received: 3
        "
      `);
    });

    test('should work with deepNoExtraDefinedKeys', () => {
      const result = partialEqual(
        { user: { name: 'John', age: 30, extra: undefined } },
        match.deepNoExtraDefinedKeys({ user: { name: 'John', age: 30 } }),
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report deepNoExtraDefinedKeys failures', () => {
      const result = partialEqual(
        { user: { name: 'John', age: 30, extra: 'bad' } },
        match.deepNoExtraDefinedKeys({ user: { name: 'John', age: 30 } }),
        true,
      );
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - path: 'user.extra'
          message: 'Extra defined key "extra" should not be present'
          received: 'bad'
        "
      `);
    });
  });

  describe('any/all with mixed values', () => {
    test('any() should work with mixed literal and comparison values', () => {
      const result = partialEqual(
        'hello',
        match.any('hello', 'world', match.str.contains('test')),
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('any() should report when no conditions match', () => {
      const result = partialEqual(
        'xyz',
        match.any('hello', 'world', match.str.contains('test')),
        true,
      );
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
      const result = partialEqual(
        { name: 'John', age: 30 },
        match.all({ name: 'John' }, { age: match.num.isGreaterThan(25) }),
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('all() should report when conditions fail', () => {
      const result = partialEqual(
        { name: 'John', age: 20 },
        match.all({ name: 'John' }, { age: match.num.isGreaterThan(25) }),
        true,
      );
      assert(result.error);
      expect(compactSnapshot(result.error)).toMatchInlineSnapshot(`
        "
        - { path: 'age', message: 'Expected number greater than 25', received: 20 }
        "
      `);
    });

    test('should work with object literals in any()', () => {
      const result = partialEqual(
        { name: 'John', age: 30 },
        match.any({ name: 'Jane' }, { name: 'John' }, match.hasType.string),
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('not.any() should work with mixed values', () => {
      const result = partialEqual(
        'hello',
        match.not.any('world', 'test', match.str.contains('xyz')),
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('not.all() should work with mixed values', () => {
      const result = partialEqual(
        'hello',
        match.not.all(
          'hello',
          match.hasType.string,
          match.str.contains('xyz'), // This fails, so not.all passes
        ),
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });
  });

  describe('complex scenarios', () => {
    test('should handle deeply nested structures with mixed comparisons', () => {
      const target = {
        user: { name: 'John Doe', age: 30, active: true },
        settings: { theme: 'dark', notifications: true },
        posts: [{ id: 1, title: 'Hello World' }],
      };

      const result = partialEqual(
        target,
        {
          user: {
            name: match.str.startsWith('John'),
            age: match.num.isGreaterThan(25),
            active: true,
          },
          settings: match.any({ theme: 'light' }, { theme: 'dark' }),
          posts: match.all(match.hasType.array, [
            { id: match.num.isGreaterThan(0) },
          ]),
        },
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report multiple errors in complex structures', () => {
      const target = {
        user: { name: 'John', age: 20 },
        status: 'pending',
      };

      const result = partialEqual(
        target,
        {
          user: {
            name: 'Jane', // Wrong name
            age: match.num.isGreaterThan(25), // Age too low
          },
          status: match.str.contains('complete'), // Doesn't contain 'complete'
        },
        true,
      );

      assert(result.error);
      expect(result.error).toHaveLength(3);
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
      const result = partialEqual(
        'hello',
        match.not.str.contains('world'),
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should report not.str.contains failures', () => {
      const result = partialEqual(
        'hello world',
        match.not.str.contains('world'),
        true,
      );
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
      const result = partialEqual(
        { a: 1 },
        match.not.partialEqual({ a: 1, b: 2 }),
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should work with not.custom', () => {
      const result = partialEqual(
        30,
        match.not.custom((value) => typeof value === 'number' && value > 40),
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should work with not.isInstanceOf', () => {
      const result = partialEqual(
        'not a date',
        match.not.isInstanceOf(Date),
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should work with not.keyNotBePresent (key should be present)', () => {
      const result = partialEqual(
        { a: 1, b: 2 },
        {
          a: 1,
          b: match.not.keyNotBePresent,
        },
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);
    });

    test('should work with not.noExtraKeys', () => {
      const result = partialEqual(
        { a: 1, b: 2, c: 3 },
        match.not.noExtraKeys({ a: 1, b: 2 }),
        true,
      );
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
      expect(compactSnapshot(result2.error)).toMatchInlineSnapshot(`
        "
        - path: ''
          message: 'Date mismatch'
          received{Date}: '2023-01-01T00:00:00.000Z'
          expected{Date}: '2023-01-02T00:00:00.000Z'
        "
      `);
    });

    test('should handle keyNotBePresent', () => {
      const result = partialEqual(
        { a: 1 },
        {
          a: 1,
          b: match.keyNotBePresent,
        },
        true,
      );
      assert(result.ok);
      expect(result.ok).toBe(true);

      const result2 = partialEqual(
        { a: 1, b: 2 },
        {
          a: 1,
          b: match.keyNotBePresent,
        },
        true,
      );
      assert(result2.error);
      expect(compactSnapshot(result2.error)).toMatchInlineSnapshot(`
        "
        - { path: 'b', message: 'Key should not be present', received: 2 }
        "
      `);
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
    expect(
      partialEqual(
        'hello',
        match.any('hello', 'world', match.str.contains('test')),
      ),
    ).toBe(true);
    expect(
      partialEqual(
        'xyz',
        match.any('hello', 'world', match.str.contains('test')),
      ),
    ).toBe(false);

    expect(
      partialEqual(
        { name: 'John', age: 30 },
        match.all({ name: 'John' }, { age: match.num.isGreaterThan(25) }),
      ),
    ).toBe(true);

    expect(
      partialEqual(
        { name: 'John', age: 20 },
        match.all({ name: 'John' }, { age: match.num.isGreaterThan(25) }),
      ),
    ).toBe(false);
  });
});
