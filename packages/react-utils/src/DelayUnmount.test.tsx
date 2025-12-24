import { sleep } from '@ls-stack/utils/sleep';
import { cleanup, render, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { DelayUnmount } from './DelayUnmount';

afterEach(() => {
  cleanup();
});

function ChildComponent({ value = 'Child Content' }: { value?: string }) {
  return <div data-testid="child">{value}</div>;
}

describe('DelayUnmount - Basic Rendering', () => {
  test('should render children when present', () => {
    const { container } = render(
      <DelayUnmount delay={100}>
        <ChildComponent />
      </DelayUnmount>,
    );

    const child = within(container).getByTestId('child');

    expect(child).toBeDefined();
    expect(child.textContent).toBe('Child Content');
  });

  test('should render null when children becomes null after delay', async () => {
    const { container, rerender } = render(
      <DelayUnmount delay={50}>
        <ChildComponent />
      </DelayUnmount>,
    );

    expect(within(container).queryByTestId('child')).not.toBeNull();

    rerender(<DelayUnmount delay={50}>{null}</DelayUnmount>);

    await sleep(60);
    await waitFor(() => {
      expect(within(container).queryByTestId('child')).toBeNull();
    });
  });

  test('should render null when initial children is null', () => {
    const { container } = render(
      <DelayUnmount delay={100}>{null}</DelayUnmount>,
    );

    expect(within(container).queryByTestId('child')).toBeNull();
  });

  test('should render null when initial children is false', () => {
    const { container } = render(
      <DelayUnmount delay={100}>{false as const}</DelayUnmount>,
    );

    expect(within(container).queryByTestId('child')).toBeNull();
  });
});

describe('DelayUnmount - Delay Behavior', () => {
  test('should keep previous children during delay period', async () => {
    const { container, rerender } = render(
      <DelayUnmount delay={100}>
        <ChildComponent />
      </DelayUnmount>,
    );

    expect(within(container).getByTestId('child')).toBeDefined();

    rerender(<DelayUnmount delay={100}>{null}</DelayUnmount>);

    await sleep(50);
    expect(within(container).queryByTestId('child')).not.toBeNull();
  });

  test('should unmount children after delay period', async () => {
    const { container, rerender } = render(
      <DelayUnmount delay={50}>
        <ChildComponent />
      </DelayUnmount>,
    );

    rerender(<DelayUnmount delay={50}>{null}</DelayUnmount>);

    await sleep(60);
    await waitFor(() => {
      expect(within(container).queryByTestId('child')).toBeNull();
    });
  });

  test('should respect different delay values', async () => {
    const { container, rerender } = render(
      <DelayUnmount delay={100}>
        <ChildComponent />
      </DelayUnmount>,
    );

    rerender(<DelayUnmount delay={100}>{null}</DelayUnmount>);

    await sleep(50);
    expect(within(container).queryByTestId('child')).not.toBeNull();

    await sleep(60);
    await waitFor(() => {
      expect(within(container).queryByTestId('child')).toBeNull();
    });
  });
});

describe('DelayUnmount - Rapid Toggling', () => {
  test('should update children immediately when they become truthy during delay', async () => {
    const { container, rerender } = render(
      <DelayUnmount delay={100}>
        <ChildComponent />
      </DelayUnmount>,
    );

    rerender(<DelayUnmount delay={100}>{null}</DelayUnmount>);

    await sleep(30);
    expect(within(container).queryByTestId('child')).not.toBeNull();

    rerender(
      <DelayUnmount delay={100}>
        <ChildComponent />
      </DelayUnmount>,
    );

    expect(within(container).queryByTestId('child')).not.toBeNull();

    await sleep(120);
    expect(within(container).queryByTestId('child')).not.toBeNull();
  });

  test('should cancel unmount when children become truthy during delay', async () => {
    const { container, rerender } = render(
      <DelayUnmount delay={50}>
        <ChildComponent />
      </DelayUnmount>,
    );

    rerender(<DelayUnmount delay={50}>{null}</DelayUnmount>);

    await sleep(20);

    rerender(
      <DelayUnmount delay={50}>
        <ChildComponent />
      </DelayUnmount>,
    );

    await sleep(50);

    expect(within(container).queryByTestId('child')).not.toBeNull();
  });

  test('should handle multiple rapid toggles ending with null', async () => {
    const { container, rerender } = render(
      <DelayUnmount delay={50}>
        <ChildComponent />
      </DelayUnmount>,
    );

    rerender(<DelayUnmount delay={50}>{null}</DelayUnmount>);
    rerender(
      <DelayUnmount delay={50}>
        <ChildComponent />
      </DelayUnmount>,
    );
    rerender(<DelayUnmount delay={50}>{null}</DelayUnmount>);

    await sleep(60);
    await waitFor(() => {
      expect(within(container).queryByTestId('child')).toBeNull();
    });
  });
});

describe('DelayUnmount - Edge Cases', () => {
  test('should handle zero delay', async () => {
    const { container, rerender } = render(
      <DelayUnmount delay={0}>
        <ChildComponent />
      </DelayUnmount>,
    );

    rerender(<DelayUnmount delay={0}>{null}</DelayUnmount>);

    await sleep(10);
    await waitFor(() => {
      expect(within(container).queryByTestId('child')).toBeNull();
    });
  });

  test('should update to new children when changed while visible', () => {
    const { container, rerender } = render(
      <DelayUnmount delay={100}>
        <ChildComponent value="first" />
      </DelayUnmount>,
    );

    expect(within(container).getByTestId('child').textContent).toBe('first');

    rerender(
      <DelayUnmount delay={100}>
        <ChildComponent value="second" />
      </DelayUnmount>,
    );

    expect(within(container).getByTestId('child').textContent).toBe('second');
  });

  test('should clear timeout when component unmounts', async () => {
    const { container, rerender, unmount } = render(
      <DelayUnmount delay={100}>
        <ChildComponent />
      </DelayUnmount>,
    );

    rerender(<DelayUnmount delay={100}>{null}</DelayUnmount>);

    expect(within(container).queryByTestId('child')).not.toBeNull();

    unmount();

    await sleep(120);
  });
});
