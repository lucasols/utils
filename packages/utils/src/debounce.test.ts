import { describe, expect, test, vi } from 'vitest';
import { debounce, isDebouncedFn } from './debounce';
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

  test(
    'should replace the callback without cancelling scheduled invocation',
    async ({ expect }) => {
      const first = vi.fn();
      const second = vi.fn();
      const debouncedFunc = debounce(first, 40);

      debouncedFunc('value');
      expect(debouncedFunc.pending()).toMatchInlineSnapshot('true');

      await sleep(15);
      debouncedFunc.updateCb(second);
      expect(debouncedFunc.pending()).toMatchInlineSnapshot('true');

      await sleep(45);
      expect(first).not.toBeCalled();
      expect(second).toBeCalledTimes(1);
      expect(second).toBeCalledWith('value');
    },
    { retries: 3 },
  );

  test('should update wait without cancelling pending invocation', async ({
    expect,
  }) => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 80);

    debouncedFunc('value');
    await sleep(40);

    debouncedFunc.updateParams(10);
    expect(debouncedFunc.pending()).toMatchInlineSnapshot('true');

    await sleep(20);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith('value');
  });

  test('should apply updated options', async ({ expect }) => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 50, {
      leading: true,
      trailing: false,
    });

    debouncedFunc('first');
    expect(func).toHaveBeenCalledTimes(1);

    debouncedFunc.updateParams(30, { leading: false, trailing: true });
    debouncedFunc('second');
    expect(debouncedFunc.pending()).toMatchInlineSnapshot('true');
    expect(func).toHaveBeenCalledTimes(1);

    await sleep(35);

    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith('second');
  });

  test('should report pending status for scheduled invocations', async ({
    expect,
  }) => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 30);

    expect(debouncedFunc.pending()).toMatchInlineSnapshot('false');

    debouncedFunc();
    expect(debouncedFunc.pending()).toMatchInlineSnapshot('true');

    debouncedFunc.flush();
    expect(debouncedFunc.pending()).toMatchInlineSnapshot('false');

    debouncedFunc();
    await sleep(40);
    expect(debouncedFunc.pending()).toMatchInlineSnapshot('false');
  });

  test('should identify debounced functions with the type guard', ({
    expect,
  }) => {
    const debouncedFunc = debounce(vi.fn(), 25);

    expect(isDebouncedFn(debouncedFunc)).toMatchInlineSnapshot('true');
    expect(isDebouncedFn(() => undefined)).toMatchInlineSnapshot('false');

    if (isDebouncedFn(debouncedFunc)) {
      expect(typeof debouncedFunc.updateCb).toMatchInlineSnapshot('"function"');
      expect(typeof debouncedFunc.updateParams).toMatchInlineSnapshot(
        '"function"',
      );
    }
  });
});
