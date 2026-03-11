export type DebounceOptions = {
  /** Invoke on the leading edge of the timeout. Defaults to `false`. */
  leading?: boolean;
  /** Maximum time the function can be delayed before it's forced to invoke (in ms). */
  maxWait?: number;
  /** Invoke on the trailing edge of the timeout. Defaults to `true`. */
  trailing?: boolean;
};

export interface DebouncedFunc<T extends (...args: any[]) => void> {
  /**
   * Call the original function, but applying the debounce rules.
   *
   * If the debounced function can be run immediately, this calls it and returns
   * its return value.
   *
   * Otherwise, it returns the return value of the last invocation, or undefined
   * if the debounced function was not invoked yet.
   */
  (...args: Parameters<T>): ReturnType<T> | undefined;

  /** Throw away any pending invocation of the debounced function. */
  cancel: () => void;

  /**
   * If there is a pending invocation of the debounced function, invoke it
   * immediately and return its return value.
   *
   * Otherwise, return the value from the last invocation, or undefined if the
   * debounced function was never invoked.
   */
  flush: () => ReturnType<T> | undefined;

  /** Return true if the debounced function still has a scheduled run. */
  pending: () => boolean;

  /** Update the debounced function with a new callback. */
  updateCb: (callback: T) => void;

  /** Update the debounce wait and options while keeping scheduled runs. */
  updateParams: (wait: number, options?: DebounceOptions) => void;
}

// forked from lodash/debounce
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  options?: DebounceOptions,
): DebouncedFunc<T> {
  let currentCallback = func;
  let waitMs = wait;
  let currentOptions = options;
  let lastArgs: IArguments | undefined;
  let lastThis: undefined;
  let maxWait: number | undefined;
  let result: any;
  let timerId: NodeJS.Timeout | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let leading = false;
  let maxing = false;
  let trailing = true;

  function applyOptions() {
    const opts = currentOptions;

    leading = !!opts?.leading;
    trailing = opts && 'trailing' in opts ? !!opts.trailing : true;
    maxing = !!(opts && 'maxWait' in opts);
    maxWait = maxing ? Math.max(opts?.maxWait ?? 0, waitMs) : undefined;
  }

  applyOptions();

  function invokeFunc(time: number) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = currentCallback.apply(thisArg, args as any);
    return result;
  }

  function leadingEdge(time: number) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, waitMs);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number) {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = waitMs - timeSinceLastCall;

    return maxing ?
        Math.min(timeWaiting, (maxWait ?? 0) - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= waitMs ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= (maxWait ?? 0))
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time: number) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function pending() {
    return timerId !== undefined;
  }

  function updateCb(callback: T) {
    currentCallback = callback;
  }

  function updateParams(newWait: number, newOptions?: DebounceOptions) {
    waitMs = newWait;
    if (newOptions !== undefined) {
      currentOptions = newOptions;
    }
    applyOptions();

    if (timerId !== undefined) {
      const time = Date.now();
      const shouldRun = shouldInvoke(time);
      clearTimeout(timerId);
      if (shouldRun) {
        timerId = setTimeout(timerExpired, 0);
      } else {
        const delay = remainingWait(time);
        timerId = setTimeout(timerExpired, delay > 0 ? delay : 0);
      }
    }
  }

  function debounced(this: any) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    // eslint-disable-next-line prefer-rest-params
    lastArgs = arguments;
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- this is a forked code, so a refactor is not worth it
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, waitMs);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, waitMs);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;
  debounced.updateCb = updateCb;
  debounced.updateParams = updateParams;

  return debounced;
}

export function isDebouncedFn<T extends (...args: any[]) => void>(
  fn: T,
): fn is T & {
  cancel: () => void;
  flush: () => ReturnType<T> | undefined;
  pending: () => boolean;
  updateCb: (callback: T) => void;
  updateParams: (wait: number, options?: DebounceOptions) => void;
} {
  return (
    typeof fn === 'function' &&
    'cancel' in fn &&
    typeof (fn as any).cancel === 'function' &&
    'flush' in fn &&
    typeof (fn as any).flush === 'function' &&
    'pending' in fn &&
    typeof (fn as any).pending === 'function' &&
    'updateCb' in fn &&
    typeof (fn as any).updateCb === 'function' &&
    'updateParams' in fn &&
    typeof (fn as any).updateParams === 'function'
  );
}
