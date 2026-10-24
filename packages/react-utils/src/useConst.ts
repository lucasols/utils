import { useState } from 'react';

export function useConst<T>(getValue: () => T): T {
  const [value] = useState(getValue);

  return value;
}
