import { debounce, isDebouncedFn } from '@ls-stack/utils/debounce';
import { keepPrevIfUnchanged } from '@ls-stack/utils/keepPrevIfUnchanged';
import type { RefObject } from 'react';
import { useCallback, useEffect, useState } from 'react';

/**
 * Measures an element's size with a `ResizeObserver`. Pass an element ref or
 * attach the returned `setRef` to the element.
 */
export function useMeasureSize(
  elementRef: RefObject<HTMLElement | null> | null,
  debounceMs = 100,
  {
    getInitialHeight,
    getInitialWidth,
    measureOnly,
    useContentRect,
    disable,
  }: {
    getInitialWidth?: () => number;
    getInitialHeight?: () => number;
    measureOnly?: 'width' | 'height';
    useContentRect?: boolean | 'width' | 'height';
    disable?: boolean;
  } = {},
): {
  width: number;
  height: number;
  isMeasuring: boolean;
  setRef: (ref: HTMLElement | null) => void;
  refElement: HTMLElement | null;
} {
  const [measurement, setMeasurement] = useState(() => ({
    width: getInitialWidth?.() ?? 0,
    height: getInitialHeight?.() ?? 0,
    isMeasuring: true,
  }));

  const [overrideRef, _setOverrideRef] = useState<HTMLElement | null>(null);

  const setOverrideRef = useCallback(
    (ref: HTMLElement | null) => {
      if (ref) {
        setMeasurement((current) => ({
          width: measureOnly === 'height' ? current.width : ref.clientWidth,
          height: measureOnly === 'width' ? current.height : ref.clientHeight,
          isMeasuring: false,
        }));
      }
      _setOverrideRef(ref);
    },
    [measureOnly],
  );

  useEffect(() => {
    if (disable) return;

    const elementToUse = overrideRef || elementRef?.current;

    if (!elementToUse) return;

    const debouncedSetMeasurements =
      debounceMs ?
        debounce(setMeasurement, debounceMs, { leading: true })
      : setMeasurement;

    const observer = new ResizeObserver((entries) => {
      const firstEntry = entries[0];

      if (!firstEntry) return;

      const { contentRect } = firstEntry;

      debouncedSetMeasurements((current) => {
        return keepPrevIfUnchanged({
          prev: current,
          newValue: {
            width:
              measureOnly === 'height' ? current.width
              : useContentRect === true || useContentRect === 'width' ?
                contentRect.width
              : elementToUse.clientWidth,
            height:
              measureOnly === 'width' ? current.height
              : useContentRect === true || useContentRect === 'height' ?
                contentRect.height
              : elementToUse.clientHeight,
            isMeasuring: false,
          },
        });
      });
    });

    // the default content box observation also catches a scrollbar appearing,
    // which changes `clientWidth`/`clientHeight` but not the border box
    observer.observe(elementToUse);

    return () => {
      observer.disconnect();

      if (isDebouncedFn(debouncedSetMeasurements)) {
        debouncedSetMeasurements.cancel();
      }
    };
  }, [
    debounceMs,
    disable,
    elementRef,
    measureOnly,
    overrideRef,
    useContentRect,
  ]);

  return {
    ...measurement,
    setRef: setOverrideRef,
    refElement: overrideRef || elementRef?.current || null,
  };
}
