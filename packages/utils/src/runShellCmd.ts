/**
 * @deprecated This utility has been moved to @ls-stack/node-utils.
 * Please update your imports:
 * ```
 * // Old (deprecated)
 * import { runCmd } from '@ls-stack/utils/runShellCmd';
 * 
 * // New (preferred)
 * import { runCmd } from '@ls-stack/node-utils/runShellCmd';
 * ```
 */

/* eslint-disable no-console */

let hasWarned = false;

function showDeprecationWarning() {
  if (!hasWarned) {
    hasWarned = true;
    console.warn(
      '⚠️  DEPRECATION WARNING: runShellCmd utilities have been moved to @ls-stack/node-utils.\n' +
      '   Please update your imports:\n' +
      '   - Old: import { runCmd } from \'@ls-stack/utils/runShellCmd\';\n' +
      '   - New: import { runCmd } from \'@ls-stack/node-utils/runShellCmd\';\n' +
      '   This backward compatibility will be removed in a future version.'
    );
  }
}

export * from '@ls-stack/node-utils/runShellCmd';

// Re-export with deprecation warning
export { 
  runCmd as _runCmd,
  concurrentCmd as _concurrentCmd,
  runCmdUnwrap as _runCmdUnwrap,
  runCmdSilent as _runCmdSilent,
  runCmdSilentUnwrap as _runCmdSilentUnwrap
} from '@ls-stack/node-utils/runShellCmd';

export const runCmd = (...args: Parameters<typeof import('@ls-stack/node-utils/runShellCmd').runCmd>) => {
  showDeprecationWarning();
  return import('@ls-stack/node-utils/runShellCmd').then(m => m.runCmd(...args));
};

export const concurrentCmd = (...args: Parameters<typeof import('@ls-stack/node-utils/runShellCmd').concurrentCmd>) => {
  showDeprecationWarning();
  return import('@ls-stack/node-utils/runShellCmd').then(m => m.concurrentCmd(...args));
};

export const runCmdUnwrap = (...args: Parameters<typeof import('@ls-stack/node-utils/runShellCmd').runCmdUnwrap>) => {
  showDeprecationWarning();
  return import('@ls-stack/node-utils/runShellCmd').then(m => m.runCmdUnwrap(...args));
};

export const runCmdSilent = (...args: Parameters<typeof import('@ls-stack/node-utils/runShellCmd').runCmdSilent>) => {
  showDeprecationWarning();
  return import('@ls-stack/node-utils/runShellCmd').then(m => m.runCmdSilent(...args));
};

export const runCmdSilentUnwrap = (...args: Parameters<typeof import('@ls-stack/node-utils/runShellCmd').runCmdSilentUnwrap>) => {
  showDeprecationWarning();
  return import('@ls-stack/node-utils/runShellCmd').then(m => m.runCmdSilentUnwrap(...args));
};