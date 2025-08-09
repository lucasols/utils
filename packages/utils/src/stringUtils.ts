type Arg = string | false | undefined | null;

/**
 * A util to create more legible conditional concatenated strings
 *
 * @param args
 * @example
 * joinStrings('a', 'b', 'c') // 'abc'
 * joinStrings('a', false, 'c') // 'ac'
 * joinStrings('a', addBString ? 'b' : null, 'c') // 'ac' if addBString is false, 'abc' if addBString is true
 */
export function concatStrings(...args: (Arg | Arg[])[]) {
  const strings: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (!arg) continue;

    if (Array.isArray(arg)) {
      strings.push(concatStrings(...arg));
      continue;
    }

    strings.push(arg);
  }

  return strings.join('');
}

/**
 * @deprecated Use {@link concatStrings} instead
 */
export const joinStrings = concatStrings;

export function formatNum(num: number) {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function isSnakeCase(str: string) {
  return /^[a-z0-9_]+$/.test(str);
}

export function convertToSnakeCase(str: string) {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/[^a-z0-9_]/g, '')
    .toLowerCase();
}

export function truncateString(str: string, length: number, ellipsis = '…') {
  if (str.length <= length) return str;

  return str.slice(0, length - 1) + ellipsis;
}
