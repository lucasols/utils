import { sleep } from '@ls-stack/utils/sleep';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { blockWindowClose } from './blockWindowClose';

// Mock window and console
const mockConsoleError = vi.fn();
const mockAlert = vi.fn();

Object.defineProperty(global, 'window', {
  value: {
    onbeforeunload: null,
  },
  writable: true,
});

Object.defineProperty(global, 'console', {
  value: {
    error: mockConsoleError,
  },
  writable: true,
});

Object.defineProperty(global, 'alert', {
  value: mockAlert,
  writable: true,
});

describe('blockWindowClose', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.onbeforeunload = null;
    // Mock NODE_ENV for development warnings
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env.NODE_ENV = 'test';
  });

  it('should set window.onbeforeunload when blocking', () => {
    expect(window.onbeforeunload).toBe(null);

    const blocker = blockWindowClose();

    expect(window.onbeforeunload).toBeDefined();
    expect(typeof window.onbeforeunload).toBe('function');

    blocker.unblock();
  });

  it('should return true from onbeforeunload handler', () => {
    const blocker = blockWindowClose();

    const result = window.onbeforeunload?.(new Event('beforeunload'));
    expect(result).toBe(true);

    blocker.unblock();
  });

  it('should remove onbeforeunload when unblocking', () => {
    const blocker = blockWindowClose();
    expect(window.onbeforeunload).toBeDefined();

    blocker.unblock();

    expect(window.onbeforeunload).toBe(null);
  });

  it('should support multiple simultaneous blocks', () => {
    const blocker1 = blockWindowClose('ctx1');
    const blocker2 = blockWindowClose('ctx2');

    expect(window.onbeforeunload).toBeDefined();

    // Unblocking one should not remove the handler
    blocker1.unblock();
    expect(window.onbeforeunload).toBeDefined();

    // Unblocking all should remove the handler
    blocker2.unblock();
    expect(window.onbeforeunload).toBe(null);
  });

  it('should work with custom context', () => {
    const blocker = blockWindowClose('custom-context');

    expect(window.onbeforeunload).toBeDefined();

    blocker.unblock();
    expect(window.onbeforeunload).toBe(null);
  });

  it('should work with numeric context', () => {
    const blocker = blockWindowClose(12345);

    expect(window.onbeforeunload).toBeDefined();

    blocker.unblock();
    expect(window.onbeforeunload).toBe(null);
  });

  it('should support Symbol.dispose for cleanup', () => {
    const blocker = blockWindowClose('dispose-test');

    expect(window.onbeforeunload).toBeDefined();

    blocker[Symbol.dispose]();

    expect(window.onbeforeunload).toBe(null);
  });

  it('should handle multiple blocks with same context gracefully', () => {
    const blocker1 = blockWindowClose('same-ctx');
    const blocker2 = blockWindowClose('same-ctx');

    expect(window.onbeforeunload).toBeDefined();

    // Unblocking one should remove the handler since it's the same context
    blocker1.unblock();
    expect(window.onbeforeunload).toBe(null);

    // Second unblock should be safe (no error)
    expect(() => blocker2.unblock()).not.toThrow();
  });

  it('should set up development warning timeout', async () => {
    process.env.NODE_ENV = 'development';

    const blocker = blockWindowClose('dev-warning', 100);

    // Wait for warning to trigger
    await sleep(120);

    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Blocking window close not disposed',
      }),
    );
    expect(mockAlert).toHaveBeenCalledWith(
      'There is probably a not disposed window close, check the console',
    );

    blocker.unblock();
  });

  it('should not set up development warning in production', async () => {
    process.env.NODE_ENV = 'production';

    const blocker = blockWindowClose('prod-test', 50);

    await sleep(70);

    expect(mockConsoleError).not.toHaveBeenCalled();
    expect(mockAlert).not.toHaveBeenCalled();

    blocker.unblock();
  });

  it('should clean up timeout when unblocked before warning', async () => {
    process.env.NODE_ENV = 'development';

    const blocker = blockWindowClose('cleanup-test', 100);

    // Unblock before timeout
    await sleep(30);
    blocker.unblock();

    // Continue past original timeout
    await sleep(80);

    expect(mockConsoleError).not.toHaveBeenCalled();
    expect(mockAlert).not.toHaveBeenCalled();
  });

  it('should use default timeout warning of 120 seconds', async () => {
    process.env.NODE_ENV = 'development';

    const blocker = blockWindowClose('default-timeout', 50);

    // Wait for just before timeout
    await sleep(30);
    expect(mockConsoleError).not.toHaveBeenCalled();

    // Wait for timeout to trigger
    await sleep(30);
    expect(mockConsoleError).toHaveBeenCalled();

    blocker.unblock();
  });

  it('should handle rapid block/unblock cycles', () => {
    const blockers = [];

    // Create many blockers rapidly
    for (let i = 0; i < 10; i++) {
      blockers.push(blockWindowClose(`rapid-${i}`));
    }

    expect(window.onbeforeunload).toBeDefined();

    // Unblock all rapidly
    blockers.forEach((blocker) => blocker.unblock());

    expect(window.onbeforeunload).toBe(null);
  });

  it('should be safe to call unblock multiple times', () => {
    const blocker = blockWindowClose('multi-unblock');

    expect(window.onbeforeunload).toBeDefined();

    blocker.unblock();
    expect(window.onbeforeunload).toBe(null);

    // Should be safe to call again
    expect(() => blocker.unblock()).not.toThrow();
    expect(window.onbeforeunload).toBe(null);
  });

  it('should be safe to call Symbol.dispose multiple times', () => {
    const blocker = blockWindowClose('multi-dispose');

    expect(window.onbeforeunload).toBeDefined();

    blocker[Symbol.dispose]();
    expect(window.onbeforeunload).toBe(null);

    // Should be safe to call again
    expect(() => blocker[Symbol.dispose]()).not.toThrow();
    expect(window.onbeforeunload).toBe(null);
  });

  it('should handle mixed unblock and dispose calls', () => {
    const blocker1 = blockWindowClose('mixed1');
    const blocker2 = blockWindowClose('mixed2');

    expect(window.onbeforeunload).toBeDefined();

    blocker1.unblock();
    expect(window.onbeforeunload).toBeDefined();

    blocker2[Symbol.dispose]();
    expect(window.onbeforeunload).toBe(null);
  });
});
