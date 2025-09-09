import { typingTest } from './typingTestUtils';

const { expectTypesAreEqual, expectTypesAreNotEqual } = typingTest;

expectTypesAreEqual<string, string>();
expectTypesAreEqual<string, number>(
  'type assertion failed, types should be equal but',
  'string',
  'is not equal to',
  2,
);
expectTypesAreEqual<string, { ok: string }>(
  'type assertion failed, types should be equal but',
  'string',
  'is not equal to',
  { ok: 'string' },
);

expectTypesAreNotEqual<string, { ok: string }>();

expectTypesAreNotEqual<string, string>(
  'error: type assertion failed, types should be NOT equal',
);
