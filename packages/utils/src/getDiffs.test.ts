import { getDiffs } from './getDiffs';
import { yamlStringify } from '@ls-stack/utils/yamlStringify';
import { describe, expect, test } from 'vitest';

function getSnapshot(
  old: Record<string, unknown>,
  newValue: Record<string, unknown>,
) {
  return `\n${yamlStringify(getDiffs(old, newValue))}\n`;
}

const largeArray = Array.from({ length: 100 }, (_, i) => i);

describe('large array diffs', () => {
  test('array object item changed', () => {
    const oldObj = {
      a: [...largeArray, { a: 1 }, { a: 2 }, { a: 3 }],
      b: [...largeArray, { a: 1 }, { a: 2 }, { a: 3 }],
    };

    const newObj = {
      a: [...largeArray, { a: 1 }, { a: 5 }, { a: 3 }],
      b: [...largeArray, { a: 1 }, { a: 2 }, { a: 3 }],
    };

    expect(getSnapshot(oldObj, newObj)).toMatchInlineSnapshot(`
      "
      ~~keys_updated:
        a~~array_changes:
          size: 103
          [101]:
            ~~keys_updated:
              a: [2, '->', 5]

      "
    `);
  });

  test('array array item changed', () => {
    const oldObj = {
      a: [...largeArray, [1, 2], [3, 4], [5, 6]],
      b: [...largeArray, [1, 2], [3, 4], [5, 6]],
    };

    const newObj = {
      a: [...largeArray, [1, 2], [3, 5], [5, 6]],
      b: [...largeArray, [1, 2], [3, 4], [5, 6]],
    };

    expect(getSnapshot(oldObj, newObj)).toMatchInlineSnapshot(`
      "
      ~~keys_updated:
        a~~array_changes:
          size: 103
          [101]:
            --old: [3, 4]
            ++new: [3, 5]

      "
    `);
  });
});

test('entire array changed', () => {
  const oldObj = { a: [3, 4, 9] };

  const newObj = { a: [1, 2, 3, 4] };

  expect(getSnapshot(oldObj, newObj)).toMatchInlineSnapshot(`
    "
    ~~keys_updated:
      a:
        --old: [3, 4, 9]
        ++new: [1, 2, 3, 4]

    "
  `);
});

describe('object diffs', () => {
  test('show id if present', () => {
    const oldObj = { id: 'test', a: 1, b: 2 };

    const newObj = { id: 'test', a: 1, b: 3 };

    expect(getSnapshot(oldObj, newObj)).toMatchInlineSnapshot(`
      "
      id: 'test'

      ~~keys_updated:
        b: [2, '->', 3]

      "
    `);
  });

  test('show id if present with `key` name', () => {
    const oldObj = { key: 'test', a: 1, b: 2 };

    const newObj = { key: 'test', a: 1, b: 3 };

    expect(getSnapshot(oldObj, newObj)).toMatchInlineSnapshot(`
      "
      key: 'test'

      ~~keys_updated:
        b: [2, '->', 3]

      "
    `);
  });

  test('remove key', () => {
    const oldObj = { a: 1, b: 2 };

    const newObj = { a: 1 };

    expect(getSnapshot(oldObj, newObj)).toMatchInlineSnapshot(`
      "
      --keys_removed:
        b: 2

      "
    `);
  });

  test('set key to undefined', () => {
    const oldObj = { a: 1, b: 2 };

    const newObj = { a: 1, b: undefined };

    expect(getSnapshot(oldObj, newObj)).toMatchInlineSnapshot(`
      "
      --keys_removed:
        b: 2

      "
    `);
  });

  test('ignore undefined keys', () => {
    const oldObj = { obj: { a: 1, b: 2 } };

    const newObj = { obj: { a: 1, b: 2, c: undefined } };

    expect(getSnapshot(oldObj, newObj)).toMatchInlineSnapshot(`
      "
      undefined
      "
    `);
  });
});

