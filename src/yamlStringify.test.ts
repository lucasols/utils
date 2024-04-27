import { ArgumentsType, expect, test } from 'vitest';
import { yamlStringify } from './yamlStringify';

test('values thar are not objects should be returned as JSON', () => {
  expect(yamlStringify(1)).toBe('1');

  expect(yamlStringify('a')).toBe('"a"');

  expect(yamlStringify(true)).toBe('true');

  expect(yamlStringify(false)).toBe('false');

  expect(yamlStringify(null)).toBe('null');

  expect(yamlStringify(undefined)).toBe('undefined');
});

function getSnapshot(
  value: unknown,
  options?: ArgumentsType<typeof yamlStringify>[1],
) {
  return `\n${yamlStringify(value, options)}`;
}

test('simple objects', () => {
  expect(
    getSnapshot({
      a: 1,
      string: 'Hello',
      bool: true,
      null: null,
      undefined,
      stringWithSingleQuotes: `let's try with single quotes`,
    }),
  ).toMatchInlineSnapshot(`
    "
    a: 1
    string: 'Hello'
    bool: true
    null: null
    stringWithSingleQuotes: "let's try with single quotes"
    "
  `);
});

test('nested objects', () => {
  expect(
    getSnapshot({
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
          string: 'Hello',
          bool: true,
          null: null,
        },
      },
    }),
  ).toMatchInlineSnapshot(`
    "
    a: 1
    b:
      c: 2
      d:
        e: 3
        string: 'Hello'
        bool: true
        null: null
    "
  `);
});

test('simple arrays', () => {
  expect(getSnapshot([1, 2, 3, 'Hello', true, null, undefined]))
    .toMatchInlineSnapshot(`
      "
      [1, 2, 3, 'Hello', true, null, undefined]
      "
    `);
});

test('simple arrays with multiline strings', () => {
  expect(getSnapshot({ a: [1, 2, 3, 'Hello\nworld'] })).toMatchInlineSnapshot(`
    "
    a: [1, 2, 3, 'Hello\\nworld']
    "
  `);
});

test('simple arrays over max line length', () => {
  expect(
    getSnapshot([1, 2, 3, 'Hello', true, null, undefined], {
      maxLineLength: 5,
    }),
  ).toMatchInlineSnapshot(`
    "
    - 1
    - 2
    - 3
    - 'Hello'
    - true
    - null
    - undefined
    "
  `);
});

test('nested arrays', () => {
  expect(getSnapshot([1, 2, 3, ['Hello', true, null, undefined]]))
    .toMatchInlineSnapshot(`
      "
      - 1
      - 2
      - 3
      - ['Hello', true, null, undefined]
      "
    `);

  expect(
    getSnapshot([1, 2, 3, ['Hello', true, null, undefined]], {
      maxLineLength: 5,
    }),
  ).toMatchInlineSnapshot(`
      "
      - 1
      - 2
      - 3
      - - 'Hello'
        - true
        - null
        - undefined
      "
    `);

  expect(getSnapshot([1, 2, 3, ['Hello', true, null, undefined, [1, 2]], 4]))
    .toMatchInlineSnapshot(`
    "
    - 1
    - 2
    - 3
    - - 'Hello'
      - true
      - null
      - undefined
      - [1, 2]
    - 4
    "
  `);
});

test('array inside object', () => {
  expect(getSnapshot({ a: [1, 2, 3, ['Hello', true, null, undefined]] }))
    .toMatchInlineSnapshot(`
      "
      a:
        - 1
        - 2
        - 3
        - ['Hello', true, null, undefined]
      "
    `);
});

test('array inside object with max line length', () => {
  expect(
    getSnapshot(
      { a: [1, 2, 3, ['Hello', true, null, undefined]] },
      { maxLineLength: 5 },
    ),
  ).toMatchInlineSnapshot(`
      "
      a:
        - 1
        - 2
        - 3
        - - 'Hello'
          - true
          - null
          - undefined
      "
    `);
});

test('array inside object with object inside', () => {
  expect(
    getSnapshot({
      a: [
        1,
        2,
        3,
        [],
        [
          'Hello',
          true,
          null,
          undefined,
          {
            a: 1,
            b: 2,
            c: 'Hello',
            d: [],
            e: [1, 2],
          },
        ],
      ],
    }),
  ).toMatchInlineSnapshot(`
    "
    a:
      - 1
      - 2
      - 3
      - []
      - - 'Hello'
        - true
        - null
        - undefined
        - a: 1
          b: 2
          c: 'Hello'
          d: []
          e: [1, 2]
    "
  `);
});

test('complex object', () => {
  expect(
    getSnapshot({
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
          string: 'Hello',
          bool: true,
          null: null,
          array: [1, 2, 3, ['Hello', true, null, undefined]],
          array_with_object: [
            1,
            2,
            3,
            [
              'Hello',
              true,
              null,
              undefined,
              {
                a: 1,
                b: 2,
                c: 'Hello',
              },
            ],
          ],
        },
      },
    }),
  ).toMatchInlineSnapshot(`
    "
    a: 1
    b:
      c: 2
      d:
        e: 3
        string: 'Hello'
        bool: true
        null: null
        array:
          - 1
          - 2
          - 3
          - ['Hello', true, null, undefined]
        array_with_object:
          - 1
          - 2
          - 3
          - - 'Hello'
            - true
            - null
            - undefined
            - a: 1
              b: 2
              c: 'Hello'
    "
  `);
});

test('simple multiline string', () => {
  expect(
    getSnapshot({
      multiline: 'Hello\nworld',
    }),
  ).toMatchInlineSnapshot(`
    "
    multiline: |-
      Hello
      world
    "
  `);
});

test('multiline string', () => {
  expect(
    getSnapshot({
      multiline: 'Hello\nworld',
      a: {
        multiline: 'Hello\nworld',
        b: {
          multiline: 'Hello\nworld',
        },
        array: [
          'Hello\nworld',
          {
            multiline: 'Hello\nworld',
          },
          'Hello\nworld\n',
        ],
      },
    }),
  ).toMatchInlineSnapshot(`
    "
    multiline: |-
      Hello
      world
    a:
      multiline: |-
        Hello
        world
      b:
        multiline: |-
          Hello
          world
      array:
        - |-
          Hello
          world
        - multiline: |-
            Hello
            world
        - |
          Hello
          world
    "
  `);
});

test('multiple objects at root level', () => {
  expect(
    getSnapshot({
      a: { a: 1 },
      b: { b: 2 },
      c: { c: 3 },
    }),
  ).toMatchInlineSnapshot(`
    "
    a:
      a: 1

    b:
      b: 2

    c:
      c: 3
    "
  `);
});

test('showUndefined', () => {
  expect(
    getSnapshot(
      {
        a: 1,
        b: undefined,
        c: null,
      },
      { showUndefined: true },
    ),
  ).toMatchInlineSnapshot(`
    "
    a: 1
    b: undefined
    c: null
    "
  `);

  expect(yamlStringify(undefined, { showUndefined: true }))
    .toMatchInlineSnapshot(`
    "undefined"
  `);
});
