import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { useMeasureSize } from './useMeasureSize';

type FakeEntry = { contentRect: { width: number; height: number } };

let observerCallbacks: ((entries: FakeEntry[]) => void)[] = [];
const disconnect = vi.fn();

class FakeResizeObserver {
  constructor(callback: (entries: FakeEntry[]) => void) {
    observerCallbacks.push(callback);
  }

  observe() {}

  disconnect() {
    disconnect();
  }
}

function triggerResize(contentRect = { width: 0, height: 0 }) {
  act(() => {
    for (const callback of observerCallbacks) callback([{ contentRect }]);
  });
}

function createElement(width: number, height: number) {
  const element = document.createElement('div');
  Object.defineProperty(element, 'clientWidth', { value: width });
  Object.defineProperty(element, 'clientHeight', { value: height });
  return element;
}

beforeEach(() => {
  observerCallbacks = [];
  disconnect.mockClear();
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test('measures the element when it resizes', () => {
  const ref = { current: createElement(100, 50) };

  const { result } = renderHook(() => useMeasureSize(ref, 0));

  expect(result.current.isMeasuring).toBe(true);
  expect(result.current.refElement).toBe(ref.current);

  triggerResize();

  expect(result.current.width).toBe(100);
  expect(result.current.height).toBe(50);
  expect(result.current.isMeasuring).toBe(false);
});

test('uses the initial size getters', () => {
  const { result } = renderHook(() =>
    useMeasureSize(null, 0, {
      getInitialWidth: () => 10,
      getInitialHeight: () => 20,
    }),
  );

  expect(result.current.width).toBe(10);
  expect(result.current.height).toBe(20);
});

test('measures only the requested dimension using the content rect', () => {
  const ref = { current: createElement(100, 50) };

  const { result } = renderHook(() =>
    useMeasureSize(ref, 0, { measureOnly: 'width', useContentRect: true }),
  );

  triggerResize({ width: 80, height: 40 });

  expect(result.current.width).toBe(80);
  expect(result.current.height).toBe(0);
});

test('setRef measures the element immediately', () => {
  const element = createElement(30, 40);

  const { result } = renderHook(() => useMeasureSize(null, 0));

  act(() => {
    result.current.setRef(element);
  });

  expect(result.current.width).toBe(30);
  expect(result.current.height).toBe(40);
  expect(result.current.isMeasuring).toBe(false);
  expect(result.current.refElement).toBe(element);
});

test('does not observe when disabled and disconnects on unmount', () => {
  const ref = { current: createElement(100, 50) };

  const disabled = renderHook(() => useMeasureSize(ref, 0, { disable: true }));
  expect(observerCallbacks).toHaveLength(0);
  disabled.unmount();

  const { unmount } = renderHook(() => useMeasureSize(ref, 0));
  expect(observerCallbacks).toHaveLength(1);

  unmount();
  expect(disconnect).toHaveBeenCalledTimes(1);
});
