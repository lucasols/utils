// forked from lodash/throttle
import type { DebouncedFunc } from './debounce';
import { debounce } from './debounce';
import { EnhancedMap } from './enhancedMap';
import type { __LEGIT_ANY_FUNCTION__ } from './saferTyping';

interface ThrottleSettings {
  /**
   * Specify invoking on the leading edge of the timeout.
   * @default true
   */
  leading?: boolean;
  /**
   * Specify invoking on the trailing edge of the timeout.
   * @default true
   */
  trailing?: boolean;
}

/**
 * Creates a throttled function that only invokes the provided function at most once per every `wait` milliseconds.
 * The throttled function comes with a `cancel` method to cancel delayed invocations and a `flush` method to immediately invoke them.
 * 
 * Throttling is useful for rate-limiting events that fire frequently, like scroll or resize handlers.
 * Unlike debouncing, throttling guarantees the function is called at regular intervals.
 * 
 * @template T - The type of the function to throttle
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to
 * @param options - The options object
 * @param options.leading - Specify invoking on the leading edge of the timeout (default: true)
 * @param options.trailing - Specify invoking on the trailing edge of the timeout (default: true)
 * @returns Returns the new throttled function
 * 
 * @example
 * ```ts
 * const throttledSave = throttle(saveData, 1000);
 * 
 * // Will only call saveData at most once per second
 * throttledSave();
 * throttledSave();
 * throttledSave();
 * ```
 * 
 * @example
 * ```ts
 * // Only invoke on trailing edge
 * const throttledHandler = throttle(handleScroll, 100, { leading: false });
 * ```
 */
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

/**
 * Creates a factory for throttled functions that caches throttled instances based on function arguments.
 * Each unique set of arguments gets its own throttled function instance, allowing for fine-grained
 * throttling control per argument combination.
 * 
 * This is useful when you want to throttle calls to the same function but with different parameters
 * independently. For example, throttling API calls per user ID or throttling UI updates per component.
 * 
 * @template T - The type of arguments the callback function accepts
 * @template R - The return type of the callback function
 * @param wait - The number of milliseconds to throttle invocations to
 * @param callback - The function to throttle
 * @param options - The throttle options (leading/trailing behavior)
 * @returns An object with a `call` method that accepts the callback arguments
 * 
 * @example
 * ```ts
 * const apiThrottle = createThrottledFunctionFactory(
 *   1000,
 *   (userId: string, action: string) => callAPI(userId, action)
 * );
 * 
 * // Each user gets their own throttled instance
 * apiThrottle.call('user1', 'update'); // Executes immediately
 * apiThrottle.call('user2', 'update'); // Executes immediately (different user)
 * apiThrottle.call('user1', 'update'); // Throttled (same user)
 * ```
 * 
 * @example
 * ```ts
 * // Throttle UI updates per component
 * const updateThrottle = createThrottledFunctionFactory(
 *   100,
 *   (componentId: string, data: any) => updateComponent(componentId, data)
 * );
 * ```
 */
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
      // Create a key that properly distinguishes between null and undefined
      const key = args.map(arg => 
        arg === undefined ? '__UNDEFINED__' : JSON.stringify(arg)
      ).join(',');

      const cachedFunction = cache.getOrInsert(key, () =>
        throttle(callback, wait, options),
      );

      return cachedFunction(...args);
    },
  };
}
