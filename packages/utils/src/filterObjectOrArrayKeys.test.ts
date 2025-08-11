import { describe, expect, test } from 'vitest';
import { filterObjectOrArrayKeys } from './filterObjectOrArrayKeys';
import { yamlStringify } from './yamlStringify';

function getSnapshot(data: any) {
  return `\n${yamlStringify(data, {
    collapseObjects: true,
  })}`;
}

describe('rejectKeys functionality', () => {
  test('should reject simple keys', () => {
    const data = {
      name: 'John',
      password: 'secret',
      email: 'john@example.com',
      age: 30,
    };
    expect(
      getSnapshot(filterObjectOrArrayKeys(data, { rejectKeys: ['password'] })),
    ).toMatchInlineSnapshot(`
      "
      age: 30
      email: 'john@example.com'
      name: 'John'
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
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          rejectKeys: ['user.credentials.password', 'user.profile.age'],
        }),
      ),
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
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, { rejectKeys: ['*.password'] }),
      ),
    ).toMatchInlineSnapshot(`
      "
      admin: { name: 'Admin' }
      settings: { theme: 'dark' }
      user1: { name: 'John' }
      user2: { name: 'Jane' }
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

    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, { rejectKeys: ['*.password'] }),
      ),
    ).toMatchInlineSnapshot(`
      "
      users:
        - { active: true, name: 'John' }
        - { active: false, name: 'Jane' }
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
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: ['name', 'email', 'active'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      active: true
      email: 'john@example.com'
      name: 'John'
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
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: [
            'user.name',
            'user.profile.email',
            'user.profile.active',
          ],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      user:
        name: 'John'
        profile: { active: true, email: 'john@example.com' }
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
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: [
            'user.name',
            'user.password',
            'user.email',
            'user.active',
          ],
          rejectKeys: ['user.password'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      user: { active: true, email: 'john@example.com', name: 'John' }
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
      },
    };

    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: ['user'],
          rejectKeys: ['*.password', '*.apiKey'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      user:
        email: 'john@example.com'
        name: 'John'
        settings: { notifications: true, theme: 'dark' }
      "
    `);
  });
});

