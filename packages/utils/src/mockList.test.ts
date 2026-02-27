import { describe, expect, test } from 'vitest';
import { compactSnapshot } from './testUtils';
import { mockList } from './mockList';

describe('mockList', () => {
  test('creates a list with the given size', () => {
    const result = mockList(3, ({ id }) => ({ id }));

    expect(compactSnapshot(result)).toMatchInlineSnapshot(`
      "
      - id: 1
      - id: 2
      - id: 3
      "
    `);
  });

  test('creates an empty list when size is 0', () => {
    const result = mockList(0, ({ id }) => ({ id }));

    expect(result).toMatchInlineSnapshot(`[]`);
  });

  test('index is zero-based and id is one-based', () => {
    const result = mockList(3, ({ index, id }) => ({ index, id }));

    expect(compactSnapshot(result)).toMatchInlineSnapshot(`
      "
      - { index: 0, id: 1 }
      - { index: 1, id: 2 }
      - { index: 2, id: 3 }
      "
    `);
  });

  describe('onEvery', () => {
    test('returns value on every Nth item', () => {
      const result = mockList(6, ({ id, onEvery }) => ({
        id,
        highlight: onEvery(3, 'yes', 'no'),
      }));

      expect(compactSnapshot(result)).toMatchInlineSnapshot(`
        "
        - { id: 1, highlight: 'yes' }
        - { id: 2, highlight: 'no' }
        - { id: 3, highlight: 'no' }
        - { id: 4, highlight: 'yes' }
        - { id: 5, highlight: 'no' }
        - { id: 6, highlight: 'no' }
        "
      `);
    });

    test('returns undefined as otherwise when not provided', () => {
      const result = mockList(3, ({ id, onEvery }) => ({
        id,
        highlight: onEvery(2, 'yes'),
      }));

      expect(compactSnapshot(result)).toMatchInlineSnapshot(`
        "
        - { id: 1, highlight: 'yes' }
        - id: 2
        - { id: 3, highlight: 'yes' }
        "
      `);
    });
  });

  describe('onEven', () => {
    test('returns value on even indices', () => {
      const result = mockList(4, ({ id, onEven }) => ({
        id,
        even: onEven('yes', 'no'),
      }));

      expect(compactSnapshot(result)).toMatchInlineSnapshot(`
        "
        - { id: 1, even: 'yes' }
        - { id: 2, even: 'no' }
        - { id: 3, even: 'yes' }
        - { id: 4, even: 'no' }
        "
      `);
    });

    test('returns undefined as otherwise when not provided', () => {
      const result = mockList(3, ({ id, onEven }) => ({
        id,
        even: onEven('yes'),
      }));

      expect(compactSnapshot(result)).toMatchInlineSnapshot(`
        "
        - { id: 1, even: 'yes' }
        - id: 2
        - { id: 3, even: 'yes' }
        "
      `);
    });
  });

  describe('atIndex', () => {
    test('returns value at specific index', () => {
      const result = mockList(4, ({ id, atIndex }) => ({
        id,
        special: atIndex(2, 'yes', 'no'),
      }));

      expect(compactSnapshot(result)).toMatchInlineSnapshot(`
        "
        - { id: 1, special: 'no' }
        - { id: 2, special: 'no' }
        - { id: 3, special: 'yes' }
        - { id: 4, special: 'no' }
        "
      `);
    });

    test('returns undefined as otherwise when not provided', () => {
      const result = mockList(3, ({ id, atIndex }) => ({
        id,
        special: atIndex(1, 'yes'),
      }));

      expect(compactSnapshot(result)).toMatchInlineSnapshot(`
        "
        - id: 1
        - { id: 2, special: 'yes' }
        - id: 3
        "
      `);
    });
  });

  describe('atId', () => {
    test('returns value at specific id (1-based)', () => {
      const result = mockList(4, ({ id, atId }) => ({
        id,
        special: atId(3, 'yes', 'no'),
      }));

      expect(compactSnapshot(result)).toMatchInlineSnapshot(`
        "
        - { id: 1, special: 'no' }
        - { id: 2, special: 'no' }
        - { id: 3, special: 'yes' }
        - { id: 4, special: 'no' }
        "
      `);
    });

    test('returns undefined as otherwise when not provided', () => {
      const result = mockList(3, ({ id, atId }) => ({
        id,
        special: atId(2, 'yes'),
      }));

      expect(compactSnapshot(result)).toMatchInlineSnapshot(`
        "
        - id: 1
        - { id: 2, special: 'yes' }
        - id: 3
        "
      `);
    });
  });

  describe('cycle', () => {
    test('cycles through values', () => {
      const result = mockList(5, ({ id, cycle }) => ({
        id,
        color: cycle(['red', 'green', 'blue']),
      }));

      expect(compactSnapshot(result)).toMatchInlineSnapshot(`
        "
        - { id: 1, color: 'red' }
        - { id: 2, color: 'green' }
        - { id: 3, color: 'blue' }
        - { id: 4, color: 'red' }
        - { id: 5, color: 'green' }
        "
      `);
    });

    test('cycles with a getValue transform', () => {
      const result = mockList(4, ({ id, cycle }) => ({
        id,
        label: cycle([1, 2, 3], (v) => `item-${v}`),
      }));

      expect(compactSnapshot(result)).toMatchInlineSnapshot(`
        "
        - { id: 1, label: 'item-1' }
        - { id: 2, label: 'item-2' }
        - { id: 3, label: 'item-3' }
        - { id: 4, label: 'item-1' }
        "
      `);
    });
  });

  describe('afterOrEqualIndex', () => {
    test('returns value at and after given index', () => {
      const result = mockList(5, ({ id, afterOrEqualIndex }) => ({
        id,
        active: afterOrEqualIndex(2, 'yes', 'no'),
      }));

      expect(compactSnapshot(result)).toMatchInlineSnapshot(`
        "
        - { id: 1, active: 'no' }
        - { id: 2, active: 'no' }
        - { id: 3, active: 'yes' }
        - { id: 4, active: 'yes' }
        - { id: 5, active: 'yes' }
        "
      `);
    });

    test('returns undefined as otherwise when not provided', () => {
      const result = mockList(4, ({ id, afterOrEqualIndex }) => ({
        id,
        active: afterOrEqualIndex(2, 'yes'),
      }));

      expect(compactSnapshot(result)).toMatchInlineSnapshot(`
        "
        - id: 1
        - id: 2
        - { id: 3, active: 'yes' }
        - { id: 4, active: 'yes' }
        "
      `);
    });
  });

  describe('afterOrEqualId', () => {
    test('returns value at and after given id (1-based)', () => {
      const result = mockList(5, ({ id, afterOrEqualId }) => ({
        id,
        active: afterOrEqualId(3, 'yes', 'no'),
      }));

      expect(compactSnapshot(result)).toMatchInlineSnapshot(`
        "
        - { id: 1, active: 'no' }
        - { id: 2, active: 'no' }
        - { id: 3, active: 'yes' }
        - { id: 4, active: 'yes' }
        - { id: 5, active: 'yes' }
        "
      `);
    });

    test('returns undefined as otherwise when not provided', () => {
      const result = mockList(4, ({ id, afterOrEqualId }) => ({
        id,
        active: afterOrEqualId(3, 'yes'),
      }));

      expect(compactSnapshot(result)).toMatchInlineSnapshot(`
        "
        - id: 1
        - id: 2
        - { id: 3, active: 'yes' }
        - { id: 4, active: 'yes' }
        "
      `);
    });
  });

  test('combining multiple helpers', () => {
    const result = mockList(6, ({ id, onEven, atId, cycle }) => ({
      id,
      type: onEven('even', 'odd'),
      featured: atId(3, 'yes', 'no'),
      color: cycle(['red', 'blue']),
    }));

    expect(compactSnapshot(result)).toMatchInlineSnapshot(`
      "
      - { id: 1, type: 'even', featured: 'no', color: 'red' }
      - { id: 2, type: 'odd', featured: 'no', color: 'blue' }
      - { id: 3, type: 'even', featured: 'yes', color: 'red' }
      - { id: 4, type: 'odd', featured: 'no', color: 'blue' }
      - { id: 5, type: 'even', featured: 'no', color: 'red' }
      - { id: 6, type: 'odd', featured: 'no', color: 'blue' }
      "
    `);
  });
});
