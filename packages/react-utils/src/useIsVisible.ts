import type { RefObject } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { noopWithArgs } from './internalUtils/noopWithArgs';
import { useStableRefValue } from './useDeepMemo';
import { useLatestValue } from './useLatestValue';

const THRESHOLD_TOLERANCE = 0.001;

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

    // browsers can report a ratio slightly below the crossed threshold (e.g.
    // 0.9999 for a fully visible element with fractional geometry), the same
    // value is used to observe so every visibility change is notified
    const effectiveThreshold =
      threshold > 0 ? Math.max(0, threshold - THRESHOLD_TOLERANCE) : threshold;

    const observer = new IntersectionObserver(
      (entries) => {
        // delayed notifications can batch several entries, oldest first
        const entry = entries.at(-1);

        if (!entry) return;

        // `isIntersecting` ignores the threshold, it is true for any intersection
        const entryIsVisible =
          entry.isIntersecting && entry.intersectionRatio >= effectiveThreshold;

        latestOnVisibilityChange.insideEffect?.(entryIsVisible);
        setIsVisible(entryIsVisible);
      },
      {
        root:
          stableRootMargin?.rootSelector ?
            observeElement.closest(stableRootMargin.rootSelector)
          : undefined,
        threshold: effectiveThreshold,
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
