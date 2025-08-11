[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / [concurrentCalls](README.md) / \<internal\>

# \<internal\>

## Classes

### ConcurrentCalls\<R, E\>

Defined in: [packages/utils/src/concurrentCalls.ts:124](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L124)

#### Type Parameters

##### R

`R` = `unknown`

##### E

`E` *extends* `Error` = `Error`

#### Constructors

##### Constructor

```ts
new ConcurrentCalls<R, E>(): ConcurrentCalls<R, E>;
```

###### Returns

[`ConcurrentCalls`](#concurrentcalls)\<`R`, `E`\>

#### Methods

##### add()

```ts
add(...calls): this;
```

Defined in: [packages/utils/src/concurrentCalls.ts:128](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L128)

###### Parameters

###### calls

...[`Action`](#action)\<`R`, `E`\>[]

###### Returns

`this`

##### resultifyAdd()

```ts
resultifyAdd(...calls): this;
```

Defined in: [packages/utils/src/concurrentCalls.ts:134](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L134)

###### Parameters

###### calls

...(() => `R` \| () => `Promise`\<`R`\>)[]

###### Returns

`this`

##### runAll()

```ts
runAll(__namedParameters): Promise<Result<R[], E>>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:151](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L151)

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

Defined in: [packages/utils/src/concurrentCalls.ts:183](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L183)

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

Defined in: [packages/utils/src/concurrentCalls.ts:250](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L250)

#### Type Parameters

##### M

`M` *extends* [`ValidMetadata`](#validmetadata)

##### R

`R` = `unknown`

##### E

`E` *extends* `Error` = `Error`

#### Constructors

##### Constructor

```ts
new ConcurrentCallsWithMetadata<M, R, E>(): ConcurrentCallsWithMetadata<M, R, E>;
```

###### Returns

[`ConcurrentCallsWithMetadata`](#concurrentcallswithmetadata)\<`M`, `R`, `E`\>

#### Methods

##### add()

```ts
add(...calls): this;
```

Defined in: [packages/utils/src/concurrentCalls.ts:258](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L258)

###### Parameters

###### calls

...`object`[]

###### Returns

`this`

##### resultifyAdd()

```ts
resultifyAdd(...items): this;
```

Defined in: [packages/utils/src/concurrentCalls.ts:272](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L272)

###### Parameters

###### items

...`object`[]

###### Returns

`this`

##### runAll()

```ts
runAll(__namedParameters): Promise<Result<SucceededCall<R, M>[], FailedCall<M, E>>>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:292](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L292)

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

Defined in: [packages/utils/src/concurrentCalls.ts:339](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L339)

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

Defined in: [packages/utils/src/concurrentCalls.ts:117](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L117)

#### Type Parameters

##### R

`R`

##### E

`E` *extends* `Error`

#### Returns

`Promise`\<`Result`\<`R`, `E`\>\>

***

### FailedCall\<M, E\>

```ts
type FailedCall<M, E> = object;
```

Defined in: [packages/utils/src/concurrentCalls.ts:112](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L112)

#### Type Parameters

##### M

`M`

##### E

`E` *extends* `Error` = `Error`

#### Properties

##### error

```ts
error: E;
```

Defined in: [packages/utils/src/concurrentCalls.ts:114](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L114)

##### metadata

```ts
metadata: M;
```

Defined in: [packages/utils/src/concurrentCalls.ts:113](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L113)

***

### RunProps

```ts
type RunProps = object;
```

Defined in: [packages/utils/src/concurrentCalls.ts:103](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L103)

#### Properties

##### delayStart()?

```ts
optional delayStart: (index) => number;
```

Defined in: [packages/utils/src/concurrentCalls.ts:104](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L104)

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

Defined in: [packages/utils/src/concurrentCalls.ts:120](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L120)

#### Type Parameters

##### R

`R`

##### M

`M`

##### E

`E` *extends* `Error` = `Error`

***

### SucceededCall\<R, M\>

```ts
type SucceededCall<R, M> = object;
```

Defined in: [packages/utils/src/concurrentCalls.ts:108](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L108)

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

Defined in: [packages/utils/src/concurrentCalls.ts:110](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L110)

##### value

```ts
value: R;
```

Defined in: [packages/utils/src/concurrentCalls.ts:109](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L109)

***

### ValidMetadata

```ts
type ValidMetadata = string | number | boolean | Record<string, unknown>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:101](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L101)
