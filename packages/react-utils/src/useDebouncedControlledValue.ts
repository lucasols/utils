/* eslint-disable jsdoc/valid-types */
import type { __LEGIT_ANY__ } from '@ls-stack/utils/saferTyping';
import { shallowEqual } from '@ls-stack/utils/shallowEqual';
import { useCallback, useRef, useState } from 'react';
import { useConst } from './useConst';
import { useDebouncedCallback } from './useDebouncedCallback';
import { useOnChange } from './useOnChange';
import { useOnUnMount } from './useOnUnMount';
import { useTimeout } from './useTimeout';

/**
 * Hook that manages a controlled value with debounced updates and bidirectional
 * synchronization.
 *
 * This hook is useful for controlled inputs where you want to debounce user
 * input before updating the parent state, while also syncing the internal value
 * when the controlled value changes externally. It prevents race conditions by
 * ignoring controlled value changes that originated from debounced updates.
 *
 * @example
 *   ```tsx
 *   function SearchInput({ query, onQueryChange }: { query: string; onQueryChange: (query: string) => void }) {
 *     const [internalQuery, setInternalQuery] = useState(query);
 *     const { defaultValue, onChange, isEmpty } = useDebouncedControlledValue({
 *       controlledValue: query,
 *       setControlledValue: onQueryChange,
 *       setInternalValue: setInternalQuery,
 *       debounce: 300,
 *       readonly: false,
 *     });
 *
 *     return <input defaultValue={defaultValue} onChange={(e) => onChange(e.target.value)} />;
 *   }
 *   ```;
 *
 * @param options - Configuration options
 * @param options.controlledValue - The controlled value from parent state
 * @param options.setControlledValue - Callback to update the parent controlled
 *   value
 * @param options.setInternalValue - Callback to update the internal input value
 * @param options.debounce - Debounce delay in milliseconds
 * @param options.readonly - Whether the input is in readonly mode - prevents
 *   updates to controlled value
 * @param options.setInputValueExtraDeps - Additional dependencies that trigger
 *   internal value sync
 * @param options.checkIfEmpty - Function to determine if value is empty
 *   (default: `!value`)
 * @param options.onUnMount - Whether to flush or cancel pending debounced
 *   updates on unmount (default: 'flush')
 * @returns Object with defaultValue, isEmpty, onChange, isTouched ref, and
 *   flushDebounce function
 */
export function useDebouncedControlledValue<T>({
  controlledValue,
  setInputValueExtraDeps: controlledValueExtraDeps,
  setControlledValue,
  debounce,
  readonly,
  setInternalValue,
  checkIfEmpty = (value) => !value,
  onUnMount = 'flush',
}: {
  controlledValue: T;
  /** Deps used for derive the input value from the controlledValue */
  setInputValueExtraDeps?: __LEGIT_ANY__[];
  setControlledValue: (value: T) => void;
  setInternalValue: (value: T) => void;
  debounce: number;
  readonly: boolean;
  checkIfEmpty?: (value: T) => boolean;
  onUnMount?: 'flush' | 'cancel';
}) {
  const initialValue = useConst(() => controlledValue);

  const [isEmpty, setIsEmpty] = useState<boolean>(() =>
    checkIfEmpty(initialValue),
  );
  const isTouched = useRef(false);

  const ignoreNextControlledValueChange = useRef(false);
  const resetIgnoreNextControlledValueTimeout = useTimeout(500);

  const debouncedHandleChange = useDebouncedCallback(
    useCallback(
      (inputValue: T) => {
        if (readonly) return;

        setControlledValue(inputValue);

        ignoreNextControlledValueChange.current = true;

        isTouched.current = true;

        resetIgnoreNextControlledValueTimeout.call(() => {
          ignoreNextControlledValueChange.current = false;
        });
      },
      [readonly, setControlledValue, resetIgnoreNextControlledValueTimeout],
    ),
    debounce,
  );

  useOnChange(controlledValue, () => {
    if (ignoreNextControlledValueChange.current) {
      ignoreNextControlledValueChange.current = false;
      resetIgnoreNextControlledValueTimeout.clear();
      return;
    }

    setInternalValue(controlledValue);
    setIsEmpty(checkIfEmpty(controlledValue));
  });

  useOnChange(
    controlledValueExtraDeps,
    () => {
      if (!debouncedHandleChange.pending()) {
        setInternalValue(controlledValue);
        setIsEmpty(checkIfEmpty(controlledValue));
      }
    },
    { equalityFn: shallowEqual },
  );

  function onChange(value: T) {
    setIsEmpty(checkIfEmpty(value));

    debouncedHandleChange(value);
  }

  useOnUnMount(() => {
    if (onUnMount === 'flush') {
      debouncedHandleChange.flush();
    } else {
      debouncedHandleChange.cancel();
    }
  });

  return {
    defaultValue: initialValue,
    isEmpty,
    onChange,
    isTouched,
    flushDebounce: debouncedHandleChange.flush,
  };
}
