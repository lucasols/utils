import { useEffect, useLayoutEffect, useRef } from 'react';

export function useOnMount(callback: () => void) {
  // the ref, not the deps, ensures it's called once, a new callback runs the
  // effect again but doesn't call it
  const called = useRef(false);

  useEffect(() => {
    if (!called.current) {
      called.current = true;
      callback();
    }
  }, [callback]);
}

export function useOnMountLayoutEffect(callback: () => void) {
  const called = useRef(false);

  useLayoutEffect(() => {
    if (!called.current) {
      called.current = true;
      callback();
    }
  }, [callback]);
}
