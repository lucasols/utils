import { describe, expect, test } from 'vitest';
import { invariant } from './assertions';
import { sleep } from './sleep';
import { Result, resultify, type GetTypedResult } from './tsResult';
import { TestTypeIsEqual, typingTest } from './typingTestUtils';

const { expectType } = typingTest;

function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return Result.err(new Error('Cannot divide by zero'));
  }

  return Result.ok(a / b);
}

async function divideAsync(a: number, b: number): Promise<Result<number>> {
  await sleep(10);

  if (b === 0) {
    return Result.err(new Error('Cannot divide by zero'));
  }

  return Result.ok(a / b);
}

test('basic functioning', () => {
  expect(divide(10, 2)).toEqual(Result.ok(5));

  const wrongResult = divide(10, 0);

  expect(!wrongResult.ok && wrongResult.error).toMatchInlineSnapshot(
    `[Error: Cannot divide by zero]`,
  );

  expect(divide(10, 0).unwrapOrNull()).toEqual(null);

  expect(divide(10, 0).unwrapOr(0)).toEqual(0);

  expect(() => divide(10, 0).unwrap()).toThrowErrorMatchingInlineSnapshot(
    `[Error: Cannot divide by zero]`,
  );
});

test('rethrowing error results', () => {
  function divideBy(a: number, b: number) {
    const result = divide(a, b);

    if (!result.ok) return result.errorResult();

    return result;
  }

  expect(divideBy(10, 2)).toEqual(Result.ok(5));

  const wrongResult = divideBy(10, 0);

  expect(!wrongResult.ok && wrongResult.error).toMatchInlineSnapshot(
    `[Error: Cannot divide by zero]`,
  );
});

test('result.unwrap()', () => {
  const noError = divide(10, 2).unwrap();

  expectType<TestTypeIsEqual<typeof noError, number>>();

  expect(noError).toEqual(5);

  expect(() => divide(10, 0).unwrap()).toThrowErrorMatchingInlineSnapshot(
    `[Error: Cannot divide by zero]`,
  );

  expect(() => {
    const errResult: Result<any, [string]> = Result.err(['string']);

    errResult.unwrap();
  }).toThrowErrorMatchingInlineSnapshot(`[Error: ["string"]]`);
});

test('resultify should return a normalized error', () => {
  const errorToThrow = new Error('Cannot divide by zero');

  const result = resultify((): number => {
    throw errorToThrow;
  });

  expectType<TestTypeIsEqual<typeof result, Result<number, Error>>>();

  invariant(!result.ok);

  expect(result.error).toMatchInlineSnapshot(`[Error: Cannot divide by zero]`);

  expect(result.error.stack).toEqual(errorToThrow.stack);
});

test('resultify should handle async functions', async () => {
  // Test successful case
  const successResult = await resultify(async () => {
    await sleep(10);
    return 42;
  });

  expectType<TestTypeIsEqual<typeof successResult, Result<number, Error>>>();

  expect(successResult.ok).toBe(true);
  invariant(successResult.ok);
  expect(successResult.value).toBe(42);

  // Test error case
  const errorToThrow = new Error('Async error');
  const errorResult = await resultify(async () => {
    await sleep(10);
    throw errorToThrow;
  });

  expect(errorResult.ok).toBe(false);
  invariant(!errorResult.ok);
  expect(errorResult.error).toMatchObject({
    message: 'Async error',
  });
  expect(errorResult.error.stack).toEqual(errorToThrow.stack);
});

test('resultify should handle external promises', async () => {
  async function fetchData(throwError?: boolean): Promise<number> {
    if (throwError) {
      throw new Error('Error');
    }

    return Promise.resolve(42);
  }

  const result = await resultify(fetchData());

  expectType<TestTypeIsEqual<typeof result, Result<number, Error>>>();

  expect(result.ok).toBe(true);
  invariant(result.ok);
  expect(result.value).toBe(42);

  const result2 = await resultify(fetchData(true));

  expect(result2.ok).toBe(false);
  invariant(!result2.ok);
  expect(result2.error).toMatchObject({
    message: 'Error',
  });
});

