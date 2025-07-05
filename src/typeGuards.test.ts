import { describe, expect, test } from 'vitest';
import { isFunction, isObject, isPlainObject, isPromise } from './typeGuards';

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
