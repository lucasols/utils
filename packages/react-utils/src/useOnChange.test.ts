import { sleep } from '@ls-stack/utils/sleep';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import {
  useOnChange,
  useOnChangeLayoutEffect,
  useOnChangeTo,
  useOnChangeToLayoutEffect,
} from './useOnChange';

describe('useOnChange', () => {
  test('should call callback when value changes', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useOnChange(value, callback),
      { initialProps: { value: 'initial' } },
    );

    expect(callback).not.toHaveBeenCalled();

    rerender({ value: 'changed' });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      prev: 'initial',
      current: 'changed',
    });
  });

  test('should not call callback on mount by default', () => {
    const callback = vi.fn();
    renderHook(() => useOnChange('value', callback));

    expect(callback).not.toHaveBeenCalled();
  });

  test('should call callback on mount when callOnMount is true', () => {
    const callback = vi.fn();
    renderHook(() =>
      useOnChange('value', callback, { callOnMount: true }),
    );

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      prev: undefined,
      current: 'value',
    });
  });

  test('should not call callback when value stays the same', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useOnChange(value, callback),
      { initialProps: { value: 'same' } },
    );

    rerender({ value: 'same' });
    rerender({ value: 'same' });

    expect(callback).not.toHaveBeenCalled();
  });

  test('should use custom equality function', () => {
    const callback = vi.fn();
    const customEqual = vi.fn(() => true); // Always consider values equal

    const { rerender } = renderHook(
      ({ value }) =>
        useOnChange(value, callback, { equalityFn: customEqual }),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'different' });

    expect(customEqual).toHaveBeenCalledWith('different', 'initial');
    expect(callback).not.toHaveBeenCalled();
  });

  test('should handle object changes with deep equality', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useOnChange(value, callback),
      { initialProps: { value: { a: 1, b: 2 } } },
    );

    // Same content, should not trigger
    rerender({ value: { a: 1, b: 2 } });
    expect(callback).not.toHaveBeenCalled();

    // Different content, should trigger
    rerender({ value: { a: 1, b: 3 } });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      prev: { a: 1, b: 2 },
      current: { a: 1, b: 3 },
    });
  });

  test('should handle cleanup function from callback', () => {
    const cleanup = vi.fn();
    const callback = vi.fn(() => cleanup);

    const { rerender, unmount } = renderHook(
      ({ value }) => useOnChange(value, callback),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'changed' });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(cleanup).not.toHaveBeenCalled();

    unmount();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  test('should handle multiple value changes', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useOnChange(value, callback),
      { initialProps: { value: 1 } },
    );

    rerender({ value: 2 });
    rerender({ value: 3 });
    rerender({ value: 4 });

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenNthCalledWith(1, { prev: 1, current: 2 });
    expect(callback).toHaveBeenNthCalledWith(2, { prev: 2, current: 3 });
    expect(callback).toHaveBeenNthCalledWith(3, { prev: 3, current: 4 });
  });

  test('should work with primitive types', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useOnChange(value, callback),
      { initialProps: { value: true } },
    );

    rerender({ value: false });

    expect(callback).toHaveBeenCalledWith({
      prev: true,
      current: false,
    });
  });

  test('should work with array changes', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useOnChange(value, callback),
      { initialProps: { value: [1, 2, 3] } },
    );

    rerender({ value: [1, 2, 4] });

    expect(callback).toHaveBeenCalledWith({
      prev: [1, 2, 3],
      current: [1, 2, 4],
    });
  });
});

