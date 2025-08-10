/**
 * Filters the keys of an object based on the provided patterns.
 *
 * Filtering patterns in `rejectKeys` and `filterKeys`:
 * - `'prop'` - Only root-level properties named 'prop'
 * - `'**prop'` - Any property named exactly 'prop' at any level (root or nested)
 * - `'*.prop'` - Any nested property named 'prop' (excludes root-level matches)
 * - `'prop.nested'` - Exact nested property paths like `obj.prop.nested`
 * - `'prop.**nested'` - All nested properties inside root `prop` with name `nested`
 * - `'prop[0]'` - The first item of the `prop` array
 * - `'prop[*]'` - All items of the `prop` array
 * - `'prop[0].nested'` - `nested` prop of the first item of the `prop` array
 * - `'prop[*].nested'` - `nested` prop of all items of the `prop` array
 * - `'prop[*]**nested'` - all `nested` props of all items of the `prop` array
 * - `'prop[0-2]'` - The first three items of the `prop` array
 * - `'prop[4-*]'` - All items of the `prop` array from the fourth index to the end
 * - `'prop[0-2].nested.**prop'` - Combining multiple nested patterns is supported
 * - Root array:
 *   - `'[0]'` - The first item of the root array
 *   - `'[*]'` - All items of the array
 *   - `'[0].nested'` - `nested` prop of the first item of the array
 *   - `'[*].nested'` - `nested` prop of all items of the array
 *   - `'[*]**nested'` - all `nested` props of all items of the array
 *   - `'[0-2]'` - The first three items of the array
 *   - `'[4-*]'` - All items of the array from the fourth index to the end
 *
 * @param objOrArray - The object or array to filter.
 * @param options - The options for the filter.
 * @param options.filterKeys - The keys to filter.
 * @param options.rejectKeys - The keys to reject.
 * @param options.rejectEmptyObjectsInArray - Whether to reject empty objects in arrays (default: true).
 * @returns The filtered object or array.
 */
export function filterObjectOrArrayKeys(
  objOrArray: Record<string, any> | Record<string, any>[],
  {
    filterKeys,
    rejectKeys,
    rejectEmptyObjectsInArray = true,
  }: {
    filterKeys?: string[] | string;
    rejectKeys?: string[] | string;
    rejectEmptyObjectsInArray?: boolean;
  },
): Record<string, any> | Record<string, any>[] {
  return '???';
}
