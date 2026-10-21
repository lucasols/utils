import { useLayoutEffect, useRef, useState } from 'react';
import { useTimeout } from './useTimeout';

type ChangeKey = string | number | null | false | undefined;

type Change = { key: string | number; openTime: number };

function getConsecutiveChangeDelta(
  prevChange: Change | null,
  changeKey: ChangeKey,
  changeTime: number,
  minTimeBetweenChangesMs: number,
): number | null {
  if (!changeKey || !prevChange || prevChange.key === changeKey) return null;

  const delta = changeTime - prevChange.openTime;

  return delta < minTimeBetweenChangesMs ? delta : null;
}

/**
 * Returns `true` while a `changeKey` change happened less than
 * `minTimeBetweenChangesMs` after the previous one, e.g. to show a loading
 * state instead of flickering between quick changes.
 */
export function usePreventMultipleConsecutiveChanges(
  changeKey: ChangeKey,
  minTimeBetweenChangesMs: number,
): boolean {
  const [fakeLoading, setFakeLoading] = useState(false);

  // only committed keys are recorded, so a render that React throws away (e.g.
  // a suspended transition) doesn't count as a change
  const committedChange = useRef<Change | null>(null);

  const cleanFakeLoadingTimeout = useTimeout(0);

  const renderTime = Date.now();

  // set during render so the render with the new key already returns `true`,
  // React drops this update if the render is thrown away
  if (
    !fakeLoading &&
    getConsecutiveChangeDelta(
      committedChange.current,
      changeKey,
      renderTime,
      minTimeBetweenChangesMs,
    ) !== null
  ) {
    setFakeLoading(true);
  }

  useLayoutEffect(() => {
    if (!changeKey || committedChange.current?.key === changeKey) return;

    const delta = getConsecutiveChangeDelta(
      committedChange.current,
      changeKey,
      renderTime,
      minTimeBetweenChangesMs,
    );

    if (delta !== null) {
      setFakeLoading(true);

      cleanFakeLoadingTimeout.clearAndCall(() => {
        setFakeLoading(false);
      }, minTimeBetweenChangesMs - delta);
    }

    committedChange.current = { key: changeKey, openTime: renderTime };
  }, [changeKey, cleanFakeLoadingTimeout, minTimeBetweenChangesMs, renderTime]);

  return fakeLoading;
}
