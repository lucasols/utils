import { throttle } from '#src/utils/throttle';

export function onWindowFocus(handler: () => void) {
  const throttledHandler = throttle(handler, 1000);

  window.addEventListener('focus', throttledHandler);
  window.addEventListener('visibilitychange', throttledHandler);

  return () => {
    window.removeEventListener('focus', throttledHandler);
    window.removeEventListener('visibilitychange', throttledHandler);
  };
}

export function isWindowFocused() {
  return document.visibilityState === 'visible' && document.hasFocus();
}
