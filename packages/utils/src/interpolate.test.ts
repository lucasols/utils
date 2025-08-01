import { describe, expect, test } from 'vitest';
import { interpolate } from './interpolate';

describe('interpolate', () => {
  test('should interpolate between two values', () => {
    expect(interpolate({ input: 0, in: [0, 100], out: [100, 200] })).toBe(100);
    expect(interpolate({ input: 50, in: [0, 100], out: [100, 200] })).toBe(150);
    expect(interpolate({ input: 100, in: [0, 100], out: [100, 200] })).toBe(
      200,
    );
  });

  test('clamp out of range values by default', () => {
    expect(interpolate({ input: -100, in: [0, 100], out: [100, 200] })).toBe(
      100,
    );
    expect(interpolate({ input: 300, in: [0, 100], out: [100, 200] })).toBe(
      200,
    );
  });

  test('do not clamp out of range values', () => {
    expect(
      interpolate({ input: -100, in: [0, 100], out: [100, 200], clamp: false }),
    ).toBe(0);
    expect(
      interpolate({ input: 200, in: [0, 100], out: [100, 200], clamp: false }),
    ).toBe(300);
  });

  test('clamp start', () => {
    expect(
      interpolate({
        input: -100,
        in: [0, 100],
        out: [100, 200],
        clamp: 'start',
      }),
    ).toBe(100);
    expect(
      interpolate({
        input: 200,
        in: [0, 100],
        out: [100, 200],
        clamp: 'start',
      }),
    ).toBe(300);
  });

  test('clamp end', () => {
    expect(
      interpolate({ input: -100, in: [0, 100], out: [100, 200], clamp: 'end' }),
    ).toBe(0);
    expect(
      interpolate({ input: 200, in: [0, 100], out: [100, 200], clamp: 'end' }),
    ).toBe(200);
  });

  test('throw if ranges are not the same length', () => {
    expect(() =>
      interpolate({ input: 0, in: [0, 100], out: [100, 200, 300] }),
    ).toThrowError('Ranges must have the same length');
  });
});
