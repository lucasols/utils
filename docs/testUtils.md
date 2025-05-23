[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / testUtils

# testUtils

## Functions

### createLoggerStore()

```ts
function createLoggerStore(__namedParameters): object;
```

Defined in: [src/testUtils.ts:7](https://github.com/lucasols/utils/blob/main/src/testUtils.ts#L7)

#### Parameters

##### \_\_namedParameters

###### arrays?

  \| `"all"`
  \| `"length"`
  \| `"firstAndLast"`
  \| \{
  `firstNItems`: `number`;
\} = `...`

###### changesOnly?

`boolean` = `false`

###### filterKeys?

`string`[]

###### fromLastSnapshot?

`boolean` = `false`

###### maxLineLengthBeforeSplit?

`number` = `80`

###### rejectKeys?

`string`[]

###### splitLongLines?

`true` = `true`

###### useEmojiForBooleans?

`boolean` = `true`

#### Returns

`object`

##### add()

```ts
add: (render) => void;
```

###### Parameters

###### render

`Record`\<`string`, `unknown`\> | readonly `Record`\<`string`, `unknown`\>[]

###### Returns

`void`

##### addMark()

```ts
addMark: (label) => void;
```

###### Parameters

###### label

`string`

###### Returns

`void`

##### getSnapshot()

```ts
getSnapshot: (__namedParameters) => string;
```

###### Parameters

###### \_\_namedParameters

###### arrays?

  \| `"all"`
  \| `"length"`
  \| `"firstAndLast"`
  \| \{
  `firstNItems`: `number`;
\} = `defaultArrays`

###### changesOnly?

`boolean` = `defaultChangesOnly`

###### filterKeys?

`string`[] = `defaultFilterKeys`

###### fromLastSnapshot?

`boolean` = `defaultFromLastSnapshot`

###### includeLastSnapshotEndMark?

`boolean` = `true`

###### maxLineLengthBeforeSplit?

`number` = `defaultMaxLineLengthBeforeSplit`

###### rejectKeys?

`string`[] = `defaultRejectKeys`

###### splitLongLines?

`boolean` = `defaultSplitLongLines`

###### useEmojiForBooleans?

`boolean` = `defaultUseEmojiForBooleans`

###### Returns

`string`

##### logsCount()

```ts
logsCount: () => number;
```

###### Returns

`number`

##### reset()

```ts
reset: (keepLastRender) => void;
```

###### Parameters

###### keepLastRender

`boolean` = `false`

###### Returns

`void`

##### waitNextLog()

```ts
waitNextLog: (timeout) => Promise<void>;
```

###### Parameters

###### timeout

`number` = `50`

###### Returns

`Promise`\<`void`\>

##### changesSnapshot

###### Get Signature

```ts
get changesSnapshot(): string;
```

###### Returns

`string`

##### rendersTime

###### Get Signature

```ts
get rendersTime(): number[];
```

###### Returns

`number`[]

##### snapshot

###### Get Signature

```ts
get snapshot(): string;
```

###### Returns

`string`

##### snapshotFromLast

###### Get Signature

```ts
get snapshotFromLast(): string;
```

###### Returns

`string`

***

### getResultFn()

```ts
function getResultFn<T>(fnGetter, wrapper?): T;
```

Defined in: [src/testUtils.ts:273](https://github.com/lucasols/utils/blob/main/src/testUtils.ts#L273)

#### Type Parameters

##### T

`T` *extends* (...`args`) => `any`

#### Parameters

##### fnGetter

() => `T`

##### wrapper?

(...`args`) => `any`

#### Returns

`T`
