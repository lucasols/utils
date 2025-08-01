import { describe, expect, test } from 'vitest';

describe('node-utils main', () => {
  test('should export deprecated function', async () => {
    const { deprecated } = await import('./main');
    expect(typeof deprecated).toBe('function');
    expect(() => deprecated()).toThrow('This package does not export a main module');
  });
});