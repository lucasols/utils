import type {
  __LEGIT_ANY__,
  __LEGIT_ANY_FUNCTION__,
} from '@ls-stack/utils/saferTyping';
import { useCallback, useInsertionEffect, useRef } from 'react';

/**
 * Hook that provides a stable callback reference that always calls the latest version of the function.
 *
 * @param fn - The function to wrap
 * @returns A stable callback that always calls the latest version of the function
 *
 * @example
 * ```tsx
 * function MyComponent({ onDataChange, data }: { onDataChange: (data: any) => void; data: any }) {
 *   const latestCallback = useLatestCb(onDataChange);
 *
 *   useEffect(() => {
 *     const interval = setInterval(() => {
 *       // Always calls the latest onDataChange function, even with empty deps
 *       latestCallback(data);
 *     }, 1000);
 *
 *     return () => clearInterval(interval);
 *   }, [latestCallback]); // it is a stable ref that never changes
 * }
 * ```
 */
export function useLatestCb<T extends __LEGIT_ANY_FUNCTION__>(fn: T): T {
  const ref = useRef(fn);
  useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);

  return useCallback<__LEGIT_ANY__>(
    (...args: __LEGIT_ANY__) => {
      const latestFn = ref.current;
      return latestFn(...args);
    },
    [ref],
  );
}