test('resultify should handle async functions with custom error normalizer', async () => {
  const errorResult = await resultify(
    async () => {
      await sleep(10);
      throw 'Custom error';
    },
    (err) => [`Normalized: ${err}`],
  );

  expect(errorResult.ok).toBe(false);
  invariant(!errorResult.ok);
  expect(errorResult.error).toEqual(['Normalized: Custom error']);
});

test('Result.ok() should return a void result', () => {
  function voidFn(): Result<void> {
    return Result.ok();
  }

  const result = voidFn();

  invariant(result.ok);

  expect(result.value).toEqual(undefined);

  // void should be assignable to void
  const _result2: void = result.value;
  const _result3: void = result.unwrap();
});

test('Result.unwrap() async results', async () => {
  const result = await Result.asyncUnwrap(divideAsync(10, 2));

  expectType<TestTypeIsEqual<typeof result, number>>();

  expect(result).toEqual(5);
});

test('Result.unknownToError() error', () => {
  expect(
    Result.unknownToError({
      id: 'testError',
      message: 'Cannot divide by zero',
      metadata: { testMetadata: 'testMetadata' },
    }).error,
  ).toMatchInlineSnapshot(`[Error: Cannot divide by zero]`);

  expect(
    Result.unknownToError(new Error('Cannot divide by zero')).error,
  ).toMatchInlineSnapshot(`[Error: Cannot divide by zero]`);

  expect(
    Result.unknownToError('Cannot divide by zero').error,
  ).toMatchInlineSnapshot(`[Error: Cannot divide by zero]`);
});

describe('Result.map*', () => {
  test('map ok result', () => {
    const successDivision = divide(10, 2);

    expect(successDivision.mapOk((value) => value * 3)).toEqual(Result.ok(15));
  });

  test('map err result', () => {
    const failureDivision = divide(10, 0);

    expect(
      failureDivision.mapErr((error) => [`Mapped err: ${error.message}`]).error,
    ).toEqual(['Mapped err: Cannot divide by zero']);
  });

  test('map ok and err result', () => {
    const failureDivision = divide(10, 0);

    const mapOkAndErr = {
      ok: (value: number) => value * 3,
      err: (error: Error) => [`Mapped err: ${error.message}`],
    };

    expect(failureDivision.mapOkAndErr(mapOkAndErr).error).toEqual([
      'Mapped err: Cannot divide by zero',
    ]);

    const successDivision = divide(10, 2);

    expect(successDivision.mapOkAndErr(mapOkAndErr).unwrapOrNull()).toEqual(15);
  });
});

describe('Result.asyncMap()', () => {
  test('map ok result', async () => {
    const successDivision = divideAsync(10, 2);

    expect(
      await Result.asyncMap(successDivision).ok((value) => value * 3),
    ).toEqual(Result.ok(15));
  });

  test('map err result', async () => {
    const failureDivision = divideAsync(10, 0);

    expect(
      (
        await Result.asyncMap(failureDivision).err((error) => [
          `Mapped err: ${error.message}`,
        ])
      ).error,
    ).toEqual(['Mapped err: Cannot divide by zero']);
  });

  test('map ok and err result', async () => {
    const failureDivision = divideAsync(10, 0);

    const mapOkAndErr = {
      ok: (value: number) => value * 3,
      err: (error: Error) => [`Mapped err: ${error.message}`],
    };

    expect(
      (await Result.asyncMap(failureDivision).okAndErr(mapOkAndErr)).error,
    ).toEqual(['Mapped err: Cannot divide by zero']);

    const successDivision = divideAsync(10, 2);

    expect(
      (
        await Result.asyncMap(successDivision).okAndErr(mapOkAndErr)
      ).unwrapOrNull(),
    ).toEqual(15);
  });
});

typingTest.test('wrong return err type', () => {
  function _divide(a: number, b: number): Result<number, Error> {
    if (b === 0) {
      // @ts-expect-error -- invalid return type
      return Result.err(['Cannot divide by zero']);
    }

    return Result.ok(a / b);
  }
});

