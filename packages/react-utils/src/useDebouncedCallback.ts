import { debounce, type DebounceOptions } from '@ls-stack/utils/debounce';
import { useLayoutEffect } from 'react';
import { useConst } from './useConst';

/**
 * Hook that debounces a callback function with a stable reference.
 *
 * The returned debounced function reference stays stable across renders while
 * always calling the latest version of the callback.
 *
 * @example
 *   ```tsx
 *   function SearchInput({ onSearch }: { onSearch: (query: string) => void }) {
 *     const debouncedSearch = useDebouncedCallback(onSearch, 300);
 *
 *     return <input onChange={(e) => debouncedSearch(e.target.value)} />;
 *   }
 *   ```;
 *
 * @param callback - The function to debounce
 * @param debounceMs - The number of milliseconds to delay
 * @param options - Debounce options (leading, trailing, maxWait)
 * @returns Debounced function with cancel, flush, and pending methods
 */
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  debounceMs: number,
  options?: DebounceOptions,
) {
  const debouncedFn = useConst(() => debounce(callback, debounceMs, options));

  useLayoutEffect(() => {
    debouncedFn.updateCb(callback);
  }, [callback, debouncedFn]);

  useLayoutEffect(() => {
    debouncedFn.updateParams(debounceMs, options);
  }, [debounceMs, options, debouncedFn]);

  return debouncedFn;
}
