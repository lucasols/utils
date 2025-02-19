import { expect, test } from 'vitest';
import { getValueStableKey } from './getValueStableKey';

test('getCacheId ignore undefined obj values', () => {
  expect(
    getValueStableKey({
      a: 1,
      b: undefined,
      c: 3,
      und: undefined,
    }),
  ).toMatchInlineSnapshot('"[{"a":1},{"c":3}]"');
});

test('nested objects are sorted', () => {
  expect(
    getValueStableKey({
      b: {
        d: 4,
        c: 3,
      },
      a: 1,
    }),
  ).toMatchInlineSnapshot(`"[{"a":1},{"b":[{"c":3},{"d":4}]}]"`);
});

test('nested objects in array are sorted', () => {
  expect(
    getValueStableKey({
      a: [
        {
          d: 4,
          c: 3,
        },
        {
          z: 1,
          a: 1,
        },
        1,
      ],
    }),
  ).toMatchInlineSnapshot(`"{"a":[[{"c":3},{"d":4}],[{"a":1},{"z":1}],1]}"`);
});

test('max default depth sortin = 3', () => {
  expect(
    getValueStableKey({
      object_type: 'test',
      page: 1,
      nested_type: 'onlyrefs',
      filters: [
        {
          field: 'single_select',
          type: 'string',
          operator: 'Exatamente igual',
          value: 'Option 1',
          not_sort: {
            z: 1,
            a: 1,
          },
        },
      ],
      size: 50,
    }),
  ).toMatchInlineSnapshot(
    `"[{"filters":[[{"field":"single_select"},{"not_sort":{"z":1,"a":1}},{"operator":"Exatamente igual"},{"type":"string"},{"value":"Option 1"}]]},{"nested_type":"onlyrefs"},{"object_type":"test"},{"page":1},{"size":50}]"`,
  );
});

test('number cache id is not equal to string cache id', () => {
  expect(getValueStableKey(1) !== getValueStableKey('1')).toBeTruthy();
});

test('primitive values are not serialized', () => {
  expect(getValueStableKey('1')).toMatchInlineSnapshot(`"1"`);
  expect(getValueStableKey(true)).toMatchInlineSnapshot(`"#$true$#"`);
  expect(getValueStableKey(false)).toMatchInlineSnapshot(`"#$false$#"`);
  expect(getValueStableKey(null)).toMatchInlineSnapshot(`"#$null$#"`);
  expect(getValueStableKey(undefined)).toMatchInlineSnapshot(`"#$undefined$#"`);
});

test('objects with one key should not be sorted', () => {
  expect(
    getValueStableKey({
      a: {
        b: 1,
      },
    }),
  ).toMatchInlineSnapshot(`"{"a":{"b":1}}"`);
});

test('empty objects', () => {
  expect(
    getValueStableKey({
      a: {
        a: undefined,
      },
    }),
  ).toMatchInlineSnapshot(`"{"a":{}}"`);

  expect(
    getValueStableKey({
      a: {
        b: {},
      },
    }),
  ).toMatchInlineSnapshot(`"{"a":{"b":{}}}"`);

  expect(
    getValueStableKey({
      a: {},
      b: 1,
    }),
  ).toMatchInlineSnapshot(`"[{"a":{}},{"b":1}]"`);
});

test('undefined values should not change the equivalent not undefined objs', () => {
  const a = getValueStableKey({ tableId: 'users' });
  const b = getValueStableKey({ tableId: 'users', filters: undefined });

  expect(a === b).toBeTruthy();
});

test('undefined values in objects should not change the equivalent not undefined objs', () => {
  expect(
    getValueStableKey({
      a: undefined,
      b: undefined,
    }),
  ).toMatchInlineSnapshot(`"{}"`);

  expect(
    getValueStableKey({
      a: undefined,
      b: 1,
    }),
  ).toMatchInlineSnapshot(`"{"b":1}"`);
});

test('getCacheId handles arrays', () => {
  expect(getValueStableKey([1, 2, 3])).toMatchInlineSnapshot(`"[1,2,3]"`);
});

test('getCacheId handles nested arrays', () => {
  expect(getValueStableKey({ a: [1, 2, 3, [2, 1, 3]] })).toMatchInlineSnapshot(
    `"{"a":[1,2,3,[2,1,3]]}"`,
  );
});

test('a subset of a value can be checked via includes', () => {
  const subSetObj = { z: 0, a: 1, b: 2 };

  expect(
    getValueStableKey({
      a: 1,
      b: 2,
      c: subSetObj,
    }).includes(getValueStableKey(subSetObj)),
  ).toBeTruthy();
});
