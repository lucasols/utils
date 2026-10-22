import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { unknownToError } from 't-result';
import { shallowEqual } from '@ls-stack/utils/shallowEqual';
import { useOnChange } from './useOnChange';

type AsyncState<T> = {
  status: 'idle' | 'loading' | 'refetching' | 'success' | 'error';
  error: null | Error;
  data: T;
};

type AsyncResult<T> = AsyncState<T> & { isLoading: boolean; load: () => void };

type Options = {
  lazy?: boolean;
  asyncFnUsesExternalDeps?: boolean;
  externalDeps?: unknown[];
};

/**
 * React hook to manage the lifecycle of an async resource (fetching, loading,
 * error, success).
 *
 * Handles loading state, error state, and provides a `load` function to trigger
 * the async operation. By default, the async function runs on mount unless
 * `lazy: true` is passed.
 *
 * @example
 *   const { data, isLoading, error, load } = useAsyncResource(() =>
 *     fetchUser(id),
 *   );
 *   // Optionally, call `load()` to re-fetch or if using lazy mode
 *
 * @example
 *   // Auto-refetch when dependencies change
 *   const { data, isLoading, status } = useAsyncResource(
 *     () => fetchUser(userId),
 *     { asyncFnUsesExternalDeps: true },
 *   );
 *   // Will refetch automatically when userId changes, status becomes 'refetching'
 *
 * @param asyncFn - Function returning a Promise for the resource to load
 * @param options - Optional configuration object
 * @param options.lazy - If true, does not auto-load on mount
 * @param options.asyncFnUsesExternalDeps - If true, automatically re-fetches
 *   when asyncFn changes
 * @param options.externalDeps - Array of dependencies that trigger refetch when
 *   changed (similar to useEffect deps)
 * @returns Object with:
 *
 *   - `status`: 'idle' | 'loading' | 'refetching' | 'success' | 'error'
 *   - `error`: Error or null
 *   - `data`: The loaded data or null
 *   - `isLoading`: boolean (true if loading or refetching)
 *   - `load`: function to trigger loading
 */
export function useAsyncResource<T>(
  asyncFn: () => Promise<T>,
  { lazy, asyncFnUsesExternalDeps, externalDeps }: Options = {},
): AsyncResult<T | null> {
  const [state, setState] = useState<AsyncState<T | null>>({
    status: lazy ? 'idle' : 'loading',
    error: null,
    data: null,
  });

  const abortedRef = useRef(false);
  const loadingRef = useRef(false);
  const isRefetchingRef = useRef(false);
  const prevAsyncFnRef = useRef(asyncFn);
  const hasInitialLoadRef = useRef(false);
  const currentLoadIdRef = useRef(0);

  async function fetchData(isRefetch = false, allowConcurrent = false) {
    if (abortedRef.current) {
      return;
    }

    // Handle concurrent loads
    if (loadingRef.current && !allowConcurrent) {
      // Manual load can override refetch, but not another manual load
      if (!isRefetch && isRefetchingRef.current) {
        // Allow manual load to override ongoing refetch
        isRefetchingRef.current = false;
      } else {
        // Prevent concurrent loads of same type
        return;
      }
    }

    // Assign unique ID to this load
    const loadId = ++currentLoadIdRef.current;
    loadingRef.current = true;
    isRefetchingRef.current = isRefetch;

    setState((prevState) => ({
      status: isRefetch ? 'refetching' : 'loading',
      error: null,
      data: isRefetch ? prevState.data : null,
    }));

    try {
      const data = await asyncFn();

      // Only update state if this is still the current load and not aborted
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- false positive
      if (!abortedRef.current && loadId === currentLoadIdRef.current) {
        setState({ status: 'success', error: null, data });
        hasInitialLoadRef.current = true;
      }
    } catch (error) {
      // Only update state if this is still the current load and not aborted
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- false positive
      if (!abortedRef.current && loadId === currentLoadIdRef.current) {
        setState({
          status: 'error',
          error: unknownToError(error),
          data: null,
        });
        hasInitialLoadRef.current = true;
      }
    } finally {
      // Only reset loading state if this is still the current load
      if (loadId === currentLoadIdRef.current) {
        loadingRef.current = false;
        isRefetchingRef.current = false;
      }
    }
  }

  const fetchDataRef = useRef(fetchData);

  useLayoutEffect(() => {
    fetchDataRef.current = fetchData;
  });

  useEffect(() => {
    if (lazy) return;

    void fetchDataRef.current();
  }, [lazy]);

  // Auto-refetch when asyncFn changes if asyncFnUsesExternalDeps is true
  useEffect(() => {
    if (!asyncFnUsesExternalDeps || asyncFn === prevAsyncFnRef.current) return;

    const isCurrentlyLoading =
      state.status === 'loading' || state.status === 'refetching';
    const hasCompletedLoad =
      hasInitialLoadRef.current &&
      (state.status === 'success' || state.status === 'error');

    if (hasCompletedLoad) {
      // Normal refetch case - we have previous data
      void fetchDataRef.current(true);
    } else if (isCurrentlyLoading) {
      // Function changed during loading - start new load (old load will be ignored via ID check)
      void fetchDataRef.current(false, true);
    } else {
      // If idle and no previous load, start fresh load
      void fetchDataRef.current(false);
    }

    prevAsyncFnRef.current = asyncFn;
  }, [asyncFnUsesExternalDeps, asyncFn, state.status]);

  // Auto-refetch when externalDeps change
  useOnChange(
    externalDeps,
    () => {
      if (!externalDeps) return;

      // Only refetch if we've completed at least one load
      const hasCompletedLoad =
        hasInitialLoadRef.current &&
        (state.status === 'success' || state.status === 'error');

      if (hasCompletedLoad) {
        void fetchDataRef.current(true);
      }
    },
    { equalityFn: shallowEqual },
  );

  useEffect(() => {
    return () => {
      abortedRef.current = true;
    };
  }, []);

  const load = useCallback(() => {
    // Manual load always does a full reload (not refetch)
    void fetchDataRef.current(false);
  }, []);

  const isLoading =
    lazy ?
      state.status === 'loading' || state.status === 'refetching'
    : state.status === 'idle' ||
      state.status === 'loading' ||
      state.status === 'refetching';

  return useMemo(
    (): AsyncResult<T | null> => ({ ...state, isLoading, load }),
    [isLoading, load, state],
  );
}
