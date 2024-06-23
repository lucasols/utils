import { NonPartial } from './typingUtils';

export function asNonPartial<T extends Record<string, unknown>>(
  obj: T,
): NonPartial<T> {
  return obj;
}
