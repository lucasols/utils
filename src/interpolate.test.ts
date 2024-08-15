import { describe, expect, test } from 'vitest';
import { interpolate } from './interpolate';

describe('interpolate', () => {
  test('should interpolate between two values', () => {
    expect(interpolate(0, [0, 100], [100, 200])).toBe(100);
    expect(interpolate(50, [0, 100], [100, 200])).toBe(150);
    expect(interpolate(100, [0, 100], [100, 200])).toBe(200);
  });

  test('clamp out of range values by default', () => {
    expect(interpolate(-100, [0, 100], [100, 200])).toBe(100);
    expect(interpolate(300, [0, 100], [100, 200])).toBe(200);
  });

  test('do not clamp out of range values', () => {
    expect(interpolate(-100, [0, 100], [100, 200], false)).toBe(0);
    expect(interpolate(200, [0, 100], [100, 200], false)).toBe(300);
  });

  test('clamp start', () => {
    expect(interpolate(-100, [0, 100], [100, 200], 'start')).toBe(100);
    expect(interpolate(200, [0, 100], [100, 200], 'start')).toBe(300);
  });

  test('clamp end', () => {
    expect(interpolate(-100, [0, 100], [100, 200], 'end')).toBe(0);
    expect(interpolate(200, [0, 100], [100, 200], 'end')).toBe(200);
  });

  test('throw if ranges are not the same length', () => {
    expect(() => interpolate(0, [0, 100], [100, 200, 300])).toThrowError(
      'Ranges must have the same length',
    );
  });
});
