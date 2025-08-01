import { expect, test } from 'vitest';
import { createThrottleController } from './createThrottleController';
import { sleep } from './sleep';

test('throttle sequencial requests', () => {
  const throttle = createThrottleController({
    maxCalls: 2,
    per: { ms: 100 },
  });

  function throttledRequest() {
    if (throttle.shouldSkip()) {
      return 'throttled';
    }

    return 'not throttled';
  }

  const calls: string[] = [];

  calls.push(throttledRequest());
  calls.push(throttledRequest());
  calls.push(throttledRequest());
  calls.push(throttledRequest());
  calls.push(throttledRequest());
  calls.push(throttledRequest());
  calls.push(throttledRequest());

  expect(calls).toMatchInlineSnapshot(`
    [
      "not throttled",
      "not throttled",
      "throttled",
      "throttled",
      "throttled",
      "throttled",
      "throttled",
    ]
  `);
});

test('sequential different call ids', () => {
  const throttle = createThrottleController({
    maxCalls: 2,
    per: { ms: 100 },
  });

  function throttledRequest(callId: string | string[]) {
    if (throttle.shouldSkip(callId)) {
      return 'throttled';
    }

    return 'not throttled';
  }

  const aCalls: string[] = [];
  const bCalls: string[] = [];

  aCalls.push(throttledRequest('a'));
  aCalls.push(throttledRequest('a'));
  aCalls.push(throttledRequest('a'));

  bCalls.push(throttledRequest(['b', 'a']));
  bCalls.push(throttledRequest(['b', 'a']));
  bCalls.push(throttledRequest(['b', 'a']));
  bCalls.push(throttledRequest(['b', 'a']));

  expect(aCalls).toMatchInlineSnapshot(`
    [
      "not throttled",
      "not throttled",
      "throttled",
    ]
  `);
  expect(bCalls).toMatchInlineSnapshot(`
    [
      "not throttled",
      "not throttled",
      "throttled",
      "throttled",
    ]
  `);
});

test('async throttled requests', async () => {
  const throttle = createThrottleController({
    maxCalls: 2,
    per: { ms: 8 },
  });

  function throttledRequest() {
    if (throttle.shouldSkip()) {
      return 'throttled';
    }

    return 'not throttled';
  }

  const calls: string[] = [];

  calls.push(throttledRequest());
  calls.push(throttledRequest());
  calls.push(throttledRequest());

  await sleep(2);

  calls.push(throttledRequest());
  calls.push(throttledRequest());

  await sleep(7);

  calls.push(throttledRequest());

  expect(calls).toMatchInlineSnapshot(`
    [
      "not throttled",
      "not throttled",
      "throttled",
      "throttled",
      "throttled",
      "not throttled",
    ]
  `);
});

test('clear calls ids over time to prevent memory leak', async () => {
  const throttle = createThrottleController({
    maxCalls: 2,
    per: { ms: 10 },
    cleanupCheckSecsInterval: 0.01,
  });

  function throttledRequest(callId: number) {
    if (throttle.shouldSkip(callId)) {
      return 'throttled';
    }

    return 'not throttled';
  }

  const calls: string[] = [];

  calls.push(throttledRequest(1));
  calls.push(throttledRequest(2));
  calls.push(throttledRequest(3));
  calls.push(throttledRequest(4));
  calls.push(throttledRequest(5));
  calls.push(throttledRequest(6));
  calls.push(throttledRequest(7));

  expect(throttle._currentWindows.size).toMatchInlineSnapshot(`7`);

  await sleep(20);

  calls.push(throttledRequest(8));

  await sleep(5);

  expect(throttle._currentWindows.size).toMatchInlineSnapshot(`1`);
});
