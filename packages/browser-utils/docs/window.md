[**@ls-stack/browser-utils**](README.md)

***

[@ls-stack/browser-utils](modules.md) / window

# window

## Functions

### isWindowFocused()

```ts
function isWindowFocused(): boolean;
```

Defined in: [window.ts:58](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/window.ts#L58)

Checks if the current browser window/tab is focused and visible.
This combines both the document visibility state and focus state for a comprehensive check.

A window is considered focused when:
- The document visibility state is 'visible' (tab is not hidden)
- The document has focus (window is the active window)

#### Returns

`boolean`

`true` if the window is both visible and focused, `false` otherwise

#### Example

```ts
// Check if we should play sounds or animations
if (isWindowFocused()) {
  playNotificationSound();
} else {
  showBrowserNotification();
}
```

***

### onWindowFocus()

```ts
function onWindowFocus(handler): () => void;
```

Defined in: [window.ts:26](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/window.ts#L26)

Registers a throttled event handler for window focus events.
The handler is triggered when the window gains focus or becomes visible,
but is throttled to prevent excessive calls.

This is useful for performing actions when the user returns to your application,
such as refreshing data, resuming timers, or checking for updates.

#### Parameters

##### handler

() => `void`

The function to call when the window gains focus

#### Returns

A cleanup function to remove the event listeners

```ts
(): void;
```

##### Returns

`void`

#### Example

```ts
// Refresh data when user returns to the app
const cleanup = onWindowFocus(() => {
  console.log('Window focused - refreshing data');
  refreshUserData();
});

// Later, remove the listener
cleanup();
```
