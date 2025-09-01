import { useRef, useState } from 'react';
import { useOnChangeLayoutEffect } from './useOnChange';
import { useScheduleToNextRender } from './useScheduleToNextRender';

export type MountAnimStates = 'from' | 'enter' | 'leave' | 'unmounted';

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
