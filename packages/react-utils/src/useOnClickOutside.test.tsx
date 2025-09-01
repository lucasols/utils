import { render, renderHook } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import React, { useRef } from 'react';
import { useOnClickOutside } from './useOnClickOutside';

describe('useOnClickOutside', () => {
  let outsideElement: HTMLDivElement;
  let insideElement: HTMLDivElement;

  beforeEach(() => {
    // Render JSX test components
    const { container } = render(
      <div>
        <div data-testid="outside">Outside content</div>
        <div data-testid="inside">Inside content</div>
      </div>
    );

    outsideElement = container.querySelector('[data-testid="outside"]') as HTMLDivElement;
    insideElement = container.querySelector('[data-testid="inside"]') as HTMLDivElement;
  });

  afterEach(() => {
    // Clean up is handled by testing-library
    document.body.innerHTML = '';
  });

  test('should call handler when clicking outside element', () => {
    const handler = vi.fn();

    renderHook(() => useOnClickOutside(insideElement, handler));

    // Simulate mousedown outside the element
    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outsideElement });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledWith(event);
  });

  test('should not call handler when clicking inside element', () => {
    const handler = vi.fn();

    renderHook(() => useOnClickOutside(insideElement, handler));

    // Simulate mousedown inside the element
    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: insideElement });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  test('should work with React ref object', () => {
    const handler = vi.fn();
    let elementRef: React.RefObject<HTMLDivElement | null>;

    renderHook(() => {
      elementRef = useRef<HTMLDivElement | null>(null);
      elementRef.current = insideElement;
      useOnClickOutside(elementRef, handler);
    });

    // Click outside
    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outsideElement });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledWith(event);
  });

  test('should work with CSS selector string', () => {
    const handler = vi.fn();

    renderHook(() => useOnClickOutside('[data-testid="inside"]', handler));

    // Click outside
    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outsideElement });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledWith(event);
  });

  test('should not call handler when clicking inside element found by selector', () => {
    const handler = vi.fn();

    renderHook(() => useOnClickOutside('[data-testid="inside"]', handler));

    // Click inside
    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: insideElement });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  test('should work with array of refs', () => {
    const handler = vi.fn();
    const { container } = render(<div data-testid="second">Second element</div>);
    const secondInsideElement = container.querySelector('[data-testid="second"]') as HTMLDivElement;

    renderHook(() => useOnClickOutside([insideElement, secondInsideElement], handler));

    // Click outside both elements
    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outsideElement });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledWith(event);

    handler.mockClear();

    // Click inside first element - should not trigger
    const event2 = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event2, 'target', { value: insideElement });
    document.dispatchEvent(event2);

    expect(handler).not.toHaveBeenCalled();

    // Click inside second element - should not trigger
    const event3 = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event3, 'target', { value: secondInsideElement });
    document.dispatchEvent(event3);

    expect(handler).not.toHaveBeenCalled();
  });

  test('should work with mixed ref types in array', () => {
    const handler = vi.fn();
    let refObject: React.RefObject<HTMLDivElement | null>;
    const { container } = render(<div data-testid="second">Mixed ref element</div>);
    const secondElement = container.querySelector('[data-testid="second"]') as HTMLDivElement;

    renderHook(() => {
      refObject = useRef<HTMLDivElement | null>(null);
      refObject.current = insideElement;
      useOnClickOutside([refObject, '[data-testid="second"]', secondElement], handler);
    });

    // Click outside all elements
    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outsideElement });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledWith(event);

    handler.mockClear();

    // Click inside any of the elements should not trigger
    const eventInside1 = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(eventInside1, 'target', { value: insideElement });
    document.dispatchEvent(eventInside1);
    expect(handler).not.toHaveBeenCalled();

    const eventInside2 = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(eventInside2, 'target', { value: secondElement });
    document.dispatchEvent(eventInside2);
    expect(handler).not.toHaveBeenCalled();
  });

  test('should respond to touchstart events', () => {
    const handler = vi.fn();

    renderHook(() => useOnClickOutside(insideElement, handler));

    // Simulate touchstart outside the element
    const event = new TouchEvent('touchstart', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outsideElement });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledWith(event);
  });

  test('should not respond to touchstart inside element', () => {
    const handler = vi.fn();

    renderHook(() => useOnClickOutside(insideElement, handler));

    // Simulate touchstart inside the element
    const event = new TouchEvent('touchstart', { bubbles: true });
    Object.defineProperty(event, 'target', { value: insideElement });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  test('should clean up event listeners on unmount', () => {
    const handler = vi.fn();
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useOnClickOutside(insideElement, handler));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  test('should handle null ref gracefully', () => {
    const handler = vi.fn();

    renderHook(() => useOnClickOutside(null, handler));

    // Should NOT trigger since null ref is treated as "inside"
    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outsideElement });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  test('should handle ref object with null current', () => {
    const handler = vi.fn();
    let nullRef: React.RefObject<HTMLDivElement | null>;

    renderHook(() => {
      nullRef = useRef<HTMLDivElement | null>(null);
      // current is null
      useOnClickOutside(nullRef, handler);
    });

    // Should NOT trigger since null current is treated as "inside"
    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outsideElement });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  test('should handle invalid selector string gracefully', () => {
    const handler = vi.fn();

    renderHook(() => useOnClickOutside('[data-nonexistent="element"]', handler));

    // Should NOT trigger since nonexistent element is treated as "inside"
    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outsideElement });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  test('should update handler when it changes', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    const { rerender } = renderHook(
      ({ handler }) => useOnClickOutside(insideElement, handler),
      { initialProps: { handler: handler1 } }
    );

    // Trigger event with first handler
    const event1 = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event1, 'target', { value: outsideElement });
    document.dispatchEvent(event1);

    expect(handler1).toHaveBeenCalledWith(event1);
    expect(handler2).not.toHaveBeenCalled();

    // Change handler
    rerender({ handler: handler2 });

    // Trigger event with second handler
    const event2 = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event2, 'target', { value: outsideElement });
    document.dispatchEvent(event2);

    expect(handler2).toHaveBeenCalledWith(event2);
    expect(handler1).toHaveBeenCalledTimes(1); // Still only called once
  });

  test('should work when ref changes', () => {
    const handler = vi.fn();
    const { container } = render(<div data-testid="second-ref">Second ref element</div>);
    const secondElement = container.querySelector('[data-testid="second-ref"]') as HTMLDivElement;

    const { rerender } = renderHook(
      ({ ref }) => useOnClickOutside(ref, handler),
      { initialProps: { ref: insideElement } }
    );

    // Click inside first element - should not trigger
    const event1 = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event1, 'target', { value: insideElement });
    document.dispatchEvent(event1);
    expect(handler).not.toHaveBeenCalled();

    // Change ref to second element
    rerender({ ref: secondElement });

    // Click inside first element (now outside) - should trigger
    const event2 = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event2, 'target', { value: insideElement });
    document.dispatchEvent(event2);
    expect(handler).toHaveBeenCalledWith(event2);

    handler.mockClear();

    // Click inside second element (now inside) - should not trigger
    const event3 = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event3, 'target', { value: secondElement });
    document.dispatchEvent(event3);
    expect(handler).not.toHaveBeenCalled();
  });
});