import { renderHook } from '@testing-library/react';
import { expect, test } from 'vitest';
import { useConditionalValueUpdate } from './useConditionalValueUpdate';

test('only updates the value when the condition is met', () => {
  const { result, rerender } = renderHook(
    ({ value }) =>
      useConditionalValueUpdate(value, (prev, next) => next > prev),
    { initialProps: { value: 1 } },
  );

  expect(result.current).toBe(1);

  rerender({ value: 3 });
  expect(result.current).toBe(3);

  rerender({ value: 2 });
  expect(result.current).toBe(3);

  rerender({ value: 5 });
  expect(result.current).toBe(5);
});

test('uses the initial value as the first valid value', () => {
  const initialProps: { value: string | null } = { value: null };

  const { result, rerender } = renderHook(
    ({ value }) =>
      useConditionalValueUpdate(value, (_, next) => next !== null, 'initial'),
    { initialProps },
  );

  expect(result.current).toBe('initial');

  rerender({ value: 'next' });
  expect(result.current).toBe('next');

  rerender({ value: null });
  expect(result.current).toBe('next');
});