describe('useOnChangeLayoutEffect', () => {
  test('should call callback when value changes using layout effect', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useOnChangeLayoutEffect(value, callback),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'changed' });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      prev: 'initial',
      current: 'changed',
    });
  });

  test('should not call callback on mount by default', () => {
    const callback = vi.fn();
    renderHook(() => useOnChangeLayoutEffect('value', callback));

    expect(callback).not.toHaveBeenCalled();
  });

  test('should call callback on mount when callOnMount is true', () => {
    const callback = vi.fn();
    renderHook(() =>
      useOnChangeLayoutEffect('value', callback, { callOnMount: true }),
    );

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      prev: undefined,
      current: 'value',
    });
  });

  test('should handle cleanup function from callback', () => {
    const cleanup = vi.fn();
    const callback = vi.fn(() => cleanup);

    const { rerender, unmount } = renderHook(
      ({ value }) => useOnChangeLayoutEffect(value, callback),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'changed' });
    unmount();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  test('should use custom equality function', () => {
    const callback = vi.fn();
    const customEqual = vi.fn(() => true);

    const { rerender } = renderHook(
      ({ value }) =>
        useOnChangeLayoutEffect(value, callback, {
          equalityFn: customEqual,
        }),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'different' });

    expect(customEqual).toHaveBeenCalledWith('different', 'initial');
    expect(callback).not.toHaveBeenCalled();
  });
});

describe('useOnChangeTo', () => {
  test('should call callback only when value changes to target', () => {
    const callback = vi.fn();
    const target = 'target';
    
    const { rerender } = renderHook(
      ({ value }) => useOnChangeTo(value, target, callback),
      { initialProps: { value: 'initial' } },
    );

    // Change to non-target value
    rerender({ value: 'other' });
    expect(callback).not.toHaveBeenCalled();

    // Change to target value
    rerender({ value: 'target' });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      prev: 'other',
      target: 'target',
    });
  });

  test('should not call callback if value is already target on mount', () => {
    const callback = vi.fn();
    renderHook(() => useOnChangeTo('target', 'target', callback));

    expect(callback).not.toHaveBeenCalled();
  });

  test('should call callback on mount when callOnMount is true and value matches target', () => {
    const callback = vi.fn();
    renderHook(() =>
      useOnChangeTo('target', 'target', callback, { callOnMount: true }),
    );

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      prev: undefined,
      target: 'target',
    });
  });

  test('should not trigger for same value changes that are not target', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useOnChangeTo(value, 'target', callback),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'initial' }); // Same value, not target
    expect(callback).not.toHaveBeenCalled();
  });

  test('should work with object targets', () => {
    const callback = vi.fn();
    const target = { status: 'success' };
    
    const { rerender } = renderHook(
      ({ value }) => useOnChangeTo(value, target, callback),
      { initialProps: { value: { status: 'pending' } } },
    );

    rerender({ value: { status: 'loading' } });
    expect(callback).not.toHaveBeenCalled();

    rerender({ value: { status: 'success' } });
    expect(callback).toHaveBeenCalledWith({
      prev: { status: 'loading' },
      target: { status: 'success' },
    });
  });

  test('should use custom equality function for target comparison', () => {
    const callback = vi.fn();
    const customEqual = vi.fn()
      .mockReturnValueOnce(false) // value != prev
      .mockReturnValueOnce(true);  // value == target

    const { rerender } = renderHook(
      ({ value }) =>
        useOnChangeTo(value, 'TARGET', callback, {
          equalityFn: customEqual,
        }),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'target' }); // Lowercase, but custom fn treats as equal to TARGET

    expect(customEqual).toHaveBeenCalledWith('target', 'initial');
    expect(customEqual).toHaveBeenCalledWith('target', 'TARGET');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should handle cleanup function from callback', () => {
    const cleanup = vi.fn();
    const callback = vi.fn(() => cleanup);

    const { rerender, unmount } = renderHook(
      ({ value }) => useOnChangeTo(value, 'target', callback),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'target' });
    unmount();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  test('should handle multiple transitions to target', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useOnChangeTo(value, 'target', callback),
      { initialProps: { value: 'initial' } },
    );

    // First transition to target
    rerender({ value: 'target' });
    expect(callback).toHaveBeenCalledTimes(1);

    // Move away from target
    rerender({ value: 'other' });
    expect(callback).toHaveBeenCalledTimes(1); // No additional call

    // Return to target again
    rerender({ value: 'target' });
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenNthCalledWith(2, {
      prev: 'other',
      target: 'target',
    });
  });
});

