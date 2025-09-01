import { useEffect } from 'react';
import { useLatestValue } from './useLatestValue';

type Ref = HTMLElement | React.RefObject<HTMLElement | null> | null | string;

function checkIfTargetContainsRef(ref: Ref, target: Node) {
  const elem = (() => {
    if (!ref) return undefined;

    if (typeof ref === 'string') {
      return document.querySelector<HTMLElement>(ref);
    }

    if ('current' in ref) {
      return ref.current;
    }

    return ref;
  })();

  return !elem || elem.contains(target);
}

/**
 * React hook that triggers a handler when a click or touch event occurs outside the specified element(s).
 *
 * Useful for closing popovers, modals, or dropdowns when the user clicks outside.
 *
 * @param ref - A single ref, DOM element, selector string, or an array of these, representing the element(s) to detect outside clicks for
 * @param handler - Function called when a click or touch event occurs outside the specified element(s)
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * useOnClickOutside(ref, () => setOpen(false));
 * ```
 */
export function useOnClickOutside(
  ref: Ref | Ref[],
  handler: (event: MouseEvent | TouchEvent) => void,
) {
  const latestHandler = useLatestValue(handler);

  useEffect(() => {
    function listener(event: MouseEvent | TouchEvent) {
      if (
        Array.isArray(ref) ?
          ref.some((item) =>
            checkIfTargetContainsRef(item, event.target as Node),
          )
        : checkIfTargetContainsRef(ref, event.target as Node)
      ) {
        return;
      }

      latestHandler.insideEffect(event);
    }

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, latestHandler]);
}
