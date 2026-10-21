import { useRef } from 'react';

/**
 * Returns `value` only when `shouldUpdate(prevValue, value)` is true, otherwise
 * keeps returning the last value that passed the condition.
 */
export function useConditionalValueUpdate<T>(
  value: T,
  shouldUpdate: (prevValue: T, value: T) => boolean,
  initialValue = value,
) {
  const lastValidValue = useRef(initialValue);

  if (
    value !== lastValidValue.current &&
    shouldUpdate(lastValidValue.current, value)
  ) {
    lastValidValue.current = value;
    return value;
  }

  return lastValidValue.current;
}
