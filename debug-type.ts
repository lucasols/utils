// Test the type transformation directly without importing
type TestInput = {
  a: number;
  b: undefined;
  c: { d: string };
  mayBeUndefined: undefined | string;
};

// Direct type test without function
type RemoveUndefinedValues<T extends Record<string, unknown>> = 
  // Required properties: don't have undefined in their type
  { [K in keyof T as undefined extends T[K] ? never : K]: T[K] } &
  // Optional properties: have undefined in their type but aren't exactly undefined
  { [K in keyof T as undefined extends T[K] ? (T[K] extends undefined ? never : K) : never]?: T[K] };

type TestResult = RemoveUndefinedValues<TestInput>;

// Test individual properties
type TestA = TestResult['a']; // should be number
type TestMaybeUndefined = TestResult['mayBeUndefined']; // should be undefined | string

// Test if properties exist as required vs optional
type IsARequired = 'a' extends keyof TestResult ? true : false;
type IsMaybeOptional = TestResult extends { mayBeUndefined?: any } ? true : false;

// Expected type
type ExpectedType = { a: number; c: { d: string }; mayBeUndefined?: undefined | string };

// Direct type comparison  
type TypesMatch = TestResult extends ExpectedType ? (ExpectedType extends TestResult ? true : false) : false;