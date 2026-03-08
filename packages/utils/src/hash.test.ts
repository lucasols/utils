import { expect, test } from 'vitest';
import { murmur2, murmur3 } from './hash';

test('murmur3 matches stable reference vectors', () => {
  expect({
    empty: murmur3(''),
    singleChar: murmur3('a'),
    ascii: murmur3('abc'),
    word: murmur3('hello'),
    sentence: murmur3('The quick brown fox jumps over the lazy dog'),
    accent: murmur3('café'),
    emoji: murmur3('😀'),
    nullByte: murmur3('abc\0def'),
    long: murmur3('a'.repeat(1000)),
  }).toMatchInlineSnapshot(`
    {
      "accent": "16k9t4l",
      "ascii": "1dwmk8q",
      "emoji": "52omak",
      "empty": "0",
      "long": "18x5amg",
      "nullByte": "kx675n",
      "sentence": "culnab",
      "singleChar": "gos6uq",
      "word": "a5205j",
    }
  `);
});

test('murmur3 can return an unsigned 32-bit integer', () => {
  expect({
    empty: murmur3('', 'uint32'),
    ascii: murmur3('abc', 'uint32'),
    word: murmur3('hello', 'uint32'),
    sentence: murmur3('The quick brown fox jumps over the lazy dog', 'uint32'),
    accent: murmur3('café', 'uint32'),
  }).toMatchInlineSnapshot(`
    {
      "accent": 2573629365,
      "ascii": 3017643002,
      "empty": 0,
      "sentence": 776992547,
      "word": 613153351,
    }
  `);
});

test('murmur3 produces different hashes than murmur2 for non-empty inputs', () => {
  expect(murmur3('hello')).not.toBe(murmur2('hello'));
  expect(murmur3('café')).not.toBe(murmur2('café'));
  expect(murmur3('😀')).not.toBe(murmur2('😀'));
});
