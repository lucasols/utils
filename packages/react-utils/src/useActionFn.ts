import { useMemo, useRef, useState } from 'react';
import { noopWithArgs } from './internalUtils/noopWithArgs';
import { useConst } from './useConst';

export function useActionFn<A extends unknown[], T>(
  action: (...params: A) => T,
): { isInProgress: boolean; call: (...args: A) => Promise<null | Awaited<T>> } {
  const isInProgressRef = useRef(false);
  const [isInProgress, setIsInProgress] = useState(false);

  return useMemo(() => {
    noopWithArgs(isInProgress);
    async function call(...args: A): Promise<null | Awaited<T>> {
      if (isInProgressRef.current) return null;

      isInProgressRef.current = true;
      setIsInProgress(true);

      // oxlint-disable-next-line react/todo -- the library isn't compiled by the React compiler, `finally` resets the state on success and on error
      try {
        const result = await action(...args);

        return result;
      } finally {
        isInProgressRef.current = false;
        setIsInProgress(false);
      }
    }

    return {
      // oxlint-disable-next-line react/todo -- the getter reads the ref, so a call in the same event already sees it in progress
      get isInProgress() {
        return isInProgressRef.current;
      },
      call,
    };
    // oxlint-disable-next-line react/memo-dependencies -- `isInProgress` creates a new object when the progress changes, re-rendering the consumers
  }, [action, isInProgress]);
}

export function useActionFnWithState<
  T extends string | number,
  A extends unknown[],
  R,
>(
  action: (state: T, ...params: A) => R,
): {
  isInProgress: (state: T) => boolean;
  call: (state: T, ...args: A) => Promise<false | Awaited<R>>;
} {
  const isInProgressRef = useConst(() => new Map<T, boolean>());

  const [isInProgress, setIsInProgress] = useState<PartialRecord<T, boolean>>(
    {},
  );

  return useMemo(() => {
    noopWithArgs(isInProgress);
    async function call(state: T, ...args: A): Promise<false | Awaited<R>> {
      if (isInProgressRef.get(state)) return false;

      isInProgressRef.set(state, true);
      setIsInProgress((prev) => ({ ...prev, [state]: true }));

      // oxlint-disable-next-line react/todo -- the library isn't compiled by the React compiler, `finally` resets the state on success and on error
      try {
        const result = await action(state, ...args);
        return result;
      } finally {
        isInProgressRef.set(state, false);
        setIsInProgress((prev) => ({ ...prev, [state]: false }));
      }
    }

    return {
      isInProgress: (state) => isInProgressRef.get(state) ?? false,
      call,
    };
    // oxlint-disable-next-line react/memo-dependencies -- `isInProgress` creates a new object when the progress changes, re-rendering the consumers
  }, [action, isInProgress, isInProgressRef]);
}

type PartialRecord<K extends string | number | symbol, T> = Partial<
  Record<K, T>
>;
