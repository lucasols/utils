import { expect, test } from 'vitest';
import { fixFloatingPointNumber } from './mathUtils';

test('fixFloatingPointNumber', () => {
  expect(fixFloatingPointNumber(0.123456789)).toBe(0.123456789);

  // Basic multiplication
  expect(fixFloatingPointNumber(0.57 * 100)).toBe(57);
  expect(fixFloatingPointNumber(0.57 * 10000000000)).toBe(5700000000);
  expect(fixFloatingPointNumber(9.99 * 5)).toBe(49.95);
  expect(fixFloatingPointNumber(8.04 * 25)).toBe(201);

  // Direct values
  expect(fixFloatingPointNumber(0.99)).toBe(0.99);
  expect(fixFloatingPointNumber(1234.5)).toBe(1234.5);
  expect(fixFloatingPointNumber(1.005)).toBe(1.005);
  expect(fixFloatingPointNumber(1000.57)).toBe(1000.57);

  // Addition
  expect(fixFloatingPointNumber(0.1 + 0.2)).toBe(0.3);

  // Subtraction cases
  expect(fixFloatingPointNumber(0.3 - 0.1)).toBe(0.2);
  expect(fixFloatingPointNumber(1.0 - 0.9)).toBe(0.1);

  // Division cases
  expect(fixFloatingPointNumber(0.3 / 0.1)).toBe(3);
  expect(fixFloatingPointNumber(355 / 113)).toBe(3.14159292035398);

  // Edge cases
  expect(fixFloatingPointNumber(0)).toBe(0);
  expect(fixFloatingPointNumber(-0)).toBe(0);
  expect(fixFloatingPointNumber(-1.23)).toBe(-1.23);

  // Very small numbers
  expect(fixFloatingPointNumber(0.000000001)).toBe(0.000000001);

  // Repeating decimals
  expect(fixFloatingPointNumber(1 / 3)).toBe(0.333333333333333);
  expect(fixFloatingPointNumber(2 / 3)).toBe(0.666666666666667);
});
