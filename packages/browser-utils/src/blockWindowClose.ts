import { getAutoIncrementId } from '@ls-stack/utils/getAutoIncrementId';
import { createTimeout } from '@ls-stack/utils/timers';

const blockWindowCloseCtxs = new Set<string | number>();

function removeBlockWindowCloseCtx(ctx: string | number) {
  blockWindowCloseCtxs.delete(ctx);

  if (blockWindowCloseCtxs.size === 0) {
    window.onbeforeunload = null;
  }
}

/**
 * Blocks the browser window from closing by setting up a beforeunload handler.
 * This is useful for protecting users from accidentally losing unsaved work.
 *
 * The function supports multiple simultaneous blocks using contexts, and only removes
 * the beforeunload handler when all blocks are removed. It also includes development-time
 * warnings to help detect memory leaks from undisposed blocks.
 *
 * **Important:** This should be used sparingly and only when necessary, as it can
 * negatively impact user experience. Always ensure blocks are properly disposed of.
 *
 * @param ctx - Unique context identifier for this block. If not provided, an auto-increment ID is used
 * @param devTimeoutWarning - Time in milliseconds after which to show a development warning (default: 120,000ms / 2 minutes)
 * @returns An object with `unblock` method and `Symbol.dispose` for cleanup
 *
 * @example
 * ```ts
 * // Basic usage - block window close during form editing
 * const blocker = blockWindowClose();
 *
 * // Later, when form is saved or user cancels
 * blocker.unblock();
 * ```
 */
export function blockWindowClose(
  ctx: string | number = getAutoIncrementId(),
  devTimeoutWarning = 120_000,
): { unblock: VoidFunction; [Symbol.dispose]: () => void } {
  blockWindowCloseCtxs.add(ctx);
  window.onbeforeunload = () => true;
  let cleanTimeout: VoidFunction | null = null;

  if (process.env.NODE_ENV === 'development') {
    const error = new Error('Blocking window close not disposed');
    cleanTimeout = createTimeout(devTimeoutWarning, () => {
      console.error(error);
      alert('There is probably a not disposed window close, check the console');
    });
  }

  function unblockWindowClose() {
    cleanTimeout?.();
    removeBlockWindowCloseCtx(ctx);
  }

  return {
    unblock: () => {
      unblockWindowClose();
    },
    [Symbol.dispose]: () => {
      unblockWindowClose();
    },
  };
}
