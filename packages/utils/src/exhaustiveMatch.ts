export function exhaustiveMatch<T extends string>(value: T) {
  type Pattern<R> = {
    [K in T]: (() => R) | '_nxt' | '_never';
  };

  /**
   * The pattern can be:
   * - a function that returns the result
   * - '_nxt' to try the next pattern
   * - '_never' to indicate that this pattern should never be matched
   */
  function matchWith<R>(pattern: Pattern<R>): R {
    const result = pattern[value];

    if (typeof result === 'function') {
      return result();
    }

    if (result === '_nxt') {
      const keys = Object.keys(pattern);

      const nextIndex = keys.indexOf(value) + 1;

      for (let i = nextIndex; i < keys.length; i++) {
        const nextMatch = pattern[keys[i] as T];

        if (typeof nextMatch === 'function') {
          return nextMatch();
        }
      }
    }

    throw new Error(`Exhaustive match failed: no match for ${value}`);
  }

  /** match with early evaluation of the values */
  function withObject<R>(pattern: Record<T, R>): R {
    return pattern[value];
  }

  return {
    with: matchWith,
    withObject,
  };
}

export function exhaustiveMatchObjUnion<
  T extends Record<string, unknown>,
  D extends keyof T,
  K extends T[D] & string,
>(obj: T, key: D) {
  type Pattern<R> = {
    [P in K]: ((props: Extract<T, Record<D, P>>) => R) | '_never';
  };

  function withLazy<R>(pattern: Pattern<R>): R {
    const result = pattern[obj[key] as K];

    if (typeof result === 'function')
      return result(obj as Extract<T, Record<D, K>>);

    throw new Error(`Exhaustive match failed: no match for ${obj[key]}`);
  }

  return { with: withLazy };
}
