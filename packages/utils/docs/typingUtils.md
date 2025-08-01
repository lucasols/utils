[**@ls-stack/utils**](README.md)

---

[@ls-stack/utils](modules.md) / typingUtils

# typingUtils

## Type Aliases

### DeepPrettify\<T\>

```ts
type DeepPrettify<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown> ? DeepPrettify<T[K]>
  : T[K];
} & object;
```

Defined in: [packages/utils/src/typingUtils.ts:25](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingUtils.ts#L25)

#### Type Parameters

##### T

`T`

---

### IsAny\<T\>

```ts
type IsAny<T> =
  unknown extends T ?
    [keyof T] extends [never] ?
      false
    : true
  : false;
```

Defined in: [packages/utils/src/typingUtils.ts:14](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingUtils.ts#L14)

#### Type Parameters

##### T

`T`

---

### NonPartial\<T\>

```ts
type NonPartial<T> = { [K in keyof Required<T>]: T[K] };
```

Defined in: [packages/utils/src/typingUtils.ts:5](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingUtils.ts#L5)

#### Type Parameters

##### T

`T`

---

### ObjKeysWithValuesOfType\<Obj, ValueType\>

```ts
type ObjKeysWithValuesOfType<Obj, ValueType> = {
  [K in keyof Obj]: Obj[K] extends ValueType ? K : never;
}[keyof Obj];
```

Defined in: [packages/utils/src/typingUtils.ts:7](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingUtils.ts#L7)

#### Type Parameters

##### Obj

`Obj` _extends_ `Record`\<`PropertyKey`, `unknown`\>

##### ValueType

`ValueType`

---

### PartialRecord\<K, T\>

```ts
type PartialRecord<K, T> = { [P in K]?: T };
```

Defined in: [packages/utils/src/typingUtils.ts:1](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingUtils.ts#L1)

#### Type Parameters

##### K

`K` _extends_ keyof `any`

##### T

`T`

---

### Prettify\<T\>

```ts
type Prettify<T> = { [P in keyof T]: T[P] } & object;
```

Defined in: [packages/utils/src/typingUtils.ts:21](https://github.com/lucasols/utils/blob/main/packages/utils/src/typingUtils.ts#L21)

#### Type Parameters

##### T

`T` _extends_ `Record`\<`string`, `unknown`\>
