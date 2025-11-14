import { produce } from 'immer';
import { describe, expect, test } from 'vitest';
import { getArrayMethodsFromProduce, updateObject } from './mutationUtils';

describe('updateObject', () => {
  describe('basic functionality', () => {
    test('should update object properties with new values', () => {
      const obj = { a: 1, b: 'test', c: true };
      updateObject(obj, { a: 2, b: 'updated' });

      expect(obj).toMatchInlineSnapshot(`
        {
          "a": 2,
          "b": "updated",
          "c": true,
        }
      `);
    });

    test('should preserve reference for unchanged values (deep equality)', () => {
      const nestedObj = { x: 1, y: 2 };
      const obj = { a: 1, nested: nestedObj };
      const originalNested = obj.nested;

      updateObject(obj, { a: 2, nested: { x: 1, y: 2 } });

      expect(obj.a).toBe(2);
      expect(obj.nested).toBe(originalNested); // Should preserve reference due to deep equality
    });

    test('should update nested objects when values differ', () => {
      const obj = { a: 1, nested: { x: 1, y: 2 } };
      const originalNested = obj.nested;

      updateObject(obj, { nested: { x: 1, y: 3 } });

      expect(obj.nested).not.toBe(originalNested); // Reference should change
      expect(obj.nested).toMatchInlineSnapshot(`
        {
          "x": 1,
          "y": 3,
        }
      `);
    });

    test('should ignore undefined values in updates', () => {
      const obj = { a: 1, b: 'test', c: true };
      updateObject(obj, { a: undefined, b: 'updated', c: undefined });

      expect(obj).toMatchInlineSnapshot(`
        {
          "a": 1,
          "b": "updated",
          "c": true,
        }
      `);
    });

    test('should handle adding new properties', () => {
      const obj = { a: 1 } as Record<string, unknown>;
      updateObject(obj, { b: 'new', c: 42 });

      expect(obj).toMatchInlineSnapshot(`
        {
          "a": 1,
          "b": "new",
          "c": 42,
        }
      `);
    });

    test('should handle empty updates object', () => {
      const obj = { a: 1, b: 'test' };
      const original = { ...obj };
      updateObject(obj, {});

      expect(obj).toEqual(original);
    });
  });

  describe('edge cases', () => {
    test('should handle null object gracefully', () => {
      expect(() => updateObject(null, { a: 1 })).not.toThrow();
    });

    test('should handle undefined object gracefully', () => {
      expect(() => updateObject(undefined, { a: 1 })).not.toThrow();
    });
  });

  describe('immer integration', () => {
    test('should work with immer-draft objects', () => {
      interface State {
        user: {
          name: string;
          age: number;
        };
        settings: {
          theme: string;
          notifications: boolean;
        };
      }

      const initialState: State = {
        user: { name: 'John', age: 30 },
        settings: { theme: 'dark', notifications: true },
      };

      const newState = produce(initialState, (draft) => {
        updateObject(draft.user, { name: 'Jane', age: 25 });
        updateObject(draft.settings, { theme: 'light' });
      });

      expect(newState).toMatchInlineSnapshot(`
        {
          "settings": {
            "notifications": true,
            "theme": "light",
          },
          "user": {
            "age": 25,
            "name": "Jane",
          },
        }
      `);

      // Original state should remain unchanged
      expect(initialState).toMatchInlineSnapshot(`
        {
          "settings": {
            "notifications": true,
            "theme": "dark",
          },
          "user": {
            "age": 30,
            "name": "John",
          },
        }
      `);
    });
  });
});

