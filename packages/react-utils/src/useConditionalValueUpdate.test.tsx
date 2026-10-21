import { act, render, renderHook } from '@testing-library/react';
import { startTransition, Suspense, use, useState } from 'react';
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

test('ignores values accepted by renders that were never committed', async () => {
  type State = { value: string | null; suspend: boolean };

  const neverResolves = new Promise<never>(() => {});
  const controls: { setState: (state: State) => void } = {
    setState: () => {},
  };

  function Value({ value, suspend }: State) {
    const lastValue = useConditionalValueUpdate(
      value,
      (_, next) => next !== null,
    );

    if (suspend) use(neverResolves);

    return <div data-testid="value">{lastValue}</div>;
  }

  function App() {
    const [state, setState] = useState<State>({ value: 'a', suspend: false });
    controls.setState = setState;

    return (
      <Suspense fallback="loading">
        <Value {...state} />
      </Suspense>
    );
  }

  const { getByTestId } = render(<App />);
  expect(getByTestId('value').textContent).toBe('a');

  // the transition suspends, so React keeps showing the committed UI
  await act(async () => {
    startTransition(() => {
      controls.setState({ value: 'b', suspend: true });
    });
  });
  expect(getByTestId('value').textContent).toBe('a');

  await act(async () => {
    controls.setState({ value: null, suspend: false });
  });
  expect(getByTestId('value').textContent).toBe('a');
});
