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
  in_: number[];
  out: number[];
  clamp?: boolean | 'start' | 'end';
};

export function interpolate(args: InterpolateArgs): number;
export function interpolate(
  input: number,
  inputRange: number[],
  outputRange: number[],
  clamp?: boolean | 'start' | 'end',
): number;
export function interpolate(
  ...args:
    | [InterpolateArgs]
    | [number, number[], number[], (boolean | 'start' | 'end')?]
) {
  let input: number;
  let inputRange: number[];
  let outputRange: number[];
  let clamp: boolean | 'start' | 'end';

  if (args.length === 1) {
    input = args[0].input;
    inputRange = args[0].in_;
    outputRange = args[0].out;
    clamp = args[0].clamp ?? true;
  } else {
    input = args[0];
    inputRange = args[1];
    outputRange = args[2];
    clamp = args[3] ?? true;
  }

  invariant(
    inputRange.length === outputRange.length,
    'Ranges must have the same length',
  );

  const range = findRange(input, inputRange);
  const inStart = inputRange[range]!;
  const inEnd = inputRange[range + 1]!;
  const outStart = outputRange[range]!;
  const outEnd = outputRange[range + 1]!;

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
