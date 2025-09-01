import { useOnEvtmitterEvent } from '@evtmitter/react';
import type { __LEGIT_ANY__ } from '@ls-stack/utils/saferTyping';
import type { Emitter } from 'evtmitter';
import { evtmitter } from 'evtmitter';
import { useMemo } from 'react';
import { useConst } from './useConst';

type SendEvent<E extends Record<string, unknown>> = <T extends keyof E>(
  event: T,
  ...args: E[T] extends undefined ? [] : [payload: E[T]]
) => void;

/**
 * Creates an event system for component communication. Returns an emitter for binding
 * and a type safe send function for emitting events.
 *
 * @example
 * ```tsx
 * type Events = { userAction: { id: string }; error: string };
 * const { bind, send } = useSendComponentEvents<Events>();
 *
 * // In child component
 * useComponentEvents(bind, {
 *   userAction: (payload) => console.log(payload.id),
 *   error: (message) => console.error(message)
 * });
 *
 * // Emit events
 * send('userAction', { id: '123' });
 * send('error', 'Something went wrong');
 * ```
 */
export function useSendComponentEvents<E extends Record<string, unknown>>(): {
  bind: Emitter<E>;
  send: SendEvent<E>;
} {
  const emitter = useConst(() => evtmitter<E>());

  return useMemo(() => {
    const send: SendEvent<E> = (event, ...args) => {
      emitter.emit(event, args[0] as __LEGIT_ANY__);
    };

    return { bind: emitter, send };
  }, [emitter]);
}

/**
 * Subscribes to events from an emitter and calls appropriate callbacks when events are emitted.
 * Automatically handles cleanup when the component unmounts.
 *
 * @param emitter - The event emitter to listen to, typically from useSendComponentEvents
 * @param callback - Object mapping event names to their callback functions
 */
export function useComponentEvents<E extends Record<string, unknown>>(
  emitter: Emitter<E> | undefined,
  callback: { [T in keyof E]: (payload: E[T]) => void },
) {
  useOnEvtmitterEvent(emitter, '*', ({ payload, type }) => {
    callback[type](payload);
  });
}
