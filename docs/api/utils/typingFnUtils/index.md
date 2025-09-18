[@ls-stack/utils](../modules.md) / typingFnUtils

# typingFnUtils

## Modules

- [\<internal\>](-internal-.md)

## Type Aliases

### NonEmptyArray\<T\>

```ts
type NonEmptyArray<T> = [T, ...T[]];
```

Defined in: [packages/utils/src/typingFnUtils.ts:135](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L135)

A type representing an array that is guaranteed to have at least one element.

#### Type Parameters

##### T

`T`

## Variables

### ~~isSubTypeOf()~~

```ts
const isSubTypeOf: <BaseType, SubType>() => unknown = typeOnRightExtendsLeftType;
```

Defined in: [packages/utils/src/typingFnUtils.ts:95](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L95)

Type helper to check if a type is a subtype of another type.

#### Type Parameters

##### BaseType

`BaseType`

The base type to check against

##### SubType

`SubType`

The type that should extend BaseType

#### Returns

`unknown`

Returns undefined, only used for type checking

#### Deprecated

Use typeOnRightExtendsLeftType instead

## Functions

### asNonPartial()

```ts
function asNonPartial<T>(obj): NonPartial<T>;
```

Defined in: [packages/utils/src/typingFnUtils.ts:4](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L4)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`T`

#### Returns

[`NonPartial`](../typingUtils.md#nonpartial)\<`T`\>

***

### asPartialUndefinedValues()

```ts
function asPartialUndefinedValues<T>(value): T;
```

Defined in: [packages/utils/src/typingFnUtils.ts:128](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L128)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### value

\{ \[P in string \| number \| symbol\]: (Partial\<Pick\<T, KeysWithUndefinedValues\<T\>\>\> & Omit\<T, KeysWithUndefinedValues\<T\>\>)\[P\] \}

#### Returns

`T`

***

### asType()

```ts
function asType<T>(value): T;
```

Defined in: [packages/utils/src/typingFnUtils.ts:53](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L53)

A safe way to cast types, use to substitute the `as Type`

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### value

`T`

#### Returns

`T`

***

### isNonEmptyArray()

```ts
function isNonEmptyArray<T>(array): array is NonEmptyArray<T>;
```

Defined in: [packages/utils/src/typingFnUtils.ts:143](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L143)

Type guard to check if an array has at least one element.

#### Type Parameters

##### T

`T`

#### Parameters

##### array

`T`[]

The array to check

#### Returns

`array is NonEmptyArray<T>`

True if the array is non-empty, false otherwise

***

### isObjKey()

```ts
function isObjKey<T>(key, obj): key is keyof T;
```

Defined in: [packages/utils/src/typingFnUtils.ts:103](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L103)

Type helper to narrow a string to a key of an object.

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### key

`unknown`

##### obj

`T`

#### Returns

`key is keyof T`

***

### narrowStringToUnion()

```ts
function narrowStringToUnion<T>(key, union): undefined | T;
```

Defined in: [packages/utils/src/typingFnUtils.ts:63](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L63)

Narrow a string to a union of strings

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### key

`undefined` | `null` | `string`

##### union

`Set`\<`T`\> | `T`[] | readonly `T`[]

#### Returns

`undefined` \| `T`

***

### objectHasKey()

```ts
function objectHasKey<T>(obj, key): obj is object & { [K in string]: unknown };
```

Defined in: [packages/utils/src/typingFnUtils.ts:154](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L154)

Type guard to check if an object has a specific key and narrow its type.

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### obj

`object`

The object to check

##### key

`T`

The key to check for

#### Returns

`obj is object & { [K in string]: unknown }`

True if the object has the key, false otherwise

***

### strictTypedObjectEntries()

```ts
function strictTypedObjectEntries<T>(obj): NonNullable<{ [K in string | number | symbol]: [K & string, T[K]] }[keyof T]>[];
```

Defined in: [packages/utils/src/typingFnUtils.ts:31](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L31)

A wrapper to Object.entries with a better typing inference, but with strict
typing narrowing keys to strings.

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`T`

#### Returns

`NonNullable`\<\{ \[K in string \| number \| symbol\]: \[K & string, T\[K\]\] \}\[keyof `T`\]\>[]

***

### typedObjectEntries()

```ts
function typedObjectEntries<T>(obj): NonNullable<{ [K in string | number | symbol]: [K, T[K]] }[keyof T]>[];
```

Defined in: [packages/utils/src/typingFnUtils.ts:15](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L15)

A wrapper to Object.entries with a better typing inference

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`T`

#### Returns

`NonNullable`\<\{ \[K in string \| number \| symbol\]: \[K, T\[K\]\] \}\[keyof `T`\]\>[]

***

### typedObjectKeys()

```ts
function typedObjectKeys<T>(obj): keyof T[];
```

Defined in: [packages/utils/src/typingFnUtils.ts:42](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L42)

A wrapper to Object.keys with a better typing inference

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`T`

#### Returns

keyof `T`[]

***

### typeOnRightExtendsLeftType()

```ts
function typeOnRightExtendsLeftType<BaseType, SubType>(): unknown;
```

Defined in: [packages/utils/src/typingFnUtils.ts:87](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L87)

Type helper to check if a type is a subtype of another type.

#### Type Parameters

##### BaseType

`BaseType`

The base type to check against

##### SubType

`SubType`

The type that should extend BaseType

#### Returns

`unknown`

Returns undefined, only used for type checking

***

### unionsAreTheSame()

```ts
function unionsAreTheSame<T, U>(_diff): void;
```

Defined in: [packages/utils/src/typingFnUtils.ts:126](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L126)

Type helper to compare two union types and determine their relationship.

#### Type Parameters

##### T

`T`

The first union type (left side)

##### U

`U`

The second union type (right side)

#### Parameters

##### \_diff

[`UnionDiff`](-internal-.md#uniondiff)\<`T`, `U`\>

Null if unions are identical, or an object describing the
  errors

#### Returns

`void`
