import { isObject } from './assertions';

export function yamlStringify(
  obj: unknown,
  {
    maxLineLength = 100,
    showUndefined,
  }: {
    maxLineLength?: number;
    showUndefined?: boolean;
  } = {},
): string {
  if (isObject(obj) || Array.isArray(obj)) {
    return `${stringifyValue(obj, '', maxLineLength, !!showUndefined)}\n`;
  }

  return JSON.stringify(obj) || 'undefined';
}

function stringifyValue(
  value: unknown,
  indent: string,
  maxLineLength: number,
  showUndefined: boolean,
): string {
  let result = '';
  const childIndent = `${indent}  `;

  if (isObject(value)) {
    for (const [key, objVal] of Object.entries(value)) {
      if (objVal === undefined && !showUndefined) {
        continue;
      }

      const valueString = stringifyValue(
        objVal,
        childIndent,
        maxLineLength,
        showUndefined,
      );

      if (Array.isArray(objVal)) {
        const arrayIsSingleLine = valueString.split('\n').length === 1;

        if (arrayIsSingleLine) {
          result += `${indent}${key}: `;
        } else {
          result += `${indent}${key}:\n`;
        }
      } else if (isObject(objVal)) {
        result += `${indent}${key}:\n`;
      } else {
        result += `${indent}${key}: `;
      }

      result += valueString;
      result += '\n';

      if (indent === '' && isObject(objVal)) {
        result += '\n';
      }
    }
  }

  if (Array.isArray(value)) {
    let arrayWasAdded = false;

    if (
      value.length === 0 ||
      value.every(
        (item) =>
          typeof item === 'string' ||
          typeof item === 'number' ||
          typeof item === 'boolean' ||
          item === null ||
          item === undefined,
      )
    ) {
      let line = '';

      line += `[`;

      line += value
        .map((item) => stringifyValue(item, '', maxLineLength, showUndefined))
        .join(', ');

      line += ']';

      if (line.length <= maxLineLength) {
        result += line;
        arrayWasAdded = true;
      }
    }

    if (!arrayWasAdded) {
      for (const item of value) {
        result += `${indent}- `;

        if (Array.isArray(item) || isObject(item)) {
          let arrayString = stringifyValue(
            item,
            childIndent,
            maxLineLength,
            showUndefined,
          );

          const arrayLines = arrayString.split('\n');

          if (arrayLines.length > 1) {
            arrayString = arrayString.trimStart();
          }

          result += arrayString;
        } else {
          result += stringifyValue(
            item,
            childIndent,
            maxLineLength,
            showUndefined,
          );
        }

        result += '\n';
      }
    }
  }

  if (typeof value === 'string') {
    if (value.includes('\n')) {
      const lines = value.split('\n');

      for (const [i, line] of lines.entries()) {
        if (i === 0) {
          if (value.endsWith('\n')) {
            result += `|`;
          } else {
            result += `|-`;
          }

          result += `\n${indent}${line}\n`;
        } else {
          result += `${indent}${line}\n`;
        }
      }
    } else {
      if (value.includes("'")) {
        result += `"${value}"`;
      } else {
        result += `'${value}'`;
      }
    }
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null ||
    value === undefined
  ) {
    result += String(value);
  }

  return result.trimEnd();
}
