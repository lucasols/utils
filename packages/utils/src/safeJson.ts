/**
 * JSON.stringify can throw if the value is circular or contains functions, this function catches those errors and returns undefined
 * @param value
 */
export function safeJsonStringify(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch (_) {
    return undefined;
  }
}

/**
 * JSON.parse can throw if the value is not valid JSON, this function catches those errors and returns undefined
 * @param value
 */
export function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch (_) {
    return undefined;
  }
}
