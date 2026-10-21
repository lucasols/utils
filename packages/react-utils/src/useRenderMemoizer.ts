import type { __LEGIT_ANY__ } from '@ls-stack/utils/saferTyping';
import { shallowEqual } from '@ls-stack/utils/shallowEqual';
import { useCallback, useEffect, useMemo } from 'react';
import { useConst } from './useConst';

type EqualityFn = (a: __LEGIT_ANY__, b: __LEGIT_ANY__) => boolean;

type RenderMemoizer = {
  getValue: <T>(key: string, value: T, equalityFn?: EqualityFn) => T;
  getValueWithDeps: <T>(
    key: string,
    value: T,
    deps: __LEGIT_ANY__,
    equalityFn?: EqualityFn,
  ) => T;
  getLazyValueWithDeps: <T>(
    key: string,
    value: () => T,
    deps: __LEGIT_ANY__,
    equalityFn?: EqualityFn,
  ) => T;
  _cache: unknown;
};

/**
 * Render-scoped memoization cache keyed by string. Keys not used during a
 * render are dropped after it commits.
 */
export function useRenderMemoizer(): RenderMemoizer {
  const cache = useConst(() => ({
    keyedItems: new Map<string, __LEGIT_ANY__>(),
    keyedItemsWithDeps: new Map<
      string,
      { value: __LEGIT_ANY__; deps: __LEGIT_ANY__[] }
    >(),
    keyedItemsTouched: new Set<string>(),
    keyedItemsWithDepsTouched: new Set<string>(),
  }));

  const getValue = useCallback<RenderMemoizer['getValue']>(
    (itemKey, value, equalityFn = shallowEqual) => {
      const prev = cache.keyedItems.get(itemKey);
      const hasPrev = cache.keyedItems.has(itemKey);

      const valueToUse: typeof value =
        hasPrev && equalityFn(prev, value) ? prev : value;

      cache.keyedItemsTouched.add(itemKey);

      // an `undefined` value must also be cached when the key is missing
      if (!hasPrev || prev !== valueToUse) {
        cache.keyedItems.set(itemKey, valueToUse);
      }

      return valueToUse;
    },
    [cache],
  );

  const getValueWithDeps = useCallback<RenderMemoizer['getValueWithDeps']>(
    (itemKey, value, deps, equalityFn = shallowEqual) => {
      const prev = cache.keyedItemsWithDeps.get(itemKey);

      cache.keyedItemsWithDepsTouched.add(itemKey);

      if (prev) {
        if (prev.value === value) {
          // keep the deps of the latest render, so the next comparison is
          // against them and not against the deps of an older render
          prev.deps = deps;
          return value;
        }

        if (equalityFn(prev.deps, deps)) {
          const prevValue: typeof value = prev.value;
          return prevValue;
        }
      }

      cache.keyedItemsWithDeps.set(itemKey, { value, deps });

      return value;
    },
    [cache],
  );

  const getLazyValueWithDeps = useCallback<
    RenderMemoizer['getLazyValueWithDeps']
  >(
    (itemKey, getLazyValue, deps, equalityFn = shallowEqual) => {
      const prev = cache.keyedItemsWithDeps.get(itemKey);

      cache.keyedItemsWithDepsTouched.add(itemKey);

      if (prev && equalityFn(prev.deps, deps)) {
        const prevValue: ReturnType<typeof getLazyValue> = prev.value;
        return prevValue;
      }

      const value = getLazyValue();

      // store the new deps even when the value is unchanged
      cache.keyedItemsWithDeps.set(itemKey, { value, deps });

      return value;
    },
    [cache],
  );

  useEffect(() => {
    if (cache.keyedItemsTouched.size !== 0) {
      for (const keyedItem of cache.keyedItems.keys()) {
        if (!cache.keyedItemsTouched.has(keyedItem)) {
          cache.keyedItems.delete(keyedItem);
        }
      }
    }

    if (cache.keyedItemsWithDepsTouched.size !== 0) {
      for (const keyedItem of cache.keyedItemsWithDeps.keys()) {
        if (!cache.keyedItemsWithDepsTouched.has(keyedItem)) {
          cache.keyedItemsWithDeps.delete(keyedItem);
        }
      }
    }

    cache.keyedItemsTouched.clear();
    cache.keyedItemsWithDepsTouched.clear();
  });

  return useMemo(
    (): RenderMemoizer => ({
      getValue,
      getValueWithDeps,
      getLazyValueWithDeps,
      _cache: cache,
    }),
    [cache, getLazyValueWithDeps, getValue, getValueWithDeps],
  );
}
