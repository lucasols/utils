import { describe, expect, test } from 'vitest';
import { invariant } from './assertions';
import { Result, resultify } from './rsResult';
import { sleep } from './sleep';
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
    Result.err(['string']).unwrap();
  }).toThrowErrorMatchingInlineSnapshot(`[Error: ["string"]]`);
});

test('resultify should return a normalized error', () => {
  const errorToThrow = new Error('Cannot divide by zero');

  const result = resultify(() => {
    throw errorToThrow;
  });

  invariant(!result.ok);

  expect(result.error).toMatchInlineSnapshot(`[Error: Cannot divide by zero]`);

  expect(result.error.stack).toEqual(errorToThrow.stack);
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
