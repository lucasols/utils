import { useRef, useState } from 'react';
import { useTimeout } from './useTimeout';

/**
 * Returns `true` while a `changeKey` change happened less than
 * `minTimeBetweenChangesMs` after the previous one, e.g. to show a loading
 * state instead of flickering between quick changes.
 */
export function usePreventMultipleConsecutiveChanges(
  changeKey: string | number | null | false | undefined,
  minTimeBetweenChangesMs: number,
): boolean {
  const [fakeLoading, setFakeLoading] = useState(false);

  const currentChange = useRef<{
    key: string | number;
    openTime: number;
  } | null>(null);

  const cleanFakeLoadingTimeout = useTimeout(0);

  if (changeKey && currentChange.current?.key !== changeKey) {
    if (currentChange.current) {
      const delta = Date.now() - currentChange.current.openTime;

      if (delta < minTimeBetweenChangesMs) {
        setFakeLoading(true);

        cleanFakeLoadingTimeout.clearAndCall(() => {
          setFakeLoading(false);
        }, minTimeBetweenChangesMs - delta);
      }
    }

    currentChange.current = { key: changeKey, openTime: Date.now() };
  }

  return fakeLoading;
}
