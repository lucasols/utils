import type {
  __LEGIT_ANY__,
  __LEGIT_ANY_FUNCTION__,
} from '@ls-stack/utils/saferTyping';
import {
  useCallback,
  useInsertionEffect,
  useLayoutEffect,
  useRef,
} from 'react';

export type UseLatestValue<T> = {
  insideEffect: T;
};

/**
 * Hook that provides access to the latest value within effects and callbacks.
 *
 * Returns an object with `insideEffect` property that always contains the most
 * recent value
 *
 * @param value - The value to keep track of
 * @returns Object with `insideEffect` property containing the latest value
 *
 * @example
 * ```tsx
 * function MyComponent({ count }: { count: number }) {
 *   const latestCount = useLatestValue(count);
 *
 *   useEffect(() => {
 *     const timer = setInterval(() => {
 *       // Always gets the latest count value, even in stale closure
 *       console.log('Current count:', latestCount.insideEffect);
 *     }, 1000);
 *
 *     return () => clearInterval(timer);
 *   }, [latestCount]);
 * }
 * ```
 */
export function useLatestValue<T>(value: T): UseLatestValue<T> {
  const ref = useRef<UseLatestValue<T>>({
    insideEffect: value,
  });

  ref.current.insideEffect = value;

  useLayoutEffect(() => {
    ref.current.insideEffect = value;
  });

  return ref.current;
}

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
