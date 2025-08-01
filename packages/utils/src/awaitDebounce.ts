import { getCompositeKey } from './getCompositeKey';
import type { __LEGIT_ANY__ } from './saferTyping';

const resolvers: Record<
  string,
  undefined | ((value: 'continue' | 'skip') => void)
> = {};
const debouncers: Record<string, ReturnType<typeof setTimeout> | undefined> =
  {};

/**
 * Creates an awaitable debounce mechanism that allows you to debounce async operations.
 * When called multiple times with the same `callId`, only the last call will resolve with 'continue',
 * while all previous calls resolve with 'skip'.
 *
 * This is useful for debouncing API calls, search operations, or any async work where you want
 * to ensure only the most recent request is processed.
 *
 * @param options - Configuration object
 * @param options.callId - Unique identifier for the debounce group. Calls with the same ID are debounced together
 * @param options.debounce - Debounce delay in milliseconds
 * @returns Promise that resolves to 'continue' if this call should proceed, or 'skip' if it was superseded
 *
 * @example
 * ```ts
 * async function searchUsers(query: string) {
 *   const result = await awaitDebounce({ callId: 'search', debounce: 300 });
 *   if (result === 'skip') return; // This search was superseded
 *
 *   // Only the most recent search will reach here
 *   const users = await fetchUsers(query);
 *   updateUI(users);
 * }
 *
 * // Called rapidly - only the last call will execute
 * searchUsers('a');
 * searchUsers('ab');
 * searchUsers('abc'); // Only this one will continue
 * ```
 */
export async function awaitDebounce({
  callId: _callId,
  debounce,
}: {
  callId: __LEGIT_ANY__;
  debounce: number;
}): Promise<'continue' | 'skip'> {
  const callId = getCompositeKey(_callId);

  if (debouncers[callId]) clearTimeout(debouncers[callId]);

  debouncers[callId] = globalThis.setTimeout(() => {
    const resolve = resolvers[callId];
    resolvers[callId] = undefined;
    resolve?.('continue');
  }, debounce);

  if (resolvers[callId]) resolvers[callId]('skip');

  return new Promise((resolve) => {
    resolvers[callId] = resolve;
  });
}
