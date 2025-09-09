[@ls-stack/utils](../modules.md) / typeUtils

# typeUtils

## Modules

- [\<internal\>](-internal-.md)

## Type Aliases

### DeepPrettify\<T\>

```ts
type DeepPrettify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepPrettify<T[K]> : T[K] } & object;
```

Defined in: [packages/utils/src/typeUtils.ts:29](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L29)

#### Type Parameters

##### T

`T`

***

### DeepReplaceValue\<T, ReplaceType, NewType, SkipPaths, SkipTypes\>

```ts
type DeepReplaceValue<T, ReplaceType, NewType, SkipPaths, SkipTypes> = DeepReplaceValueImpl<T, ReplaceType, NewType, SkipPaths, SkipTypes>;
```

Defined in: [packages/utils/src/typeUtils.ts:147](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L147)

Replaces all values that extends `ReplaceType` with `NewType` in a deeply
nested object or array.

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

The paths to skip in transverse. e.g. 'a.b.c' |
  'array[*].b'

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

Defined in: [packages/utils/src/typeUtils.ts:34](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L34)

***

### IsAny\<T\>

```ts
type IsAny<T> = unknown extends T ? [keyof T] extends [never] ? false : true : false;
```

Defined in: [packages/utils/src/typeUtils.ts:18](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L18)

#### Type Parameters

##### T

`T`

***

### MakeUndefinedKeysOptional\<T\>

```ts
type MakeUndefinedKeysOptional<T> = Prettify<Partial<Pick<T, PickUndefinedKeys<T>>> & Pick<T, PickRequiredKeys<T>>>;
```

Defined in: [packages/utils/src/typeUtils.ts:177](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L177)

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

### ~~ObjKeysWithValuesOfType\<Obj, ValueType\>~~

```ts
type ObjKeysWithValuesOfType<Obj, ValueType> = { [K in keyof Obj]: Obj[K] extends ValueType ? K : never }[keyof Obj];
```

Defined in: [packages/utils/src/typeUtils.ts:11](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L11)

#### Type Parameters

##### Obj

`Obj` *extends* `Record`\<`PropertyKey`, `unknown`\>

##### ValueType

`ValueType`

#### Deprecated

Use `ObjKeysWithValuesOfType` from `@ls-stack/utils/typeUtils`
  instead

***

### PartialPossiblyUndefinedValues\<T\>

```ts
type PartialPossiblyUndefinedValues<T> = Prettify<Partial<Pick<T, KeysWithUndefinedValues<T>>> & Omit<T, KeysWithUndefinedValues<T>>>;
```

Defined in: [packages/utils/src/typeUtils.ts:163](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L163)

Marks all possible undefined values as partial at the root level of the
object.

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

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

Defined in: [packages/utils/src/typeUtils.ts:25](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L25)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>
