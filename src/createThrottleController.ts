import { EnhancedMap } from './enhancedMap';

type Options = {
  maxCalls: number;
  per: { ms?: number; seconds?: number; minutes?: number; hours?: number };
  cleanupCheckSecsInterval?: number;
};

type ThrottleController = {
  shouldSkip(callId?: string | number | string[]): boolean;
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
  let msInterval = 0;

  if (per.ms) {
    msInterval = per.ms;
  } else if (per.seconds) {
    msInterval = per.seconds * 1000;
  } else if (per.minutes) {
    msInterval = per.minutes * 1000 * 60;
  } else if (per.hours) {
    msInterval = per.hours * 1000 * 60 * 60;
  }

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
