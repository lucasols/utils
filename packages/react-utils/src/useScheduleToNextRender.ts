import { useCallback, useEffect, useRef, useState } from 'react';
import { noopWithArgs } from './internalUtils/noopWithArgs';

interface UseScheduleToNextRenderOptions {
  mode?: 'multiple' | 'single';
}

/** Schedules a callback to be called on the next render. */
export function useScheduleToNextRender(
  options?: UseScheduleToNextRenderOptions,
): (callback: () => void, key?: string) => void {
  const mode = options?.mode ?? 'multiple';
  const [tick, setTick] = useState(0);
  const callbacksMapRef = useRef<Map<string, () => void>>(new Map());
  const callbackWasScheduled = useRef(false);
  const keyCounterRef = useRef(0);

  useEffect(() => {
    noopWithArgs(tick);

    if (callbacksMapRef.current.size > 0) {
      if (mode === 'single') {
        // Execute only the last callback added
        const callbacks = Array.from(callbacksMapRef.current.values());
        const lastCallback = callbacks[callbacks.length - 1];
        if (lastCallback) {
          lastCallback();
        }
      } else {
        // Execute all callbacks in insertion order
        for (const callback of callbacksMapRef.current.values()) {
          callback();
        }
      }

      callbacksMapRef.current.clear();
    }

    callbackWasScheduled.current = false;
  }, [tick, mode]);

  return useCallback((callback: () => void, key?: string) => {
    if (!callbackWasScheduled.current) {
      setTick((prev) => prev + 1);
      callbackWasScheduled.current = true;
    }

    const callbackKey = key ?? `__auto_${++keyCounterRef.current}`;
    callbacksMapRef.current.set(callbackKey, callback);
  }, []);
}
