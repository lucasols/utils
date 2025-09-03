[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / typedStrings

# typedStrings

## Type Aliases

### NonEmptyString

```ts
type NonEmptyString = string & object;
```

Defined in: [packages/utils/src/typedStrings.ts:171](https://github.com/lucasols/utils/blob/main/packages/utils/src/typedStrings.ts#L171)

A branded type representing a string that is guaranteed to be non-empty (length > 0).
This type provides compile-time safety by preventing empty strings from being 
assigned without proper validation.

#### Type declaration

##### \_\_nonEmptyString

```ts
__nonEmptyString: true;
```

#### Example

```ts
function processName(name: NonEmptyString) {
  // name is guaranteed to be non-empty
  return name.toUpperCase();
}
```

***

### StringContaining\<T\>

```ts
type StringContaining<T> = string extends T ? never : `${string}${T}${string}`;
```

Defined in: [packages/utils/src/typedStrings.ts:12](https://github.com/lucasols/utils/blob/main/packages/utils/src/typedStrings.ts#L12)

A type representing a string that contains a specific substring.
Uses template literal types to ensure type safety at compile time.

#### Type Parameters

##### T

`T` *extends* `string`

The substring that must be contained within the string

#### Example

```ts
type EmailString = StringContaining<'@'>; // string that contains '@'
const email: EmailString = 'user@example.com'; // ✓ valid
```

***

### StringEndingWith\<T\>

```ts
type StringEndingWith<T> = string extends T ? never : `${string}${T}`;
```

Defined in: [packages/utils/src/typedStrings.ts:40](https://github.com/lucasols/utils/blob/main/packages/utils/src/typedStrings.ts#L40)

A type representing a string that ends with a specific substring.
Uses template literal types to ensure the string ends with the specified suffix.

#### Type Parameters

##### T

`T` *extends* `string`

The substring that the string must end with

#### Example

```ts
type JavaFile = StringEndingWith<'.java'>; // string ending with '.java'
const filename: JavaFile = 'HelloWorld.java'; // ✓ valid
```

***

### StringStartingWith\<T\>

```ts
type StringStartingWith<T> = string extends T ? never : `${T}${string}`;
```

Defined in: [packages/utils/src/typedStrings.ts:26](https://github.com/lucasols/utils/blob/main/packages/utils/src/typedStrings.ts#L26)

A type representing a string that starts with a specific substring.
Uses template literal types to ensure the string begins with the specified prefix.

#### Type Parameters

##### T

`T` *extends* `string`

The substring that the string must start with

#### Example

```ts
type HttpUrl = StringStartingWith<'http'>; // string starting with 'http'
const url: HttpUrl = 'https://example.com'; // ✓ valid
```

## Functions

### asNonEmptyStringOrNull()

```ts
function asNonEmptyStringOrNull(str): null | NonEmptyString;
```

Defined in: [packages/utils/src/typedStrings.ts:208](https://github.com/lucasols/utils/blob/main/packages/utils/src/typedStrings.ts#L208)

Converts a string to `NonEmptyString` or returns `null` if the string is empty.
Use this when empty strings should be handled gracefully rather than throwing errors.

#### Parameters

##### str

`string`

The string to convert

#### Returns

`null` \| [`NonEmptyString`](#nonemptystring)

The string as `NonEmptyString` or `null` if empty

***

### asNonEmptyStringOrThrow()

```ts
function asNonEmptyStringOrThrow(str): NonEmptyString;
```

Defined in: [packages/utils/src/typedStrings.ts:194](https://github.com/lucasols/utils/blob/main/packages/utils/src/typedStrings.ts#L194)

Converts a string to `NonEmptyString` or throws an error if the string is empty.
Use this when you need to ensure a string is non-empty and want to fail fast.

#### Parameters

##### str

`string`

The string to convert

#### Returns

[`NonEmptyString`](#nonemptystring)

The string as `NonEmptyString`

#### Throws

Error if the string is empty

***

### assertStringIsNonEmpty()

```ts
function assertStringIsNonEmpty(str): asserts str is NonEmptyString;
```

Defined in: [packages/utils/src/typedStrings.ts:222](https://github.com/lucasols/utils/blob/main/packages/utils/src/typedStrings.ts#L222)

Assertion function that ensures a string is non-empty.
Throws an error if the string is empty, otherwise narrows the type to `NonEmptyString`.

#### Parameters

##### str

`string`

The string to assert as non-empty

#### Returns

`asserts str is NonEmptyString`

#### Throws

Error if the string is empty

***

### isNonEmptyString()

```ts
function isNonEmptyString(str): str is NonEmptyString;
```

Defined in: [packages/utils/src/typedStrings.ts:182](https://github.com/lucasols/utils/blob/main/packages/utils/src/typedStrings.ts#L182)

Type guard function that checks if a string is non-empty.
Narrows the type to `NonEmptyString` when the check passes.

#### Parameters

##### str

`string`

The string to check

#### Returns

`str is NonEmptyString`

`true` if the string has length > 0, `false` otherwise

***

### splitTypedString()

```ts
function splitTypedString<T>(str, separator): [string, string, ...string[]];
```

Defined in: [packages/utils/src/typedStrings.ts:103](https://github.com/lucasols/utils/blob/main/packages/utils/src/typedStrings.ts#L103)

Splits a typed string by a separator that is guaranteed to exist in the string.
Returns an array with at least two elements: the parts before and after the first separator,
plus any additional parts if there are multiple separators.

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### str

A string that contains, starts with, or ends with the separator

[`StringContaining`](#stringcontaining)\<`NoInfer`\<`T`\>\> | [`StringStartingWith`](#stringstartingwith)\<`NoInfer`\<`T`\>\> | [`StringEndingWith`](#stringendingwith)\<`NoInfer`\<`T`\>\>

##### separator

`T`

The separator to split by

#### Returns

\[`string`, `string`, `...string[]`\]

An array with at least two string elements

#### Example

```ts
const path: StringContaining<'/'> = 'src/utils/types.ts';
const [first, second, ...rest] = splitTypedString(path, '/');
// first: 'src', second: 'utils', rest: ['types.ts']
```

***

### splitTypedStringAt()

```ts
function splitTypedStringAt<T>(
   str, 
   separator, 
   splitAtNSeparatorPos): [string, string];
```

Defined in: [packages/utils/src/typedStrings.ts:129](https://github.com/lucasols/utils/blob/main/packages/utils/src/typedStrings.ts#L129)

Splits a typed string at a specific occurrence of the separator.
Unlike `splitTypedString`, this returns exactly two parts: everything before 
the nth separator and everything after it.

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### str

A string that contains, starts with, or ends with the separator

[`StringContaining`](#stringcontaining)\<`NoInfer`\<`T`\>\> | [`StringStartingWith`](#stringstartingwith)\<`NoInfer`\<`T`\>\> | [`StringEndingWith`](#stringendingwith)\<`NoInfer`\<`T`\>\>

##### separator

`T`

The separator to split by

##### splitAtNSeparatorPos

`number` = `1`

The position of the separator to split at (1-based)

#### Returns

\[`string`, `string`\]

A tuple with exactly two string elements

#### Example

```ts
const path: StringContaining<'.'> = 'file.name.ext';
const [name, ext] = splitTypedStringAt(path, '.', 2);
// name: 'file.name', ext: 'ext'
```

***

### stringContains()

```ts
function stringContains<T>(str, substring): str is StringContaining<T>;
```

Defined in: [packages/utils/src/typedStrings.ts:51](https://github.com/lucasols/utils/blob/main/packages/utils/src/typedStrings.ts#L51)

Type guard function that checks if a string contains a specific substring.
Narrows the type to `StringContaining<T>` when the check passes.

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### str

`string`

The string to check

##### substring

`T`

The substring to search for

#### Returns

`str is StringContaining<T>`

`true` if the string contains the substring, `false` otherwise

***

### stringEndsWith()

```ts
function stringEndsWith<T>(str, substring): str is StringEndingWith<T>;
```

Defined in: [packages/utils/src/typedStrings.ts:81](https://github.com/lucasols/utils/blob/main/packages/utils/src/typedStrings.ts#L81)

Type guard function that checks if a string ends with a specific substring.
Narrows the type to `StringEndingWith<T>` when the check passes.

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### str

`string`

The string to check

##### substring

`T`

The substring to check for at the end

#### Returns

`str is StringEndingWith<T>`

`true` if the string ends with the substring, `false` otherwise

***

### stringStartsWith()

```ts
function stringStartsWith<T>(str, substring): str is StringStartingWith<T>;
```

Defined in: [packages/utils/src/typedStrings.ts:66](https://github.com/lucasols/utils/blob/main/packages/utils/src/typedStrings.ts#L66)

Type guard function that checks if a string starts with a specific substring.
Narrows the type to `StringStartingWith<T>` when the check passes.

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### str

`string`

The string to check

##### substring

`T`

The substring to check for at the beginning

#### Returns

`str is StringStartingWith<T>`

`true` if the string starts with the substring, `false` otherwise
