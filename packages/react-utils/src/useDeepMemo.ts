import { deepEqual } from '@ls-stack/utils/deepEqual';
import { useRef } from 'react';

/**
 * Like `useMemo`, but the dependencies are compared with `deepEqual` instead of
 * by reference, so the value is only recomputed when a dependency changes
 * structurally.
 */
export function useDeepMemo<T>(callback: () => T, deeps: unknown[]): T {
  const memo = useRef<{ deps: unknown[]; value: T } | null>(null);

  // oxlint-disable-next-line react/refs -- a cache by deep equality: a render React throws away can only store a value that deep equals the deps it is returned for
  if (!memo.current || !deepEqual(deeps, memo.current.deps)) {
    memo.current = { deps: deeps, value: callback() };
  }

  // oxlint-disable-next-line react/refs -- returns the value cached for deps deep equal to the current ones
  return memo.current.value;
}

/**
 * Returns the first received value that is deep equal to `value`, keeping the
 * reference stable while the value doesn't change structurally.
 */
export function useStableRefValue<T>(value: T): T {
  return useDeepMemo(() => value, [value]);
}
