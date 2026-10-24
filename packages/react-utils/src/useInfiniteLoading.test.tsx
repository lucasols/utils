import { act, render, renderHook } from '@testing-library/react';
import { useRef, useState } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { useInfiniteLoading } from './useInfiniteLoading';

function createContainer({
  scrollHeight,
  clientHeight,
}: {
  scrollHeight: number;
  clientHeight: number;
}) {
  const element = document.createElement('div');
  Object.defineProperty(element, 'scrollHeight', { value: scrollHeight });
  Object.defineProperty(element, 'clientHeight', { value: clientHeight });
  document.body.appendChild(element);
  return element;
}

function scrollTo(element: HTMLElement, scrollTop: number) {
  element.scrollTop = scrollTop;
  element.dispatchEvent(new Event('scroll'));
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
});

test('calls the new loadMore when it changes', () => {
  const container = createContainer({ scrollHeight: 1000, clientHeight: 100 });
  const first = vi.fn();
  const second = vi.fn();

  const { rerender } = renderHook(
    ({ loadMore }) =>
      useInfiniteLoading({
        containerRef: container,
        loadMore,
        hasMore: true,
        isLoaded: true,
      }),
    { initialProps: { loadMore: first } },
  );

  rerender({ loadMore: second });
  scrollTo(container, 899);

  expect(first).not.toHaveBeenCalled();
  expect(second).toHaveBeenCalledTimes(1);
});

test('keeps a pending throttled scroll when an inline loadMore changes', () => {
  const container = createContainer({ scrollHeight: 1000, clientHeight: 100 });
  const addEventListener = vi.spyOn(container, 'addEventListener');
  const first = vi.fn();
  const second = vi.fn();

  const { rerender } = renderHook(
    ({ onLoadMore }) =>
      useInfiniteLoading({
        containerRef: container,
        loadMore: () => onLoadMore(),
        hasMore: true,
        isLoaded: true,
      }),
    { initialProps: { onLoadMore: first } },
  );

  scrollTo(container, 500);
  scrollTo(container, 899);

  rerender({ onLoadMore: second });
  vi.advanceTimersByTime(500);

  expect(first).not.toHaveBeenCalled();
  expect(second).toHaveBeenCalledTimes(1);
  expect(addEventListener).toHaveBeenCalledTimes(1);
});

test('loads more when scrolling near the end', () => {
  const container = createContainer({ scrollHeight: 1000, clientHeight: 100 });
  const loadMore = vi.fn();

  renderHook(() =>
    useInfiniteLoading({
      containerRef: container,
      loadMore,
      hasMore: true,
      isLoaded: true,
    }),
  );

  scrollTo(container, 500);
  expect(loadMore).not.toHaveBeenCalled();

  vi.advanceTimersByTime(500);
  scrollTo(container, 899);
  expect(loadMore).toHaveBeenCalledTimes(1);
});

test('respects the trigger margin', () => {
  const container = createContainer({ scrollHeight: 1000, clientHeight: 100 });
  const loadMore = vi.fn();

  renderHook(() =>
    useInfiniteLoading({
      containerRef: container,
      loadMore,
      hasMore: true,
      isLoaded: true,
      triggerMargin: 100,
    }),
  );

  scrollTo(container, 800);
  expect(loadMore).toHaveBeenCalledTimes(1);
});

test('does not load more when there is nothing more, it is loading or disabled', () => {
  const container = createContainer({ scrollHeight: 1000, clientHeight: 100 });
  const loadMore = vi.fn();

  const { rerender } = renderHook(
    (props: { hasMore: boolean; isLoaded: boolean; disable: boolean }) =>
      useInfiniteLoading({ containerRef: container, loadMore, ...props }),
    { initialProps: { hasMore: false, isLoaded: true, disable: false } },
  );

  scrollTo(container, 900);

  rerender({ hasMore: true, isLoaded: false, disable: false });
  vi.advanceTimersByTime(500);
  scrollTo(container, 900);

  rerender({ hasMore: true, isLoaded: true, disable: true });
  vi.advanceTimersByTime(500);
  scrollTo(container, 900);

  expect(loadMore).not.toHaveBeenCalled();
});

test('loads more on mount when the content does not fill the container', () => {
  const container = createContainer({ scrollHeight: 100, clientHeight: 100 });
  const loadMore = vi.fn();

  renderHook(() =>
    useInfiniteLoading({
      containerRef: container,
      loadMore,
      hasMore: true,
      isLoaded: true,
    }),
  );

  expect(loadMore).toHaveBeenCalledTimes(1);
});

test('attaches to a ref container that is set when loading ends', () => {
  const container = createContainer({ scrollHeight: 1000, clientHeight: 100 });
  const containerRef: { current: HTMLElement | null } = { current: null };
  const loadMore = vi.fn();

  const { rerender } = renderHook(
    ({ isLoaded }) =>
      useInfiniteLoading({ containerRef, loadMore, hasMore: true, isLoaded }),
    { initialProps: { isLoaded: false } },
  );

  containerRef.current = container;
  rerender({ isLoaded: true });

  scrollTo(container, 900);
  expect(loadMore).toHaveBeenCalledTimes(1);
});

