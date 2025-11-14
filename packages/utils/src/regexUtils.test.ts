import { test, expect } from 'vitest';
import { getRegexMatches, getRegexMatchAll, escapeRegExp } from './regexUtils';
import { compactSnapshot } from './testUtils';

test('getRegexMatches should return fullMatch and groups for simple match', () => {
  const result = getRegexMatches('hello world', /hello/);

  expect(compactSnapshot(result)).toMatchInlineSnapshot(`
    "
    groups: []
    fullMatch: 'hello'
    "
  `);
});

test('getRegexMatches should return fullMatch and groups with capturing groups', () => {
  const result = getRegexMatches('hello world', /(\w+) (\w+)/);

  expect(compactSnapshot(result)).toMatchInlineSnapshot(`
    "
    groups: ['hello', 'world']
    fullMatch: 'hello world'
    "
  `);
});

test('getRegexMatches should return undefined fullMatch when no match', () => {
  const result = getRegexMatches('hello', /goodbye/);

  expect(compactSnapshot(result)).toMatchInlineSnapshot(`
    "
    groups: []
    "
  `);
});

test('getRegexMatches should handle nested capturing groups', () => {
  const result = getRegexMatches('2024-01-15', /(\d{4})-(\d{2})-(\d{2})/);

  expect(compactSnapshot(result)).toMatchInlineSnapshot(`
    "
    groups: ['2024', '01', '15']
    fullMatch: '2024-01-15'
    "
  `);
});

test('getRegexMatchAll should yield multiple matches', () => {
  const matches = Array.from(getRegexMatchAll('cat dog cat bird', /cat/g));

  expect(compactSnapshot(matches)).toMatchInlineSnapshot(`
    "
    - groups: []
      fullMatch: 'cat'
      start: 0
      end: 3
      prevEnd: 0
    - groups: []
      fullMatch: 'cat'
      start: 8
      end: 11
      prevEnd: 3
    "
  `);
});

test('getRegexMatchAll should add global flag if not present', () => {
  const matches = Array.from(getRegexMatchAll('cat dog cat bird', /cat/));

  expect(compactSnapshot(matches)).toMatchInlineSnapshot(`
    "
    - groups: []
      fullMatch: 'cat'
      start: 0
      end: 3
      prevEnd: 0
    - groups: []
      fullMatch: 'cat'
      start: 8
      end: 11
      prevEnd: 3
    "
  `);
});

test('getRegexMatchAll should capture groups', () => {
  const matches = Array.from(getRegexMatchAll('foo123 bar456', /([a-z]+)(\d+)/g));

  expect(compactSnapshot(matches)).toMatchInlineSnapshot(`
    "
    - groups: ['foo', '123']
      fullMatch: 'foo123'
      start: 0
      end: 6
      prevEnd: 0
    - groups: ['bar', '456']
      fullMatch: 'bar456'
      start: 7
      end: 13
      prevEnd: 6
    "
  `);
});

test('getRegexMatchAll should capture named groups', () => {
  const matches = Array.from(
    getRegexMatchAll('2024-01-15 2024-12-31', /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/g)
  );

  expect(compactSnapshot(matches)).toMatchInlineSnapshot(`
    "
    - groups: ['2024', '01', '15']
      fullMatch: '2024-01-15'
      namedGroups: { year: '2024', month: '01', day: '15' }
      start: 0
      end: 10
      prevEnd: 0
    - groups: ['2024', '12', '31']
      fullMatch: '2024-12-31'
      namedGroups: { year: '2024', month: '12', day: '31' }
      start: 11
      end: 21
      prevEnd: 10
    "
  `);
});

test('getRegexMatchAll should handle no matches', () => {
  const matches = Array.from(getRegexMatchAll('hello world', /xyz/g));

  expect(matches).toHaveLength(0);
});

