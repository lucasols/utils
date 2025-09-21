import { test, expect } from 'vitest';
import { enumerate, withIsLast, withPrevious, range, rangeArray } from './iteratorUtils';

test('enumerate yields indexed items', () => {
  const result = [...enumerate(['a', 'b', 'c'])];
  expect(result).toMatchInlineSnapshot(`
    [
      [
        0,
        "a",
      ],
      [
        1,
        "b",
      ],
      [
        2,
        "c",
      ],
    ]
  `);
});

test('enumerate with custom start index', () => {
  const result = [...enumerate(['x', 'y'], 5)];
  expect(result).toMatchInlineSnapshot(`
    [
      [
        5,
        "x",
      ],
      [
        6,
        "y",
      ],
    ]
  `);
});

test('withIsLast marks last item correctly', () => {
  const result = [...withIsLast(['a', 'b', 'c'])];
  expect(result).toMatchInlineSnapshot(`
    [
      [
        false,
        "a",
        0,
      ],
      [
        false,
        "b",
        1,
      ],
      [
        true,
        "c",
        2,
      ],
    ]
  `);
});

test('withIsLast handles single item', () => {
  const result = [...withIsLast(['only'])];
  expect(result).toMatchInlineSnapshot(`
    [
      [
        true,
        "only",
        0,
      ],
    ]
  `);
});

test('withPrevious tracks previous values', () => {
  const result = [...withPrevious([1, 2, 3])];
  expect(result).toMatchInlineSnapshot(`
    [
      {
        "current": 1,
        "prev": undefined,
      },
      {
        "current": 2,
        "prev": 1,
      },
      {
        "current": 3,
        "prev": 2,
      },
    ]
  `);
});

test('range ascending', () => {
  const result = [...range(1, 3)];
  expect(result).toMatchInlineSnapshot(`
    [
      1,
      2,
      3,
    ]
  `);
});

test('range descending', () => {
  const result = [...range(5, 3)];
  expect(result).toMatchInlineSnapshot(`
    [
      5,
      4,
      3,
    ]
  `);
});

test('range with custom step', () => {
  const result = [...range(0, 10, 3)];
  expect(result).toMatchInlineSnapshot(`
    [
      0,
      3,
      6,
      9,
    ]
  `);
});

test('rangeArray returns array', () => {
  const result = rangeArray(2, 4);
  expect(result).toMatchInlineSnapshot(`
    [
      2,
      3,
      4,
    ]
  `);
});