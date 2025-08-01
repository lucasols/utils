[**@ls-stack/utils**](../README.md)

---

[@ls-stack/utils](../modules.md) / [parallelAsyncCalls](README.md) / \<internal\>

# \<internal\>

## Classes

### ParallelAsyncResultCalls\<M, R\>

Defined in: [packages/utils/src/parallelAsyncCalls.ts:39](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L39)

#### Type Parameters

##### M

`M` _extends_ [`ValidMetadata`](#validmetadata) \| `undefined` = `undefined`

##### R

`R` = `unknown`

#### Constructors

##### Constructor

```ts
new ParallelAsyncResultCalls<M, R>(): ParallelAsyncResultCalls<M, R>;
```

Defined in: [packages/utils/src/parallelAsyncCalls.ts:49](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L49)

###### Returns

[`ParallelAsyncResultCalls`](#parallelasyncresultcalls)\<`M`, `R`\>

#### Properties

##### alreadyRun

```ts
alreadyRun: boolean = false;
```

Defined in: [packages/utils/src/parallelAsyncCalls.ts:47](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L47)

#### Methods

##### add()

```ts
add(call): ParallelAsyncResultCalls<M, R>;
```

Defined in: [packages/utils/src/parallelAsyncCalls.ts:51](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L51)

###### Parameters

###### call

`M` _extends_ `undefined` ? () => `Promise`\<`Result`\<`R`\>\> : `object`

###### Returns

[`ParallelAsyncResultCalls`](#parallelasyncresultcalls)\<`M`, `R`\>

##### addTuple()

```ts
addTuple<T>(...calls): object;
```

Defined in: [packages/utils/src/parallelAsyncCalls.ts:63](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L63)

adds calls return tuples with inferred results

###### Type Parameters

###### T

`T` _extends_ `M` _extends_ `undefined` ? () => `Promise`\<`Result`\<`R`\>\> : `object`[]

###### Parameters

###### calls

...`T`

###### Returns

`object`

###### runAll()

```ts
runAll: (props?) =>
  Promise<
    Result<
      { [I in string | number | symbol]: TupleRunAllSuccess<T[I<I>]> },
      TupleRunAllFailed<T[number]>
    >
  >;
```

###### Parameters

###### props?

[`RunProps`](#runprops)

###### Returns

`Promise`\<`Result`\<\{ \[I in string \| number \| symbol\]: TupleRunAllSuccess\<T\[I\<I\>\]\> \}, [`TupleRunAllFailed`](#tuplerunallfailed)\<`T`\[`number`\]\>\>\>

###### runAllSettled()

```ts
runAllSettled: (props?) =>
  Promise<{
    allFailed: boolean;
    results: { [I in string | number | symbol]: TupleRunAllSettled<T[I<I>]> };
  }>;
```

###### Parameters

###### props?

[`RunProps`](#runprops)

###### Returns

`Promise`\<\{
`allFailed`: `boolean`;
`results`: \{ \[I in string \| number \| symbol\]: TupleRunAllSettled\<T\[I\<I\>\]\> \};
\}\>

##### runAll()

```ts
runAll(__namedParameters): Promise<Result<Succeeded<R, M>[], {
  error: Error;
  metadata: M;
}>>;
```

Defined in: [packages/utils/src/parallelAsyncCalls.ts:151](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L151)

###### Parameters

###### \_\_namedParameters

###### delayStart?

(`index`) => `number`

###### Returns

`Promise`\<`Result`\<[`Succeeded`](#succeeded)\<`R`, `M`\>[], \{
`error`: `Error`;
`metadata`: `M`;
\}\>\>

##### runAllSettled()

```ts
runAllSettled(__namedParameters): Promise<{
  allFailed: boolean;
  failed: Failed<M>[];
  results: (Failed<M> | Succeeded<R, M>)[];
  succeeded: Succeeded<R, M>[];
}>;
```

Defined in: [packages/utils/src/parallelAsyncCalls.ts:96](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L96)

###### Parameters

###### \_\_namedParameters

[`RunProps`](#runprops) = `{}`

###### Returns

`Promise`\<\{
`allFailed`: `boolean`;
`failed`: [`Failed`](#failed)\<`M`\>[];
`results`: ([`Failed`](#failed)\<`M`\> \| [`Succeeded`](#succeeded)\<`R`, `M`\>)[];
`succeeded`: [`Succeeded`](#succeeded)\<`R`, `M`\>[];
\}\>

## Type Aliases

### Failed\<M\>

```ts
type Failed<M> = object;
```

Defined in: [packages/utils/src/parallelAsyncCalls.ts:30](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L30)

#### Type Parameters

##### M

`M`

#### Properties

##### error

```ts
error: Error;
```

Defined in: [packages/utils/src/parallelAsyncCalls.ts:32](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L32)

##### metadata

```ts
metadata: M;
```

Defined in: [packages/utils/src/parallelAsyncCalls.ts:31](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L31)

---

### RunProps

```ts
type RunProps = object;
```

Defined in: [packages/utils/src/parallelAsyncCalls.ts:26](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L26)

#### Properties

##### delayStart()?

```ts
optional delayStart: (index) => number;
```

Defined in: [packages/utils/src/parallelAsyncCalls.ts:27](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L27)

###### Parameters

###### index

`number`

###### Returns

`number`

---

### Succeeded\<R, M\>

```ts
type Succeeded<R, M> = object;
```

Defined in: [packages/utils/src/parallelAsyncCalls.ts:34](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L34)

#### Type Parameters

##### R

`R`

##### M

`M`

#### Properties

##### metadata

```ts
metadata: M;
```

Defined in: [packages/utils/src/parallelAsyncCalls.ts:36](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L36)

##### value

```ts
value: R;
```

Defined in: [packages/utils/src/parallelAsyncCalls.ts:35](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L35)

---

### TupleRunAllFailed\<T\>

```ts
type TupleRunAllFailed<T> =
  T extends () => Promise<Result<any>> ? object
  : T extends object ? object
  : never;
```

Defined in: [packages/utils/src/parallelAsyncCalls.ts:13](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L13)

#### Type Parameters

##### T

`T`

---

### TupleRunAllSettled\<T\>

```ts
type TupleRunAllSettled<T> =
  T extends () => Promise<Result<infer V>> ?
    Succeeded<V, undefined> | Failed<undefined>
  : T extends object ? Succeeded<V, M> | Failed<M>
  : never;
```

Defined in: [packages/utils/src/parallelAsyncCalls.ts:19](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L19)

#### Type Parameters

##### T

`T`

---

### TupleRunAllSuccess\<T\>

```ts
type TupleRunAllSuccess<T> =
  T extends () => Promise<Result<infer V>> ? Succeeded<V, undefined>
  : T extends object ? Succeeded<V, M>
  : never;
```

Defined in: [packages/utils/src/parallelAsyncCalls.ts:7](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L7)

#### Type Parameters

##### T

`T`

---

### ValidMetadata

```ts
type ValidMetadata = string | number | boolean | Record<string, unknown>;
```

Defined in: [packages/utils/src/parallelAsyncCalls.ts:5](https://github.com/lucasols/utils/blob/main/packages/utils/src/parallelAsyncCalls.ts#L5)
