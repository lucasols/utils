[**@ls-stack/utils**](../README.md)

***

[@ls-stack/utils](../modules.md) / [concurrentCalls](README.md) / \<internal\>

# \<internal\>

## Classes

### ConcurrentCalls\<R, E\>

Defined in: [src/concurrentCalls.ts:32](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L32)

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

Defined in: [src/concurrentCalls.ts:36](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L36)

###### Parameters

###### calls

...[`Action`](#action)\<`R`, `E`\>[]

###### Returns

`this`

##### resultifyAdd()

```ts
resultifyAdd(...calls): this;
```

Defined in: [src/concurrentCalls.ts:42](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L42)

###### Parameters

###### calls

...(`Promise`\<`R`\> \| () => `R` \| () => `Promise`\<`R`\>)[]

###### Returns

`this`

##### runAll()

```ts
runAll(__namedParameters): Promise<Result<R[], E>>;
```

Defined in: [src/concurrentCalls.ts:74](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L74)

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

Defined in: [src/concurrentCalls.ts:112](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L112)

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

Defined in: [src/concurrentCalls.ts:184](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L184)

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

Defined in: [src/concurrentCalls.ts:192](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L192)

###### Parameters

###### calls

...`object`[]

###### Returns

`this`

##### resultifyAdd()

```ts
resultifyAdd(...items): this;
```

Defined in: [src/concurrentCalls.ts:206](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L206)

###### Parameters

###### items

...`object`[]

###### Returns

`this`

##### runAll()

```ts
runAll(__namedParameters): Promise<Result<SucceededCall<R, M>[], FailedCall<M, E>>>;
```

Defined in: [src/concurrentCalls.ts:227](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L227)

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

Defined in: [src/concurrentCalls.ts:274](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L274)

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

### Action\<R, E\>

```ts
type Action<R, E> = 
  | () => Promise<Result<R, E>>
| Promise<Result<R, E>>;
```

Defined in: [src/concurrentCalls.ts:23](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L23)

#### Type Parameters

##### R

`R`

##### E

`E` *extends* `Error`

***

### FailedCall\<M, E\>

```ts
type FailedCall<M, E> = object;
```

Defined in: [src/concurrentCalls.ts:18](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L18)

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

Defined in: [src/concurrentCalls.ts:20](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L20)

##### metadata

```ts
metadata: M;
```

Defined in: [src/concurrentCalls.ts:19](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L19)

***

### RunProps

```ts
type RunProps = object;
```

Defined in: [src/concurrentCalls.ts:9](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L9)

#### Properties

##### delayStart()?

```ts
optional delayStart: (index) => number;
```

Defined in: [src/concurrentCalls.ts:10](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L10)

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

Defined in: [src/concurrentCalls.ts:28](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L28)

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

Defined in: [src/concurrentCalls.ts:14](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L14)

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

Defined in: [src/concurrentCalls.ts:16](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L16)

##### value

```ts
value: R;
```

Defined in: [src/concurrentCalls.ts:15](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L15)

***

### ValidMetadata

```ts
type ValidMetadata = string | number | boolean | Record<string, unknown>;
```

Defined in: [src/concurrentCalls.ts:7](https://github.com/lucasols/utils/blob/main/src/concurrentCalls.ts#L7)
