import { expect, test } from 'vitest';
import { invariant } from './assertions';
import {
  NormalizedError,
  NormalizedErrorWithMetadata,
  Result,
  resultify,
} from './rsResult';

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
    '"Cannot divide by zero"',
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
      Metadata: {\\"hello\\":\\"world\\"}"
  `);

  expect(String(err)).toMatchInlineSnapshot(`
    "testError: Cannot divide by zero
      Caused by: Error: Cannot divide by zero
      Metadata: {\\"hello\\":\\"world\\"}"
  `);

  expect(JSON.stringify(err, null, 2)).toMatchInlineSnapshot(`
    "{
      \\"id\\": \\"testError\\",
      \\"message\\": \\"Cannot divide by zero\\",
      \\"metadata\\": {
        \\"hello\\": \\"world\\"
      },
      \\"cause\\": \\"Error: Cannot divide by zero\\"
    }"
  `);
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
      Metadata: \\"testMetadata\\""
  `);

  // NormalizedErrorWithMetadata should be assignable to NormalizedError type
  const normalizedErr: NormalizedError = err;

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
      Metadata: \\"appended metadata\\""
  `);
});
