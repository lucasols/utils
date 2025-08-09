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
      user1: { name: 'John' }
      user2: { name: 'Jane' }
      admin: { name: 'Admin' }
      settings: { theme: 'dark' }
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
      name: 'John'
      email: 'john@example.com'
      active: true
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
        profile: { email: 'john@example.com', active: true }
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
      user: { name: 'John', email: 'john@example.com', active: true }
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
      - { name: 'John', age: 30 }
      - { name: 'Bob', age: 35 }
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
      - { name: 'John', age: 30 }
      - { name: 'Jane', age: 25 }
      - { name: 'Bob', age: 35 }
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
      users:
        john:
          profile: { name: 'John' }
        jane:
          profile: { name: 'Jane' }

      admins:
        admin1:
          profile: { name: 'Admin1' }
      "
    `);
  });

  test('should handle wildcard at different positions', () => {
    const data = {
      user: {
        profile: { name: 'John', age: 30 },
        settings: { theme: 'dark', notifications: true },
      },
    };
    expect(
      getSnapshot(
        filterObjectOrArrayKeys(data, { filterKeys: ['user.*name'] }),
      ),
    ).toMatchInlineSnapshot(`
      "
      user:
        profile: { name: 'John' }
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
  test('should keep empty objects when rejectEmptyObjectsInArray  is false', () => {
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
      name: 'John'
      age: 30
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
      users:
        - name: 'John'
          profile: { email: 'john@example.com' }
        - name: 'Jane'
          profile: { email: 'jane@example.com' }
      metadata: { version: '1.0' }
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
    rejectKeys: ['*name', '*age', '*now'],
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
      name: 'John'
      active: true
      "
    `);
  });
});
