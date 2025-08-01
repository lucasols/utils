import { EnhancedMap } from './enhancedMap';
import type { DurationObj } from './time';
import { durationObjToMs } from './time';

type Options = {
  maxCalls: number;
  per: DurationObj;
  cleanupCheckSecsInterval?: number;
};

type ThrottleController = {
  shouldSkip: (callId?: string | number | (string | number)[]) => boolean;
  /** @internal */
  _currentWindows: EnhancedMap<
    string,
    { windowStartTime: number; calls: number }
  >;
};

export function createThrottleController({
  maxCalls,
  per,
  cleanupCheckSecsInterval = 60 * 30,
}: Options): ThrottleController {
  const msInterval = durationObjToMs(per);

  if (msInterval === 0) {
    throw new Error('Invalid interval');
  }

  let lastCleanupCheck = Date.now();

  const windows = new EnhancedMap<
    string,
    { windowStartTime: number; calls: number }
  >();

  function cleanup(checkTime: number) {
    const shouldCleanup =
      checkTime - lastCleanupCheck > cleanupCheckSecsInterval * 1000;

    if (!shouldCleanup) return;

    setTimeout(() => {
      const now = Date.now();

      lastCleanupCheck = now;

      for (const [key, value] of windows) {
        if (now - value.windowStartTime > msInterval) {
          windows.delete(key);
        }
      }
    }, 2);
  }

  return {
    shouldSkip(callId = '') {
      const now = Date.now();

      const serializedCallId = String(callId);

      const window = windows.getOrInsert(serializedCallId, () => ({
        windowStartTime: now,
        calls: 0,
      }));

      if (now - window.windowStartTime > msInterval) {
        window.windowStartTime = now;
        window.calls = 0;
      }

      window.calls++;

      cleanup(now);

      if (window.calls > maxCalls) {
        return true;
      }

      return false;
    },
    _currentWindows: windows,
  };
}
