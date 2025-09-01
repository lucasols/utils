import { sleep } from '@ls-stack/utils/sleep';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
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
  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('calls callback when shortcut is pressed', async () => {
    const cb = vi.fn();
    function Cmp() {
      useShortCut('d', cb);
      return <div>ok</div>;
    }
    render(<Cmp />);
    await sleep(1);
    fireKeydown('d', { code: 'KeyD' });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('respects allowDuringTyping=false by default', async () => {
    const cb = vi.fn();
    function Cmp() {
      useShortCut('a', cb);
      return <input aria-label="inp" />;
    }
    const { getByLabelText } = render(<Cmp />);
    await sleep(1);
    const input = getByLabelText('inp') as HTMLInputElement;
    input.focus();
    fireKeydown('a', { code: 'KeyA' });
    expect(cb).not.toHaveBeenCalled();
  });

  it('allows during typing when allowDuringTyping is true', async () => {
    const cb = vi.fn();
    function Cmp() {
      useShortCut('a', cb, { allowDuringTyping: true });
      return <input aria-label="inp" />;
    }
    const { getByLabelText } = render(<Cmp />);
    await sleep(1);
    const input = getByLabelText('inp') as HTMLInputElement;
    input.focus();
    fireKeydown('a', { code: 'KeyA' });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('works with modifier sequences like Shift+d', async () => {
    const cb = vi.fn();
    function Cmp() {
      useShortCut('Shift+d', cb);
      return <div />;
    }
    render(<Cmp />);
    await sleep(1);
    fireKeydown('d', { code: 'KeyD', shiftKey: true });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('preventShortcutDefault prevents default and calls callback', async () => {
    const cb = vi.fn();
    function Cmp() {
      useShortCut('z', preventShortcutDefault(cb));
      return <div />;
    }
    render(<Cmp />);
    await sleep(1);
    const e = fireKeydown('z', { code: 'KeyZ' });
    expect(cb).toHaveBeenCalledTimes(1);
    expect(e.defaultPrevented).toBe(true);
  });
});

describe('useShortCuts', () => {
  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('registers multiple shortcuts and calls respective callbacks', async () => {
    const a = vi.fn();
    const b = vi.fn();
    function Cmp() {
      useShortCuts({ a, b }, {});
      return <div />;
    }
    render(<Cmp />);
    await sleep(1);
    fireKeydown('a', { code: 'KeyA' });
    fireKeydown('b', { code: 'KeyB' });
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it('respects allowDuringTyping in batch registration', async () => {
    const a = vi.fn();
    function Cmp() {
      useShortCuts({ a }, { allowDuringTyping: true });
      return <input aria-label="inp" />;
    }
    const { getByLabelText } = render(<Cmp />);
    await sleep(1);
    const input = getByLabelText('inp') as HTMLInputElement;
    input.focus();
    fireKeydown('a', { code: 'KeyA' });
    expect(a).toHaveBeenCalledTimes(1);
  });
});
