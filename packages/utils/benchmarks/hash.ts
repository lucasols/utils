import { bench, group, run, summary } from 'mitata';

import { murmur2, murmur3 } from '../src/hash';

const shortInputs = [
  'a',
  'abc',
  'hello',
  'cache:key:123',
  'user:42:settings',
];

const mediumInputs = [
  'The quick brown fox jumps over the lazy dog',
  'component.button.primary.disabled',
  JSON.stringify({
    id: 42,
    name: 'Lucas',
    roles: ['admin', 'editor'],
    active: true,
  }),
];

const longInputs = [
  'a'.repeat(256),
  JSON.stringify({
    id: 'session-123',
    name: 'benchmark-payload',
    tags: Array.from({ length: 64 }, (_, index) => `tag-${index}`),
    values: Array.from({ length: 128 }, (_, index) => index),
  }),
  '😀 café '.repeat(128),
];

summary(() => {
  group('short inputs', () => {
    bench('murmur2', () => {
      for (const input of shortInputs) murmur2(input);
    }).baseline();

    bench('murmur3 (base36)', () => {
      for (const input of shortInputs) murmur3(input);
    });

    bench('murmur3 (uint32)', () => {
      for (const input of shortInputs) murmur3(input, 'uint32');
    });
  });

  group('medium inputs', () => {
    bench('murmur2', () => {
      for (const input of mediumInputs) murmur2(input);
    }).baseline();

    bench('murmur3 (base36)', () => {
      for (const input of mediumInputs) murmur3(input);
    });

    bench('murmur3 (uint32)', () => {
      for (const input of mediumInputs) murmur3(input, 'uint32');
    });
  });

  group('long inputs', () => {
    bench('murmur2', () => {
      for (const input of longInputs) murmur2(input);
    }).baseline();

    bench('murmur3 (base36)', () => {
      for (const input of longInputs) murmur3(input);
    });

    bench('murmur3 (uint32)', () => {
      for (const input of longInputs) murmur3(input, 'uint32');
    });
  });
});

await run();
