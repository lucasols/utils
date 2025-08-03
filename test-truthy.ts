function isTruthy<T>(
  value: T,
): value is Exclude<T, null | undefined | false | 0 | '' | 0n> {
  return !!value;
}

// Test 1: Simple union
const value1: string | null | undefined = 'hello';
if (isTruthy(value1)) {
  // Type should be: string
  type Result1 = typeof value1;
  const r1: Result1 = null!; // This should error if type is string
}

// Test 2: Complex union  
const value2: string | number | boolean | null | undefined = 5;
if (isTruthy(value2)) {
  // Type should be: Exclude<string | number | boolean | null | undefined, null | undefined | false | 0 | '' | 0n>
  type Result2 = typeof value2;
  const r2: Result2 = false; // This should error if false is excluded
}

// Test 3: Literal types
const value3: 0 | 1 | '' | 'hello' | false | true = 1;
if (isTruthy(value3)) {
  // Type should be: 1 | 'hello' | true
  type Result3 = typeof value3;
  const r3: Result3 = 0; // This should error if 0 is excluded
}