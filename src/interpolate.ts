import { invariant } from './assertions';
import { clampMax, clampMin, clampRange } from './mathUtils';

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

type InterpolateArgs = {
  input: number;
  in: number[];
  out: number[];
  clamp?: boolean | 'start' | 'end';
};

export function interpolate({
  input,
  in: inputRange,
  out,
  clamp = true,
}: InterpolateArgs): number {
  invariant(
    inputRange.length === out.length,
    'Ranges must have the same length',
  );

  const range = findRange(input, inputRange);
  const inStart = inputRange[range]!;
  const inEnd = inputRange[range + 1]!;
  const outStart = out[range]!;
  const outEnd = out[range + 1]!;

  const interpolatedValue =
    ((input - inStart) / (inEnd - inStart)) * (outEnd - outStart) + outStart;

  const outputIsAscending = outStart < outEnd;

  return (
    clamp === 'start' ?
      outputIsAscending ? clampMin(interpolatedValue, outStart)
      : clampMax(interpolatedValue, outStart)
    : clamp === 'end' ?
      outputIsAscending ? clampMax(interpolatedValue, outEnd)
      : clampMin(interpolatedValue, outEnd)
    : clamp ? clampRange(interpolatedValue, outStart, outEnd)
    : interpolatedValue
  );
}
