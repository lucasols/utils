[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / typeUtils

# typeUtils

## Modules

- [\<internal\>](-internal-.md)

## Type Aliases

### DeepPrettify\<T\>

```ts
type DeepPrettify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepPrettify<T[K]> : T[K] } & object;
```

Defined in: [packages/utils/src/typeUtils.ts:25](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L25)

#### Type Parameters

##### T

`T`

***

### DeepReplaceValue\<T, ReplaceType, NewType, SkipPaths, SkipTypes\>

```ts
type DeepReplaceValue<T, ReplaceType, NewType, SkipPaths, SkipTypes> = DeepReplaceValueImpl<T, ReplaceType, NewType, SkipPaths, SkipTypes>;
```

Defined in: [packages/utils/src/typeUtils.ts:141](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L141)

Replaces all values that extends `ReplaceType` with `NewType` in a deeply nested object or array.

#### Type Parameters

##### T

`T`

The object or array to replace values in.

##### ReplaceType

`ReplaceType`

The type to replace.

##### NewType

`NewType`

The new type to replace with.

##### SkipPaths

`SkipPaths` *extends* `string` \| `undefined` = `undefined`

The paths to skip in transverse. e.g. 'a.b.c' | 'array[*].b'

##### SkipTypes

`SkipTypes` = [`DefaultSkipTransverseDeepReplace`](#defaultskiptransversedeepreplace)

The types to skip in transverse and replace.

***

### DefaultSkipTransverseDeepReplace

```ts
type DefaultSkipTransverseDeepReplace = 
  | Date
  | RegExp
  | (...args) => any
  | Error
  | Set<any>
  | Map<any, any>
  | WeakSet<any>
| WeakMap<any, any>;
```

Defined in: [packages/utils/src/typeUtils.ts:30](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L30)

***

### IsAny\<T\>

```ts
type IsAny<T> = unknown extends T ? [keyof T] extends [never] ? false : true : false;
```

Defined in: [packages/utils/src/typeUtils.ts:14](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L14)

#### Type Parameters

##### T

`T`

***

### NonPartial\<T\>

```ts
type NonPartial<T> = { [K in keyof Required<T>]: T[K] };
```

Defined in: [packages/utils/src/typeUtils.ts:5](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L5)

#### Type Parameters

##### T

`T`

***

### ObjKeysWithValuesOfType\<Obj, ValueType\>

```ts
type ObjKeysWithValuesOfType<Obj, ValueType> = { [K in keyof Obj]: Obj[K] extends ValueType ? K : never }[keyof Obj];
```

Defined in: [packages/utils/src/typeUtils.ts:7](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L7)

#### Type Parameters

##### Obj

`Obj` *extends* `Record`\<`PropertyKey`, `unknown`\>

##### ValueType

`ValueType`

***

### PartialRecord\<K, T\>

```ts
type PartialRecord<K, T> = { [P in K]?: T };
```

Defined in: [packages/utils/src/typeUtils.ts:1](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L1)

#### Type Parameters

##### K

`K` *extends* keyof `any`

##### T

`T`

***

### Prettify\<T\>

```ts
type Prettify<T> = { [P in keyof T]: T[P] } & object;
```

Defined in: [packages/utils/src/typeUtils.ts:21](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L21)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>
