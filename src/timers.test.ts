import { describe, expect, it, vi } from 'vitest';
import {
  createInterval,
  createNoConcurrentTimeout,
  createTimeout,
  createWaitUntil,
} from './timers';

describe('timers', () => {
  describe('createTimeout', () => {
    it('should execute callback after specified time', async () => {
      const callback = vi.fn();
      createTimeout(50, callback);

      expect(callback).not.toHaveBeenCalled();

      await new Promise((resolve) => setTimeout(resolve, 60));

      expect(callback).toHaveBeenCalledOnce();
    });

    it('should not execute callback if cleaned up before timeout', async () => {
      const callback = vi.fn();
      const cleanup = createTimeout(50, callback);

      cleanup();

      await new Promise((resolve) => setTimeout(resolve, 60));

      expect(callback).not.toHaveBeenCalled();
    });

    it('should be safe to call cleanup multiple times', async () => {
      const callback = vi.fn();
      const cleanup = createTimeout(50, callback);

      cleanup();
      cleanup();
      cleanup();

      await new Promise((resolve) => setTimeout(resolve, 60));

      expect(callback).not.toHaveBeenCalled();
    });

    it('should not throw when cleanup is called after timeout completes', async () => {
      const callback = vi.fn();
      const cleanup = createTimeout(10, callback);

      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(() => cleanup()).not.toThrow();
      expect(callback).toHaveBeenCalledOnce();
    });
  });

  describe('createInterval', () => {
    it('should execute callback multiple times at intervals', async () => {
      const callback = vi.fn();
      const cleanup = createInterval(25, callback);

      await new Promise((resolve) => setTimeout(resolve, 80));

      cleanup();

      expect(callback).toHaveBeenCalledTimes(3);
    });

    it('should not execute callback if cleaned up immediately', async () => {
      const callback = vi.fn();
      const cleanup = createInterval(25, callback);

      cleanup();

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(callback).not.toHaveBeenCalled();
    });

    it('should stop executing after cleanup', async () => {
      const callback = vi.fn();
      const cleanup = createInterval(20, callback);

      await new Promise((resolve) => setTimeout(resolve, 45));

      const callCountBeforeCleanup = callback.mock.calls.length;
      cleanup();

      await new Promise((resolve) => setTimeout(resolve, 45));

      expect(callback).toHaveBeenCalledTimes(callCountBeforeCleanup);
    });

    it('should be safe to call cleanup multiple times', async () => {
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
    it('should execute callback only once when called multiple times', async () => {
      const callback = vi.fn();
      const { call } = createNoConcurrentTimeout(50, callback);

      call();
      call();
      call();

      await new Promise((resolve) => setTimeout(resolve, 60));

      expect(callback).toHaveBeenCalledOnce();
    });

    it('should cancel previous timeout when called again', async () => {
      const callback = vi.fn();
      const { call } = createNoConcurrentTimeout(100, callback);

      call();

      await new Promise((resolve) => setTimeout(resolve, 50));

      call(); // Should cancel the first one

      await new Promise((resolve) => setTimeout(resolve, 110)); // Wait longer than the timeout duration

      expect(callback).toHaveBeenCalledOnce();
    });

    it('should not execute callback if cleaned up', async () => {
      const callback = vi.fn();
      const { call, clean } = createNoConcurrentTimeout(50, callback);

      call();
      clean();

      await new Promise((resolve) => setTimeout(resolve, 60));

      expect(callback).not.toHaveBeenCalled();
    });

    it('should be safe to call clean multiple times', () => {
      const callback = vi.fn();
      const { clean } = createNoConcurrentTimeout(50, callback);

      expect(() => {
        clean();
        clean();
        clean();
      }).not.toThrow();
    });

    it('should handle calling call after clean', async () => {
      const callback = vi.fn();
      const { call, clean } = createNoConcurrentTimeout(50, callback);

      clean();
      call();

      await new Promise((resolve) => setTimeout(resolve, 60));

      expect(callback).toHaveBeenCalledOnce();
    });
  });

  describe('createConditionTimeout', () => {
    it('should call callback when condition becomes true', async () => {
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

    it('should not call callback if condition never becomes true', async () => {
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

    it('should call callback immediately if condition is already true', async () => {
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

    it('should not call callback if cleaned up before condition becomes true', async () => {
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

    it('should stop checking after max wait time', async () => {
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

    it('should use default check interval of 20ms', async () => {
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

    it('should handle complex condition types', async () => {
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

    it('should be safe to call cleanup multiple times', () => {
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
});
