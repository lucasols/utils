[@ls-stack/utils](modules.md) / debounce

# debounce

## Interfaces

### DebouncedFunc()\<T\>

Defined in: [packages/utils/src/debounce.ts:10](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L10)

#### Type Parameters

##### T

`T` *extends* (...`args`) => `void`

```ts
DebouncedFunc(...args): undefined | ReturnType<T>;
```

Defined in: [packages/utils/src/debounce.ts:20](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L20)

Call the original function, but applying the debounce rules.

If the debounced function can be run immediately, this calls it and returns
its return value.

Otherwise, it returns the return value of the last invocation, or undefined
if the debounced function was not invoked yet.

#### Parameters

##### args

...`Parameters`\<`T`\>

#### Returns

`undefined` \| `ReturnType`\<`T`\>

#### Properties

##### cancel()

```ts
cancel: () => void;
```

Defined in: [packages/utils/src/debounce.ts:23](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L23)

Throw away any pending invocation of the debounced function.

###### Returns

`void`

##### flush()

```ts
flush: () => undefined | ReturnType<T>;
```

Defined in: [packages/utils/src/debounce.ts:32](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L32)

If there is a pending invocation of the debounced function, invoke it
immediately and return its return value.

Otherwise, return the value from the last invocation, or undefined if the
debounced function was never invoked.

###### Returns

`undefined` \| `ReturnType`\<`T`\>

##### pending()

```ts
pending: () => boolean;
```

Defined in: [packages/utils/src/debounce.ts:35](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L35)

Return true if the debounced function still has a scheduled run.

###### Returns

`boolean`

##### updateCb()

```ts
updateCb: (callback) => void;
```

Defined in: [packages/utils/src/debounce.ts:38](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L38)

Update the debounced function with a new callback.

###### Parameters

###### callback

`T`

###### Returns

`void`

##### updateParams()

```ts
updateParams: (wait, options?) => void;
```

Defined in: [packages/utils/src/debounce.ts:41](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L41)

Update the debounce wait and options while keeping scheduled runs.

###### Parameters

###### wait

`number`

###### options?

[`DebounceOptions`](#debounceoptions)

###### Returns

`void`

## Type Aliases

### DebounceOptions

```ts
type DebounceOptions = object;
```

Defined in: [packages/utils/src/debounce.ts:1](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L1)

#### Properties

##### leading?

```ts
optional leading: boolean;
```

Defined in: [packages/utils/src/debounce.ts:3](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L3)

Invoke on the leading edge of the timeout. Defaults to `false`.

##### maxWait?

```ts
optional maxWait: number;
```

Defined in: [packages/utils/src/debounce.ts:5](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L5)

Maximum time the function can be delayed before it's forced to invoke (in ms).

##### trailing?

```ts
optional trailing: boolean;
```

Defined in: [packages/utils/src/debounce.ts:7](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L7)

Invoke on the trailing edge of the timeout. Defaults to `true`.

## Functions

### debounce()

```ts
function debounce<T>(
   func, 
   wait, 
options?): DebouncedFunc<T>;
```

Defined in: [packages/utils/src/debounce.ts:45](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L45)

#### Type Parameters

##### T

`T` *extends* (...`args`) => `void`

#### Parameters

##### func

`T`

##### wait

`number`

##### options?

[`DebounceOptions`](#debounceoptions)

#### Returns

[`DebouncedFunc`](#debouncedfunc)\<`T`\>

***

### isDebouncedFn()

```ts
function isDebouncedFn<T>(fn): fn is T & { cancel: () => void; flush: () => undefined | ReturnType<T>; pending: () => boolean; updateCb: (callback: T) => void; updateParams: (wait: number, options?: DebounceOptions) => void };
```

Defined in: [packages/utils/src/debounce.ts:215](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L215)

#### Type Parameters

##### T

`T` *extends* (...`args`) => `void`

#### Parameters

##### fn

`T`

#### Returns

fn is T & \{ cancel: () =\> void; flush: () =\> undefined \| ReturnType\<T\>; pending: () =\> boolean; updateCb: (callback: T) =\> void; updateParams: (wait: number, options?: DebounceOptions) =\> void \}
