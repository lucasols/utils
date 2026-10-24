import type { FC, JSX } from 'react';
import { useEffect, useState } from 'react';

type Props = {
  /** Delay in milliseconds before unmounting the children */
  delay: number;
  /**
   * The children to render. When set to null or false, the component will delay
   * unmounting for the specified delay period
   */
  children: JSX.Element | null | false;
};

/**
 * A component that delays unmounting its children by a specified duration.
 *
 * Useful for exit animations where you need to keep a component rendered while
 * its exit animation completes.
 */
export const DelayUnmount: FC<Props> = ({ delay, children }) => {
  const [lastChildren, setLastChildren] = useState(children);

  // stored during render, so a render that React throws away (e.g. a suspended
  // transition) doesn't replace the children kept rendered on unmount
  if (children && children !== lastChildren) {
    setLastChildren(children);
  }

  useEffect(() => {
    if (children) return;

    const timeout = setTimeout(() => {
      setLastChildren(null);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [children, delay]);

  return children || lastChildren || null;
};
