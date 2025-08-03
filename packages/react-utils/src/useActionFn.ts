import { useMemo, useRef, useState } from 'react';
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

      try {
        const result = await action(...args);

        return result;
      } finally {
        isInProgressRef.current = false;
        setIsInProgress(false);
      }
    }

    return {
      get isInProgress() {
        return isInProgressRef.current;
      },
      call,
    };
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
  }, [action, isInProgress, isInProgressRef]);
}

type PartialRecord<K extends string | number | symbol, T> = Partial<
  Record<K, T>
>;

function noopWithArgs<T extends unknown[]>(..._args: T) {}
