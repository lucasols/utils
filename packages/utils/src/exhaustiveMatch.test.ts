import { describe, expect, test } from 'vitest';
import { exhaustiveMatch, exhaustiveMatchObjUnion } from './exhaustiveMatch';
import { asType } from './typingFnUtils';
import { typingTest } from './typingTestUtils';

describe('exhaustiveMatch', () => {
  function hasType<T>(value: T) {
    return value;
  }

  typingTest.test('simple check', () => {
    exhaustiveMatch('a' as const).with({
      a: () => 'a',
    });
  });

  typingTest.test('check excess keys', () => {
    exhaustiveMatch('a' as const).with({
      a: () => 'a',
      // @ts-expect-error missing keys
      b: () => 'b',
    });
  });

  test('missing keys', () => {
    expect(() => {
      exhaustiveMatch('a' as const).with(
        // @ts-expect-error missing keys
        {},
      );
    }).toThrowError('Exhaustive match failed: no match for a');
  });

  function performSimpleMatch(value: 'a' | 'b' | 'c') {
    const result = exhaustiveMatch(value).with<string | number>({
      a: () => 1,
      b: () => 'b',
      c: () => 'c',
    });

    hasType<string | number>(result);

    return result;
    //       ^?
  }

  function performMatch(
    value: 'a' | 'b' | 'c' | 'group' | 'group2' | 'group3' | 'group4' | 'never',
  ) {
    const result = exhaustiveMatch(value).with({
      a: () => 'a',
      b: () => 'B',
      c: () => 'C',
      group4: '_nxt',
      group: () => 'group',
      group3: '_nxt',
      group2: () => 'ok',
      never: '_never',
    });

    hasType<string>(result);

    return result;
    //       ^?
  }

  test('match works', () => {
    expect(performSimpleMatch('a')).toBe(1);
    expect(performSimpleMatch('b')).toBe('b');
    expect(performSimpleMatch('c')).toBe('c');
  });

  test('match works with references', () => {
    expect(performMatch('group4')).toBe('group');
    expect(performMatch('group2')).toBe('ok');
    expect(performMatch('group3')).toBe('ok');
  });

  test('match works with never', () => {
    expect(() => performMatch('never')).toThrowError(
      'Exhaustive match failed: no match for never',
    );
  });
});

describe('exhaustiveMatchObjUnion', () => {
  // Simple event types for testing
  type UserEvent =
    | { kind: 'click'; x: number; y: number }
    | { kind: 'keypress'; key: string }
    | { kind: 'focus' };

  test('basic matching works', () => {
    const clickEvent = asType<UserEvent>({ kind: 'click', x: 10, y: 20 });
    const keypressEvent = asType<UserEvent>({ kind: 'keypress', key: 'Enter' });
    const focusEvent = asType<UserEvent>({ kind: 'focus' });

    // Handle click event
    const clickResult = exhaustiveMatchObjUnion(clickEvent, 'kind').with({
      click: (e) => `Clicked at ${e.x},${e.y}`,
      keypress: (e) => `Pressed ${e.key}`,
      focus: () => 'Focused',
    });

    expect(clickResult).toBe('Clicked at 10,20');

    // Handle keypress event
    const keypressResult = exhaustiveMatchObjUnion(keypressEvent, 'kind').with({
      click: (e) => `Clicked at ${e.x},${e.y}`,
      keypress: (e) => `Pressed ${e.key}`,
      focus: () => 'Focused',
    });

    expect(keypressResult).toBe('Pressed Enter');

    // Handle focus event
    const focusResult = exhaustiveMatchObjUnion(focusEvent, 'kind').with({
      click: (e) => `Clicked at ${e.x},${e.y}`,
      keypress: (e) => `Pressed ${e.key}`,
      focus: () => 'Focused',
    });

    expect(focusResult).toBe('Focused');
  });

  test('_never pattern throws', () => {
    // Define an event type with a "disabled" variant
    type ExtendedEvent = UserEvent | { kind: 'disabled' };

    const disabledEvent = asType<ExtendedEvent>({ kind: 'disabled' });

    // Try to match with a _never pattern
    expect(() => {
      exhaustiveMatchObjUnion(disabledEvent, 'kind').with({
        click: (e) => `Clicked at ${e.x},${e.y}`,
        keypress: (e) => `Pressed ${e.key}`,
        focus: () => 'Focused',
        disabled: '_never', // This should throw
      });
    }).toThrowError('Exhaustive match failed: no match for disabled');
  });

  test('missing cases throw at runtime', () => {
    const keypressEvent = asType<UserEvent>({ kind: 'keypress', key: 'Enter' });

    // Missing cases in the pattern
    expect(() => {
      exhaustiveMatchObjUnion(keypressEvent, 'kind').with(
        // @ts-expect-error Missing keypress case
        {
          click: (e) => `Clicked at ${e.x},${e.y}`,
          focus: () => 'Focused',
          // Missing keypress case
        },
      );
    }).toThrowError('Exhaustive match failed: no match for keypress');
  });

  test('type narrowing works correctly', () => {
    const clickEvent = asType<UserEvent>({ kind: 'click', x: 10, y: 20 });

    const result = exhaustiveMatchObjUnion(clickEvent, 'kind').with({
      click: (e) => {
        // TypeScript should narrow e to click event
        typingTest.expectTypesAre<
          { kind: 'click'; x: number; y: number },
          typeof e
        >('equal');
        return e.x + e.y;
      },
      keypress: (e) => {
        // TypeScript should narrow e to keypress event
        typingTest.expectTypesAre<{ kind: 'keypress'; key: string }, typeof e>(
          'equal',
        );
        return e.key.length;
      },
      focus: (_e) => {
        // TypeScript should narrow e to focus event
        typingTest.expectTypesAre<{ kind: 'focus' }, typeof _e>('equal');
        return 0;
      },
    });

    expect(result).toBe(30);
  });
});
