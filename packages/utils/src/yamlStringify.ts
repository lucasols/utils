import { bytesToHumanReadable } from './conversions';
import { truncateString } from './stringUtils';
import { isObject, isPlainObject } from './typeGuards';

export type YamlStringifyOptions = {
  /* max line length before splitting array and object values into multiple lines */
  maxLineLength?: number;
  /* show undefined values */
  showUndefined?: boolean;
  /**
   * Max nesting depth from the YAML root for objects/arrays. For `Error`
   * values, each `cause` hop uses the depth of that `Error` in the tree (the
   * depth at which the instance is visited, then +1 per nested `Error`
   * `cause`). Payload fields skip YAML truncation; only `cause` may become
   * `{max depth reached}`.
   */
  maxDepth?: number;
  /* collapse simple non-nested objects with no keys into a single line */
  collapseObjects?: boolean;
  /* add spaces in root object */
  addRootObjSpaces?: 'before' | 'after' | 'beforeAndAfter' | false;
  /** When serializing `Error`, include `stack`. Default true (direct `yamlStringify`); `compactSnapshot` passes false by default. */
  includeErrorStack?: boolean;
  /** When serializing `Error`, include `cause` recursively. Default true. */
  includeErrorCause?: boolean;
  /**
   * Limit which extra enumerable own keys appear on `Error` (not `message` /
   * `name` / `stack` / `cause`). Omit to include all extras. Array = allowlist.
   */
  pickErrorOwnProps?:
    | string[]
    | ((key: string, value: unknown) => boolean);
};

type ErrorYamlSnapshotOptions = {
  includeStack: boolean;
  includeCause: boolean;
  pickOwnProps: (key: string, value: unknown) => boolean;
};

const ERROR_SNAPSHOT_RESERVED = new Set([
  'message',
  'name',
  'stack',
  'cause',
]);

function resolvePickErrorOwnProps(
  pick?: YamlStringifyOptions['pickErrorOwnProps'],
): (key: string, value: unknown) => boolean {
  if (pick === undefined) {
    return () => true;
  }
  if (Array.isArray(pick)) {
    const allowed = new Set(pick);
    return (key) => allowed.has(key);
  }
  return pick;
}

function errorToSnapshotPayload(
  err: Error,
  opts: ErrorYamlSnapshotOptions,
  yamlDepth: number,
  maxDepth: number,
): Record<string, unknown> {
  const out: Record<string, unknown> = {
    message: err.message,
    name: err.name,
  };

  if (opts.includeStack) {
    out.stack = err.stack;
  }

  for (const key of Object.keys(err)) {
    if (ERROR_SNAPSHOT_RESERVED.has(key)) {
      continue;
    }

    const val: unknown = Reflect.get(err, key);

    if (!opts.pickOwnProps(key, val)) {
      continue;
    }

    out[key] = val;
  }

  if (opts.includeCause && 'cause' in err && err.cause !== undefined) {
    const { cause } = err;

    if (yamlDepth + 1 > maxDepth) {
      out.cause = '{max depth reached}';
    } else if (cause instanceof Error) {
      out.cause = {
        'Error#': errorToSnapshotPayload(
          cause,
          opts,
          yamlDepth + 1,
          maxDepth,
        ),
      };
    } else {
      out.cause = cause;
    }
  }

  return out;
}