describe('array filtering', () => {
  test('should filter array items by index', () => {
    const data = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
      { name: 'Bob', age: 35 },
    ];
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, { filterKeys: ['[0]', '[2]'] }),
      ),
    ).toMatchInlineSnapshot(`
      "
      - { age: 30, name: 'John' }
      - { age: 35, name: 'Bob' }
      "
    `);
  });

  test('should filter array items with range notation', () => {
    const data = [
      { name: 'Item1' },
      { name: 'Item2' },
      { name: 'Item3' },
      { name: 'Item4' },
      { name: 'Item5' },
    ];
    expect(
      getSnapshot(filterObjectOrArrayKeys(data, { filterKeys: ['[1-3]'] })),
    ).toMatchInlineSnapshot(`
      "
      - name: 'Item2'
      - name: 'Item3'
      - name: 'Item4'
      "
    `);
  });

  test('should filter array items with open-ended range', () => {
    const data = [
      { name: 'Item1' },
      { name: 'Item2' },
      { name: 'Item3' },
      { name: 'Item4' },
      { name: 'Item5' },
    ];
    expect(
      getSnapshot(filterObjectOrArrayKeys(data, { filterKeys: ['[2-*]'] })),
    ).toMatchInlineSnapshot(`
      "
      - name: 'Item3'
      - name: 'Item4'
      - name: 'Item5'
      "
    `);
  });

  test('should filter properties of all array items', () => {
    const data = [
      { name: 'John', age: 30, password: 'secret1' },
      { name: 'Jane', age: 25, password: 'secret2' },
      { name: 'Bob', age: 35, password: 'secret3' },
    ];
    expect(
      getSnapshot(filterObjectOrArrayKeys(data, { filterKeys: ['[*].name'] })),
    ).toMatchInlineSnapshot(`
      "
      - name: 'John'
      - name: 'Jane'
      - name: 'Bob'
      "
    `);
  });

  test('should reject properties from all array items', () => {
    const data = [
      { name: 'John', age: 30, password: 'secret1' },
      { name: 'Jane', age: 25, password: 'secret2' },
      { name: 'Bob', age: 35, password: 'secret3' },
    ];
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, { rejectKeys: ['[*].password'] }),
      ),
    ).toMatchInlineSnapshot(`
      "
      - { age: 30, name: 'John' }
      - { age: 25, name: 'Jane' }
      - { age: 35, name: 'Bob' }
      "
    `);
  });

  test('should filter nested arrays', () => {
    const data = {
      users: [
        { name: 'John', posts: [{ title: 'Post1' }, { title: 'Post2' }] },
        { name: 'Jane', posts: [{ title: 'Post3' }, { title: 'Post4' }] },
      ],
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: ['users[0].posts[0].title'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      users:
        - posts:
            - title: 'Post1'
      "
    `);
  });
});

describe('advanced wildcard patterns', () => {
  test('should filter with complex nested wildcard patterns', () => {
    const data = {
      section1: {
        items: [
          { name: 'Item1', details: { secret: 'hidden1', public: 'visible1' } },
          { name: 'Item2', details: { secret: 'hidden2', public: 'visible2' } },
        ],
      },
      section2: {
        items: [
          { name: 'Item3', details: { secret: 'hidden3', public: 'visible3' } },
        ],
      },
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          rejectKeys: ['*.items[*].details.secret'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      section1:
        items:
          - name: 'Item1'
            details: { public: 'visible1' }
          - name: 'Item2'
            details: { public: 'visible2' }

      section2:
        items:
          - name: 'Item3'
            details: { public: 'visible3' }
      "
    `);
  });

  test('should filter with multiple wildcard levels', () => {
    const data = {
      users: {
        john: { profile: { name: 'John', age: 30 } },
        jane: { profile: { name: 'Jane', age: 25 } },
      },
      admins: {
        admin1: { profile: { name: 'Admin1', age: 40 } },
      },
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, { filterKeys: ['*.*.profile.name'] }),
      ),
    ).toMatchInlineSnapshot(`
      "
      admins:
        admin1:
          profile: { name: 'Admin1' }

      users:
        jane:
          profile: { name: 'Jane' }
        john:
          profile: { name: 'John' }
      "
    `);
  });

  test('should handle wildcard at different positions', () => {
    const data = {
      user: {
        profile: { name: 'John', age: 30 },
        settings: { theme: 'dark', notifications: true },
        settings2: { theme: 'dark', notifications: true, obj: { name: 'obj' } },
      },
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, { filterKeys: ['user.**name'] }),
      ),
    ).toMatchInlineSnapshot(`
      "
      user:
        profile: { name: 'John' }
        settings2:
          obj: { name: 'obj' }
      "
    `);
  });

  test('should filter with test.*.prop pattern', () => {
    const data = {
      test: {
        section1: { prop: 'value1', other: 'data1' },
        section2: { prop: 'value2', other: 'data2' },
        section3: { other: 'data3' },
      },
      other: {
        section1: { prop: 'should-not-match', other: 'data4' },
      },
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, { filterKeys: ['test.*.prop'] }),
      ),
    ).toMatchInlineSnapshot(`
      "
      test:
        section1: { prop: 'value1' }
        section2: { prop: 'value2' }
      "
    `);
  });

  test('should filter with test.*.test.**prop pattern', () => {
    const data = {
      test: {
        section1: {
          test: {
            level1: { prop: 'deep1', other: 'data1' },
            level2: { nested: { prop: 'deep2' }, other: 'data2' },
          },
          other: { prop: 'should-not-match' },
        },
        section2: {
          test: {
            level1: { prop: 'deep3', other: 'data3' },
          },
          other: { prop: 'should-not-match' },
        },
      },
      other: {
        section1: {
          test: { prop: 'should-not-match' },
        },
      },
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, { filterKeys: ['test.*.test.**prop'] }),
      ),
    ).toMatchInlineSnapshot(`
      "
      test:
        section1:
          test:
            level1: { prop: 'deep1' }
            level2:
              nested: { prop: 'deep2' }
        section2:
          test:
            level1: { prop: 'deep3' }
      "
    `);
  });
});

