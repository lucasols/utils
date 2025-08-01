export type TestTypeIsEqual<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true
  : false;
export type TestTypeNotEqual<X, Y> =
  true extends TestTypeIsEqual<X, Y> ? false : true;

function test(title: string, func: () => any) {
  func();
}

function describe(title: string, func: () => any) {
  func();
}

/**
 * Helper function for type testing that ensures a type extends `true`.
 * Used in combination with `TestTypeIsEqual` to verify type equality at compile time.
 *
 * @example
 * expectType<TestTypeIsEqual<string, string>>(); // OK
 * expectType<TestTypeIsEqual<string, number>>(); // Type error
 *
 * @template T Type that must extend `true`
 * @returns An empty object cast to type T
 */
function expectType<T extends true>() {
  return {} as T;
}

/**
 * Helper function for type testing that compares two types and expects a specific result.
 * This function allows for more explicit type equality assertions with a descriptive result.
 *
 * @template X First type to compare
 * @template Y Second type to compare
 * @param result Expected comparison result: 'equal' if types are equal, 'notEqual' if they differ
 *
 * @example
 * expectTypesAre<string, string>('equal'); // OK
 * expectTypesAre<string, number>('notEqual'); // OK
 * expectTypesAre<string, string>('notEqual'); // Type error
 */
function expectTypesAre<X, Y>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  result: TestTypeIsEqual<X, Y> extends true ? 'equal' : 'notEqual',
) {}

export const typingTest = {
  test,
  describe,
  expectType,
  expectTypesAre,
};