test('getRegexMatchAll should track positions correctly', () => {
  const matches = Array.from(getRegexMatchAll('abc def ghi', /\w+/g));

  expect(compactSnapshot(matches)).toMatchInlineSnapshot(`
    "
    - groups: []
      fullMatch: 'abc'
      start: 0
      end: 3
      prevEnd: 0
    - groups: []
      fullMatch: 'def'
      start: 4
      end: 7
      prevEnd: 3
    - groups: []
      fullMatch: 'ghi'
      start: 8
      end: 11
      prevEnd: 7
    "
  `);
});

test('getRegexMatchAll should handle overlapping potential matches correctly', () => {
  const matches = Array.from(getRegexMatchAll('aaaa', /aa/g));

  expect(compactSnapshot(matches)).toMatchInlineSnapshot(`
    "
    - groups: []
      fullMatch: 'aa'
      start: 0
      end: 2
      prevEnd: 0
    - groups: []
      fullMatch: 'aa'
      start: 2
      end: 4
      prevEnd: 2
    "
  `);
});

test('getRegexMatchAll should work with case-insensitive flag', () => {
  const matches = Array.from(getRegexMatchAll('Hello HELLO hello', /hello/gi));

  expect(compactSnapshot(matches)).toMatchInlineSnapshot(`
    "
    - groups: []
      fullMatch: 'Hello'
      start: 0
      end: 5
      prevEnd: 0
    - groups: []
      fullMatch: 'HELLO'
      start: 6
      end: 11
      prevEnd: 5
    - groups: []
      fullMatch: 'hello'
      start: 12
      end: 17
      prevEnd: 11
    "
  `);
});

test('escapeRegExp should escape all special regex characters', () => {
  const input = '.*+?^${}()|[]\\';
  const escaped = escapeRegExp(input);

  expect(escaped).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
});

test('escapeRegExp should not modify strings without special characters', () => {
  const input = 'hello world 123';
  const escaped = escapeRegExp(input);

  expect(escaped).toBe('hello world 123');
});

test('escapeRegExp should handle mixed content', () => {
  const input = 'Price: $5.99 (50% off)';
  const escaped = escapeRegExp(input);

  expect(escaped).toBe('Price: \\$5\\.99 \\(50% off\\)');
});

test('escapeRegExp should handle empty string', () => {
  const escaped = escapeRegExp('');

  expect(escaped).toBe('');
});

test('escapeRegExp should work in real regex patterns', () => {
  const searchTerm = 'test.value';
  const text = 'This is test.value and testXvalue';

  const escapedPattern = new RegExp(escapeRegExp(searchTerm));
  const matches = text.match(escapedPattern);

  expect(matches).toMatchInlineSnapshot(`
    [
      "test.value",
    ]
  `);
});

test('escapeRegExp should handle dot character correctly', () => {
  const searchTerm = '...';
  const text = 'abc...def...ghi';

  const pattern = new RegExp(escapeRegExp(searchTerm), 'g');
  const matches = text.match(pattern);

  expect(matches).toMatchInlineSnapshot(`
    [
      "...",
      "...",
    ]
  `);
});

test('escapeRegExp should handle regex quantifiers correctly', () => {
  const searchTerm = 'a+b*c?';
  const text = 'Find a+b*c? in this text, not abc or aabbc';

  const pattern = new RegExp(escapeRegExp(searchTerm));

  expect(pattern.test(text)).toBe(true);
  expect(pattern.test('abc')).toBe(false);
});

test('escapeRegExp should handle character classes correctly', () => {
  const searchTerm = '[abc]';
  const text = 'Match [abc] literally, not a, b, or c';

  const pattern = new RegExp(escapeRegExp(searchTerm));

  expect(pattern.test(text)).toBe(true);
  expect(pattern.test('a')).toBe(false);
});

test('escapeRegExp should handle already escaped strings', () => {
  const input = 'already\\escaped';
  const escaped = escapeRegExp(input);

  expect(escaped).toBe('already\\\\escaped');
});
