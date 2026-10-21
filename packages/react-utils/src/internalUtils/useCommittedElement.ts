import type { RefObject } from 'react';
import { useLayoutEffect, useState } from 'react';

export type ElementTarget = RefObject<HTMLElement | null> | HTMLElement | null;

export function resolveElementTarget(
  target: ElementTarget,
): HTMLElement | null {
  if (!target) return null;

  return 'current' in target ? target.current : target;
}

/**
 * Whether the element returned by `useCommittedElement` is behind the element
 * now attached to the `target` ref (the ref was switched or attached to another
 * element in this commit). The update to the attached element is then already
 * scheduled, so effects should skip this commit instead of using the outdated
 * element.
 */
export function isCommittedElementOutdated(
  target: ElementTarget,
  element: HTMLElement | null,
): boolean {
  return !!target && 'current' in target && target.current !== element;
}

/**
 * Returns the element committed for `target`. An element is returned as is, a
 * ref is read again after every commit, so the result follows the element
 * attached to it instead of the one read during render.
 */
export function useCommittedElement(target: ElementTarget): HTMLElement | null {
  const [refElement, setRefElement] = useState<HTMLElement | null>(null);

  // only updates the state when the attached element changed, so the re-render
  // it causes doesn't trigger another update
  function syncRefElement() {
    if (!target || !('current' in target)) return;

    const current = target.current;

    if (current !== refElement) {
      setRefElement(current);
    }
  }

  // runs after every commit, a ref can be attached to another element in any
  // commit without the ref object itself changing
  useLayoutEffect(() => {
    syncRefElement();
  });

  if (target && 'current' in target) return refElement;

  return target;
}