describe('array with items with ids', () => {
  test('change item', () => {
    const oldObj = {
      items: [
        { id: '1', name: 'old' },
        { id: '2', name: 'old' },
      ],
    };

    const newObj = {
      items: [
        { id: '1', name: 'old' },
        { id: '2', name: 'new' },
      ],
    };

    expect(getSnapshot(oldObj, newObj)).toMatchInlineSnapshot(`
      "
      ~~keys_updated:
        items~~array_changes:
          ~~[id: '2']{1}:
            ~~keys_updated:
              name: ['old', '->', 'new']

      "
    `);
  });

  test('add item', () => {
    const oldObj = { items: [{ id: '1', name: 'old' }] };

    const newObj = {
      items: [
        { id: '1', name: 'old' },
        { id: '2', name: 'new' },
      ],
    };

    expect(getSnapshot(oldObj, newObj)).toMatchInlineSnapshot(`
      "
      ~~keys_updated:
        items~~array_changes:
          ++[id: '2']{1}:
            name: 'new'

      "
    `);
  });

  test('remove item', () => {
    const oldObj = {
      items: [
        { id: '1', name: 'old' },
        { id: '2', name: 'old' },
      ],
    };

    const newObj = { items: [{ id: '1', name: 'old' }] };

    expect(getSnapshot(oldObj, newObj)).toMatchInlineSnapshot(`
      "
      ~~keys_updated:
        items~~array_changes:
          --[id: '2']{1}:
            name: 'old'

      "
    `);
  });

  test('items swaped', () => {
    const oldObj = {
      items: [
        { id: '1', name: 'old' },
        { id: '2', name: 'old' },
        { id: '3', name: 'old' },
      ],
    };

    const newObj = {
      items: [
        { id: '2', name: 'old' },
        { id: '1', name: 'old' },
        { id: '3', name: 'old' },
      ],
    };

    expect(getSnapshot(oldObj, newObj)).toMatchInlineSnapshot(`
      "
      ~~keys_updated:
        items~~array_changes:
          ->[id: '2']·[1 -> 0]: 'moved'
          ->[id: '1']·[0 -> 1]: 'moved'

      "
    `);
  });

  test('items swaped and changed', () => {
    const oldObj = {
      items: [
        { id: '1', name: 'old' },
        { id: '2', name: 'old' },
        { id: '3', name: 'old' },
      ],
    };

    const newObj = {
      items: [
        { id: '2', name: 'old' },
        { id: '1', name: 'new' },
        { id: '3', name: 'old' },
      ],
    };

    expect(getSnapshot(oldObj, newObj)).toMatchInlineSnapshot(`
      "
      ~~keys_updated:
        items~~array_changes:
          ->[id: '2']·[1 -> 0]: 'moved'
          ~>[id: '1']·[0 -> 1]:
            ~~keys_updated:
              name: ['old', '->', 'new']

      "
    `);
  });

  test('delete item in the middle', () => {
    const oldObj = {
      items: [
        { id: '1', name: 'old' },
        { id: '2', name: 'old' },
        { id: '3', name: 'old' },
        { id: '4', name: 'old' },
      ],
    };

    const newObj = {
      items: [
        { id: '1', name: 'old' },
        { id: '3', name: 'old' },
        { id: '4', name: 'old' },
      ],
    };

    expect(getSnapshot(oldObj, newObj)).toMatchInlineSnapshot(`
      "
      ~~keys_updated:
        items~~array_changes:
          --[id: '2']{1}:
            name: 'old'

      "
    `);
  });

  test('add item in the middle', () => {
    const oldObj = {
      items: [
        { id: '1', name: 'old' },
        { id: '3', name: 'old' },
      ],
    };

    const newObj = {
      items: [
        { id: '1', name: 'old' },
        { id: '2', name: 'new' },
        { id: '3', name: 'old' },
      ],
    };

    expect(getSnapshot(oldObj, newObj)).toMatchInlineSnapshot(`
      "
      ~~keys_updated:
        items~~array_changes:
          ++[id: '2']{1}:
            name: 'new'

      "
    `);
  });

  test('remove multiple items in the middle', () => {
    const oldObj = {
      items: [
        { id: '1', name: 'old' },
        { id: '2', name: 'old' },
        { id: '3', name: 'old' },
        { id: '4', name: 'old' },
        { id: '5', name: 'old' },
      ],
    };

    const newObj = {
      items: [
        { id: '1', name: 'old' },
        { id: '3', name: 'old' },
        { id: '5', name: 'old' },
      ],
    };

    expect(getSnapshot(oldObj, newObj)).toMatchInlineSnapshot(`
      "
      ~~keys_updated:
        items~~array_changes:
          --[id: '2']{1}:
            name: 'old'
          --[id: '4']{3}:
            name: 'old'

      "
    `);
  });

  test('add multiple items in the middle', () => {
    const oldObj = {
      items: [
        { id: '1', name: 'old' },
        { id: '3', name: 'old' },
        { id: '5', name: 'old' },
      ],
    };

    const newObj = {
      items: [
        { id: '1', name: 'old' },
        { id: '2', name: 'new' },
        { id: '3', name: 'old' },
        { id: '4', name: 'new' },
        { id: '5', name: 'old' },
      ],
    };

    expect(getSnapshot(oldObj, newObj)).toMatchInlineSnapshot(`
      "
      ~~keys_updated:
        items~~array_changes:
          ++[id: '2']{1}:
            name: 'new'
          ++[id: '4']{3}:
            name: 'new'

      "
    `);
  });

  test('move item from end to start', () => {
    const oldObj = {
      items: [
        { id: '1', name: 'old' },
        { id: '2', name: 'old' },
        { id: '3', name: 'old' },
        { id: '4', name: 'old' },
      ],
    };

    const newObj = {
      items: [
        { id: '4', name: 'old' },
        { id: '1', name: 'old' },
        { id: '2', name: 'old' },
        { id: '3', name: 'old' },
      ],
    };

    expect(getSnapshot(oldObj, newObj)).toMatchInlineSnapshot(`
      "
      ~~keys_updated:
        items~~array_changes:
          ->[id: '4']·[3 -> 0]: 'moved'

      "
    `);
  });

  test('move item from start to end', () => {
    const oldObj = {
      items: [
        { id: '1', name: 'old' },
        { id: '2', name: 'old' },
        { id: '3', name: 'old' },
        { id: '4', name: 'old' },
      ],
    };

    const newObj = {
      items: [
        { id: '2', name: 'old' },
        { id: '3', name: 'old' },
        { id: '4', name: 'old' },
        { id: '1', name: 'old' },
      ],
    };

    expect(getSnapshot(oldObj, newObj)).toMatchInlineSnapshot(`
      "
      ~~keys_updated:
        items~~array_changes:
          ->[id: '1']·[0 -> 3]: 'moved'

      "
    `);
  });

  test('reproduce bug', () => {
    const oldArray = [
      {
        id: 'EEirRM3Ie0s5ZFfGvGx-Z',
        type: 'field',
        field_config: {
          field_id: 'text',
          required: null,
          custom_label: null,
          description: null,
          hidden: false,
          readonly: false,
        },
      },
    ];

    const newArray = [
      {
        id: 'EEirRM3Ie0s5ZFfGvGx-Z',
        type: 'field',
        end_block_for: undefined,
        field_config: {
          field_id: 'text',
          custom_label: null,
          hidden: false,
          description: null,
          readonly: false,
          required: null,
        },
      },
      {
        id: '1x34TgdaKZBP6pPXV-3ca',
        type: 'field',
        field_config: {
          field_id: 'rich_text',
          custom_label: null,
          hidden: false,
          description: null,
          readonly: false,
          required: false,
        },
      },
    ];

    expect(getSnapshot({ items: oldArray }, { items: newArray }))
      .toMatchInlineSnapshot(`
        "
        ~~keys_updated:
          items~~array_changes:
            ++[id: '1x34TgdaKZBP6pPXV-3ca']{1}:
              type: 'field'
              field_config:
                field_id: 'rich_text'
                custom_label: null
                hidden: false
                description: null
                readonly: false
                required: false

        "
      `);
  });
});
