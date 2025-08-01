import { useRef } from 'react';

export function useConst<T>(getValue: () => T): T {
  const store = useRef<[T] | undefined>(undefined);

  if (!store.current) {
    store.current = [getValue()];
  }

  return store.current[0];
}