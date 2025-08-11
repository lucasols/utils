 
import { randomInt } from 'crypto';
import { Result, resultify } from 't-result';
import { assert, expect, test, vi } from 'vitest';
import { createAsyncQueue, createAsyncQueueWithMeta } from './asyncQueue';
import { sleep } from './sleep';
import { waitController } from './testUtils';

const fixture = Symbol('fixture');

async function sleepOk<V>(ms: number, value: V) {
  await sleep(ms);
  return Result.ok(value);
}

test('addResultify should add a task and resolve with the result', async () => {
  const queue = createAsyncQueue();

  const promise = queue.resultifyAdd(async () => Promise.resolve(fixture));

  expect(queue.size).toBe(0);
  expect(queue.pending).toBe(1);
  const result = await promise;
  assert(result.ok);
  expect(result.value).toBe(fixture);

  expect(queue.failures).toEqual([]);
  expect(queue.completions).toEqual([{ value: fixture }]);
});

test.concurrent('addResultify should respect limited concurrency', async () => {
  const queue = createAsyncQueue({ concurrency: 2 });
  const promise = queue.resultifyAdd(async () => Promise.resolve(fixture));
  const promise2 = queue.resultifyAdd(async () => {
    await sleep(100);
    return fixture;
  });
  const promise3 = queue.resultifyAdd(async () => Promise.resolve(fixture));
  expect(queue.size).toBe(1);
  expect(queue.pending).toBe(2);
  const result = await promise;
  assert(result.ok);
  expect(result.value).toBe(fixture);
  const result2 = await promise2;
  assert(result2.ok);
  expect(result2.value).toBe(fixture);
  const result3 = await promise3;
  assert(result3.ok);
  expect(result3.value).toBe(fixture);
});

test.concurrent(
  'add should process tasks sequentially with concurrency 1',
  async () => {
    const input = [[10, 300] as const, [20, 200] as const, [30, 100] as const];

    const start = Date.now();
    const queue = createAsyncQueueWithMeta<number, number, Error>({
      concurrency: 1,
    });

    expect(
      await Promise.all(
        input.map(async ([value, ms]) =>
          Result.asyncUnwrap(
            queue.add(
              async () => {
                await sleep(ms);
                return Result.ok(value);
              },
              { meta: value },
            ),
          ),
        ),
      ),
    ).toEqual([10, 20, 30]);

    const duration = Date.now() - start;
    expect(duration).toBeGreaterThanOrEqual(590);
    expect(duration).toBeLessThanOrEqual(650);
  },
);

test.concurrent(
  'addResultify should process tasks sequentially with concurrency 1',
  async () => {
    const input = [[10, 300] as const, [20, 200] as const, [30, 100] as const];

    const start = Date.now();
    const queue = createAsyncQueueWithMeta<number, number, Error>({
      concurrency: 1,
    });

    expect(
      await Promise.all(
        input.map(async ([value, ms]) =>
          Result.asyncUnwrap(
            queue.resultifyAdd(
              async () => {
                await sleep(ms);
                return value;
              },
              { meta: value },
            ),
          ),
        ),
      ),
    ).toEqual([10, 20, 30]);

    const duration = Date.now() - start;
    expect(duration).toBeGreaterThanOrEqual(590);
    expect(duration).toBeLessThanOrEqual(650);
  },
);

test.concurrent('addResultify should not exceed max concurrency', async () => {
  const concurrency = 5;
  const queue = createAsyncQueue({ concurrency });
  let running = 0;

  const input = Array.from({ length: 100 })
    .fill(0)
    .map(async () =>
      queue.resultifyAdd(async () => {
        running++;
        expect(running <= concurrency).toBe(true);
        expect(queue.pending <= concurrency).toBe(true);
        await sleep(randomInt(30, 50));
        running--;
      }),
    );

  await Promise.all(input);
});

