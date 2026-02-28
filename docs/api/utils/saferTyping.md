[@ls-stack/utils](modules.md) / saferTyping

# saferTyping

## Type Aliases

### \_\_FIX\_THIS\_TYPING\_\_

```ts
type __FIX_THIS_TYPING__ = any;
```

Defined in: [packages/utils/src/saferTyping.ts:58](https://github.com/lucasols/utils/blob/main/packages/utils/src/saferTyping.ts#L58)

***

### \_\_LEGIT\_ANY\_\_

```ts
type __LEGIT_ANY__ = any;
```

Defined in: [packages/utils/src/saferTyping.ts:7](https://github.com/lucasols/utils/blob/main/packages/utils/src/saferTyping.ts#L7)

Use this only when you have 100% of certainty that this will not break the
types

***

### \_\_LEGIT\_ANY\_FUNCTION\_\_()

```ts
type __LEGIT_ANY_FUNCTION__ = (...params) => __LEGIT_ANY__;
```

Defined in: [packages/utils/src/saferTyping.ts:11](https://github.com/lucasols/utils/blob/main/packages/utils/src/saferTyping.ts#L11)

#### Parameters

##### params

...`any`

#### Returns

[`__LEGIT_ANY__`](#legit-any)

***

### AnyNonPrimitiveValue

```ts
type AnyNonPrimitiveValue = object;
```

Defined in: [packages/utils/src/saferTyping.ts:66](https://github.com/lucasols/utils/blob/main/packages/utils/src/saferTyping.ts#L66)

Any type that is not a primitive (number, string, boolean, null, undefined,
symbol, bigint, ...) Equivalent to `object` type

***

### EmptyObject

```ts
type EmptyObject = Record<string, never>;
```

Defined in: [packages/utils/src/saferTyping.ts:14](https://github.com/lucasols/utils/blob/main/packages/utils/src/saferTyping.ts#L14)

An empty object type, equivalent to `{}` but with safer typing

## Functions

### \_\_FIX\_THIS\_CASTING\_\_()

```ts
function __FIX_THIS_CASTING__<T>(value): T;
```

Defined in: [packages/utils/src/saferTyping.ts:54](https://github.com/lucasols/utils/blob/main/packages/utils/src/saferTyping.ts#L54)

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`unknown`

#### Returns

`T`

***

### \_\_FIX\_THIS\_TYPING\_\_()

```ts
function __FIX_THIS_TYPING__(value): any;
```

Defined in: [packages/utils/src/saferTyping.ts:58](https://github.com/lucasols/utils/blob/main/packages/utils/src/saferTyping.ts#L58)

#### Parameters

##### value

`unknown`

#### Returns

`any`

***

### \_\_LEGIT\_ANY\_CAST\_\_()

```ts
function __LEGIT_ANY_CAST__<V>(value): any;
```

Defined in: [packages/utils/src/saferTyping.ts:24](https://github.com/lucasols/utils/blob/main/packages/utils/src/saferTyping.ts#L24)

Cast a value to `any` type. Use this when you have legit usage of `any`
casting.

#### Type Parameters

##### V

`V` = `unknown`

(optional) - When used enforces that the casted value is
  assignable to the type V, use it for safer casts

#### Parameters

##### value

`V`

#### Returns

`any`

***

### \_\_LEGIT\_CAST\_\_()

```ts
function __LEGIT_CAST__<T, V>(value): T;
```

Defined in: [packages/utils/src/saferTyping.ts:37](https://github.com/lucasols/utils/blob/main/packages/utils/src/saferTyping.ts#L37)

Cast a value to a specific type T. Use this when you have legit usage of type
assertion.

#### Type Parameters

##### T

`T`

The type to cast to

##### V

`V` = `unknown`

(optional) - When used enforces that the casted value is
  assignable to the type V, use it for safer casts

#### Parameters

##### value

`V`

#### Returns

`T`

***

### \_\_REFINE\_CAST\_\_()

```ts
function __REFINE_CAST__<T>(value): <R>() => R;
```

Defined in: [packages/utils/src/saferTyping.ts:50](https://github.com/lucasols/utils/blob/main/packages/utils/src/saferTyping.ts#L50)

Refine a value to a specific type T. Use this when you have legit usage of
type assertion.

#### Type Parameters

##### T

`T`

The type to cast to

#### Parameters

##### value

`T`

#### Returns

```ts
<R>(): R;
```

##### Type Parameters

###### R

`R`

##### Returns

`R`

***

### \_\_UNSAFE\_TO\_STRING\_\_()

```ts
function __UNSAFE_TO_STRING__(value): string;
```

Defined in: [packages/utils/src/saferTyping.ts:72](https://github.com/lucasols/utils/blob/main/packages/utils/src/saferTyping.ts#L72)

Cast any value to a string. Use this when you have legit usage of string
casting.

#### Parameters

##### value

`unknown`

#### Returns

`string`
