import { describe, expect, test } from 'vitest';
import { filterObjectOrArrayKeys } from './filterObjectOrArrayKeys';
import { yamlStringify } from './yamlStringify';

function getSnapshot(data: any) {
  return `\n${yamlStringify(data, {
    collapseObjects: true,
  })}`;
}

describe('object key sorting', () => {
  test('should preserve original order when no sorting is specified', () => {
    const data = {
      zebra: 'animal',
      apple: 'fruit',
      carrot: 'vegetable',
      banana: 'fruit',
    };

    // No sorting specified - should preserve original order
    expect(getSnapshot(filterObjectOrArrayKeys(data, {})))
      .toMatchInlineSnapshot(`
      "
      zebra: 'animal'
      apple: 'fruit'
      carrot: 'vegetable'
      banana: 'fruit'
      "
    `);
  });

  test('should sort keys in ascending order', () => {
    const data = {
      zebra: 'animal',
      apple: 'fruit',
      carrot: 'vegetable',
      banana: 'fruit',
    };

    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          sortKeys: 'asc',
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      apple: 'fruit'
      banana: 'fruit'
      carrot: 'vegetable'
      zebra: 'animal'
      "
    `);
  });

  test('should sort keys in descending order', () => {
    const data = {
      zebra: 'animal',
      apple: 'fruit',
      carrot: 'vegetable',
      banana: 'fruit',
    };

    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          sortKeys: 'desc',
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      zebra: 'animal'
      carrot: 'vegetable'
      banana: 'fruit'
      apple: 'fruit'
      "
    `);
  });

  test('should sort keys with simpleValuesFirst', () => {
    const data = {
      complexObject: { nested: { deep: 'value' } },
      simpleString: 'text',
      emptyArray: [],
      numberValue: 42,
      primitiveArray: [1, 2, 3],
      complexArray: [{ id: 1 }, { id: 2 }],
      anotherString: 'more text',
    };

    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          sortKeys: 'simpleValuesFirst',
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      emptyArray: []
      complexArray:
        - id: 1
        - id: 2
      primitiveArray: [1, 2, 3]

      complexObject:
        nested: { deep: 'value' }

      numberValue: 42
      anotherString: 'more text'
      simpleString: 'text'
      "
    `);
  });

  test('should sort keys by pattern priority', () => {
    const data = {
      description: 'A sample object',
      id: 123,
      metadata: { version: '1.0', author: 'test' },
      name: 'Sample',
      status: 'active',
    };

    // Priority: name first, then id, then everything else
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          sortPatterns: ['name', 'id'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      name: 'Sample'
      id: 123
      description: 'A sample object'
      metadata: { version: '1.0', author: 'test' }
      status: 'active'
      "
    `);
  });

  test('should combine pattern sorting with general sorting', () => {
    const data = {
      zebra: 'animal',
      id: 123,
      apple: 'fruit',
      name: 'Sample',
      carrot: 'vegetable',
    };

    // Pattern priority for name and id, then sort others alphabetically
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          sortKeys: 'asc',
          sortPatterns: ['name', 'id'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      name: 'Sample'
      id: 123
      apple: 'fruit'
      carrot: 'vegetable'
      zebra: 'animal'
      "
    `);
  });

  test('should handle wildcard patterns in sorting', () => {
    const data = {
      user: {
        profile: { name: 'John', age: 30 },
        settings: { theme: 'dark', lang: 'en' },
        preferences: { notifications: true },
      },
    };

    // Sort nested properties: profile properties first, then everything else
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          sortPatterns: ['user.profile.*'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      user:
        profile: { name: 'John', age: 30 }
        settings: { theme: 'dark', lang: 'en' }
        preferences: { notifications: true }
      "
    `);
  });

  test('should handle nested object sorting', () => {
    const data = {
      parent: {
        zebra: 'last',
        apple: 'first',
        banana: 'middle',
      },
      otherKey: 'value',
    };

    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          sortKeys: 'asc',
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      otherKey: 'value'
      parent: { apple: 'first', banana: 'middle', zebra: 'last' }
      "
    `);
  });

  test('should handle array of objects sorting', () => {
    const data = {
      users: [
        { zebra: 'z', apple: 'a', banana: 'b' },
        { carrot: 'c', dog: 'd', elephant: 'e' },
      ],
    };

    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          sortKeys: 'asc',
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      users:
        - { apple: 'a', banana: 'b', zebra: 'z' }
        - { carrot: 'c', dog: 'd', elephant: 'e' }
      "
    `);
  });

  test('should handle complex pattern matching for sorting', () => {
    const data = {
      config: {
        database: { host: 'localhost', port: 5432 },
        api: { version: 'v1', timeout: 30 },
        cache: { ttl: 3600, enabled: true },
      },
    };

    // Prioritize database config, then api config
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          sortPatterns: ['config.database', 'config.api'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      config:
        database: { host: 'localhost', port: 5432 }
        api: { version: 'v1', timeout: 30 }
        cache: { ttl: 3600, enabled: true }
      "
    `);
  });

  test('should handle sorting with filtering', () => {
    const data = {
      users: [
        { name: 'John', role: 'admin', zebra: 'z', apple: 'a' },
        { name: 'Jane', role: 'user', carrot: 'c', banana: 'b' },
      ],
    };

    // Filter admin users and sort their keys alphabetically
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: ['users[%role="admin"]'],
          sortKeys: 'asc',
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      users:
        - { apple: 'a', name: 'John', role: 'admin', zebra: 'z' }
      "
    `);
  });

  test('should handle pattern expansion with sorting', () => {
    const data = {
      config: {
        prod: { host: 'prod.example.com', zebra: 'z', apple: 'a' },
        staging: { host: 'staging.example.com', banana: 'b', carrot: 'c' },
      },
    };

    // Use pattern expansion and sorting
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: ['config.(prod|staging)'],
          sortKeys: 'asc',
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      config:
        prod: { apple: 'a', host: 'prod.example.com', zebra: 'z' }
        staging: { banana: 'b', carrot: 'c', host: 'staging.example.com' }
      "
    `);
  });
});
