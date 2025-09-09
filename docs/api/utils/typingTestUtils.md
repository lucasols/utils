[@ls-stack/utils](modules.md) / typingTestUtils

# typingTestUtils

## Type Aliases

### TestTypeIsEqual\<X, Y\>

```ts
type TestTypeIsEqual<X, Y> = <T>() => T extends X ? 1 : 2 extends <T>() => T extends Y ? 1 : 2 ? true : false;
```

Defined in: [packages/utils/src/typingTestUtils.ts:1](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingTestUtils.ts#L1)

#### Type Parameters

##### X

`X`

##### Y

`Y`

***

### TestTypeNotEqual\<X, Y\>

```ts
type TestTypeNotEqual<X, Y> = true extends TestTypeIsEqual<X, Y> ? false : true;
```

Defined in: [packages/utils/src/typingTestUtils.ts:4](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingTestUtils.ts#L4)

#### Type Parameters

##### X

`X`

##### Y

`Y`

## Variables

### typingTest

```ts
const typingTest: object;
```

Defined in: [packages/utils/src/typingTestUtils.ts:97](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingTestUtils.ts#L97)

#### Type declaration

##### describe()

```ts
describe: (title, func) => void;
```

###### Parameters

###### title

`string`

###### func

() => `any`

###### Returns

`void`

##### expectType()

```ts
expectType: <T>() => T;
```

Helper function for type testing that ensures a type extends `true`. Used in
combination with `TestTypeIsEqual` to verify type equality at compile time.

###### Type Parameters

###### T

`T` *extends* `true`

Type that must extend `true`

###### Returns

`T`

An empty object cast to type T

###### Deprecated

Use [expectTypesAreEqual](#expecttypesareequal) or [expectTypesAreNotEqual](#expecttypesarenotequal)
  instead

###### Example

```ts
expectType<TestTypeIsEqual<string, string>>(); // OK
  expectType<TestTypeIsEqual<string, number>>(); // Type error
```

##### expectTypesAre()

```ts
expectTypesAre: <X, Y>(result) => void;
```

Helper function for type testing that compares two types and expects a
specific result. This function allows for more explicit type equality
assertions with a descriptive result.

###### Type Parameters

###### X

`X`

First type to compare

###### Y

`Y`

Second type to compare

###### Parameters

###### result

[`TestTypeIsEqual`](#testtypeisequal)\<`X`, `Y`\> *extends* `true` ? `"equal"` : `"notEqual"`

Expected comparison result: 'equal' if types are equal,
  'notEqual' if they differ

###### Returns

`void`

###### Deprecated

Use [expectTypesAreEqual](#expecttypesareequal) or [expectTypesAreNotEqual](#expecttypesarenotequal)
  instead

###### Example

```ts
expectTypesAre<string, string>('equal'); // OK
  expectTypesAre<string, number>('notEqual'); // OK
  expectTypesAre<string, string>('notEqual'); // Type error
```

##### expectTypesAreEqual()

```ts
expectTypesAreEqual: <X, Y>(...result) => void;
```

Helper function for type testing that ensures two types are equal. If types
are not equal, it will show a compile-time error with details about the
mismatch.

###### Type Parameters

###### X

`X`

First type to compare

###### Y

`Y`

Second type to compare

###### Parameters

###### result

...[`TestTypeIsEqual`](#testtypeisequal)\<`X`, `Y`\> *extends* `true` ? \[\] : \[`"type assertion failed, types should be equal but"`, `X`, `"is not equal to"`, `Y`\]

Optional error parameter that appears only when types don't
  match

###### Returns

`void`

###### Example

```ts
expectTypesAreEqual<string, string>(); // OK
  expectTypesAreEqual<string, number>(); // Compile error with details
```

##### expectTypesAreNotEqual()

```ts
expectTypesAreNotEqual: <X, Y>(...result) => void;
```

Helper function for type testing that ensures two types are not equal. If
types are equal, it will show a compile-time error.

###### Type Parameters

###### X

`X`

First type to compare

###### Y

`Y`

Second type to compare

###### Parameters

###### result

...[`TestTypeIsEqual`](#testtypeisequal)\<`X`, `Y`\> *extends* `false` ? \[\] : \[`"error: type assertion failed, types should be NOT equal"`\]

Optional error parameter that appears only when types match

###### Returns

`void`

###### Example

```ts
expectTypesAreNotEqual<string, number>(); // OK
  expectTypesAreNotEqual<string, string>(); // Compile error
```

##### test()

```ts
test: (title, func) => void;
```

###### Parameters

###### title

`string`

###### func

() => `any`

###### Returns

`void`
