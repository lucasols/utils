import { sleep } from '@ls-stack/utils/sleep';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { type MountAnimStates, useAnimateMountUnmount } from './useAnimateMountUnmount';

describe('useAnimateMountUnmount - Initial State', () => {
  test('should start with "from" state when show is true', () => {
    const { result } = renderHook(() => useAnimateMountUnmount(true, 100));
    
    const [animState, renderElement] = result.current;
    
    expect(animState).toBe('from');
    expect(renderElement).toBe(true);
  });

  test('should start with "unmounted" state when show is false', () => {
    const { result } = renderHook(() => useAnimateMountUnmount(false, 100));
    
    const [animState, renderElement] = result.current;
    
    expect(animState).toBe('unmounted');
    expect(renderElement).toBe(false);
  });
});

describe('useAnimateMountUnmount - Mount Animation Flow', () => {
  test('should transition from "from" to "enter" when mounted', async () => {
    const { result } = renderHook(() => useAnimateMountUnmount(true, 100));
    
    expect(result.current[0]).toBe('from');
    expect(result.current[1]).toBe(true);
    
    // Wait for the 5ms timeout to trigger transition
    await sleep(15);
    await waitFor(() => {
      expect(result.current[0]).toBe('enter');
    }, { timeout: 200 });
    
    expect(result.current[1]).toBe(true);
  });

  test('should transition from unmounted to mounted through proper states', async () => {
    const { result, rerender } = renderHook(
      ({ show }) => useAnimateMountUnmount(show, 100),
      { initialProps: { show: false } }
    );
    
    expect(result.current[0]).toBe('unmounted');
    expect(result.current[1]).toBe(false);
    
    // Trigger mount
    rerender({ show: true });
    
    // Should start at 'from'
    expect(result.current[0]).toBe('from');
    expect(result.current[1]).toBe(true);
    
    // Wait for transition to 'enter'
    await sleep(15);
    await waitFor(() => {
      expect(result.current[0]).toBe('enter');
    }, { timeout: 200 });
    
    expect(result.current[1]).toBe(true);
  });
});

describe('useAnimateMountUnmount - Unmount Animation Flow', () => {
  test('should transition from "enter" to "leave" to "unmounted" when hiding', async () => {
    const animationDuration = 50;
    const { result, rerender } = renderHook(
      ({ show }) => useAnimateMountUnmount(show, animationDuration),
      { initialProps: { show: true } }
    );
    
    // Wait for mount animation to complete
    await sleep(15);
    await waitFor(() => {
      expect(result.current[0]).toBe('enter');
    }, { timeout: 200 });
    
    // Trigger unmount
    rerender({ show: false });
    
    // Should go to 'leave' state
    expect(result.current[0]).toBe('leave');
    expect(result.current[1]).toBe(true);
    
    // Wait for animation duration to complete
    await sleep(animationDuration + 10);
    await waitFor(() => {
      expect(result.current[0]).toBe('unmounted');
    }, { timeout: 100 });
    
    expect(result.current[1]).toBe(false);
  });

  test('should respect custom animation duration', async () => {
    const animationDuration = 30;
    const { result, rerender } = renderHook(
      ({ show }) => useAnimateMountUnmount(show, animationDuration),
      { initialProps: { show: true } }
    );
    
    // Wait for mount to complete
    await sleep(15);
    await waitFor(() => {
      expect(result.current[0]).toBe('enter');
    }, { timeout: 200 });
    
    // Start unmount
    rerender({ show: false });
    expect(result.current[0]).toBe('leave');
    
    // Should not be unmounted before duration
    await sleep(animationDuration - 10);
    expect(result.current[0]).toBe('leave');
    
    // Should be unmounted after duration
    await sleep(20);
    await waitFor(() => {
      expect(result.current[0]).toBe('unmounted');
    }, { timeout: 100 });
  });
});

