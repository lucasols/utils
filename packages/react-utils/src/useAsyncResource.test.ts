import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { sleep } from '@ls-stack/utils/sleep';
import { useAsyncResource } from './useAsyncResource';

describe('useAsyncResource', () => {
  test('should auto-load on mount (non-lazy mode)', async () => {
    const mockAsyncFn = vi.fn(async () => 'success-data');

    const { result } = renderHook(() => useAsyncResource(mockAsyncFn));

    // Initially should be loading
    expect(result.current.status).toBe('loading');
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe('success-data');
    expect(result.current.error).toBe(null);
    expect(mockAsyncFn).toHaveBeenCalledTimes(1);
  });

  test('should not auto-load in lazy mode', async () => {
    const mockAsyncFn = vi.fn(async () => 'success-data');

    const { result } = renderHook(() =>
      useAsyncResource(mockAsyncFn, { lazy: true }),
    );

    // Should remain idle until manually loaded
    expect(result.current.status).toBe('idle');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(mockAsyncFn).not.toHaveBeenCalled();

    // After small delay, should still be idle
    await sleep(10);
    expect(result.current.status).toBe('idle');
    expect(mockAsyncFn).not.toHaveBeenCalled();
  });

  test('should manually load in lazy mode', async () => {
    const mockAsyncFn = vi.fn(async () => {
      await sleep(50);
      return 'manual-load-data';
    });

    const { result } = renderHook(() =>
      useAsyncResource(mockAsyncFn, { lazy: true }),
    );

    expect(result.current.status).toBe('idle');
    expect(mockAsyncFn).not.toHaveBeenCalled();

    // Manually trigger load
    await act(async () => {
      result.current.load();
    });

    // Should be loading now
    expect(result.current.status).toBe('loading');
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe('manual-load-data');
    expect(result.current.error).toBe(null);
    expect(mockAsyncFn).toHaveBeenCalledTimes(1);
  });

  test('should handle errors correctly', async () => {
    const mockError = new Error('Test error');
    const mockAsyncFn = vi.fn(async () => {
      throw mockError;
    });

    const { result } = renderHook(() => useAsyncResource(mockAsyncFn));

    // Initially loading
    expect(result.current.status).toBe('loading');
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toMatchInlineSnapshot(`[Error: Test error]`);
    expect(mockAsyncFn).toHaveBeenCalledTimes(1);
  });

  test('should handle string errors', async () => {
    const mockAsyncFn = vi.fn(async () => {
      throw 'String error';
    });

    const { result } = renderHook(() => useAsyncResource(mockAsyncFn));

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.error).toMatchInlineSnapshot(`[Error: String error]`);
  });

  test('should allow reload after success', async () => {
    let callCount = 0;
    const mockAsyncFn = vi.fn(async () => {
      await sleep(50);
      callCount++;
      return `data-${callCount}`;
    });

    const { result } = renderHook(() => useAsyncResource(mockAsyncFn));

    // Wait for first load to complete
    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.data).toBe('data-1');
    expect(mockAsyncFn).toHaveBeenCalledTimes(1);

    // Reload
    await act(async () => {
      result.current.load();
    });

    // Should be loading
    expect(result.current.status).toBe('loading');

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.data).toBe('data-2');
    expect(mockAsyncFn).toHaveBeenCalledTimes(2);
  });

  test('should allow reload after error', async () => {
    let shouldThrow = true;
    const mockAsyncFn = vi.fn(async () => {
      await sleep(50);
      if (shouldThrow) {
        throw new Error('First attempt failed');
      }
      return 'success-after-error';
    });

    const { result } = renderHook(() => useAsyncResource(mockAsyncFn));

    // Wait for error
    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.error).toMatchInlineSnapshot(
      `[Error: First attempt failed]`,
    );
    expect(mockAsyncFn).toHaveBeenCalledTimes(1);

    // Update function behavior and reload
    shouldThrow = false;
    await act(async () => {
      result.current.load();
    });

    // Should be loading
    expect(result.current.status).toBe('loading');

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.data).toBe('success-after-error');
    expect(result.current.error).toBe(null);
    expect(mockAsyncFn).toHaveBeenCalledTimes(2);
  });

  test('should prevent multiple concurrent loads', async () => {
    const mockAsyncFn = vi.fn(
      async () =>
        new Promise<string>((resolve) => {
          setTimeout(() => resolve('slow-data'), 100);
        }),
    );

    const { result } = renderHook(() =>
      useAsyncResource(mockAsyncFn, { lazy: true }),
    );

    // Trigger multiple loads rapidly
    result.current.load();
    result.current.load();
    result.current.load();

    // Wait for completion
    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    // Should only have called the function once
    expect(mockAsyncFn).toHaveBeenCalledTimes(1);
    expect(result.current.data).toBe('slow-data');
  });

  test('should cleanup on unmount', async () => {
    const mockAsyncFn = vi.fn(
      async () =>
        new Promise<string>((resolve) => {
          setTimeout(() => resolve('data'), 100);
        }),
    );

    const { result, unmount } = renderHook(() => useAsyncResource(mockAsyncFn));

    expect(result.current.status).toBe('loading');

    // Unmount before completion
    unmount();

    // Wait to ensure async operation would have completed
    await sleep(150);

    // Function should have been called, but state shouldn't update after unmount
    expect(mockAsyncFn).toHaveBeenCalledTimes(1);
  });

  test('should handle synchronous errors', async () => {
    const mockAsyncFn = vi.fn(() => {
      throw new Error('Synchronous error');
    });

    const { result } = renderHook(() => useAsyncResource(mockAsyncFn));

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.error).toMatchInlineSnapshot(
      `[Error: Synchronous error]`,
    );
  });

  test('should handle undefined/null return values', async () => {
    const mockAsyncFn = vi.fn(async () => undefined);

    const { result } = renderHook(() => useAsyncResource(mockAsyncFn));

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.data).toBe(undefined);
    expect(result.current.error).toBe(null);
  });

  test('should use new function when load is called after change', async () => {
    const mockAsyncFn1 = vi.fn(async () => {
      await sleep(50);
      return 'data1';
    });
    const mockAsyncFn2 = vi.fn(async () => {
      await sleep(50);
      return 'data2';
    });

    const { result, rerender } = renderHook(
      ({ fn }) => useAsyncResource(fn),
      { initialProps: { fn: mockAsyncFn1 } },
    );

    // Wait for first load
    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });
    expect(result.current.data).toBe('data1');

    // Change the function - should not automatically trigger reload
    await act(async () => {
      rerender({ fn: mockAsyncFn2 });
    });

    // Status should remain success (no auto-reload)
    expect(result.current.status).toBe('success');
    expect(result.current.data).toBe('data1');
    expect(mockAsyncFn2).not.toHaveBeenCalled();

    // Manually load - should use new function
    await act(async () => {
      result.current.load();
    });

    expect(result.current.status).toBe('loading');

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.data).toBe('data2');
    expect(mockAsyncFn1).toHaveBeenCalledTimes(1);
    expect(mockAsyncFn2).toHaveBeenCalledTimes(1);
  });

  test('should maintain stable load function reference', () => {
    const mockAsyncFn = vi.fn(async () => 'data');

    const { result, rerender } = renderHook(() => useAsyncResource(mockAsyncFn));

    const firstLoadRef = result.current.load;

    rerender();
    expect(result.current.load).toBe(firstLoadRef);
  });

  test('should clear previous data when starting new load', async () => {
    let returnValue = 'initial-data';
    const mockAsyncFn = vi.fn(async () => {
      await sleep(50);
      return returnValue;
    });

    const { result } = renderHook(() => useAsyncResource(mockAsyncFn));

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });
    expect(result.current.data).toBe('initial-data');

    // Change return value and reload
    returnValue = 'new-data';
    await act(async () => {
      result.current.load();
    });

    // Should set loading and clear data
    expect(result.current.status).toBe('loading');
    expect(result.current.data).toBe(null);

    // Wait for new data
    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });
    expect(result.current.data).toBe('new-data');
  });

  test('should clear previous error when starting new load', async () => {
    let shouldThrow = true;
    const mockAsyncFn = vi.fn(async () => {
      await sleep(50);
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return 'success-data';
    });

    const { result } = renderHook(() => useAsyncResource(mockAsyncFn));

    // Wait for error
    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });
    expect(result.current.error).toMatchInlineSnapshot(`[Error: Test error]`);

    // Update function behavior and reload
    shouldThrow = false;
    await act(async () => {
      result.current.load();
    });

    // Should clear error and be loading
    expect(result.current.status).toBe('loading');
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });
    expect(result.current.data).toBe('success-data');
    expect(result.current.error).toBe(null);
  });

  describe('asyncFnUsesExternalDeps option', () => {
    test('should auto-refetch when function changes with asyncFnUsesExternalDeps: true', async () => {
      const mockAsyncFn1 = vi.fn(async () => {
        await sleep(50);
        return 'data1';
      });
      const mockAsyncFn2 = vi.fn(async () => {
        await sleep(50);
        return 'data2';
      });

      const { result, rerender } = renderHook(
        ({ fn }) => useAsyncResource(fn, { asyncFnUsesExternalDeps: true }),
        { initialProps: { fn: mockAsyncFn1 } },
      );

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });
      expect(result.current.data).toBe('data1');

      // Change the function - should trigger refetch automatically
      await act(async () => {
        rerender({ fn: mockAsyncFn2 });
      });

      // Should be refetching and preserve previous data
      expect(result.current.status).toBe('refetching');
      expect(result.current.data).toBe('data1'); // Previous data preserved
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });

      expect(result.current.data).toBe('data2');
      expect(result.current.isLoading).toBe(false);
      expect(mockAsyncFn1).toHaveBeenCalledTimes(1);
      expect(mockAsyncFn2).toHaveBeenCalledTimes(1);
    });

    test('should not auto-refetch when function changes with asyncFnUsesExternalDeps: false', async () => {
      const mockAsyncFn1 = vi.fn(async () => {
        await sleep(50);
        return 'data1';
      });
      const mockAsyncFn2 = vi.fn(async () => {
        await sleep(50);
        return 'data2';
      });

      const { result, rerender } = renderHook(
        ({ fn }) => useAsyncResource(fn, { asyncFnUsesExternalDeps: false }),
        { initialProps: { fn: mockAsyncFn1 } },
      );

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });
      expect(result.current.data).toBe('data1');

      // Change the function - should not trigger refetch
      await act(async () => {
        rerender({ fn: mockAsyncFn2 });
      });

      // Should remain in success state with original data
      expect(result.current.status).toBe('success');
      expect(result.current.data).toBe('data1');
      expect(result.current.isLoading).toBe(false);
      expect(mockAsyncFn2).not.toHaveBeenCalled();
    });

    test('should refetch after error state when function changes', async () => {
      const mockAsyncFn1 = vi.fn(async () => {
        await sleep(50);
        throw new Error('Initial error');
      });
      const mockAsyncFn2 = vi.fn(async () => {
        await sleep(50);
        return 'data2';
      });

      const { result, rerender } = renderHook(
        ({ fn }) => useAsyncResource(fn, { asyncFnUsesExternalDeps: true }),
        { initialProps: { fn: mockAsyncFn1 } },
      );

      // Wait for error
      await waitFor(() => {
        expect(result.current.status).toBe('error');
      });
      expect(result.current.error).toMatchInlineSnapshot(`[Error: Initial error]`);

      // Change the function - should trigger refetch automatically
      await act(async () => {
        rerender({ fn: mockAsyncFn2 });
      });

      // Should be refetching, preserving error data
      expect(result.current.status).toBe('refetching');
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null); // Error cleared during refetch
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });

      expect(result.current.data).toBe('data2');
      expect(result.current.error).toBe(null);
      expect(mockAsyncFn2).toHaveBeenCalledTimes(1);
    });

    test('should work in lazy mode with manual load after function change', async () => {
      const mockAsyncFn1 = vi.fn(async () => {
        await sleep(50);
        return 'data1';
      });
      const mockAsyncFn2 = vi.fn(async () => {
        await sleep(50);
        return 'data2';
      });

      const { result, rerender } = renderHook(
        ({ fn }) => useAsyncResource(fn, { lazy: true, asyncFnUsesExternalDeps: true }),
        { initialProps: { fn: mockAsyncFn1 } },
      );

      // Initial state should be idle
      expect(result.current.status).toBe('idle');

      // Manual load
      await act(async () => {
        result.current.load();
      });

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });
      expect(result.current.data).toBe('data1');

      // Change function - should trigger refetch in lazy mode too
      await act(async () => {
        rerender({ fn: mockAsyncFn2 });
      });

      expect(result.current.status).toBe('refetching');
      expect(result.current.data).toBe('data1'); // Preserved

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });
      expect(result.current.data).toBe('data2');
    });

    test('should handle manual load during refetch', async () => {
      const mockAsyncFn1 = vi.fn(async () => {
        await sleep(50);
        return 'data1';
      });
      const mockAsyncFn2 = vi.fn(async () => {
        await sleep(100); // Slower to allow manual interruption
        return 'data2';
      });

      const { result, rerender } = renderHook(
        ({ fn }) => useAsyncResource(fn, { asyncFnUsesExternalDeps: true }),
        { initialProps: { fn: mockAsyncFn1 } },
      );

      // Wait for initial success
      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });
      expect(result.current.data).toBe('data1');

      // Change function to trigger refetch
      await act(async () => {
        rerender({ fn: mockAsyncFn2 });
      });

      expect(result.current.status).toBe('refetching');
      expect(result.current.data).toBe('data1');

      // Manual load during refetch - should cancel refetch and start fresh load
      await act(async () => {
        result.current.load();
      });

      expect(result.current.status).toBe('loading');
      expect(result.current.data).toBe(null); // Cleared by manual load

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });
      expect(result.current.data).toBe('data2');
    });

    test('should not refetch on initial mount', async () => {
      const mockAsyncFn = vi.fn(async () => {
        await sleep(50);
        return 'data';
      });

      const { result } = renderHook(() => 
        useAsyncResource(mockAsyncFn, { asyncFnUsesExternalDeps: true })
      );

      // Should do initial load, not refetch
      expect(result.current.status).toBe('loading');

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });

      expect(result.current.data).toBe('data');
      expect(mockAsyncFn).toHaveBeenCalledTimes(1);
    });

    test('should preserve isLoading state during refetch', async () => {
      const mockAsyncFn1 = vi.fn(async () => {
        await sleep(50);
        return 'data1';
      });
      const mockAsyncFn2 = vi.fn(async () => {
        await sleep(50);
        return 'data2';
      });

      const { result, rerender } = renderHook(
        ({ fn }) => useAsyncResource(fn, { asyncFnUsesExternalDeps: true }),
        { initialProps: { fn: mockAsyncFn1 } },
      );

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });
      expect(result.current.isLoading).toBe(false);

      // Change function to trigger refetch
      await act(async () => {
        rerender({ fn: mockAsyncFn2 });
      });

      // Should show loading during refetch
      expect(result.current.status).toBe('refetching');
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });
      expect(result.current.isLoading).toBe(false);
    });

    test('should handle function changes that result in errors during refetch', async () => {
      const mockAsyncFn1 = vi.fn(async () => {
        await sleep(50);
        return 'data1';
      });
      const mockAsyncFn2 = vi.fn(async () => {
        await sleep(50);
        throw new Error('Refetch failed');
      });

      const { result, rerender } = renderHook(
        ({ fn }) => useAsyncResource(fn, { asyncFnUsesExternalDeps: true }),
        { initialProps: { fn: mockAsyncFn1 } },
      );

      // Wait for initial success
      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });
      expect(result.current.data).toBe('data1');

      // Change to failing function
      await act(async () => {
        rerender({ fn: mockAsyncFn2 });
      });

      expect(result.current.status).toBe('refetching');
      expect(result.current.data).toBe('data1'); // Preserved during refetch

      // Should transition to error state
      await waitFor(() => {
        expect(result.current.status).toBe('error');
      });

      expect(result.current.error).toMatchInlineSnapshot(`[Error: Refetch failed]`);
      expect(result.current.data).toBe(null); // Cleared on error
      expect(result.current.isLoading).toBe(false);
    });

    test('should restart with new function when function changes during initial loading', async () => {
      let resolveFirst: (value: string) => void;
      let resolveSecond: (value: string) => void;
      
      const mockAsyncFn1 = vi.fn(() => 
        new Promise<string>((resolve) => {
          resolveFirst = resolve;
        })
      );
      
      const mockAsyncFn2 = vi.fn(() => 
        new Promise<string>((resolve) => {
          resolveSecond = resolve;
        })
      );

      const { result, rerender } = renderHook(
        ({ fn }) => useAsyncResource(fn, { asyncFnUsesExternalDeps: true }),
        { initialProps: { fn: mockAsyncFn1 } }
      );

      // Should start loading with first function
      expect(result.current.status).toBe('loading');
      expect(mockAsyncFn1).toHaveBeenCalledTimes(1);

      // Change function while still loading - should restart
      await act(async () => {
        rerender({ fn: mockAsyncFn2 });
      });

      // Should have restarted with second function
      expect(result.current.status).toBe('loading');
      expect(mockAsyncFn2).toHaveBeenCalledTimes(1);

      // Resolve first function (should be ignored)
      await act(async () => {
        resolveFirst('stale-data');
      });

      // Should still be loading, not resolved with stale data
      expect(result.current.status).toBe('loading');
      expect(result.current.data).toBe(null);

      // Resolve second function (should be used)
      await act(async () => {
        resolveSecond('fresh-data');
      });

      // Should now be success with fresh data
      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });
      
      expect(result.current.data).toBe('fresh-data');
      expect(result.current.error).toBe(null);
    });

    test('should handle multiple function changes during loading', async () => {
      let currentResolve: (value: string) => void;
      let callCount = 0;
      
      const createAsyncFn = (_id: number) => vi.fn(() => 
        new Promise<string>((resolve) => {
          currentResolve = resolve;
          callCount++;
        })
      );

      const fn1 = createAsyncFn(1);
      const fn2 = createAsyncFn(2);
      const fn3 = createAsyncFn(3);

      const { result, rerender } = renderHook(
        ({ fn }) => useAsyncResource(fn, { asyncFnUsesExternalDeps: true }),
        { initialProps: { fn: fn1 } }
      );

      expect(result.current.status).toBe('loading');

      // Change function twice rapidly
      await act(async () => {
        rerender({ fn: fn2 });
      });
      
      await act(async () => {
        rerender({ fn: fn3 });
      });

      // Should have called functions multiple times due to restarts
      expect(callCount).toBeGreaterThan(1);

      // Resolve with final result
      await act(async () => {
        currentResolve('final-data');
      });

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });

      expect(result.current.data).toBe('final-data');
    });
  });
});