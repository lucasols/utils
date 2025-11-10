[@ls-stack/utils](modules.md) / typingUtils

# typingUtils

## Type Aliases

### AddPrefixToObjKeys\<T, Prefix\>

```ts
type AddPrefixToObjKeys<T, Prefix> = { [K in keyof T & string as `${Prefix}${K}`]: T[K] };
```

Defined in: [packages/utils/src/typingUtils.ts:39](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingUtils.ts#L39)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

##### Prefix

`Prefix` *extends* `string`

***

### AddSuffixToObjKeys\<T, Suffix\>

```ts
type AddSuffixToObjKeys<T, Suffix> = { [K in keyof T & string as `${K}${Suffix}`]: T[K] };
```

Defined in: [packages/utils/src/typingUtils.ts:46](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingUtils.ts#L46)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

##### Suffix

`Suffix` *extends* `string`

***

### ~~DeepPrettify\<T\>~~

```ts
type DeepPrettify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepPrettify<T[K]> : T[K] } & object;
```

Defined in: [packages/utils/src/typingUtils.ts:34](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingUtils.ts#L34)

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

Defined in: [packages/utils/src/typingUtils.ts:21](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingUtils.ts#L21)

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

Defined in: [packages/utils/src/typingUtils.ts:13](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingUtils.ts#L13)

#### Type Parameters

##### Obj

`Obj` *extends* `Record`\<`PropertyKey`, `unknown`\>

##### ValueType

`ValueType`

#### Deprecated

Use `ObjKeysWithValuesOfType` from `@ls-stack/utils/typeUtils`
  instead

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

Defined in: [packages/utils/src/typingUtils.ts:29](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingUtils.ts#L29)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Deprecated

Use `DeepPrettify` from `@ls-stack/utils/typeUtils` instead
