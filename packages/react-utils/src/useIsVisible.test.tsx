import { act, render, renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { useIsVisible } from './useIsVisible';

type FakeEntry = { isIntersecting: boolean; intersectionRatio: number };

let observers: {
  callback: (entries: FakeEntry[]) => void;
  observed: Element[];
}[] = [];

class FakeIntersectionObserver {
  private observer: (typeof observers)[number];

  constructor(callback: (entries: FakeEntry[]) => void) {
    this.observer = { callback, observed: [] };
    observers.push(this.observer);
  }

  observe(element: Element) {
    this.observer.observed.push(element);
  }

  disconnect() {
    observers = observers.filter((observer) => observer !== this.observer);
  }
}

function setIntersecting(
  isIntersecting: boolean,
  intersectionRatio = isIntersecting ? 1 : 0,
) {
  act(() => {
    for (const observer of observers) {
      observer.callback([{ isIntersecting, intersectionRatio }]);
    }
  });
}

beforeEach(() => {
  observers = [];
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test('tracks the element visibility', () => {
  const onVisibilityChange = vi.fn();
  const ref = { current: document.createElement('div') };

  const { result } = renderHook(() =>
    useIsVisible(ref, { onVisibilityChange }),
  );

  expect(result.current).toBe(false);
  expect(observers[0]?.observed).toEqual([ref.current]);

  setIntersecting(true);
  expect(result.current).toBe(true);
  expect(onVisibilityChange).toHaveBeenLastCalledWith(true);

  setIntersecting(false);
  expect(result.current).toBe(false);
  expect(onVisibilityChange).toHaveBeenLastCalledWith(false);
});

test('does not observe when disabled', () => {
  const ref = { current: document.createElement('div') };

  const { result } = renderHook(() =>
    useIsVisible(ref, { disabled: true, initialVisibility: true }),
  );

  expect(observers).toHaveLength(0);
  expect(result.current).toBe(true);
});

test('observes the element once the ref is attached after the first render', () => {
  let isVisible: boolean | undefined;

  function Component() {
    const ref = useRef<HTMLDivElement>(null);
    isVisible = useIsVisible(ref);
    return (
      <div
        ref={ref}
        data-testid="target"
      />
    );
  }

  const { getByTestId } = render(<Component />);

  expect(observers[0]?.observed).toEqual([getByTestId('target')]);

  setIntersecting(true);
  expect(isVisible).toBe(true);
});

test('is only visible when the intersection ratio reaches the threshold', () => {
  const onVisibilityChange = vi.fn();
  const ref = { current: document.createElement('div') };

  const { result } = renderHook(() =>
    useIsVisible(ref, { threshold: 0.5, onVisibilityChange }),
  );

  setIntersecting(true, 0.1);
  expect(result.current).toBe(false);
  expect(onVisibilityChange).toHaveBeenLastCalledWith(false);

  setIntersecting(true, 0.6);
  expect(result.current).toBe(true);

  setIntersecting(true, 0.4);
  expect(result.current).toBe(false);
});

test('tolerates a ratio slightly below a full threshold', () => {
  const ref = { current: document.createElement('div') };

  const { result } = renderHook(() => useIsVisible(ref, { threshold: 1 }));

  setIntersecting(true, 0.9999);
  expect(result.current).toBe(true);

  setIntersecting(true, 0.9);
  expect(result.current).toBe(false);
});
