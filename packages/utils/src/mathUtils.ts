export function clampMax(value: number, max: number) {
  return value > max ? max : value;
}

export function clampMin(value: number, min: number) {
  return value < min ? min : value;
}

export function clampRange(num: number, v1: number, v2: number) {
  if (v2 > v1) {
    return clamp(num, v1, v2);
  }

  return clamp(num, v2, v1);
}

export function clamp(num: number, min: number, max: number) {
  return (
    num > max ? max
    : num < min ? min
    : num
  );
}

export function fixFloatingPointNumber(value: number) {
  return Number(value.toPrecision(15));
}

/**
 * Rounds a number to the nearest multiple of the specified step value.
 *
 * @param value - The number to round
 * @param step - The step size to round to
 * @param offset - Optional offset to shift the rounding grid
 * @returns The rounded value
 *
 * @example
 * roundToStep(23, 5) // 25 (nearest multiple of 5)
 */
export function roundToStep(value: number, step: number, offset = 0): number {
  const inv = 1 / step;
  const snapped = Math.round((value - offset) * inv) / inv + offset;
  // tame float noise like 0.30000000000000004
  return Number(snapped.toFixed(12));
}

/**
 * Floors a number down to the nearest multiple of the specified step value.
 *
 * @param value - The number to floor
 * @param step - The step size to floor to
 * @param offset - Optional offset to shift the flooring grid
 * @returns The floored value
 *
 * @example
 * floorToStep(23, 5) // 20 (largest multiple of 5 ≤ 23)
 */
export function floorToStep(value: number, step: number, offset = 0): number {
  const inv = 1 / step;
  const snapped = Math.floor((value - offset) * inv) / inv + offset;
  return Number(snapped.toFixed(12));
}

/**
 * Ceils a number up to the nearest multiple of the specified step value.
 *
 * @param value - The number to ceil
 * @param step - The step size to ceil to
 * @param offset - Optional offset to shift the ceiling grid
 * @returns The ceiled value
 *
 * @example
 * ceilToStep(23, 5) // 25 (smallest multiple of 5 ≥ 23)
 */
export function ceilToStep(value: number, step: number, offset = 0): number {
  const inv = 1 / step;
  const snapped = Math.ceil((value - offset) * inv) / inv + offset;
  return Number(snapped.toFixed(12));
}

/**
 * Rounds a number to the specified number of decimal places.
 *
 * @param num - The number to round
 * @param precision - Number of decimal places
 * @returns The rounded number
 *
 * @example
 * round(3.14159, 2) // 3.14
 */
export function round(num: number, precision: number) {
  return Math.round(num * 10 ** precision) / 10 ** precision;
}
