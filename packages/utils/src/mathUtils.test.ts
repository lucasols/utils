import { expect, test } from 'vitest';
import { fixFloatingPointNumber, roundToStep, floorToStep, ceilToStep, round } from './mathUtils';

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

test('roundToStep', () => {
  // Basic rounding
  expect(roundToStep(23, 5)).toBe(25);
  expect(roundToStep(22, 5)).toBe(20);
  expect(roundToStep(12.5, 5)).toBe(15);
  expect(roundToStep(12.6, 5)).toBe(15);

  // With offset
  expect(roundToStep(23, 5, 1)).toBe(21);
  expect(roundToStep(24, 5, 1)).toBe(26);

  // Negative values
  expect(roundToStep(-23, 5)).toBe(-25);
  expect(roundToStep(-22, 5)).toBe(-20);

  // Negative steps
  expect(roundToStep(23, -5)).toBe(25);
  expect(roundToStep(22, -5)).toBe(20);

  // Decimal steps
  expect(roundToStep(1.23, 0.1)).toBe(1.2);
  expect(roundToStep(1.26, 0.1)).toBe(1.3);

  // Very small steps
  expect(roundToStep(1.2345, 0.001)).toBe(1.235);

  // Zero value
  expect(roundToStep(0, 5)).toBe(0);
});

test('floorToStep', () => {
  // Basic flooring
  expect(floorToStep(23, 5)).toBe(20);
  expect(floorToStep(22, 5)).toBe(20);
  expect(floorToStep(25, 5)).toBe(25);
  expect(floorToStep(28, 5)).toBe(25);

  // With offset
  expect(floorToStep(23, 5, 1)).toBe(21);
  expect(floorToStep(25, 5, 1)).toBe(21);
  expect(floorToStep(26, 5, 1)).toBe(26);

  // Negative values
  expect(floorToStep(-23, 5)).toBe(-25);
  expect(floorToStep(-22, 5)).toBe(-25);
  expect(floorToStep(-20, 5)).toBe(-20);

  // Negative steps (semantics are inverted with negative step)
  expect(floorToStep(23, -5)).toBe(25);
  expect(floorToStep(22, -5)).toBe(25);

  // Decimal steps
  expect(floorToStep(1.26, 0.1)).toBe(1.2);
  expect(floorToStep(1.29, 0.1)).toBe(1.2);

  // Zero value
  expect(floorToStep(0, 5)).toBe(0);
});

test('ceilToStep', () => {
  // Basic ceiling
  expect(ceilToStep(23, 5)).toBe(25);
  expect(ceilToStep(22, 5)).toBe(25);
  expect(ceilToStep(25, 5)).toBe(25);
  expect(ceilToStep(21, 5)).toBe(25);

  // With offset
  expect(ceilToStep(23, 5, 1)).toBe(26);
  expect(ceilToStep(21, 5, 1)).toBe(21);
  expect(ceilToStep(22, 5, 1)).toBe(26);

  // Negative values
  expect(ceilToStep(-23, 5)).toBe(-20);
  expect(ceilToStep(-22, 5)).toBe(-20);
  expect(ceilToStep(-25, 5)).toBe(-25);

  // Negative steps (semantics are inverted with negative step)
  expect(ceilToStep(23, -5)).toBe(20);
  expect(ceilToStep(22, -5)).toBe(20);

  // Decimal steps
  expect(ceilToStep(1.21, 0.1)).toBe(1.3);
  expect(ceilToStep(1.20, 0.1)).toBe(1.2);

  // Zero value
  expect(ceilToStep(0, 5)).toBe(0);
});

test('round', () => {
  // Basic rounding
  expect(round(3.14159, 2)).toBe(3.14);
  expect(round(3.14159, 3)).toBe(3.142);
  expect(round(3.14159, 0)).toBe(3);
  expect(round(3.14159, 4)).toBe(3.1416);

  // Rounding edge cases
  expect(round(2.5, 0)).toBe(3);
  expect(round(-2.5, 0)).toBe(-2);

  // Zero precision
  expect(round(123.456, 0)).toBe(123);

  // High precision
  expect(round(1.123456789, 5)).toBe(1.12346);

  // Negative numbers
  expect(round(-3.14159, 2)).toBe(-3.14);
  expect(round(-123.456, 1)).toBe(-123.5);

  // Zero value
  expect(round(0, 2)).toBe(0);

  // Very small numbers
  expect(round(0.000123456, 6)).toBe(0.000123);
});
