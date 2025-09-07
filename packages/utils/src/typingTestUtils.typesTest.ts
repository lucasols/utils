import { typingTest } from './typingTestUtils';

const { expectTypesAreEqual, expectTypesAreNotEqual } = typingTest;

expectTypesAreEqual<string, string>();
expectTypesAreEqual<string, number>({
  'error: type assertion failed, should be equal but': {
    typeOnLeft: 'string',
    isNotEqualTo: 2,
  },
});
expectTypesAreEqual<string, { ok: string }>({
  'error: type assertion failed, should be equal but': {
    typeOnLeft: 'string',
    isNotEqualTo: { ok: 'string' },
  },
});

expectTypesAreNotEqual<string, { ok: string }>();

expectTypesAreNotEqual<string, string>(
  'error: type assertion failed, types should be NOT equal',
);