test.concurrent('onIdle should resolve when all tasks are done', async () => {
  const queue = createAsyncQueue({ concurrency: 2 });

  queue.resultifyAdd(async () => sleep(100));
  queue.resultifyAdd(async () => sleep(100));
  queue.resultifyAdd(async () => sleep(100));
  expect(queue.size).toBe(1);
  expect(queue.pending).toBe(2);
  await queue.onIdle();
  expect(queue.size).toBe(0);
  expect(queue.pending).toBe(0);

  queue.add(() => sleepOk(100, 'ok'));
  queue.add(() => sleepOk(100, 'ok'));
  queue.add(() => sleepOk(100, 'ok'));
  expect(queue.size).toBe(1);
  expect(queue.pending).toBe(2);
  await queue.onIdle();
  expect(queue.size).toBe(0);
  expect(queue.pending).toBe(0);
});

test('onIdle should resolve immediately if no tasks are pending', async () => {
  const queue = createAsyncQueue();
  expect(queue.size).toBe(0);
  expect(queue.pending).toBe(0);
  expect(await queue.onIdle()).toBeUndefined();
});

test.concurrent('clear should remove all queued tasks', () => {
  const queue = createAsyncQueue({ concurrency: 2 });
  queue.add(() => sleepOk(20_000, 'ok'));
  queue.add(() => sleepOk(20_000, 'ok'));
  queue.add(() => sleepOk(20_000, 'ok'));
  queue.add(() => sleepOk(20_000, 'ok'));
  queue.add(() => sleepOk(20_000, 'ok'));
  queue.add(() => sleepOk(20_000, 'ok'));
  expect(queue.size).toBe(4);
  expect(queue.pending).toBe(2);
  queue.clear();
  expect(queue.size).toBe(0);
});

test.concurrent('adding tasks after clear should work', async () => {
  const queue = createAsyncQueue({ concurrency: 2 });

  queue.add(() => sleepOk(100, 'ok'));
  queue.add(() => sleepOk(100, 'ok'));
  queue.add(() => sleepOk(100, 'ok'));
  queue.add(() => sleepOk(100, 'ok'));
  queue.add(() => sleepOk(100, 'ok'));
  queue.add(() => sleepOk(100, 'ok'));
  expect(queue.size).toBe(4);
  expect(queue.pending).toBe(2);
  queue.clear();
  expect(queue.size).toBe(0);

  await queue.onIdle();

  let completed = 0;

  queue.add(() => sleepOk(5, 'ok'), {
    onComplete: () => {
      completed++;
    },
  });

  expect(queue.size).toBe(0);
  expect(queue.pending).toBe(1);

  await queue.onIdle();

  expect(queue.size).toBe(0);
  expect(queue.pending).toBe(0);

  expect(completed).toBe(1);
});

test.concurrent('queue timeout', async () => {
  const result: string[] = [];
  const queue = createAsyncQueue({
    timeout: 300,
    concurrency: Infinity,
  });

  const errors: Error[] = [];

  queue.events.on('error', (e) => {
    errors.push(e.error);
  });

  queue.resultifyAdd(async () => {
    await sleep(400);
    result.push('🐌');
  });
  queue.resultifyAdd(async () => {
    await sleep(250);
    result.push('🦆');
  });
  queue.resultifyAdd(async () => {
    await sleep(310);
    result.push('🐢');
  });
  queue.resultifyAdd(async () => {
    await sleep(100);
    result.push('🐅');
  });
  queue.resultifyAdd(() => {
    result.push('⚡️');
  });
  expect(queue.pending).toBe(5);

  await queue.onIdle();

  expect(result).toEqual(['⚡️', '🐅', '🦆']);
  expect(queue.pending).toBe(0);
  expect(queue.completed).toBe(3);
  expect(queue.failed).toBe(2);
  expect(errors).toEqual([
    new DOMException('This operation was aborted', 'AbortError'),
    new DOMException('This operation was aborted', 'AbortError'),
  ]);
});

test.concurrent('addResultify should handle task throwing error', async () => {
  const queue = createAsyncQueue({ concurrency: 1 });

  queue.resultifyAdd(() => 'sync 1');
  await expect(
    Result.asyncUnwrap(
      queue.resultifyAdd(() => {
        throw new Error('broken');
      }),
    ),
  ).rejects.toThrowError('broken');
  queue.resultifyAdd(() => 'sync 2');

  expect(queue.size).toBe(0);
  expect(queue.pending).toBe(1);

  await queue.onIdle();
  expect(queue.pending).toBe(0);
  expect(queue.completed).toEqual(2);
  expect(queue.failed).toEqual(1);
});

