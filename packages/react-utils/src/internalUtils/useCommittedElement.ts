import type { RefObject } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

export type ElementTarget = RefObject<HTMLElement | null> | HTMLElement | null;

/**
 * Max consecutive commits that resync the element. A ref whose element is
 * recreated on every render (e.g. inside a component type defined during
 * render) would otherwise resync forever, as each resync re-renders and
 * recreates it again.
 */
const MAX_CONSECUTIVE_SYNCS = 3;

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
 * scheduled (or the element is recreated on every render and can't be
 * followed), so effects should skip this commit instead of using the outdated
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
 *
 * A ref whose element is recreated on every render can't be followed, the
 * resync stops after a few consecutive commits instead of looping.
 */
export function useCommittedElement(target: ElementTarget): HTMLElement | null {
  const [refElement, setRefElement] = useState<HTMLElement | null>(null);
  const consecutiveSyncs = useRef(0);

  // only updates the state when the attached element changed, so the re-render
  // it causes doesn't trigger another update
  function syncRefElement() {
    if (!target || !('current' in target)) return;

    const current = target.current;

    if (current === refElement) {
      consecutiveSyncs.current = 0;
      return;
    }

    if (consecutiveSyncs.current >= MAX_CONSECUTIVE_SYNCS) {
      // the element changed again in the commit caused by the previous syncs,
      // the next unrelated commit can try again
      consecutiveSyncs.current = 0;
      return;
    }

    consecutiveSyncs.current += 1;
    setRefElement(current);
  }

  // runs after every commit, a ref can be attached to another element in any
  // commit without the ref object itself changing
  useLayoutEffect(() => {
    syncRefElement();
  });

  if (target && 'current' in target) return refElement;

  return target;
}
