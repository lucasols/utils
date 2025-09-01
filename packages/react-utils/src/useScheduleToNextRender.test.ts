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

  test('should call only the last scheduled callback when multiple are scheduled before render', async () => {
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
