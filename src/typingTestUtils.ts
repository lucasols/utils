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

export const typingTest = {
  test,
  describe,
  expectType,
};
