import { deepEqual } from '@ls-stack/utils/deepEqual';
import type { __LEGIT_ANY__ } from '@ls-stack/utils/saferTyping';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePrevious } from './usePrevious';

/** Function that compares two values for equality */
type EqualityFn = (a: __LEGIT_ANY__, b: __LEGIT_ANY__) => boolean;

/** Function returned from callbacks to clean up side effects */
type CleanupFn = () => void;

/** Options for configuring onChange behavior */
type OnChangeOptions = {
  /** Custom equality function for value comparison. Defaults to deepEqual */
  equalityFn?: EqualityFn;
  /** Whether to call the callback on component mount. Defaults to false */
  callOnMount?: boolean;
};

/**
 * Runs `callBack` when `hasChanged` and `shouldCall` return true. The cleanup
 * returned by the callback runs only on the next change or on unmount, not on
 * every re-render.
 */
function useChangeEffect(
  useEffectHook: typeof useEffect,
  hasChanged: () => boolean,
  shouldCall: () => boolean,
  callBack: () => void | CleanupFn,
) {
  const cleanupRef = useRef<CleanupFn | undefined>(undefined);

  useEffectHook(() => {
    if (!hasChanged()) return;

    const prevCleanup = cleanupRef.current;
    cleanupRef.current = undefined;
    prevCleanup?.();

    if (!shouldCall()) return;

    const cleanup = callBack();
    cleanupRef.current = typeof cleanup === 'function' ? cleanup : undefined;
  });

  useEffectHook(() => {
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = undefined;
    };
  }, []);
}

/**
 * A replacement for useEffect that doesn't need a dependency array.
 * Automatically triggers the callback when the value changes based on deep equality comparison.
 * By default, the callback is not called on mount (use `callOnMount` option to change this).
 *
 * @param value - The value to watch for changes
 * @param callBack - Function called when value changes, receives prev and current values
 * @param options - Configuration options
 * @param options.equalityFn - Custom equality function for comparison (defaults to deepEqual)
 * @param options.callOnMount - Whether to call callback on mount (defaults to false)
 *
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 *
 * useOnChange(count, ({ prev, current }) => {
 *   console.log(`Count changed from ${prev} to ${current}`);
 * });
 * ```
 */
export function useOnChange<T>(
  value: T,
  callBack: (values: { prev: T | undefined; current: T }) => void | CleanupFn,
  { equalityFn: areEqual = deepEqual, callOnMount }: OnChangeOptions = {},
) {
  const prev = usePrevious(value, !callOnMount ? value : undefined);
  useChangeEffect(
    useEffect,
    () => !areEqual(value, prev),
    () => true,
    () => callBack({ prev, current: value }),
  );
}

/**
 * Layout effect version of useOnChange that runs synchronously before DOM updates.
 * Similar to useOnChange but uses useLayoutEffect instead of useEffect for timing-sensitive updates.
 *
 * @param value - The value to watch for changes
 * @param callBack - Function called when value changes, receives prev and current values
 * @param options - Configuration options
 * @param options.equalityFn - Custom equality function for comparison (defaults to deepEqual)
 * @param options.callOnMount - Whether to call callback on mount (defaults to false)
 */
export function useOnChangeLayoutEffect<T>(
  value: T,
  callBack: (values: { prev: T | undefined; current: T }) => void | CleanupFn,
  {
    equalityFn: areEqual = deepEqual,
    callOnMount,
  }: Omit<OnChangeOptions, 'layoutEffect'> = {},
) {
  const prev = usePrevious(value, !callOnMount ? value : undefined);
  useChangeEffect(
    useLayoutEffect,
    () => !areEqual(value, prev),
    () => true,
    () => callBack({ prev, current: value }),
  );
}

/**
 * Triggers callback only when value changes to a specific target value.
 * Useful for watching for specific state transitions or reaching particular values.
 *
 * @param value - The value to watch for changes
 * @param target - The specific target value to watch for
 * @param callBack - Function called when value changes to target, receives prev and target values
 * @param options - Configuration options
 * @param options.equalityFn - Custom equality function for comparison (defaults to deepEqual)
 * @param options.callOnMount - Whether to call callback on mount (defaults to false)
 *
 * @example
 * ```tsx
 * const [status, setStatus] = useState('idle');
 * 
 * useOnChangeTo(status, 'loading', ({ prev, target }) => {
 *   console.log(`Status changed from ${prev} to loading`);
 * });
 * ```
 */
export function useOnChangeTo<T, U extends T>(
  value: T,
  target: U,
  callBack: (values: { prev: T | undefined; target: U }) => void | CleanupFn,
  { equalityFn: areEqual = deepEqual, callOnMount }: OnChangeOptions = {},
) {
  const prev = usePrevious(value, !callOnMount ? value : undefined);
  useChangeEffect(
    useEffect,
    () => !areEqual(value, prev),
    () => areEqual(value, target),
    () => callBack({ prev, target }),
  );
}

/**
 * Layout effect version of useOnChangeTo that runs synchronously before DOM updates.
 * Combines specific target value watching with useLayoutEffect timing for synchronous execution.
 *
 * @param value - The value to watch for changes
 * @param target - The specific target value to watch for
 * @param callBack - Function called when value changes to target, receives prev and target values
 * @param options - Configuration options
 * @param options.equalityFn - Custom equality function for comparison (defaults to deepEqual)
 * @param options.callOnMount - Whether to call callback on mount (defaults to false)
 */
export function useOnChangeToLayoutEffect<T, U extends T>(
  value: T,
  target: U,
  callBack: (values: { prev: T | undefined; target: U }) => void | CleanupFn,
  { equalityFn: areEqual = deepEqual, callOnMount }: OnChangeOptions = {},
) {
  const prev = usePrevious(value, !callOnMount ? value : undefined);
  useChangeEffect(
    useLayoutEffect,
    () => !areEqual(value, prev),
    () => areEqual(value, target),
    () => callBack({ prev, target }),
  );
}
