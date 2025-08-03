 
import { ArgumentsType, describe, expect, test } from 'vitest';
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

test('empty objs', () => {
  expect(
    getSnapshot({
      payload: {
        object_type: 'PavcJkwZSvh8bgfSibKxW',
        data: {
          id_PavcJkwZSvh8bgfSibKxW: null,
          test: false,
        },
      },
      diffs: {},
      count: 0,
    }),
  ).toMatchInlineSnapshot(`
    "
    payload:
      object_type: 'PavcJkwZSvh8bgfSibKxW'
      data:
        id_PavcJkwZSvh8bgfSibKxW: null
        test: false

    diffs: {}

    count: 0
    "
  `);
});

test('bug: array of objects', () => {
  expect(
    getSnapshot({
      block_style: {
        type: 'hex',
        color: '#ffffff',
        bg_blur: false,
      },
      columns: [
        {
          key: 'name',
        },
        {
          key: 'text',
        },
        {
          key: 'largeText',
        },
        {
          key: 'number',
          key2: 'number2',
        },
        [1],
      ],
      update_form: null,
    }),
  ).toMatchInlineSnapshot(`
    "
    block_style:
      type: 'hex'
      color: '#ffffff'
      bg_blur: false

    columns:
      - key: 'name'
      - key: 'text'
      - key: 'largeText'
      - key: 'number'
        key2: 'number2'
      - [1]
    update_form: null
    "
  `);
});

test('bug: array with single object', () => {
  expect(
    getSnapshot({
      block_style: {
        type: 'hex',
        color: '#ffffff',
        bg_blur: false,
      },
      columns: [
        {
          key: 'name',
        },
      ],
      update_form: null,
    }),
  ).toMatchInlineSnapshot(`
    "
    block_style:
      type: 'hex'
      color: '#ffffff'
      bg_blur: false

    columns:
      - key: 'name'
    update_form: null
    "
  `);
});

describe('Classes', () => {
  test('Map with string keys', () => {
    expect(
      getSnapshot(
        new Map([
          ['a', 1],
          ['b', 2],
          ['c', 3],
        ]),
      ),
    ).toMatchInlineSnapshot(`
      "
      Map#:
        a: 1
        b: 2
        c: 3
      "
    `);
  });

  test('Map with non string keys', () => {
    expect(
      getSnapshot(
        new Map([
          [{ a: 1 }, 1],
          [{ b: 2 }, 2],
          [{ c: 3 }, 3],
        ]),
      ),
    ).toMatchInlineSnapshot(`
      "
      Map#:
        - key:
            a: 1
          value: 1
        - key:
            b: 2
          value: 2
        - key:
            c: 3
          value: 3
      "
    `);
  });

  test('Set', () => {
    expect(getSnapshot(new Set(['a', 'b', 'c']))).toMatchInlineSnapshot(`
      "
      Set#: ['a', 'b', 'c']
      "
    `);
  });

  test('Date', () => {
    expect(getSnapshot(new Date('2023-01-01'))).toMatchInlineSnapshot(`
      "
      Date#: '2023-01-01T00:00:00.000Z'
      "
    `);
  });

  test('RegExp', () => {
    expect(getSnapshot(/a/)).toMatchInlineSnapshot(`
      "
      RegExp#: '/a/'
      "
    `);
  });

  test('Error', () => {
    const err = new Error('a');

    err.stack = 'a';

    expect(getSnapshot(err)).toMatchInlineSnapshot(`
      "
      Error#:
        message: 'a'
        name: 'Error'
        stack: 'a'
      "
    `);
  });

  test('File', () => {
    const base64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';

    const file = new File(
      [Uint8Array.from(btoa(base64), (m) => m.codePointAt(0)!)],
      'a',
      { type: 'image/png', lastModified: 1715542595505 },
    );

    expect(getSnapshot(file)).toMatchInlineSnapshot(`
      "
      File#:
        name: 'a'
        type: 'image/png'
        lastModified: '2024-05-12T19:36:35.505Z'
        size: '184 B'
      "
    `);
  });

  test('Unknown class with toJSON', () => {
    const classA = new (class A {
      a = 1;

      toJSON() {
        return {
          a: 1,
        };
      }
    })();

    expect(getSnapshot(classA)).toMatchInlineSnapshot(`
      "
      A#:
        a: 1
      "
    `);
  });

  test('Unknown class with toString', () => {
    const classA = new (class A {
      a = 1;

      toString() {
        return 'a';
      }
    })();

    expect(getSnapshot(classA)).toMatchInlineSnapshot(`
      "
      A#: 'a'
      "
    `);
  });

  test('Unknown class without toJSON or toString', () => {
    const classA = new (class A {
      a = 1;
    })();

    expect(getSnapshot(classA)).toMatchInlineSnapshot(`
      "
      A#:
        a: 1
      "
    `);
  });

  test('Unknown class with a lot of properties', () => {
    const classA = new (class A {
      a = 1;
      b = { a: 1 };
      c = 3;
      d = 4;
      e = 5;
      f = 6;
      g = 7;
    })();

    expect(getSnapshot(classA)).toMatchInlineSnapshot(`
      "
      A#:
        a: 1
        c: 3
        d: 4
        e: 5
        f: 6
        ...and more properties: 3
      "
    `);
  });

  test('inside object', () => {
    expect(
      getSnapshot({
        map: new Map([['a', 1]]),
        set: new Set(['a']),
        date: new Date('2023-01-01'),
        regexp: /a/,
        array: [1, new Set(['a']), new Map([['a', 1]])],
      }),
    ).toMatchInlineSnapshot(`
      "
      map{Map}:
        a: 1

      set{Set}: ['a']
      date{Date}: '2023-01-01T00:00:00.000Z'
      regexp{RegExp}: '/a/'
      array:
        - 1
        - Set#: ['a']
        - Map#:
            a: 1
      "
    `);
  });
});

