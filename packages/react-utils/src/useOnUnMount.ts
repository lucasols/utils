import { useEffect, useRef } from 'react';
import { useLatestValue } from './useLatestValue';

export function useOnUnMount(
  callback: () => void,
  useDelayedCleanupOnDev = false,
) {
  const latestCallback = useLatestValue(callback);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && useDelayedCleanupOnDev) {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
    }

    return () => {
      if (process.env.NODE_ENV === 'development' && useDelayedCleanupOnDev) {
        cleanupTimeoutRef.current = setTimeout(() => {
          latestCallback.insideEffect();
        }, 50);
      } else {
        latestCallback.insideEffect();
      }
    };
  }, [latestCallback, useDelayedCleanupOnDev]);
}
