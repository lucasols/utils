import { bench, group, run, summary } from 'mitata';

import { dequal } from 'dequal';
import { deepEqual } from '../src/deepEqual';

const createShallowObj = () => ({
  foo: 'bar',
  baz: 1,
  qux: false,
});

const createDeepObj = () => ({
  foo: 'bar',
  baz: 1,
  qux: false,
  arr: [1, 2, 3],
  obj: {
    foo: 'bar',
    baz: 1,
    qux: false,
  },
  map: new Map<string, any>([
    ['foo', 'bar'],
    ['baz', 1],
    ['qux', false],
  ]),
  set: new Set([1, 2, 3]),
});

summary(() => {
  group('shallow obj', () => {
    bench('deepEqual', () => {
      deepEqual(createShallowObj(), createShallowObj());
    }).baseline();

    bench('dequal', () => {
      dequal(createShallowObj(), createShallowObj());
    });
  });

  group('deep obj', () => {
    bench('deepEqual', () => {
      deepEqual(createDeepObj(), createDeepObj());
    }).baseline();

    bench('dequal', () => {
      dequal(createDeepObj(), createDeepObj());
    });
  });
});

await run();
