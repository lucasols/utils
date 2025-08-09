import { describe, expect, test } from 'vitest';
import { compactSnapshot, createLoggerStore } from './testUtils';

describe('createLoggerStore', () => {
  test('should add logs and return correct snapshot', () => {
    const store = createLoggerStore();

    store.add({ name: 'John', age: 30, address: '123 Main St' });
    store.add({ name: 'John', age: 30, address: '123 Main St' });
    store.add({ name: 'Jane', age: 25, address: '456 Elm St' });

    expect(store.snapshot).toMatchInlineSnapshot(`
      "
      -> name: John ⋅ age: 30 ⋅ address: 123 Main St
      -> name: John ⋅ age: 30 ⋅ address: 123 Main St
      -> name: Jane ⋅ age: 25 ⋅ address: 456 Elm St
      "
    `);
  });

  test('add mark', () => {
    const store = createLoggerStore();

    store.add({ name: 'John', age: 30 });
    store.addMark('mark');
    store.add({ name: 'Jane', age: 25 });

    expect(store.snapshot).toMatchInlineSnapshot(`
      "
      -> name: John ⋅ age: 30

      >>> mark

      -> name: Jane ⋅ age: 25
      "
    `);
  });

  test('changesSnapshot', () => {
    const store = createLoggerStore({ changesOnly: true });

    store.add({ name: 'John', age: 30 });
    store.add({ name: 'John', age: 30 });
    store.add({ name: 'Jane', age: 25 });

    expect(store.changesSnapshot).toMatchInlineSnapshot(`
      "
      -> name: John ⋅ age: 30
      -> name: Jane ⋅ age: 25
      "
    `);
  });

  test('snapshot from last', () => {
    const store = createLoggerStore({ fromLastSnapshot: true });

    store.add({ name: 'John', age: 30 });
    store.add({ name: 'John', age: 30 });

    expect(store.snapshotFromLast).toMatchInlineSnapshot(`
      "
      -> name: John ⋅ age: 30
      -> name: John ⋅ age: 30
      "
    `);

    store.addMark('mark');
    store.add({ name: 'Jane', age: 25 });

    expect(store.snapshotFromLast).toMatchInlineSnapshot(`
      "
      ⋅⋅⋅
      >>> mark

      -> name: Jane ⋅ age: 25
      "
    `);
  });

  test('split long lines', () => {
    const store = createLoggerStore();

    store.add({
      name: 'John Smith',
      age: 30,
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
      children: ['Bob', 'Jane', 'Elizabeth', 'James'],
    });

    store.add({
      name: 'Lisa Smith',
      age: 25,
      address: '456 Elm St',
      city: 'Los Angeles',
      country: 'USA',
      children: ['Bob', 'Jane'],
    });

    expect(store.snapshot).toMatchInlineSnapshot(`
      "
      ┌─
      ⋅ name: John Smith
      ⋅ age: 30
      ⋅ address: 123 Main St
      ⋅ city: New York
      ⋅ country: USA
      ⋅ children: [Bob, …(3 more)]
      └─
      ┌─
      ⋅ name: Lisa Smith
      ⋅ age: 25
      ⋅ address: 456 Elm St
      ⋅ city: Los Angeles
      ⋅ country: USA
      ⋅ children: [Bob, Jane]
      └─
      "
    `);
  });

  test('handle empty string', () => {
    const store = createLoggerStore();

    store.add({
      name: 'John Smith',
      age: 30,
      address: '',
      obj: { a: 1, empty: '', b: 2 },
    });

    expect(store.snapshot).toMatchInlineSnapshot(`
      "
      -> name: John Smith ⋅ age: 30 ⋅ address: '' ⋅ obj: {a:1, empty:'', b:2}
      "
    `);
  });

  test('use emoji for booleans', () => {
    const store = createLoggerStore();

    store.add({
      ok: null,
    });

    store.add({
      name: 'John Smith',
      age: 30,
      obj: { a: 1, bool: false, b: 2, c: true },
      isActive: true,
      isDisabled: false,
    });

    store.add({
      yes: true,
      no: false,
    });

    store.add({
      yes: false,
      no: true,
    });

    expect(store.snapshot).toMatchInlineSnapshot(`
      "
      -> ok: null
      ┌─
      ⋅ name: John Smith
      ⋅ age: 30
      ⋅ obj: {a:1, bool:❌, b:2, c:✅}
      ⋅ isActive: ✅
      ⋅ isDisabled: ❌
      └─
      -> yes: ✅ ⋅ no: ❌
      -> yes: ❌ ⋅ no: ✅
      "
    `);
  });

  test('snapshot from last empty', () => {
    const store = createLoggerStore({ fromLastSnapshot: true });

    store.add({ name: 'John', age: 30 });
    store.add({ name: 'John', age: 30 });

    expect(store.snapshot).toMatchInlineSnapshot(`
      "
      -> name: John ⋅ age: 30
      -> name: John ⋅ age: 30
      "
    `);

    expect(store.snapshotFromLast).toMatchInlineSnapshot(`"⋅⋅⋅empty⋅⋅⋅"`);
  });
});

