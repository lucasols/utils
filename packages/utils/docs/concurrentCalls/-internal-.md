[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / [concurrentCalls](README.md) / \<internal\>

# \<internal\>

## Classes

### ConcurrentCalls\<R, E\>

Defined in: [packages/utils/src/concurrentCalls.ts:141](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L141)

#### Type Parameters

##### R

`R` = `unknown`

##### E

`E` *extends* `ResultValidErrors` = `Error`

#### Constructors

##### Constructor

```ts
new ConcurrentCalls<R, E>(allowResultify): ConcurrentCalls<R, E>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:146](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L146)

###### Parameters

###### allowResultify

`boolean`

###### Returns

[`ConcurrentCalls`](#concurrentcalls)\<`R`, `E`\>

#### Properties

##### allowResultify

```ts
allowResultify: boolean = true;
```

Defined in: [packages/utils/src/concurrentCalls.ts:144](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L144)

#### Methods

##### add()

```ts
add(...calls): this;
```

Defined in: [packages/utils/src/concurrentCalls.ts:150](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L150)

###### Parameters

###### calls

...[`Action`](#action)\<`R`, `E`\>[]

###### Returns

`this`

##### resultifyAdd()

```ts
resultifyAdd(...calls): this;
```

Defined in: [packages/utils/src/concurrentCalls.ts:156](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L156)

###### Parameters

###### calls

...(() => `R` \| () => `Promise`\<`R`\>)[]

###### Returns

`this`

##### runAll()

```ts
runAll(__namedParameters): Promise<Result<R[], E>>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:179](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L179)

###### Parameters

###### \_\_namedParameters

[`RunProps`](#runprops) = `{}`

###### Returns

`Promise`\<`Result`\<`R`[], `E`\>\>

##### runAllSettled()

```ts
runAllSettled(__namedParameters): Promise<{
  aggregatedError:   | null
     | ConcurrentCallsAggregateError;
  allFailed: boolean;
  failures: E[];
  succeeded: R[];
  total: number;
}>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:211](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L211)

###### Parameters

###### \_\_namedParameters

[`RunProps`](#runprops) = `{}`

###### Returns

`Promise`\<\{
  `aggregatedError`:   \| `null`
     \| [`ConcurrentCallsAggregateError`](README.md#concurrentcallsaggregateerror);
  `allFailed`: `boolean`;
  `failures`: `E`[];
  `succeeded`: `R`[];
  `total`: `number`;
\}\>

***

### ConcurrentCallsWithMetadata\<M, R, E\>

Defined in: [packages/utils/src/concurrentCalls.ts:277](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L277)

#### Type Parameters

##### M

`M` *extends* [`ValidMetadata`](#validmetadata)

##### R

`R` = `unknown`

##### E

`E` *extends* `ResultValidErrors` = `Error`

#### Constructors

##### Constructor

```ts
new ConcurrentCallsWithMetadata<M, R, E>(allowResultify): ConcurrentCallsWithMetadata<M, R, E>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:286](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L286)

###### Parameters

###### allowResultify

`boolean`

###### Returns

[`ConcurrentCallsWithMetadata`](#concurrentcallswithmetadata)\<`M`, `R`, `E`\>

#### Properties

##### allowResultify

```ts
allowResultify: boolean = true;
```

Defined in: [packages/utils/src/concurrentCalls.ts:284](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L284)

#### Methods

##### add()

```ts
add(...calls): this;
```

Defined in: [packages/utils/src/concurrentCalls.ts:290](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L290)

###### Parameters

###### calls

...`object`[]

###### Returns

`this`

##### resultifyAdd()

```ts
resultifyAdd(...items): this;
```

Defined in: [packages/utils/src/concurrentCalls.ts:304](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L304)

###### Parameters

###### items

...`object`[]

###### Returns

`this`

##### runAll()

```ts
runAll(__namedParameters): Promise<Result<SucceededCall<R, M>[], FailedCall<M, E>>>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:330](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L330)

###### Parameters

###### \_\_namedParameters

[`RunProps`](#runprops) = `{}`

###### Returns

`Promise`\<`Result`\<[`SucceededCall`](#succeededcall)\<`R`, `M`\>[], [`FailedCall`](#failedcall)\<`M`, `E`\>\>\>

##### runAllSettled()

```ts
runAllSettled(__namedParameters): Promise<{
  aggregatedError:   | null
     | ConcurrentCallsWithMetadataAggregateError<M>;
  allFailed: boolean;
  failed: FailedCall<M, E>[];
  failures: FailedCall<M, E>[];
  results: SettledResultWithMetadata<R, M, E>[];
  succeeded: SucceededCall<R, M>[];
  total: number;
}>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:377](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L377)

