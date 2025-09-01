import { sleep } from '@ls-stack/utils/sleep';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

describe('keyboardShortcuts utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  test('parseKeybinding resolves $mod to Meta on Apple devices', async () => {
    vi.resetModules();
    vi.stubGlobal('navigator', {
      platform: 'MacIntel',
    } as unknown as Navigator);
    const mod = await import('./keyboardShortcuts.ts');
    expect(mod.parseKeybinding('$mod+d')).toMatchInlineSnapshot(`
      [
        [
          [
            "Meta",
          ],
          "d",
        ],
      ]
    `);
  });

  test('parseKeybinding parses regex keys', async () => {
    vi.resetModules();
    vi.stubGlobal('navigator', { platform: 'Win32' } as unknown as Navigator);
    const mod = await import('./keyboardShortcuts.ts');
    const res = mod.parseKeybinding('(KeyA)');
    expect(String(res[0]![1])).toBe('/^KeyA$/');
  });

  test('matchKeyBindingPress matches by key or code and modifiers', async () => {
    vi.resetModules();
    vi.stubGlobal('navigator', { platform: 'Win32' } as unknown as Navigator);
    const { parseKeybinding, matchKeyBindingPress } = await import(
      './keyboardShortcuts.ts'
    );
    const press = parseKeybinding('Shift+d')[0]!;
    const e1 = new KeyboardEvent('keydown', {
      key: 'd',
      code: 'KeyD',
      shiftKey: true,
    });
    const e2 = new KeyboardEvent('keydown', { key: 'd', code: 'KeyD' });
    expect(matchKeyBindingPress(e1, press)).toBe(true);
    expect(matchKeyBindingPress(e2, press)).toBe(false);
  });

  test('createKeybindingsHandler handles sequences, modifiers, and $mod alias', async () => {
    vi.resetModules();
    vi.stubGlobal('navigator', { platform: 'Win32' } as unknown as Navigator);
    const { createKeybindingsHandler } = await import('./keyboardShortcuts.ts');

    const onShiftD = vi.fn();
    const onYeet = vi.fn();
    const onModD = vi.fn();

    const handler = createKeybindingsHandler(
      {
        'Shift+d': onShiftD,
        'y e e t': onYeet,
        '$mod+d': onModD,
      },
      { timeout: 200 },
    );

    handler(
      new KeyboardEvent('keydown', { key: 'd', code: 'KeyD', shiftKey: true }),
    );
    expect(onShiftD).toHaveBeenCalledTimes(1);

    handler(new KeyboardEvent('keydown', { key: 'y', code: 'KeyY' }));
    handler(
      new KeyboardEvent('keydown', {
        key: 'Shift',
        code: 'ShiftLeft',
        shiftKey: true,
      }),
    );
    handler(new KeyboardEvent('keydown', { key: 'e', code: 'KeyE' }));
    handler(new KeyboardEvent('keydown', { key: 'e', code: 'KeyE' }));
    handler(new KeyboardEvent('keydown', { key: 't', code: 'KeyT' }));
    expect(onYeet).toHaveBeenCalledTimes(1);

    handler(
      new KeyboardEvent('keydown', { key: 'd', code: 'KeyD', ctrlKey: true }),
    );
    expect(onModD).toHaveBeenCalledTimes(1);
  });

  test('sequence times out based on configured timeout', async () => {
    vi.resetModules();
    vi.stubGlobal('navigator', { platform: 'Win32' } as unknown as Navigator);
    const { createKeybindingsHandler } = await import('./keyboardShortcuts.ts');

    const onSeq = vi.fn();
    const handler = createKeybindingsHandler(
      { 'y e e t': onSeq },
      { timeout: 30 },
    );

    handler(new KeyboardEvent('keydown', { key: 'y', code: 'KeyY' }));
    await sleep(40);
    handler(new KeyboardEvent('keydown', { key: 'e', code: 'KeyE' }));
    handler(new KeyboardEvent('keydown', { key: 'e', code: 'KeyE' }));
    handler(new KeyboardEvent('keydown', { key: 't', code: 'KeyT' }));
    expect(onSeq).not.toHaveBeenCalled();
  });

  test('keyboardShortcuts subscribes and unsubscribes correctly', async () => {
    vi.resetModules();
    vi.stubGlobal('navigator', { platform: 'Win32' } as unknown as Navigator);
    const { keyboardShortcuts } = await import('./keyboardShortcuts.ts');

    const onKey = vi.fn();
    const unsub = keyboardShortcuts(window, { d: onKey });

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'd', code: 'KeyD' }),
    );
    expect(onKey).toHaveBeenCalledTimes(1);

    unsub();
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'd', code: 'KeyD' }),
    );
    expect(onKey).toHaveBeenCalledTimes(1);
  });

  test('ignoreInputTypingEvents blocks when typing in inputs and allows Escape', async () => {
    vi.resetModules();
    vi.stubGlobal('navigator', { platform: 'Win32' } as unknown as Navigator);
    const { ignoreInputTypingEvents } = await import('./keyboardShortcuts.ts');

    const inputEl = document.createElement('input');
    document.body.appendChild(inputEl);
    inputEl.focus();

    const cb = vi.fn();
    const wrapper = ignoreInputTypingEvents(cb);

    const e1 = new KeyboardEvent('keydown', { key: 'a', code: 'KeyA' });
    wrapper(e1 as unknown as KeyboardEvent);
    expect(cb).not.toHaveBeenCalled();
    expect(e1.defaultPrevented).toBe(false);

    const e2 = new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      cancelable: true,
    });
    wrapper(e2 as unknown as KeyboardEvent);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(e2.defaultPrevented).toBe(true);
  });

  test('ignoreRichTextInputTypingEvents blocks when typing in contenteditable and allows others', async () => {
    vi.resetModules();
    vi.stubGlobal('navigator', { platform: 'Win32' } as unknown as Navigator);
    const { ignoreRichTextInputTypingEvents } = await import(
      './keyboardShortcuts.ts'
    );

    const rich = document.createElement('div');
    rich.contentEditable = 'true';
    document.body.appendChild(rich);
    rich.focus();

    const cb = vi.fn();
    const wrapper = ignoreRichTextInputTypingEvents(cb);

    const e1 = new KeyboardEvent('keydown', { key: 'a', code: 'KeyA' });
    wrapper(e1 as unknown as KeyboardEvent);
    expect(cb).not.toHaveBeenCalled();
    expect(e1.defaultPrevented).toBe(false);

    const other = document.createElement('div');
    document.body.appendChild(other);
    other.focus();
    const e2 = new KeyboardEvent('keydown', {
      key: 'a',
      code: 'KeyA',
      cancelable: true,
    });
    wrapper(e2 as unknown as KeyboardEvent);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(e2.defaultPrevented).toBe(true);
  });
});
