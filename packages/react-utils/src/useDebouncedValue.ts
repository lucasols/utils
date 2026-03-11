import type { DebounceOptions } from '@ls-stack/utils/debounce';
import { deepEqual } from '@ls-stack/utils/deepEqual';
import { useCallback, useMemo, useState } from 'react';
import { useDebouncedCallback } from './useDebouncedCallback';
import { useOnChange } from './useOnChange';
import { useOnUnMount } from './useOnUnMount';

const noopFlush = () => {};

/**
 * Hook that debounces a reactive value, returning a delayed version that only
 * updates after the specified delay has passed without changes.
 *
 * Pass `0` as `debounceMs` to disable debouncing entirely, which makes the
 * hook act as a passthrough (the returned value always matches the input).
 * This is useful for conditionally disabling debouncing without changing the
 * call site.
 *
 * @example
 *   ```tsx
 *   function SearchResults({ query }: { query: string }) {
 *     const [debouncedQuery, flush, isPending] = useDebouncedValue(query, 300);
 *
 *     // debouncedQuery updates 300ms after the last query change
 *     return isPending ? <Spinner /> : <Results query={debouncedQuery} />;
 *   }
 *   ```;
 *
 * @param value - The value to debounce
 * @param debounceMs - The debounce delay in milliseconds. Use `0` to disable
 *   debouncing and pass the value through immediately.
 * @param options - Debounce options (leading, trailing, maxWait)
 * @returns Tuple of [debouncedValue, flush, isPending]
 */
export function useDebouncedValue<T>(
  value: T,
  debounceMs: number,
  options?: DebounceOptions,
): readonly [debouncedValue: T, flush: () => void, isPending: boolean] {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const disabled = debounceMs === 0;

  const debouncedSetter = useDebouncedCallback(
    useCallback((newValue: T) => {
      setDebouncedValue(() => newValue);
    }, []),
    debounceMs,
    options,
  );

  useOnChange(disabled, () => {
    if (disabled) {
      debouncedSetter.cancel();
    } else {
      setDebouncedValue(() => value);
    }
  });

  useOnChange(value, ({ current }) => {
    if (disabled) {
      return;
    }

    debouncedSetter(current);
  });

  useOnUnMount(() => {
    debouncedSetter.cancel();
  });

  const flush = useCallback(() => {
    debouncedSetter.flush();
  }, [debouncedSetter]);

  const isPending = useMemo(() => !disabled && !deepEqual(value, debouncedValue), [disabled, value, debouncedValue]);

  return [disabled ? value : debouncedValue, disabled ? noopFlush : flush, isPending] as const;
}
