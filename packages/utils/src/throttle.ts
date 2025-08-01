// forked from lodash/throttle
import type { DebouncedFunc } from './debounce';
import { debounce } from './debounce';
import { EnhancedMap } from './enhancedMap';
import type { __LEGIT_ANY_FUNCTION__ } from './saferTyping';

interface ThrottleSettings {
  /**
   * @see _.leading
   */
  leading?: boolean;
  /**
   * @see _.trailing
   */
  trailing?: boolean;
}

export function throttle<T extends __LEGIT_ANY_FUNCTION__>(
  func: T,
  wait: number,
  options?: ThrottleSettings,
): DebouncedFunc<T> {
  let leading = true;
  let trailing = true;

  if (options) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  return debounce(func, wait, { leading, maxWait: wait, trailing });
}

export function createThrottledFunctionFactory<
  T extends string | number | null | undefined | boolean,
  R,
>(
  wait: number,
  callback: (...args: T[]) => R,
  options?: ThrottleSettings,
): { call: (...args: T[]) => R | undefined } {
  const cache = new EnhancedMap<string, DebouncedFunc<(...args: T[]) => R>>();

  return {
    call: (...args) => {
      const key = JSON.stringify(args);

      const cachedFunction = cache.getOrInsert(key, () =>
        throttle(callback, wait, options),
      );

      return cachedFunction(...args);
    },
  };
}
