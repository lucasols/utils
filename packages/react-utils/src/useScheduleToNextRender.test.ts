import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { useScheduleToNextRender } from './useScheduleToNextRender';

describe('useScheduleToNextRender - Basic functionality', () => {
  test('should schedule callback to run on next render', async () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useScheduleToNextRender());

    // Initially callback should not be called
    expect(callback).not.toHaveBeenCalled();

    // Schedule the callback
    result.current(callback);

    // Callback should be called after the effect runs
    await waitFor(() => {
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  test('should call all scheduled callbacks in order when multiple are scheduled before render', async () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const callback3 = vi.fn();
    const { result } = renderHook(() => useScheduleToNextRender());

    // Schedule multiple callbacks quickly
    result.current(callback1);
    result.current(callback2);
    result.current(callback3);

    // Wait for effects to run
    await waitFor(() => {
      expect(callback3).toHaveBeenCalledTimes(1);
    });

    // All callbacks should have been called in order
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(callback3).toHaveBeenCalledTimes(1);
  });

  test('should call only the last scheduled callback when in single mode', async () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const callback3 = vi.fn();
    const { result } = renderHook(() => useScheduleToNextRender({ mode: 'single' }));

    // Schedule multiple callbacks quickly
    result.current(callback1);
    result.current(callback2);
    result.current(callback3);

    // Wait for effects to run
    await waitFor(() => {
      expect(callback3).toHaveBeenCalledTimes(1);
    });

    // Only the last callback should have been called
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
  });

  test('should return the same schedule function reference across renders', () => {
    const { result, rerender } = renderHook(() => useScheduleToNextRender());

    const firstSchedule = result.current;
    rerender();
    const secondSchedule = result.current;
    rerender();
    const thirdSchedule = result.current;

    expect(firstSchedule).toBe(secondSchedule);
    expect(secondSchedule).toBe(thirdSchedule);
  });
});

describe('useScheduleToNextRender - Sequential callbacks', () => {
  test('should allow scheduling new callbacks after previous execution', async () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const { result } = renderHook(() => useScheduleToNextRender());

    // Schedule first callback
    result.current(callback1);

    await waitFor(() => {
      expect(callback1).toHaveBeenCalledTimes(1);
    });

    // Schedule second callback
    result.current(callback2);

    await waitFor(() => {
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    expect(callback1).toHaveBeenCalledTimes(1);
  });
});

describe('useScheduleToNextRender - Key deduplication', () => {
  test('should replace callback when same key is used', async () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const { result } = renderHook(() => useScheduleToNextRender());

    // Schedule callbacks with same key
    result.current(callback1, 'update');
    result.current(callback2, 'update'); // Should replace callback1

    await waitFor(() => {
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    // Only the second callback should have been called
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  test('should execute callbacks with different keys', async () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const callback3 = vi.fn();
    const { result } = renderHook(() => useScheduleToNextRender());

    // Schedule callbacks with different keys
    result.current(callback1, 'action1');
    result.current(callback2, 'action2');
    result.current(callback3); // No key (auto-generated)

    await waitFor(() => {
      expect(callback3).toHaveBeenCalledTimes(1);
    });

    // All callbacks should have been called
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(callback3).toHaveBeenCalledTimes(1);
  });

  test('should maintain insertion order with key replacements', async () => {
    const executionOrder: string[] = [];
    const callback1 = vi.fn(() => executionOrder.push('first'));
    const callback2 = vi.fn(() => executionOrder.push('replaced'));
    const callback3 = vi.fn(() => executionOrder.push('last'));
    const { result } = renderHook(() => useScheduleToNextRender());

    // Schedule in order: first, replace, last
    result.current(callback1, 'first');
    result.current(() => executionOrder.push('original'), 'middle');
    result.current(callback3, 'last');
    result.current(callback2, 'middle'); // Replace the middle callback

    await waitFor(() => {
      expect(callback3).toHaveBeenCalledTimes(1);
    });

    expect(executionOrder).toMatchInlineSnapshot(`
      [
        "first",
        "replaced",
        "last",
      ]
    `);
  });

  test('should handle mixed keyed and non-keyed callbacks', async () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const callback3 = vi.fn();
    const callback4 = vi.fn();
    const { result } = renderHook(() => useScheduleToNextRender());

    // Mix of keyed and non-keyed callbacks
    result.current(callback1); // auto key 1
    result.current(callback2, 'named');
    result.current(callback3); // auto key 2
    result.current(callback4, 'named'); // Should replace callback2

    await waitFor(() => {
      expect(callback3).toHaveBeenCalledTimes(1);
    });

    // callback1, callback4 (replaced callback2), and callback3 should be called
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled(); // Replaced
    expect(callback3).toHaveBeenCalledTimes(1);
    expect(callback4).toHaveBeenCalledTimes(1);
  });

  test('should handle empty key', async () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const { result } = renderHook(() => useScheduleToNextRender());

    // Schedule callbacks with empty key
    result.current(callback1, '');
    result.current(callback2, ''); // Should replace callback1

    await waitFor(() => {
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });
});
