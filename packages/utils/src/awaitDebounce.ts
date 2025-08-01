import { getCompositeKey } from './getCompositeKey';
import type { __LEGIT_ANY__ } from './saferTyping';

const resolvers: Record<
  string,
  undefined | ((value: 'continue' | 'skip') => void)
> = {};
const debouncers: Record<string, number | undefined> = {};

export async function awaitDebouce({
  callId: _callId,
  debounce,
}: {
  callId: __LEGIT_ANY__;
  debounce: number;
}): Promise<'continue' | 'skip'> {
  const callId = getCompositeKey(_callId);

  if (debouncers[callId]) clearTimeout(debouncers[callId]);

  debouncers[callId] = window.setTimeout(() => {
    const resolve = resolvers[callId];
    resolvers[callId] = undefined;
    resolve?.('continue');
  }, debounce);

  if (resolvers[callId]) resolvers[callId]('skip');

  return new Promise((resolve) => {
    resolvers[callId] = resolve;
  });
}
