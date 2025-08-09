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

    expect(compactSnapshot(data, { showBooleansAs: false }))
      .toMatchInlineSnapshot(`
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

    expect(
      compactSnapshot(data, {
        showBooleansAs: {
          trueText: 'YES',
          falseText: 'NO',
        },
      }),
    ).toMatchInlineSnapshot(`
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

    expect(
      compactSnapshot(data, {
        showBooleansAs: {
          props: {
            isOnline: { trueText: '🟢', falseText: '🔴' },
            hasPermission: true, // use default
          },
          trueText: 'TRUE',
          falseText: 'FALSE',
        },
      }),
    ).toMatchInlineSnapshot(`
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

    expect(
      compactSnapshot(data, {
        showBooleansAs: {
          ignoreProps: ['keepOriginal'],
        },
      }),
    ).toMatchInlineSnapshot(`
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

    expect(
      compactSnapshot(data, {
        maxLineLength: 20,
        showBooleansAs: {
          trueText: 'ON',
          falseText: 'OFF',
        },
      }),
    ).toMatchInlineSnapshot(`
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

    expect(() => compactSnapshot(data)).toThrow(
      'Circular reference detected in object',
    );
  });

  test('should throw on circular references in arrays', () => {
    const arr: any[] = [true, false];
    arr.push(arr);

    expect(() => compactSnapshot(arr)).toThrow(
      'Circular reference detected in array',
    );
  });

  test('should throw on nested circular references', () => {
    const obj: any = {
      level1: {
        level2: {
          active: true,
        },
      },
    };
    obj.level1.level2.circular = obj;

    expect(() => compactSnapshot(obj)).toThrow(
      'Circular reference detected in object',
    );
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

  describe('rejectKeys functionality', () => {
    test('should reject simple keys', () => {
      const data = {
        name: 'John',
        password: 'secret',
        email: 'john@example.com',
        age: 30,
      };

      expect(compactSnapshot(data, { rejectKeys: ['password'] }))
        .toMatchInlineSnapshot(`
          "
          name: 'John'
          email: 'john@example.com'
          age: 30
          "
        `);
    });

    test('should reject nested keys with dot notation', () => {
      const data = {
        user: {
          name: 'John',
          credentials: {
            password: 'secret',
            apiKey: 'key123',
          },
          profile: {
            email: 'john@example.com',
            age: 30,
          },
        },
      };

      expect(
        compactSnapshot(data, {
          rejectKeys: ['user.credentials.password', 'user.profile.age'],
        }),
      ).toMatchInlineSnapshot(`
        "
        user:
          name: 'John'
          credentials: { apiKey: 'key123' }
          profile: { email: 'john@example.com' }
        "
      `);
    });

    test('should reject keys with wildcard patterns', () => {
      const data = {
        user1: { password: 'secret1', name: 'John' },
        user2: { password: 'secret2', name: 'Jane' },
        admin: { password: 'admin123', name: 'Admin' },
        settings: { theme: 'dark', password: 'settings123' },
      };

      expect(compactSnapshot(data, { rejectKeys: ['*.password'] }))
        .toMatchInlineSnapshot(`
          "
          user1: { name: 'John' }
          user2: { name: 'Jane' }
          admin: { name: 'Admin' }
          settings: { theme: 'dark' }
          "
        `);
    });

    test('should handle arrays with rejectKeys', () => {
      const data = {
        users: [
          { name: 'John', password: 'secret1', active: true },
          { name: 'Jane', password: 'secret2', active: false },
        ],
      };

      expect(compactSnapshot(data, { rejectKeys: ['*.password'] }))
        .toMatchInlineSnapshot(`
          "
          users:
            - { name: 'John', active: '✅' }
            - { name: 'Jane', active: '❌' }
          "
        `);
    });
  });

  describe('filterKeys functionality', () => {
    test('should filter to include only specified keys', () => {
      const data = {
        name: 'John',
        password: 'secret',
        email: 'john@example.com',
        age: 30,
        active: true,
      };

      expect(compactSnapshot(data, { filterKeys: ['name', 'email', 'active'] }))
        .toMatchInlineSnapshot(`
          "
          name: 'John'
          email: 'john@example.com'
          active: '✅'
          "
        `);
    });

    test('should filter nested keys with dot notation', () => {
      const data = {
        user: {
          name: 'John',
          credentials: {
            password: 'secret',
            apiKey: 'key123',
          },
          profile: {
            email: 'john@example.com',
            age: 30,
            active: true,
          },
        },
        system: {
          version: '1.0',
          status: 'online',
        },
      };

      expect(
        compactSnapshot(data, {
          filterKeys: [
            'user.name',
            'user.profile.email',
            'user.profile.active',
          ],
        }),
      ).toMatchInlineSnapshot(`
        "
        user:
          name: 'John'
          profile: { email: 'john@example.com', active: '✅' }
        "
      `);
    });

    test('should keep nested filtered values', () => {
      const data = {
        type: 'select',
        options: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ],
      };

      expect(compactSnapshot(data, { filterKeys: ['options'] }))
        .toMatchInlineSnapshot(`
          "
          options:
            - { value: '1', label: 'Option 1' }
            - { value: '2', label: 'Option 2' }
          "
        `);
    });

    test('should filter with wildcard patterns', () => {
      const data = {
        user1: { name: 'John', password: 'secret1', age: 25 },
        user2: { name: 'Jane', password: 'secret2', age: 30 },
        admin: { name: 'Admin', password: 'admin123', age: 45 },
        settings: { theme: 'dark', name: 'AppSettings', age: null },
      };

      expect(compactSnapshot(data, { filterKeys: ['*.name'] }))
        .toMatchInlineSnapshot(`
          "
          user1: { name: 'John' }
          user2: { name: 'Jane' }
          admin: { name: 'Admin' }
          settings: { name: 'AppSettings' }
          "
        `);
    });
  });

  describe('combined rejectKeys and filterKeys', () => {
    test('should apply both filter and reject operations', () => {
      const data = {
        user: {
          name: 'John',
          password: 'secret',
          email: 'john@example.com',
          age: 30,
          active: true,
          lastLogin: '2023-01-01',
        },
      };

      // First filter to user fields, then reject password
      expect(
        compactSnapshot(data, {
          filterKeys: [
            'user.name',
            'user.password',
            'user.email',
            'user.active',
          ],
          rejectKeys: ['user.password'],
          collapseObjects: false,
        }),
      ).toMatchInlineSnapshot(`
        "
        user:
          name: 'John'
          email: 'john@example.com'
          active: '✅'
        "
      `);
    });

    test('should not apply rejectKeys with root level keys within filtered nested structures', () => {
      const data = {
        type: 'select',
        options: [
          { value: '1', label: 'Option 1', secret: 'hidden1' },
          { value: '2', label: 'Option 2', secret: 'hidden2' },
        ],
        config: {
          secret: 'config-secret',
          visible: true,
        },
      };

      expect(
        compactSnapshot(data, {
          filterKeys: ['options'],
          rejectKeys: ['secret'],
          collapseObjects: false,
        }),
      ).toMatchInlineSnapshot(`
        "
        options:
          - value: '1'
            label: 'Option 1'
            secret: 'hidden1'
          - value: '2'
            label: 'Option 2'
            secret: 'hidden2'
        "
      `);
    });

    test('should apply rejectKeys (with nested wildcard) within filtered nested objects', () => {
      const data = {
        user: {
          name: 'John',
          email: 'john@example.com',
          password: 'secret123',
          settings: {
            theme: 'dark',
            apiKey: 'secret-key',
            notifications: true,
          },
        },
        metadata: {
          version: '1.0',
          internal: 'secret-data',
        },
      };

      expect(
        compactSnapshot(data, {
          filterKeys: ['user'],
          rejectKeys: ['*.password', '*.apiKey'],
          collapseObjects: false,
        }),
      ).toMatchInlineSnapshot(`
        "
        user:
          name: 'John'
          email: 'john@example.com'
          settings:
            theme: 'dark'
            notifications: '✅'
        "
      `);
    });

    test('should handle rejectKeys with global wildcard patterns in filtered structures', () => {
      const data = {
        items: [
          { id: 1, name: 'Item 1', secret: 'hidden' },
          { id: 2, name: 'Item 2', secret: 'hidden' },
        ],
        other: {
          secretValue: 'should-be-removed',
          publicValue: 'should-stay',
        },
      };

      expect(
        compactSnapshot(data, {
          filterKeys: ['items'],
          // global wildcard pattern `*secret`
          rejectKeys: ['*secret'],
          collapseObjects: false,
        }),
      ).toMatchInlineSnapshot(`
        "
        items:
          - id: 1
            name: 'Item 1'
          - id: 2
            name: 'Item 2'
        "
      `);
    });
  });

  describe('pattern matching specifications', () => {
    const testData = {
      secret: 'root-secret',
      password: 'root-password',
      user: {
        name: 'John',
        secret: 'user-secret',
        password: 'user-password',
        settings: {
          secret: 'settings-secret',
          apiKey: 'api-key',
          theme: 'dark',
        },
      },
      items: [
        { id: 1, secret: 'item1-secret', password: 'item1-pass' },
        { id: 2, secret: 'item2-secret', password: 'item2-pass' },
      ],
    };

    describe('root-only patterns (e.g., "secret")', () => {
      test('should only reject root-level properties', () => {
        expect(
          compactSnapshot(testData, {
            rejectKeys: ['secret'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          password: 'root-password'

          user:
            name: 'John'
            secret: 'user-secret'
            password: 'user-password'
            settings:
              secret: 'settings-secret'
              apiKey: 'api-key'
              theme: 'dark'

          items:
            - id: 1
              secret: 'item1-secret'
              password: 'item1-pass'
            - id: 2
              secret: 'item2-secret'
              password: 'item2-pass'
          "
        `);
      });

      test('should work with multiple root-only patterns', () => {
        expect(
          compactSnapshot(testData, {
            rejectKeys: ['secret', 'password'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          user:
            name: 'John'
            secret: 'user-secret'
            password: 'user-password'
            settings:
              secret: 'settings-secret'
              apiKey: 'api-key'
              theme: 'dark'

          items:
            - id: 1
              secret: 'item1-secret'
              password: 'item1-pass'
            - id: 2
              secret: 'item2-secret'
              password: 'item2-pass'
          "
        `);
      });
    });

    describe('nested wildcard patterns (e.g., "*.secret")', () => {
      test('should only reject nested properties, not root ones', () => {
        expect(
          compactSnapshot(testData, {
            rejectKeys: ['*.secret'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          secret: 'root-secret'
          password: 'root-password'

          user:
            name: 'John'
            password: 'user-password'
            settings:
              apiKey: 'api-key'
              theme: 'dark'

          items:
            - id: 1
              password: 'item1-pass'
            - id: 2
              password: 'item2-pass'
          "
        `);
      });

      test('should work with multiple nested wildcard patterns', () => {
        expect(
          compactSnapshot(testData, {
            rejectKeys: ['*.secret', '*.password'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          secret: 'root-secret'
          password: 'root-password'

          user:
            name: 'John'
            settings:
              apiKey: 'api-key'
              theme: 'dark'

          items:
            - id: 1
            - id: 2
          "
        `);
      });
    });

    describe('global wildcard patterns (e.g., "*secret")', () => {
      test('should reject properties named exactly "secret" at any level', () => {
        expect(
          compactSnapshot(testData, {
            rejectKeys: ['*secret'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          password: 'root-password'

          user:
            name: 'John'
            password: 'user-password'
            settings:
              apiKey: 'api-key'
              theme: 'dark'

          items:
            - id: 1
              password: 'item1-pass'
            - id: 2
              password: 'item2-pass'
          "
        `);
      });

      test('should work with multiple global wildcard patterns', () => {
        expect(
          compactSnapshot(testData, {
            rejectKeys: ['*password', '*apiKey'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          secret: 'root-secret'

          user:
            name: 'John'
            secret: 'user-secret'
            settings:
              secret: 'settings-secret'
              theme: 'dark'

          items:
            - id: 1
              secret: 'item1-secret'
            - id: 2
              secret: 'item2-secret'
          "
        `);
      });
    });

    describe('exact path patterns (e.g., "user.secret")', () => {
      test('should only reject exact path matches', () => {
        expect(
          compactSnapshot(testData, {
            rejectKeys: ['user.secret'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          secret: 'root-secret'
          password: 'root-password'

          user:
            name: 'John'
            password: 'user-password'
            settings:
              secret: 'settings-secret'
              apiKey: 'api-key'
              theme: 'dark'

          items:
            - id: 1
              secret: 'item1-secret'
              password: 'item1-pass'
            - id: 2
              secret: 'item2-secret'
              password: 'item2-pass'
          "
        `);
      });

      test('should work with deeply nested exact paths', () => {
        expect(
          compactSnapshot(testData, {
            rejectKeys: ['user.settings.secret', 'user.settings.apiKey'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          secret: 'root-secret'
          password: 'root-password'

          user:
            name: 'John'
            secret: 'user-secret'
            password: 'user-password'
            settings:
              theme: 'dark'

          items:
            - id: 1
              secret: 'item1-secret'
              password: 'item1-pass'
            - id: 2
              secret: 'item2-secret'
              password: 'item2-pass'
          "
        `);
      });
    });

    describe('combined pattern types', () => {
      test('should apply multiple different pattern types together', () => {
        expect(
          compactSnapshot(testData, {
            rejectKeys: [
              'secret', // root only
              '*.password', // nested only
              '*Key', // global wildcard
              'user.settings.theme', // exact path
            ],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          password: 'root-password'

          user:
            name: 'John'
            secret: 'user-secret'
            settings:
              secret: 'settings-secret'
              apiKey: 'api-key'

          items:
            - id: 1
              secret: 'item1-secret'
            - id: 2
              secret: 'item2-secret'
          "
        `);
      });
    });

    describe('edge cases', () => {
      test('should handle empty patterns gracefully', () => {
        expect(
          compactSnapshot(testData, {
            rejectKeys: [],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          secret: 'root-secret'
          password: 'root-password'

          user:
            name: 'John'
            secret: 'user-secret'
            password: 'user-password'
            settings:
              secret: 'settings-secret'
              apiKey: 'api-key'
              theme: 'dark'

          items:
            - id: 1
              secret: 'item1-secret'
              password: 'item1-pass'
            - id: 2
              secret: 'item2-secret'
              password: 'item2-pass'
          "
        `);
      });

      test('should handle non-existent patterns gracefully', () => {
        expect(
          compactSnapshot(testData, {
            rejectKeys: ['nonExistent', '*.nonExistent', '*nonExistent'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          secret: 'root-secret'
          password: 'root-password'

          user:
            name: 'John'
            secret: 'user-secret'
            password: 'user-password'
            settings:
              secret: 'settings-secret'
              apiKey: 'api-key'
              theme: 'dark'

          items:
            - id: 1
              secret: 'item1-secret'
              password: 'item1-pass'
            - id: 2
              secret: 'item2-secret'
              password: 'item2-pass'
          "
        `);
      });

      test('should handle patterns with special characters', () => {
        const specialData = {
          'key.with.dots': 'value1',
          'key-with-dashes': 'value2',
          key_with_underscores: 'value3',
          nested: {
            'key.with.dots': 'nested-value1',
            'key-with-dashes': 'nested-value2',
          },
        };

        expect(
          compactSnapshot(specialData, {
            rejectKeys: ['key.with.dots', '*key-with-dashes'], // exact key name patterns
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          key_with_underscores: 'value3'

          nested:
            key.with.dots: 'nested-value1'
          "
        `);
      });
    });
  });

  describe('pattern matching with filterKeys integration', () => {
    const complexData = {
      publicInfo: {
        name: 'Company',
        description: 'A company',
      },
      sensitiveData: {
        secret: 'company-secret',
        apiKey: 'api-123',
        users: [
          { name: 'John', secret: 'john-secret', password: 'john-pass' },
          { name: 'Jane', secret: 'jane-secret', password: 'jane-pass' },
        ],
      },
      config: {
        secret: 'config-secret',
        theme: 'dark',
      },
    };

    test('should apply root-only rejectKeys within filterKeys matches', () => {
      expect(
        compactSnapshot(complexData, {
          filterKeys: ['sensitiveData'],
          rejectKeys: ['secret'], // root-only, should not affect nested
          collapseObjects: false,
        }),
      ).toMatchInlineSnapshot(`
        "
        sensitiveData:
          secret: 'company-secret'
          apiKey: 'api-123'
          users:
            - name: 'John'
              secret: 'john-secret'
              password: 'john-pass'
            - name: 'Jane'
              secret: 'jane-secret'
              password: 'jane-pass'
        "
      `);
    });

    test('should apply nested wildcard rejectKeys within filterKeys matches', () => {
      expect(
        compactSnapshot(complexData, {
          filterKeys: ['sensitiveData'],
          rejectKeys: ['*.secret', '*.password'], // nested-only
          collapseObjects: false,
        }),
      ).toMatchInlineSnapshot(`
        "
        sensitiveData:
          apiKey: 'api-123'
          users:
            - name: 'John'
            - name: 'Jane'
        "
      `);
    });

    test('should apply global wildcard rejectKeys within filterKeys matches', () => {
      expect(
        compactSnapshot(complexData, {
          filterKeys: ['sensitiveData'],
          rejectKeys: ['*secret', '*Key'], // global wildcards
          collapseObjects: false,
        }),
      ).toMatchInlineSnapshot(`
        "
        sensitiveData:
          apiKey: 'api-123'
          users:
            - name: 'John'
              password: 'john-pass'
            - name: 'Jane'
              password: 'jane-pass'
        "
      `);
    });
  });

  describe('filterKeys pattern matching', () => {
    const testData = {
      secret: 'root-secret',
      password: 'root-password',
      user: {
        name: 'John',
        secret: 'user-secret',
        password: 'user-password',
        settings: {
          secret: 'settings-secret',
          apiKey: 'api-key',
          theme: 'dark',
        },
      },
      items: [
        { id: 1, secret: 'item1-secret', password: 'item1-pass' },
        { id: 2, secret: 'item2-secret', password: 'item2-pass' },
      ],
    };

    describe('root-only patterns (e.g., "secret")', () => {
      test('should only include root-level properties', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['secret'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          secret: 'root-secret'
          "
        `);
      });

      test('should work with multiple root-only patterns', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['secret', 'password'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          secret: 'root-secret'
          password: 'root-password'
          "
        `);
      });
    });

    describe('nested wildcard patterns (e.g., "*.secret")', () => {
      test('should only include nested properties, not root ones', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['*.secret'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          user:
            secret: 'user-secret'

          items:
            - secret: 'item1-secret'
            - secret: 'item2-secret'
          "
        `);
      });

      test('should work with multiple nested wildcard patterns', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['*.secret', '*.password'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          user:
            secret: 'user-secret'
            password: 'user-password'

          items:
            - secret: 'item1-secret'
              password: 'item1-pass'
            - secret: 'item2-secret'
              password: 'item2-pass'
          "
        `);
      });
    });

    describe('global wildcard patterns (e.g., "*secret")', () => {
      test('should include properties named exactly "secret" at any level', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['*secret'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          secret: 'root-secret'
          "
        `);
      });

      test('should work with exact property name matching', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['*password', '*Key'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          password: 'root-password'
          "
        `);
      });
    });

    describe('exact path patterns (e.g., "user.secret")', () => {
      test('should only include exact path matches', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['user.secret'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          user:
            secret: 'user-secret'
          "
        `);
      });

      test('should work with deeply nested exact paths', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['user.settings.secret', 'user.settings.apiKey'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          user:
            settings:
              secret: 'settings-secret'
              apiKey: 'api-key'
          "
        `);
      });

      test('should include parent paths when filtering nested exact paths', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['user.name', 'items'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          user:
            name: 'John'

          items:
            - id: 1
              secret: 'item1-secret'
              password: 'item1-pass'
            - id: 2
              secret: 'item2-secret'
              password: 'item2-pass'
          "
        `);
      });
    });

    describe('combined pattern types', () => {
      test('should apply multiple different pattern types together', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: [
              'secret', // root only
              '*.password', // nested only
              '*Key', // global wildcard
              'user.settings.theme', // exact path
            ],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          secret: 'root-secret'
          password: 'root-password'

          user:
            password: 'user-password'
            settings:
              theme: 'dark'

          items:
            - password: 'item1-pass'
            - password: 'item2-pass'
          "
        `);
      });
    });

    describe('edge cases', () => {
      test('should handle empty patterns gracefully', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: [],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          {}
          "
        `);
      });

      test('should handle non-existent patterns gracefully', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['nonExistent', '*.nonExistent', '*nonExistent'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          secret: 'root-secret'
          password: 'root-password'
          user: {}

          items:
            - {}
            - {}
          "
        `);
      });
    });
  });

  describe('combined filterKeys and rejectKeys pattern matching', () => {
    const testData = {
      secret: 'root-secret',
      password: 'root-password',
      user: {
        name: 'John',
        secret: 'user-secret',
        password: 'user-password',
        settings: {
          secret: 'settings-secret',
          apiKey: 'api-key',
          theme: 'dark',
        },
      },
      items: [
        { id: 1, secret: 'item1-secret', password: 'item1-pass' },
        { id: 2, secret: 'item2-secret', password: 'item2-pass' },
      ],
    };

    test('should apply both root-only filterKeys and nested rejectKeys', () => {
      expect(
        compactSnapshot(testData, {
          filterKeys: ['user'], // root-only filter
          rejectKeys: ['*.password'], // nested-only reject
          collapseObjects: false,
        }),
      ).toMatchInlineSnapshot(`
        "
        user:
          name: 'John'
          secret: 'user-secret'
          settings:
            secret: 'settings-secret'
            apiKey: 'api-key'
            theme: 'dark'
        "
      `);
    });

    test('should apply nested wildcard filterKeys and global wildcard rejectKeys', () => {
      expect(
        compactSnapshot(testData, {
          filterKeys: ['*.secret'], // nested-only filter
          rejectKeys: ['*settings*'], // global wildcard reject
          collapseObjects: false,
        }),
      ).toMatchInlineSnapshot(`
        "
        secret: 'root-secret'
        password: 'root-password'

        user:
          secret: 'user-secret'

        items:
          - secret: 'item1-secret'
          - secret: 'item2-secret'
        "
      `);
    });

    test('should apply exact path filterKeys and root-only rejectKeys', () => {
      expect(
        compactSnapshot(testData, {
          filterKeys: ['user.settings'], // exact path filter
          rejectKeys: ['secret'], // root-only reject (shouldn't affect nested)
          collapseObjects: false,
        }),
      ).toMatchInlineSnapshot(`
        "
        user:
          settings:
            secret: 'settings-secret'
            apiKey: 'api-key'
            theme: 'dark'
        "
      `);
    });

    test('should handle complex combinations of all pattern types', () => {
      expect(
        compactSnapshot(testData, {
          filterKeys: [
            'secret', // root-only
            '*.name', // nested wildcard
            '*Key', // global wildcard
            'items', // exact path (includes all of items)
          ],
          rejectKeys: [
            '*.password', // nested wildcard reject
            'user.settings.theme', // exact path reject
          ],
          collapseObjects: false,
        }),
      ).toMatchInlineSnapshot(`
        "
        secret: 'root-secret'
        password: 'root-password'

        user:
          name: 'John'

        items:
          - id: 1
            secret: 'item1-secret'
          - id: 2
            secret: 'item2-secret'
        "
      `);
    });
  });

  describe('array pattern matching', () => {
    const testData = {
      items: [
        {
          id: 1,
          name: 'Item 1',
          secret: 'secret1',
          metadata: { version: 1, public: true },
        },
        {
          id: 2,
          name: 'Item 2',
          secret: 'secret2',
          metadata: { version: 2, public: false },
        },
        {
          id: 3,
          name: 'Item 3',
          secret: 'secret3',
          metadata: { version: 3, public: true },
        },
      ],
      users: [
        {
          name: 'John',
          password: 'pass1',
          settings: { theme: 'dark', notifications: true },
        },
        {
          name: 'Jane',
          password: 'pass2',
          settings: { theme: 'light', notifications: false },
        },
      ],
      config: {
        values: ['a', 'b', 'c', 'd'],
        nested: {
          data: [{ key: 'value1' }, { key: 'value2' }],
        },
      },
    };

    describe('single array index patterns', () => {
      test('should filter specific array index - items[0]', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['items[0]'],
          }),
        ).toMatchInlineSnapshot(`
          "
          items:
            - id: 1
              name: 'Item 1'
              secret: 'secret1'
              metadata: { version: 1, public: '✅' }
          "
        `);
      });

      test('should reject specific array index - items[1]', () => {
        expect(
          compactSnapshot(testData, {
            rejectKeys: ['items[1]'],
          }),
        ).toMatchInlineSnapshot(`
          "
          items:
            - id: 1
              name: 'Item 1'
              secret: 'secret1'
              metadata: { version: 1, public: '✅' }
            - id: 3
              name: 'Item 3'
              secret: 'secret3'
              metadata: { version: 3, public: '✅' }
          users:
            - name: 'John'
              password: 'pass1'
              settings: { theme: 'dark', notifications: '✅' }
            - name: 'Jane'
              password: 'pass2'
              settings: { theme: 'light', notifications: '❌' }

          config:
            values: ['a', 'b', 'c', 'd']
            nested:
              data:
                - key: 'value1'
                - key: 'value2'
          "
        `);
      });
    });

    describe('array wildcard patterns', () => {
      test('should filter all array items - items[*]', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['items[*]'],
          }),
        ).toMatchInlineSnapshot(`
          "
          items:
            - id: 1
              name: 'Item 1'
              secret: 'secret1'
              metadata: { version: 1, public: '✅' }
            - id: 2
              name: 'Item 2'
              secret: 'secret2'
              metadata: { version: 2, public: '❌' }
            - id: 3
              name: 'Item 3'
              secret: 'secret3'
              metadata: { version: 3, public: '✅' }
          "
        `);
      });

      test('should reject all array items - items[*]', () => {
        expect(
          compactSnapshot(testData, {
            rejectKeys: ['items[*]'],
          }),
        ).toMatchInlineSnapshot(`
          "
          items: []
          users:
            - name: 'John'
              password: 'pass1'
              settings: { theme: 'dark', notifications: '✅' }
            - name: 'Jane'
              password: 'pass2'
              settings: { theme: 'light', notifications: '❌' }

          config:
            values: ['a', 'b', 'c', 'd']
            nested:
              data:
                - key: 'value1'
                - key: 'value2'
          "
        `);
      });
    });

    describe('array range patterns', () => {
      test('should filter array range - items[0-1]', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['items[0-1]'],
          }),
        ).toMatchInlineSnapshot(`
          "
          items:
            - id: 1
              name: 'Item 1'
              secret: 'secret1'
              metadata: { version: 1, public: '✅' }
            - id: 2
              name: 'Item 2'
              secret: 'secret2'
              metadata: { version: 2, public: '❌' }
          "
        `);
      });

      test('should reject array range - users[0-1]', () => {
        expect(
          compactSnapshot(testData, {
            rejectKeys: ['users[0-1]'],
          }),
        ).toMatchInlineSnapshot(`
          "
          items:
            - id: 1
              name: 'Item 1'
              secret: 'secret1'
              metadata: { version: 1, public: '✅' }
            - id: 2
              name: 'Item 2'
              secret: 'secret2'
              metadata: { version: 2, public: '❌' }
            - id: 3
              name: 'Item 3'
              secret: 'secret3'
              metadata: { version: 3, public: '✅' }
          users: []

          config:
            values: ['a', 'b', 'c', 'd']
            nested:
              data:
                - key: 'value1'
                - key: 'value2'
          "
        `);
      });
    });

    describe('array with nested property patterns', () => {
      test('should filter nested property in specific array index - items[0].name', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['items[0].name'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          items:
            - name: 'Item 1'
          "
        `);
      });

      test('should filter nested property in all array items - users[*].name', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['users[*].name'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          users:
            - name: 'John'
            - name: 'Jane'
          "
        `);
      });

      test('should reject nested property in array range - items[0-1].secret', () => {
        expect(
          compactSnapshot(testData, {
            rejectKeys: ['items[0-1].secret'],
          }),
        ).toMatchInlineSnapshot(`
          "
          items:
            - id: 1
              name: 'Item 1'
              metadata: { version: 1, public: '✅' }
            - id: 2
              name: 'Item 2'
              metadata: { version: 2, public: '❌' }
            - id: 3
              name: 'Item 3'
              secret: 'secret3'
              metadata: { version: 3, public: '✅' }
          users:
            - name: 'John'
              password: 'pass1'
              settings: { theme: 'dark', notifications: '✅' }
            - name: 'Jane'
              password: 'pass2'
              settings: { theme: 'light', notifications: '❌' }

          config:
            values: ['a', 'b', 'c', 'd']
            nested:
              data:
                - key: 'value1'
                - key: 'value2'
          "
        `);
      });
    });

    describe('array with wildcard nested property patterns', () => {
      test('should filter wildcard property in all array items - items[*]*secret', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['items[*]*secret'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          items:
            - secret: 'secret1'
            - secret: 'secret2'
            - secret: 'secret3'
          "
        `);
      });

      test('should reject wildcard property in all array items - users[*]*password', () => {
        expect(
          compactSnapshot(testData, {
            rejectKeys: ['users[*]*password'],
          }),
        ).toMatchInlineSnapshot(`
          "
          items:
            - id: 1
              name: 'Item 1'
              secret: 'secret1'
              metadata: { version: 1, public: '✅' }
            - id: 2
              name: 'Item 2'
              secret: 'secret2'
              metadata: { version: 2, public: '❌' }
            - id: 3
              name: 'Item 3'
              secret: 'secret3'
              metadata: { version: 3, public: '✅' }
          users:
            - name: 'John'
              settings: { theme: 'dark', notifications: '✅' }
            - name: 'Jane'
              settings: { theme: 'light', notifications: '❌' }

          config:
            values: ['a', 'b', 'c', 'd']
            nested:
              data:
                - key: 'value1'
                - key: 'value2'
          "
        `);
      });
    });

    describe('deeply nested array patterns', () => {
      test('should filter nested array with specific index - config.nested.data[0]', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['config.nested.data[0]'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          config:
            nested:
              data:
                - key: 'value1'
          "
        `);
      });

      test('should filter nested array with wildcard - config.nested.data[*].key', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['config.nested.data[*].key'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          config:
            nested:
              data:
                - key: 'value1'
                - key: 'value2'
          "
        `);
      });
    });

    describe('open-ended range patterns', () => {
      test('should filter from index to end - items[1-*]', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['items[1-*]'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          items:
            - id: 2
              name: 'Item 2'
              secret: 'secret2'
              metadata:
                version: 2
                public: '❌'
            - id: 3
              name: 'Item 3'
              secret: 'secret3'
              metadata:
                version: 3
                public: '✅'
          "
        `);
      });

      test('should reject from index to end - users[1-*]', () => {
        expect(
          compactSnapshot(testData, {
            rejectKeys: ['users[1-*]'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          items:
            - id: 1
              name: 'Item 1'
              secret: 'secret1'
              metadata:
                version: 1
                public: '✅'
            - id: 2
              name: 'Item 2'
              secret: 'secret2'
              metadata:
                version: 2
                public: '❌'
            - id: 3
              name: 'Item 3'
              secret: 'secret3'
              metadata:
                version: 3
                public: '✅'
          users:
            - name: 'John'
              password: 'pass1'
              settings:
                theme: 'dark'
                notifications: '✅'

          config:
            values: ['a', 'b', 'c', 'd']
            nested:
              data:
                - key: 'value1'
                - key: 'value2'
          "
        `);
      });

      test('should combine open-ended range with property filters - items[1-*].name', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['items[1-*].name'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          items:
            - name: 'Item 2'
            - name: 'Item 3'
          "
        `);
      });

      test('should filter from index n to end - items[2-*]', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['items[2-*]'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          items:
            - id: 3
              name: 'Item 3'
              secret: 'secret3'
              metadata:
                version: 3
                public: '✅'
          "
        `);
      });

      test('should handle out-of-bounds range - items[5-*]', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['items[5-*]'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          items: []
          "
        `);
      });

      test('should work with nested arrays - config.nested.data[1-*].key', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['config.nested.data[1-*].key'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          config:
            nested:
              data:
                - key: 'value2'
          "
        `);
      });
    });

    describe('combined patterns with arrays', () => {
      test('should combine root filter with array pattern rejection', () => {
        expect(
          compactSnapshot(testData, {
            filterKeys: ['items'],
            rejectKeys: ['items[1]', 'items[*].secret'],
            collapseObjects: false,
          }),
        ).toMatchInlineSnapshot(`
          "
          items:
            - id: 1
              name: 'Item 1'
              metadata:
                version: 1
                public: '✅'
            - id: 3
              name: 'Item 3'
              metadata:
                version: 3
                public: '✅'
          "
        `);
      });
    });
  });

  describe('nested wildcard property patterns', () => {
    const testData = {
      user: {
        profile: {
          name: 'John',
          secret: 'user-secret',
          settings: {
            theme: 'dark',
            secret: 'settings-secret',
            notifications: true,
          },
        },
        auth: {
          token: 'token123',
          secret: 'auth-secret',
        },
      },
      admin: {
        permissions: {
          read: true,
          write: false,
          secret: 'permission-secret',
        },
      },
    };

    test('should filter nested wildcard property - user.*secret', () => {
      expect(
        compactSnapshot(testData, {
          filterKeys: ['user.*secret'],
          collapseObjects: false,
        }),
      ).toMatchInlineSnapshot(`
        "
        user:
          profile:
            secret: 'user-secret'
            settings:
              secret: 'settings-secret'
          auth:
            secret: 'auth-secret'
        "
      `);
    });

    test('should reject nested wildcard property - admin.*secret', () => {
      expect(
        compactSnapshot(testData, {
          rejectKeys: ['admin.*secret'],
          collapseObjects: false,
        }),
      ).toMatchInlineSnapshot(`
        "
        user:
          profile:
            name: 'John'
            secret: 'user-secret'
            settings:
              theme: 'dark'
              secret: 'settings-secret'
              notifications: '✅'
          auth:
            token: 'token123'
            secret: 'auth-secret'

        admin:
          permissions:
            read: '✅'
            write: '❌'
        "
      `);
    });

    test('should handle multiple nested wildcard patterns', () => {
      expect(
        compactSnapshot(testData, {
          filterKeys: ['user.*secret', 'admin.*read'],
          collapseObjects: false,
        }),
      ).toMatchInlineSnapshot(`
        "
        user:
          profile:
            secret: 'user-secret'
            settings:
              secret: 'settings-secret'
          auth:
            secret: 'auth-secret'

        admin:
          permissions:
            read: '✅'
        "
      `);
    });
  });

  describe('complex combined pattern scenarios', () => {
    const complexData = {
      teams: [
        {
          name: 'Frontend',
          members: [
            { name: 'Alice', secret: 'alice-secret', role: 'lead' },
            { name: 'Bob', secret: 'bob-secret', role: 'dev' },
          ],
          config: {
            secret: 'team-secret',
            public: true,
          },
        },
        {
          name: 'Backend',
          members: [
            { name: 'Carol', secret: 'carol-secret', role: 'lead' },
            { name: 'Dave', secret: 'dave-secret', role: 'dev' },
          ],
          config: {
            secret: 'backend-secret',
            public: false,
          },
        },
      ],
    };

    test('should handle complex array and wildcard combination - teams[0].*secret', () => {
      expect(
        compactSnapshot(complexData, {
          rejectKeys: ['teams[0].*secret'],
          collapseObjects: false,
        }),
      ).toMatchInlineSnapshot(`
        "
        teams:
          - name: 'Frontend'
            members:
              - name: 'Alice'
                secret: 'alice-secret'
                role: 'lead'
              - name: 'Bob'
                secret: 'bob-secret'
                role: 'dev'
            config:
              public: '✅'
          - name: 'Backend'
            members:
              - name: 'Carol'
                secret: 'carol-secret'
                role: 'lead'
              - name: 'Dave'
                secret: 'dave-secret'
                role: 'dev'
            config:
              secret: 'backend-secret'
              public: '❌'
        "
      `);
    });

    test('should handle deeply nested array patterns - teams[*].members[0].name', () => {
      expect(
        compactSnapshot(complexData, {
          filterKeys: ['teams[*].members[0].name'],
          collapseObjects: false,
        }),
      ).toMatchInlineSnapshot(`
        "
        teams:
          - members:
              - name: 'Alice'
          - members:
              - name: 'Carol'
        "
      `);
    });

    test('should handle mixed array indices and wildcards - teams[0-1].members[*]*secret', () => {
      expect(
        compactSnapshot(complexData, {
          rejectKeys: ['teams[0-1].members[*]*secret'],
        }),
      ).toMatchInlineSnapshot(`
        "
        teams:
          - name: 'Frontend'
            members:
              - { name: 'Alice', role: 'lead' }
              - { name: 'Bob', role: 'dev' }
            config: { secret: 'team-secret', public: '✅' }
          - name: 'Backend'
            members:
              - { name: 'Carol', role: 'lead' }
              - { name: 'Dave', role: 'dev' }
            config: { secret: 'backend-secret', public: '❌' }
        "
      `);
    });
  });

  describe('circular references with key filtering', () => {
    test('should throw when circular key is not rejected', () => {
      const obj: any = {
        name: 'John',
        password: 'secret123',
        active: true,
      };
      obj.self = obj;

      // 'self' creates the circular reference but is not rejected, so should throw
      expect(() => compactSnapshot(obj, { rejectKeys: ['password'] })).toThrow(
        'Circular reference detected in object during key filtering',
      );
    });

    test('should not throw when the circular reference key itself gets rejected', () => {
      const obj: any = {
        name: 'John',
        active: true,
      };
      obj.circular = obj;

      // The key that creates the circular reference ('circular') is rejected, so no traversal occurs
      expect(compactSnapshot(obj, { rejectKeys: ['circular'] }))
        .toMatchInlineSnapshot(`
          "
          name: 'John'
          active: '✅'
          "
        `);
    });

    test('should handle circular references with filterKeys when circular key is included', () => {
      const obj: any = {
        name: 'John',
        password: 'secret123',
        active: true,
      };
      obj.self = obj;

      // Include the circular key in filter, so it gets traversed and detected
      expect(() =>
        compactSnapshot(obj, { filterKeys: ['name', 'active', 'self'] }),
      ).toThrow('Circular reference detected in object during key filtering');
    });

    test('should not throw when circular key gets filtered out', () => {
      const obj: any = {
        name: 'John',
        active: true,
      };
      obj.circular = obj;

      // Since 'circular' is not in filterKeys, it gets filtered out before circular detection
      expect(compactSnapshot(obj, { filterKeys: ['name', 'active'] }))
        .toMatchInlineSnapshot(`
          "
          name: 'John'
          active: '✅'
          "
        `);
    });

    test('should handle circular references in nested structures when circular path is included', () => {
      const data: any = {
        user: {
          name: 'John',
          profile: {
            email: 'john@example.com',
            active: true,
          },
        },
      };
      data.user.profile.backRef = data;

      // Include the circular path, so it gets traversed and detected
      expect(() =>
        compactSnapshot(data, {
          filterKeys: [
            'user.name',
            'user.profile.email',
            'user.profile.backRef',
          ],
        }),
      ).toThrow('Circular reference detected in object during key filtering');
    });

    test('should not throw when nested circular reference key gets rejected', () => {
      const data: any = {
        user: {
          name: 'John',
          profile: {
            email: 'john@example.com',
            active: true,
          },
        },
      };
      data.user.profile.backRef = data;

      // The circular path gets rejected, so no circular traversal occurs
      expect(compactSnapshot(data, { rejectKeys: ['user.profile.backRef'] }))
        .toMatchInlineSnapshot(`
          "
          user:
            name: 'John'
            profile: { email: 'john@example.com', active: '✅' }
          "
        `);
    });

    test('should handle circular references in arrays with key filtering', () => {
      const arr: any[] = [{ name: 'John', password: 'secret', active: true }];
      arr.push(arr);

      expect(() =>
        compactSnapshot({ users: arr }, { rejectKeys: ['*.password'] }),
      ).toThrow('Circular reference detected in array during key filtering');
    });
  });
});
