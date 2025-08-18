import { deepEqual } from './deepEqual';

export function keepPrevIfUnchanged<T>({
  prev,
  newValue,
  equalityFn = deepEqual,
}: {
  prev: T;
  newValue: T;
  equalityFn?: (foo: any, bar: any) => boolean;
}): T {
  return equalityFn(prev, newValue) ? prev : newValue;
}