describe('compactSnapshot', () => {
  test('should format basic objects with default boolean emojis', () => {
    const data = {
      name: 'John',
      age: 30,
      isActive: true,
      isDisabled: false,
    };

    expect(compactSnapshot(data)).toMatchInlineSnapshot(`
      "
      name: 'John'
      age: 30
      isActive: '✅'
      isDisabled: '❌'
      "
    `);
  });

  test('should format nested objects with booleans', () => {
    const data = {
      user: {
        name: 'John',
        settings: {
          notifications: true,
          darkMode: false,
        },
      },
      features: [true, false, true],
    };

    expect(compactSnapshot(data)).toMatchInlineSnapshot(`
      "
      user:
        name: 'John'
        settings: { notifications: '✅', darkMode: '❌' }

      features: ['✅', '❌', '✅']
      "
    `);
  });

  test('should disable boolean replacement when showBooleansAs is false', () => {
    const data = {
      isActive: true,
      isDisabled: false,
    };

    expect(compactSnapshot(data, { showBooleansAs: false })).toMatchInlineSnapshot(`
      "
      isActive: true
      isDisabled: false
      "
    `);
  });

  test('should use custom true/false text', () => {
    const data = {
      success: true,
      error: false,
    };

    expect(compactSnapshot(data, {
      showBooleansAs: {
        trueText: 'YES',
        falseText: 'NO',
      },
    })).toMatchInlineSnapshot(`
      "
      success: 'YES'
      error: 'NO'
      "
    `);
  });

  test('should configure individual props', () => {
    const data = {
      isOnline: true,
      isOffline: false,
      hasPermission: true,
      isBlocked: false,
    };

    expect(compactSnapshot(data, {
      showBooleansAs: {
        props: {
          isOnline: { trueText: '🟢', falseText: '🔴' },
          hasPermission: true, // use default
        },
        trueText: 'TRUE',
        falseText: 'FALSE',
      },
    })).toMatchInlineSnapshot(`
      "
      isOnline: '🟢'
      isOffline: 'FALSE'
      hasPermission: 'TRUE'
      isBlocked: 'FALSE'
      "
    `);
  });

  test('should ignore specified props', () => {
    const data = {
      showEmoji: true,
      keepOriginal: false,
      alsoShowEmoji: true,
    };

    expect(compactSnapshot(data, {
      showBooleansAs: {
        ignoreProps: ['keepOriginal'],
      },
    })).toMatchInlineSnapshot(`
      "
      showEmoji: '✅'
      keepOriginal: false
      alsoShowEmoji: '✅'
      "
    `);
  });

  test('should handle arrays of objects with booleans', () => {
    const data = {
      users: [
        { name: 'John', active: true },
        { name: 'Jane', active: false },
      ],
    };

    expect(compactSnapshot(data)).toMatchInlineSnapshot(`
      "
      users:
        - { name: 'John', active: '✅' }
        - { name: 'Jane', active: '❌' }
      "
    `);
  });

  test('should respect other yamlStringify options', () => {
    const data = {
      longProperty: 'This is a very long string that should be on its own line',
      active: true,
      nested: {
        deep: {
          value: false,
        },
      },
    };

    expect(compactSnapshot(data, {
      maxLineLength: 20,
      showBooleansAs: {
        trueText: 'ON',
        falseText: 'OFF',
      },
    })).toMatchInlineSnapshot(`
      "
      longProperty: 'This is a very long string that should be on its own line'
      active: 'ON'

      nested:
        deep: { value: 'OFF' }
      "
    `);
  });

  test('should handle edge cases', () => {
    const data = {
      nullValue: null,
      undefinedValue: undefined,
      booleanTrue: true,
      booleanFalse: false,
      emptyArray: [],
      emptyObject: {},
    };

    expect(compactSnapshot(data)).toMatchInlineSnapshot(`
      "
      nullValue: null
      booleanTrue: '✅'
      booleanFalse: '❌'
      emptyArray: []
      emptyObject: {}
      "
    `);
  });

  test('should throw on circular references in objects', () => {
    const data: any = { a: true };
    data.self = data;

    expect(() => compactSnapshot(data)).toThrow('Circular reference detected in object');
  });

  test('should throw on circular references in arrays', () => {
    const arr: any[] = [true, false];
    arr.push(arr);

    expect(() => compactSnapshot(arr)).toThrow('Circular reference detected in array');
  });

  test('should throw on nested circular references', () => {
    const obj: any = {
      level1: {
        level2: {
          active: true
        }
      }
    };
    obj.level1.level2.circular = obj;

    expect(() => compactSnapshot(obj)).toThrow('Circular reference detected in object');
  });

  test('should handle same object in different branches (not circular)', () => {
    const sharedObj = { shared: true };
    const data = {
      branch1: sharedObj,
      branch2: sharedObj,
    };

    expect(compactSnapshot(data)).toMatchInlineSnapshot(`
      "
      branch1: { shared: '✅' }
      branch2: { shared: '✅' }
      "
    `);
  });
});
