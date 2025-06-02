import { getCompositeKey } from './getCompositeKey';

/**
 * Returns a stable key for the input value.
 *
 * @param input - The value to get a stable key for.
 * @param maxSortingDepth - The maximum depth to sort the input value. Default is 3.
 * @returns A stable key for the input value.
 *
 * @deprecated Use `getCompositeKey` from `@ls-stack/utils/getCompositeKey` instead.
 */
export const getValueStableKey = getCompositeKey;
