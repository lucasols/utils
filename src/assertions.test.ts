import { describe, expect, test } from 'vitest';
import {
  assertIsNotNullish,
  assertIsNotUndefined,
  invariant,
  notNullish,
  notUndefined,
} from './assertions';

class CustomError extends Error {
  constructor(message: string) {
    super(message);
  }
}

describe('notUndefined', () => {
  test('should return the value when not undefined', () => {
    expect(notUndefined(5)).toBe(5);
    expect(notUndefined('hello')).toBe('hello');
    expect(notUndefined(null)).toBe(null);
    expect(notUndefined(false)).toBe(false);
  });

  test('should throw error when undefined', () => {
    expect(() => notUndefined(undefined)).toThrow(
      'not undefined assertion failed',
    );
    expect(() => notUndefined(undefined, 'custom message')).toThrow(
      'custom message',
    );
    expect(() =>
      notUndefined(undefined, () => new CustomError('custom message')),
    ).toThrow(new CustomError('custom message'));
  });
});

describe('notNullish', () => {
  test('should return the value when not nullish', () => {
    expect(notNullish(5)).toBe(5);
    expect(notNullish('hello')).toBe('hello');
    expect(notNullish(false)).toBe(false);
  });

  test('should throw error when undefined', () => {
    expect(() => notNullish(undefined)).toThrow('not nullish assertion failed');
    expect(() => notNullish(undefined, 'custom message')).toThrow(
      'custom message',
    );
    expect(() =>
      notNullish(null, () => new CustomError('custom message')),
    ).toThrow(new CustomError('custom message'));
  });

  test('should throw error when null', () => {
    expect(() => notNullish(null)).toThrow('not nullish assertion failed');
    expect(() => notNullish(null, 'custom message')).toThrow('custom message');
  });
});

describe('assertIsNotNullish', () => {
  test('should not throw when value is not nullish', () => {
    expect(() => assertIsNotNullish(5)).not.toThrow();
    expect(() => assertIsNotNullish('hello')).not.toThrow();
    expect(() => assertIsNotNullish(false)).not.toThrow();
  });

  test('should throw error when undefined', () => {
    expect(() => assertIsNotNullish(undefined)).toThrow(
      'not nullish assertion failed',
    );
    expect(() => assertIsNotNullish(undefined, 'custom message')).toThrow(
      'custom message',
    );
    expect(() =>
      assertIsNotNullish(undefined, () => new CustomError('custom message')),
    ).toThrow(new CustomError('custom message'));
  });

  test('should throw error when null', () => {
    expect(() => assertIsNotNullish(null)).toThrow(
      'not nullish assertion failed',
    );
    expect(() => assertIsNotNullish(null, 'custom message')).toThrow(
      'custom message',
    );
  });
});

describe('assertIsNotUndefined', () => {
  test('should not throw when value is not undefined', () => {
    expect(() => assertIsNotUndefined(5)).not.toThrow();
    expect(() => assertIsNotUndefined('hello')).not.toThrow();
    expect(() => assertIsNotUndefined(null)).not.toThrow();
    expect(() => assertIsNotUndefined(false)).not.toThrow();
  });

  test('should throw error when undefined', () => {
    expect(() => assertIsNotUndefined(undefined)).toThrow(
      'not undefined assertion failed',
    );
    expect(() => assertIsNotUndefined(undefined, 'custom message')).toThrow(
      'custom message',
    );
    expect(() =>
      assertIsNotUndefined(undefined, () => new CustomError('custom message')),
    ).toThrow(new CustomError('custom message'));
  });
});

describe('invariant', () => {
  test('should not throw when condition is true', () => {
    expect(() => invariant(true)).not.toThrow();
    expect(() => invariant(1)).not.toThrow();
    expect(() => invariant('a')).not.toThrow();
    expect(() => invariant({})).not.toThrow();
  });

  test('should throw when condition is false', () => {
    expect(() => invariant(false)).toThrow('Invariant violation');
    expect(() => invariant(false, 'custom message')).toThrow(
      'Invariant violation: custom message',
    );
    expect(() =>
      invariant(false, () => new CustomError('custom message')),
    ).toThrow(new CustomError('custom message'));
  });
});