typingTest.test('wrong return ok type', () => {
  function _divide(a: number, b: number): Result<number, Error> {
    if (b === 0) {
      return Result.err(new Error('Cannot divide by zero'));
    }

    // @ts-expect-error -- invalid return type
    return Result.ok('Cannot divide by zero');
  }
});

typingTest.test('any ok type should not allow wrong err type', () => {
  function _divide(a: number, b: number): Result<number, Error> {
    if (b === 0) {
      // @ts-expect-error -- invalid return type
      return Result.err(new Error(['Cannot divide by zero']));
    }

    return Result.ok(a as any);
  }
});

typingTest.test('any ok type should not allow wrong err type', () => {
  function _divide(a: number, b: number): Result<any, Error> {
    if (b === 0) {
      // @ts-expect-error -- invalid return type
      return Result.err(new Error({ err: 'Cannot divide by zero' }));
    }

    return Result.ok(a as any);
  }
});

typingTest.test('any err type should not allow wrong ok type', () => {
  function _divide(a: number, b: number): Result<number, any> {
    if (b === 0) {
      return Result.err({ err: 'Cannot divide by zero' });
    }

    // @ts-expect-error -- invalid return type
    return Result.ok(a.toString());
  }
});

describe('getOkErr', () => {
  test('create from Ok Err pair', async () => {
    const typedResult = Result.getOkErr<{ a: 'test' }>();

    async function fetchData(ok: boolean): Promise<typeof typedResult._type> {
      return Promise.resolve(
        ok ?
          typedResult.ok({ a: 'test' })
        : typedResult.err(new Error('Error')),
      );
    }

    const res = (await fetchData(true)).unwrap();
    //     ^?

    expect(res).toEqual({ a: 'test' });

    expectType<TestTypeIsEqual<typeof res, { a: 'test' }>>();

    const res2 = await fetchData(false);
    //     ^?

    expect(!res2.ok && res2.error.message).toEqual('Error');
  });

  test('create from sync function', () => {
    function fetchData(isOk: boolean): Result<{ a: 'test' }, Error> {
      const { ok, err } = Result.getOkErr<typeof fetchData>();

      const _wrongOk = ok({
        // @ts-expect-error -- invalid return type
        a: 'tests',
      });

      const result = isOk ? ok({ a: 'test' }) : err(new Error('Error'));

      return result;
    }

    const res = fetchData(true).unwrap();
    //     ^?

    expect(res).toEqual({ a: 'test' });

    expectType<TestTypeIsEqual<typeof res, { a: 'test' }>>();

    const res2 = fetchData(false);
    //     ^?

    expect(!res2.ok && res2.error.message).toEqual('Error');
  });

  test('create from async function', async () => {
    async function fetchData(
      isOk: boolean,
    ): Promise<Result<{ a: 'test' }, Error>> {
      const { ok, err } = Result.getOkErr<typeof fetchData>();

      return Promise.resolve(
        isOk ? ok({ a: 'test' }) : err(new Error('Error')),
      );
    }

    expect((await fetchData(true)).ok).toEqual(true);

    expect((await fetchData(false)).error).toBeTruthy();
  });

  typingTest.test('get typed result from result', () => {
    type ResultType = Result<{ a: 'test' }, true>;

    const _typedResult = Result.getOkErr<ResultType>();

    type TypedResultType = GetTypedResult<ResultType>;

    expectType<TestTypeIsEqual<typeof _typedResult._type, ResultType>>();
    expectType<
      TestTypeIsEqual<typeof _typedResult._type, TypedResultType['_type']>
    >();
  });
});

