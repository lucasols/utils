import { isObject, isPlainObject } from '@ls-stack/utils/assertions';
import { bytesToHumanReadable } from '@ls-stack/utils/conversions';
import { truncateString } from '@ls-stack/utils/stringUtils';

export function yamlStringify(
  obj: unknown,
  {
    maxLineLength = 100,
    showUndefined,
    maxDepth = 50,
    addRootObjSpaces = 'beforeAndAfter',
  }: {
    maxLineLength?: number;
    showUndefined?: boolean;
    maxDepth?: number;
    addRootObjSpaces?: 'before' | 'after' | 'beforeAndAfter' | false;
  } = {},
): string {
  if (isObject(obj) || Array.isArray(obj) || typeof obj === 'function') {
    return `${stringifyValue(obj, '', maxLineLength, !!showUndefined, maxDepth, 0, addRootObjSpaces)}\n`;
  }

  return JSON.stringify(obj) || 'undefined';
}

function stringifyValue(
  value: unknown,
  indent: string,
  maxLineLength: number,
  showUndefined: boolean,
  maxDepth: number,
  depth: number,
  addObjSpaces: 'before' | 'after' | 'beforeAndAfter' | false,
): string {
  let result = '';
  const childIndent = `${indent}  `;

  if (isPlainObject(value)) {
    if (Object.keys(value).length === 0) {
      return '{}';
    }

    let prevValue: unknown;
    let afterSpaceWasAdded = false;

    for (let [key, objVal] of Object.entries(value)) {
      if (objVal === undefined && !showUndefined) {
        continue;
      }

      if (depth > maxDepth) {
        objVal = `{max depth reached}`;
      }

      const normalizedValue = normalizeValue(objVal);

      if (normalizedValue !== null) {
        objVal = normalizedValue[1];
        key = `${key}{${normalizedValue[0]}}`;
      }

      const valueString = stringifyValue(
        objVal,
        childIndent,
        maxLineLength,
        showUndefined,
        maxDepth,
        depth + 1,
        addObjSpaces,
      );

      if (
        !afterSpaceWasAdded &&
        indent === '' &&
        isObject(objVal) &&
        prevValue &&
        (addObjSpaces === 'before' || addObjSpaces === 'beforeAndAfter')
      ) {
        result += '\n';
      }

      if (Array.isArray(objVal)) {
        const arrayIsSingleLine = valueString.split('\n').length === 1;

        if (arrayIsSingleLine && !valueString.trim().startsWith('-')) {
          result += `${indent}${key}: `;
        } else {
          result += `${indent}${key}:\n`;
        }
      } else if (isObject(objVal)) {
        if (Object.keys(objVal).length === 0) {
          result += `${indent}${key}: `;
        } else {
          result += `${indent}${key}:\n`;
        }
      } else {
        result += `${indent}${key}: `;
      }

      result += valueString;
      result += '\n';

      if (indent === '') {
        if (isObject(objVal)) {
          if (addObjSpaces === 'after' || addObjSpaces === 'beforeAndAfter') {
            result += '\n';
            afterSpaceWasAdded = true;
          } else {
            afterSpaceWasAdded = false;
          }
        }
      }

      prevValue = objVal;
    }

    return result.trimEnd();
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
        .map((item) => {
          let valueToUse = item;

          if (depth > maxDepth) {
            valueToUse = `{max depth reached}`;
          }

          if (typeof valueToUse === 'string' && valueToUse.includes('\n')) {
            valueToUse = valueToUse.replace(/\n/g, '\\n');
          }

          return stringifyValue(
            valueToUse,
            '',
            maxLineLength,
            showUndefined,
            maxDepth,
            depth + 1,
            addObjSpaces,
          );
        })
        .join(', ');

      line += ']';

      if (line.length <= maxLineLength) {
        result += line;
        arrayWasAdded = true;
      }
    }

    if (!arrayWasAdded) {
      for (let item of value) {
        if (depth > maxDepth) {
          item = `{max depth reached}`;
        }

        result += `${indent}- `;

        if (Array.isArray(item) || isObject(item)) {
          let arrayString = stringifyValue(
            item,
            childIndent,
            maxLineLength,
            showUndefined,
            maxDepth,
            depth + 1,
            addObjSpaces,
          );

          arrayString = arrayString.trimStart();

          result += arrayString;
        } else {
          result += stringifyValue(
            item,
            childIndent,
            maxLineLength,
            showUndefined,
            maxDepth,
            depth + 1,
            addObjSpaces,
          );
        }

        result += '\n';
      }
    }

    return result.trimEnd();
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
      if (value.includes("'") && !value.includes('"')) {
        result += `"${value}"`;
      } else if (value.includes('"') && !value.includes("'")) {
        result += `'${value}'`;
      } else if (value.includes("'") && value.includes('"')) {
        result += `"${value.replace(/"/g, '\\"')}"`;
      } else {
        result += `'${value}'`;
      }
    }

    return result.trimEnd();
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null ||
    value === undefined
  ) {
    return String(value).trimEnd();
  }

  const normalizedValue = normalizeValue(value);

  if (normalizedValue !== null) {
    return stringifyValue(
      {
        [`${normalizedValue[0]}#`]: normalizedValue[1],
      },
      indent,
      maxLineLength,
      showUndefined,
      maxDepth,
      depth + 1,
      addObjSpaces,
    );
  }

  return JSON.stringify(value);
}

