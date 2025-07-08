import { describe, expect, test } from 'vitest';
import { unionsAreTheSame } from './typingFnUtils';

type AVeryLargeTypeNameJustToImproveReadability<T> = T;

describe('unionsAreTheSame', () => {
  test('basic string unions', () => {
    // unions are the same
    unionsAreTheSame<
      AVeryLargeTypeNameJustToImproveReadability<'a' | 'b' | 'c'>,
      AVeryLargeTypeNameJustToImproveReadability<'a' | 'b' | 'c'>
    >(null);

    // unions on right have extra items
    unionsAreTheSame<
      AVeryLargeTypeNameJustToImproveReadability<'a' | 'b' | 'c'>,
      AVeryLargeTypeNameJustToImproveReadability<'a' | 'b' | 'c' | 'd'>
    >({
      onRightHasExtra: 'd',
    });

    // unions on right have missing items
    unionsAreTheSame<
      AVeryLargeTypeNameJustToImproveReadability<'a' | 'b' | 'c' | 'd'>,
      AVeryLargeTypeNameJustToImproveReadability<'a' | 'b' | 'c'>
    >({
      onRightHasMissing: 'd',
    });

    expect(true).toBe(true);
  });

  test('mixed primitive unions', () => {
    // same mixed unions
    unionsAreTheSame<
      string | number | boolean,
      string | number | boolean
    >(null);

    // right has extra primitive
    unionsAreTheSame<
      string | number,
      string | number | boolean
    >({
      onRightHasExtra: true,
    });

    // right has missing primitive
    unionsAreTheSame<
      string | number | boolean,
      string | number
    >({
      onRightHasMissing: true,
    });

    // completely different unions
    unionsAreTheSame<
      string | number,
      boolean | symbol
    >({
      onRightHasExtra: Symbol(),
      onRightHasMissing: 'test',
    });

    expect(true).toBe(true);
  });

  test('object union types', () => {
    type User = { type: 'user'; name: string };
    type Admin = { type: 'admin'; permissions: string[] };
    type Guest = { type: 'guest' };

    // same object unions
    unionsAreTheSame<
      User | Admin,
      User | Admin
    >(null);

    // right has extra object type
    unionsAreTheSame<
      User | Admin,
      User | Admin | Guest
    >({
      onRightHasExtra: { type: 'guest' },
    });

    // right has missing object type
    unionsAreTheSame<
      User | Admin | Guest,
      User | Admin
    >({
      onRightHasMissing: { type: 'guest' },
    });

    expect(true).toBe(true);
  });

  test('edge cases', () => {
    // single type vs single type (same)
    unionsAreTheSame<string, string>(null);

    // single type vs union with that type
    unionsAreTheSame<
      string,
      string | number
    >({
      onRightHasExtra: 42,
    });

    // union vs single type
    unionsAreTheSame<
      string | number,
      string
    >({
      onRightHasMissing: 42,
    });

    // empty object vs object with properties
    unionsAreTheSame<
      Record<string, never>,
      { name: string }
    >({
      onRightHasExtra: { name: 'test' },
      onRightHasMissing: {} as Record<string, never>,
    });

    expect(true).toBe(true);
  });

  test('number and boolean unions', () => {
    // number literal unions
    unionsAreTheSame<1 | 2 | 3, 1 | 2 | 3>(null);

    unionsAreTheSame<
      1 | 2,
      1 | 2 | 3
    >({
      onRightHasExtra: 3,
    });

    unionsAreTheSame<
      1 | 2 | 3,
      1 | 2
    >({
      onRightHasMissing: 3,
    });

    // boolean literal unions
    unionsAreTheSame<true, true>(null);

    unionsAreTheSame<
      true,
      true | false
    >({
      onRightHasExtra: false,
    });

    unionsAreTheSame<
      true | false,
      true
    >({
      onRightHasMissing: false,
    });

    expect(true).toBe(true);
  });

  test('unions with both extra and missing items', () => {
    // completely different unions
    unionsAreTheSame<
      'a' | 'b' | 'c',
      'b' | 'c' | 'd'
    >({
      onRightHasExtra: 'd',
      onRightHasMissing: 'a',
    });

    // overlapping with multiple differences
    unionsAreTheSame<
      1 | 2 | 3 | 4,
      2 | 3 | 5 | 6
    >({
      onRightHasExtra: 5,
      onRightHasMissing: 1,
    });

    // mixed types with differences
    unionsAreTheSame<
      string | number | boolean,
      number | symbol | object
    >({
      onRightHasExtra: Symbol(),
      onRightHasMissing: 'test',
    });

    expect(true).toBe(true);
  });
});
