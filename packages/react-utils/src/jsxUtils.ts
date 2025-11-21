import { escapeRegExp } from '@ls-stack/utils/regexUtils';
import type { ReactElement, ReactNode } from 'react';
import { Children } from 'react';

export type Replacer = {
  match: RegExp | string;
  fn: (fullMatch: string, groups: (string | undefined)[]) => ReactElement;
};

type NormalizedReplacer = {
  regex: RegExp;
  fn: Replacer['fn'];
  order: number;
};

function normalizeRegex(match: RegExp): RegExp {
  const flags = match.flags.includes('g') ? match.flags : `${match.flags}g`;
  return new RegExp(match.source, flags);
}

function normalizeStringMatcher(value: string): RegExp {
  if (!value) {
    throw new Error('replaceStringWithJSX requires non-empty string matchers.');
  }

  return new RegExp(escapeRegExp(value), 'g');
}

export function replaceStringWithJSX(
  string: string,
  replacers: Replacer[],
): ReactNode {
  if (replacers.length === 0) {
    return string;
  }

  const normalizedReplacers: NormalizedReplacer[] = replacers.map(
    ({ match, fn }, order) => ({
      regex:
        typeof match === 'string' ?
          normalizeStringMatcher(match)
        : normalizeRegex(match),
      fn,
      order,
    }),
  );

  const jsx: ReactNode[] = [];
  let cursor = 0;
  let hasMatches = false;

  while (cursor < string.length) {
    let closestMatch: {
      start: number;
      end: number;
      groups: (string | undefined)[];
      fullMatch: string;
      replacer: NormalizedReplacer;
    } | null = null;

    for (const replacer of normalizedReplacers) {
      replacer.regex.lastIndex = cursor;
      const match = replacer.regex.exec(string);

      if (!match) {
        continue;
      }

      const [fullMatch] = match;
      const groups = match.slice(1) as (string | undefined)[];
      const start = match.index;
      const end = replacer.regex.lastIndex;

      if (!fullMatch || fullMatch.length === 0) {
        throw new Error(
          'replaceStringWithJSX matchers must not resolve to empty strings.',
        );
      }

      if (
        !closestMatch ||
        start < closestMatch.start ||
        (start === closestMatch.start &&
          replacer.order < closestMatch.replacer.order)
      ) {
        closestMatch = {
          start,
          end,
          groups,
          fullMatch,
          replacer,
        };
      }
    }

    if (!closestMatch) {
      break;
    }

    const textBefore = string.slice(cursor, closestMatch.start);

    if (textBefore) {
      jsx.push(textBefore);
    }

    jsx.push(
      closestMatch.replacer.fn(closestMatch.fullMatch, closestMatch.groups),
    );
    cursor = closestMatch.end;
    hasMatches = true;
  }

  if (!hasMatches) {
    return string;
  }

  if (cursor < string.length) {
    jsx.push(string.slice(cursor));
  }

  return Children.toArray(jsx);
}

export function repeatJsx<T extends ReactElement>(
  times: number,
  element: T,
): ReactNode {
  return Children.toArray(Array.from({ length: times }, () => element));
}
