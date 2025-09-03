/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, test } from 'vitest';
import {
  asNonEmptyStringOrNull,
  asNonEmptyStringOrThrow,
  isNonEmptyString,
  splitTypedString,
  splitTypedStringAt,
  stringContains,
  stringEndsWith,
  stringStartsWith,
  type NonEmptyString,
  type StringContaining,
  type StringEndingWith,
  type StringStartingWith,
} from './typedStrings';
import { asType } from './typingFnUtils';
import { typingTest } from './typingTestUtils';

const { expectTypesAre } = typingTest;

typingTest.describe('base typed strings', () => {
  typingTest.describe('stringContains', () => {
    typingTest.test('stringContains', () => {
      const equal: StringContaining<'hello'> = 'hello';
      const containsAtStart: StringContaining<'hello'> = 'hello world';
      const containsAtEnd: StringContaining<'hello'> = 'world hello';

      // @ts-expect-error - should return an error
      const notContains: StringContaining<'hello'> = 'world';
      // @ts-expect-error - non literal values should not match
      const wrongValue: StringContaining<string> = 'hello';
    });

    typingTest.test('stringContains assertions', () => {
      const value = asType<string>('hello');

      if (stringContains(value, 'hello')) {
        expectTypesAre<typeof value, `${string}hello${string}`>('equal');
      }

      if (stringContains(value, 'world')) {
        expectTypesAre<typeof value, `${string}hello${string}`>('notEqual');
      }

      if (stringContains(value, 'ell')) {
        const ok = value;
        //      ^?
        expectTypesAre<typeof value, `${string}ell${string}`>('equal');
      }
    });
  });

  typingTest.describe('stringStartsWith', () => {
    typingTest.test('stringStartsWith', () => {
      const equal: StringStartingWith<'hello'> = 'hello';
      const startsWithMatch: StringStartingWith<'hello'> = 'hello world';

      // @ts-expect-error - should return an error
      const notStartsWith: StringStartingWith<'hello'> = 'world hello';

      // @ts-expect-error - should return an error
      const doesNotStartWith: StringStartingWith<'hello'> = 'world';

      // @ts-expect-error - non literal values should not match
      const wrongValue: StringStartingWith<string> = 'hello';
    });

    typingTest.test('stringStartsWith assertions', () => {
      const value = asType<string>('hello world');

      if (stringStartsWith(value, 'hello')) {
        expectTypesAre<typeof value, `hello${string}`>('equal');
      }

      if (stringStartsWith(value, 'world')) {
        expectTypesAre<typeof value, `hello${string}`>('notEqual');
      }

      if (stringStartsWith(value, 'hell')) {
        const ok = value;
        //      ^?
        expectTypesAre<typeof value, `hell${string}`>('equal');
      }
    });
  });

  typingTest.describe('stringEndsWith', () => {
    typingTest.test('types', () => {
      const equal: StringEndingWith<'world'> = 'world';
      const endsWithMatch: StringEndingWith<'world'> = 'hello world';

      // @ts-expect-error - should return an error
      const notEndsWith: StringEndingWith<'world'> = 'world hello';

      // @ts-expect-error - should return an error
      const doesNotEndWith: StringEndingWith<'world'> = 'hello';

      // @ts-expect-error - non literal values should not match
      const wrongValue: StringEndingWith<string> = 'world';
    });

    typingTest.test('assertions', () => {
      const value = asType<string>('hello world');

      if (stringEndsWith(value, 'world')) {
        expectTypesAre<typeof value, `${string}world`>('equal');
      }

      if (stringEndsWith(value, 'hello')) {
        expectTypesAre<typeof value, `${string}world`>('notEqual');
      }

      if (stringEndsWith(value, 'orld')) {
        const ok = value;
        //      ^?
        expectTypesAre<typeof value, `${string}orld`>('equal');
      }
    });
  });
});

