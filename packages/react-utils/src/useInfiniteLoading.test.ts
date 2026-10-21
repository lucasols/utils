import { renderHook } from '@testing-library/react';
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
