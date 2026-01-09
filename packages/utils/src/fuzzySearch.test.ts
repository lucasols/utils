import { test, expect, vi } from 'vitest';
import {
  fuzzySearchItems,
  fuzzySearchItemsWithResultMetadata,
  getUFuzzyInstance,
} from './fuzzySearch';

const uf = getUFuzzyInstance();

test('fuzzySearchItems returns all items when search query is empty', () => {
  const items = ['apple', 'banana', 'cherry'];

  const result = fuzzySearchItems({
    items,
    searchQuery: '',
    getStringToMatch: (item) => item,
    uFuzzy: uf,
  });

  expect(result).toEqual(['apple', 'banana', 'cherry']);
});

test('fuzzySearchItems returns all items when search query is null', () => {
  const items = ['apple', 'banana', 'cherry'];

  const result = fuzzySearchItems({
    items,
    searchQuery: null,
    getStringToMatch: (item) => item,
    uFuzzy: uf,
  });

  expect(result).toEqual(['apple', 'banana', 'cherry']);
});

test('fuzzySearchItems filters items by exact match', () => {
  const items = ['apple', 'banana', 'cherry'];

  const result = fuzzySearchItems({
    items,
    searchQuery: 'apple',
    getStringToMatch: (item) => item,
    uFuzzy: uf,
  });

  expect(result).toEqual(['apple']);
});

test('fuzzySearchItems returns fuzzy matches', () => {
  const items = ['application', 'apple', 'appeal', 'banana'];

  const result = fuzzySearchItems({
    items,
    searchQuery: 'app',
    getStringToMatch: (item) => item,
    uFuzzy: uf,
  });

  expect(result).toContain('application');
  expect(result).toContain('apple');
  expect(result).toContain('appeal');
  expect(result).not.toContain('banana');
});

test('fuzzySearchItems handles objects with getStringToMatch', () => {
  const items = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' },
  ];

  const result = fuzzySearchItems({
    items,
    searchQuery: 'john',
    getStringToMatch: (item) => item.name,
    uFuzzy: uf,
  });

  expect(result).toHaveLength(2);
  expect(result).toContainEqual({ id: 1, name: 'John Doe' });
  expect(result).toContainEqual({ id: 3, name: 'Bob Johnson' });
});

test('fuzzySearchItems normalizes accented characters', () => {
  const items = ['café', 'resume', 'naïve'];

  const result = fuzzySearchItems({
    items,
    searchQuery: 'cafe',
    getStringToMatch: (item) => item,
    uFuzzy: uf,
  });

  expect(result).toContain('café');
});

test('fuzzySearchItems trims whitespace from search query', () => {
  const items = ['apple', 'banana'];

  const result = fuzzySearchItems({
    items,
    searchQuery: '  apple  ',
    getStringToMatch: (item) => item,
    uFuzzy: uf,
  });

  expect(result).toEqual(['apple']);
});

test('fuzzySearchItems returns empty array when no matches found', () => {
  const items = ['apple', 'banana', 'cherry'];

  const result = fuzzySearchItems({
    items,
    searchQuery: 'xyz',
    getStringToMatch: (item) => item,
    uFuzzy: uf,
  });

  expect(result).toEqual([]);
});

test('fuzzySearchItemsWithResultMetadata returns items with bestMatchScore', () => {
  const items = ['apple', 'application', 'appeal'];

  const result = fuzzySearchItemsWithResultMetadata({
    items,
    searchQuery: 'apple',
    getStringToMatch: (item) => item,
    uFuzzy: uf,
  });

  expect(result.items).toContain('apple');
  expect(result.bestMatchScore).toBeGreaterThan(0);
});

test('fuzzySearchItemsWithResultMetadata returns bestMatchScore 0 for empty query', () => {
  const items = ['apple', 'banana'];

  const result = fuzzySearchItemsWithResultMetadata({
    items,
    searchQuery: '',
    getStringToMatch: (item) => item,
    uFuzzy: uf,
  });

  expect(result.items).toEqual(items);
  expect(result.bestMatchScore).toBe(0);
});

