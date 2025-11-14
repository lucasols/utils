import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { replaceStringWithJSX } from './jsxUtils';

describe('replaceStringWithJSX', () => {
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
          <a data-username={username} href={`/users/${username}`}>
            @{username}
          </a>
        ),
      },
    ]);

    const { container } = render(<>{node}</>);

    expect(container.innerHTML).toMatchInlineSnapshot(`
      "Chat with <a data-username=\"alice\" href=\"/users/alice\">@alice</a> and <a data-username=\"bob\" href=\"/users/bob\">@bob</a> today"
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
});
