import { keepPrevIfUnchanged } from './keepPrevIfUnchanged';
import { isFunction } from './typeGuards';

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

export function getArrayMethodsFromProduce<T extends Record<string, unknown>>(
  produceFn: (cb: (newVal: T[]) => void | T[]) => T[] | void,
  getItemId: (item: T) => string,
) {
  return {
    add: (item: T) =>
      produceFn((draft) => {
        draft.push(item);
      }),
    remove: (id: string) =>
      produceFn((draft) => {
        const index = draft.findIndex((item) => getItemId(item) === id);
        if (index !== -1) {
          draft.splice(index, 1);
        }
      }),
    update: (
      id: string,
      updateItem: ((draftItem: T) => T | void) | Partial<T>,
    ) =>
      produceFn((draft) => {
        const index = draft.findIndex((item) => getItemId(item) === id);
        const item = draft[index];

        if (!item) {
          throw new Error(`Item with id ${id} not found`);
        }

        if (isFunction(updateItem)) {
          const updatedItem = updateItem(item);
          if (updatedItem) {
            draft[index] = updatedItem;
          }
        } else {
          updateObject(item, updateItem);
        }
      }),
  };
}
