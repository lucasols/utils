import { deepEqual } from '@ls-stack/utils/deepEqual';
import { useInsertionEffect, useRef } from 'react';

type Memo<T> = { deps: unknown[]; value: T; prev: T | undefined };

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
  // like `useMemo`, only committed renders update the cache, so a render that
  // React throws away (e.g. a suspended transition) doesn't leak its result
  const committedMemo = useRef<Memo<T> | null>(null);

  let memo = committedMemo.current;

  if (!memo || !areDepsEqual(memo.deps, deps)) {
    const prev = memo?.prev;
    const next = factory(prev);

    memo = { deps, value: next, prev: deepEqual(next, prev) ? prev : next };
  }

  const renderMemo = memo;

  useInsertionEffect(() => {
    committedMemo.current = renderMemo;
  });

  return memo.value;
}
