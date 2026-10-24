import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type ChangeKey = string | number | null | false | undefined;

type Change = { key: string | number; openTime: number };

/**
 * When `changeKey` changed less than `minTimeBetweenChangesMs` after the
 * previous change, returns when the loading should end. The deadline only
 * depends on the previous change, so every render agrees on it.
 */
function getLoadingDeadline(
  prevChange: Change | null,
  changeKey: ChangeKey,
  changeTime: number,
  minTimeBetweenChangesMs: number,
): number | null {
  if (!changeKey || !prevChange || prevChange.key === changeKey) return null;

  const deadline = prevChange.openTime + minTimeBetweenChangesMs;

  return changeTime < deadline ? deadline : null;
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
  const [loadingUntil, setLoadingUntil] = useState<number | null>(null);

  // only committed keys are recorded, so a render that React throws away (e.g.
  // a suspended transition) doesn't count as a change
  const committedChange = useRef<Change | null>(null);

  // oxlint-disable-next-line react/purity -- the render time is compared with the committed change time, a new time in every render is expected
  const renderTime = Date.now();

  // set during render so the render with the new key already returns `true`,
  // React drops this update if the render is thrown away
  if (loadingUntil === null) {
    const deadline = getLoadingDeadline(
      // oxlint-disable-next-line react/refs -- reads the change of the last committed render, written in a layout effect, so a render React throws away doesn't count as a change
      committedChange.current,
      changeKey,
      renderTime,
      minTimeBetweenChangesMs,
    );

    if (deadline !== null) setLoadingUntil(deadline);
  }

  useLayoutEffect(() => {
    if (!changeKey || committedChange.current?.key === changeKey) return;

    // a change this far from the previous one also ends any loading, it is
    // already past the previous deadline
    setLoadingUntil(
      getLoadingDeadline(
        committedChange.current,
        changeKey,
        renderTime,
        minTimeBetweenChangesMs,
      ),
    );

    committedChange.current = { key: changeKey, openTime: renderTime };
  }, [changeKey, minTimeBetweenChangesMs, renderTime]);

  // scheduled from the deadline in state, so it is scheduled again when the
  // effects are recreated (e.g. a hidden `<Activity>` shown again)
  useEffect(() => {
    if (loadingUntil === null) return;

    const timeout = setTimeout(
      () => {
        setLoadingUntil(null);
      },
      Math.max(0, loadingUntil - Date.now()),
    );

    return () => {
      clearTimeout(timeout);
    };
  }, [loadingUntil]);

  return loadingUntil !== null;
}
