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

function expectType<T extends true>() {
  return {} as T;
}

export const typingTest = {
  test,
  describe,
  expectType,
};
