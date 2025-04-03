import { describe, expect, test } from 'vitest';
import {
  assertIsNotNullish,
  assertIsNotUndefined,
  invariant,
  isFunction,
  isObject,
  isPlainObject,
  isPromise,
  notNullish,
  notUndefined,
} from './assertions';

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
    expect(() => invariant(false)).toThrow(
      'Invariant violation: Invariant violation',
    );
    expect(() => invariant(false, 'custom message')).toThrow(
      'Invariant violation: custom message',
    );
  });
});

describe('isObject', () => {
  test('should return true for objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
    expect(isObject(new Object())).toBe(true);
  });

  test('should return false for non-objects', () => {
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(42)).toBe(false);
    expect(isObject('string')).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject([1, 2, 3])).toBe(false);
  });
});

describe('isFunction', () => {
  test('should return true for functions', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function () {})).toBe(true);
    expect(isFunction(isFunction)).toBe(true);
  });

  test('should return false for non-functions', () => {
    expect(isFunction({})).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction(42)).toBe(false);
    expect(isFunction('string')).toBe(false);
    expect(isFunction(true)).toBe(false);
    expect(isFunction([])).toBe(false);
  });
});

describe('isPromise', () => {
  test('should return true for promises', () => {
    expect(isPromise(Promise.resolve())).toBe(true);
    expect(isPromise(new Promise(() => {}))).toBe(true);
  });

  test('should return false for non-promises', () => {
    expect(isPromise({})).toBe(false);
    expect(isPromise(null)).toBe(false);
    expect(isPromise(undefined)).toBe(false);
    expect(isPromise(42)).toBe(false);
    expect(isPromise('string')).toBe(false);
    expect(isPromise(true)).toBe(false);
    expect(isPromise([])).toBe(false);
    expect(isPromise({ then: 'not a function' })).toBe(false); // This is NOT a thenable object
  });
});

describe('isPlainObject', () => {
  test('should return true for plain objects', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
  });

  test('should return false for non-plain objects', () => {
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
    expect(isPlainObject(42)).toBe(false);
    expect(isPlainObject('string')).toBe(false);
    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(/regex/)).toBe(false);

    class TestClass {}
    expect(isPlainObject(new TestClass())).toBe(false);
  });
});
