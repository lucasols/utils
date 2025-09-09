[@ls-stack/utils](../modules.md) / typingFnUtils

# typingFnUtils

## Modules

- [\<internal\>](-internal-.md)

## Variables

### ~~isSubTypeOf()~~

```ts
const isSubTypeOf: <BaseType, SubType>() => unknown = typeOnRightExtendsLeftType;
```

Defined in: [packages/utils/src/typingFnUtils.ts:83](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L83)

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

Defined in: [packages/utils/src/typingFnUtils.ts:116](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L116)

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

Defined in: [packages/utils/src/typingFnUtils.ts:41](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L41)

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

### isObjKey()

```ts
function isObjKey<T>(key, obj): key is keyof T;
```

Defined in: [packages/utils/src/typingFnUtils.ts:91](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L91)

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

Defined in: [packages/utils/src/typingFnUtils.ts:51](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L51)

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

Defined in: [packages/utils/src/typingFnUtils.ts:30](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L30)

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

Defined in: [packages/utils/src/typingFnUtils.ts:75](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L75)

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

Defined in: [packages/utils/src/typingFnUtils.ts:114](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingFnUtils.ts#L114)

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
