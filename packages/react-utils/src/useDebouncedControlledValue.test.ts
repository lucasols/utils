import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { useDebouncedControlledValue } from './useDebouncedControlledValue';

describe('useDebouncedControlledValue', () => {
  test('should initialize with default value', () => {
    const setControlledValue = vi.fn();
    const setInputValue = vi.fn();

    const { result } = renderHook(() =>
      useDebouncedControlledValue({
        controlledValue: 'initial',
        setControlledValue,
        setInternalValue: setInputValue,
        debounce: 100,
        readonly: false,
      }),
    );

    expect(result.current.defaultValue).toBe('initial');
    expect(result.current.isEmpty).toBe(false);
    expect(result.current.isTouched.current).toBe(false);
  });

  test('should detect empty value using default checkIfEmpty', () => {
    const setControlledValue = vi.fn();
    const setInputValue = vi.fn();

    const { result } = renderHook(() =>
      useDebouncedControlledValue({
        controlledValue: '',
        setControlledValue,
        setInternalValue: setInputValue,
        debounce: 100,
        readonly: false,
      }),
    );

    expect(result.current.isEmpty).toBe(true);
  });

  test('should detect empty value using custom checkIfEmpty', () => {
    const setControlledValue = vi.fn();
    const setInputValue = vi.fn();

    const { result } = renderHook(() =>
      useDebouncedControlledValue({
        controlledValue: 0,
        setControlledValue,
        setInternalValue: setInputValue,
        debounce: 100,
        readonly: false,
        checkIfEmpty: (value) => value === 0,
      }),
    );

    expect(result.current.isEmpty).toBe(true);
  });

  test('should debounce onChange calls', async () => {
    const setControlledValue = vi.fn();
    const setInputValue = vi.fn();

    const { result } = renderHook(() =>
      useDebouncedControlledValue({
        controlledValue: 'initial',
        setControlledValue,
        setInternalValue: setInputValue,
        debounce: 100,
        readonly: false,
      }),
    );

    result.current.onChange('new value');

    expect(setControlledValue).not.toHaveBeenCalled();

    await waitFor(
      () => {
        expect(setControlledValue).toHaveBeenCalledWith('new value');
      },
      { timeout: 200 },
    );
  });

  test('should update isEmpty state on onChange', async () => {
    const setControlledValue = vi.fn();
    const setInputValue = vi.fn();

    const { result } = renderHook(() =>
      useDebouncedControlledValue({
        controlledValue: 'initial',
        setControlledValue,
        setInternalValue: setInputValue,
        debounce: 100,
        readonly: false,
      }),
    );

    expect(result.current.isEmpty).toBe(false);

    result.current.onChange('');

    await waitFor(() => {
      expect(result.current.isEmpty).toBe(true);
    });
  });

  test('should mark as touched after debounced change', async () => {
    const setControlledValue = vi.fn();
    const setInputValue = vi.fn();

    const { result } = renderHook(() =>
      useDebouncedControlledValue({
        controlledValue: 'initial',
        setControlledValue,
        setInternalValue: setInputValue,
        debounce: 100,
        readonly: false,
      }),
    );

    expect(result.current.isTouched.current).toBe(false);

    result.current.onChange('new value');

    await waitFor(
      () => {
        expect(result.current.isTouched.current).toBe(true);
      },
      { timeout: 200 },
    );
  });

  test('should not call setControlledValue when readonly', async () => {
    const setControlledValue = vi.fn();
    const setInputValue = vi.fn();

    const { result } = renderHook(() =>
      useDebouncedControlledValue({
        controlledValue: 'initial',
        setControlledValue,
        setInternalValue: setInputValue,
        debounce: 100,
        readonly: true,
      }),
    );

    result.current.onChange('new value');

    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(setControlledValue).not.toHaveBeenCalled();
  });

  test('should update input value when controlledValue changes', () => {
    const setControlledValue = vi.fn();
    const setInputValue = vi.fn();

    const { rerender } = renderHook(
      ({ controlledValue }) =>
        useDebouncedControlledValue({
          controlledValue,
          setControlledValue,
          setInternalValue: setInputValue,
          debounce: 100,
          readonly: false,
        }),
      { initialProps: { controlledValue: 'initial' } },
    );

    setInputValue.mockClear();

    rerender({ controlledValue: 'updated' });

    expect(setInputValue).toHaveBeenCalledWith('updated');
  });

  test('should ignore controlled value change after onChange', async () => {
    const setControlledValue = vi.fn();
    const setInputValue = vi.fn();

    const { result, rerender } = renderHook(
      ({ controlledValue }) =>
        useDebouncedControlledValue({
          controlledValue,
          setControlledValue,
          setInternalValue: setInputValue,
          debounce: 100,
          readonly: false,
        }),
      { initialProps: { controlledValue: 'initial' } },
    );

    result.current.onChange('new value');

    await waitFor(
      () => {
        expect(setControlledValue).toHaveBeenCalledWith('new value');
      },
      { timeout: 200 },
    );

    setInputValue.mockClear();

    rerender({ controlledValue: 'new value' });

    expect(setInputValue).not.toHaveBeenCalled();
  });

  test('should update input value when setInputValueExtraDeps change', () => {
    const setControlledValue = vi.fn();
    const setInputValue = vi.fn();

    const { rerender } = renderHook(
      ({ deps }) =>
        useDebouncedControlledValue({
          controlledValue: 'value',
          setControlledValue,
          setInternalValue: setInputValue,
          setInputValueExtraDeps: deps,
          debounce: 100,
          readonly: false,
        }),
      { initialProps: { deps: ['dep1'] } },
    );

    setInputValue.mockClear();

    rerender({ deps: ['dep2'] });

    expect(setInputValue).toHaveBeenCalledWith('value');
  });

  test('should not update input value when setInputValueExtraDeps change if debounce is pending', async () => {
    const setControlledValue = vi.fn();
    const setInputValue = vi.fn();

    const { result, rerender } = renderHook(
      ({ deps }) =>
        useDebouncedControlledValue({
          controlledValue: 'value',
          setControlledValue,
          setInternalValue: setInputValue,
          setInputValueExtraDeps: deps,
          debounce: 100,
          readonly: false,
        }),
      { initialProps: { deps: ['dep1'] } },
    );

    result.current.onChange('new value');

    setInputValue.mockClear();

    rerender({ deps: ['dep2'] });

    expect(setInputValue).not.toHaveBeenCalled();
  });

  test('should flush debounce on unmount by default', async () => {
    const setControlledValue = vi.fn();
    const setInputValue = vi.fn();

    const { result, unmount } = renderHook(() =>
      useDebouncedControlledValue({
        controlledValue: 'initial',
        setControlledValue,
        setInternalValue: setInputValue,
        debounce: 100,
        readonly: false,
      }),
    );

    result.current.onChange('new value');

    expect(setControlledValue).not.toHaveBeenCalled();

    unmount();

    expect(setControlledValue).toHaveBeenCalledWith('new value');
  });

  test('should flush debounce on unmount when onUnMount is flush', () => {
    const setControlledValue = vi.fn();
    const setInputValue = vi.fn();

    const { result, unmount } = renderHook(() =>
      useDebouncedControlledValue({
        controlledValue: 'initial',
        setControlledValue,
        setInternalValue: setInputValue,
        debounce: 100,
        readonly: false,
        onUnMount: 'flush',
      }),
    );

    result.current.onChange('new value');

    expect(setControlledValue).not.toHaveBeenCalled();

    unmount();

    expect(setControlledValue).toHaveBeenCalledWith('new value');
  });

  test('should cancel debounce on unmount when onUnMount is cancel', async () => {
    const setControlledValue = vi.fn();
    const setInputValue = vi.fn();

    const { result, unmount } = renderHook(() =>
      useDebouncedControlledValue({
        controlledValue: 'initial',
        setControlledValue,
        setInternalValue: setInputValue,
        debounce: 100,
        readonly: false,
        onUnMount: 'cancel',
      }),
    );

    result.current.onChange('new value');

    expect(setControlledValue).not.toHaveBeenCalled();

    unmount();

    expect(setControlledValue).not.toHaveBeenCalled();

    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(setControlledValue).not.toHaveBeenCalled();
  });

  test('should flush debounce manually', async () => {
    const setControlledValue = vi.fn();
    const setInputValue = vi.fn();

    const { result } = renderHook(() =>
      useDebouncedControlledValue({
        controlledValue: 'initial',
        setControlledValue,
        setInternalValue: setInputValue,
        debounce: 100,
        readonly: false,
      }),
    );

    result.current.onChange('new value');

    expect(setControlledValue).not.toHaveBeenCalled();

    result.current.flushDebounce();

    expect(setControlledValue).toHaveBeenCalledWith('new value');
  });

  test('should handle multiple rapid onChange calls', async () => {
    const setControlledValue = vi.fn();
    const setInputValue = vi.fn();

    const { result } = renderHook(() =>
      useDebouncedControlledValue({
        controlledValue: 'initial',
        setControlledValue,
        setInternalValue: setInputValue,
        debounce: 100,
        readonly: false,
      }),
    );

    result.current.onChange('value1');
    result.current.onChange('value2');
    result.current.onChange('value3');

    expect(setControlledValue).not.toHaveBeenCalled();

    await waitFor(
      () => {
        expect(setControlledValue).toHaveBeenCalledTimes(1);
      },
      { timeout: 200 },
    );

    expect(setControlledValue).toHaveBeenCalledWith('value3');
  });

  test('should update isEmpty with custom checkIfEmpty on controlled value change', () => {
    const setControlledValue = vi.fn();
    const setInputValue = vi.fn();

    const { rerender } = renderHook(
      ({ controlledValue }) =>
        useDebouncedControlledValue({
          controlledValue,
          setControlledValue,
          setInternalValue: setInputValue,
          debounce: 100,
          readonly: false,
          checkIfEmpty: (value) => value === 0,
        }),
      { initialProps: { controlledValue: 5 } },
    );

    rerender({ controlledValue: 0 });

    const { result } = renderHook(() =>
      useDebouncedControlledValue({
        controlledValue: 0,
        setControlledValue,
        setInternalValue: setInputValue,
        debounce: 100,
        readonly: false,
        checkIfEmpty: (value) => value === 0,
      }),
    );

    expect(result.current.isEmpty).toBe(true);
  });

  test('should re-enable controlled value updates after timeout', async () => {
    const setControlledValue = vi.fn();
    const setInputValue = vi.fn();

    const { result, rerender } = renderHook(
      ({ controlledValue }) =>
        useDebouncedControlledValue({
          controlledValue,
          setControlledValue,
          setInternalValue: setInputValue,
          debounce: 100,
          readonly: false,
        }),
      { initialProps: { controlledValue: 'initial' } },
    );

    result.current.onChange('new value');

    await waitFor(
      () => {
        expect(setControlledValue).toHaveBeenCalledWith('new value');
      },
      { timeout: 200 },
    );

    setInputValue.mockClear();

    rerender({ controlledValue: 'new value' });
    expect(setInputValue).not.toHaveBeenCalled();

    await new Promise((resolve) => setTimeout(resolve, 600));

    setInputValue.mockClear();

    rerender({ controlledValue: 'another value' });

    expect(setInputValue).toHaveBeenCalledWith('another value');
  });
});
