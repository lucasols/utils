import { act, render, renderHook } from '@testing-library/react';
import { Activity, startTransition, Suspense, use, useState } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { usePreventMultipleConsecutiveChanges } from './usePreventMultipleConsecutiveChanges';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test('returns true until the min time between changes has passed', () => {
  const { result, rerender } = renderHook(
    ({ changeKey }) => usePreventMultipleConsecutiveChanges(changeKey, 1000),
    { initialProps: { changeKey: 'a' } },
  );

  expect(result.current).toBe(false);

  act(() => {
    vi.advanceTimersByTime(200);
  });
  rerender({ changeKey: 'b' });

  expect(result.current).toBe(true);

  act(() => {
    vi.advanceTimersByTime(799);
  });
  expect(result.current).toBe(true);

  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(result.current).toBe(false);
});

test('returns false when the changes are far enough apart', () => {
  const { result, rerender } = renderHook(
    ({ changeKey }) => usePreventMultipleConsecutiveChanges(changeKey, 1000),
    { initialProps: { changeKey: 'a' } },
  );

  act(() => {
    vi.advanceTimersByTime(1000);
  });
  rerender({ changeKey: 'b' });

  expect(result.current).toBe(false);
});

test('ignores falsy change keys', () => {
  const initialProps: { changeKey: string | null } = { changeKey: 'a' };

  const { result, rerender } = renderHook(
    ({ changeKey }) => usePreventMultipleConsecutiveChanges(changeKey, 1000),
    { initialProps },
  );

  rerender({ changeKey: null });
  rerender({ changeKey: 'a' });

  expect(result.current).toBe(false);
});

test('ignores key changes from renders that were never committed', async () => {
  type State = { changeKey: string; suspend: boolean };

  const neverResolves = new Promise<never>(() => {});
  const controls: { setState: (state: State) => void } = { setState: () => {} };

  function Loading({ changeKey, suspend }: State) {
    const isLoading = usePreventMultipleConsecutiveChanges(changeKey, 1000);

    if (suspend) use(neverResolves);

    return <div data-testid="loading">{isLoading ? 'yes' : 'no'}</div>;
  }

  function App() {
    const [state, setState] = useState<State>({
      changeKey: 'a',
      suspend: false,
    });
    controls.setState = setState;

    return (
      <Suspense fallback="loading">
        <Loading {...state} />
      </Suspense>
    );
  }

  const { getByTestId } = render(<App />);
  expect(getByTestId('loading').textContent).toBe('no');

  act(() => {
    vi.advanceTimersByTime(200);
  });

  // the transition suspends, so React keeps showing the committed UI
  await act(async () => {
    startTransition(() => {
      controls.setState({ changeKey: 'b', suspend: true });
    });
  });
  expect(getByTestId('loading').textContent).toBe('no');

  act(() => {
    vi.advanceTimersByTime(100);
  });

  await act(async () => {
    controls.setState({ changeKey: 'a', suspend: false });
  });
  expect(getByTestId('loading').textContent).toBe('no');

  act(() => {
    vi.advanceTimersByTime(1000);
  });
  expect(getByTestId('loading').textContent).toBe('no');
});

test('starts the clear timeout when the change commits', () => {
  const { result, rerender } = renderHook(
    ({ changeKey }) => usePreventMultipleConsecutiveChanges(changeKey, 1000),
    { initialProps: { changeKey: 'a' } },
  );

  act(() => {
    vi.advanceTimersByTime(600);
  });
  rerender({ changeKey: 'b' });
  expect(result.current).toBe(true);

  act(() => {
    vi.advanceTimersByTime(300);
  });
  rerender({ changeKey: 'c' });
  expect(result.current).toBe(true);

  // 'c' was committed 300ms after 'b', so the loading lasts 700ms more
  act(() => {
    vi.advanceTimersByTime(699);
  });
  expect(result.current).toBe(true);

  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(result.current).toBe(false);
});

test('does not stay loading when the change crosses the min time between renders', () => {
  const { result, rerender } = renderHook(
    ({ changeKey }) => usePreventMultipleConsecutiveChanges(changeKey, 1000),
    { initialProps: { changeKey: 'a' } },
  );

  // the render with the new key sees a fast change and sets the loading, the
  // re-render it causes (and its commit) already sees a slow one
  const startTime = Date.now();
  vi.spyOn(Date, 'now')
    .mockReturnValueOnce(startTime + 999)
    .mockReturnValue(startTime + 1000);

  rerender({ changeKey: 'b' });

  expect(result.current).toBe(false);

  act(() => {
    vi.advanceTimersByTime(10_000);
  });

  expect(result.current).toBe(false);

  vi.restoreAllMocks();
});

test('ends the loading after a hidden activity is shown again', () => {
  let isLoading: boolean | undefined;

  function Content({ changeKey }: { changeKey: string }) {
    isLoading = usePreventMultipleConsecutiveChanges(changeKey, 1000);
    return null;
  }

  function App({
    changeKey,
    mode,
  }: {
    changeKey: string;
    mode: 'visible' | 'hidden';
  }) {
    return (
      <Activity mode={mode}>
        <Content changeKey={changeKey} />
      </Activity>
    );
  }

  const { rerender } = render(
    <App
      changeKey="a"
      mode="visible"
    />,
  );

  act(() => {
    vi.advanceTimersByTime(200);
  });
  rerender(
    <App
      changeKey="b"
      mode="visible"
    />,
  );
  expect(isLoading).toBe(true);

  // hiding destroys the effects, including the timeout that ends the loading
  rerender(
    <App
      changeKey="b"
      mode="hidden"
    />,
  );
  act(() => {
    vi.advanceTimersByTime(2000);
  });

  rerender(
    <App
      changeKey="b"
      mode="visible"
    />,
  );
  act(() => {
    vi.advanceTimersByTime(0);
  });

  expect(isLoading).toBe(false);
});
