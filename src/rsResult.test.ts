import { describe, expect, test } from 'vitest';
import { invariant } from './assertions';
import {
  NormalizedError,
  NormalizedErrorWithMetadata,
  Result,
  resultify,
} from './rsResult';
import { sleep } from './sleep';
import { Equal, expectType } from './internalUtils/typingTestUtils';

function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return Result.normalizedErr('Cannot divide by zero');
  }

  return Result.ok(a / b);
}

test('basic functioning', () => {
  expect(divide(10, 2)).toEqual(Result.ok(5));

  const wrongResult = divide(10, 0);

  expect(!wrongResult.ok && wrongResult.error).toMatchInlineSnapshot(
    '[NormalizedError: Cannot divide by zero]',
  );

  expect(divide(10, 0).unwrapOrNull()).toEqual(null);

  expect(divide(10, 0).unwrapOr(0)).toEqual(0);

  expect(() => divide(10, 0).unwrap()).toThrowErrorMatchingInlineSnapshot(
    `[NormalizedError: Cannot divide by zero]`,
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
    '[NormalizedError: Cannot divide by zero]',
  );
});

test('result.unwrap()', () => {
  const noError = divide(10, 2).unwrap();

  expectType<Equal<typeof noError, number>>();

  expect(noError).toEqual(5);

  expect(() => divide(10, 0).unwrap()).toThrowErrorMatchingInlineSnapshot(
    `[NormalizedError: Cannot divide by zero]`,
  );
});

test('resultify should return a normalized error', () => {
  const result = resultify(() => {
    throw new Error('Cannot divide by zero');
  });

  invariant(!result.ok);

  expect(result.error).toMatchInlineSnapshot(
    '[NormalizedError: Cannot divide by zero]',
  );

  expect(result.error.cause).toMatchInlineSnapshot(
    '[Error: Cannot divide by zero]',
  );
});

test('normalized error toString and toJSON', () => {
  const err = new NormalizedError({
    id: 'testError',
    message: 'Cannot divide by zero',
    cause: new Error('Cannot divide by zero'),
    metadata: { hello: 'world' },
  });

  expect(err.toString()).toMatchInlineSnapshot(`
    "testError: Cannot divide by zero
      Caused by: Error: Cannot divide by zero
      Metadata: {"hello":"world"}"
  `);

  expect(String(err)).toMatchInlineSnapshot(`
    "testError: Cannot divide by zero
      Caused by: Error: Cannot divide by zero
      Metadata: {"hello":"world"}"
  `);

  expect(JSON.stringify(err, null, 2)).toMatchInlineSnapshot(`
    "{
      "id": "testError",
      "message": "Cannot divide by zero",
      "metadata": {
        "hello": "world"
      },
      "code": 0,
      "cause": "Error: Cannot divide by zero"
    }"
  `);

  expect(
    String(
      new NormalizedError({
        code: 404,
        id: 'notFound',
        message: 'Not found',
      }),
    ),
  ).toMatchInlineSnapshot(`"404#notFound: Not found"`);
});

test('normalized error with metadata', () => {
  const err = new NormalizedErrorWithMetadata<'testMetadata'>({
    id: 'testError',
    message: 'Cannot divide by zero',
    cause: new Error('Cannot divide by zero'),
    metadata: 'testMetadata',
  });

  expect(err.toString()).toMatchInlineSnapshot(`
    "testError: Cannot divide by zero
      Caused by: Error: Cannot divide by zero
      Metadata: "testMetadata""
  `);

  // NormalizedErrorWithMetadata should be assignable to NormalizedError type
  const _normalizedErr: NormalizedError = err;
});

test('Appending metadata to a normalized error', () => {
  const baseErr = new NormalizedError({
    id: 'base error',
    message: 'Base error',
    cause: new Error('Cannot divide by zero'),
  });

  const errWithBaseErr = new NormalizedErrorWithMetadata({
    error: baseErr,
    metadata: 'appended metadata',
  });

  expect(errWithBaseErr.toString()).toMatchInlineSnapshot(`
    "base error: Base error
      Caused by: Error: Cannot divide by zero
      Metadata: "appended metadata""
  `);

  expect(baseErr.stack).toEqual(errWithBaseErr.stack);
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

describe('normalized error result', () => {
  test('append metadata to existing normalized error', () => {
    const wrongResult = divide(10, 0);

    if (!wrongResult.ok) {
      const result = wrongResult.normalizedErrorResult({
        withMetadata: 'appended metadata',
      });

      invariant(!result.ok);

      expect(result.error.toJSON()).toMatchInlineSnapshot(`
        {
          "cause": undefined,
          "code": 0,
          "id": "unknown",
          "message": "Cannot divide by zero",
          "metadata": "appended metadata",
        }
      `);

      expect(result.error.stack).toEqual(wrongResult.error.stack);
    }
  });

  test('normalized error result with cause', () => {
    const wrongResult = divide(10, 0);

    if (!wrongResult.ok) {
      const result = wrongResult.normalizedErrorResult({
        id: 'Error',
        message: 'Parent error',
      });

      invariant(!result.ok);

      expect(result.error.toJSON()).toMatchInlineSnapshot(`
        {
          "cause": [NormalizedError: Cannot divide by zero],
          "code": 0,
          "id": "Error",
          "message": "Parent error",
          "metadata": undefined,
        }
      `);

      expect(result.error.stack).not.toEqual(wrongResult.error.stack);
    }
  });
});

test('Result.unwrap() async results', async () => {
  async function divideAsync(a: number, b: number): Promise<Result<number>> {
    await sleep(10);

    if (b === 0) {
      return Result.normalizedErr('Cannot divide by zero');
    }

    return Result.ok(a / b);
  }

  const result = await Result.unwrap(divideAsync(10, 2));

  expectType<Equal<typeof result, number>>();

  expect(result).toEqual(5);
});

test('Result.unwrap() should accept only Error instances', async () => {
  const fnWithWrongResult = async (): Promise<Result<number, string>> => {
    return Promise.resolve(Result.err('error'));
  };

  // @ts-expect-error - only Result<any, Error> should be accepted
  Result.unwrap(fnWithWrongResult());

  expect(async () => {
    // @ts-expect-error - only Result<any, Error> should be accepted
    (await fnWithWrongResult()).unwrap();
  }).rejects.toThrow();
});

test('Result.normalizedErr() error with metadata', () => {
  expect(
    Result.normalizedErr({
      id: 'testError',
      message: 'Cannot divide by zero',
      metadata: 'testMetadata',
    }).error.toJSON(),
  ).toMatchInlineSnapshot(`
    {
      "cause": undefined,
      "code": 0,
      "id": "testError",
      "message": "Cannot divide by zero",
      "metadata": "testMetadata",
    }
  `);

  expect(
    Result.normalizedErr('id', 'message', 0, 'testMetadata').error.toJSON(),
  ).toMatchInlineSnapshot(`
    {
      "cause": undefined,
      "code": 0,
      "id": "id",
      "message": "message",
      "metadata": "testMetadata",
    }
  `);
});
