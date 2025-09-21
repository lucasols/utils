export function* enumerate<T>(
  iter: Iterable<T>,
  start = 0,
): Generator<[number, T]> {
  let index = start;

  for (const item of iter) {
    yield [index, item];
    index++;
  }
}

export function* withIsLast<T>(
  array: T[],
): Generator<[isLast: boolean, item: T, index: number]> {
  let index = 0;

  for (const item of array) {
    const isLast = index === array.length - 1;

    yield [isLast, item, index];

    index++;
  }
}

export function* withPrevious<T>(
  iter: Iterable<T>,
): Generator<{ prev: T | undefined; current: T }> {
  let prev: T | undefined = undefined;

  for (const current of iter) {
    yield { prev, current };
    prev = current;
  }
}

export function* range(
  start: number,
  end: number,
  step = 1,
): Generator<number> {
  if (start > end) {
    for (let i = start; i >= end; i -= step) {
      yield i;
    }
  } else {
    for (let i = start; i <= end; i += step) {
      yield i;
    }
  }
}

export function rangeArray(start: number, end: number, step = 1): number[] {
  return [...range(start, end, step)];
}
