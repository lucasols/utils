import { sortBy } from './arrayUtils';
import { notNullish } from './assertions';
import { deepEqual } from './deepEqual';
import { omit } from './objUtils';
import { __LEGIT_ANY_CAST__, __UNSAFE_TO_STRING__ } from './saferTyping';
import { isObject } from './typeGuards';
import type { PartialRecord } from './typeUtils';

type AnyObj = Record<string, unknown>;

function jsonClone<T>(value: T): T {
  if (value === undefined) return value;
  return JSON.parse(JSON.stringify(value));
}

const addKeysName = '++keys_added';
const removeKeysName = '--keys_removed';
const updateKeysName = '~~keys_updated';

type ObjDiffsKeys =
  | typeof addKeysName
  | typeof removeKeysName
  | typeof updateKeysName;

type ObjDiffs = PartialRecord<ObjDiffsKeys, Record<string, unknown>>;

export function getDiffs(
  oldValue: unknown,
  newValue: unknown,
  {
    ignoreDiffs,
    ignoreKeys,
    skipIdKey,
  }: {
    ignoreDiffs?: ObjDiffsKeys[];
    ignoreKeys?: string[];
    skipIdKey?: boolean;
  } = {},
): Record<string, unknown> | undefined {
  if (deepEqual(oldValue, newValue)) return undefined;

  if (!isObject(oldValue) || !isObject(newValue)) {
    return { '--old': oldValue, '++new': newValue };
  }

  const diffs: ObjDiffs = {
    [addKeysName]: {},
    [removeKeysName]: {},
    [updateKeysName]: {},
  };

  const extraInfo: Record<string, string> = {};

  const removeKeys = new Set<string>();

  for (const [key, value] of Object.entries(oldValue)) {
    if (ignoreKeys?.includes(key)) continue;

    if (newValue[key] === undefined && value !== undefined) {
      notNullish(diffs[removeKeysName])[key] = value;
      removeKeys.add(key);
    }
  }

  for (const [key, value] of Object.entries(newValue)) {
    if (ignoreKeys?.includes(key) || removeKeys.has(key)) {
      continue;
    }

    if (oldValue[key] === undefined && value !== undefined) {
      notNullish(diffs[addKeysName])[key] = value;
    } else if (!deepEqual(jsonClone(oldValue[key]), jsonClone(value))) {
      const updated = notNullish(diffs[updateKeysName]);
      const old = oldValue[key];

      const simplifiedDiffResult = getSimplifiedDiff(old, value);

      updated[
        (
          typeof simplifiedDiffResult !== 'string' &&
          simplifiedDiffResult !== undefined &&
          '++new' in simplifiedDiffResult
        ) ?
          key
        : Array.isArray(old) && Array.isArray(value) ? `${key}~~array_changes`
        : key
      ] = simplifiedDiffResult;
    }
  }

  if (
    ignoreDiffs?.includes(addKeysName) ||
    Object.keys(diffs[addKeysName] ?? {}).length === 0
  ) {
    delete diffs[addKeysName];
  }
  if (
    ignoreDiffs?.includes(removeKeysName) ||
    Object.keys(diffs[removeKeysName] ?? {}).length === 0
  ) {
    delete diffs[removeKeysName];
  }
  if (
    ignoreDiffs?.includes(updateKeysName) ||
    (diffs[updateKeysName] && Object.keys(diffs[updateKeysName]).length === 0)
  ) {
    delete diffs[updateKeysName];
  }

  function checkIdKey(key: string) {
    if (!isObject(newValue) || !isObject(oldValue)) return false;

    if (key in newValue && key in oldValue && newValue[key] === oldValue[key]) {
      const val = newValue[key];
      if (typeof val === 'string' || typeof val === 'number') {
        extraInfo[key] = __UNSAFE_TO_STRING__(val);
        return true;
      }
    }

    return false;
  }

  if (Object.keys(diffs).length !== 0 && !skipIdKey) {
    if (!checkIdKey('id')) {
      checkIdKey('key');
    }
  }

  const result = { ...extraInfo, ...diffs };

  if (Object.keys(result).length === 0) return undefined;

  return result;
}

