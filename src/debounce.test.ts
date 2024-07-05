import { describe, expect, test, vi } from 'vitest';
import { debounce } from './debounce';
import { sleep } from './sleep';

describe.concurrent('debounce', () => {
  test('should delay invoking the function', async () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    expect(func).not.toBeCalled();

    await sleep(50);
    expect(func).not.toBeCalled();

    await sleep(51);
    expect(func).toBeCalledTimes(1);
  });

  test('should invoke the function only once for multiple calls within wait time', async () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    await sleep(110);
    expect(func).toBeCalledTimes(1);
  });

  test('should pass the correct arguments to the debounced function', async () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc(1, 'test');
    await sleep(110);

    expect(func).toBeCalledWith(1, 'test');
  });

  test('should support cancelling the debounced function', async () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    debouncedFunc.cancel();

    await sleep(110);
    expect(func).not.toBeCalled();
  });

  test('should support flushing the debounced function', async () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    debouncedFunc.flush();

    expect(func).toBeCalledTimes(1);

    await sleep(110);
    expect(func).toBeCalledTimes(1); // Should not be called again
  });

  test('should reset the timer on subsequent calls', async () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    await sleep(50);
    debouncedFunc();
    await sleep(60);
    expect(func).not.toBeCalled();

    await sleep(50);
    expect(func).toBeCalledTimes(1);
  });
});