describe('useOnChangeToLayoutEffect', () => {
  test('should call callback only when value changes to target using layout effect', () => {
    const callback = vi.fn();
    const target = 'target';
    
    const { rerender } = renderHook(
      ({ value }) => useOnChangeToLayoutEffect(value, target, callback),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'other' });
    expect(callback).not.toHaveBeenCalled();

    rerender({ value: 'target' });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      prev: 'other',
      target: 'target',
    });
  });

  test('should not call callback if value is already target on mount', () => {
    const callback = vi.fn();
    renderHook(() =>
      useOnChangeToLayoutEffect('target', 'target', callback),
    );

    expect(callback).not.toHaveBeenCalled();
  });

  test('should call callback on mount when callOnMount is true and value matches target', () => {
    const callback = vi.fn();
    renderHook(() =>
      useOnChangeToLayoutEffect('target', 'target', callback, {
        callOnMount: true,
      }),
    );

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      prev: undefined,
      target: 'target',
    });
  });

  test('should handle cleanup function from callback', () => {
    const cleanup = vi.fn();
    const callback = vi.fn(() => cleanup);

    const { rerender, unmount } = renderHook(
      ({ value }) => useOnChangeToLayoutEffect(value, 'target', callback),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'target' });
    unmount();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  test('should use custom equality function', () => {
    const callback = vi.fn();
    const customEqual = vi.fn()
      .mockReturnValueOnce(false) // value != prev
      .mockReturnValueOnce(true);  // value == target

    const { rerender } = renderHook(
      ({ value }) =>
        useOnChangeToLayoutEffect(value, 'TARGET', callback, {
          equalityFn: customEqual,
        }),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'target' });

    expect(customEqual).toHaveBeenCalledWith('target', 'initial');
    expect(customEqual).toHaveBeenCalledWith('target', 'TARGET');
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('Edge cases and advanced scenarios', () => {
  test('should handle null and undefined values', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useOnChange(value, callback),
      { initialProps: { value: null as null | string | undefined } },
    );

    rerender({ value: undefined });
    expect(callback).toHaveBeenCalledWith({
      prev: null,
      current: undefined,
    });

    rerender({ value: 'string' });
    expect(callback).toHaveBeenCalledWith({
      prev: undefined,
      current: 'string',
    });
  });

  test('should handle rapid consecutive changes', async () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ value }) => useOnChange(value, callback),
      { initialProps: { value: 1 } },
    );

    // React batches updates within single act, so we separate them
    act(() => {
      rerender({ value: 2 });
    });
    act(() => {
      rerender({ value: 3 });
    });
    act(() => {
      rerender({ value: 4 });
    });

    // All changes should be tracked
    expect(callback).toHaveBeenCalledTimes(3);
  });

  test('should work with complex nested objects', () => {
    const callback = vi.fn();
    const initialValue = {
      user: { id: 1, profile: { name: 'John', settings: { theme: 'dark' } } },
      posts: [{ id: 1, title: 'Hello' }],
    };

    const { rerender } = renderHook(
      ({ value }) => useOnChange(value, callback),
      { initialProps: { value: initialValue } },
    );

    // Deep change in nested object
    const changedValue = {
      user: { id: 1, profile: { name: 'John', settings: { theme: 'light' } } },
      posts: [{ id: 1, title: 'Hello' }],
    };

    rerender({ value: changedValue });

    expect(callback).toHaveBeenCalledWith({
      prev: initialValue,
      current: changedValue,
    });
  });

  test('should handle function values', () => {
    const callback = vi.fn();
    const fn1 = () => 'fn1';
    const fn2 = () => 'fn2';

    const { rerender } = renderHook(
      ({ value }) => useOnChange(value, callback),
      { initialProps: { value: fn1 } },
    );

    rerender({ value: fn2 });

    expect(callback).toHaveBeenCalledWith({
      prev: fn1,
      current: fn2,
    });
  });

  test('should handle async cleanup functions', async () => {
    const asyncCleanup = vi.fn(async () => {
      await sleep(10);
    });
    const callback = vi.fn(() => asyncCleanup);

    const { rerender, unmount } = renderHook(
      ({ value }) => useOnChange(value, callback),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'changed' });

    await act(async () => {
      unmount();
      await sleep(20); // Wait for async cleanup
    });

    expect(asyncCleanup).toHaveBeenCalledTimes(1);
  });
});