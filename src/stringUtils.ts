type Arg = string | false | undefined | null;

/**
 * A util to create more legible conditional concatenated strings
 *
 * @example
 * joinStrings('a', 'b', 'c') // 'abc'
 * joinStrings('a', false, 'c') // 'ac'
 * joinStrings('a', addBString ? 'b' : null, 'c') // 'ac' if addBString is false, 'abc' if addBString is true
 */
export function joinStrings(...args: (Arg | Arg[])[]) {
  const strings: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (!arg) continue;

    if (Array.isArray(arg)) {
      strings.push(joinStrings(...arg));
      continue;
    }

    strings.push(arg);
  }

  return strings.join('');
}

// fork of https://github.com/dmnd/dedent
export function dedent(strings: string): string;
export function dedent(
  strings: TemplateStringsArray,
  ...values: string[]
): string;
export function dedent(
  strings: TemplateStringsArray | string,
  ...values: string[]
) {
  // $FlowFixMe: Flow doesn't undestand .raw
  const raw = typeof strings === 'string' ? [strings] : strings.raw;

  // first, perform interpolation
  let result = '';
  for (let i = 0; i < raw.length; i++) {
    result += raw[i]! // join lines when there is a suppressed newline
      .replace(/\\\n[ \t]*/g, '')
      // handle escaped backticks
      .replace(/\\`/g, '`');

    if (i < values.length) {
      result += values[i];
    }
  }

  // now strip indentation
  const lines = result.split('\n');
  let mindent: number | null = null;
  lines.forEach((l) => {
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
  });

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (mindent !== null) {
    const m = mindent; // appease Flow
    result = lines.map((l) => (l.startsWith(' ') ? l.slice(m) : l)).join('\n');
  }

  return (
    result
      // dedent eats leading and trailing whitespace too
      .trim()
      // handle escaped newlines at the end to ensure they don't get stripped too
      .replace(/\\n/g, '\n')
  );
}

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
