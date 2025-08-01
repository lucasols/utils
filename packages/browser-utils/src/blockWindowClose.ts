import { getAutoIncrementId } from '@ls-stack/utils/getAutoIncrementId';
import { createTimeout } from '@ls-stack/utils/timers';

const blockWindowCloseCtxs = new Set<string | number>();

function removeBlockWindowCloseCtx(ctx: string | number) {
  blockWindowCloseCtxs.delete(ctx);

  if (blockWindowCloseCtxs.size === 0) {
    window.onbeforeunload = null;
  }
}

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
