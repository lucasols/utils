import { act, render, renderHook } from '@testing-library/react';
import { useRef, useState } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { useIsVisible } from './useIsVisible';

type FakeEntry = { isIntersecting: boolean; intersectionRatio: number };

let observers: {
  callback: (entries: FakeEntry[]) => void;
  observed: Element[];
  threshold: number | undefined;
}[] = [];

class FakeIntersectionObserver {
  private observer: (typeof observers)[number];

  constructor(
    callback: (entries: FakeEntry[]) => void,
    options?: { threshold?: number },
  ) {
    this.observer = { callback, observed: [], threshold: options?.threshold };
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

test('observes with the same threshold used to classify the visibility', () => {
  const ref = { current: document.createElement('div') };

  renderHook(() => useIsVisible(ref, { threshold: 1 }));
  expect(observers[0]?.threshold).toBe(0.999);

  observers = [];
  renderHook(() => useIsVisible(ref));
  expect(observers[0]?.threshold).toBe(0);
});

test('uses the latest entry when notifications are batched', () => {
  const ref = { current: document.createElement('div') };

  const { result } = renderHook(() => useIsVisible(ref));

  act(() => {
    observers[0]?.callback([
      { isIntersecting: true, intersectionRatio: 1 },
      { isIntersecting: false, intersectionRatio: 0 },
    ]);
  });
  expect(result.current).toBe(false);

  act(() => {
    observers[0]?.callback([
      { isIntersecting: false, intersectionRatio: 0 },
      { isIntersecting: true, intersectionRatio: 1 },
    ]);
  });
  expect(result.current).toBe(true);
});

test('does not report a false visibility before observing an element rendered by the same component', () => {
  const onVisibilityChange = vi.fn();
  const renders: boolean[] = [];

  function Component() {
    const ref = useRef<HTMLDivElement>(null);
    renders.push(
      useIsVisible(ref, { initialVisibility: true, onVisibilityChange }),
    );
    return <div ref={ref} />;
  }

  render(<Component />);

  expect(renders.every(Boolean)).toBe(true);
  expect(onVisibilityChange).not.toHaveBeenCalled();
  expect(observers).toHaveLength(1);
});

test('reports false on mount when there is no element to observe', () => {
  const onVisibilityChange = vi.fn();
  const ref = { current: null };

  const { result } = renderHook(() =>
    useIsVisible(ref, { initialVisibility: true, onVisibilityChange }),
  );

  expect(result.current).toBe(false);
  expect(onVisibilityChange).toHaveBeenCalledWith(false);
});

test('follows a ref attached, replaced and removed in later commits', () => {
  const controls: { setTarget: (target: 'none' | 'a' | 'b') => void } = {
    setTarget: () => {},
  };
  let isVisible: boolean | undefined;

  function Component() {
    const [target, setTarget] = useState<'none' | 'a' | 'b'>('none');
    controls.setTarget = setTarget;
    const ref = useRef<HTMLDivElement>(null);
    isVisible = useIsVisible(ref);
    return target === 'none' ? null : (
        <div
          key={target}
          ref={ref}
          data-testid={target}
        />
      );
  }

  const { getByTestId } = render(<Component />);
  expect(observers).toHaveLength(0);

  act(() => {
    controls.setTarget('a');
  });
  expect(observers.map((observer) => observer.observed)).toEqual([
    [getByTestId('a')],
  ]);

  setIntersecting(true);
  expect(isVisible).toBe(true);

  act(() => {
    controls.setTarget('b');
  });
  expect(observers.map((observer) => observer.observed)).toEqual([
    [getByTestId('b')],
  ]);

  act(() => {
    controls.setTarget('none');
  });
  expect(observers).toHaveLength(0);
  expect(isVisible).toBe(false);
});

test('follows an element passed directly when a child replaces it', () => {
  const controls: { setChildKey: (key: string) => void } = {
    setChildKey: () => {},
  };

  function Child({
    onElement,
  }: {
    onElement: (el: HTMLDivElement | null) => void;
  }) {
    const [key, setKey] = useState('a');
    controls.setChildKey = setKey;
    return (
      <div
        key={key}
        ref={onElement}
        data-testid={key}
      />
    );
  }

  function Parent() {
    const [element, setElement] = useState<HTMLDivElement | null>(null);
    useIsVisible(element);
    return <Child onElement={setElement} />;
  }

  const { getByTestId } = render(<Parent />);
  expect(observers.map((observer) => observer.observed)).toEqual([
    [getByTestId('a')],
  ]);

  act(() => {
    controls.setChildKey('b');
  });
  expect(observers.map((observer) => observer.observed)).toEqual([
    [getByTestId('b')],
  ]);
});