describe('getArrayMethodsFromProduce', () => {
  type Item = {
    id: string;
    name: string;
    value: number;
  };

  describe('add method', () => {
    test('should add item to empty array', () => {
      let state: Item[] = [];
      const produceFn = (cb: (draft: Item[]) => void | Item[]) => {
        state = produce(state, cb);
      };
      const methods = getArrayMethodsFromProduce(produceFn, (item) => item.id);

      methods.add({ id: '1', name: 'Item 1', value: 10 });

      expect(state).toMatchInlineSnapshot(`
        [
          {
            "id": "1",
            "name": "Item 1",
            "value": 10,
          },
        ]
      `);
    });

    test('should add item to existing array', () => {
      let state: Item[] = [
        { id: '1', name: 'Item 1', value: 10 },
        { id: '2', name: 'Item 2', value: 20 },
      ];
      const produceFn = (cb: (draft: Item[]) => void | Item[]) => {
        state = produce(state, cb);
      };
      const methods = getArrayMethodsFromProduce(produceFn, (item) => item.id);

      methods.add({ id: '3', name: 'Item 3', value: 30 });

      expect(state).toMatchInlineSnapshot(`
        [
          {
            "id": "1",
            "name": "Item 1",
            "value": 10,
          },
          {
            "id": "2",
            "name": "Item 2",
            "value": 20,
          },
          {
            "id": "3",
            "name": "Item 3",
            "value": 30,
          },
        ]
      `);
    });

    test('should add multiple items sequentially', () => {
      let state: Item[] = [];
      const produceFn = (cb: (draft: Item[]) => void | Item[]) => {
        state = produce(state, cb);
      };
      const methods = getArrayMethodsFromProduce(produceFn, (item) => item.id);

      methods.add({ id: '1', name: 'Item 1', value: 10 });
      methods.add({ id: '2', name: 'Item 2', value: 20 });
      methods.add({ id: '3', name: 'Item 3', value: 30 });

      expect(state.length).toBe(3);
      expect(state.map((item) => item.id)).toEqual(['1', '2', '3']);
    });
  });

  describe('remove method', () => {
    test('should remove item by id', () => {
      let state: Item[] = [
        { id: '1', name: 'Item 1', value: 10 },
        { id: '2', name: 'Item 2', value: 20 },
        { id: '3', name: 'Item 3', value: 30 },
      ];
      const produceFn = (cb: (draft: Item[]) => void | Item[]) => {
        state = produce(state, cb);
      };
      const methods = getArrayMethodsFromProduce(produceFn, (item) => item.id);

      methods.remove('2');

      expect(state).toMatchInlineSnapshot(`
        [
          {
            "id": "1",
            "name": "Item 1",
            "value": 10,
          },
          {
            "id": "3",
            "name": "Item 3",
            "value": 30,
          },
        ]
      `);
    });

    test('should remove first item', () => {
      let state: Item[] = [
        { id: '1', name: 'Item 1', value: 10 },
        { id: '2', name: 'Item 2', value: 20 },
      ];
      const produceFn = (cb: (draft: Item[]) => void | Item[]) => {
        state = produce(state, cb);
      };
      const methods = getArrayMethodsFromProduce(produceFn, (item) => item.id);

      methods.remove('1');

      expect(state).toMatchInlineSnapshot(`
        [
          {
            "id": "2",
            "name": "Item 2",
            "value": 20,
          },
        ]
      `);
    });

    test('should remove last item', () => {
      let state: Item[] = [
        { id: '1', name: 'Item 1', value: 10 },
        { id: '2', name: 'Item 2', value: 20 },
      ];
      const produceFn = (cb: (draft: Item[]) => void | Item[]) => {
        state = produce(state, cb);
      };
      const methods = getArrayMethodsFromProduce(produceFn, (item) => item.id);

      methods.remove('2');

      expect(state).toMatchInlineSnapshot(`
        [
          {
            "id": "1",
            "name": "Item 1",
            "value": 10,
          },
        ]
      `);
    });

    test('should handle removing non-existent id gracefully', () => {
      let state: Item[] = [
        { id: '1', name: 'Item 1', value: 10 },
        { id: '2', name: 'Item 2', value: 20 },
      ];
      const produceFn = (cb: (draft: Item[]) => void | Item[]) => {
        state = produce(state, cb);
      };
      const methods = getArrayMethodsFromProduce(produceFn, (item) => item.id);

      methods.remove('999');

      expect(state).toMatchInlineSnapshot(`
        [
          {
            "id": "1",
            "name": "Item 1",
            "value": 10,
          },
          {
            "id": "2",
            "name": "Item 2",
            "value": 20,
          },
        ]
      `);
    });

    test('should handle removing from empty array', () => {
      let state: Item[] = [];
      const produceFn = (cb: (draft: Item[]) => void | Item[]) => {
        state = produce(state, cb);
      };
      const methods = getArrayMethodsFromProduce(produceFn, (item) => item.id);

      methods.remove('1');

      expect(state).toEqual([]);
    });
  });

  describe('update method', () => {
    describe('with function updater', () => {
      test('should update item using mutating function', () => {
        let state: Item[] = [
          { id: '1', name: 'Item 1', value: 10 },
          { id: '2', name: 'Item 2', value: 20 },
          { id: '3', name: 'Item 3', value: 30 },
        ];
        const produceFn = (cb: (draft: Item[]) => void | Item[]) => {
          state = produce(state, cb);
        };
        const methods = getArrayMethodsFromProduce(
          produceFn,
          (item) => item.id,
        );

        methods.update('2', (item) => {
          item.name = 'Updated Item 2';
          item.value = 200;
        });

        expect(state).toMatchInlineSnapshot(`
          [
            {
              "id": "1",
              "name": "Item 1",
              "value": 10,
            },
            {
              "id": "2",
              "name": "Updated Item 2",
              "value": 200,
            },
            {
              "id": "3",
              "name": "Item 3",
              "value": 30,
            },
          ]
        `);
      });

      test('should update item using function that returns new object', () => {
        let state: Item[] = [
          { id: '1', name: 'Item 1', value: 10 },
          { id: '2', name: 'Item 2', value: 20 },
          { id: '3', name: 'Item 3', value: 30 },
        ];
        const produceFn = (cb: (draft: Item[]) => void | Item[]) => {
          state = produce(state, cb);
        };
        const methods = getArrayMethodsFromProduce(
          produceFn,
          (item) => item.id,
        );

        methods.update('2', (item) => ({
          ...item,
          name: 'Completely New Item 2',
          value: 999,
        }));

        expect(state).toMatchInlineSnapshot(`
          [
            {
              "id": "1",
              "name": "Item 1",
              "value": 10,
            },
            {
              "id": "2",
              "name": "Completely New Item 2",
              "value": 999,
            },
            {
              "id": "3",
              "name": "Item 3",
              "value": 30,
            },
          ]
        `);
      });

      test('should update first item', () => {
        let state: Item[] = [
          { id: '1', name: 'Item 1', value: 10 },
          { id: '2', name: 'Item 2', value: 20 },
        ];
        const produceFn = (cb: (draft: Item[]) => void | Item[]) => {
          state = produce(state, cb);
        };
        const methods = getArrayMethodsFromProduce(
          produceFn,
          (item) => item.id,
        );

        methods.update('1', (item) => {
          item.value = 100;
        });

        expect(state[0]?.value).toBe(100);
      });

      test('should update last item', () => {
        let state: Item[] = [
          { id: '1', name: 'Item 1', value: 10 },
          { id: '2', name: 'Item 2', value: 20 },
        ];
        const produceFn = (cb: (draft: Item[]) => void | Item[]) => {
          state = produce(state, cb);
        };
        const methods = getArrayMethodsFromProduce(
          produceFn,
          (item) => item.id,
        );

        methods.update('2', (item) => {
          item.value = 200;
        });

        expect(state[1]?.value).toBe(200);
      });
    });

    describe('with partial object updater', () => {
      test('should update item using partial object', () => {
        let state: Item[] = [
          { id: '1', name: 'Item 1', value: 10 },
          { id: '2', name: 'Item 2', value: 20 },
          { id: '3', name: 'Item 3', value: 30 },
        ];
        const produceFn = (cb: (draft: Item[]) => void | Item[]) => {
          state = produce(state, cb);
        };
        const methods = getArrayMethodsFromProduce(
          produceFn,
          (item) => item.id,
        );

        methods.update('2', { name: 'Partially Updated Item 2' });

        expect(state).toMatchInlineSnapshot(`
          [
            {
              "id": "1",
              "name": "Item 1",
              "value": 10,
            },
            {
              "id": "2",
              "name": "Partially Updated Item 2",
              "value": 20,
            },
            {
              "id": "3",
              "name": "Item 3",
              "value": 30,
            },
          ]
        `);
      });

      test('should update multiple properties with partial object', () => {
        let state: Item[] = [
          { id: '1', name: 'Item 1', value: 10 },
          { id: '2', name: 'Item 2', value: 20 },
        ];
        const produceFn = (cb: (draft: Item[]) => void | Item[]) => {
          state = produce(state, cb);
        };
        const methods = getArrayMethodsFromProduce(
          produceFn,
          (item) => item.id,
        );

        methods.update('1', { name: 'New Name', value: 100 });

        expect(state[0]).toMatchInlineSnapshot(`
          {
            "id": "1",
            "name": "New Name",
            "value": 100,
          }
        `);
      });

      test('should ignore undefined values in partial object', () => {
        let state: Item[] = [
          { id: '1', name: 'Item 1', value: 10 },
          { id: '2', name: 'Item 2', value: 20 },
        ];
        const produceFn = (cb: (draft: Item[]) => void | Item[]) => {
          state = produce(state, cb);
        };
        const methods = getArrayMethodsFromProduce(
          produceFn,
          (item) => item.id,
        );

        methods.update('1', { name: undefined, value: 100 });

        expect(state[0]).toMatchInlineSnapshot(`
          {
            "id": "1",
            "name": "Item 1",
            "value": 100,
          }
        `);
      });
    });

    describe('error handling', () => {
      test('should throw error when updating non-existent id', () => {
        let state: Item[] = [
          { id: '1', name: 'Item 1', value: 10 },
          { id: '2', name: 'Item 2', value: 20 },
        ];
        const produceFn = (cb: (draft: Item[]) => void | Item[]) => {
          state = produce(state, cb);
        };
        const methods = getArrayMethodsFromProduce(
          produceFn,
          (item) => item.id,
        );

        expect(() => {
          methods.update('999', { name: 'Non-existent' });
        }).toThrowErrorMatchingInlineSnapshot(
          `[Error: Item with id 999 not found]`,
        );
      });

      test('should throw error when updating in empty array', () => {
        let state: Item[] = [];
        const produceFn = (cb: (draft: Item[]) => void | Item[]) => {
          state = produce(state, cb);
        };
        const methods = getArrayMethodsFromProduce(
          produceFn,
          (item) => item.id,
        );

        expect(() => {
          methods.update('1', { name: 'Test' });
        }).toThrowErrorMatchingInlineSnapshot(
          `[Error: Item with id 1 not found]`,
        );
      });
    });
  });

  describe('integration scenarios', () => {
    test('should handle complex CRUD operations', () => {
      let state: Item[] = [];
      const produceFn = (cb: (draft: Item[]) => void | Item[]) => {
        state = produce(state, cb);
      };
      const methods = getArrayMethodsFromProduce(produceFn, (item) => item.id);

      methods.add({ id: '1', name: 'Item 1', value: 10 });
      methods.add({ id: '2', name: 'Item 2', value: 20 });
      methods.add({ id: '3', name: 'Item 3', value: 30 });
      methods.update('2', { value: 200 });
      methods.remove('1');
      methods.add({ id: '4', name: 'Item 4', value: 40 });

      expect(state).toMatchInlineSnapshot(`
        [
          {
            "id": "2",
            "name": "Item 2",
            "value": 200,
          },
          {
            "id": "3",
            "name": "Item 3",
            "value": 30,
          },
          {
            "id": "4",
            "name": "Item 4",
            "value": 40,
          },
        ]
      `);
    });

    test('should work with custom id getter', () => {
      type CustomItem = {
        userId: string;
        data: string;
      };

      let state: CustomItem[] = [
        { userId: 'user-1', data: 'Data 1' },
        { userId: 'user-2', data: 'Data 2' },
      ];
      const produceFn = (cb: (draft: CustomItem[]) => void | CustomItem[]) => {
        state = produce(state, cb);
      };
      const methods = getArrayMethodsFromProduce(
        produceFn,
        (item) => item.userId,
      );

      methods.update('user-1', { data: 'Updated Data 1' });
      methods.remove('user-2');
      methods.add({ userId: 'user-3', data: 'Data 3' });

      expect(state).toMatchInlineSnapshot(`
        [
          {
            "data": "Updated Data 1",
            "userId": "user-1",
          },
          {
            "data": "Data 3",
            "userId": "user-3",
          },
        ]
      `);
    });

    test('should handle nested object updates', () => {
      type ComplexItem = {
        id: string;
        metadata: {
          title: string;
          tags: string[];
        };
        value: number;
      };

      let state: ComplexItem[] = [
        {
          id: '1',
          metadata: { title: 'Title 1', tags: ['a', 'b'] },
          value: 10,
        },
        {
          id: '2',
          metadata: { title: 'Title 2', tags: ['c', 'd'] },
          value: 20,
        },
      ];
      const produceFn = (
        cb: (draft: ComplexItem[]) => void | ComplexItem[],
      ) => {
        state = produce(state, cb);
      };
      const methods = getArrayMethodsFromProduce(produceFn, (item) => item.id);

      methods.update('1', {
        metadata: { title: 'New Title 1', tags: ['x', 'y', 'z'] },
      });

      expect(state[0]).toMatchInlineSnapshot(`
        {
          "id": "1",
          "metadata": {
            "tags": [
              "x",
              "y",
              "z",
            ],
            "title": "New Title 1",
          },
          "value": 10,
        }
      `);
    });
  });
});
