import { useRef, useState } from 'react';
import { useOnChangeLayoutEffect } from './useOnChange';
import { useScheduleToNextRender } from './useScheduleToNextRender';

export type MountAnimStates = 'from' | 'enter' | 'leave' | 'unmounted';

/**
 * React hook to manage mount/unmount animation states for a component.
 *
 * Returns the current animation state and a boolean indicating whether the element should be rendered.
 *
 * @param show - Whether the component should be shown (mounted)
 * @param animationMaxDurationMs - Maximum duration (ms) for the leave animation before unmounting
 * @returns [animState, renderElement]
 *   - animState: 'from' | 'enter' | 'leave' | 'unmounted'
 *   - renderElement: boolean (true if the element should be rendered)
 */
export function useAnimateMountUnmount(
  show: boolean,
  animationMaxDurationMs: number,
): [animState: MountAnimStates, renderElement: boolean] {
  const [animState, setAnimState] = useState<MountAnimStates>(
    show ? 'from' : 'unmounted',
  );
  const timeoutRef = useRef<number>(-1);

  const runInNextRender = useScheduleToNextRender();

  useOnChangeLayoutEffect(
    show,
    () => {
      if (animState === 'unmounted' && !show) return;

      function performMountAnimation() {
        setAnimState('from');

        clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setAnimState('enter'), 5);
      }

      if (show) {
        if (animState === 'leave') {
          setAnimState('unmounted');

          runInNextRender(performMountAnimation);

          return;
        }

        performMountAnimation();
      } else {
        setAnimState('leave');
        clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(
          () => setAnimState('unmounted'),
          animationMaxDurationMs,
        );
      }
    },
    { callOnMount: true },
  );

  return [animState, animState !== 'unmounted'];
}
