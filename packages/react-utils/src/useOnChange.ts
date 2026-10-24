import { deepEqual } from '@ls-stack/utils/deepEqual';
import type { __LEGIT_ANY__ } from '@ls-stack/utils/saferTyping';
import { type RefObject, useEffect, useLayoutEffect, useRef } from 'react';
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

type CleanupRef = RefObject<CleanupFn | undefined>;

function runChange(
  cleanupRef: CleanupRef,
  hasChanged: () => boolean,
  shouldCall: () => boolean,
  callBack: () => void | CleanupFn,
) {
  if (!hasChanged()) return;

  const prevCleanup = cleanupRef.current;
  cleanupRef.current = undefined;
  prevCleanup?.();

  if (!shouldCall()) return;

  const cleanup = callBack();
  cleanupRef.current = typeof cleanup === 'function' ? cleanup : undefined;
}

function runUnmountCleanup(cleanupRef: CleanupRef) {
  cleanupRef.current?.();
  cleanupRef.current = undefined;
}

/**
 * Runs `callBack` when `hasChanged` and `shouldCall` return true. The cleanup
 * returned by the callback runs only on the next change or on unmount, not on
 * every re-render.
 */
function useChangeEffect(
  hasChanged: () => boolean,
  shouldCall: () => boolean,
  callBack: () => void | CleanupFn,
) {
  const cleanupRef = useRef<CleanupFn | undefined>(undefined);

  useEffect(() => {
    runChange(cleanupRef, hasChanged, shouldCall, callBack);
  });

  useEffect(() => {
    return () => runUnmountCleanup(cleanupRef);
  }, []);
}

/** `useChangeEffect` running in a layout effect */
function useChangeLayoutEffect(
  hasChanged: () => boolean,
  shouldCall: () => boolean,
  callBack: () => void | CleanupFn,
) {
  const cleanupRef = useRef<CleanupFn | undefined>(undefined);

  useLayoutEffect(() => {
    runChange(cleanupRef, hasChanged, shouldCall, callBack);
  });

  useLayoutEffect(() => {
    return () => runUnmountCleanup(cleanupRef);
  }, []);
}

/**
 * A replacement for useEffect that doesn't need a dependency array.
 * Automatically triggers the callback when the value changes based on deep
 * equality comparison. By default, the callback is not called on mount (use
 * `callOnMount` option to change this).
 *
 * @example
 *   ```tsx
 *   const [count, setCount] = useState(0);
 *
 *   useOnChange(count, ({ prev, current }) => {
 *   console.log(`Count changed from ${prev} to ${current}`);
 *   });
 *   ```
 *
 * @param value - The value to watch for changes
 * @param callBack - Function called when value changes, receives prev and
 *   current values
 * @param options - Configuration options
 * @param options.equalityFn - Custom equality function for comparison (defaults
 *   to deepEqual)
 * @param options.callOnMount - Whether to call callback on mount (defaults to
 *   false)
 */
export function useOnChange<T>(
  value: T,
  callBack: (values: { prev: T | undefined; current: T }) => void | CleanupFn,
  { equalityFn: areEqual = deepEqual, callOnMount }: OnChangeOptions = {},
) {
  const prev = usePrevious(value, !callOnMount ? value : undefined);
  useChangeEffect(
    () => !areEqual(value, prev),
    () => true,
    () => callBack({ prev, current: value }),
  );
}

/**
 * Layout effect version of useOnChange that runs synchronously before DOM
 * updates. Similar to useOnChange but uses useLayoutEffect instead of useEffect
 * for timing-sensitive updates.
 *
 * @param value - The value to watch for changes
 * @param callBack - Function called when value changes, receives prev and
 *   current values
 * @param options - Configuration options
 * @param options.equalityFn - Custom equality function for comparison (defaults
 *   to deepEqual)
 * @param options.callOnMount - Whether to call callback on mount (defaults to
 *   false)
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
  useChangeLayoutEffect(
    () => !areEqual(value, prev),
    () => true,
    () => callBack({ prev, current: value }),
  );
}

/**
 * Triggers callback only when value changes to a specific target value. Useful
 * for watching for specific state transitions or reaching particular values.
 *
 * @example
 *   ```tsx
 *   const [status, setStatus] = useState('idle');
 *
 *   useOnChangeTo(status, 'loading', ({ prev, target }) => {
 *   console.log(`Status changed from ${prev} to loading`);
 *   });
 *   ```
 *
 * @param value - The value to watch for changes
 * @param target - The specific target value to watch for
 * @param callBack - Function called when value changes to target, receives prev
 *   and target values
 * @param options - Configuration options
 * @param options.equalityFn - Custom equality function for comparison (defaults
 *   to deepEqual)
 * @param options.callOnMount - Whether to call callback on mount (defaults to
 *   false)
 */
export function useOnChangeTo<T, U extends T>(
  value: T,
  target: U,
  callBack: (values: { prev: T | undefined; target: U }) => void | CleanupFn,
  { equalityFn: areEqual = deepEqual, callOnMount }: OnChangeOptions = {},
) {
  const prev = usePrevious(value, !callOnMount ? value : undefined);
  useChangeEffect(
    () => !areEqual(value, prev),
    () => areEqual(value, target),
    () => callBack({ prev, target }),
  );
}

/**
 * Layout effect version of useOnChangeTo that runs synchronously before DOM
 * updates. Combines specific target value watching with useLayoutEffect timing
 * for synchronous execution.
 *
 * @param value - The value to watch for changes
 * @param target - The specific target value to watch for
 * @param callBack - Function called when value changes to target, receives prev
 *   and target values
 * @param options - Configuration options
 * @param options.equalityFn - Custom equality function for comparison (defaults
 *   to deepEqual)
 * @param options.callOnMount - Whether to call callback on mount (defaults to
 *   false)
 */
export function useOnChangeToLayoutEffect<T, U extends T>(
  value: T,
  target: U,
  callBack: (values: { prev: T | undefined; target: U }) => void | CleanupFn,
  { equalityFn: areEqual = deepEqual, callOnMount }: OnChangeOptions = {},
) {
  const prev = usePrevious(value, !callOnMount ? value : undefined);
  useChangeLayoutEffect(
    () => !areEqual(value, prev),
    () => areEqual(value, target),
    () => callBack({ prev, target }),
  );
}