function isPrimitive(
  value: unknown,
): value is string | number | boolean | null | undefined {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

type ArrayDiffs = Record<string, unknown>;

function isSmallArray(value: unknown[]) {
  return JSON.stringify(value).length <= 80;
}

function getArrayDiffs(old: unknown[], newValue: unknown[]): ArrayDiffs | null {
  const diffs: Record<string, unknown> = {};

  let allItemsHaveKey: string | null | false = null;

  for (const item of old) {
    if (isObject(item)) {
      if (
        (allItemsHaveKey === null || allItemsHaveKey === 'id') &&
        'id' in item &&
        isPrimitive(item.id)
      ) {
        allItemsHaveKey = 'id';
      } else if (
        (allItemsHaveKey === null || allItemsHaveKey === 'key') &&
        'key' in item &&
        isPrimitive(item.key)
      ) {
        allItemsHaveKey = 'key';
      } else {
        allItemsHaveKey = false;
        break;
      }
    } else {
      allItemsHaveKey = false;
      break;
    }
  }

  if (allItemsHaveKey) {
    for (const item of newValue) {
      if (isObject(item)) {
        if (item[allItemsHaveKey] === undefined) {
          allItemsHaveKey = false;
          break;
        }
      }
    }
  }

  if (allItemsHaveKey) {
    return arrayDiffFromItemsWithIds(
      __LEGIT_ANY_CAST__(old),
      __LEGIT_ANY_CAST__(newValue),
      allItemsHaveKey,
    );
  }

  if (
    newValue.every((item) => old.some((oldItem) => deepEqual(oldItem, item)))
  ) {
    return null;
  }

  if (isSmallArray(newValue) && isSmallArray(old)) {
    return null;
  }

  if (
    Math.min(newValue.length, old.length) /
      Math.max(newValue.length, old.length) <
    0.5
  ) {
    return null;
  }

  diffs.size =
    newValue.length === old.length ?
      newValue.length
    : [old.length, '->', newValue.length];

  for (const [index, value] of newValue.entries()) {
    const oldValue = old[index];

    const indexString = `[${index}]${
      index === newValue.length - 1 ? '(last_item)' : ''
    }`;

    if (!deepEqual(oldValue, value)) {
      if (oldValue === undefined) {
        diffs[`${indexString}_added`] = value;
      } else if (value === undefined) {
        diffs[`${indexString}_removed`] = oldValue;
      } else {
        diffs[indexString] = getSimplifiedDiff(oldValue, value, 'array');
      }
    }
  }

  if (old.length > newValue.length) {
    for (const [index, value] of old.entries()) {
      if (index >= newValue.length) {
        diffs[`[${index}]_removed`] = value;
      }
    }
  }

  if (Object.keys(diffs).length === 0) return null;

  return diffs;
}

function arrayDiffFromItemsWithIds(
  oldItems: AnyObj[],
  newItems: AnyObj[],
  key: string,
): ArrayDiffs {
  const diffs: Record<string, unknown> = {};

  function getItemKey(item: AnyObj, index: number | null) {
    const id = item[key];
    return `[${key}: ${typeof id === 'string' ? `'${id}'` : __UNSAFE_TO_STRING__(id)}]${
      index !== null ? `{${index}}` : ''
    }`;
  }

  const oldItemsMap = new Map(
    oldItems.map((item, index) => [item[key], { item, index }]),
  );

  const movedItems: { key: string; deltaAbs: number }[] = [];
  const oldAdjustIndex: { after: number; delta: number }[] = [];
  const newAdjustIndex: { after: number; delta: number }[] = [];

  function getDisplayObj(item: AnyObj, idKey: string, emptyObjDisplay: string) {
    const objWithoutKey = omit(item, [idKey]);

    if (Object.keys(objWithoutKey).length === 0) return emptyObjDisplay;

    return objWithoutKey;
  }

  for (const [index, item] of oldItems.entries()) {
    const newItem = newItems.find((newItem) => newItem[key] === item[key]);

    if (!newItem) {
      diffs[`--${getItemKey(item, index)}`] = getDisplayObj(
        item,
        key,
        'removed',
      );
      oldAdjustIndex.push({ after: index, delta: -1 });
    }
  }

  for (const [index, item] of newItems.entries()) {
    const oldItem = oldItemsMap.get(item[key]);

    if (!oldItem) {
      diffs[`++${getItemKey(item, index)}`] = getDisplayObj(item, key, 'added');
      newAdjustIndex.push({ after: index, delta: 1 });
      continue;
    }

    const itemChanged = !deepEqual(oldItem.item, item);
    const itemMoved = oldItem.index !== index;

    if (itemChanged && itemMoved) {
      diffs[`~>${getItemKey(item, null)}·[${oldItem.index} -> ${index}]`] =
        getDiffs(oldItem.item, item, { skipIdKey: true });
    } else {
      if (itemChanged) {
        diffs[`~~${getItemKey(item, index)}`] = getDiffs(oldItem.item, item, {
          skipIdKey: true,
        });
      }

      if (itemMoved) {
        let expectedIndex = oldItem.index;

        for (const { after, delta } of oldAdjustIndex) {
          if (oldItem.index > after) {
            expectedIndex += delta;
          }
        }

        for (const { after, delta } of newAdjustIndex) {
          if (index > after) {
            expectedIndex += delta;
          }
        }

        if (expectedIndex !== index) {
          const diffKey = `->${getItemKey(item, null)}·[${oldItem.index} -> ${index}]`;
          diffs[diffKey] = 'moved';
          movedItems.push({
            key: diffKey,
            deltaAbs: Math.abs(index - oldItem.index),
          });
        }
      }
    }
  }

  const biggestDelta = sortBy(movedItems, (item) => item.deltaAbs, 'desc')[0]
    ?.deltaAbs;

  for (const item of movedItems) {
    if (item.deltaAbs !== biggestDelta) {
      delete diffs[item.key];
    }
  }

  return diffs;
}

function getSimplifiedDiff(
  old: unknown,
  value: unknown,
  parentIs?: 'array' | 'object',
): string | AnyObj | [unknown, string, unknown] | undefined {
  if (isPrimitive(old) && isPrimitive(value)) {
    const updateText = JSON.stringify([old, '->', value]);

    if (updateText.length <= 40) {
      return [old, '->', value];
    }
  }

  if (parentIs !== 'array' && Array.isArray(old) && Array.isArray(value)) {
    const arrayDiffs = getArrayDiffs(old, value);

    if (arrayDiffs) return arrayDiffs;
  }

  if (isObject(old) && isObject(value)) {
    const objectDiffs = getDiffs(old, value);

    return objectDiffs;
  }

  return { '--old': old, '++new': value };
}
