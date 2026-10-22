import { useEffect, useLayoutEffect, useRef } from 'react';

export function useOnUnMount(
  callback: () => void,
  useDelayedCleanupOnDev = false,
) {
  const callbackRef = useRef(callback);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && useDelayedCleanupOnDev) {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
    }

    return () => {
      if (process.env.NODE_ENV === 'development' && useDelayedCleanupOnDev) {
        cleanupTimeoutRef.current = setTimeout(() => {
          callbackRef.current();
        }, 50);
      } else {
        callbackRef.current();
      }
    };
  }, [useDelayedCleanupOnDev]);
}