describe('NonEmptyString', () => {
  describe('isNonEmptyString', () => {
    test('returns true for non-empty strings', () => {
      expect(isNonEmptyString('hello')).toBe(true);
      expect(isNonEmptyString(' ')).toBe(true);
      expect(isNonEmptyString('a')).toBe(true);
      expect(isNonEmptyString('multiple words')).toBe(true);
    });

    test('returns false for empty string', () => {
      expect(isNonEmptyString('')).toBe(false);
    });

    test('type guards correctly', () => {
      const value = asType<string>('hello');

      if (isNonEmptyString(value)) {
        expectTypesAre<typeof value, NonEmptyString>('equal');
        expect(value).toBe('hello');
      }
    });
  });

  describe('asNonEmptyStringOrThrow', () => {
    test('returns the string when non-empty', () => {
      const result = asNonEmptyStringOrThrow('hello');
      expect(result).toBe('hello');
      expectTypesAre<typeof result, NonEmptyString>('equal');
    });

    test('throws error for empty string', () => {
      expect(() =>
        asNonEmptyStringOrThrow(''),
      ).toThrowErrorMatchingInlineSnapshot(`[Error: String is empty]`);
    });
  });

  describe('asNonEmptyStringOrNull', () => {
    test('returns the string when non-empty', () => {
      const result = asNonEmptyStringOrNull('hello');
      expect(result).toBe('hello');
      expectTypesAre<typeof result, NonEmptyString | null>('equal');
    });

    test('returns null for empty string', () => {
      const result = asNonEmptyStringOrNull('');
      expect(result).toBe(null);
      expectTypesAre<typeof result, NonEmptyString | null>('equal');
    });
  });

  typingTest.describe('type system', () => {
    typingTest.test('NonEmptyString type assignment', () => {
      // These should work with type guards
      const str1 = asType<string>('hello');
      if (isNonEmptyString(str1)) {
        expectTypesAre<typeof str1, NonEmptyString>('equal');
      }

      const nonEmpty2: NonEmptyString = asNonEmptyStringOrThrow('hello');
      expectTypesAre<typeof nonEmpty2, NonEmptyString>('equal');

      // @ts-expect-error - cannot directly assign string to NonEmptyString
      const invalid: NonEmptyString = 'hello';
      expectTypesAre<typeof invalid, NonEmptyString>('equal');
    });
  });
});

describe('splitTypedString', () => {
  test('splitTypedString', () => {
    const value = asType<string>('string.containsDot');

    if (stringContains(value, '.')) {
      const [first, second] = splitTypedString(value, '.');

      expectTypesAre<typeof first, string>('equal');
      expectTypesAre<typeof second, string>('equal');

      expect(first).toBe('string');
      expect(second).toBe('containsDot');
    }

    if (stringStartsWith(value, '.')) {
      const [first, second] = splitTypedString(value, '.');

      expectTypesAre<typeof first, string>('equal');
      expectTypesAre<typeof second, string>('equal');
    }

    if (stringEndsWith(value, '.')) {
      const [first, second] = splitTypedString(value, '.');

      expectTypesAre<typeof first, string>('equal');
      expectTypesAre<typeof second, string>('equal');
    }

    const literalValue = 'test.containsDot';

    const [first, second] = splitTypedString(literalValue, '.');

    expect(first).toBe('test');
    expect(second).toBe('containsDot');
  });
});

describe('splitTypedStringAt', () => {
  test('splitTypedStringAt', () => {
    const value = asType<string>('string.containsDot.inMiddle');

    if (stringContains(value, '.')) {
      const [first, second] = splitTypedStringAt(value, '.');

      expectTypesAre<typeof first, string>('equal');
      expectTypesAre<typeof second, string>('equal');

      expect(first).toBe('string');
      expect(second).toBe('containsDot.inMiddle');
    }

    if (stringStartsWith(value, '.')) {
      const [first, second] = splitTypedStringAt(value, '.');

      expectTypesAre<typeof first, string>('equal');
      expectTypesAre<typeof second, string>('equal');
    }

    if (stringEndsWith(value, '.')) {
      const [first, second] = splitTypedStringAt(value, '.');

      expectTypesAre<typeof first, string>('equal');
      expectTypesAre<typeof second, string>('equal');
    }
  });

  test('splitTypedStringAt with splitAtNSeparatorPos', () => {
    const value: StringContaining<'.'> = 'string.containsDot.inMiddle';

    expect(splitTypedStringAt(value, '.', 1)).toMatchInlineSnapshot(`
      [
        "string",
        "containsDot.inMiddle",
      ]
    `);

    expect(splitTypedStringAt(value, '.', 2)).toMatchInlineSnapshot(`
      [
        "string.containsDot",
        "inMiddle",
      ]
    `);

    expect(splitTypedStringAt(value, '.', 3)).toMatchInlineSnapshot(`
      [
        "string.containsDot.inMiddle",
        "",
      ]
    `);

    expect(splitTypedStringAt(value, '.', 100)).toMatchInlineSnapshot(`
      [
        "string.containsDot.inMiddle",
        "",
      ]
    `);
  });
});
