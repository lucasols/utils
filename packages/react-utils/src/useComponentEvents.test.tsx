import { render, renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import {
  useComponentEvents,
  useSendComponentEvents,
} from './useComponentEvents';

type TestEvents = {
  userAction: { id: string; timestamp: number };
  error: string;
  simple: undefined;
  numberEvent: number;
};

describe('useSendComponentEvents', () => {
  test('should return stable emitter and send function across renders', () => {
    const { result, rerender } = renderHook(() =>
      useSendComponentEvents<TestEvents>(),
    );

    const firstResult = result.current;

    rerender();

    expect(result.current.bind).toBe(firstResult.bind);
    expect(result.current.send).toBe(firstResult.send);
  });

  test('should emit events with correct payload types', () => {
    const { result } = renderHook(() => useSendComponentEvents<TestEvents>());
    const callback = vi.fn();

    // Subscribe to all events
    result.current.bind.on('*', callback);

    // Test event with object payload
    const userPayload = { id: 'test-123', timestamp: Date.now() };
    result.current.send('userAction', userPayload);
    expect(callback).toHaveBeenCalledWith({
      payload: userPayload,
      type: 'userAction',
    });

    // Test event with string payload
    result.current.send('error', 'Something went wrong');
    expect(callback).toHaveBeenCalledWith({
      payload: 'Something went wrong',
      type: 'error',
    });

    // Test event with number payload
    result.current.send('numberEvent', 42);
    expect(callback).toHaveBeenCalledWith({ payload: 42, type: 'numberEvent' });

    // Test event with undefined payload
    result.current.send('simple');
    expect(callback).toHaveBeenCalledWith({
      payload: undefined,
      type: 'simple',
    });
  });

  test('should maintain emitter instance across renders', () => {
    const { result, rerender } = renderHook(
      ({ _prop }) => useSendComponentEvents<TestEvents>(),
      { initialProps: { _prop: 'initial' } },
    );

    const originalBind = result.current.bind;
    const callback = vi.fn();
    originalBind.on('error', callback);

    // Rerender with different props
    rerender({ _prop: 'updated' });

    // Same emitter instance should be maintained
    expect(result.current.bind).toBe(originalBind);

    // Events should still work
    result.current.send('error', 'test message');
    expect(callback).toHaveBeenCalledWith({
      payload: 'test message',
      type: 'error',
    });
  });

  test('should support multiple event listeners', () => {
    const { result } = renderHook(() => useSendComponentEvents<TestEvents>());
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    result.current.bind.on('error', listener1);
    result.current.bind.on('error', listener2);

    result.current.send('error', 'broadcast message');

    expect(listener1).toHaveBeenCalledWith({
      payload: 'broadcast message',
      type: 'error',
    });
    expect(listener2).toHaveBeenCalledWith({
      payload: 'broadcast message',
      type: 'error',
    });
  });
});

describe('useComponentEvents', () => {
  test('should call appropriate callback when events are emitted', () => {
    const { result: senderResult } = renderHook(() =>
      useSendComponentEvents<TestEvents>(),
    );
    const callbacks = {
      userAction: vi.fn(),
      error: vi.fn(),
      simple: vi.fn(),
      numberEvent: vi.fn(),
    };

    renderHook(() => useComponentEvents(senderResult.current.bind, callbacks));

    // Test different event types
    const userPayload = { id: 'user-123', timestamp: 1234567890 };
    senderResult.current.send('userAction', userPayload);
    expect(callbacks.userAction).toHaveBeenCalledWith(userPayload);

    senderResult.current.send('error', 'Error message');
    expect(callbacks.error).toHaveBeenCalledWith('Error message');

    senderResult.current.send('simple');
    expect(callbacks.simple).toHaveBeenCalledWith(undefined);

    senderResult.current.send('numberEvent', 100);
    expect(callbacks.numberEvent).toHaveBeenCalledWith(100);
  });

  test('should handle undefined emitter gracefully', () => {
    const callbacks = {
      userAction: vi.fn(),
      error: vi.fn(),
      simple: vi.fn(),
      numberEvent: vi.fn(),
    };

    // Should not throw with undefined emitter
    expect(() => {
      renderHook(() => useComponentEvents(undefined, callbacks));
    }).not.toThrow();

    // Callbacks should not be called since there's no emitter
    expect(callbacks.userAction).not.toHaveBeenCalled();
  });

  test('should update callbacks when they change', () => {
    const { result: senderResult } = renderHook(() =>
      useSendComponentEvents<TestEvents>(),
    );
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { rerender } = renderHook(
      ({ errorCallback }) =>
        useComponentEvents(senderResult.current.bind, {
          userAction: vi.fn(),
          error: errorCallback,
          simple: vi.fn(),
          numberEvent: vi.fn(),
        }),
      { initialProps: { errorCallback: callback1 } },
    );

    senderResult.current.send('error', 'first message');
    expect(callback1).toHaveBeenCalledWith('first message');
    expect(callback2).not.toHaveBeenCalled();

    // Update callback
    rerender({ errorCallback: callback2 });

    senderResult.current.send('error', 'second message');
    expect(callback2).toHaveBeenCalledWith('second message');
    expect(callback1).toHaveBeenCalledTimes(1); // Should not be called again
  });

  test('should cleanup listeners when component unmounts', () => {
    const { result: senderResult } = renderHook(() =>
      useSendComponentEvents<TestEvents>(),
    );
    const callback = vi.fn();

    const { unmount } = renderHook(() =>
      useComponentEvents(senderResult.current.bind, {
        userAction: vi.fn(),
        error: callback,
        simple: vi.fn(),
        numberEvent: vi.fn(),
      }),
    );

    // Verify listener is working
    senderResult.current.send('error', 'before unmount');
    expect(callback).toHaveBeenCalledWith('before unmount');

    // Unmount the listener hook
    unmount();

    // After unmount, callback should not be called
    callback.mockClear();
    senderResult.current.send('error', 'after unmount');
    expect(callback).not.toHaveBeenCalled();
  });

  test('should handle emitter changes', () => {
    const { result: sender1 } = renderHook(() =>
      useSendComponentEvents<TestEvents>(),
    );
    const { result: sender2 } = renderHook(() =>
      useSendComponentEvents<TestEvents>(),
    );
    const callback = vi.fn();

    const { rerender } = renderHook(
      ({ emitter }) =>
        useComponentEvents(emitter, {
          userAction: vi.fn(),
          error: callback,
          simple: vi.fn(),
          numberEvent: vi.fn(),
        }),
      { initialProps: { emitter: sender1.current.bind } },
    );

    // Test with first emitter
    sender1.current.send('error', 'from sender1');
    expect(callback).toHaveBeenCalledWith('from sender1');

    callback.mockClear();

    // Switch to second emitter
    rerender({ emitter: sender2.current.bind });

    // Should not respond to first emitter anymore
    sender1.current.send('error', 'from sender1 again');
    expect(callback).not.toHaveBeenCalled();

    // Should respond to second emitter
    sender2.current.send('error', 'from sender2');
    expect(callback).toHaveBeenCalledWith('from sender2');
  });
});

describe('integration tests', () => {
  test('should work together in a complete event system with JSX components', () => {
    type ComponentEvents = {
      buttonClick: { buttonId: string; x: number; y: number };
      formSubmit: { formData: Record<string, string> };
      notification: string;
    };

    const buttonClickHandler = vi.fn();
    const formSubmitHandler = vi.fn();
    const notificationHandler = vi.fn();

    let eventSender: ReturnType<
      typeof useSendComponentEvents<ComponentEvents>
    >['send'] = () => {};

    function ParentComponent() {
      const { bind, send } = useSendComponentEvents<ComponentEvents>();
      eventSender = send;

      return (
        <div>
          <ChildComponent emitter={bind} />
        </div>
      );
    }

    function ChildComponent({
      emitter,
    }: {
      emitter: ReturnType<
        typeof useSendComponentEvents<ComponentEvents>
      >['bind'];
    }) {
      useComponentEvents(emitter, {
        buttonClick: buttonClickHandler,
        formSubmit: formSubmitHandler,
        notification: notificationHandler,
      });

      return <div>Child Component</div>;
    }

    render(<ParentComponent />);

    // Simulate various interactions
    eventSender('buttonClick', { buttonId: 'submit-btn', x: 100, y: 200 });
    expect(buttonClickHandler).toHaveBeenCalledWith({
      buttonId: 'submit-btn',
      x: 100,
      y: 200,
    });

    eventSender('formSubmit', {
      formData: { name: 'John', email: 'john@example.com' },
    });
    expect(formSubmitHandler).toHaveBeenCalledWith({
      formData: { name: 'John', email: 'john@example.com' },
    });

    eventSender('notification', 'Form submitted successfully!');
    expect(notificationHandler).toHaveBeenCalledWith(
      'Form submitted successfully!',
    );
  });

  test('should support multiple listeners on the same emitter using JSX components', () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    let eventSender: ReturnType<
      typeof useSendComponentEvents<TestEvents>
    >['send'] = () => {};

    function ParentComponent() {
      const { bind, send } = useSendComponentEvents<TestEvents>();
      eventSender = send;

      return (
        <div>
          <ListenerComponent1 emitter={bind} />
          <ListenerComponent2 emitter={bind} />
        </div>
      );
    }

    function ListenerComponent1({
      emitter,
    }: {
      emitter: ReturnType<typeof useSendComponentEvents<TestEvents>>['bind'];
    }) {
      useComponentEvents(emitter, {
        userAction: listener1,
        error: vi.fn(),
        simple: vi.fn(),
        numberEvent: vi.fn(),
      });

      return <div>Listener 1</div>;
    }

    function ListenerComponent2({
      emitter,
    }: {
      emitter: ReturnType<typeof useSendComponentEvents<TestEvents>>['bind'];
    }) {
      useComponentEvents(emitter, {
        userAction: listener2,
        error: vi.fn(),
        simple: vi.fn(),
        numberEvent: vi.fn(),
      });

      return <div>Listener 2</div>;
    }

    render(<ParentComponent />);

    const payload = { id: 'test-id', timestamp: 123456 };
    eventSender('userAction', payload);

    // Both listeners should receive the event
    expect(listener1).toHaveBeenCalledWith(payload);
    expect(listener2).toHaveBeenCalledWith(payload);
  });

  test('should maintain type safety with complex event structures using JSX', () => {
    type ComplexEvents = {
      dataUpdate: {
        id: string;
        data: {
          users: Array<{ id: number; name: string }>;
          metadata: { lastUpdated: Date; version: number };
        };
      };
      statusChange: 'loading' | 'success' | 'error';
      multiParam: { a: number; b: string; c: boolean };
    };

    const dataUpdateHandler = vi.fn();
    const statusChangeHandler = vi.fn();
    const multiParamHandler = vi.fn();

    let eventSender: ReturnType<
      typeof useSendComponentEvents<ComplexEvents>
    >['send'] = () => {};

    function DataProvider() {
      const { bind, send } = useSendComponentEvents<ComplexEvents>();
      eventSender = send;

      return (
        <div>
          <DataConsumer emitter={bind} />
        </div>
      );
    }

    function DataConsumer({
      emitter,
    }: {
      emitter: ReturnType<typeof useSendComponentEvents<ComplexEvents>>['bind'];
    }) {
      useComponentEvents(emitter, {
        dataUpdate: dataUpdateHandler,
        statusChange: statusChangeHandler,
        multiParam: multiParamHandler,
      });

      return <div>Data Consumer</div>;
    }

    render(<DataProvider />);

    // Test complex data structure
    const complexData = {
      id: 'data-123',
      data: {
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
        metadata: { lastUpdated: new Date(), version: 2 },
      },
    };

    eventSender('dataUpdate', complexData);
    expect(dataUpdateHandler).toHaveBeenCalledWith(complexData);

    // Test union type
    eventSender('statusChange', 'loading');
    expect(statusChangeHandler).toHaveBeenCalledWith('loading');

    // Test multiple parameter types
    eventSender('multiParam', { a: 42, b: 'test', c: true });
    expect(multiParamHandler).toHaveBeenCalledWith({
      a: 42,
      b: 'test',
      c: true,
    });
  });
});