test.concurrent(
  'addResultify should handle task promise rejection',
  async () => {
    const queue = createAsyncQueue({ concurrency: 1 });

    await expect(
      Result.asyncUnwrap(
        queue.resultifyAdd(async () => {
          throw new Error('broken');
        }),
      ),
    ).rejects.toThrowError('broken');

    queue.resultifyAdd(() => 'task #1');

    expect(queue.pending).toBe(1);

    await queue.onIdle();

    expect(queue.pending).toBe(0);
  },
);

test.concurrent('add should handle Result.err returned from task', async () => {
  const queue = createAsyncQueue({ concurrency: 1 });

  const result = await queue.add(async () => {
    return Result.err(new Error('broken'));
  });

  assert(result.error);

  expect(result.error).toBeDefined();
  expect(result.error.message).toBe('broken');

  queue.resultifyAdd(() => 'task #1');

  expect(queue.pending).toBe(1);

  await queue.onIdle();

  expect(queue.pending).toBe(0);

  expect(queue.completed).toEqual(1);
  expect(queue.failed).toEqual(1);
});

test('addResultify should skip an aborted job', async () => {
  const queue = createAsyncQueue();
  const controller = new AbortController();

  controller.abort();

  await expect(
    Result.asyncUnwrap(
      queue.resultifyAdd(() => {}, { signal: controller.signal }),
    ),
  ).rejects.toThrowError(DOMException);
});

test('add and addResultify should handle aborting multiple jobs at the same time', async () => {
  const queue = createAsyncQueue({ concurrency: 1 });

  const controller1 = new AbortController();
  const controller2 = new AbortController();

  const task1 = queue.resultifyAdd(async () => new Promise(() => {}), {
    signal: controller1.signal,
  });
  const task2 = queue.add(async () => new Promise(() => {}), {
    signal: controller2.signal,
  });

  setTimeout(() => {
    controller1.abort();
    controller2.abort();
  }, 0);

  await expect(Result.asyncUnwrap(task1)).rejects.toThrowError(DOMException);
  await expect(Result.asyncUnwrap(task2)).rejects.toThrowError(DOMException);
  expect(queue.size).toBe(0);
  expect(queue.pending).toBe(0);
});

test('add should return Result.err if signal is already aborted (function task)', async () => {
  const queue = createAsyncQueue();
  const controller = new AbortController();

  controller.abort();

  const result = await queue.add(
    () =>
      resultify(async () => {
        await sleep(10);
        return 'ok';
      }),
    { signal: controller.signal },
  );

  assert(result.error);
  expect(result.error).toBeInstanceOf(DOMException);
});

test('add should return Result.err if signal is already aborted (promise task)', async () => {
  const queue = createAsyncQueue();
  const controller = new AbortController();

  controller.abort();

  const result = await queue.add(
    async () => {
      await sleep(10);
      return Result.ok('ok');
    },
    { signal: controller.signal },
  );

  assert(result.error);
  expect(result.error).toBeInstanceOf(DOMException);
});

test('should emit error event when a task throws an error', async () => {
  const queue = createAsyncQueue();
  const onError = vi.fn();

  const error = new Error('broken');

  queue.events.on('error', onError);

  queue.add(() => {
    throw error;
  });

  await queue.onIdle();

  expect(onError).toHaveBeenCalledWith({ id: undefined, error }, 'error');
});

test('should emit complete event when a task completes', async () => {
  const queue = createAsyncQueue<'ok'>();
  const onComplete = vi.fn();

  queue.events.on('complete', onComplete);

  queue.resultifyAdd(() => 'ok');

  await queue.onIdle();

  expect(onComplete).toHaveBeenCalledWith(
    { id: undefined, value: 'ok' },
    'complete',
  );
});

test.concurrent('queue signal', async () => {
  const controller = new AbortController();

  const queue = createAsyncQueue({
    signal: controller.signal,
    concurrency: 1,
  });

  queue.add(async () => {
    await sleep(100);
    return Result.ok('ok');
  });

  queue.add(async () => {
    await sleep(100);
    return Result.ok('ok');
  });

  setTimeout(() => {
    controller.abort();
  }, 110);

  await queue.onIdle();

  expect(queue.pending).toBe(0);
  expect(queue.completed).toBe(1);
  expect(queue.failed).toBe(1);
  expect(queue.size).toBe(0);
});

