import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { unknownToError } from 't-result';
import { useLatestValue } from './useLatestValue';

type AsyncState<T> = {
  status: 'idle' | 'loading' | 'success' | 'error';
  error: null | Error;
  data: T;
};

type AsyncResult<T> = AsyncState<T> & { isLoading: boolean; load: () => void };

type Options = { lazy?: boolean };

/**
 * React hook to manage the lifecycle of an async resource (fetching, loading, error, success).
 *
 * Handles loading state, error state, and provides a `load` function to trigger the async operation.
 * By default, the async function runs on mount unless `lazy: true` is passed.
 *
 * @param asyncFn - Function returning a Promise for the resource to load
 * @param options - Optional config: `{ lazy?: boolean }` (if true, does not auto-load on mount)
 * @param options.lazy
 * @returns Object with:
 *   - `status`: 'idle' | 'loading' | 'success' | 'error'
 *   - `error`: Error or null
 *   - `data`: The loaded data or null
 *   - `isLoading`: boolean (true if loading)
 *   - `load`: function to trigger loading
 *
 * @example
 * const { data, isLoading, error, load } = useAsyncResource(() => fetchUser(id));
 * // Optionally, call `load()` to re-fetch or if using lazy mode
 */
export function useAsyncResource<T>(
  asyncFn: () => Promise<T>,
  { lazy }: Options = {},
): AsyncResult<T | null> {
  const [state, setState] = useState<AsyncState<T | null>>({
    status: 'idle',
    error: null,
    data: null,
  });

  const loadStarted = useRef(false);
  const abortedRef = useRef(false);

  const stableFetchData = useLatestValue(async () => {
    if (
      abortedRef.current ||
      loadStarted.current ||
      state.status === 'loading'
    ) {
      return;
    }

    loadStarted.current = true;

    try {
      const data = await asyncFn();

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- false positive
      if (!abortedRef.current) {
        setState({ status: 'success', error: null, data });
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- false positive
      if (!abortedRef.current) {
        loadStarted.current = false;

        setState({
          status: 'error',
          error: unknownToError(error),
          data: null,
        });
      }
    }
  });

  useEffect(() => {
    if (loadStarted.current || lazy) return;

    void stableFetchData.insideEffect();
  }, [lazy, stableFetchData]);

  const load = useCallback(() => {
    void stableFetchData.insideEffect();
  }, [stableFetchData]);

  const isLoading =
    lazy ?
      state.status === 'loading'
    : state.status === 'idle' || state.status === 'loading';

  return useMemo(
    (): AsyncResult<T | null> => ({ ...state, isLoading, load }),
    [isLoading, load, state],
  );
}
