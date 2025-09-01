import { renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { useOnUnMount } from './useOnUnMount';
import { sleep } from '@ls-stack/utils/sleep';

describe('useOnUnMount', () => {
  test('should call callback when component unmounts', () => {
    const callback = vi.fn();
    
    const { unmount } = renderHook(() => {
      useOnUnMount(callback);
    });
    
    expect(callback).not.toHaveBeenCalled();
    
    unmount();
    
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should call latest callback when component unmounts', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    
    const { rerender, unmount } = renderHook(
      ({ callback }) => {
        useOnUnMount(callback);
      },
      { initialProps: { callback: callback1 } }
    );
    
    rerender({ callback: callback2 });
    
    unmount();
    
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  test('should only call callback on unmount, not on callback change', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const callback3 = vi.fn();
    
    const { rerender, unmount } = renderHook(
      ({ callback }) => {
        useOnUnMount(callback);
      },
      { initialProps: { callback: callback1 } }
    );
    
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
    expect(callback3).not.toHaveBeenCalled();
    
    // When callback changes, the effect does NOT cleanup since latestCallback ref is stable
    rerender({ callback: callback2 });
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
    
    rerender({ callback: callback3 });
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
    expect(callback3).not.toHaveBeenCalled();
    
    // Only on unmount should the latest callback be called
    unmount();
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
    expect(callback3).toHaveBeenCalledTimes(1);
  });

  test('should not call callback in development with delayed cleanup when useDelayedCleanupOnDev changes', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const callback = vi.fn();
    
    const { rerender } = renderHook(
      ({ useDelay }) => {
        useOnUnMount(callback, useDelay);
      },
      { initialProps: { useDelay: false } }
    );
    
    // Change useDelayedCleanupOnDev to trigger effect cleanup
    rerender({ useDelay: true });
    
    // Should not be called immediately in production without delay
    expect(callback).toHaveBeenCalledTimes(1);
    
    // Another change should trigger effect cleanup with delay
    rerender({ useDelay: false });
    
    // Should not be called immediately due to delay (development + useDelayedCleanupOnDev was true)
    expect(callback).toHaveBeenCalledTimes(1);
    
    // Wait for timeout
    await sleep(60);
    
    // Should be called after timeout
    expect(callback).toHaveBeenCalledTimes(2);
    
    process.env.NODE_ENV = originalNodeEnv;
  });

  test('should call callback immediately in production mode regardless of delayed cleanup flag', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const callback = vi.fn();
    
    const { rerender } = renderHook(
      ({ useDelay }) => {
        useOnUnMount(callback, useDelay);
      },
      { initialProps: { useDelay: true } }
    );
    
    rerender({ useDelay: false });
    
    // Should be called immediately in production
    expect(callback).toHaveBeenCalledTimes(1);
    
    process.env.NODE_ENV = originalNodeEnv;
  });

  test('should delay callback in development with delayed cleanup flag on unmount', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const callback = vi.fn();
    
    const { unmount } = renderHook(() => {
      useOnUnMount(callback, true);
    });
    
    unmount();
    
    // Should not be called immediately
    expect(callback).not.toHaveBeenCalled();
    
    // Should be called after timeout
    await sleep(60);
    expect(callback).toHaveBeenCalledTimes(1);
    
    process.env.NODE_ENV = originalNodeEnv;
  });

  test('should call callback immediately in development when useDelayedCleanupOnDev is false', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const callback = vi.fn();
    
    const { rerender } = renderHook(
      ({ useDelay }) => {
        useOnUnMount(callback, useDelay);
      },
      { initialProps: { useDelay: false } }
    );
    
    rerender({ useDelay: true });
    
    // Should be called immediately since the cleanup runs with the OLD useDelayedCleanupOnDev: false
    expect(callback).toHaveBeenCalledTimes(1);
    
    process.env.NODE_ENV = originalNodeEnv;
  });

  test('should clear timeout when useDelayedCleanupOnDev changes quickly in development', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const callback = vi.fn();
    
    const { rerender } = renderHook(
      ({ useDelay }) => {
        useOnUnMount(callback, useDelay);
      },
      { initialProps: { useDelay: false } }
    );
    
    // First change - immediate call since useDelayedCleanupOnDev was false
    rerender({ useDelay: true });
    expect(callback).toHaveBeenCalledTimes(1);
    
    // Quick second change - should use delay since useDelayedCleanupOnDev was true
    rerender({ useDelay: false });
    expect(callback).toHaveBeenCalledTimes(1);
    
    // Quick third change - should clear the previous timeout
    rerender({ useDelay: true });
    expect(callback).toHaveBeenCalledTimes(2); // immediate call since useDelayedCleanupOnDev is false
    
    // Wait for any pending timeout
    await sleep(60);
    
    // Should still be 2 calls
    expect(callback).toHaveBeenCalledTimes(2);
    
    process.env.NODE_ENV = originalNodeEnv;
  });

  test('should handle timeout clearing correctly with multiple useDelayedCleanupOnDev changes', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const callback = vi.fn();
    
    const { rerender } = renderHook(
      ({ useDelay }) => {
        useOnUnMount(callback, useDelay);
      },
      { initialProps: { useDelay: false } }
    );
    
    // Rapid changes
    rerender({ useDelay: true }); // immediate call
    expect(callback).toHaveBeenCalledTimes(1);
    
    rerender({ useDelay: false }); // delayed call since previous was true
    expect(callback).toHaveBeenCalledTimes(1);
    
    rerender({ useDelay: true }); // immediate call since previous was false  
    expect(callback).toHaveBeenCalledTimes(2);
    
    rerender({ useDelay: false }); // delayed call since previous was true
    expect(callback).toHaveBeenCalledTimes(2);
    
    // Wait for timeout
    await sleep(60);
    
    // Should have one more call from the delayed timeout
    expect(callback).toHaveBeenCalledTimes(3);
    
    process.env.NODE_ENV = originalNodeEnv;
  });

  test('should work with async callback function', async () => {
    const asyncCallback = vi.fn(async () => {
      await sleep(10);
      return 'done';
    });
    
    const { unmount } = renderHook(() => {
      useOnUnMount(asyncCallback);
    });
    
    unmount();
    
    expect(asyncCallback).toHaveBeenCalledTimes(1);
  });

  test('should call callback when useDelayedCleanupOnDev changes', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const callback = vi.fn();
    
    const { rerender } = renderHook(
      ({ useDelay }) => {
        useOnUnMount(callback, useDelay);
      },
      { initialProps: { useDelay: false } }
    );
    
    // Changing useDelayedCleanupOnDev triggers effect cleanup
    rerender({ useDelay: true });
    expect(callback).toHaveBeenCalledTimes(1); // Called immediately since current value is false when cleanup runs
    
    rerender({ useDelay: false });
    expect(callback).toHaveBeenCalledTimes(1); // Not called yet since it uses delay (current value is true when cleanup runs) 
    
    // Wait for the delayed callback
    await sleep(60);
    expect(callback).toHaveBeenCalledTimes(2);
    
    process.env.NODE_ENV = originalNodeEnv;
  });
});