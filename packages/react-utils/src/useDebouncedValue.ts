import { useCallback, useState } from 'react';
import { useDebouncedCallback } from './useDebouncedCallback';
import { useOnChange } from './useOnChange';
import { useOnUnMount } from './useOnUnMount';

/**
 * Hook that debounces a reactive value, returning a delayed version that only
 * updates after the specified delay has passed without changes.
 *
 * @example
 *   ```tsx
 *   function SearchResults({ query }: { query: string }) {
 *     const { debouncedValue, isPending } = useDebouncedValue(query, 300);
 *
 *     // debouncedValue updates 300ms after the last query change
 *     return isPending ? <Spinner /> : <Results query={debouncedValue} />;
 *   }
 *   ```;
 *
 * @param value - The value to debounce
 * @param debounceMs - The debounce delay in milliseconds
 * @returns Object with debouncedValue, isPending, and flush
 */
export function useDebouncedValue<T>(
  value: T,
  debounceMs: number,
): {
  debouncedValue: T;
  isPending: boolean;
  flush: () => void;
} {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isPending, setIsPending] = useState(false);

  const debouncedSetter = useDebouncedCallback(
    useCallback((newValue: T) => {
      setDebouncedValue(() => newValue);
      setIsPending(false);
    }, []),
    debounceMs,
  );

  useOnChange(value, ({ current }) => {
    setIsPending(true);
    debouncedSetter(current);
  });

  useOnUnMount(() => {
    debouncedSetter.cancel();
  });

  const flush = useCallback(() => {
    debouncedSetter.flush();
  }, [debouncedSetter]);

  return {
    debouncedValue,
    isPending,
    flush,
  };
}
