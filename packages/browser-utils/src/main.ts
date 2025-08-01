/**
 * @deprecated This package is for browser-specific utilities only.
 * Import utilities directly instead: import { yamlStringify } from '@ls-stack/browser-utils/yamlStringify'
 */
export function deprecated() {
  throw new Error(
    'This package does not export a main module. Import utilities directly instead: import { yamlStringify } from \'@ls-stack/browser-utils/yamlStringify\'',
  );
}