describe('edge cases and error handling', () => {
  test('should handle empty objects', () => {
    const data = {};
    expect(getSnapshot(filterObjectOrArrayKeys(data, { filterKeys: ['name'] })))
      .toMatchInlineSnapshot(`
        "
        {}
        "
      `);
  });

  test('should handle empty arrays', () => {
    const data: any[] = [];
    expect(getSnapshot(filterObjectOrArrayKeys(data, { filterKeys: ['[0]'] })))
      .toMatchInlineSnapshot(`
        "
        []
        "
      `);
  });

  test('should handle null and undefined values', () => {
    const data = {
      name: 'John',
      nullable: null,
      undefined,
      age: 30,
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: ['name', 'nullable', 'undefined'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      name: 'John'
      nullable: null
      "
    `);
  });

  test('should handle non-existent keys gracefully', () => {
    const data = { name: 'John', age: 30 };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: ['name', 'nonexistent'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      name: 'John'
      "
    `);
  });

  test('should handle array index out of bounds', () => {
    const data = [{ name: 'Item1' }, { name: 'Item2' }];
    expect(getSnapshot(filterObjectOrArrayKeys(data, { filterKeys: ['[5]'] })))
      .toMatchInlineSnapshot(`
        "
        []
        "
      `);
  });

  test('should handle deeply nested structures', () => {
    const data = {
      level1: {
        level2: {
          level3: {
            level4: {
              value: 'deep value',
              other: 'other value',
            },
          },
        },
      },
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: ['level1.level2.level3.level4.value'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      level1:
        level2:
          level3:
            level4: { value: 'deep value' }
      "
    `);
  });
});

describe('rejectEmptyObjectsInArray option', () => {
  test('should keep empty objects when rejectEmptyObjectsInArray is false', () => {
    const data = {
      users: [{ test: 'John' }, { name: 'Jane' }],
    };

    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: ['users[*].name'],
          rejectEmptyObjectsInArray: false,
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      users:
        - {}
        - name: 'Jane'
      "
    `);
  });

  test('should remove empty objects from array using filterKeys', () => {
    const data = {
      users: [{ test: 'John' }, { name: 'Jane' }],
    };

    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, { filterKeys: ['users[*].name'] }),
      ),
    ).toMatchInlineSnapshot(`
      "
      users:
        - name: 'Jane'
      "
    `);
  });

  test('should remove empty objects from array using rejectKeys', () => {
    const data = {
      users: [{ test: 'John' }, { name: 'Jane' }],
    };

    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, { rejectKeys: ['users[*].test'] }),
      ),
    ).toMatchInlineSnapshot(`
      "
      users:
        - name: 'Jane'
      "
    `);
  });
});

describe('string parameter handling', () => {
  test('should accept single string for filterKeys', () => {
    const data = { name: 'John', age: 30, email: 'john@example.com' };
    expect(getSnapshot(filterObjectOrArrayKeys(data, { filterKeys: 'name' })))
      .toMatchInlineSnapshot(`
        "
        name: 'John'
        "
      `);
  });

  test('should accept single string for rejectKeys', () => {
    const data = { name: 'John', age: 30, password: 'secret' };
    expect(
      getSnapshot(filterObjectOrArrayKeys(data, { rejectKeys: 'password' })),
    ).toMatchInlineSnapshot(`
      "
      age: 30
      name: 'John'
      "
    `);
  });
});

