import { keepPrevIfUnchanged } from './keepPrevIfUnchanged';

/**
 * Updates an object with a new set of values. undefined values are ignored in
 * the updates object and deep equal values are not updated.
 *
 * @param object - The object to update.
 * @param updates - The new values to update the object with.
 */
export function updateObject<T extends Record<string, unknown>>(
  object: T | undefined | null,
  updates: Partial<T>,
): void {
  if (!object || typeof object !== 'object') {
    return;
  }

  for (const key of Object.keys(updates)) {
    const value = updates[key];

    if (value !== undefined) {
      (object as any)[key] = keepPrevIfUnchanged({
        prev: object[key],
        newValue: value,
      });
    }
  }
}
