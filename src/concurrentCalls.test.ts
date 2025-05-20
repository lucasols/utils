/* eslint-disable @typescript-eslint/require-await */
import { resultify, type Result } from 't-result';
import { assert, describe, expect, test } from 'vitest';
import {
  concurrentCalls,
  concurrentCallsWithMetadata,
} from './concurrentCalls';
import { sleep } from './sleep';
import { typingTest, type TestTypeIsEqual } from './typingTestUtils';

const { expectType } = typingTest;

function asyncResultFn<T extends string | Error | number | boolean>(
  value: T,
  duration: number = 10,
) {
  return resultify(async () => {
    await sleep(duration);
    if (value instanceof Error) {
      throw value;
    }

    if (typeof value === 'string' && value.startsWith('error: ')) {
      throw new Error(value.slice(7));
    }

    return value;
  });
}

function asyncErrorFn<T extends string | number | boolean, E extends Error>(
  _value: T,
  error: E,
  duration: number = 10,
) {
  return resultify(async () => {
    await sleep(duration);

    throw error;
  });
}

describe('concurrentCalls', () => {
  test('runAll success', async () => {
    const result = await concurrentCalls<number>()
      .add(asyncResultFn(1, 15))
      .add(() => asyncResultFn(2, 10))
      .add(() => asyncResultFn(3, 5))
      .runAll();

    expectType<TestTypeIsEqual<typeof result, Result<number[]>>>();

    expect(result.ok && result.value).toMatchInlineSnapshot(`
      [
        1,
        2,
        3,
      ]
    `);
  });

  test('runAll error', async () => {
    const result = await concurrentCalls<number>()
      .add(() => asyncResultFn(1, 15))
      .add(() => asyncResultFn(2, 10))
      .add(() => asyncErrorFn(3, new Error('error 3'), 5))
      .runAll();

    expectType<TestTypeIsEqual<typeof result, Result<number[], Error>>>();

    assert(!result.ok);
    expect(result.error).toMatchInlineSnapshot('[Error: error 3]');
  });

  test('runAll with delayStart', async () => {
    const startTime = Date.now();
    let thirdStartTime = -1;

    const result = await concurrentCalls<number>()
      .add(
        () => asyncResultFn(1, 15),
        () => asyncResultFn(2, 10),
        () => {
          thirdStartTime = Date.now() - startTime;

          return asyncResultFn(3, 5);
        },
      )
      .runAll({ delayStart: (i) => i * 5 });

    assert(result.ok);
    expect(result.value).toMatchInlineSnapshot(`
      [
        1,
        2,
        3,
      ]
    `);
    expect(thirdStartTime).toBeGreaterThan(8);
  });

  test('runAll error keeps same stack trace', async () => {
    const errorToThrow = new Error('Failed');

    const result = await concurrentCalls()
      .add(() => asyncResultFn(1, 15))
      .add(() => asyncResultFn(2, 0))
      .add(() => asyncResultFn(errorToThrow, 5))
      .runAll();

    assert(result.error);
    expect(result.error.stack).toEqual(errorToThrow.stack);
  });

  test('runAllSettled with all success', async () => {
    const result = await concurrentCalls<number>()
      .add(asyncResultFn(1, 15))
      .add(asyncResultFn(2, 10))
      .runAllSettled();

    expectType<
      TestTypeIsEqual<
        typeof result,
        {
          allFailed: boolean;
          failures: Error[];
          succeeded: number[];
          total: number;
          aggregatedError: AggregateError | null;
        }
      >
    >();

    expect(result.succeeded).toEqual([1, 2]);
    expect(result.failures).toEqual([]);
    expect(result.allFailed).toBe(false);
    expect(result.total).toBe(2);
    expect(result.aggregatedError).toBeNull();
  });

  test('runAllSettled with all failures', async () => {
    const error1 = new Error('error 1');
    const error2 = new Error('error 2');
    const result = await concurrentCalls<number, Error>()
      .add(() => asyncErrorFn(1, error1, 15))
      .add(() => asyncErrorFn(2, error2, 10))
      .runAllSettled();

    expectType<
      TestTypeIsEqual<
        typeof result,
        {
          allFailed: boolean;
          failures: Error[];
          succeeded: number[];
          total: number;
          aggregatedError: AggregateError | null;
        }
      >
    >();

    expect(result.succeeded).toEqual([]);
    expect(result.failures).toEqual([error1, error2]);
    expect(result.allFailed).toBe(true);
    expect(result.total).toBe(2);
    assert(result.aggregatedError);
    expect(result.aggregatedError.errors).toEqual([error1, error2]);
  });

  test('runAllSettled with some failures', async () => {
    const error2 = new Error('error 2');
    const result = await concurrentCalls<number, Error>()
      .add(asyncResultFn(1, 15))
      .add(() => asyncErrorFn(2, error2, 10))
      .add(asyncResultFn(3, 5))
      .runAllSettled();

    expect(result.succeeded).toEqual([1, 3]);
    expect(result.failures).toEqual([error2]);
    expect(result.allFailed).toBe(false);
    expect(result.total).toBe(3);
    assert(result.aggregatedError);
    expect(result.aggregatedError.errors).toEqual([error2]);
  });

  test('runAllSettled with delayStart', async () => {
    const startTime = Date.now();
    let secondCallTime = -1;

    const result = await concurrentCalls<number>()
      .add(
        () => asyncResultFn(1, 20), // finishes last if no delay
        () => {
          secondCallTime = Date.now() - startTime;
          return asyncResultFn(2, 5); // finishes first if no delay
        },
      )
      .runAllSettled({ delayStart: (i) => i * 10 }); // 0ms for first, 10ms for second

    expect(result.succeeded.sort()).toEqual([1, 2]); // sort because order is not guaranteed with delay
    expect(result.failures).toEqual([]);
    expect(result.allFailed).toBe(false);
    expect(result.total).toBe(2);
    expect(result.aggregatedError).toBeNull();
    expect(secondCallTime).toBeGreaterThanOrEqual(9); // allow for slight timing variations
    // first call (20ms) + 0ms delay = ~20ms
    // second call (5ms) + 10ms delay = ~15ms
    // so second call should finish before the first one.
    const endTime = Date.now();
    expect(endTime - startTime).toBeGreaterThanOrEqual(20); // longest task
    expect(endTime - startTime).toBeLessThan(35); // Max duration (20) + delay (10)
  });

  test('runAllSettled error keeps same stack trace', async () => {
    const errorToThrow = new Error('Failed');

    const result = await concurrentCalls()
      .add(() => asyncResultFn(1, 15))
      .add(() => asyncResultFn(2, 0))
      .add(() => asyncResultFn(errorToThrow, 5))
      .runAllSettled();

    expect(result.failures[0]?.stack).toEqual(errorToThrow.stack);
  });

  describe('resultifyAdd', () => {
    test('resultifyAdd with Promise resolving + runAll', async () => {
      const result = await concurrentCalls<string>()
        .resultifyAdd(Promise.resolve('ok'))
        .runAll();
      expectType<TestTypeIsEqual<typeof result, Result<string[], Error>>>();
      expect(result.ok && result.value).toEqual(['ok']);
    });

    test('resultifyAdd with Promise rejecting + runAll', async () => {
      const error = new Error('promise rejected');
      const result = await concurrentCalls<string>()
        .resultifyAdd(Promise.reject(error))
        .runAll();
      expectType<TestTypeIsEqual<typeof result, Result<string[], Error>>>();
      assert(!result.ok);
      expect(result.error).toBe(error);
    });

    test('resultifyAdd with sync fn returning value + runAll', async () => {
      const result = await concurrentCalls<string>()
        .resultifyAdd(() => 'ok sync')
        .runAll();
      expectType<TestTypeIsEqual<typeof result, Result<string[], Error>>>();
      expect(result.ok && result.value).toEqual(['ok sync']);
    });

    test('resultifyAdd with sync fn throwing error + runAll', async () => {
      const error = new Error('sync throw');
      const result = await concurrentCalls<string>()
        .resultifyAdd(() => {
          throw error;
        })
        .runAll();
      expectType<TestTypeIsEqual<typeof result, Result<string[], Error>>>();
      assert(!result.ok);
      expect(result.error).toBe(error);
    });

    test('resultifyAdd with async fn resolving + runAll', async () => {
      const result = await concurrentCalls<string>()
        .resultifyAdd(async () => 'ok async')
        .runAll();
      expectType<TestTypeIsEqual<typeof result, Result<string[], Error>>>();
      expect(result.ok && result.value).toEqual(['ok async']);
    });

    test('resultifyAdd with async fn rejecting + runAll', async () => {
      const error = new Error('async reject');
      const result = await concurrentCalls<string>()
        .resultifyAdd(async () => {
          throw error;
        })
        .runAll();
      expectType<TestTypeIsEqual<typeof result, Result<string[], Error>>>();
      assert(!result.ok);
      expect(result.error).toBe(error);
    });

    test('resultifyAdd with mixed types + runAllSettled', async () => {
      const errorPromise = new Error('promise rejected settle');
      const errorSync = new Error('sync throw settle');
      const errorAsync = new Error('async reject settle');

      const result = await concurrentCalls<string, Error>()
        .resultifyAdd(
          Promise.resolve('ok promise'),
          Promise.reject(errorPromise),
          () => 'ok sync',
          () => {
            throw errorSync;
          },
          async () => 'ok async',
          async () => {
            throw errorAsync;
          },
        )
        .runAllSettled();

      expectType<
        TestTypeIsEqual<
          typeof result,
          {
            allFailed: boolean;
            failures: Error[];
            succeeded: string[];
            total: number;
            aggregatedError: AggregateError | null;
          }
        >
      >();

      expect(result.succeeded.sort()).toEqual(
        ['ok async', 'ok promise', 'ok sync'].sort(),
      );
      expect(result.failures.map((e) => e.message).sort()).toEqual(
        [errorAsync.message, errorPromise.message, errorSync.message].sort(),
      );
      expect(result.allFailed).toBe(false);
      expect(result.total).toBe(6);
      assert(result.aggregatedError);
      expect(result.aggregatedError.errors.length).toBe(3);
    });
  });
});

