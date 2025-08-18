import { produce } from 'immer';
import { describe, expect, test } from 'vitest';
import { updateObject } from './mutationUtils';

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
