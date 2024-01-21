import { expect, test } from 'vitest';
import { parallelAsyncResultCalls } from './parallelAsyncResultCalls';
import { asyncResultify } from './rsResult';
import { sleep } from './sleep';

function asyncResultFn<T extends string | Error | number>(
  value: T,
  duration: number = 10,
) {
  return asyncResultify(() =>
    sleep(duration).then(() => {
      if (value instanceof Error) {
        throw value;
      }

      if (typeof value === 'string' && value.startsWith('error: ')) {
        throw new Error(value.slice(7));
      }

      return value;
    }),
  );
}

test('runAllSettled with success and metadata', async () => {
  const result = await parallelAsyncResultCalls<number>()
    .add({
      metadata: 1,
      fn: () => asyncResultFn(1, 15),
    })
    .add({
      metadata: 2,
      fn: () => asyncResultFn(2, 10),
    })
    .add({
      metadata: 3,
      fn: () => asyncResultFn(3, 5),
    })
    .runAllSettled();

  expect(result).toMatchInlineSnapshot(`
    {
      "allFailed": false,
      "failed": [],
      "succeeded": [
        {
          "metadata": 1,
          "value": 1,
        },
        {
          "metadata": 2,
          "value": 2,
        },
        {
          "metadata": 3,
          "value": 3,
        },
      ],
    }
  `);
});

test('runAllSettled with some failures', async () => {
  const result = await parallelAsyncResultCalls<number>()
    .add({
      metadata: 1,
      fn: () => asyncResultFn(1, 15),
    })
    .add({
      metadata: 2,
      fn: () => asyncResultFn(2, 10),
    })
    .add({
      metadata: 3,
      fn: () => asyncResultFn(new Error('error 3'), 5),
    })
    .add({
      metadata: 4,
      fn: () => asyncResultFn('error: error 4', 10),
    })
    .runAllSettled();

  expect(result).toMatchInlineSnapshot(`
    {
      "allFailed": false,
      "failed": [
        {
          "error": [NormalizedError: error 3],
          "metadata": 3,
        },
        {
          "error": [NormalizedError: error 4],
          "metadata": 4,
        },
      ],
      "succeeded": [
        {
          "metadata": 1,
          "value": 1,
        },
        {
          "metadata": 2,
          "value": 2,
        },
      ],
    }
  `);
});

test('start delay', async () => {
  const startOrder: number[] = [];

  const beforeStartTime = Date.now();

  let thirdStartTime = 0;

  await parallelAsyncResultCalls<number>()
    .add({
      metadata: 1,
      fn: () =>
        asyncResultify(() => {
          startOrder.push(1);
          return sleep(5);
        }),
    })
    .add({
      metadata: 2,
      fn: () =>
        asyncResultify(() => {
          startOrder.push(2);
          return sleep(5);
        }),
    })
    .add({
      metadata: 3,
      fn: () =>
        asyncResultify(() => {
          thirdStartTime = Date.now() - beforeStartTime;
          startOrder.push(3);
          return sleep(5);
        }),
    })
    .runAllSettled({ delayStart: (i) => i * 5 });

  expect(startOrder).toMatchInlineSnapshot(`
    [
      1,
      2,
      3,
    ]
  `);

  expect(thirdStartTime).toBeGreaterThan(8);
});

test('runAll with successful result', async () => {
  const result = await parallelAsyncResultCalls<number>()
    .add({
      metadata: 1,
      fn: () => asyncResultFn(1, 15),
    })
    .add({
      metadata: 2,
      fn: () => asyncResultFn(2, 10),
    })
    .add({
      metadata: 3,
      fn: () => asyncResultFn(3, 5),
    })
    .runAll();

  expect(result.ok && result.value).toMatchInlineSnapshot(`
    [
      {
        "metadata": 1,
        "value": 1,
      },
      {
        "metadata": 2,
        "value": 2,
      },
      {
        "metadata": 3,
        "value": 3,
      },
    ]
  `);
});

test('runAll with some failures', async () => {
  const result = await parallelAsyncResultCalls<number>()
    .add({
      metadata: 1,
      fn: () => asyncResultFn(1, 15),
    })
    .add({
      metadata: 2,
      fn: () => asyncResultFn(2, 10),
    })
    .add({
      metadata: 3,
      fn: () => asyncResultFn(new Error('error 3'), 5),
    })
    .add({
      metadata: 4,
      fn: () => asyncResultFn('error: error 4', 10),
    })
    .runAll();

  expect(!result.ok && result.error).toMatchInlineSnapshot(`
    [NormalizedError: error 3]
  `);
});

test('runAll without metadata', async () => {
  const result = await parallelAsyncResultCalls()
    .add(() => asyncResultFn(1, 15))
    .add(() => asyncResultFn(2, 10))
    .add(() => asyncResultFn(3, 5))
    .runAll();

  expect(result.ok && result.value).toMatchInlineSnapshot(`
    [
      {
        "metadata": undefined,
        "value": 1,
      },
      {
        "metadata": undefined,
        "value": 2,
      },
      {
        "metadata": undefined,
        "value": 3,
      },
    ]
  `);
});
