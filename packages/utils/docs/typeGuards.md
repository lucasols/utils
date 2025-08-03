[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / typeGuards

# typeGuards

## Type Aliases

### NonEmptyArray\<T\>

```ts
type NonEmptyArray<T> = [T, ...T[]];
```

Defined in: [packages/utils/src/typeGuards.ts:128](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeGuards.ts#L128)

#### Type Parameters

##### T

`T`

## Functions

### arrayHasAtLeastXItems()

#### Call Signature

```ts
function arrayHasAtLeastXItems<T>(array, minLength): array is [T, ...T[]];
```

Defined in: [packages/utils/src/typeGuards.ts:136](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeGuards.ts#L136)

##### Type Parameters

###### T

`T`

##### Parameters

###### array

`T`[]

###### minLength

`1`

##### Returns

`array is [T, ...T[]]`

#### Call Signature

```ts
function arrayHasAtLeastXItems<T>(array, minLength): array is [T, T, ...T[]];
```

Defined in: [packages/utils/src/typeGuards.ts:140](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeGuards.ts#L140)

##### Type Parameters

###### T

`T`

##### Parameters

###### array

`T`[]

###### minLength

`2`

##### Returns

`array is [T, T, ...T[]]`

#### Call Signature

```ts
function arrayHasAtLeastXItems<T>(array, minLength): array is [T, T, T, ...T[]];
```

Defined in: [packages/utils/src/typeGuards.ts:144](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeGuards.ts#L144)

##### Type Parameters

###### T

`T`

##### Parameters

###### array

`T`[]

###### minLength

`3`

##### Returns

`array is [T, T, T, ...T[]]`

#### Call Signature

```ts
function arrayHasAtLeastXItems<T>(array, minLength): array is [T, T, T, T, ...T[]];
```

Defined in: [packages/utils/src/typeGuards.ts:148](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeGuards.ts#L148)

##### Type Parameters

###### T

`T`

##### Parameters

###### array

`T`[]

###### minLength

`4`

##### Returns

`array is [T, T, T, T, ...T[]]`

#### Call Signature

```ts
function arrayHasAtLeastXItems<T>(array, minLength): array is [T, T, T, T, T, ...T[]];
```

Defined in: [packages/utils/src/typeGuards.ts:152](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeGuards.ts#L152)

##### Type Parameters

###### T

`T`

##### Parameters

###### array

`T`[]

###### minLength

`5`

##### Returns

`array is [T, T, T, T, T, ...T[]]`

***

### isFunction()

```ts
function isFunction(value): value is (args: any[]) => any;
```

Defined in: [packages/utils/src/typeGuards.ts:51](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeGuards.ts#L51)

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

isFunction(() => {});           // true
isFunction(function() {});      // true
isFunction(Math.max);           // true
isFunction('string');           // false
isFunction({});                 // false
```

***

### isNonEmptyArray()

```ts
function isNonEmptyArray<T>(value): value is NonEmptyArray<T>;
```

Defined in: [packages/utils/src/typeGuards.ts:130](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeGuards.ts#L130)

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`T`[] | readonly `T`[]

#### Returns

`value is NonEmptyArray<T>`

***

### isObject()

```ts
function isObject(value): value is Record<string, unknown>;
```

Defined in: [packages/utils/src/typeGuards.ts:24](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeGuards.ts#L24)

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

isObject({});           // true
isObject({ a: 1 });     // true
isObject(null);         // false
isObject([]);           // false
isObject('string');     // false
```

***

### isPlainObject()

```ts
function isPlainObject(value): value is Record<string, unknown>;
```

Defined in: [packages/utils/src/typeGuards.ts:109](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeGuards.ts#L109)

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

isPlainObject({});                    // true
isPlainObject({ a: 1 });              // true
isPlainObject(Object.create(null));   // true
isPlainObject(new Date());            // false
isPlainObject(/regex/);               // false
isPlainObject(new MyClass());         // false
isPlainObject([]);                    // false
```

***

### isPromise()

```ts
function isPromise(value): value is Promise<unknown>;
```

Defined in: [packages/utils/src/typeGuards.ts:79](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeGuards.ts#L79)

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

isPromise(Promise.resolve());           // true
isPromise(new Promise(() => {}));       // true
isPromise({ then: () => {} });          // true
isPromise({ then: 'not a function' });  // false
isPromise('string');                    // false
```

***

### isTruthy()

```ts
function isTruthy<T>(value): value is Exclude<T, undefined | null | false | "" | 0 | 0n>;
```

Defined in: [packages/utils/src/typeGuards.ts:163](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeGuards.ts#L163)

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`T`

#### Returns

value is Exclude\<T, undefined \| null \| false \| "" \| 0 \| 0n\>
