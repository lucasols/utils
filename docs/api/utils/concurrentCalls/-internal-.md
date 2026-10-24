[@ls-stack/utils](../modules.md) / [concurrentCalls](index.md) / \<internal\>

# \<internal\>

## Classes

### ConcurrentCalls\<R, E\>

Defined in: [packages/utils/src/concurrentCalls.ts:134](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L134)

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

Defined in: [packages/utils/src/concurrentCalls.ts:139](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L139)

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

Defined in: [packages/utils/src/concurrentCalls.ts:137](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L137)

#### Methods

##### add()

```ts
add(...calls): this;
```

Defined in: [packages/utils/src/concurrentCalls.ts:143](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L143)

###### Parameters

###### calls

...[`Action`](#action)\<`R`, `E`\>[]

###### Returns

`this`

##### resultifyAdd()

```ts
resultifyAdd(...calls): this;
```

Defined in: [packages/utils/src/concurrentCalls.ts:149](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L149)

###### Parameters

###### calls

...(() => `R` \| () => `Promise`\<`R`\>)[]

###### Returns

`this`

##### runAll()

```ts
runAll(__namedParameters): Promise<Result<R[], E>>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:173](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L173)

###### Parameters

###### \_\_namedParameters

[`RunProps`](#runprops) = `{}`

###### Returns

`Promise`\<`Result`\<`R`[], `E`\>\>

##### runAllSettled()

```ts
runAllSettled(__namedParameters): Promise<{
  aggregatedError:   | ConcurrentCallsAggregateError
     | null;
  allFailed: boolean;
  failures: E[];
  succeeded: R[];
  total: number;
}>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:205](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L205)

###### Parameters

###### \_\_namedParameters

[`RunProps`](#runprops) = `{}`

###### Returns

`Promise`\<\{
  `aggregatedError`:   \| [`ConcurrentCallsAggregateError`](index.md#concurrentcallsaggregateerror)
     \| `null`;
  `allFailed`: `boolean`;
  `failures`: `E`[];
  `succeeded`: `R`[];
  `total`: `number`;
\}\>

***

### ConcurrentCallsWithMetadata\<M, R, E\>

Defined in: [packages/utils/src/concurrentCalls.ts:266](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L266)

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

Defined in: [packages/utils/src/concurrentCalls.ts:275](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L275)

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

Defined in: [packages/utils/src/concurrentCalls.ts:273](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L273)

#### Methods

##### add()

```ts
add(...calls): this;
```

Defined in: [packages/utils/src/concurrentCalls.ts:279](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L279)

###### Parameters

###### calls

...`object`[]

###### Returns

`this`

##### resultifyAdd()

```ts
resultifyAdd(...items): this;
```

Defined in: [packages/utils/src/concurrentCalls.ts:288](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L288)

###### Parameters

###### items

...`object`[]

###### Returns

`this`

##### runAll()

```ts
runAll(__namedParameters): Promise<Result<SucceededCall<R, M>[], FailedCall<M, E>>>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:312](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L312)

###### Parameters

###### \_\_namedParameters

[`RunProps`](#runprops) = `{}`

###### Returns

`Promise`\<`Result`\<[`SucceededCall`](#succeededcall)\<`R`, `M`\>[], [`FailedCall`](#failedcall)\<`M`, `E`\>\>\>

##### runAllSettled()

```ts
runAllSettled(__namedParameters): Promise<{
  aggregatedError:   | ConcurrentCallsWithMetadataAggregateError<M>
     | null;
  allFailed: boolean;
  failed: FailedCall<M, E>[];
  failures: FailedCall<M, E>[];
  results: SettledResultWithMetadata<R, M, E>[];
  succeeded: SucceededCall<R, M>[];
  total: number;
}>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:359](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L359)

###### Parameters

###### \_\_namedParameters

[`RunProps`](#runprops) = `{}`

###### Returns

`Promise`\<\{
  `aggregatedError`:   \| [`ConcurrentCallsWithMetadataAggregateError`](index.md#concurrentcallswithmetadataaggregateerror)\<`M`\>
     \| `null`;
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

Defined in: [packages/utils/src/concurrentCalls.ts:127](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L127)

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

Defined in: [packages/utils/src/concurrentCalls.ts:463](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L463)

#### Type Parameters

##### R

`R`

***

### FailedCall\<M, E\>

```ts
type FailedCall<M, E> = object;
```

Defined in: [packages/utils/src/concurrentCalls.ts:122](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L122)

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

Defined in: [packages/utils/src/concurrentCalls.ts:124](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L124)

##### metadata

```ts
metadata: M;
```

Defined in: [packages/utils/src/concurrentCalls.ts:123](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L123)

***

### RunProps

```ts
type RunProps = object;
```

Defined in: [packages/utils/src/concurrentCalls.ts:118](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L118)

#### Properties

##### delayStart()?

```ts
optional delayStart: (index) => number;
```

Defined in: [packages/utils/src/concurrentCalls.ts:118](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L118)

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

Defined in: [packages/utils/src/concurrentCalls.ts:130](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L130)

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

Defined in: [packages/utils/src/concurrentCalls.ts:121](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L121)

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

Defined in: [packages/utils/src/concurrentCalls.ts:121](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L121)

##### value

```ts
value: R;
```

Defined in: [packages/utils/src/concurrentCalls.ts:121](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L121)

***

### ValidMetadata

```ts
type ValidMetadata = string | number | boolean | Record<string, unknown>;
```

Defined in: [packages/utils/src/concurrentCalls.ts:116](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L116)

***

### ValueFromResult\<R\>

```ts
type ValueFromResult<R> = R extends Result<infer T, any> ? T : never;
```

Defined in: [packages/utils/src/concurrentCalls.ts:462](https://github.com/lucasols/utils/blob/main/packages/utils/src/concurrentCalls.ts#L462)

#### Type Parameters

##### R

`R`
