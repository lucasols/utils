[**@ls-stack/utils**](../README.md)

---

[@ls-stack/utils](../modules.md) / assertions

# assertions

## Modules

- [\<internal\>](-internal-.md)

## Variables

### ~~isFunction()~~

```ts
const isFunction: (value) => value is (args: any[]) => any =
  isFunctionFromTypeGuards;
```

Defined in: [packages/utils/src/assertions.ts:240](https://github.com/lucasols/utils/blob/main/packages/utils/src/assertions.ts#L240)

Type guard to check if a value is a function.

Returns true if the value is a function of any kind (regular function,
arrow function, method, constructor, etc.).

#### Parameters

##### value

`unknown`

The value to check

#### Returns

`value is (args: any[]) => any`

True if the value is a function, false otherwise

#### Example

```typescript
if (isFunction(value)) {
  // TypeScript knows value is (...args: any[]) => any
  const result = value();
}

isFunction(() => {}); // true
isFunction(function () {}); // true
isFunction(Math.max); // true
isFunction('string'); // false
isFunction({}); // false
```

#### Deprecated

use import from `@ls-stack/typeGuards` instead

---

### ~~isObject()~~

```ts
const isObject: (value) => value is Record<string, unknown> =
  isObjectFromTypeGuards;
```

Defined in: [packages/utils/src/assertions.ts:242](https://github.com/lucasols/utils/blob/main/packages/utils/src/assertions.ts#L242)

Type guard to check if a value is a plain object (not null, not an array).

Returns true if the value is an object that is not null and not an array.
This is useful for distinguishing between objects and other types.

#### Parameters

##### value

`unknown`

The value to check

#### Returns

`value is Record<string, unknown>`

True if the value is a plain object, false otherwise

#### Example

```typescript
if (isObject(value)) {
  // TypeScript knows value is Record<string, unknown>
  console.log(value.someProperty);
}

isObject({}); // true
isObject({ a: 1 }); // true
isObject(null); // false
isObject([]); // false
isObject('string'); // false
```

#### Deprecated

use import from `@ls-stack/typeGuards` instead

---

### ~~isPlainObject()~~

```ts
const isPlainObject: (value) => value is Record<string, unknown> =
  isPlainObjectFromTypeGuards;
```

Defined in: [packages/utils/src/assertions.ts:244](https://github.com/lucasols/utils/blob/main/packages/utils/src/assertions.ts#L244)

Type guard to check if a value is a plain object (created by Object literal or Object constructor).

Returns true if the value is a plain object - an object created by the Object
constructor or object literal syntax. This excludes instances of classes,
built-in objects like Date, RegExp, etc.

#### Parameters

##### value

`any`

The value to check

#### Returns

`value is Record<string, unknown>`

True if the value is a plain object, false otherwise

#### Example

```typescript
if (isPlainObject(value)) {
  // TypeScript knows value is Record<string, unknown>
  console.log(Object.keys(value));
}

isPlainObject({}); // true
isPlainObject({ a: 1 }); // true
isPlainObject(Object.create(null)); // true
isPlainObject(new Date()); // false
isPlainObject(/regex/); // false
isPlainObject(new MyClass()); // false
isPlainObject([]); // false
```

#### Deprecated

use import from `@ls-stack/typeGuards` instead

---

### ~~isPromise()~~

```ts
const isPromise: (value) => value is Promise<unknown> = isPromiseFromTypeGuards;
```

Defined in: [packages/utils/src/assertions.ts:246](https://github.com/lucasols/utils/blob/main/packages/utils/src/assertions.ts#L246)

Type guard to check if a value is a Promise or thenable object.

Returns true if the value is an object with a `then` method that is a function.
This covers both native Promises and thenable objects that implement the
Promise interface.

#### Parameters

##### value

`unknown`

The value to check

#### Returns

`value is Promise<unknown>`

True if the value is a Promise or thenable, false otherwise

#### Example

```typescript
if (isPromise(value)) {
  // TypeScript knows value is Promise<unknown>
  const result = await value;
}

isPromise(Promise.resolve()); // true
isPromise(new Promise(() => {})); // true
isPromise({ then: () => {} }); // true
isPromise({ then: 'not a function' }); // false
isPromise('string'); // false
```

#### Deprecated

use import from `@ls-stack/typeGuards` instead

## Functions

### assertIsNotNullish()

```ts
function assertIsNotNullish<T>(
  value,
  error,
): asserts value is StrictNonNullable<T, never>;
```

Defined in: [packages/utils/src/assertions.ts:111](https://github.com/lucasols/utils/blob/main/packages/utils/src/assertions.ts#L111)

Asserts that a value is not null or undefined using TypeScript's assertion signature.

Throws an error if the value is null or undefined. Use it instead of `!` operator for better type safety.

#### Type Parameters

##### T

`T`

The type of the input value

#### Parameters

##### value

`T`

The value to assert is not null or undefined

##### error

Error message string or function that returns an Error to throw if value is nullish

`string` | () => `Error`

#### Returns

`asserts value is StrictNonNullable<T, never>`

#### Throws

When the value is null or undefined

#### Example

```typescript
function processValue(input: string | null | undefined) {
  assertIsNotNullish(input);
  // TypeScript now knows input is string
  console.log(input.toUpperCase());
}

// With custom error
assertIsNotNullish(value, 'Value is required for processing');
```

---

### assertIsNotUndefined()

```ts
function assertIsNotUndefined<T>(
  value,
  error,
): asserts value is StrictNonUndefined<T, never>;
```

Defined in: [packages/utils/src/assertions.ts:142](https://github.com/lucasols/utils/blob/main/packages/utils/src/assertions.ts#L142)

Asserts that a value is not undefined using TypeScript's assertion signature.

Throws an error if the value is undefined. Use it instead of `!` operator for better type safety.

#### Type Parameters

##### T

`T`

The type of the input value

#### Parameters

##### value

`T`

The value to assert is not undefined

##### error

Error message string or function that returns an Error to throw if value is undefined

`string` | () => `Error`

#### Returns

`asserts value is StrictNonUndefined<T, never>`

#### Throws

When the value is undefined

#### Example

```typescript
function processValue(input: string | undefined) {
  assertIsNotUndefined(input);
  // TypeScript now knows input is string
  console.log(input.toUpperCase());
}

// With custom error
assertIsNotUndefined(value, 'Value must be defined');
```

---

### exhaustiveCheck()

```ts
function exhaustiveCheck<Except>(narrowedType): Error;
```

Defined in: [packages/utils/src/assertions.ts:232](https://github.com/lucasols/utils/blob/main/packages/utils/src/assertions.ts#L232)

Ensures exhaustive type checking in switch statements or conditional logic.

This function should be used in the default case of switch statements or
the final else branch of conditional logic to ensure all possible cases
are handled. It helps catch missing cases at compile time when new union
members are added.

#### Type Parameters

##### Except

`Except` = `never`

The type that should never be reached

#### Parameters

##### narrowedType

`NoInfer`\<`Except`\>

The value that should never exist at runtime

#### Returns

`Error`

An Error object (this function should never actually execute)

#### Example

```typescript
type Status = 'pending' | 'success' | 'error';

function handleStatus(status: Status) {
  switch (status) {
    case 'pending':
      return 'Loading...';
    case 'success':
      return 'Done!';
    case 'error':
      return 'Failed!';
    default:
      throw exhaustiveCheck(status); // TypeScript error if Status gains new members
  }
}

// In conditional logic
function processValue(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  } else if (typeof value === 'number') {
    return value.toString();
  } else {
    throw exhaustiveCheck(value); // Ensures all cases are covered
  }
}
```

---

### invariant()

```ts
function invariant(condition, error): asserts condition;
```

Defined in: [packages/utils/src/assertions.ts:180](https://github.com/lucasols/utils/blob/main/packages/utils/src/assertions.ts#L180)

Asserts that a condition is always true, throwing an error if it's falsy.

This function is useful for enforcing invariants in your code - conditions that
should always be true. It uses TypeScript's assertion signature to narrow types
based on the condition.

#### Parameters

##### condition

`any`

The condition to check (any truthy/falsy value)

##### error

Error message string or function that returns an Error to throw if condition is falsy

`string` | () => `Error`

#### Returns

`asserts condition`

#### Throws

When the condition is falsy

#### Example

```typescript
function divide(a: number, b: number) {
  invariant(b !== 0, 'Division by zero is not allowed');
  return a / b;
}

// Type narrowing example
function processUser(user: User | null) {
  invariant(user, 'User must be logged in');
  // TypeScript now knows user is User, not null
  console.log(user.name);
}

// With custom error function
invariant(isValid, () => new ValidationError('Invalid state detected'));
```

---

### notNullish()

```ts
function notNullish<T>(value, error): StrictNonNullable<T>;
```

Defined in: [packages/utils/src/assertions.ts:78](https://github.com/lucasols/utils/blob/main/packages/utils/src/assertions.ts#L78)

Ensures a value is not null or undefined and returns it with the correct type.

Throws an error if the value is null or undefined. Use it instead of `!` operator for better type safety.

#### Type Parameters

##### T

`T`

The type of the input value

#### Parameters

##### value

`T`

The value to check for null or undefined

##### error

Error message string or function that returns an Error to throw if value is nullish

`string` | () => `Error`

#### Returns

[`StrictNonNullable`](-internal-.md#strictnonnullable)\<`T`\>

The input value with null and undefined excluded from its type

#### Throws

When the value is null or undefined

#### Example

```typescript
const maybeString: string | null | undefined = getValue();
const definiteString = notNullish(maybeString); // Type: string

// With custom error message
const value = notNullish(maybeValue, 'Value cannot be null or undefined');

// With custom error function
const value = notNullish(
  maybeValue,
  () => new ValidationError('Required field'),
);
```

---

### notUndefined()

```ts
function notUndefined<T>(value, error): StrictNonUndefined<T>;
```

Defined in: [packages/utils/src/assertions.ts:39](https://github.com/lucasols/utils/blob/main/packages/utils/src/assertions.ts#L39)

Ensures a value is not undefined and returns it with the correct type.

Throws an error if the value is undefined. Use it instead of `!` operator for better type safety.

#### Type Parameters

##### T

`T`

The type of the input value

#### Parameters

##### value

`T`

The value to check for undefined

##### error

Error message string or function that returns an Error to throw if value is undefined

`string` | () => `Error`

#### Returns

[`StrictNonUndefined`](-internal-.md#strictnonundefined)\<`T`\>

The input value with undefined excluded from its type

#### Throws

When the value is undefined

#### Example

```typescript
const maybeString: string | undefined = getValue();
const definiteString = notUndefined(maybeString); // Type: string

// With custom error message
const value = notUndefined(maybeValue, 'Value must be defined');

// With custom error function
const value = notUndefined(
  maybeValue,
  () => new ValidationError('Required field'),
);
```
