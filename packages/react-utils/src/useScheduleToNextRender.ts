import { useCallback, useEffect, useRef, useState } from 'react';
import { noopWithArgs } from './internalUtils/noopWithArgs';

/** Schedules a callback to be called on the next render. */
export function useScheduleToNextRender(): (callback: () => void) => void {
  const [tick, setTick] = useState(0);
  const callbackRef = useRef<(() => void) | null>(null);
  const callbackWasScheduled = useRef(false);

  useEffect(() => {
    noopWithArgs(tick);
    if (callbackRef.current) {
      callbackRef.current();
      callbackRef.current = null;
    }

    callbackWasScheduled.current = false;
  }, [tick]);

  return useCallback((callback) => {
    if (!callbackWasScheduled.current) {
      setTick((prev) => prev + 1);
      callbackWasScheduled.current = true;
    }

    callbackRef.current = callback;
  }, []);
}