test.concurrent('queue signal with infinite concurrency', async () => {
  const controller = new AbortController();

  const queue = createAsyncQueue<string>({
    signal: controller.signal,
    concurrency: Infinity,
  });

  const result: string[] = [];

  let aborted = false;

  queue
    .add(async () => {
      await sleep(100);
      return Result.ok('a');
    })
    .then((r) => {
      result.push(r.unwrap());
    });

  queue
    .add(async ({ signal }) => {
      signal?.addEventListener(
        'abort',
        () => {
          aborted = true;
        },
        { once: true },
      );

      await sleep(150);

      return Result.ok('b');
    })
    .then((r) => {
      if (r.ok) {
        result.push(r.value);
      }
    });

  queue
    .add(async () => {
      await sleep(100);
      return Result.ok('c');
    })
    .then((r) => {
      result.push(r.unwrap());
    });

  setTimeout(() => {
    controller.abort();
  }, 110);

  await queue.onIdle();

  expect(result).toEqual(['a', 'c']);
  expect(aborted).toBe(true);

  expect(queue.pending).toBe(0);
  expect(queue.completed).toBe(2);
  expect(queue.failed).toBe(1);
  expect(queue.size).toBe(0);
});

test('task should not execute when signal is already aborted', async () => {
  const queue = createAsyncQueue();
  const controller = new AbortController();

  // Abort before adding the task
  controller.abort();

  let taskExecuted = false;

  const result = await queue.add(
    async () => {
      taskExecuted = true; // This should NOT be reached
      return Result.ok('should not execute');
    },
    { signal: controller.signal },
  );

  assert(result.error);
  expect(result.error).toBeInstanceOf(DOMException);
  expect(taskExecuted).toBe(false);
});

test.concurrent('queue should be cleared when signal is aborted', async () => {
  const controller = new AbortController();
  const queue = createAsyncQueue<number>({
    concurrency: 1,
    signal: controller.signal,
  });

  const completed: number[] = [];
  const errors: Error[] = [];

  queue.events.on('error', (e) => {
    errors.push(e.error);
  });

  queue.events.on('complete', (e) => {
    completed.push(e.value);
  });

  const waitAbort = waitController();

  queue.add(async () => {
    await sleep(50);

    setTimeout(() => {
      controller.abort();

      waitAbort.stopWaitingAfter(1);
    }, 1);

    return Result.ok(1);
  });
  queue.add(() => sleepOk(50, 2));
  queue.add(() => sleepOk(50, 3));

  expect(queue.size).toBe(2);
  expect(queue.pending).toBe(1);

  await waitAbort.wait;

  // should be cleared at this point
  expect(queue.size).toBe(0);
  expect(queue.pending).toBe(0);

  await queue.onIdle();

  expect(completed).toEqual([1]);
  expect(errors).toEqual([
    new DOMException('This operation was aborted', 'AbortError'),
  ]);

  const result = await queue.add(() => sleepOk(100, 1));

  expect(result.error).toBeInstanceOf(DOMException);
});

test.concurrent('task results are garbage collected', async () => {
  let gcCalled: string | undefined;
  const gc = new FinalizationRegistry<string>((value) => {
    gcCalled = value;
  });

  async function run() {
    const result = { value: 1 };
    const queue = createAsyncQueue();

    const taskResult = await queue.add(() => sleepOk(100, result));

    assert(taskResult.ok);
    expect(taskResult.value).toBe(result);

    gc.register(result, 'garbage collected');

    await queue.onIdle();

    expect(queue.completions).toEqual([{ value: result }]);
  }

  await run();

  assert(globalThis.gc);

  globalThis.gc();

  await sleep(100);

  expect(gcCalled).toBe('garbage collected');
});

test.concurrent(
  'aborting and then returning a result should not throw an error',
  async () => {
    const queue = createAsyncQueue();
    const controller = new AbortController();

    queue.add(
      async () => {
        await sleep(10);

        controller.abort();
        return Result.ok('ok');
      },
      { signal: controller.signal },
    );

    await queue.onIdle();

    expect(queue.completed).toBe(1);
    expect(queue.failed).toBe(0);
  },
);
