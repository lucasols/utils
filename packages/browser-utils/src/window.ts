import { throttle } from '@ls-stack/utils/throttle';

/**
 * Registers a throttled event handler for window focus events.
 * The handler is triggered when the window gains focus or becomes visible,
 * but is throttled to prevent excessive calls.
 * 
 * This is useful for performing actions when the user returns to your application,
 * such as refreshing data, resuming timers, or checking for updates.
 * 
 * @param handler - The function to call when the window gains focus
 * @returns A cleanup function to remove the event listeners
 * 
 * @example
 * ```ts
 * // Refresh data when user returns to the app
 * const cleanup = onWindowFocus(() => {
 *   console.log('Window focused - refreshing data');
 *   refreshUserData();
 * });
 * 
 * // Later, remove the listener
 * cleanup();
 * ```
 */
export function onWindowFocus(handler: () => void): () => void {
  const throttledHandler = throttle(handler, 1000);

  window.addEventListener('focus', throttledHandler);
  window.addEventListener('visibilitychange', throttledHandler);

  return () => {
    window.removeEventListener('focus', throttledHandler);
    window.removeEventListener('visibilitychange', throttledHandler);
  };
}

/**
 * Checks if the current browser window/tab is focused and visible.
 * This combines both the document visibility state and focus state for a comprehensive check.
 * 
 * A window is considered focused when:
 * - The document visibility state is 'visible' (tab is not hidden)
 * - The document has focus (window is the active window)
 * 
 * @returns `true` if the window is both visible and focused, `false` otherwise
 * 
 * @example
 * ```ts
 * // Check if we should play sounds or animations
 * if (isWindowFocused()) {
 *   playNotificationSound();
 * } else {
 *   showBrowserNotification();
 * }
 * ```
 */
export function isWindowFocused(): boolean {
  return document.visibilityState === 'visible' && document.hasFocus();
}
