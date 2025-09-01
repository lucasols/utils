import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  preventShortcutDefault,
  useShortCut,
  useShortCuts,
} from './useShortCut';

function fireKeydown(key: string, options: KeyboardEventInit = {}) {
  const e = new KeyboardEvent('keydown', {
    key,
    code: options.code,
    ctrlKey: options.ctrlKey,
    shiftKey: options.shiftKey,
    altKey: options.altKey,
    metaKey: options.metaKey,
    cancelable: true,
  });
  window.dispatchEvent(e);
  return e;
}

describe('useShortCut', () => {
  it('calls callback when shortcut is pressed', () => {
    const cb = vi.fn();
    function Cmp() {
      useShortCut('d', cb);
      return <div>ok</div>;
    }
    render(<Cmp />);
    fireKeydown('d', { code: 'KeyD' });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('respects allowDuringTyping=false by default', () => {
    const cb = vi.fn();
    function Cmp() {
      useShortCut('a', cb);
      return <input aria-label="inp" />;
    }
    render(<Cmp />);
    const input = screen.getByLabelText('inp') as HTMLInputElement;
    input.focus();
    fireKeydown('a', { code: 'KeyA' });
    expect(cb).not.toHaveBeenCalled();
  });

  it('allows during typing when allowDuringTyping is true', () => {
    const cb = vi.fn();
    function Cmp() {
      useShortCut('a', cb, { allowDuringTyping: true });
      return <input aria-label="inp" />;
    }
    render(<Cmp />);
    const input = screen.getByLabelText('inp') as HTMLInputElement;
    input.focus();
    fireKeydown('a', { code: 'KeyA' });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('works with modifier sequences like Shift+d', () => {
    const cb = vi.fn();
    function Cmp() {
      useShortCut('Shift+d', cb);
      return <div />;
    }
    render(<Cmp />);
    fireKeydown('d', { code: 'KeyD', shiftKey: true });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('preventShortcutDefault prevents default and calls callback', () => {
    const cb = vi.fn();
    function Cmp() {
      useShortCut('z', preventShortcutDefault(cb));
      return <div />;
    }
    render(<Cmp />);
    const e = fireKeydown('z', { code: 'KeyZ' });
    expect(cb).toHaveBeenCalledTimes(1);
    expect(e.defaultPrevented).toBe(true);
  });
});

describe('useShortCuts', () => {
  it('registers multiple shortcuts and calls respective callbacks', () => {
    const a = vi.fn();
    const b = vi.fn();
    function Cmp() {
      useShortCuts({ a, b }, {});
      return <div />;
    }
    render(<Cmp />);
    fireKeydown('a', { code: 'KeyA' });
    fireKeydown('b', { code: 'KeyB' });
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it('respects allowDuringTyping in batch registration', () => {
    const a = vi.fn();
    function Cmp() {
      useShortCuts({ a }, { allowDuringTyping: true });
      return <input aria-label="inp" />;
    }
    render(<Cmp />);
    const input = screen.getByLabelText('inp') as HTMLInputElement;
    input.focus();
    fireKeydown('a', { code: 'KeyA' });
    expect(a).toHaveBeenCalledTimes(1);
  });
});
