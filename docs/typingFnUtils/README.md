[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / typingFnUtils

# typingFnUtils

## Modules

- [\<internal\>](-internal-.md)

## Variables

### ~~isSubTypeOf()~~

```ts
const isSubTypeOf: <BaseType, SubType>() => unknown = typeOnRightExtendsLeftType;
```

Defined in: [src/typingFnUtils.ts:59](https://github.com/lucasols/utils/blob/main/src/typingFnUtils.ts#L59)

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

use typeOnRightExtendsLeftType instead

## Functions

### asNonPartial()

```ts
function asNonPartial<T>(obj): NonPartial<T>;
```

Defined in: [src/typingFnUtils.ts:3](https://github.com/lucasols/utils/blob/main/src/typingFnUtils.ts#L3)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`T`

#### Returns

[`NonPartial`](../typingUtils.md#nonpartial)\<`T`\>

***

### asType()

```ts
function asType<T>(value): T;
```

Defined in: [src/typingFnUtils.ts:28](https://github.com/lucasols/utils/blob/main/src/typingFnUtils.ts#L28)

a safe way to cast types, use to substitute the `as Type`

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### value

`T`

#### Returns

`T`

***

### isObjKey()

```ts
function isObjKey<T>(key, obj): key is keyof T;
```

Defined in: [src/typingFnUtils.ts:64](https://github.com/lucasols/utils/blob/main/src/typingFnUtils.ts#L64)

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

Defined in: [src/typingFnUtils.ts:33](https://github.com/lucasols/utils/blob/main/src/typingFnUtils.ts#L33)

narrow a string to a union of strings

#### Type Parameters

##### T

`T` *extends* `string`

#### Parameters

##### key

`undefined` | `null` | `string`

##### union

`T`[]

#### Returns

`undefined` \| `T`

***

### typedObjectEntries()

```ts
function typedObjectEntries<T>(obj): NonNullable<{ [K in string | number | symbol]: [K, T[K]] }[keyof T]>[];
```

Defined in: [src/typingFnUtils.ts:10](https://github.com/lucasols/utils/blob/main/src/typingFnUtils.ts#L10)

a wrapper to Object.entries with a better typing inference

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

Defined in: [src/typingFnUtils.ts:21](https://github.com/lucasols/utils/blob/main/src/typingFnUtils.ts#L21)

a wrapper to Object.keys with a better typing inference

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

Defined in: [src/typingFnUtils.ts:51](https://github.com/lucasols/utils/blob/main/src/typingFnUtils.ts#L51)

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

Defined in: [src/typingFnUtils.ts:87](https://github.com/lucasols/utils/blob/main/src/typingFnUtils.ts#L87)

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

null if unions are identical, or an object describing the errors

#### Returns

`void`

void - This function is only used for type checking
