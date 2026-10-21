import { deepEqual } from '@ls-stack/utils/deepEqual';
import { useRef } from 'react';

function areDepsEqual(prevDeps: unknown[], deps: unknown[]): boolean {
  if (prevDeps.length !== deps.length) return false;

  return prevDeps.every((dep, index) => Object.is(dep, deps[index]));
}

/**
 * Like `useMemo`, but the factory receives the previous computed value. The
 * previous value is only replaced when the new one is not deep equal to it.
 */
export function useMemoWithPrev<T>(
  factory: (prev: T | undefined) => T,
  deps: unknown[],
): T {
  const prev = useRef<T | undefined>(undefined);
  const memo = useRef<{ deps: unknown[]; value: T } | null>(null);

  if (!memo.current || !areDepsEqual(memo.current.deps, deps)) {
    const next = factory(prev.current);

    if (!deepEqual(next, prev.current)) {
      prev.current = next;
    }

    memo.current = { deps, value: next };
  }

  return memo.current.value;
}