test('fuzzySearchItemsWithResultMetadata skips score calculation when ignoreBestMatch is true', () => {
  const items = ['apple', 'application'];

  const result = fuzzySearchItemsWithResultMetadata({
    items,
    searchQuery: 'app',
    getStringToMatch: (item) => item,
    uFuzzy: uf,
    ignoreBestMatch: true,
  });

  expect(result.bestMatchScore).toBe(0);
  expect(result.items.length).toBeGreaterThan(0);
});

test('fuzzySearchItemsWithResultMetadata falls back to includes on error', () => {
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
    // silence console.error
  });

  const brokenUFuzzy = {
    search: () => {
      throw new Error('Test error');
    },
  } as never;

  const items = ['apple pie', 'banana', 'apple sauce'];

  const result = fuzzySearchItemsWithResultMetadata({
    items,
    searchQuery: 'apple',
    getStringToMatch: (item) => item,
    uFuzzy: brokenUFuzzy,
  });

  expect(result.items).toEqual(['apple pie', 'apple sauce']);
  expect(result.bestMatchScore).toBe(0);
  expect(consoleErrorSpy).toHaveBeenCalled();

  consoleErrorSpy.mockRestore();
});

test('fuzzySearchItemsWithResultMetadata throws on error when throwOnError is true', () => {
  const brokenUFuzzy = {
    search: () => {
      throw new Error('Test error');
    },
  } as never;

  const items = ['apple'];

  expect(() =>
    fuzzySearchItemsWithResultMetadata({
      items,
      searchQuery: 'apple',
      getStringToMatch: (item) => item,
      uFuzzy: brokenUFuzzy,
      throwOnError: true,
    }),
  ).toThrow('Test error');
});

test('getUFuzzyInstance creates a functional uFuzzy instance', () => {
  const instance = getUFuzzyInstance();

  expect(instance).toBeDefined();
  expect(typeof instance.search).toBe('function');
});

test('getUFuzzyInstance sorting prioritizes contiguous matches', () => {
  const instance = getUFuzzyInstance();
  const items = ['foobar', 'foo_bar', 'foxxbar'];

  const result = fuzzySearchItems({
    items,
    searchQuery: 'foobar',
    getStringToMatch: (item) => item,
    uFuzzy: instance,
  });

  expect(result[0]).toBe('foobar');
});

test('getUFuzzyInstance sorting prioritizes prefix matches', () => {
  const instance = getUFuzzyInstance();
  const items = ['xyztest', 'testxyz', 'test'];

  const result = fuzzySearchItems({
    items,
    searchQuery: 'test',
    getStringToMatch: (item) => item,
    uFuzzy: instance,
  });

  expect(result[0]).toBe('test');
  expect(result.indexOf('testxyz')).toBeLessThan(result.indexOf('xyztest'));
});

test('fuzzySearchItems handles empty items array', () => {
  const result = fuzzySearchItems({
    items: [],
    searchQuery: 'test',
    getStringToMatch: (item: string) => item,
    uFuzzy: uf,
  });

  expect(result).toEqual([]);
});

test('fuzzySearchItems handles single character query', () => {
  const items = ['apple', 'banana', 'cherry'];

  const result = fuzzySearchItems({
    items,
    searchQuery: 'a',
    getStringToMatch: (item) => item,
    uFuzzy: uf,
  });

  expect(result).toContain('apple');
  expect(result).toContain('banana');
});

test('fuzzySearchItems handles case insensitive matching', () => {
  const items = ['Apple', 'BANANA', 'cherry'];

  const result = fuzzySearchItems({
    items,
    searchQuery: 'apple',
    getStringToMatch: (item) => item,
    uFuzzy: uf,
  });

  expect(result).toContain('Apple');
});

test('fuzzySearchItemsWithResultMetadata preserves original item references', () => {
  const item1 = { id: 1, name: 'test' };
  const item2 = { id: 2, name: 'another' };
  const items = [item1, item2];

  const result = fuzzySearchItemsWithResultMetadata({
    items,
    searchQuery: 'test',
    getStringToMatch: (item) => item.name,
    uFuzzy: uf,
  });

  expect(result.items[0]).toBe(item1);
});
