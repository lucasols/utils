import { notNullish } from './assertions';
import { clampRange } from './mathUtils';

type Interval = [number, number];

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function cyclicLerp(
  input: number,
  [inStart, inEnd]: Interval,
  [outStart, outEnd]: Interval,
) {
  return (
    mod((input - inStart) / (inEnd - inStart), 1) * (outEnd - outStart) +
    outStart
  );
}

function findRange(input: number, inputRange: number[]) {
  for (let i = 1; i < inputRange.length - 1; i++) {
    if (inputRange[i]! >= input) return i - 1;
  }

  return inputRange.length - 2;
}

export function interpolate(
  input: number,
  inputRange: number[],
  outputRange: number[],
  clamp = true,
) {
  const range = findRange(input, inputRange);
  const inStart = notNullish(inputRange[range]);
  const inEnd = notNullish(inputRange[range + 1]);
  const outStart = notNullish(outputRange[range]);
  const outEnd = notNullish(outputRange[range + 1]);

  const interpolatedValue =
    ((input - inStart) / (inEnd - inStart)) * (outEnd - outStart) + outStart;

  return clamp ?
      clampRange(interpolatedValue, outStart, outEnd)
    : interpolatedValue;
}
