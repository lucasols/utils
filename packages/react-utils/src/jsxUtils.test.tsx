import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { replaceStringWithJSX } from './jsxUtils';

describe('replaceStringWithJSX', () => {
  test('returns same string reference when no replacers are provided', () => {
    const input = 'plain text';

    const result = replaceStringWithJSX(input, []);

    expect(result).toBe(input);
  });

  test('replaces literal strings while preserving surrounding text', () => {
    const node = replaceStringWithJSX('Email lucas@example.com for help', [
      {
        match: 'lucas@example.com',
        fn: (fullMatch) => <strong>{fullMatch}</strong>,
      },
    ]);

    const { container } = render(<>{node}</>);

    expect(container.innerHTML).toMatchInlineSnapshot(
      '"Email <strong>lucas@example.com</strong> for help"',
    );
  });

  test('supports regex groups to build custom JSX nodes', () => {
    const node = replaceStringWithJSX('Chat with @alice and @bob today', [
      {
        match: /@(\w+)/g,
        fn: (_, [username]) => (
          <a
            data-username={username}
            href={`/users/${username}`}
          >
            @{username}
          </a>
        ),
      },
    ]);

    const { container } = render(<>{node}</>);

    expect(container.innerHTML).toMatchInlineSnapshot(`
      "Chat with <a data-username="alice" href="/users/alice">@alice</a> and <a data-username="bob" href="/users/bob">@bob</a> today"
    `);
  });

  test('enables regex matchers without an explicit global flag', () => {
    const node = replaceStringWithJSX('Chat with @ana, @ben and @cory', [
      {
        match: /@(\w+)/,
        fn: (_, [username]) => (
          <button
            type="button"
            data-user={username}
          >
            @{username}
          </button>
        ),
      },
    ]);

    const { container } = render(<>{node}</>);

    expect(container.innerHTML).toMatchInlineSnapshot(`
      "Chat with <button type="button" data-user="ana">@ana</button>, <button type="button" data-user="ben">@ben</button> and <button type="button" data-user="cory">@cory</button>"
    `);
  });

  test('returns original string when no matches are found', () => {
    const input = 'No replacements here';

    const result = replaceStringWithJSX(input, [
      {
        match: 'missing',
        fn: (fullMatch) => <mark>{fullMatch}</mark>,
      },
    ]);

    expect(result).toBe(input);
  });

  test('prefers first replacer when matches start at the same index', () => {
    const node = replaceStringWithJSX('**bold** text', [
      {
        match: /\*\*(.+?)\*\*/g,
        fn: (_, [content]) => <strong>{content}</strong>,
      },
      {
        match: /\*(.+?)\*/g,
        fn: (_, [content]) => <em>{content}</em>,
      },
    ]);

    const { container } = render(<>{node}</>);

    expect(container.innerHTML).toMatchInlineSnapshot(
      '"<strong>bold</strong> text"',
    );
  });

  test('escapes special characters in literal matchers', () => {
    const node = replaceStringWithJSX('Use [x] + [x] to mark [x]', [
      {
        match: '[x]',
        fn: () => <mark data-tag="x">[x]</mark>,
      },
    ]);

    const { container } = render(<>{node}</>);

    expect(container.innerHTML).toMatchInlineSnapshot(
      '"Use <mark data-tag="x">[x]</mark> + <mark data-tag="x">[x]</mark> to mark <mark data-tag="x">[x]</mark>"',
    );
  });

  test('advances cursor correctly for overlapping matches', () => {
    const node = replaceStringWithJSX('aaaa', [
      {
        match: 'aa',
        fn: (value) => <strong>{value}</strong>,
      },
      {
        match: 'a',
        fn: (value) => <em>{value}</em>,
      },
    ]);

    const { container } = render(<>{node}</>);

    expect(container.innerHTML).toMatchInlineSnapshot(
      '"<strong>aa</strong><strong>aa</strong>"',
    );
  });

  test('throws when string matchers are empty', () => {
    expect(() =>
      replaceStringWithJSX('value', [
        {
          match: '',
          fn: () => <span>invalid</span>,
        },
      ]),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: replaceStringWithJSX requires non-empty string matchers.]`,
    );
  });

  test('throws when regex can match empty strings', () => {
    expect(() =>
      replaceStringWithJSX('foo', [
        {
          match: /(?=o)/g,
          fn: () => <span>ouch</span>,
        },
      ]),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: replaceStringWithJSX matchers must not resolve to empty strings.]`,
    );
  });

  test('provides undefined for optional capture groups', () => {
    const node = replaceStringWithJSX('id=10 id=20(admin)', [
      {
        match: /id=(\d+)(?:\((\w+)\))?/g,
        fn: (_, [value, role]) => (
          <span data-role={role ?? 'default'}>#{value}</span>
        ),
      },
    ]);

    const { container } = render(<>{node}</>);

    expect(container.innerHTML).toMatchInlineSnapshot(
      '"<span data-role="default">#10</span> <span data-role="admin">#20</span>"',
    );
  });
});
