import { shallowEqual } from '@ls-stack/utils/shallowEqual';
import { throttle } from '@ls-stack/utils/throttle';
import { useEffect } from 'react';
import type { ElementTarget } from './internalUtils/useCommittedElement';
import {
  isCommittedElementOutdated,
  useCommittedElement,
} from './internalUtils/useCommittedElement';
import { useOnChange } from './useOnChange';

/**
 * Calls `loadMore` when the container is scrolled near its end, or when the
 * loaded content doesn't fill the container yet.
 *
 * `containerRef` can be a ref or the element itself. A ref is read again after
 * every commit of the component that uses the hook, pass the element (e.g. from
 * a `useState` callback ref) when it can be attached, replaced or removed by a
 * child component without this one re-rendering.
 *
 * `loadMore` must be memoized, the scroll listener is attached again when it
 * changes.
 */
export function useInfiniteLoading({
  containerRef,
  loadMore,
  hasMore,
  isLoaded,
  triggerMargin = 0,
  disable,
}: {
  loadMore: () => void;
  hasMore: boolean;
  isLoaded: boolean;
  containerRef: ElementTarget;
  triggerMargin?: number;
  disable?: boolean;
}) {
  const containerElement = useCommittedElement(containerRef);

  useOnChange(
    [isLoaded, hasMore, containerElement, disable],
    () => {
      if (disable) return;

      // measure the container attached in this commit, the update to it is
      // already scheduled and calls this again
      if (isCommittedElementOutdated(containerRef, containerElement)) return;

      const element = containerElement;

      if (!element || !isLoaded) return;

      if (!hasMore) return;

      // check if there is enough space to load more and load more

      const contentHeight = element.scrollHeight;
      const viewHeight = element.clientHeight;

      if (!contentHeight || !viewHeight) return;

      if (contentHeight <= viewHeight) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            'useInfiniteLoading: content is smaller than container height and hasMore is true, which will trigger unoptimized refetching, prefer increasing the load size to prevent this',
          );
        }
        loadMore();
      }
    },
    // compare the container element by identity, deepEqual would walk its props
    { callOnMount: true, equalityFn: shallowEqual },
  );

  useEffect(() => {
    if (disable || !isLoaded || !hasMore) return;

    if (isCommittedElementOutdated(containerRef, containerElement)) return;

    const container = containerElement;

    if (!container) return;

    const onScrollThrottle = throttle(() => {
      const contentHeight = container.scrollHeight;
      const viewHeight = container.clientHeight;

      const scrollToStart = Math.abs(container.scrollTop);

      const scrollAvailableToEnd = contentHeight - viewHeight;

      const scrollToEnd = scrollAvailableToEnd - scrollToStart;

      if (scrollToEnd < 2 + triggerMargin) {
        loadMore();
      }
    }, 500);

    container.addEventListener('scroll', onScrollThrottle);

    return () => {
      container.removeEventListener('scroll', onScrollThrottle);
      onScrollThrottle.cancel();
    };
  }, [
    containerElement,
    containerRef,
    disable,
    hasMore,
    isLoaded,
    loadMore,
    triggerMargin,
  ]);
}