test('removes the scroll listener on unmount', () => {
  const container = createContainer({ scrollHeight: 1000, clientHeight: 100 });
  const loadMore = vi.fn();

  const { unmount } = renderHook(() =>
    useInfiniteLoading({
      containerRef: container,
      loadMore,
      hasMore: true,
      isLoaded: true,
    }),
  );

  unmount();
  scrollTo(container, 900);

  expect(loadMore).not.toHaveBeenCalled();
});

test('does not call a pending throttled scroll after unmount', () => {
  const container = createContainer({ scrollHeight: 1000, clientHeight: 100 });
  const loadMore = vi.fn();

  const { unmount } = renderHook(() =>
    useInfiniteLoading({
      containerRef: container,
      loadMore,
      hasMore: true,
      isLoaded: true,
    }),
  );

  scrollTo(container, 500);
  scrollTo(container, 899);
  unmount();
  vi.advanceTimersByTime(600);

  expect(loadMore).not.toHaveBeenCalled();
});

test('loads more when enabled with content that does not fill the container', () => {
  const container = createContainer({ scrollHeight: 100, clientHeight: 100 });
  const loadMore = vi.fn();

  const { rerender } = renderHook(
    ({ disable }) =>
      useInfiniteLoading({
        containerRef: container,
        loadMore,
        hasMore: true,
        isLoaded: true,
        disable,
      }),
    { initialProps: { disable: true } },
  );

  expect(loadMore).not.toHaveBeenCalled();

  rerender({ disable: false });

  expect(loadMore).toHaveBeenCalledTimes(1);
});

test('checks the content size again when the container is replaced', () => {
  const firstContainer = createContainer({
    scrollHeight: 100,
    clientHeight: 100,
  });
  const loadMore = vi.fn();

  const { rerender } = renderHook(
    ({ container }) =>
      useInfiniteLoading({
        containerRef: container,
        loadMore,
        hasMore: true,
        isLoaded: true,
      }),
    { initialProps: { container: firstContainer } },
  );

  expect(loadMore).toHaveBeenCalledTimes(1);

  rerender({
    container: createContainer({ scrollHeight: 100, clientHeight: 100 }),
  });

  expect(loadMore).toHaveBeenCalledTimes(2);
});

test('follows a ref container replaced in a later commit', () => {
  const loadMore = vi.fn();
  const controls: { setKey: (key: string) => void } = { setKey: () => {} };

  function Component() {
    const [key, setKey] = useState('a');
    controls.setKey = setKey;
    const containerRef = useRef<HTMLDivElement>(null);
    useInfiniteLoading({
      containerRef,
      loadMore,
      hasMore: true,
      isLoaded: true,
    });
    return (
      <div
        key={key}
        ref={containerRef}
        data-testid={key}
      />
    );
  }

  const { getByTestId } = render(<Component />);
  const first = getByTestId('a');

  act(() => {
    controls.setKey('b');
  });
  const second = getByTestId('b');

  for (const element of [first, second]) {
    Object.defineProperty(element, 'scrollHeight', { value: 1000 });
    Object.defineProperty(element, 'clientHeight', { value: 100 });
  }

  scrollTo(first, 900);
  expect(loadMore).not.toHaveBeenCalled();

  scrollTo(second, 900);
  expect(loadMore).toHaveBeenCalledTimes(1);
});

test('does not measure the previous container when switching refs as loading ends', () => {
  const previous = createContainer({ scrollHeight: 100, clientHeight: 100 });
  const next = createContainer({ scrollHeight: 1000, clientHeight: 100 });
  const previousRef = { current: previous };
  const nextRef = { current: next };
  const loadMore = vi.fn();

  const { rerender } = renderHook(
    ({ containerRef, isLoaded }) =>
      useInfiniteLoading({ containerRef, loadMore, hasMore: true, isLoaded }),
    { initialProps: { containerRef: previousRef, isLoaded: false } },
  );

  rerender({ containerRef: nextRef, isLoaded: true });

  expect(loadMore).not.toHaveBeenCalled();
});

test('measures only the attached container when a ref moves as loading ends', () => {
  const previous = createContainer({ scrollHeight: 100, clientHeight: 100 });
  const next = createContainer({ scrollHeight: 100, clientHeight: 100 });
  const containerRef: { current: HTMLElement | null } = { current: previous };
  const loadMore = vi.fn();

  const { rerender } = renderHook(
    ({ isLoaded }) =>
      useInfiniteLoading({ containerRef, loadMore, hasMore: true, isLoaded }),
    { initialProps: { isLoaded: false } },
  );

  containerRef.current = next;
  rerender({ isLoaded: true });

  expect(loadMore).toHaveBeenCalledTimes(1);
});
