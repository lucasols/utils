import type { FC, JSX } from 'react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  /** Delay in milliseconds before unmounting the children */
  delay: number;
  /** The children to render. When set to null or false, the component will delay unmounting for the specified delay period */
  children: JSX.Element | null | false;
};

/**
 * A component that delays unmounting its children by a specified duration.
 *
 * Useful for exit animations where you need to keep a component rendered
 * while its exit animation completes.
 */
export const DelayUnmount: FC<Props> = ({ delay, children }) => {
  const renderOnUnmountRef = useRef(children);
  const [, forceRerender] = useState(0);

  useEffect(() => {
    if (children) {
      renderOnUnmountRef.current = children;
      return;
    }

    const timeout = setTimeout(() => {
      renderOnUnmountRef.current = null;
      forceRerender((prev) => prev + 1);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [children, delay, forceRerender]);

  return children || renderOnUnmountRef.current || null;
};