describe('complex mixed scenarios', () => {
  test('should handle complex object with arrays and mixed filtering', () => {
    const data = {
      users: [
        {
          id: 1,
          name: 'John',
          password: 'secret1',
          roles: ['admin', 'user'],
          profile: {
            email: 'john@example.com',
            settings: { theme: 'dark', notifications: true },
          },
        },
        {
          id: 2,
          name: 'Jane',
          password: 'secret2',
          roles: ['user'],
          profile: {
            email: 'jane@example.com',
            settings: { theme: 'light', notifications: false },
          },
        },
      ],
      metadata: {
        version: '1.0',
        debug: true,
      },
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: [
            'users[*].name',
            'users[*].profile.email',
            'metadata.version',
          ],
          rejectKeys: ['users[*].password'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      metadata: { version: '1.0' }
      users:
        - name: 'John'
          profile: { email: 'john@example.com' }
        - name: 'Jane'
          profile: { email: 'jane@example.com' }
      "
    `);
  });

  test('should handle filtering with partial array ranges and wildcards', () => {
    const data = {
      sections: [
        {
          items: [
            { name: 'A1', value: 1 },
            { name: 'A2', value: 2 },
          ],
        },
        {
          items: [
            { name: 'B1', value: 3 },
            { name: 'B2', value: 4 },
          ],
        },
        {
          items: [
            { name: 'C1', value: 5 },
            { name: 'C2', value: 6 },
          ],
        },
      ],
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: ['sections[0-1].items[*].name'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      sections:
        - items:
            - name: 'A1'
            - name: 'A2'
        - items:
            - name: 'B1'
            - name: 'B2'
      "
    `);
  });
});

test('do not filter non plain objects', () => {
  class MyClass {
    name = 'John';
    age = 30;
  }
  const date = new Date('2025-08-09T23:40:31.349Z');
  const classInstance = new MyClass();
  const data = {
    date,
    myClass: classInstance,
  };

  const filtered = filterObjectOrArrayKeys(data, {
    rejectKeys: ['**name', '**age', '**now'],
  });

  expect((filtered as any).date).toBe(date);
  expect((filtered as any).myClass).toBe(classInstance);

  expect(getSnapshot(filtered)).toMatchInlineSnapshot(`
    "
    date{Date}: '2025-08-09T23:40:31.349Z'
    myClass{MyClass}: { name: 'John', age: 30 }
    "
  `);
});

describe('multi-key patterns', () => {
  test('should filter multiple properties with pipe syntax', () => {
    const data = {
      prop: {
        test: {
          prop1: 'value1',
          prop2: 'value2',
          prop3: 'value3',
          prop4: 'value4',
          other: 'should-not-match',
        },
      },
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: ['prop.test.(prop1|prop2|prop3)'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      prop:
        test: { prop1: 'value1', prop2: 'value2', prop3: 'value3' }
      "
    `);
  });

  test('should reject multiple properties with pipe syntax', () => {
    const data = {
      prop: {
        test: {
          prop1: 'value1',
          prop2: 'value2',
          prop3: 'value3',
          prop4: 'value4',
          keep: 'should-keep',
        },
      },
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          rejectKeys: ['prop.test.(prop1|prop3|prop4)'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      prop:
        test: { keep: 'should-keep', prop2: 'value2' }
      "
    `);
  });
});

describe('pattern expansion functionality', () => {
  test('should expand basic pattern groups', () => {
    const data = {
      homePage: {
        components: [
          {
            table_id: 'table1',
            columns: ['col1', 'col2'],
            filters: [{ value: 'filter1' }, { value: 'filter2' }],
          },
          {
            table_id: 'table2',
            columns: ['col3', 'col4'],
            filters: [{ value: 'filter3' }],
          },
        ],
      },
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: ['homePage.components[*].(table_id|columns)'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      homePage:
        components:
          - table_id: 'table1'
            columns: ['col1', 'col2']
          - table_id: 'table2'
            columns: ['col3', 'col4']
      "
    `);
  });

  test('should expand nested array patterns', () => {
    const data = {
      homePage: {
        components: [
          {
            table_id: 'table1',
            filters: [{ value: 'filter1' }, { value: 'filter2' }],
          },
        ],
      },
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: ['homePage.components[*].filters[*].value'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      homePage:
        components:
          - filters:
              - value: 'filter1'
              - value: 'filter2'
      "
    `);
  });

  test('should expand patterns at the beginning', () => {
    const data = {
      users: [{ name: 'Alice', age: 25 }],
      admins: [{ name: 'Bob', age: 30 }],
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: ['(users|admins)[*].name'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      admins:
        - name: 'Bob'
      users:
        - name: 'Alice'
      "
    `);
  });

  test('should expand multiple groups in single pattern', () => {
    const data = {
      prod: {
        users: [{ active: true, verified: false }],
        admins: [{ active: false, verified: true }],
      },
      dev: {
        users: [{ active: true, verified: true }],
        admins: [{ active: true, verified: false }],
      },
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: ['(prod|dev).(users|admins)[*].(active|verified)'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      dev:
        admins:
          - { active: true, verified: false }
        users:
          - { active: true, verified: true }

      prod:
        admins:
          - { active: false, verified: true }
        users:
          - { active: true, verified: false }
      "
    `);
  });

  test('should expand patterns with wildcards', () => {
    const data = {
      section1: {
        items: [
          { config: { enabled: true, mode: 'auto' } },
          { config: { enabled: false, mode: 'manual' } },
        ],
      },
      section2: {
        items: [{ config: { enabled: true, mode: 'auto' } }],
      },
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: ['*.items[*].config.(enabled|mode)'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      section1:
        items:
          - config: { enabled: true, mode: 'auto' }
          - config: { enabled: false, mode: 'manual' }

      section2:
        items:
          - config: { enabled: true, mode: 'auto' }
      "
    `);
  });
});

describe('complex pattern expansion scenarios', () => {
  test('should handle deeply nested expansions', () => {
    const data = {
      app: {
        modules: [
          {
            name: 'auth',
            components: [
              {
                type: 'form',
                fields: [
                  { name: 'username', validation: { required: true } },
                  { name: 'password', validation: { minLength: 8 } },
                ],
              },
            ],
          },
        ],
      },
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: [
            'app.modules[*].components[*].fields[*].(name|validation)',
          ],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      app:
        modules:
          - components:
              - fields:
                  - name: 'username'
                    validation: { required: true }
                  - name: 'password'
                    validation: { minLength: 8 }
      "
    `);
  });

  test('should expand patterns with reject keys', () => {
    const data = {
      config: {
        database: { host: 'localhost', password: 'secret', port: 5432 },
        cache: { host: 'redis', password: 'secret', ttl: 3600 },
      },
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          rejectKeys: ['config.(database|cache).password'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      config:
        cache: { ttl: 3600, host: 'redis' }
        database: { port: 5432, host: 'localhost' }
      "
    `);
  });

  test('should handle triple nested expansions', () => {
    const data = {
      environments: {
        prod: {
          services: { api: { config: { port: 3000, ssl: true } } },
          workers: { queue: { config: { threads: 4, timeout: 30 } } },
        },
        dev: {
          services: { api: { config: { port: 3001, ssl: false } } },
          workers: { queue: { config: { threads: 2, timeout: 10 } } },
        },
      },
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: [
            'environments.(prod|dev).(services|workers).*.config.port',
          ],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      environments:
        dev:
          services:
            api:
              config: { port: 3001 }
        prod:
          services:
            api:
              config: { port: 3000 }
      "
    `);
  });

  test('should combine expansions with array ranges', () => {
    const data = {
      batches: [
        { type: 'daily', items: [{ id: 1 }, { id: 2 }, { id: 3 }] },
        { type: 'weekly', items: [{ id: 4 }, { id: 5 }] },
        { type: 'monthly', items: [{ id: 6 }] },
      ],
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: ['batches[0-1].(type|items[0].id)'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      batches:
        - type: 'daily'
          items:
            - id: 1
        - type: 'weekly'
          items:
            - id: 4
      "
    `);
  });

  test('should handle expansion patterns with double wildcards', () => {
    const data = {
      root: {
        level1: {
          deep: {
            target: 'found1',
            other: 'ignored1',
          },
        },
        level2: {
          nested: {
            target: 'found2',
            other: 'ignored2',
          },
        },
      },
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: ['root.(level1|level2).**target'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      root:
        level1:
          deep: { target: 'found1' }
        level2:
          nested: { target: 'found2' }
      "
    `);
  });

  test('should expand patterns with array patterns', () => {
    const data = {
      homePage: {
        components: [
          {
            type: 'kanban',
            id: 'kanban_component',
            component_name: 'Task Board',
            table_id: 'table_id_1',
            fields: ['status'],
            group_by: 'status',
            columns: ['todo', 'in_progress', 'done'],
            filters: [
              {
                field_id: 'status',
                operator: '==',
                type: 'select',
                value: 'todo',
              },
            ],
            background_color: null,
          },
        ],
      },
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, {
          filterKeys: [
            'homePage.components[*].(table_id|columns|group_by|filters[*])',
          ],
        }),
      ),
    ).toMatchInlineSnapshot(`
      "
      homePage:
        components:
          - group_by: 'status'
            table_id: 'table_id_1'
            columns: ['todo', 'in_progress', 'done']
            filters:
              - { field_id: 'status', operator: '==', type: 'select', value: 'todo' }
      "
    `);
  });
});

describe('circular references with key filtering', () => {
  test('should throw when the circular reference key itself gets filtered', () => {
    const obj: any = {
      name: 'John',
      active: true,
    };
    obj.circular = obj;
    expect(() =>
      filterObjectOrArrayKeys(obj, { filterKeys: ['circular'] }),
    ).toThrowErrorMatchingInlineSnapshot(
      `[TypeError: Circular references are not supported]`,
    );
  });

  test('should not throw when the circular reference key itself gets rejected', () => {
    const obj: any = {
      name: 'John',
      active: true,
    };
    obj.circular = obj;
    expect(
      getSnapshot(filterObjectOrArrayKeys(obj, { rejectKeys: ['circular'] })),
    ).toMatchInlineSnapshot(`
      "
      active: true
      name: 'John'
      "
    `);
  });
});
