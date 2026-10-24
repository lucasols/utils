/* eslint-disable jsdoc/valid-types */
import type { __LEGIT_ANY__ } from '@ls-stack/utils/saferTyping';
import { shallowEqual } from '@ls-stack/utils/shallowEqual';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useConst } from './useConst';
import { useDebouncedCallback } from './useDebouncedCallback';
import { useOnChange } from './useOnChange';
import { useOnUnMount } from './useOnUnMount';
import { useTimeout } from './useTimeout';

function isFalsy(value: unknown) {
  return !value;
}

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
 * @returns Object with defaultValue, isEmpty, onChange, isTouched ref, flush
 *   and reset functions
 */
export function useDebouncedControlledValue<T>({
  controlledValue,
  setInputValueExtraDeps: controlledValueExtraDeps,
  setControlledValue,
  debounce,
  readonly,
  setInternalValue,
  checkIfEmpty = isFalsy,
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
  const lastEmittedValue = useRef<{ value: T } | null>(null);
  /**
   * Set by `flush`, only the echo of the flushed value is ignored so a value
   * replaced in the same event is still applied
   */
  const flushedValue = useRef<{ value: T } | null>(null);
  /**
   * A flushed change replaced in the same event (e.g. by its previous value
   * when a message is sent and cleared) may not change the controlled value,
   * so the flush also triggers the controlled value check
   */
  const [flushCount, setFlushCount] = useState(0);

  const debouncedHandleChange = useDebouncedCallback(
    useCallback(
      (inputValue: T) => {
        if (readonly) return;

        lastEmittedValue.current = { value: inputValue };

        // an unchanged value has no echo, ignoring the next controlled change
        // would skip a later replacement of the value (e.g. a sent message clear)
        if (inputValue === controlledValue) return;

        setControlledValue(inputValue);

        ignoreNextControlledValueChange.current = true;
        flushedValue.current = null;

        isTouched.current = true;

        resetIgnoreNextControlledValueTimeout.call(() => {
          ignoreNextControlledValueChange.current = false;
        });
      },
      [
        readonly,
        controlledValue,
        setControlledValue,
        resetIgnoreNextControlledValueTimeout,
      ],
    ),
    debounce,
  );

  useOnChange([controlledValue, flushCount], () => {
    const flushed = flushedValue.current;
    flushedValue.current = null;

    if (flushed !== null && flushed.value === controlledValue) {
      ignoreNextControlledValueChange.current = false;
      resetIgnoreNextControlledValueTimeout.clear();
      return;
    }

    if (ignoreNextControlledValueChange.current) {
      ignoreNextControlledValueChange.current = false;
      resetIgnoreNextControlledValueTimeout.clear();

      if (!flushed) return;
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

  /**
   * Applies the pending change before an action that may replace the
   * controlled value in the same event (e.g. sending a message clears it), so
   * the replaced value is applied to the internal value instead of ignored as
   * the echo of the flushed change. The parent must apply the flushed value
   * synchronously, a different controlled value in the next render replaces
   * the internal value
   */
  function flush() {
    if (!debouncedHandleChange.pending()) return;

    debouncedHandleChange.flush();
    flushedValue.current = lastEmittedValue.current;
    setFlushCount((count) => count + 1);
  }

  /**
   * Cancels the pending change and re-applies the controlled value to the
   * internal value. Call it when the parent resets the controlled value, a
   * reset to the value it already holds (e.g. clearing an input whose pending
   * change was not emitted yet) doesn't re-render, so it would be ignored and
   * the pending change applied afterwards. A different controlled value in the
   * next render replaces the internal value
   */
  function reset() {
    debouncedHandleChange.cancel();
    ignoreNextControlledValueChange.current = false;
    resetIgnoreNextControlledValueTimeout.clear();
    flushedValue.current = null;
    lastEmittedValue.current = null;

    setInternalValue(controlledValue);
    setIsEmpty(checkIfEmpty(controlledValue));
  }

  const flushRef = useRef(flush);
  const resetRef = useRef(reset);

  useLayoutEffect(() => {
    flushRef.current = flush;
    resetRef.current = reset;
  });

  // stable, so a reset or flush captured in an earlier render reads the latest
  // controlled value
  const stableFlush = useCallback(() => flushRef.current(), []);
  const stableReset = useCallback(() => resetRef.current(), []);

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
    flush: stableFlush,
    reset: stableReset,
    /** @deprecated Use `flush` instead */
    flushDebounce: stableFlush,
  };
}
