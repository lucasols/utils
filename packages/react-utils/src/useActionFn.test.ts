import { sleep } from '@ls-stack/utils/sleep';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useActionFn, useActionFnWithState } from './useActionFn';

describe('useActionFn', () => {
  it('should execute async action and return result', async () => {
    const action = vi.fn(async (value: string) => {
      await sleep(10);
      return `result-${value}`;
    });

    const { result } = renderHook(() => useActionFn(action));

    expect(result.current.isInProgress).toBe(false);

    let callResult: ReturnType<typeof result.current.call>;
    act(() => {
      callResult = result.current.call('test');
    });

    expect(await callResult!).toBe('result-test');
    expect(action).toHaveBeenCalledWith('test');
    expect(result.current.isInProgress).toBe(false);
  });

  it('should track isInProgress state during execution', async () => {
    const action = vi.fn(async () => {
      await sleep(20);
      return 'done';
    });

    const { result } = renderHook(() => useActionFn(action));

    expect(result.current.isInProgress).toBe(false);

    let callPromise: ReturnType<typeof result.current.call>;
    act(() => {
      callPromise = result.current.call();
    });

    expect(result.current.isInProgress).toBe(true);

    await act(async () => {
      await callPromise!;
    });

    expect(result.current.isInProgress).toBe(false);
  });

  it('should prevent concurrent calls and return null', async () => {
    const action = vi.fn(async (id: number) => {
      await sleep(30);
      return `result-${id}`;
    });

    const { result } = renderHook(() => useActionFn(action));

    let firstCall: ReturnType<typeof result.current.call>;
    let secondCall: ReturnType<typeof result.current.call>;
    let thirdCall: ReturnType<typeof result.current.call>;

    act(() => {
      firstCall = result.current.call(1);
      secondCall = result.current.call(2);
      thirdCall = result.current.call(3);
    });

    const results = await Promise.all([firstCall!, secondCall!, thirdCall!]);

    expect(results[0]).toBe('result-1');
    expect(results[1]).toBe(null);
    expect(results[2]).toBe(null);
    expect(action).toHaveBeenCalledTimes(1);
    expect(action).toHaveBeenCalledWith(1);
  });

  it('should handle errors and reset isInProgress state', async () => {
    const error = new Error('Test error');
    const action = vi.fn(async () => {
      await sleep(10);
      throw error;
    });

    const { result } = renderHook(() => useActionFn(action));

    let callPromise: ReturnType<typeof result.current.call>;
    act(() => {
      callPromise = result.current.call();
    });

    expect(result.current.isInProgress).toBe(true);

    await expect(callPromise!).rejects.toThrow('Test error');
    expect(result.current.isInProgress).toBe(false);
  });

  it('should work with synchronous actions', async () => {
    const action = vi.fn((a: number, b: number) => a + b);

    const { result } = renderHook(() => useActionFn(action));

    let callResult: ReturnType<typeof result.current.call>;
    act(() => {
      callResult = result.current.call(5, 3);
    });

    expect(await callResult!).toBe(8);
    expect(action).toHaveBeenCalledWith(5, 3);
  });

  it('should handle actions with no parameters', async () => {
    const action = vi.fn(async () => {
      await sleep(10);
      return 42;
    });

    const { result } = renderHook(() => useActionFn(action));

    let callResult: ReturnType<typeof result.current.call>;
    act(() => {
      callResult = result.current.call();
    });

    expect(await callResult!).toBe(42);
    expect(action).toHaveBeenCalledWith();
  });

  it('should memoize properly when action changes', async () => {
    const action1 = vi.fn(() => Promise.resolve('action1'));
    const action2 = vi.fn(() => Promise.resolve('action2'));

    const { result, rerender } = renderHook(
      ({ action }) => useActionFn(action),
      { initialProps: { action: action1 } },
    );

    const firstCallInstance = result.current.call;

    const callResult1 = await act(() => result.current.call());
    expect(callResult1).toBe('action1');

    rerender({ action: action2 });

    expect(result.current.call).not.toBe(firstCallInstance);

    const callResult2 = await act(() => result.current.call());
    expect(callResult2).toBe('action2');
  });
});

