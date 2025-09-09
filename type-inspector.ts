// Type inspector to understand what's happening
type TestInput = {
  a: number;
  b: undefined;
  c: { d: string };
  mayBeUndefined: undefined | string;
};

type RemoveUndefinedValues<T extends Record<string, unknown>> = 
  { [K in keyof T as undefined extends T[K] ? never : K]: T[K] } &
  { [K in keyof T as undefined extends T[K] ? (T[K] extends undefined ? never : K) : never]?: T[K] };

type TestResult = RemoveUndefinedValues<TestInput>;

// Force TypeScript to show the resolved type
const showType = (x: TestResult): TestResult => x;

// Test assignment
const testObj: TestResult = { a: 1, c: { d: 'test' } };

// Try to assign to expected type
const expectedType: { a: number; c: { d: string }; mayBeUndefined?: undefined | string } = testObj;