import { useLayoutEffect, useState } from 'react';
import type { ElementTarget } from './internalUtils/useCommittedElement';
import {
  isCommittedElementOutdated,
  useCommittedElement,
} from './internalUtils/useCommittedElement';
import { useStableRefValue } from './useDeepMemo';
import { useLatestValue } from './useLatestValue';

const THRESHOLD_TOLERANCE = 0.001;

/**
 * Tracks whether the target element intersects the viewport (or the closest
 * `margin.rootSelector` ancestor) using an `IntersectionObserver`.
 *
 * The target can be a ref or the element itself. A ref is read again after
 * every commit of the component that uses the hook, pass the element (e.g. from
 * a `useState` callback ref) when it can be attached, replaced or removed by a
 * child component without this one re-rendering.
 */
export function useIsVisible(
  target: ElementTarget,
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

  const observeElement = useCommittedElement(target);

  useLayoutEffect(() => {
    if (disabled) return;

    // the ref was attached to another element in this commit and the committed
    // element update is already scheduled, observing the outdated element (or
    // reporting `false` while it is `null`) would be a spurious change
    if (isCommittedElementOutdated(target, observeElement)) return;

    if (!observeElement) {
      latestOnVisibilityChange.insideEffect?.(false);
      setIsVisible(false);
      return;
    }

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
    latestOnVisibilityChange,
    observeElement,
    stableRootMargin,
    target,
    threshold,
  ]);

  return isVisible;
}
