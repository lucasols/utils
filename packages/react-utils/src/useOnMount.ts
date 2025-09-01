import { useEffect, useLayoutEffect, useRef } from 'react';

export function useOnMount(callback: () => void) {
  const called = useRef(false);

  useEffect(() => {
    if (!called.current) {
      called.current = true;
      callback();
    }
    // eslint-disable-next-line @ls-stack/exhaustive-deps -- empty array is needed here
  }, []);
}

export function useOnMountLayoutEffect(callback: () => void) {
  const called = useRef(false);

  useLayoutEffect(() => {
    if (!called.current) {
      called.current = true;
      callback();
    }
    // eslint-disable-next-line @ls-stack/exhaustive-deps -- empty array is needed here
  }, []);
}
