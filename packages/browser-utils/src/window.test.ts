import { describe, expect, it, vi, beforeEach } from 'vitest';
import { onWindowFocus, isWindowFocused } from './window';

// Mock the throttle function
vi.mock('@ls-stack/utils/throttle', () => ({
  throttle: vi.fn((fn) => fn) // Return the original function for testing
}));

// Mock window and document objects
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
const mockHasFocus = vi.fn();

Object.defineProperty(global, 'window', {
  value: {
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
  },
  writable: true,
});

Object.defineProperty(global, 'document', {
  value: {
    visibilityState: 'visible',
    hasFocus: mockHasFocus,
  },
  writable: true,
});

describe('onWindowFocus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add event listeners for focus and visibilitychange', () => {
    const handler = vi.fn();
    
    onWindowFocus(handler);
    
    expect(mockAddEventListener).toHaveBeenCalledTimes(2);
    expect(mockAddEventListener).toHaveBeenCalledWith('focus', expect.any(Function));
    expect(mockAddEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
  });

  it('should return a cleanup function', () => {
    const handler = vi.fn();
    
    const cleanup = onWindowFocus(handler);
    
    expect(typeof cleanup).toBe('function');
  });

  it('should remove event listeners when cleanup is called', () => {
    const handler = vi.fn();
    
    const cleanup = onWindowFocus(handler);
    cleanup();
    
    expect(mockRemoveEventListener).toHaveBeenCalledTimes(2);
    expect(mockRemoveEventListener).toHaveBeenCalledWith('focus', expect.any(Function));
    expect(mockRemoveEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
  });

  it('should use the same handler reference for add and remove', () => {
    const handler = vi.fn();
    
    const cleanup = onWindowFocus(handler);
    
    const addedFocusHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'focus'
    )?.[1];
    const addedVisibilityHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'visibilitychange'
    )?.[1];
    
    cleanup();
    
    const removedFocusHandler = mockRemoveEventListener.mock.calls.find(
      call => call[0] === 'focus'
    )?.[1];
    const removedVisibilityHandler = mockRemoveEventListener.mock.calls.find(
      call => call[0] === 'visibilitychange'
    )?.[1];
    
    expect(addedFocusHandler).toBe(removedFocusHandler);
    expect(addedVisibilityHandler).toBe(removedVisibilityHandler);
  });

  it('should call the handler when focus event is triggered', () => {
    const handler = vi.fn();
    
    onWindowFocus(handler);
    
    // Get the registered handler and call it
    const focusHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'focus'
    )?.[1];
    
    (focusHandler as (() => void) | undefined)?.();
    
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should call the handler when visibilitychange event is triggered', () => {
    const handler = vi.fn();
    
    onWindowFocus(handler);
    
    // Get the registered handler and call it
    const visibilityHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'visibilitychange'
    )?.[1];
    
    (visibilityHandler as (() => void) | undefined)?.();
    
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple registrations independently', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    
    const cleanup1 = onWindowFocus(handler1);
    const cleanup2 = onWindowFocus(handler2);
    
    expect(mockAddEventListener).toHaveBeenCalledTimes(4); // 2 events × 2 handlers
    
    cleanup1();
    expect(mockRemoveEventListener).toHaveBeenCalledTimes(2);
    
    cleanup2();
    expect(mockRemoveEventListener).toHaveBeenCalledTimes(4);
  });

  it('should be safe to call cleanup multiple times', () => {
    const handler = vi.fn();
    
    const cleanup = onWindowFocus(handler);
    cleanup();
    
    expect(mockRemoveEventListener).toHaveBeenCalledTimes(2);
    
    // Should not throw or cause issues
    expect(() => cleanup()).not.toThrow();
    
    // Should call removeEventListener again (though it won't have any effect)
    expect(mockRemoveEventListener).toHaveBeenCalledTimes(4);
  });
});

describe('isWindowFocused', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default state
    (document as any).visibilityState = 'visible';
    mockHasFocus.mockReturnValue(true);
  });

  it('should return true when document is visible and has focus', () => {
    (document as any).visibilityState = 'visible';
    mockHasFocus.mockReturnValue(true);
    
    const result = isWindowFocused();
    
    expect(result).toBe(true);
    expect(mockHasFocus).toHaveBeenCalledTimes(1);
  });

  it('should return false when document is not visible', () => {
    (document as any).visibilityState = 'hidden';
    mockHasFocus.mockReturnValue(true);
    
    const result = isWindowFocused();
    
    expect(result).toBe(false);
  });

  it('should return false when document does not have focus', () => {
    (document as any).visibilityState = 'visible';
    mockHasFocus.mockReturnValue(false);
    
    const result = isWindowFocused();
    
    expect(result).toBe(false);
  });

  it('should return false when document is hidden and does not have focus', () => {
    (document as any).visibilityState = 'hidden';
    mockHasFocus.mockReturnValue(false);
    
    const result = isWindowFocused();
    
    expect(result).toBe(false);
  });

  it('should handle prerender visibility state', () => {
    (document as any).visibilityState = 'prerender';
    mockHasFocus.mockReturnValue(true);
    
    const result = isWindowFocused();
    
    expect(result).toBe(false);
  });

  it('should handle unloaded visibility state', () => {
    (document as any).visibilityState = 'unloaded';
    mockHasFocus.mockReturnValue(true);
    
    const result = isWindowFocused();
    
    expect(result).toBe(false);
  });

  it('should call document.hasFocus() every time', () => {
    mockHasFocus.mockReturnValue(true);
    
    isWindowFocused();
    isWindowFocused();
    isWindowFocused();
    
    expect(mockHasFocus).toHaveBeenCalledTimes(3);
  });

  it('should handle when hasFocus throws an error', () => {
    (document as any).visibilityState = 'visible';
    mockHasFocus.mockImplementation(() => {
      throw new Error('hasFocus not available');
    });
    
    expect(() => isWindowFocused()).toThrow('hasFocus not available');
  });

  it('should be consistent across multiple calls with same state', () => {
    (document as any).visibilityState = 'visible';
    mockHasFocus.mockReturnValue(true);
    
    const result1 = isWindowFocused();
    const result2 = isWindowFocused();
    const result3 = isWindowFocused();
    
    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(result3).toBe(true);
  });

  it('should reflect changes in document state', () => {
    // Initially focused
    (document as any).visibilityState = 'visible';
    mockHasFocus.mockReturnValue(true);
    expect(isWindowFocused()).toBe(true);
    
    // Lose focus
    mockHasFocus.mockReturnValue(false);
    expect(isWindowFocused()).toBe(false);
    
    // Become hidden
    (document as any).visibilityState = 'hidden';
    mockHasFocus.mockReturnValue(true);
    expect(isWindowFocused()).toBe(false);
    
    // Regain both
    (document as any).visibilityState = 'visible';
    mockHasFocus.mockReturnValue(true);
    expect(isWindowFocused()).toBe(true);
  });
});