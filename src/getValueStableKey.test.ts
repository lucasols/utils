import { describe, expect, test } from 'vitest';
import { getValueStableKey } from './getValueStableKey';

test('getCacheId ignore undefined obj values', () => {
  expect(
    getValueStableKey({
      a: 1,
      b: undefined,
      c: 3,
      und: undefined,
    }),
  ).toMatchInlineSnapshot(`"{a:1,c:3}"`);
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
  ).toMatchInlineSnapshot(`"{a:1,b:{c:3,d:4}}"`);
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
  ).toMatchInlineSnapshot(`"{a:[{c:3,d:4},{a:1,z:1},1]}"`);
});

test('avoid conflicting keys', () => {
  function getKeysAreNotTheSame(a: any, b: any) {
    const aKey = getValueStableKey(a);
    const bKey = getValueStableKey(b);

    return {
      aKey,
      bKey,
      areNotTheSame: aKey !== bKey,
    };
  }

  expect(getKeysAreNotTheSame({ a: 1, b: 2 }, { a: '1,b:2' }))
    .toMatchInlineSnapshot(`
      {
        "aKey": "{a:1,b:2}",
        "areNotTheSame": true,
        "bKey": "{a:"1,b:2"}",
      }
    `);

  expect(getKeysAreNotTheSame({ a: '"1', b: '2"' }, { a: '1,b:2' }))
    .toMatchInlineSnapshot(`
      {
        "aKey": "{a:"\\"1",b:"2\\""}",
        "areNotTheSame": true,
        "bKey": "{a:"1,b:2"}",
      }
    `);

  expect(getKeysAreNotTheSame({ a: '1', b: '2' }, { ['a:1,b']: '2' }))
    .toMatchInlineSnapshot(`
      {
        "aKey": "{a:"1",b:"2"}",
        "areNotTheSame": true,
        "bKey": "{a:1,b:"2"}",
      }
    `);

  expect(getKeysAreNotTheSame({ a: 1, b: '2' }, { a: '1', b: '2' }))
    .toMatchInlineSnapshot(`
      {
        "aKey": "{a:1,b:"2"}",
        "areNotTheSame": true,
        "bKey": "{a:"1",b:"2"}",
      }
    `);

  expect(getKeysAreNotTheSame({ a: '1', b: '2' }, { a: '1",b:"2' }))
    .toMatchInlineSnapshot(`
      {
        "aKey": "{a:"1",b:"2"}",
        "areNotTheSame": true,
        "bKey": "{a:"1\\",b:\\"2"}",
      }
    `);
});

test('max default depth sorting = 3', () => {
  const obj = {
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
  };
  expect(getValueStableKey(obj)).toMatchInlineSnapshot(
    `"{filters:[{field:"single_select",not_sort:{z:1,a:1},operator:"Exatamente igual",type:"string",value:"Option 1"}],nested_type:"onlyrefs",object_type:"test",page:1,size:50}"`,
  );

  expect(getValueStableKey(obj, 3)).not.toBe(getValueStableKey(obj, 4));
});

test('number cache id is not equal to string cache id', () => {
  expect(getValueStableKey(1) !== getValueStableKey('1')).toBeTruthy();
});

test('primitive values are not serialized', () => {
  expect(getValueStableKey(1)).toMatchInlineSnapshot(`"$1"`);
  expect(getValueStableKey('1')).toMatchInlineSnapshot(`""1"`);
  expect(getValueStableKey(true)).toMatchInlineSnapshot(`"$true"`);
  expect(getValueStableKey(false)).toMatchInlineSnapshot(`"$false"`);
  expect(getValueStableKey(null)).toMatchInlineSnapshot(`"$null"`);
  expect(getValueStableKey(undefined)).toMatchInlineSnapshot(`"$undefined"`);
});

test('objects with one key should not be sorted', () => {
  expect(
    getValueStableKey({
      a: {
        b: 1,
      },
    }),
  ).toMatchInlineSnapshot(`"{a:{b:1}}"`);
});

test('empty objects', () => {
  expect(
    getValueStableKey({
      a: {
        a: undefined,
      },
    }),
  ).toMatchInlineSnapshot(`"{a:{}}"`);

  expect(
    getValueStableKey({
      a: {
        b: {},
      },
    }),
  ).toMatchInlineSnapshot(`"{a:{b:{}}}"`);

  expect(
    getValueStableKey({
      a: {},
      b: 1,
    }),
  ).toMatchInlineSnapshot(`"{a:{},b:1}"`);
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
  ).toMatchInlineSnapshot(`"{b:1}"`);
});

