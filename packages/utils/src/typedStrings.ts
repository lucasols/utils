/**
 * A type representing a string that contains a specific substring. Uses
 * template literal types to ensure type safety at compile time.
 *
 * @example
 *   ```ts
 *   type EmailString = StringContaining<'@'>; // string that contains '@'
 *   const email: EmailString = 'user@example.com'; // ✓ valid
 *   ```;
 *
 * @template T - The substring that must be contained within the string
 */
export type StringContaining<T extends string> =
  string extends T ? never : `${string}${T}${string}`;

/**
 * A type representing a string that starts with a specific substring. Uses
 * template literal types to ensure the string begins with the specified
 * prefix.
 *
 * @example
 *   ```ts
 *   type HttpUrl = StringStartingWith<'http'>; // string starting with 'http'
 *   const url: HttpUrl = 'https://example.com'; // ✓ valid
 *   ```;
 *
 * @template T - The substring that the string must start with
 */
export type StringStartingWith<T extends string> =
  string extends T ? never : `${T}${string}`;

/**
 * A type representing a string that ends with a specific substring. Uses
 * template literal types to ensure the string ends with the specified suffix.
 *
 * @example
 *   ```ts
 *   type JavaFile = StringEndingWith<'.java'>; // string ending with '.java'
 *   const filename: JavaFile = 'HelloWorld.java'; // ✓ valid
 *   ```;
 *
 * @template T - The substring that the string must end with
 */
export type StringEndingWith<T extends string> =
  string extends T ? never : `${string}${T}`;

/**
 * Type guard function that checks if a string contains a specific substring.
 * Narrows the type to `StringContaining<T>` when the check passes.
 *
 * @param str - The string to check
 * @param substring - The substring to search for
 * @returns `true` if the string contains the substring, `false` otherwise
 */
export function stringContains<T extends string>(
  str: string,
  substring: T,
): str is StringContaining<T> {
  return str.includes(substring);
}

/**
 * Type guard function that checks if a string starts with a specific substring.
 * Narrows the type to `StringStartingWith<T>` when the check passes.
 *
 * @param str - The string to check
 * @param substring - The substring to check for at the beginning
 * @returns `true` if the string starts with the substring, `false` otherwise
 */
export function stringStartsWith<T extends string>(
  str: string,
  substring: T,
): str is StringStartingWith<T> {
  return str.startsWith(substring);
}

/**
 * Type guard function that checks if a string ends with a specific substring.
 * Narrows the type to `StringEndingWith<T>` when the check passes.
 *
 * @param str - The string to check
 * @param substring - The substring to check for at the end
 * @returns `true` if the string ends with the substring, `false` otherwise
 */
export function stringEndsWith<T extends string>(
  str: string,
  substring: T,
): str is StringEndingWith<T> {
  return str.endsWith(substring);
}

/**
 * Splits a typed string by a separator that is guaranteed to exist in the
 * string. Returns an array with at least two elements: the parts before and
 * after the first separator, plus any additional parts if there are multiple
 * separators.
 *
 * @example
 *   ```ts
 *   const path: StringContaining<'/'> = 'src/utils/types.ts';
 *   const [first, second, ...rest] = splitTypedString(path, '/');
 *   // first: 'src', second: 'utils', rest: ['types.ts']
 *   ```;
 *
 * @param str - A string that contains, starts with, or ends with the separator
 * @param separator - The separator to split by
 * @returns An array with at least two string elements
 */
export function splitTypedString<T extends string>(
  str:
    | StringContaining<NoInfer<T>>
    | StringStartingWith<NoInfer<T>>
    | StringEndingWith<NoInfer<T>>,
  separator: T,
): [string, string, ...string[]] {
  return str.split(separator) as [string, string, ...string[]];
}

/**
 * Splits a typed string at a specific occurrence of the separator. Unlike
 * `splitTypedString`, this returns exactly two parts: everything before the nth
 * separator and everything after it.
 *
 * @example
 *   ```ts
 *   const path: StringContaining<'.'> = 'file.name.ext';
 *   const [name, ext] = splitTypedStringAt(path, '.', 2);
 *   // name: 'file.name', ext: 'ext'
 *   ```;
 *
 * @param str - A string that contains, starts with, or ends with the separator
 * @param separator - The separator to split by
 * @param splitAtNSeparatorPos - The position of the separator to split at
 *   (1-based)
 * @returns A tuple with exactly two string elements
 */
export function splitTypedStringAt<T extends string>(
  str:
    | StringContaining<NoInfer<T>>
    | StringStartingWith<NoInfer<T>>
    | StringEndingWith<NoInfer<T>>,
  separator: T,
  /**
   * The position of the separator to split at.
   *
   * @default 1 - split at the first separator
   */
  splitAtNSeparatorPos = 1,
): [string, string] {
  const parts = str.split(separator);

  let leftPart = parts[0];
  let rightPart = parts.slice(1).join(separator);

  if (leftPart === undefined) {
    throw new Error('String does not contain the separator');
  }

  if (splitAtNSeparatorPos > 1) {
    leftPart = parts.slice(0, splitAtNSeparatorPos).join(separator);
    rightPart = parts.slice(splitAtNSeparatorPos).join(separator);
  }

  return [leftPart, rightPart];
}

/**
 * A branded type representing a string that is guaranteed to be non-empty
 * (length > 0). This type provides compile-time safety by preventing empty
 * strings from being assigned without proper validation.
 *
 * @example
 *   ```ts
 *   function processName(name: NonEmptyString) {
 *     // name is guaranteed to be non-empty
 *     return name.toUpperCase();
 *   }
 *   ```;
 */
export type NonEmptyString = string & {
  __nonEmptyString: true;
};

/**
 * Type guard function that checks if a string is non-empty. Narrows the type to
 * `NonEmptyString` when the check passes.
 *
 * @param str - The string to check
 * @returns `true` if the string has length > 0, `false` otherwise
 */
export function isNonEmptyString(str: string): str is NonEmptyString {
  return str.length > 0;
}

/**
 * Converts a string to `NonEmptyString` or throws an error if the string is
 * empty. Use this when you need to ensure a string is non-empty and want to
 * fail fast.
 *
 * @param str - The string to convert
 * @returns The string as `NonEmptyString`
 * @throws Error if the string is empty
 */
export function asNonEmptyStringOrThrow(str: string): NonEmptyString {
  if (isNonEmptyString(str)) {
    return str;
  }
  throw new Error('String is empty');
}

/**
 * Converts a string to `NonEmptyString` or returns `null` if the string is
 * empty. Use this when empty strings should be handled gracefully rather than
 * throwing errors.
 *
 * @param str - The string to convert
 * @returns The string as `NonEmptyString` or `null` if empty
 */
export function asNonEmptyStringOrNull(str: string): NonEmptyString | null {
  if (isNonEmptyString(str)) {
    return str;
  }
  return null;
}

/**
 * Assertion function that ensures a string is non-empty. Throws an error if the
 * string is empty, otherwise narrows the type to `NonEmptyString`.
 *
 * @param str - The string to assert as non-empty
 * @throws Error if the string is empty
 */
export function assertStringIsNonEmpty(
  str: string,
): asserts str is NonEmptyString {
  if (!isNonEmptyString(str)) {
    throw new Error('String is empty');
  }
}
