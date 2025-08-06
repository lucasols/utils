/**
 * Configuration options for the dedent function behavior
 */
export interface DedentOptions {
  /**
   * Whether to process escape sequences like \n, \`, \$, and \{
   * When true, allows using escaped characters in template literals
   * @default true for template literals, false for plain strings
   */
  escapeSpecialCharacters?: boolean;
  /**
   * Whether to trim leading and trailing whitespace from the final result
   * @default true
   */
  trimWhitespace?: boolean;
  /**
   * Whether to preserve relative indentation of interpolated multi-line values
   * When true, multi-line interpolations are re-indented to match the surrounding context
   * @default true
   */
  identInterpolations?: boolean;
  /**
   * Whether to display nullish or false values (false, null, undefined) in interpolations
   * When false, nullish or false values are skipped entirely
   * @default false
   */
  showNullishOrFalseValues?: boolean;
}

type InterpolationValue = string | number | boolean | null | undefined;

/**
 * Dedent function interface that can be used both as a template tag and a regular function
 */
export interface Dedent {
  /**
   * Process a plain string to remove common indentation
   */
  (literals: string): string;
  /**
   * Process a template literal to remove common indentation while handling interpolations
   */
  (strings: TemplateStringsArray, ...values: InterpolationValue[]): string;
  /**
   * Create a new dedent function with custom options
   */
  withOptions: CreateDedent;
}

/**
 * Factory function type for creating dedent functions with custom options
 */
export type CreateDedent = (options: DedentOptions) => Dedent;

/**
 * Remove common leading indentation from multi-line strings while preserving relative indentation.
 * Can be used as a tagged template literal or called with a plain string.
 *
 * By default, it will dedent interpolated multi-line strings to match the surrounding context.
 * And it will not show falsy values.
 *
 * @example
 * ```typescript
 * const text = dedent`
 *   function hello() {
 *     console.log('world');
 *   }
 * `;
 * // Result:
 * "function hello() {
 *   console.log('world');
 * }"
 * ```
 */
export const dedent: Dedent = createDedent({
  identInterpolations: true,
});

function createDedent(options: DedentOptions): Dedent {
  d.withOptions = (newOptions: DedentOptions): Dedent =>
    createDedent({ ...options, ...newOptions });

  return d;

  function d(literals: string): string;
  function d(
    strings: TemplateStringsArray,
    ...values: InterpolationValue[]
  ): string;
  function d(
    strings: TemplateStringsArray | string,
    ...values: InterpolationValue[]
  ) {
    const raw = typeof strings === 'string' ? [strings] : strings.raw;
    const {
      escapeSpecialCharacters = Array.isArray(strings),
      trimWhitespace = true,
      identInterpolations = true,
      showNullishOrFalseValues = false,
    } = options;

    // first, perform interpolation
    let result = '';
    for (let i = 0; i < raw.length; i++) {
      let next = raw[i];

      if (escapeSpecialCharacters) {
        // handle escaped newlines, backticks, and interpolation characters
        next = next!
          .replace(/\\\n[ \t]*/g, '')
          .replace(/\\`/g, '`')
          .replace(/\\\$/g, '$')
          .replace(/\\\{/g, '{');
      }

      result += next;

      if (i < values.length) {
        let val = values[i];

        if (
          !showNullishOrFalseValues &&
          (val === false || val === null || val === undefined)
        ) {
          continue;
        }

        val = String(val);

        // Apply recursive dedent to string values if enabled
        if (identInterpolations && val.includes('\n')) {
          let withIdent = val;

          // Find the indentation level where this value is being inserted
          const currentIndent = getCurrentIndent(result);
          if (currentIndent && withIdent) {
            // Re-indent each line of the interpolated value
            const lines = withIdent.split('\n');
            withIdent = lines
              .map((line: string, index: number) => {
                // Don't indent the first line (it continues the current line)
                // Don't indent empty lines
                return index === 0 || line === '' ? line : currentIndent + line;
              })
              .join('\n');
          }

          result += withIdent;
        } else {
          result += val;
        }
      }
    }

    // now strip indentation
    const lines = result.split('\n');
    let mindent: null | number = null;
    for (const l of lines) {
      const m = l.match(/^(\s+)\S+/);
      if (m) {
        const indent = m[1]!.length;
        if (!mindent) {
          // this is the first indented line
          mindent = indent;
        } else {
          mindent = Math.min(mindent, indent);
        }
      }
    }

    if (mindent !== null) {
      const m = mindent; // appease TypeScript
      result = lines
        // https://github.com/typescript-eslint/typescript-eslint/issues/7140
        .map((l) => (l[0] === ' ' || l[0] === '\t' ? l.slice(m) : l))
        .join('\n');
    }

    // dedent eats leading and trailing whitespace too
    if (trimWhitespace) {
      result = result.trim();
    }

    // handle escaped newlines at the end to ensure they don't get stripped too
    if (escapeSpecialCharacters) {
      result = result.replace(/\\n/g, '\n');
    }

    return result;
  }
}

function getCurrentIndent(str: string): string {
  // Find the indentation of the current line (the last line in the string)
  const lines = str.split('\n');
  const lastLine = lines[lines.length - 1];
  if (!lastLine) return '';
  const match = lastLine.match(/^(\s*)/);
  return match ? match[1]! : '';
}