test('getCacheId handles arrays', () => {
  expect(getValueStableKey([1, 2, 3])).toMatchInlineSnapshot(`"[1,2,3]"`);
});

test('getCacheId handles nested arrays', () => {
  expect(getValueStableKey({ a: [1, 2, 3, [2, 1, 3]] })).toMatchInlineSnapshot(
    `"{a:[1,2,3,[2,1,3]]}"`,
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

describe('circular references', () => {
  test('throws on direct self-reference', () => {
    const obj: any = { a: 1 };
    obj.self = obj;

    expect(() => getValueStableKey(obj)).toThrowErrorMatchingInlineSnapshot(
      `[Error: Circular reference detected]`,
    );
  });

  test('throws on nested circular reference', () => {
    const nested: any = { a: { b: { c: {} } } };
    nested.a.b.c.circular = nested.a;

    expect(() => getValueStableKey(nested)).toThrowErrorMatchingInlineSnapshot(
      `[Error: Circular reference detected]`,
    );
  });

  test('throws on circular array reference', () => {
    const array: any[] = [1, 2, 3];
    array.push(array);

    expect(() => getValueStableKey(array)).toThrowErrorMatchingInlineSnapshot(
      `[Error: Circular reference detected]`,
    );
  });

  test('handles shared non-circular references', () => {
    const sharedObj = { x: 1, y: 2 };
    expect(
      getValueStableKey({
        a: sharedObj,
        b: sharedObj,
        c: { nested: sharedObj },
      }),
    ).toMatchInlineSnapshot(`"{a:{x:1,y:2},b:{x:1,y:2},c:{nested:{x:1,y:2}}}"`);
  });

  test('handles complex shared references', () => {
    const complexShared = { name: 'test' };
    const objWithShared = {
      first: [{ ref: complexShared }, { other: 1 }],
      second: { deep: { ref: complexShared } },
      third: complexShared,
    };
    expect(getValueStableKey(objWithShared)).toMatchInlineSnapshot(
      `"{first:[{ref:{name:"test"}},{other:1}],second:{deep:{ref:{name:"test"}}},third:{name:"test"}}"`,
    );
  });

  test('throws on circular reference with shared refs', () => {
    const circular: any = { name: 'test' };
    const objWithCircular: any = {
      first: circular,
      second: { ref: circular },
    };
    circular.self = objWithCircular;
    expect(() =>
      getValueStableKey(objWithCircular),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: Circular reference detected]`,
    );
  });
});

test('handles non-plain objects', () => {
  const date = new Date('2024-01-01');
  const regex = /test/;
  const map = new Map([
    ['a', 1],
    ['b', 2],
  ]);
  const set = new Set([1, 2, 3]);

  class Custom {
    prop = 'value';
    method() {
      return 'test';
    }
  }
  const customInstance = new Custom();

  expect(getValueStableKey(date)).toMatchInlineSnapshot(`"{}"`);
  expect(getValueStableKey(regex)).toMatchInlineSnapshot(`"{}"`);
  expect(getValueStableKey(map)).toMatchInlineSnapshot(`"{}"`);
  expect(getValueStableKey(set)).toMatchInlineSnapshot(`"{}"`);
  expect(getValueStableKey(customInstance)).toMatchInlineSnapshot(
    `"{prop:"value"}"`,
  );
});

test('handles special primitives', () => {
  const fn = () => 'test';

  expect(getValueStableKey(fn)).toMatchInlineSnapshot(`"$() => "test""`);

  // BigInt
  expect(getValueStableKey(BigInt(123))).toMatchInlineSnapshot(`"$123"`);
});

test('key collision and delimiter handling', () => {
  const obj1 = { 'a:b': 'value' };
  const obj2 = { a: { b: 'value' } };

  // These should produce different keys
  expect(getValueStableKey(obj1)).not.toBe(getValueStableKey(obj2));

  const obj3 = { 'a,b': 'value' };
  const obj4 = { a: 'value', b: 'value' };

  // These should produce different keys
  expect(getValueStableKey(obj3)).not.toBe(getValueStableKey(obj4));

  // Complex key with multiple delimiters
  const complexKey = { 'a:b,c:d': { 'e:f': 'value' } };
  expect(getValueStableKey(complexKey)).toMatchInlineSnapshot(
    `"{a:b,c:d:{e:f:"value"}}"`,
  );
});
