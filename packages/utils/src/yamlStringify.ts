/**
 * @deprecated This utility has been moved to @ls-stack/browser-utils.
 * Please update your imports:
 * ```
 * // Old (deprecated)
 * import { yamlStringify } from '@ls-stack/utils/yamlStringify';
 * 
 * // New (preferred)
 * import { yamlStringify } from '@ls-stack/browser-utils/yamlStringify';
 * ```
 */

/* eslint-disable no-console */

let hasWarned = false;

function showDeprecationWarning() {
  if (!hasWarned) {
    hasWarned = true;
    console.warn(
      '⚠️  DEPRECATION WARNING: yamlStringify utility has been moved to @ls-stack/browser-utils.\n' +
      '   Please update your imports:\n' +
      '   - Old: import { yamlStringify } from \'@ls-stack/utils/yamlStringify\';\n' +
      '   - New: import { yamlStringify } from \'@ls-stack/browser-utils/yamlStringify\';\n' +
      '   This backward compatibility will be removed in a future version.'
    );
  }
}

export * from '@ls-stack/browser-utils/yamlStringify';

// Re-export with deprecation warning
export { 
  yamlStringify as _yamlStringify
} from '@ls-stack/browser-utils/yamlStringify';

export const yamlStringify = (...args: Parameters<typeof import('@ls-stack/browser-utils/yamlStringify').yamlStringify>) => {
  showDeprecationWarning();
  return import('@ls-stack/browser-utils/yamlStringify').then(m => m.yamlStringify(...args));
};