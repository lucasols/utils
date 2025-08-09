import { expect, test } from 'vitest';
import { filterObjectOrArrayKeys } from './filterObjectOrArrayKeys';

test('filters root-level properties with filterKeys', () => {
  const input = { a: 1, b: 2, c: 3 };
  const result = filterObjectOrArrayKeys(input, { filterKeys: ['a', 'c'] });
  expect(result).toMatchInlineSnapshot(`
    {
      "a": 1,
      "c": 3,
    }
  `);
});

test('rejects nested properties using dot notation', () => {
  const input = {
    user: {
      name: 'John',
      credentials: { password: 'secret', apiKey: 'k' },
    },
  };
  const result = filterObjectOrArrayKeys(input, {
    rejectKeys: ['user.credentials.password'],
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "user": {
        "credentials": {
          "apiKey": "k",
        },
        "name": "John",
      },
    }
  `);
});

test('rejects with nested wildcard pattern *.password', () => {
  const input = {
    user1: { name: 'a', password: 'x' },
    user2: { name: 'b', password: 'y' },
    rootPass: 'z',
  };
  const result = filterObjectOrArrayKeys(input, {
    rejectKeys: ['*.password'],
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "rootPass": "z",
      "user1": {
        "name": "a",
      },
      "user2": {
        "name": "b",
      },
    }
  `);
});

test('rejects with global wildcard *secret', () => {
  const input = {
    secret: 'root',
    user: { secret: 'u', x: 1 },
    items: [{ secret: 'i1' }, { secret: 'i2' }],
  };
  const result = filterObjectOrArrayKeys(input, { rejectKeys: ['*secret'] });
  expect(result).toMatchInlineSnapshot(`
    {
      "user": {
        "x": 1,
      },
    }
  `);
});

test('filters arrays by specific index items[0]', () => {
  const input = {
    items: [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ],
  };
  const result = filterObjectOrArrayKeys(input, { filterKeys: ['items[0]'] });
  expect(result).toMatchInlineSnapshot(`
    {
      "items": [
        {
          "id": 1,
          "name": "A",
        },
      ],
    }
  `);
});

test('rejects arrays by wildcard items[*], and removes empty arrays after filtering when rejectEmptyObjects=true', () => {
  const input = {
    items: [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ],
    keep: true,
  };
  const result = filterObjectOrArrayKeys(input, { rejectKeys: ['items[*]'] });
  expect(result).toMatchInlineSnapshot(`
    {
      "keep": true,
    }
  `);
});

test('filters nested property for all array items users[*].name', () => {
  const input = {
    users: [
      { name: 'John', age: 20 },
      { name: 'Jane', age: 30 },
    ],
  };
  const result = filterObjectOrArrayKeys(input, {
    filterKeys: ['users[*].name'],
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "users": [
        {
          "name": "John",
        },
        {
          "name": "Jane",
        },
      ],
    }
  `);
});

test('rejects nested property in array range items[0-1].secret', () => {
  const input = {
    items: [
      { id: 1, secret: 's1' },
      { id: 2, secret: 's2' },
      { id: 3, secret: 's3' },
    ],
  };
  const result = filterObjectOrArrayKeys(input, {
    rejectKeys: ['items[0-1].secret'],
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "items": [
        {
          "id": 1,
        },
        {
          "id": 2,
        },
        {
          "id": 3,
          "secret": "s3",
        },
      ],
    }
  `);
});

test('open-ended range filter items[1-*]', () => {
  const input = {
    items: [{ id: 1 }, { id: 2 }, { id: 3 }],
  };
  const result = filterObjectOrArrayKeys(input, {
    filterKeys: ['items[1-*]'],
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "items": [
        {
          "id": 2,
        },
        {
          "id": 3,
        },
      ],
    }
  `);
});

test('top-level array filtering [0] and [*]', () => {
  const input = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
  ];
  const onlyFirst = filterObjectOrArrayKeys(input as any, {
    filterKeys: ['[0]'],
  });
  expect(onlyFirst).toMatchInlineSnapshot(`
    [
      {
        "id": 1,
        "name": "A",
      },
    ]
  `);

  const all = filterObjectOrArrayKeys(input as any, { filterKeys: ['[*]'] });
  expect(all).toMatchInlineSnapshot(`
    [
      {
        "id": 1,
        "name": "A",
      },
      {
        "id": 2,
        "name": "B",
      },
      {
        "id": 3,
        "name": "C",
      },
    ]
  `);
});

test('combined filter and reject: include branch then drop secrets', () => {
  const input = {
    user: {
      name: 'John',
      email: 'john@example.com',
      password: 'p',
      settings: { theme: 'dark', apiKey: 'k' },
    },
    other: { x: 1 },
  };
  const result = filterObjectOrArrayKeys(input, {
    filterKeys: ['user'],
    rejectKeys: ['*.password', '*apiKey'],
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "user": {
        "email": "john@example.com",
        "name": "John",
        "settings": {
          "theme": "dark",
        },
      },
    }
  `);
});

test('prunes empty objects in filtered contexts by default (rejectEmptyObjects=true)', () => {
  const input = {
    items: [
      { id: 1, secret: 'x' },
      { id: 2, name: 'B' },
    ],
  };

  // Filter only names; first item becomes empty -> removed
  const result = filterObjectOrArrayKeys(input, {
    filterKeys: ['items[*].name'],
    rejectKeys: ['*secret'],
  });

  expect(result).toMatchInlineSnapshot(`
    {
      "items": [
        {
          "name": "B",
        },
      ],
    }
  `);
});

test('does not prune empty objects when rejectEmptyObjects=false', () => {
  const input = {
    users: [
      { id: 1, password: 'x' },
      { id: 2, name: 'B' },
    ],
  };

  const result = filterObjectOrArrayKeys(input, {
    filterKeys: ['users[*].name'],
    rejectKeys: ['*password'],
    rejectEmptyObjects: false,
  });

  expect(result).toMatchInlineSnapshot(`
    {
      "users": [
        {},
        {
          "name": "B",
        },
      ],
    }
  `);
});

test('not filtered structures should not change (exact match includes full branch)', () => {
  const input = {
    user: {
      profile: { name: 'John' },
      secret: 'x',
    },
  };

  // Exact match for root key includes full branch; reject only removes matching keys
  const result = filterObjectOrArrayKeys(input, {
    filterKeys: ['user'],
    rejectKeys: ['*secret'],
  });

  expect(result).toMatchInlineSnapshot(`
    {
      "user": {
        "profile": {
          "name": "John",
        },
      },
    }
  `);
});

test('rejects properties when the filtered object is empty (with rejectEmptyObjects=true)', () => {
  const input = {
    user: {
      profile: { name: 'John' },
      secret: 'x',
    },
  };
  const result = filterObjectOrArrayKeys(input, {
    filterKeys: ['user'],
    rejectKeys: ['*name'],
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "user": {
        "secret": "x",
      },
    }
  `);
});
