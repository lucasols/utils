import { useCallback, useMemo } from 'react';
import { useConst } from './useConst';
import { useOnUnMount } from './useOnUnMount';

/**
 * Hook that manages multiple timeouts with a stable API.
 *
 * Automatically clears all pending timeouts on unmount unless `noClearOnUnmount` is true.
 *
 * @param ms - Default timeout duration in milliseconds
 * @param noClearOnUnmount - If true, timeouts will not be cleared on unmount (default: false)
 * @returns Object with `call`, `clearAndCall`, and `clear` methods
 *
 * @example
 * ```tsx
 * function Toast({ message }: { message: string }) {
 *   const [show, setShow] = useState(true);
 *   const timeout = useTimeout(3000);
 *
 *   useEffect(() => {
 *     timeout.call(() => setShow(false));
 *   }, [timeout]);
 *
 *   return show ? <div>{message}</div> : null;
 * }
 * ```
 */
export function useTimeout(
  ms: number,
  noClearOnUnmount = false,
): {
  call: (cb: () => void, overrideMs?: number) => void;
  clearAndCall: (cb: () => void, overrideMs?: number) => void;
  clear: () => void;
} {
  const timeoutsRef = useConst(() => new Set<number>());

  const callback = useCallback(
    (cb: () => void, overrideMs = ms) => {
      timeoutsRef.add(window.setTimeout(cb, overrideMs));
    },
    [ms, timeoutsRef],
  );

  const clear = useCallback(() => {
    for (const timeout of timeoutsRef) {
      clearTimeout(timeout);
    }
  }, [timeoutsRef]);

  const clearAndCall = useCallback(
    (cb: () => void, overrideMs = ms) => {
      clear();
      callback(cb, overrideMs);
    },
    [callback, clear, ms],
  );

  useOnUnMount(() => {
    if (noClearOnUnmount) return;
    clear();
  });

  return useMemo(() => {
    return { call: callback, clearAndCall, clear };
  }, [callback, clear, clearAndCall]);
}
