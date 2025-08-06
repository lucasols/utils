export interface DedentOptions {
  escapeSpecialCharacters?: boolean;
  trimWhitespace?: boolean;
  identInterpolations?: boolean;
  showFalsyValues?: boolean;
}

export interface Dedent {
  (literals: string): string;
  (
    strings: TemplateStringsArray,
    ...values: (string | number | boolean | null | undefined)[]
  ): string;
  withOptions: CreateDedent;
}

export type CreateDedent = (options: DedentOptions) => Dedent;

export const dedent: Dedent = createDedent({
  identInterpolations: true,
});

function createDedent(options: DedentOptions): Dedent {
  d.withOptions = (newOptions: DedentOptions): Dedent =>
    createDedent({ ...options, ...newOptions });

  return d;

  function d(literals: string): string;
  function d(strings: TemplateStringsArray, ...values: unknown[]): string;
  function d(strings: TemplateStringsArray | string, ...values: unknown[]) {
    const raw = typeof strings === 'string' ? [strings] : strings.raw;
    const {
      escapeSpecialCharacters = Array.isArray(strings),
      trimWhitespace = true,
      identInterpolations = true,
      showFalsyValues = false,
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
        if (!showFalsyValues && !values[i]) {
          continue;
        }

        const val = String(values[i]);

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