function normalizeValue(value: unknown): [string, unknown] | null {
  if (value === null || isPlainObject(value) || Array.isArray(value)) {
    return null;
  }

  if (value instanceof Map) {
    const mapEntries = Array.from(value.entries());

    let mapValue: unknown;

    if (mapEntries.every(([key]) => typeof key === 'string')) {
      const mapObjValue: Record<string, unknown> = {};

      for (const [key, val] of mapEntries) {
        mapObjValue[key] = val;
      }

      mapValue = mapObjValue;
    } else {
      mapValue = mapEntries.map(([key, val]) => ({
        key,
        value: val,
      }));
    }

    return ['Map', mapValue];
  }

  if (value instanceof Set) {
    const setValue = Array.from(value);

    return ['Set', setValue];
  }

  if (value instanceof Date) {
    return ['Date', value.toISOString()];
  }

  if (value instanceof RegExp) {
    return ['RegExp', value.toString()];
  }

  if (value instanceof Error) {
    return [
      'Error',
      {
        message: value.message,
        name: value.name,
        stack: value.stack,
      },
    ];
  }

  if (value instanceof File) {
    return [
      'File',
      {
        name: value.name,
        type: value.type,
        lastModified: new Date(value.lastModified).toISOString(),
        size: bytesToHumanReadable(value.size),
      },
    ];
  }

  if (typeof value === 'object') {
    if ('toJSON' in value && typeof value.toJSON === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return [value.constructor.name, value.toJSON()];
    }

    if ('toString' in value && typeof value.toString === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const stringValue = value.toString();

      if (stringValue.toString() !== '[object Object]') {
        return [value.constructor.name, stringValue];
      }
    }

    const objectValue = { ...value };

    const displayValue: Record<string, unknown> = {};
    let addedKeys = 0;

    for (const [key, item] of Object.entries(objectValue)) {
      if (addedKeys > 4) {
        displayValue['...and more properties'] =
          Object.keys(objectValue).length - 4;
        break;
      }

      if (
        typeof item === 'string' ||
        typeof item === 'number' ||
        typeof item === 'boolean' ||
        item === null ||
        item === undefined
      ) {
        displayValue[key] = item;
        addedKeys++;
      }
    }

    return [String(value.constructor.name), displayValue];
  }

  if (typeof value === 'function') {
    const functionString = value.toString();

    return [
      `Function`,
      functionString.includes('\n') ?
        truncateString(functionString.split('\n').join(''), 40)
      : functionString,
    ];
  }

  return null;
}
