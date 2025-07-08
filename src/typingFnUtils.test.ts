import { describe, expect, test } from 'vitest';
import { unionsAreTheSame } from './typingFnUtils';

type AVeryLargeTypeNameJustToImproveReadability<T> = T;

describe('unionsAreTheSame', () => {
  test('ok', () => {
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
});
