import { expect, test } from 'vitest';
import { matchPath, matchPathWith } from './matchPath';

test('matchPath - basic string matching', () => {
  expect(matchPath('/users', '/users')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {},
      "pathname": "/users",
      "pathnameBase": "/users",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/users",
      },
    }
  `);

  expect(matchPath('/users', '/users/123')).toBe(null);
  expect(matchPath('/users', '/other')).toBe(null);
});

test('matchPath - basic PathPattern object matching', () => {
  const pattern = { path: '/users', caseSensitive: false, end: true };
  expect(matchPath(pattern, '/users')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {},
      "pathname": "/users",
      "pathnameBase": "/users",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/users",
      },
    }
  `);
});

test('matchPath - path parameters', () => {
  expect(matchPath('/users/:id', '/users/123')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {
        "id": "123",
      },
      "pathname": "/users/123",
      "pathnameBase": "/users/123",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/users/:id",
      },
    }
  `);

  expect(matchPath('/users/:id/posts/:postId', '/users/123/posts/456')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {
        "id": "123",
        "postId": "456",
      },
      "pathname": "/users/123/posts/456",
      "pathnameBase": "/users/123/posts/456",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/users/:id/posts/:postId",
      },
    }
  `);
});

test('matchPath - optional parameters', () => {
  expect(matchPath('/users/:id?', '/users/')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {
        "id": undefined,
      },
      "pathname": "/users/",
      "pathnameBase": "/users",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/users/:id?",
      },
    }
  `);

  expect(matchPath('/users/:id?', '/users/123')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {
        "id": "123",
      },
      "pathname": "/users/123",
      "pathnameBase": "/users/123",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/users/:id?",
      },
    }
  `);

  expect(matchPath('/users/:id?', '/users')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {
        "id": undefined,
      },
      "pathname": "/users",
      "pathnameBase": "/users",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/users/:id?",
      },
    }
  `);
});

test('matchPath - wildcard matching', () => {
  expect(matchPath('/files/*', '/files/documents/readme.txt')).toMatchInlineSnapshot(`
    {
      "glob": {
        "matchPath": [Function],
        "path": "/documents/readme.txt",
      },
      "params": {
        "*": "documents/readme.txt",
      },
      "pathname": "/files/documents/readme.txt",
      "pathnameBase": "/files",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/files/*",
      },
    }
  `);

  expect(matchPath('*', '/any/path/here')).toMatchInlineSnapshot(`
    {
      "glob": {
        "matchPath": [Function],
        "path": "/any/path/here",
      },
      "params": {
        "*": "any/path/here",
      },
      "pathname": "/any/path/here",
      "pathnameBase": "/",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "*",
      },
    }
  `);

  expect(matchPath('/*', '/any/path/here')).toMatchInlineSnapshot(`
    {
      "glob": {
        "matchPath": [Function],
        "path": "/any/path/here",
      },
      "params": {
        "*": "any/path/here",
      },
      "pathname": "/any/path/here",
      "pathnameBase": "/",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/*",
      },
    }
  `);
});

test('matchPath - wildcard with parameters', () => {
  expect(matchPath('/users/:id/*', '/users/123/posts/456/edit')).toMatchInlineSnapshot(`
    {
      "glob": {
        "matchPath": [Function],
        "path": "/posts/456/edit",
      },
      "params": {
        "*": "posts/456/edit",
        "id": "123",
      },
      "pathname": "/users/123/posts/456/edit",
      "pathnameBase": "/users/123",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/users/:id/*",
      },
    }
  `);
});

test('matchPath - nested glob matching', () => {
  const result = matchPath('/files/*', '/files/documents/readme.txt');
  expect(result?.glob?.path).toBe('/documents/readme.txt');

  const nestedResult = result?.glob?.matchPath(':folder/:filename');
  expect(nestedResult).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {
        "filename": "readme.txt",
        "folder": "documents",
      },
      "pathname": "/documents/readme.txt",
      "pathnameBase": "/documents/readme.txt",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": ":folder/:filename",
      },
    }
  `);
});

test('matchPath - case sensitivity', () => {
  expect(matchPath({ path: '/Users', caseSensitive: true }, '/users')).toBe(null);
  expect(matchPath({ path: '/Users', caseSensitive: true }, '/Users')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {},
      "pathname": "/Users",
      "pathnameBase": "/Users",
      "pattern": {
        "caseSensitive": true,
        "path": "/Users",
      },
    }
  `);

  expect(matchPath({ path: '/Users', caseSensitive: false }, '/users')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {},
      "pathname": "/users",
      "pathnameBase": "/users",
      "pattern": {
        "caseSensitive": false,
        "path": "/Users",
      },
    }
  `);
});

test('matchPath - end option', () => {
  expect(matchPath({ path: '/users', end: false }, '/users/123')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {},
      "pathname": "/users",
      "pathnameBase": "/users",
      "pattern": {
        "end": false,
        "path": "/users",
      },
    }
  `);

  expect(matchPath({ path: '/users', end: true }, '/users/123')).toBe(null);

  expect(matchPath({ path: '/users/:id', end: false }, '/users/123/posts')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {
        "id": "123",
      },
      "pathname": "/users/123",
      "pathnameBase": "/users/123",
      "pattern": {
        "end": false,
        "path": "/users/:id",
      },
    }
  `);
});

test('matchPath - encoded characters', () => {
  expect(matchPath('/files/:filename', '/files/my%2Ffile.txt')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {
        "filename": "my/file.txt",
      },
      "pathname": "/files/my%2Ffile.txt",
      "pathnameBase": "/files/my%2Ffile.txt",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/files/:filename",
      },
    }
  `);
});

test('matchPath - trailing slashes', () => {
  expect(matchPath('/users', '/users/')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {},
      "pathname": "/users/",
      "pathnameBase": "/users",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/users",
      },
    }
  `);

  expect(matchPath('/users/', '/users')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {},
      "pathname": "/users",
      "pathnameBase": "/users",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/users/",
      },
    }
  `);

  expect(matchPath('/users///', '/users')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {},
      "pathname": "/users",
      "pathnameBase": "/users",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/users///",
      },
    }
  `);
});

test('matchPath - edge cases', () => {
  expect(matchPath('', '')).toBe(null);

  expect(matchPath('/', '/')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {},
      "pathname": "/",
      "pathnameBase": "/",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/",
      },
    }
  `);

  expect(matchPath('/', '')).toBe(null);
  expect(matchPath('', '/')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {},
      "pathname": "/",
      "pathnameBase": "/",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "",
      },
    }
  `);
});

test('matchPath - special regex characters in path', () => {
  expect(matchPath('/files/test.txt', '/files/test.txt')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {},
      "pathname": "/files/test.txt",
      "pathnameBase": "/files/test.txt",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/files/test.txt",
      },
    }
  `);

  expect(matchPath('/files/(test)', '/files/(test)')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {},
      "pathname": "/files/(test)",
      "pathnameBase": "/files/(test)",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/files/(test)",
      },
    }
  `);

  expect(matchPath('/files/[test]', '/files/[test]')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {},
      "pathname": "/files/[test]",
      "pathnameBase": "/files/[test]",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/files/[test]",
      },
    }
  `);
});

test('matchPath - empty parameters', () => {
  expect(matchPath('/users/:id', '/users/')).toBe(null);

  // Test that empty segments don't match required parameters
  expect(matchPath('/users/:id/posts', '/users//posts')).toBe(null);

  // Test that optional parameters can handle empty values
  expect(matchPath('/users/:id?/posts', '/users//posts')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {
        "id": undefined,
      },
      "pathname": "/users//posts",
      "pathnameBase": "/users//posts",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/users/:id?/posts",
      },
    }
  `);
});

test('matchPath - complex patterns', () => {
  expect(matchPath('/api/:version/users/:id?/posts/:postId', '/api/v1/users/123/posts/456')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {
        "id": "123",
        "postId": "456",
        "version": "v1",
      },
      "pathname": "/api/v1/users/123/posts/456",
      "pathnameBase": "/api/v1/users/123/posts/456",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/api/:version/users/:id?/posts/:postId",
      },
    }
  `);

  expect(matchPath('/api/:version/users/:id?/posts/:postId', '/api/v1/users//posts/456')).toMatchInlineSnapshot(`
    {
      "glob": null,
      "params": {
        "id": undefined,
        "postId": "456",
        "version": "v1",
      },
      "pathname": "/api/v1/users//posts/456",
      "pathnameBase": "/api/v1/users//posts/456",
      "pattern": {
        "caseSensitive": false,
        "end": true,
        "path": "/api/:version/users/:id?/posts/:postId",
      },
    }
  `);
});

test('matchPathWith - basic usage', () => {
  const matcher = matchPathWith('/users/123');

  const result = matcher.patterns({
    '/users/:id': (match) => `user-${match.params.id}`,
    '/posts/:id': (match) => `post-${match.params.id}`,
    '/admin/*': (match) => `admin-${match.params['*']}`,
  });

  expect(result).toBe('user-123');
});

test('matchPathWith - first match wins', () => {
  const matcher = matchPathWith('/admin/users');

  const result = matcher.patterns({
    '/admin/*': (match) => `wildcard-${match.params['*']}`,
    '/admin/users': (_match) => 'specific-admin',
  });

  expect(result).toBe('wildcard-users');
});

test('matchPathWith - no match', () => {
  const matcher = matchPathWith('/unknown/path');

  const result = matcher.patterns({
    '/users/:id': (match) => ({ type: 'user', id: match.params.id }),
    '/posts/:id': (match) => ({ type: 'post', id: match.params.id }),
  });

  expect(result).toBe(null);
});

test('matchPathWith - null/undefined path', () => {
  expect(matchPathWith(null).patterns({
    '/users/:id': () => 'user',
  })).toBe(null);

  expect(matchPathWith(undefined).patterns({
    '/users/:id': () => 'user',
  })).toBe(null);

  expect(matchPathWith('').patterns({
    '/users/:id': () => 'user',
  })).toBe(null);
});

test('matchPathWith - complex pattern matching', () => {
  const matcher = matchPathWith('/api/v2/users/456/posts/789');

  const result = matcher.patterns({
    '/api/:version/users/:userId/posts/:postId': (match) =>
      `api-${match.params.version}-${match.params.userId}-${match.params.postId}`,
    '/api/*': (_match) => 'api-fallback',
  });

  expect(result).toBe('api-v2-456-789');
});

test('matchPathWith - empty patterns object', () => {
  const matcher = matchPathWith('/users/123');
  const result = matcher.patterns({});
  expect(result).toBe(null);
});

test('type inference', () => {
  // These tests verify TypeScript type inference at compile time
  const userMatch = matchPath('/users/:id', '/users/123');
  if (userMatch) {
    // TypeScript should infer the correct parameter types
    const userId: string | undefined = userMatch.params.id;
    expect(typeof userId).toBe('string');
  }

  const wildcardMatch = matchPath('/files/*', '/files/doc.txt');
  if (wildcardMatch) {
    const splat: string | undefined = wildcardMatch.params['*'];
    expect(typeof splat).toBe('string');
  }

  const optionalMatch = matchPath('/users/:id?', '/users/');
  if (optionalMatch) {
    const optionalId: string | undefined = optionalMatch.params.id;
    expect(optionalId).toBeUndefined();
  }
});