###### Parameters

###### \_\_namedParameters

[`RunProps`](#runprops) = `{}`

###### Returns

`Promise`\<\{
  `aggregatedError`:   \| `null`
     \| [`ConcurrentCallsWithMetadataAggregateError`](README.md#concurrentcallswithmetadataaggregateerror)\<`M`\>;
  `allFailed`: `boolean`;
  `failed`: [`FailedCall`](#failedcall)\<`M`, `E`\>[];
  `failures`: [`FailedCall`](#failedcall)\<`M`, `E`\>[];
  `results`: [`SettledResultWithMetadata`](#settledresultwithmetadata)\<`R`, `M`, `E`\>[];
  `succeeded`: [`SucceededCall`](#succeededcall)\<`R`, `M`\>[];
  `total`: `number`;
\}\>

## Type Aliases

### Action()\<R, E\>

```ts
type Action<R, E> = () => Promise<Result<R, E>>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:134](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L134)

#### Type Parameters

##### R

`R`

##### E

`E` *extends* `ResultValidErrors`

#### Returns

`Promise`\<`Result`\<`R`, `E`\>\>

***

### ErrorFromResult\<R\>

```ts
type ErrorFromResult<R> = R extends Result<any, infer E> ? E : never;
```

Defined in: [packages/utils/src/concurrentCalls.ts:480](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L480)

#### Type Parameters

##### R

`R`

***

### FailedCall\<M, E\>

```ts
type FailedCall<M, E> = object;
```

Defined in: [packages/utils/src/concurrentCalls.ts:129](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L129)

#### Type Parameters

##### M

`M`

##### E

`E` *extends* `ResultValidErrors` = `Error`

#### Properties

##### error

```ts
error: E;
```

Defined in: [packages/utils/src/concurrentCalls.ts:131](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L131)

##### metadata

```ts
metadata: M;
```

Defined in: [packages/utils/src/concurrentCalls.ts:130](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L130)

***

### RunProps

```ts
type RunProps = object;
```

Defined in: [packages/utils/src/concurrentCalls.ts:120](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L120)

#### Properties

##### delayStart()?

```ts
optional delayStart: (index) => number;
```

Defined in: [packages/utils/src/concurrentCalls.ts:121](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L121)

###### Parameters

###### index

`number`

###### Returns

`number`

***

### SettledResultWithMetadata\<R, M, E\>

```ts
type SettledResultWithMetadata<R, M, E> = 
  | {
  error: false;
  metadata: M;
  ok: true;
  value: R;
}
  | {
  error: E;
  metadata: M;
  ok: false;
};
```

Defined in: [packages/utils/src/concurrentCalls.ts:137](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L137)

#### Type Parameters

##### R

`R`

##### M

`M`

##### E

`E` *extends* `ResultValidErrors` = `Error`

***

### SucceededCall\<R, M\>

```ts
type SucceededCall<R, M> = object;
```

Defined in: [packages/utils/src/concurrentCalls.ts:125](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L125)

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

Defined in: [packages/utils/src/concurrentCalls.ts:127](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L127)

##### value

```ts
value: R;
```

Defined in: [packages/utils/src/concurrentCalls.ts:126](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L126)

***

### ValidMetadata

```ts
type ValidMetadata = string | number | boolean | Record<string, unknown>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:118](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L118)

***

### ValueFromResult\<R\>

```ts
type ValueFromResult<R> = R extends Result<infer T, any> ? T : never;
```

Defined in: [packages/utils/src/concurrentCalls.ts:479](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L479)

#### Type Parameters

##### R

`R`
