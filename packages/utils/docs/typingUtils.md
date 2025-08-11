[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / typingUtils

# typingUtils

## Type Aliases

### ~~DeepPrettify\<T\>~~

```ts
type DeepPrettify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepPrettify<T[K]> : T[K] } & object;
```

Defined in: [packages/utils/src/typingUtils.ts:31](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingUtils.ts#L31)

#### Type Parameters

##### T

`T`

#### Deprecated

Use `DeepPrettify` from `@ls-stack/utils/typeUtils` instead

***

### ~~IsAny\<T\>~~

```ts
type IsAny<T> = unknown extends T ? [keyof T] extends [never] ? false : true : false;
```

Defined in: [packages/utils/src/typingUtils.ts:18](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingUtils.ts#L18)

#### Type Parameters

##### T

`T`

#### Deprecated

Use `IsAny` from `@ls-stack/utils/typeUtils` instead

***

### ~~NonPartial\<T\>~~

```ts
type NonPartial<T> = { [K in keyof Required<T>]: T[K] };
```

Defined in: [packages/utils/src/typingUtils.ts:7](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingUtils.ts#L7)

#### Type Parameters

##### T

`T`

#### Deprecated

Use `NonPartial` from `@ls-stack/utils/typeUtils` instead

***

### ~~ObjKeysWithValuesOfType\<Obj, ValueType\>~~

```ts
type ObjKeysWithValuesOfType<Obj, ValueType> = { [K in keyof Obj]: Obj[K] extends ValueType ? K : never }[keyof Obj];
```

Defined in: [packages/utils/src/typingUtils.ts:10](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingUtils.ts#L10)

#### Type Parameters

##### Obj

`Obj` *extends* `Record`\<`PropertyKey`, `unknown`\>

##### ValueType

`ValueType`

#### Deprecated

Use `ObjKeysWithValuesOfType` from `@ls-stack/utils/typeUtils` instead

***

### ~~PartialRecord\<K, T\>~~

```ts
type PartialRecord<K, T> = { [P in K]?: T };
```

Defined in: [packages/utils/src/typingUtils.ts:2](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingUtils.ts#L2)

#### Type Parameters

##### K

`K` *extends* keyof `any`

##### T

`T`

#### Deprecated

Use `PartialRecord` from `@ls-stack/utils/typeUtils` instead

***

### ~~Prettify\<T\>~~

```ts
type Prettify<T> = { [P in keyof T]: T[P] } & object;
```

Defined in: [packages/utils/src/typingUtils.ts:26](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingUtils.ts#L26)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Deprecated

Use `DeepPrettify` from `@ls-stack/utils/typeUtils` instead
