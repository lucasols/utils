[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / [concurrentCalls](README.md) / \<internal\>

# \<internal\>

## Classes

### ConcurrentCalls\<R, E\>

Defined in: [packages/utils/src/concurrentCalls.ts:31](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L31)

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

Defined in: [packages/utils/src/concurrentCalls.ts:35](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L35)

###### Parameters

###### calls

...[`Action`](#action)\<`R`, `E`\>[]

###### Returns

`this`

##### resultifyAdd()

```ts
resultifyAdd(...calls): this;
```

Defined in: [packages/utils/src/concurrentCalls.ts:41](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L41)

###### Parameters

###### calls

...(() => `R` \| () => `Promise`\<`R`\>)[]

###### Returns

`this`

##### runAll()

```ts
runAll(__namedParameters): Promise<Result<R[], E>>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:58](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L58)

###### Parameters

###### \_\_namedParameters

[`RunProps`](#runprops) = `{}`

###### Returns

`Promise`\<`Result`\<`R`[], `E`\>\>

##### runAllSettled()

```ts
runAllSettled(__namedParameters): Promise<{
  aggregatedError: null | AggregateError;
  allFailed: boolean;
  failures: E[];
  succeeded: R[];
  total: number;
}>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:90](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L90)

###### Parameters

###### \_\_namedParameters

[`RunProps`](#runprops) = `{}`

###### Returns

`Promise`\<\{
  `aggregatedError`: `null` \| `AggregateError`;
  `allFailed`: `boolean`;
  `failures`: `E`[];
  `succeeded`: `R`[];
  `total`: `number`;
\}\>

***

### ConcurrentCallsWithMetadata\<M, R, E\>

Defined in: [packages/utils/src/concurrentCalls.ts:157](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L157)

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

Defined in: [packages/utils/src/concurrentCalls.ts:165](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L165)

###### Parameters

###### calls

...`object`[]

###### Returns

`this`

##### resultifyAdd()

```ts
resultifyAdd(...items): this;
```

Defined in: [packages/utils/src/concurrentCalls.ts:179](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L179)

###### Parameters

###### items

...`object`[]

###### Returns

`this`

##### runAll()

```ts
runAll(__namedParameters): Promise<Result<SucceededCall<R, M>[], FailedCall<M, E>>>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:199](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L199)

###### Parameters

###### \_\_namedParameters

[`RunProps`](#runprops) = `{}`

###### Returns

`Promise`\<`Result`\<[`SucceededCall`](#succeededcall)\<`R`, `M`\>[], [`FailedCall`](#failedcall)\<`M`, `E`\>\>\>

##### runAllSettled()

```ts
runAllSettled(__namedParameters): Promise<{
  aggregatedError: null | AggregateError;
  allFailed: boolean;
  failed: FailedCall<M, E>[];
  failures: FailedCall<M, E>[];
  results: SettledResultWithMetadata<R, M, E>[];
  succeeded: SucceededCall<R, M>[];
  total: number;
}>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:246](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L246)

###### Parameters

###### \_\_namedParameters

[`RunProps`](#runprops) = `{}`

###### Returns

`Promise`\<\{
  `aggregatedError`: `null` \| `AggregateError`;
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

Defined in: [packages/utils/src/concurrentCalls.ts:24](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L24)

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

Defined in: [packages/utils/src/concurrentCalls.ts:19](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L19)

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

Defined in: [packages/utils/src/concurrentCalls.ts:21](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L21)

##### metadata

```ts
metadata: M;
```

Defined in: [packages/utils/src/concurrentCalls.ts:20](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L20)

***

### RunProps

```ts
type RunProps = object;
```

Defined in: [packages/utils/src/concurrentCalls.ts:10](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L10)

#### Properties

##### delayStart()?

```ts
optional delayStart: (index) => number;
```

Defined in: [packages/utils/src/concurrentCalls.ts:11](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L11)

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

Defined in: [packages/utils/src/concurrentCalls.ts:27](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L27)

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

Defined in: [packages/utils/src/concurrentCalls.ts:15](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L15)

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

Defined in: [packages/utils/src/concurrentCalls.ts:17](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L17)

##### value

```ts
value: R;
```

Defined in: [packages/utils/src/concurrentCalls.ts:16](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L16)

***

### ValidMetadata

```ts
type ValidMetadata = string | number | boolean | Record<string, unknown>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:8](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L8)
