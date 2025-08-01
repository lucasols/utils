import { describe, expect, test } from 'vitest';

// Simple test to verify the module loads correctly
describe('runShellCmd', () => {
  test('should export runCmd function', async () => {
    const { runCmd } = await import('./runShellCmd');
    expect(typeof runCmd).toBe('function');
  });

  test('should run a simple command', async () => {
    const { runCmd } = await import('./runShellCmd');
    const result = await runCmd('echo test', ['echo', 'hello world'], {
      silent: true,
    });
    expect(result.stdout.trim()).toBe('hello world');
    expect(result.error).toBe(false);
  });
});
