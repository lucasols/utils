type Arg = string | false | undefined | null;

/**
 * A util to create more legible conditional concatenated strings
 *
 * @example
 *   joinStrings('a', 'b', 'c'); // 'abc'
 *   joinStrings('a', false, 'c'); // 'ac'
 *   joinStrings('a', addBString ? 'b' : null, 'c'); // 'ac' if addBString is false, 'abc' if addBString is true
 *
 * @param args
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

/** @deprecated Use {@link concatStrings} instead */
export const joinStrings = concatStrings;

export function formatNum(
  num: number,
  maxDecimalsOrOptions: number | Intl.NumberFormatOptions = 2,
) {
  const options =
    typeof maxDecimalsOrOptions === 'number' ?
      {
        maximumFractionDigits: maxDecimalsOrOptions,
      }
    : maxDecimalsOrOptions;

  return num.toLocaleString('en-US', options);
}

/** Check if a string is `snake_case` */
export function isSnakeCase(str: string) {
  return /^[a-z0-9_]+$/.test(str);
}

/** Check if a string is `kebab-case` */
export function isKebabCase(str: string) {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
}

/** Check if a string is `PascalCase` */
export function isPascalCase(str: string) {
  return /^[A-Z][a-zA-Z0-9]*$/.test(str);
}

/** Check if a string is `camelCase` */
export function isCamelCase(str: string) {
  return /^[a-z][a-zA-Z0-9]*$/.test(str);
}

/** Check if a string is `Title Case` */
export function isTitleCase(str: string) {
  return /^[A-Z][a-z0-9]*( ([A-Z][a-z0-9]*|[0-9]+))*$/.test(str);
}

/** Check if a string is `Sentence Case` */
export function isSentenceCase(str: string) {
  return /^[A-Z][a-z0-9]*( [a-z0-9]+)*$/.test(str);
}

/** Check if a string is `CONSTANT_CASE` */
export function isConstantCase(str: string) {
  return /^[A-Z_][A-Z0-9_]*$/.test(str);
}

/** Check if a string is `dot.case` */
export function isDotCase(str: string) {
  return /^[a-z0-9]+(\.[a-z0-9]+)*$/.test(str);
}

/** Check if a string is `path/case` */
export function isPathCase(str: string) {
  return /^[a-z0-9]+(\/[a-z0-9]+)*$/.test(str);
}

/** Convert a string to `kebab-case` */
export function convertToKebabCase(str: string) {
  return convertToSnakeCase(str).replace(/_/g, '-');
}

/** Convert a string to `snake_case` */
export function convertToSnakeCase(str: string) {
  return str
    .replace(/[\s\-.]+/g, '_') // Convert spaces, dashes, dots to underscores
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2') // Add underscore between lowercase and uppercase
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2') // Add underscore between consecutive caps
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '') // Remove non-alphanumeric except underscores
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
    .replace(/_+/g, '_'); // Collapse multiple underscores
}

/** Convert a string to `PascalCase` */
export function convertToPascalCase(str: string) {
  return str
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/** Convert a string to `camelCase` */
export function convertToCamelCase(str: string) {
  const pascalCase = convertToPascalCase(str);
  return pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);
}

/** Convert a string to `Sentence Case` */
export function convertToSentenceCase(str: string) {
  return str
    .replace(/[\s\-.]+/g, ' ') // Convert spaces, dashes, dots to spaces
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Add space between consecutive caps
    .split(/[\s_-]+/)
    .map((word) => word.toLowerCase())
    .join(' ')
    .replace(/^\w/, (char) => char.toUpperCase());
}

/** Convert a string to `Title Case` */
export function convertToTitleCase(str: string) {
  return str
    .replace(/[\s\-.]+/g, ' ') // Convert spaces, dashes, dots to spaces
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Add space between consecutive caps
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/** Convert a string to `CONSTANT_CASE` */
export function convertToConstantCase(str: string) {
  return convertToSnakeCase(str).toUpperCase();
}

/** Convert a string to `dot.case` */
export function convertToDotCase(str: string) {
  return convertToSnakeCase(str).replace(/_/g, '.');
}

/** Convert a string to `path/case` */
export function convertToPathCase(str: string) {
  return convertToSnakeCase(str).replace(/_/g, '/');
}

export function truncateString(str: string, length: number, ellipsis = '…') {
  if (str.length <= length) return str;

  return str.slice(0, length - 1) + ellipsis;
}

export function removeANSIColors(str: string) {
  // eslint-disable-next-line no-control-regex -- valid usage of control character
  return str.replace(/\u001b\[\d+m/g, '');
}
