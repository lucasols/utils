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

async function sleepErr<E extends Error>(ms: number, error: E) {
  await sleep(ms);
  return Result.err(error);
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
    errors.push(e.payload.error);
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
    new DOMException(
      'The operation was aborted due to timeout',
      'TimeoutError',
    ),
    new DOMException(
      'The operation was aborted due to timeout',
      'TimeoutError',
    ),
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

  expect(onError).toHaveBeenCalledWith({
    payload: { meta: undefined, error },
    type: 'error',
  });
});

test('should emit complete event when a task completes', async () => {
  const queue = createAsyncQueue<'ok'>();
  const onComplete = vi.fn();

  queue.events.on('complete', onComplete);

  queue.resultifyAdd(() => 'ok');

  await queue.onIdle();

  expect(onComplete).toHaveBeenCalledWith({
    type: 'complete',
    payload: { meta: undefined, value: 'ok' },
  });
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
    errors.push(e.payload.error);
  });

  queue.events.on('complete', (e) => {
    completed.push(e.payload.value);
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

test.concurrent(
  'stopOnError should stop processing on first error',
  async () => {
    const queue = createAsyncQueue<string>({
      stopOnError: true,
      concurrency: 1,
    });

    const processedItems: string[] = [];
    const errors: Error[] = [];

    // Real-world pattern: add tasks and let queue process them
    queue
      .add(() => sleepOk(50, 'task1'))
      .then((r) => {
        if (r.ok) processedItems.push(r.value);
        if (r.error) errors.push(r.error);
      });

    queue
      .add(() => sleepErr(50, new Error('task2 failed')))
      .then((r) => {
        if (r.ok) processedItems.push(r.value);
        if (r.error) errors.push(r.error);
      });

    queue
      .add(() => sleepOk(50, 'task3'))
      .then((r) => {
        if (r.ok) processedItems.push(r.value);
        if (r.error) errors.push(r.error);
      });

    // Natural way to wait for queue to finish processing
    await queue.onIdle();

    // Check what was processed
    expect(processedItems).toEqual(['task1']);
    expect(errors).toHaveLength(1);
    expect(errors[0]?.message).toBe('task2 failed');

    // Verify queue state
    expect(queue.completed).toBe(1);
    expect(queue.failed).toBe(1);
    expect(queue.isStopped).toBe(true);
    assert(queue.stoppedReason);
    expect(queue.stoppedReason.message).toBe('task2 failed');
    expect(queue.size).toBe(1); // task3 still in queue
  },
);

test.concurrent(
  'stopOnError with rejectPendingOnError should reject all pending tasks',
  async () => {
    const queue = createAsyncQueue<string>({
      stopOnError: true,
      rejectPendingOnError: true,
      concurrency: 1,
    });

    const processedItems: string[] = [];
    const errors: Error[] = [];

    // Real-world pattern: process a batch that might fail
    queue
      .add(() => sleepOk(50, 'task1'))
      .then((r) => {
        if (r.ok) processedItems.push(r.value);
        if (r.error) errors.push(r.error);
      });

    queue
      .add(() => sleepErr(50, new Error('task2 failed')))
      .then((r) => {
        if (r.ok) processedItems.push(r.value);
        if (r.error) errors.push(r.error);
      });

    queue
      .add(() => sleepOk(50, 'task3'))
      .then((r) => {
        if (r.ok) processedItems.push(r.value);
        if (r.error) errors.push(r.error);
      });

    queue
      .add(() => sleepOk(50, 'task4'))
      .then((r) => {
        if (r.ok) processedItems.push(r.value);
        if (r.error) errors.push(r.error);
      });

    await queue.onIdle();

    // Only task1 should have been processed successfully
    expect(processedItems).toEqual(['task1']);

    // Should have 3 errors: task2 original error + task3 and task4 rejected
    expect(errors).toHaveLength(3);
    expect(errors[0]?.message).toBe('task2 failed');
    expect(errors[1]).toBeInstanceOf(Error);
    expect(errors[2]).toBeInstanceOf(Error);

    expect(queue.completed).toBe(1);
    expect(queue.failed).toBe(1);
    expect(queue.size).toBe(0); // All tasks cleared
  },
);

test.concurrent(
  'lazy start should not process tasks until start() is called',
  async () => {
    const queue = createAsyncQueue<string>({ autoStart: false });

    let executedTasks = 0;

    const task1Promise = queue.resultifyAdd(async () => {
      executedTasks++;
      return 'task1';
    });

    const task2Promise = queue.resultifyAdd(async () => {
      executedTasks++;
      return 'task2';
    });

    // Verify tasks haven't started
    expect(executedTasks).toBe(0);
    expect(queue.size).toBe(2);
    expect(queue.pending).toBe(0);
    expect(queue.isStarted).toBe(false);

    queue.start();
    await queue.onIdle();

    const result1 = await task1Promise;
    assert(result1.ok);
    expect(result1.value).toBe('task1');

    const result2 = await task2Promise;
    assert(result2.ok);
    expect(result2.value).toBe('task2');

    expect(executedTasks).toBe(2);
    expect(queue.isStarted).toBe(true);
  },
);

test('pause and resume should control queue processing', async () => {
  const queue = createAsyncQueue({ concurrency: 1 });

  const results: string[] = [];

  queue.resultifyAdd(async () => {
    await sleep(50);
    results.push('task1');
  });

  queue.resultifyAdd(async () => {
    results.push('task2');
  });

  queue.resultifyAdd(async () => {
    results.push('task3');
  });

  await sleep(25);
  queue.pause();
  expect(queue.isPaused).toBe(true);

  await sleep(100);

  expect(results).toEqual(['task1']);

  queue.resume();
  expect(queue.isPaused).toBe(false);

  await queue.onIdle();

  expect(results).toEqual(['task1', 'task2', 'task3']);
});

test.concurrent(
  'reset should allow processing after being stopped',
  async () => {
    const queue = createAsyncQueue<string>({ stopOnError: true });

    const errorPromise = queue.add(() =>
      sleepErr(50, new Error('first error')),
    );

    await queue.onIdle();

    const errorResult = await errorPromise;
    assert(errorResult.error);
    expect(errorResult.error.message).toBe('first error');
    expect(queue.isStopped).toBe(true);

    const stoppedResult = await queue.add(() => sleepOk(50, 'should fail'));
    assert(stoppedResult.error);
    expect(stoppedResult.error.message).toBe('first error');

    queue.reset();
    expect(queue.isStopped).toBe(false);
    expect(queue.stoppedReason).toBeUndefined();

    const resetPromise = queue.add(() => sleepOk(50, 'after reset'));
    await queue.onIdle();

    const resetResult = await resetPromise;
    assert(resetResult.ok);
    expect(resetResult.value).toBe('after reset');
  },
);

test.concurrent(
  'stopOnError without rejectPendingOnError should leave pending tasks in queue',
  async () => {
    const queue = createAsyncQueue<string>({
      stopOnError: true,
      rejectPendingOnError: false,
      concurrency: 1,
    });

    const processedItems: string[] = [];
    const errors: Error[] = [];

    // Add tasks that will be processed until error occurs
    queue
      .add(() => sleepOk(50, 'task1'))
      .then((r) => {
        if (r.ok) processedItems.push(r.value);
        if (r.error) errors.push(r.error);
      });

    queue
      .add(() => sleepErr(50, new Error('task2 failed')))
      .then((r) => {
        if (r.ok) processedItems.push(r.value);
        if (r.error) errors.push(r.error);
      });

    queue
      .add(() => sleepOk(50, 'task3'))
      .then((r) => {
        if (r.ok) processedItems.push(r.value);
        if (r.error) errors.push(r.error);
      });

    queue
      .add(() => sleepOk(50, 'task4'))
      .then((r) => {
        if (r.ok) processedItems.push(r.value);
        if (r.error) errors.push(r.error);
      });

    await queue.onIdle();

    // Only first task should succeed, error on second, remaining tasks stay in queue
    expect(processedItems).toEqual(['task1']);
    expect(errors).toHaveLength(1);
    expect(errors[0]?.message).toBe('task2 failed');

    expect(queue.completed).toBe(1);
    expect(queue.failed).toBe(1);
    expect(queue.size).toBe(2); // task3 and task4 still in queue
    expect(queue.isStopped).toBe(true);
  },
);

test.concurrent(
  'adding tasks to stopped queue should return error immediately',
  async () => {
    const queue = createAsyncQueue<string>({ stopOnError: true });

    // Simulate a processing batch that encounters an error
    const processedItems: string[] = [];
    const errors: Error[] = [];

    queue
      .add(() => sleepErr(50, new Error('processing failed')))
      .then((r) => {
        if (r.ok) processedItems.push(r.value);
        if (r.error) errors.push(r.error);
      });

    await queue.onIdle();

    // Verify queue stopped due to error
    expect(queue.isStopped).toBe(true);
    expect(errors).toHaveLength(1);
    expect(errors[0]?.message).toBe('processing failed');

    // Real-world pattern: try to add more work after queue stopped
    const failedAttempt = await queue.add(() =>
      sleepOk(50, 'should not execute'),
    );

    // Should get immediate error with the original stopping reason
    assert(failedAttempt.error);
    expect(failedAttempt.error.message).toBe('processing failed');
    expect(processedItems).toEqual([]); // Nothing was processed
  },
);

test.concurrent(
  'lazy start with manual start should work with error handling',
  async () => {
    const queue = createAsyncQueue<string>({
      autoStart: false,
      stopOnError: true,
      rejectPendingOnError: true,
    });

    const processedItems: string[] = [];
    const errors: Error[] = [];

    // Real-world pattern: prepare work batch but don't start yet
    queue
      .add(() => sleepOk(50, 'task1'))
      .then((r) => {
        if (r.ok) processedItems.push(r.value);
        if (r.error) errors.push(r.error);
      });

    queue
      .add(() => sleepErr(50, new Error('task2 failed')))
      .then((r) => {
        if (r.ok) processedItems.push(r.value);
        if (r.error) errors.push(r.error);
      });

    queue
      .add(() => sleepOk(50, 'task3'))
      .then((r) => {
        if (r.ok) processedItems.push(r.value);
        if (r.error) errors.push(r.error);
      });

    // Verify nothing has started processing
    expect(queue.size).toBe(3);
    expect(queue.pending).toBe(0);
    expect(queue.isStarted).toBe(false);
    expect(processedItems).toEqual([]);
    expect(errors).toEqual([]);

    // Start processing when ready
    queue.start();
    await queue.onIdle();

    // Check results after processing
    expect(processedItems).toEqual(['task1']);
    expect(errors).toHaveLength(2); // task2 error + task3 rejected
    expect(errors[0]?.message).toBe('task2 failed');
    expect(errors[1]).toBeInstanceOf(Error);

    expect(queue.completed).toBe(1);
    expect(queue.failed).toBe(1);
    expect(queue.size).toBe(0);
    expect(queue.isStopped).toBe(true);
  },
);

test.concurrent('real-world batch processing with error recovery', async () => {
  const queue = createAsyncQueue<string>({ stopOnError: true, concurrency: 1 });

  const successfulItems: string[] = [];
  const failedItems: string[] = [];

  // Simulate processing a batch of items where some might fail
  const itemsToProcess = ['item1', 'item2', 'bad-item', 'item3', 'item4'];

  for (const item of itemsToProcess) {
    queue
      .resultifyAdd(async () => {
        // Simulate processing that might fail
        if (item === 'bad-item') {
          throw new Error(`Failed to process ${item}`);
        }

        // Simulate some processing time
        await sleep(30);
        return item.toUpperCase();
      })
      .then((result) => {
        if (result.ok) {
          successfulItems.push(result.value);
        } else {
          failedItems.push(item);
        }
      });
  }

  // Wait for processing to complete or stop
  await queue.onIdle();

  // Check what was processed before error (with sequential processing)
  expect(successfulItems).toEqual(['ITEM1', 'ITEM2']);
  expect(failedItems).toEqual(['bad-item']);

  // Queue should be stopped due to error
  expect(queue.isStopped).toBe(true);
  expect(queue.failed).toBe(1);
  expect(queue.completed).toBe(2);

  // Remaining items should still be in queue (item3, item4)
  expect(queue.size).toBe(2);

  // Real-world error recovery: reset and process remaining items

  // Reset the queue to continue processing
  queue.reset();
  expect(queue.isStopped).toBe(false);

  // Wait for remaining items to be processed
  await queue.onIdle();

  // Should have processed remaining items
  expect(successfulItems).toEqual(['ITEM1', 'ITEM2', 'ITEM3', 'ITEM4']);
  expect(queue.size).toBe(0);
  expect(queue.completed).toBe(4); // 2 from before + 2 after reset
});

test.concurrent('emits start before complete with meta', async () => {
  const queue = createAsyncQueueWithMeta<string, number>({ concurrency: 1 });
  const calls: Array<{ type: 'start' | 'complete'; meta: number }> = [];

  queue.events.on('start', (e) => {
    calls.push({ type: 'start', meta: e.payload.meta });
  });
  queue.events.on('complete', (e) => {
    calls.push({ type: 'complete', meta: e.payload.meta });
  });

  const r = await queue.add(() => Result.ok('ok'), { meta: 42 });
  assert(r.ok);

  expect(calls).toEqual([
    {
      meta: 42,
      type: 'start',
    },
    {
      meta: 42,
      type: 'complete',
    },
  ]);
});

test.concurrent(
  'onError is called and onComplete is not on failure',
  async () => {
    const queue = createAsyncQueue<string>();
    const onComplete = vi.fn();
    const onError = vi.fn();

    const r = await queue.add(() => Result.err(new Error('broken')), {
      onComplete,
      onError,
    });

    assert(r.error);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onComplete).not.toHaveBeenCalled();
  },
);

test.concurrent('per-task timeout aborts task with AbortError', async () => {
  const queue = createAsyncQueue<string>({ concurrency: 1 });

  const r = await queue.add(
    async () => {
      await sleep(60);
      return Result.ok('ok');
    },
    { timeout: 50 },
  );

  assert(r.error);
  expect(r.error).toBeInstanceOf(DOMException);
  expect((r.error as DOMException).message).toBe(
    'The operation was aborted due to timeout',
  );
  expect(queue.failed).toBe(1);
});

test.concurrent(
  'queue-level timeout takes precedence over per-task timeout',
  async () => {
    const queue = createAsyncQueue<string>({ concurrency: 1, timeout: 40 });

    const r = await queue.add(
      async () => {
        await sleep(100);
        return Result.ok('ok');
      },
      { timeout: 200 },
    );

    assert(r.error);
    expect(r.error).toBeInstanceOf(DOMException);
    expect((r.error as DOMException).message).toBe(
      'The operation was aborted due to timeout',
    );
  },
);

test('add returning non-Result yields error and increments failed', async () => {
  const queue = createAsyncQueue();
  const errors: unknown[] = [];
  queue.events.on('error', (e) => errors.push(e.payload.error));

  const r = await queue.add(async () => 'not a Result' as any);
  assert(r.error);

  expect(r.error.message).toBe('Response not a Result');
  expect(queue.failed).toBe(1);
  expect(errors).toHaveLength(1);
});

test('meta is propagated to events and tracking arrays', async () => {
  const queue = createAsyncQueueWithMeta<string, number>({ concurrency: 1 });

  const r1 = await queue.add(() => Result.ok('ok'), { meta: 1 });
  assert(r1.ok);

  const r2 = await queue.add(() => Result.err(new Error('x')), { meta: 2 });
  assert(r2.error);

  expect(queue.completions).toEqual([{ meta: 1, value: 'ok' }]);
  expect(queue.failures).toHaveLength(1);
  expect(queue.failures[0]?.meta).toBe(2);
  expect((queue.failures[0]?.error as Error).message).toBe('x');
});

test.concurrent(
  'start and resume are no-ops after queue is stopped',
  async () => {
    const queue = createAsyncQueue<string>({
      stopOnError: true,
      concurrency: 1,
    });

    queue.add(async () => {
      await sleep(10);
      return Result.ok('task1');
    });
    queue.add(async () => Result.err(new Error('failed')));
    queue.add(async () => {
      await sleep(10);
      return Result.ok('task3');
    });

    await queue.onIdle();

    expect(queue.isStopped).toBe(true);
    const sizeBefore = queue.size;

    queue.resume();
    queue.start();
    await sleep(30);

    expect(queue.size).toBe(sizeBefore);
    expect(queue.pending).toBe(0);
  },
);

test.concurrent(
  'multiple onIdle waiters resolve when queue stops early',
  async () => {
    const queue = createAsyncQueue<string>({
      stopOnError: true,
      concurrency: 1,
    });

    queue.add(() => Result.ok('a'));
    queue.add(() => Result.err(new Error('bad')));
    queue.add(() => Result.ok('b'));

    const p1 = queue.onIdle();
    const p2 = queue.onIdle();

    await Promise.all([p1, p2]);

    expect(queue.isStopped).toBe(true);
    expect(queue.pending).toBe(0);
    expect(queue.size).toBe(1);
  },
);

test('onIdle resolves after clear() when no pending tasks', async () => {
  const queue = createAsyncQueue<string>({ autoStart: false });

  queue.resultifyAdd(async () => 't1');
  queue.resultifyAdd(async () => 't2');

  const idle = queue.onIdle();
  queue.clear();

  await idle;

  expect(queue.size).toBe(0);
  expect(queue.pending).toBe(0);
});

test('add errors immediately when queue signal already aborted with specific message', async () => {
  const controller = new AbortController();
  controller.abort();

  const queue = createAsyncQueue<string>({ signal: controller.signal });
  let executed = false;

  const r = await queue.add(async () => {
    executed = true;
    return Result.ok('ok');
  });

  assert(r.error);
  expect(executed).toBe(false);
  expect(r.error).toBeInstanceOf(DOMException);
  expect((r.error as DOMException).message).toBe('This operation was aborted');
});

// Rate limiting tests
test.concurrent(
  'rate limiting should limit tasks per time interval',
  async () => {
    const queue = createAsyncQueue<string>({
      rateLimit: { maxTasks: 2, interval: 200 },
    });

    const startTime = Date.now();
    const results: string[] = [];

    // Add 4 tasks - first 2 should run immediately, next 2 should wait
    for (let i = 0; i < 4; i++) {
      queue.resultifyAdd(async () => {
        const result = `task-${i}`;
        results.push(result);
        return result;
      });
    }

    await queue.onIdle();

    const duration = Date.now() - startTime;

    expect(results).toHaveLength(4);
    expect(results).toEqual(['task-0', 'task-1', 'task-2', 'task-3']);
    // Should take at least 200ms (one interval) to complete all tasks
    expect(duration).toBeGreaterThanOrEqual(190);
  },
);

test.concurrent(
  'rate limiting should work with concurrency control',
  async () => {
    const queue = createAsyncQueue<string>({
      concurrency: 1, // Only 1 task at a time
      rateLimit: { maxTasks: 2, interval: 200 }, // 2 tasks per 200ms
    });

    const startTime = Date.now();
    const results: string[] = [];

    // Add 3 tasks - should be limited by both concurrency and rate limit
    for (let i = 0; i < 3; i++) {
      queue.resultifyAdd(async () => {
        await sleep(50); // Each task takes 50ms
        const result = `task-${i}`;
        results.push(result);
        return result;
      });
    }

    await queue.onIdle();

    const duration = Date.now() - startTime;

    expect(results).toHaveLength(3);
    expect(results).toEqual(['task-0', 'task-1', 'task-2']);
    // Should take at least 200ms (rate limit interval) since third task must wait
    expect(duration).toBeGreaterThanOrEqual(240); // 200ms wait + some processing time
  },
);

test.concurrent('onIdle should wait for rate-limited tasks', async () => {
  const queue = createAsyncQueue<string>({
    rateLimit: { maxTasks: 1, interval: 100 },
  });

  let completed = 0;

  // Add 3 tasks that will be rate limited
  for (let i = 0; i < 3; i++) {
    queue.resultifyAdd(async () => {
      completed++;
      return `task-${i}`;
    });
  }

  // onIdle should wait for all tasks including rate-limited ones
  await queue.onIdle();

  expect(completed).toBe(3);
  expect(queue.pending).toBe(0);
  expect(queue.size).toBe(0);
});

test.concurrent('pause and resume should work with rate limiting', async () => {
  const queue = createAsyncQueue<string>({
    rateLimit: { maxTasks: 2, interval: 100 },
  });

  const results: string[] = [];

  // Add 4 tasks
  for (let i = 0; i < 4; i++) {
    queue.resultifyAdd(async () => {
      const result = `task-${i}`;
      results.push(result);
      return result;
    });
  }

  // Wait a bit for first batch to start
  await sleep(10);

  // Pause the queue
  queue.pause();

  // Wait longer than the rate limit interval
  await sleep(150);

  // Should only have processed the first 2 tasks (before pause)
  expect(results.length).toBeLessThanOrEqual(2);

  // Resume and wait for completion
  queue.resume();
  await queue.onIdle();

  // All tasks should now be completed
  expect(results).toHaveLength(4);
  expect(results).toEqual(['task-0', 'task-1', 'task-2', 'task-3']);
});

test.concurrent('clear should cancel rate limit timeouts', async () => {
  const queue = createAsyncQueue<string>({
    rateLimit: { maxTasks: 1, interval: 100 },
  });

  let executed = 0;

  // Add 3 tasks that will be rate limited
  for (let i = 0; i < 3; i++) {
    queue.resultifyAdd(async () => {
      executed++;
      return `task-${i}`;
    });
  }

  // Wait a bit for first task to start
  await sleep(10);

  // Clear the queue (should cancel pending rate limit timeouts)
  queue.clear();

  // Wait longer than the rate limit interval
  await sleep(150);

  // Should only have executed the first task (before clear)
  expect(executed).toBe(1);
  expect(queue.size).toBe(0);
  expect(queue.pending).toBe(0);
});

test.concurrent(
  'rate limiting should handle edge case with zero interval gracefully',
  async () => {
    const queue = createAsyncQueue<string>({
      rateLimit: { maxTasks: 2, interval: 0 },
    });

    const results: string[] = [];

    // Add tasks - should all run immediately with 0 interval
    for (let i = 0; i < 3; i++) {
      queue.resultifyAdd(async () => {
        const result = `task-${i}`;
        results.push(result);
        return result;
      });
    }

    await queue.onIdle();

    expect(results).toHaveLength(3);
  },
);

test.concurrent(
  'rate limiting without configuration should not affect queue behavior',
  async () => {
    const queue = createAsyncQueue<string>(); // No rate limit configured

    const startTime = Date.now();
    const results: string[] = [];

    // Add multiple tasks - should all run without delay
    for (let i = 0; i < 5; i++) {
      queue.resultifyAdd(async () => {
        const result = `task-${i}`;
        results.push(result);
        return result;
      });
    }

    await queue.onIdle();

    const duration = Date.now() - startTime;

    expect(results).toHaveLength(5);
    // Should complete quickly without rate limiting delays
    expect(duration).toBeLessThan(100);
  },
);

test.concurrent(
  'rate limiting should support DurationObj for interval',
  async () => {
    const queue = createAsyncQueue<string>({
      rateLimit: {
        maxTasks: 2,
        interval: { seconds: 0, ms: 200 }, // Using DurationObj instead of number
      },
    });

    const startTime = Date.now();
    const results: string[] = [];

    // Add 4 tasks - first 2 should run immediately, next 2 should wait
    for (let i = 0; i < 4; i++) {
      queue.resultifyAdd(async () => {
        const result = `task-${i}`;
        results.push(result);
        return result;
      });
    }

    await queue.onIdle();

    const duration = Date.now() - startTime;

    expect(results).toHaveLength(4);
    expect(results).toEqual(['task-0', 'task-1', 'task-2', 'task-3']);
    // Should take at least 200ms (one interval) to complete all tasks
    expect(duration).toBeGreaterThanOrEqual(190);
  },
);

test.concurrent(
  'per-task timeout 0 aborts immediately with AbortError',
  async () => {
    const queue = createAsyncQueue<string>({ concurrency: 1 });

    const r = await queue.add(
      async () => {
        await sleep(50);
        return Result.ok('ok');
      },
      { timeout: 0 },
    );

    assert(r.error);
    expect(r.error).toBeInstanceOf(DOMException);
    expect((r.error as DOMException).message).toBe(
      'The operation was aborted due to timeout',
    );
    expect(queue.failed).toBe(1);
  },
);

test.concurrent(
  'queue-level timeout 0 aborts immediately with AbortError',
  async () => {
    const queue = createAsyncQueue<string>({ concurrency: 1, timeout: 0 });

    const r = await queue.add(async () => {
      await sleep(50);
      return Result.ok('ok');
    });

    assert(r.error);
    expect(r.error).toBeInstanceOf(DOMException);
    expect((r.error as DOMException).message).toBe(
      'The operation was aborted due to timeout',
    );
  },
);

test.concurrent('abort uses provided reason when available', async () => {
  const queue = createAsyncQueue<string>({ concurrency: 1 });
  const controller = new AbortController();

  const promise = queue.add(
    async () => {
      await sleep(1000);
      return Result.ok('ok');
    },
    { signal: controller.signal },
  );

  setTimeout(() => {
    controller.abort(new Error('custom abort'));
  }, 10);

  const r = await promise;
  assert(r.error);
  expect(r.error).toBeInstanceOf(Error);
  expect(r.error.message).toBe('custom abort');
});
