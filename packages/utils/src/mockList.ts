import { invariant } from './assertions';

type ItemProps = {
  index: number;
  id: number;
  onEvery: <T, O = undefined>(index: number, value: T, otherwise?: O) => T | O;
  onEven: <T, O = undefined>(value: T, otherwise?: O) => T | O;
  atIndex: <T, O = undefined>(index: number, value: T, otherwise?: O) => T | O;
  atId: <T, O = undefined>(id: number, value: T, otherwise?: O) => T | O;
  cycle: <V, T = V>(valuesToCycle: V[], getValue?: (v: V) => T) => T;
  afterOrEqualIndex: <T>(
    index: number,
    value: T,
    otherwise?: T,
  ) => T | undefined;
  afterOrEqualId: <T, O = undefined>(
    id: number,
    value: T,
    otherwise?: O,
  ) => T | O;
};

export function mockList<T>(
  size: number,
  getItems: (itemProps: ItemProps) => T,
): T[] {
  return Array.from({ length: size }, (_, index) =>
    getItems({
      index,
      id: index + 1,
      onEvery: (everyIndex, value, otherwise) => {
        if (index % everyIndex === 0) return value;

        return otherwise as any;
      },
      onEven: (value, otherwise) => {
        if (index % 2 === 0) return value;

        return otherwise as any;
      },
      atIndex: (i, value, otherwise) => {
        if (i === index) return value;

        return otherwise as any;
      },
      cycle: (valuesToCycle, getValue) => {
        const cycleValue = valuesToCycle[index % valuesToCycle.length];

        invariant(cycleValue !== undefined);

        return (getValue ? getValue(cycleValue) : cycleValue) as any;
      },
      afterOrEqualIndex: (i, value, otherwise) => {
        if (index >= i) return value;

        return otherwise as any;
      },
      afterOrEqualId: (id, value, otherwise) => {
        if (index + 1 >= id) return value;

        return otherwise as any;
      },
      atId: (id, value, otherwise) => {
        if (index + 1 === id) return value;

        return otherwise as any;
      },
    }),
  );
}
