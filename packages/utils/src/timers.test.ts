import { describe, expect, test, vi } from 'vitest';
import {
  createDebouncedTimeout,
  createInterval,
  createTimeout,
  createWaitUntil,
  waitFor,
} from './timers';
import { sleep } from './sleep';

describe('timers', { retry: 2 }, () => {
  describe('createTimeout', () => {
    test('should execute callback after specified time', async () => {
      const callback = vi.fn();
      createTimeout(50, callback);

      expect(callback).not.toHaveBeenCalled();

      await new Promise((resolve) => setTimeout(resolve, 60));

      expect(callback).toHaveBeenCalledOnce();
    });

    test('should not execute callback if cleaned up before timeout', async () => {
      const callback = vi.fn();
      const cleanup = createTimeout(50, callback);

      cleanup();

      await new Promise((resolve) => setTimeout(resolve, 60));

      expect(callback).not.toHaveBeenCalled();
    });

    test('should be safe to call cleanup multiple times', async () => {
      const callback = vi.fn();
      const cleanup = createTimeout(50, callback);

      cleanup();
      cleanup();
      cleanup();

      await new Promise((resolve) => setTimeout(resolve, 60));

      expect(callback).not.toHaveBeenCalled();
    });

    test('should not throw when cleanup is called after timeout completes', async () => {
      const callback = vi.fn();
      const cleanup = createTimeout(10, callback);

      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(() => cleanup()).not.toThrow();
      expect(callback).toHaveBeenCalledOnce();
    });
  });

  describe('createInterval', () => {
    test('should execute callback multiple times at intervals', async () => {
      const callback = vi.fn();
      const cleanup = createInterval(25, callback);

      await new Promise((resolve) => setTimeout(resolve, 90));

      cleanup();

      expect(callback).toHaveBeenCalledTimes(3);
    });

    test('should not execute callback if cleaned up immediately', async () => {
      const callback = vi.fn();
      const cleanup = createInterval(25, callback);

      cleanup();

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(callback).not.toHaveBeenCalled();
    });

    test('should stop executing after cleanup', async () => {
      const callback = vi.fn();
      const cleanup = createInterval(20, callback);

      await new Promise((resolve) => setTimeout(resolve, 45));

      const callCountBeforeCleanup = callback.mock.calls.length;
      cleanup();

      await new Promise((resolve) => setTimeout(resolve, 45));

      expect(callback).toHaveBeenCalledTimes(callCountBeforeCleanup);
    });

    test('should be safe to call cleanup multiple times', async () => {
      const callback = vi.fn();
      const cleanup = createInterval(25, callback);

      await new Promise((resolve) => setTimeout(resolve, 30));

      cleanup();
      cleanup();
      cleanup();

      expect(() => cleanup()).not.toThrow();
    });
  });

  describe('createNoConcurrentTimeout', () => {
    test('should execute callback only once when called multiple times', async () => {
      const callback = vi.fn();
      const { call } = createDebouncedTimeout(50, callback);

      call();
      call();
      call();

      await new Promise((resolve) => setTimeout(resolve, 60));

      expect(callback).toHaveBeenCalledOnce();
    });

    test('should cancel previous timeout when called again', async () => {
      const callback = vi.fn();
      const { call } = createDebouncedTimeout(100, callback);

      call();

      await new Promise((resolve) => setTimeout(resolve, 50));

      call(); // Should cancel the first one

      await new Promise((resolve) => setTimeout(resolve, 110)); // Wait longer than the timeout duration

      expect(callback).toHaveBeenCalledOnce();
    });

    test('should not execute callback if cleaned up', async () => {
      const callback = vi.fn();
      const { call, clean } = createDebouncedTimeout(50, callback);

      call();
      clean();

      await new Promise((resolve) => setTimeout(resolve, 60));

      expect(callback).not.toHaveBeenCalled();
    });

    test('should be safe to call clean multiple times', () => {
      const callback = vi.fn();
      const { clean } = createDebouncedTimeout(50, callback);

      expect(() => {
        clean();
        clean();
        clean();
      }).not.toThrow();
    });

    test('should handle calling call after clean', async () => {
      const callback = vi.fn();
      const { call, clean } = createDebouncedTimeout(50, callback);

      clean();
      call();

      await new Promise((resolve) => setTimeout(resolve, 60));

      expect(callback).toHaveBeenCalledOnce();
    });
  });

  describe('createConditionTimeout', () => {
    test('should call callback when condition becomes true', async () => {
      let conditionResult: string | false = false;
      const callback = vi.fn();

      createWaitUntil({
        condition: () => conditionResult,
        maxWaitMs: 200,
        callback,
        checkIntervalMs: 10,
      });

      setTimeout(() => {
        conditionResult = 'success';
      }, 50);

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(callback).toHaveBeenCalledWith('success');
    });

    test('should not call callback if condition never becomes true', async () => {
      const callback = vi.fn();

      createWaitUntil({
        condition: () => false,
        maxWaitMs: 50,
        callback,
        checkIntervalMs: 10,
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(callback).not.toHaveBeenCalled();
    });

    test('should call callback immediately if condition is already true', async () => {
      const callback = vi.fn();

      createWaitUntil({
        condition: () => 'immediate',
        maxWaitMs: 200,
        callback,
        checkIntervalMs: 10,
      });

      await new Promise((resolve) => setTimeout(resolve, 5));

      expect(callback).toHaveBeenCalledWith('immediate');
    });

    test('should not call callback if cleaned up before condition becomes true', async () => {
      let conditionResult: string | false = false;
      const callback = vi.fn();

      const cleanup = createWaitUntil({
        condition: () => conditionResult,
        maxWaitMs: 200,
        callback,
        checkIntervalMs: 10,
      });

      setTimeout(() => {
        conditionResult = 'success';
      }, 100);

      cleanup();

      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(callback).not.toHaveBeenCalled();
    });

    test('should stop checking after max wait time', async () => {
      let checkCount = 0;
      const callback = vi.fn();

      createWaitUntil({
        condition: () => {
          checkCount++;
          return false;
        },
        maxWaitMs: 50,
        callback,
        checkIntervalMs: 10,
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      const finalCheckCount = checkCount;

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(checkCount).toBe(finalCheckCount);
      expect(callback).not.toHaveBeenCalled();
    });

    test('should use default check interval of 20ms', async () => {
      let checkCount = 0;
      const callback = vi.fn();

      createWaitUntil({
        condition: () => {
          checkCount++;
          if (checkCount >= 3) return 'done';
          return false;
        },
        maxWaitMs: 200,
        callback,
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(callback).toHaveBeenCalledWith('done');
      expect(checkCount).toBeGreaterThanOrEqual(3);
    });

    test('should handle complex condition types', async () => {
      interface TestObject {
        id: number;
        name: string;
      }

      let testObj: TestObject | false = false;
      const callback = vi.fn();

      createWaitUntil({
        condition: () => testObj,
        maxWaitMs: 200,
        callback,
        checkIntervalMs: 10,
      });

      setTimeout(() => {
        testObj = { id: 1, name: 'test' };
      }, 50);

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(callback).toHaveBeenCalledWith({ id: 1, name: 'test' });
    });

    test('should be safe to call cleanup multiple times', () => {
      const callback = vi.fn();

      const cleanup = createWaitUntil({
        condition: () => false,
        maxWaitMs: 100,
        callback,
        checkIntervalMs: 10,
      });

      expect(() => {
        cleanup();
        cleanup();
        cleanup();
      }).not.toThrow();
    });
  });

  describe('waitFor', () => {
    test('should resolve immediately if condition is already true', async () => {
      const result = await waitFor(
        () => true,
        { polling: 10, timeout: 100 },
      );

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(undefined);
      }
    });

    test('should resolve when condition becomes true with numeric polling', async () => {
      let conditionResult = false;
      const startTime = Date.now();

      setTimeout(() => {
        conditionResult = true;
      }, 50);

      const result = await waitFor(
        () => conditionResult,
        { polling: 10, timeout: 200 },
      );

      const elapsed = Date.now() - startTime;
      expect(result.ok).toBe(true);
      expect(elapsed).toBeGreaterThan(40); // Should take at least ~50ms
      expect(elapsed).toBeLessThan(100); // But not too much longer
    });

    test('should timeout if condition never becomes true', async () => {
      const startTime = Date.now();

      const result = await waitFor(
        () => false,
        { polling: 10, timeout: 50 },
      );

      const elapsed = Date.now() - startTime;
      expect(result.ok).toBe(false);
      expect(elapsed).toBeGreaterThan(40); // Should wait for timeout
      expect(elapsed).toBeLessThan(80); // But not too much longer

      if (!result.ok) {
        expect(result.error.message).toContain('Timeout of 50ms exceeded');
      }
    });

    test('should handle condition that throws an error', async () => {
      const result = await waitFor(
        () => {
          throw new Error('Condition error');
        },
        { polling: 10, timeout: 100 },
      );

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('Condition check failed');
        expect(result.error.message).toContain('Condition error');
      }
    });

    test('should handle requestAnimationFrame polling in browser environment', async () => {
      // Mock requestAnimationFrame and cancelAnimationFrame
      const mockRaf = vi.fn();
      const mockCancelRaf = vi.fn();

      vi.stubGlobal('requestAnimationFrame', mockRaf);
      vi.stubGlobal('cancelAnimationFrame', mockCancelRaf);

      let conditionResult = false;
      let rafCallback: (() => void) | null = null;

      mockRaf.mockImplementation((callback: () => void) => {
        rafCallback = callback;
        return 1; // Mock frame ID
      });

      const resultPromise = waitFor(
        () => conditionResult,
        { polling: 'raf', timeout: 100 },
      );

      // Give a moment for the initial async check to complete and RAF to be set up
      await sleep(5);

      // Simulate first RAF call
      expect(mockRaf).toHaveBeenCalledTimes(1);
      expect(rafCallback).toBeTruthy();

      // Call the RAF callback (condition still false)
      rafCallback!();

      // Give time for the async condition check to complete and schedule another RAF
      await sleep(5);

      // Should schedule another RAF
      expect(mockRaf).toHaveBeenCalledTimes(2);

      // Now make condition true and call RAF callback again
      conditionResult = true;
      rafCallback!();

      const result = await resultPromise;
      expect(result.ok).toBe(true);

      vi.unstubAllGlobals();
    });

    test('should error when requestAnimationFrame is not available', async () => {
      // Ensure requestAnimationFrame is undefined
      vi.stubGlobal('requestAnimationFrame', undefined);

      const result = await waitFor(
        () => false,
        { polling: 'raf', timeout: 100 },
      );

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('requestAnimationFrame is not available');
      }

      vi.unstubAllGlobals();
    });

    test('should clean up properly when condition becomes true', async () => {
      const mockClearTimeout = vi.spyOn(global, 'clearTimeout');
      const mockClearInterval = vi.spyOn(global, 'clearInterval');

      let conditionResult = false;

      setTimeout(() => {
        conditionResult = true;
      }, 30);

      const result = await waitFor(
        () => conditionResult,
        { polling: 10, timeout: 200 },
      );

      expect(result.ok).toBe(true);
      expect(mockClearTimeout).toHaveBeenCalled();
      expect(mockClearInterval).toHaveBeenCalled();

      mockClearTimeout.mockRestore();
      mockClearInterval.mockRestore();
    });

    test('should clean up properly when timeout occurs', async () => {
      const mockClearTimeout = vi.spyOn(global, 'clearTimeout');
      const mockClearInterval = vi.spyOn(global, 'clearInterval');

      const result = await waitFor(
        () => false,
        { polling: 10, timeout: 30 },
      );

      expect(result.ok).toBe(false);
      expect(mockClearTimeout).toHaveBeenCalled();
      expect(mockClearInterval).toHaveBeenCalled();

      mockClearTimeout.mockRestore();
      mockClearInterval.mockRestore();
    });

    test('should work with different polling intervals', async () => {
      let checkCount = 0;
      let conditionResult = false;

      setTimeout(() => {
        conditionResult = true;
      }, 45);

      const result = await waitFor(
        () => {
          checkCount++;
          return conditionResult;
        },
        { polling: 20, timeout: 100 },
      );

      expect(result.ok).toBe(true);
      // Should check approximately 3 times (0ms, 20ms, 40ms) before becoming true at 45ms
      expect(checkCount).toBeGreaterThanOrEqual(2);
      expect(checkCount).toBeLessThanOrEqual(4);
    });

    test('should resolve immediately with async condition returning true', async () => {
      const result = await waitFor(
        async () => true,
        { polling: 10, timeout: 100 },
      );

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(undefined);
      }
    });

    test('should resolve when async condition becomes true with numeric polling', async () => {
      let conditionResult = false;
      const startTime = Date.now();

      setTimeout(() => {
        conditionResult = true;
      }, 50);

      const result = await waitFor(
        async () => {
          await sleep(5); // Simulate async work
          return conditionResult;
        },
        { polling: 10, timeout: 200 },
      );

      const elapsed = Date.now() - startTime;
      expect(result.ok).toBe(true);
      expect(elapsed).toBeGreaterThan(40); // Should take at least ~50ms
      expect(elapsed).toBeLessThan(120); // But not too much longer (accounting for async work)
    });

    test('should timeout with async condition that never becomes true', async () => {
      const startTime = Date.now();

      const result = await waitFor(
        async () => {
          await sleep(2); // Simulate async work
          return false;
        },
        { polling: 10, timeout: 50 },
      );

      const elapsed = Date.now() - startTime;
      expect(result.ok).toBe(false);
      expect(elapsed).toBeGreaterThan(40); // Should wait for timeout
      expect(elapsed).toBeLessThan(80); // But not too much longer

      if (!result.ok) {
        expect(result.error.message).toContain('Timeout of 50ms exceeded');
      }
    });

    test('should handle async condition that throws an error', async () => {
      const result = await waitFor(
        async () => {
          await sleep(5);
          throw new Error('Async condition error');
        },
        { polling: 10, timeout: 100 },
      );

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('Condition check failed');
        expect(result.error.message).toContain('Async condition error');
      }
    });

    test('should handle async condition with RAF polling', async () => {
      // Mock requestAnimationFrame and cancelAnimationFrame
      const mockRaf = vi.fn();
      const mockCancelRaf = vi.fn();

      vi.stubGlobal('requestAnimationFrame', mockRaf);
      vi.stubGlobal('cancelAnimationFrame', mockCancelRaf);

      let conditionResult = false;
      let rafCallback: (() => void) | null = null;

      mockRaf.mockImplementation((callback: () => void) => {
        rafCallback = callback;
        return 1; // Mock frame ID
      });

      const resultPromise = waitFor(
        async () => {
          await sleep(1); // Simulate async work
          return conditionResult;
        },
        { polling: 'raf', timeout: 100 },
      );

      // Give time for the initial async condition check to complete and RAF to be set up
      await sleep(10);

      // Simulate first RAF call
      expect(mockRaf).toHaveBeenCalledTimes(1);
      expect(rafCallback).toBeTruthy();

      // Call the RAF callback (condition still false)
      rafCallback!();

      // Give time for async condition to resolve
      await sleep(10);

      // Should schedule another RAF after async condition resolves
      expect(mockRaf).toHaveBeenCalledTimes(2);

      // Now make condition true and call RAF callback again
      conditionResult = true;
      rafCallback!();

      await sleep(10);

      const result = await resultPromise;
      expect(result.ok).toBe(true);

      vi.unstubAllGlobals();
    });

    test('should work with slow async conditions', async () => {
      let checkCount = 0;
      let conditionResult = false;

      setTimeout(() => {
        conditionResult = true;
      }, 80);

      const result = await waitFor(
        async () => {
          checkCount++;
          await sleep(15); // Each check takes 15ms
          return conditionResult;
        },
        { polling: 20, timeout: 200 },
      );

      expect(result.ok).toBe(true);
      // Should check approximately 4-5 times before condition becomes true
      expect(checkCount).toBeGreaterThanOrEqual(3);
      expect(checkCount).toBeLessThanOrEqual(6);
    });

    test('should handle async condition that returns promise of false', async () => {
      const result = await waitFor(
        async () => {
          await sleep(5);
          return false;
        },
        { polling: 10, timeout: 30 },
      );

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('Timeout of 30ms exceeded');
      }
    });

    test('should properly clean up with async conditions on timeout', async () => {
      const mockClearTimeout = vi.spyOn(global, 'clearTimeout');
      const mockClearInterval = vi.spyOn(global, 'clearInterval');

      const result = await waitFor(
        async () => {
          await sleep(5);
          return false;
        },
        { polling: 10, timeout: 30 },
      );

      expect(result.ok).toBe(false);
      expect(mockClearTimeout).toHaveBeenCalled();
      expect(mockClearInterval).toHaveBeenCalled();

      mockClearTimeout.mockRestore();
      mockClearInterval.mockRestore();
    });

    test('should properly clean up with async conditions on success', async () => {
      const mockClearTimeout = vi.spyOn(global, 'clearTimeout');
      const mockClearInterval = vi.spyOn(global, 'clearInterval');

      let conditionResult = false;

      setTimeout(() => {
        conditionResult = true;
      }, 30);

      const result = await waitFor(
        async () => {
          await sleep(5);
          return conditionResult;
        },
        { polling: 10, timeout: 200 },
      );

      expect(result.ok).toBe(true);
      expect(mockClearTimeout).toHaveBeenCalled();
      expect(mockClearInterval).toHaveBeenCalled();

      mockClearTimeout.mockRestore();
      mockClearInterval.mockRestore();
    });
  });
});
