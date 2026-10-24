import { useInsertionEffect, useRef } from 'react';

/**
 * Returns `value` only when `shouldUpdate(prevValue, value)` is true, otherwise
 * keeps returning the last value that passed the condition.
 */
export function useConditionalValueUpdate<T>(
  value: T,
  shouldUpdate: (prevValue: T, value: T) => boolean,
  initialValue = value,
): T {
  // only committed renders update the accepted value, so a render that React
  // throws away (e.g. a suspended transition) doesn't replace it
  const committedValue = useRef(initialValue);

  // oxlint-disable-next-line react/refs -- reads the value of the last committed render, written in an insertion effect, so a render React throws away doesn't replace it
  const lastValidValue = committedValue.current;

  const nextValue =
    value !== lastValidValue && shouldUpdate(lastValidValue, value)
      ? value
      : lastValidValue;

  useInsertionEffect(() => {
    committedValue.current = nextValue;
  });

  return nextValue;
}
