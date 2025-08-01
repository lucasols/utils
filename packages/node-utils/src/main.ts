/**
 * @deprecated This package is for Node.js-specific utilities only.
 * Import utilities directly instead: import { runCmd } from '@ls-stack/node-utils/runShellCmd'
 */
export function deprecated() {
  throw new Error(
    'This package does not export a main module. Import utilities directly instead: import { runCmd } from \'@ls-stack/node-utils/runShellCmd\'',
  );
}