export function yamlStringify(
  obj: unknown,
  {
    maxLineLength = 100,
    showUndefined,
    maxDepth = 50,
    collapseObjects = false,
    addRootObjSpaces = 'beforeAndAfter',
    includeErrorStack = true,
    includeErrorCause = true,
    pickErrorOwnProps,
  }: YamlStringifyOptions = {},
): string {
  const errorSnapshot: ErrorYamlSnapshotOptions = {
    includeStack: includeErrorStack,
    includeCause: includeErrorCause,
    pickOwnProps: resolvePickErrorOwnProps(pickErrorOwnProps),
  };

  if (isObject(obj) || Array.isArray(obj) || typeof obj === 'function') {
    return `${stringifyValue(obj, '', maxLineLength, !!showUndefined, maxDepth, 0, collapseObjects, addRootObjSpaces, false, errorSnapshot, false)}\n`;
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
  collapseObjects: boolean,
  addObjSpaces: 'before' | 'after' | 'beforeAndAfter' | false,
  isArrayItem: boolean,
  errorSnapshot: ErrorYamlSnapshotOptions,
  relaxMaxDepth: boolean,
): string {
  let result = '';
  const childIndent = `${indent}  `;

  if (isPlainObject(value)) {
    if (Object.keys(value).length === 0) {
      return '{}';
    }

    // Try to collapse simple objects if collapseObjects is enabled (but not for root objects)
    if (collapseObjects && depth > 0) {
      const entries = Object.entries(value).filter(
        ([, val]) => val !== undefined || showUndefined,
      );
      const isSimpleObject = entries.every(([, val]) => {
        if (typeof val === 'string') {
          // Don't collapse objects if strings contain quotes or escape sequences
          return (
            !val.includes("'") && !val.includes('"') && !val.includes('\\')
          );
        }
        return (
          typeof val === 'number' ||
          typeof val === 'boolean' ||
          val === null ||
          val === undefined
        );
      });

      const shouldCollapse =
        isArrayItem ? entries.length > 1 : entries.length > 0;
      if (isSimpleObject && shouldCollapse) {
        let line = '{ ';

        line += entries
          .map(([key, val]) => {
            let valueStr: string;
            if (typeof val === 'string') {
              if (val.includes("'") && !val.includes('"')) {
                valueStr = `"${val}"`;
              } else if (val.includes('"') && !val.includes("'")) {
                valueStr = `'${val}'`;
              } else if (val.includes("'") && val.includes('"')) {
                valueStr = `"${val.replace(/"/g, '\\"')}"`;
              } else {
                valueStr = `'${val}'`;
              }
            } else {
              valueStr = String(val);
            }
            return `${key}: ${valueStr}`;
          })
          .join(', ');

        line += ' }';

        if (line.length <= maxLineLength) {
          return line;
        }
      }
    }

    let prevValue: unknown;
    let afterSpaceWasAdded = false;

    for (let [key, objVal] of Object.entries(value)) {
      if (objVal === undefined && !showUndefined) {
        continue;
      }

      if (
        !relaxMaxDepth &&
        depth > maxDepth &&
        !(objVal instanceof Error)
      ) {
        objVal = `{max depth reached}`;
      }

      const normalizedValue = normalizeValue(
        objVal,
        errorSnapshot,
        maxDepth,
        depth + 1,
      );

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
        collapseObjects,
        addObjSpaces,
        false,
        errorSnapshot,
        relaxMaxDepth,
      );

      // Check if the current value will be collapsed (including empty objects)
      const willBeCollapsed =
        isObject(objVal) &&
        (Object.keys(objVal).length === 0 ||
          (collapseObjects &&
            depth + 1 > 0 &&
            (() => {
              const filteredEntries = Object.entries(objVal).filter(
                ([, val]) => val !== undefined || showUndefined,
              );
              const shouldCollapseThis =
                isArrayItem ?
                  filteredEntries.length > 1
                : filteredEntries.length > 0;
              return (
                shouldCollapseThis &&
                filteredEntries.every(([, val]) => {
                  if (typeof val === 'string') {
                    // Don't collapse objects if strings contain quotes or escape sequences
                    return (
                      !val.includes("'") &&
                      !val.includes('"') &&
                      !val.includes('\\')
                    );
                  }
                  return (
                    typeof val === 'number' ||
                    typeof val === 'boolean' ||
                    val === null ||
                    val === undefined
                  );
                })
              );
            })()));

      // Check if the previous value was a collapsed object
      const prevWasCollapsed =
        prevValue &&
        isObject(prevValue) &&
        (Object.keys(prevValue).length === 0 ||
          (collapseObjects &&
            depth + 1 > 0 &&
            (() => {
              const filteredEntries = Object.entries(prevValue).filter(
                ([, val]) => val !== undefined || showUndefined,
              );
              const shouldCollapseThis =
                isArrayItem ?
                  filteredEntries.length > 1
                : filteredEntries.length > 0;
              return (
                shouldCollapseThis &&
                filteredEntries.every(([, val]) => {
                  if (typeof val === 'string') {
                    // Don't collapse objects if strings contain quotes or escape sequences
                    return (
                      !val.includes("'") &&
                      !val.includes('"') &&
                      !val.includes('\\')
                    );
                  }
                  return (
                    typeof val === 'number' ||
                    typeof val === 'boolean' ||
                    val === null ||
                    val === undefined
                  );
                })
              );
            })()));

      if (
        !afterSpaceWasAdded &&
        indent === '' &&
        isObject(objVal) &&
        !willBeCollapsed &&
        prevValue &&
        !prevWasCollapsed &&
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
        // Check if the value string is a collapsed object (single line starting with '{')
        const isCollapsedObject =
          valueString.startsWith('{') && !valueString.includes('\n');

        if (Object.keys(objVal).length === 0 || isCollapsedObject) {
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
        // Check if the value is a collapsed object (single line starting with '{' and containing content)
        const isCollapsedObject =
          valueString.startsWith('{') &&
          !valueString.includes('\n') &&
          valueString.length > 2;

        if (isObject(objVal) && !isCollapsedObject) {
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

          if (
            !relaxMaxDepth &&
            depth > maxDepth &&
            !(valueToUse instanceof Error)
          ) {
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
            collapseObjects,
            addObjSpaces,
            true,
            errorSnapshot,
            relaxMaxDepth,
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
        if (
          !relaxMaxDepth &&
          depth > maxDepth &&
          !(item instanceof Error)
        ) {
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
            collapseObjects,
            addObjSpaces,
            true,
            errorSnapshot,
            relaxMaxDepth,
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
            collapseObjects,
            addObjSpaces,
            true,
            errorSnapshot,
            relaxMaxDepth,
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

  const normalizedValue = normalizeValue(
    value,
    errorSnapshot,
    maxDepth,
    depth,
  );

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
      collapseObjects,
      addObjSpaces,
      false,
      errorSnapshot,
      normalizedValue[0] === 'Error',
    );
  }

  return JSON.stringify(value);
}

function normalizeValue(
  value: unknown,
  errorSnapshot: ErrorYamlSnapshotOptions,
  maxDepth: number,
  yamlDepth: number,
): [string, unknown] | null {
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
      errorToSnapshotPayload(value, errorSnapshot, yamlDepth, maxDepth),
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
