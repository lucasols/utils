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

  return {
    with: matchWith,
  };
}
