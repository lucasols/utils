import { describe, expect, test } from 'vitest';
import { invariant } from './assertions';
import { omit } from './objUtils';
import { parallelAsyncCalls } from './parallelAsyncCalls';
import { Result, asyncResultify } from './rsResult';
import { sleep } from './sleep';
import { TestTypeIsEqual, typingTest } from './typingTestUtils';

const { expectType } = typingTest;

function asyncResultFn<T extends string | Error | number | boolean>(
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
  const result = await parallelAsyncCalls<number>()
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

  expect(omit(result, ['results'])).toMatchInlineSnapshot(`
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
  const result = await parallelAsyncCalls<number>()
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

  expect(omit(result, ['results'])).toMatchInlineSnapshot(`
    {
      "allFailed": false,
      "failed": [
        {
          "error": [Error: error 3],
          "metadata": 3,
        },
        {
          "error": [Error: error 4],
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

  await parallelAsyncCalls<number>()
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
  const result = await parallelAsyncCalls<number>()
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
  const result = await parallelAsyncCalls<number>()
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
    {
      "error": [Error: error 3],
      "metadata": 3,
    }
  `);
});

test('runAll without metadata', async () => {
  const result = await parallelAsyncCalls()
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

describe('addTuple', () => {
  type Succeeded<R, M> = {
    value: R;
    metadata: M;
  };

  type Failed<M> = {
    metadata: M;
    error: Error;
  };

  test('runAll', async () => {
    const result = await parallelAsyncCalls()
      .addTuple(
        () => asyncResultFn('1' as const, 15),
        () => asyncResultFn(2 as const, 10),
        () => asyncResultFn(false as const, 5),
      )
      .runAll();

    expectType<
      TestTypeIsEqual<
        typeof result,
        Result<
          [
            Succeeded<'1', undefined>,
            Succeeded<2, undefined>,
            Succeeded<false, undefined>,
          ],
          { metadata: undefined; error: Error }
        >
      >
    >();

    expect(result.ok && result.value).toMatchInlineSnapshot(`
      [
        {
          "metadata": undefined,
          "value": "1",
        },
        {
          "metadata": undefined,
          "value": 2,
        },
        {
          "metadata": undefined,
          "value": false,
        },
      ]
    `);
  });

  test('runAllSettled', async () => {
    const result = await parallelAsyncCalls()
      .addTuple(
        () => asyncResultFn('1' as const, 15),
        () => asyncResultFn(2 as const, 10),
        () => asyncResultFn(false as const, 5),
      )
      .runAllSettled();

    expectType<
      TestTypeIsEqual<
        typeof result,
        {
          allFailed: boolean;
          results: [
            Succeeded<'1', undefined> | Failed<undefined>,
            Succeeded<2, undefined> | Failed<undefined>,
            Succeeded<false, undefined> | Failed<undefined>,
          ];
        }
      >
    >();

    expect(result.results).toMatchInlineSnapshot(`
      [
        {
          "metadata": undefined,
          "value": "1",
        },
        {
          "metadata": undefined,
          "value": 2,
        },
        {
          "metadata": undefined,
          "value": false,
        },
      ]
    `);
  });

  test('runAll with metadata', async () => {
    const result = await parallelAsyncCalls<number>()
      .addTuple(
        { metadata: 1 as const, fn: () => asyncResultFn('1' as const, 15) },
        {
          metadata: 2 as const,
          fn: () => asyncResultFn('error: fail' as const, 10),
        },
        { metadata: 3 as const, fn: () => asyncResultFn(false as const, 5) },
      )
      .runAll();

    expectType<
      TestTypeIsEqual<
        typeof result,
        Result<
          [Succeeded<'1', 1>, Succeeded<'error: fail', 2>, Succeeded<false, 3>],
          | { metadata: 1; error: Error }
          | { metadata: 2; error: Error }
          | { metadata: 3; error: Error }
        >
      >
    >();

    expect(result).toMatchInlineSnapshot(`
      {
        "error": {
          "error": [Error: fail],
          "metadata": 2,
        },
        "errorResult": [Function],
        "ok": false,
        "unwrap": [Function],
        "unwrapOr": [Function],
        "unwrapOrNull": [Function],
      }
    `);
  });

  test('runAllSettled with metadata', async () => {
    const result = await parallelAsyncCalls<number>()
      .addTuple(
        { metadata: 1 as const, fn: () => asyncResultFn('1' as const, 15) },
        {
          metadata: 2 as const,
          fn: () => asyncResultFn('error: fail' as const, 10),
        },
        { metadata: 3 as const, fn: () => asyncResultFn(false as const, 5) },
      )
      .runAllSettled();

    expectType<
      TestTypeIsEqual<
        typeof result,
        {
          allFailed: boolean;
          results: [
            Succeeded<'1', 1> | Failed<1>,
            Succeeded<'error: fail', 2> | Failed<2>,
            Succeeded<false, 3> | Failed<3>,
          ];
        }
      >
    >();

    expect(result.results).toMatchInlineSnapshot(`
      [
        {
          "metadata": 1,
          "value": "1",
        },
        {
          "error": [Error: fail],
          "metadata": 2,
        },
        {
          "metadata": 3,
          "value": false,
        },
      ]
    `);
  });

  test('Result.unwrap on runAll', async () => {
    const result = parallelAsyncCalls()
      .addTuple(
        () => asyncResultFn('1' as const, 15),
        () => asyncResultFn('2' as const, 10),
      )
      .runAll();

    expectType<
      TestTypeIsEqual<
        typeof result,
        Promise<
          Result<
            [Succeeded<'1', undefined>, Succeeded<'2', undefined>],
            { metadata: undefined; error: Error }
          >
        >
      >
    >();

    const value = await result;

    invariant(value.ok);

    expect(value.value).toMatchInlineSnapshot(`
      [
        {
          "metadata": undefined,
          "value": "1",
        },
        {
          "metadata": undefined,
          "value": "2",
        },
      ]
    `);
  });
});

test('runAll error keeps same stack trace', async () => {
  const errorToThrow = new Error('Failed');

  const result = await parallelAsyncCalls()
    .add(() => asyncResultFn(1, 15))
    .add(() => asyncResultFn(2, 0))
    .add(() => asyncResultFn(errorToThrow, 5))
    .runAll();

  const error = result.error ? result.error.error : undefined;

  expect(error?.stack).toEqual(errorToThrow.stack);
});