describe('useActionFnWithState', () => {
  it('should execute action with state and return result', async () => {
    const action = vi.fn(async (state: string, value: number) => {
      await sleep(10);
      return `${state}-${value}`;
    });

    const { result } = renderHook(() => useActionFnWithState(action));

    expect(result.current.isInProgress('state1')).toBe(false);

    let callResult: ReturnType<typeof result.current.call>;
    act(() => {
      callResult = result.current.call('state1', 42);
    });

    expect(await callResult!).toBe('state1-42');
    expect(action).toHaveBeenCalledWith('state1', 42);
    expect(result.current.isInProgress('state1')).toBe(false);
  });

  it('should track isInProgress per state', async () => {
    const action = vi.fn(async (state: string) => {
      await sleep(20);
      return `done-${state}`;
    });

    const { result } = renderHook(() => useActionFnWithState(action));

    let promise1: ReturnType<typeof result.current.call>;
    let promise2: ReturnType<typeof result.current.call>;

    act(() => {
      promise1 = result.current.call('state1');
      promise2 = result.current.call('state2');
    });

    expect(result.current.isInProgress('state1')).toBe(true);
    expect(result.current.isInProgress('state2')).toBe(true);
    expect(result.current.isInProgress('state3')).toBe(false);

    await act(async () => {
      await Promise.all([promise1!, promise2!]);
    });

    expect(result.current.isInProgress('state1')).toBe(false);
    expect(result.current.isInProgress('state2')).toBe(false);
  });

  it('should prevent concurrent calls for same state', async () => {
    const action = vi.fn(async (state: string, id: number) => {
      await sleep(30);
      return `${state}-${id}`;
    });

    const { result } = renderHook(() => useActionFnWithState(action));

    let call1: ReturnType<typeof result.current.call>;
    let call2: ReturnType<typeof result.current.call>;
    let call3: ReturnType<typeof result.current.call>;
    let call4: ReturnType<typeof result.current.call>;

    act(() => {
      call1 = result.current.call('state1', 1);
      call2 = result.current.call('state1', 2); // Should return false
      call3 = result.current.call('state2', 3);
      call4 = result.current.call('state2', 4); // Should return false
    });

    const results = await Promise.all([call1!, call2!, call3!, call4!]);

    expect(results[0]).toBe('state1-1');
    expect(results[1]).toBe(false);
    expect(results[2]).toBe('state2-3');
    expect(results[3]).toBe(false);

    expect(action).toHaveBeenCalledTimes(2);
    expect(action).toHaveBeenCalledWith('state1', 1);
    expect(action).toHaveBeenCalledWith('state2', 3);
  });

  it('should handle errors and reset state-specific isInProgress', async () => {
    const error = new Error('State error');
    const action = vi.fn(async (state: string) => {
      await sleep(10);
      if (state === 'error') throw error;
      return `ok-${state}`;
    });

    const { result } = renderHook(() => useActionFnWithState(action));

    let errorPromise: ReturnType<typeof result.current.call>;
    let okPromise: ReturnType<typeof result.current.call>;

    act(() => {
      errorPromise = result.current.call('error');
      okPromise = result.current.call('ok');
    });

    expect(result.current.isInProgress('error')).toBe(true);
    expect(result.current.isInProgress('ok')).toBe(true);

    await expect(errorPromise!).rejects.toThrow('State error');
    expect(await okPromise!).toBe('ok-ok');

    expect(result.current.isInProgress('error')).toBe(false);
    expect(result.current.isInProgress('ok')).toBe(false);
  });

  it('should work with numeric states', async () => {
    const action = vi.fn(async (state: number, multiplier: number) => {
      await sleep(10);
      return state * multiplier;
    });

    const { result } = renderHook(() => useActionFnWithState(action));

    let call1: ReturnType<typeof result.current.call>;
    let call2: ReturnType<typeof result.current.call>;

    act(() => {
      call1 = result.current.call(1, 10);
      call2 = result.current.call(2, 20);
    });

    expect(await call1!).toBe(10);
    expect(await call2!).toBe(40);
    expect(action).toHaveBeenCalledWith(1, 10);
    expect(action).toHaveBeenCalledWith(2, 20);
  });

  it('should handle synchronous actions', async () => {
    const action = vi.fn((state: string, value: string) => `${state}:${value}`);

    const { result } = renderHook(() => useActionFnWithState(action));

    let callResult: ReturnType<typeof result.current.call>;
    act(() => {
      callResult = result.current.call('sync', 'test');
    });

    expect(await callResult!).toBe('sync:test');
    expect(action).toHaveBeenCalledWith('sync', 'test');
  });

  it('should memoize properly when action changes', async () => {
    const action1 = vi.fn((state: string) =>
      Promise.resolve(`action1-${state}`),
    );
    const action2 = vi.fn((state: string) =>
      Promise.resolve(`action2-${state}`),
    );

    const { result, rerender } = renderHook(
      ({ action }) => useActionFnWithState(action),
      { initialProps: { action: action1 } },
    );

    const firstCallInstance = result.current.call;

    const callResult1 = await act(() => result.current.call('test'));
    expect(callResult1).toBe('action1-test');

    rerender({ action: action2 });

    expect(result.current.call).not.toBe(firstCallInstance);

    const callResult2 = await act(() => result.current.call('test'));
    expect(callResult2).toBe('action2-test');
  });
});
