import { act, render, renderHook } from '@testing-library/react';
import { startTransition, Suspense, use, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { useMemoWithPrev } from './useMemoWithPrev';

test('recomputes when a dep changes and passes the previous value', () => {
  const factory = vi.fn((prev: number[] | undefined, item: number) => [
    ...(prev ?? []),
    item,
  ]);

  const { result, rerender } = renderHook(
    ({ item }) =>
      useMemoWithPrev(
        (prev: number[] | undefined) => factory(prev, item),
        [item],
      ),
    { initialProps: { item: 1 } },
  );

  expect(result.current).toEqual([1]);

  rerender({ item: 1 });
  expect(factory).toHaveBeenCalledTimes(1);

  rerender({ item: 2 });
  expect(result.current).toEqual([1, 2]);
  expect(factory).toHaveBeenCalledTimes(2);
});

test('keeps the previous value when the new one is deep equal', () => {
  const prevValues: ({ total: number } | undefined)[] = [];

  const { rerender } = renderHook(
    ({ dep }) =>
      useMemoWithPrev(
        (prev: { total: number } | undefined) => {
          prevValues.push(prev);
          return { total: dep > 0 ? 1 : 0 };
        },
        [dep],
      ),
    { initialProps: { dep: 1 } },
  );

  rerender({ dep: 2 });
  rerender({ dep: 3 });

  expect(prevValues[0]).toBeUndefined();
  expect(prevValues[1]).toEqual({ total: 1 });
  expect(prevValues[2]).toBe(prevValues[1]);
});

test('ignores the results of renders that were never committed', async () => {
  type State = { dep: string; suspend: boolean };

  const neverResolves = new Promise<never>(() => {});
  const controls: { setState: (state: State) => void } = { setState: () => {} };

  function Values({ dep, suspend }: State) {
    const values = useMemoWithPrev(
      (prev: string[] | undefined) => [...(prev ?? []), dep],
      [dep],
    );

    if (suspend) use(neverResolves);

    return <div data-testid="values">{values.join(',')}</div>;
  }

  function App() {
    const [state, setState] = useState<State>({ dep: 'a', suspend: false });
    controls.setState = setState;

    return (
      <Suspense fallback="loading">
        <Values {...state} />
      </Suspense>
    );
  }

  const { getByTestId } = render(<App />);
  expect(getByTestId('values').textContent).toBe('a');

  // the transition suspends, so React keeps showing the committed UI
  await act(async () => {
    startTransition(() => {
      controls.setState({ dep: 'b', suspend: true });
    });
  });
  expect(getByTestId('values').textContent).toBe('a');

  await act(async () => {
    controls.setState({ dep: 'a', suspend: false });
  });
  expect(getByTestId('values').textContent).toBe('a');
});
