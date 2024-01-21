import { expect, test } from 'vitest';
import { parallelAsyncResultCalls } from './parallelAsyncResultCalls';
import { asyncResultify } from './rsResult';
import { sleep } from './sleep';

test('all settled with success and metadata', async () => {
  const result = await parallelAsyncResultCalls<number>()
    .add({
      metadata: 1,
      fn: () => asyncResultify(() => sleep(15).then(() => 1)),
    })
    .add({
      metadata: 2,
      fn: () => asyncResultify(() => sleep(10).then(() => 2)),
    })
    .add({
      metadata: 3,
      fn: () => asyncResultify(() => sleep(5).then(() => 3)),
    })
    .runAllSettled();

  expect(result).toMatchInlineSnapshot(`
    {
      "failed": [],
      "succeeded": [
        {
          "metadata": 1,
          "value": 1,
        },
        {
          "metadata": 2,
          "value": 2,
        },
        {
          "metadata": 3,
          "value": 3,
        },
      ],
    }
  `);
});
