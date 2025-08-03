[**@ls-stack/browser-utils**](README.md)

***

[@ls-stack/browser-utils](modules.md) / blockWindowClose

# blockWindowClose

## Functions

### blockWindowClose()

```ts
function blockWindowClose(ctx, devTimeoutWarning): object;
```

Defined in: [blockWindowClose.ts:38](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/blockWindowClose.ts#L38)

Blocks the browser window from closing by setting up a beforeunload handler.
This is useful for protecting users from accidentally losing unsaved work.

The function supports multiple simultaneous blocks using contexts, and only removes
the beforeunload handler when all blocks are removed. It also includes development-time
warnings to help detect memory leaks from undisposed blocks.

**Important:** This should be used sparingly and only when necessary, as it can
negatively impact user experience. Always ensure blocks are properly disposed of.

#### Parameters

##### ctx

Unique context identifier for this block. If not provided, an auto-increment ID is used

`string` | `number`

##### devTimeoutWarning

`number` = `120_000`

Time in milliseconds after which to show a development warning (default: 120,000ms / 2 minutes)

#### Returns

`object`

An object with `unblock` method and `Symbol.dispose` for cleanup

##### \[dispose\]()

```ts
[dispose]: () => void;
```

###### Returns

`void`

##### unblock

```ts
unblock: VoidFunction;
```

#### Example

```ts
// Basic usage - block window close during form editing
const blocker = blockWindowClose();

// Later, when form is saved or user cancels
blocker.unblock();
```
