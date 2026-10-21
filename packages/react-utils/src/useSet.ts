import { isFunction } from '@ls-stack/utils/typeGuards';
import { useCallback, useMemo, useState } from 'react';
import { useLatestValue } from './useLatestValue';

type UseSet<T> = {
  add: (item: T) => void;
  has: (item: T) => boolean;
  delete: (item: T) => void;
  toggle: (item: T) => void;
  addOrDelete: (item: T, addOrRemove: boolean | null) => void;
  set: (items: T[]) => void;
  array: T[];
};

/** Array state with set-like operations, items are compared by reference. */
export function useSet<T>(
  initialValue?: T[] | (() => T[]),
  { onUpdate }: { onUpdate?: (newValues: T[]) => void } = {},
): UseSet<T> {
  const [values, _setValues] = useState(initialValue ?? []);

  const latestOnUpdate = useLatestValue(onUpdate);

  const setValues = useCallback(
    (newValues: T[] | ((prev: T[]) => T[])) => {
      _setValues((v) => {
        const value = isFunction(newValues) ? newValues(v) : newValues;

        if (latestOnUpdate.insideEffect) {
          latestOnUpdate.insideEffect(value);
        }

        return value;
      });
    },
    [latestOnUpdate],
  );

  const add = useCallback(
    (setItem: T) => {
      setValues((prev) =>
        prev.some((item) => item === setItem) ? prev : [...prev, setItem],
      );
    },
    [setValues],
  );

  const remove = useCallback(
    (setItem: T) => {
      setValues((prev) => prev.filter((item) => item !== setItem));
    },
    [setValues],
  );

  const toggle = useCallback(
    (setItem: T) => {
      setValues((prev) => {
        if (prev.some((item) => item === setItem)) {
          return prev.filter((item) => item !== setItem);
        }

        return [...prev, setItem];
      });
    },
    [setValues],
  );

  const addOrDelete = useCallback(
    (setItem: T, addOrRemove: boolean | null) => {
      if (addOrRemove === null) return;

      if (addOrRemove) {
        add(setItem);
      } else {
        remove(setItem);
      }
    },
    [add, remove],
  );

  const set = useCallback(
    (setItems: T[]) => {
      setValues(setItems);
    },
    [setValues],
  );

  return useMemo((): UseSet<T> => {
    function has(setItem: T) {
      return values.some((item) => item === setItem);
    }

    return {
      add,
      has,
      delete: remove,
      toggle,
      addOrDelete,
      set,
      array: values,
    };
  }, [add, addOrDelete, remove, set, toggle, values]);
}
