[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / testUtils

# testUtils

## Functions

### compactSnapshot()

```ts
function compactSnapshot(value, options): string;
```

Defined in: [packages/utils/src/testUtils.ts:352](https://github.com/lucasols/utils/blob/main/packages/utils/src/testUtils.ts#L352)

Produces a more compact and readable snapshot of a value using yaml.
By default booleans are shown as `✅` and `❌`, use `showBooleansAs` to disable/configure this.

Filtering patterns in `rejectKeys` and `filterKeys`:
- `'prop'` - Only root-level properties named 'prop'
- `'**prop'` - Any property named exactly 'prop' at any level (root or nested)
- `'*.prop'` - Any nested property named 'prop' at second level (excludes root-level matches)
- `'test.*.prop'` - Any property named 'prop' at second level of 'test'
- `'test.*.test.**prop'` - Any property named 'prop' inside of 'test.*.test'
- `'prop.nested'` - Exact nested property paths like `obj.prop.nested`
- `'prop.**nested'` - All nested properties inside root `prop` with name `nested`
- `'prop[0]'` - The first item of the `prop` array
- `'prop[*]'` - All items of the `prop` array
- `'prop[0].nested'` - `nested` prop of the first item of the `prop` array
- `'prop[*].nested'` - `nested` prop of all items of the `prop` array
- `'prop[*]**nested'` - all `nested` props of all items of the `prop` array
- `'prop[0-2]'` - The first three items of the `prop` array
- `'prop[4-*]'` - All items of the `prop` array from the fourth index to the end
- `'prop[0-2].nested.**prop'` - Combining multiple nested patterns is supported
- Root array:
  - `'[0]'` - The first item of the root array
  - `'[*]'` - All items of the array
  - `'[0].nested'` - `nested` prop of the first item of the array
  - `'[*].nested'` - `nested` prop of all items of the array
  - `'[*]**nested'` - all `nested` props of all items of the array
  - `'[0-2]'` - The first three items of the array
  - `'[4-*]'` - All items of the array from the fourth index to the end

#### Parameters

##### value

`unknown`

The value to snapshot.

##### options

[`YamlStringifyOptions`](yamlStringify.md#yamlstringifyoptions) & `object` = `{}`

The options for the snapshot.

#### Returns

`string`

The compact snapshot of the value.

***

### createLoggerStore()

```ts
function createLoggerStore(__namedParameters): object;
```

Defined in: [packages/utils/src/testUtils.ts:11](https://github.com/lucasols/utils/blob/main/packages/utils/src/testUtils.ts#L11)

#### Parameters

##### \_\_namedParameters

###### arrays?

  \| `"length"`
  \| `"all"`
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

  \| `"length"`
  \| `"all"`
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

Defined in: [packages/utils/src/testUtils.ts:277](https://github.com/lucasols/utils/blob/main/packages/utils/src/testUtils.ts#L277)

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

***

### waitController()

```ts
function waitController(): object;
```

Defined in: [packages/utils/src/testUtils.ts:292](https://github.com/lucasols/utils/blob/main/packages/utils/src/testUtils.ts#L292)

#### Returns

`object`

##### stopWaiting()

```ts
stopWaiting: () => void;
```

###### Returns

`void`

##### stopWaitingAfter()

```ts
stopWaitingAfter: (ms) => void;
```

###### Parameters

###### ms

`number`

###### Returns

`void`

##### wait

```ts
wait: Promise<void>;
```
