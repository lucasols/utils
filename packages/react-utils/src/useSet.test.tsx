import { act, render, renderHook } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { useSet } from './useSet';

afterEach(() => {
  vi.restoreAllMocks();
});

test('adds, deletes and toggles items without duplicates', () => {
  const { result } = renderHook(() => useSet<string>(['a']));

  act(() => {
    result.current.add('b');
    result.current.add('b');
  });
  expect(result.current.array).toEqual(['a', 'b']);
  expect(result.current.has('b')).toBe(true);

  act(() => {
    result.current.delete('a');
  });
  expect(result.current.array).toEqual(['b']);

  act(() => {
    result.current.toggle('b');
    result.current.toggle('c');
  });
  expect(result.current.array).toEqual(['c']);

  act(() => {
    result.current.addOrDelete('d', true);
    result.current.addOrDelete('c', false);
    result.current.addOrDelete('e', null);
  });
  expect(result.current.array).toEqual(['d']);

  act(() => {
    result.current.set(['x', 'y']);
  });
  expect(result.current.array).toEqual(['x', 'y']);
});

test('accepts a lazy initial value', () => {
  const { result } = renderHook(() => useSet(() => [1, 2]));

  expect(result.current.array).toEqual([1, 2]);
});

test('calls onUpdate with the new values', () => {
  const onUpdate = vi.fn();

  const { result } = renderHook(() => useSet<number>([], { onUpdate }));

  act(() => {
    result.current.add(1);
  });

  expect(onUpdate).toHaveBeenLastCalledWith([1]);
});

test('onUpdate can update a parent state during multiple changes in one event', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  const onUpdateCalls: number[][] = [];
  const controls: { add: (item: number) => void } = { add: () => {} };

  function Child({ onUpdate }: { onUpdate: (values: number[]) => void }) {
    const set = useSet<number>([], { onUpdate });
    controls.add = set.add;
    return <div data-testid="child">{set.array.join(',')}</div>;
  }

  function Parent() {
    const [parentValues, setParentValues] = useState<number[]>([]);

    return (
      <>
        <div data-testid="parent">{parentValues.join(',')}</div>
        <Child
          onUpdate={(values) => {
            onUpdateCalls.push(values);
            setParentValues(values);
          }}
        />
      </>
    );
  }

  const { getByTestId } = render(<Parent />);

  act(() => {
    controls.add(1);
    controls.add(2);
  });

  expect(consoleError).not.toHaveBeenCalled();
  expect(onUpdateCalls).toEqual([[1], [1, 2]]);
  expect(getByTestId('child').textContent).toBe('1,2');
  expect(getByTestId('parent').textContent).toBe('1,2');
});

test('calls onUpdate once per change in strict mode', () => {
  const onUpdate = vi.fn();

  const { result } = renderHook(() => useSet<number>([], { onUpdate }), {
    wrapper: StrictMode,
  });

  act(() => {
    result.current.add(1);
  });
  act(() => {
    result.current.toggle(1);
  });

  expect(onUpdate.mock.calls).toEqual([[[1]], [[]]]);
});

test('does not call onUpdate when nothing changed', () => {
  const onUpdate = vi.fn();

  const { result } = renderHook(() => useSet<number>([1], { onUpdate }));

  act(() => {
    result.current.add(1);
  });

  expect(onUpdate).not.toHaveBeenCalled();
});
