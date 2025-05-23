[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / assertions

# assertions

## Modules

- [\<internal\>](-internal-.md)

## Functions

### assertIsNotNullish()

```ts
function assertIsNotNullish<T>(value, errorMsg): asserts value is StrictNonNullable<T, never>;
```

Defined in: [src/assertions.ts:36](https://github.com/lucasols/utils/blob/main/src/assertions.ts#L36)

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`T`

##### errorMsg

`string` = `nullishErrMsg`

#### Returns

`asserts value is StrictNonNullable<T, never>`

***

### assertIsNotUndefined()

```ts
function assertIsNotUndefined<T>(value, errorMsg): asserts value is StrictNonUndefined<T, never>;
```

Defined in: [src/assertions.ts:45](https://github.com/lucasols/utils/blob/main/src/assertions.ts#L45)

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`T`

##### errorMsg

`string` = `undefErrMsg`

#### Returns

`asserts value is StrictNonUndefined<T, never>`

***

### exhaustiveCheck()

```ts
function exhaustiveCheck<Except>(narrowedType): Error;
```

Defined in: [src/assertions.ts:65](https://github.com/lucasols/utils/blob/main/src/assertions.ts#L65)

ensures all type possibilities are being handled

#### Type Parameters

##### Except

`Except` = `never`

#### Parameters

##### narrowedType

`NoInfer`\<`Except`\>

#### Returns

`Error`

***

### invariant()

```ts
function invariant(condition, errorMsg): asserts condition;
```

Defined in: [src/assertions.ts:55](https://github.com/lucasols/utils/blob/main/src/assertions.ts#L55)

Use this function to assert that a certain condition is always true.

#### Parameters

##### condition

`any`

##### errorMsg

`string` = `'Invariant violation'`

#### Returns

`asserts condition`

***

### isFunction()

```ts
function isFunction(value): value is (args: any[]) => any;
```

Defined in: [src/assertions.ts:76](https://github.com/lucasols/utils/blob/main/src/assertions.ts#L76)

#### Parameters

##### value

`unknown`

#### Returns

`value is (args: any[]) => any`

***

### isObject()

```ts
function isObject(value): value is Record<string, unknown>;
```

Defined in: [src/assertions.ts:72](https://github.com/lucasols/utils/blob/main/src/assertions.ts#L72)

#### Parameters

##### value

`unknown`

#### Returns

`value is Record<string, unknown>`

***

### isPlainObject()

```ts
function isPlainObject(value): value is Record<string, unknown>;
```

Defined in: [src/assertions.ts:84](https://github.com/lucasols/utils/blob/main/src/assertions.ts#L84)

#### Parameters

##### value

`any`

#### Returns

`value is Record<string, unknown>`

***

### isPromise()

```ts
function isPromise(value): value is Promise<unknown>;
```

Defined in: [src/assertions.ts:80](https://github.com/lucasols/utils/blob/main/src/assertions.ts#L80)

#### Parameters

##### value

`unknown`

#### Returns

`value is Promise<unknown>`

***

### notNullish()

```ts
function notNullish<T>(value, errorMsg): StrictNonNullable<T>;
```

Defined in: [src/assertions.ts:25](https://github.com/lucasols/utils/blob/main/src/assertions.ts#L25)

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`T`

##### errorMsg

`string` = `nullishErrMsg`

#### Returns

[`StrictNonNullable`](-internal-.md#strictnonnullable)\<`T`\>

***

### notUndefined()

```ts
function notUndefined<T>(value, errorMsg): StrictNonUndefined<T>;
```

Defined in: [src/assertions.ts:9](https://github.com/lucasols/utils/blob/main/src/assertions.ts#L9)

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`T`

##### errorMsg

`string` = `undefErrMsg`

#### Returns

[`StrictNonUndefined`](-internal-.md#strictnonundefined)\<`T`\>