describe('Functions', () => {
  test('Function', () => {
    expect(
      getSnapshot({
        fn: () => {},
      }),
    ).toMatchInlineSnapshot(`
      "
      fn{Function}: '() => {        }'
      "
    `);
  });
});

describe('max depth', () => {
  test('Map', () => {
    const map = new Map<string, unknown>();

    map.set('a', map);

    expect(getSnapshot(map, { maxDepth: 4 })).toMatchInlineSnapshot(`
      "
      Map#:
        a{Map}:
          a{Map}:
            a{Map}:
              a: '{max depth reached}'
      "
    `);
  });

  test('Array', () => {
    const array: any[] = ['a'];

    array.push(array);

    expect(getSnapshot(array, { maxDepth: 4 })).toMatchInlineSnapshot(`
      "
      - 'a'
      - - 'a'
        - - 'a'
          - - 'a'
            - - 'a'
              - - '{max depth reached}'
                - '{max depth reached}'
      "
    `);
  });
});

describe('string quote handling', () => {
  test('strings with single quotes only', () => {
    expect(
      getSnapshot({
        text: "let's go",
        message: "can't stop",
        greeting: "it's working",
      }),
    ).toMatchInlineSnapshot(`
      "
      text: "let's go"
      message: "can't stop"
      greeting: "it's working"
      "
    `);
  });

  test('strings with double quotes only', () => {
    expect(
      getSnapshot({
        text: 'he said "hello"',
        message: 'the "best" option',
        greeting: 'she replied "thanks"',
      }),
    ).toMatchInlineSnapshot(`
      "
      text: 'he said "hello"'
      message: 'the "best" option'
      greeting: 'she replied "thanks"'
      "
    `);
  });

  test('strings with both single and double quotes', () => {
    expect(
      getSnapshot({
        text: `he said "let's go"`,
        message: `can't use "best" here`,
        greeting: `it's "working" fine`,
      }),
    ).toMatchInlineSnapshot(`
      "
      text: "he said \\"let's go\\""
      message: "can't use \\"best\\" here"
      greeting: "it's \\"working\\" fine"
      "
    `);
  });

  test('strings with no quotes', () => {
    expect(
      getSnapshot({
        text: 'hello world',
        message: 'no quotes here',
        greeting: 'working fine',
      }),
    ).toMatchInlineSnapshot(`
      "
      text: 'hello world'
      message: 'no quotes here'
      greeting: 'working fine'
      "
    `);
  });

  test('mixed quote scenarios in arrays', () => {
    expect(
      getSnapshot([
        'simple text',
        "let's go",
        'he said "hello"',
        `it's "working" fine`,
      ]),
    ).toMatchInlineSnapshot(`
      "
      ['simple text', "let's go", 'he said "hello"', "it's \\"working\\" fine"]
      "
    `);
  });

  test('quote handling in nested structures', () => {
    expect(
      getSnapshot({
        level1: {
          singleQuote: "can't stop",
          doubleQuote: 'he said "hello"',
          bothQuotes: `it's "working" fine`,
          array: [
            'simple',
            "let's go",
            'she said "thanks"',
            `can't use "best" option`,
          ],
        },
      }),
    ).toMatchInlineSnapshot(`
      "
      level1:
        singleQuote: "can't stop"
        doubleQuote: 'he said "hello"'
        bothQuotes: "it's \\"working\\" fine"
        array: ['simple', "let's go", 'she said "thanks"', "can't use \\"best\\" option"]
      "
    `);
  });
});

describe('add obj spaces', () => {
  test('default: beforeAndAfter', () => {
    expect(getSnapshot({ a: 1, obj: { a: 1 }, b: 2 })).toMatchInlineSnapshot(`
      "
      a: 1

      obj:
        a: 1

      b: 2
      "
    `);
  });

  test('before', () => {
    expect(
      getSnapshot(
        { a: 1, obj: { a: 1 }, b: 2 },
        { addRootObjSpaces: 'before' },
      ),
    ).toMatchInlineSnapshot(`
      "
      a: 1

      obj:
        a: 1
      b: 2
      "
    `);
  });

  test('after', () => {
    expect(
      getSnapshot({ a: 1, obj: { a: 1 }, b: 2 }, { addRootObjSpaces: 'after' }),
    ).toMatchInlineSnapshot(`
      "
      a: 1
      obj:
        a: 1

      b: 2
      "
    `);
  });

  test('none', () => {
    expect(
      getSnapshot({ a: 1, obj: { a: 1 }, b: 2 }, { addRootObjSpaces: false }),
    ).toMatchInlineSnapshot(`
      "
      a: 1
      obj:
        a: 1
      b: 2
      "
    `);
  });
});
