import {
  ignoreInputTypingEvents,
  keyboardShortcuts,
} from '@ls-stack/browser-utils/keyboardShortcuts';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLatestValue } from './useLatestValue';

export function useShortCut(
  shortcut: string,
  callback: (event: KeyboardEvent) => void,
  { allowDuringTyping }: { allowDuringTyping?: boolean } = {},
) {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const decoratedCb = ignoreInputTypingEvents(callbackRef);

    const removeKeybindings = keyboardShortcuts(window, {
      [shortcut]:
        allowDuringTyping ?
          (e) => {
            callbackRef.current(e);
          }
        : decoratedCb,
    });

    return () => removeKeybindings();
    // eslint-disable-next-line @ls-stack/exhaustive-deps -- will be fixed later
  }, []);
}

export function useShortCuts(
  shortcuts: Record<string, (event: KeyboardEvent) => void>,
  { allowDuringTyping }: { allowDuringTyping?: boolean } = {},
) {
  const latestShortCuts = useLatestValue(shortcuts);

  useEffect(() => {
    const shortcutsCbs: Record<string, (event: KeyboardEvent) => void> = {};

    for (const [shortcut, callback] of Object.entries(
      latestShortCuts.insideEffect,
    )) {
      shortcutsCbs[shortcut] =
        allowDuringTyping ?
          (e) => {
            callback(e);
          }
        : ignoreInputTypingEvents(callback);
    }

    return keyboardShortcuts(window, shortcutsCbs);
  });
}

export function preventShortcutDefault(
  callback: (event: KeyboardEvent) => void,
) {
  return (e: KeyboardEvent) => {
    e.preventDefault();
    callback(e);
  };
}
