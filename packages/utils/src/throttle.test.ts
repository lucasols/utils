import { describe, expect, test, vi } from 'vitest';
import { sleep } from './sleep';
import { createThrottledFunctionFactory, throttle } from './throttle';

describe.concurrent('throttle', () => {
  test('should throttle function calls', async () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);

    await sleep(110);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('should call function with correct arguments', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled('arg1', 'arg2');
    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  test('should return the result of the original function', () => {
    const fn = vi.fn(() => 'result');
    const throttled = throttle(fn, 100);

    const result = throttled();
    expect(result).toBe('result');
  });

  test('should respect leading option when false', async () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100, { leading: false });

    throttled();
    expect(fn).not.toHaveBeenCalled();

    await sleep(110);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('should respect leading option when true (default)', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100, { leading: true });

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('should respect trailing option when false', async () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100, { trailing: false });

    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);

    await sleep(110);
    expect(fn).toHaveBeenCalledTimes(1); // No trailing call
  });

  test('should respect trailing option when true (default)', async () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100, { trailing: true });

    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);

    await sleep(110);
    expect(fn).toHaveBeenCalledTimes(2); // Trailing call executed
  });

  test('should work with both leading and trailing disabled', async () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100, { leading: false, trailing: false });

    throttled();
    throttled();

    expect(fn).not.toHaveBeenCalled();

    await sleep(110);
    expect(fn).not.toHaveBeenCalled();
  });

  test('should work with both leading and trailing enabled', async () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100, { leading: true, trailing: true });

    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1); // Leading call

    await sleep(110);
    expect(fn).toHaveBeenCalledTimes(2); // Trailing call
  });

  test(
    'should handle rapid successive calls correctly',
    { retry: 2 },
    async () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      for (let i = 0; i < 10; i++) {
        throttled(i);
        await sleep(5); // Much shorter intervals to stay well within throttle window
      }

      expect(fn).toHaveBeenCalledTimes(1); // Only leading call

      await sleep(110);
      expect(fn).toHaveBeenCalledTimes(2); // Trailing call with last argument
      expect(fn).toHaveBeenLastCalledWith(9);
    },
  );

  test('should cancel pending invocation', async () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);

    throttled.cancel();
    await sleep(110);

    expect(fn).toHaveBeenCalledTimes(1); // No trailing call after cancel
  });

  test('should flush pending invocation immediately', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled('arg1');
    throttled('arg2');

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('arg1');

    throttled.flush();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith('arg2');
  });

  test('should maintain this context', () => {
    const obj = {
      value: 42,
      method: vi.fn(function (this: { value: number }) {
        return this.value;
      }),
    };

    const throttled = throttle(obj.method, 100);
    const result = throttled.call(obj);

    expect(result).toBe(42);
    expect(obj.method).toHaveBeenCalledTimes(1);
  });
});

describe.concurrent('createThrottledFunctionFactory', () => {
  test('should create throttled functions per unique argument set', () => {
    const callback = vi.fn((x: number) => x * 2);
    const factory = createThrottledFunctionFactory(100, callback);

    factory.call(1);
    factory.call(2);
    factory.call(1);

    expect(callback).toHaveBeenCalledTimes(2); // Two unique argument sets
    expect(callback).toHaveBeenCalledWith(1);
    expect(callback).toHaveBeenCalledWith(2);
  });

  test('should throttle calls with the same arguments', async () => {
    const callback = vi.fn((x: number) => x * 2);
    const factory = createThrottledFunctionFactory(100, callback);

    factory.call(1);
    factory.call(1);
    factory.call(1);

    expect(callback).toHaveBeenCalledTimes(1);

    await sleep(110);
    expect(callback).toHaveBeenCalledTimes(2); // Trailing call
  });

  test('should return the result of the callback', () => {
    const callback = vi.fn((x: number) => x * 2);
    const factory = createThrottledFunctionFactory(100, callback);

    const result = factory.call(5);
    expect(result).toBe(10);
  });

  test('should work with multiple argument types', () => {
    const callback = vi.fn((...args: (string | number | boolean)[]) =>
      args.join('-'),
    );
    const factory = createThrottledFunctionFactory(100, callback);

    const result = factory.call('test', 42, true);
    expect(result).toBe('test-42-true');
    expect(callback).toHaveBeenCalledWith('test', 42, true);
  });

  test('should handle null and undefined arguments', () => {
    const callback = vi.fn((x: null | undefined | number) => String(x));
    const factory = createThrottledFunctionFactory(100, callback);

    factory.call(null);
    factory.call(undefined);
    factory.call(0);

    expect(callback).toHaveBeenCalledTimes(3); // All are unique
    expect(callback).toHaveBeenCalledWith(null);
    expect(callback).toHaveBeenCalledWith(undefined);
    expect(callback).toHaveBeenCalledWith(0);
  });

  test('should cache functions based on JSON.stringify of arguments', () => {
    const callback = vi.fn((...args: (string | number)[]) =>
      args.reduce((a, b) => Number(a) + Number(b), 0),
    );
    const factory = createThrottledFunctionFactory(100, callback);

    factory.call(1, 2, 3);
    factory.call(1, 2, 3); // Same serialized form
    factory.call(3, 2, 1); // Different serialized form

    expect(callback).toHaveBeenCalledTimes(2); // Two unique serialized forms
  });

  test('should respect throttle options', async () => {
    const callback = vi.fn((x: number) => x);
    const factory = createThrottledFunctionFactory(100, callback, {
      leading: false,
    });

    factory.call(1);
    expect(callback).not.toHaveBeenCalled();

    await sleep(110);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
