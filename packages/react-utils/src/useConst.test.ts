import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useConst } from './useConst';

describe('useConst', () => {
  it('should call getValue function only once', () => {
    const getValue = vi.fn(() => 'test-value');
    
    const { rerender } = renderHook(() => useConst(getValue));
    
    expect(getValue).toHaveBeenCalledTimes(1);
    expect(getValue).toHaveBeenCalledWith();
    
    rerender();
    rerender();
    
    expect(getValue).toHaveBeenCalledTimes(1);
  });

  it('should return the same value on multiple renders', () => {
    const testValue = { id: 1, name: 'test' };
    const getValue = vi.fn(() => testValue);
    
    const { result, rerender } = renderHook(() => useConst(getValue));
    
    const firstResult = result.current;
    expect(firstResult).toBe(testValue);
    
    rerender();
    expect(result.current).toBe(firstResult);
    
    rerender();
    expect(result.current).toBe(firstResult);
  });

  it('should work with different value types', () => {
    const { result: stringResult } = renderHook(() => useConst(() => 'string'));
    expect(stringResult.current).toBe('string');

    const { result: numberResult } = renderHook(() => useConst(() => 42));
    expect(numberResult.current).toBe(42);

    const { result: objectResult } = renderHook(() => useConst(() => ({ test: true })));
    expect(objectResult.current).toEqual({ test: true });

    const { result: arrayResult } = renderHook(() => useConst(() => [1, 2, 3]));
    expect(arrayResult.current).toEqual([1, 2, 3]);
  });

  it('should work with lazy computation', () => {
    const expensiveComputation = vi.fn(() => {
      return Array.from({ length: 1000 }, (_, i) => i).reduce((a, b) => a + b, 0);
    });
    
    const { result, rerender } = renderHook(() => useConst(expensiveComputation));
    
    expect(expensiveComputation).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(499500);
    
    rerender();
    expect(expensiveComputation).toHaveBeenCalledTimes(1);
  });
});