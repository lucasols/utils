import {
  ignoreInputTypingEvents,
  keyboardShortcuts,
} from '@ls-stack/browser-utils/keyboardShortcuts';
import { useEffect, useLayoutEffect, useRef } from 'react';

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
    const decoratedCb = ignoreInputTypingEvents({
      current: (e) => callbackRef.current(e),
    });

    const removeKeybindings = keyboardShortcuts(window, {
      [shortcut]:
        allowDuringTyping ?
          (e: KeyboardEvent) => {
            callbackRef.current(e);
          }
        : decoratedCb,
    });

    return () => removeKeybindings();
  }, [shortcut, allowDuringTyping]);
}

export function useShortCuts(
  shortcuts: Record<string, (event: KeyboardEvent) => void>,
  { allowDuringTyping }: { allowDuringTyping?: boolean } = {},
) {
  useEffect(() => {
    const shortcutsCbs: Record<string, (event: KeyboardEvent) => void> = {};

    for (const [shortcut, callback] of Object.entries(shortcuts)) {
      shortcutsCbs[shortcut] =
        allowDuringTyping ?
          (e: KeyboardEvent) => {
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
