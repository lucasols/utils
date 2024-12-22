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
