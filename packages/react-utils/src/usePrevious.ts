import { useEffect, useRef } from 'react';

export function usePrevious<T>(value: T): T | undefined;
export function usePrevious<T>(value: T, initial: T): T;
export function usePrevious<T>(value: T, initial?: T): T | undefined {
  const ref = useRef<T | undefined>(initial);
  useEffect(() => {
    ref.current = value;
  });
  // oxlint-disable-next-line react/refs -- returns the value of the last render whose effects ran, a render React throws away doesn't update it
  return ref.current;
}

export function usePreviousChanged<T, I = T>(
  value: T,
  initialValue: I = undefined as I,
  equalityFn = Object.is,
): T | I {
  const ref = useRef<T | I>(initialValue);
  useEffect(() => {
    if (!equalityFn(ref.current, value)) {
      ref.current = value;
    }
  });
  // oxlint-disable-next-line react/refs -- returns the value of the last render whose effects ran, a render React throws away doesn't update it
  return ref.current;
}
