[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / saferTyping

# saferTyping

## Type Aliases

### \_\_FIX\_THIS\_TYPING\_\_

```ts
type __FIX_THIS_TYPING__ = any;
```

Defined in: [src/saferTyping.ts:48](https://github.com/lucasols/utils/blob/main/src/saferTyping.ts#L48)

***

### \_\_LEGIT\_ANY\_\_

```ts
type __LEGIT_ANY__ = any;
```

Defined in: [src/saferTyping.ts:4](https://github.com/lucasols/utils/blob/main/src/saferTyping.ts#L4)

Use this only when you have 100% of certainty that this will not break the types

***

### \_\_LEGIT\_ANY\_FUNCTION\_\_()

```ts
type __LEGIT_ANY_FUNCTION__ = (...params) => __LEGIT_ANY__;
```

Defined in: [src/saferTyping.ts:8](https://github.com/lucasols/utils/blob/main/src/saferTyping.ts#L8)

#### Parameters

##### params

...`any`

#### Returns

[`__LEGIT_ANY__`](#__legit_any__)

***

### AnyNonPrimitiveValue

```ts
type AnyNonPrimitiveValue = object;
```

Defined in: [src/saferTyping.ts:56](https://github.com/lucasols/utils/blob/main/src/saferTyping.ts#L56)

Any type that is not a primitive (number, string, boolean, null, undefined, symbol, bigint, ...)
Equivalent to `object` type

***

### EmptyObject

```ts
type EmptyObject = Record<string, never>;
```

Defined in: [src/saferTyping.ts:13](https://github.com/lucasols/utils/blob/main/src/saferTyping.ts#L13)

An empty object type, equivalent to `{}` but with safer typing

## Functions

### \_\_FIX\_THIS\_CASTING\_\_()

```ts
function __FIX_THIS_CASTING__<T>(value): T;
```

Defined in: [src/saferTyping.ts:44](https://github.com/lucasols/utils/blob/main/src/saferTyping.ts#L44)

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

Defined in: [src/saferTyping.ts:48](https://github.com/lucasols/utils/blob/main/src/saferTyping.ts#L48)

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

Defined in: [src/saferTyping.ts:20](https://github.com/lucasols/utils/blob/main/src/saferTyping.ts#L20)

Cast a value to `any` type. Use this when you have legit usage of `any` casting.

#### Type Parameters

##### V

`V` = `unknown`

(optional) - When used enforces that the casted value is assignable to the type V, use it for safer casts

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

Defined in: [src/saferTyping.ts:30](https://github.com/lucasols/utils/blob/main/src/saferTyping.ts#L30)

Cast a value to a specific type T. Use this when you have legit usage of type assertion.

#### Type Parameters

##### T

`T`

The type to cast to

##### V

`V` = `unknown`

(optional) - When used enforces that the casted value is assignable to the type V, use it for safer casts

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

Defined in: [src/saferTyping.ts:40](https://github.com/lucasols/utils/blob/main/src/saferTyping.ts#L40)

Refine a value to a specific type T. Use this when you have legit usage of type assertion.

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
