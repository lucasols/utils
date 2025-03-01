import { expect, test } from 'vitest';
import { castToNumber } from './castValues';

test('castToNumber should convert string numbers to numbers', () => {
  expect(castToNumber('123')).toBe(123);
  expect(castToNumber('0')).toBe(0);
  expect(castToNumber('-123')).toBe(-123);
  expect(castToNumber('123.456')).toBe(123.456);
});

test('castToNumber should convert actual numbers to numbers', () => {
  expect(castToNumber(123)).toBe(123);
  expect(castToNumber(0)).toBe(0);
  expect(castToNumber(-123)).toBe(-123);
  expect(castToNumber(123.456)).toBe(123.456);
});

test('castToNumber should return null for boolean values', () => {
  expect(castToNumber(true)).toBeNull();
  expect(castToNumber(false)).toBeNull();
});

test('castToNumber should convert BigInt to numbers', () => {
  expect(castToNumber(BigInt(123))).toBe(123);
  expect(castToNumber(BigInt(0))).toBe(0);
});

test('castToNumber should return null for non-numeric strings', () => {
  expect(castToNumber('abc')).toBeNull();
  expect(castToNumber('123abc')).toBeNull();
  expect(castToNumber('abc123')).toBeNull();
});

test('castToNumber should return null for non-numeric values', () => {
  expect(castToNumber(null)).toBeNull();
  expect(castToNumber(undefined)).toBeNull();
  expect(castToNumber({})).toBeNull();
  expect(castToNumber([])).toBeNull();
  expect(castToNumber([1, 2, 3])).toBeNull();
  expect(castToNumber(new Date())).toBeNull();
});

test('castToNumber should handle edge cases', () => {
  expect(castToNumber('')).toBeNull();
  expect(castToNumber(' ')).toBeNull();
  expect(castToNumber('Infinity')).toBeNull();
  expect(castToNumber('-Infinity')).toBeNull();
  expect(castToNumber(Infinity)).toBeNull();
  expect(castToNumber(-Infinity)).toBeNull();
  expect(castToNumber('NaN')).toBeNull();
  expect(castToNumber(NaN)).toBeNull();
});