typingTest.test('Usage without explicit return type', () => {
  function foo(isOk: boolean) {
    if (isOk) {
      return Result.ok('test');
    }

    return Result.err(new Error('Error'));
  }

  const result = foo(true);

  if (result.ok) {
    expectType<TestTypeIsEqual<typeof result.value, string>>();
    expectType<TestTypeIsEqual<typeof result.error, false>>();
  } else {
    expectType<TestTypeIsEqual<typeof result.error, Error>>();
  }

  // result methods are not available
  // @ts-expect-error -- unwrap is not available
  result.unwrap();

  // @ts-expect-error -- mapOk is not available
  result.mapOk((value) => value);
});

describe('Result.ifOk() and Result.ifErr()', () => {
  test('ifOk for successful result', () => {
    const successDivision = divide(10, 2);
    let value = 0;

    successDivision.ifOk((result) => {
      value = result;
    });

    expectType<
      TestTypeIsEqual<typeof successDivision, Result<number, Error>>
    >();

    expect(value).toEqual(5);
    expect(successDivision.ok).toBe(true);
    expect(successDivision.ok && successDivision.value).toEqual(5);
  });

  test('ifOk with method chaining for successful result', () => {
    const successDivision = divide(10, 2);
    let okCalled = false;
    let errCalled = false;

    const result = successDivision
      .ifOk((result) => {
        okCalled = true;
        expect(result).toEqual(5);
      })
      .ifErr(() => {
        errCalled = true;
      });

    expectType<TestTypeIsEqual<typeof result, Result<number, Error>>>();

    expect(okCalled).toBe(true);
    expect(errCalled).toBe(false);
    expect(result.ok).toBe(true);
    expect(result.ok && result.value).toEqual(5);
  });

  test('ifErr for failed result', () => {
    const failedDivision = divide(10, 0);
    let errorMessage = '';

    failedDivision.ifErr((error) => {
      errorMessage = error.message;
    });

    expectType<TestTypeIsEqual<typeof failedDivision, Result<number, Error>>>();

    expect(errorMessage).toEqual('Cannot divide by zero');
    expect(failedDivision.ok).toBe(false);
    expect(!failedDivision.ok && failedDivision.error instanceof Error).toBe(
      true,
    );
    expect(!failedDivision.ok && failedDivision.error.message).toEqual(
      'Cannot divide by zero',
    );
  });

  test('ifErr with method chaining for failed result', () => {
    const failedDivision = divide(10, 0);
    let okCalled = false;
    let errCalled = false;

    const result = failedDivision
      .ifErr((error) => {
        errCalled = true;
        expect(error.message).toEqual('Cannot divide by zero');
      })
      .ifOk(() => {
        okCalled = true;
      });

    expectType<TestTypeIsEqual<typeof result, Result<number, Error>>>();

    expect(okCalled).toBe(false);
    expect(errCalled).toBe(true);
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error instanceof Error).toBe(true);
    expect(!result.ok && result.error.message).toEqual('Cannot divide by zero');
  });

  test('reversed chain order works correctly', () => {
    const successDivision = divide(10, 2);
    let okCalled = false;
    let errCalled = false;

    const result = successDivision
      .ifErr(() => {
        errCalled = true;
      })
      .ifOk((value) => {
        okCalled = true;
        expect(value).toEqual(5);
      });

    expect(okCalled).toBe(true);
    expect(errCalled).toBe(false);

    expectType<TestTypeIsEqual<typeof result, Result<number, Error>>>();
    expect(result.ok).toBe(true);
    expect(result.ok && result.value).toEqual(5);

    const failedDivision = divide(10, 0);
    okCalled = false;
    errCalled = false;

    const failedResult = failedDivision
      .ifOk(() => {
        okCalled = true;
      })
      .ifErr((error) => {
        errCalled = true;
        expect(error.message).toEqual('Cannot divide by zero');
      });

    expectType<TestTypeIsEqual<typeof failedResult, Result<number, Error>>>();
    expect(okCalled).toBe(false);
    expect(errCalled).toBe(true);
    expect(failedResult.ok).toBe(false);
    expect(!failedResult.ok && failedResult.error instanceof Error).toBe(true);
    expect(!failedResult.ok && failedResult.error.message).toEqual(
      'Cannot divide by zero',
    );
  });
});
