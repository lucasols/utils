import { describe, expect, test } from 'vitest';
import { createLoggerStore } from './testUtils';

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
      ---

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
});