describe('concurrentCallsWithMetadata', () => {
  test('runAll success with metadata', async () => {
    const result = await concurrentCallsWithMetadata<{ id: string }, number>()
      .add({ fn: () => asyncResultFn(1, 15), metadata: { id: 'a' } })
      .add({ fn: () => asyncResultFn(2, 10), metadata: { id: 'b' } })
      .runAll();

    expectType<
      TestTypeIsEqual<
        typeof result,
        Result<
          { value: number; metadata: { id: string } }[],
          { metadata: { id: string }; error: Error }
        >
      >
    >();

    assert(result.ok);
    expect(result.value).toMatchInlineSnapshot(`
      [
        {
          "metadata": {
            "id": "a",
          },
          "value": 1,
        },
        {
          "metadata": {
            "id": "b",
          },
          "value": 2,
        },
      ]
    `);
  });

  test('runAll error with metadata', async () => {
    const errorB = new Error('error b');
    const result = await concurrentCallsWithMetadata<
      { id: string },
      number,
      Error
    >()
      .add({ fn: () => asyncResultFn(1, 15), metadata: { id: 'a' } })
      .add({ fn: () => asyncErrorFn(2, errorB, 10), metadata: { id: 'b' } })
      .runAll();

    expectType<
      TestTypeIsEqual<
        typeof result,
        Result<
          { value: number; metadata: { id: string } }[],
          { metadata: { id: string }; error: Error }
        >
      >
    >();

    assert(!result.ok);
    expect(result.error).toEqual({ metadata: { id: 'b' }, error: errorB });
  });

  test('runAllSettled with all success with metadata', async () => {
    const result = await concurrentCallsWithMetadata<{ id: string }, number>()
      .add({ fn: () => asyncResultFn(1, 15), metadata: { id: 'a' } })
      .add({ fn: () => asyncResultFn(2, 10), metadata: { id: 'b' } })
      .runAllSettled();

    expectType<
      TestTypeIsEqual<
        typeof result,
        {
          allFailed: boolean;
          failed: { metadata: { id: string }; error: Error }[];
          succeeded: { value: number; metadata: { id: string } }[];
          total: number;
          results: (
            | { ok: false; metadata: { id: string }; error: Error }
            | {
                ok: true;
                value: number;
                metadata: { id: string };
                error: false;
              }
          )[];
          aggregatedError: AggregateError | null;
        }
      >
    >();

    expect(result.succeeded).toEqual([
      { value: 1, metadata: { id: 'a' } },
      { value: 2, metadata: { id: 'b' } },
    ]);
    expect(result.failed).toEqual([]);
    expect(result.allFailed).toBe(false);
    expect(result.total).toBe(2);
    expect(result.aggregatedError).toBeNull();
    expect(result.results).toEqual([
      { ok: true, value: 1, metadata: { id: 'a' }, error: false },
      { ok: true, value: 2, metadata: { id: 'b' }, error: false },
    ]);
  });

  test('runAllSettled with some failures with metadata', async () => {
    const errorB = new Error('error b');
    const result = await concurrentCallsWithMetadata<
      { id: string },
      number,
      Error
    >()
      .add({ fn: () => asyncResultFn(1, 15), metadata: { id: 'a' } })
      .add({ fn: () => asyncErrorFn(2, errorB, 10), metadata: { id: 'b' } })
      .add({ fn: () => asyncResultFn(3, 5), metadata: { id: 'c' } })
      .runAllSettled();

    expect(result.succeeded).toEqual([
      { value: 1, metadata: { id: 'a' } },
      { value: 3, metadata: { id: 'c' } },
    ]);
    expect(result.failed).toEqual([{ metadata: { id: 'b' }, error: errorB }]);
    expect(result.allFailed).toBe(false);
    expect(result.total).toBe(3);
    assert(result.aggregatedError);
    expect(result.aggregatedError.errors).toEqual([errorB]);
    expect(result.results.length).toBe(3);
    // Check if results contains the correct items regardless of order due to concurrency
    expect(result.results).toEqual(
      expect.arrayContaining([
        { ok: true, value: 1, metadata: { id: 'a' }, error: false },
        { ok: false, error: errorB, metadata: { id: 'b' } },
        { ok: true, value: 3, metadata: { id: 'c' }, error: false },
      ]),
    );
  });

  describe('resultifyAdd', () => {
    test('resultifyAdd with Promise resolving + runAll', async () => {
      const result = await concurrentCallsWithMetadata<{ id: number }, string>()
        .resultifyAdd({ fn: () => Promise.resolve('ok'), metadata: { id: 1 } })
        .runAll();

      expectType<
        TestTypeIsEqual<
          typeof result,
          Result<
            { value: string; metadata: { id: number } }[],
            { error: Error; metadata: { id: number } }
          >
        >
      >();
      assert(result.ok);
      expect(result.value).toEqual([{ value: 'ok', metadata: { id: 1 } }]);
    });

    test('resultifyAdd with Promise rejecting + runAll', async () => {
      const error = new Error('promise rejected meta');
      const result = await concurrentCallsWithMetadata<{ id: number }, string>()
        .resultifyAdd({ fn: () => Promise.reject(error), metadata: { id: 2 } })
        .runAll();

      expectType<
        TestTypeIsEqual<
          typeof result,
          Result<
            { value: string; metadata: { id: number } }[],
            { error: Error; metadata: { id: number } }
          >
        >
      >();
      assert(!result.ok);
      expect(result.error).toEqual({ error, metadata: { id: 2 } });
    });

    test('resultifyAdd with sync fn returning value + runAll', async () => {
      const result = await concurrentCallsWithMetadata<{ id: number }, string>()
        .resultifyAdd({ fn: () => 'ok sync meta', metadata: { id: 3 } })
        .runAll();
      assert(result.ok);
      expect(result.value).toEqual([
        { value: 'ok sync meta', metadata: { id: 3 } },
      ]);
    });

    test('resultifyAdd with sync fn throwing error + runAll', async () => {
      const error = new Error('sync throw meta');
      const result = await concurrentCallsWithMetadata<{ id: number }, string>()
        .resultifyAdd({
          fn: () => {
            throw error;
          },
          metadata: { id: 4 },
        })
        .runAll();
      assert(!result.ok);
      expect(result.error).toEqual({ error, metadata: { id: 4 } });
    });

    test('resultifyAdd with async fn resolving + runAll', async () => {
      const result = await concurrentCallsWithMetadata<{ id: number }, string>()
        .resultifyAdd({ fn: async () => 'ok async meta', metadata: { id: 5 } })
        .runAll();
      assert(result.ok);
      expect(result.value).toEqual([
        { value: 'ok async meta', metadata: { id: 5 } },
      ]);
    });

    test('resultifyAdd with async fn rejecting + runAll', async () => {
      const error = new Error('async reject meta');
      const result = await concurrentCallsWithMetadata<{ id: number }, string>()
        .resultifyAdd({
          fn: async () => {
            throw error;
          },
          metadata: { id: 6 },
        })
        .runAll();
      assert(!result.ok);
      expect(result.error).toEqual({ error, metadata: { id: 6 } });
    });

    test('resultifyAdd with mixed types + runAllSettled', async () => {
      const errorPromise = new Error('promise rejected settle meta');
      const errorSync = new Error('sync throw settle meta');
      const errorAsync = new Error('async reject settle meta');

      type Meta = { callId: string };
      type Val = string;
      type Err = Error;

      const result = await concurrentCallsWithMetadata<Meta, Val, Err>()
        .resultifyAdd(
          {
            fn: () => Promise.resolve('ok promise'),
            metadata: { callId: 'p1' },
          },
          {
            fn: () => Promise.reject(errorPromise),
            metadata: { callId: 'p2' },
          },
          { fn: () => 'ok sync', metadata: { callId: 's1' } },
          {
            fn: () => {
              throw errorSync;
            },
            metadata: { callId: 's2' },
          },
          { fn: async () => 'ok async', metadata: { callId: 'a1' } },
          {
            fn: async () => {
              throw errorAsync;
            },
            metadata: { callId: 'a2' },
          },
        )
        .runAllSettled();

      expectType<
        TestTypeIsEqual<
          typeof result,
          {
            allFailed: boolean;
            failed: { error: Err; metadata: Meta }[];
            succeeded: { value: Val; metadata: Meta }[];
            total: number;
            results: (
              | { ok: true; value: Val; metadata: Meta; error: false }
              | { ok: false; error: Err; metadata: Meta }
            )[];
            aggregatedError: AggregateError | null;
          }
        >
      >();

      expect(
        result.succeeded.sort((a, b) =>
          a.metadata.callId.localeCompare(b.metadata.callId),
        ),
      ).toEqual(
        [
          { value: 'ok async', metadata: { callId: 'a1' } },
          { value: 'ok promise', metadata: { callId: 'p1' } },
          { value: 'ok sync', metadata: { callId: 's1' } },
        ].sort((a, b) => a.metadata.callId.localeCompare(b.metadata.callId)),
      );

      expect(
        result.failed.sort((a, b) =>
          a.metadata.callId.localeCompare(b.metadata.callId),
        ),
      ).toEqual(
        [
          { error: errorAsync, metadata: { callId: 'a2' } },
          { error: errorPromise, metadata: { callId: 'p2' } },
          { error: errorSync, metadata: { callId: 's2' } },
        ].sort((a, b) => a.metadata.callId.localeCompare(b.metadata.callId)),
      );

      expect(result.allFailed).toBe(false);
      expect(result.total).toBe(6);
      assert(result.aggregatedError);
      expect(result.aggregatedError.errors.length).toBe(3);

      const expectedResults = [
        {
          ok: true,
          value: 'ok promise',
          metadata: { callId: 'p1' },
          error: false,
        },
        { ok: false, error: errorPromise, metadata: { callId: 'p2' } },
        {
          ok: true,
          value: 'ok sync',
          metadata: { callId: 's1' },
          error: false,
        },
        { ok: false, error: errorSync, metadata: { callId: 's2' } },
        {
          ok: true,
          value: 'ok async',
          metadata: { callId: 'a1' },
          error: false,
        },
        { ok: false, error: errorAsync, metadata: { callId: 'a2' } },
      ].sort((a, b) => a.metadata.callId.localeCompare(b.metadata.callId));

      // Sort actual results by metadata.callId to ensure consistent comparison
      const sortedActualResults = [...result.results].sort((a, b) =>
        a.metadata.callId.localeCompare(b.metadata.callId),
      );
      expect(sortedActualResults).toEqual(expectedResults);
    });
  });
});
