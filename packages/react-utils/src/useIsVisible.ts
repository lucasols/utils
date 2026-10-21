import type { RefObject } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { noopWithArgs } from './internalUtils/noopWithArgs';
import { useStableRefValue } from './useDeepMemo';
import { useLatestValue } from './useLatestValue';

/**
 * Tracks whether the element in `ref` intersects the viewport (or the closest
 * `margin.rootSelector` ancestor) using an `IntersectionObserver`.
 */
export function useIsVisible(
  ref: RefObject<HTMLElement | null>,
  {
    threshold = 0,
    initialVisibility = false,
    margin: rootMargin,
    disabled,
    onVisibilityChange,
  }: {
    disabled?: boolean;
    /**
     * Value from 0 to 1, default is 0 (as soon any pixel is visible the
     * visibility will be true)
     */
    threshold?: number;
    initialVisibility?: boolean;
    margin?: {
      rootSelector: string;
      margin: number | { inline?: number; block?: number } | string;
    };
    onVisibilityChange?: (isVisible: boolean) => void;
  } = {},
): boolean {
  const [isVisible, setIsVisible] = useState(initialVisibility);

  const stableRootMargin = useStableRefValue(rootMargin);

  const latestOnVisibilityChange = useLatestValue(onVisibilityChange);

  const [forceUpdate, setForceUpdate] = useState(0);

  const wasNotVisibleInInitialRender = useRef(false);

  const observeElement = ref.current;

  useLayoutEffect(() => {
    if (disabled) return;

    noopWithArgs(forceUpdate);

    if (!observeElement) {
      latestOnVisibilityChange.insideEffect?.(false);
      setIsVisible(false);
      wasNotVisibleInInitialRender.current = true;
      return;
    }

    wasNotVisibleInInitialRender.current = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        // `isIntersecting` ignores the threshold, it is true for any intersection
        const entryIsVisible =
          threshold > 0 ?
            entry.intersectionRatio >= threshold
          : entry.isIntersecting;

        latestOnVisibilityChange.insideEffect?.(entryIsVisible);
        setIsVisible(entryIsVisible);
      },
      {
        root:
          stableRootMargin?.rootSelector ?
            observeElement.closest(stableRootMargin.rootSelector)
          : undefined,
        threshold,
        rootMargin:
          typeof stableRootMargin?.margin === 'number' ?
            `${stableRootMargin.margin}px`
          : typeof stableRootMargin?.margin === 'string' ?
            stableRootMargin.margin
          : `${stableRootMargin?.margin.block ?? 0}px ${
              stableRootMargin?.margin.inline ?? 0
            }px`,
      },
    );

    observer.observe(observeElement);

    return () => {
      observer.disconnect();
    };
  }, [
    disabled,
    forceUpdate,
    latestOnVisibilityChange,
    observeElement,
    stableRootMargin,
    threshold,
  ]);

  useEffect(() => {
    if (wasNotVisibleInInitialRender.current) {
      setForceUpdate((prev) => prev + 1);
    }
  }, []);

  return isVisible;
}
