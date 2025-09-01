import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { usePrevious, usePreviousChanged } from './usePrevious';

describe('usePrevious', () => {
  test('returns undefined on initial render without initial value', () => {
    const { result } = renderHook(() => usePrevious('current'));
    expect(result.current).toBeUndefined();
  });

  test('returns initial value on initial render when provided', () => {
    const { result } = renderHook(() => usePrevious('current', 'initial'));
    expect(result.current).toBe('initial');
  });

  test('returns previous value after rerender', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 'first' },
    });

    expect(result.current).toBeUndefined();

    rerender({ value: 'second' });
    expect(result.current).toBe('first');

    rerender({ value: 'third' });
    expect(result.current).toBe('second');
  });

  test('works with different data types', () => {
    // Test with numbers
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 1 } },
    );

    expect(numberResult.current).toBeUndefined();

    numberRerender({ value: 2 });
    expect(numberResult.current).toBe(1);

    // Test with booleans
    const { result: booleanResult, rerender: booleanRerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: true } },
    );

    expect(booleanResult.current).toBeUndefined();

    booleanRerender({ value: false });
    expect(booleanResult.current).toBe(true);

    // Test with objects
    const obj1 = { foo: 'bar' };
    const obj2 = { foo: 'baz' };
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: obj1 } },
    );

    expect(objectResult.current).toBeUndefined();

    objectRerender({ value: obj2 });
    expect(objectResult.current).toBe(obj1);
  });

  test('works with objects and arrays', () => {
    const obj1 = { name: 'John' };
    const obj2 = { name: 'Jane' };
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: obj1 },
    });

    expect(result.current).toBeUndefined();

    rerender({ value: obj2 });
    expect(result.current).toBe(obj1);
  });

  test('maintains type safety with generic', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 'string' },
    });

    // TypeScript should infer the correct type
    const previous: string | undefined = result.current;
    expect(typeof previous).toBe('undefined');

    rerender({ value: 'new string' });
    const previousString: string | undefined = result.current;
    expect(typeof previousString).toBe('string');
  });
});

describe('usePreviousChanged', () => {
  test('returns initial value on first render', () => {
    const { result } = renderHook(() => usePreviousChanged('current', 'initial'));
    expect(result.current).toBe('initial');
  });

  test('updates only when value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePreviousChanged(value, 'initial'),
      { initialProps: { value: 'first' } },
    );

    // Initial render shows the initial value
    expect(result.current).toBe('initial');

    // First rerender, value changes from 'initial' to 'first'
    // Effect runs after render, updating ref.current to 'first'
    rerender({ value: 'second' });
    expect(result.current).toBe('first');

    // Second rerender, value changes from 'first' to 'second'
    rerender({ value: 'third' });
    expect(result.current).toBe('second');
  });

  test('does not update when value is the same', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePreviousChanged(value, 'initial'),
      { initialProps: { value: 'same' } },
    );

    expect(result.current).toBe('initial');

    // Value changes from 'initial' to 'same', so it updates
    rerender({ value: 'same' });
    expect(result.current).toBe('same');

    // Same value, no update
    rerender({ value: 'same' });
    expect(result.current).toBe('same');
  });

  test('works with custom equality function', () => {
    const customEqualityFn = (a: any, b: any) => a?.id === b?.id;
    
    const { result, rerender } = renderHook(
      ({ value }) => usePreviousChanged(value, { id: 0, name: 'initial' }, customEqualityFn),
      { initialProps: { value: { id: 1, name: 'first' } } },
    );

    expect(result.current).toEqual({ id: 0, name: 'initial' });

    // Different id, should update after render
    rerender({ value: { id: 1, name: 'first' } });
    expect(result.current).toEqual({ id: 1, name: 'first' });

    // Same id, different name - should not update because custom equality returns true
    rerender({ value: { id: 1, name: 'updated' } });
    expect(result.current).toEqual({ id: 1, name: 'first' }); // Unchanged due to equality function

    // Different id, should update after next render
    rerender({ value: { id: 2, name: 'second' } });
    rerender({ value: { id: 3, name: 'third' } });
    expect(result.current).toEqual({ id: 2, name: 'second' });
  });

  test('works with primitive values and default equality', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePreviousChanged(value, 0),
      { initialProps: { value: 1 } },
    );

    expect(result.current).toBe(0);

    rerender({ value: 1 });
    expect(result.current).toBe(1);

    rerender({ value: 1 }); // Same value, no update
    expect(result.current).toBe(1);

    rerender({ value: 2 }); // Different value
    rerender({ value: 3 }); // Need another render to see the update
    expect(result.current).toBe(2);
  });

  test('works with undefined initial value', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePreviousChanged(value),
      { initialProps: { value: 'first' } },
    );

    expect(result.current).toBeUndefined();

    rerender({ value: 'second' });
    expect(result.current).toBe('first');
  });

  test('handles NaN values correctly with Object.is', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePreviousChanged(value, 0),
      { initialProps: { value: NaN } },
    );

    expect(result.current).toBe(0);

    rerender({ value: NaN });
    expect(result.current).toBe(NaN);

    rerender({ value: NaN }); // Same NaN value
    expect(result.current).toBe(NaN); // No update because Object.is(NaN, NaN) is true

    rerender({ value: 1 }); // Different from NaN
    rerender({ value: 2 }); // Need another render to see the update
    expect(result.current).toBe(1);
  });

  test('handles +0 and -0 correctly with Object.is', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePreviousChanged(value, 1),
      { initialProps: { value: +0 } },
    );

    expect(result.current).toBe(1);

    rerender({ value: +0 });
    expect(result.current).toBe(+0);

    rerender({ value: -0 }); // +0 === -0 is true, but Object.is(+0, -0) is false
    rerender({ value: 1 }); // Need another render to see the update
    expect(result.current).toBe(-0); // Should update because they're different according to Object.is
  });
});