describe('useAnimateMountUnmount - Rapid Toggling', () => {
  test('should handle rapid show/hide during mount animation', async () => {
    const { result, rerender } = renderHook(
      ({ show }) => useAnimateMountUnmount(show, 100),
      { initialProps: { show: false } }
    );
    
    // Start mount
    rerender({ show: true });
    expect(result.current[0]).toBe('from');
    
    // Immediately toggle off before entering
    rerender({ show: false });
    expect(result.current[0]).toBe('leave');
    expect(result.current[1]).toBe(true);
    
    // Wait for unmount animation to complete
    await sleep(110);
    await waitFor(() => {
      expect(result.current[0]).toBe('unmounted');
    }, { timeout: 100 });
    
    expect(result.current[1]).toBe(false);
  });

  test('should handle interrupting leave state with mount request', async () => {
    const { result, rerender } = renderHook(
      ({ show }) => useAnimateMountUnmount(show, 100),
      { initialProps: { show: true } }
    );
    
    // Wait for mount animation to complete
    await sleep(15);
    await waitFor(() => {
      expect(result.current[0]).toBe('enter');
    }, { timeout: 200 });
    
    // Start unmount
    rerender({ show: false });
    expect(result.current[0]).toBe('leave');
    
    // Interrupt with mount before animation completes
    await sleep(20);
    rerender({ show: true });
    
    // Should start mount animation
    expect(result.current[0]).toBe('from');
    
    // Wait for mount animation to complete
    await sleep(15);
    await waitFor(() => {
      expect(result.current[0]).toBe('enter');
    }, { timeout: 200 });
  });

  test('should handle multiple rapid toggles', async () => {
    const { result, rerender } = renderHook(
      ({ show }) => useAnimateMountUnmount(show, 50),
      { initialProps: { show: false } }
    );
    
    // Rapid fire toggles
    rerender({ show: true });
    rerender({ show: false });
    rerender({ show: true });
    rerender({ show: false });
    
    // Should end in leave state
    expect(result.current[0]).toBe('leave');
    expect(result.current[1]).toBe(true);
    
    // Wait for unmount animation to complete
    await sleep(60);
    await waitFor(() => {
      expect(result.current[0]).toBe('unmounted');
    }, { timeout: 100 });
    
    expect(result.current[1]).toBe(false);
  });
});

describe('useAnimateMountUnmount - Edge Cases', () => {
  test('should handle unmounting component during animation', async () => {
    const { result, rerender, unmount } = renderHook(
      ({ show }) => useAnimateMountUnmount(show, 100),
      { initialProps: { show: true } }
    );
    
    // Start unmount animation
    rerender({ show: false });
    expect(result.current[0]).toBe('leave');
    
    // Unmount component during animation
    unmount();
    
    // Should not throw errors or cause warnings
    await sleep(150);
  });

  test('should maintain correct renderElement flag for all states', () => {
    const states: Array<{ show: boolean; expectedStates: MountAnimStates[] }> = [
      { show: false, expectedStates: ['unmounted'] },
      { show: true, expectedStates: ['from', 'enter'] },
    ];
    
    for (const { show, expectedStates } of states) {
      const { result } = renderHook(() => useAnimateMountUnmount(show, 100));
      const [animState, renderElement] = result.current;
      
      expect(expectedStates).toContain(animState);
      
      if (animState === 'unmounted') {
        expect(renderElement).toBe(false);
      } else {
        expect(renderElement).toBe(true);
      }
    }
  });

  test('should clear timeouts when component unmounts', async () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    
    const { result, rerender, unmount } = renderHook(
      ({ show }) => useAnimateMountUnmount(show, 100),
      { initialProps: { show: true } }
    );
    
    // Start unmount animation to create a timeout
    rerender({ show: false });
    expect(result.current[0]).toBe('leave');
    
    // Unmount the component
    unmount();
    
    // clearTimeout should have been called
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });
});

describe('useAnimateMountUnmount - State Transitions', () => {
  test('should never skip required transition states', async () => {
    const states: MountAnimStates[] = [];
    
    const { result, rerender } = renderHook(
      ({ show }) => {
        const [animState] = useAnimateMountUnmount(show, 50);
        states.push(animState);
        return animState;
      },
      { initialProps: { show: false } }
    );
    
    // Start with false - should be unmounted
    expect(states).toContain('unmounted');
    
    // Mount - should go through proper sequence
    rerender({ show: true });
    
    // Wait for complete mount animation
    await sleep(15);
    await waitFor(() => {
      expect(result.current).toBe('enter');
    }, { timeout: 200 });
    
    // Check that we went through proper states
    expect(states).toContain('from');
    expect(states).toContain('enter');
  });

  test('should handle edge case where show is false but state is not unmounted on initial render', async () => {
    // This tests the guard clause in the effect
    const { result, rerender } = renderHook(
      ({ show }) => useAnimateMountUnmount(show, 100),
      { initialProps: { show: true } }
    );
    
    // Wait for mount animation to complete
    await sleep(15);
    await waitFor(() => {
      expect(result.current[0]).toBe('enter');
    }, { timeout: 200 });
    
    // Now toggle to false - should start leave animation
    rerender({ show: false });
    
    expect(result.current[0]).toBe('leave');
    expect(result.current[1]).toBe(true);
  });
});