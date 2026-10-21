import { shallowEqual } from '@ls-stack/utils/shallowEqual';
import { throttle } from '@ls-stack/utils/throttle';
import type { RefObject } from 'react';
import { useEffect } from 'react';
import { useLatestValue } from './useLatestValue';
import { useOnChange } from './useOnChange';

/**
 * Calls `loadMore` when the container is scrolled near its end, or when the
 * loaded content doesn't fill the container yet.
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
  containerRef: RefObject<HTMLElement | null> | HTMLElement | null;
  triggerMargin?: number;
  disable?: boolean;
}) {
  function getContainerElement() {
    if (containerRef instanceof HTMLElement) return containerRef;

    return containerRef?.current;
  }

  const containerElement = getContainerElement();

  useOnChange(
    [isLoaded, hasMore, containerElement, disable],
    () => {
      if (disable) return;

      const element = getContainerElement();

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

  const onScroll = useLatestValue(() => {
    if (disable) return;

    const element = getContainerElement();

    if (!element || !isLoaded) return;

    if (!hasMore) return;

    const contentHeight = element.scrollHeight;
    const viewHeight = element.clientHeight;

    const scrollToStart = Math.abs(element.scrollTop);

    const scrollAvailableToEnd = contentHeight - viewHeight;

    const scrollToEnd = scrollAvailableToEnd - scrollToStart;

    if (scrollToEnd < 2 + triggerMargin) {
      loadMore();
    }
  });

  useEffect(() => {
    if (disable || !isLoaded) return;

    // the container may mount or be replaced after the render that read the
    // ref (e.g. after loading), so read it again after commit
    const container =
      containerElement?.isConnected ? containerElement
      : containerRef instanceof HTMLElement ? containerRef
      : containerRef?.current;

    if (!container) return;

    const onScrollThrottle = throttle(() => onScroll.insideEffect(), 500);

    container.addEventListener('scroll', onScrollThrottle);

    return () => {
      container.removeEventListener('scroll', onScrollThrottle);
      onScrollThrottle.cancel();
    };
  }, [containerRef, containerElement, isLoaded, disable, onScroll]);
}
